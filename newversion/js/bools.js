import { BCD, diffChar, countChar } from "./utils.js";

class BoolFunction {
    constructor() {
        this.truthValues = [];
        this.varsNum = 0;
        this.simpleValue = null;
    }

    /** @param {String} text */
    parseFunction(text) {
        try {
            for(let i=20;i>=1;i--) {
                if(text.includes(`x${i}`)) {
                    this.varsNum = i;
                    break;
                }
            }
            this.truthValues = [];

            text = text.replaceAll('+', '|').replaceAll('*', '&');

            for(let i=0;i<(2 ** this.varsNum);i++) {
                let temp = i;
                let forEval = text;
                for(let j=this.varsNum;j>=1;j--) {
                    forEval = forEval.replaceAll(`x${j}`, temp & 1);
                    temp >>= 1;
                }
                let res = +eval(forEval);

                if(res != 0 && res != 1) return false;

                this.truthValues.push(res);
            }
            return true;
        }
        catch(err) {
            return false;
        }
    }

    /** @param {Array} truthValues */
    setTruthValues(truthValues) {
        let size = truthValues.length;

        if(!Number.isInteger(Math.log2(size))) return false;

        this.varsNum = Math.log2(size);
        this.truthValues = truthValues;

        return true;
    }

    /** @param {Number} number */
    setFromNumber(number) {
        if(number < 2) {
            this.simpleValue = number;
            this.truthValues = [number];
            return true;
        }

        this.varsNum = Math.ceil(Math.log2(number.toString(2).length));

        for(let i=0;i<(2 ** this.varsNum);i++) {
            this.truthValues.push(number & 1);
            number >>= 1;
        }

        return true;
    }

    /**
     * 
     * @param {Array} ones 
     * @param {Array} zeros 
     * @param {Array} dontc 
     */
    setFromDecs(ones, zeros, dontc) {
        let cnt = (ones.length == 0 ? 1 : 0) + (zeros.length == 0 ? 1 : 0) + (dontc.length == 0 ? 1 : 0);
        if(cnt == 3) return false;
        if(ones.filter(i => zeros.includes(i) || dontc.includes(i)).length > 0) return false;
        if(zeros.filter(i => ones.includes(i) || dontc.includes(i)).length > 0) return false;
        if(dontc.filter(i => zeros.includes(i) || ones.includes(i)).length > 0) return false;

        if(zeros.length == 0) {
            let tempSize = Math.floor(Math.log2(Math.max(ones.length + dontc.length-1, Math.max(...ones), Math.max(...dontc)))) + 1;
            
            for(let i=0;i<2**tempSize;i++) {
                if(!ones.includes(i) && !dontc.includes(i)) zeros.push(i);
            }
        }
        else if(ones.length == 0) {
            let tempSize = Math.floor(Math.log2(Math.max(zeros.length + dontc.length-1, Math.max(...zeros), Math.max(...dontc)))) + 1;
            
            for(let i=0;i<2**tempSize;i++) {
                if(!zeros.includes(i) && !dontc.includes(i)) ones.push(i);
            }
        }
        else if(dontc.length == 0) {
            let tempSize = Math.floor(Math.log2(Math.max(ones.length + zeros.length-1, Math.max(...ones), Math.max(...zeros)))) + 1;
            
            for(let i=0;i<2**tempSize;i++) {
                if(!ones.includes(i) && !zeros.includes(i)) dontc.push(i);
            }
        }
        let numd = ones.length + zeros.length + dontc.length;
        if(!Number.isInteger(Math.log2(numd))) return false;

        this.varsNum = Math.log2(numd);
        this.truthValues = [];
        for(let i=0;i<2**this.varsNum;i++) this.truthValues.push(0);

        ones.forEach(i => this.truthValues[i] = 1);
        zeros.forEach(i => this.truthValues[i] = 0);
        dontc.forEach(i => this.truthValues[i] = '*');

        return true;
    }

