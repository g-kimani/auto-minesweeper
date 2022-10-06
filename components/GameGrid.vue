<template>
  <v-container>
    <div id="game-grid" class="v-card"></div>
  </v-container>
</template>

<script>
export default {
  props: {
    size: { type: Number, required: true },
    bombCount: { type: Number, required: true },
  },
  data() {
    return {
      cells: new Array(this.size)
        .fill(null)
        .map(() => new Array(this.size).fill(null)),
      flagPositions: [],
      bombPositions: [],
    }
  },
  computed: {},
  mounted() {
    this.placeBombs()
    this.draw()
  },
  methods: {
    inBounds(x, y) {
      if (x < 0) return false
      if (y < 0) return false
      if (x > this.size - 1) return false
      if (y > this.size - 1) return false
      return true
    },
    forEachCell(callback) {
      for (let x = 0; x < this.size; x++) {
        for (let y = 0; y < this.size; y++) {
          callback(x, y, this.cells[x][y])
        }
      }
    },
    eachAdjacentCell(x, y, callback) {
      for (let adjX = x - 1; adjX < x + 2; adjX++) {
        for (let adjY = y - 1; adjY < y + 2; adjY++) {
          if (this.inBounds(adjX, adjY) && adjX !== x && adjY !== y)
            callback(adjX, adjY, this.cells[adjX][adjY])
        }
      }
    },
    hiddenCellBorder() {
      const cells = []
      this.eachCell((x, y, value) => {
        if (value == null) {
          this.eachAdjacentCell(x, y, (newX, newY, value) => {
            if (
              cells.findIndex((e) => e.x === x && e.y === y) === -1 &&
              value > 0
            ) {
              cells.push({ x, y })
            }
          })
        }
      })
      return cells
    },
    placeBombs() {
      let placed = 0
      do {
        const x = this.rng(0, this.size - 1)
        const y = this.rng(0, this.size - 1)
        // console.log(x, y, this.size);
        if (!this.isBomb(x, y)) {
          this.bombPositions.push({ x, y })
          placed++
        }
      } while (placed < this.bombCount)
    },
    isBomb(x, y) {
      return (
        this.bombPositions.findIndex((pos) => pos.x === x && pos.y === y) !== -1
      )
    },
    toggleFlag(x, y) {
      if (!this.inBounds(x, y)) return
      if (this.isFlag(x, y)) {
        this.flagPositions = this.flagPositions.filter(
          (f) => !(f.x === x && f.y === y)
        )
      } else if (this.flagPositions.length >= this.bombCount) {
        console.log('too many flags')
      } else {
        this.flagPositions.push({ x, y })
      }
      const flagElement = document.getElementById('flags')
      flagElement.innerText = this.bombCount - this.flagPositions.length
      this.draw()
    },
    isFlag(x, y) {
      return this.flagPositions.findIndex((f) => f.x === x && f.y === y) !== -1
    },
    reveal(x, y) {
      if (!this.inBounds(x, y)) return 1
      if (this.cells[x][y] !== null) return 1

      if (this.isBomb(x, y)) {
        // this.gameOver();
        console.log('hit bomb ')
        return 0
      }
      // debugger
      const searchQueue = [[x, y]]
      const visited = []
      console.log(x, y)
      do {
        const [x2, y2] = searchQueue.shift()
        visited.push([x2, y2])
        const potential = []
        let bombsAdjacent = 0
        for (let offX = -1; offX < 2; offX++) {
          for (let offY = -1; offY < 2; offY++) {
            const newX = x2 + offX
            const newY = y2 + offY
            if (!(x === newX && y === newY) && this.inBounds(newX, newY)) {
              if (this.isBomb(newX, newY)) {
                bombsAdjacent++
              } else {
                potential.push([newX, newY])
              }
            }
          }
        }
        // console.log(bombsAdjacent);

        if (bombsAdjacent === 0) {
          const qu = JSON.stringify(searchQueue)
          const vis = JSON.stringify(visited)
          potential.forEach((e) => {
            const check = JSON.stringify(e)
            if (!vis.includes(check) && !qu.includes(check)) {
              searchQueue.push(e)
            }
          })
        }
        console.log(1, x, y)
        this.cells[x2][y2] = bombsAdjacent
      } while (searchQueue.length > 0)
      this.draw()
      console.log('revealed section')
      return 1
    },
    clearTable(grid) {
      while (grid.firstChild) {
        grid.removeChild(grid.firstChild)
      }
      return grid
    },
    draw() {
      let table = document.getElementById('game-grid')
      table = this.clearTable(table)
      for (let x = 0; x < this.size; x++) {
        const row = document.createElement('div')
        row.classList.add('grid-row')
        for (let y = 0; y < this.size; y++) {
          const data = document.createElement('div')
          data.addEventListener('click', (e) => this.reveal(x, y))
          data.classList.add('grid-cell')
          data.classList.add('hidden')
          // data.classList.add("card");
          const value = this.cells[x][y]
          if (value === 20) {
            data.classList.add('cell')
          }
          if (this.isFlag(x, y)) {
            data.classList.add('flag')
            data.innerHTML =
              '<span class="material-symbols-outlined">flag</span>'
          }
          // if (this.isBomb(x, y)) data.style.backgroundColor = "red";
          if (value !== null && value < 10) {
            data.classList.add(`value-${value}`)
            data.classList.remove('hidden')
            data.classList.remove('flag')
            data.textContent = value || ''
          }
          row.appendChild(data)
        }
        table.appendChild(row)
      }
    },
    rng(min, max) {
      return Math.floor(Math.random() * max - min + 1) - min
    },
  },
}
</script>

<style>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}
table {
  border: 1px solid black;
  width: 400px;
  height: 400px;
}
table {
  border-collapse: collapse;
  table-layout: fixed;
}

.board {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: wheat;
  padding-bottom: 16px;
  width: 70%;
  margin: auto;
}

#game-message {
  position: absolute;
  background-color: rgb(215 194 194 / 60%);
  width: 380px;
  z-index: 100;
  height: 100px;
  border-radius: 5px;
  /* margin: auto; */
  /* display: none; */
  box-shadow: -1px -1px 5px 3px #000000a8;
}

.board .header {
  height: 50px;
  width: 100%;
  display: flex;
  margin-bottom: 16px;
}

.header-item {
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  border: 1px solid black;
  padding: 5px;
}

.bomb {
  width: 100%;
}

.avatar img {
  height: 100%;
  margin: auto;
}
#game-grid {
  border: 1px solid black;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 400px;
}

.grid-row {
  display: flex;
  height: 100%;
}
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

.value-1 {
  color: rgb(36, 149, 214);
}
.value-2 {
  color: rgb(35, 236, 172);
}
.value-3 {
  color: rgb(235, 186, 65);
}
.value-4 {
  color: rgb(218, 93, 93);
}
.value-5 {
  color: rgb(199, 54, 52);
}
.value-6 {
  color: rgb(153, 42, 41);
}
.value-7 {
  color: rgb(105, 27, 26);
}
.value-8 {
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
/* tr {
  border: solid thin;
} */
td {
  text-align: center;
  vertical-align: middle;
  border: 1px solid black;
}

.cell {
  background-color: bisque;
  color: bisque;
}

.cell:hover {
  background-color: whitesmoke;
  color: whitesmoke;
}

.flag {
  background-color: aquamarine !important;
  color: rgb(87, 117, 107);
}
</style>
