<template>
  <div v-if="loading" class="loading-page">
    <div class="loading"></div>
    <span>
      <slot>Loading...</slot>
    </span>
  </div>
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style scoped>
.loading-page {
  padding: 1rem;
  text-align: center;
  font-size: 1rem;
  font-family: sans-serif;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.loading {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  border: 4px solid rgba(9, 133, 81, 0.705);
  border-radius: 50%;
  border-top-color: #158876;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;
}
@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>