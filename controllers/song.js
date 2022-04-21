const { Song, validate } = require('../models/song_schema.js')
const { album } = require('../models/album_schema');
const { string } = require('joi');
const { all } = require('../app.js');
const { User } = require("../models/userschema");
const  validObject = require('../controllers/verify')
// router.post("/newsong",
const post_song = async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });
    const songData = await Song.findOne({ Name: req.body.Name })
    if (songData) return res.status(404).send({ messsage: "Song already exists" })
    try {
        var data = { ...req.body }
        const data1 = new Song(data)
        data1.save().then(async (doc) => {
            const album_data = await album.findOne({ _id: req.body.AlbumID })
            const id = doc._id.toString()
            album_data.Songs.push(id)
            const UpdateSongs = await album.findByIdAndUpdate(req.body.AlbumID, album_data).then((doc) => {
                res.status(200).json(doc )
            })
        }).catch(err => {
            res.status(404).send(err)
        })
    }
    catch (error) {
        res.status(500).send("duplicate keyerror")
    }
}
const patch_album = async (req, res) => {
    const data = req.body
    const album_data = await album.findOne({ _id: data.AlbumID })
    console.log(album_data)
    album_data.Songs.push(data.SongID)
    // const delete1 = await album_data.Songs.findByIdAndRemove(data.SongID)
    // console.log(delete1)
    const UpdateSongs = await album.updateOne({ _id: data.AlbumID }, album_data)
    console.log(UpdateSongs)
    res.send({ "updated": UpdateSongs })

    // const delete1 = await album.remove({})
    // const song_data = await Song.find({'AlbumID':album_data._id})
    // console.log(song_data)
    // res.json("song_data updated")

    // console.log(album_data)

    // const data = await Song.update({ Songs: { $elemMatch: { "Tracks": song } } })
    // console.log("one song", data)
}
//search album all songs
const get_songs_album = async (req, res) => {
    console.log("album typeof",typeof(req.params.id))
    console.log(req.params.id)
    // var data = await album.find({$or:
    //     [
    //         {AlbumName: req.params.id },
    //         {Music_Director:req.params.id}
    //     ]
    // })
    // let pat=parseInt(req.params.id)
    // console.log("Type of parsse",typeof(pat))
     var data =await album.find({$or:
            [ {AlbumName: {$regex:req.params.id,$options:'i'} },
              {Music_Director: {$regex:req.params.id, $options:'i'}}
            ]
        })
        if (data) {
        return res.json(data)
    }
    else {
        res.status(404).send("no data")
    }

}
//get all songs in db
const get_all_songs = async (req, res) => {
    var data = await Song.find({})
    if (data) {
        return res.json(data)
    } else {
        res.status(404).send("no data")
    }
}

const delete_song =async (req,res)=>
{
    await Song.findByIdAndRemove(req.params.id).then(async (doc)=>
    {
        if(!doc)
        {
            return res.status(404).send("error")
        }
        console.log(doc)
        res.status(200).send({delete:doc})
        const albumid =doc.AlbumID
        console.log(albumid)

        await album.findByIdAndUpdate({_id:doc.AlbumID},{$pull :{Songs:req.params.id}})
            res.status(200).json({ "deleted": doc, message: "data deleted" })
    })
}
const update_song = async (req, res) => {
    var data = await Song.find({ AlbumName: req.params.AlbumName })
    if (data) {
        return res.json(data)
    }
    else {
        res.status(404).send("no data")
    }
    await album.updateMany({ _id: req.params.id }, { $set: { data } }).then((data)=>
    {
        res.status(200).send({message:"updated data sucessfully",data:data})
    })
}

// router.put('/add/:id', verifyToken ,
const likesong =async (req, res) => {


    const song = await Song.findById(req.params.id);
    if(!song) return res.status(400).send({message:"song does not exist"})

    const user =await User.findById(req.user._id);
    const index = user.likedSongs.indexOf(song._id);
    if(index ===-1){
        user.likedSongs.push(song._id)
        await user.save();
        res.status(200).send("Added to your liked songs")
    }else{
        user.likedSongs.splice(index,1);
        await user.save();
        res.status(200).send("Removed from your liked songs")
    }
    
}

//GET ALL LIKED SONGS

// router.get('/like', 
const all_like = async (req, res) => {
    // const user = await User.findById(res.user._id);
     await User.find({ email: "prasanthi@gmail.com" }).then(data =>
        {
            // const likesSongs = data.likedSongs
            res.status(200).json(  data );
        })
    // console.log(likedsongs)

}
// router.get('/like/:id', async (req, res) => {
//     const user = await User.findOne({ _id: req.params.id })
//     const likedsongs1 = user.likedSongs
//     const songs = await Song.find({})
//     console.log("all songs", songs)
//     res.status(200).json(likedsongs1)
// })




module.exports.post_song = post_song
module.exports.get_Songs = get_songs_album
module.exports.get_allSongs = get_all_songs
module.exports.delet_song = delete_song
module.exports.updat_song = update_song
module.exports.like_son =likesong
module.exports.all_likes =all_like