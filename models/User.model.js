const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'El nombre de usuario es obligatorio']
    },

    email: {
      type: String,
      unique: true,
      required: [true, 'El email es obligatorio']
    },

    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [3, 'La contraseña debe tener mínimo 3 caracteres']
    },

    profileImg: {
      type: String,
      default: 'https://www.jesusmaestro.escuelateresiana.com/wp-content/uploads/2015/03/user-default.png'
    },

    role: {
      type: String,
      enum: ['USER', 'HOST', 'ADMIN'],
      default: 'USER'
    },

    booking: [{
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    }],
  },

  {
    timestamps: true
  }
)
userSchema.pre('save', function (next) {

  const saltRounds = 10
  const salt = bcrypt.genSaltSync(saltRounds)
  const hashedPassword = bcrypt.hashSync(this.password, salt)
  this.password = hashedPassword

  next()
})
module.exports = model('User', userSchema)