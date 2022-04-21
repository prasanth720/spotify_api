const {Playlist,validate} = require('../models/playlist');
const {Song} =require("../models/song_schema")
const {User}= require('../models/userschema')
const joi = require('joi')


//create Playlist
const create_playlist =async (req,res)=>
{

    const {error} = validate(req.body);
    if(error) return res.status(400).send({message:error.details[0].message})
    // console.log(req.body)
    // console.log(req.body.user)
  const user =await User.findById(req.body.user)
    const playlist =await Playlist({...req.body,user:user._id}).save();
    // console.log(playlist)
    user.playlists.push(playlist._id);
    await user.save().then((data)=>
    {
        res.status(200).send({message:"Added new Playlist", data:data})
    }).catch(err=>
        {
            res.status(400).send({message:"not added to playlist",data:err})
        })

    // res.status(200).send({data:playlist})
}
//edit playlist by id
const update_playlist =async(req,res)=>
{
    const schema =joi.object({
        name:joi.string().required(),
    });
    const {error} =schema.validate(req.body);
    if(error) return res.status(400).send({message:error.details[0]});

    const playlist =await playlist.findById(req.params.id);
    if(!playlist) return res.status(404).send({message:"Playlist is not found"})

    const user =await  User.findById(req.user._id);
    if(!user._id.equals(playlist.user))
    return req.status(403).send({message:"User don't have access to edit"})

    playlist.name =req.body.name;
    await playlist.save().then((data)=>
    { res.status(200).send({messsage:"Updated succesfully",data:data})})

   
}
//add song to playlist
const add_song_to_playlist = async(req,res)=>
{
    const schema =joi.object({
        playlistId :joi.string().required(),
        songId:joi.string().required()
    })
    const {error}= schema.validate(req.body);
    if(error) return res.status(400).send({message:error.details[0].message})
    const user = await User.findById(req.user._id)
    const playlist =await Playlist.findById(req.body.playlistId);
    // console.log(playlist)
    if(!user._id.equals(playlist.user))
    return res.status(403).send({message:"User dont have access to add"})
    if (playlist.songs.indexOf(req.body.songId) === -1) {
		playlist.songs.push(req.body.songId);
	}
	await playlist.save().then((data)=>
    {
        res.status(200).send({ data: data, message: "Added to playlist" });
    });
	
}
//remove song from playlist
const remove_song = async(req,res)=>
{
    const schema =joi.object({
        playlistId :joi.string().required(),
        songId:joi.string().required()
    });
    const {error }= schema.validate(req.body);
    if(error) return res.status(400).send({message:error.details[0].message});
    const user= await User.findById(req.user._id);
    const playlist =await Playlist.findById(req.body.playlistId);
    if(!user._id.equals(playlist.user))
    return res.status(403).send({message:"User dont have access to remove"})
    const index = playlist.songs.indexOf(req.body.songId);
    playlist.songs.splice(index,1);
    await playlist.save().then((data)=>
    {
        res.status(200).send({data:data,message:"Removed song from playlist"})
    });
   
}

const delete_playlist = async(req,res)=>
{
    const user = await User.findById(req.user._id);
    const playlist=await Playlist.findById(req.params.id);
    if(!user._id.equals(playlist.user))
    return res.status(400).status({message:"User dont have access to delete!"})
    const index =user.playlists.indexOf(req.params.id)
    user.playlists.splice(index,1);
    await user.save();
    await playlist.remove().then((data)=>
    {res.status(200).send({data:data,message:"Removed  playlist from library"})});
    
}

const get_playlist =async(req,res)=>
{       
    try{
        await Playlist.findById(req.params.id).then((data1)=>
     {res.status(200).send({message:"get all songs",data:data1})})
         
    }
    catch(err)
    {
        res.status(500).send("err")
    }
       
}
module.exports.create_playlis = create_playlist
module.exports.update_playlis= update_playlist
module.exports.add_song_to_playlis=add_song_to_playlist
module.exports.remove_son= remove_song
module.exports.delete_play =delete_playlist
module.exports.get_play = get_playlist