import * as vscode from 'vscode'

interface Decoration {
  highlight?: string
  underline?: string
  surround?: string
  custom?: vscode.DecorationRenderOptions
}

interface TagDecorations {
  name?: Decoration
  left?: Decoration
  right?: Decoration
  full?: Decoration
}

interface TagStylerConfig {
  opening: TagDecorations
  closing?: TagDecorations
}

export default class TagStyler {
  private config: TagStylerConfig
  private activeDecorations: vscode.TextEditorDecorationType[] = []

  constructor(config: TagStylerConfig) {
    this.config = config
  }

  public clearDecorations() {
    this.activeDecorations.forEach(decoration => decoration.dispose())
  }

  public decoratePair(pair: hmt.Match, editor: vscode.TextEditor) {
    this.clearDecorations()
    this.decorateTag(pair.opening, this.config.opening, editor, true)

    if (pair.opening.start !== pair.closing.start) {
      this.decorateTag(pair.closing, this.config.closing || this.config.opening, editor, false)
    }
  }

  private decorateTag(
    tag: hmt.Tag,
    decorations: TagDecorations,
    editor: vscode.TextEditor,
    isOpening: boolean
  ) {
    const start = editor.document.positionAt(tag.start)
    const end = editor.document.positionAt(tag.end)

    if (decorations.full) {
      this.applyDecoration(editor, decorations.full, new vscode.Range(start, end))
    }

    if (decorations.name) {
      const nameStart = start.translate(0, isOpening ? 1 : 2)
      const nameEnd = nameStart.translate(0, tag.name.length)
      this.applyDecoration(editor, decorations.name, new vscode.Range(nameStart, nameEnd))
    }

    if (decorations.left) {
      this.applyDecoration(editor, decorations.left, new vscode.Range(start, start.translate(0, 1)))
    }

    if (decorations.right) {
      this.applyDecoration(editor, decorations.right, new vscode.Range(end.translate(0, -1), end))
    }
  }

  private applyDecoration(editor: vscode.TextEditor, decoration: Decoration, range: vscode.Range) {
    const options: vscode.DecorationRenderOptions = {
      overviewRulerColor:
        decoration.highlight || decoration.surround || decoration.underline || 'yellow',
      overviewRulerLane: vscode.OverviewRulerLane.Center,
      backgroundColor: decoration.highlight,
      borderWidth: decoration.surround ? '1px' : decoration.underline && '0 0 1px 0',
      borderColor: decoration.surround ? decoration.surround : decoration.underline,
      borderStyle: 'solid',
      ...decoration.custom
    }
    const decorationType = vscode.window.createTextEditorDecorationType(options)
    editor.setDecorations(decorationType, [range])
    this.activeDecorations.push(decorationType)
  }
}
