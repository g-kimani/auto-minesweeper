<template>
  <game-manager :size="10" :bomb-count="10" />
</template>

<script>
import GameManager from '~/components/GameManager.vue'
export default {
  components: { GameManager },
}
</script>

<style></style>
