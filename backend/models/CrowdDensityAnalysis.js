const mongoose = require('mongoose')
const CrowdDensitySchema = new mongoose.Schema({
    ClientID: {
        type: String,
        required: true
    },
    // PercentValue: {
    //     type: String,
    // },
    Density:{
        type:String,
    }
})
module.exports = CrowdDensity = mongoose.model('crowd_density', CrowdDensitySchema)
