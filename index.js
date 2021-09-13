/* This is part of the 3.1: Phonebook backend step1 exercise */
require("dotenv").config()
const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/persons")

app.use(express.static("build"))
app.use(express.json())
app.use(cors())
/* This is part of the 3.7: Phonebook backend step7 exercise*/

morgan.token("body", req => {
  return JSON.stringify(req.body)
})

app.use(morgan(":method :url :status :res[content-length] :response-time ms :body"))

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

const personIdGenerator = () => {
  const idGenerator = Math.floor(Math.random() * (10000 - 1) + 1)
  const idVerificator = persons.some(person => person.id === idGenerator)

  if (idVerificator) {
    return Math.floor(Math.random() * (10000 - 1) + 1)
  } else {
    return idGenerator
  }
}

app.get("/", (request, response) => {
  response.send("<h1>Hello from the frontend</h1>")
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

/* This is part of the 3.2: Phonebook backend step2 exercise*/
app.get('/info', (request, response) => {

  Person.estimatedDocumentCount({})
    .then((count) => {
      response.send(`<p>Phonebook has info for ${count}</p></br><p>${new Date()}</p>`)
    })
    .catch(error => next(error))
})

/* This is part of the 3.3 Phonebook backend step3 exercise*/
app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

/* This is part of the 3.4 Phonebook backend step4 exercise*/
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndRemove(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))

})

/* This is part of the 3.5: Phonebook backend step5 exercise*/
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  /* const nameVef = persons.some(person => person.name === body.name) */

  /* This is part of the 3.6: Phonebook backend step6 exercise */
  if (!body.name) return response.status(400).json({ error: "name missing" })

  if (!body.number) return response.status(400).json({ error: "number missing" })

  /* if (nameVef) return response.status(400).json({ error: "name must be unique" }) */

  const person = new Person({
    id: personIdGenerator(),
    name: body.name,
    number: body.number
  })

  persons = persons.concat(person)

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))

})

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body
  console.log(body.number)

  const person = {
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: "query" })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  }else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})