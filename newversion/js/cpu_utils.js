import { BigMath } from "./utils.js";
import * as utils from "./utils.js";

const FLOAT_EXP_SIZES = {
    8: 4, 16: 5, 32: 8, 64: 11
};

class Register {
    constructor(n) {
        this.size = n;
        this.bits = [];

        for(let i=0;i<n;i++) this.bits.push(0);
    }

    simpleNotation(num) {
        num = BigInt(num);

        if(BigMath.abs(num) >= (2n ** BigInt(this.size - 1))) return false;

        if(num < 0n) this.bits[0] = 1;

        let binNum = BigMath.abs(num).toString(2);

        for(let i=0;i<binNum.length;i++) {
            this.bits[this.size - 1 - i] = parseInt(binNum[binNum.length - 1 - i]);
        }

        return true;
    }

    onesComplement(num) {
        num = BigInt(num);
        
        if(BigMath.abs(num) >= (2n ** BigInt(this.size - 1))) return false;

        if(num < 0n) num = (2n ** BigInt(this.size)) - 1n + num;

        let binNum = num.toString(2);

        for(let i=0;i<binNum.length;i++) {
            this.bits[this.size - 1 - i] = parseInt(binNum[binNum.length - 1 - i]);
        }

        return true;
    }

    twosComplement(num) {
        num = BigInt(num);
        
        if(num >= (2n ** BigInt(this.size - 1)) || num < -(2n ** BigInt(this.size - 1))) return false;

        if(num < 0n) num = 2n ** BigInt(this.size) + num;

        let binNum = num.toString(2);

        for(let i=0;i<binNum.length;i++) {
            this.bits[this.size - 1 - i] = parseInt(binNum[binNum.length - 1 - i]);
        }

        return true;
    }

    shiftRepr(num, minusOne = false) {
        num = BigInt(num);

        if(num - (minusOne?1n:0n) >= (2n ** BigInt(this.size - 1)) || num - (minusOne?1n:0n) < -(2n ** BigInt(this.size - 1))) return false;

        num = BigInt(num) + (2n ** BigInt(this.size - 1)) - (minusOne?1n:0n);

        let binNum = num.toString(2);

        for(let i=0;i<binNum.length;i++) {
            this.bits[this.size - 1 - i] = parseInt(binNum[binNum.length - 1 - i]);
        }

        return true;
    }

    fixedPoint(num, m, n) {
        num = parseFloat(num);

        if(m + n + 1 != this.size) return -1;

        let binNum = utils.toString(Math.abs(num), 2, n).split('.');

        if(binNum.length < 2) binNum.push('0');

        if(binNum[0].length > m) return 0;

        if(num < 0) this.bits[0] = 1;

        for(let i=0;i<binNum[0].length;i++) {
            this.bits[m - i] = parseInt(binNum[0][binNum[0].length - 1 - i]);
        }

        for(let i=0;i<binNum[1].length;i++) {
            this.bits[m + 1 + i] = parseInt(binNum[1][i]);
        }

        return 1;
    }

    floatPoint(num) {
        num = parseFloat(num);

        let expSize = FLOAT_EXP_SIZES[this.size];
        let sigSize = this.size - expSize - 1;

        let binNum = utils.toString(Math.abs(num), 2, this.size + expSize).split('.');

        if(binNum[0] == "") binNum[0] = '0';
        if(binNum.length < 2) binNum.push('0');

        if(num == 0) return true;

        let expCnt = 0;

        while(parseInt(binNum[0]) > 1) {
            expCnt++;
            binNum[1] = binNum[0].slice(-1) + binNum[1];
            binNum[0] = binNum[0].slice(0, -1);
        }

        while(parseInt(binNum[0]) == 0) {
            expCnt--;
            binNum[0] = binNum[1][0];
            binNum[1] = binNum[1].slice(1);
        }

        if(num < 0) this.bits[0] = 1;

        if(expCnt <= -(2**(expSize - 1)) + 1 || expCnt >= (2**(expSize - 1))) return false;

        let exp = (expCnt + (2**(expSize - 1)) - 1).toString(2);

        while(exp.length < expSize) exp = '0' + exp;

        for(let i=1;i<=expSize;i++) this.bits[i] = parseInt(exp[i-1]);

        for(let i=expSize+1;i<this.size;i++) {
            let ind = i - expSize - 1;
            if(ind < binNum[1].length) this.bits[i] = parseInt(binNum[1][ind]);
            else this.bits[i] = 0;
        }

        return true;
    }

    getSimpleValue() {
        let num = (this.bits[0] ? '-' : '') + BigInt('0b' + this.bits.slice(1).join(''), 2);

        return num;
    }

    getOnesComplementValue() {
        let neg = this.bits[0] > 0;

        if(neg) {
            return '-' + ((2n ** BigInt(this.size) - 1n) - BigInt('0b' + this.bits.join(''), 2));
        }
        else {
            return BigInt('0b' + this.bits.slice(1).join(''), 2).toString();
        }
    }

    getTwosComplementValue() {
        let neg = this.bits[0] > 0;

        if(neg) {
            return '-' + ((2n ** BigInt(this.size)) - BigInt('0b' + this.bits.join(''), 2));
        }
        else {
            return BigInt('0b' + this.bits.slice(1).join(''), 2).toString();
        }
    }

    getShiftValue(minus = false) {
        return BigInt('0b' + this.bits.join(''), 2) - (2n ** BigInt(this.size - 1) - (minus?1n:0n));
    }

    getFixedValue(m, n) {
        return (this.bits[0] ? '-':'') + utils.parseNumber(this.bits.slice(1,1+m).join('')+'.'+this.bits.slice(m+1).join(''), 2);
    }

