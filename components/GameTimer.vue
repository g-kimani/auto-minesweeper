<template>
  <div>
    <v-card flat> {{ currentTime }} </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isRunning: false,
      startTime: 0,
      overallTime: 0,
      currentTime: 0,
    }
  },
  methods: {
    _getTimeElapsedSinceLastStart() {
      if (!this.startTime) {
        return 0
      }

      return Date.now() - this.startTime
    },

    start() {
      if (this.isRunning) {
        return console.error('Timer is already running')
      }

      this.isRunning = true

      this.startTime = Date.now()

      setInterval(() => {
        const timeInSeconds = Math.round(this.getTime() / 1000)
        this.currentTime = timeInSeconds
      }, 100)
    },

    stop() {
      if (!this.isRunning) {
        return console.error('Timer is already stopped')
      }

      this.isRunning = false

      this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart()
    },

    reset() {
      this.overallTime = 0

      if (this.isRunning) {
        this.startTime = Date.now()
        return
      }

      this.startTime = 0
    },

    getTime() {
      if (!this.startTime) {
        return 0
      }

      if (this.isRunning) {
        return this.overallTime + this._getTimeElapsedSinceLastStart()
      }

      return this.overallTime
    },
  },
}
</script>

<style lang="scss" scoped></style>
