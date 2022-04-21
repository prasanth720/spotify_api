const mongoose = require("mongoose")
const joi = require("joi")

const Albumschema = new mongoose.Schema({
    "AlbumName": { type: String, required: true },
    "Year": { type: Number, required: true },
    "Music_Director": { type: String, required: true },
    "Songs": { type: Array, default: [] }
})

const validate = (album_validate) => {
    const schema = joi.object({
        "AlbumName": joi.string().required(),
        "Music_Director": joi.string().required(),
        "Year": joi.number().required(),
        "Songs": joi.array()
    });
    return schema.validate(album_validate)
}
const album = mongoose.model('albums', Albumschema);

module.exports = { album, validate }
