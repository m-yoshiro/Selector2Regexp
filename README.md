# Selector2Regexp

Convert CSS Selector to a Regexp string for searching matched elements in HTML.

![](https://github.com/m-yoshiro/Selector2Regexp/workflows/TEST/badge.svg)

## Usage

```sh
s2r '.button' # => stdout is a regexp keyword.

s2r '.button' | pbcopy

grep -E $(s2r '.button') index.html
```
