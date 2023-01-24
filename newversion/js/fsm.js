import * as utils from "./utils.js";

const CR = 30;
const DIST = 200;

class FSM {
    constructor() {
        this.states = [];
        this.actions = [];

        this.ox = 300;
        this.oy = 300;

        this.RL = false;
    }

    /**
     * @param {HTMLCanvasElement} canvas
     */
    render(canvas) {
        let R = 0;
        const stateN = this.states.length;
        let phi = 2 * Math.PI / stateN;

        if(stateN == 2) R = DIST / 2;
        else if(stateN > 2) {
            R = DIST / Math.sqrt(2 * (1 - Math.cos(phi)));
        }

        canvas.width = 2 * R + DIST * 1.5;
        canvas.height = 2 * R + DIST;

        this.ox = R + DIST * 0.75;
        this.oy = R + DIST / 2;

        this.renderStates(canvas.getContext('2d'));
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    renderStates(ctx) {
        let R = 0;
        const stateN = this.states.length;
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
            ctx.arc(this.ox + x, this.oy + y, CR, 0, 2*Math.PI);
            ctx.stroke();
    
            ctx.fillText(this.states[i].name, this.ox + x, this.oy + y);
    
            angle += phi;
        }

        this.calcRotateL(R);
        this.states.forEach((i, ind) => {
            for(let j in i.nodes) {
                this.renderConnection(ctx, ind, j, R, i.nodes[j].join('+'));
            }
        });
    }

    calcRotateL(R) {
        const stateN = this.states.length;
        let phi = 2 * Math.PI / stateN;
        let angle = Math.PI / 2;
        if(stateN % 2 == 0) angle -= phi / 2;
    
        let cntL = 0, cnt = 0;
    
        this.states.forEach((i, ind) => {
            for(let j in i.nodes) {
                if(j != ind) {
                    let x = R * Math.cos(angle + ind * phi);
                    let y = - R * Math.sin(angle + ind * phi);
                    let nx = R * Math.cos(angle + j * phi);
                    let ny = - R * Math.sin(angle + j * phi);
                    let p1 = utils.rotateAround({ x, y }, { x:nx, y:ny }, - Math.PI / 3);
                    let p2 = utils.rotateAround({ x, y }, { x:nx, y:ny }, Math.PI / 3);
                    if(utils.norm(p1) < utils.norm(p2)) cntL++;
                    cnt++;
                }
            }
        });
    
        this.RL = cntL * 2 < cnt;
    }

