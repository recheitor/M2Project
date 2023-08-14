const axios = require('axios')

class EdamamApiHandler {


    getIngredient(ingredient) {
        return axios.get(`https://api.edamam.com/api/nutrition-data?app_id=d58513b4&app_key=0a7c7263b0b29aaebf4989eaeb262205&nutrition-type=logging&ingr=${ingredient}`)
    }


}

const edamamApi = new EdamamApiHandler()

module.exports = edamamApi