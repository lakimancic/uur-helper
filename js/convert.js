const stabilize = (num) => {
    return Math.round(num * 1e10) / 1e10;
};

// Convert 1 Click

document.getElementById('convert1').onclick = () => {
    let base = document.getElementById('base1').value;
    let num = document.getElementById('num1').value;

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

    if(!/^[0-9A-Z]+(\.[0-9A-Z]+)?$/.test(num)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno unet broj!'
        });
        return;
    }

    let possibleChars = '.';

    for(let i=0;i<Math.min(10, base);i++) possibleChars += i;
    for(let i=0;i<Math.max(0, base - 10);i++) possibleChars += String.fromCharCode(65 + i);

    for(let i=0;i<num.length;i++) {
        if(!possibleChars.includes(num[i])) {
            Swal.fire({
                icon: 'warning',
                title: 'Greška',
                text: `Cifre broja moraju biti od 0 do ${possibleChars[possibleChars.length-1]}`
            });
            return;
        }
    }

    num = num.replace(/^0+/, '');
    if(num[0] === '.') num = '0' + num;
    if(num.includes('.')) {
        num = num.replace(/0+$/, '');
        num = num.replace(/\.$/, '');
    }
    if(num === '') num = '0';
    
    const res = document.getElementById('res1');

    res.innerHTML = `${num}<sub>${base}</sub> = `;

    let startExp = num.indexOf('.');
    if(startExp === -1) startExp = num.length;
    startExp -= 1;

    res.innerHTML += num.replace('.','').split('').map((val, ind) => `${val} ⋅ ${base}<sup>${startExp - ind}</sup>`).join(' + ');
    res.innerHTML += ' = ';

    if(base > 10) {
        res.innerHTML += num.replace('.','').split('').map((val, ind) => `${/^\d+$/.test(val) ? val : (10 + val.charCodeAt(0) - 65)} ⋅ ${base}<sup>${startExp - ind}</sup>`).join(' + ');
        res.innerHTML += ' = ';
    }

    res.innerHTML += `${num.replace('.','').split('').map((val, ind) => Number(/^\d+$/.test(val) ? val : (10 + val.charCodeAt(0) - 65)) * Math.pow(base, startExp - ind)).reduce((pv, cv) => pv + cv, 0)}<sub>10</sub>`;
};

// Convert 2 Click

document.getElementById('convert2').onclick = () => {
    let base = document.getElementById('base2').value;
    let num = document.getElementById('num2').value;
    let precision = document.getElementById('prec2').value;

    if(!/^\d+?$/.test(base)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno uneta osnova!'
        });
        return;
    }

    if(!/^\d+?$/.test(precision)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno uneta preciznost decimala!'
        });
        return;
    }

    base = Number(base);
    precision = Number(precision);

    if(base < 2 || base > 36) {
        Swal.fire({
            icon: 'warning',
            title: 'Greška',
            text: 'Trenutno vrednost osnove može biti od 2 do 36'
        });
        return;
    }

    if(precision < 1 || precision > 9) {
        Swal.fire({
            icon: 'warning',
            title: 'Greška',
            text: 'Trenutno preciznost decimala može biti od 1 do 9'
        });
        return;
    }

    if(!/^[0-9]+(\.[0-9]+)?$/.test(num)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno unet broj!'
        });
        return;
    }

    num = num.replace(/^0+/, '');
    if(num[0] === '.') num = '0' + num;
    if(num.includes('.')) {
        num = num.replace(/0+$/, '');
        num = num.replace(/\.$/, '');
    }
    if(num === '') num = '0';

    num = Number(num);
    
    const res = document.getElementById('res2');
    res.innerHTML = ``;

    const row1 = document.createElement('p');
    row1.classList.add('d2c_row1');

    let intNum = Math.floor(num);

    let digs = '';
    while(intNum > 0) {
        row1.innerHTML += `<span class="px-3">${intNum} : ${base} = ${Math.floor(intNum / base)} / <span class="redc">${intNum % base}${intNum % base > 9 ? ` → ${String.fromCharCode(65 + intNum % base - 10)}` : ''}</span></span>`;
        
        digs = (intNum % base > 9 ? String.fromCharCode(65 + intNum % base - 10) : (intNum % base).toString()) + digs;
        intNum = Math.floor(intNum / base);
    }

    res.append(row1);

    res.innerHTML += `<p>${Math.floor(num)}<sub>10</sub> = ${digs}<sub>${base}</sub></p>`;
    let res1 = digs;

    let decimalPart = stabilize(num - Math.floor(num));

    if(decimalPart) {
        let cnt = 0;
        digs = '';
        const row2 = document.createElement('p');
        row2.classList.add('d2c_row2');

        let copy = decimalPart;

        while(cnt < precision && decimalPart !== 0) {
            let newNum = stabilize(decimalPart * base);
            let intPart = Math.floor(newNum);

            row2.innerHTML += `<span class="px-3">${decimalPart} * ${base} = <span class="redc">${intPart > 9 ? `${String.fromCharCode(65 + intPart - 10)} ← ` : ''}${intPart}</span>.${stabilize((newNum - intPart)*10).toString().replace('.', '')}</span>`;

            digs += (intPart > 9 ? String.fromCharCode(65 + intPart - 10) : (intPart).toString());
            decimalPart = stabilize(newNum - intPart);
            cnt++;
        }

        res.append(row2);

        res.innerHTML += `<p>${copy}<sub>10</sub> = 0.${digs}<sub>${base}</sub></p>`;
        
        res.innerHTML += `<p>${num}<sub>10</sub> = ${res1}.${digs}<sub>${base}</sub></p>`;
    }
};