    /** @param {CanvasRenderingContext2D} ctx */
    renderConnection(ctx, from, to, R, str) {
        const stateN = this.states.length;
        let phi = 2 * Math.PI / stateN;
        let angle = Math.PI / 2;
        if(stateN % 2 == 0) angle -= phi / 2;

        let x = R * Math.cos(angle + from * phi);
        let y = - R * Math.sin(angle + from * phi);

        if(from == to) {
            let dx = x / R, dy = y / R;
            let ncx = x + dx * CR * 6/4;
            let ncy = y + dy * CR * 6/4;

            const pts = utils.getIntersectC2(x, y, CR, ncx, ncy, CR * 0.9);
            let a1 = Math.atan2(pts.y1 - ncy, pts.x1 - ncx);
            let a2 = Math.atan2(pts.y2 - ncy, pts.x2 - ncx);

            let a2o = a2, k = 1;
            if(ncy > y || (Math.round(ncy * 1000) == Math.round(y * 1000) && ncx > x)) {
                [a1, a2] = [a2, a1];
                k = -1;
            }

            ctx.beginPath();
            ctx.arc(this.ox + ncx, this.oy + ncy, CR * 0.9, a2, a1);
            ctx.stroke();
            ctx.beginPath();
            const arrowOffset = k * Math.PI / 7;
            ctx.moveTo(this.ox + pts.x2, this.oy + pts.y2);
            ctx.lineTo(
                this.ox + ncx + (CR * 0.9 + CR / 6) * Math.cos(a2o + arrowOffset),
                this.oy + ncy + (CR * 0.9 + CR / 6) * Math.sin(a2o + arrowOffset)
            );
            ctx.lineTo(
                this.ox + ncx + (CR * 0.9 - CR / 5) * Math.cos(a2o + arrowOffset),
                this.oy + ncy + (CR * 0.9 - CR / 5) * Math.sin(a2o + arrowOffset)
            );
            ctx.closePath();
            ctx.fill();

            ctx.font = "14px Arial";
            let tx = x + dx * CR * 11/4;
            let ty = y + dy * CR * 11/4;
            
            ctx.beginPath();
            ctx.fillText(str, this.ox + tx, this.oy + ty);
            ctx.stroke();
            return;
        }
        let nx = R * Math.cos(angle + to * phi);
        let ny = - R * Math.sin(angle + to * phi);
        let p = utils.rotateAround({ x, y }, { x:nx, y:ny }, - Math.PI / 3);
        if(this.RL) p = utils.rotateAround({ x, y }, { x:nx, y:ny }, Math.PI / 3);

        let dis = Math.sqrt((y - ny)*(y - ny) + (x - nx)*(x - nx));
        let a1 = Math.atan2(y - p.y, x - p.x);
        let a2 = Math.atan2(ny - p.y, nx - p.x);
        let angleO = Math.acos(1 - CR*CR / (2 * dis*dis));

        ctx.beginPath();
        if(!this.RL) ctx.arc(this.ox + p.x, this.oy + p.y, dis, a2 + angleO, a1 - angleO);
        else ctx.arc(this.ox + p.x, this.oy + p.y, dis, a1 + angleO, a2 - angleO);
        ctx.stroke();

        const angleMul = 1.4;
        let xp = p.x + dis * Math.cos(a2 + angleO);
        if(this.RL) xp = p.x + dis * Math.cos(a2 - angleO);
        let yp = p.y + dis * Math.sin(a2 + angleO); 
        if(this.RL) yp = p.y + dis * Math.sin(a2 - angleO); 

        ctx.beginPath();
        ctx.moveTo(this.ox + xp, this.oy + yp);
        if(!this.RL) ctx.lineTo(
            this.ox + p.x + (dis - CR / 6) * Math.cos(a2 + angleO * angleMul),
            this.oy + p.y + (dis - CR / 6) * Math.sin(a2 + angleO * angleMul)
        );
        else ctx.lineTo(
            this.ox + p.x + (dis - CR / 6) * Math.cos(a2 - angleO * angleMul),
            this.oy + p.y + (dis - CR / 6) * Math.sin(a2 - angleO * angleMul)
        );
        if(!this.RL) ctx.lineTo(
            this.ox + p.x + (dis + CR / 6) * Math.cos(a2 + angleO * angleMul),
            this.oy + p.y + (dis + CR / 6) * Math.sin(a2 + angleO * angleMul)
        );
        else ctx.lineTo(
            this.ox + p.x + (dis + CR / 6) * Math.cos(a2 - angleO * angleMul),
            this.oy + p.y + (dis + CR / 6) * Math.sin(a2 - angleO * angleMul)
        );
        ctx.closePath();
        ctx.fill();

        ctx.font = "14px Arial";
        let a12 = Math.atan2((y + ny) / 2 - p.y, (x + nx) / 2 - p.x);
        let tx = p.x + (dis + CR / 4) * Math.cos(a12);
        let ty = p.y + (dis + CR / 4) * Math.sin(a12);

        ctx.beginPath();
        ctx.fillText(str, this.ox + tx, this.oy + ty);
        ctx.stroke();
    }

    solve(canvas = null) {
        if(this.states.length < 2) {
            Swal.fire({
                icon: 'error',
                title: 'Greška',
                text: 'Neispravno unet automat!'
            });
            return;
        }
        if(!this.solveAlphabets()) {
            Swal.fire({
                icon: 'error',
                title: 'Greška',
                text: 'Neispravno unet automat!'
            });
            return;
        }
        if(canvas != null) this.render(canvas);
        this.solveType();
        this.solveTables();
        this.solveMatrices();
        this.solveTruthTable();

        const paths = document.querySelector('.paths-q');
        if(paths.classList.contains('d-none')) paths.classList.toggle('d-none');

        MathJax.typeset();
    }

