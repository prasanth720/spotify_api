const read = require("body-parser/lib/read");
const express = require("express");
const router = express.Router()
const { album, validate } = require('../models/album_schema');
const { Song} = require('../models/song_schema');
const { User } = require("../models/userschema");

//get all albums
const get_albums = async (req, res) => {
    var data = await album.find()
    if (data)  return res.status(200).json(data)
    else { res.status(404).send("no data")}
}
//get individual albums find by id
 const get_album = async (req, res) => {
    var id = req.params.id
    var data1 = await album.findById({_id: id} )
    if (data1) {
        return res.json(data1)
    }
    else {
        res.status(404).send("No Album Found")
    }
}
//add new album post
const new_album_data = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });
    const albumdata = await album.findOne({ AlbumName: req.body.AlbumName })
    console.log(albumdata)
    if (albumdata) return res.status(404).send({ message: "album already exists" })
    try {
        var data2 = { ...req.body }
        const data = new album(data2)
        data.save().then((doc) => {
            res.status(200).send(doc)
        }).catch(err => {
            res.json(err)
        })
    }
    catch (err) {
        res.json("Duplicate key error")
    }
}
//delete album findby id
const delete_album =async (req, res) => {
    await album.findByIdAndDelete(req.params.id).then((doc) => {
        if (!doc) {
            return res.status(404).send();
        }
        res.status(200).send({ "deleted": doc, message: "Album deleted" });
    }).catch((err) => {
        res.status(500).send(err)
    })
}


module.exports.getAlbums=get_albums
module.exports.getAlbum =get_album
module.exports.postnewAlbum =new_album_data
module.exports.deleteAlbum =delete_album

// module.exports.patchalbum= patch_album
// module.exports.updatesongs =updatesongs
// module.exports.updateSong =update_song


//update song data 
// const update_song = async (req, res) => {
//     console.log(req.params.id);
//     console.log(req.body)
//     const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true })
//     res.status(200).send({ data: song, message: "Updated song successfully" })
// }



// const patch_album =async (req, res) => {
//     const data = req.body
//     const album_data = await album.findOne({ _id: data.AlbumID })
//     console.log(album_data)
//    album_data.Songs.push(data.SongID)
//     // const delete1 = await album_data.Songs.findByIdAndRemove(data.SongID)
//     // console.log(delete1)
//     const UpdateSongs = await album.updateOne({ _id: data.AlbumID }, album_data)
//     console.log(UpdateSongs)
//     res.send({"updated":UpdateSongs})

    // const delete1 = await album.remove({})
    // const song_data = await Song.find({'AlbumID':album_data._id})
    // console.log(song_data)
    // res.json("song_data updated")

    // console.log(album_data)

    // const data = await Song.update({ Songs: { $elemMatch: { "Tracks": song } } })
    // console.log("one song", data)
// }


//update all songs to album
// router.patch('/:album',
// const updatesongs =async(req,res)=>
// {
//     console.log(req.params.id);
//     console.log(req.body)
//     await User.findByIdAndUpdate({
//         album: req.params.album
//     },{$push:{ Songs:req.body}})
//     res.status(200).send({message:"updated succesfully"})
// }



