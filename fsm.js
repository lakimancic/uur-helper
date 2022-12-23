const CR = 30;
const DIST = 200;
let ox = 300, oy = 300;
let RL = false;

// Function for Creating Elements
const createElem = (tagName, text, classes) => {
    const elem = document.createElement(tagName);
    elem.innerText = text;
    if(classes) elem.className = classes;
    return elem;
};

const createElemIH = (tagName, text, classes) => {
    const elem = document.createElement(tagName);
    elem.innerHTML = text;
    if(classes) elem.className = classes;
    return elem;
};

const numToBin = (num, len) => {
    let str = Number(num).toString(2);
    while(str.length < Math.ceil(Math.log2(len))) str = `0${str}`;
    return str;
};

const getLog2Arr = (num) => {
    let arr = [];
    for(let i=0;i<Math.ceil(Math.log2(num));i++) arr.push(i+1);
    return arr;
};

const canvas = document.getElementById('graph');

let stateN = 0;
let states = [];
let mMat = [];
let actions = [];

const rotateAround = (p1, p2, angle) => {
    return {
        x: p1.x + (p2.x - p1.x) * Math.cos(angle) - (p2.y - p1.y) * Math.sin(angle),
        y: p1.y + (p2.x - p1.x) * Math.sin(angle) + (p2.y - p1.y) * Math.cos(angle)
    };
};

const dist = (p1, p2) => {
    return Math.sqrt((p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y));
};

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

const renderGraph = () => {
    let R = 0;
    let phi = 2 * Math.PI / stateN;

    if(stateN == 2) R = DIST / 2;
    else if(stateN > 2) {
        R = DIST / Math.sqrt(2 * (1 - Math.cos(phi)));
    }

    canvas.width = 2 * R + DIST * 1.5;
    canvas.height = 2 * R + DIST;
    ox = R + DIST * 0.75;
    oy = R + DIST / 2;
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext('2d');

    renderStates(ctx);
};

const norm = (p) => {
    return Math.sqrt(p.x*p.x + p.y*p.y);
};

const calcRotateL = (R) => {
    let phi = 2 * Math.PI / stateN;
    let angle = Math.PI / 2;
    if(stateN % 2 == 0) angle -= phi / 2;

    let cntL = 0, cnt = 0;

    states.forEach((i, ind) => {
        for(let j in i.nodes) {
            // renderConnection(ctx, ind, j, R, i.nodes[j].join('+'));
            if(j != ind) {
                let x = R * Math.cos(angle + ind * phi);
                let y = - R * Math.sin(angle + ind * phi);
                let nx = R * Math.cos(angle + j * phi);
                let ny = - R * Math.sin(angle + j * phi);
                let p1 = rotateAround({ x, y }, { x:nx, y:ny }, - Math.PI / 3);
                let p2 = rotateAround({ x, y }, { x:nx, y:ny }, Math.PI / 3);
                if(norm(p1) < norm(p2)) cntL++;
                cnt++;
            }
        }
    });

    RL = cntL * 2 < cnt;
};

