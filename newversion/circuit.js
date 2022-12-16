const GATE_SIZE = 40;
const WIRE_GAP = 12;
const WIRE_GAP2 = 20;
const NOT_TOP = 60;
const TEXT_PAD = 30;
const COMP_GAP = 30;

const createCanvasDNF = (mdnf, vars) => {
    const canvasCon = createElem('div', '', 'canvas-con m-auto');
    /** @type {HTMLCanvasElement} */
    const canvas = createElem('canvas', '', '');
    canvasCon.appendChild(canvas);
    document.querySelector('.res-q').appendChild(canvasCon);

    canvas.height = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP + mdnf.map(i => {
        let sizeH = Math.max(GATE_SIZE, (WIRE_GAP + 1) * (i.length - 1) + 1);
        return sizeH + COMP_GAP
    }).reduce((a,b) => a + b, 0);
    canvas.width = WIRE_GAP2 + vars.map((vi) => {
        if(mdnf.filter(i => i.filter(j => j.name == vi && j.comp).length > 0).length > 0) return WIRE_GAP2 * 3;
        return WIRE_GAP2 * 1.5;
    }).reduce((a,b) => a + b, 0) + COMP_GAP + GATE_SIZE + COMP_GAP * 2 + WIRE_GAP * mdnf.length + GATE_SIZE * 3 / 2;

    const ctx = canvas.getContext('2d');
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    // Lines
    let ptx = WIRE_GAP2;
    let newVars = [];
    vars.forEach((vi) => {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ptx, TEXT_PAD);
        ctx.lineTo(ptx, canvas.height);
        const vart = createElem('p', `\\[${mapVar(vi)}\\]`, '');
        vart.style.top = `${-NOT_TOP / 3}px`;
        vart.style.left = `${ptx + 5}px`;
        canvasCon.appendChild(vart);
        newVars.push(vi);
        if(mdnf.filter(i => i.filter(j => j.name == vi && j.comp).length > 0).length > 0) {
            ctx.moveTo(ptx, TEXT_PAD + 30);
            ptx += WIRE_GAP2 * 1.5;
            ctx.lineTo(ptx, TEXT_PAD + NOT_TOP / 2);
            ctx.lineTo(ptx, canvas.height);
            newVars.push('!' + vi);
            ctx.stroke();
            drawNotGate(ctx, ptx, TEXT_PAD + NOT_TOP);
        } else {
            ctx.stroke();
        }
        ptx += WIRE_GAP2 * 1.5;
    });

    let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;
    ptx += COMP_GAP;
    let sumSize = COMP_GAP;
    let ttx = ptx;

    mdnf.forEach(i => {
        let sizeH = Math.max(GATE_SIZE, (WIRE_GAP + 1) * (i.length - 1) + 1);
        drawAndGate(ctx, ptx, pty + sizeH / 2, i.length);
        i.forEach((j, jnd) => {
            let vname = (j.comp ? '!':'') + j.name;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 1.5 * newVars.indexOf(vname), pty + sizeH / 2 - (jnd - (i.length - 1) / 2) * WIRE_GAP );
            ctx.lineTo(ptx - GATE_SIZE * 5 / 8, pty + sizeH / 2 - (jnd - (i.length - 1) / 2) * WIRE_GAP );
            ctx.stroke();
        });
        pty += sizeH + COMP_GAP;
        sumSize += sizeH + COMP_GAP;
    });

    ptx += GATE_SIZE + COMP_GAP * 2 + WIRE_GAP * mdnf.length;
    pty = TEXT_PAD + NOT_TOP + GATE_SIZE + sumSize / 2;

    drawOrGate(ctx, ptx, pty, mdnf.length);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(ptx + GATE_SIZE / 2, pty);
    ctx.lineTo(ptx + GATE_SIZE * 3 / 2, pty);
    ctx.stroke();

    const rest = createElem('p', `\\[f\\]`, '');
    rest.style.top = `${pty - NOT_TOP + 5}px`;
    rest.style.left = `${ptx + GATE_SIZE * 3 / 2}px`;
    canvasCon.appendChild(rest);

    pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;

    mdnf.forEach((i, ind) => {
        let sizeH = Math.max(GATE_SIZE, (WIRE_GAP + 1) * (i.length - 1) + 1);
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(ttx + GATE_SIZE / 2, pty + sizeH / 2);
        let pt = Math.min(ind, mdnf.length - ind - 1);
        ctx.lineTo(ttx + GATE_SIZE + COMP_GAP + WIRE_GAP * (mdnf.length-1) - pt * WIRE_GAP, pty + sizeH / 2);
        ctx.lineTo(ttx + GATE_SIZE + COMP_GAP + WIRE_GAP * (mdnf.length-1) - pt * WIRE_GAP, TEXT_PAD + NOT_TOP + GATE_SIZE + sumSize / 2 - ((mdnf.length - 1) / 2 - ind) * WIRE_GAP);
        ctx.lineTo(ptx - GATE_SIZE * 5 / 8, TEXT_PAD + NOT_TOP + GATE_SIZE + sumSize / 2 - ((mdnf.length - 1) / 2 - ind) * WIRE_GAP);
        ctx.stroke();
        pty += sizeH + COMP_GAP;
    });
};

const createCanvasDNF2 = (mdnf, vars) => {
    const canvasCon = createElem('div', '', 'canvas-con m-auto');
    /** @type {HTMLCanvasElement} */
    const canvas = createElem('canvas', '', '');
    canvasCon.appendChild(canvas);
    document.querySelector('.res-q').appendChild(canvasCon);

    canvas.height = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP + mdnf.map(i => {
        let sizeH = WIRE_GAP * 3 * (i.length - 1);
        return sizeH + COMP_GAP
    }).reduce((a,b) => a + b, 0);
    canvas.width = WIRE_GAP2 + vars.map((vi) => {
        if(mdnf.filter(i => i.filter(j => j.name == vi && j.comp).length > 0).length > 0) return WIRE_GAP2 * 3;
        return WIRE_GAP2 * 1.5;
    }).reduce((a,b) => a + b, 0) + COMP_GAP + GATE_SIZE * ( 2 * Math.max(...mdnf.map(i => Math.ceil(Math.log2(i.length)))) - 1) + COMP_GAP * 2 + WIRE_GAP * mdnf.length + GATE_SIZE * ( 2 * Math.ceil(Math.log2(mdnf.length)) - 1) + GATE_SIZE * 3 / 2;

    const ctx = canvas.getContext('2d');
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    // Lines
    let ptx = WIRE_GAP2;
    let newVars = [];
    vars.forEach((vi) => {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ptx, TEXT_PAD);
        ctx.lineTo(ptx, canvas.height);
        const vart = createElem('p', `\\[${mapVar(vi)}\\]`, '');
        vart.style.top = `${-NOT_TOP / 3}px`;
        vart.style.left = `${ptx + 5}px`;
        canvasCon.appendChild(vart);
        newVars.push(vi);
        if(mdnf.filter(i => i.filter(j => j.name == vi && j.comp).length > 0).length > 0) {
            ctx.moveTo(ptx, TEXT_PAD + 30);
            ptx += WIRE_GAP2 * 1.5;
            ctx.lineTo(ptx, TEXT_PAD + NOT_TOP / 2);
            ctx.lineTo(ptx, canvas.height);
            newVars.push('!' + vi);
            ctx.stroke();
            drawNotGate(ctx, ptx, TEXT_PAD + NOT_TOP);
        } else {
            ctx.stroke();
        }
        ptx += WIRE_GAP2 * 1.5;
    });

    let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;
    ptx += COMP_GAP;
    let sumSize = COMP_GAP;
    let ttx = ptx;

    mdnf.forEach(i => {
        let sizeH = WIRE_GAP * 3 * (i.length - 1);
        // drawAndGate(ctx, ptx, pty + sizeH / 2, i.length);
        drawFullAnd2(ctx, ptx, pty + sizeH / 2, i.length, drawAndGate2, 0);
        i.forEach((j, jnd) => {
            let vname = (j.comp ? '!':'') + j.name;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 1.5 * newVars.indexOf(vname), pty + sizeH / 2 - (jnd - (i.length - 1) / 2) * WIRE_GAP * 3 );
            ctx.lineTo(ptx - GATE_SIZE * 5 / 8, pty + sizeH / 2 - (jnd - (i.length - 1) / 2) * WIRE_GAP * 3 );
            ctx.stroke();
        });
        pty += sizeH + COMP_GAP;
        sumSize += sizeH + COMP_GAP;
    });

    ptx += GATE_SIZE * ( 2 * Math.max(...mdnf.map(i => Math.ceil(Math.log2(i.length)))) - 1) + COMP_GAP * 2 + WIRE_GAP * mdnf.length;
    pty = TEXT_PAD + NOT_TOP + GATE_SIZE + sumSize / 2;

    drawFullAnd2(ctx, ptx, pty, mdnf.length, drawOrGate2, 0);
    ctx.beginPath();
    ctx.lineWidth = 1;
    let dep = Math.ceil(Math.log2(mdnf.length));
    const rest = createElem('p', `\\[f\\]`, '');
    if(mdnf.length == 1) {
        ctx.moveTo(ptx - GATE_SIZE / 2, pty);
        ctx.lineTo(ptx + GATE_SIZE * (2 * mdnf.length - 1) / 2 + GATE_SIZE, pty);
        rest.style.top = `${pty - NOT_TOP + 5}px`;
        rest.style.left = `${ptx + GATE_SIZE * (2 * mdnf.length - 1) / 2}px`;
    }
    else {
        ctx.moveTo(ptx - GATE_SIZE / 2 + GATE_SIZE * (2 * dep - 1), pty - (GATE_SIZE - WIRE_GAP * 3) / 2 - (mdnf.length - 1) * WIRE_GAP * 3 / 2 + (Math.pow(2, dep - 1) - 1) * WIRE_GAP * 3 + GATE_SIZE / 2);
        ctx.lineTo(ptx + GATE_SIZE / 2 + GATE_SIZE * (2 * dep - 1), pty - (GATE_SIZE - WIRE_GAP * 3) / 2 - (mdnf.length - 1) * WIRE_GAP * 3 / 2 + (Math.pow(2, dep - 1) - 1) * WIRE_GAP * 3 + GATE_SIZE / 2);
        rest.style.top = `${pty - (GATE_SIZE - WIRE_GAP * 3) / 2 - (mdnf.length - 1) * WIRE_GAP * 3 / 2 + (Math.pow(2, dep - 1) - 1) * WIRE_GAP * 3 + GATE_SIZE / 2 - NOT_TOP + 5}px`;
        rest.style.left = `${ptx + GATE_SIZE / 2 + GATE_SIZE * (2 * dep - 1)}px`;
    }
    ctx.stroke();
    canvasCon.appendChild(rest);

    pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;

    mdnf.forEach((i, ind) => {
        let sizeH = (i.length - 1) * WIRE_GAP * 3;
        if(i.length == 1) sizeH = 0;
        ctx.beginPath();
        ctx.lineWidth = 1;
        let depth = Math.ceil(Math.log2(i.length));
        if(i.length == 1)
            ctx.moveTo(ttx - GATE_SIZE / 2, pty);
        else ctx.moveTo(ttx - GATE_SIZE / 2 + (2 * depth - 1) * GATE_SIZE, pty + (Math.pow(2, depth - 1) - 1) * WIRE_GAP * 3 + GATE_SIZE / 2);
        let pt = Math.min(ind, mdnf.length - ind - 1);
        if(i.length == 1) ctx.lineTo(ttx + GATE_SIZE * ( 2 * Math.max(...mdnf.map(i => Math.ceil(Math.log2(i.length)))) - 1) + COMP_GAP + WIRE_GAP * (mdnf.length-1) - pt * WIRE_GAP, pty);
        else ctx.lineTo(ttx + GATE_SIZE * ( 2 * Math.max(...mdnf.map(i => Math.ceil(Math.log2(i.length)))) - 1) + COMP_GAP + WIRE_GAP * (mdnf.length-1) - pt * WIRE_GAP, pty + (Math.pow(2, depth - 1) - 1) * WIRE_GAP * 3 + GATE_SIZE / 2);
        ctx.lineTo(ttx + GATE_SIZE * ( 2 * Math.max(...mdnf.map(i => Math.ceil(Math.log2(i.length)))) - 1) + COMP_GAP + WIRE_GAP * (mdnf.length-1) - pt * WIRE_GAP, TEXT_PAD + NOT_TOP + GATE_SIZE + sumSize / 2 - ((mdnf.length - 1) / 2 - ind) * WIRE_GAP * 3);
        ctx.lineTo(ptx - GATE_SIZE * 5 / 8, TEXT_PAD + NOT_TOP + GATE_SIZE + sumSize / 2 - ((mdnf.length - 1) / 2 - ind) * WIRE_GAP * 3);
        ctx.stroke();
        pty += sizeH + COMP_GAP;
    });
};

