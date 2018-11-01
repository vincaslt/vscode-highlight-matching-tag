# VSCode Highlight Matching Tag

![logo](https://i.imgbox.com/eZAMmnap.png)

Repo: <https://github.com/vincaslt/vscode-highlight-matching-tag>

This extension is intended to provide the missing functionality that should be built-in out of the box in VSCode - to highlight matching opening or closing tags. Optionally it also shows path to tag in the status bar.

Even though VSCode has implemented some basic matching recently, it's just that - basic. The built-in functionality is to match only from tag name and only for some file extensions. This extension will try to match from anywhere: tag attributes, from inside strings, any file, while also providing extensive styling options to customize how tags are highlighted.

> With great power, comes great responsibility (-Albert Einstein 🤦)

So I'm minimising it by supporting only what I work with:

- Basic HTML
- JSX

Other flavors (vue, php, angular) should work, but there are no guarantees. Feel free to report the issues on them still.

## Features

![demo](https://images2.imgbox.com/71/2a/zIA1XCzK_o.gif)

![breadcrumbs](https://images2.imgbox.com/bc/0d/PzVAkYdU_o.png)

## Extension Settings

Add any non-default setting to your workspace or user settings, to enable it. Add the default setting with different value to override.

| Variable                                      | Default                                          | Description                                                                                 |
| --------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `highlight-matching-tag.enabled`              | `true`                                           | Enables/disables the highlighting and status bar                                            |
| `highlight-matching-tag.showPath`             | `true`                                           | Enables/disables showing path to tag in status bar (e.g. `div > p > a`)                     |
| `highlight-matching-tag.showRuler`            | `true`                                           | Enables/disables showing highlighted tag pair in ruler section                             |
| `highlight-matching-tag.highlightSelfClosing` | `false`                                          | Should self-closing tags be highlighted too (can be useful for multiline self-closing tags) |
| `highlight-matching-tag.styles`               | `{ opening: { name: { underline: 'yellow' } } }` | Custom styling configuration, see [Styling Options](#styling-options)                       |

## Styling Options

By default, the tag pair's names are underlined with a yellow line. The setting looks like this:

```json
"highlight-matching-tag.styles": {
  "opening": {
    "name": {
      "underline": "yellow"
    }
  }
}
```

### Custom styling

Version 0.8.0 of this extension introduces new styling options, but old custom settings can be automatically migrated after update.

Now you can change highlighting styles by providing your own style in User Settings (JSON) as `highlight-matching-tag.styles`. The setting accepts an object with two fields:

- `opening` - opening tag styles when highlighting (or both, if closing style is not provided)
- `closing` - closing tag styles, optional

Each of the above are **_Style_** objects that can have any combination of fields defining styles for parts of the tag:

- `name` - decoration for name part of tag
- `left` - decoration for left side of tag (character <)
- `right` - decoration for right side of tag (character >)
- `full` - decoration for the whole tag (including < and >)

Each of the above are **_Decoration_** objects that define tag's style with optional fields:

- `highlight` - background color (e.g. "#666666")
- `underline` - underline color
- `surround` - surrounding border's color
- `custom` - custom css rules for styling ([`vscode.DecorationRenderOptions`](https://code.visualstudio.com/docs/extensionAPI/vscode-api#DecorationRenderOptions)). This is basically an object with camelCase CSS rules. It also can accept different styles for light or dark color themes.

### Styling Examples

This is the old version's style, with the new styling options:

```json
"highlight-matching-tag.styles": {
  "opening": {
    "left": {
      "custom": {
        "borderWidth": "0 0 0 1px",
        "borderStyle": "dotted",
        "borderColor": "white",
        "borderRadius": "5px"
      }
    },
    "right": {
      "custom": {
        "borderWidth": "0 1px 0 0",
        "borderStyle": "dotted",
        "borderColor": "white",
        "borderRadius": "5px"
      }
    }
  }
}
```

Result:

![old](https://images2.imgbox.com/3a/c2/ljn6gN20_o.png)

---

This is an example showing off different styling options:

```json
"highlight-matching-tag.styles": {
  "opening": {
    "left": {
      "underline": "yellow"
    },
    "right": {
      "surround": "#155FFA"
    },
    "name": {
      "highlight": "rgba(180, 20, 80, 0.3)"
    }
  },
  "closing": {
    "full": {
      "custom": {
        "dark": {
          "borderWidth": "0 0 1px 0",
          "borderColor": "white",
          "borderStyle": "solid",
          "borderRadius": "4px",
          "right": "10px"
        },
        "light": {
          "borderWidth": "0 0 1px 0",
          "borderColor": "brown",
          "borderStyle": "solid",
          "borderRadius": "4px",
          "right": "10px"
        }
      }
    }
  }
}
```

Result dark theme:

![dark](https://images2.imgbox.com/85/d6/qRBWNUgu_o.png)

Result light theme:

![light](https://images2.imgbox.com/16/66/y47CkpXm_o.png)

## Commands

Used in Command Palette (Win/Linux: `Ctrl`+`Shift`+`P`; Mac: `Cmd`+`Shift`+`P`) by searching for command name. Can also be bound to [Keyboard Shortcuts](https://code.visualstudio.com/docs/getstarted/keybindings).

- Jump to matching tag
