<template>
  <div class="auth">
    <div>
      <img class="logo" alt="Vue logo" src="../assets/vue/logo.png">
      <div class="logo-add logo">
        <i class="material-icons logo-add-icon">add</i>
      </div>
      <img class="logo" alt="Firebase logo" src="../assets/firebase/Firebase_Logo_Logomark.svg">
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'Auth',
  components: {},
  directives: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  updated () {},
  methods: {}
}
</script>
<style lang="scss">
.auth {
  padding: 36px;
  background-color: #ffffff;
  img.logo {
    height: 200px;
  }
  .logo-add {
    display: inline-block;
    vertical-align: top;
    height: 200px;
    &-icon {
      margin: 60px;
      font-size: 80px;
      color: #7d7d7d;
    }
  }
}
@media only screen and (max-width: 767.98px) {
  .auth {
    padding: 24px;
    background-color: #ffffff;
    img.logo {
      height: 60px;
    }
    .logo-add {
      height: 60px;
      &-icon {
        margin: 12px;
        font-size: 36px;
        color: #7d7d7d;
      }
    }
  }
}
</style>
