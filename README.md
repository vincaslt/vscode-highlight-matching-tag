<p align="center">
  <img src="https://images2.imgbox.com/c6/c3/sLkQluHb_o.png">
</p>

<p align="center">
<a title="Average rating" href="https://marketplace.visualstudio.com/items?itemName=vincaslt.highlight-matching-tag#review-details">
<img src="https://vsmarketplacebadge.apphb.com/rating-star/vincaslt.highlight-matching-tag.svg?style=for-the-badge&colorA=facf37&colorB=ebb521">
</a>
<a title="Unique downloads" href="https://marketplace.visualstudio.com/items?itemName=vincaslt.highlight-matching-tag">
<img src="https://vsmarketplacebadge.apphb.com/downloads-short/vincaslt.highlight-matching-tag.svg?style=for-the-badge&colorA=a537fa&colorB=872aeb">
</a>
<br/>
<a title="Become a VSCode expert" href="https://a.paddle.com/v2/click/16413/111559?link=1227" targer="_blank">
<img src="https://img.shields.io/badge/Supported%20by-VSCode%20Power%20User%20Course%20→-gray.svg?colorA=655BE1&colorB=4F44D6&style=for-the-badge">
</a>
</p>

<p align="center">
<i>Everyone occasionally envies their colleague the amazing speed at which they seem to move around in their IDE. <br/> We recommend a <a title="Become a VSCode expert" href="https://a.paddle.com/v2/click/16413/111559?link=1227" targer="_blank">VSCode Power User Course</a>, so that you can be the expert <br/> who stuns everyone with their efficiency and speed.</i>
</p>

# VSCode Highlight Matching Tag

_GitHub repository:_ <https://github.com/vincaslt/vscode-highlight-matching-tag>

This extension highlights matching opening and/or closing tags. Optionally it also shows path to tag in the status bar.
Even though VSCode has some basic tag matching, it's just that - basic. This extension will try to match tags anywhere: from tag attributes, inside of strings, any files, while also providing extensive styling options to customize how tags are highlighted.

Officially supported markup: **HTML** and **JSX**. Other flavors (XML, Vue, Angular, PHP) should work, but there are no guarantees. Feel free to report the issues on them anyway.

## Features

![demo](https://images2.imgbox.com/71/2a/zIA1XCzK_o.gif)

![breadcrumbs](https://images2.imgbox.com/bc/0d/PzVAkYdU_o.png)

## Extension Settings

You can override any default [settings](https://code.visualstudio.com/docs/getstarted/settings) with your own values. The plugin supports [workspace settings](https://code.visualstudio.com/docs/editor/multi-root-workspaces) as well as global user settings.

| Variable                                         | Default                                          | Description                                                                                 |
| ------------------------------------------------ | ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `highlight-matching-tag.enabled`                 | `true`                                           | Enables/disables the highlighting and status bar                                            |
| `highlight-matching-tag.showPath`                | `true`                                           | Enables/disables showing path to tag in status bar (e.g. `div > p > a`)                     |
| `highlight-matching-tag.showRuler`               | `true`                                           | Enables/disables showing highlighted tag pair in ruler section                              |
| `highlight-matching-tag.highlightSelfClosing`    | `false`                                          | Should self-closing tags be highlighted too (can be useful for multiline self-closing tags) |
| `highlight-matching-tag.highlightFromContent`    | `false`                                          | Whether to highlight matching tag from inside the tag content                               |
| `highlight-matching-tag.highlightFromName`       | `true`                                           | Whether to highlight matching tag from the tag name                                         |
| `highlight-matching-tag.highlightFromAttributes` | `true`                                           | Whether to highlight matching tag from the tag attributes                                   |
| `highlight-matching-tag.noDefaultEmptyElements`  | `false`                                          | Don't use default HTML empty elements                                                       |
| `highlight-matching-tag.customEmptyElements`     | `null`                                           | Custom [empty elements](#empty-elements) in addition to the default HTML empty elements     |
| `highlight-matching-tag.styles`                  | `{ opening: { name: { underline: 'yellow' } } }` | Custom styling configuration, see [Styling Options](#styling-options)                       |

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

- **opening: _Style_** - opening tag styles when highlighting (or both, if closing style is not provided)
- **closing: _Style_** - closing tag styles, optional
- **inner: _Decoration_** - styles of text between opening and closing tags, optional

**_Style_** objects can have any combination of fields defining styles for parts of the tag:

- **name: _Decoration_** - decoration for name part of tag
- **left: _Decoration_** - decoration for left side of tag (character <)
- **right: _Decoration_** - decoration for right side of tag (character >)
- **full: _Decoration_** - decoration for the whole tag (including < and >)

**_Decoration_** objects define tag's style with optional fields:

- **highlight: _string_** - background color (e.g. "#666666")
- **underline: _string_** - underline color
- **surround: _string_** - surrounding border's color
- **custom: _vscode.DecorationRenderOptions_** - custom css rules for styling ([`vscode.DecorationRenderOptions`](https://code.visualstudio.com/docs/extensionAPI/vscode-api#DecorationRenderOptions)). This is basically an object with camelCase CSS rules. It can also accept different styles for light or dark color themes.

Colors used in gutter are the same as the ones used for highlighting/underlining, or yellow by default for custom rules. You can change them by setting: `overviewRulerColor` decoration option to the color that you want.

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
        "borderRadius": "5px",
        "overviewRulerColor": "white"
      }
    },
    "right": {
      "custom": {
        "borderWidth": "0 1px 0 0",
        "borderStyle": "dotted",
        "borderColor": "white",
        "borderRadius": "5px",
        "overviewRulerColor": "white"
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
- Select contents of matching tag pair

## Empty elements

The plugin is able interpret some unclosed tags as self-closing. By default they correspond with HTML [empty elements](https://developer.mozilla.org/en-US/docs/Glossary/Empty_element) (img, meta, link, etc.).

You can disable or extend them by changing `highlight-matching-tag.noDefaultEmptyElements` and/or `highlight-matching-tag.customEmptyElements` configuration options.

For example, this will additionally assume that `custom` and `no-content` elements are always self-closing and can't have any content:

```
"highlight-matching-tag.highlightSelfClosing": true,
"highlight-matching-tag.customEmptyElements": [
  "custom",
  "no-content"
]
```

## Contributing

If you want to contribute to the development of the plugin, please consult the [contribution guidelines](https://github.com/vincaslt/vscode-highlight-matching-tag/blob/master/CONTRIBUTING.md).