const createCanvasKNF = (mknf, vars) => {
    const canvasCon = createElem('div', '', 'canvas-con m-auto');
    /** @type {HTMLCanvasElement} */
    const canvas = createElem('canvas', '', '');
    canvasCon.appendChild(canvas);
    document.querySelector('.res-q').appendChild(canvasCon);

    canvas.height = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP + mknf.map(i => {
        let sizeH = Math.max(GATE_SIZE, (WIRE_GAP + 1) * (i.length - 1) + 1);
        return sizeH + COMP_GAP
    }).reduce((a,b) => a + b, 0);
    canvas.width = WIRE_GAP2 + vars.map((vi) => {
        if(mknf.filter(i => i.filter(j => j.name == vi && j.comp).length > 0).length > 0) return WIRE_GAP2 * 3;
        return WIRE_GAP2 * 1.5;
    }).reduce((a,b) => a + b, 0) + COMP_GAP + GATE_SIZE + COMP_GAP * 2 + WIRE_GAP * mknf.length + GATE_SIZE * 3 / 2;

    const ctx = canvas.getContext('2d');
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    // Lines
    let ptx = WIRE_GAP2;
    let newVars = [];
    vars.forEach((vi) => {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ptx, TEXT_PAD);
        ctx.lineTo(ptx, canvas.height);
        const vart = createElem('p', `\\[${mapVar(vi)}\\]`, '');
        vart.style.top = `${-NOT_TOP / 3}px`;
        vart.style.left = `${ptx + 5}px`;
        canvasCon.appendChild(vart);
        newVars.push(vi);
        if(mknf.filter(i => i.filter(j => j.name == vi && j.comp).length > 0).length > 0) {
            ctx.moveTo(ptx, TEXT_PAD + 30);
            ptx += WIRE_GAP2 * 1.5;
            ctx.lineTo(ptx, TEXT_PAD + NOT_TOP / 2);
            ctx.lineTo(ptx, canvas.height);
            newVars.push('!' + vi);
            ctx.stroke();
            drawNotGate(ctx, ptx, TEXT_PAD + NOT_TOP);
        } else {
            ctx.stroke();
        }
        ptx += WIRE_GAP2 * 1.5;
    });

    let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;
    ptx += COMP_GAP;
    let sumSize = COMP_GAP;
    let ttx = ptx;

    mknf.forEach(i => {
        let sizeH = Math.max(GATE_SIZE, (WIRE_GAP + 1) * (i.length - 1) + 1);
        drawOrGate(ctx, ptx, pty + sizeH / 2, i.length);
        i.forEach((j, jnd) => {
            let vname = (j.comp ? '!':'') + j.name;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 1.5 * newVars.indexOf(vname), pty + sizeH / 2 - (jnd - (i.length - 1) / 2) * WIRE_GAP );
            ctx.lineTo(ptx - GATE_SIZE * 5 / 8, pty + sizeH / 2 - (jnd - (i.length - 1) / 2) * WIRE_GAP );
            ctx.stroke();
        });
        pty += sizeH + COMP_GAP;
        sumSize += sizeH + COMP_GAP;
    });

    ptx += GATE_SIZE + COMP_GAP * 2 + WIRE_GAP * mknf.length;
    pty = TEXT_PAD + NOT_TOP + GATE_SIZE + sumSize / 2;

    drawAndGate(ctx, ptx, pty, mknf.length);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(ptx + GATE_SIZE / 2, pty);
    ctx.lineTo(ptx + GATE_SIZE * 3 / 2, pty);
    ctx.stroke();

    const rest = createElem('p', `\\[f\\]`, '');
    rest.style.top = `${pty - NOT_TOP + 5}px`;
    rest.style.left = `${ptx + GATE_SIZE * 3 / 2}px`;
    canvasCon.appendChild(rest);

    pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;

    mknf.forEach((i, ind) => {
        let sizeH = Math.max(GATE_SIZE, (WIRE_GAP + 1) * (i.length - 1) + 1);
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(ttx + GATE_SIZE / 2, pty + sizeH / 2);
        let pt = Math.min(ind, mknf.length - ind - 1);
        ctx.lineTo(ttx + GATE_SIZE + COMP_GAP + WIRE_GAP * (mknf.length-1) - pt * WIRE_GAP, pty + sizeH / 2);
        ctx.lineTo(ttx + GATE_SIZE + COMP_GAP + WIRE_GAP * (mknf.length-1) - pt * WIRE_GAP, TEXT_PAD + NOT_TOP + GATE_SIZE + sumSize / 2 - ((mknf.length - 1) / 2 - ind) * WIRE_GAP);
        ctx.lineTo(ptx - GATE_SIZE * 5 / 8, TEXT_PAD + NOT_TOP + GATE_SIZE + sumSize / 2 - ((mknf.length - 1) / 2 - ind) * WIRE_GAP);
        ctx.stroke();
        pty += sizeH + COMP_GAP;
    });
};

