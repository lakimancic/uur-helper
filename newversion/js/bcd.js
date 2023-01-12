import { BCD } from "./utils.js";

const FONT_SIZE = 20;

let bcdNames = [ "8421", "2421", "5421", "5211", "4221", "3321" ];

const bcds = {
    "8421": [ "0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111", "1000", "1001" ],
    "2421": [ "0000", "0001", "0010", "0011", "0100", "1011", "1100", "1101", "1110", "1111" ],
    "5421": [ "0000", "0001", "0010", "0011", "0100", "1000", "1001", "1010", "1011", "1100" ],
    "5211": [ "0000", "0001", "0011", "0101", "0111", "1000", "1001", "1011", "1101", "1111" ],
    "4221": [ "0000", "0001", "0010", "0011", "1000", "0111", "1100", "1101", "1110", "1111" ],
    "3321": [ "0000", "0001", "0010", "0011", "0101", "1010", "1100", "1101", "1110", "1111" ]
};

const regularBCDs = () => {
    let table = $(`<table class="bcd"></table>`);

    table.append($(`<tr><th>Dekadna cifra</th>${bcdNames.map(i => `<th>${i}</th>`).join('')}</tr>`));

    for(let i=0;i<10;i++) {
        table.append($(`<tr><td>${i}</td>${bcdNames.map(j => `<td>${bcds[j][i]}</td>`).join('')}</tr>`));
    }

    $("#res1").html(``);
    $("#res1").append(table);
};

const specialBCDs = () => {
    let table = $(`<table class="bcd"></table>`);

    table.append($(`<tr><th>Dekadna cifra</th><th>Grejov kod</th><th>Hafmenov kod</th><th>"višak 3"</th></tr>`));

    for(let i=0;i<10;i++) {
        table.append($(`<tr><td>${i}</td><td>${BCD.gray(i)}</td><td>${BCD.hamming(i)}</td><td>${BCD.excess3(i)}</td></tr>`));
    }

    $("#res2").html(``);
    $("#res2").append(table);
};

const convertToBCD = (num, bcd) => {
    num = parseFloat(num);
    let neg = false;

    let res = `(${num})_{10} = `;

    if(num < 0) {
        num = parseFloat(num.toString().split('').map(i => {
            if(i == '-') return 9;
            else if(i == '.') return i;
            else {
                return 9 - parseInt(i);
            }
        }).join(''));
        neg = true;
    }

    res += `(${num})_{NK} = `;

    if(neg) {
        let add = num.toString().split('').map(i => {
            if(i == '.') return i;
            else return 0;
        });
        add[add.length - 1] = '1';
        add = parseFloat(add.join(''));

        num += add; 
    }

    res += `(${num})_{PK} = `;

    if(bcdNames.includes(bcd)) {
        res += `(${num.toString().split('').map(i => {
            if(i == '.') return i;
            else {
                return bcds[bcd][parseInt(i)];
            }
        }).join('\\;')})_{${bcd}}`;
    }
    else if(bcd == 'gray') {
        res += `(${num.toString().split('').map(i => {
            if(i == '.') return i;
            else {
                return BCD.gray(parseInt(i));
            }
        }).join('\\;')})_{Grejov\\;kod}`;
    }
    else if(bcd == 'hamm') {
        res += `(${num.toString().split('').map(i => {
            if(i == '.') return i;
            else {
                return BCD.hamming(parseInt(i));
            }
        }).join('\\;')})_{Hafmenov\\;kod}`;
    }
    else if(bcd == 'exc3') {
        res += `(${num.toString().split('').map(i => {
            if(i == '.') return i;
            else {
                return BCD.excess3(parseInt(i));
            }
        }).join('\\;')})_{višak\\;3}`;
    }

    return res;
};

$("#calc1").click(() => {
    $("#res3").html(``);

    let num = $("#num1").val();
    let bcdMethod = $("#bcd1").val();

    if(!/^-?[0-9]+(\.[0-9]+)?$/.test(num)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno unet broj!'
        });
        return;
    }

    if(bcdMethod == 'nil') {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Niste izabrali BCD kod!'
        });
        return;
    }

    $("#res3").append(
        $(`<p>\\[${convertToBCD(num, bcdMethod)}\\]</p>`)
    );

    MathJax.typeset();
});

