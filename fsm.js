const CR = 30;
const DIST = 200;
const ox = 300, oy = 300;

const canvas = document.getElementById('graph');

let stateN = 7;
let states = [
    {
        name: 'q1',
        nodes: [
            { to: 5, name: 'x/b' }
        ]
    },
    {
        name: 'q2',
        nodes: [
            { to: 4, name: 'x/a' }
        ]
    }
];

const rotateAround = (p1, p2, angle) => {
    return {
        x: p1.x + (p2.x - p1.x) * Math.cos(angle) - (p2.y - p1.y) * Math.sin(angle),
        y: p1.y + (p2.x - p1.x) * Math.sin(angle) + (p2.y - p1.y) * Math.cos(angle)
    };
};

const dist = (p1, p2) => {
    return Math.sqrt((p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y));
};

const renderGraph = () => {
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext('2d');

    renderStates(ctx);
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
        let ncy = oy + y + dy * CR * 6/4;
        let p = (x - ncx) / (ncy - y);
        let q = (CR*CR - CR * 0.9* CR * 0.9) / (2*(ncy - y));
        
        ctx.beginPath();
        ctx.arc(ox + x + dx * CR * 6/4, oy + y + dy * CR * 6/4, CR * 0.9, 0, 2 * Math.PI);
        ctx.stroke();
        return;
    }
    let nx = R * Math.cos(angle + to * phi);
    let ny = - R * Math.sin(angle + to * phi);
    let p = rotateAround({ x, y }, { x:nx, y:ny }, - Math.PI / 3);
    let dis = Math.sqrt((y - ny)*(y - ny) + (x - nx)*(x - nx));
    let a1 = Math.atan2(y - p.y, x - p.x);
    let a2 = Math.atan2(ny - p.y, nx - p.x);
    let angleO = Math.acos(1 - CR*CR / (2 * dis*dis));
    ctx.beginPath();
    ctx.arc(ox + p.x, oy + p.y, dis, a2 + angleO, a1 - angleO);
    ctx.stroke();
    const angleMul = 1.4;
    let xp = p.x + dis * Math.cos(a2 + angleO);
    let yp = p.y + dis * Math.sin(a2 + angleO); 
    ctx.beginPath();
    ctx.moveTo(ox + xp, oy + yp);
    ctx.lineTo(
        ox + p.x + (dis - CR / 6) * Math.cos(a2 + angleO * angleMul),
        oy + p.y + (dis - CR / 6) * Math.sin(a2 + angleO * angleMul)
    );
    ctx.lineTo(
        ox + p.x + (dis + CR / 6) * Math.cos(a2 + angleO * angleMul),
        oy + p.y + (dis + CR / 6) * Math.sin(a2 + angleO * angleMul)
    );
    ctx.closePath();
    ctx.fill();
    
    ctx.font = "14px Arial";
    let tx = p.x + (dis + CR / 4) * Math.cos((a1 + a2) / 2);
    let ty = p.y + (dis + CR / 4) * Math.sin((a1 + a2) / 2);
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

        ctx.fillText(`q${i+1}`, ox + x, oy + y);

        angle += phi;
    }

    renderConnection(ctx, 1, 1, R);
    // renderConnection(ctx, 1, 5, R);
    // renderConnection(ctx, 0, 2, R);
    // renderConnection(ctx, 2, 0, R);
    // renderConnection(ctx, 0, 3, R);

    // for(let i=0;i<stateN;i++) {
    //     renderConnection(ctx, i, i, R);
    // }
    
    // states.forEach((i, ind) => {
    //     i.nodes.forEach(j => renderConnection(ctx, ind, j.to, R, j.name));
    // });
};

renderGraph();