    /**
     * 
     * @param {String} vector 
     */
    setFromVector(vector) {
        if(!Number.isInteger(Math.log2(vector.length))) return false;

        if(vector.split('').some(i => i != '1' && i != '0' && i != '*')) return false;

        this.varsNum = Math.log2(vector.length);
        this.truthValues = vector.split('').map(i => {
            if(i == '*') return i;
            return parseInt(i);
        });

        return true;
    }

    getTruthTable() {
        const table = $(`<table class="ttable table-bordered w-25 mx-auto text-center"></table>`);
        const thr = $("<tr></tr>");

        for(let i=1;i<=this.varsNum;i++) thr.append($(`<td>\\[x_${i}\\]</td>`));
        thr.append($(`<td>\\[f\\]</td>`));
        table.append(thr);

        for(let i=0;i<2**this.varsNum;i++) {
            let temp = i, tempArr = [];
            const tr = $("<tr></tr>");
            for(let j=0;j<this.varsNum;j++) {
                tempArr.unshift(temp & 1);
                temp >>= 1;
            }
            tempArr.forEach(j => tr.append($(`<td>${j}</td>`)));
            tr.append($(`<td>${this.truthValues[i]}</td>`));

            table.append(tr);
        }

        return table;
    }

    getDecimalIndeces() {
        const mappedTT = this.truthValues.map((i, ind) => [ind, i]);

        const pZeros = $(`<p>\\[f^{(0)} = \\{${mappedTT.filter(i => i[1] == 0).map(i => i[0]).join(',')}\\}\\]</p>`);
        const pOnes = $(`<p>\\[f^{(1)} = \\{${mappedTT.filter(i => i[1] == 1).map(i => i[0]).join(',')}\\}\\]</p>`);
        const pDontCares = $(`<p>\\[f^{(*)} = \\{${mappedTT.filter(i => i[1] == '*').map(i => i[0]).join(',')}\\}\\]</p>`);

        return [pZeros, pOnes, pDontCares];
    }

    getTruthVector() {
        return $(`<p>\\[K_f = [${this.truthValues.join('')}]^T\\]</p>`)
    }

    getNumericalIndex() {
        if(this.truthValues.includes('*')) {
            return $(`<p>\\[\\text{Ne postoji decimalni indeks}\\]</p>`);
        }
        return $(`<p>\\[N_f = ${parseInt(this.truthValues.slice().reverse().join(''), 2)}\\]</p>`);
    }

    getPDNF() {
        let pdnfText = `f(${Array.from(Array(this.varsNum).keys()).map(i => `x_${i+1}`).join(',')}) =`;

        const filteredTT = this.truthValues
            .map((i, ind) => [ind, i])
            .filter(i => i[1] == 1)
            .map(i => {
                let temp = i[0];
                let res = [];
                for(let i=0;i<this.varsNum;i++) {
                    res.unshift((temp & 1) ? `x_${this.varsNum - i}` : `\\overline{x_${this.varsNum - i}}`);
                    temp >>= 1;
                }
                return res.join('\\cdot ');
            });
        
        if(filteredTT.length == 0) {
            pdnfText += '0';
        }
        else {
            pdnfText += filteredTT.join('+');
        }

        return $(`<p>\\[${pdnfText}\\]</p>`);
    }

    getPKNF() {
        let pknfText = `f(${Array.from(Array(this.varsNum).keys()).map(i => `x_${i+1}`).join(',')}) =`;

        const filteredTT = this.truthValues
            .map((i, ind) => [ind, i])
            .filter(i => i[1] == 0)
            .map(i => {
                let temp = i[0];
                let res = [];
                for(let i=0;i<this.varsNum;i++) {
                    res.unshift(!(temp & 1) ? `x_${this.varsNum - i}` : `\\overline{x_${this.varsNum - i}}`);
                    temp >>= 1;
                }
                if(res.length > 1) return `(${res.join('+')})`;
                else return res[0];
            });
        
        if(filteredTT.length == 0) {
            pknfText += '1';
        }
        else {
            pknfText += filteredTT.join('\\cdot ');
        }

        return $(`<p>\\[${pknfText}\\]</p>`);
    }