const createCanvasKNF2 = (mdnf, vars) => {
    const canvasCon = createElem('div', '', 'canvas-con m-auto');
    /** @type {HTMLCanvasElement} */
    const canvas = createElem('canvas', '', '');
    canvasCon.appendChild(canvas);
    document.querySelector('.res-q').appendChild(canvasCon);

    canvas.height = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP + mdnf.map(i => {
        let sizeH = WIRE_GAP * 3 * (i.length - 1);
        return sizeH + COMP_GAP
    }).reduce((a,b) => a + b, 0);
    canvas.width = WIRE_GAP2 + vars.map((vi) => {
        if(mdnf.filter(i => i.filter(j => j.name == vi && j.comp).length > 0).length > 0) return WIRE_GAP2 * 3;
        return WIRE_GAP2 * 1.5;
    }).reduce((a,b) => a + b, 0) + COMP_GAP + GATE_SIZE * ( 2 * Math.max(...mdnf.map(i => Math.ceil(Math.log2(i.length)))) - 1) + COMP_GAP * 2 + WIRE_GAP * mdnf.length + GATE_SIZE * ( 2 * Math.ceil(Math.log2(mdnf.length)) - 1) + GATE_SIZE * 3 / 2;

    const ctx = canvas.getContext('2d');
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    // Lines
    let ptx = WIRE_GAP2;
    let newVars = [];
    vars.forEach((vi) => {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ptx, TEXT_PAD);
        ctx.lineTo(ptx, canvas.height);
        const vart = createElem('p', `\\[${mapVar(vi)}\\]`, '');
        vart.style.top = `${-NOT_TOP / 3}px`;
        vart.style.left = `${ptx + 5}px`;
        canvasCon.appendChild(vart);
        newVars.push(vi);
        if(mdnf.filter(i => i.filter(j => j.name == vi && j.comp).length > 0).length > 0) {
            ctx.moveTo(ptx, TEXT_PAD + 30);
            ptx += WIRE_GAP2 * 1.5;
            ctx.lineTo(ptx, TEXT_PAD + NOT_TOP / 2);
            ctx.lineTo(ptx, canvas.height);
            newVars.push('!' + vi);
            ctx.stroke();
            drawNotGate(ctx, ptx, TEXT_PAD + NOT_TOP);
        } else {
            ctx.stroke();
        }
        ptx += WIRE_GAP2 * 1.5;
    });

    let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;
    ptx += COMP_GAP;
    let sumSize = COMP_GAP;
    let ttx = ptx;

    mdnf.forEach(i => {
        let sizeH = WIRE_GAP * 3 * (i.length - 1);
        // drawAndGate(ctx, ptx, pty + sizeH / 2, i.length);
        drawFullAnd2(ctx, ptx, pty + sizeH / 2, i.length, drawOrGate2, 0);
        i.forEach((j, jnd) => {
            let vname = (j.comp ? '!':'') + j.name;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 1.5 * newVars.indexOf(vname), pty + sizeH / 2 - (jnd - (i.length - 1) / 2) * WIRE_GAP * 3 );
            ctx.lineTo(ptx - GATE_SIZE * 5 / 8, pty + sizeH / 2 - (jnd - (i.length - 1) / 2) * WIRE_GAP * 3 );
            ctx.stroke();
        });
        pty += sizeH + COMP_GAP;
        sumSize += sizeH + COMP_GAP;
    });

    ptx += GATE_SIZE * ( 2 * Math.max(...mdnf.map(i => Math.ceil(Math.log2(i.length)))) - 1) + COMP_GAP * 2 + WIRE_GAP * mdnf.length;
    pty = TEXT_PAD + NOT_TOP + GATE_SIZE + sumSize / 2;

    drawFullAnd2(ctx, ptx, pty, mdnf.length, drawAndGate2, 0);
    ctx.beginPath();
    ctx.lineWidth = 1;
    let dep = Math.ceil(Math.log2(mdnf.length));
    const rest = createElem('p', `\\[f\\]`, '');
    if(mdnf.length == 1) {
        ctx.moveTo(ptx - GATE_SIZE / 2, pty);
        ctx.lineTo(ptx + GATE_SIZE * (2 * mdnf.length - 1) / 2 + GATE_SIZE, pty);
        rest.style.top = `${pty - NOT_TOP + 5}px`;
        rest.style.left = `${ptx + GATE_SIZE * (2 * mdnf.length - 1) / 2}px`;
    }
    else {
        ctx.moveTo(ptx - GATE_SIZE / 2 + GATE_SIZE * (2 * dep - 1), pty - (GATE_SIZE - WIRE_GAP * 3) / 2 - (mdnf.length - 1) * WIRE_GAP * 3 / 2 + (Math.pow(2, dep - 1) - 1) * WIRE_GAP * 3 + GATE_SIZE / 2);
        ctx.lineTo(ptx + GATE_SIZE / 2 + GATE_SIZE * (2 * dep - 1), pty - (GATE_SIZE - WIRE_GAP * 3) / 2 - (mdnf.length - 1) * WIRE_GAP * 3 / 2 + (Math.pow(2, dep - 1) - 1) * WIRE_GAP * 3 + GATE_SIZE / 2);
        rest.style.top = `${pty - (GATE_SIZE - WIRE_GAP * 3) / 2 - (mdnf.length - 1) * WIRE_GAP * 3 / 2 + (Math.pow(2, dep - 1) - 1) * WIRE_GAP * 3 + GATE_SIZE / 2 - NOT_TOP + 5}px`;
        rest.style.left = `${ptx + GATE_SIZE / 2 + GATE_SIZE * (2 * dep - 1)}px`;
    }
    ctx.stroke();
    canvasCon.appendChild(rest);

    pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;

    mdnf.forEach((i, ind) => {
        let sizeH = (i.length - 1) * WIRE_GAP * 3;
        if(i.length == 1) sizeH = 0;
        ctx.beginPath();
        ctx.lineWidth = 1;
        let depth = Math.ceil(Math.log2(i.length));
        if(i.length == 1)
            ctx.moveTo(ttx - GATE_SIZE / 2, pty);
        else ctx.moveTo(ttx - GATE_SIZE / 2 + (2 * depth - 1) * GATE_SIZE, pty + (Math.pow(2, depth - 1) - 1) * WIRE_GAP * 3 + GATE_SIZE / 2);
        let pt = Math.min(ind, mdnf.length - ind - 1);
        if(i.length == 1) ctx.lineTo(ttx + GATE_SIZE * ( 2 * Math.max(...mdnf.map(i => Math.ceil(Math.log2(i.length)))) - 1) + COMP_GAP + WIRE_GAP * (mdnf.length-1) - pt * WIRE_GAP, pty);
        else ctx.lineTo(ttx + GATE_SIZE * ( 2 * Math.max(...mdnf.map(i => Math.ceil(Math.log2(i.length)))) - 1) + COMP_GAP + WIRE_GAP * (mdnf.length-1) - pt * WIRE_GAP, pty + (Math.pow(2, depth - 1) - 1) * WIRE_GAP * 3 + GATE_SIZE / 2);
        ctx.lineTo(ttx + GATE_SIZE * ( 2 * Math.max(...mdnf.map(i => Math.ceil(Math.log2(i.length)))) - 1) + COMP_GAP + WIRE_GAP * (mdnf.length-1) - pt * WIRE_GAP, TEXT_PAD + NOT_TOP + GATE_SIZE + sumSize / 2 - ((mdnf.length - 1) / 2 - ind) * WIRE_GAP * 3);
        ctx.lineTo(ptx - GATE_SIZE * 5 / 8, TEXT_PAD + NOT_TOP + GATE_SIZE + sumSize / 2 - ((mdnf.length - 1) / 2 - ind) * WIRE_GAP * 3);
        ctx.stroke();
        pty += sizeH + COMP_GAP;
    });
};

const createCanvasNAND = (gdnf, vars) => {
    const canvasCon = createElem('div', '', 'canvas-con m-auto');
    /** @type {HTMLCanvasElement} */
    const canvas = createElem('canvas', '', '');
    canvasCon.appendChild(canvas);
    document.querySelector('.res-q').appendChild(canvasCon);

    let mdnf = gdnf.map(i => {
        if(i.length > 1) return i;
        return i.map(j => {
            return { name: j.name, comp: !j.comp };
        });
    });

    canvas.height = TEXT_PAD + NOT_TOP * 1.2 + GATE_SIZE + COMP_GAP + mdnf.map(i => {
        let sizeH = Math.max(GATE_SIZE, (WIRE_GAP + 1) * (i.length - 1) + 1);
        return sizeH + COMP_GAP
    }).reduce((a,b) => a + b, 0);
    canvas.width = WIRE_GAP2 + vars.map((vi) => {
        if(mdnf.filter(i => i.filter(j => j.name == vi && j.comp).length > 0).length > 0) return WIRE_GAP2 * 4;
        return WIRE_GAP2 * 2;
    }).reduce((a,b) => a + b, 0) + COMP_GAP + GATE_SIZE + COMP_GAP * 2 + WIRE_GAP * mdnf.length + GATE_SIZE * 3 / 2;

    const ctx = canvas.getContext('2d');
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    // Lines
    let ptx = WIRE_GAP2;
    let newVars = [];
    vars.forEach((vi) => {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ptx, TEXT_PAD);
        ctx.lineTo(ptx, canvas.height);
        const vart = createElem('p', `\\[${mapVar(vi)}\\]`, '');
        vart.style.top = `${-NOT_TOP / 3}px`;
        vart.style.left = `${ptx + 5}px`;
        canvasCon.appendChild(vart);
        newVars.push(vi);
        if(mdnf.filter(i => i.filter(j => j.name == vi && j.comp).length > 0).length > 0) {
            ctx.moveTo(ptx, TEXT_PAD + 30);
            ptx += WIRE_GAP2 * 2;
            ctx.lineTo(ptx, TEXT_PAD + NOT_TOP / 2);
            ctx.lineTo(ptx, TEXT_PAD + NOT_TOP * 0.7);
            ctx.lineTo(ptx + GATE_SIZE / 4, TEXT_PAD + NOT_TOP * 0.7);
            ctx.lineTo(ptx + GATE_SIZE / 4, TEXT_PAD + NOT_TOP * 1.3);
            newVars.push('!' + vi);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(ptx, TEXT_PAD + NOT_TOP * 0.7);
            ctx.lineTo(ptx - GATE_SIZE / 4, TEXT_PAD + NOT_TOP * 0.7);
            ctx.lineTo(ptx - GATE_SIZE / 4, TEXT_PAD + NOT_TOP * 1.3);
            ctx.stroke();
            drawNotNand(ctx, ptx, TEXT_PAD + NOT_TOP * 1.2);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ptx, TEXT_PAD + NOT_TOP * 1.2 + GATE_SIZE / 2 + GATE_SIZE / 5);
            ctx.lineTo(ptx, canvas.height);
            ctx.stroke();
        } else {
            ctx.stroke();
        }
        ptx += WIRE_GAP2 * 2;
    });

    let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;
    ptx += COMP_GAP;
    let sumSize = COMP_GAP;
    let ttx = ptx;

    mdnf.forEach(i => {
        let sizeH = Math.max(GATE_SIZE, (WIRE_GAP + 1) * (i.length - 1) + 1);
        drawNandGate(ctx, ptx, pty + sizeH / 2, i.length);
        i.forEach((j, jnd) => {
            let vname = (j.comp ? '!':'') + j.name;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 2 * newVars.indexOf(vname), pty + sizeH / 2 - (jnd - (i.length - 1) / 2) * WIRE_GAP );
            ctx.lineTo(ptx - GATE_SIZE * 5 / 8, pty + sizeH / 2 - (jnd - (i.length - 1) / 2) * WIRE_GAP );
            ctx.stroke();
        });
        pty += sizeH + COMP_GAP;
        sumSize += sizeH + COMP_GAP;
    });  
    
    ptx += GATE_SIZE + COMP_GAP * 2 + WIRE_GAP * mdnf.length;
    pty = TEXT_PAD + NOT_TOP + GATE_SIZE + sumSize / 2;

    if(mdnf.length > 1) {
        drawNandGate(ctx, ptx, pty, mdnf.length);
    } else {
        drawNandGate(ctx, ptx, pty, 2, true);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ptx - GATE_SIZE * 7 / 8, pty - WIRE_GAP * 0.75);
        ctx.lineTo(ptx - GATE_SIZE * 7 / 8, pty + WIRE_GAP * 0.75);
        ctx.lineTo(ptx - GATE_SIZE * 5 / 8, pty + WIRE_GAP * 0.75);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(ptx - GATE_SIZE * 7 / 8, pty - WIRE_GAP * 0.75);
        ctx.lineTo(ptx - GATE_SIZE * 5 / 8, pty - WIRE_GAP * 0.75);
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(ptx + GATE_SIZE / 2 + GATE_SIZE / 5, pty);
    ctx.lineTo(ptx + GATE_SIZE * 3 / 2, pty);
    ctx.stroke();

    const rest = createElem('p', `\\[f\\]`, '');
    rest.style.top = `${pty - NOT_TOP + 5}px`;
    rest.style.left = `${ptx + GATE_SIZE * 3 / 2}px`;
    canvasCon.appendChild(rest);

    pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;

    mdnf.forEach((i, ind) => {
        let sizeH = Math.max(GATE_SIZE, (WIRE_GAP + 1) * (i.length - 1) + 1);
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(ttx + GATE_SIZE / 2 + GATE_SIZE / 5, pty + sizeH / 2);
        let pt = Math.min(ind, mdnf.length - ind - 1);
        ctx.lineTo(ttx + GATE_SIZE + COMP_GAP + WIRE_GAP * (mdnf.length-1) - pt * WIRE_GAP, pty + sizeH / 2);
        ctx.lineTo(ttx + GATE_SIZE + COMP_GAP + WIRE_GAP * (mdnf.length-1) - pt * WIRE_GAP, TEXT_PAD + NOT_TOP + GATE_SIZE + sumSize / 2 - ((mdnf.length - 1) / 2 - ind) * WIRE_GAP);
        if(mdnf.length>1) ctx.lineTo(ptx - GATE_SIZE * 5 / 8, TEXT_PAD + NOT_TOP + GATE_SIZE + sumSize / 2 - ((mdnf.length - 1) / 2 - ind) * WIRE_GAP);
        else ctx.lineTo(ptx - GATE_SIZE * 7 / 8, TEXT_PAD + NOT_TOP + GATE_SIZE + sumSize / 2 - ((mdnf.length - 1) / 2 - ind) * WIRE_GAP);
        ctx.stroke();
        pty += sizeH + COMP_GAP;
    });
};

