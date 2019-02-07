# iso7064
A simple JavaScript library implementing ISO/IEC 7064:2003 and some similar variant.  
Adapted from Daniel Wagner's Java implementation: https://github.com/danieltwagner/iso7064  
Compatibility: ES6+.

## Status
* Tests still largely missing. Use with caution!

## Usage
```
let algo = new MOD11_2();
console.log(algo.compute("079"));   //"X"
console.log(algo.complete("079"));   //"079X"
console.log(algo.verify("079X"));   //true
```
