import * as vscode from 'vscode'
import { parseTags } from './tagParser';
import { findMatchingTag } from './tagMatcher';

export async function jumpToMatchingTag() {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    return;
  }

  const tagsList = parseTags(editor.document.getText())
  const position = editor.selection.active
  const positionOffset = editor.document.offsetAt(position)

  const match = findMatchingTag(tagsList, positionOffset)

  if (match && match.opening !== match.closing) {
    let newPosition: vscode.Position;
    const openingTagStartPos = editor.document.positionAt(match.opening.start)
    const openingTagRange = new vscode.Range(
      openingTagStartPos,
      editor.document.positionAt(match.opening.end)
    )

    if (openingTagRange.contains(position)) {
      newPosition = editor.document.positionAt(match.closing.start).translate(0, 1)
    } else {
      newPosition = openingTagStartPos.translate(0, 1)
    }

    editor.selection = new vscode.Selection(newPosition, newPosition)
    editor.revealRange(editor.selection)
  } else {
    vscode.window.showInformationMessage('No matching tag was found')
  }
}