const createCanvasNAND2 = (gdnf, vars) => {
    if(gdnf.length == 1) {
        createCanvasNAND(gdnf, vars);
        return;
    }
    const canvasCon = createElem('div', '', 'canvas-con m-auto');
    /** @type {HTMLCanvasElement} */
    const canvas = createElem('canvas', '', '');
    canvasCon.appendChild(canvas);
    document.querySelector('.res-q').appendChild(canvasCon);

    let mdnf = gdnf.map(i => {
        if(i.length > 1) return i;
        return i.map(j => {
            return { name: j.name, comp: !j.comp };
        });
    });

    const getSizeRec2 = (dnf) => {
        if(dnf.length > 1) {
            let mid = Math.floor(dnf.length / 2);
            let s1 = getSizeRec2(dnf.slice(0, mid)); 
            let s2 = getSizeRec2(dnf.slice(mid));
            return Math.max(s1, s2) + (COMP_GAP + GATE_SIZE * 6 / 5) * 2;
        }
        return COMP_GAP;
    };

    const getSizeRec1 = (dnf) => {
        if(dnf.length > 1) {
            let mid = Math.floor(dnf.length / 2);
            let s1 = getSizeRec1(dnf.slice(0, mid)); 
            let s2 = getSizeRec1(dnf.slice(mid));
            return Math.max(s1, s2) + (COMP_GAP + GATE_SIZE * 6 / 5) * 2;
        }
        let mid = Math.floor(dnf[0].length / 2);
        if(dnf[0].length == 1) {
            return COMP_GAP;
        }
        let s1 = getSizeRec2(dnf[0].slice(0, mid)); 
        let s2 = getSizeRec2(dnf[0].slice(mid));
        return Math.max(s1, s2) + (COMP_GAP + GATE_SIZE * 6 / 5);
    };

    canvas.height = TEXT_PAD + NOT_TOP * 1.2 + GATE_SIZE + COMP_GAP + mdnf.map(i => {
        return i.length
    }).reduce((a,b) => a + b, 0) * WIRE_GAP * 3;
    let mid2 = Math.floor(mdnf.length / 2);
    canvas.width = WIRE_GAP2 + vars.map((vi) => {
        if(mdnf.filter(i => i.filter(j => j.name == vi && j.comp).length > 0).length > 0) return WIRE_GAP2 * 4;
        return WIRE_GAP2 * 2;
    }).reduce((a,b) => a + b, 0) + Math.max(getSizeRec1(mdnf.slice(0, mid2)), getSizeRec1(mdnf.slice(mid2))) + (COMP_GAP + GATE_SIZE * 6 / 5) * 2;

    const ctx = canvas.getContext('2d');
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    // Lines
    let ptx = WIRE_GAP2;
    let newVars = [];
    vars.forEach((vi) => {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ptx, TEXT_PAD);
        ctx.lineTo(ptx, canvas.height);
        const vart = createElem('p', `\\[${mapVar(vi)}\\]`, '');
        vart.style.top = `${-NOT_TOP / 3}px`;
        vart.style.left = `${ptx + 5}px`;
        canvasCon.appendChild(vart);
        newVars.push(vi);
        if(mdnf.filter(i => i.filter(j => j.name == vi && j.comp).length > 0).length > 0) {
            ctx.moveTo(ptx, TEXT_PAD + 30);
            ptx += WIRE_GAP2 * 2;
            ctx.lineTo(ptx, TEXT_PAD + NOT_TOP / 2);
            ctx.lineTo(ptx, TEXT_PAD + NOT_TOP * 0.7);
            ctx.lineTo(ptx + GATE_SIZE / 4, TEXT_PAD + NOT_TOP * 0.7);
            ctx.lineTo(ptx + GATE_SIZE / 4, TEXT_PAD + NOT_TOP * 1.3);
            newVars.push('!' + vi);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(ptx, TEXT_PAD + NOT_TOP * 0.7);
            ctx.lineTo(ptx - GATE_SIZE / 4, TEXT_PAD + NOT_TOP * 0.7);
            ctx.lineTo(ptx - GATE_SIZE / 4, TEXT_PAD + NOT_TOP * 1.3);
            ctx.stroke();
            drawNotNand(ctx, ptx, TEXT_PAD + NOT_TOP * 1.2);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ptx, TEXT_PAD + NOT_TOP * 1.2 + GATE_SIZE / 2 + GATE_SIZE / 5);
            ctx.lineTo(ptx, canvas.height);
            ctx.stroke();
        } else {
            ctx.stroke();
        }
        ptx += WIRE_GAP2 * 2;
    });

    let ttx = ptx;
    let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;

    const getNandRecs2 = (dnf) => {
        if(dnf.length > 1) {
            let mid = Math.floor(dnf.length / 2);
            // return `\\overline{\\overline{${getNandRec2(dnf.slice(0, mid))} \\cdot ${getNandRec2(dnf.slice(mid))}}}`;
            let pos1 = getNandRecs2(dnf.slice(0, mid)); 
            let pos2 = getNandRecs2(dnf.slice(mid));
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pos1.x, pos1.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, pos1.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos2.x, pos2.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, pos2.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
            ctx.stroke();
            drawNandGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 3 / 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 3 / 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 3 / 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 3 / 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
            ctx.stroke();
            drawNandGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP * 2 + GATE_SIZE * 6 / 5 + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
            return { x: Math.max(pos1.x, pos2.x) + (COMP_GAP + GATE_SIZE * 6 / 5) * 2, y: (pos1.y + pos2.y) / 2 };
        } else {
            // if(dnf[0].comp) return `\\overline{${mapVar(dnf[0].name)}}`;
            // else return mapVar(dnf[0].name);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ptx - GATE_SIZE / 8, pty);
            ctx.lineTo(ptx, pty);
            ctx.stroke();
            let vname = (dnf[0].comp ? '!':'') + dnf[0].name;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 2 * newVars.indexOf(vname), pty );
            ctx.lineTo(ptx - GATE_SIZE / 8, pty );
            ctx.stroke();
            pty += WIRE_GAP * 3;
            return { x: ptx, y: pty - WIRE_GAP * 3 };
        }
    };

    const getNandRecs1 = (dnf) => {
        if(dnf.length > 1) {
            let mid = Math.floor(dnf.length / 2);
            // return `\\overline{\\overline{${getNandRec1(dnf.slice(0, mid))} \\cdot ${getNandRec1(dnf.slice(mid))}}}`;
            let pos1 = getNandRecs1(dnf.slice(0, mid)); 
            let pos2 = getNandRecs1(dnf.slice(mid));
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pos1.x, pos1.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, pos1.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos2.x, pos2.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, pos2.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
            ctx.stroke();
            drawNandGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 3 / 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 3 / 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 3 / 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 3 / 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
            ctx.stroke();
            drawNandGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP * 2 + GATE_SIZE * 6 / 5 + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
            return { x: Math.max(pos1.x, pos2.x) + (COMP_GAP + GATE_SIZE * 6 / 5) * 2, y: (pos1.y + pos2.y) / 2 };
        } else {
            let mid = Math.floor(dnf[0].length / 2);
            if(dnf[0].length == 1) {
                // if(dnf[0][0].comp) return mapVar(dnf[0][0].name);
                // else return `\\overline{${mapVar(dnf[0][0].name)}}`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(ptx - GATE_SIZE / 8, pty);
                ctx.lineTo(ptx, pty);
                ctx.stroke();
                let vname = (dnf[0][0].comp ? '':'!') + dnf[0][0].name;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 2 * newVars.indexOf(vname), pty );
                ctx.lineTo(ptx - GATE_SIZE / 8, pty );
                ctx.stroke();
                pty += WIRE_GAP * 3;
                return { x: ptx, y: pty - WIRE_GAP * 3 };
            }
            // return `\\overline{${getNandRec2(dnf[0].slice(0, mid))} \\cdot ${getNandRec2(dnf[0].slice(mid))}}`;
            let pos1 = getNandRecs2(dnf[0].slice(0, mid)); 
            let pos2 = getNandRecs2(dnf[0].slice(mid));
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pos1.x, pos1.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, pos1.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos2.x, pos2.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, pos2.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
            ctx.stroke();
            drawNandGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
            return { x: Math.max(pos1.x, pos2.x) + (COMP_GAP + GATE_SIZE * 6 / 5), y: (pos1.y + pos2.y) / 2 };
        }
    };

    let mid = Math.floor(gdnf.length / 2);
    let pos1 = getNandRecs1(gdnf.slice(0, mid));
    let pos2 = getNandRecs1(gdnf.slice(mid));
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pos1.x, pos1.y);
    ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, pos1.y);
    ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
    ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos2.x, pos2.y);
    ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, pos2.y);
    ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
    ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
    ctx.stroke();
    drawNandGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2);
    ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE * 2.5, (pos1.y + pos2.y) / 2);
    ctx.stroke();

    const rest = createElem('p', `\\[f\\]`, '');
    rest.style.top = `${(pos1.y + pos2.y) / 2 - NOT_TOP + 5}px`;
    rest.style.left = `${Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE + GATE_SIZE * 3 / 2}px`;
    canvasCon.appendChild(rest);
};