    getFloatValue() {
        let expSize = FLOAT_EXP_SIZES[this.size];

        let sign = this.bits[0] ? '-' : '';

        if(this.bits.slice(1, 1 + expSize).every(i => i == 0)) {
            if(this.bits.slice(1 + expSize).every(i => i == 0)) {
                return '0';
            }
            else {
                return sign + utils.parseNumber('0.' + this.bits.slice(1 + expSize).join(''), 2);
            }
        }
        else if(this.bits.slice(1, 1 + expSize).every(i => i == 1)) {
            if(this.bits.slice(1 + expSize).every(i => i == 0)) {
                return sign + '∞';
            }
            else {
                return 'NaN';
            }
        }
        else {
            let exp = parseInt(this.bits.slice(1, 1 + expSize).join(''), 2) - (2 ** (expSize - 1) - 1);

            let base = utils.parseNumber('1.' + this.bits.slice(1 + expSize).join(''), 2);

            return sign + (base * 2 ** exp);
        }
    }
}

class Assembler {
    constructor(text) {
        this.text = text;

        this.ints = [
            this.add3, this.sub3, this.and3, this.or3, this.xor3, this.mul3, this.div3, this.cmp3, this.ld3, this.mov3im, this.st3,
            this.add2, this.sub2, this.or2, this.xor2, this.mul2, this.div2, this.shr2, this.ror2, this.not2, this.neg2, this.cmp2,
            this.mov2, this.ld2, this.st2, this.cmp2im, this.add2im, this.sub2im, this.and2im, this.or2im, this.xor2im, this.mul2im, this.div2im,
            this.jmp2, this.je2, this.jne2, this.jg2, this.jge2, this.jl2, this.jle2, this.st2d, this.ld2d, this.movac2d, this.movdr2d,
            this.add1, this.sub1, this.and1, this.or1, this.xor1, this.mul1, this.div1, this.shr1, this.ror1, this.not1, this.neg1, this.cmp1,
            this.mov1ac, this.mov1dr, this.ld1, this.st1, this.jmp1, this.je1, this.jne1, this.jg1, this.jge1, this.jl1, this.jle1, this.in1, this.out1,
            this.movac1, this.movdr1, this.halt0, this.in0, this.out0, this.movac0, this.movdr0, this.lbl, this.ld3_lbl, this.st3_lbl,
            this.jmp2_lbl, this.je2_lbl, this.jne2_lbl, this.jg2_lbl, this.jge2_lbl, this.jl2_lbl, this.jle2_lbl, this.st2d_lbl, this.ld2d_lbl
        ];

        this.memory = new Memory(8, 256);
        this.memoryPointer = 0;

        this.labels = {};
    }

    parse() {
        const lines = this.text.split('\n');
        this.memoryPointer = 0;

        lines.forEach(line => {
            for(let i=0;i<this.ints.length;i++) {
                if(this.ints[i](line)) break;
            }
        });
    }

    incrementPointer(inc) {
        this.memoryPointer += inc;
        this.memoryPointer %= this.memory.memSize;
    }

    ops3_1(regx, code, str) {
        let params;
        if(params = regx.exec(str)) {
            const strInt = `${code}${utils.toBin(parseInt(params[1], 16), 4)}${utils.toBin(parseInt(params[2], 16), 4)}${utils.toBin(parseInt(params[3], 16), 4)}`;
            this.memory.setValue(this.memoryPointer, parseInt(strInt.slice(0, 8), 2));
            this.memory.setValue(this.memoryPointer + 1, parseInt(strInt.slice(8), 2));
            this.incrementPointer(2);
            return true;
        }
        return false;
    }

    ops3_2(regx, code, str) {
        let params;
        if(params = regx.exec(str)) {
            let num3 = Number(params[2]);
            if(num3 >= 256) return false;
            const strInt = `${code}${utils.toBin(parseInt(params[1], 16), 4)}${utils.toBin(num3, 8)}`;
            this.memory.setValue(this.memoryPointer, parseInt(strInt.slice(0, 8), 2));
            this.memory.setValue(this.memoryPointer + 1, parseInt(strInt.slice(8), 2));
            this.incrementPointer(2);
            return true;
        }
        return false;
    }

