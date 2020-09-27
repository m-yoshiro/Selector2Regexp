# Selector2Regexp

Generate regular expressions of JavaScript from CSS selectors.

That regular expressions is for searching HTML elements which is matched given CSS selector.


[![npm version](https://badge.fury.io/js/selector-2-regexp.svg)](https://badge.fury.io/js/selector-2-regexp)
![](https://github.com/m-yoshiro/Selector2Regexp/workflows/TEST/badge.svg)

## Installation

```sh
$ npm i selector-2-regexp
```

## Usage

```sh
$ s2r '.button'
# => <\s*([a-zA-Z]+)\s+.*(class=(?=['"])((?=(.*[\s'"]button[\s'"])).*)(?=['"])).*\s*>

# Save to clipboard
$ s2r '.button' | pbcopy
```

### Basic

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

## Supported selectors

### Basic selectors

* Class selector ✅
* ID selector ✅
* Type selector ✅
* Attribute selector ✅


### Combinators

* Descendant combinator ✅
* Child combinator ✅
* General sibling combinator ✅
* Adjacent sibling combinator ✅
* Column combinator ☑️ 😢



## Notes

### With "combinators", a generated regular expression includes ES2018's features.

When given combinators, generated regular expressions that includes `"Lookbehind assertion"` and `"Negative lookbehind assertion"` which are ES2018's features.  

This regular expressions **might not work some environments not supported them** 😢.  
(Ex. IE, FireFox, old version Node.js)  

Please check their statements if you use with combinator.  
https://caniuse.com/#feat=mdn-javascript_builtins_regexp_lookbehind_assertion
