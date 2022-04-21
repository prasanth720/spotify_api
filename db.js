const mongoose = require("mongoose");
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (!err) { console.log("Mongodb is Connected Succesfully") }
    else { console.log(err) }
})

const connect = mongoose.connection
connect.on("error", (error) => {
    console.log(error)
})
connect.once("open", () => {
    console.log("Connected to the Database")
})
module.exports = mongoose
