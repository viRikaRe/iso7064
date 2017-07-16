# iso7064
A simple JavaScript library that implements ISO/IEC 7064:2003 and some similar variant.  
Adapted from Daniel Wagner's Java implementation: https://github.com/danieltwagner/iso7064

## Status
* Polynomial method not implemented yet.
* Tests not implemented yet. Use with caution!

## Usage
```
let algo = new MOD11_2();
console.log(algo.compute("079"));   //"X"
console.log(algo.verify("079X"));   //true
```
