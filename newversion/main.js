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

const getGrays = (num, bits) => {
    let res = (num ^ (num >> 1)).toString(2);
    while(res.length < bits) res = '0' + res;
    return res;
};

const mapVar = (varName) => {
    return varName[0] + '_' + varName.substring(1);
};

// Variables
let vars = [];
let truthTable = [];
let karnaugh = {
    varsX: [], varsY: [], map: []
};

// Get Truth Table from Function
const truthTableFromFunc = () => {
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
        pomArr.push(+eval(str));
        truthTable.push(pomArr);
    }
};

const truthTableFromDec = () => {
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
};

const truthTableFromDecs = () => {
    let f0 = document.getElementById("f_0").value != '' ? document.getElementById("f_0").value.split(',').map(i => parseInt(i)) : [];
    let f1 = document.getElementById("f_1").value != '' ? document.getElementById("f_1").value.split(',').map(i => parseInt(i)) : [];
    let fS = document.getElementById("f_*").value != '' ? document.getElementById("f_*").value.split(',').map(i => parseInt(i)) : [];
    if(f0.length == 0) {
        for(let i=0;i<Math.pow(2, Math.floor(Math.log2(Math.max(f1.length+fS.length-1, Math.max(...f1), Math.max(...fS)))) + 1);i++) {
            if(!f1.includes(i) && !fS.includes(i)) f0.push(i);
        }
    }
    else if(f1.length == 0) {
        for(let i=0;i<Math.pow(2, Math.floor(Math.log2(Math.max(f0.length+fS.length-1, Math.max(...f0), Math.max(...fS)))) + 1);i++) {
            if(!f0.includes(i) && !fS.includes(i)) f1.push(i);
        }
    }
    else if(fS.length == 0) {
        for(let i=0;i<Math.pow(2, Math.floor(Math.log2(Math.max(f0.length+f1.length-1, Math.max(...f0), Math.max(...f1)))) + 1);i++) {
            if(!f0.includes(i) && !f1.includes(i)) fS.push(i);
        }
    }
    const numd = f0.length + f1.length + fS.length;
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
    fS.forEach(i => truthTable[i].push('*'));
};

const truthTableFromVec = () => {
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
};

const buildKarnaugh = () => {
    karnaugh = {
        varsY: [], varsX: [], map: []
    };
    let yn = Math.floor(vars.length / 2);
    let xn = vars.length - yn;
    for(let i=0;i<yn;i++) karnaugh.varsY.push(vars[i]);
    for(let i=yn;i<vars.length;i++) karnaugh.varsX.push(vars[i]);
    for(let i=0;i<1<<yn;i++) {
        let submap = [];
        for(let j=0;j<1<<xn;j++) {
            const val = truthTable[parseInt(getGrays(i, yn) + getGrays(j, xn), 2)];
            submap.push(val[val.length - 1]);
        }
        karnaugh.map.push(submap);
    }
};

const getKarnaughTable = () => {
    const frameTable = createElem('table', '', 'table-fixed table-noborder table-fit align-middle text-center');
    const tr1 = createElemIH('tr', `<td>\\[n:${vars.length}\\]</td><td>\\[${karnaugh.varsX.map(mapVar).join('')}\\]</td>`);
    frameTable.appendChild(tr1);
    const tr2 = createElemIH('tr', `<td>\\[${karnaugh.varsY.map(mapVar).join('')}\\]</td>`);
    const mapTable = createElem('table', '', 'table-fixed table-bordered table-fit align-middle text-center map-table');
    const mtr1 = createElemIH('tr', `<td class="over"></td>`);
    for(let i=0;i<1<<karnaugh.varsX.length;i++) {
        mtr1.appendChild(createElem('td', getGrays(i, karnaugh.varsX.length), "over"));
    }
    mapTable.appendChild(mtr1);
    for(let i=0;i<1<<karnaugh.varsY.length;i++) {
        const ntr = createElemIH('tr', `<td class="over">${getGrays(i, karnaugh.varsY.length)}</td>`);
        karnaugh.map[i].forEach(j => ntr.appendChild(createElem('td', j)));
        mapTable.appendChild(ntr);
    }
    const mapTD = createElem('td', '');
    mapTD.appendChild(mapTable);
    tr2.appendChild(mapTD);
    frameTable.appendChild(tr2);
    return {frameTable, mapTable};
};

