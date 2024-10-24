'use strict'

const env = require('../../env')

async function healthCheck() {
  const res = await fetch(`${env.rhost}/cmd`, {
    headers: {
      'ngrok-skip-browser-warning': true,
    },
  })

  if (!res.ok) {
    process.stdout.write('FAILURE\n')
    process.exit(1)
  }

  process.stdout.write('SUCCESS\n')
}

async function send(command) {
  const res = await fetch(`${env.rhost}/cmd`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    },
    body: JSON.stringify({ command }),
  })

  const json = await res.text()

  if (!res.ok) {
    console.log(json)
    return
  }

  const data = JSON.parse(json)

  return data.stdout || data.stderr
}

async function main() {
  await healthCheck()

  const initStdin = () => process.stdout.write('$ ')
  initStdin()

  const reservedKeys = {
    cls: () => {
      console.clear()
      initStdin()
    },
    exit: () => {
      process.exit(0)
    },
  }

  process.stdin.on('data', async (data) => {
    const command = data.toString()

    const reservedAction = reservedKeys[command.trim()]
    if (reservedAction) {
      reservedAction()
      return
    }

    const result = await send(command)
    process.stdout.write(`${result}\n`)

    initStdin()
  })
}
main()
