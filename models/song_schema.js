const mongoose = require("mongoose")
const joi = require("joi")

const songsSchema = mongoose.Schema({
    "AlbumName": { type: String, required: true },
    "AlbumID": { type: String, required: true },
    "Name": { type: String, required: true },
    "Songurl": { type: String, required: true },
    "Year": { type: String, required: true },
    "Singer": { type: Array, default: [] },
    "Category": { type: String, required: true },
    "Lyricist": { type: String, required: true }
})


const validate = (song_valid) => {
    const schema = joi.object({
        "AlbumName": joi.string().required(),
        "AlbumID": joi.string().required(),
        "Name": joi.string().required(),
        "Songurl": joi.string().required(),
        "Year": joi.number().required(),
        "Singer": joi.array().required(),
        "Category": joi.string().required(),
        "Lyricist": joi.string().required()
    });
    return schema.validate(song_valid)
}
const Song = mongoose.model('songs', songsSchema);

module.exports = { Song, validate }