    solveAlphabets() {
        let A = [], Q = [], Z = [];

        Q = this.states.map(i => i.name.split('/')[0]);

        let dirMur = false, isMur = false;
        if(this.states.some(i => i.name.includes('/'))) {
            Z = this.states.map(i => i.name.split('/')[1]);
            Z = Z.filter((j, jnd) => Z.slice(jnd + 1).findIndex(k => k == j) == -1);
            dirMur = true;
            isMur = true;
    
            this.states.forEach(i => {
                for(let j in i.nodes) {
                    i.nodes[j].forEach(rval => {
                        const val = rval.split('/');
                        if(!A.includes(val[0])) A.push(val[0]);
                    });
                }
            });
        } else {
            this.states.forEach(i => {
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

        if(!A.every(i => this.states.every(j => {
            for(let k in j.nodes) {
                if(j.nodes[k].some(l => l.includes(i))) return true;
            }
            return false;
        }))) {
            return false;
        }
    
        if(!this.states.every(i => i.name.includes('/')) && dirMur) return false;
        if(!this.states.every(i => {
            for(let j in i.nodes) {
                if(!i.nodes[j].every(k => k.includes('/'))) return false;
            }
            return true;
        }) && !dirMur) return false;

        this.Q = Q; this.A = A; this.Z = Z;
        this.dirMur = dirMur; this.isMur = isMur;

        const azb = $('.abc-q')[0];
        azb.innerHTML = `<h4 class="text-center p-4">Azbuke</h4>`;
        if(azb.classList.contains('d-none')) azb.classList.toggle('d-none');
        azb.appendChild($(`<p>\\[Q = \\{${Q.map(i => `q_${i}`).join(',')}\\} \\text{ - azbuka stanja}\\]</p>`)[0]);
        azb.appendChild($(`<p>\\[A = \\{${A.join(',')}\\} \\text{ - azbuka ulaza}\\]</p>`)[0]);
        azb.appendChild($(`<p>\\[Z = \\{${Z.join(',')}\\} \\text{ - azbuka izlaza}\\]</p>`)[0]);

        return true;
    }

    solveType() {
        let outputTable = [];
        let changeTable = [];

        if(this.dirMur) {
            const tp = $('.type-q')[0];
            tp.innerHTML = `<h4 class="text-center p-4">Tip automata</h4>`;
            if(tp.classList.contains('d-none')) tp.classList.toggle('d-none');
            tp.appendChild($(`<p>\\[\\text{Tip automata je Murov}\\]</p>`)[0]);
    
            this.A.forEach(a => {
                let tempTab = [], tempTab2 = [];
                this.Q.map(q => this.states.find(i => i.name.split('/')[0] == q)).forEach(q => {
                    for(let j in q.nodes) {
                        q.nodes[j].forEach(k => {
                            if(k.includes(a)) {
                                let qjnd = this.Q.findIndex(l => l == this.states[j].name.split('/')[0]);
                                tempTab.push(this.states.find(k => k.name.split('/')[0] == this.Q[qjnd]).name.split('/')[1]);
                                tempTab2.push(qjnd);
                            }
                        });
                    }
                });
                outputTable.push(tempTab);
                changeTable.push(tempTab2);
            });
        } else {
            this.A.forEach(a => {
                let tempTab = [], tempTab2 = [];
                this.Q.map(q => this.states.find(i => i.name.split('/')[0] == q)).forEach(q => {
                    for(let j in q.nodes) {
                        q.nodes[j].forEach(k => {
                            if(k.includes(a)) {
                                let qjnd = this.Q.findIndex(l => l == this.states[j].name.split('/')[0]);
                                tempTab.push(k.split('/')[1]);
                                tempTab2.push(qjnd);
                            }
                        });
                    }
                });
                outputTable.push(tempTab);
                changeTable.push(tempTab2);
            });
    
            this.isMur = true;
            let Qinds2 = this.Q.map(i => this.states.findIndex(j => j.name.split('/')[0] == i));
            let mat = Qinds2.map(i => Qinds2.map(j => this.states[i].nodes[j]));
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
                    this.isMur = false;
                    break;
                }
            }
    
            const tp = $('.type-q')[0];
            tp.innerHTML = `<h4 class="text-center p-4">Tip automata</h4>`;
            if(tp.classList.contains('d-none')) tp.classList.toggle('d-none');
            tp.appendChild($(`<p>\\[\\text{Tip automata je ${this.isMur ? 'Murov' : 'Milijev'}}\\]</p>`)[0]);
        }

        this.outputTable = outputTable;
        this.changeTable = changeTable;
    }

    solveTables() {
        const tbls = $('.tbl1-q')[0];
        tbls.innerHTML = `<h4 class="text-center p-4">Tablice prelaza i izlaza</h4><div class="col-sm"></div><div class="col-sm"></div><div class="col-sm"></div>`;
        if(tbls.classList.contains('d-none')) tbls.classList.toggle('d-none');
        
        let text1 = `
        <tr class="trs">
            <td class="diag">
                <div class="diag-up">q(t)</div>
                <div class="diag-bottom">a</div>
            </td>
            ${this.Q.map(i => `<td>${i}</td>`).join('')}
        </tr>
        ${this.changeTable.map((i, ind) => `
        <tr>
            <td>${this.A[ind]}</td>
            ${i.map(j => `<td>${this.states.find(k => k.name.split('/')[0] == this.Q[j]).name.split('/')[0]}</td>`).join('')}
        </tr>`).join('')}`;
        tbls.querySelectorAll('.col-sm')[0].appendChild($(`<table class='text-center mx-auto'>${text1}</table>`)[0]);
        tbls.querySelectorAll('.col-sm')[0].appendChild($(`<p class='text-center p-2'><i>Tablica prelaza</i></p>`)[0]);

        let text2 = `
        <tr class="trs">
            <td class="diag">
                <div class="diag-up">q(t)</div>
                <div class="diag-bottom">a</div>
            </td>
            ${this.Q.map((i, ind) => `<td>${i}${this.isMur?`/${this.dirMur?this.states.find(j => j.name.split('/')[0] == i).name.split('/')[1]:this.outputTable[0][ind]}`:``}</td>`).join('')}
        </tr>
        ${this.changeTable.map((i, ind) => `
        <tr>
            <td>${this.A[ind]}</td>
            ${i.map((j, jnd) => `<td>${this.states.find(k => k.name.split('/')[0] == this.Q[j]).name.split('/')[0]}${this.isMur?'':`/${this.outputTable[ind][jnd]}`}</td>`).join('')}
        </tr>`).join('')}`;
        tbls.querySelectorAll('.col-sm')[1].appendChild($(`<table class='text-center mx-auto'>${text2}</table>`)[0]);
        tbls.querySelectorAll('.col-sm')[1].appendChild($(`<p class='text-center p-2'><i>Tablica prelaza/izlaza</i></p>`)[0]);

        let text3 = `
        <tr class="trs">
            <td class="diag">
                <div class="diag-up">q(t)</div>
                <div class="diag-bottom">a</div>
            </td>
            ${this.Q.map(i => `<td>${i}</td>`).join('')}
        </tr>
        ${this.outputTable.map((i, ind) => `
        <tr>
            <td>${this.A[ind]}</td>
            ${i.map(j => `<td>${j}</td>`).join('')}
        </tr>`).join('')}`;
        tbls.querySelectorAll('.col-sm')[2].appendChild($(`<table class='text-center mx-auto'>${text3}</table>`)[0]);
        tbls.querySelectorAll('.col-sm')[2].appendChild($(`<p class='text-center p-2'><i>Tablica izlaza</i></p>`)[0]);
    }

    solveMatrices() {
        let Qinds = this.Q.map(i => this.states.findIndex(j => j.name.split('/')[0] == i));

        let mat = Qinds.map(i => Qinds.map(j => this.states[i].nodes[j]));
        
        const mats = $('.mats-q')[0];
        mats.innerHTML = `<h4 class="text-center p-4">Matrice prelaza i izlaza prve vrste</h4><div class="col-sm"></div><div class="col-sm"></div>`;
        if(mats.classList.contains('d-none')) mats.classList.toggle('d-none');

        mats.querySelectorAll('.col-sm')[0].innerHTML = `
        \\[N=
        \\begin{bmatrix}${mat.map(i => i.map((j, jnd) => j ? (this.dirMur ? j.map((_, knd) => _ + '/' + this.states.find(k => k.name.split('/')[0] == this.Q[jnd]).name.split('/')[1]) : j.join('+')) : '\\varnothing').join('&')).join('\\\\')}\\end{bmatrix}
        \\]
        <p class="text-center p-2"><i>Matrica prelaza/izlaza</i></p>
        `;

        mats.querySelectorAll('.col-sm')[1].innerHTML = `
        \\[M=
        \\begin{bmatrix}${mat.map(i => i.map(j => j ? j.map(k => k.split('/')[0]).join('+') : '\\varnothing').join('&')).join('\\\\')}\\end{bmatrix}
        \\]
        <p class="text-center p-2"><i>Matrica prelaza</i></p>
        `;

        this.mMat = mat.map(i => i.map(j => j ? j.map(k => k.split('/')[0]) : j));
    }

    solveTruthTable() {
        const tbls2 = document.querySelector('.tbl2-q');
        tbls2.innerHTML = `<h4 class="text-center p-4">Tablica istinitosti</h4>`;
        if(tbls2.classList.contains('d-none')) tbls2.classList.toggle('d-none');

        let text1 = `<tr><td>\\[Q(t)\\]</td><td>\\[A\\]</td><td>\\[Q(t+1)\\]</td><td>\\[Z\\]</td></tr>`;

        this.Q.forEach((i, ind) => {
            this.A.forEach((j, jnd) => {
                text1 += `<tr><td>\\[${i}\\]</td><td>\\[${j}\\]</td><td>\\[${this.Q[this.changeTable[jnd][ind]]}\\]</td><td>\\[${this.outputTable[jnd][ind]}\\]</td></tr>`;
            });
        });

        tbls2.appendChild($(`<div class="row"><table class='ttable table-bordered w-25 mx-auto text-center'>${text1}</table></div>`)[0]);

        tbls2.innerHTML += `<div class="col-sm-4"></div><div class="col-sm-4"></div><div class="col-sm-4"></div>`;

        tbls2.querySelectorAll('.col-sm-4')[0].innerHTML = `
        <table class="table-bordered w-25 mx-auto text-center">
        ${this.Q.map((i, ind) => `<tr><td>\\[q_${i}\\]</td><td>\\[${utils.toLogBin(ind, this.Q.length)}\\]</td></tr>`).join('')}
        </table>
        <p class="text-center p-2"><i>Kodiranje stanja</i></p>
        `;

        tbls2.querySelectorAll('.col-sm-4')[1].innerHTML = `
        <table class="table-bordered w-25 mx-auto text-center">
        ${this.A.map((i, ind) => `<tr><td>\\[${i}\\]</td><td>\\[${utils.toLogBin(ind, this.A.length)}\\]</td></tr>`).join('')}
        </table>
        <p class="text-center p-2"><i>Kodiranje ulaza</i></p>
        `;

        tbls2.querySelectorAll('.col-sm-4')[2].innerHTML = `
        <table class="table-bordered w-25 mx-auto text-center">
        ${this.Z.map((i, ind) => `<tr><td>\\[${i}\\]</td><td>\\[${utils.toLogBin(ind, this.Z.length)}\\]</td></tr>`).join('')}
        </table>
        <p class="text-center p-2"><i>Kodiranje izlaza</i></p>
        `;

        let text4 = `
        <tr>
        ${utils.getLog2Arr(this.Q.length).map(i => `<td>\\[${utils.getLog2Arr(this.Q.length) < 2 ? 'Q' : `Q_${i}`}(t)\\]</td>`).join('')}
        ${utils.getLog2Arr(this.A.length).map(i => `<td>\\[${utils.getLog2Arr(this.A.length) < 2 ? 'A' : `A_${i}`}\\]</td>`).join('')}
        ${utils.getLog2Arr(this.Q.length).map(i => `<td>\\[${utils.getLog2Arr(this.Q.length) < 2 ? 'Q' : `Q_${i}`}(t+1)\\]</td>`).join('')}
        ${utils.getLog2Arr(this.Z.length).map(i => `<td>\\[${utils.getLog2Arr(this.Z.length) < 2 ? 'Z' : `Z_${i}`}\\]</td>`).join('')}
        </tr>
        `;

        const nq = utils.getLog2Arr(this.Q.length).length, na = utils.getLog2Arr(this.A.length).length, nz = utils.getLog2Arr(this.Z.length).length;
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
            if(qind < this.Q.length && aind < this.A.length) {
                let qp1 = this.changeTable[aind][qind];
                let str = utils.toLogBin(qp1, this.Q.length);
                for(let i=0;i<str.length;i++) pomArr.push(str[i]);
                let str2 = utils.toLogBin(this.Z.findIndex(j => j == this.outputTable[aind][qind].split('/')[0]), this.Z.length);
                for(let i=0;i<str2.length;i++) pomArr.push(str2[i]);
            } else {
                for(let i=0;i<nq + nz;i++) {
                    pomArr.push('*');
                }
            }
            text4 += `<tr>${pomArr.map(i => `<td>${i}</td>`).join('')}</tr>`;
        }

        tbls2.appendChild($(`<table class='ttable table-bordered w-25 mx-auto text-center'>${text4}</table>`)[0]);
    }