const getMDNF = () => {
    let xn = karnaugh.map[0].length, yn = karnaugh.map.length;
    let mapMask = [];
    for(let i=0;i<yn;i++) {
        let maskRow = [];
        for(let j=0;j<xn;j++) maskRow.push(false);
        mapMask.push(maskRow);
    }
    let figures = [];
    let ended = false;
    for(let i=xn;i>0;i>>=1) {
        for(let j=yn;j>0;j>>=1) {
            for(let p=0;p<yn;p+=Math.max(1, j >> 1)) {
                for(let q=0;q<xn;q+=Math.max(1, i >> 1)) {
                    let allUsed = true, allOnes = true;
                    for(let x=q;x<q+i;x++) {
                        for(let y=p;y<p+j;y++) {
                            if(karnaugh.map[y % yn][x % xn] == 0) {
                                allOnes = false;
                                break;
                            }
                            allUsed = allUsed && mapMask[y % yn][x % xn];
                        }
                        if(!allOnes) {
                            break;
                        }
                    }
                    if(allOnes && !allUsed) {
                        for(let x=q;x<q+i;x++) {
                            for(let y=p;y<p+j;y++) {
                                mapMask[y % yn][x % xn] = true;
                            }
                        }
                        figures.push({ y: p, x: q, xs: i, ys: j });
                        let isFull = true;
                        for(let x=0;x<xn;x++) {
                            for(let y=0;y<yn;y++) {
                                if(karnaugh.map[y][x] == 1) isFull = isFull && mapMask[y][x];
                            }
                        }
                        if(isFull) {
                            ended = true;
                            break;
                        }
                    }
                }
                if(ended) break;
            }
            if(ended) break;
        }
        if(ended) break;
    }
    let {frameTable, mapTable} = getKarnaughTable();
    document.querySelector('.res-q').appendChild(frameTable);
    let products = [];
    figures.forEach(i => {
        let figureElem = createElem('div', '', 'circ');
        figureElem.style.width = `${i.xs * 100 - 10}%`;
        figureElem.style.height = `${i.ys * 100 - 10}%`;
        mapTable.childNodes[i.y+1].childNodes[i.x+1].appendChild(figureElem);
        if(i.x + i.xs > xn) {
            let figureElem2 = createElem('div', '', 'circ');
            figureElem2.style.width = `${i.xs * 100 - 10}%`;
            figureElem2.style.height = `${i.ys * 100 - 10}%`;
            figureElem2.style.left = `${((i.x + i.xs) % xn - i.xs) * 100 + 5}%`;
            mapTable.childNodes[i.y+1].childNodes[(i.x + i.xs) % xn].appendChild(figureElem2);
        }
        if(i.y + i.ys > yn) {
            let figureElem2 = createElem('div', '', 'circ');
            figureElem2.style.width = `${i.xs * 100 - 10}%`;
            figureElem2.style.height = `${i.ys * 100 - 10}%`;
            figureElem2.style.top = `${((i.y + i.ys) % yn - i.ys) * 100 + 5}%`;
            mapTable.childNodes[(i.y + i.ys) % yn].childNodes[i.x+1].appendChild(figureElem2);
        }
        if(i.x + i.xs > xn && i.y + i.ys > yn) {
            let figureElem2 = createElem('div', '', 'circ');
            figureElem2.style.width = `${i.xs * 100 - 10}%`;
            figureElem2.style.height = `${i.ys * 100 - 10}%`;
            figureElem2.style.top = `${((i.y + i.ys) % yn - i.ys) * 100 + 5}%`;
            figureElem2.style.left = `${((i.x + i.xs) % xn - i.xs) * 100 + 5}%`;
            mapTable.childNodes[(i.y + i.ys) % yn].childNodes[(i.x + i.xs) % xn].appendChild(figureElem2);
        }
        let whatXVars = new Array(karnaugh.varsX.length).fill(true);
        let whatYVars = new Array(karnaugh.varsY.length).fill(true);
        for(let k=i.x+1;k<i.x+i.xs;k++) {
            for(let j=0;j<karnaugh.varsX.length;j++) whatXVars[j] = whatXVars[j] && getGrays((k-1) % xn, karnaugh.varsX.length)[j] == getGrays(k % xn, karnaugh.varsX.length)[j];
        }
        for(let k=i.y+1;k<i.y+i.ys;k++) {
            for(let j=0;j<karnaugh.varsY.length;j++) whatYVars[j] = whatYVars[j] && getGrays((k-1) % yn, karnaugh.varsY.length)[j] == getGrays(k % yn, karnaugh.varsY.length)[j];
        }
        let product = [];
        whatXVars.forEach((k, ind) => {
            if(k) {
                product.push({ name: karnaugh.varsX[ind], comp: getGrays(i.x, karnaugh.varsX.length)[ind] == '0'});
            }
        });
        whatYVars.forEach((k, ind) => {
            if(k) {
                product.push({ name: karnaugh.varsY[ind], comp: getGrays(i.y, karnaugh.varsY.length)[ind] == '0'});
            }
        });
        product.sort((a, b) => a.name > b.name ? 1 : -1);
        products.push(product);
    });
    karnaugh.mdnf = products;
    let mdnf = products.map(pr => {
        return pr.map(i => {
            if(i.comp) return `\\overline{${mapVar(i.name)}}`;
            else return mapVar(i.name);
        }).join('\\cdot ');
    }).join(' + ');
    document.querySelector('.res-q').appendChild(createElem(
        "p", `\\[f(${vars.map(mapVar).join(',')}) = ${mdnf}\\]`, ''
    ));
};

