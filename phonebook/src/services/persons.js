/* This is the module that controls the communication with the server 
and the petition that are make to the server.
The axios petitions and promise are make by getAll, create, deleteR and update functions.
This is part of the 2.16: Phonebook step8 exercise*/
import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

 const deleteR = id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

export default { getAll, create, deleteR, update }