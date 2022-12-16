// Next 1
document.getElementById('next1').onclick = () => {
    document.querySelector('.main-q').classList.toggle('d-none');
    if(document.getElementById('rb-func').checked) {
        document.querySelector('.func-q').classList.toggle('d-none');
    } else if(document.getElementById('rb-table').checked) {
        document.querySelector('.table-q').classList.toggle('d-none');
    } else if(document.getElementById('rb-dec').checked) {
        document.querySelector('.numd-q').classList.toggle('d-none');
    } else if(document.getElementById('rb-decs').checked) {
        document.querySelector('.decs-q').classList.toggle('d-none');
    } else if(document.getElementById('rb-vec').checked) {
        document.querySelector('.vec-q').classList.toggle('d-none');
    }
};

//
let truthTable = [];
let vars = [];

// Analysis
const solve = () => {
    document.querySelector('.res-q').innerHTML = '';
    document.querySelector('.res-q').appendChild($(`<h4 class="text-center p-4">Tablica</h4>`)[0]);
    // Print table
    const table = document.createElement('table');
    table.classList.add('table');
    table.classList.add('table-bordered')
    const thr = document.createElement('tr');
    // vars.reverse();
    vars.forEach(i => {
        const th = document.createElement('th');
        th.innerText = i;
        thr.appendChild(th);
    });
    const th = document.createElement('th');
    th.innerText = 'f';
    thr.appendChild(th);
    table.appendChild(thr);
    truthTable.forEach(i => {
        const tr = document.createElement('tr');
        i.forEach(j => {
            const td = document.createElement('td');
            td.innerText = j;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    document.querySelector('.res-q').appendChild(table);

    document.querySelector('.res-q').appendChild($(`<h4 class="text-center p-4">Decimalni indeksi</h4>`)[0]);
    let decs0 = $('<p></p>');
    decs0.text('f^{(0)} = \\{ ' + truthTable.map((i, ind) => [ind, i[i.length - 1]]).filter(i => i[1] == 0).map(i => i[0]).join(',') + ' \\}');
    document.querySelector('.res-q').appendChild(decs0[0]);
    decs0.latex();
    let decs1 = $('<p></p>');
    decs1.text('f^{(1)} = \\{ ' + truthTable.map((i, ind) => [ind, i[i.length - 1]]).filter(i => i[1] == 1).map(i => i[0]).join(',') + ' \\}');
    document.querySelector('.res-q').appendChild(decs1[0]);
    decs1.latex();

    document.querySelector('.res-q').appendChild($(`<h4 class="text-center p-4">Vektor</h4>`)[0]);
    let vect = $('<p></p>');
    let vecText = 'K_f = [' + truthTable.map(i => i[i.length - 1]).join('') + ']';
    vect.text(vecText);
    document.querySelector('.res-q').appendChild(vect[0]);
    vect.latex();

    document.querySelector('.res-q').appendChild($(`<h4 class="text-center p-4">Brojni indeks</h4>`)[0]);
    let num = $('<p></p>');
    let numText = 'N_f = ' + parseInt(truthTable.map(i => i[i.length - 1]).reverse().join(''), 2);
    num.text(numText);
    document.querySelector('.res-q').appendChild(num[0]);
    num.latex();

    document.querySelector('.res-q').appendChild($(`<h4 class="text-center p-4">PDNF</h4>`)[0]);
    let pdnf = $('<p></p>');
    let pdnfText = 'f(' + vars.map(i => i[0] + '_' + i[1]).join(',') + ') = ';
    pdnfText += truthTable.filter(i => i[i.length - 1] == 1).map((i, ind) => {
        return vars.map((j, jnd) => {
            if(i[jnd]) return j[0] + '_' + j[1];
            else return `\\overline{${j[0] + '_' + j[1]}}`;
        }).join('\\cdot ');
    }).join(' + ');
    pdnf.text(pdnfText);
    document.querySelector('.res-q').appendChild(pdnf[0]);
    pdnf.latex();

    document.querySelector('.res-q').appendChild($(`<h4 class="text-center p-4">PKNF</h4>`)[0]);
    let pknf = $('<p></p>');
    let pknfText = 'f(' + vars.map(i => i[0] + '_' + i[1]).join(',') + ') = ';
    pknfText += truthTable.filter(i => i[i.length - 1] == 0).map((i, ind) => {
        return '( ' + vars.map((j, jnd) => {
            if(!i[jnd]) return j[0] + '_' + j[1];
            else return `\\overline{${j[0] + '_' + j[1]}}`;
        }).join(' + ') + ' )';
    }).join('\\cdot ');
    pknf.text(pknfText);
    document.querySelector('.res-q').appendChild(pknf[0]);
    pknf.latex();

    document.querySelector('.res-q').appendChild($(`<h4 class="text-center p-4">PPNF</h4>`)[0]);
    let ppnf = $('<p></p>');
    let ppnfText = 'f(' + vars.map(i => i[0] + '_' + i[1]).join(',') + ') = ';
    ppnfText += truthTable.filter(i => i[i.length - 1] == 1).map((i, ind) => {
        return vars.map((j, jnd) => {
            if(i[jnd]) return j[0] + '_' + j[1];
            else return `\\overline{${j[0] + '_' + j[1]}}`;
        }).join('\\cdot ');
    }).join('\\oplus ');
    ppnf.text(ppnfText);
    document.querySelector('.res-q').appendChild(ppnf[0]);
    ppnf.latex();

    document.querySelector('.res-q').appendChild($(`<h4 class="text-center p-4">KP</h4>`)[0]);
    let kp = $('<p></p>');
    let kpText = 'f(' + vars.map(i => i[0] + '_' + i[1]).join(',') + ') = ';
    let vars2 = [];
    truthTable.filter(i => i[i.length - 1] == 1).forEach(i => {
        let truevars = vars.map(i => i[0] + '_' + i[1]).filter((j, jnd) => i[jnd]);
        let vars3 = [truevars];
        vars.forEach((j, jnd) => {
            if(!i[jnd]) {
                vars3 = vars3.concat(vars3.map(k => [...k, j[0] + '_' + j[1]]));
            }
        });
        vars3.forEach(j => {
            if(j.length == 0) j.push('1');
            j.sort();
        })
        vars2 = [...vars2, ...vars3];
    });
    vars2 = vars2.map(i => i.join('\\cdot '));
    vars2 = vars2.filter(i => vars2.filter(j => j == i).length % 2 == 1);
    let vars3 = [];
    vars2.forEach(i => {
        if(!vars3.includes(i)) vars3.push(i);
    })
    kpText += vars3.sort((a,b) => {
        if(a.length != b.length) return a.length - b.length;
        return a.localeCompare(b);
    }).join('\\oplus ');
    kp.text(kpText);
    document.querySelector('.res-q').appendChild(kp[0]);
    kp.latex();
}

// Function to truth table
const getTruthTable = () => {
    const func = document.getElementById('func').value;
    let found = false;
    truthTable = [];
    vars = [];
    for(let i=10;i>=1;i--) {
        if(func.includes(`x${i}`) || found) {
            vars.unshift(`x${i}`);
            found = true;
        }
    };
    for(let i=0;i<Math.pow(2, vars.length);i++) {
        const pomArr = [];
        let temp = i;
        for(let j=0;j<vars.length;j++) {
            pomArr.unshift(temp % 2);
            temp = Math.floor(temp / 2);
        }
        let str = func.replaceAll('*', '&').replaceAll('+', '|');
        for(let j=0;j<vars.length;j++) {
            str = str.replaceAll(vars[j], pomArr[j]);
        }
        pomArr.push(eval(str));
        truthTable.push(pomArr);
    }
    solve();
};

const createTable = () => {
    const varNum = document.getElementById('vars').value;
    truthTable = [];
    vars = [];

    const table = $(`<table class="table table-bordered tablica">`)[0];
    let tr = $("<tr></tr>")[0];

    for(let i=0;i<varNum;i++) {
        tr.appendChild($(`<th>x${i+1}</th>`)[0]);
        vars.push(`x${i+1}`);
    }
    tr.appendChild($(`<th>f</th>`)[0]);

    table.appendChild(tr);

    for(let i=0;i<Math.pow(2, vars.length);i++) {
        let tr2 = $("<tr></tr>")[0];
        const pomArr = [];
        let temp = i;
        for(let j=0;j<vars.length;j++) {
            pomArr.unshift(temp % 2);
            temp = Math.floor(temp / 2);
        }
        truthTable.push(pomArr);
        pomArr.forEach(i => tr2.appendChild($(`<td>${i}</td>`)[0]));
        tr2.appendChild($(`<td class="col-sm-3"><input class="form-control" type="text" placeholder="f"></td>`)[0])
        table.appendChild(tr2);
    }

    document.getElementById('next3').disabled = false;

    $(".popuni").after(table);
};

const getTruthTable2 = () => {
    let table = $(".tablica")[0];
    table.querySelectorAll("input").forEach((i, ind) => {
        truthTable[ind].push(i.value);
    });
    solve();
};

const getTruthTable3 = () => {
    let numd = document.getElementById("numd").value;
    const varNum = Math.ceil(Math.log2(Math.log2(numd)));
    truthTable = [];
    vars = [];
    for(let i=0;i<varNum;i++) {
        vars.push(`x${i+1}`);
    }
    for(let i=0;i<Math.pow(2, vars.length);i++) {
        const pomArr = [];
        let temp = i;
        for(let j=0;j<vars.length;j++) {
            pomArr.unshift(temp % 2);
            temp = Math.floor(temp / 2);
        }
        pomArr.push(numd % 2);
        numd = Math.floor(numd / 2);
        truthTable.push(pomArr);
    }
    solve();
};

const getTruthTable4 = () => {
    let f0 = document.getElementById("f_0").value.split(',').map(i => parseInt(i));
    let f1 = document.getElementById("f_1").value.split(',').map(i => parseInt(i));
    const numd = f0.length + f1.length;
    const varNum = Math.ceil(Math.log2(numd));
    truthTable = [];
    vars = [];
    for(let i=0;i<varNum;i++) {
        vars.push(`x${i+1}`);
    }
    for(let i=0;i<Math.pow(2, vars.length);i++) {
        const pomArr = [];
        let temp = i;
        for(let j=0;j<vars.length;j++) {
            pomArr.unshift(temp % 2);
            temp = Math.floor(temp / 2);
        }
        truthTable.push(pomArr);
    }
    f0.forEach(i => truthTable[i].push(0));
    f1.forEach(i => truthTable[i].push(1));
    solve();
};

const getTruthTable5 = () => {
    let vec = document.getElementById("vec").value;
    const varNum = Math.ceil(Math.log2(vec.length));
    truthTable = [];
    vars = [];
    for(let i=0;i<varNum;i++) {
        vars.push(`x${i+1}`);
    }
    for(let i=0;i<Math.pow(2, vars.length);i++) {
        const pomArr = [];
        let temp = i;
        for(let j=0;j<vars.length;j++) {
            pomArr.unshift(temp % 2);
            temp = Math.floor(temp / 2);
        }
        pomArr.push(vec[i]);
        truthTable.push(pomArr);
    }
    solve();
};

document.getElementById('next2').onclick = getTruthTable;
document.getElementById('next3').onclick = getTruthTable2;
document.getElementById('next4').onclick = getTruthTable3;
document.getElementById('next5').onclick = getTruthTable4;
document.getElementById('next6').onclick = getTruthTable5;
document.getElementById('create').onclick = createTable;