    solvePaths() {
        let val = $('#pathsN').val();
        let fromQ = $('#fromP').val().trim();
        let toQ = $('#toP').val().trim();

        val = parseInt(val);
    
        let cnt = 1;
    
        const resq = $('.res-q')[0];
        resq.innerHTML = ``;
    
        resq.appendChild($(`<p>\\[M = ${utils.formatMatrix(this.mMat)}\\]</p>`)[0]);
    
        let prevMat = this.mMat;
    
        while(cnt < val) {
            cnt++;
            let prod = utils.mulMat(prevMat, this.mMat);
            resq.appendChild($(`<p>\\[M^${cnt} = M${cnt > 2 ? `^${cnt-1}` : ''}\\cdot M = ${utils.formatMatrix(prevMat)} ${utils.formatMatrix(this.mMat)} = ${utils.formatMatrix(prod)}\\]</p>`)[0]);
            prevMat = prod;
        }
    
        let fromInd = this.Q.findIndex(i => i == fromQ);
        let toInd = this.Q.findIndex(i => i == toQ);
    
        let paths = prevMat[fromInd][toInd];
    
        if(!paths) {
            resq.appendChild($(`<p>\\[\\text{Nema puteva dužine ${val} od stanja ${fromQ} do stanja ${toQ}}\\]</p>`)[0]);
        } else {
            resq.appendChild($(`<p>\\[\\text{Putevi dužine ${val} od stanja ${fromQ} do stanja ${toQ} su: }${paths.join('+')}\\]</p>`)[0]);
        }
    
        MathJax.typeset();
    };
}

