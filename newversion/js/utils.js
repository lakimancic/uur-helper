// Stabalizing float numbers
const stabilize = (num) => {
    return Math.round(num * 1e10) / 1e10;
};

// Count char in string
const countChar = (str, char) => {
    let cnt = 0;
    for(let i=0;i<str.length;i++) cnt += +(str[i] == char);
    return cnt;
};

// Different chars
const diffChar = (s1, s2) => {
    let cnt = 0;
    for(let i=0;i<s1.length;i++) cnt += +(s1[i] != s2[i]);
    return cnt;
};

// Digits
const DIGS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Parse number
const parseNumber = (str, base) => {
    let startExp = str.indexOf('.');
    if(startExp === -1) startExp = str.length;
    startExp -= 1;

    let num = str.replace('.','').split('').map((val, ind) => Number(/^\d+$/.test(val) ? val : (10 + val.charCodeAt(0) - 65)) * Math.pow(base, startExp - ind)).reduce((pv, cv) => pv + cv, 0);
    return num;
};

// ToString number
const toString = (str, base, preciison) => {
    let res1 = "", res2 = "", minus = false;
    let num = Number(str);
    if(num < 0) {
        minus = true;
        num = -num;
    }
    let intNum = Math.floor(num);
    let decNum = stabilize(num - intNum);

    while(intNum > 0) {
        res1 = DIGS[intNum % base] + res1;
        intNum = Math.floor(intNum / base);
    }

    if(minus) res1 = "-" + res1;

    if(!decNum) return res1;

    let precCnt = 0;
    while(decNum && precCnt < preciison) {
        decNum = stabilize(decNum * base);
        res2 += Math.floor(decNum);
        decNum = stabilize(decNum - Math.floor(decNum));
        precCnt++;
    }

    return res1 + '.' + res2;
};

// Binary String
const toBin = (num, size) => {
    let val = num.toString(2);
    return `0`.repeat(size - val.length) + val;
};

const toLogBin = (num, size) => {
    num = parseInt(num);
    let val = num.toString(2);
    size = Math.floor(Math.log2(size - 1)) + 1;
    return `0`.repeat(size - val.length) + val;
};

const getLog2Arr = (num) => {
    let arr = [];
    for(let i=0;i<Math.floor(Math.log2(num - 1)) + 1;i++) arr.push(i+1);
    return arr;
};

// Hex String
const toHex = (num, size) => {
    let val = num.toString(16);
    return `0`.repeat(size - val.length) + val;
};

// Rotate point around another point
const rotateAround = (p1, p2, angle) => {
    return {
        x: p1.x + (p2.x - p1.x) * Math.cos(angle) - (p2.y - p1.y) * Math.sin(angle),
        y: p1.y + (p2.x - p1.x) * Math.sin(angle) + (p2.y - p1.y) * Math.cos(angle)
    };
};

// Distance between points
const dist = (p1, p2) => {
    return Math.sqrt((p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y));
};

// Circle Intersection
const getIntersectC2 = (a, b, R, c, d, r) => {
    if(Math.round(b * 1000) != Math.round(d * 1000)) {
        const p = (a - c) / (d - b);
        const q = (R*R - r*r + c*c - a*a - b*b + d*d) / (2 * (d - b));
        const a1 = 1 + p*p;
        const b1 = -2*a + 2*p*q - 2*p*b;
        const c1 = a*a + b*b + q*q - 2*b*q - R*R;
        let x1 = (-b1 + Math.sqrt(b1*b1 - 4*a1*c1)) / ( 2 * a1);
        let y1 = p*x1 + q;
        let x2 = (-b1 - Math.sqrt(b1*b1 - 4*a1*c1)) / ( 2 * a1);
        let y2 = p*x2 + q;
        return { x1, y1, x2, y2 };
    } else {
        const x12 = (a*a - c*c + r*r - R*R) / ( 2 * (a - c) );
        const y1 = b - Math.sqrt(R*R - (x12 - a)*(x12 - a));
        const y2 = b + Math.sqrt(R*R - (x12 - a)*(x12 - a));
        return { x1: x12, y1, x2: x12, y2 };
    }
};

// Norm
const norm = (p) => {
    return Math.sqrt(p.x*p.x + p.y*p.y);
};

// Matrix
const formatMatrix = (mat) => {
    return `\\begin{bmatrix}${mat.map(i => i.map(j => j ? j.sort().join('+') : '\\varnothing').join('&')).join('\\\\')}\\end{bmatrix}`;
};

const mulArr = (arr1, arr2) => {
    let res = [];
    if(!arr1 || !arr2) return undefined;
    arr1.forEach(a => {
        arr2.forEach(b => {
            res.push(a+b);
        });
    });
    return res;
};

const mulMat = (mat1, mat2) => {
    let res = [];
    const n = mat1.length;
    for(let i=0;i<n;i++) {
        let pres = [];
        for(let j=0;j<n;j++) {
            let tadd = [];
            for(let k=0;k<n;k++) {
                let temp = mulArr(mat1[i][k], mat2[k][j]);
                if(temp) tadd = tadd.concat(temp);
            }
            if(tadd.length > 0) pres.push(tadd);
            else pres.push(undefined);
        }
        res.push(pres);
    }
    return res;
};

// BigInt Math
class BigMath {
    static abs(num) {
        return num < 0n ? -num : num;
    }

    static pow(num, exp) {
        return num ** exp;
    }
}

// BCD
class BCD {
    static gray(num, bits = 4) {
        let str = (num ^ (num >> 1)).toString(2);

        return '0'.repeat(bits - str.length) + str;
    }

    static hamming(num) {
        let bits = [];

        for(let i=0;i<4;i++) {
            bits.unshift(num % 2);
            num >>= 1;
        }

        let A = bits[0] ^ bits[1] ^ bits[3];
        let B = bits[0] ^ bits[2] ^ bits[3];
        let C = bits[1] ^ bits[2] ^ bits[3];

        return A.toString() + B.toString() + bits[0].toString() + C.toString() + bits.slice(1).join('');
    }

    static excess3(num) {
        let str = (num + 3).toString(2);

        return '0'.repeat(4 - str.length) + str;
    }
}

// Export
export { stabilize, countChar, diffChar, parseNumber, toString, toBin, toLogBin, getLog2Arr, toHex, rotateAround, dist, getIntersectC2, norm, mulArr, mulMat, formatMatrix, BigMath, BCD };