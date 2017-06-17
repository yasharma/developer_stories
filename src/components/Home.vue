<template>
  <div class="hello">
    <section class="hero is-primary is-medium">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title"> Developer's Stories </h1>
          <h2 class="subtitle"> I'm sure you will find something interesting! </h2>
        </div>
      </div>
    </section>
    <div class="container">
      <div class="columns">
        <div class="column">
          <span class="icon is-large">
            <i class="fa fa-github" aria-hidden="true"></i>
          </span>  
        </div>
        <div class="column">
          <span class="icon is-large">
            <i class="fa fa-linkedin-square" aria-hidden="true"></i>
          </span>
        </div>
        <div class="column">
          <span class="icon is-large">
            <i class="fa fa-facebook-square" aria-hidden="true"></i>
          </span>
        </div>
        <div class="column">
          <span class="icon is-large">
            <i class="fa fa-stack-overflow" aria-hidden="true"></i>
          </span>
        </div>
      </div>
    </div>  
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
