'use strict'

const rhost = 'https://epic-tarpon-definitely.ngrok-free.app'

async function send(command) {
  const res = await fetch(`${rhost}/cmd`, {
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

async function main(command) {
  const textarea = document.querySelector('textarea')

  if (command === 'cls') {
    textarea.textContent = ''
    return
  }

  try {
    const res = await send(command)
    textarea.textContent = res
  } catch (e) {
    textarea.textContent = e.message
  }
}

const recipes = document.querySelectorAll('aside button')
for (const btn of recipes) {
  btn.addEventListener('click', () => {
    const { cmd } = btn.dataset
    let super_cmd = 'msg * '

    if (cmd === 'super_msg') {
      super_cmd += prompt('Type your message:')
      if (!super_cmd) {
        return
      }
    }

    main(super_cmd || cmd)
  })
}

const form = document.querySelector('form')
form.addEventListener('submit', (e) => {
  e.preventDefault()
  main(new FormData(form).get('command'))
  form.reset()
})
