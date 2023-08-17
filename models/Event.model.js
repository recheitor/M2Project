const { Schema, model } = require('mongoose')

const eventSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            default: 'https://i.stack.imgur.com/l60Hf.png'
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
            coordenates: {
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