const getAddBCDRender = (bcdOps) => {
    let linesNum = (bcdOps.length - 1) / 3;
    let dots = bcdOps[0].includes('.') ? 1 : 0;

    /** @type {HTMLCanvasElement} */
    const canvas = $("<canvas></canvas>")[0];
    canvas.classList.add('mx-auto');
    canvas.classList.add('my-2');
    canvas.classList.add('d-block');

    canvas.width = FONT_SIZE + FONT_SIZE * 3 * (bcdOps[0].length - dots) + dots * FONT_SIZE;
    canvas.height = bcdOps.length * (FONT_SIZE + FONT_SIZE / 5) + FONT_SIZE * linesNum / 5;

    const ctx = canvas.getContext('2d');
    ctx.font = `${FONT_SIZE * 0.9}px cmFont`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const dotInd = bcdOps[0].indexOf('.');
    let cy = FONT_SIZE / 10, cx;

    bcdOps.forEach((val, i) => {
        if(i % 2 == 1) {
            ctx.fillText('+', FONT_SIZE / 2, cy + FONT_SIZE / 2);
        }
        if(i > 0 && i % 2 == 0) {
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(0, cy + FONT_SIZE / 10);
            ctx.lineTo(canvas.width, cy + FONT_SIZE / 10);
            ctx.stroke();

            cy += FONT_SIZE * 3 / 10;
        }

        let cx = FONT_SIZE;

        val.forEach((j, jnd) => {
            if(jnd == dotInd) {
                ctx.fillText(j, cx + FONT_SIZE / 2, cy + FONT_SIZE / 2);
                cx += FONT_SIZE;
            } else {
                ctx.fillText(j, cx + FONT_SIZE * 3 / 2, cy + FONT_SIZE / 2);
                cx += FONT_SIZE * 3;
            }
        });

        cy += FONT_SIZE;
    });

    return canvas;
};

