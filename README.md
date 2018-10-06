# highlight-matching-tag

![logo](https://i.imgbox.com/eZAMmnap.png)

Repo: https://github.com/vincaslt/vscode-highlight-matching-tag

This extension is intended to provide the missing functionality that should be built-in out of the box in VSCode - to highlight matching opening or closing tags.

Even though VSCode has implemented some basic matching recently, it's just that - basic. The built-in functionality is to match only from tag name and only for some file extensions. This extension will try to match from anywhere: tag attributes, from inside strings, any file.

> With great power, comes great responsibility (-Albert Einstein 🤦)

So I'm minimising it by supporting only what I work with:
- Basic HTML
- JSX

Other flavors (vue, php, angular) should work, but there are no guarantees. Feel free to report the issues on them still.

## Features

![demo](https://i.imgbox.com/DUXLFvW7.gif)

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
