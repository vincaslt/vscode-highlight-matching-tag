import * as vscode from 'vscode'
import { debounce } from './utils'

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
  public decoratePair = debounce((pair: hmt.Match, editor: vscode.TextEditor) => {
    this.clearDecorations()
    this.decorateTag(pair.opening, this.config.opening, editor, true)

    if (pair.opening.start !== pair.closing.start) {
      this.decorateTag(pair.closing, this.config.closing || this.config.opening, editor, false)
    }
  }, 15)

  private config: TagStylerConfig
  private activeDecorations: vscode.TextEditorDecorationType[] = []

  constructor(config: TagStylerConfig) {
    this.config = config
  }

  public clearDecorations() {
    this.activeDecorations.forEach(decoration => decoration.dispose())
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

  private applyDecoration(
    editor: vscode.TextEditor,
    decorationConfig: Decoration,
    range: vscode.Range
  ) {
    const selectionRange = new vscode.Range(editor.selection.anchor, editor.selection.active)
    const isSelected = !selectionRange.isEmpty && !!range.intersection(selectionRange)
    let borderColor = decorationConfig.surround || decorationConfig.underline

    let options: vscode.DecorationRenderOptions = {
      overviewRulerLane: vscode.OverviewRulerLane.Center,
      overviewRulerColor:
        decorationConfig.highlight ||
        decorationConfig.surround ||
        decorationConfig.underline ||
        'yellow'
    }

    // Removes decoration while selecting, and replaces it with underline
    if (!isSelected) {
      options.backgroundColor = decorationConfig.highlight
    } else if (!borderColor) {
      borderColor = decorationConfig.highlight
    }

    if (borderColor) {
      options.borderStyle = 'solid'
      options.borderColor = borderColor
      options.borderWidth = decorationConfig.surround ? '1px' : '0 0 1px 0'
    }

    options = { ...options, ...decorationConfig.custom }

    const decorationType = vscode.window.createTextEditorDecorationType(options)
    this.activeDecorations.push(decorationType)
    editor.setDecorations(decorationType, [range])
  }
}
