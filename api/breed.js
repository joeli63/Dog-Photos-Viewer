import axios from './axios'

export default {
  fetch() {
    return axios.fetch(`breeds/list/all`)
  },

  fetchImages(breed) {
    return axios.fetch(`breed/${breed}/images`)
  },

  update(id, data) {
    return axios.put(`colors/${id}/`, data)
  },
}
