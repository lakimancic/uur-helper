import { FunctionCircuit } from "./circuit.js";

let func = new FunctionCircuit();

const getCanvasDNF = () => {
    const canvasCon = $(`<div class="canvas-con m-auto"></div>`);
    const canvas = $("<canvas></canvas>");
    canvasCon.append(canvas);

    let size = func.getSizeDNF();
    canvas[0].width = size.width;
    canvas[0].height = size.height;

    canvasCon.append(func.renderDNF(canvas[0]));

    return canvasCon;
};

const getCanvasDNF2 = () => {
    const canvasCon = $(`<div class="canvas-con m-auto"></div>`);
    const canvas = $("<canvas></canvas>");
    canvasCon.append(canvas);

    let size = func.getSizeDNF2();
    canvas[0].width = size.width;
    canvas[0].height = size.height;

    canvasCon.append(func.renderDNF2(canvas[0]));

    return canvasCon;
};

const getCanvasKNF = () => {
    const canvasCon = $(`<div class="canvas-con m-auto"></div>`);
    const canvas = $("<canvas></canvas>");
    canvasCon.append(canvas);

    let size = func.getSizeKNF();
    canvas[0].width = size.width;
    canvas[0].height = size.height;

    canvasCon.append(func.renderKNF(canvas[0]));

    return canvasCon;
};

const getCanvasKNF2 = () => {
    const canvasCon = $(`<div class="canvas-con m-auto"></div>`);
    const canvas = $("<canvas></canvas>");
    canvasCon.append(canvas);

    let size = func.getSizeKNF2();
    canvas[0].width = size.width;
    canvas[0].height = size.height;

    canvasCon.append(func.renderKNF2(canvas[0]));

    return canvasCon;
};

const getCanvasNandDNF = () => {
    const canvasCon = $(`<div class="canvas-con m-auto"></div>`);
    const canvas = $("<canvas></canvas>");
    canvasCon.append(canvas);

    let size = func.getSizeNandDNF();
    canvas[0].width = size.width;
    canvas[0].height = size.height;

    canvasCon.append(func.renderNandDNF(canvas[0]));

    return canvasCon;
};

const getCanvasNorKNF = () => {
    const canvasCon = $(`<div class="canvas-con m-auto"></div>`);
    const canvas = $("<canvas></canvas>");
    canvasCon.append(canvas);

    let size = func.getSizeNorKNF();
    canvas[0].width = size.width;
    canvas[0].height = size.height;

    canvasCon.append(func.renderNorKNF(canvas[0]));

    return canvasCon;
};

const getCanvasNandDNF2 = () => {
    const canvasCon = $(`<div class="canvas-con m-auto"></div>`);
    const canvas = $("<canvas></canvas>");
    canvasCon.append(canvas);

    let size = func.getSizeNandDNF2();
    canvas[0].width = size.width;
    canvas[0].height = size.height;

    canvasCon.append(func.renderNandDNF2(canvas[0]));

    return canvasCon;
};

const getCanvasNorKNF2 = () => {
    const canvasCon = $(`<div class="canvas-con m-auto"></div>`);
    const canvas = $("<canvas></canvas>");
    canvasCon.append(canvas);

    let size = func.getSizeNorKNF2();
    canvas[0].width = size.width;
    canvas[0].height = size.height;

    canvasCon.append(func.renderNorKNF2(canvas[0]));

    return canvasCon;
};

const getCanvasNorDNF2 = () => {
    const canvasCon = $(`<div class="canvas-con m-auto"></div>`);
    const canvas = $("<canvas></canvas>");
    canvasCon.append(canvas);

    let size = func.getSizeNorDNF2();
    canvas[0].width = size.width;
    canvas[0].height = size.height;

    canvasCon.append(func.renderNorDNF2(canvas[0]));

    return canvasCon;
};

