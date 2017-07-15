//The abstract class of pure system
class PureSystemCalculator {
  constructor({
    Modulus,
    Radix,
    Remainder = 1,
    ApplicationCharset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    CheckCharset,
    IsDoubleCheckCharacter
  }) {
    this.M = Modulus;
    this.r = Radix;
    this.acs = ApplicationCharset;
    this.ccs = CheckCharset;
    this.dblchk = IsDoubleCheckCharacter;
    this.R = Remainder;
  }

  //Returns the computed check character(s) only
  compute(input) {
    input = input.toUpperCase();
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
    return input + this.compute(input);
  }

  //Verify the full string
  verify(input) {
    let checkLen = 1 + this.dblchk;
    return this.compute(input.substr(0, input.length - checkLen)) === input.substr(-checkLen);
  }
}

//The abstract class of hybrid system
class HybridSystemCalculator extends PureSystemCalculator {
  constructor({
    Modulus,
    Radix,
    Remainder,
    ApplicationCharset,
    CheckCharset,
    IsDoubleCheckCharacter
  }) {
    super({
      Modulus: Modulus,
      Radix: 2,
      Remainder: Remainder,
      ApplicationCharset: ApplicationCharset,
      CheckCharset: CheckCharset,
      IsDoubleCheckCharacter: false
    });
  }

  compute(input) {
    input = input.toUpperCase();
    let P = this.M;
    for (let i = 0; i < input.length; i++) {
      let a = this.acs.indexOf(input.charAt(i));
      P = (P + a) % this.M;
      if (P === 0) P = this.M;
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
      IsDoubleCheckCharacter: false
    });
  }
}

class MOD37_2 extends PureSystemCalculator {
  constructor() {
    super({
      Modulus: 37,
      Radix: 2,
      ApplicationCharset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      CheckCharset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ*",
      IsDoubleCheckCharacter: false
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
      IsDoubleCheckCharacter: true
    });
  }
}

class MOD661_26 extends PureSystemCalculator {
  constructor() {
    super({
      Modulus: 661,
      Radix: 26,
      ApplicationCharset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      CheckCharset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      IsDoubleCheckCharacter: true
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
      IsDoubleCheckCharacter: true
    });
  }
}

class MOD11_10 extends HybridSystemCalculator {
  constructor() {
    super({
      Modulus: 10,
      ApplicationCharset: "0123456789",
      CheckCharset: "0123456789"
    });
  }
}

class MOD27_26 extends HybridSystemCalculator {
  constructor() {
    super({
      Modulus: 26,
      ApplicationCharset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      CheckCharset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    });
  }
}

class MOD37_36 extends HybridSystemCalculator {
  constructor() {
    super({
      Modulus: 26,
      ApplicationCharset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      CheckCharset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    });
  }
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