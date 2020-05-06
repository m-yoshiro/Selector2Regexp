# Selector2Regexp

Transform CSS Selector to a Regexp string for searching matched elements in HTML.

**NOTE：This tool is an experiment.**

- Generated regexps **only work JavaScript based environments**. ex. VSCode, Node.js, Chrome..
- Generated regexps contains ES2018's features. "Lookbehind assertion" and "Negative lookbehind assertion".<br>
  Please check their statements:<br>https://caniuse.com/#feat=mdn-javascript_builtins_regexp_lookbehind_assertion,

![](https://github.com/m-yoshiro/Selector2Regexp/workflows/TEST/badge.svg)

## Install

```sh
npm i selector-2-regexp
```

## Usage

```sh
s2r '.button'
# => class=['"]\w*\s*(?<!\w)(button)(?!\w)\s*\w*['"]

# Save to clipboard
s2r '.button' | pbcopy
```

<!--
```
# Grep html
grep -E $(s2r '.button') index.html
```
 -->