let fsm = new FSM();

fsm.render($("#graph")[0]);

$("#addConn").on('click', async () => {
    const html = `
        <select class="swal2-select" id="connFrom"><option selected disabled hidden>Od stanja...</option>${fsm.states.map(i => `<option value="${i.name}">${i.name}</option>`)}</select>
        <select class="swal2-select" id="connTo"><option selected disabled hidden>Ka stanju...</option>${fsm.states.map(i => `<option value="${i.name}">${i.name}</option>`)}</select>
        <input id="connVal" class="swal2-input">
    `;

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
        fsm.states.forEach((i, ind) => {
            if(i.name == formValues[1]) {
                const to = fsm.states.findIndex(j => j.name == formValues[2]);
                if(i.nodes[to]) i.nodes[to] = i.nodes[to].concat(formValues[0].split('+'));
                else i.nodes[to] = formValues[0].split('+');

                fsm.actions.push({
                    type: 1,
                    from: ind, to: to,
                    len: formValues[0].split('+').length
                });
            }
        });

        fsm.render($("#graph")[0]);
    }
});

$("#addState").on('click', async () => {
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
        fsm.states.push({
            name: formValues[0],
            nodes: {}
        });

        fsm.actions.push({
            type: 0
        });

        fsm.render($("#graph")[0]);
    }
});

