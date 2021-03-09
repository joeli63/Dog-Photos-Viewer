/**
 * Breed Module
 */

import api from "@/api";

const createInitialState = () => ({
  breeds: {},
  breedImages: []
});

const state = {
  data: createInitialState()
};

const getters = {
  breeds: ({ data }) => {
    return data.breeds ? Object.keys(data.breeds) : [];
  },
  breedImages: ({ data }) => {
    return data.breedImages;
  }
};

const mutations = {
  set(state, data) {
    state.data = data;
  },
  clear(state) {
    state.data = createInitialState();
  }
};

const actions = {
  async fetch({ commit }) {
    const { message } = await api.breed.fetch();
    const breedsList = Object.keys(message);
    const firstBreed = breedsList ? breedsList[0] : null;
    const response = await api.breed.fetchImages(firstBreed);

    commit("set", { breeds: message, breedImages: response.message });
  },

  async fetchImages({ state, commit }, breed) {
    const { message } = await api.breed.fetchImages(breed);

    commit("set", { breedImages: message, breeds: state.data.breeds });
  }
};
export default {
  state,
  getters,
  actions,
  mutations
};
