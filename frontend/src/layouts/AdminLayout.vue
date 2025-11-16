<script>
import AppHeader from "@/components/admin/AppHeader.vue";
export default {
  components: {
    AppHeader,
  },
};
</script>
<template>
  <div>
    <AppHeader />
    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>
<style>
.page {
  margin: auto;
}
</style>