$("#analyze").on('click', () => {
    fsm.solve();
});

$("#findPs").on('click', () => {
    fsm.solvePaths();
});

$("#clearAll").on('click', () => {
    fsm.states = [];
    fsm.actions = [];
    fsm.render($("#graph")[0]);
});

$("#undoAct").on('click', () => {
    if(fsm.actions.length > 0) {
        let action = fsm.actions.pop();
        if(action.type == 0) {
            fsm.states.pop();
        }
        else {
            for(let i=0;i<action.len;i++) fsm.states[action.from].nodes[action.to].pop();
            if(fsm.states[action.from].nodes[action.to].length == 0) delete fsm.states[action.from].nodes[action.to];
        }
        fsm.render($("#graph")[0]);
    }
});

$("#next").click(() => {
    $('.main-q').toggleClass('d-none');
    if($('#rb-graph')[0].checked) {
        $('.graph-q-con').toggleClass('d-none');
    }
    else if($('#rb-tables')[0].checked) {
        $('.tables-q-con').toggleClass('d-none');
    }
    else if($('#rb-mats')[0].checked) {
        $('.mats-q-con').toggleClass('d-none');
    }
});

$("#create1").click(() => {
    let qsize = $("#states1").val();
    let isize = $("#inputs1").val();

    qsize = Number(qsize);
    isize = Number(isize);

    let text1 = `
    <tr class="trs">
        <td class="diag">
            <div class="diag-up">q(t)</div>
            <div class="diag-bottom">a</div>
        </td>
        ${Array.from(Array(qsize)).map(_ => `<td><input type='text'/></td>`).join('')}
    </tr>
    ${Array.from(Array(isize)).map(_ => `
    <tr>
    ${Array.from(Array(qsize+1)).map(_ => `<td><input type='text'/></td>`).join('')}
    </tr>`).join('')}`;
    $(".tables-q-con")[0].querySelectorAll('.col-sm')[0].innerHTML = ``;
    $(".tables-q-con")[0].querySelectorAll('.col-sm')[0].appendChild($(`<table class='text-center mx-auto my-4'>${text1}</table>`)[0]);

    $("#analyze2").removeClass('d-none');
});