const getMKNF = () => {
    let xn = karnaugh.map[0].length, yn = karnaugh.map.length;
    let mapMask = [];
    for(let i=0;i<yn;i++) {
        let maskRow = [];
        for(let j=0;j<xn;j++) maskRow.push(false);
        mapMask.push(maskRow);
    }
    let figures = [];
    let ended = false;
    for(let i=xn;i>0;i>>=1) {
        for(let j=yn;j>0;j>>=1) {
            for(let p=0;p<yn;p+=Math.max(1, j >> 1)) {
                for(let q=0;q<xn;q+=Math.max(1, i >> 1)) {
                    let allUsed = true, allZeros = true;
                    for(let x=q;x<q+i;x++) {
                        for(let y=p;y<p+j;y++) {
                            if(karnaugh.map[y % yn][x % xn] == 1) {
                                allZeros = false;
                                break;
                            }
                            allUsed = allUsed && mapMask[y % yn][x % xn];
                        }
                        if(!allZeros) {
                            break;
                        }
                    }
                    if(allZeros && !allUsed) {
                        for(let x=q;x<q+i;x++) {
                            for(let y=p;y<p+j;y++) {
                                mapMask[y % yn][x % xn] = true;
                            }
                        }
                        figures.push({ y: p, x: q, xs: i, ys: j });
                        let isFull = true;
                        for(let x=0;x<xn;x++) {
                            for(let y=0;y<yn;y++) {
                                if(karnaugh.map[y][x] == 0) isFull = isFull && mapMask[y][x];
                            }
                        }
                        if(isFull) {
                            ended = true;
                            break;
                        }
                    }
                }
                if(ended) break;
            }
            if(ended) break;
        }
        if(ended) break;
    }
    let {frameTable, mapTable} = getKarnaughTable();
    document.querySelector('.res-q').appendChild(frameTable);
    let sums = [];
    figures.forEach(i => {
        let figureElem = createElem('div', '', 'circ');
        figureElem.style.width = `${i.xs * 100 - 10}%`;
        figureElem.style.height = `${i.ys * 100 - 10}%`;
        mapTable.childNodes[i.y+1].childNodes[i.x+1].appendChild(figureElem);
        if(i.x + i.xs > xn) {
            let figureElem2 = createElem('div', '', 'circ');
            figureElem2.style.width = `${i.xs * 100 - 10}%`;
            figureElem2.style.height = `${i.ys * 100 - 10}%`;
            figureElem2.style.left = `${((i.x + i.xs) % xn - i.xs) * 100 + 5}%`;
            mapTable.childNodes[i.y+1].childNodes[(i.x + i.xs) % xn].appendChild(figureElem2);
        }
        if(i.y + i.ys > yn) {
            let figureElem2 = createElem('div', '', 'circ');
            figureElem2.style.width = `${i.xs * 100 - 10}%`;
            figureElem2.style.height = `${i.ys * 100 - 10}%`;
            figureElem2.style.top = `${((i.y + i.ys) % yn - i.ys) * 100 + 5}%`;
            mapTable.childNodes[(i.y + i.ys) % yn].childNodes[i.x+1].appendChild(figureElem2);
        }
        if(i.x + i.xs > xn && i.y + i.ys > yn) {
            let figureElem2 = createElem('div', '', 'circ');
            figureElem2.style.width = `${i.xs * 100 - 10}%`;
            figureElem2.style.height = `${i.ys * 100 - 10}%`;
            figureElem2.style.top = `${((i.y + i.ys) % yn - i.ys) * 100 + 5}%`;
            figureElem2.style.left = `${((i.x + i.xs) % xn - i.xs) * 100 + 5}%`;
            mapTable.childNodes[(i.y + i.ys) % yn].childNodes[(i.x + i.xs) % xn].appendChild(figureElem2);
        }
        let whatXVars = new Array(karnaugh.varsX.length).fill(true);
        let whatYVars = new Array(karnaugh.varsY.length).fill(true);
        for(let k=i.x+1;k<i.x+i.xs;k++) {
            for(let j=0;j<karnaugh.varsX.length;j++) whatXVars[j] = whatXVars[j] && getGrays((k-1) % xn, karnaugh.varsX.length)[j] == getGrays(k % xn, karnaugh.varsX.length)[j];
        }
        for(let k=i.y+1;k<i.y+i.ys;k++) {
            for(let j=0;j<karnaugh.varsY.length;j++) whatYVars[j] = whatYVars[j] && getGrays((k-1) % yn, karnaugh.varsY.length)[j] == getGrays(k % yn, karnaugh.varsY.length)[j];
        }
        let sum = [];
        whatXVars.forEach((k, ind) => {
            if(k) {
                sum.push({ name: karnaugh.varsX[ind], comp: getGrays(i.x, karnaugh.varsX.length)[ind] == '1'});
            }
        });
        whatYVars.forEach((k, ind) => {
            if(k) {
                sum.push({ name: karnaugh.varsY[ind], comp: getGrays(i.y, karnaugh.varsY.length)[ind] == '1'});
            }
        });
        sum.sort((a, b) => a.name > b.name ? 1 : -1);
        sums.push(sum);
    });
    karnaugh.mknf = sums;
    let mknf = sums.map(pr => {
        return '(' + pr.map(i => {
            if(i.comp) return `\\overline{${mapVar(i.name)}}`;
            else return mapVar(i.name);
        }).join(' + ') + ')';
    }).join('\\cdot ');
    document.querySelector('.res-q').appendChild(createElem(
        "p", `\\[f(${vars.map(mapVar).join(',')}) = ${mknf}\\]`, ''
    ));
};

