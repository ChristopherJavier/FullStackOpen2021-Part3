/* This is part of the 3.1: Phonebook backend step1 exercise */
const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")

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
  response.json(persons)
})

/* This is part of the 3.2: Phonebook backend step2 exercise*/
app.get('/info', (request, response) => {
  const personsInfo = {
    numberOfpersons: persons.length,
    actualTime: new Date()
  }

  response.write(`<p> The phonebook has info of ${personsInfo.numberOfpersons} <p> <br/>`)
  response.write(String(personsInfo.actualTime))
  response.end()
})

/* This is part of the 3.3 Phonebook backend step3 exercise*/
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

/* This is part of the 3.4 Phonebook backend step4 exercise*/
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

/* This is part of the 3.5: Phonebook backend step5 exercise*/
app.post('/api/persons', (request, response) => {
  const body = request.body
  const nameVef = persons.some(person => person.name === body.name)

  /* This is part of the 3.6: Phonebook backend step6 exercise */
  if (!body.name) return response.status(400).json({ error: "name missing" })
  
  if (!body.number) return response.status(400).json({error: "number missing"})


  if (nameVef) return response.status(409).json({ error: "name must be unique" })

  const person = {
    id: personIdGenerator(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})