const solve = () => {
    $(".res-q").html(``);

    $(".res-q").append($(`<h4 class="text-center p-4">Tablica istinitosti</h4>`));
    $(".res-q").append(func.getTruthTable());

    $(".res-q").append($(`<h4 class="text-center p-4">Decimalni indeksi</h4>`));
    $(".res-q").append(func.getDecimalIndeces());

    $(".res-q").append($(`<h4 class="text-center p-4">Vektor istinitosti</h4>`));
    $(".res-q").append(func.getTruthVector());

    $(".res-q").append($(`<h4 class="text-center p-4">Brojni indeks</h4>`));
    $(".res-q").append(func.getNumericalIndex());

    $(".res-q").append($(`<h4 class="text-center p-4">PDNF</h4>`));
    $(".res-q").append(func.getPDNF());

    $(".res-q").append($(`<h4 class="text-center p-4">PKNF</h4>`));
    $(".res-q").append(func.getPKNF());

    $(".res-q").append($(`<h4 class="text-center p-4">PPNF</h4>`));
    $(".res-q").append(func.getPPNF());

    $(".res-q").append($(`<h4 class="text-center p-4">Kanonički polinom</h4>`));
    $(".res-q").append(func.getKP());

    $(".res-q").append($(`<h4 class="text-center p-4">Minimalni DNF</h4>`));
    $(".res-q").append(func.getMinimalDNF());

    $(".res-q").append($(`<h4 class="text-center p-4">Minimalni KNF</h4>`));
    $(".res-q").append(func.getMinimalKNF());

    $(".res-q").append($(`<h4 class="text-center p-4">Minimalni DNF (Logičko kolo)</h4>`));
    $(".res-q").append($(`<h5 class="text-center p-4">Višeulazna logička kola</h5>`));
    $(".res-q").append(getCanvasDNF());
    $(".res-q").append($(`<h5 class="text-center p-4">Dvoulazna logička kola</h5>`));
    $(".res-q").append(getCanvasDNF2());

    $(".res-q").append($(`<h4 class="text-center p-4">Minimalni KNF (Logičko kolo)</h4>`));
    $(".res-q").append($(`<h5 class="text-center p-4">Višeulazna logička kola</h5>`));
    $(".res-q").append(getCanvasKNF());
    $(".res-q").append($(`<h5 class="text-center p-4">Dvoulazna logička kola</h5>`));
    $(".res-q").append(getCanvasKNF2());

    $(".res-q").append($(`<h4 class="text-center p-4">Logičko kolo - NI kola</h4>`));
    $(".res-q").append($(`<h5 class="text-center p-4">Višeulazna logička kola</h5>`));
    $(".res-q").append($(`<div class="func-con"></div>`).append(func.getNandMinimalDNF()));
    $(".res-q").append(getCanvasNandDNF());
    $(".res-q").append($(`<h5 class="text-center p-4">Dvoulazna logička kola</h5>`));
    $(".res-q").append($(`<div class="func-con"></div>`).append(func.getNandMinimalDNF2()));
    $(".res-q").append(getCanvasNandDNF2());

    $(".res-q").append($(`<h4 class="text-center p-4">Logičko kolo - NILI kola</h4>`));
    $(".res-q").append($(`<h5 class="text-center p-4">Višeulazna logička kola</h5>`));
    $(".res-q").append($(`<div class="func-con"></div>`).append(func.getNorMinimalKNF()));
    $(".res-q").append(getCanvasNorKNF());
    $(".res-q").append($(`<h5 class="text-center p-4">Dvoulazna logička kola</h5>`));
    $(".res-q").append($(`<div class="func-con"></div>`).append(func.getNorMinimalKNF2()));
    $(".res-q").append(getCanvasNorKNF2());
    $(".res-q").append($(`<h5 class="text-center p-4">Dvoulazna logička kola (preko DNF)</h5>`));
    $(".res-q").append($(`<div class="func-con"></div>`).append(func.getNorMinimalDNF2()));
    $(".res-q").append(getCanvasNorDNF2());

    MathJax.typeset();
};