const getNand = () => {
    let mdnf = karnaugh.mdnf.map(pr => {
        return pr.map(i => {
            if(i.comp) return `\\overline{${mapVar(i.name)}}`;
            else return mapVar(i.name);
        }).join('\\cdot ');
    }).join(' + ');
    let str = `\\[f(${vars.map(mapVar).join(',')}) = ${mdnf} = \\]`;
    document.querySelector('.res-q').appendChild(createElem("p", str, ''));
    str = `\\[ = \\overline{\\overline{${mdnf}}} = \\]`;
    document.querySelector('.res-q').appendChild(createElem("p", str, ''));
    if(karnaugh.mdnf.length > 1) {
        let mdnfm = karnaugh.mdnf.map(pr => {
            if(pr.length > 1) return `\\overline{(${pr.map(i => {
                if(i.comp) return `\\overline{${mapVar(i.name)}}`;
                else return mapVar(i.name);
            }).join('\\cdot ')})}`;
            return `\\overline{${pr.map(i => {
                if(i.comp) return `\\overline{${mapVar(i.name)}}`;
                else return mapVar(i.name);
            }).join('\\cdot ')}}`;
        }).join('\\cdot ');
        document.querySelector('.res-q').appendChild(createElem("p", `\\[ = \\overline{${mdnfm}}\\]`, ''));
    }
};

const getNand2 = () => {
    let mdnf = karnaugh.mdnf.map(pr => {
        return pr.map(i => {
            if(i.comp) return `\\overline{${mapVar(i.name)}}`;
            else return mapVar(i.name);
        }).join('\\cdot ');
    }).join(' + ');
    let str = `\\[f(${vars.map(mapVar).join(',')}) = ${mdnf} = \\]`;
    document.querySelector('.res-q').appendChild(createElem("p", str, ''));
    str = `\\[ = \\overline{\\overline{${mdnf}}} = \\]`;
    document.querySelector('.res-q').appendChild(createElem("p", str, ''));
    if(karnaugh.mdnf.length > 1) {
        let mdnfm = karnaugh.mdnf.map(pr => {
            if(pr.length > 1) return `\\overline{(${pr.map(i => {
                if(i.comp) return `\\overline{${mapVar(i.name)}}`;
                else return mapVar(i.name);
            }).join('\\cdot ')})}`;
            return `\\overline{${pr.map(i => {
                if(i.comp) return `\\overline{${mapVar(i.name)}}`;
                else return mapVar(i.name);
            }).join('\\cdot ')}}`;
        }).join('\\cdot ');
        document.querySelector('.res-q').appendChild(createElem("p", `\\[ = \\overline{${mdnfm}} = \\]`, ''));
        let mid = Math.floor(karnaugh.mdnf.length / 2);
        document.querySelector('.res-q').appendChild(createElem("p", `\\[ = \\overline{${getNandRec1(karnaugh.mdnf.slice(0, mid), 0)} \\cdot ${getNandRec1(karnaugh.mdnf.slice(mid), 0)}} = \\]`, ''));
        document.querySelector('.res-q').appendChild(createElem("p", `\\[ = \\overline{${getNandRec1(karnaugh.mdnf.slice(0, mid), 1)} \\cdot ${getNandRec1(karnaugh.mdnf.slice(mid), 1)}}\\]`, ''));
    }
};

