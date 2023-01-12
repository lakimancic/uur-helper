// Imports
import * as utils from "./utils.js";

let whatRes = "";

// Consts
const FONTS = 20;

const additionRender = (num1, num2, res, ch) => {
    /** @type {HTMLCanvasElement} */
    const canvas = $("<canvas></canvas>")[0];
    canvas.classList.add('mx-auto');
    canvas.classList.add('my-2');
    canvas.classList.add('d-block');

    $(whatRes).append(canvas);

    let len1 = (num1.length - utils.countChar(num1, '.')) * FONTS + utils.countChar(num1, '.') * FONTS / 2;
    let len2 = (num2.length - utils.countChar(num2, '.')) * FONTS + utils.countChar(num2, '.') * FONTS / 2;
    let lenRes = (res.length - utils.countChar(res, '.')) * FONTS + utils.countChar(res, '.') * FONTS / 2;

    canvas.width = Math.max(len1, len2, lenRes) + FONTS;
    canvas.height = FONTS * 4 + FONTS / 5;

    const ctx = canvas.getContext('2d');
    ctx.font = `${FONTS}px cmFont`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(ch, FONTS / 2, FONTS * 12 / 10 + FONTS / 2);

    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, FONTS * 23 / 10);
    ctx.lineTo(canvas.width, FONTS * 23 / 10);
    ctx.stroke();

    num1 = num1.split('.');
    num2 = num2.split('.');
    res = res.split('.');

    if(num1.length > 1 || num2.length > 1) {
        if(num1.length == 1) num1.push('0');
        if(num2.length == 1) num2.push('0');
        if(res.length == 1) res.push('0');

        let dot = Math.max(num1[1].length, num2[1].length);
        
        let rx = canvas.width - dot * FONTS - FONTS / 2;
        let lx = rx + FONTS / 2;

        for(let i=num1[0].length-1;i>=0;i--) {
            ctx.fillText(num1[0][num1[0].length - 1 - i], rx - i*FONTS - FONTS / 2, FONTS / 10 + FONTS / 2);
        }
    
        for(let i=num2[0].length-1;i>=0;i--) {
            ctx.fillText(num2[0][num2[0].length - 1 - i], rx - i*FONTS - FONTS / 2, FONTS * 12 / 10 + FONTS / 2);
        }

        for(let i=res[0].length-1;i>=0;i--) {
            ctx.fillText(res[0][res[0].length - 1 - i], rx - i*FONTS - FONTS / 2, FONTS * 25 / 10 + FONTS / 2);
        }

        ctx.fillText('.', (rx + lx) / 2, FONTS / 10 + FONTS / 2);
        ctx.fillText('.', (rx + lx) / 2, FONTS * 12 / 10 + FONTS / 2);
        ctx.fillText('.', (rx + lx) / 2, FONTS * 25 / 10 + FONTS / 2);

        for(let i=0;i<num1[1].length;i++) {
            ctx.fillText(num1[1][i], lx + i*FONTS + FONTS / 2, FONTS / 10 + FONTS / 2);
        }

        for(let i=0;i<num2[1].length;i++) {
            ctx.fillText(num2[1][i], lx + i*FONTS + FONTS / 2, FONTS * 12 / 10 + FONTS / 2);
        }

        for(let i=0;i<res[1].length;i++) {
            ctx.fillText(res[1][i], lx + i*FONTS + FONTS / 2, FONTS * 25 / 10 + FONTS / 2);
        }
    } 
    else {
        for(let i=num1[0].length-1;i>=0;i--) {
            ctx.fillText(num1[0][num1[0].length - 1 - i], canvas.width - i*FONTS - FONTS / 2, FONTS / 10 + FONTS / 2);
        }
    
        for(let i=num2[0].length-1;i>=0;i--) {
            ctx.fillText(num2[0][num2[0].length - 1 - i], canvas.width - i*FONTS - FONTS / 2, FONTS * 12 / 10 + FONTS / 2);
        }

        for(let i=res[0].length-1;i>=0;i--) {
            ctx.fillText(res[0][res[0].length - 1 - i], canvas.width - i*FONTS - FONTS / 2, FONTS * 25 / 10 + FONTS / 2);
        }
    }
};

