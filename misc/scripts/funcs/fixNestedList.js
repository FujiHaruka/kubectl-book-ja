/**
 * gitbook の markdown パーサーが、sublist の扱いを間違えているため、無理やり修正する
 */
'use strict'

const { EOL } = require('os')
const fs = require('fs').promises

const OlPattern = /^\d\.\s/
const UlPattern = /^-\s/

/**
 * Markdown テキストの行で
 * ```md
 * 1. xxxx
 *
 * - xxx
 * ```
 * のようになっているパターンを見つけて、間の改行を削除する
 */
const filterWrongEOL = (line, i, lines) => {
  const prevLine = lines[i - 1]
  const nextLine = lines[i + 1]
  if (!prevLine || !nextLine) {
    return true
  }
  const isEOL = line === ''
  const isPrevOl = OlPattern.test(prevLine)
  const isNextUl = UlPattern.test(nextLine)

  const isPrevUl = UlPattern.test(prevLine)
  const isNextOl = OlPattern.test(nextLine)

  const shouldRemove = (isEOL && isPrevOl && isNextUl) || (isEOL && isPrevUl && isNextOl)
  if (shouldRemove) {
    return false
  } else {
    return true
  }
}

/**
 * Markdown テキストの行で
 * ```md
 * 1. xxx
 * - xxx
 * ```
 * のようになっているパターンを見つけて、`-` の先頭にスペースを挿入する
 */
const addSpacesToNestedItem = () => {
  // このフラグが必要なので高階関数になった
  let isNesting = false

  return (line, i, lines) => {
    const prevLine = lines[i - 1]
    if (!prevLine) {
      return line
    }
    const isUl = UlPattern.test(line)
    if (isNesting && isUl) {
      return '  ' + line
    }
    const isPrevOl = OlPattern.test(prevLine)
    if (
      isPrevOl &&
      isUl
    ) {
      isNesting = true
      return '   ' + line
    } else {
      isNesting = false
      return line
    }
  }
}

async function fixNextedList() {
  const targets = [
    'book/pages/app_composition_and_deployment/structure_branches.md',
    'book/pages/app_composition_and_deployment/structure_repositories.md',
    'book/pages/app_composition_and_deployment/structure_directories.md',
  ]
  for (const target of targets) {
    const content = await fs.readFile(target, 'utf-8')
    const fixed = content
      .split(EOL)
      .filter(filterWrongEOL)
      .map(addSpacesToNestedItem())
      .join(EOL)
    if (content !== fixed) {
      await fs.writeFile(target, fixed)
    }
  }
}

module.exports = fixNextedList
