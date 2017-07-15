# iso7064
A simple JavaScript library that implements ISO/IEC 7064:2003 and some similar variant.
Adapted from Daniel Wagner's Java implementation: https://github.com/danieltwagner/iso7064

## Warning
* No validation yet.
* Polynomial method not implemented yet.
* Tests not implemented yet.

## Usage
```
let algo = new MOD11_2();
console.log(algo.compute("079"));   //"X"
console.log(algo.verify("079X"));   //true
```