/** @param {CanvasRenderingContext2D} ctx */
const renderConnection = (ctx, from, to, R, str) => {
    let phi = 2 * Math.PI / stateN;
    let angle = Math.PI / 2;
    if(stateN % 2 == 0) angle -= phi / 2;
    let x = R * Math.cos(angle + from * phi);
    let y = - R * Math.sin(angle + from * phi);
    if(from == to) {
        let dx = x / R, dy = y / R;
        let ncx = x + dx * CR * 6/4;
        let ncy = y + dy * CR * 6/4;
        const pts = getIntersectC2(x, y, CR, ncx, ncy, CR * 0.9);
        let a1 = Math.atan2(pts.y1 - ncy, pts.x1 - ncx);
        let a2 = Math.atan2(pts.y2 - ncy, pts.x2 - ncx);
        let a2o = a2, k = 1;
        if(ncy > y || (Math.round(ncy * 1000) == Math.round(y * 1000) && ncx > x)) {
            [a1, a2] = [a2, a1];
            k = -1;
        }
        ctx.beginPath();
        ctx.arc(ox + ncx, oy + ncy, CR * 0.9, a2, a1);
        ctx.stroke();
        ctx.beginPath();
        const arrowOffset = k * Math.PI / 7;
        ctx.moveTo(ox + pts.x2, oy + pts.y2);
        ctx.lineTo(
            ox + ncx + (CR * 0.9 + CR / 6) * Math.cos(a2o + arrowOffset),
            oy + ncy + (CR * 0.9 + CR / 6) * Math.sin(a2o + arrowOffset)
        );
        ctx.lineTo(
            ox + ncx + (CR * 0.9 - CR / 5) * Math.cos(a2o + arrowOffset),
            oy + ncy + (CR * 0.9 - CR / 5) * Math.sin(a2o + arrowOffset)
        );
        ctx.closePath();
        ctx.fill();

        ctx.font = "14px Arial";
        let tx = x + dx * CR * 11/4;
        let ty = y + dy * CR * 11/4;
        ctx.beginPath();
        ctx.fillText(str, ox + tx, oy + ty);
        ctx.stroke();
        return;
    }
    let nx = R * Math.cos(angle + to * phi);
    let ny = - R * Math.sin(angle + to * phi);
    let p = rotateAround({ x, y }, { x:nx, y:ny }, - Math.PI / 3);
    if(RL) p = rotateAround({ x, y }, { x:nx, y:ny }, Math.PI / 3);
    let dis = Math.sqrt((y - ny)*(y - ny) + (x - nx)*(x - nx));
    let a1 = Math.atan2(y - p.y, x - p.x);
    let a2 = Math.atan2(ny - p.y, nx - p.x);
    let angleO = Math.acos(1 - CR*CR / (2 * dis*dis));
    ctx.beginPath();
    if(!RL) ctx.arc(ox + p.x, oy + p.y, dis, a2 + angleO, a1 - angleO);
    else ctx.arc(ox + p.x, oy + p.y, dis, a1 + angleO, a2 - angleO);
    ctx.stroke();
    const angleMul = 1.4;
    let xp = p.x + dis * Math.cos(a2 + angleO);
    if(RL) xp = p.x + dis * Math.cos(a1 + angleO);
    let yp = p.y + dis * Math.sin(a2 + angleO); 
    if(RL) yp = p.y + dis * Math.sin(a1 + angleO); 
    ctx.beginPath();
    ctx.moveTo(ox + xp, oy + yp);
    if(!RL) ctx.lineTo(
        ox + p.x + (dis - CR / 6) * Math.cos(a2 + angleO * angleMul),
        oy + p.y + (dis - CR / 6) * Math.sin(a2 + angleO * angleMul)
    );
    else ctx.lineTo(
        ox + p.x + (dis - CR / 6) * Math.cos(a1 + angleO * angleMul),
        oy + p.y + (dis - CR / 6) * Math.sin(a1 + angleO * angleMul)
    );
    if(!RL) ctx.lineTo(
        ox + p.x + (dis + CR / 6) * Math.cos(a2 + angleO * angleMul),
        oy + p.y + (dis + CR / 6) * Math.sin(a2 + angleO * angleMul)
    );
    else ctx.lineTo(
        ox + p.x + (dis + CR / 6) * Math.cos(a1 + angleO * angleMul),
        oy + p.y + (dis + CR / 6) * Math.sin(a1 + angleO * angleMul)
    );
    ctx.closePath();
    ctx.fill();
    ctx.font = "14px Arial";
    let a12 = Math.atan2((y + ny) / 2 - p.y, (x + nx) / 2 - p.x);
    let tx = p.x + (dis + CR / 4) * Math.cos(a12);
    let ty = p.y + (dis + CR / 4) * Math.sin(a12);
    ctx.beginPath();
    ctx.fillText(str, ox + tx, oy + ty);
    ctx.stroke();
};

/** @param {CanvasRenderingContext2D} ctx */
const renderStates = (ctx) => {
    let R = 0;
    let phi = 2 * Math.PI / stateN;

    if(stateN == 2) R = DIST / 2;
    else if(stateN > 2) {
        R = DIST / Math.sqrt(2 * (1 - Math.cos(phi)));
    }

    let angle = Math.PI / 2;
    if(stateN % 2 == 0) angle -= phi / 2;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = "20px Arial";

    for(let i=0;i<stateN;i++) {
        let x = R * Math.cos(angle);
        let y = - R * Math.sin(angle);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ox + x, oy + y, CR, 0, 2*Math.PI);
        ctx.stroke();

        ctx.fillText(states[i].name, ox + x, oy + y);

        angle += phi;
    }
    let num = 2;
    // renderConnection(ctx, num, num, R);
    // renderConnection(ctx, 1, 1, R, 'proba');
    // renderConnection(ctx, 0, 2, R);
    // renderConnection(ctx, 2, 0, R);
    // renderConnection(ctx, 0, 3, R);
    calcRotateL(R);
    states.forEach((i, ind) => {
        for(let j in i.nodes) {
            renderConnection(ctx, ind, j, R, i.nodes[j].join('+'));
        }
    });
};

