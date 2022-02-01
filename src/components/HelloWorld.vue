<template>
  <div class="bg-teal-400 text-white h-full">
    <NavigationBar />
    <div class="hello">
      <h1 class="text-7xl mt-10">Hello, world!</h1>
      <p>
        こんにちは、世界！
      </p>
    </div>
  </div>
</template>

<script>
import NavigationBar from './NavigationBar.vue'
export default {
  name: 'HelloWorld',
  components: {
    NavigationBar
  }
}
</script>