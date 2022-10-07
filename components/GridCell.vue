<template>
  <div>
    <v-card :class="classList" flat tile ripple @click="$emit('click')">
      {{ cell.value }}
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    cell: { type: Object, default: () => {} },
  },
  computed: {
    classList() {
      const classes = []
      classes.push('grid-cell')
      if (!this.cell) return classes
      if (this.cell.isFlagged) classes.push('flagged')
      if (this.cell.value) classes.push(`cell-value-${this.cell.value}`)
      return classes
    },
  },
}
</script>

<style lang="scss" scoped>
.grid-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
  width: 100%;
  height: 100%;
  border: 1px solid black;
  font-weight: 700;
}

.cell-value-1 {
  color: rgb(36, 149, 214);
}
.cell-value-2 {
  color: rgb(35, 236, 172);
}
.cell-value-3 {
  color: rgb(235, 186, 65);
}
.cell-value-4 {
  color: rgb(218, 93, 93);
}
.cell-value-5 {
  color: rgb(199, 54, 52);
}
.cell-value-6 {
  color: rgb(153, 42, 41);
}
.cell-value-7 {
  color: rgb(105, 27, 26);
}
.cell-value-8 {
  color: rgb(59, 12, 11);
}
.hidden {
  background-color: aquamarine;
  cursor: pointer;
}
.hidden:hover {
  background-color: whitesmoke !important;
  /* color: whitesmoke; */
}
</style>
