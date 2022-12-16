const router = require("express").Router()
const Property = require('../models/Property.model')
const Booking = require('../models/Booking.model')
const { isAuthenticated } = require('../middleware/jwt.middleware')
router.get("/getAllProperties", (req, res) => {

  Property
    .find()
    .select({ name: 1, image: 1, capacity: 1, price: 1 })
    .then(response => res.json(response))
    .catch(err => next(err))
})

router.get('/hotels', (req, res, next) => {

  Property
    .find({ category: "Hotel" })
    .select({ name: 1, image: 1, capacity: 1, price: 1 })
    .then(response => res.json(response))
    .catch(err => next(err))
})

router.get("/getLocationProperties", (req, res) => {

  const { lat, lng } = req.query

  console.log(req.query)

  Property
    .find(
      {
        location:
        {
          $near:
          {
            $geometry: { type: "Point", coordinates: [lat, lng] },
            $maxDistance: 100000
          }
        }
      }
    )
    .then(response => res.json(response))
    .catch(err => next(err))
})


router.get("/getOneProperty/:property_id", (req, res, next) => {

  const { property_id } = req.params

  Property
    .findById(property_id)
    .then(response => res.json(response))
    .catch(err => next(err))
})

router.post("/saveProperty", isAuthenticated, (req, res, next) => {
  const { _id } = req.payload

  console.log('----------req.payload---------', req.payload)

  const { name,
    capacity,
    lat, lng,
    image,
    description,
    city,
    price,
    category,
    extras: { pool, barbaque, terrace, wifi, airconditioning } } = req.body

  const location = {
    type: 'Point',
    coordinates: [lat, lng]
  }

  Property
    .create({ createdBy: _id, name, capacity, location, image, description, city, price, category, extras: { pool, barbaque, terrace, wifi, airconditioning } })
    .then(response => res.json(response))
    .catch(err => next(err))

})


router.post('/edit/:property_id', (req, res) => {

  const { property_id } = req.params
  const { name, capacity, lat, lng, image, description, city, price, category, extras: { pool, barbaque, terrace, wifi, airconditioning } } = req.body

  const location = {
    type: 'Point',
    coordinates: [lat, lng]
  }

  Property
    .findByIdAndUpdate(property_id,
      {
        name,
        capacity,
        location,
        image,
        description,
        city,
        price,
        category,
        extras: { pool, barbaque, terrace, wifi, airconditioning }
      })
    .then(() => res.sendStatus(200))
    .catch(err => console.log(err))
})

router.post('/delete/:property_id/', (req, res) => {

  const { property_id } = req.params

  Property
    .findByIdAndDelete(property_id)
    .then(response => res.json(response))
    .catch(err => console.log(err))

})


router.get("/filtered/list", (req, res, next) => {

  const { city, capacity, from, to } = req.query

  const arr = [{ city }, { capacity: { $gte: capacity } }]

  console.log(arr)

  const newQuery = arr.filter(elm => {
    return Object.values(elm)[0] !== 'undefined'
  })

  console.log(newQuery)


  Property
    .find({ $and: newQuery })
    .select({ name: 1, image: 1, capacity: 1, price: 1 })
    .then(properties => {
      const bookingsPerProperty = properties.map(elm => Booking.find({ bookedProperty: elm._id }))
      Promise
        .all(bookingsPerProperty)
        .then(bookings => {

          const extendedProperties = properties.map((prop, idx) => {
            return { ...prop._doc, bookings: bookings[idx] }
          })

          const result = extendedProperties.filter(elm => {

            if (elm.bookings.length === 0) {
              return true
            }

            const isAvailable = elm.bookings.every(eachBooking => {

              const bookingFrom = eachBooking.startDate.getTime()
              const bookingTo = eachBooking.endDate.getTime()

              return ((from < bookingFrom && to < bookingFrom) || from > bookingTo)
            })

            return isAvailable
          })

          res.json(result)
        })
    })

    .catch(err => next(err))

})



module.exports = router