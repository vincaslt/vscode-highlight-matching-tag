# highlight-matching-tag

![logo](https://i.imgbox.com/eZAMmnap.png)

Repo: https://github.com/vincaslt/vscode-highlight-matching-tag

This extension is intended to provide the missing functionality that should be built-in out of the box in VSCode - to highlight matching opening or closing tags.

## Features

![demo](https://i.imgbox.com/iIMnrqFm.gif)

## Extension Settings

Add any non-default setting to your workspace or user settings, to enable it. Add the default setting with different value to override.

### Enabled default settings

* `highlight-matching-tag.enabled` - (boolean: default true). Enables/disables the extension.

__Example:__

```
"highlight-matching-tag.enabled": true
```

* `highlight-matching-tag.leftStyle` - (TextEditorDecorationType: default see example). Style to use for left side of the matched tag (useful if you want borders on the sides). Proide falsy value to disable: `null` or `false`.

__Example:__

```
"highlight-matching-tag.leftStyle": {
    "borderWidth": "0 0 0 1px",
    "borderStyle": "dotted",
    "borderColor": "white",
    "borderRadius": "5px"
}
```

* `highlight-matching-tag.rightStyle` - (TextEditorDecorationType: default see example). See above property, it is the same, but for right side.

__Example:__

```
"highlight-matching-tag.rightStyle": {
    "borderWidth": "0 1px 0 0",
    "borderStyle": "dotted",
    "borderColor": "white",
    "borderRadius": "5px"
}
```

### Disabled non-default settings

* `highlight-matching-tag.highlightSelfClosing` - (boolean: default false). Should self-closing tags be highlighted too (can be useful for multiline self-closing tags).

__Example:__

```
"highlight-matching-tag.highlightSelfClosing": false
```

* `highlight-matching-tag.style` - (TextEditorDecorationType: default none). How to style
the whole tag. Properties are camel-cased CSS rules.

__Example:__

```
"highlight-matching-tag.style": {
    "textDecoration": "underline"
}
```

## Known Issues

* Only works on opening tags yet

## Release Notes

### 0.1.0

* Initial release of __highlight-matching-tag__

### 0.2.0

* Highlight multiline tags correctly
* Options for customizing left-right sides of highlighting
* Documentation updates