const solve = () => {
    let A = [], Q = [], Z = [];

    Q = states.map(i => i.name.split('/')[0]);
    let dirMur = false, isMur = false;
    if(states.some(i => i.name.includes('/'))) {
        Z = states.map(i => i.name.split('/')[1]);
        dirMur = true;
        isMur = true;

        states.forEach(i => {
            for(let j in i.nodes) {
                i.nodes[j].forEach(rval => {
                    const val = rval.split('/');
                    if(!A.includes(val[0])) A.push(val[0]);
                });
            }
        });
    } else {
        states.forEach(i => {
            for(let j in i.nodes) {
                i.nodes[j].forEach(rval => {
                    const val = rval.split('/');
                    if(!Z.includes(val[1])) Z.push(val[1]);
                    if(!A.includes(val[0])) A.push(val[0]);
                });
            }
        });
    }

    Q.sort(); A.sort(); Z.sort();

    if(!A.every(i => states.every(j => {
        for(let k in j.nodes) {
            if(j.nodes[k].some(l => l.includes(i))) return true;
        }
        return false;
    }))) {
        return;
    }

    if(!states.every(i => i.name.includes('/')) && dirMur) return;
    if(!states.every(i => {
        for(let j in i.nodes) {
            if(!i.nodes[j].every(k => k.includes('/'))) return false;
        }
        return true;
    }) && !dirMur) return;

    const azb = document.querySelector('.abc-q');
    azb.innerHTML = `<h4 class="text-center p-4">Azbuke</h4>`;
    if(azb.classList.contains('d-none')) azb.classList.toggle('d-none');
    azb.appendChild(createElem('p', `\\[Q = \\{${Q.map(i => `q_${i}`).join(',')}\\} \\text{ - azbuka stanja}\\]`));
    azb.appendChild(createElem('p', `\\[A = \\{${A.join(',')}\\} \\text{ - azbuka ulaza}\\]`));
    azb.appendChild(createElem('p', `\\[Z = \\{${Z.join(',')}\\} \\text{ - azbuka izlaza}\\]`));

    let outputTable = [];
    let changeTable = [];

    if(dirMur) {
        const tp = document.querySelector('.type-q');
        tp.innerHTML = `<h4 class="text-center p-4">Tip automata</h4>`;
        if(tp.classList.contains('d-none')) tp.classList.toggle('d-none');
        tp.appendChild(createElem('p', `\\[\\text{Tip automata je Murov}\\]`));

        A.forEach(a => {
            let tempTab = [], tempTab2 = [];
            Q.map(q => states.find(i => i.name.split('/')[0] == q)).forEach(q => {
                for(let j in q.nodes) {
                    q.nodes[j].forEach(k => {
                        if(k.includes(a)) {
                            tempTab.push(states[j].name.split('/')[1]);
                            tempTab2.push(j);
                        }
                    });
                }
            });
            outputTable.push(tempTab);
            changeTable.push(tempTab2);
        });
    } else {
        A.forEach(a => {
            let tempTab = [], tempTab2 = [];
            Q.map(q => states.find(i => i.name.split('/')[0] == q)).forEach(q => {
                for(let j in q.nodes) {
                    q.nodes[j].forEach(k => {
                        if(k.includes(a)) {
                            tempTab.push(k.split('/')[1]);
                            tempTab2.push(j);
                        }
                    });
                }
            });
            outputTable.push(tempTab);
            changeTable.push(tempTab2);
        });

        isMur = true;
        let Qinds2 = Q.map(i => states.findIndex(j => j.name.split('/')[0] == i));
        let mat = Qinds2.map(i => Qinds2.map(j => states[i].nodes[j]));
        for(let i=0;i<mat[0].length;i++) {
            let all = true;
            let x = null;
            for(let j=0;j<mat.length;j++) {
                if(mat[j][i]) {
                    mat[j][i].forEach(k => {
                        if(!x) x = k.split('/')[1];
                        else all = all && k.split('/')[1] == x;
                    })
                }
            }
            if(!all) {
                isMur = false;
                break;
            }
        }

        const tp = document.querySelector('.type-q');
        tp.innerHTML = `<h4 class="text-center p-4">Tip automata</h4>`;
        if(tp.classList.contains('d-none')) tp.classList.toggle('d-none');
        tp.appendChild(createElem('p', `\\[\\text{Tip automata je ${isMur ? 'Murov' : 'Milijev'}}\\]`));
    }
    console.log(outputTable, changeTable)

    const tbls = document.querySelector('.tbl1-q');
    tbls.innerHTML = `<h4 class="text-center p-4">Tablice prelaza i izlaza</h4><div class="col-sm"></div><div class="col-sm"></div><div class="col-sm"></div>`;
    if(tbls.classList.contains('d-none')) tbls.classList.toggle('d-none');
    
    let text1 = `
    <tr class="trs">
        <td class="diag">
            <div class="diag-up">q(t)</div>
            <div class="diag-bottom">a</div>
        </td>
        ${Q.map(i => `<td>${i}</td>`).join('')}
    </tr>
    ${changeTable.map((i, ind) => `
    <tr>
        <td>${A[ind]}</td>
        ${i.map(j => `<td>${states[j].name.split('/')[0]}</td>`).join('')}
    </tr>`).join('')}`;
    tbls.querySelectorAll('.col-sm')[0].appendChild(createElemIH('table', text1, 'text-center mx-auto'));
    tbls.querySelectorAll('.col-sm')[0].appendChild(createElemIH('p', `<i>Tablica prelaza</i>`, 'text-center p-2'));

    let text2 = `
    <tr class="trs">
        <td class="diag">
            <div class="diag-up">q(t)</div>
            <div class="diag-bottom">a</div>
        </td>
        ${Q.map((i) => `<td>${i}${isMur?`/${states.find(j => j.name.split('/')[0] == i).name.split('/')[1]}`:``}</td>`).join('')}
    </tr>
    ${changeTable.map((i, ind) => `
    <tr>
        <td>${A[ind]}</td>
        ${i.map((j, jnd) => `<td>${states[j].name.split('/')[0]}${isMur?'':`/${outputTable[ind][jnd]}`}</td>`).join('')}
    </tr>`).join('')}`;
    tbls.querySelectorAll('.col-sm')[1].appendChild(createElemIH('table', text2, 'text-center mx-auto'));
    tbls.querySelectorAll('.col-sm')[1].appendChild(createElemIH('p', `<i>Tablica prelaza/izlaza</i>`, 'text-center p-2'));

    let text3 = `
    <tr class="trs">
        <td class="diag">
            <div class="diag-up">q(t)</div>
            <div class="diag-bottom">a</div>
        </td>
        ${Q.map(i => `<td>${i}</td>`).join('')}
    </tr>
    ${outputTable.map((i, ind) => `
    <tr>
        <td>${A[ind]}</td>
        ${i.map(j => `<td>${j}</td>`).join('')}
    </tr>`).join('')}`;
    tbls.querySelectorAll('.col-sm')[2].appendChild(createElemIH('table', text3, 'text-center mx-auto'));
    tbls.querySelectorAll('.col-sm')[2].appendChild(createElemIH('p', `<i>Tablica izlaza</i>`, 'text-center p-2'));

    let Qinds = Q.map(i => states.findIndex(j => j.name.split('/')[0] == i));

    let mat = Qinds.map(i => Qinds.map(j => states[i].nodes[j]));
    
    const mats = document.querySelector('.mats-q');
    mats.innerHTML = `<h4 class="text-center p-4">Matrice prelaza i izlaza prve vrste</h4><div class="col-sm"></div><div class="col-sm"></div>`;
    if(mats.classList.contains('d-none')) mats.classList.toggle('d-none');

    mats.querySelectorAll('.col-sm')[0].innerHTML = `
    \\[N=
    \\begin{bmatrix}${mat.map(i => i.map((j, jnd) => j ? (isMur ? j.map((_, knd) => _ + '/' + states.find(k => k.name.split('/')[0] == Q[jnd]).name.split('/')[1]) : j.join('+')) : '\\varnothing').join('&')).join('\\\\')}\\end{bmatrix}
    \\]
    <p class="text-center p-2"><i>Matrica prelaza/izlaza</i></p>
    `;

    mats.querySelectorAll('.col-sm')[1].innerHTML = `
    \\[M=
    \\begin{bmatrix}${mat.map(i => i.map(j => j ? j.map(k => k.split('/')[0]).join('+') : '\\varnothing').join('&')).join('\\\\')}\\end{bmatrix}
    \\]
    <p class="text-center p-2"><i>Matrica prelaza</i></p>
    `;

    const tbls2 = document.querySelector('.tbl2-q');
    tbls2.innerHTML = `<h4 class="text-center p-4">Tablica istinitosti</h4><div class="col-sm-4"></div><div class="col-sm-4"></div><div class="col-sm-4"></div>`;
    if(tbls2.classList.contains('d-none')) tbls2.classList.toggle('d-none');

    tbls2.querySelectorAll('.col-sm-4')[0].innerHTML = `
    <table class="table-bordered w-25 mx-auto text-center">
    ${Q.map((i, ind) => `<tr><td>\\[q_${i}\\]</td><td>\\[${numToBin(ind, Q.length)}\\]</td></tr>`).join('')}
    </table>
    <p class="text-center p-2"><i>Kodiranje stanja</i></p>
    `;

    tbls2.querySelectorAll('.col-sm-4')[1].innerHTML = `
    <table class="table-bordered w-25 mx-auto text-center">
    ${A.map((i, ind) => `<tr><td>\\[${i}\\]</td><td>\\[${numToBin(ind, A.length)}\\]</td></tr>`).join('')}
    </table>
    <p class="text-center p-2"><i>Kodiranje ulaza</i></p>
    `;

    tbls2.querySelectorAll('.col-sm-4')[2].innerHTML = `
    <table class="table-bordered w-25 mx-auto text-center">
    ${Z.map((i, ind) => `<tr><td>\\[${i}\\]</td><td>\\[${numToBin(ind, Z.length)}\\]</td></tr>`).join('')}
    </table>
    <p class="text-center p-2"><i>Kodiranje izlaza</i></p>
    `;
    
    let text4 = `
    <tr>
    ${getLog2Arr(Q.length).map(i => `<td>\\[${getLog2Arr(Q.length) < 2 ? 'Q' : `Q_${i}`}(t)\\]</td>`).join('')}
    ${getLog2Arr(A.length).map(i => `<td>\\[${getLog2Arr(A.length) < 2 ? 'A' : `A_${i}`}\\]</td>`).join('')}
    ${getLog2Arr(Q.length).map(i => `<td>\\[${getLog2Arr(Q.length) < 2 ? 'Q' : `Q_${i}`}(t+1)\\]</td>`).join('')}
    ${getLog2Arr(Z.length).map(i => `<td>\\[${getLog2Arr(Z.length) < 2 ? 'Z' : `Z_${i}`}\\]</td>`).join('')}
    </tr>
    `;
    const nq = getLog2Arr(Q.length).length, na = getLog2Arr(A.length).length, nz = getLog2Arr(Z.length).length;
    const n = nq + na;
    for(let i=0;i<Math.pow(2, n);i++) {
        const pomArr = [];
        let temp = i;
        for(let j=0;j<n;j++) {
            pomArr.unshift(temp % 2);
            temp = Math.floor(temp / 2);
        }
        let qind = parseInt(pomArr.slice(0, nq).join(''), 2);
        let aind = parseInt(pomArr.slice(nq).join(''), 2);
        if(qind < Q.length) {
            let qp1 = Q.findIndex(j => j == states[changeTable[aind][qind]].name.split('/')[0]);
            let str = numToBin(qp1, Q.length);
            for(let i=0;i<str.length;i++) pomArr.push(str[i]);
            let str2 = numToBin(Z.findIndex(j => j.split('/')[0] == outputTable[aind][qind]), Z.length);
            for(let i=0;i<str2.length;i++) pomArr.push(str2[i]);
        } else {
            for(let i=0;i<nq + nz;i++) {
                pomArr.push('*');
            }
        }
        text4 += `<tr>${pomArr.map(i => `<td>${i}</td>`).join('')}</tr>`;
    }

    tbls2.appendChild(createElemIH('table', text4, 'ttable table-bordered w-25 mx-auto text-center'));

    const paths = document.querySelector('.paths-q');
    if(paths.classList.contains('d-none')) paths.classList.toggle('d-none');

    mMat = mat.map(i => i.map(j => j ? j.map(k => k.split('/')[0]) : j));

    MathJax.typeset();
};

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

