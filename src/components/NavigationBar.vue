<template>
  <div>
    <a :href=brandHref class="flex flex-nowrap justify-start items-center px-1">
      <img alt="Vue logo" src="../assets/logo-outline.png" class="w-6">
      <span class="align-middle font-brand text-2xl">+ sawaNana</span>
    </a>
  </div>
</template>
<script>
export default {
  name: 'NavigationBar',
  props: [ 
    'brandHref'
  ]
}
</script>
