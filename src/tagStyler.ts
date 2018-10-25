import * as vscode from 'vscode'

// TODO: Don't highlight the actual selected part
// TODO: Class

interface StylerConfig {
  name?: vscode.DecorationRenderOptions
}

export function createTagStyler(config: StylerConfig) {
  const activeDecorations: vscode.TextEditorDecorationType[] = []

  function decorate(
    editor: vscode.TextEditor,
    style: vscode.DecorationRenderOptions,
    ranges: vscode.Range[]
  ) {
    const decorationType = vscode.window.createTextEditorDecorationType(style)
    editor.setDecorations(decorationType, ranges)
    activeDecorations.push(decorationType)
  }

  function clearDecorations() {
    activeDecorations.forEach(decoration => decoration.dispose())
  }

  function decoratePair(pair: hmt.Match, editor: vscode.TextEditor) {
    clearDecorations()

    if (config.name) {
      const openingNameStart = editor.document.positionAt(pair.opening.start + 1)
      const openingNameEnd = editor.document.positionAt(
        pair.opening.start + 1 + pair.opening.name.length
      )
      const closingNameStart = editor.document.positionAt(pair.closing.start + 2)
      const closingNameEnd = editor.document.positionAt(
        pair.closing.start + 2 + pair.closing.name.length
      )
      const nameRanges = [
        new vscode.Range(openingNameStart, openingNameEnd),
        new vscode.Range(closingNameStart, closingNameEnd)
      ]

      decorate(editor, config.name, nameRanges)
    }
  }

  return { clearDecorations, decoratePair }
}
