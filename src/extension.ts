import * as vscode from 'vscode'
import { jumpToMatchingTag, selectPairContents } from './commands'
import config from './configuration'
import { findMatchingTag, getTagForPosition, getTagsForPosition } from './tagMatcher'
import { parseTags } from './tagParser'
import TagStyler from './tagStyler'

// TODO: highlighting scope (vertically)
// TODO: disable default tag highlighting (active selections)

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

function promptSettingsMigration() {
  if (config.hasOldSettings) {
    vscode.window
      .showInformationMessage(
        'Workspace is using old tag highlighting styles. Would you like to keep your existing styles or discard them and use default ones?',
        'Keep',
        'Discard'
      )
      .then((value: string) => {
        config.migrate(value === 'Keep')
      })
  }
}

export function activate(context: vscode.ExtensionContext) {
  // Updates version for future migrations
  const extension = vscode.extensions.getExtension('vincaslt.highlight-matching-tag')
  const oldVersion: string | undefined = context.globalState.get('hmtVersion')
  const newVersion: string | undefined = extension && extension.packageJSON.version

  // Settings may be updated asynchronously, so version update may need to be moved to after settings are checked
  config.configure({ context, onEditorChange: promptSettingsMigration })

  // Can get previous version, by reading it from hmtVersion global state, as it will be updated only here
  context.globalState.update('hmtVersion', newVersion)

  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 120)
  const tagStyler = new TagStyler()

  status.tooltip = 'Path to tag'

  let editorText: string = ''
  let tagsList: hmt.PartialMatch[] = []

  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection((evt) => {
      const editor = evt.textEditor

      if (!config.isEnabled || !editor || editor !== vscode.window.activeTextEditor) {
        return
      }

      if (editorText !== editor.document.getText()) {
        editorText = editor.document.getText()
        tagsList = parseTags(editorText, config.emptyElements)
      }

      // Tag breadcrumbs
      if (config.showPath) {
        updateTagStatusBarItem(status, tagsList, editor.document.offsetAt(editor.selection.active))
      }

      // Highlight matching tags
      tagStyler.clearDecorations()

      let matches = []
      if (config.highlightFromContent) {
        matches = editor.selections
          .map((sel) =>
            getTagForPosition(
              tagsList,
              editor.document.offsetAt(sel.active),
              config.highlightSelfClosing
            )
          )
          .filter((match) => match !== undefined)
      } else {
        matches = editor.selections
          .map((sel) =>
            findMatchingTag(
              tagsList,
              editor.document.offsetAt(sel.active),
              config.highlightFromName,
              config.highlightFromAttributes
            )
          )
          .filter(
            (match) => match && (match.opening !== match.closing || config.highlightSelfClosing)
          )
      }

      matches.forEach((match) => tagStyler.decoratePair(match as hmt.Match, editor))
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('highlight-matching-tag.jumpToMatchingTag', jumpToMatchingTag)
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('highlight-matching-tag.selectPairContents', selectPairContents)
  )
}
