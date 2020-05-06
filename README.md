# Selector2Regexp

Convert CSS Selector to a Regexp string for searching matched elements in HTML.

**NOTE：This tool is an experiment.**

![](https://github.com/m-yoshiro/Selector2Regexp/workflows/TEST/badge.svg)

## Usage

```sh
s2r '.button'
# => class=['"]\w*\s*(?<!\w)(button)(?!\w)\s*\w*['"]

# Save to clipboard
s2r '.button' | pbcopy

# Grep html
grep -E $(s2r '.button') index.html
```
