/* This is part of the 3.13: Phonebook database, step1 exercise*/
require("dotenv").config()
const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")
/* This is part of the 3.19: Phonebook database, step7 exercise */

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI

console.log("connecting to", url)

mongoose.connect(url)
	// eslint-disable-next-line no-unused-vars
	.then(result => {
		console.log("connected to MongoDB")
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message)
	})

/* This is part of the 3.20*: Phonebook database, step8 exercise */
const personSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		unique: true
	},
	number: {
		type: String,
		minlength: 8,
		required: true
	}
})

personSchema.plugin(uniqueValidator)

personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model("Person", personSchema)