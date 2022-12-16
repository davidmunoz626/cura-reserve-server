const router = require("express").Router()
const Booking = require('../models/Booking.model')
const { isAuthenticated } = require('../middleware/jwt.middleware')


router.post("/saveBook", isAuthenticated, (req, res, next) => {
    const [reserva] = req.body
    const { startDate, endDate, bookedProperty, bookingAmount } = reserva


    Booking
        .create({ startDate, endDate, bookedBy: req.payload._id, bookedProperty, bookingAmount })
        .then(response => res.json(response))
        .catch(err => next(err))

})

router.post('/delete/:booking_id', (req, res, next) => {

    const { booking_id } = req.params

    Booking
        .findByIdAndDelete(booking_id)
        .then(response => res.json(response))
        .catch(err => next(err))

})

router.get('/:property_id', (req, res, next) => {
    const { property_id } = req.params

    Booking
        .find({ bookedProperty: property_id })
        .then(response => res.json(response))
        .catch(err => next(err))
})

router.get('/my-bookings/:user_id', (req, res, next) => {
    const { user_id } = req.params

    Booking
        .find({ bookedBy: user_id })
        .populate('bookedProperty')
        .then(response => {
            console.log(response)
            res.json(response)
        })
        .catch(err => next(err))
})

router.post('/delete/:booking_id', (req, res) => {

    const { booking_id } = req.params

    Booking
        .findByIdAndDelete(booking_id)
        .then(response => res.json(response))
        .catch(err => console.log(err))

})

module.exports = router
