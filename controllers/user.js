const { User, validate } = require('../models/userschema')
const bcrypt = require("bcryptjs")
//create user 
const new_reg = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });
    const user = await User.findOne({ email: req.body.email });
    if (user)
        return res.status(403).send({ message: "user already exists" })
    const regUserData = { ...req.body }
    const salt = await bcrypt.genSalt(10)
    await bcrypt.hash(req.body.password, salt).then(hashedPassword => {
        if (hashedPassword) {
            // console.log("hashedpassword",hashedPassword)
            regUserData.password = hashedPassword
        }
    })
    await User.create(regUserData).then(userstoreddata => {
        if (userstoreddata && userstoreddata._id) {
            // console.log('user stored data',userstoreddata)
            userstoreddata.password = undefined;
            userstoreddata._v = undefined;
            res.json({ status: "200 ok", data: userstoreddata, message: "Account created successfully" })
        }
    }).catch(err => {
        res.json({ status: 'error', data: err })
    })
}
//update user by id

const update_user = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.body.id, { $set: req.body }, { new: true })
    res.status(200).send({ "data": user, messsage: "Profile updated sucessfully" })
}

//get all user details
const get_alldetails = async (req, res) => {
    var data = await User.find();
    if (data.length > 0) {
        res.json(data)
    }
    else {
        res.status(404).send("No data")
    }
}


//get user find by id
const get_user = async (req, res) => {
    const user = await User.findById(req.params.id)
    res.status(200).send({ data: user })
}


// del user by id
const del_user = async (req, res) => {
    await User.findByIdAndRemove(req.params.id).then((doc) => {
        if (!doc) {
            return res.status(404).send();
        }
        res.status(200).send({ "data": doc, message: "delete user" });
    }).catch(err => {
        res.status(500).send(err)
    })
}

module.exports.new_user = new_reg
module.exports.updateuser = update_user
module.exports.getalldetails = get_alldetails
module.exports.getuser = get_user
module.exports.deluser = del_user