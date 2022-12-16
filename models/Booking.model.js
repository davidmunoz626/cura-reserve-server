const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
    {

        startDate: {
            type: Date,
            required: true

        },
        endDate: {
            type: Date,
            required: true

        },
        bookedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        bookedProperty: {
            type: Schema.Types.ObjectId,
            ref: 'Property',
            required: true
        },
        bookingAmount: {
            type: Number,
            required: true
        }

    },
    {

        timestamps: true
    }
)



module.exports = model('booking', bookingSchema)