const bcdAddition = (num1, num2) => {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);

    let onum1 = num1, onum2 = num2;

    let neg1 = false, neg2 = false;

    if(num1 < 0) neg1 = true;
    if(num2 < 0) neg2 = true;

    num1 = Math.abs(num1).toString().split('.');
    num2 = Math.abs(num2).toString().split('.');

    while(num1[0].length < num2[0].length) num1[0] = '0' + num1[0];
    while(num2[0].length < num1[0].length) num2[0] = '0' + num2[0];

    num1[0] = '00' + num1[0];
    num2[0] = '00' + num2[0];

    if(num1.length > 1 || num2.length > 1) {
        if(num1.length == 1) num1.push('0');
        if(num2.length == 1) num2.push('0');

        while(num1[1].length < num2[1].length) num1[1] += '0';
        while(num2[1].length < num1[1].length) num2[1] += '0';
    }

    num1 = num1.join('.');
    num2 = num2.join('.');

    let res1 = `(${onum1})_{10} = `;
    let res2 = `(${onum2})_{10} = `;

    if(neg1) {
        num1 = num1.split('').map(i => {
            if(i == '.') return i;
            else return 9 - parseInt(i);
        }).join('');

        res1 += `(${num1})_{NK} = `;

        let add = num1.split('').map(i => {
            if(i == '.') return i;
            else return 0;
        });
        add[add.length - 1] = '1';
        add = parseFloat(add.join(''));

        let isDot = num1.includes('.');
        num1 = parseFloat(num1) + add;
        num1 = num1.toString();
        if(!num1.includes('.') && isDot) num1 += '.';
        while(num1.length < num2.length) num1 += '0';

        res1 += `(${num1})_{PK} = `;
    }
    else {
        res1 += `(${num1})_{NK} = `;
        res1 += `(${num1})_{PK} = `;
    }

    if(neg2) {
        num2 = num2.split('').map(i => {
            if(i == '.') return i;
            else return 9 - parseInt(i);
        }).join('');

        res2 += `(${num2})_{NK} = `;

        let add = num2.split('').map(i => {
            if(i == '.') return i;
            else return 0;
        });
        add[add.length - 1] = '1';
        add = parseFloat(add.join(''));

        let isDot = num2.includes('.');
        num2 = parseFloat(num2) + add; 
        num2 = num2.toString();
        if(!num2.includes('.') && isDot) num2 += '.';
        while(num2.length < num1.length) num2 += '0';

        res2 += `(${num2})_{PK} = `;
    } 
    else {
        res2 += `(${num2})_{NK} = `;
        res2 += `(${num2})_{PK} = `;
    }

    res1 += `(${num1.split('').map(i => {
        if(i == '.') return i;
        else return bcds['8421'][parseInt(i)];
    }).join('\\;')})_{8421}`;

    res2 += `(${num2.split('').map(i => {
        if(i == '.') return i;
        else return bcds['8421'][parseInt(i)];
    }).join('\\;')})_{8421}`;

    let bcdOps = [
        num1.split('').map(i => {
            if(i == '.') return i;
            else return bcds['8421'][parseInt(i)];
        }),
        num2.split('').map(i => {
            if(i == '.') return i;
            else return bcds['8421'][parseInt(i)];
        })
    ];

    let carry = 0;

    let split1 = num1.split('').reverse();
    let split2 = num2.split('').reverse();

    let new1 = split1.map((i, ind) => {
        if(i == '.') return i;

        let res = parseInt(i) + parseInt(split2[ind]) + carry;
        carry = res >> 4;

        return res;
    }).reverse();

    bcdOps.push(new1.map(i => {
        if(i == '.') return i;
        let str = (parseInt(i) & 0b1111).toString(2);
        return '0'.repeat(4 - str.length) + str;
    }));

    let corr1 = new1.map(i => {
        if(i == '.') return '';

        if(parseInt(i) > 9) {
            return '0110';
        } else {
            return '';
        }
    });

    bcdOps.push(corr1);

    carry = 0;

    new1 = new1.slice().reverse().map(i => {
        if(i == '.') return '.';

        let res = parseInt(i);

        if(res > 9) {
            res = (res & 0b1111) + 0b0110 + carry;
        } else {
            res += carry;
        }

        carry = res >> 4;

        return res & 0b1111;
    }).reverse();

    bcdOps.push(new1.map(i => {
        if(i == '.') return i;
        let str = (parseInt(i) & 0b1111).toString(2);
        return '0'.repeat(4 - str.length) + str;
    }));

    while(new1.some(i => i != '.' && parseInt(i) > 9)) {
        corr1 = new1.map(i => {
            if(i == '.') return '';
    
            if(parseInt(i) > 9) {
                return '0110';
            } else {
                return '';
            }
        });
    
        bcdOps.push(corr1);

        carry = 0;
        new1 = new1.slice().reverse().map(i => {
            if(i == '.') return '.';
    
            let res = parseInt(i);
    
            if(res > 9) {
                res += 0b0110 + carry;
            } else {
                res += carry;
            }
    
            carry = res >> 4;
    
            return res & 0b1111;
        }).reverse();
    
        bcdOps.push(new1.map(i => {
            if(i == '.') return i;
            let str = (parseInt(i) & 0b1111).toString(2);
            return '0'.repeat(4 - str.length) + str;
        }));
    }

    let res3 = `(${new1.map(i => {
        if(i == '.') return i;
        let str = (parseInt(i) & 0b1111).toString(2);
        return '0'.repeat(4 - str.length) + str;
    }).join('\\;')})_{8421} = `;

    if(new1[0] == '0') {
        new1 = new1.join('');

        res3 += `(${new1})_{PK} = (${new1})_{NK} = (${parseFloat(new1)})_{10}`;
    }
    else {
        res3 += `(${new1.join('')})_{PK} = `;
        let oldSize = new1.length;

        let add = new1.map(i => {
            if(i == '.') return i;
            else return 0;
        });
        add[add.length - 1] = '1';
        add = parseFloat(add.join(''));

        let dotspl = new1.join('').split('.');
        if(dotspl.length == 1) dotspl = 0;
        else dotspl = dotspl[1].length;
        
        new1 = parseFloat(new1.join('')) - add;
        new1 = new1.toFixed(dotspl);
        while(new1.length < oldSize) new1 += '0';

        res3 += `(${new1})_{NK} = (-${parseFloat(new1.split('').map(i => {
            if(i == '.') return i;
            return 9 - parseInt(i);
        }).join(''))})_{10}`;
    }

    const canvas = getAddBCDRender(bcdOps);

    return [res1, res2, canvas, res3];
};

$("#calc2").click(() => {
    let num1 = $("#num2").val();
    let num2 = $("#num3").val();

    if(!/^-?[0-9]+(\.[0-9]+)?$/.test(num1)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno unet prvi sabirak!'
        });
        return;
    }

    if(!/^-?[0-9]+(\.[0-9]+)?$/.test(num2)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno unet drugi sabirak!'
        });
        return;
    }

    let [p1, p2, canvas, p3] = bcdAddition(num1, num2);

    $("#res4").html(``);
    $("#res4").append(
        $(`<p>\\[${p1}\\]</p><p>\\[${p2}\\]</p>`)
    );
    $("#res4").append(canvas);
    $("#res4").append($(`<p>\\[${p3}\\]</p>`));

    MathJax.typeset();
});

$(document).ready(() => {
    regularBCDs();
    specialBCDs();
});