#!/usr/bin/env node
/**
 * Script to be run after `inalz build`
 */
'use strict'

async function afterInalzBuild() {
  console.log('\n[afterInalzBuild] script started.')
  process.chdir(__dirname + '/../..')
  console.log('  fixNestedList...')
  await require('./funcs/fixNestedList')()
  console.log('[afterInalzBuild] done.\n')
}

afterInalzBuild().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
