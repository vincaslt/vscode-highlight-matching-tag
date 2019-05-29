import * as vscode from 'vscode'
import config from './configuration'
import { findMatchingTag, getTagForPosition } from './tagMatcher'
import { parseTags } from './tagParser'

export async function jumpToMatchingTag() {
  const editor = vscode.window.activeTextEditor

  if (!editor) {
    return
  }

  const tagsList = parseTags(editor.document.getText())
  const position = editor.selection.active
  const positionOffset = editor.document.offsetAt(position)

  const match = findMatchingTag(
    tagsList,
    positionOffset,
    config.highlightFromName,
    config.highlightFromAttributes
  )

  if (match) {
    const openingTagStartPos = editor.document.positionAt(match.opening.start)
    const openingTagRange = new vscode.Range(
      openingTagStartPos,
      editor.document.positionAt(match.opening.end)
    )

    const newPosition = openingTagRange.contains(position)
      ? editor.document.positionAt(match.closing.start + 1)
      : openingTagStartPos.translate(0, 1)

    editor.selection = new vscode.Selection(newPosition, newPosition)
    editor.revealRange(editor.selection)
  } else {
    vscode.window.showInformationMessage('No matching tag was found')
  }
}

export function selectPairContents() {
  const editor = vscode.window.activeTextEditor

  if (!editor) {
    return
  }

  const tagsList = parseTags(editor.document.getText())
  const position = editor.selection.active
  const positionOffset = editor.document.offsetAt(position)

  const activePair = getTagForPosition(tagsList, positionOffset)

  if (activePair) {
    const openingTagEndPos = editor.document.positionAt(activePair.opening.end)
    const closingTagStartPos = editor.document.positionAt(activePair.closing.start)

    const tagContentSelection = new vscode.Selection(openingTagEndPos, closingTagStartPos)
    editor.selection = tagContentSelection
    editor.revealRange(tagContentSelection)
  } else {
    vscode.window.showInformationMessage('No matching tag was found')
  }
}
