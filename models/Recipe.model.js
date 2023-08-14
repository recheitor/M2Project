const { Schema, model } = require('mongoose')

const recipeSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        ingredients: [{
            ingrName: {
                type: String,
                required: true
            },
            ingrQuantity: {
                type: Number,
                required: true
            },
            ingrMeasureUnit: {
                type: String,
                required: true
            }
        }],
        recipeImg: {
            type: String,
            default: 'https://i.stack.imgur.com/l60Hf.png'
        },
        description: {
            type: String,
            default: 'No existe descripción.'
        },
        author: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
    },
    {
        timestamps: true
    }
)


module.exports = model('Recipe', recipeSchema)