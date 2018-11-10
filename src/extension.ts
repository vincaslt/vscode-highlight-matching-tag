'use strict'

import * as vscode from 'vscode'
import { jumpToMatchingTag } from './commands'
import config from './configuration'
import { findMatchingTag, getTagsForPosition } from './tagMatcher'
import { parseTags } from './tagParser'
import TagStyler from './tagStyler'

// TODO: default style is underline with tag's color from theme
// TODO: disable default tag highlighting (active selections)

/*
TODO: Shortcuts
  - Highlight path (all tags in path)

TODO: Floating opening tag
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
      return name
    }

    const separator =
      pairs[i - 1].attributeNestingLevel < pair.attributeNestingLevel ? ' ~ ' : ' › '

    return str + separator + name
  }, '')

  status.text = status.text.trim().replace('›  ›', '»')

  if (tagsForPosition.length > 1) {
    status.show()
  } else {
    status.hide()
  }
}

export function activate(context: vscode.ExtensionContext) {
  config.configure(context)

  // Updates version for future migrations
  const extension = vscode.extensions.getExtension('vincaslt.highlight-matching-tag')
  const currentVersion: string | undefined = extension && extension.packageJSON.version

  if (config.hasOldSettings) {
    vscode.window
      .showInformationMessage(
        'Highlight Matching Tag has new default styles. Would you like to keep your existing styles or discard them and use new ones?',
        'Keep',
        'Discard'
      )
      .then((value: string) => {
        config.migrate(value === 'Keep')
      })
  }

  context.globalState.update('hmtVersion', currentVersion)

  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 120)
  const tagStyler = new TagStyler()

  status.tooltip = 'Path to tag'

  let editorText: string = ''
  let tagsList: hmt.PartialMatch[] = []

  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(evt => {
      const editor = evt.textEditor

      if (!config.isEnabled || !editor || editor !== vscode.window.activeTextEditor) {
        return
      }

      if (editorText !== editor.document.getText()) {
        editorText = editor.document.getText()
        tagsList = parseTags(editorText)
      }

      // Tag breadcrumbs
      if (config.showPath) {
        updateTagStatusBarItem(status, tagsList, editor.document.offsetAt(editor.selection.active))
      }

      // Highlight matching tags
      tagStyler.clearDecorations()
      editor.selections
        .map(sel => findMatchingTag(tagsList, editor.document.offsetAt(sel.active)))
        .filter(match => match && (match.opening !== match.closing || config.highlightSelfClosing))
        .forEach(match => tagStyler.decoratePair(match as hmt.Match, editor))
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('highlight-matching-tag.jumpToMatchingTag', jumpToMatchingTag)
  )
}