const getNandRec1 = (dnf, part) => {
    if(dnf.length > 1) {
        let mid = Math.floor(dnf.length / 2);
        return `\\overline{\\overline{${getNandRec1(dnf.slice(0, mid), part)} \\cdot ${getNandRec1(dnf.slice(mid), part)}}}`;
    } else {
        if(part == 0) {
            if(dnf[0].length > 1) return `\\overline{(${dnf[0].map(i => {
                if(i.comp) return `\\overline{${mapVar(i.name)}}`;
                else return mapVar(i.name);
            }).join('\\cdot ')})}`;
            return `\\overline{${dnf[0].map(i => {
                if(i.comp) return `\\overline{${mapVar(i.name)}}`;
                else return mapVar(i.name);
            }).join('\\cdot ')}}`;
        } else {
            let mid = Math.floor(dnf[0].length / 2);
            if(dnf[0].length == 1) {
                if(dnf[0][0].comp) return mapVar(dnf[0][0].name);
                else return `\\overline{${mapVar(dnf[0][0].name)}}`;
            }
            return `\\overline{${getNandRec2(dnf[0].slice(0, mid))} \\cdot ${getNandRec2(dnf[0].slice(mid))}}`;
        }
    }
};

const getNandRec2 = (dnf) => {
    if(dnf.length > 1) {
        let mid = Math.floor(dnf.length / 2);
        return `\\overline{\\overline{${getNandRec2(dnf.slice(0, mid))} \\cdot ${getNandRec2(dnf.slice(mid))}}}`;
    } else {
        if(dnf[0].comp) return `\\overline{${mapVar(dnf[0].name)}}`;
        else return mapVar(dnf[0].name);
    }
};

const getNor = () => {
    let mknf = karnaugh.mknf.map(pr => {
        return '(' + pr.map(i => {
            if(i.comp) return `\\overline{${mapVar(i.name)}}`;
            else return mapVar(i.name);
        }).join(' + ') + ')';
    }).join('\\cdot ');
    let str = `\\[f(${vars.map(mapVar).join(',')}) = ${mknf} = \\]`;
    document.querySelector('.res-q').appendChild(createElem("p", str, ''));
    str = `\\[ = \\overline{\\overline{${mknf}}} = \\]`;
    document.querySelector('.res-q').appendChild(createElem("p", str, ''));
    if(karnaugh.mknf.length > 1) {
        let mknfm = karnaugh.mknf.map(pr => {
            if(pr.length > 1) return `\\overline{(${pr.map(i => {
                if(i.comp) return `\\overline{${mapVar(i.name)}}`;
                else return mapVar(i.name);
            }).join(' + ')})}`;
            return `\\overline{${pr.map(i => {
                if(i.comp) return `\\overline{${mapVar(i.name)}}`;
                else return mapVar(i.name);
            }).join(' + ')}}`;
        }).join(' + ');
        document.querySelector('.res-q').appendChild(createElem("p", `\\[ = \\overline{${mknfm}} = \\]`, ''));
    }
};

