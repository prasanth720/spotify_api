const mongoose = require("mongoose");
const joi = require("joi");
const { model } = require("../db");

const ObjectId = mongoose.Schema.Types.ObjectId;

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: ObjectId, ref: "user", required: true },
    songs: { type: Array, default: [] },

});

const validate = (playlist) => {
    const schema = joi.object({
        name: joi.string().required(),
        user: joi.string().required(),
        songs: joi.array().items(joi.string())
    });
    return schema.validate(playlist)
}

const Playlist = mongoose.model("playlist", playlistSchema)

module.exports = { Playlist, validate }