$("#next").click(() => {
    $('.main-q').toggleClass('d-none');
    if($('#rb-func')[0].checked) {
        $('.func-q').toggleClass('d-none');
    } else if($('#rb-table')[0].checked) {
        $('.table-q').toggleClass('d-none');
    } else if($('#rb-dec')[0].checked) {
        $('.numd-q').toggleClass('d-none');
    } else if($('#rb-decs')[0].checked) {
        $('.decs-q').toggleClass('d-none');
    } else if($('#rb-vec')[0].checked) {
        $('.vec-q').toggleClass('d-none');
    }
});

$("#analyze1").click(() => {
    func = new FunctionCircuit();
    
    const funcText = document.getElementById('func').value;
    if(!func.parseFunction(funcText)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: `Neispravno uneta funkcija`
        });
        return;
    }
    solve();
});

$("#create").click(() => {
    let varNum = $("#vars").val();

    if(!/^\d+?$/.test(varNum)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno unet broj promenljivih!'
        });
        return;
    }

    varNum = parseInt(varNum);

    const table = $(`<table class="ttable table-bordered w-25 mx-auto text-center"></table>`);
    const thr = $("<tr></tr>");

    for(let i=1;i<=varNum;i++) thr.append($(`<td>\\[x_${i}\\]</td>`));
    thr.append($(`<td>\\[f\\]</td>`));
    table.append(thr);

    for(let i=0;i<2**varNum;i++) {
        let temp = i, tempArr = [];
        const tr = $("<tr></tr>");
        for(let j=0;j<varNum;j++) {
            tempArr.unshift(temp & 1);
            temp >>= 1;
        }
        tempArr.forEach(j => tr.append($(`<td>${j}</td>`)));
        
        let editTD = $("<td>*</td>");
        editTD.click(() => {
            if(editTD.text() == '*') editTD.text('0');
            else if(editTD.text() == '0') editTD.text('1');
            else if(editTD.text() == '1') editTD.text('*');
        });
        tr.append(editTD);

        table.append(tr);
    }

    $(".fill-table").removeClass('d-none');
    $("#edit_table").html(``);
    $("#edit_table").append(table);
    $("#analyze2")[0].disabled = false;

    MathJax.typeset();
});

$("#analyze2").click(() => {
    func = new FunctionCircuit();

    const tableRows = $("#edit_table tr");
    let res = [];
    
    for(let i=1;i<tableRows.length;i++) {
        const val = tableRows[i].lastChild.textContent;

        if(val == '*') res.push(val);
        else res.push(parseInt(val));
    }

    func.setTruthValues(res);

    solve();
});

$("#analyze3").click(() => {
    func = new FunctionCircuit();

    const numInd = $("#numd").val();

    if(!/^\d+?$/.test(numInd)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno unet brojni indeks!'
        });
        return;
    }

    if(parseInt(numInd) < 0) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno unet brojni indeks!'
        });
        return;
    }

    func.setFromNumber(parseInt(numInd));

    solve();
});

$("#analyze4").click(() => {
    func = new FunctionCircuit();

    let f0 = $("#f_0").val() || '';
    let f1 = $("#f_1").val() || '';
    let fS = $("#f_s").val() || '';

    if(!/^(\s*\d+\s*(,\s*\d+\s*)*)?$/.test(f0) || !/^(\s*\d+\s*(,\s*\d+\s*)*)?$/.test(f1) || !/^(\s*\d+\s*(,\s*\d+\s*)*)?$/.test(fS)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno uneti decimalni indeksi!'
        });
        return;
    }

    f0 = f0 != '' ? f0.split(',').map(i => parseInt(i)) : [];
    f1 = f1 != '' ? f1.split(',').map(i => parseInt(i)) : [];
    fS = fS != '' ? fS.split(',').map(i => parseInt(i)) : [];

    if(!func.setFromDecs(f1, f0, fS)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno uneti decimalni indeksi!'
        });
        return;
    }

    solve();
});

$("#analyze5").click(() => {
    func = new FunctionCircuit();

    let vec = $("#vec").val();

    if(!func.setFromVector(vec)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno unet vektor istinitosti!'
        });
        return;
    }

    solve();
});