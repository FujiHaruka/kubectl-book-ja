#!/usr/bin/env node
/**
 * Script to be run after `inalz build`
 */
'use strict'

async function afterInalzBuild() {
  process.chdir(__dirname + '/../..')
  await require('./funcs/fixNestedList')()
}

afterInalzBuild().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
