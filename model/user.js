const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },


}, { collection: 'users' })

const mobileSchema = new mongoose.Schema({
    Mobilemodel: { type: String, require: true },
    Mobilename: { type: String, require: true },
    storage: { type: Number },
    ram: { type: Number },
    lanchedon: { type: Date },
    lanchedby: { type: String }
}, { collection: 'mobiles' })


const model = mongoose.model('UserSchema', UserSchema)
const model1 = mongoose.model('mobileSchema', mobileSchema)
module.exports = model, model1