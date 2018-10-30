'use strict'

import * as vscode from 'vscode'
import { findMatchingTag, getTagsForPosition } from './tagMatcher'
import { parseTags } from './tagParser'
import TagStyler from './tagStyler'

// TODO: take settings from config
// TODO: default underline color is theme's color
// TODO: some default style, by default use colors from skin for underline maybe
// TODO: yes/no modal to ask if the extension should keep old settings (migrate) or use new ones
// TODO: instructions on how to disable ruler styles or change them

/*

different styles for opening and closing
disable default highlighting?
use default tag color for underline highlighting

TODO: Shortcuts
  - Jump to matching tag
  - Highlight path (all tags in path)

TODO: Floating opening tag

old setting names: 

style
endingStyle
beginningStyle
leftStyle
rightStyle

*/

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

  status.text = status.text.trim().replace('›  ›', '»')

  if (tagsForPosition.length > 1) {
    status.show()
  } else {
    status.hide()
  }
}

export function activate() {
  const config = vscode.workspace.getConfiguration('highlight-matching-tag')
  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
  const tagStyler = new TagStyler({
    opening: {
      name: {
        underline: 'yellow'
      }
    }
  })

  status.tooltip = 'Path to tag'

  vscode.window.onDidChangeTextEditorSelection(() => {
    const editor = vscode.window.activeTextEditor

    if (!config.get('enabled') || !editor) {
      return
    }

    const tagsList = parseTags(editor.document.getText())
    const position = editor.document.offsetAt(editor.selection.active)

    // Highlight matching tag
    const match = findMatchingTag(tagsList, position)

    if (match && (match.opening !== match.closing || config.get('highlightSelfClosing'))) {
      tagStyler.decoratePair(match, editor)
    } else {
      tagStyler.clearDecorations()
    }

    // Tag breadcrumbs
    if (config.get('showPath')) {
      updateTagStatusBarItem(status, tagsList, position)
    }
  })
}
