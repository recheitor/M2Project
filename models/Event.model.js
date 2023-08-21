const { Schema, model } = require('mongoose')

const eventSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            default: 'https://res.cloudinary.com/dbtmrinwa/image/upload/v1692193446/hv81ni4penqfhjdy7pog.png'
        },
        description: {
            type: String,
            default: 'No existe descripción.'
        },
        attender: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        address: {
            type: String
        },
        location: {
            type: {
                type: String,
                default: 'Point'
            },
            coordinates: {
                type: [Number]
            }
        },
        date: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
)

eventSchema.index({ location: '2dsphere' })


module.exports = model('Event', eventSchema)