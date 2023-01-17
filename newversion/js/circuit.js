import { MinimizedFunction } from "./bools.js";

// Consts
const GATE_SIZE = 40;
const WIRE_GAP = 12;
const WIRE_GAP2 = 20;
const NOT_TOP = 60;
const TEXT_PAD = 30;
const COMP_GAP = 30;

class FunctionCircuit extends MinimizedFunction {
    constructor() {
        super();
    }

    /** @param {CanvasRenderingContext2D} ctx */
    static drawAndGate(ctx, x, y, pins) {
        const sx = x - GATE_SIZE / 2;
        const sy = y - GATE_SIZE / 2;

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
    }

    /** @param {CanvasRenderingContext2D} ctx */
    static drawOrGate(ctx, x, y, pins) {
        const sx = x - GATE_SIZE / 2;
        const sy = y - GATE_SIZE / 2;

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
    }

    /** @param {CanvasRenderingContext2D} ctx */
    static drawNotGate(ctx, x, y, pins) {
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
    }

    /** @param {CanvasRenderingContext2D} ctx */
    static drawAndGate2(ctx, x, y) {
        const sx = x - GATE_SIZE / 2;
        const sy = y - GATE_SIZE / 2;
    
        ctx.lineWidth = 1;
        for(let i=0;i<2;i++) {
            ctx.beginPath();
            ctx.moveTo(sx - GATE_SIZE / 8, y - (i - 1 / 2) * WIRE_GAP * 3);
            ctx.lineTo(sx, y - (i - 1 / 2) * WIRE_GAP * 3);
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
    }

    /** @param {CanvasRenderingContext2D} ctx */
    static drawOrGate2(ctx, x, y) {
        const sx = x - GATE_SIZE / 2;
        const sy = y - GATE_SIZE / 2;
    
        ctx.lineWidth = 1;
        for(let i=0;i<2;i++) {
            ctx.beginPath();
            ctx.moveTo(sx - GATE_SIZE / 8, y - (i - 1 / 2) * WIRE_GAP * 3);
            ctx.lineTo(sx + GATE_SIZE / 8, y - (i - 1 / 2) * WIRE_GAP * 3);
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
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    static renderWiresNormal(canvas, ctx, varsNum, mnf, forRet) {
        // Wires
        let ptx = WIRE_GAP2;

        let newVars = [];
        for(let i=1;i<=varsNum;i++) {
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ptx, TEXT_PAD);
            ctx.lineTo(ptx, canvas.height);
            ctx.stroke();
            const vart = $(`<p>\\[x_${i}\\]</p>`);
            vart[0].style.top = `${-NOT_TOP / 3}px`;
            vart[0].style.left = `${ptx + 5}px`;
            forRet.push(vart);

            newVars.push(`x${i}`);

            if(mnf.some(j => j.some(k => k.name == `x${i}` && k.comp))) {
                ctx.beginPath();
                ctx.moveTo(ptx, TEXT_PAD * 2);
                ptx += WIRE_GAP2 * 1.5;
                ctx.lineTo(ptx, TEXT_PAD + NOT_TOP / 2);
                ctx.lineTo(ptx, canvas.height);
                ctx.stroke();
                newVars.push(`!x${i}`);
                FunctionCircuit.drawNotGate(ctx, ptx, TEXT_PAD + NOT_TOP);
            }
            ptx += WIRE_GAP2 * 1.5;
        }

        return [newVars, ptx];
    }

    getSizeDNF() {
        let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;

        this.mdnf.forEach(prod => pty += Math.max(GATE_SIZE, WIRE_GAP * (prod.length - 1)) + COMP_GAP);

        let ptx = WIRE_GAP2;
        for(let i=1;i<=this.varsNum;i++) {
            if(this.mdnf.some(j => j.some(k => k.name == `x${i}` && k.comp))) {
                ptx += WIRE_GAP2 * 1.5;
            }
            ptx += WIRE_GAP2 * 1.5;
        }
        ptx += (this.mdnf.some(prod => prod.length > 1) ? GATE_SIZE / 2 : 0) + COMP_GAP + this.mdnf.length * WIRE_GAP + (this.mdnf.length > 1 ? GATE_SIZE * 3 / 2 : 0) + COMP_GAP;

        return {
            width: ptx,
            height: pty
        };
    }

    /** 
     * @param {HTMLCanvasElement} canvas
     * */
    renderDNF(canvas) {
        let forRet = [];
        const ctx = canvas.getContext('2d');

        // Wires
        let [newVars, ptx] = FunctionCircuit.renderWiresNormal(canvas, ctx, this.varsNum, this.mdnf, forRet);

        let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;
        ptx += COMP_GAP;
        let firstComps = [];
        let tx = ptx;

        this.mdnf.forEach(prod => {
            if(prod.length > 1) {
                let sizeH = Math.max(GATE_SIZE, WIRE_GAP * (prod.length - 1));

                FunctionCircuit.drawAndGate(ctx, ptx, pty + sizeH / 2, prod.length);
                firstComps.push({ x: ptx + GATE_SIZE / 2, y: pty + sizeH / 2 });
                tx = ptx + GATE_SIZE / 2;

                prod.forEach((vi, vind) => {
                    let vname = (vi.comp ? '!':'') + vi.name;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 1.5 * newVars.indexOf(vname), pty + sizeH / 2 - (vind - (prod.length - 1) / 2) * WIRE_GAP );
                    ctx.lineTo(ptx - GATE_SIZE * 5 / 8, pty + sizeH / 2 - (vind - (prod.length - 1) / 2) * WIRE_GAP );
                    ctx.stroke();
                });

                pty += sizeH + COMP_GAP;
            }
            else {
                firstComps.push({ x: ptx, y: pty + GATE_SIZE / 2 });

                prod.forEach((vi, vind) => {
                    let vname = (vi.comp ? '!':'') + vi.name;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 1.5 * newVars.indexOf(vname), pty + GATE_SIZE / 2);
                    ctx.lineTo(ptx, pty + GATE_SIZE / 2);
                    ctx.stroke();
                });

                pty += GATE_SIZE + COMP_GAP;
            }
        });

        tx += COMP_GAP + this.mdnf.length * WIRE_GAP;

        let ty = (firstComps[0].y + firstComps[firstComps.length - 1].y) / 2;
        if(this.mdnf.length > 1) {
            FunctionCircuit.drawOrGate(ctx, tx, ty, this.mdnf.length);

            firstComps.forEach((i, ind) => {
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.moveTo(i.x, i.y);
                let pt = Math.min(ind, this.mdnf.length - ind - 1);
                ctx.lineTo(tx - GATE_SIZE - pt * WIRE_GAP, i.y);
                ctx.lineTo(tx - GATE_SIZE - pt * WIRE_GAP, ty + (ind - (this.mdnf.length - 1) / 2) * WIRE_GAP);
                ctx.lineTo(tx - GATE_SIZE * 5 / 8, ty + (ind - (this.mdnf.length - 1) / 2) * WIRE_GAP);
                ctx.stroke();
            });

            ctx.beginPath();
            ctx.moveTo(tx + GATE_SIZE / 2, ty);
            ctx.lineTo(tx + GATE_SIZE * 3 / 2, ty);
            ctx.stroke();

            const rest = $("<p>\\[f\\]</p>");
            rest[0].style.top = `${ty - NOT_TOP + 5}px`;
            rest[0].style.left = `${tx + GATE_SIZE * 3 / 2}px`;

            forRet.push(rest);
        }
        else {
            firstComps.forEach((i, ind) => {
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.moveTo(i.x, i.y);
                let pt = Math.min(ind, this.mdnf.length - ind - 1);
                ctx.lineTo(tx - GATE_SIZE - pt * WIRE_GAP, i.y);
                ctx.lineTo(tx - GATE_SIZE - pt * WIRE_GAP, ty);
                ctx.lineTo(tx, ty);
                ctx.stroke();
            });

            const rest = $("<p>\\[f\\]</p>");
            rest[0].style.top = `${ty - NOT_TOP + 5}px`;
            rest[0].style.left = `${tx}px`;

            forRet.push(rest);
        }

        return forRet;
    }

