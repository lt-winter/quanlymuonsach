<template>
  <div>
    <AppHeader />
    <div class="container mt-3">
      <router-view />
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";

export default {
  components: {
    AppHeader,
    AppFooter,
  },
};
</script>

<style>
.page {
  margin: auto;
}
</style>
