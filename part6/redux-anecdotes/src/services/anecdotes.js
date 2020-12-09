import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const item = {
    content,
    votes: 0
  }
  const response = await axios.post(baseUrl, item)
  return response.data
}

const update = async (item) => {
  const id = item.id
  const response = await axios.put(`${baseUrl}/${id}`, item)
  return response.data
}

export default {
  getAll,
  createNew,
  update
}