<template>
  <b-card class="mt-3 code-card" no-body>
    <b-card-header header-tag="div" role="tab" v-b-toggle.code-accordion>
      <span class="dripicons-plus when-closed" style="color: grey;"></span>
      <span class="dripicons-minus when-opened" style="color: grey;"></span>
      {{ title }}
    </b-card-header>
    
    <b-collapse id="code-accordion" accordion="my-accordion" role="tabpanel">
      <code class="pretty-code m-0">{{ text }}</code>
    </b-collapse>
  </b-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator' // , Watch

@Component({})
export default class CodeCard extends Vue {
  @Prop() title!: string
  @Prop() text!: string
}
</script>

<style lang="scss" scoped>
.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}
  
.code-card {
  margin-bottom: 20px;
  #code-accordion {
    padding: 20px;
  }
}
</style>
