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