const addition = (num1, num2, base) => {
    additionRender(num1, num2, utils.toString(utils.parseNumber(num1, base) + utils.parseNumber(num2, base), base, Math.max(num1.length, num2.length)), '+');
};

const subtraction = (num1, num2, base) => {
    additionRender(num1, num2, utils.toString(utils.parseNumber(num1, base) - utils.parseNumber(num2, base), base, Math.max(num1.length, num2.length)), '-');
};

const multiplication = (num1, num2) => {
    let dotOff1, dotOff2;
    if(num1.includes('.')) dotOff1 = num1.split('.')[1].length;
    if(num2.includes('.')) dotOff2 = num2.split('.')[1].length;

    num1 = num1.replace('.', '');
    num2 = num2.replace('.', '');

    let table = [];
    let fullW = num1.length + num2.length - 1;

    for(let i=0;i<num2.length;i++) {
        table.push('0'.repeat(num2.length - 1 - i) + (num2[num2.length - 1 - i] == '1' ? num1 : '0'.repeat(num1.length)) + '0'.repeat(i));
    }

    let res = "";
    let carry = 0;
    for(let i=fullW-1;i>=0;i--) {
        for(let j=0;j<table.length;j++) carry += (table[j][i] == '1' ? 1 : 0);

        if(carry % 2) res = '1' + res;
        else res = '0' + res;

        carry = Math.floor(carry / 2);
    }

    while(carry > 0) {
        if(carry % 2) res = '1' + res;
        else res = '0' + res;

        carry = Math.floor(carry / 2);
    }

    /** @type {HTMLCanvasElement} */
    const canvas = $("<canvas></canvas>")[0];
    canvas.classList.add('mx-auto');
    canvas.classList.add('my-2');
    canvas.classList.add('d-block');

    $("#res1").append(canvas);

    canvas.height = (table.length + 3) * FONTS + FONTS + FONTS * table.length / 10;
    canvas.width = Math.max(num1.length + 1, num2.length + 1, res.length) * FONTS;

    const ctx = canvas.getContext('2d');
    ctx.font = `${FONTS}px cmFont`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for(let i=0;i<num1.length;i++) {
        if(i == dotOff1) {
            ctx.fillText('.', canvas.width - i * FONTS, FONTS / 10 + FONTS / 2);
        }
        ctx.fillText(num1[num1.length - 1 - i], canvas.width - i * FONTS - FONTS / 2, FONTS / 10 + FONTS / 2);
    }

    for(let i=0;i<num2.length;i++) {
        if(i == dotOff2) {
            ctx.fillText('.', canvas.width - i * FONTS, FONTS * 12 / 10 + FONTS / 2);
        }
        ctx.fillText(num2[num2.length - 1 - i], canvas.width - i * FONTS - FONTS / 2, FONTS * 12 / 10 + FONTS / 2);
    }

    ctx.fillText('×', canvas.width - Math.max(num1.length, num2.length) * FONTS - FONTS / 2, FONTS * 12 / 10 + FONTS / 2);

    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(canvas.width - Math.max(num1.length + 1, num2.length + 1) * FONTS, FONTS * 23 / 10);
    ctx.lineTo(canvas.width, FONTS * 23 / 10);
    ctx.stroke();

    for(let i=0;i<num2.length;i++) {
        let num = num2[num2.length -1 - i] == '1' ? num1 : '0'.repeat(num1.length);
        for(let j=0;j<num1.length;j++) {
            ctx.fillText(num[num.length - 1 - j], canvas.width - j * FONTS - i * FONTS - FONTS / 2, FONTS * 25 / 10 + (FONTS + FONTS / 10) * i + FONTS / 2);
        }
    }

    ctx.beginPath();
    ctx.moveTo(0, FONTS * 25 / 10 + (FONTS + FONTS / 10) * num2.length);
    ctx.lineTo(canvas.width, FONTS * 25 / 10 + (FONTS + FONTS / 10) * num2.length);
    ctx.stroke();

    for(let i=0;i<res.length;i++) {
        if(i == dotOff1 + dotOff2) {
            ctx.fillText('.', canvas.width - i * FONTS, FONTS * 26 / 10 + (FONTS + FONTS / 10) * num2.length + FONTS / 2);
        }
        ctx.fillText(res[res.length - 1 - i], canvas.width - i * FONTS - FONTS / 2, FONTS * 26 / 10 + (FONTS + FONTS / 10) * num2.length + FONTS / 2);
    }
};

