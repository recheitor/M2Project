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
        nutriScore: {
            ingrKcal: {
                type: Number,
            },
            ingrFat: {
                type: Number,
            },
            ingrCarbs: {
                type: Number,
            },
            ingrProtein: {
                type: Number,
            },
        },
        ratings: [{
            score: {
                type: Number,
            },
            userId: {
                type: String,
            },
        }],
        recipeImg: {
            type: String,
            default: 'https://i.stack.imgur.com/l60Hf.png'
        },
        description: {
            type: String,
            default: 'No description'
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