const createCanvasNOR = (gknf, vars) => {
    const canvasCon = createElem('div', '', 'canvas-con m-auto');
    /** @type {HTMLCanvasElement} */
    const canvas = createElem('canvas', '', '');
    canvasCon.appendChild(canvas);
    document.querySelector('.res-q').appendChild(canvasCon);

    let mdnf = gknf.map(i => {
        if(i.length > 1) return i;
        return i.map(j => {
            return { name: j.name, comp: !j.comp };
        });
    });

    canvas.height = TEXT_PAD + NOT_TOP * 1.2 + GATE_SIZE + COMP_GAP + mdnf.map(i => {
        let sizeH = Math.max(GATE_SIZE, (WIRE_GAP + 1) * (i.length - 1) + 1);
        return sizeH + COMP_GAP
    }).reduce((a,b) => a + b, 0);
    canvas.width = WIRE_GAP2 + vars.map((vi) => {
        if(mdnf.filter(i => i.filter(j => j.name == vi && j.comp).length > 0).length > 0) return WIRE_GAP2 * 4;
        return WIRE_GAP2 * 2;
    }).reduce((a,b) => a + b, 0) + COMP_GAP + GATE_SIZE + COMP_GAP * 2 + WIRE_GAP * mdnf.length + GATE_SIZE * 3 / 2;

    const ctx = canvas.getContext('2d');
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    // Lines
    let ptx = WIRE_GAP2;
    let newVars = [];
    vars.forEach((vi) => {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ptx, TEXT_PAD);
        ctx.lineTo(ptx, canvas.height);
        const vart = createElem('p', `\\[${mapVar(vi)}\\]`, '');
        vart.style.top = `${-NOT_TOP / 3}px`;
        vart.style.left = `${ptx + 5}px`;
        canvasCon.appendChild(vart);
        newVars.push(vi);
        if(mdnf.filter(i => i.filter(j => j.name == vi && j.comp).length > 0).length > 0) {
            ctx.moveTo(ptx, TEXT_PAD + 30);
            ptx += WIRE_GAP2 * 2;
            ctx.lineTo(ptx, TEXT_PAD + NOT_TOP / 2);
            ctx.lineTo(ptx, TEXT_PAD + NOT_TOP * 0.7);
            ctx.lineTo(ptx + GATE_SIZE / 4, TEXT_PAD + NOT_TOP * 0.7);
            ctx.lineTo(ptx + GATE_SIZE / 4, TEXT_PAD + NOT_TOP * 1.3);
            newVars.push('!' + vi);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(ptx, TEXT_PAD + NOT_TOP * 0.7);
            ctx.lineTo(ptx - GATE_SIZE / 4, TEXT_PAD + NOT_TOP * 0.7);
            ctx.lineTo(ptx - GATE_SIZE / 4, TEXT_PAD + NOT_TOP * 1.3);
            ctx.stroke();
            drawNotNor(ctx, ptx, TEXT_PAD + NOT_TOP * 1.2);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ptx, TEXT_PAD + NOT_TOP * 1.2 + GATE_SIZE / 2 + GATE_SIZE / 5);
            ctx.lineTo(ptx, canvas.height);
            ctx.stroke();
        } else {
            ctx.stroke();
        }
        ptx += WIRE_GAP2 * 2;
    });

    let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;
    ptx += COMP_GAP;
    let sumSize = COMP_GAP;
    let ttx = ptx;

    mdnf.forEach(i => {
        let sizeH = Math.max(GATE_SIZE, (WIRE_GAP + 1) * (i.length - 1) + 1);
        drawNorGate(ctx, ptx, pty + sizeH / 2, i.length);
        i.forEach((j, jnd) => {
            let vname = (j.comp ? '!':'') + j.name;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 2 * newVars.indexOf(vname), pty + sizeH / 2 - (jnd - (i.length - 1) / 2) * WIRE_GAP );
            ctx.lineTo(ptx - GATE_SIZE * 5 / 8, pty + sizeH / 2 - (jnd - (i.length - 1) / 2) * WIRE_GAP );
            ctx.stroke();
        });
        pty += sizeH + COMP_GAP;
        sumSize += sizeH + COMP_GAP;
    });  
    
    ptx += GATE_SIZE + COMP_GAP * 2 + WIRE_GAP * mdnf.length;
    pty = TEXT_PAD + NOT_TOP + GATE_SIZE + sumSize / 2;

    if(mdnf.length > 1) {
        drawNorGate(ctx, ptx, pty, mdnf.length);
    } else {
        drawNorGate(ctx, ptx, pty, 2, true);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ptx - GATE_SIZE * 7 / 8, pty - WIRE_GAP * 0.75);
        ctx.lineTo(ptx - GATE_SIZE * 7 / 8, pty + WIRE_GAP * 0.75);
        ctx.lineTo(ptx - GATE_SIZE * 5 / 8, pty + WIRE_GAP * 0.75);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(ptx - GATE_SIZE * 7 / 8, pty - WIRE_GAP * 0.75);
        ctx.lineTo(ptx - GATE_SIZE * 5 / 8, pty - WIRE_GAP * 0.75);
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(ptx + GATE_SIZE / 2 + GATE_SIZE / 5, pty);
    ctx.lineTo(ptx + GATE_SIZE * 3 / 2, pty);
    ctx.stroke();

    const rest = createElem('p', `\\[f\\]`, '');
    rest.style.top = `${pty - NOT_TOP + 5}px`;
    rest.style.left = `${ptx + GATE_SIZE * 3 / 2}px`;
    canvasCon.appendChild(rest);

    pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;

    mdnf.forEach((i, ind) => {
        let sizeH = Math.max(GATE_SIZE, (WIRE_GAP + 1) * (i.length - 1) + 1);
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(ttx + GATE_SIZE / 2 + GATE_SIZE / 5, pty + sizeH / 2);
        let pt = Math.min(ind, mdnf.length - ind - 1);
        ctx.lineTo(ttx + GATE_SIZE + COMP_GAP + WIRE_GAP * (mdnf.length-1) - pt * WIRE_GAP, pty + sizeH / 2);
        ctx.lineTo(ttx + GATE_SIZE + COMP_GAP + WIRE_GAP * (mdnf.length-1) - pt * WIRE_GAP, TEXT_PAD + NOT_TOP + GATE_SIZE + sumSize / 2 - ((mdnf.length - 1) / 2 - ind) * WIRE_GAP);
        if(mdnf.length>1) ctx.lineTo(ptx - GATE_SIZE * 5 / 8, TEXT_PAD + NOT_TOP + GATE_SIZE + sumSize / 2 - ((mdnf.length - 1) / 2 - ind) * WIRE_GAP);
        else ctx.lineTo(ptx - GATE_SIZE * 7 / 8, TEXT_PAD + NOT_TOP + GATE_SIZE + sumSize / 2 - ((mdnf.length - 1) / 2 - ind) * WIRE_GAP);
        ctx.stroke();
        pty += sizeH + COMP_GAP;
    });
};

