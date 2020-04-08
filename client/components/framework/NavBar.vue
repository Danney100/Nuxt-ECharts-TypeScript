<template>
  <div :class="classes">
    <b-navbar toggleable="md">
      <slot>
        <b-navbar-nav>
        </b-navbar-nav>
      </slot>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop }from 'nuxt-property-decorator'
import { Route } from 'vue-router/types'

@Component({
  components: {
  },
})
export default class NavBar extends Vue {
  @Prop({ default: false }) changedMode!: boolean
  classes: string = ""

  setClasses(route: Route) {
    let classes = "main-navbar"
    if (route.name.indexOf('editor') == 0) {
      classes += " editor"
    }
    else {
      classes += " admin"
    }
    if (this.changedMode) {
      classes += " changed-mode"
    }
    this.classes = classes
  }

  @Watch('changedMode')
  onChangedMode(newValue) {
    this.setClasses(this.$route)
  }

  mounted() {
    this.setClasses(this.$route)
  }
}

</script>


<style lang="scss" scoped>
.main-navbar {
  &::v-deep nav {
    height: 80px;
    padding-left: 122px;
    /* background: linear-gradient(to right, #fc5c7d, #6a82fb); */
    /* background: linear-gradient(to right, #00f260, #0575e6); */
    /* background: linear-gradient(to left, #83a4d4, #b6fbff); */
    // linear-gradient(to left, #74ebd5, #acb6e5);
    background-image: linear-gradient(to right, #57ef93, #0575e6 50%, #acb6e5 50.1%, #74ebd5);
    background-size: 200% auto;

    li.nav-item .nav-link {
      color: white;
      font-weight: 500;
      text-shadow: 0 0 1px rgba(109, 88, 217, 0.5);
    }
  }

  &.editor, &.admin {
    &.changed-mode {
      &::v-deep nav {
        transition: background-position 0.75s ease;
      }
    }
  }

  &.editor {
    &::v-deep nav {
      background-position: 0 0;
      transition: background-position 0.75s ease;
    }

    &.changed-mode {
      &::v-deep nav {
        background-position: 100% 0;
        transition: none;
      }
    }
  }
  &.admin {
    &::v-deep nav {
      background-position: 100% 0;
    }

    &.changed-mode {
      &::v-deep nav {
        //background-position: 0 0;
      }
    }
  }
}

</style>