const solvePaths = () => {
    let val = document.getElementById('pathsN').value;
    let fromQ = document.getElementById('fromP').value;
    let toQ = document.getElementById('toP').value;

    let cnt = 1;

    const resq = document.querySelector('.res-q');
    resq.innerHTML = ``;

    resq.appendChild(createElem('p', `\\[M = ${formatMatrix(mMat)}\\]`));

    let prevMat = mMat;

    while(cnt < val) {
        cnt++;
        let prod = mulMat(prevMat, mMat);
        resq.appendChild(createElem('p', `\\[M^${cnt} = M${cnt > 2 ? `^${cnt-1}` : ''}\\cdot M = ${formatMatrix(prevMat)} ${formatMatrix(mMat)} = ${formatMatrix(prod)}\\]`));
        prevMat = prod;
    }
    const Q = states.map(i => i.name.split('/')[0]);

    let fromInd = Q.findIndex(i => i == fromQ);
    let toInd = Q.findIndex(i => i == toQ);

    let paths = prevMat[fromInd][toInd];

    if(!paths) {
        resq.appendChild(createElem('p', `\\[\\text{Nema puteva dužine ${val} od stanja ${fromQ} do stanja ${toQ}}\\]`));
    } else {
        resq.appendChild(createElem('p', `\\[\\text{Putevi dužine ${val} od stanja ${fromQ} do stanja ${toQ} su: }${paths.join('+')}\\]`));
    }

    MathJax.typeset();
};

