const mongoose = require("mongoose")
const joi = require("joi")
const passwordcomplexity = require("joi-password-complexity")

const userschema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    likedSongs: { type: [String], default: [] },
    playlists: { type: [String], default: [] },
})


const validate = (user) => {
    const schema = joi.object({
        name: joi.string().min(5).max(15).required(),
        email: joi.string().email({ minDomainSegments: 1, tlds: { allow: ["com"] } }).required(),
        password: passwordcomplexity().required(),

    });
    return schema.validate(user)
}

const User = mongoose.model("user", userschema)

module.exports = { User, validate }