const getFromTables = () => {
    let qsize = $("#states1").val();
    let isize = $("#inputs1").val();

    qsize = Number(qsize);
    isize = Number(isize);

    const inputs =  $(".tables-q-con table input");

    let Qs = [], As = [];

    for(let i=0;i<qsize;i++) {
        Qs.push(inputs[i].value);
    }

    for(let i=0;i<isize;i++) {
        let temp = [];
        for(let j=0;j<=qsize;j++) {
            temp.push(inputs[qsize + i*(qsize + 1) + j].value);
        }
        As.push(temp);
    }

    if(Qs.some(i => i.includes('/')) && !Qs.every(i => i.includes('/'))) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno unet automat!'
        });
        return false;
    }
    else if(As.some(i => i.slice(1).some(j => j.includes('/'))) && !As.every(i => i.slice(1).every(j => j.includes('/')))) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno unet automat!'
        });
        return false;
    }

    let forRet = true;
    fsm.states = Qs.map((i, ind) => {
        let obj = {
            name: i,
            nodes: {}
        };
        As.forEach(arr => {
            let qind = Qs.findIndex(j => j.split('/')[0] == arr[ind+1].split('/')[0]);
            if(forRet && qind == -1) {
                Swal.fire({
                    icon: 'error',
                    title: 'Greška',
                    text: 'Neispravno unet automat!'
                });
                forRet = false;
            }
            let nodesArr = obj.nodes[qind];
            if(!nodesArr) {
                obj.nodes[Qs.findIndex(j => j.split('/')[0] == arr[ind+1].split('/')[0])] = [arr[0] + (arr[ind+1].split('/').length > 1 ? '/' + arr[ind+1].split('/')[1] : '')];
            }
            else {
                obj.nodes[Qs.findIndex(j => j.split('/')[0] == arr[ind+1].split('/')[0])].push(arr[0] + (arr[ind+1].split('/').length > 1 ? '/' + arr[ind+1].split('/')[1] : ''));
            }
        });
        return obj;
    });

    return forRet;
};

$("#analyze2").click(() => {
    if(!getFromTables()) return;
    $("#graph2").parent().toggleClass('d-none');
    fsm.solve($("#graph2")[0]);
});

$("#create2").click(() => {
    let qsize = $("#states2").val();

    qsize = Number(qsize);

    $(".mats-q-con .col-sm").html('');
    $(".mats-q-con .col-sm").append($(`<div class="mat-inputs">${Array.from(Array(qsize)).map(_ => `<div class="mat-row">${Array.from(Array(qsize)).map(_ => `<input type="text"/>`).join('')}</div>`).join('')}</div>`));

    $("#analyze3").removeClass('d-none');
});

const getFromMat = () => {
    let qsize = Number($("#states2").val());
    let mat = $(".mats-q-con .col-sm input");

    fsm.states = Array.from(Array(qsize).keys()).map(i => {
        let obj = { name: String(i+1), nodes: {} };

        Array.from(Array(qsize).keys()).forEach(j => {
            if(mat[i*qsize + j].value != '') obj.nodes[j] = mat[i*qsize + j].value.split('+');
        });

        return obj;
    });

    console.log(fsm.states);
};

$("#analyze3").click(() => {
    getFromMat();
    $("#graph2").parent().toggleClass('d-none');
    fsm.solve($("#graph2")[0]);
});