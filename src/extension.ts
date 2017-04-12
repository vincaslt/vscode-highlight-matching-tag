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

    vscode.window.showInformationMessage(editor.document.positionAt(
            editor.document.offsetAt(tag.opening.end) +
            getTextAfter(tag.opening.end).indexOf(`</${tag.name}`)
        ).character.toString())

    // FIXME: not so naive
    return {
        ...tag,
        closing: identifyTag(editor, editor.document.positionAt(
            editor.document.offsetAt(tag.opening.end) +
            getTextAfter(tag.opening.end).indexOf(`</${tag.name}`) +
            2
        )).opening
    }
}

function findCurrentTag(editor: vscode.TextEditor): Tag {
    const currentTag = identifyTag(editor, editor.selection.active)

    if (!currentTag.name.startsWith('/')) {
        return findClosingTag(editor, currentTag)
    }

    return null // FIXME: yet
}

function decorateTag(editor: vscode.TextEditor, tag: Tag): vscode.TextEditorDecorationType {
    if (tag.opening.range !== null && tag.closing.range !== null) {
        const decoration: vscode.DecorationOptions[] = [
            { range: tag.opening.range },
            { range: tag.closing.range }
        ];
        const decorationType = vscode.window.createTextEditorDecorationType({
            borderWidth: '0 2px',
            borderStyle: 'solid',
            borderColor: 'yellow',
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