    getPPNF() {
        let ppnfText = `f(${Array.from(Array(this.varsNum).keys()).map(i => `x_${i+1}`).join(',')}) =`;

        const filteredTT = this.truthValues
            .map((i, ind) => [ind, i])
            .filter(i => i[1] == 1)
            .map(i => {
                let temp = i[0];
                let res = [];
                for(let i=0;i<this.varsNum;i++) {
                    res.unshift((temp & 1) ? `x_${this.varsNum - i}` : `\\overline{x_${this.varsNum - i}}`);
                    temp >>= 1;
                }
                return res.join('\\cdot ');
            });
        
        if(filteredTT.length == 0) {
            ppnfText += '0';
        }
        else {
            ppnfText += filteredTT.join('\\oplus ');
        }

        return $(`<p>\\[${ppnfText}\\]</p>`);
    }

    getKP() {
        let kpText = `f(${Array.from(Array(this.varsNum).keys()).map(i => `x_${i+1}`).join(',')}) =`;
        let resVars = [];
        this.truthValues
            .map((i, ind) => [ind, i])
            .filter(i => i[1] == 1)
            .forEach(i => {
                let temp = i[0], tempArr = [];

                for(let j=0;j<this.varsNum;j++) {
                    tempArr.unshift(temp & 1);
                    temp >>= 1;
                }
                let vars = Array.from(Array(this.varsNum).keys()).map(j => j + 1);

                let tempVars = [vars.filter((_, j) => tempArr[j])];

                vars.forEach((j, jnd) => {
                    if(!tempArr[jnd]) {
                        tempVars = tempVars.concat(tempVars.map(k => [...k, j]));
                    }
                });
                tempVars = tempVars.map(j => {
                    if(j.length == 0) return ['1'];
                    return j.map(k => `x_${k}`).sort();
                });

                resVars = [...resVars, ...tempVars];
            });
        
        resVars = resVars.map(i => i.join('\\cdot '));
        resVars = resVars.filter(i => resVars.filter(j => j == i).length % 2 == 1);

        let finResVars = [];
        resVars.forEach(i => {
            if(!finResVars.includes(i)) finResVars.push(i);
        });

        let exText = finResVars.sort((a,b) => {
            if(a.length != b.length) return a.length - b.length;
            return a.localeCompare(b);
        }).join('\\oplus ');
        kpText += (exText != '' ? exText : '0');

        return $(`<p>\\[${kpText}\\]</p>`);
    }

    buildKarnaugh() {
        if(this.varsNum < 2 || this.varsNum > 4) return;

        this.karnaugh = {
            varsX: [], varsY: [], map: []
        };

        let yn = this.varsNum >> 1;
        let xn = this.varsNum - yn;

        for(let i=1;i<=yn;i++) this.karnaugh.varsY.push(i);
        for(let i=yn+1;i<=this.varsNum;i++) this.karnaugh.varsX.push(i);

        for(let i=0;i<2**yn;i++) {
            let submap = [];
            for(let j=0;j<2**xn;j++) {
                submap.push(this.truthValues[parseInt(BCD.gray(i, yn) + BCD.gray(j, xn),2)]);
            }
            this.karnaugh.map.push(submap);
        }
    }

