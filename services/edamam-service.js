const axios = require('axios')

class EdamamApiHandler {


    getIngredient(...ingredients) {
        if (typeof ingredients[0] === 'string') {
            const apiQuery = '120gr of pizza dough AND ' + ingredients[0] + ingredients[1] + ' of ' + ingredients[2]
            console.log(apiQuery)


        } else {
            // const newApiQuery = ingredients[0].map(eachIngredient => {
            //     eachIngredient
            // })
            console.log(ingredients)
        }
    }

    // return axios.get(`https://api.edamam.com/api/nutrition-data?app_id=d58513b4&app_key=0a7c7263b0b29aaebf4989eaeb262205&nutrition-type=logging&ingr=${ingredient}`)
}




const edamamApi = new EdamamApiHandler()

module.exports = edamamApi