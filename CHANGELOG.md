# Change Log
All notable changes to the "higlight-matching-tag" extension will be documented in this file.

## 0.1.0

* Initial release of __highlight-matching-tag__

## 0.2.0

* Highlight multiline tags correctly
* Options for customizing left-right sides of highlighting
* Documentation updates

### 0.3.0

* Match opening tag from closing tag

### 0.4.0

* Fixes bug: when using inline javascript comparison or arrow function, it would mistake the `< >` signs for actual opening tag.

### 0.4.1

* Fix for tag names containing non-word characters

### 0.4.2

* Fix not highlighting when attribute has implied truthy value `<tag attr></tag>`

### 0.4.3

* Fix JSX rest spread syntax breaking matching

### 0.4.4

* Fix potential source of high CPU load
* Fix matching of multiple tags in one line
* Reduce lag in huge files

### 0.5.0

* Complete rewrite of the algorithm
* Fixed reported matching and perf issues

### 0.5.1

* Better matching inside tag attributes
* Fixed crash when file has CRLF line endings

### 0.6.0

* Rewrite of tag finding algorithm, which fixes several bugs.
* Additional styling options thanks to @beysim

### 0.6.1

* Small improvements for matching in code with unopened tags

### 0.6.2

* Fixes occasional breaking when attributes are not in blocks
* Fixes breaking when string would be used as an attribute

### 0.7.0

* Show path to tag in the status bar:

![breadcrumbs](https://images2.imgbox.com/bc/0d/PzVAkYdU_o.png)

### 0.7.1

* Minor improvements to tag in status bar
* Experimental: inverse matching

### 0.8.0

* Complete styling overhaul
* New configuration options for styles
* Show highlighted pair in ruler section (sidebar)
* Small performance and UX improvements

### 0.8.1

* Fixes crashing on escaped quotes
* Command to jump to matching tag by @KamasamaK
* Settings schema improvements by @KamasamaK

### 0.8.2

* Fixes performance degradation over time