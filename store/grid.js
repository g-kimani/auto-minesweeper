import { set } from 'vue'

const state = () => ({
  size: 5,
  bombCount: 25,
  cells: new Array(state.size).fill().map(() =>
    new Array(state.size).fill({
      x: 0,
      y: 0,
      data: null,
      isBomb: false,
      isFlagged: false,
    })
  ),
  flaggedCells: [],
})

const actions = {
  resetGrid({ commit }) {
    commit('RESET_GRID')
    commit('RESET_FLAGGED')
  },
  buildGrid({ state, commit, dispatch }) {
    return new Promise((resolve) => {
      commit('RESET_GRID')
      for (let x = 0; x < state.size; x++) {
        for (let y = 0; y < state.size; y++) {
          dispatch('buildCellObject', { x, y }).then((result) => {
            commit('SET_CELL', { x, y, ...result })
          })
        }
      }
      resolve()
    })
  },
  buildCellObject({ dispatch }, pos) {
    let isBomb = false
    let isFlagged = false
    dispatch('isBomb', { ...pos }).then((result) => {
      isBomb = result
    })
    dispatch('isFlagged', { ...pos }).then((result) => {
      isFlagged = result
    })
    return {
      ...pos,
      data: null,
      isBomb,
      isFlagged,
    }
  },
  isBomb({ state }, pos) {
    return new Promise((resolve) => {
      if (!state.cells[pos.x][pos.y]) {
        resolve(false)
      } else {
        resolve(state.cells[pos.x][pos.y].isBomb)
      }
    })
  },
  isFlagged({ state }, pos) {
    return new Promise((resolve) => {
      if (!state.cells[pos.x][pos.y]) {
        resolve(false)
      } else {
        resolve(state.cells[pos.x][pos.y].isFlagged)
      }
    })
  },
  placeBombs({ state, commit }) {
    return new Promise((resolve) => {
      let placed = 0
      do {
        const x = rng(0, state.size - 1)
        const y = rng(0, state.size - 1)

        if (!state.cells[x][y].isBomb) {
          commit('SET_CELL_TO_BOMB', { x, y })
          placed++
        }
      } while (placed < state.bombCount)
      resolve()
    })
  },
  inBounds({ state }, pos) {
    return new Promise((resolve) => {
      if (pos.x < 0) resolve(false)
      if (pos.y < 0) resolve(false)
      if (pos.x > state.size - 1) resolve(false)
      if (pos.y > state.size - 1) resolve(false)
      resolve(true)
    })
  },
  forEachCell({ state }, callback) {
    for (let x = 0; x < state.size; x++) {
      for (let y = 0; y < state.size; y++) {
        callback(state.cells[x][y])
      }
    }
  },
  eachAdjacentCell({ state, dispatch }, payload) {
    return new Promise((resolve) => {
      for (let adjX = payload.x - 1; adjX < payload.x + 2; adjX++) {
        for (let adjY = payload.y - 1; adjY < payload.y + 2; adjY++) {
          dispatch('inBounds', { x: adjX, y: adjY }).then((result) => {
            if (!(adjX === payload.x && adjY === payload.y) && result) {
              payload.callback(state.cells[adjX][adjY])
            }
          })
        }
      }
      resolve()
    })
  },

  toggleFlag({ dispatch, commit }, pos) {
    dispatch('inBounds', { ...pos }).then((result) => {
      if (!result) return

      commit('TOGGLE_FLAG', pos)
    })
  },

  setCellAttribute({ state }, payload) {
    // console.log(payload)
    return new Promise((resolve) => {
      set(state.cells[payload.x][payload.y], payload.property, payload.newValue)
      resolve()
    })
  },
  breadthFirstSearch({ dispatch }, payload) {
    return new Promise((resolve) => {
      const potentialSearchPos = []
      let bombsAdjacent = 0
      dispatch('eachAdjacentCell', {
        x: payload.x,
        y: payload.y,
        callback: (adjCell) => {
          if (adjCell.isBomb) {
            bombsAdjacent++
          } else {
            potentialSearchPos.push([adjCell.x, adjCell.y])
          }
        },
      }).then(() => {
        payload.callback(bombsAdjacent, potentialSearchPos)
      })
      resolve()
    })
  },
  async revealSection({ state, dispatch, commit }, pos) {
    const clickedCell = state.cells[pos.x][pos.y]
    if (clickedCell.isBomb) {
      return 0
    }

    const searchQueue = [[pos.x, pos.y]]
    const visited = []
    while (searchQueue.length > 0) {
      // debugger
      const [x, y] = searchQueue.shift()
      // console.log('moved to', x, y)
      await dispatch('breadthFirstSearch', {
        x,
        y,
        callback: (bombsAdj, nextSearch) => {
          visited.push([x, y])
          if (bombsAdj === 0) {
            nextSearch.forEach((s) => {
              if (notInList(visited, s) && notInList(searchQueue, s)) {
                searchQueue.push(s)
              }
            })
          }
          const payload = {
            x,
            y,
            property: 'data',
            newValue: bombsAdj,
          }
          dispatch('setCellAttribute', payload).then(() => {})
          if (state.cells[x][y].isFlagged) {
            commit('TOGGLE_FLAG', { x, y })
          }
        },
      }).then(() => {})
    }
    return 1
  },
  getHiddenCellBorder({ dispatch }) {
    const cellBorder = []
    dispatch('forEachCell', (cell) => {
      if (cell.data === null) {
        dispatch('eachAdjacentCell', {
          x: cell.x,
          y: cell.y,
          callback: (adjCell) => {
            if (adjCell.data > 0) {
              cellBorder.push(cell)
            }
          },
        })
      }
    })
    return cellBorder
  },
}

const mutations = {
  SET_CELL(state, payload) {
    state.cells[payload.x][payload.y] = payload
  },
  SET_CELL_TO_BOMB(state, payload) {
    set(state.cells[payload.x][payload.y], 'isBomb', true)
  },
  RESET_GRID(state) {
    state.cells = new Array(state.size).fill().map(() =>
      new Array(state.size).fill({
        x: 0,
        y: 0,
        data: null,
        isBomb: false,
        isFlagged: false,
      })
    )
  },
  RESET_FLAGGED(state) {
    state.flaggedCells = []
  },
  TOGGLE_FLAG(state, payload) {
    const flagged = state.cells[payload.x][payload.y].isFlagged
    state.cells[payload.x][payload.y].isFlagged = !flagged
    if (!flagged) {
      state.flaggedCells.push(state.cells[payload.x][payload.y])
    } else {
      state.flaggedCells = state.flaggedCells.filter(
        (fc) => !(fc.x === payload.x && fc.y === payload.y)
      )
    }
  },
}

const getters = {
  flagCount(state) {
    return state.flaggedCells.length
  },
  bombCells(state) {
    // return state.cells.forEach((row) => c.isBomb)
    const bombCells = []
    state.cells.forEach((row) => {
      row.forEach((cell) => {
        if (cell.isBomb) {
          bombCells.push(cell)
        }
      })
    })
    return bombCells
  },
}

function rng(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function notInList(list, elm) {
  return !JSON.stringify(list).includes(elm)
}

export default {
  state,
  actions,
  mutations,
  getters,
}
