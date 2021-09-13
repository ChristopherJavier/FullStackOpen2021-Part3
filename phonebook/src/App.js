import React, { useState, useEffect } from 'react'
import personsService from './services/persons'

/* This is the component that render the search field
and receives the search data from the state in the App component,
also has a call to the handler of the changes of the input in the App component.
This is part of the 2.10: The Phonebook Step5 exercise*/
const Filter = ({ handler }, { search }) => {
  return (
    <>
      filter shown with <input value={search}
        onChange={handler}
      />
    </>
  )
}

/* This is the component that render the form for add new persons to the phonebook,
receives the data from name and number of this states in the App component.
Also has several calls for the handlers of the name and number input changes.
This is part of the 2.10: The Phonebook Step5 exercise*/
const PersonForm = (props) => {

  return (
    <>
      <form onSubmit={props.handlerAP}>
        <div>
          name: <input value={props.name}
            onChange={props.handlerNC}
          />
        </div>
        {/* This is the input for the number was added on the 2.8: The Phonebook Step3 exercise*/}
        <div>
          number: <input value={props.number}
            onChange={props.handlerAN}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}

/* This is the component that render data from the phonebook,
receives data from persons states in the App component.
This is part of the 2.10: The Phonebook Step5 exercise*/
const Persons = (props) => {

  return (
    <ul>
      {/* This map method is use for display the person's name on screen
        This is part of the 2.6: The Phonebook Step1 exercises.
        In the 2.9*: The Phonebook Step4 exercise was added the filter method,
        this filter the elements of the phonebook to mach with the search term that 
        is in the input of the search field, also it can be search the name or the number.
        In the 2.17: Phonebook step9 exercise was added, the button delete,
        it's send the value of id to the handler that the handler send to the deletePerson.*/}
      {props.persons.filter((value) => {
        if (props.search === "") {
          return value
        } else if (value.name.toLowerCase().includes(props.search.toLowerCase()) || value.number.toLowerCase().includes(props.search.toLowerCase())) {
          return value
        }
      }).map(persons =>
        <li key={persons.name}>
          {persons.name}  {persons.number} <button value={persons.id} onClick={props.clickChild}>delete</button>
        </li>
      )}
    </ul>
  )
}

/* This component render the notification message when an action is successful or when and error have occurred,
this component receives the messages and the error boolean as props.
It makes a conditional render for display the notification when receives a notification message or return null.
This is part of the 2.19: Phonebook step11 exercise.
In the 2.20*: Phonebook step12 exercise was added the conditional operator for
change the class of the element for change the style of the message or 
if it's an error or a notification of successful action in the server.*/
const Notification = ({ notificationMessage, errorN }) => {
  let classN

  if (notificationMessage === null) {
    return null
  }

  errorN
    ? classN = "error"
    : classN = "notify"

  return (
    <div className={classN}>
      {notificationMessage}
    </div>
  )
}

const App = () => {
  /* This states array is part of the 2.6: The Phonebook Step1 exercises
   and it's use for store the names of the contacts of the phonebook.
   In the 2.9*: The Phonebook Step4 exercise were added 3 entries of data to the object.
   In the 2.11: The Phonebook Step6 exercise the states was empty and now receives the data
   from the use the petition that is handled by the useEffect by the axios request.*/
  const [persons, setPersons] = useState([])

  /* This states array is part of the 2.6: The Phonebook Step1 exercise
  and store the changes of the input element and data. */
  const [newName, setNewName] = useState('')

  /* This states array is part of the 2.8: The Phonebook Step3 exercise
  and store the changes of the input element and data.*/
  const [tNumber, setTNumber] = useState('')

  /* This states array is part of the 2.9*: The Phonebook Step4 exercise
  and store the changes of the input for the search field.*/
  const [search, setSearch] = useState('')

  /*This states array part of the 2.19: Phonebook step11 exercise
  and store the messages of the errors and notifications that will be display.*/
  const [notificationMessage, setNotificationMessage] = useState(null)

  /*This states array part of the 2.20*: Phonebook step12 exercise
  and store the state of an error.*/
  const [error, setError] = useState(false)

  /* This useEffect is use for request the data 
  from the db.json that now stores the phonebook data.
  This is part of the 2.11: The Phonebook Step6 exercise*/
  useEffect(() => {
    console.log('effect')
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  /* This function saves the data of the input
  and have and object that store the data of the input
  that later is use for save and change the state in persons by setPersons.
  This function also prevent the default action of submitting HTML forms.
  This is part of the 2.6: The Phonebook Step1 exercises.
  In the exercise 2.8: The Phonebook Step3 was added the funtionality of save the data
  of the number input and the personsObject added the number category for save the tNumber
  data and update the persons state.*/
  const addPerson = (event) => {
    event.preventDefault()

    /* newName === "" && alert("Please insert a name for the contact")
    tNumber === "" && alert("Please insert a number for the contact") */

    const nameVef = persons.some(p => p.name === newName)
    const personsObject = {
      name: newName,
      number: tNumber
    }

    const newPersonAdder = () => {
      /* This 'if' was added to prevent the user from being able 
   to add names that already exist in the phonebook.
   In case that the name is already on the phonebook the app display an alert.
   This is part of the 2.7: The Phonebook Step2 exercise.
   Added the process that executes to send of data to the server,
   now the new notes generate can be save in the server. 
   This request it's handled by the personsService.create
   This is part of the 2.15: Phonebook step7 exercise
   In the 2.18*: Phonebook step10 exercise was added the window.confirm to update the contact,
   and a ternary operator to call the updatePerson function to change the contact info.
   This is part of 2.18*: Phonebook step10 exercise.
   In the 2.19: Phonebook step11 exercise was added the notification handler and the notification message.
   In the 3.9 phonebook backend step9 exercise added the newPersonAdder 
   for fix possible problems with the communications with the backend*/
   
      if (nameVef) {
        const idNV = persons.find(person => person.name === newName)
        window.confirm(`${newName} is already on the phonebook, replace the old number with a new one?`)
          ? updatePerson(idNV.id)
          : setNotificationMessage(`${newName} was not changed`)
        handlerNotification()
      } else {
        personsService
          .create(personsObject)
          .then(returnedPersons => {
            setPersons(persons.concat(returnedPersons))
            setNewName('')
            setTNumber('')
            setNotificationMessage(`Added ${personsObject.name}`)
            handlerNotification()
          }).catch(error => {
            setNotificationMessage(error.response.data.error)
            setError(true)
            errorHandler()
          })
      }
    }

    newName === "" || tNumber === ""
      ? alert("Please fill the name or the number if it's empty")
      : newPersonAdder()

  }

  /* This is the function that make the remove of a contact in the phonebook.
  This request for deleting the contact in the server is made by personsService.deleteR,
  and update the Persons state to render the changes on the page.
  It receives the id parameter from the handlerClick.
  This is part of the 2.17: Phonebook step9 exercise
  Also, the id need to convert to int because of the strict comparisons
  that was not working, because was received as a string.
  In the 2.20*: Phonebook step12 exercise was added the catch method for a rejected promise
  and the message for notificacion for an error and the error handler.*/
  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)

    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .deleteR(id)
        .then(returnedPersons => {
          setPersons(persons.filter(n => n.id !== id))
          setNotificationMessage(`Deleted ${person.name}`)
          handlerNotification()
        })
        .catch(error => {
          setNotificationMessage(`The Contact ${person.name} was already remove from server`)
          setError(true)
          errorHandler()
          setPersons(persons.filter(p => p.id !== id))
        })
    }

  }
  /* This is the function that make the update of a contact info in the phonebook.
  This request for update the contact in the server is made by personsService.update,
  is used a object to update the info in the server.
  Then the persons state is update to render the changes on the page.
  This is part of the 2.18*: Phonebook step10 exercise.
  In the 2.20: Phonebook step12 exercise was added the catch method for a rejected promise
  and the message for notificacion for an error and the error handler.*/
  const updatePerson = (id) => {
    const personIndex = persons.findIndex(person => person.id === id)
    const personsUpObject = {
      ...persons[personIndex],
      number: tNumber
    }

    personsService
      .update(id, personsUpObject)
      .then(returnedPersons => {
        setPersons(persons.map(person => person.id !== id ? person : returnedPersons))
        setNewName('')
        setTNumber('')
        setNotificationMessage(`Updated ${personsUpObject.name}`)
        handlerNotification()
      })
      .catch(error => {
        setNotificationMessage(error.response.data.error)
        setError(true)
        errorHandler()
       /*  setNotificationMessage(`The Contact ${personsUpObject.name} was already remove from server`)
        setError(true)
        errorHandler()
        setPersons(persons.filter(p => p.id !== id)) */
      })
  }

  /* This is the handler of the changes of the input.
  This is part of the 2.6: The Phonebook Step1 exercise. */
  const handlerNameChange = (event) => setNewName(event.target.value)

  /* This is the handler for the number input onChange
  This is part of 2.8: The Phonebook Step3 exercise */
  const handlerAddNumber = (event) => setTNumber(event.target.value)

  /* This is the handler of the changes of the search field input 
  This is part of the 2.9*: The Phonebook Step4 exercise*/
  const handlerSearchField = (event) => setSearch(event.target.value)

  /* This is the handler of the click in the delete button in
  the Persons component. It sends the id of the contact that will be deleting from the phonebook
  by the value send by the button when is clicked.
  This is part of the 2.17: Phonebook step9 exercise*/
  const handlerClick = (event) => deletePerson(event.target.value)

  /* This is the handler of the time of screen of the notification. 
  This is part of 2.19: Phonebook step11 exercise*/
  const handlerNotification = () => {
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  /* This is the handler of the time of screen of the error notification. 
  This is part of 2.20*: Phonebook step12 exercise*/
  const errorHandler = () => {
    setTimeout(() => {
      setError(false)
      setNotificationMessage(null)
    }, 5000)
  }

  return (
    /* Were added the calls of the components that were refactored.
    FIlter, PersonForm and Persons are the components.
    This is part of the 2.10: The Phonebook Step5 exercise.
    Added  the call of the Notification component, 
    This is part of the 2.19: Phonebook step11 exercise*/
    <div>
      <h2>Phonebook</h2>
      <Notification notificationMessage={notificationMessage} errorN={error} />
      <Filter handler={handlerSearchField} search={search} />
      <h2>Add a new</h2>
      <PersonForm handlerNC={handlerNameChange} handlerAN={handlerAddNumber} handlerAP={addPerson} number={tNumber} name={newName} />
      <h2>Numbers</h2>
      <Persons persons={persons} search={search} clickChild={handlerClick} />
    </div>
  )
}

export default App