renderGraph();

document.getElementById('addState').onclick = async () => {
    const { value: formValues } = await Swal.fire({
        title: 'Unesite naziv stanja',
        html: `<input id="stateVal" class="swal2-input">`,
        confirmButtonColor: '#007bff',
        confirmButtonText: 'Dodaj',
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById('stateVal').value
            ]
        }
    });

    if(formValues) {
        stateN++;
        states.push({
            name: formValues[0],
            nodes: {}
        });
        actions.push({
            type: 0
        });
        renderGraph();
    }
};

document.getElementById('addConn').onclick = async () => {
    const html = `
    <select class="swal2-select" id="connFrom"><option selected disabled hidden>Od stanja...</option>${states.map(i => `<option value="${i.name}">${i.name}</option>`)}</select>
    <select class="swal2-select" id="connTo"><option selected disabled hidden>Ka stanju...</option>${states.map(i => `<option value="${i.name}">${i.name}</option>`)}</select>
    <input id="connVal" class="swal2-input">`
    const { value: formValues } = await Swal.fire({
        title: 'Unesite prelaz',
        html: html,
        confirmButtonColor: '#007bff',
        confirmButtonText: 'Dodaj',
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById('connVal').value,
                document.getElementById('connFrom').value,
                document.getElementById('connTo').value
            ]
        }
    });

    if(formValues) {
        states.forEach((i, ind) => {
            if(i.name == formValues[1]) {
                // i.nodes.push({
                //     to: states.findIndex(j => j.name == formValues[2]),
                //     name: formValues[0]
                // });
                const to = states.findIndex(j => j.name == formValues[2]);
                if(i.nodes[to]) i.nodes[to] = i.nodes[to].concat(formValues[0].split('+'));
                else i.nodes[to] = formValues[0].split('+');
                actions.push({
                    type: 1,
                    from: ind, to: to,
                    len: formValues[0].split('+').length
                });
            }
        });
        renderGraph();
    }
};

document.getElementById('analyze').onclick = solve;

document.getElementById('findPs').onclick = solvePaths;

document.getElementById('undoAct').onclick = () => {
    if(actions.length > 0) {
        let action = actions.pop();
        if(action.type == 0) {
            states.pop();
            stateN--;
        }
        else {
            for(let i=0;i<action.len;i++) states[action.from].nodes[action.to].pop();
            if(states[action.from].nodes[action.to].length == 0) delete states[action.from].nodes[action.to];
        }
        renderGraph();
    }
};

document.getElementById('clearAll').onclick = () => {
    actions = [];
    stateN = 0;
    states = [];
    renderGraph();
};