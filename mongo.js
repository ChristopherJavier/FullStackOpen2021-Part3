/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* This is part of the 3.12: Command-line database exercise */
const mongoose = require("mongoose")

if (process.argv.length < 3) {
	console.log("Please provide the password as an argument: node mongo.js <password>")
	process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://testpart3:${password}@cluster0.6uayb.mongodb.net/personsdb?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model("Person", personSchema)

const person = new Person({
	name: process.argv[3],
	number: process.argv[4],
})

person.save().then(result => {
	console.log(`added ${person.name} number ${person.number} to phonebook ` )
	Person.find({}).then(result => {
		console.log("phonebook:")
		result.forEach(person => {
			console.log(person.name, person.number)
		})
		mongoose.connection.close()
	})
})