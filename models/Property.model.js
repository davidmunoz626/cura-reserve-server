const { Schema, model } = require("mongoose");

const propertySchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'El nombre es obligatorio.'],

        },
        capacity: {
            type: Number,
            trim: true,
            required: [true, 'La capacidad es obligatoria.'],
        },
        location: {
            type: {
                type: String,
            },
            coordinates: [Number],
            // required: [true, 'La localizacion es obligatoria.']
        },
        image: {
            type: [String],
            required: [true, 'Las imagenes son obligatoria.'],
        },


        description: {
            type: String,
            required: [true, 'La descripción es obligatoria.'],
            minlength: [50, 'La descripción debe tener min. 50 caracteres.']
        },
        city: {
            type: String,
            required: [true, 'La ciudad son obligatoria.']
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        price: {
            type: Number,
            required: [true, 'El precio es obligatorio.'],
        },
        category: {
            type: String,
            enum: ['House', 'Hotel', 'Villa', 'Capsule-Hotel'],
            default: 'House',
            required: [true, 'La categoria es obligatoria.'],
        },
        extras: {
            pool: {
                type: Boolean
            },
            barbaque: {
                type: Boolean
            },
            terrace: {
                type: Boolean

            },
            wifi: {
                type: Boolean
            },
            airconditioning: {
                type: Boolean
            },
            // required: [true, 'Los extras son obligatorios.'],
        },


    },
    {

        timestamps: true
    }
);


propertySchema.index({ location: '2dsphere' })

module.exports = model('Property', propertySchema)