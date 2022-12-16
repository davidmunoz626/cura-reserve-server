const { isAuthenticated } = require('../middleware/jwt.middleware')

module.exports = app => {
  app.use("/api/properties", require("./Properties.routes"))
  app.use("/api/booking", require("./booking.routes"))
  app.use("/api/auth", require("./auth.routes"))
  app.use("/api/upload", require("./upload.routes"))
  // app.use("/api/checkout", require("./payments.routes"))
}
