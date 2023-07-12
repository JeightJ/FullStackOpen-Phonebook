import axios from 'axios'

// HUOM* Jos tehdään tuotantoon muutoksia, muuta tämä muotoon '/api/persons', jotta se toimii renderissä
const baseUrl = 'http://localhost:3001/api/persons'; 

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update,
  remove: remove
}