const getNor2 = () => {
    let mknf = karnaugh.mknf.map(pr => {
        return '(' + pr.map(i => {
            if(i.comp) return `\\overline{${mapVar(i.name)}}`;
            else return mapVar(i.name);
        }).join(' + ') + ')';
    }).join('\\cdot ');
    let str = `\\[f(${vars.map(mapVar).join(',')}) = ${mknf} = \\]`;
    document.querySelector('.res-q').appendChild(createElem("p", str, ''));
    str = `\\[ = \\overline{\\overline{${mknf}}} = \\]`;
    document.querySelector('.res-q').appendChild(createElem("p", str, ''));
    if(karnaugh.mknf.length > 1) {
        let mknfm = karnaugh.mknf.map(pr => {
            if(pr.length > 1) return `\\overline{(${pr.map(i => {
                if(i.comp) return `\\overline{${mapVar(i.name)}}`;
                else return mapVar(i.name);
            }).join(' + ')})}`;
            return `\\overline{${pr.map(i => {
                if(i.comp) return `\\overline{${mapVar(i.name)}}`;
                else return mapVar(i.name);
            }).join(' + ')}}`;
        }).join(' + ');
        document.querySelector('.res-q').appendChild(createElem("p", `\\[ = \\overline{${mknfm}} = \\]`, ''));
        let mid = Math.floor(karnaugh.mknf.length / 2);
        document.querySelector('.res-q').appendChild(createElem("p", `\\[ = \\overline{${getNorRec1(karnaugh.mknf.slice(0, mid), 0)} + ${getNorRec1(karnaugh.mknf.slice(mid), 0)}} = \\]`, ''));
        document.querySelector('.res-q').appendChild(createElem("p", `\\[ = \\overline{${getNorRec1(karnaugh.mknf.slice(0, mid), 1)} + ${getNorRec1(karnaugh.mknf.slice(mid), 1)}}\\]`, ''));
    }
};

const getNorRec1 = (dnf, part) => {
    if(dnf.length > 1) {
        let mid = Math.floor(dnf.length / 2);
        return `\\overline{\\overline{${getNorRec1(dnf.slice(0, mid), part)} + ${getNorRec1(dnf.slice(mid), part)}}}`;
    } else {
        if(part == 0) {
            if(dnf[0].length > 1) return `\\overline{(${dnf[0].map(i => {
                if(i.comp) return `\\overline{${mapVar(i.name)}}`;
                else return mapVar(i.name);
            }).join(' + ')})}`;
            return `\\overline{${dnf[0].map(i => {
                if(i.comp) return `\\overline{${mapVar(i.name)}}`;
                else return mapVar(i.name);
            }).join(' + ')}}`;
        } else {
            let mid = Math.floor(dnf[0].length / 2);
            if(dnf[0].length == 1) {
                if(dnf[0][0].comp) return mapVar(dnf[0][0].name);
                else return `\\overline{${mapVar(dnf[0][0].name)}}`;
            }
            return `\\overline{${getNorRec2(dnf[0].slice(0, mid))} + ${getNorRec2(dnf[0].slice(mid))}}`;
        }
    }
};

const getNorRec2 = (dnf) => {
    if(dnf.length > 1) {
        let mid = Math.floor(dnf.length / 2);
        return `\\overline{\\overline{${getNorRec2(dnf.slice(0, mid))} + ${getNorRec2(dnf.slice(mid))}}}`;
    } else {
        if(dnf[0].comp) return `\\overline{${mapVar(dnf[0].name)}}`;
        else return mapVar(dnf[0].name);
    }
};

