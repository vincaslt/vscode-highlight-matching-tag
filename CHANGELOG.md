# Change Log

All notable changes to the "highlight-matching-tag" extension will be documented in this file.

### 0.10.0

- Adds `inner` style option to control styling of text between tags.

### 0.9.9

- Fixes self closing tag highlighting when there is no space before `/>`

### 0.9.8

- Removes affiliate link which for some reason was shown more than once. Sorry for that, it was a genuine mistake.

### 0.9.7

- Update README, Logo and dependencies.

### 0.9.6

- Fix tags matching with tags in comments, by @helix026

### 0.9.5

- Fixes matching for xml namespaces.

### 0.9.4

- Fixes matching for tags with dot in their name.

### 0.9.3

- Make attribute name rules stricter to better recognize opening tags
- Fix broken empty elements recognition

### 0.9.2

- New configuration options: `highlightFromName` and `hightlightFromAttributes`

### 0.9.1

- Allow customization of empty elements via configuration options
- Improve readme

### 0.9.0

- Add support for [empty elements](https://developer.mozilla.org/en-US/docs/Glossary/Empty_element) to be highlighted as self-closing tags.

### 0.8.6

- Add support for multi-root workspaces

### 0.8.5

- Added option to highlight surrounding tag pair from tag's inner content by @KamasamaK
- Fixed self-closing tags not being highlighted when there was no whitespace before tag end

### 0.8.4

- Enabled experimental parsing of multiline string attributes
- Added command to select contents of matching tag pair

### 0.8.3

- Multi-cursor matching by @KamasamaK
- Fix crashes in strings with escaped characters

### 0.8.2

- Fixes performance degradation over time

### 0.8.1

- Fixes crashing on escaped quotes
- Command to jump to matching tag by @KamasamaK
- Settings schema improvements by @KamasamaK

### 0.8.0

- Complete styling overhaul
- New configuration options for styles
- Show highlighted pair in ruler section (sidebar)
- Small performance and UX improvements

### 0.7.1

- Minor improvements to tag in status bar
- Experimental: inverse matching

### 0.7.0

- Show path to tag in the status bar:

![breadcrumbs](https://images2.imgbox.com/bc/0d/PzVAkYdU_o.png)

### 0.6.2

- Fixes occasional breaking when attributes are not in blocks
- Fixes breaking when string would be used as an attribute

### 0.6.1

- Small improvements for matching in code with unopened tags

### 0.6.0

- Rewrite of tag finding algorithm, which fixes several bugs.
- Additional styling options thanks to @beysim

### 0.5.1

- Better matching inside tag attributes
- Fixed crash when file has CRLF line endings

### 0.5.0

- Complete rewrite of the algorithm
- Fixed reported matching and perf issues

### 0.4.4

- Fix potential source of high CPU load
- Fix matching of multiple tags in one line
- Reduce lag in huge files

### 0.4.3

- Fix JSX rest spread syntax breaking matching

### 0.4.2

- Fix not highlighting when attribute has implied truthy value `<tag attr></tag>`

### 0.4.1

- Fix for tag names containing non-word characters

### 0.4.0

- Fixes bug: when using inline javascript comparison or arrow function, it would mistake the `< >` signs for actual opening tag.

### 0.3.0

- Match opening tag from closing tag

## 0.2.0

- Highlight multiline tags correctly
- Options for customizing left-right sides of highlighting
- Documentation updates

## 0.1.0

- Initial release of **highlight-matching-tag**
