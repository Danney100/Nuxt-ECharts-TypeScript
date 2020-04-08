<template>
  <div class="dashboard-page">
    <div class="d-flex">
      <div class="dashboard-page-content">
        <!-- <breadcrumb></breadcrumb> -->
        <slot>
          Empty DashboardPage slot
        </slot>
      </div>
    </div>
    <!-- Footer -->
    <footer class="bg-white py-3">
      <div class="container-fluid">
        <div class="small text-center text-muted">
          Copyright &copy; 2020 - <strong>Paradigm Interactive, Inc.</strong>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class DashboardPage extends Vue {
}
</script>

<style lang="scss" scoped>
.dashboard-page-content {
  width: 100%;
  flex: 1;
  flex-grow: 1;
  padding: 0 6px;
  // padding-right: 1rem;
}

.dashboard-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: visible;
}
</style>


