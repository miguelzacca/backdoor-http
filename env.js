'use strict'

const os = require('node:os')

const win32 = os.platform() === 'win32'

module.exports = {
  ngrokExecutable: win32 ? 'ngrok.exe' : './ngrok',
  ngrokAuthToken: '2dQKSqtYDAmVKv7Ekrl2ys0nFyD_2ARhd7ZtWYJfd8YcxhRyQ',
  rhost: 'https://epic-tarpon-definitely.ngrok-free.app',
  spawnOptions: {
    detached: true,
    stdio: 'ignore',
  },
}
