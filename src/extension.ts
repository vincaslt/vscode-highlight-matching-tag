'use strict'

import * as vscode from 'vscode'

interface TagPosition {
    start: vscode.Position
    end: vscode.Position
    range: vscode.Range
}

interface Tag {
    name: string
    opening: TagPosition
    closing?: TagPosition
}

interface Decorations {
    left: vscode.TextEditorDecorationType
    right: vscode.TextEditorDecorationType
    highlight: vscode.TextEditorDecorationType
}

function getTextAfter(editor: vscode.TextEditor, pos: vscode.Position): string {
    return editor.document.getText().slice(editor.document.offsetAt(pos))
}

function getTextBefore(editor: vscode.TextEditor, pos: vscode.Position): string {
    return editor.document.getText().slice(0, editor.document.offsetAt(pos))
}

function identifyTag(editor: vscode.TextEditor, position: vscode.Position): Tag {
    const positionOffset = editor.document.offsetAt(position)
    const textBefore = getTextBefore(editor, position)

    const openingCharIndex = textBefore.lastIndexOf('<')
    const isOverBefore = textBefore.lastIndexOf('>') > openingCharIndex
    const endCharIndex = positionOffset +
        getTextAfter(editor, position).indexOf('>', openingCharIndex - positionOffset) + 1

    let startPos = null
    let endPos = null
    let range = null
    if (!isOverBefore && openingCharIndex !== -1 && endCharIndex !== -1 && endCharIndex > positionOffset) {
        startPos = editor.document.positionAt(openingCharIndex)
        endPos = editor.document.positionAt(endCharIndex)
        range = new vscode.Range(startPos, endPos)
    }

    const tagString: string = range ? editor.document.getText(range) : ''
    const tagName = tagString.trim().split(/\s/)[0]
        .replace('<', '')
        .replace('/>', '')
        .replace('>', '')

    const identifiedTag: Tag = {
        name: tagName,
        opening: {
            start: startPos,
            end: endPos,
            range
        }
    }

    if (tagString.endsWith('/>')) {
        identifiedTag.closing = identifiedTag.opening
    }

    return identifiedTag
}

function findClosingTag(editor: vscode.TextEditor, tag: Tag) {
    if (tag.closing) {
        return tag
    }

    const getClosingTag = (tag) => {
        const textAfter = getTextAfter(editor, tag.opening.end)
        let nextClosingIndex = textAfter.indexOf(`</${tag.name}`)
        let nextSameOpeningIndex = textAfter.indexOf(`<${tag.name}`)

        let newTag: Tag = null
        if (nextSameOpeningIndex !== -1 && nextClosingIndex > nextSameOpeningIndex) {
            newTag = findClosingTag(editor, identifyTag(editor, editor.document.positionAt(
                editor.document.offsetAt(tag.opening.end) +
                nextSameOpeningIndex + 1
            )))
            return getClosingTag({
                name: tag.name,
                opening: newTag.closing
            })
        }

        const foundTag = identifyTag(editor, editor.document.positionAt(
            editor.document.offsetAt(tag.opening.end) +
            nextClosingIndex + 2
        )).opening
        return {
            name: tag.name,
            opening: foundTag
        }
    }

    return {
        ...tag,
        closing: getClosingTag(tag).opening
    }
}

function findOpeningTag(editor: vscode.TextEditor, tag: Tag): Tag {
    const findOpeningTagByPosition = (position: vscode.Position) => {
        const beforeText = getTextBefore(editor, position)
        const lastSameTagPosition = beforeText.lastIndexOf(`<${tag.name.slice(1)}`)
        if (lastSameTagPosition !== -1) {
            const identifiedTag = findClosingTag(editor, 
                identifyTag(editor, editor.document.positionAt(lastSameTagPosition + 1))
            )
            if (identifiedTag.closing.range.isEqual(tag.closing.range)) {
                return identifiedTag
            }
            return findOpeningTagByPosition(identifiedTag.opening.start)
        }
        return null
    }

    return findOpeningTagByPosition(tag.closing.start)
}

function findCurrentTag(editor: vscode.TextEditor): Tag {
    const currentTag = identifyTag(editor, editor.selection.active)

    if (currentTag && !currentTag.name.startsWith('/')) {
        return findClosingTag(editor, currentTag)
    }

    return findOpeningTag(editor, {
        ...currentTag,
        closing: currentTag.opening
    })
}

function decorateTag(
    editor: vscode.TextEditor,
    tag: Tag,
    config: vscode.WorkspaceConfiguration
): Decorations {
    const disabled = !config.get('highlightSelfClosing') && tag.closing === tag.opening
    if (!disabled && tag.opening.range !== null && tag.closing.range !== null) {
        const leftDecoration: vscode.DecorationOptions[] = [
            { range: new vscode.Range(tag.opening.start, tag.opening.start.translate(0, 1)) },
            { range: new vscode.Range(tag.closing.start, tag.closing.start.translate(0, 1)) }
        ];
        const rightDecoration: vscode.DecorationOptions[] = [
            { range: new vscode.Range(tag.opening.end, tag.opening.end.translate(0, -1)) },
            { range: new vscode.Range(tag.closing.end, tag.closing.end.translate(0, -1)) }
        ];
        const highlightDecoration: vscode.DecorationOptions[] = [
            { range: new vscode.Range(tag.opening.start, tag.opening.end) },
            { range: new vscode.Range(tag.closing.start, tag.closing.end) }
        ];
        const highlightDecorationType = vscode.window.createTextEditorDecorationType(config.get('style'))
        const leftDecorationType = vscode.window.createTextEditorDecorationType(config.get('leftStyle'))
        const rightDecorationType = vscode.window.createTextEditorDecorationType(config.get('rightStyle'))
        editor.setDecorations(leftDecorationType, leftDecoration)
        editor.setDecorations(rightDecorationType, rightDecoration)
        editor.setDecorations(highlightDecorationType, highlightDecoration)
        return { left: leftDecorationType, right: rightDecorationType, highlight: highlightDecorationType }
    }

    return null
}

export function activate(context: vscode.ExtensionContext) {
    let activeDecorations: Decorations = null
    const config = vscode.workspace.getConfiguration('highlight-matching-tag')

    vscode.window.onDidChangeTextEditorSelection(() => {
        if (!config.get('enabled')) return

        let editor = vscode.window.activeTextEditor

        const dispose = (decoration: vscode.TextEditorDecorationType) => {
            if (decoration) return decoration.dispose()
        }

        if (activeDecorations) {
            dispose(activeDecorations.left)
            dispose(activeDecorations.right)
            dispose(activeDecorations.highlight)
        }
        activeDecorations = decorateTag(
            editor,
            findCurrentTag(editor),
            config
        )
    })
}
