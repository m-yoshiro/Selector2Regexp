# Selector2Regexp

Generate regular expressions of JavaScript from CSS Selectors.

That regular expressions is for searching HTML elements which is matched given CSS selector.


[![npm version](https://badge.fury.io/js/selector-2-regexp.svg)](https://badge.fury.io/js/selector-2-regexp)
![](https://github.com/m-yoshiro/Selector2Regexp/workflows/TEST/badge.svg)

## Install

```sh
npm i selector-2-regexp
```

## Usage

```sh
s2r '.button'
# => <\s*([a-zA-Z]+)\s+.*(class=(?=['"])((?=(.*[\s'"]button[\s'"])).*)(?=['"])).*\s*>

# Save to clipboard
s2r '.button' | pbcopy
```

### Supported selector patterns

- **Single selector**

  ```sh
  # Type Selector
  s2r 'div'

  # Classs Selector
  s2r '.single'

  # Id Selector
  s2r '#app'

  # Attribute Selector
  s2r '[hidden]'
  s2r '[data-state=active]'
  s2r '[data-state*=active]'
  s2r '[data-state~=active]'
  s2r '[data-state^=active]'
  s2r '[data-state$=active]'
  ```

- **Descendant selector**

  ```sh
  s2r '.parent .child'
  ```

- **Child combinator**

  ```sh
  s2r '.parent > .child'
  ```

- **Next sibling combinator**

  ```sh
  s2r '.parent + .child'
  ```

- **General sibling combinator**

  ```sh
  s2r '.parent ~ .child'
  ```

- **Multiples**

  ```sh
  s2r '.button.button--primary'
  s2r 'div.panel.flex'
  ```

## Notes

- Generated regexps contain ES2018's features. "Lookbehind assertion" and "Negative lookbehind assertion".<br>
  Please check their statements:<br>https://caniuse.com/#feat=mdn-javascript_builtins_regexp_lookbehind_assertion,
