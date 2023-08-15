const axios = require('axios')

class EdamamApiHandler {

    getIngredient(...ingredients) {
        let ingredient = '120gr of pizza dough'
        if (typeof ingredients[0] === 'string') {
            ingredient = ' AND ' + ingredients[0] + ingredients[1] + ' of ' + ingredients[2]
        } else {
            for (let i = 0; i < ingredients[0].length; i++) {
                ingredient += ' AND ' + ingredients[0][i] + ingredients[1][i] + ' of ' + ingredients[2][i]
            }
            console.log(ingredient)
            return axios.get(`https://api.edamam.com/api/nutrition-data?app_id=d58513b4&app_key=0a7c7263b0b29aaebf4989eaeb262205&nutrition-type=logging&ingr=${ingredient}`)
        }
    }
}

const edamamApi = new EdamamApiHandler()

module.exports = edamamApi