const division = (num1, num2) => {
    num1 = num1.split('.');
    num2 = num2.split('.');

    if(num2.length > 1) {
        if(num1.length == 1) num1.push('');
        while(num1[1].length < num2[1].length) {
            num1[1] += '0';
        }
        num1[0] += num1[1].substr(0, num2[1].length);
        num1[1] = num1[1].slice(num2[1].length);

        if(num1[1] == '') num1.pop();
    }

    num2 = num2.join('');

    let res = "";
    let prec = 0, dot = false;

    let ind = Math.min(num1[0].length, num2.length);
    num1 = num1.join('.');
    let temp = num1.slice(0, ind);
    let otemp = temp;
    let temps = [];

    while((parseInt(temp) != 0 || ind <= num1.length) && prec < 10) {
        let tempRes = parseInt(temp, 2) >= parseInt(num2, 2) ? '1' : '0';
        res += tempRes;

        if(tempRes == '1') temp = (parseInt(temp, 2) - parseInt(num2, 2)).toString(2);
        else temp = parseInt(temp, 2).toString(2);

        if(ind >= num1.length) {
            if(ind == num1.length) {
                ind++; 
                res += '.';
                dot = true;
            }
            temp += '0';
        }
        else {
            if(num1[ind] == '.') {
                ind++; 
                res += '.';
                dot = true;
            }
            temp += num1[ind];
            ind++;
        }
        temps.push([ tempRes, temp ]);

        prec += (dot ? 1 : 0);
    }
    if(res[res.length - 1] == '.') res = res.slice(0, res.length - 1);

    /** @type {HTMLCanvasElement} */
    const canvas = $("<canvas></canvas>")[0];
    canvas.classList.add('mx-auto');
    canvas.classList.add('my-2');
    canvas.classList.add('d-block');

    $("#res1").append(canvas);

    canvas.height = FONTS + 2.2 * FONTS * temps.length;
    canvas.width = Math.max(num1.length - utils.countChar(num1, '.') + num2.length + 2 + res.length, otemp.length + temps.length) * FONTS;

    const ctx = canvas.getContext('2d');
    ctx.font = `${FONTS}px cmFont`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let sx = 0;

    for(let i=0;i<num1.length;i++) {
        if(num1[i] == '.') {
            ctx.fillText('.', sx, FONTS / 10 + FONTS / 2);
        }
        else {
            ctx.fillText(num1[i], sx + FONTS / 2, FONTS / 10 + FONTS / 2);
            sx += FONTS;
        }
    }
    ctx.fillText(':', sx + FONTS / 2, FONTS / 10 + FONTS / 2);
    sx += FONTS;
    for(let i=0;i<num2.length;i++) {
        ctx.fillText(num2[i], sx + FONTS / 2, FONTS / 10 + FONTS / 2);
        sx += FONTS;
    }
    ctx.fillText('=', sx + FONTS / 2, FONTS / 10 + FONTS / 2);
    sx += FONTS;
    for(let i=0;i<res.length;i++) {
        if(res[i] == '.') {
            ctx.fillText('.', sx, FONTS / 10 + FONTS / 2);
        }
        else {
            ctx.fillText(res[i], sx + FONTS / 2, FONTS / 10 + FONTS / 2);
            sx += FONTS;
        }
    }

    let sy = FONTS * 11 / 10;
    sx = otemp.length * FONTS;

    temps.forEach(i => {
        let temp2 = num2;
        if(i[0] == '0') temp2 = '0';

        for(let j=0;j<temp2.length;j++) {
            ctx.fillText(temp2[temp2.length - 1 - j], sx - FONTS * j - FONTS / 2, sy + FONTS / 2);
        }
        sy += FONTS * 6 / 5;
        
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy - FONTS / 10);
        ctx.lineTo(sx - otemp.length * FONTS, sy - FONTS / 10);
        ctx.stroke();

        for(let j=0;j<i[1].length;j++) {
            ctx.fillText(i[1][i[1].length - 1 - j], sx + FONTS - FONTS * j - FONTS / 2, sy + FONTS / 2);
        }
        sy += FONTS;
        sx += FONTS;

        otemp = i[1];
    });
};