// Solve
const solve = () => {
    document.querySelector('.res-q').innerHTML = '';
    document.querySelector('.res-q').appendChild(createElem("h4", "Tablica istinitosti", "text-center p-4"));
    solveTable();
    document.querySelector('.res-q').appendChild(createElem("h4", "Decimalni indeksi", "text-center p-4"));
    solveDecs();
    document.querySelector('.res-q').appendChild(createElem("h4", "Vektor istinitosti", "text-center p-4"));
    solveVec();
    document.querySelector('.res-q').appendChild(createElem("h4", "Brojni indeks", "text-center p-4"));
    solveDec();
    document.querySelector('.res-q').appendChild(createElem("h4", "PDNF", "text-center p-4"));
    solvePDNF();
    document.querySelector('.res-q').appendChild(createElem("h4", "PKNF", "text-center p-4"));
    solvePKNF();
    document.querySelector('.res-q').appendChild(createElem("h4", "PPNF", "text-center p-4"));
    solvePPNF();
    document.querySelector('.res-q').appendChild(createElem("h4", "Kanonički polinom", "text-center p-4"));
    solveKP();
    buildKarnaugh();
    document.querySelector('.res-q').appendChild(createElem("h4", "Minimalni DNF (Karnoova mapa)", "text-center p-4"));
    getMDNF();
    document.querySelector('.res-q').appendChild(createElem("h4", "Minimalni DNF (Logičko kolo)", "text-center p-4"));3
    document.querySelector('.res-q').appendChild(createElem("h5", "Višeulazna logička kola", "text-center p-4"));
    createCanvasDNF(karnaugh.mdnf, vars);
    document.querySelector('.res-q').appendChild(createElem("h5", "Dvoulazna logička kola", "text-center p-4"));
    createCanvasDNF2(karnaugh.mdnf, vars);
    document.querySelector('.res-q').appendChild(createElem("h4", "Minimalni KNF (Karnoova mapa)", "text-center p-4"));
    getMKNF();
    document.querySelector('.res-q').appendChild(createElem("h4", "Minimalni KNF (Logičko kolo)", "text-center p-4"));
    document.querySelector('.res-q').appendChild(createElem("h5", "Višeulazna logička kola", "text-center p-4"));
    createCanvasKNF(karnaugh.mknf, vars);
    document.querySelector('.res-q').appendChild(createElem("h5", "Dvoulazna logička kola", "text-center p-4"));
    createCanvasKNF2(karnaugh.mknf, vars);
    document.querySelector('.res-q').appendChild(createElem("h4", "Logičko kolo koristeći NI kola", "text-center p-4"));
    document.querySelector('.res-q').appendChild(createElem("h5", "Višeulazna logička kola", "text-center p-4"));
    getNand();
    createCanvasNAND(karnaugh.mdnf, vars);
    document.querySelector('.res-q').appendChild(createElem("h5", "Dvoulazna logička kola", "text-center p-4"));
    getNand2();
    createCanvasNAND2(karnaugh.mdnf, vars);
    document.querySelector('.res-q').appendChild(createElem("h4", "Logičko kolo koristeći NILI kola", "text-center p-4"));
    document.querySelector('.res-q').appendChild(createElem("h5", "Višeulazna logička kola", "text-center p-4"));
    getNor();
    createCanvasNOR(karnaugh.mknf, vars);
    document.querySelector('.res-q').appendChild(createElem("h5", "Dvoulazna logička kola", "text-center p-4"));
    getNor2();
    createCanvasNOR2(karnaugh.mknf, vars);
    MathJax.typeset();
};

const solveTable = () => {
    const table = createElem("table", "", "table-fixed table-bordered w-25 mx-auto text-center");
    const thr = createElem("tr", "", "");
    vars.forEach(i => thr.appendChild(createElem("th", `\\[${mapVar(i)}\\]`, "")));
    thr.appendChild(createElem("th", "\\[f\\]", ""));
    table.appendChild(thr);

    truthTable.forEach(i => {
        const tr = createElem("tr", "", "");
        i.forEach(j => tr.appendChild(createElem("td", j, "")));
        table.appendChild(tr);
    });

    document.querySelector('.res-q').appendChild(table);
};

const solveDecs = () => {
    const mappedTT = truthTable.map((i, ind) => [ind, i[i.length - 1]]);
    document.querySelector('.res-q').appendChild(createElem(
        "p", `\\[f^{(0)} = \\{${mappedTT.filter(i => i[1] == 0).map(i => i[0]).join(",")}\\}\\]`, ''
    ));
    document.querySelector('.res-q').appendChild(createElem(
        "p", `\\[f^{(1)} = \\{${mappedTT.filter(i => i[1] == 1).map(i => i[0]).join(",")}\\}\\]`, ''
    ));
    if(mappedTT.filter(i => i[1] == '*').length > 0) document.querySelector('.res-q').appendChild(createElem(
            "p", `\\[f^{(*)} = \\{${mappedTT.filter(i => i[1] == '*').map(i => i[0]).join(",")}\\}\\]`, ''
        ));
};

const solveVec = () => {
    document.querySelector('.res-q').appendChild(createElem(
        "p", `\\[K_f = [${truthTable.map(i => i[i.length - 1]).join('')}]^T\\]`
    ));
};

const solveDec = () => {
    if(truthTable.map(i => i[i.length - 1]).join('').includes('*')) {
        document.querySelector('.res-q').appendChild(createElem(
            "p", `\\[\\text{Ne postoji decimalni indeks}\\]`
        ));
        return;
    }
    document.querySelector('.res-q').appendChild(createElem(
        "p", `\\[N_f = ${parseInt(truthTable.map(i => i[i.length - 1]).reverse().join(''), 2)}\\]`
    ));
};

