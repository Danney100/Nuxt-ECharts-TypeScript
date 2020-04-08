<template>
  <div class="col-md-3">
    <b-card
      no-body
      :img-src="item.previewImg"
      :img-alt="item.previewImgAlt"
      img-bottom>
      <b-card-header>
        {{ item.title }}
        <div class="add-btn">
          <b-button :to="item.route" variant="outline-success" size="sm"><i class="dripicons-plus"></i></b-button>
        </div>
      </b-card-header>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

import { VisualizationLibraryItem } from '@/../types/visualization-framework'

@Component({})
export default class VisualizationLibraryGridItem extends Vue {
  @Prop() item!: VisualizationLibraryItem
}

</script>

<style lang="scss" scoped>
.card {
  height: 240px;
  box-shadow: rgba(120, 131, 132, 0.3) 2px 2px 8px -5px;
  border: 1px solid #edecec;
  border-top: 1px solid rgba(182, 186, 208, 0.32);
  font-size: .75rem;
  .card-header {
    background: linear-gradient(#fdfdfd,#f0f4f7);
    text-shadow: 0 0 1px rgba(177, 169, 215, 0.45);
    border-bottom: 1px solid #edecec;
  }
}
.card-img-bottom {
  padding-top: 5px;
  height: 185px;
  padding-bottom: 0;
}
.add-btn {
  font-weight: 500;
  display: inline-block;
  float: right;
  background: linear-gradient(transparent 60%, #e6ede6);
  a.btn, button.btn {
    line-height: .75rem;
    padding: 0.15rem 0.30rem;
    font-size: 1rem;
  }
}
</style>
