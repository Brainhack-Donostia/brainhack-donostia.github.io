# eslint-plugin-dollar-sign [![Build Status](https://travis-ci.org/erikdesjardins/eslint-plugin-dollar-sign.svg?branch=master)](https://travis-ci.org/erikdesjardins/eslint-plugin-dollar-sign)

Enforce $varName for jQuery assignment.

Based on the `requireDollarBeforejQueryAssignment` rule from JSCS.

## Usage

`npm i --save-dev eslint-plugin-dollar-sign`

```json
{
  "plugins": [
    "dollar-sign"
  ],
  "rules": {
    "dollar-sign/dollar-sign": [2, "ignoreProperties"]
  }
}
```
