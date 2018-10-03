'use strict'

import * as vscode from 'vscode'
import { findMatchingTag } from './tagFinder'

interface Decorations {
  left: vscode.TextEditorDecorationType
  right: vscode.TextEditorDecorationType
  highlight: vscode.TextEditorDecorationType
}

function decorateTag(
  editor: vscode.TextEditor,
  tag: hmt.Match,
  config: vscode.WorkspaceConfiguration
): Decorations | undefined {
  if (
    !config.get('highlightSelfClosing') &&
    tag.closing.start === tag.opening.start
  ) {
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
  const highlightDecoration: vscode.DecorationOptions[] = [
    { range: new vscode.Range(openingStart, openingEnd) },
    { range: new vscode.Range(closingStart, closingEnd) }
  ]
  const highlightDecorationType = vscode.window.createTextEditorDecorationType(
    config.get('style') || {}
  )
  const leftDecorationType = vscode.window.createTextEditorDecorationType(
    config.get('leftStyle') || {}
  )
  const rightDecorationType = vscode.window.createTextEditorDecorationType(
    config.get('rightStyle') || {}
  )
  editor.setDecorations(leftDecorationType, leftDecoration)
  editor.setDecorations(rightDecorationType, rightDecoration)
  editor.setDecorations(highlightDecorationType, highlightDecoration)
  return {
    left: leftDecorationType,
    right: rightDecorationType,
    highlight: highlightDecorationType
  }
}

export function activate() {
  let activeDecorations: Decorations | undefined
  const config = vscode.workspace.getConfiguration('highlight-matching-tag')

  vscode.window.onDidChangeTextEditorSelection(() => {
    if (!config.get('enabled')) {
      return
    }

    const editor = vscode.window.activeTextEditor

    if (!editor) {
      return
    }

    const dispose = (decoration: vscode.TextEditorDecorationType) => {
      if (decoration) {
        return decoration.dispose()
      }
    }

    if (activeDecorations) {
      dispose(activeDecorations.left)
      dispose(activeDecorations.right)
      dispose(activeDecorations.highlight)
    }

    const match = findMatchingTag(
      editor.document.getText(),
      editor.document.offsetAt(editor.selection.active)
    )

    if (match) {
      activeDecorations = decorateTag(editor, match, config)
    }
  })
}