$("#calc1").click(() => {
    $("#res1").html('');

    const num1 = $("#num1_1").val();
    const num2 = $("#num1_2").val();

    if(!/^[0-1]+(\.[01-]+)?$/.test(num1)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno unet prvi operand!'
        });
        return;
    }

    if(!/^[0-1]+(\.[0-1]+)?$/.test(num2)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno unet drugi operand!'
        });
        return;
    }

    if($("#rb-div")[0].checked && utils.parseNumber(num2, 2) == 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Greška',
            text: `Deljenje nulom!`
        });
        return;
    }

    whatRes = "#res1";

    if($("#rb-add")[0].checked) addition(num1, num2, 2);
    if($("#rb-sub")[0].checked) subtraction(num1, num2, 2);
    if($("#rb-mul")[0].checked) multiplication(num1, num2);
    if($("#rb-div")[0].checked) division(num1, num2);
});

$("#calc2").click(() => {
    $("#res2").html('');

    const num1 = $("#num2_1").val();
    const num2 = $("#num2_2").val();
    let base = $("#base").val();

    if(!/^\d+?$/.test(base)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno uneta osnova!'
        });
        return;
    }

    base = Number(base);

    if(base < 2 || base > 36) {
        Swal.fire({
            icon: 'warning',
            title: 'Greška',
            text: 'Trenutno vrednost osnove mora biti od 2 do 36'
        });
        return;
    }

    if(!/^[0-9A-Z]+(\.[0-9A-Z]+)?$/.test(num1)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno unet prvi operand!'
        });
        return;
    }

    if(!/^[0-9A-Z]+(\.[0-9A-Z]+)?$/.test(num2)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno unet drugi operand!'
        });
        return;
    }

    let possibleChars = '.';

    for(let i=0;i<Math.min(10, base);i++) possibleChars += i;
    for(let i=0;i<Math.max(0, base - 10);i++) possibleChars += String.fromCharCode(65 + i);

    for(let i=0;i<num1.length;i++) {
        if(!possibleChars.includes(num1[i])) {
            Swal.fire({
                icon: 'warning',
                title: 'Greška',
                text: `Cifre operanada moraju biti od 0 do ${possibleChars[possibleChars.length-1]}`
            });
            return;
        }
    }

    for(let i=0;i<num2.length;i++) {
        if(!possibleChars.includes(num2[i])) {
            Swal.fire({
                icon: 'warning',
                title: 'Greška',
                text: `Cifre operanada moraju biti od 0 do ${possibleChars[possibleChars.length-1]}`
            });
            return;
        }
    }

    whatRes = "#res2";

    if($("#rb-add2")[0].checked) addition(num1, num2, base);
    if($("#rb-sub2")[0].checked) subtraction(num1, num2, base);
});