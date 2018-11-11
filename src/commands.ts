import * as vscode from 'vscode'
import { findMatchingTag } from './tagMatcher'
import { parseTags } from './tagParser'

export async function jumpToMatchingTag() {
  const editor = vscode.window.activeTextEditor

  if (!editor) {
    return
  }

  const tagsList = parseTags(editor.document.getText())
  const position = editor.selection.active
  const positionOffset = editor.document.offsetAt(position)

  const match = findMatchingTag(tagsList, positionOffset)

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
