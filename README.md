# iso7064
A simple and extensible JavaScript library implementing ISO/IEC 7064:2003 and some similar variant.  
Adapted from Daniel Wagner's Java implementation: https://github.com/danieltwagner/iso7064  
Compatibility: ES6+.

## Status
* Tests still largely missing. Use with caution!

## Example Usage

### Basic usage
```
let algo = new MOD11_2();
console.log(algo.compute("079"));   //"X"
console.log(algo.complete("079"));   //"079X"
console.log(algo.verify("079X"));   //true
```

### Extended usage
The "\[Danish\] MOD 29–2" for Danish alphabets illustrated in ISO/IEC 7064:2003 Annex B.

```javascript
class MOD29_2_DK extends PureSystemCalculator {
  constructor() {
    super({
      Modulus: 29,
      Radix: 2,
      ApplicationCharset: "ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ",
      CheckCharset: "ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ",
      IsDoubleCheckCharacter: false
    });
  }
}
```

## Syntax

### Syntax of usage
Declare and initialize algorithm:

```javascript
let algorithm = new ALGORITHM_CLASS();
```

Calculate the check character(s):

```javascript
//Get check character(s) only
algorithm.compute(input);

//Get whole string with check character(s)
algorithm.complete(input);

//[Parameter]
//input: String. The text to protect.

//[Return value]
//String, if input is valid
//Null, if input is not a string or is empty string
//Undefined, if input contains character not in defined charset
```

Verify a string:
```javascript
algorithm.verify(input);

//[Parameter]
//input: String. The text to verify.

//[Return value]
//Boolean, True if the string is valid and check is correct, False if the string is valid but check is incorrect.
//Null, if input is not a string, or if input length is not longer than algorithm check character(s).
//Undefined, if input (excl. check character) contains character not in defined charset
```

### Syntax for extension
Basic classes including `PureSystemCalculator`, `HybridSystemCalculator` and `PureSystemCalculator_poly` are extensible. You can create customized class based on them.

_Warning_: do NOT extend from pre-defined ISO algorithm classes, because they only have a constructer with no parameter.

```javascript
class CUSTOM_CLASS extends BASIC_CLASS {
  constructor() {
    super({
      [param1: value1,]
      [param2: value2,]
      [...,]
      [paramN: valueN]
    });
  }
}
```

Param | Type | Description | Comment
--- | --- | --- | ---
`Modulus` | Number | Modulus | Mandatory
`Radix` | Number | Radix | Mandatory
`Weight` | \[...Number\] | A preset weight array | Optional (default: []). Only for polynomial method
`Remainder` | Number | Remainder | Optional (default: 1)
`ApplicationCharset` | String | Character set of string to be protected | Mandatory. Must be sorted; indexed from zero
`CheckCharset` | String | Character set of check characters | Mandatory. Must be sorted; indexed from zero
`IsDoubleCheckCharacter` | Boolean | Whether two check characters | Mandatory.
`SingleDigitDesignation` | Number | Single digit designation (see section 5.4.2 in ISO/IEC 7064:2003) | Optional (default: 0).
`IsCaseSensitive` | Boolean | Whether case sensitive | Optional (default: false)