const createCanvasNOR2 = (gdnf, vars) => {
    if(gdnf.length == 1) {
        createCanvasNAND(gdnf, vars);
        return;
    }
    const canvasCon = createElem('div', '', 'canvas-con m-auto');
    /** @type {HTMLCanvasElement} */
    const canvas = createElem('canvas', '', '');
    canvasCon.appendChild(canvas);
    document.querySelector('.res-q').appendChild(canvasCon);

    let mdnf = gdnf.map(i => {
        if(i.length > 1) return i;
        return i.map(j => {
            return { name: j.name, comp: !j.comp };
        });
    });

    const getSizeRec2 = (dnf) => {
        if(dnf.length > 1) {
            let mid = Math.floor(dnf.length / 2);
            let s1 = getSizeRec2(dnf.slice(0, mid)); 
            let s2 = getSizeRec2(dnf.slice(mid));
            return Math.max(s1, s2) + (COMP_GAP + GATE_SIZE * 6 / 5) * 2;
        }
        return COMP_GAP;
    };

    const getSizeRec1 = (dnf) => {
        if(dnf.length > 1) {
            let mid = Math.floor(dnf.length / 2);
            let s1 = getSizeRec1(dnf.slice(0, mid)); 
            let s2 = getSizeRec1(dnf.slice(mid));
            return Math.max(s1, s2) + (COMP_GAP + GATE_SIZE * 6 / 5) * 2;
        }
        let mid = Math.floor(dnf[0].length / 2);
        if(dnf[0].length == 1) {
            return COMP_GAP;
        }
        let s1 = getSizeRec2(dnf[0].slice(0, mid)); 
        let s2 = getSizeRec2(dnf[0].slice(mid));
        return Math.max(s1, s2) + (COMP_GAP + GATE_SIZE * 6 / 5);
    };

    canvas.height = TEXT_PAD + NOT_TOP * 1.2 + GATE_SIZE + COMP_GAP + mdnf.map(i => {
        return i.length
    }).reduce((a,b) => a + b, 0) * WIRE_GAP * 3;
    let mid2 = Math.floor(mdnf.length / 2);
    canvas.width = WIRE_GAP2 + vars.map((vi) => {
        if(mdnf.filter(i => i.filter(j => j.name == vi && j.comp).length > 0).length > 0) return WIRE_GAP2 * 4;
        return WIRE_GAP2 * 2;
    }).reduce((a,b) => a + b, 0) + Math.max(getSizeRec1(mdnf.slice(0, mid2)), getSizeRec1(mdnf.slice(mid2))) + (COMP_GAP + GATE_SIZE * 6 / 5) * 2;

    const ctx = canvas.getContext('2d');
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    // Lines
    let ptx = WIRE_GAP2;
    let newVars = [];
    vars.forEach((vi) => {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ptx, TEXT_PAD);
        ctx.lineTo(ptx, canvas.height);
        const vart = createElem('p', `\\[${mapVar(vi)}\\]`, '');
        vart.style.top = `${-NOT_TOP / 3}px`;
        vart.style.left = `${ptx + 5}px`;
        canvasCon.appendChild(vart);
        newVars.push(vi);
        if(mdnf.filter(i => i.filter(j => j.name == vi && j.comp).length > 0).length > 0) {
            ctx.moveTo(ptx, TEXT_PAD + 30);
            ptx += WIRE_GAP2 * 2;
            ctx.lineTo(ptx, TEXT_PAD + NOT_TOP / 2);
            ctx.lineTo(ptx, TEXT_PAD + NOT_TOP * 0.7);
            ctx.lineTo(ptx + GATE_SIZE / 4, TEXT_PAD + NOT_TOP * 0.7);
            ctx.lineTo(ptx + GATE_SIZE / 4, TEXT_PAD + NOT_TOP * 1.3);
            newVars.push('!' + vi);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(ptx, TEXT_PAD + NOT_TOP * 0.7);
            ctx.lineTo(ptx - GATE_SIZE / 4, TEXT_PAD + NOT_TOP * 0.7);
            ctx.lineTo(ptx - GATE_SIZE / 4, TEXT_PAD + NOT_TOP * 1.3);
            ctx.stroke();
            drawNotNor(ctx, ptx, TEXT_PAD + NOT_TOP * 1.2);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ptx, TEXT_PAD + NOT_TOP * 1.2 + GATE_SIZE / 2 + GATE_SIZE / 5);
            ctx.lineTo(ptx, canvas.height);
            ctx.stroke();
        } else {
            ctx.stroke();
        }
        ptx += WIRE_GAP2 * 2;
    });

    let ttx = ptx;
    let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;

    const getNandRecs2 = (dnf) => {
        if(dnf.length > 1) {
            let mid = Math.floor(dnf.length / 2);
            // return `\\overline{\\overline{${getNandRec2(dnf.slice(0, mid))} \\cdot ${getNandRec2(dnf.slice(mid))}}}`;
            let pos1 = getNandRecs2(dnf.slice(0, mid)); 
            let pos2 = getNandRecs2(dnf.slice(mid));
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pos1.x, pos1.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, pos1.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos2.x, pos2.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, pos2.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
            ctx.stroke();
            drawNorGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 3 / 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 3 / 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 3 / 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 3 / 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
            ctx.stroke();
            drawNorGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP * 2 + GATE_SIZE * 6 / 5 + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
            return { x: Math.max(pos1.x, pos2.x) + (COMP_GAP + GATE_SIZE * 6 / 5) * 2, y: (pos1.y + pos2.y) / 2 };
        } else {
            // if(dnf[0].comp) return `\\overline{${mapVar(dnf[0].name)}}`;
            // else return mapVar(dnf[0].name);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ptx - GATE_SIZE / 8, pty);
            ctx.lineTo(ptx, pty);
            ctx.stroke();
            let vname = (dnf[0].comp ? '!':'') + dnf[0].name;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 2 * newVars.indexOf(vname), pty );
            ctx.lineTo(ptx - GATE_SIZE / 8, pty );
            ctx.stroke();
            pty += WIRE_GAP * 3;
            return { x: ptx, y: pty - WIRE_GAP * 3 };
        }
    };

    const getNandRecs1 = (dnf) => {
        if(dnf.length > 1) {
            let mid = Math.floor(dnf.length / 2);
            // return `\\overline{\\overline{${getNandRec1(dnf.slice(0, mid))} \\cdot ${getNandRec1(dnf.slice(mid))}}}`;
            let pos1 = getNandRecs1(dnf.slice(0, mid)); 
            let pos2 = getNandRecs1(dnf.slice(mid));
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pos1.x, pos1.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, pos1.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos2.x, pos2.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, pos2.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
            ctx.stroke();
            drawNorGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 3 / 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 3 / 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 3 / 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 3 / 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP * 2 + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
            ctx.stroke();
            drawNorGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP * 2 + GATE_SIZE * 6 / 5 + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
            return { x: Math.max(pos1.x, pos2.x) + (COMP_GAP + GATE_SIZE * 6 / 5) * 2, y: (pos1.y + pos2.y) / 2 };
        } else {
            let mid = Math.floor(dnf[0].length / 2);
            if(dnf[0].length == 1) {
                // if(dnf[0][0].comp) return mapVar(dnf[0][0].name);
                // else return `\\overline{${mapVar(dnf[0][0].name)}}`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(ptx - GATE_SIZE / 8, pty);
                ctx.lineTo(ptx, pty);
                ctx.stroke();
                let vname = (dnf[0][0].comp ? '':'!') + dnf[0][0].name;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 2 * newVars.indexOf(vname), pty );
                ctx.lineTo(ptx - GATE_SIZE / 8, pty );
                ctx.stroke();
                pty += WIRE_GAP * 3;
                return { x: ptx, y: pty - WIRE_GAP * 3 };
            }
            // return `\\overline{${getNandRec2(dnf[0].slice(0, mid))} \\cdot ${getNandRec2(dnf[0].slice(mid))}}`;
            let pos1 = getNandRecs2(dnf[0].slice(0, mid)); 
            let pos2 = getNandRecs2(dnf[0].slice(mid));
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pos1.x, pos1.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, pos1.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos2.x, pos2.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, pos2.y);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
            ctx.stroke();
            drawNorGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
            return { x: Math.max(pos1.x, pos2.x) + (COMP_GAP + GATE_SIZE * 6 / 5), y: (pos1.y + pos2.y) / 2 };
        }
    };

    let mid = Math.floor(gdnf.length / 2);
    let pos1 = getNandRecs1(gdnf.slice(0, mid));
    let pos2 = getNandRecs1(gdnf.slice(mid));
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pos1.x, pos1.y);
    ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, pos1.y);
    ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
    ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP, (pos1.y + pos2.y) / 2 - WIRE_GAP * 3 / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos2.x, pos2.y);
    ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, pos2.y);
    ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP / 2, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
    ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP, (pos1.y + pos2.y) / 2 + WIRE_GAP * 3 / 2);
    ctx.stroke();
    drawNorGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2);
    ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE * 2.5, (pos1.y + pos2.y) / 2);
    ctx.stroke();

    const rest = createElem('p', `\\[f\\]`, '');
    rest.style.top = `${(pos1.y + pos2.y) / 2 - NOT_TOP + 5}px`;
    rest.style.left = `${Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE + GATE_SIZE * 3 / 2}px`;
    canvasCon.appendChild(rest);
};

const testCanvas = (pins = 6) => {
    const canvasCon = createElem('div', '', 'canvas-con m-auto');
    /** @type {HTMLCanvasElement} */
    const canvas = createElem('canvas', '', '');
    canvasCon.appendChild(canvas);
    document.querySelector('.res-q').innerHTML = '';
    document.querySelector('.res-q').appendChild(canvasCon);

    canvas.width = 600;
    canvas.height = 600;

    const ctx = canvas.getContext('2d');
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    drawFullAnd2(ctx, 100, 300, pins, drawNorGate2, true);

};

