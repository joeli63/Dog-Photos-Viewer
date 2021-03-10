<template>
  <div v-if="!$fetchState.pending" class="text-center">
    <h1 class="title">Dog-Photos-Viewer</h1>
    <div class="max-w-6xl mx-auto p-8">
      <label
        id="listbox-label"
        class="block text-sm font-extralight text-gray-700 text-2xl text-left"
      >
        Select a breed
      </label>
      <div class="mt-1 relative">
        <select
          v-model="selectedBreed"
          @change="onBreedChange"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
          class="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option v-for="breed in breeds" :key="breed">{{ breed }}</option>
        </select>
      </div>
    </div>
    <div v-if="isLoaded" class="grid max-w-6xl mx-auto p-8">
      <image-container
        v-for="image in breedImages"
        :key="image"
        :url="image"
        :title="selectedBreed"
      ></image-container>
    </div>
    <div v-else class="max-w-6xl mx-auto p-8 text-center">
      <loading-bar :loading="isLoaded">Loading...</loading-bar>
    </div>
  </div>
</template>

<script>
import ImageContainer from "~/components/ImageContainer";
import LoadingBar from "~/components/LoadingBar"

export default {
  async fetch() {
    await this.$store.dispatch("breed/fetch");
  },
  components: {
    ImageContainer,
    LoadingBar,
    LoadingBar
  },
  computed: {
    breeds() {
      const breeds = this.$store.getters["breed/breeds"];
      if (breeds && !this.selectedBreed) this.selectedBreed = breeds[0]
      return this.$store.getters["breed/breeds"];
    },
    breedImages() {
      return this.$store.getters["breed/breedImages"];
    },
  },
  data() {
    return {
      selectedBreed: "",
      isLoaded: true,
    };
  },
  methods: {
    async onBreedChange() {
      this.isLoading = false
      await this.$store.dispatch("breed/fetchImages", this.selectedBreed);
      this.isLoading = true
    },
  },
};
</script>