// Convert 3 Click

document.getElementById('convert3').onclick = () => {
    let base = document.getElementById('base3').value;
    let num = document.getElementById('num3').value;

    if(base == "-1") {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Niste izabrali osnovu!'
        });
        return;
    }

    if(!/^[0-9]+(\.[0-9]+)?$/.test(num)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno unet broj!'
        });
        return;
    }

    base = Number(base);

    let possibleChars = '.01';
    const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUV';

    for(let i=0;i<num.length;i++) {
        if(!possibleChars.includes(num[i])) {
            Swal.fire({
                icon: 'warning',
                title: 'Greška',
                text: `Cifre broja moraju biti od 0 do 1`
            });
            return;
        }
    }

    const res = document.getElementById('res3');
    res.innerHTML = `${num}<sub>2</sub> = `;

    let numParts = num.split('.');

    while(numParts[0].length % base != 0) {
        numParts[0] = '0' + numParts[0];
    }

    let resNum = '';

    res.innerHTML += numParts[0].match(new RegExp(`.{1,${base}}`, 'g')).map(i => {
        resNum += digits[parseInt(i, 2)];
        return `<span class='chunk'>${i}<span class='in-chunk'>${digits[parseInt(i, 2)]}</span></span>`;
    }).join(' ');

    if(numParts.length > 1) {
        res.innerHTML += `<span class='chunk'>.<span class='in-chunk'>.</span></span>`;
        resNum += '.';

        while(numParts[1].length % base != 0) {
            numParts[1] += '0';
        }

        res.innerHTML += numParts[1].match(new RegExp(`.{1,${base}}`, 'g')).map(i => {
            resNum += digits[parseInt(i, 2)];
            return `<span class='chunk'>${i}<span class='in-chunk'>${digits[parseInt(i, 2)]}</span></span>`;
        }).join(' ');
    }

    res.innerHTML += ` = ${resNum}<sub>${Math.pow(2, base)}</sub>`;
};

// Convert 4 Click

document.getElementById('convert4').onclick = () => {
    let base = document.getElementById('base4').value;
    let num = document.getElementById('num4').value;

    if(base == "-1") {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Niste izabrali osnovu!'
        });
        return;
    }

    if(!/^[0-9A-V]+(\.[0-9A-V]+)?$/.test(num)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno unet broj!'
        });
        return;
    }

    base = Number(base);

    let possibleChars = '.';
    const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUV';

    for(let i=0;i<Math.min(10, Math.pow(2, base));i++) possibleChars += i;
    for(let i=0;i<Math.max(0, Math.pow(2, base) - 10);i++) possibleChars += String.fromCharCode(65 + i);

    for(let i=0;i<num.length;i++) {
        if(!possibleChars.includes(num[i])) {
            Swal.fire({
                icon: 'warning',
                title: 'Greška',
                text: `Cifre broja moraju biti od 0 do ${digits[Math.pow(2, base) - 1]}`
            });
            return;
        }
    }

    const res = document.getElementById('res4');
    res.innerHTML = `${num}<sub>${Math.pow(2, base)}</sub> = `;

    let numParts = num.split('.');
    let resNum = '';

    res.innerHTML += Array.from(numParts[0]).map(i => {
        let tempNum = Array.from(digits).findIndex(j => j === i).toString(2);
        while(tempNum.length < base) tempNum = '0' + tempNum;
        resNum += tempNum;
        return `<span class="chunk" style="padding: 0 ${base / 4}rem;">${i}<span class='in-chunk'>${tempNum}</span></span>`;
    }).join(' ');

    if(numParts.length > 1) {
        res.innerHTML += `<span class='chunk' style="padding: 0 ${base / 4}rem;">.<span class='in-chunk'>.</span></span>`;
        resNum += '.';

        res.innerHTML += Array.from(numParts[1]).map(i => {
            let tempNum = Array.from(digits).findIndex(j => j === i).toString(2);
            while(tempNum.length < base) tempNum = '0' + tempNum;
            resNum += tempNum;
            return `<span class='chunk' style="padding: 0 ${base / 4}rem;">${i}<span class='in-chunk'>${tempNum}</span></span>`;
        }).join(' ');
    }

    res.innerHTML += ` = ${resNum}<sub>${Math.pow(2, base)}</sub>`;
};