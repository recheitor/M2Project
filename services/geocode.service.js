const axios = require('axios')
class geocoding {
    constructor() {
        this.axiosApp = axios.create({
            baseURL: 'https://maps.googleapis.com/maps/api/geocode'
        })
    }
    getCoordenates(address) {
        return this.axiosApp.get(`/json?address=${address}&key=AIzaSyD9cparf9WJ2kLOCPmr_4e_NRdstbvHob0`)
    }
}
const geocodingApi = new geocoding()
module.exports = geocodingApi