    getKarnaughTable() {
        const frameTable = $(`<table class="table-fixed table-noborder table-fit align-middle text-center"></table>`);
        
        const tr1 = $(`<tr><td>\\[n:${this.varsNum}\\]</td><td>\\[${this.karnaugh.varsX.map(i => `x_${i}`).join('')}\\]</td></tr>`);
        frameTable.append(tr1);

        const tr2 = $(`<tr><td>\\[${this.karnaugh.varsY.map(i => `x_${i}`).join('')}\\]</td></tr>`);
        
        const mapTable = $(`<table class="table-fixed table-bordered table-fit align-middle text-center map-table"></table>`);
        const mtr1 = $(`<tr><td class="over"></td></tr>`);

        for(let i=0;i<2**this.karnaugh.varsX.length;i++) {
            mtr1.append($(`<td class="over">${BCD.gray(i, this.karnaugh.varsX.length)}</td>`));
        }
        mapTable.append(mtr1);

        for(let i=0;i<2**this.karnaugh.varsY.length;i++) {
            const ntr = $(`<tr><td class="over">${BCD.gray(i, this.karnaugh.varsY.length)}</td></tr>`);
            this.karnaugh.map[i].forEach(j => ntr.append($(`<td>${j}</td>`)));
            mapTable.append(ntr);
        }

        const mapTD = $(`<td></td>`);
        mapTD.append(mapTable);
        tr2.append(mapTD);
        frameTable.append(tr2);

        return [ frameTable, mapTable ];
    }
}

class MinimizedFunction extends BoolFunction {
    constructor() {
        super();
    }

    static getNewImplicant(im1, im2) {
        let newi = "";
        for(let i=0;i<im1.length;i++) newi += (im1[i] != im2[i] ? '-' : im1[i]);
        return newi;
    }

    static isMatch(im1, im2) {
        for(let i=0;i<im1.length;i++) {
            if(im1[i] == '-') continue;
            if(im1[i] != im2[i]) {
                return false;
            }
        }
        return true;
    }

    static processGroups(groups) {
        let newg = [];
        let used = {};
        for(let i=0;i<groups.length;i++) {
            for(let j=i+1;j<groups.length;j++) {
                if(diffChar(groups[i], groups[j]) == 1) {
                    newg.push(MinimizedFunction.getNewImplicant(groups[i], groups[j]));
                    used[groups[i]] = true;
                    used[groups[j]] = true;
                }
            }
        }
        let notUsed = groups.filter(i => !used[i]);
        return { newg, notUsed };
    }

    static getNumForSort(im) {
        let n = 0;
        for(let i=1;i<=im.length;i++) {
            if(im[i-1] != '-') n = 10*n + i;
        }
        return n;
    }

    static format1(im) {
        let res = [];
        for(let i=1;i<=im.length;i++) {
            if(im[i-1] != '-') {
                res.push({
                    name: `x${i}`,
                    comp: im[i-1] == '0'
                });
            }
        }
        return res;
    }

    static format2(im) {
        let res = [];
        for(let i=1;i<=im.length;i++) {
            if(im[i-1] != '-') {
                res.push({
                    name: `x${i}`,
                    comp: im[i-1] == '1'
                });
            }
        }
        return res;
    }

    static areIntch(ones, im1, im2) {
        return ones.filter(i => MinimizedFunction.isMatch(im1, i)).join(';') == ones.filter(i => MinimizedFunction.isMatch(im2, i)).join(';');
    }

    static isDominatedBy(ones, im1, im2) {
        let dm = ones.filter(i => MinimizedFunction.isMatch(im1, i));
        for(let i=0;i<dm.length;i++) {
            if(!MinimizedFunction.isMatch(im2, dm[i])) return false;
        }
        return !this.areIntch(ones, im1, im2);
    }

    getTruthValue(ind) {
        let val = ind.toString(2);

        return '0'.repeat(this.varsNum - val.length) + val;
    }

