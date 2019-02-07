//The abstract class of pure system (Polynomial Method)
class PureSystemCalculator_poly {
  constructor({
    Modulus,
    Radix,
    Weight = [],
    Remainder = 1,
    ApplicationCharset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    CheckCharset,
    IsDoubleCheckCharacter,
    SingleDigitDesignation = 0,
    IsCaseSensitive = false
  }) {
    this.M = Modulus;
    this.r = Radix;
    this.w = Weight;
    this.R = Remainder;
    this.acs = ApplicationCharset;
    this.ccs = CheckCharset;
    this.dblchk = IsDoubleCheckCharacter;
    this.desig = SingleDigitDesignation;
    this.cs = IsCaseSensitive;
  }

  //Returns the computed check character(s) only
  //If input type is invalid, return null;
  //If input string contains character outside charset, return undefined;
  compute(input) {
    if (typeof input !== "string" || input === "")
      return null;

    if (!this.cs) input = input.toUpperCase();
    let appLen = input.length;
    let chkLen = 1 + this.dblchk;
    let wLen = this.w.length;
    let S = 0;
    let i = appLen;
    while (i > 0) {
      let a = this.acs.indexOf(input.charAt(i - 1));
      if (a === -1)
        return undefined;
      if (wLen + i > appLen + chkLen)
        S += a * this.w[appLen + chkLen - i];
      else
        S += a * Math.pow(this.r, appLen + chkLen - i);
      i--;
    }

    if (this.dblchk) {
      let V = this.M + this.R - S % this.M;
      let quotient = ~~(V / this.r);
      let remainder = V - quotient * this.r;
      return this.ccs.charAt(quotient) + this.ccs.charAt(remainder);
    } else {
      return this.ccs.charAt((this.M + this.R - S % this.M) % this.M);
    }
  }

  //Returns the full string with check character(s)
  complete(input) {
    let checkbit = this.compute(input);
    if (typeof checkbit === "string")
      return input + checkbit;
    else
      return checkbit;
  }

  //Verify the full string
  verify(input) {
    let checkLen = 1 + this.dblchk;
    if (typeof input !== "string" || input.length <= checkLen)
      return null;
    let dataOnly = input.substr(0, input.length - checkLen);
    let checkbit = this.compute(dataOnly);
    if (typeof checkbit === "string")
      return checkbit === (this.cs ? input.substr(-checkLen) : input.substr(-checkLen).toUpperCase());
    else
      return checkbit;
  }
}


//Here comes actually usable classes
class MOD11_2_poly extends PureSystemCalculator_poly {
  constructor() {
    super({
      Modulus: 11,
      Radix: 2,
      Weight: [1, 2, 4, 8, 5, 10, 9, 7, 3, 6, 1, 2, 4, 8, 5, 10, 9, 7, 3, 6, 1, 2, 4, 2, 4, 8, 5, 10, 9, 7, 3, 6],
      ApplicationCharset: "0123456789",
      CheckCharset: "0123456789X",
      IsDoubleCheckCharacter: false,
      SingleDigitDesignation: 1
    });
  }
}

class MOD37_2_poly extends PureSystemCalculator_poly {
  constructor() {
    super({
      Modulus: 37,
      Radix: 2,
      Weight: [1, 2, 4, 8, 16, 32, 27, 17, 34, 31, 25, 13, 26, 15, 30, 23, 9, 18, 36, 35, 33, 29, 21, 5, 10, 20, 3, 6, 12, 24, 11, 22],
      ApplicationCharset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      CheckCharset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ*",
      IsDoubleCheckCharacter: false,
      SingleDigitDesignation: 2
    });
  }
}

class MOD97_10_poly extends PureSystemCalculator_poly {
  constructor() {
    super({
      Modulus: 97,
      Radix: 10,
      Weight: [1, 10, 3, 30, 9, 90, 27, 76, 81, 34, 49, 5, 50, 15, 53, 45, 62, 38, 89, 17, 73, 51, 25, 56, 75, 71, 31, 19, 93, 57, 85, 74],
      ApplicationCharset: "0123456789",
      CheckCharset: "0123456789",
      IsDoubleCheckCharacter: true,
      SingleDigitDesignation: 3
    });
  }
}

class MOD661_26_poly extends PureSystemCalculator_poly {
  constructor() {
    super({
      Modulus: 661,
      Radix: 26,
      Weight: [1, 26, 15, 390, 225, 562, 70, 498, 389, 199, 547, 341, 273, 488, 129, 49, 613, 74, 602, 449, 437, 125, 606, 553, 497, 363, 184, 157, 116, 372, 418, 292],
      ApplicationCharset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      CheckCharset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      IsDoubleCheckCharacter: true,
      SingleDigitDesignation: 4
    });
  }
}

class MOD1271_36_poly extends PureSystemCalculator_poly {
  constructor() {
    super({
      Modulus: 1271,
      Radix: 36,
      Weight: [1, 36, 25, 900, 625, 893, 373, 718, 428, 156, 532, 87, 590, 904, 769, 993, 160, 676, 187, 377, 862, 528, 1214, 490, 1117, 811, 1234, 1210, 346, 1017, 1024, 5],
      ApplicationCharset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      CheckCharset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      IsDoubleCheckCharacter: true,
      SingleDigitDesignation: 5
    });
  }
}