/** @param {CanvasRenderingContext2D} ctx */
const drawAndGate = (ctx, x, y, pins) => {
    const sx = x - GATE_SIZE / 2;
    const sy = y - GATE_SIZE / 2;

    if(pins == 1) {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - GATE_SIZE / 2 - GATE_SIZE / 8, y);
        ctx.lineTo(x + GATE_SIZE / 2, y);
        ctx.stroke();
        return;
    }

    ctx.lineWidth = 1;
    for(let i=0;i<pins;i++) {
        ctx.beginPath();
        ctx.moveTo(sx - GATE_SIZE / 8, y - (i - (pins - 1) / 2) * WIRE_GAP);
        ctx.lineTo(sx, y - (i - (pins - 1) / 2) * WIRE_GAP);
        if(y - (i - (pins - 1) / 2) * WIRE_GAP < sy || y - (i - (pins - 1) / 2) * WIRE_GAP > sy + GATE_SIZE) {
            ctx.lineTo(sx, (y - (i - (pins - 1) / 2) * WIRE_GAP < sy) ? sy : sy + GATE_SIZE)
        }
        ctx.stroke();
    }
    
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + GATE_SIZE / 2, sy);
    ctx.arc(x, y, GATE_SIZE / 2, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(sx, sy + GATE_SIZE);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
};

/** @param {CanvasRenderingContext2D} ctx */
const drawAndGate2 = (ctx, x, y, pins) => {
    const sx = x - GATE_SIZE / 2;
    const sy = y - GATE_SIZE / 2;

    if(pins == 1) {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - GATE_SIZE / 2 - GATE_SIZE / 8, y);
        ctx.lineTo(x + GATE_SIZE / 2, y);
        ctx.stroke();
        return;
    }

    ctx.lineWidth = 1;
    for(let i=0;i<pins;i++) {
        ctx.beginPath();
        ctx.moveTo(sx - GATE_SIZE / 8, y - (i - (pins - 1) / 2) * WIRE_GAP * 3);
        ctx.lineTo(sx, y - (i - (pins - 1) / 2) * WIRE_GAP * 3);
        ctx.stroke();
    }
    
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + GATE_SIZE / 2, sy);
    ctx.arc(x, y, GATE_SIZE / 2, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(sx, sy + GATE_SIZE);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
};

const drawFullAnd2 = (ctx, x, y, pins, drawFunc, isPad) => {
    ctx.lineWidth = 1;
    const sh = (pins - 1) * WIRE_GAP * 3;
    const sx = x - GATE_SIZE / 2;
    const sy = y - sh / 2;
    let lastPin = {x: 0, y: 0};
    for(let i=0;i<pins;i++) {
        ctx.beginPath();
        ctx.moveTo(sx - GATE_SIZE / 8, y - ((pins - 1) / 2 - i) * WIRE_GAP * 3);
        ctx.lineTo(sx, y - ((pins - 1) / 2 - i) * WIRE_GAP * 3);
        ctx.stroke();
        lastPin = { x: sx - GATE_SIZE * isPad / 5, y: y - ((pins - 1) / 2 - i) * WIRE_GAP * 3 };
    }
    for(let i=0;i<pins>>1;i++) {
        drawFunc(ctx, sx + GATE_SIZE / 2, y - ((pins - 1) / 2 - 2*i) * WIRE_GAP * 3 - (GATE_SIZE - WIRE_GAP * 3) / 2 + GATE_SIZE / 2);
        if(pins == 2) continue;
        if(i < (pins>>1) - 1 || (pins >> 1) % 2 == 0 || pins % 2 == 1) {
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(sx + GATE_SIZE * isPad / 5 + GATE_SIZE, y - ((pins - 1) / 2 - 2*i) * WIRE_GAP * 3 - (GATE_SIZE - WIRE_GAP * 3) / 2 + GATE_SIZE / 2);
            ctx.lineTo(sx + GATE_SIZE * isPad / 5 + GATE_SIZE + GATE_SIZE / 2, y - ((pins - 1) / 2 - 2*i) * WIRE_GAP * 3 - (GATE_SIZE - WIRE_GAP * 3) / 2 + GATE_SIZE / 2);
            let gateY = sy + (Math.pow(2, 1) - 1 + Math.pow(2, 2) * (i >> 1) + i % 2 ) * WIRE_GAP * 3;
            ctx.lineTo(sx + GATE_SIZE * isPad / 5 + GATE_SIZE + GATE_SIZE / 2, gateY);
            ctx.lineTo(sx + GATE_SIZE * isPad / 5 + GATE_SIZE * 2, gateY);
            ctx.stroke();
        } else {
            lastPin = { x: sx + GATE_SIZE, y: y - ((pins - 1) / 2 - 2*i) * WIRE_GAP * 3 - (GATE_SIZE - WIRE_GAP * 3) / 2 + GATE_SIZE / 2};
        }
    }
    let dg = 1;
    let tempAdd = 0;
    while(pins > 1) {
        tempAdd = pins % 2;
        pins >>= 1;
        pins += tempAdd;
        if(tempAdd) {
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(lastPin.x + GATE_SIZE * isPad / 5, lastPin.y);
            ctx.lineTo(lastPin.x + GATE_SIZE * isPad / 5 + GATE_SIZE * 2, lastPin.y);
            if(pins % 2 == 0) {
                let dx = sx + dg * GATE_SIZE * 2 - lastPin.x - GATE_SIZE * 2;
                ctx.lineTo(lastPin.x + GATE_SIZE * isPad / 5 + GATE_SIZE * 2 + dx / 2, lastPin.y);
                ctx.lineTo(lastPin.x + GATE_SIZE * isPad / 5 + GATE_SIZE * 2 + dx / 2, sy + (Math.pow(2, dg) - 1 + Math.pow(2, dg + 1) * ((pins >> 1) - 1)) * WIRE_GAP * 3 + WIRE_GAP * 3);
                ctx.lineTo(lastPin.x + GATE_SIZE * isPad / 5 + GATE_SIZE * 2 + dx, sy + (Math.pow(2, dg) - 1 + Math.pow(2, dg + 1) * ((pins >> 1) - 1)) * WIRE_GAP * 3 + WIRE_GAP * 3);
            }
            ctx.stroke();
            lastPin.x += GATE_SIZE * 2;
        }
        for(let i=0;i<pins>>1;i++) {
            let gateY = sy + (Math.pow(2, dg) - 1 + Math.pow(2, dg + 1) * i) * WIRE_GAP * 3 - (GATE_SIZE - WIRE_GAP * 3) / 2 + GATE_SIZE / 2;
            drawFunc(ctx, sx + GATE_SIZE / 2 + dg * GATE_SIZE * 2, gateY);
            if(pins == 2) continue;
            if(i < (pins>>1) - 1 || (pins >> 1) % 2 == 0 || pins % 2 == 1) {
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(sx + GATE_SIZE * isPad / 5 + GATE_SIZE + dg * GATE_SIZE * 2, gateY);
                ctx.lineTo(sx + GATE_SIZE * isPad / 5 + GATE_SIZE + GATE_SIZE / 2 + dg * GATE_SIZE * 2, gateY);
                gateY = sy + (Math.pow(2, dg + 1) - 1 + Math.pow(2, dg + 2) * (i >> 1) + i % 2 ) * WIRE_GAP * 3;
                ctx.lineTo(sx + GATE_SIZE * isPad / 5 + GATE_SIZE + GATE_SIZE / 2 + dg * GATE_SIZE * 2, gateY);
                ctx.lineTo(sx + GATE_SIZE * isPad / 5 + GATE_SIZE * 2 + dg * GATE_SIZE * 2, gateY);
                ctx.stroke();
            } else {
                lastPin = { x: sx + GATE_SIZE + dg * GATE_SIZE * 2,y: gateY};
            }
        }
        dg++;
    }
};

/** @param {CanvasRenderingContext2D} ctx */
const drawNandGate = (ctx, x, y, pins, neg) => {
    const sx = x - GATE_SIZE / 2;
    const sy = y - GATE_SIZE / 2;

    if(pins == 1) {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - GATE_SIZE / 2 - GATE_SIZE / 8, y);
        ctx.lineTo(x + GATE_SIZE / 2 + GATE_SIZE / 5, y);
        ctx.stroke();
        return;
    }

    ctx.lineWidth = 1;
    for(let i=0;i<pins;i++) {
        ctx.beginPath();
        ctx.moveTo(sx - GATE_SIZE / 8, y - (i - (pins - 1) / 2) * WIRE_GAP * (neg ? 1.5 : 1));
        ctx.lineTo(sx, y - (i - (pins - 1) / 2) * WIRE_GAP * (neg ? 1.5 : 1));
        if(y - (i - (pins - 1) / 2) * WIRE_GAP < sy || y - (i - (pins - 1) / 2) * WIRE_GAP > sy + GATE_SIZE) {
            ctx.lineTo(sx, (y - (i - (pins - 1) / 2) * WIRE_GAP < sy) ? sy : sy + GATE_SIZE)
        }
        ctx.stroke();
    }
    
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + GATE_SIZE / 2, sy);
    ctx.arc(x, y, GATE_SIZE / 2, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(sx, sy + GATE_SIZE);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + GATE_SIZE / 2 + GATE_SIZE / 10, y, GATE_SIZE / 10, 0, 2 * Math.PI);

    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
};

/** @param {CanvasRenderingContext2D} ctx */
const drawNandGate2 = (ctx, x, y, pins) => {
    const sx = x - GATE_SIZE / 2;
    const sy = y - GATE_SIZE / 2;

    if(pins == 1) {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - GATE_SIZE / 2 - GATE_SIZE / 8, y);
        ctx.lineTo(x + GATE_SIZE / 2 + GATE_SIZE / 5, y);
        ctx.stroke();
        return;
    }

    ctx.lineWidth = 1;
    for(let i=0;i<pins;i++) {
        ctx.beginPath();
        ctx.moveTo(sx - GATE_SIZE / 8, y - (i - (pins - 1) / 2) * WIRE_GAP * 3);
        ctx.lineTo(sx, y - (i - (pins - 1) / 2) * WIRE_GAP * 3);
        ctx.stroke();
    }
    
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + GATE_SIZE / 2, sy);
    ctx.arc(x, y, GATE_SIZE / 2, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(sx, sy + GATE_SIZE);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + GATE_SIZE / 2 + GATE_SIZE / 10, y, GATE_SIZE / 10, 0, 2 * Math.PI);

    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
};

