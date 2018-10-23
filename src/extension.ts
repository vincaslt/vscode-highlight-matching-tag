'use strict'

import * as vscode from 'vscode'
import { findMatchingTag, getTagsForPosition } from './tagMatcher'
import { parseTags } from './tagParser'

interface Decorations {
  left: vscode.TextEditorDecorationType
  right: vscode.TextEditorDecorationType
  beginning: vscode.TextEditorDecorationType
  ending: vscode.TextEditorDecorationType
  highlight: vscode.TextEditorDecorationType
}

function decorateTag(
  editor: vscode.TextEditor,
  tag: hmt.Match,
  config: vscode.WorkspaceConfiguration
): Decorations | undefined {
  if (!config.get('highlightSelfClosing') && tag.closing.start === tag.opening.start) {
    return undefined
  }

  const openingStart = editor.document.positionAt(tag.opening.start)
  const openingEnd = editor.document.positionAt(tag.opening.end)
  const closingStart = editor.document.positionAt(tag.closing.start)
  const closingEnd = editor.document.positionAt(tag.closing.end)

  const leftDecoration: vscode.DecorationOptions[] = [
    {
      range: new vscode.Range(openingStart, openingStart.translate(0, 1))
    },
    {
      range: new vscode.Range(closingStart, closingStart.translate(0, 1))
    }
  ]
  const rightDecoration: vscode.DecorationOptions[] = [
    {
      range: new vscode.Range(openingEnd, openingEnd.translate(0, -1))
    },
    {
      range: new vscode.Range(closingEnd, closingEnd.translate(0, -1))
    }
  ]
  const beginningDecoration: vscode.DecorationOptions[] = [
    { range: new vscode.Range(openingStart, openingEnd) }
  ]
  const endingDecoration: vscode.DecorationOptions[] = [
    { range: new vscode.Range(closingStart, closingEnd) }
  ]
  const highlightDecoration: vscode.DecorationOptions[] = [
    { range: new vscode.Range(openingStart, openingEnd) },
    { range: new vscode.Range(closingStart, closingEnd) }
  ]
  const highlightDecorationType = vscode.window.createTextEditorDecorationType(
    config.get('style') || {}
  )
  const endingDecorationType = vscode.window.createTextEditorDecorationType(
    config.get('endingStyle') || {}
  )
  const beginningDecorationType = vscode.window.createTextEditorDecorationType(
    config.get('beginningStyle') || {}
  )
  const leftDecorationType = vscode.window.createTextEditorDecorationType(
    config.get('leftStyle') || {}
  )
  const rightDecorationType = vscode.window.createTextEditorDecorationType(
    config.get('rightStyle') || {}
  )
  editor.setDecorations(leftDecorationType, leftDecoration)
  editor.setDecorations(rightDecorationType, rightDecoration)
  editor.setDecorations(beginningDecorationType, beginningDecoration)
  editor.setDecorations(endingDecorationType, endingDecoration)
  editor.setDecorations(highlightDecorationType, highlightDecoration)
  return {
    left: leftDecorationType,
    right: rightDecorationType,
    beginning: beginningDecorationType,
    ending: endingDecorationType,
    highlight: highlightDecorationType
  }
}

function updateTagStatusBarItem(
  status: vscode.StatusBarItem,
  tagsList: hmt.PartialMatch[],
  position: number
) {
  const tagsForPosition = getTagsForPosition(tagsList, position)

  status.text = tagsForPosition.reduce((str, pair, i, pairs) => {
    const name = pair.opening!.name!

    if (i === 0) {
      return `${name}`
    }

    const separator =
      pairs[i - 1].attributeNestingLevel < pair.attributeNestingLevel ? ` ~ ` : ' › '

    return str + separator + name
  }, '')

  if (tagsForPosition.length) {
    status.show()
  } else {
    status.hide()
  }
}

export function activate() {
  let activeDecorations: Decorations | undefined
  const config = vscode.workspace.getConfiguration('highlight-matching-tag')
  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)

  status.tooltip = 'Path to tag'
  status.command = 'extension.selectedLines'

  vscode.window.onDidChangeTextEditorSelection(() => {
    const editor = vscode.window.activeTextEditor

    if (!config.get('enabled') || !editor) {
      return
    }

    const tagsList = parseTags(editor.document.getText())
    const position = editor.document.offsetAt(editor.selection.active)

    // Highlight matching tag
    const match = findMatchingTag(tagsList, position)

    // Tag breadcrumbs
    if (config.get('showPath')) {
      updateTagStatusBarItem(status, tagsList, position)
    }

    if (activeDecorations) {
      activeDecorations.left.dispose()
      activeDecorations.right.dispose()
      activeDecorations.beginning.dispose()
      activeDecorations.ending.dispose()
      activeDecorations.highlight.dispose()
    }

    if (match) {
      activeDecorations = decorateTag(editor, match, config)
    }
  })
}
