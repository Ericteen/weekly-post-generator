#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const promisify = require('util').promisify
const { prompt } = require('enquirer')

const copyFile = promisify(fs.copyFile)
const cwd = process.cwd()

const TEMPLATES = [
  {
    type: 'select',
    name: 'templateName',
    message: 'choose your template: ',
    initial: 0,
    choices: [
      { name: 'weekly-post', value: 'weekly-post' }
    ]
  }
]

async function init() {
  /**
   * @type {{ projectName: string }}
   */
  const { name } = await prompt({
    type: 'input',
    name: 'name',
    message: `Your name:`,
    initial: '姓名'
  })

  const { date } = await prompt({
    type: 'input',
    name: 'date',
    message: `current date:`,
    initial: getCurrentDate()
  })

  const { templateName } = await prompt(TEMPLATES)

  await copyFile(path.join(__dirname, `templates/template-${templateName}.md`), path.join(cwd, `${name}周报${date}.md`))
}

function getCurrentDate() {
  const date = new Date()
  let month = date.getMonth() + 1
  month = month < 10 ? `0${month}` : month
  let day = date.getDate()
  return `${month}${day}`
}

init().catch((e) => {
  console.error(e)
})
