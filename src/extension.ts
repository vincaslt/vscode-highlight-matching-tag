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


function identifyTag(editor: vscode.TextEditor, position: vscode.Position): Tag {
    // TODO: lines above
    const lineText = editor.document.lineAt(position.line).text
    const lineTextBefore = lineText.slice(0, position.character)
    const openingCharIndex = lineTextBefore.lastIndexOf('<')

    let endCharIndex = lineText.indexOf(' ', openingCharIndex)
    if (endCharIndex === -1) {
        endCharIndex = lineText.indexOf('>', openingCharIndex)
        endCharIndex = endCharIndex !== -1 ? endCharIndex + 1 : -1
    }

    let startPos = null
    let endPos = null
    let range = null
    if (openingCharIndex !== -1 && endCharIndex !== -1 && endCharIndex > position.character) {
        startPos = new vscode.Position(position.line, openingCharIndex)
        endPos = new vscode.Position(position.line, endCharIndex)
        range = new vscode.Range(startPos, endPos)
    }


    const tagString = range ? editor.document.getText(range).replace('<', '').replace('>', '') : ''

    return {
        name: tagString,
        opening: {
            start: startPos,
            end: endPos,
            range
        }
    }
}

function findClosingTag(editor: vscode.TextEditor, tag: Tag) {
    const getTextAfter = (pos: vscode.Position) => editor.document.getText().slice(editor.document.offsetAt(pos))

    const getClosingTag = (tag) => {
        const textAfter = getTextAfter(tag.opening.end)
        let nextClosingIndex = textAfter.indexOf(`</${tag.name}`)
        let nextSameOpeningIndex = textAfter.indexOf(`<${tag.name}`)

        let newTag: Tag = null
        if (nextSameOpeningIndex !== -1 && nextClosingIndex > nextSameOpeningIndex) {
            newTag = findClosingTag(editor, identifyTag(editor, editor.document.positionAt(
                editor.document.offsetAt(tag.opening.end) +
                nextSameOpeningIndex +
                1
            )))
            return getClosingTag({
                name: tag.name,
                opening: newTag.closing
            })
        }

        const foundTag = identifyTag(editor, editor.document.positionAt(
            editor.document.offsetAt(tag.opening.end) +
            nextClosingIndex +
            2
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

function findCurrentTag(editor: vscode.TextEditor): Tag {
    const currentTag = identifyTag(editor, editor.selection.active)

    if (!currentTag.name.startsWith('/')) {
        return findClosingTag(editor, currentTag)
    }

    return null // TODO: closing
}

function decorateTag(editor: vscode.TextEditor, tag: Tag): vscode.TextEditorDecorationType {
    if (tag.opening.range !== null && tag.closing.range !== null) {
        const decoration: vscode.DecorationOptions[] = [
            { range: tag.opening.range },
            { range: tag.closing.range }
        ];
        const decorationType = vscode.window.createTextEditorDecorationType({
            borderWidth: '0 1px',
            borderStyle: 'solid',
            borderColor: 'white',
            borderRadius: '5px'
        })
        editor.setDecorations(decorationType, decoration)
        return decorationType
    }

    return null
}

export function activate(context: vscode.ExtensionContext) {
    let activeDecoration: vscode.TextEditorDecorationType = null

    vscode.window.onDidChangeTextEditorSelection(() => {
        let editor = vscode.window.activeTextEditor

        if (activeDecoration) {
            activeDecoration.dispose()
        }

        activeDecoration = decorateTag(editor, findCurrentTag(editor))
    })

    let disposable = vscode.commands.registerCommand('highlight-matching-tag.highlight', () => {
        
    })

    context.subscriptions.push(disposable)
}

export function deactivate() {
}