/** @param {CanvasRenderingContext2D} ctx */
const drawNotGate = (ctx, x, y) => {
    const sx = x - GATE_SIZE / 4;
    const sy = y - GATE_SIZE / 4;

    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(x, sy + GATE_SIZE / 2);
    ctx.lineTo(sx + GATE_SIZE / 2, sy);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y + GATE_SIZE / 4 + GATE_SIZE / 10, GATE_SIZE / 10, 0, 2*Math.PI);

    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
};

/** @param {CanvasRenderingContext2D} ctx */
const drawNotNand = (ctx, x, y) => {
    const sx = x - GATE_SIZE / 2;
    const sy = y - GATE_SIZE / 2;

    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx, sy + GATE_SIZE / 2);
    ctx.arc(x, y, GATE_SIZE / 2, Math.PI, 2*Math.PI, true);
    ctx.lineTo(sx + GATE_SIZE, sy);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y + GATE_SIZE / 2 + GATE_SIZE / 10, GATE_SIZE / 10, 0, 2*Math.PI);

    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
};

const drawNotNor = (ctx, x, y) => {
    const sx = x - GATE_SIZE / 2;
    const sy = y - GATE_SIZE / 2;

    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx, sy + GATE_SIZE * (1 - Math.sqrt(3)/2));
    ctx.arc(sx + GATE_SIZE, sy + GATE_SIZE * (1 - Math.sqrt(3)/2), GATE_SIZE, Math.PI, Math.PI - Math.PI / 3, true);
    ctx.arc(sx, sy + GATE_SIZE * (1 - Math.sqrt(3)/2), GATE_SIZE, Math.PI / 3, 0, true);
    ctx.lineTo(sx + GATE_SIZE, sy);
    ctx.arc(x, sy - GATE_SIZE * Math.sqrt(3) / 2, GATE_SIZE, Math.PI/2 - Math.PI / 6, Math.PI/2 + Math.PI / 6);
    // ctx.lineTo(sx + GATE_SIZE, sy);
    // ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y + GATE_SIZE / 2 + GATE_SIZE / 10, GATE_SIZE / 10, 0, 2*Math.PI);
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
};

/** @param {CanvasRenderingContext2D} ctx */
const drawOrGate = (ctx, x, y, pins) => {
    const sx = x - GATE_SIZE / 2;
    const sy = y - GATE_SIZE / 2;

    if(pins == 1) {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - GATE_SIZE / 2 - GATE_SIZE / 8, y);
        ctx.lineTo(x + GATE_SIZE / 2, y);
        ctx.stroke();
        return;
    }

    ctx.lineWidth = 1;
    for(let i=0;i<pins;i++) {
        ctx.beginPath();
        ctx.moveTo(sx - GATE_SIZE / 8, y - (i - (pins - 1) / 2) * WIRE_GAP);
        if(y - (i - (pins - 1) / 2) * WIRE_GAP < sy || y - (i - (pins - 1) / 2) * WIRE_GAP > sy + GATE_SIZE) {
            ctx.lineTo(sx, y - (i - (pins - 1) / 2) * WIRE_GAP);
            ctx.lineTo(sx, (y - (i - (pins - 1) / 2) * WIRE_GAP < sy) ? sy : sy + GATE_SIZE)
        }
        else
            ctx.lineTo(sx + GATE_SIZE / 8, y - (i - (pins - 1) / 2) * WIRE_GAP);
        ctx.stroke();
    }
    
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + GATE_SIZE * (1 - Math.sqrt(3)/2), sy);
    ctx.arc(sx + GATE_SIZE * (1 - Math.sqrt(3)/2), sy + GATE_SIZE, GATE_SIZE, Math.PI * 3 / 2, Math.PI * 3 / 2 + Math.PI / 3);
    ctx.arc(sx + GATE_SIZE * (1 - Math.sqrt(3)/2), sy, GATE_SIZE, Math.PI / 6, Math.PI / 2);
    ctx.lineTo(sx, sy + GATE_SIZE);
    ctx.arc(sx - GATE_SIZE * Math.sqrt(3) / 2, y, GATE_SIZE, Math.PI / 6, -Math.PI / 6, true);
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
};

/** @param {CanvasRenderingContext2D} ctx */
const drawOrGate2 = (ctx, x, y, pins) => {
    const sx = x - GATE_SIZE / 2;
    const sy = y - GATE_SIZE / 2;

    if(pins == 1) {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - GATE_SIZE / 2 - GATE_SIZE / 8, y);
        ctx.lineTo(x + GATE_SIZE / 2, y);
        ctx.stroke();
        return;
    }

    ctx.lineWidth = 1;
    for(let i=0;i<pins;i++) {
        ctx.beginPath();
        ctx.moveTo(sx - GATE_SIZE / 8, y - (i - (pins - 1) / 2) * WIRE_GAP * 3);
        ctx.lineTo(sx + GATE_SIZE / 8, y - (i - (pins - 1) / 2) * WIRE_GAP * 3);
        ctx.stroke();
    }
    
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + GATE_SIZE * (1 - Math.sqrt(3)/2), sy);
    ctx.arc(sx + GATE_SIZE * (1 - Math.sqrt(3)/2), sy + GATE_SIZE, GATE_SIZE, Math.PI * 3 / 2, Math.PI * 3 / 2 + Math.PI / 3);
    ctx.arc(sx + GATE_SIZE * (1 - Math.sqrt(3)/2), sy, GATE_SIZE, Math.PI / 6, Math.PI / 2);
    ctx.lineTo(sx, sy + GATE_SIZE);
    ctx.arc(sx - GATE_SIZE * Math.sqrt(3) / 2, y, GATE_SIZE, Math.PI / 6, -Math.PI / 6, true);
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
};

/** @param {CanvasRenderingContext2D} ctx */
const drawNorGate = (ctx, x, y, pins, neg) => {
    const sx = x - GATE_SIZE / 2;
    const sy = y - GATE_SIZE / 2;

    if(pins == 1) {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - GATE_SIZE / 2 - GATE_SIZE / 8, y);
        ctx.lineTo(x + GATE_SIZE / 2 + GATE_SIZE / 5, y);
        ctx.stroke();
        return;
    }

    ctx.lineWidth = 1;
    for(let i=0;i<pins;i++) {
        ctx.beginPath();
        ctx.moveTo(sx - GATE_SIZE / 8, y - (i - (pins - 1) / 2) * WIRE_GAP * ( neg ? 1.5 : 1));
        if(y - (i - (pins - 1) / 2) * WIRE_GAP < sy || y - (i - (pins - 1) / 2) * WIRE_GAP > sy + GATE_SIZE) {
            ctx.lineTo(sx, y - (i - (pins - 1) / 2) * WIRE_GAP * ( neg ? 1.5 : 1));
            ctx.lineTo(sx, (y - (i - (pins - 1) / 2) * WIRE_GAP < sy) ? sy : sy + GATE_SIZE)
        }
        else
            ctx.lineTo(sx + GATE_SIZE / 8, y - (i - (pins - 1) / 2) * WIRE_GAP * ( neg ? 1.5 : 1));
        ctx.stroke();
    }
    
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + GATE_SIZE * (1 - Math.sqrt(3)/2), sy);
    ctx.arc(sx + GATE_SIZE * (1 - Math.sqrt(3)/2), sy + GATE_SIZE, GATE_SIZE, Math.PI * 3 / 2, Math.PI * 3 / 2 + Math.PI / 3);
    ctx.arc(sx + GATE_SIZE * (1 - Math.sqrt(3)/2), sy, GATE_SIZE, Math.PI / 6, Math.PI / 2);
    ctx.lineTo(sx, sy + GATE_SIZE);
    ctx.arc(sx - GATE_SIZE * Math.sqrt(3) / 2, y, GATE_SIZE, Math.PI / 6, -Math.PI / 6, true);
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + GATE_SIZE / 2 + GATE_SIZE / 10, y, GATE_SIZE / 10, 0, 2 * Math.PI);

    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
};

/** @param {CanvasRenderingContext2D} ctx */
const drawNorGate2 = (ctx, x, y, pins) => {
    const sx = x - GATE_SIZE / 2;
    const sy = y - GATE_SIZE / 2;

    if(pins == 1) {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - GATE_SIZE / 2 - GATE_SIZE / 8, y);
        ctx.lineTo(x + GATE_SIZE / 2 + GATE_SIZE / 5, y);
        ctx.stroke();
        return;
    }

    ctx.lineWidth = 1;
    for(let i=0;i<pins;i++) {
        ctx.beginPath();
        ctx.moveTo(sx - GATE_SIZE / 8, y - (i - (pins - 1) / 2) * WIRE_GAP * 3);
        ctx.lineTo(sx + GATE_SIZE / 8, y - (i - (pins - 1) / 2) * WIRE_GAP * 3);
        ctx.stroke();
    }
    
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + GATE_SIZE * (1 - Math.sqrt(3)/2), sy);
    ctx.arc(sx + GATE_SIZE * (1 - Math.sqrt(3)/2), sy + GATE_SIZE, GATE_SIZE, Math.PI * 3 / 2, Math.PI * 3 / 2 + Math.PI / 3);
    ctx.arc(sx + GATE_SIZE * (1 - Math.sqrt(3)/2), sy, GATE_SIZE, Math.PI / 6, Math.PI / 2);
    ctx.lineTo(sx, sy + GATE_SIZE);
    ctx.arc(sx - GATE_SIZE * Math.sqrt(3) / 2, y, GATE_SIZE, Math.PI / 6, -Math.PI / 6, true);
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + GATE_SIZE / 2 + GATE_SIZE / 10, y, GATE_SIZE / 10, 0, 2 * Math.PI);

    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
};