    getSizeKNF() {
        let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;

        this.mknf.forEach(prod => pty += Math.max(GATE_SIZE, WIRE_GAP * (prod.length - 1)) + COMP_GAP);

        let ptx = WIRE_GAP2;
        for(let i=1;i<=this.varsNum;i++) {
            if(this.mknf.some(j => j.some(k => k.name == `x${i}` && k.comp))) {
                ptx += WIRE_GAP2 * 1.5;
            }
            ptx += WIRE_GAP2 * 1.5;
        }
        ptx += (this.mknf.some(prod => prod.length > 1) ? GATE_SIZE / 2 : 0) + COMP_GAP + this.mknf.length * WIRE_GAP + (this.mknf.length > 1 ? GATE_SIZE * 3 / 2 : 0) + COMP_GAP;

        return {
            width: ptx,
            height: pty
        };
    }

    /** 
     * @param {HTMLCanvasElement} canvas
     * */
    renderKNF(canvas) {
        let forRet = [];
        const ctx = canvas.getContext('2d');

        // Wires

        let [newVars, ptx] = FunctionCircuit.renderWiresNormal(canvas, ctx, this.varsNum, this.mknf, forRet);

        let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;
        ptx += COMP_GAP;
        let firstComps = [];
        let tx = ptx;

        this.mknf.forEach(prod => {
            if(prod.length > 1) {
                let sizeH = Math.max(GATE_SIZE, WIRE_GAP * (prod.length - 1));

                FunctionCircuit.drawOrGate(ctx, ptx, pty + sizeH / 2, prod.length);
                firstComps.push({ x: ptx + GATE_SIZE / 2, y: pty + sizeH / 2 });
                tx = ptx + GATE_SIZE / 2;

                prod.forEach((vi, vind) => {
                    let vname = (vi.comp ? '!':'') + vi.name;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 1.5 * newVars.indexOf(vname), pty + sizeH / 2 - (vind - (prod.length - 1) / 2) * WIRE_GAP );
                    ctx.lineTo(ptx - GATE_SIZE * 5 / 8, pty + sizeH / 2 - (vind - (prod.length - 1) / 2) * WIRE_GAP );
                    ctx.stroke();
                });

                pty += sizeH + COMP_GAP;
            }
            else {
                firstComps.push({ x: ptx, y: pty + GATE_SIZE / 2 });

                prod.forEach((vi, vind) => {
                    let vname = (vi.comp ? '!':'') + vi.name;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 1.5 * newVars.indexOf(vname), pty + GATE_SIZE / 2);
                    ctx.lineTo(ptx, pty + GATE_SIZE / 2);
                    ctx.stroke();
                });

                pty += GATE_SIZE + COMP_GAP;
            }
        });

        tx += COMP_GAP + this.mknf.length * WIRE_GAP;

        let ty = (firstComps[0].y + firstComps[firstComps.length - 1].y) / 2;
        if(this.mknf.length > 1) {
            FunctionCircuit.drawAndGate(ctx, tx, ty, this.mknf.length);

            firstComps.forEach((i, ind) => {
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.moveTo(i.x, i.y);
                let pt = Math.min(ind, this.mknf.length - ind - 1);
                ctx.lineTo(tx - GATE_SIZE - pt * WIRE_GAP, i.y);
                ctx.lineTo(tx - GATE_SIZE - pt * WIRE_GAP, ty + (ind - (this.mknf.length - 1) / 2) * WIRE_GAP);
                ctx.lineTo(tx - GATE_SIZE * 5 / 8, ty + (ind - (this.mknf.length - 1) / 2) * WIRE_GAP);
                ctx.stroke();
            });

            ctx.beginPath();
            ctx.moveTo(tx + GATE_SIZE / 2, ty);
            ctx.lineTo(tx + GATE_SIZE * 3 / 2, ty);
            ctx.stroke();

            const rest = $("<p>\\[f\\]</p>");
            rest[0].style.top = `${ty - NOT_TOP + 5}px`;
            rest[0].style.left = `${tx + GATE_SIZE * 3 / 2}px`;

            forRet.push(rest);
        }
        else {
            firstComps.forEach((i, ind) => {
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.moveTo(i.x, i.y);
                let pt = Math.min(ind, this.mknf.length - ind - 1);
                ctx.lineTo(tx - GATE_SIZE - pt * WIRE_GAP, i.y);
                ctx.lineTo(tx - GATE_SIZE - pt * WIRE_GAP, ty);
                ctx.lineTo(tx, ty);
                ctx.stroke();
            });

            const rest = $("<p>\\[f\\]</p>");
            rest[0].style.top = `${ty - NOT_TOP + 5}px`;
            rest[0].style.left = `${tx}px`;

            forRet.push(rest);
        }

        return forRet;
    }

    getSizeDNF2() {
        let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;

        this.mdnf.forEach(prod => pty += WIRE_GAP * 3 * (prod.length - 1) + COMP_GAP);
        pty += COMP_GAP / 2;

        let ptx = WIRE_GAP2;
        for(let i=1;i<=this.varsNum;i++) {
            if(this.mdnf.some(j => j.some(k => k.name == `x${i}` && k.comp))) {
                ptx += WIRE_GAP2 * 1.5;
            }
            ptx += WIRE_GAP2 * 1.5;
        }
        ptx += COMP_GAP + GATE_SIZE * ( 2 * Math.max(...this.mdnf.map(i => Math.ceil(Math.log2(i.length)))) - 1);
        ptx += COMP_GAP * 2 + GATE_SIZE * ( 2 * Math.ceil(Math.log2(this.mdnf.length)) - 1) + GATE_SIZE * 3 / 2;

        return {
            width: ptx,
            height: pty
        }
    }

    /** 
     * @param {HTMLCanvasElement} canvas
     * */
    renderDNF2(canvas) {
        let forRet = [];
        const ctx = canvas.getContext('2d');

        // Wires
        let [newVars, ptx] = FunctionCircuit.renderWiresNormal(canvas, ctx, this.varsNum, this.mdnf, forRet);

        let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;
        
        const getAndRec1 = (dnf) => {
            if(dnf.length > 1) {
                let mid = Math.floor(dnf.length / 2);
                let pos1 = getAndRec1(dnf.slice(0, mid)); 
                let pos2 = getAndRec1(dnf.slice(mid));
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

                FunctionCircuit.drawAndGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
                return { x: Math.max(pos1.x, pos2.x) + (COMP_GAP + GATE_SIZE), y: (pos1.y + pos2.y) / 2 };
            }

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ptx - GATE_SIZE / 8, pty);
            ctx.lineTo(ptx, pty);
            ctx.stroke();

            let vname = (dnf[0].comp ? '!':'') + dnf[0].name;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 1.5 * newVars.indexOf(vname), pty );
            ctx.lineTo(ptx - GATE_SIZE / 8, pty );
            ctx.stroke();

            pty += WIRE_GAP * 3;
            return { x: ptx, y: pty - WIRE_GAP * 3 };
        }
    
        const getOrRec1 = (dnf) => {
            if(dnf.length > 1) {
                let mid = Math.floor(dnf.length / 2);

                let pos1 = getOrRec1(dnf.slice(0, mid)); 
                let pos2 = getOrRec1(dnf.slice(mid));

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

                FunctionCircuit.drawOrGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
                return { x: Math.max(pos1.x, pos2.x) + (COMP_GAP + GATE_SIZE), y: (pos1.y + pos2.y) / 2 };
            }
            return getAndRec1(dnf[0]);
        };

        let pos = getOrRec1(this.mdnf);

        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x + GATE_SIZE * 2, pos.y);
        ctx.stroke();

        const rest = $(`<p>\\[f\\]</p>`);
        rest[0].style.top = `${pos.y - NOT_TOP + 5}px`;
        rest[0].style.left = `${pos.x + GATE_SIZE * 3 / 2}px`;
        forRet.push(rest);

        return forRet;
    }

    getSizeKNF2() {
        let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;

        this.mknf.forEach(prod => pty += WIRE_GAP * 3 * (prod.length - 1) + COMP_GAP);
        pty += COMP_GAP / 2;

        let ptx = WIRE_GAP2;
        for(let i=1;i<=this.varsNum;i++) {
            if(this.mknf.some(j => j.some(k => k.name == `x${i}` && k.comp))) {
                ptx += WIRE_GAP2 * 1.5;
            }
            ptx += WIRE_GAP2 * 1.5;
        }
        ptx += COMP_GAP + GATE_SIZE * ( 2 * Math.max(...this.mknf.map(i => Math.ceil(Math.log2(i.length)))) - 1);
        ptx += COMP_GAP * 2 + GATE_SIZE * ( 2 * Math.ceil(Math.log2(this.mknf.length)) - 1) + GATE_SIZE * 3 / 2;

        return {
            width: ptx,
            height: pty
        }
    }

    /** 
     * @param {HTMLCanvasElement} canvas
     * */
    renderKNF2(canvas) {
        let forRet = [];
        const ctx = canvas.getContext('2d');

        // Wires
        let [newVars, ptx] = FunctionCircuit.renderWiresNormal(canvas, ctx, this.varsNum, this.mdnf, forRet);

        let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;
        
        const getOrRec1 = (dnf) => {
            if(dnf.length > 1) {
                let mid = Math.floor(dnf.length / 2);
                let pos1 = getOrRec1(dnf.slice(0, mid)); 
                let pos2 = getOrRec1(dnf.slice(mid));
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

                FunctionCircuit.drawOrGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
                return { x: Math.max(pos1.x, pos2.x) + (COMP_GAP + GATE_SIZE), y: (pos1.y + pos2.y) / 2 };
            }

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ptx - GATE_SIZE / 8, pty);
            ctx.lineTo(ptx, pty);
            ctx.stroke();

            let vname = (dnf[0].comp ? '!':'') + dnf[0].name;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 1.5 * newVars.indexOf(vname), pty );
            ctx.lineTo(ptx - GATE_SIZE / 8, pty );
            ctx.stroke();

            pty += WIRE_GAP * 3;
            return { x: ptx, y: pty - WIRE_GAP * 3 };
        }
    
        const getAndRec1 = (dnf) => {
            if(dnf.length > 1) {
                let mid = Math.floor(dnf.length / 2);

                let pos1 = getAndRec1(dnf.slice(0, mid)); 
                let pos2 = getAndRec1(dnf.slice(mid));

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

                FunctionCircuit.drawAndGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
                return { x: Math.max(pos1.x, pos2.x) + (COMP_GAP + GATE_SIZE), y: (pos1.y + pos2.y) / 2 };
            }
            return getOrRec1(dnf[0]);
        };

        let pos = getAndRec1(this.mknf);

        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x + GATE_SIZE * 2, pos.y);
        ctx.stroke();

        const rest = $(`<p>\\[f\\]</p>`);
        rest[0].style.top = `${pos.y - NOT_TOP + 5}px`;
        rest[0].style.left = `${pos.x + GATE_SIZE * 3 / 2}px`;
        forRet.push(rest);

        return forRet;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    /** @param {CanvasRenderingContext2D} ctx */
    static drawNandGate(ctx, x, y, pins, neg) {
        const sx = x - GATE_SIZE / 2;
        const sy = y - GATE_SIZE / 2;

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
    static drawNorGate(ctx, x, y, pins, neg) {
        const sx = x - GATE_SIZE / 2;
        const sy = y - GATE_SIZE / 2;

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
    }

    static drawNotNand(ctx, x, y) {
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
    }

    static drawNotNor(ctx, x, y) {
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
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.fill();
    
        ctx.beginPath();
        ctx.arc(x, y + GATE_SIZE / 2 + GATE_SIZE / 10, GATE_SIZE / 10, 0, 2*Math.PI);
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    /** @param {CanvasRenderingContext2D} ctx */
    static drawNandGate2(ctx, x, y) {
        const sx = x - GATE_SIZE / 2;
        const sy = y - GATE_SIZE / 2;
    
        ctx.lineWidth = 1;
        for(let i=0;i<2;i++) {
            ctx.beginPath();
            ctx.moveTo(sx - GATE_SIZE / 8, y - (i - 1 / 2) * WIRE_GAP * 3);
            ctx.lineTo(sx, y - (i - 1 / 2) * WIRE_GAP * 3);
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
    }

    /** @param {CanvasRenderingContext2D} ctx */
    static drawNorGate2(ctx, x, y) {
        const sx = x - GATE_SIZE / 2;
        const sy = y - GATE_SIZE / 2;

        ctx.lineWidth = 1;
        for(let i=0;i<2;i++) {
            ctx.beginPath();
            ctx.moveTo(sx - GATE_SIZE / 8, y - (i - 1 / 2) * WIRE_GAP * 3);
            ctx.lineTo(sx + GATE_SIZE / 8, y - (i - 1 / 2) * WIRE_GAP * 3);
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
    }

    static renderWiresNotNormal(canvas, ctx, varsNum, mnf, forRet, drawMethod) {
        let ptx = WIRE_GAP2;
        let newVars = [];
        for(let i=1;i<=varsNum;i++) {
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ptx, TEXT_PAD);
            ctx.lineTo(ptx, canvas.height);
            ctx.stroke();

            const vart = $(`<p>\\[x_${i}\\]</p>`);
            vart[0].style.top = `${-NOT_TOP / 3}px`;
            vart[0].style.left = `${ptx + 5}px`;
            forRet.push(vart);

            newVars.push(`x${i}`);
            if(mnf.some(j => j.some(k => k.name == `x${i}` && k.comp))) {
                ctx.moveTo(ptx, TEXT_PAD + 30);
                ptx += WIRE_GAP2 * 2;
                ctx.lineTo(ptx, TEXT_PAD + NOT_TOP / 2);
                ctx.lineTo(ptx, TEXT_PAD + NOT_TOP * 0.7);
                ctx.lineTo(ptx + GATE_SIZE / 4, TEXT_PAD + NOT_TOP * 0.7);
                ctx.lineTo(ptx + GATE_SIZE / 4, TEXT_PAD + NOT_TOP * 1.3);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(ptx, TEXT_PAD + NOT_TOP * 0.7);
                ctx.lineTo(ptx - GATE_SIZE / 4, TEXT_PAD + NOT_TOP * 0.7);
                ctx.lineTo(ptx - GATE_SIZE / 4, TEXT_PAD + NOT_TOP * 1.3);
                ctx.stroke();
                drawMethod(ctx, ptx, TEXT_PAD + NOT_TOP * 1.2);

                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(ptx, TEXT_PAD + NOT_TOP * 1.2 + GATE_SIZE / 2 + GATE_SIZE / 5);
                ctx.lineTo(ptx, canvas.height);
                ctx.stroke();

                newVars.push(`!x${i}`);
            } else {
                ctx.stroke();
            }
            ptx += WIRE_GAP2 * 2;
        }

        return [newVars, ptx];
    }

    getSizeNandDNF() {
        let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;

        let ndnf = [];

        if(this.mdnf.length == 1 && this.mdnf[0].length == 1) {
            ndnf = this.mdnf.slice();
        }
        else {
            ndnf = this.mdnf.map(i => {
                if(i.length > 1) return i;
                return i.map(j => {
                    return { name: j.name, comp: !j.comp };
                }); 
            });
        }

        ndnf.forEach(prod => pty += Math.max(GATE_SIZE, WIRE_GAP * (prod.length - 1)) + COMP_GAP);

        let ptx = WIRE_GAP2;
        for(let i=1;i<=this.varsNum;i++) {
            if(ndnf.some(j => j.some(k => k.name == `x${i}` && k.comp))) {
                ptx += WIRE_GAP2 * 2;
            }
            ptx += WIRE_GAP2 * 2;
        }
        ptx += (ndnf.some(prod => prod.length > 1) ? GATE_SIZE / 2 : 0) + COMP_GAP + ndnf.length * WIRE_GAP + (ndnf.length > 1 ? GATE_SIZE * 3 / 2 : 0) + COMP_GAP;
        ptx += (ndnf.length == 1 && ndnf[0].length > 1) ? GATE_SIZE * 5 / 2 : 0;

        return {
            width: ptx,
            height: pty
        };
    }

    getNandMinimalDNF() {
        const res = [];

        let mdnf = `f(${Array.from(Array(this.varsNum).keys()).map(i => `x_${i+1}`).join(',')}) =`;
        mdnf += this.mdnf.map(im => {
            return im.map(i => {
                if(i.comp) return `\\overline{${i.name[0]}_{${i.name.slice(1)}}}`;
                else return `${i.name[0]}_{${i.name.slice(1)}}`;
            }).join('\\cdot ');
        }).join('+');

        if(this.mdnf.length != 1 || this.mdnf[0].length != 1) {
            mdnf += ' = ';
            res.push($(`<p>\\[${mdnf}\\]</p>`));

            mdnf = ` = \\overline{\\overline{${this.mdnf.map(im => {
                return im.map(i => {
                    if(i.comp) return `\\overline{${i.name[0]}_{${i.name.slice(1)}}}`;
                    else return `${i.name[0]}_{${i.name.slice(1)}}`;
                }).join('\\cdot ');
            }).join('+')}}}`;
            
            if(this.mdnf.length > 1) {
                mdnf += ' = ';
                res.push($(`<p>\\[${mdnf}\\]</p>`));

                mdnf = ` = \\overline{${this.mdnf.map(im => {
                    if(im.length > 1) return `\\overline{${im.map(i => {
                        if(i.comp) return `\\overline{${i.name[0]}_{${i.name.slice(1)}}}`;
                        else return `${i.name[0]}_{${i.name.slice(1)}}`;
                    }).join('\\cdot ')}}`;
                    else return im.map(i => {
                        if(i.comp) return `${i.name[0]}_{${i.name.slice(1)}}`;
                        else return `\\overline{${i.name[0]}_{${i.name.slice(1)}}}`;
                    }).join('\\cdot ');
                }).join('\\cdot ')}}`;

                res.push($(`<p>\\[${mdnf}\\]</p>`));
            }
            else {
                res.push($(`<p>\\[${mdnf}\\]</p>`));
            }
        } else {
            res.push($(`<p>\\[${mdnf}\\]</p>`));
        }

        return res;
    }

    /** 
     * @param {HTMLCanvasElement} canvas
     * */
    renderNandDNF(canvas) {
        let forRet = [];
        const ctx = canvas.getContext('2d');

        let ndnf = [];

        if(this.mdnf.length == 1 && this.mdnf[0].length == 1) {
            ndnf = this.mdnf.slice();
        }
        else {
            ndnf = this.mdnf.map(i => {
                if(i.length > 1) return i;
                return i.map(j => {
                    return { name: j.name, comp: !j.comp };
                }); 
            });
        }

        // Wires
        let [newVars, ptx] = FunctionCircuit.renderWiresNotNormal(canvas, ctx, this.varsNum, ndnf, forRet, FunctionCircuit.drawNotNand);

        let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;
        ptx += COMP_GAP;
        let firstComps = [];
        let tx = ptx;

        ndnf.forEach(prod => {
            if(prod.length > 1) {
                let sizeH = Math.max(GATE_SIZE, WIRE_GAP * (prod.length - 1));

                FunctionCircuit.drawNandGate(ctx, ptx, pty + sizeH / 2, prod.length);
                firstComps.push({ x: ptx + GATE_SIZE / 2 + GATE_SIZE / 5, y: pty + sizeH / 2 });
                tx = ptx + GATE_SIZE / 2;

                prod.forEach((vi, vind) => {
                    let vname = (vi.comp ? '!':'') + vi.name;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 2 * newVars.indexOf(vname), pty + sizeH / 2 - (vind - (prod.length - 1) / 2) * WIRE_GAP );
                    ctx.lineTo(ptx - GATE_SIZE * 5 / 8, pty + sizeH / 2 - (vind - (prod.length - 1) / 2) * WIRE_GAP );
                    ctx.stroke();
                });

                pty += sizeH + COMP_GAP;
            }
            else {
                firstComps.push({ x: ptx, y: pty + GATE_SIZE / 2 });

                prod.forEach((vi, vind) => {
                    let vname = (vi.comp ? '!':'') + vi.name;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 2 * newVars.indexOf(vname), pty + GATE_SIZE / 2);
                    ctx.lineTo(ptx, pty + GATE_SIZE / 2);
                    ctx.stroke();
                });

                pty += GATE_SIZE + COMP_GAP;
            }
        });

        tx += COMP_GAP + ndnf.length * WIRE_GAP;

        let ty = (firstComps[0].y + firstComps[firstComps.length - 1].y) / 2;
        if(ndnf.length > 1) {
            FunctionCircuit.drawNandGate(ctx, tx, ty, ndnf.length);

            firstComps.forEach((i, ind) => {
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.moveTo(i.x, i.y);
                let pt = Math.min(ind, ndnf.length - ind - 1);
                ctx.lineTo(tx - GATE_SIZE - pt * WIRE_GAP, i.y);
                ctx.lineTo(tx - GATE_SIZE - pt * WIRE_GAP, ty + (ind - (ndnf.length - 1) / 2) * WIRE_GAP);
                ctx.lineTo(tx - GATE_SIZE * 5 / 8, ty + (ind - (ndnf.length - 1) / 2) * WIRE_GAP);
                ctx.stroke();
            });

            ctx.beginPath();
            ctx.moveTo(tx + GATE_SIZE / 2 + GATE_SIZE / 5, ty);
            ctx.lineTo(tx + GATE_SIZE * 3 / 2, ty);
            ctx.stroke();

            const rest = $("<p>\\[f\\]</p>");
            rest[0].style.top = `${ty - NOT_TOP + 5}px`;
            rest[0].style.left = `${tx + GATE_SIZE * 3 / 2}px`;

            forRet.push(rest);
        }
        else {
            if(ndnf[0].length > 1) {
                tx += COMP_GAP;
                FunctionCircuit.drawNandGate(ctx, tx, ty, 2, true);

                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(firstComps[0].x, firstComps[0].y);
                ctx.lineTo((firstComps[0].x + tx - GATE_SIZE / 2) / 2, firstComps[0].y);
                ctx.lineTo((firstComps[0].x + tx - GATE_SIZE / 2) / 2, firstComps[0].y - WIRE_GAP * 1.5 / 2);
                ctx.lineTo(tx - GATE_SIZE * 5 / 8, firstComps[0].y - WIRE_GAP * 1.5 / 2);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo((firstComps[0].x + tx - GATE_SIZE / 2) / 2, firstComps[0].y);
                ctx.lineTo((firstComps[0].x + tx - GATE_SIZE / 2) / 2, firstComps[0].y + WIRE_GAP * 1.5 / 2);
                ctx.lineTo(tx - GATE_SIZE * 5 / 8, firstComps[0].y + WIRE_GAP * 1.5 / 2);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(tx + GATE_SIZE / 2 + GATE_SIZE / 5, ty);
                tx += GATE_SIZE * 3 / 2 + GATE_SIZE / 8;
                ctx.lineTo(tx, ty);
                ctx.stroke();
            }
            else {
                firstComps.forEach((i, ind) => {
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.moveTo(i.x, i.y);
                    let pt = Math.min(ind, ndnf.length - ind - 1);
                    ctx.lineTo(tx - GATE_SIZE - pt * WIRE_GAP, i.y);
                    ctx.lineTo(tx - GATE_SIZE - pt * WIRE_GAP, ty);
                    ctx.lineTo(tx, ty);
                    ctx.stroke();
                });
            }

            const rest = $("<p>\\[f\\]</p>");
            rest[0].style.top = `${ty - NOT_TOP + 5}px`;
            rest[0].style.left = `${tx}px`;

            forRet.push(rest);
        }

        return forRet;
    }

    getSizeNorKNF() {
        let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;

        let ndnf = [];

        if(this.mknf.length == 1 && this.mknf[0].length == 1) {
            ndnf = this.mknf.slice();
        }
        else {
            ndnf = this.mknf.map(i => {
                if(i.length > 1) return i;
                return i.map(j => {
                    return { name: j.name, comp: !j.comp };
                }); 
            });
        }

        ndnf.forEach(prod => pty += Math.max(GATE_SIZE, WIRE_GAP * (prod.length - 1)) + COMP_GAP);

        let ptx = WIRE_GAP2;
        for(let i=1;i<=this.varsNum;i++) {
            if(ndnf.some(j => j.some(k => k.name == `x${i}` && k.comp))) {
                ptx += WIRE_GAP2 * 2;
            }
            ptx += WIRE_GAP2 * 2;
        }
        ptx += (ndnf.some(prod => prod.length > 1) ? GATE_SIZE / 2 : 0) + COMP_GAP + ndnf.length * WIRE_GAP + (ndnf.length > 1 ? GATE_SIZE * 3 / 2 : 0) + COMP_GAP;
        ptx += (ndnf.length == 1 && ndnf[0].length > 1) ? GATE_SIZE * 5 / 2 : 0;

        return {
            width: ptx,
            height: pty
        };
    }

    getNorMinimalKNF() {
        const res = [];

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

        if(this.mknf.length != 1 || this.mknf[0].length != 1) {
            mknf += ' = ';
            res.push($(`<p>\\[${mknf}\\]</p>`));

            mknf = ` = \\overline{\\overline{${this.mknf.map(im => {
                if(im.length > 1) return '(' + im.map(i => {
                    if(i.comp) return `\\overline{${i.name[0]}_{${i.name.slice(1)}}}`;
                    else return `${i.name[0]}_{${i.name.slice(1)}}`;
                }).join('+ ') + ')';
                else {
                    if(im[0].comp) return `\\overline{${im[0].name[0]}_{${im[0].name.slice(1)}}}`;
                    else return `${im[0].name[0]}_{${im[0].name.slice(1)}}`;
                }
            }).join('\\cdot ')}}}`;

            if(this.mknf.length > 1) {
                mknf += ' = ';
                res.push($(`<p>\\[${mknf}\\]</p>`));

                mknf = ` = \\overline{${this.mknf.map(im => {
                    if(im.length > 1) return `\\overline{${im.map(i => {
                        if(i.comp) return `\\overline{${i.name[0]}_{${i.name.slice(1)}}}`;
                        else return `${i.name[0]}_{${i.name.slice(1)}}`;
                    }).join('+')}}`;
                    else return im.map(i => {
                        if(i.comp) return `${i.name[0]}_{${i.name.slice(1)}}`;
                        else return `\\overline{${i.name[0]}_{${i.name.slice(1)}}}`;
                    }).join('+');
                }).join('+')}}`;

                res.push($(`<p>\\[${mknf}\\]</p>`));
            }
            else {
                res.push($(`<p>\\[${mknf}\\]</p>`));
            }
        }
        else {
            res.push($(`<p>\\[${mknf}\\]</p>`));
        }

        return res;
    }

    /** 
     * @param {HTMLCanvasElement} canvas
     * */
    renderNorKNF(canvas) {
        let forRet = [];
        const ctx = canvas.getContext('2d');

        let ndnf = [];

        if(this.mknf.length == 1 && this.mknf[0].length == 1) {
            ndnf = this.mknf.slice();
        }
        else {
            ndnf = this.mknf.map(i => {
                if(i.length > 1) return i;
                return i.map(j => {
                    return { name: j.name, comp: !j.comp };
                }); 
            });
        }

        // Wires
        let [newVars, ptx] = FunctionCircuit.renderWiresNotNormal(canvas, ctx, this.varsNum, ndnf, forRet, FunctionCircuit.drawNotNor);

        let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;
        ptx += COMP_GAP;
        let firstComps = [];
        let tx = ptx;

        ndnf.forEach(prod => {
            if(prod.length > 1) {
                let sizeH = Math.max(GATE_SIZE, WIRE_GAP * (prod.length - 1));

                FunctionCircuit.drawNorGate(ctx, ptx, pty + sizeH / 2, prod.length);
                firstComps.push({ x: ptx + GATE_SIZE / 2 + GATE_SIZE / 5, y: pty + sizeH / 2 });
                tx = ptx + GATE_SIZE / 2;

                prod.forEach((vi, vind) => {
                    let vname = (vi.comp ? '!':'') + vi.name;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 2 * newVars.indexOf(vname), pty + sizeH / 2 - (vind - (prod.length - 1) / 2) * WIRE_GAP );
                    ctx.lineTo(ptx - GATE_SIZE * 5 / 8, pty + sizeH / 2 - (vind - (prod.length - 1) / 2) * WIRE_GAP );
                    ctx.stroke();
                });

                pty += sizeH + COMP_GAP;
            }
            else {
                firstComps.push({ x: ptx, y: pty + GATE_SIZE / 2 });

                prod.forEach((vi, vind) => {
                    let vname = (vi.comp ? '!':'') + vi.name;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 2 * newVars.indexOf(vname), pty + GATE_SIZE / 2);
                    ctx.lineTo(ptx, pty + GATE_SIZE / 2);
                    ctx.stroke();
                });

                pty += GATE_SIZE + COMP_GAP;
            }
        });

        tx += COMP_GAP + ndnf.length * WIRE_GAP;

        let ty = (firstComps[0].y + firstComps[firstComps.length - 1].y) / 2;
        if(ndnf.length > 1) {
            FunctionCircuit.drawNorGate(ctx, tx, ty, ndnf.length);

            firstComps.forEach((i, ind) => {
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.moveTo(i.x, i.y);
                let pt = Math.min(ind, ndnf.length - ind - 1);
                ctx.lineTo(tx - GATE_SIZE - pt * WIRE_GAP, i.y);
                ctx.lineTo(tx - GATE_SIZE - pt * WIRE_GAP, ty + (ind - (ndnf.length - 1) / 2) * WIRE_GAP);
                ctx.lineTo(tx - GATE_SIZE * 5 / 8, ty + (ind - (ndnf.length - 1) / 2) * WIRE_GAP);
                ctx.stroke();
            });

            ctx.beginPath();
            ctx.moveTo(tx + GATE_SIZE / 2 + GATE_SIZE / 5, ty);
            ctx.lineTo(tx + GATE_SIZE * 3 / 2, ty);
            ctx.stroke();

            const rest = $("<p>\\[f\\]</p>");
            rest[0].style.top = `${ty - NOT_TOP + 5}px`;
            rest[0].style.left = `${tx + GATE_SIZE * 3 / 2}px`;

            forRet.push(rest);
        }
        else {
            if(ndnf[0].length > 1) {
                tx += COMP_GAP;
                FunctionCircuit.drawNorGate(ctx, tx, ty, 2, true);

                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(firstComps[0].x, firstComps[0].y);
                ctx.lineTo((firstComps[0].x + tx - GATE_SIZE / 2) / 2, firstComps[0].y);
                ctx.lineTo((firstComps[0].x + tx - GATE_SIZE / 2) / 2, firstComps[0].y - WIRE_GAP * 1.5 / 2);
                ctx.lineTo(tx - GATE_SIZE * 5 / 8, firstComps[0].y - WIRE_GAP * 1.5 / 2);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo((firstComps[0].x + tx - GATE_SIZE / 2) / 2, firstComps[0].y);
                ctx.lineTo((firstComps[0].x + tx - GATE_SIZE / 2) / 2, firstComps[0].y + WIRE_GAP * 1.5 / 2);
                ctx.lineTo(tx - GATE_SIZE * 5 / 8, firstComps[0].y + WIRE_GAP * 1.5 / 2);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(tx + GATE_SIZE / 2 + GATE_SIZE / 5, ty);
                tx += GATE_SIZE * 3 / 2 + GATE_SIZE / 8;
                ctx.lineTo(tx, ty);
                ctx.stroke();
            }
            else {
                firstComps.forEach((i, ind) => {
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.moveTo(i.x, i.y);
                    let pt = Math.min(ind, ndnf.length - ind - 1);
                    ctx.lineTo(tx - GATE_SIZE - pt * WIRE_GAP, i.y);
                    ctx.lineTo(tx - GATE_SIZE - pt * WIRE_GAP, ty);
                    ctx.lineTo(tx, ty);
                    ctx.stroke();
                });
            }

            const rest = $("<p>\\[f\\]</p>");
            rest[0].style.top = `${ty - NOT_TOP + 5}px`;
            rest[0].style.left = `${tx}px`;

            forRet.push(rest);
        }

        return forRet;
    }

    getSizeNandDNF2() {
        let ndnf = [];

        if(this.mdnf.length == 1 && this.mdnf[0].length == 1) {
            ndnf = this.mdnf.slice();
        }
        else {
            ndnf = this.mdnf.map(i => {
                if(i.length > 1) return i;
                return i.map(j => {
                    return { name: j.name, comp: !j.comp };
                }); 
            });
        }

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

        const height = TEXT_PAD + NOT_TOP * 1.2 + GATE_SIZE + COMP_GAP + ndnf.map(i => {
            return i.length
        }).reduce((a,b) => a + b, 0) * WIRE_GAP * 3;

        const mid2 = Math.floor(ndnf.length / 2);
        let width;
        if(ndnf.length > 1) width = WIRE_GAP2 + Math.max(getSizeRec1(ndnf.slice(0, mid2)), getSizeRec1(ndnf.slice(mid2))) + (COMP_GAP + GATE_SIZE * 6 / 5) * 2;
        else width = WIRE_GAP2 + getSizeRec2(ndnf[0]) + GATE_SIZE;
    
        for(let i=1;i<=this.varsNum;i++) {
            if(ndnf.some(j => j.some(k => k.name == `x${i}` && k.comp))) {
                width += WIRE_GAP2 * 2;
            }
            width += WIRE_GAP2 * 2;
        }

        return {
            width, height
        };
    }

    getNandMinimalDNF2() {
        const res = [];

        let ndnf = [];

        if(this.mdnf.length == 1 && this.mdnf[0].length == 1) {
            ndnf = this.mdnf.slice();
        }
        else {
            ndnf = this.mdnf.map(i => {
                if(i.length > 1) return i;
                return i.map(j => {
                    return { name: j.name, comp: !j.comp };
                }); 
            });
        }

        const getNandRecs2 = (dnf) => {
            if(dnf.length > 1) {
                let mid = Math.floor(dnf.length / 2);
                let pos1 = getNandRecs2(dnf.slice(0, mid)); 
                let pos2 = getNandRecs2(dnf.slice(mid));

                return `\\overline{\\overline{${pos1} \\cdot ${pos2}}}`;
            } else {
                if(dnf[0].comp) return `\\overline{${dnf[0].name[0]}_{${dnf[0].name.slice(1)}}}`;
                else return `${dnf[0].name[0]}_{${dnf[0].name.slice(1)}}`;
            }
        };

        const getNandRecs1 = (dnf) => {
            if(dnf.length > 1) {
                let mid = Math.floor(dnf.length / 2);
                let pos1 = getNandRecs1(dnf.slice(0, mid)); 
                let pos2 = getNandRecs1(dnf.slice(mid));

                return `\\overline{\\overline{${pos1} \\cdot ${pos2}}}`;
            } else {
                let mid = Math.floor(dnf[0].length / 2);
                if(dnf[0].length == 1) {
                    if(dnf[0][0].comp) return `\\overline{${dnf[0][0].name[0]}_{${dnf[0][0].name.slice(1)}}}`;
                    else return `${dnf[0][0].name[0]}_{${dnf[0][0].name.slice(1)}}`;
                }

                let pos1 = getNandRecs2(dnf[0].slice(0, mid)); 
                let pos2 = getNandRecs2(dnf[0].slice(mid));

                return `\\overline{${pos1} \\cdot ${pos2}}`;
            }
        };

        let mdnf = `f(${Array.from(Array(this.varsNum).keys()).map(i => `x_${i+1}`).join(',')}) =`;
        mdnf += this.mdnf.map(im => {
            return im.map(i => {
                if(i.comp) return `\\overline{${i.name[0]}_{${i.name.slice(1)}}}`;
                else return `${i.name[0]}_{${i.name.slice(1)}}`;
            }).join('\\cdot ');
        }).join('+');

        if(this.mdnf.length != 1 || this.mdnf[0].length != 1) {
            mdnf += ' = ';
            res.push($(`<p>\\[${mdnf}\\]</p>`));

            mdnf = ` = \\overline{\\overline{${this.mdnf.map(im => {
                return im.map(i => {
                    if(i.comp) return `\\overline{${i.name[0]}_{${i.name.slice(1)}}}`;
                    else return `${i.name[0]}_{${i.name.slice(1)}}`;
                }).join('\\cdot ');
            }).join('+')}}}`;
            
            if(this.mdnf.length > 1) {
                mdnf += ' = ';
                res.push($(`<p>\\[${mdnf}\\]</p>`));

                mdnf = ` = \\overline{${this.mdnf.map(im => {
                    if(im.length > 1) return `\\overline{${im.map(i => {
                        if(i.comp) return `\\overline{${i.name[0]}_{${i.name.slice(1)}}}`;
                        else return `${i.name[0]}_{${i.name.slice(1)}}`;
                    }).join('\\cdot ')}}`;
                    else return im.map(i => {
                        if(i.comp) return `${i.name[0]}_{${i.name.slice(1)}}`;
                        else return `\\overline{${i.name[0]}_{${i.name.slice(1)}}}`;
                    }).join('\\cdot ');
                }).join('\\cdot ')}}`;

                if(this.mdnf.length > 2 || this.mdnf.some(im => im.length > 2)) {
                    mdnf += ' = ';
                    res.push($(`<p>\\[${mdnf}\\]</p>`));

                    let mid = Math.floor(ndnf.length / 2);
                    let pos1 = getNandRecs1(ndnf.slice(0, mid));
                    let pos2 = getNandRecs1(ndnf.slice(mid));

                    res.push($(`<p>\\[= \\overline{${pos1} \\cdot ${pos2}}\\]</p>`));
                }
                else {
                    res.push($(`<p>\\[${mdnf}\\]</p>`));
                }
            }
            else {
                if(this.mdnf[0].length > 1) {
                    mdnf += ' = ';
                    res.push($(`<p>\\[${mdnf}\\]</p>`));

                    res.push($(`<p>\\[ = ${getNandRecs2(ndnf[0])}\\]</p>`));
                }
                else {
                    res.push($(`<p>\\[${mdnf}\\]</p>`));
                }
            }
        } else {
            res.push($(`<p>\\[${mdnf}\\]</p>`));
        }

        return res;
    }

    /** 
     * @param {HTMLCanvasElement} canvas
     * */
    renderNandDNF2(canvas) {
        let forRet = [];
        const ctx = canvas.getContext('2d');

        let ndnf = [];

        if(this.mdnf.length == 1 && this.mdnf[0].length == 1) {
            ndnf = this.mdnf.slice();
        }
        else {
            ndnf = this.mdnf.map(i => {
                if(i.length > 1) return i;
                return i.map(j => {
                    return { name: j.name, comp: !j.comp };
                }); 
            });
        }

        // Wires
        let [newVars, ptx] = FunctionCircuit.renderWiresNotNormal(canvas, ctx, this.varsNum, ndnf, forRet, FunctionCircuit.drawNotNand);

        let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;

        const getNandRecs2 = (dnf) => {
            if(dnf.length > 1) {
                let mid = Math.floor(dnf.length / 2);
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

                FunctionCircuit.drawNandGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);

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

                FunctionCircuit.drawNandGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP * 2 + GATE_SIZE * 6 / 5 + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);

                return { x: Math.max(pos1.x, pos2.x) + (COMP_GAP + GATE_SIZE * 6 / 5) * 2, y: (pos1.y + pos2.y) / 2 };
            } else {
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

                FunctionCircuit.drawNandGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);

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

                FunctionCircuit.drawNandGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP * 2 + GATE_SIZE * 6 / 5 + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
                return { x: Math.max(pos1.x, pos2.x) + (COMP_GAP + GATE_SIZE * 6 / 5) * 2, y: (pos1.y + pos2.y) / 2 };
            } else {
                let mid = Math.floor(dnf[0].length / 2);
                if(dnf[0].length == 1) {
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(ptx - GATE_SIZE / 8, pty);
                    ctx.lineTo(ptx, pty);
                    ctx.stroke();

                    let vname = (dnf[0][0].comp ? '!':'') + dnf[0][0].name;

                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 2 * newVars.indexOf(vname), pty );
                    ctx.lineTo(ptx - GATE_SIZE / 8, pty );
                    ctx.stroke();

                    pty += WIRE_GAP * 3;
                    return { x: ptx, y: pty - WIRE_GAP * 3 };
                }

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

                FunctionCircuit.drawNandGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
                return { x: Math.max(pos1.x, pos2.x) + (COMP_GAP + GATE_SIZE * 6 / 5), y: (pos1.y + pos2.y) / 2 };
            }
        };

        if(ndnf.length > 1) {
            let mid = Math.floor(ndnf.length / 2);
            let pos1 = getNandRecs1(ndnf.slice(0, mid));
            let pos2 = getNandRecs1(ndnf.slice(mid));

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

            FunctionCircuit.drawNandGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE * 2.5, (pos1.y + pos2.y) / 2);
            ctx.stroke();

            const rest = $(`<p>\\[f\\]</p>`);
            rest[0].style.top = `${(pos1.y + pos2.y) / 2 - NOT_TOP + 5}px`;
            rest[0].style.left = `${Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE + GATE_SIZE * 3 / 2}px`;
            forRet.push(rest);
        }
        else {
            let pos = getNandRecs2(ndnf[0]);

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.lineTo(pos.x + GATE_SIZE * 3 / 2, pos.y);
            ctx.stroke();

            const rest = $(`<p>\\[f\\]</p>`);
            rest[0].style.top = `${pos.y - NOT_TOP + 5}px`;
            rest[0].style.left = `${pos.x + GATE_SIZE * 3 / 2}px`;
            forRet.push(rest);
        }

        return forRet;
    }

    getSizeNorKNF2() {
        let ndnf = [];

        if(this.mknf.length == 1 && this.mknf[0].length == 1) {
            ndnf = this.mknf.slice();
        }
        else {
            ndnf = this.mknf.map(i => {
                if(i.length > 1) return i;
                return i.map(j => {
                    return { name: j.name, comp: !j.comp };
                }); 
            });
        }

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

        const height = TEXT_PAD + NOT_TOP * 1.2 + GATE_SIZE + COMP_GAP + ndnf.map(i => {
            return i.length
        }).reduce((a,b) => a + b, 0) * WIRE_GAP * 3;

        const mid2 = Math.floor(ndnf.length / 2);
        let width;
        if(ndnf.length > 1) width = WIRE_GAP2 + Math.max(getSizeRec1(ndnf.slice(0, mid2)), getSizeRec1(ndnf.slice(mid2))) + (COMP_GAP + GATE_SIZE * 6 / 5) * 2;
        else width = WIRE_GAP2 + getSizeRec2(ndnf[0]) + GATE_SIZE;
    
        for(let i=1;i<=this.varsNum;i++) {
            if(ndnf.some(j => j.some(k => k.name == `x${i}` && k.comp))) {
                width += WIRE_GAP2 * 2;
            }
            width += WIRE_GAP2 * 2;
        }

        return {
            width, height
        };
    }

    getNorMinimalKNF2() {
        const res = [];

        let ndnf = [];

        if(this.mknf.length == 1 && this.mknf[0].length == 1) {
            ndnf = this.mknf.slice();
        }
        else {
            ndnf = this.mknf.map(i => {
                if(i.length > 1) return i;
                return i.map(j => {
                    return { name: j.name, comp: !j.comp };
                }); 
            });
        }

        const getNandRecs2 = (dnf) => {
            if(dnf.length > 1) {
                let mid = Math.floor(dnf.length / 2);
                let pos1 = getNandRecs2(dnf.slice(0, mid)); 
                let pos2 = getNandRecs2(dnf.slice(mid));

                return `\\overline{\\overline{${pos1} + ${pos2}}}`;
            } else {
                if(dnf[0].comp) return `\\overline{${dnf[0].name[0]}_{${dnf[0].name.slice(1)}}}`;
                else return `${dnf[0].name[0]}_{${dnf[0].name.slice(1)}}`;
            }
        };

        const getNandRecs1 = (dnf) => {
            if(dnf.length > 1) {
                let mid = Math.floor(dnf.length / 2);
                let pos1 = getNandRecs1(dnf.slice(0, mid)); 
                let pos2 = getNandRecs1(dnf.slice(mid));

                return `\\overline{\\overline{${pos1} + ${pos2}}}`;
            } else {
                let mid = Math.floor(dnf[0].length / 2);
                if(dnf[0].length == 1) {
                    if(dnf[0][0].comp) return `\\overline{${dnf[0][0].name[0]}_{${dnf[0][0].name.slice(1)}}}`;
                    else return `${dnf[0][0].name[0]}_{${dnf[0][0].name.slice(1)}}`;
                }

                let pos1 = getNandRecs2(dnf[0].slice(0, mid)); 
                let pos2 = getNandRecs2(dnf[0].slice(mid));

                return `\\overline{${pos1} + ${pos2}}`;
            }
        };

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

        if(this.mknf.length != 1 || this.mknf[0].length != 1) {
            mknf += ' = ';
            res.push($(`<p>\\[${mknf}\\]</p>`));

            mknf = ` = \\overline{\\overline{${this.mknf.map(im => {
                if(im.length > 1) return '(' + im.map(i => {
                    if(i.comp) return `\\overline{${i.name[0]}_{${i.name.slice(1)}}}`;
                    else return `${i.name[0]}_{${i.name.slice(1)}}`;
                }).join('+ ') + ')';
                else {
                    if(im[0].comp) return `\\overline{${im[0].name[0]}_{${im[0].name.slice(1)}}}`;
                    else return `${im[0].name[0]}_{${im[0].name.slice(1)}}`;
                }
            }).join('\\cdot ')}}}`;

            if(this.mknf.length > 1) {
                mknf += ' = ';
                res.push($(`<p>\\[${mknf}\\]</p>`));

                mknf = ` = \\overline{${this.mknf.map(im => {
                    if(im.length > 1) return `\\overline{${im.map(i => {
                        if(i.comp) return `\\overline{${i.name[0]}_{${i.name.slice(1)}}}`;
                        else return `${i.name[0]}_{${i.name.slice(1)}}`;
                    }).join('+')}}`;
                    else return im.map(i => {
                        if(i.comp) return `${i.name[0]}_{${i.name.slice(1)}}`;
                        else return `\\overline{${i.name[0]}_{${i.name.slice(1)}}}`;
                    }).join('+');
                }).join('+')}}`;

                if(this.mknf.length > 2 || this.mknf.some(im => im.length > 2)) {
                    mknf += ' = ';
                    res.push($(`<p>\\[${mknf}\\]</p>`));

                    let mid = Math.floor(ndnf.length / 2);
                    let pos1 = getNandRecs1(ndnf.slice(0, mid));
                    let pos2 = getNandRecs1(ndnf.slice(mid));

                    res.push($(`<p>\\[= \\overline{${pos1} + ${pos2}}\\]</p>`));
                }
                else {
                    res.push($(`<p>\\[${mknf}\\]</p>`));
                }
            }
            else {
                if(this.mknf[0].length > 1) {
                    mknf += ' = ';
                    res.push($(`<p>\\[${mknf}\\]</p>`));

                    res.push($(`<p>\\[ = ${getNandRecs2(ndnf[0])}\\]</p>`));
                }
                else {
                    res.push($(`<p>\\[${mknf}\\]</p>`));
                }
            }
        }
        else {
            res.push($(`<p>\\[${mknf}\\]</p>`));
        }

        return res;
    }

    /** 
     * @param {HTMLCanvasElement} canvas
     * */
    renderNorKNF2(canvas) {
        let forRet = [];
        const ctx = canvas.getContext('2d');

        let ndnf = [];

        if(this.mknf.length == 1 && this.mknf[0].length == 1) {
            ndnf = this.mknf.slice();
        }
        else {
            ndnf = this.mknf.map(i => {
                if(i.length > 1) return i;
                return i.map(j => {
                    return { name: j.name, comp: !j.comp };
                }); 
            });
        }

        // Wires
        let [newVars, ptx] = FunctionCircuit.renderWiresNotNormal(canvas, ctx, this.varsNum, ndnf, forRet, FunctionCircuit.drawNotNor);

        let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;

        const getNandRecs2 = (dnf) => {
            if(dnf.length > 1) {
                let mid = Math.floor(dnf.length / 2);
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

                FunctionCircuit.drawNorGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);

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

                FunctionCircuit.drawNorGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP * 2 + GATE_SIZE * 6 / 5 + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);

                return { x: Math.max(pos1.x, pos2.x) + (COMP_GAP + GATE_SIZE * 6 / 5) * 2, y: (pos1.y + pos2.y) / 2 };
            } else {
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

                FunctionCircuit.drawNorGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);

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

                FunctionCircuit.drawNorGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP * 2 + GATE_SIZE * 6 / 5 + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
                return { x: Math.max(pos1.x, pos2.x) + (COMP_GAP + GATE_SIZE * 6 / 5) * 2, y: (pos1.y + pos2.y) / 2 };
            } else {
                let mid = Math.floor(dnf[0].length / 2);
                if(dnf[0].length == 1) {
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(ptx - GATE_SIZE / 8, pty);
                    ctx.lineTo(ptx, pty);
                    ctx.stroke();

                    let vname = (dnf[0][0].comp ? '!':'') + dnf[0][0].name;

                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 2 * newVars.indexOf(vname), pty );
                    ctx.lineTo(ptx - GATE_SIZE / 8, pty );
                    ctx.stroke();

                    pty += WIRE_GAP * 3;
                    return { x: ptx, y: pty - WIRE_GAP * 3 };
                }

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

                FunctionCircuit.drawNorGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
                return { x: Math.max(pos1.x, pos2.x) + (COMP_GAP + GATE_SIZE * 6 / 5), y: (pos1.y + pos2.y) / 2 };
            }
        };

        if(ndnf.length > 1) {
            let mid = Math.floor(ndnf.length / 2);
            let pos1 = getNandRecs1(ndnf.slice(0, mid));
            let pos2 = getNandRecs1(ndnf.slice(mid));

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

            FunctionCircuit.drawNorGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE * 6 / 5, (pos1.y + pos2.y) / 2);
            ctx.lineTo(Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE * 2.5, (pos1.y + pos2.y) / 2);
            ctx.stroke();

            const rest = $(`<p>\\[f\\]</p>`);
            rest[0].style.top = `${(pos1.y + pos2.y) / 2 - NOT_TOP + 5}px`;
            rest[0].style.left = `${Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE + GATE_SIZE * 3 / 2}px`;
            forRet.push(rest);
        }
        else {
            let pos = getNandRecs2(ndnf[0]);

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.lineTo(pos.x + GATE_SIZE * 3 / 2, pos.y);
            ctx.stroke();

            const rest = $(`<p>\\[f\\]</p>`);
            rest[0].style.top = `${pos.y - NOT_TOP + 5}px`;
            rest[0].style.left = `${pos.x + GATE_SIZE * 3 / 2}px`;
            forRet.push(rest);
        }

        return forRet;
    }

    getSizeNorDNF2() {
        let ndnf = [];

        ndnf = this.mdnf.map(i => {
            if(i.length == 1) return i;
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

        const height = TEXT_PAD + NOT_TOP * 1.2 + GATE_SIZE + COMP_GAP + ndnf.map(i => {
            return i.length
        }).reduce((a,b) => a + b, 0) * WIRE_GAP * 3;

        let width = WIRE_GAP2 + getSizeRec1(ndnf) + (COMP_GAP + GATE_SIZE * 6 / 5);
    
        for(let i=1;i<=this.varsNum;i++) {
            if(ndnf.some(j => j.some(k => k.name == `x${i}` && k.comp))) {
                width += WIRE_GAP2 * 2;
            }
            width += WIRE_GAP2 * 2;
        }

        return {
            width, height
        };
    }

    getNorMinimalDNF2() {
        const res = [];

        let ndnf = [];

        ndnf = this.mdnf.map(i => {
            if(i.length == 1) return i;
            return i.map(j => {
                return { name: j.name, comp: !j.comp };
            }); 
        });

        const getNandRecs2 = (dnf) => {
            if(dnf.length > 1) {
                let mid = Math.floor(dnf.length / 2);
                let pos1 = getNandRecs2(dnf.slice(0, mid)); 
                let pos2 = getNandRecs2(dnf.slice(mid));

                return `\\overline{\\overline{${pos1} + ${pos2}}}`;
            } else {
                if(dnf[0].comp) return `\\overline{${dnf[0].name[0]}_{${dnf[0].name.slice(1)}}}`;
                else return `${dnf[0].name[0]}_{${dnf[0].name.slice(1)}}`;
            }
        };

        const getNandRecs1 = (dnf) => {
            if(dnf.length > 1) {
                let mid = Math.floor(dnf.length / 2);
                let pos1 = getNandRecs1(dnf.slice(0, mid)); 
                let pos2 = getNandRecs1(dnf.slice(mid));

                return `\\overline{\\overline{${pos1} + ${pos2}}}`;
            } else {
                let mid = Math.floor(dnf[0].length / 2);
                if(dnf[0].length == 1) {
                    if(dnf[0][0].comp) return `\\overline{${dnf[0][0].name[0]}_{${dnf[0][0].name.slice(1)}}}`;
                    else return `${dnf[0][0].name[0]}_{${dnf[0][0].name.slice(1)}}`;
                }

                let pos1 = getNandRecs2(dnf[0].slice(0, mid)); 
                let pos2 = getNandRecs2(dnf[0].slice(mid));

                return `\\overline{${pos1} + ${pos2}}`;
            }
        };

        let mdnf = `f(${Array.from(Array(this.varsNum).keys()).map(i => `x_${i+1}`).join(',')}) =`;
        mdnf += this.mdnf.map(im => {
            return im.map(i => {
                if(i.comp) return `\\overline{${i.name[0]}_{${i.name.slice(1)}}}`;
                else return `${i.name[0]}_{${i.name.slice(1)}}`;
            }).join('\\cdot ');
        }).join('+');

        if(this.mdnf.length != 1 || this.mdnf[0].length != 1) {
            mdnf += ' = ';
            res.push($(`<p>\\[${mdnf}\\]</p>`));

            mdnf = ` = ${this.mdnf.map(im => {
                return `\\overline{\\overline{${im.map(i => {
                    if(i.comp) return `\\overline{${i.name[0]}_{${i.name.slice(1)}}}`;
                    else return `${i.name[0]}_{${i.name.slice(1)}}`;
                }).join('\\cdot ')}}}`;
            }).join('+')}`;
            
            if(this.mdnf.length > 1) {
                mdnf += ' = ';
                res.push($(`<p>\\[${mdnf}\\]</p>`));

                mdnf = ` = ${this.mdnf.map(im => {
                    if(im.length > 1) return `\\overline{${im.map(i => {
                        if(!i.comp) return `\\overline{${i.name[0]}_{${i.name.slice(1)}}}`;
                        else return `${i.name[0]}_{${i.name.slice(1)}}`;
                    }).join('+ ')}}`;
                    else return im.map(i => {
                        if(!i.comp) return `${i.name[0]}_{${i.name.slice(1)}}`;
                        else return `\\overline{${i.name[0]}_{${i.name.slice(1)}}}`;
                    }).join(' + ');
                }).join(' + ')}`;

                if(this.mdnf.length > 2 || this.mdnf.some(im => im.length > 2)) {
                    mdnf += ' = ';
                    res.push($(`<p>\\[${mdnf}\\]</p>`));

                    res.push($(`<p>\\[= ${getNandRecs1(ndnf)}\\]</p>`));
                }
                else {
                    res.push($(`<p>\\[${mdnf}\\]</p>`));
                }
            }
            else {
                if(this.mdnf[0].length > 1) {
                    mdnf += ' = ';
                    res.push($(`<p>\\[${mdnf}\\]</p>`));

                    res.push($(`<p>\\[ = ${getNandRecs1(ndnf)}\\]</p>`));
                }
                else {
                    res.push($(`<p>\\[${mdnf}\\]</p>`));
                }
            }
        } else {
            res.push($(`<p>\\[${mdnf}\\]</p>`));
        }

        return res;
    }

    /** 
     * @param {HTMLCanvasElement} canvas
     * */
    renderNorDNF2(canvas) {
        let forRet = [];
        const ctx = canvas.getContext('2d');

        let ndnf = [];

        ndnf = this.mdnf.map(i => {
            if(i.length == 1) return i;
            return i.map(j => {
                return { name: j.name, comp: !j.comp };
            }); 
        });

        // Wires
        let [newVars, ptx] = FunctionCircuit.renderWiresNotNormal(canvas, ctx, this.varsNum, ndnf, forRet, FunctionCircuit.drawNotNor);

        let pty = TEXT_PAD + NOT_TOP + GATE_SIZE + COMP_GAP;

        const getNandRecs2 = (dnf) => {
            if(dnf.length > 1) {
                let mid = Math.floor(dnf.length / 2);
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

                FunctionCircuit.drawNorGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);

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

                FunctionCircuit.drawNorGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP * 2 + GATE_SIZE * 6 / 5 + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);

                return { x: Math.max(pos1.x, pos2.x) + (COMP_GAP + GATE_SIZE * 6 / 5) * 2, y: (pos1.y + pos2.y) / 2 };
            } else {
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

                FunctionCircuit.drawNorGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);

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

                FunctionCircuit.drawNorGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP * 2 + GATE_SIZE * 6 / 5 + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
                return { x: Math.max(pos1.x, pos2.x) + (COMP_GAP + GATE_SIZE * 6 / 5) * 2, y: (pos1.y + pos2.y) / 2 };
            } else {
                let mid = Math.floor(dnf[0].length / 2);
                if(dnf[0].length == 1) {
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(ptx - GATE_SIZE / 8, pty);
                    ctx.lineTo(ptx, pty);
                    ctx.stroke();

                    let vname = (dnf[0][0].comp ? '!':'') + dnf[0][0].name;

                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(WIRE_GAP2 + WIRE_GAP2 * 2 * newVars.indexOf(vname), pty );
                    ctx.lineTo(ptx - GATE_SIZE / 8, pty );
                    ctx.stroke();

                    pty += WIRE_GAP * 3;
                    return { x: ptx, y: pty - WIRE_GAP * 3 };
                }

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

                FunctionCircuit.drawNorGate2(ctx, Math.max(pos1.x, pos2.x) + COMP_GAP + GATE_SIZE / 2, (pos1.y + pos2.y) / 2);
                return { x: Math.max(pos1.x, pos2.x) + (COMP_GAP + GATE_SIZE * 6 / 5), y: (pos1.y + pos2.y) / 2 };
            }
        };

        let pos = getNandRecs1(ndnf);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x + GATE_SIZE * 1.5, pos.y);
        ctx.stroke();

        const rest = $(`<p>\\[f\\]</p>`);
        rest[0].style.top = `${pos.y - NOT_TOP + 5}px`;
        rest[0].style.left = `${pos.x + GATE_SIZE * 3 / 2}px`;
        forRet.push(rest);

        return forRet;
    }
}

export { FunctionCircuit };