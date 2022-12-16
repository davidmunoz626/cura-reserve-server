const router = require("express").Router()
const uploader = require('../config/cloudinary.config')


router.post('/image', uploader.array('imageData'), (req, res) => {
  if (!req.files) {
    res.status(500).json({ errorMessage: 'Error caragndo el archivo' })
    return
  }
  const url = req.files.map(elm => elm.path)
  res.json({ cloudinary_urls: url })
})

module.exports = router