const solvePDNF = () => {
    let pdnfText = `\\[f(${vars.map(mapVar).join(',')}) = `;
    const filteredTT = truthTable.filter(i => i[i.length - 1] == 1).map((i, ind) => {
        return vars.map((j, jnd) => {
            if(i[jnd]) return mapVar(j);
            else return `\\overline{${mapVar(j)}}`;
        }).join('\\cdot ');
    }).join(' + ');
    pdnfText += (filteredTT.length != '' ? filteredTT : '0') + '\\]';
    document.querySelector('.res-q').appendChild(createElem("p", pdnfText));
};

const solvePKNF = () => {
    let pknfText = `\\[f(${vars.map(mapVar).join(',')}) = `;
    const filteredTT = truthTable.filter(i => i[i.length - 1] == 0).map((i, ind) => {
        return '( ' + vars.map((j, jnd) => {
            if(!i[jnd]) return mapVar(j);
            else return `\\overline{${mapVar(j)}}`;
        }).join(' + ') + ' )';
    }).join('\\cdot ');
    pknfText += (filteredTT.length != '' ? filteredTT : '1') + '\\]';
    document.querySelector('.res-q').appendChild(createElem("p", pknfText));
};

const solvePPNF = () => {
    let ppnfText = `\\[f(${vars.map(mapVar).join(',')}) = `;
    const filteredTT = truthTable.filter(i => i[i.length - 1] == 1).map((i, ind) => {
        return vars.map((j, jnd) => {
            if(i[jnd]) return mapVar(j);
            else return `\\overline{${mapVar(j)}}`;
        }).join('\\cdot ');
    }).join('\\oplus ');
    ppnfText += (filteredTT.length != '' ? filteredTT : '0') + '\\]';
    document.querySelector('.res-q').appendChild(createElem("p", ppnfText));
};

const solveKP = () => {
    let kpText = `\\[f(${vars.map(mapVar).join(',')}) = `;
    let vars2 = [];
    truthTable.filter(i => i[i.length - 1] == 1).forEach(i => {
        let truevars = vars.map(mapVar).filter((j, jnd) => i[jnd]);
        let vars3 = [truevars];
        vars.forEach((j, jnd) => {
            if(!i[jnd]) {
                vars3 = vars3.concat(vars3.map(k => [...k, mapVar(j)]));
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
    });
    let exText = vars3.sort((a,b) => {
        if(a.length != b.length) return a.length - b.length;
        return a.localeCompare(b);
    }).join('\\oplus ');
    kpText += (exText != '' ? exText : '0') + '\\]';
    document.querySelector('.res-q').appendChild(createElem("p", kpText));
};

// Events
document.getElementById('next').onclick = () => {
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

document.getElementById('create').onclick = () => {
    const varNum = document.getElementById('vars').value;
    truthTable = [];
    vars = [];

    const table = createElem("table", '', "table-fixed table-bordered w-25 mx-auto text-center");
    const thr = createElem("tr", "");

    for(let i=0;i<varNum;i++) {
        thr.appendChild(createElem("th", `\\[x_${i+1}\\]`));
        vars.push(`x${i+1}`);
    }
    thr.appendChild(createElem("th", "\\[f\\]"));
    table.appendChild(thr);

    for(let i=0;i<Math.pow(2, vars.length);i++) {
        let tr2 = createElem("tr", "", "");
        const pomArr = [];
        let temp = i;
        for(let j=0;j<vars.length;j++) {
            pomArr.unshift(temp % 2);
            temp = Math.floor(temp / 2);
        }
        truthTable.push(pomArr);
        pomArr.forEach(i => tr2.appendChild(createElem("td", i, "")));
        tr2.appendChild(createElemIH("td", `<input class="form-control" type="text" placeholder="f">`, 'col-sm-1'));
        table.appendChild(tr2);
    }

    document.querySelector(".fill-table").classList.toggle('d-none');
    document.getElementById('analyze2').disabled = false;

    document.querySelector(".fill-table").after(table);

    MathJax.typeset();
};

document.getElementById("analyze1").onclick = () => {
    truthTableFromFunc();
    solve();
};

document.getElementById("analyze2").onclick = () => {
    const table = document.querySelector(".table-q table");
    truthTable.forEach(i => {
        if(i.length > vars.length) i.pop();
    });
    table.querySelectorAll("input").forEach((i, ind) => {
        truthTable[ind].push(i.value);
    });
    solve();
};

document.getElementById("analyze3").onclick = () => {
    truthTableFromDec();
    solve();
};

document.getElementById("analyze4").onclick = () => {
    truthTableFromDecs();
    solve();
};

document.getElementById("analyze5").onclick = () => {
    truthTableFromVec();
    solve();
};