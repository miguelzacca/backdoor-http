'use strict'

const { extractBody, handleError } = require('./utils')
const { exec } = require('node:child_process')

const healthCheck = async (req, res) => {
  res.statusCode = 200
  res.end('Hello, world!')
}

async function executeCommand(req, res) {
  try {
    const { command } = await extractBody(req)

    if (!command) {
      res.statusCode = 400
      res.end('Missing command')
      return
    }

    if (command.includes('cd')) {
      const dir = command.split(' ')[1]?.trim()
      if (dir) {
        process.chdir(dir)
      }
      res.statusCode = 200
      res.end(JSON.stringify({ stdout: `${process.cwd()}\n` }))
      return
    }

    exec(command, { cwd: process.cwd() }, (_, stdout, stderr) => {
      res.statusCode = 200
      res.end(JSON.stringify({ stdout, stderr }))
    })
  } catch (e) {
    handleError(res, e)
  }
}

module.exports = { executeCommand, healthCheck }
