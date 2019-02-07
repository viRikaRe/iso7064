//The abstract class of pure system
class PureSystemCalculator {
  constructor({
    Modulus,
    Radix,
    Remainder = 1,
    ApplicationCharset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    CheckCharset,
    IsDoubleCheckCharacter,
    SingleDigitDesignation = 0,
    IsCaseSensitive = false
  }) {
    this.M = Modulus;
    this.r = Radix;
    this.acs = ApplicationCharset;
    this.ccs = CheckCharset;
    this.dblchk = IsDoubleCheckCharacter;
    this.R = Remainder;
    this.desig = SingleDigitDesignation;
    this.cs = IsCaseSensitive;
    this.patt_a = new RegExp('^[' + this.acs + ']+$', this.cs ? null : 'i')
  }

  //Returns the computed check character(s) only
  //If input type is invalid or input string is empty, return null;
  //If input string contains character outside charset, return undefined;
  compute(input) {
    if (typeof input !== "string" || input === "")
      return null;

    if (!this.patt_a.test(input))
      return undefined;

    if (!this.cs) input = input.toUpperCase();

    let P = 0;
    for (let i = 0; i < input.length; i++) {
      let a = this.acs.indexOf(input.charAt(i));
      P = ((P + a) * this.r) % this.M;
    }
    if (this.dblchk) {
      P = (P * this.r) % this.M;
      let V = this.M + this.R - P;
      let quotient = ~~(V / this.r);
      let remainder = V - quotient * this.r;
      return this.ccs.charAt(quotient) + this.ccs.charAt(remainder);
    } else {
      return this.ccs.charAt((this.M + this.R - P) % this.M);
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

//The abstract class of hybrid system
class HybridSystemCalculator extends PureSystemCalculator {
  constructor({
    Modulus,
    Remainder,
    ApplicationCharset,
    CheckCharset,
    SingleDigitDesignation,
    IsCaseSensitive
  }) {
    super({
      Modulus: Modulus,
      Radix: 2,
      Remainder: Remainder,
      ApplicationCharset: ApplicationCharset,
      CheckCharset: CheckCharset,
      IsDoubleCheckCharacter: false,
      SingleDigitDesignation: SingleDigitDesignation,
      IsCaseSensitive: IsCaseSensitive
    });
  }

  compute(input) {
    if (typeof input !== "string" || input === "")
      return null;

    if (!this.patt_a.test(input))
      return undefined;

    if (!this.cs) input = input.toUpperCase();

    let P = this.M;
    for (let i = 0; i < input.length; i++) {
      let a = this.acs.indexOf(input.charAt(i));
      P = (P + a) % this.M;
      if (P === 0)
        P = this.M;
      P = (P * this.r) % (this.M + 1);
    }
    return this.ccs.charAt((this.M + this.R - P) % this.M);
  }
}


//Here comes actually usable classes
class MOD11_2 extends PureSystemCalculator {
  constructor() {
    super({
      Modulus: 11,
      Radix: 2,
      ApplicationCharset: "0123456789",
      CheckCharset: "0123456789X",
      IsDoubleCheckCharacter: false,
      SingleDigitDesignation: 1
    });
    this.patt_fast = new RegExp(/^\d+[\dX]$/, this.cs ? null : 'i');
  }

  //3x faster on Chrome; 2x faster on Edge; the same on Firefox
  verify_fast(input) {
    if (typeof input !== "string" || input.length <= 1)
      return null;

    if (!this.patt_fast.test(input))
      return undefined;

    let P = 0;
    for (let i = 0; i < input.length - 1; i++) {
      P += +input.charAt(i);
      P <<= 1;
    }
    P += this.ccs.indexOf(input.charAt(input.length - 1));
    return P % 11 === 1;
  }
}

class MOD37_2 extends PureSystemCalculator {
  constructor() {
    super({
      Modulus: 37,
      Radix: 2,
      ApplicationCharset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      CheckCharset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ*",
      IsDoubleCheckCharacter: false,
      SingleDigitDesignation: 2
    });
  }
}

class MOD97_10 extends PureSystemCalculator {
  constructor() {
    super({
      Modulus: 97,
      Radix: 10,
      ApplicationCharset: "0123456789",
      CheckCharset: "0123456789",
      IsDoubleCheckCharacter: true,
      SingleDigitDesignation: 3
    });
    this.patt_fast = new RegExp(/^\d+$/);
  }

  //Simplified procedure for ISO/IEC 7064, MOD 97–10
  compute_fast(input) {
    if (typeof input !== "string" || input === "")
      return null;

    if (!this.patt_fast.test(input))
      return undefined;

    return `${98 - input * 100 % 97}`;
  }
  complete_fast(input) {
    let checkbit = this.compute_fast(input);
    if (typeof checkbit === "string")
      return input + checkbit;
    else
      return checkbit;
  }
  verify_fast(input) {
    if (typeof input !== "string" || input.length <= 2)
      return null;

    if (!this.patt_fast.test(input))
      return undefined;

    return input % 97 === 1;
  }
}

class MOD661_26 extends PureSystemCalculator {
  constructor() {
    super({
      Modulus: 661,
      Radix: 26,
      ApplicationCharset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      CheckCharset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      IsDoubleCheckCharacter: true,
      SingleDigitDesignation: 4
    });
  }
}

class MOD1271_36 extends PureSystemCalculator {
  constructor() {
    super({
      Modulus: 1271,
      Radix: 36,
      ApplicationCharset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      CheckCharset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      IsDoubleCheckCharacter: true,
      SingleDigitDesignation: 5
    });
  }
}

class MOD11_10 extends HybridSystemCalculator {
  constructor() {
    super({
      Modulus: 10,
      ApplicationCharset: "0123456789",
      CheckCharset: "0123456789",
      SingleDigitDesignation: 6
    });
  }
}

class MOD27_26 extends HybridSystemCalculator {
  constructor() {
    super({
      Modulus: 26,
      ApplicationCharset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      CheckCharset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      SingleDigitDesignation: 7
    });
  }
}

class MOD37_36 extends HybridSystemCalculator {
  constructor() {
    super({
      Modulus: 36,
      ApplicationCharset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      CheckCharset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      SingleDigitDesignation: 8
    });
  }
}


//GB 11643-1999
//https://zh.wikisource.org/wiki/GB_11643-1999_公民身份号码
class GB11643 extends MOD11_2 {
  //Virtually the same
}

//GB 11714-1997
//https://zh.wikisource.org/wiki/GB_11714-1997_全国组织机构代码编制规则
class GB11714 extends PureSystemCalculator {
  constructor() {
    super({
      Modulus: 11,
      Radix: 2,
      Remainder: 0,
      ApplicationCharset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      CheckCharset: "0123456789X",
      IsDoubleCheckCharacter: false
    });
  }
}

//GB 32100-2015
//https://zh.wikisource.org/wiki/GB_32100-2015_法人和其他组织统一社会信用代码编码规则
class GB32100 extends PureSystemCalculator {
  constructor() {
    super({
      Modulus: 31,
      Radix: 3,
      ApplicationCharset: "0123456789ABCDEFGHJKLMNPQRTUWXY",
      CheckCharset: "0123456789ABCDEFGHJKLMNPQRTUWXY",
      IsDoubleCheckCharacter: false,
      Remainder: 0
    });
  }
  compute(input) {
    input = input.toUpperCase();
    let P = 0;
    for (let i = input.length - 1; i >= 0; i--) {
      let a = this.acs.indexOf(input.charAt(i));
      P = ((P * this.r) % this.M + a);
    }
    return this.ccs.charAt((this.M + this.R - P) % this.M);
  }
}