    findMinimalDNF() {
        let ones = this.truthValues.map((i, ind) => [ind, i]).filter(i => i[1] == 1).map(i => this.getTruthValue(i[0]));
        let dc = this.truthValues.map((i, ind) => [ind, i]).filter(i => i[1] == '*').map(i => this.getTruthValue(i[0]));
        let groups = ones.concat(dc);
        groups.sort((a,b) => {
            return countChar(a, '1') - countChar(b, '1');
        });
        let impls = [];

        while(groups.length > 0) {
            let obj = MinimizedFunction.processGroups(groups);
    
            groups = obj.newg;
            impls = impls.concat(obj.notUsed);
        }

        impls = impls.filter((i, ind) => impls.slice(ind).filter(j => j == i).length == 1);

        let eImpls = [];

        while(ones.length > 0) {
            // Step 1
            ones.forEach(i => {
                let newIms = impls.filter(j => MinimizedFunction.isMatch(j, i));
                if(newIms.length == 1) {
                    if(!eImpls.includes(newIms[0])) {
                        eImpls.push(newIms[0]);
                    }
                }
            });
    
            // Step 2
            ones = ones.filter(i => {
                return impls.filter(j => MinimizedFunction.isMatch(j, i)).length > 1;
            });
    
            // Step 3
            eImpls.forEach(i => {
                ones = ones.filter(j => !MinimizedFunction.isMatch(i, j));
                impls = impls.filter(j => j != i);
            });
    
            // Step 4
            impls = impls.filter(i => {
                return !impls.some(j => MinimizedFunction.isDominatedBy(ones, i, j));
            });
            impls = impls.filter((i, ind) => impls.slice(ind).filter(j => MinimizedFunction.areIntch(ones, i, j)).length == 1);
    
            if(ones.every(i => {
                return impls.filter(j => MinimizedFunction.isMatch(j, i)).length > 1;
            })) {
                impls.shift();
            }
        }

        eImpls.sort((a, b) => {
            return MinimizedFunction.getNumForSort(a) - MinimizedFunction.getNumForSort(b);
        });

        this.mdnf = eImpls.map(MinimizedFunction.format1);
        this.mdnfBins = eImpls;
    }

    findMinimalKNF() {
        let ones = this.truthValues.map((i, ind) => [ind, i]).filter(i => i[1] == 0).map(i => this.getTruthValue(i[0]));
        let dc = this.truthValues.map((i, ind) => [ind, i]).filter(i => i[1] == '*').map(i => this.getTruthValue(i[0]));
        let groups = ones.concat(dc);
        groups.sort((a,b) => {
            return countChar(a, '0') - countChar(b, '0');
        });
        let impls = [];

        while(groups.length > 0) {
            let obj = MinimizedFunction.processGroups(groups);
    
            groups = obj.newg;
            impls = impls.concat(obj.notUsed);
        }

        impls = impls.filter((i, ind) => impls.slice(ind).filter(j => j == i).length == 1);

        let eImpls = [];

        while(ones.length > 0) {
            // Step 1
            ones.forEach(i => {
                let newIms = impls.filter(j => MinimizedFunction.isMatch(j, i));
                if(newIms.length == 1) {
                    if(!eImpls.includes(newIms[0])) {
                        eImpls.push(newIms[0]);
                    }
                }
            });
    
            // Step 2
            ones = ones.filter(i => {
                return impls.filter(j => MinimizedFunction.isMatch(j, i)).length > 1;
            });
    
            // Step 3
            eImpls.forEach(i => {
                ones = ones.filter(j => !MinimizedFunction.isMatch(i, j));
                impls = impls.filter(j => j != i);
            });
    
            // Step 4
            impls = impls.filter(i => {
                return !impls.some(j => MinimizedFunction.isDominatedBy(ones, i, j));
            });
            impls = impls.filter((i, ind) => impls.slice(ind).filter(j => MinimizedFunction.areIntch(ones, i, j)).length == 1);
    
            if(ones.every(i => {
                return impls.filter(j => MinimizedFunction.isMatch(j, i)).length > 1;
            })) {
                impls.shift();
            }
        }

        eImpls.sort((a, b) => {
            return MinimizedFunction.getNumForSort(a) - MinimizedFunction.getNumForSort(b);
        });

        this.mknf = eImpls.map(MinimizedFunction.format2);
        this.mknfBins = eImpls;
    }

