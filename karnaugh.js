const countChar = (str, char) => {
    let cnt = 0;
    for(let i=0;i<str.length;i++) cnt += +(str[i] == char);
    return cnt;
};

const diffChar = (s1, s2) => {
    let cnt = 0;
    for(let i=0;i<s1.length;i++) cnt += +(s1[i] != s2[i]);
    return cnt;
};

const getNewStr = (s1, s2) => {
    let news = "";
    for(let i=0;i<s1.length;i++) news += (s1[i] != s2[i] ? '-' : s1[i]);
    return news;
}

const processGroups = (groups) => {
    let newg = [];
    let used = {};
    for(let i=0;i<groups.length;i++) {
        for(let j=i+1;j<groups.length;j++) {
            if(diffChar(groups[i], groups[j]) == 1) {
                newg.push(getNewStr(groups[i], groups[j]));
                used[groups[i]] = true;
                used[groups[j]] = true;
            }
        }
    }
    let notUsed = groups.filter(i => !used[i]);
    return { newg, notUsed};
};

const isMatch = (str1, str2) => {
    for(let i=0;i<str1.length;i++) {
        if(str1[i] == '-') continue;
        if(str1[i] != str2[i]) {
            return false;
        }
    }
    return true;
};

const getNumForSort = (str) => {
    let n = 0;
    for(let i=1;i<=str.length;i++) {
        if(str[i-1] != '-') n = 10*n + i;
    }
    return n;
};

const formatI = (str) => {
    let res = [];
    for(let i=1;i<=str.length;i++) {
        if(str[i-1] != '-') {
            res.push({
                name: `x${i}`,
                comp: str[i-1] == '0'
            });
        }
    }
    return res;
};

const formatI2 = (str) => {
    let res = [];
    for(let i=1;i<=str.length;i++) {
        if(str[i-1] != '-') {
            res.push({
                name: `x${i}`,
                comp: str[i-1] == '1'
            });
        }
    }
    return res;
};

const areIntch = (ones, im1, im2) => {
    return ones.filter(i => isMatch(im1, i)).join(';') == ones.filter(i => isMatch(im2, i)).join(';');
};

const isDominatedBy = (ones, im1, im2) => {
    let dm = ones.filter(i => isMatch(im1, i));
    for(let i=0;i<dm.length;i++) {
        if(!isMatch(im2, dm[i])) return false;
    }
    return !areIntch(ones, im1, im2);
};

const solveKarnaughDNF = (truthTable) => {
    let ones = truthTable.filter(i => i[i.length - 1] == 1).map(i => i.slice(0, -1).join(''));
    let dc = truthTable.filter(i => i[i.length - 1] == '*').map(i => i.slice(0, -1).join(''));
    let groups = ones.concat(dc);
    groups.sort((a,b) => {
        return countChar(a, '1') - countChar(b, '1');
    });
    let impls = [];

    while(groups.length > 0) {
        let obj = processGroups(groups);

        groups = obj.newg;
        impls = impls.concat(obj.notUsed);
    }

    impls = impls.filter((i, ind) => impls.slice(ind).filter(j => j == i).length == 1);

    console.log(impls);

    let eImpls = [];

    // while(impls.length > 0) {
    //     let newEimpls = [];
    //     ones.forEach(i => {
    //         let newIms = impls.filter(j => isMatch(j, i));
    //         if(newIms.length == 1) {
    //             if(!eImpls.includes(newIms[0])) newEimpls.push(newIms[0]);
    //         }
    //     });

    //     newEimpls.forEach(i => {
    //         let delOnes = ones.filter(j => isMatch(i, j));
    //         ones = ones.filter(j => !isMatch(i, j));
    //         impls = impls.filter(j => {
    //             return delOnes.every(k => isMatch(j, k));
    //         });
    //     });

    //     eImpls = eImpls.concat(newEimpls);
    // }
    while(ones.length > 0) {
        // Prvi korak
        ones.forEach(i => {
            let newIms = impls.filter(j => isMatch(j, i));
            if(newIms.length == 1) {
                if(!eImpls.includes(newIms[0])) {
                    eImpls.push(newIms[0]);
                }
            }
        });

        // Drugi korak
        ones = ones.filter(i => {
            return impls.filter(j => isMatch(j, i)).length > 1;
        });

        // Treci korak
        eImpls.forEach(i => {
            ones = ones.filter(j => !isMatch(i, j));
            impls = impls.filter(j => j != i);
        });

        // Cetvrti korak
        impls = impls.filter(i => {
            return !impls.some(j => isDominatedBy(ones, i, j));
        });
        impls = impls.filter((i, ind) => impls.slice(ind).filter(j => areIntch(ones, i, j)).length == 1);

        if(ones.every(i => {
            return impls.filter(j => isMatch(j, i)).length > 1;
        })) {
            impls.shift();
        }
    }

    eImpls.sort((a, b) => {
        return getNumForSort(a) - getNumForSort(b);
    });

    return { prods: eImpls.map(formatI), bins: eImpls };
};

const getFiguresDNF = (vars, mnf) => {
    let xn = Math.floor(vars.length / 2);
    let yn = vars.length - xn;
    let xns = Math.pow(2, xn);
    let yns = Math.pow(2, yn);
    let figures = [];
    mnf.forEach(prod => {
        let matx = [];
        for(let i=0;i<xns;i++) {
            let tempx = [];
            for(let j=0;j<yns;j++) {
                if(isMatch(prod, getGrays(i, xn) + getGrays(j, yn))) tempx.push(1);
                else tempx.push(0);
            }
            matx.push(tempx);
        }
        let xp = prod.slice(0, xn);
        let xs = Math.pow(2, countChar(xp, '-'));
        let yp = prod.slice(xn);
        let ys = Math.pow(2, countChar(yp, '-'));
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
};

const solveKarnaughKNF = (truthTable) => {
    let ones = truthTable.filter(i => i[i.length - 1] == 0).map(i => i.slice(0, -1).join(''));
    let dc = truthTable.filter(i => i[i.length - 1] == '*').map(i => i.slice(0, -1).join(''));
    let groups = ones.concat(dc);
    groups.sort((a,b) => {
        return countChar(a, '0') - countChar(b, '0');
    });
    let impls = [];

    while(groups.length > 0) {
        let obj = processGroups(groups);

        groups = obj.newg;
        impls = impls.concat(obj.notUsed);
    }

    impls = impls.filter((i, ind) => impls.slice(ind).filter(j => j == i).length == 1);

    let eImpls = [];

    while(ones.length > 0) {
        // Prvi korak
        ones.forEach(i => {
            let newIms = impls.filter(j => isMatch(j, i));
            if(newIms.length == 1) {
                if(!eImpls.includes(newIms[0])) {
                    eImpls.push(newIms[0]);
                }
            }
        });

        // Drugi korak
        ones = ones.filter(i => {
            return impls.filter(j => isMatch(j, i)).length > 1;
        });

        // Treci korak
        eImpls.forEach(i => {
            ones = ones.filter(j => !isMatch(i, j));
            impls = impls.filter(j => j != i);
        });

        // Cetvrti korak
        impls = impls.filter(i => {
            return !impls.some(j => isDominatedBy(ones, i, j));
        });
        impls = impls.filter((i, ind) => impls.slice(ind).filter(j => areIntch(ones, i, j)).length == 1);

        if(ones.every(i => {
            return impls.filter(j => isMatch(j, i)).length > 1;
        })) {
            impls.shift();
        }
    }

    eImpls.sort((a, b) => {
        return getNumForSort(a) - getNumForSort(b);
    });

    return { prods: eImpls.map(formatI2), bins: eImpls };
};