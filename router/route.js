const express = require("express");
const router = express.Router()
const albums = require("../controllers/album")
const login = require('../controllers/login')
const song = require('../controllers/song')
const users = require('../controllers/user')
const playlist = require('../controllers/playlists')
const verifyToken = require('../controllers/verify')
const { Song, validate } = require('../models/song_schema.js')
const { User } = require("../models/userschema");
// //////////////////////////////////////////////////////albums////////////////////////////////////////////////////////////////////
//get album
router.get("/get_albums", albums.getAlbums)
//get album by id
router.get("/get_album/:id", albums.getAlbum)
//post album 
router.post("/post_newAlbum", albums.postnewAlbum)
//delete album by  id
router.delete('/delete_album/:id', albums.deleteAlbum)
//update album by id
// router.patch('/update', albums.patchalbum)
//update song by id
// router.patch('/:album', albums.updatesongs)
// router.put('/update_album', albums.updateSong)

/////////////////////////////////////////////////////////login//////////////////////////////////////////////
//post new logins
router.post("/post_login", login.login_new_post)
router.get('/get_logins', login.get_logins)


///////////////////////////////////////////////////////////song///////////////////////////////////////
//post new song
router.post('/postSong', song.post_song)
//get new album by search
router.get('/getSong/:id', song.get_Songs)
//get all songs
router.get('/get_allsongs', song.get_allSongs)
router.delete('/delete/:id', song.delet_song)
router.put('/update_song/:AlbumName', song.updat_song)

/////////////////////////////////////////////////////////user///////////////////////////////////////////
router.post('/newuser', users.new_user)
router.put('/updateuser', users.updateuser)
router.get('/getallusers', users.getalldetails)
router.get('/getuser/:id', users.getuser)
router.delete('/deluser/:id', users.deluser)

///////////////////////////////////////////////////////playlists/////////////////////////////////////////////
router.post('/create_playlist', verifyToken, playlist.create_playlis)
router.put('/edit_playlist', verifyToken, playlist.update_playlis)
router.put('/add_song_playlist', verifyToken, playlist.add_song_to_playlis)
router.delete('/delete',verifyToken,playlist.remove_son)
router.delete('/delete_playlist/:id',verifyToken,playlist.delete_play)
router.get('/get/:id',verifyToken,playlist.get_play)
/////////////////////////////////////////////////////////likes////////////////////////////////////////////////
router.put('/add/:id',verifyToken, song.like_son)
router.get('/all', song.all_likes)

module.exports = router;
// router.put('/add/:id', verifyToken ,async (req, res) => {


//     const song = await Song.findById(req.params.id);
//     if(!song) return res.status(400).send({message:"song does not exist"})

//     const user =await User.findById(req.user._id);
//     const index = user.likedSongs.indexOf(song._id);
//     if(index ===-1){
//         user.likedSongs.push(song._id)
//         await user.save();
//         res.status(200).send("Added to your liked songs")
//     }else{
//         user.likedSongs.splice(index,1);
//         res.status(200).send("Removed from your liked songs")
//     }
    
// })