    getKarnaughFigures(mnf) {
        let xn = this.varsNum >> 1;
        let yn = this.varsNum - xn;
        let xns = 2 ** xn, yns = 2 ** yn;
        let figures = [];

        mnf.forEach(im => {
            let matx = [];
            for(let i=0;i<xns;i++) {
                let tempx = [];
                for(let j=0;j<yns;j++) {
                    if(MinimizedFunction.isMatch(im, BCD.gray(i, xn) + BCD.gray(j, yn))) tempx.push(1);
                    else tempx.push(0);
                }
                matx.push(tempx);
            }

            let xp = im.slice(0, xn);
            let xs = 2 ** countChar(xp, '-');
            let yp = im.slice(xn);
            let ys = 2 ** countChar(yp, '-');
            let end = false;

            for(let i=0;i<xns;i++) {
                for(let j=0;j<yns;j++) {
                    let all = true;
                    for(let x=i;x<i+xs;x++) {
                        for(let y=j;y<j+ys;y++) {
                            all = all && matx[x % xns][y % yns] == 1;
                        }
                    }
                    if(all) {
                        figures.push({ y: i, x: j, ys: xs, xs: ys });
                        end = true;
                        break;
                    }
                }
                if(end) break;
            }
        });
        return figures;
    }

    getMinimalDNF() {
        this.findMinimalDNF();
        this.buildKarnaugh();

        let res = [];

        if(this.karnaugh) {
            const [frameTable, mapTable] = this.getKarnaughTable();
            const figures = this.getKarnaughFigures(this.mdnfBins);
            const xn = this.karnaugh.map[0].length, yn = this.karnaugh.map.length;

            figures.forEach(i => {
                let figureElem = $(`<div class="circ"></div>`)[0];
                figureElem.style.width = `${i.xs * 100 - 10}%`;
                figureElem.style.height = `${i.ys * 100 - 10}%`;

                mapTable[0].childNodes[i.y + 1].childNodes[i.x + 1].appendChild(figureElem);
                if(i.x + i.xs > xn) {
                    let figureElem2 = $(`<div class="circ"></div>`)[0];
                    figureElem2.style.width = `${i.xs * 100 - 10}%`;
                    figureElem2.style.height = `${i.ys * 100 - 10}%`;
                    figureElem2.style.left = `${((i.x + i.xs) % xn - i.xs) * 100 + 5}%`;
                    mapTable[0].childNodes[i.y+1].childNodes[(i.x + i.xs) % xn].appendChild(figureElem2);
                }
                if(i.y + i.ys > yn) {
                    let figureElem2 = $(`<div class="circ"></div>`)[0];
                    figureElem2.style.width = `${i.xs * 100 - 10}%`;
                    figureElem2.style.height = `${i.ys * 100 - 10}%`;
                    figureElem2.style.top = `${((i.y + i.ys) % yn - i.ys) * 100 + 5}%`;
                    mapTable[0].childNodes[(i.y + i.ys) % yn].childNodes[i.x+1].appendChild(figureElem2);
                }
                if(i.x + i.xs > xn && i.y + i.ys > yn) {
                    let figureElem2 = $(`<div class="circ"></div>`)[0];
                    figureElem2.style.width = `${i.xs * 100 - 10}%`;
                    figureElem2.style.height = `${i.ys * 100 - 10}%`;
                    figureElem2.style.top = `${((i.y + i.ys) % yn - i.ys) * 100 + 5}%`;
                    figureElem2.style.left = `${((i.x + i.xs) % xn - i.xs) * 100 + 5}%`;
                    mapTable[0].childNodes[(i.y + i.ys) % yn].childNodes[(i.x + i.xs) % xn].appendChild(figureElem2);
                }
            });

            res.push(frameTable);
        }

        let mdnf = `f(${Array.from(Array(this.varsNum).keys()).map(i => `x_${i+1}`).join(',')}) =`;
        mdnf += this.mdnf.map(im => {
            return im.map(i => {
                if(i.comp) return `\\overline{${i.name[0]}_{${i.name.slice(1)}}}`;
                else return `${i.name[0]}_{${i.name.slice(1)}}`;
            }).join('\\cdot ');
        }).join('+');

        res.push($(`<p>\\[${mdnf}\\]</p>`));
        return res;
    }