    // Arithmetic and Logic
    add3 = (str) => this.ops3_1(/^[ \t]*add[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]*$/i, '0001', str);
    sub3 = (str) => this.ops3_1(/^[ \t]*sub[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]*$/i, '0010', str);
    and3 = (str) => this.ops3_1(/^[ \t]*and[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]*$/i, '0011', str);
    or3 = (str) => this.ops3_1(/^[ \t]*or[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]*$/i, '0100', str);
    xor3 = (str) => this.ops3_1(/^[ \t]*xor[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]*$/i, '0101', str);
    mul3 = (str) => this.ops3_1(/^[ \t]*mul[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]*$/i, '0110', str);
    div3 = (str) => this.ops3_1(/^[ \t]*div[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]*$/i, '0111', str);
    cmp3 = (str) => this.ops3_2(/^[ \t]*cmp[ \t]+r([0-9A-F])[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '1000', str);
    // Loading and Storing Values
    ld3 = (str) => this.ops3_2(/^[ \t]*ld[ \t]+r([0-9A-F])[ \t]+\[([0-9]+|0b[0-1]+|0x[0-9A-F]+)\][ \t]*$/i, '1001', str);
    mov3im = (str) => this.ops3_2(/^[ \t]*mov[ \t]+r([0-9A-F])[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '1010', str);
    st3 = (str) => this.ops3_2(/^[ \t]*st[ \t]+r([0-9A-F])[ \t]+\[([0-9]+|0b[0-1]+|0x[0-9A-F]+)\][ \t]*$/i, '1011', str);

    ops2_1(regx, code, str) {
        let params;
        if(params = regx.exec(str)) {
            const strInt = `${code}${utils.toBin(parseInt(params[1], 16), 4)}${utils.toBin(parseInt(params[2], 16), 4)}`;
            this.memory.setValue(this.memoryPointer, parseInt(strInt.slice(0, 8), 2));
            this.memory.setValue(this.memoryPointer + 1, parseInt(strInt.slice(8), 2));
            this.incrementPointer(2);
            return true;
        }
        return false;
    }

    ops2_2(regx, code, str) {
        let params;
        if(params = regx.exec(str)) {
            let num3 = Number(params[2]);
            if(num3 >= 16) return false;
            const strInt = `${code}${utils.toBin(parseInt(params[1], 16), 4)}${utils.toBin(num3, 4)}`;
            this.memory.setValue(this.memoryPointer, parseInt(strInt.slice(0, 8), 2));
            this.memory.setValue(this.memoryPointer + 1, parseInt(strInt.slice(8), 2));
            this.incrementPointer(2);
            return true;
        }
        return false;
    }

    ops2_3(regx, code, str) {
        let params;
        if(params = regx.exec(str)) {
            let num3 = Number(params[1]);
            if(num3 >= 256) return false;
            const strInt = `${code}${utils.toBin(num3, 8)}`;
            this.memory.setValue(this.memoryPointer, parseInt(strInt.slice(0, 8), 2));
            this.memory.setValue(this.memoryPointer + 1, parseInt(strInt.slice(8), 2));
            this.incrementPointer(2);
            return true;
        }
        return false;
    }

    // Arithmetic and Logic
    add2 = (str) => this.ops2_1(/^[ \t]*add[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]*$/i, '11000000', str);
    sub2 = (str) => this.ops2_1(/^[ \t]*sub[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]*$/i, '11000001', str);
    and2 = (str) => this.ops2_1(/^[ \t]*and[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]*$/i, '11000010', str);
    or2 = (str) => this.ops2_1(/^[ \t]*or[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]*$/i, '11000011', str);
    xor2 = (str) => this.ops2_1(/^[ \t]*xor[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]*$/i, '11000100', str);
    mul2 = (str) => this.ops2_1(/^[ \t]*mul[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]*$/i, '11000101', str);
    div2 = (str) => this.ops2_1(/^[ \t]*div[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]*$/i, '11000110', str);
    shr2 = (str) => this.ops2_2(/^[ \t]*shr[ \t]+r([0-9A-F])[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '11010111', str);
    ror2 = (str) => this.ops2_2(/^[ \t]*ror[ \t]+r([0-9A-F])[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '11011000', str);
    not2 = (str) => this.ops2_1(/^[ \t]*not[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]*$/i, '11001001', str);
    neg2 = (str) => this.ops2_1(/^[ \t]*neg[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]*$/i, '11001010', str);
    cmp2 = (str) => this.ops2_1(/^[ \t]*not[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]*$/i, '11001011', str);
    // Loading and Storing Values
    mov2 = (str) => this.ops2_1(/^[ \t]*mov[ \t]+r([0-9A-F])[ \t]+r([0-9A-F])[ \t]*$/i, '11001100', str);
    ld2 = (str) => this.ops2_1(/^[ \t]*ld[ \t]+r([0-9A-F])[ \t]+\[r([0-9A-F])\][ \t]*$/i, '11001101', str);
    st2 = (str) => this.ops2_1(/^[ \t]*st[ \t]+r([0-9A-F])[ \t]+\[r([0-9A-F])\][ \t]*$/i, '11001110', str);
    // Arithmetic and Logic - Immediate
    cmp2im = (str) => this.ops2_3(/^[ \t]*cmp[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '11001111', str);
    add2im = (str) => this.ops2_3(/^[ \t]*add[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '11010000', str);
    sub2im = (str) => this.ops2_3(/^[ \t]*sub[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '11010001', str);
    and2im = (str) => this.ops2_3(/^[ \t]*and[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '11010010', str);
    or2im = (str) => this.ops2_3(/^[ \t]*or[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '11010011', str);
    xor2im = (str) => this.ops2_3(/^[ \t]*xor[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '11010100', str);
    mul2im = (str) => this.ops2_3(/^[ \t]*mul[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '11010101', str);
    div2im = (str) => this.ops2_3(/^[ \t]*div[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '11010110', str);
    // Jump Instructions
    jmp2 = (str) => this.ops2_3(/^[ \t]*jmp[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '11100000', str);
    je2 = (str) => this.ops2_3(/^[ \t]*je[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '11100001', str);
    jne2 = (str) => this.ops2_3(/^[ \t]*jne[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '11100010', str);
    jg2 = (str) => this.ops2_3(/^[ \t]*jg[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '11100011', str);
    jge2 = (str) => this.ops2_3(/^[ \t]*jge[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '11100100', str);
    jl2 = (str) => this.ops2_3(/^[ \t]*jl[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '11100101', str);
    jle2 = (str) => this.ops2_3(/^[ \t]*jl[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '11100110', str);
    // Loading and Storing Values
    st2d = (str) => this.ops2_3(/^[ \t]*st[ \t]+\[([0-9]+|0b[0-1]+|0x[0-9A-F]+)\][ \t]*$/i, '11101000', str);
    ld2d = (str) => this.ops2_3(/^[ \t]*ld[ \t]+\[([0-9]+|0b[0-1]+|0x[0-9A-F]+)\][ \t]*$/i, '11101001', str);
    movac2d = (str) => this.ops2_3(/^[ \t]*mov[ \t]+ac[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '11101010', str);
    movdr2d = (str) => this.ops2_3(/^[ \t]*mov[ \t]+dr[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '11101011', str);

    ops1_1(regx, code, str) {
        let params;
        if(params = regx.exec(str)) {
            const strInt = `${code}${utils.toBin(parseInt(params[1], 16), 4)}`;
            this.memory.setValue(this.memoryPointer, parseInt(strInt.slice(0, 8), 2));
            this.memory.setValue(this.memoryPointer + 1, parseInt(strInt.slice(8), 2));
            this.incrementPointer(2);
            return true;
        }
        return false;
    }

    ops1_2(regx, code, str) {
        let params;
        if(params = regx.exec(str)) {
            let num3 = Number(params[1]);
            if(num3 >= 16) return false;
            const strInt = `${code}${utils.toBin(num3, 4)}`;
            this.memory.setValue(this.memoryPointer, parseInt(strInt.slice(0, 8), 2));
            this.memory.setValue(this.memoryPointer + 1, parseInt(strInt.slice(8), 2));
            this.incrementPointer(2);
            return true;
        }
        return false;
    }

    // Arithmetic and Logic
    add1 = (str) => this.ops1_1(/^[ \t]*add[ \t]+r([0-9A-F])[ \t]*$/i, '110101110000', str);
    sub1 = (str) => this.ops1_1(/^[ \t]*sub[ \t]+r([0-9A-F])[ \t]*$/i, '110101110001', str);
    and1 = (str) => this.ops1_1(/^[ \t]*and[ \t]+r([0-9A-F])[ \t]*$/i, '110101110010', str);
    or1 = (str) => this.ops1_1(/^[ \t]*or[ \t]+r([0-9A-F])[ \t]*$/i, '110101110011', str);
    xor1 = (str) => this.ops1_1(/^[ \t]*xor[ \t]+r([0-9A-F])[ \t]*$/i, '110101110100', str);
    mul1 = (str) => this.ops1_1(/^[ \t]*mul[ \t]+r([0-9A-F])[ \t]*$/i, '110101110101', str);
    div1 = (str) => this.ops1_1(/^[ \t]*div[ \t]+r([0-9A-F])[ \t]*$/i, '110101110110', str);
    shr1 = (str) => this.ops1_2(/^[ \t]*shr[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '110101110111', str);
    ror1 = (str) => this.ops1_2(/^[ \t]*ror[ \t]+([0-9]+|0b[0-1]+|0x[0-9A-F]+)[ \t]*$/i, '110101111000', str);
    not1 = (str) => this.ops1_1(/^[ \t]*not[ \t]+r([0-9A-F])[ \t]*$/i, '110101111001', str);
    neg1 = (str) => this.ops1_1(/^[ \t]*neg[ \t]+r([0-9A-F])[ \t]*$/i, '110101111010', str);
    cmp1 = (str) => this.ops1_1(/^[ \t]*not[ \t]+r([0-9A-F])[ \t]*$/i, '110101111011', str);
    // Loading and Storing Values
    mov1ac = (str) => this.ops1_1(/^[ \t]*mov[ \t]+r([0-9A-F])[ \t]+ac[ \t]*$/i, '110101111100', str);
    mov1dr = (str) => this.ops1_1(/^[ \t]*mov[ \t]+r([0-9A-F])[ \t]+dr[ \t]*$/i, '110101111101', str);
    ld1 = (str) => this.ops1_1(/^[ \t]*ld[ \t]+\[r([0-9A-F])\][ \t]*$/i, '110101111110', str);
    st1 = (str) => this.ops1_1(/^[ \t]*st[ \t]+\[r([0-9A-F])\][ \t]*$/i, '1101111111', str);
    // Jump Instructions
    jmp1 = (str) => this.ops1_1(/^[ \t]*jmp[ \t]+\[r([0-9A-F])\][ \t]*$/i, '111001110000', str);
    je1 = (str) => this.ops1_1(/^[ \t]*je[ \t]+\[r([0-9A-F])\][ \t]*$/i, '111001110001', str);
    jne1 = (str) => this.ops1_1(/^[ \t]*jne[ \t]+\[r([0-9A-F])\][ \t]*$/i, '111001110010', str);
    jg1 = (str) => this.ops1_1(/^[ \t]*jg[ \t]+\[r([0-9A-F])\][ \t]*$/i, '111001110011', str);
    jge1 = (str) => this.ops1_1(/^[ \t]*jmp[ \t]+\[r([0-9A-F])\][ \t]*$/i, '111001110100', str);
    jl1 = (str) => this.ops1_1(/^[ \t]*jmp[ \t]+\[r([0-9A-F])\][ \t]*$/i, '111001110101', str);
    jle1 = (str) => this.ops1_1(/^[ \t]*jmp[ \t]+\[r([0-9A-F])\][ \t]*$/i, '111001110110', str);
    // In / Out
    in1 = (str) => this.ops1_1(/^[ \t]*in[ \t]+r([0-9A-F])[ \t]*$/i, '111001111000', str);
    out1 = (str) => this.ops1_1(/^[ \t]*out[ \t]+r([0-9A-F])[ \t]*$/i, '111001111001', str);
    // Moving Values
    movac1 = (str) => this.ops1_1(/^[ \t]*mov[ \t]+ac[ \t]+r([0-9A-F])[ \t]*$/i, '111001111010', str);
    movdr1 = (str) => this.ops1_1(/^[ \t]*mov[ \t]+dr[ \t]+r([0-9A-F])[ \t]*$/i, '111001111011', str);

    ops0(regx, code, str) {
        let params;
        if(params = regx.exec(str)) {
            const strInt = `${code}`;
            this.memory.setValue(this.memoryPointer, parseInt(strInt.slice(0, 8), 2));
            this.memory.setValue(this.memoryPointer + 1, parseInt(strInt.slice(8), 2));
            this.incrementPointer(2);
            return true;
        }
        return false;
    }

    halt0 = (str) => this.ops0(/^[ \t]*halt[ \t]*$/i, '1110011101110000', str);
    in0 = (str) => this.ops0(/^[ \t]*in[ \t]*$/i, '1110011101110001', str);
    out0 = (str) => this.ops0(/^[ \t]*out[ \t]*$/i, '1110011101110010', str);
    movac0 = (str) => this.ops0(/^[ \t]*mov[ \t]+ac[ \t]+dr[ \t]*$/i, '1110011101110010', str);
    movdr0 = (str) => this.ops0(/^[ \t]*mov[ \t]+dr[ \t]+ac[ \t]*$/i, '1110011101110010', str);

    lbl = (str) => {
        let params;
        if(params = /^[ \t]*([A-Z]+):[ \t]*$/i.exec(str)) {
            let lbl = params[1];
            return this.setLabel(lbl);
        }
        return false;
    }

    setLabel(lbl) {
        if(this.labels[lbl]) return false;
        this.labels[lbl] = this.memoryPointer;
        return true;
    }

    ops3_lbl(regx, code, str) {
        let params;
        if(params = regx.exec(str)) {
            let lbl = params[2];
            if(!this.labels[lbl]) return false;
            const strInt = `${code}${utils.toBin(parseInt(params[1], 16), 4)}${utils.toBin(this.labels[lbl], 8)}`;
            this.memory.setValue(this.memoryPointer, parseInt(strInt.slice(0, 8), 2));
            this.memory.setValue(this.memoryPointer + 1, parseInt(strInt.slice(8), 2));
            this.incrementPointer(2);
            return true;
        }
        return false;
    }

    // Loading and Storing Values
    ld3_lbl = (str) => this.ops3_lbl(/^[ \t]*ld[ \t]+r([0-9A-F])[ \t]+\[([A-Z]+)\][ \t]*$/i, '1001', str);
    st3_lbl = (str) => this.ops3_lbl(/^[ \t]*st[ \t]+r([0-9A-F])[ \t]+\[([A-Z]+)\][ \t]*$/i, '1011', str);

    ops2_lbl(regx, code, str) {
        let params;
        if(params = regx.exec(str)) {
            let lbl = params[1];
            if(!this.labels[lbl]) return false;
            const strInt = `${code}${utils.toBin(parseInt(params[1], 16), 4)}${utils.toBin(this.labels[lbl], 8)}`;
            this.memory.setValue(this.memoryPointer, parseInt(strInt.slice(0, 8), 2));
            this.memory.setValue(this.memoryPointer + 1, parseInt(strInt.slice(8), 2));
            this.incrementPointer(2);
            return true;
        }
        return false;
    }

    // Jump Instructions
    jmp2_lbl = (str) => this.ops2_lbl(/^[ \t]*jmp[ \t]+([A-Z]+)[ \t]*$/i, '11100000', str);
    je2_lbl = (str) => this.ops2_lbl(/^[ \t]*je[ \t]+([A-Z]+)[ \t]*$/i, '11100001', str);
    jne2_lbl = (str) => this.ops2_lbl(/^[ \t]*jne[ \t]+([A-Z]+)[ \t]*$/i, '11100010', str);
    jg2_lbl = (str) => this.ops2_lbl(/^[ \t]*jg[ \t]+([A-Z]+)[ \t]*$/i, '11100011', str);
    jge2_lbl = (str) => this.ops2_lbl(/^[ \t]*jge[ \t]+([A-Z]+)[ \t]*$/i, '11100100', str);
    jl2_lbl = (str) => this.ops2_lbl(/^[ \t]*jl[ \t]+([A-Z]+)[ \t]*$/i, '11100101', str);
    jle2_lbl = (str) => this.ops2_lbl(/^[ \t]*jl[ \t]+([A-Z]+)[ \t]*$/i, '11100110', str);
    // Loading and Storing Values
    st2d_lbl = (str) => this.ops2_lbl(/^[ \t]*st[ \t]+\[([A-Z]+)\][ \t]*$/i, '11101000', str);
    ld2d_lbl = (str) => this.ops2_lbl(/^[ \t]*ld[ \t]+\[([A-Z]+)\][ \t]*$/i, '11101001', str);
}

class Memory {
    constructor(wordSize, memSize) {
        this.wordSize = wordSize;
        this.memSize = memSize;

        this.memory = [];

        for(let i=0;i<memSize;i++) {
            this.memory.push(0);
        }
    }

    setValue(addr, value) {
        this.memory[addr] = value;
    }

    getValue(addr) {
        return this.memory[addr];
    }

    getHexValues() {
        let n = Math.floor(Math.sqrt(this.memSize));
        let res = [];
        for(let i=0;i<n;i++) {
            res.push(this.memory.slice(i*n, (i+1)*n).map(i => utils.toHex(i, 2)));
        }
        return res;
    }
}

class SimpleRegister {
    constructor(size) {
        this.value = 0;
        this.size = size;
    }

    setBit(bit, value) {
        if(value == 1) {
            const op = 1 << (this.size - 1 - bit);
            this.value = this.value | op;
        }
        else {
            const op = ((1 << this.size) - 1) ^ (1 << (this.size - 1 - bit));
            this.value = this.value & op;
        }
    }

    getBit(bit) {
        const op = 1 << (this.size - 1 - bit);
        return (this.value & op) != 0 ? 1 : 0;
    }

    getHexVal() {
        return utils.toHex(this.value, this.size / 4);
    }
}

class CPU {
    constructor(memory) {
        /** @type {Memory}*/
        this.memory = memory;

        this.regs = [];
        for(let i=0;i<16;i++) this.regs.push(new SimpleRegister(8));

        this.ac = new SimpleRegister(8);
        this.dr = new SimpleRegister(8);
        this.ar = new SimpleRegister(16);
        this.pc = new SimpleRegister(16);
        this.ir = new SimpleRegister(16);
        this.sr = new SimpleRegister(8);

        this.REG_LIMIT = 0b100000000;

        this.outputBuffer = [];
    }

    increment() {
        this.pc.value += 2;
        this.pc.value %= this.memory.memSize;
    }

    getInstruction() {
        this.ir.value = (this.memory.getValue(this.pc.value) << 8) | this.memory.getValue(this.pc.value + 1);
    }

    setInput(text) {
        this.input = text;
        this.inputPointer = 0;
    }

    getOutput() {
        return this.outputBuffer.map(String.fromCharCode);
    }

    executeInstruction() {
        this.getInstruction();
        this.increment();
        this.decode();
    }

    decode() {
        const first4 = this.ir.value >> 12;
        switch(first4) {
            case 0b0001: return this.add3();
            case 0b0010: return this.sub3();
            case 0b0011: return this.and3();
            case 0b0100: return this.or3();
            case 0b0101: return this.xor3();
            case 0b0110: return this.mul3();
            case 0b0111: return this.div3();
            case 0b1000: return this.cmp3();
            case 0b1001: return this.ld3();
            case 0b1010: return this.mov3();
            case 0b1011: return this.st3();
            case 0b1100: return this.decode1100();
        }
        return false;
    }

    add3() {
        const reg0 = (this.ir.value >> 8) & 0b1111;
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const reg2 = (this.ir.value) & 0b1111;
        this.regs[reg0].value = (this.regs[reg1].value + this.regs[reg2].value) & (this.REG_LIMIT - 1);
        return true;
    }

    sub3() {
        const reg0 = (this.ir.value >> 8) & 0b1111;
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const reg2 = (this.ir.value) & 0b1111;
        this.regs[reg0].value = (this.regs[reg1].value + this.REG_LIMIT - this.regs[reg2].value) & (this.REG_LIMIT - 1);
        return true;
    }

    and3() {
        const reg0 = (this.ir.value >> 8) & 0b1111;
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const reg2 = (this.ir.value) & 0b1111;
        this.regs[reg0].value = this.regs[reg1].value & this.regs[reg2].value;
        return true;
    }

    or3() {
        const reg0 = (this.ir.value >> 8) & 0b1111;
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const reg2 = (this.ir.value) | 0b1111;
        this.regs[reg0].value = this.regs[reg1].value & this.regs[reg2].value;
        return true;
    }

    xor3() {
        const reg0 = (this.ir.value >> 8) & 0b1111;
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const reg2 = (this.ir.value) | 0b1111;
        this.regs[reg0].value = this.regs[reg1].value ^ this.regs[reg2].value;
        return true;
    }

    mul3() {
        const reg0 = (this.ir.value >> 8) & 0b1111;
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const reg2 = (this.ir.value) | 0b1111;
        this.regs[reg0].value = (this.regs[reg1].value * this.regs[reg2].value) & (this.REG_LIMIT - 1);
        return true;
    }

    div3() {
        const reg0 = (this.ir.value >> 8) & 0b1111;
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const reg2 = (this.ir.value) | 0b1111;
        if(this.regs[reg2].value == 0) this.regs[reg0].value = this.REG_LIMIT - 1;
        else this.regs[reg0].value = Math.floor(this.regs[reg1].value / this.regs[reg2].value) & (this.REG_LIMIT - 1);
        return true;
    }

    cmp3() {
        const reg0 = (this.ir.value >> 8) & 0b1111;
        const imm = (this.ir.value) & 0b11111111;
        const val = this.regs[reg0].value + this.REG_LIMIT - imm;
        this.sr.setBit(1, (val >> 7) & 1);
        this.sr.setBit(0, (val & (this.REG_LIMIT - 1) == 0 ? 1 : 0));
        return true;
    }

    ld3() {
        const reg0 = (this.ir.value >> 8) & 0b1111;
        const imm = (this.ir.value) & 0b11111111;
        this.regs[reg0].value = this.memory.getValue(imm);
        return true;
    }

    mov3() {
        const reg0 = (this.ir.value >> 8) & 0b1111;
        const imm = (this.ir.value) & 0b11111111;
        this.regs[reg0].value = imm;
        return true;
    }

    st3() {
        const reg0 = (this.ir.value >> 8) & 0b1111;
        const imm = (this.ir.value) & 0b11111111;
        this.memory.setValue(imm, this.regs[reg0].value);
        return true;
    }

    decode1100() {
        const next4 = (this.ir.value >> 8) & 0b1111;
        switch(next4) {
            case 0b0000: return this.add2();
            case 0b0001: return this.sub2();
            case 0b0010: return this.and2();
            case 0b0011: return this.or2();
            case 0b0100: return this.xor2();
            case 0b0101: return this.mul2();
            case 0b0110: return this.div2();
            case 0b0111: return this.shr2();
            case 0b1000: return this.ror2();
            case 0b1001: return this.not2();
            case 0b1010: return this.neg2();
            case 0b1011: return this.cmp2();
            case 0b1100: return this.mov2();
            case 0b1101: return this.ld2();
            case 0b1110: return this.st2();
            case 0b1111: return this.cmp2im();
        }
        return false;
    }

    add2() {
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const reg2 = (this.ir.value) & 0b1111;
        this.regs[reg1].value = (this.regs[reg1].value + this.regs[reg2].value) & (this.REG_LIMIT - 1);
        return true;
    }

    sub2() {
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const reg2 = (this.ir.value) & 0b1111;
        this.regs[reg1].value = (this.regs[reg1].value + this.REG_LIMIT - this.regs[reg2].value) & (this.REG_LIMIT - 1);
        return true;
    }

    and2() {
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const reg2 = (this.ir.value) & 0b1111;
        this.regs[reg1].value = this.regs[reg1].value & this.regs[reg2].value;
        return true;
    }

    or2() {
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const reg2 = (this.ir.value) & 0b1111;
        this.regs[reg1].value = this.regs[reg1].value & this.regs[reg2].value;
        return true;
    }

    xor2() {
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const reg2 = (this.ir.value) & 0b1111;
        this.regs[reg1].value = this.regs[reg1].value ^ this.regs[reg2].value;
        return true;
    }

    mul2() {
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const reg2 = (this.ir.value) & 0b1111;
        this.regs[reg1].value = (this.regs[reg1].value * this.regs[reg2].value) & (this.REG_LIMIT - 1);
        return true;
    }

    div2() {
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const reg2 = (this.ir.value) & 0b1111;
        if(this.regs[reg2].value == 0) this.regs[reg1].value = this.REG_LIMIT - 1;
        else this.regs[reg1].value = Math.floor(this.regs[reg1].value / this.regs[reg2].value) & (this.REG_LIMIT - 1);
        return true;
    }

    shr2() {
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const shval = (this.ir.value) & 0b0111;
        this.regs[reg1].value = this.regs[reg1].value >> shval;
        return true;
    }

    ror2() {
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const shval = (this.ir.value) & 0b0111;
        let temp = utils.toBin(this.regs[reg1].value, 8);
        temp = parseInt(temp.slice(8 - shval).concat(temp.slice(0, 8 - shval)), 2);
        this.regs[reg1].value = temp;
        return true;
    }

    not2() {
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const reg2 = (this.ir.value) & 0b1111;
        this.regs[reg1].value = (this.REG_LIMIT - 1) ^ this.regs[reg2].value;
        return true;
    }

    neg2() {
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const reg2 = (this.ir.value) & 0b1111;
        this.regs[reg1].value = (this.REG_LIMIT - this.regs[reg2].value) & (this.REG_LIMIT - 1);
        return true;
    }

    cmp2() {
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const reg2 = (this.ir.value) & 0b1111;
        const val = this.regs[reg1].value + this.REG_LIMIT - this.regs[reg2].value;
        this.sr.setBit(1, (val >> 7) & 1);
        this.sr.setBit(0, ((val & (this.REG_LIMIT - 1)) == 0 ? 1 : 0));
        return true;
    }

    mov2() {
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const reg2 = (this.ir.value) & 0b1111;
        this.regs[reg1].value = this.regs[reg2].value;
        return true;
    }

    ld2() {
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const reg2 = (this.ir.value) & 0b1111;
        this.regs[reg1].value = this.memory.getValue(this.regs[reg2].value);
        return true;
    }

    st2() {
        const reg1 = (this.ir.value >> 4) & 0b1111;
        const reg2 = (this.ir.value) & 0b1111;
        this.memory.setValue(this.regs[reg2].value, this.regs[reg1].value);
        return true;
    }

    cmp2im() {
        const imm = (this.ir.value) & 0b11111111;
        const val = this.ac.value + this.REG_LIMIT - imm;
        this.sr.setBit(1, (val >> 7) & 1);
        this.sr.setBit(0, ((val & (this.REG_LIMIT - 1)) == 0 ? 1 : 0));
        return true;
    }

    decode1101() {
        const next4 = (this.ir.value >> 8) & 0b1111;
        switch(next4) {
            case 0b0000: return this.add2im();
            case 0b0001: return this.sub2im();
            case 0b0010: return this.and2im();
            case 0b0011: return this.or2im();
            case 0b0100: return this.xor2im();
            case 0b0101: return this.mul2im();
            case 0b0110: return this.div2im();
            case 0b0111: return this.decode1101_0111();
        }
        return false;
    }

    add2im() {
        const imm = (this.ir.value) & 0b11111111;
        this.ac.value = (this.ac.value + imm) & (this.REG_LIMIT - 1);
        return true;
    }

    sub2im() {
        const imm = (this.ir.value) & 0b11111111;
        this.ac.value = (this.ac.value + this.REG_LIMIT - imm) & (this.REG_LIMIT - 1);
        return true;
    }

    and2im() {
        const imm = (this.ir.value) & 0b11111111;
        this.ac.value = this.ac.value & imm;
        return true;
    }

    or2im() {
        const imm = (this.ir.value) & 0b11111111;
        this.ac.value = this.ac.value | imm;
        return true;
    }

    xor2im() {
        const imm = (this.ir.value) & 0b11111111;
        this.ac.value = this.ac.value ^ imm;
        return true;
    }

    mul2im() {
        const imm = (this.ir.value) & 0b11111111;
        this.ac.value = (this.ac.value * imm) & (this.REG_LIMIT - 1);
        return true;
    }

    div2im() {
        const imm = (this.ir.value) & 0b11111111;
        if(imm == 0) this.ac.value = this.REG_LIMIT - 1;
        else this.ac.value = Math.floor(this.ac.value / imm) & (this.REG_LIMIT - 1);
        return true;
    }

    decode1110() {
        const next4 = (this.ir.value >> 8) & 0b1111;
        switch(next4) {
            case 0b0000: return this.jmp2();
            case 0b0001: return this.je2();
            case 0b0010: return this.jne2();
            case 0b0011: return this.jg2();
            case 0b0100: return this.jge2();
            case 0b0101: return this.jl2();
            case 0b0110: return this.jle2();

            case 0b1000: return this.st2im();
            case 0b1001: return this.ld2im();
            case 0b1010: return this.movac2();
            case 0b1011: return this.movdr2();
        }
        return false;
    }

    jmp2() {
        const addr = (this.ir.value) & 0b11111111;
        this.pc.value = addr;
        return true;
    }

    je2() {
        const addr = (this.ir.value) & 0b11111111;
        if(this.sr.getBit(0)) this.pc.value = addr;
        return true;
    }

    jne2() {
        const addr = (this.ir.value) & 0b11111111;
        if(!this.sr.getBit(0)) this.pc.value = addr;
        return true;
    }

    jg2() {
        const addr = (this.ir.value) & 0b11111111;
        if(!this.sr.getBit(0) && !this.sr.getBit(1)) this.pc.value = addr;
        return true;
    }

    jge2() {
        const addr = (this.ir.value) & 0b11111111;
        if(!this.sr.getBit(1)) this.pc.value = addr;
        return true;
    }

    jl2() {
        const addr = (this.ir.value) & 0b11111111;
        if(this.sr.getBit(1)) this.pc.value = addr;
        return true;
    }

    jle2() {
        const addr = (this.ir.value) & 0b11111111;
        if(this.sr.getBit(1) || this.sr.getBit(0)) this.pc.value = addr;
        return true;
    }

    st2im() {
        const addr = (this.ir.value) & 0b11111111;
        this.memory.setValue(addr, this.dr.value);
        return true;
    }

    ld2im() {
        const addr = (this.ir.value) & 0b11111111;
        this.dr.value = this.memory.getValue(addr);
        return true;
    }

    movac2() {
        const val = (this.ir.value) & 0b11111111;
        this.ac.value = val;
        return true;
    }

    movdr2() {
        const val = (this.ir.value) & 0b11111111;
        this.dr.value = val;
        return true;
    }

    decode1101_0111() {
        const next4 = (this.ir.value >> 4) & 0b1111;
        switch(next4) {
            case 0b0000: this.add1();
            case 0b0001: this.sub1();
            case 0b0010: this.and1();
            case 0b0011: this.or1();
            case 0b0100: this.xor1();
            case 0b0101: this.mul1();
            case 0b0110: this.div1();
            case 0b0111: this.shr1();
            case 0b1000: this.ror1();
            case 0b1001: this.not1();
            case 0b1010: this.neg1();
            case 0b1011: this.cmp1();
            case 0b1100: this.mov1ac();
            case 0b1101: this.mov1dr();
            case 0b1110: this.ld1();
            case 0b1111: this.st1();
        }
        return false;
    }

    add1() {
        const reg2 = (this.ir.value) & 0b1111;
        this.ac.value = (this.ac.value + this.regs[reg2].value) & (this.REG_LIMIT - 1);
        return true;
    }

    sub1() {
        const reg2 = (this.ir.value) & 0b1111;
        this.ac.value = (this.ac.value + this.REG_LIMIT - this.regs[reg2].value) & (this.REG_LIMIT - 1);
        return true;
    }

    and1() {
        const reg2 = (this.ir.value) & 0b1111;
        this.ac.value = this.ac.value & this.regs[reg2].value;
        return true;
    }

    or1() {
        const reg2 = (this.ir.value) & 0b1111;
        this.ac.value = this.ac.value & this.regs[reg2].value;
        return true;
    }

    xor1() {
        const reg2 = (this.ir.value) & 0b1111;
        this.ac.value = this.ac.value ^ this.regs[reg2].value;
        return true;
    }

    mul1() {
        const reg2 = (this.ir.value) & 0b1111;
        this.ac.value = (this.ac.value * this.regs[reg2].value) & (this.REG_LIMIT - 1);
        return true;
    }

    div1() {
        const reg2 = (this.ir.value) & 0b1111;
        if(this.regs[reg2].value == 0) this.ac.value = this.REG_LIMIT - 1;
        else this.ac.value = Math.floor(this.ac.value / this.regs[reg2].value) & (this.REG_LIMIT - 1);
        return true;
    }

    shr1() {
        const shval = (this.ir.value) & 0b0111;
        this.ac.value = this.ac.value >> shval;
        return true;
    }

    ror1() {
        const shval = (this.ir.value) & 0b0111;
        let temp = utils.toBin(this.ac.value, 8);
        temp = parseInt(temp.slice(8 - shval).concat(temp.slice(0, 8 - shval)), 2);
        this.ac.value = temp;
        return true;
    }

    not1() {
        const reg2 = (this.ir.value) & 0b1111;
        this.ac.value = (this.REG_LIMIT - 1) ^ this.regs[reg2].value;
        return true;
    }

    neg1() {
        const reg2 = (this.ir.value) & 0b1111;
        this.ac.value = (this.REG_LIMIT - this.regs[reg2].value) & (this.REG_LIMIT - 1);
        return true;
    }

    cmp1() {
        const reg2 = (this.ir.value) & 0b1111;
        const val = this.ac.value + this.REG_LIMIT - this.regs[reg2].value;
        this.sr.setBit(1, (val >> 7) & 1);
        this.sr.setBit(0, ((val & (this.REG_LIMIT - 1)) == 0 ? 1 : 0));
        return true;
    }

    mov1ac() {
        const reg2 = (this.ir.value) & 0b1111;
        this.regs[reg2].value = this.ac.value;
        return true;
    }

    mov1dr() {
        const reg2 = (this.ir.value) & 0b1111;
        this.regs[reg2].value = this.dr.value;
        return true;
    }

    ld1() {
        const reg2 = (this.ir.value) & 0b1111;
        this.dr.value = this.memory.getValue(this.regs[reg2].value);
        return true;
    }

    st1() {
        const reg2 = (this.ir.value) & 0b1111;
        this.dr.value = this.memory.getValue(this.regs[reg2].value);
        return true;
    }

    decode1110_0111() {
        const next4 = (this.ir.value >> 4) & 0b1111;
        switch(next4) {
            case 0b0000: return this.jmp1();
            case 0b0001: return this.je1();
            case 0b0010: return this.jne1();
            case 0b0011: return this.jg1();
            case 0b0100: return this.jge1();
            case 0b0101: return this.jl1();
            case 0b0110: return this.jle1();
            case 0b0111: return this.decode1110_0111_0111();
            case 0b1000: return this.in1();
            case 0b1001: return this.out1();
            case 0b1010: return this.movac1();
            case 0b1011: return this.movdr1();
        }
        return false;
    }

    jmp1() {
        const reg2 = (this.ir.value) & 0b1111;
        this.pc.value = this.regs[reg2].value;
        return true;
    }

    je1() {
        const reg2 = (this.ir.value) & 0b1111;
        if(this.sr.getBit(0)) this.pc.value = this.regs[reg2].value;
        return true;
    }

    jne1() {
        const reg2 = (this.ir.value) & 0b1111;
        if(!this.sr.getBit(0)) this.pc.value = this.regs[reg2].value;
        return true;
    }

    jg1() {
        const reg2 = (this.ir.value) & 0b1111;
        if(!this.sr.getBit(0) && !this.sr.getBit(1)) this.pc.value = this.regs[reg2].value;
        return true;
    }

    jge1() {
        const reg2 = (this.ir.value) & 0b1111;
        if(!this.sr.getBit(1)) this.pc.value = this.regs[reg2].value;
        return true;
    }

    jl1() {
        const reg2 = (this.ir.value) & 0b1111;
        if(this.sr.getBit(1)) this.pc.value = this.regs[reg2].value;
        return true;
    }

    jle1() {
        const reg2 = (this.ir.value) & 0b1111;
        if(this.sr.getBit(1) || this.sr.getBit(0)) this.pc.value = this.regs[reg2].value;
        return true;
    }

    in1() {
        const reg2 = (this.ir.value) & 0b1111;
        if(this.inputPointer < this.input.length) this.regs[reg2].value = this.input.charCodeAt(this.inputPointer);
        this.inputPointer++;
    }

    out1() {
        const reg2 = (this.ir.value) & 0b1111;
        this.outputBuffer.push(this.regs[reg2].value);
    }

    movac1() {
        const reg2 = (this.ir.value) & 0b1111;
        this.ac.value = this.regs[reg2].value;
        return true;
    }

    movdr1() {
        const reg2 = (this.ir.value) & 0b1111;
        this.dr.value = this.regs[reg2].value;
        return true;
    }

    decode1110_0111_0111() {
        const next4 = (this.ir.value >> 4) & 0b1111;
        switch(next4) {
        }
    }
}

export { Register, FLOAT_EXP_SIZES, Assembler, Memory, SimpleRegister, CPU };