    getMinimalKNF() {
        this.findMinimalKNF();
        this.buildKarnaugh();

        let res = [];

        if(this.karnaugh) {
            const [frameTable, mapTable] = this.getKarnaughTable();
            const figures = this.getKarnaughFigures(this.mknfBins);
            const xn = this.karnaugh.map[0].length, yn = this.karnaugh.map.length;

            figures.forEach(i => {
                let figureElem = $(`<div class="circ"></div>`)[0];
                figureElem.style.width = `${i.xs * 100 - 10}%`;
                figureElem.style.height = `${i.ys * 100 - 10}%`;

                mapTable[0].childNodes[i.y + 1].childNodes[i.x + 1].appendChild(figureElem);
                if(i.x + i.xs > xn) {
                    let figureElem2 = $(`<div class="circ"></div>`)[0];
                    figureElem2.style.width = `${i.xs * 100 - 10}%`;
                    figureElem2.style.height = `${i.ys * 100 - 10}%`;
                    figureElem2.style.left = `${((i.x + i.xs) % xn - i.xs) * 100 + 5}%`;
                    mapTable[0].childNodes[i.y+1].childNodes[(i.x + i.xs) % xn].appendChild(figureElem2);
                }
                if(i.y + i.ys > yn) {
                    let figureElem2 = $(`<div class="circ"></div>`)[0];
                    figureElem2.style.width = `${i.xs * 100 - 10}%`;
                    figureElem2.style.height = `${i.ys * 100 - 10}%`;
                    figureElem2.style.top = `${((i.y + i.ys) % yn - i.ys) * 100 + 5}%`;
                    mapTable[0].childNodes[(i.y + i.ys) % yn].childNodes[i.x+1].appendChild(figureElem2);
                }
                if(i.x + i.xs > xn && i.y + i.ys > yn) {
                    let figureElem2 = $(`<div class="circ"></div>`)[0];
                    figureElem2.style.width = `${i.xs * 100 - 10}%`;
                    figureElem2.style.height = `${i.ys * 100 - 10}%`;
                    figureElem2.style.top = `${((i.y + i.ys) % yn - i.ys) * 100 + 5}%`;
                    figureElem2.style.left = `${((i.x + i.xs) % xn - i.xs) * 100 + 5}%`;
                    mapTable[0].childNodes[(i.y + i.ys) % yn].childNodes[(i.x + i.xs) % xn].appendChild(figureElem2);
                }
            });

            res.push(frameTable);
        }

        let mknf = `f(${Array.from(Array(this.varsNum).keys()).map(i => `x_${i+1}`).join(',')}) =`;
        mknf += this.mknf.map(im => {
            if(im.length > 1) return '(' + im.map(i => {
                if(i.comp) return `\\overline{${i.name[0]}_{${i.name.slice(1)}}}`;
                else return `${i.name[0]}_{${i.name.slice(1)}}`;
            }).join('+ ') + ')';
            else {
                if(im[0].comp) return `\\overline{${im[0].name[0]}_{${im[0].name.slice(1)}}}`;
                else return `${im[0].name[0]}_{${im[0].name.slice(1)}}`;
            }
        }).join('\\cdot ');

        res.push($(`<p>\\[${mknf}\\]</p>`));
        return res;
    }
}

export { BoolFunction, MinimizedFunction };