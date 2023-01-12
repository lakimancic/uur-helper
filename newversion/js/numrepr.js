import { Register, FLOAT_EXP_SIZES } from "./cpu_utils.js";

const addLegendItem = (text, color, parent) => {
    parent.append($(`<div class="item"><span class="square" style="background-color: ${color};"></span>${text}</div>`));
};

$("#calc1").click(() => {
    let size = $("#bitsize1").val();
    let num = $("#num1").val();
    let method = $("#method1").val();

    if(!/^-?[0-9]+$/.test(num)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neipravno unet ceo broj!'
        });
        return;
    }

    if(size == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Niste izabrali veličinu registra!'
        });
        return;
    }

    if(method == 'nil') {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Niste izabrali način predstavljanja!'
        });
        return;
    }

    let reg = new Register(parseInt(size));

    if(method == 'prosto') {
        if(!reg.simpleNotation(num)) {
            Swal.fire({
                icon: 'error',
                title: 'Greška',
                text: 'Broj prekoračuje opseg!'
            });
            return;
        }
    }
    else if(method == 'nepotp') {
        if(!reg.onesComplement(num)) {
            Swal.fire({
                icon: 'error',
                title: 'Greška',
                text: 'Broj prekoračuje opseg!'
            });
            return;
        }
    }
    else if(method == 'potpun') {
        if(!reg.twosComplement(num)) {
            Swal.fire({
                icon: 'error',
                title: 'Greška',
                text: 'Broj prekoračuje opseg!'
            });
            return;
        }
    }
    else if(method == 'pomer1') {
        if(!reg.shiftRepr(num)) {
            Swal.fire({
                icon: 'error',
                title: 'Greška',
                text: 'Broj prekoračuje opseg!'
            });
            return;
        }
    }
    else if(method == 'pomer2') {
        if(!reg.shiftRepr(num, true)) {
            Swal.fire({
                icon: 'error',
                title: 'Greška',
                text: 'Broj prekoračuje opseg!'
            });
            return;
        }
    }

    $("#res1").html(``);

    let table = $("<table></table>");
    table.addClass("reg");

    if(reg.size < 64) {
        table.append($(`<tr>${reg.bits.map((val, ind) => `<td>${val}<span class="index">${reg.size - 1 - ind}</span></td>`).join('')}</tr>`));
    }
    else {
        table.append($(`<tr>${reg.bits.slice(0, 32).map((val, ind) => `<td>${val}<span class="index">${reg.size - 1 - ind}</span></td>`).join('')}</tr>`));
        table.append($(`<tr>${reg.bits.slice(32).map((val, ind) => `<td>${val}<span class="index">${(reg.size >> 1) - 1 - ind}</span></td>`).join('')}</tr>`));
    }

    let bitCells = table.children().children('td');
    bitCells[0].style.backgroundColor = "#eeece1";

    $("#res1").append(table);

    let legend = $("<div></div>");
    legend.addClass('legend');

    addLegendItem('Znak', '#eeece1', legend);

    $("#res1").append(legend);
});

$("#calc2").click(() => {
    let size = $("#bitsize2").val();
    let num = $("#num2").val();
    let method = $("#method2").val();

    if(!/^-?[0-9]+(\.[0-9]+)?$/.test(num)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno unet broj!'
        });
        return;
    }

    if(size == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Niste izabrali veličinu registra!'
        });
        return;
    }

    if(method == 'nil') {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Niste izabrali način predstavljanja!'
        });
        return;
    }

    let reg = new Register(parseInt(size));

    if(method == 'fixed') {
        let n = $("#n_bits").val();
        let m = $("#m_bits").val();

        if(!/^[0-9]+$/.test(n)) {
            Swal.fire({
                icon: 'error',
                title: 'Greška',
                text: 'Neipravno unet broj bitova za celi deo!'
            });
            return;
        }

        if(!/^[0-9]+$/.test(m)) {
            Swal.fire({
                icon: 'error',
                title: 'Greška',
                text: 'Neipravno unet broj bitova za decimalni deo!'
            });
            return;
        }

        let res = reg.fixedPoint(num, parseInt(n), parseInt(m));

        if(res == -1) {
            Swal.fire({
                icon: 'error',
                title: 'Greška',
                text: `Zbir bitova za celi i decimalni deo mora biti ${reg.size - 1}!`
            });
            return;
        } else if(res == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Greška',
                text: 'Broj prekoračuje opseg!'
            });
            return;
        }
    }
    else if(method == 'float') {
        reg.floatPoint(num);
    }

    $("#res2").html(``);

    let table = $("<table></table>");
    table.addClass("reg");

    if(reg.size < 64) {
        table.append($(`<tr>${reg.bits.map((val, ind) => `<td>${val}<span class="index">${reg.size - 1 - ind}</span></td>`).join('')}</tr>`));
    }
    else {
        table.append($(`<tr>${reg.bits.slice(0, 32).map((val, ind) => `<td>${val}<span class="index">${reg.size - 1 - ind}</span></td>`).join('')}</tr>`));
        table.append($(`<tr>${reg.bits.slice(32).map((val, ind) => `<td>${val}<span class="index">${(reg.size >> 1) - 1 - ind}</span></td>`).join('')}</tr>`));
    }
    
    $("#res2").append(table);

    let bitCells = table.children().children('td');
    bitCells[0].style.backgroundColor = '#d5ffff';

    if(method == 'fixed') {
        let n = parseInt($("#n_bits").val());

        for(let i=1;i<=n;i++) {
            bitCells[i].style.backgroundColor = '#A4FFB4';
        }

        for(let i=n+1;i<reg.size;i++) {
            bitCells[i].style.backgroundColor = '#FFB2B4';
        }

        let legend = $("<div></div>");
        legend.addClass('legend');
    
        addLegendItem('Znak', '#d5ffff', legend);
        addLegendItem('Celi deo', '#A4FFB4', legend);
        addLegendItem('Razljomljeni deo', '#FFB2B4', legend);

        $("#res2").append(legend);
    }
    else if(method == 'float') {
        let exp = FLOAT_EXP_SIZES[reg.size];

        for(let i=1;i<=exp;i++) {
            bitCells[i].style.backgroundColor = '#A4FFB4';
        }

        for(let i=exp+1;i<reg.size;i++) {
            bitCells[i].style.backgroundColor = '#FFB2B4';
        }

        let legend = $("<div></div>");
        legend.addClass('legend');
    
        addLegendItem('Znak', '#d5ffff', legend);
        addLegendItem('Eksponent', '#A4FFB4', legend);
        addLegendItem('Normalizovana mantisa', '#FFB2B4', legend);

        $("#res2").append(legend);
    }
});

$("#method2").on('change', () => {
    if($("#method2").val() == 'fixed') {
        $("#fixed_bits1").removeClass('d-none');
    }
    else {
        $("#fixed_bits1").addClass('d-none');
    }
});

$("#method3").on('change', () => {
    if($("#method3").val() == 'fixed') {
        $("#fixed_bits2").removeClass('d-none');
    }
    else {
        $("#fixed_bits2").addClass('d-none');
    }
});

const renderEditableReg = () => {
    let newsize = $("#bitsize3").val();

    let table = $("<table></table>");
    table.addClass("reg");

    let reg = new Register(newsize);

    if(reg.size < 64) {
        table.append($(`<tr>${reg.bits.map((val, ind) => `<td>${val}<span class="index">${reg.size - 1 - ind}</span></td>`).join('')}</tr>`));
    }
    else {
        table.append($(`<tr>${reg.bits.slice(0, 32).map((val, ind) => `<td>${val}<span class="index">${reg.size - 1 - ind}</span></td>`).join('')}</tr>`));
        table.append($(`<tr>${reg.bits.slice(32).map((val, ind) => `<td>${val}<span class="index">${(reg.size >> 1) - 1 - ind}</span></td>`).join('')}</tr>`));
    }

    $(".reg-con").html(``);
    $(".reg-con").append(table);

    let bitCells = table.children().children('td');

    for(let i=0;i<reg.size;i++) {
        bitCells[i].onclick = () => {
            bitCells[i].innerHTML = 1 - parseInt(bitCells[i].textContent[0]) + bitCells[i].innerHTML.slice(1);
        };
    }
};

$("#calc3").click(() => {
    let newsize = $("#bitsize3").val();
    let method = $("#method3").val();

    let bitCells = $(".reg-con td");

    let reg = new Register(newsize);

    for(let i=0;i<newsize;i++) {
        reg.bits[i] = parseInt(bitCells[i].textContent[0]);
    }
    const prefix = "Vrednost registra je ";

    if(method == 'prosto') {
        $("#res3").text(prefix + reg.getSimpleValue());
    }
    else if(method == 'nepotp') {
        $("#res3").text(prefix + reg.getOnesComplementValue());
    }
    else if(method == 'potpun') {
        $("#res3").text(prefix + reg.getTwosComplementValue());
    }
    else if(method == 'pomer1') {
        $("#res3").text(prefix + reg.getShiftValue());
    }
    else if(method == 'pomer2') {
        $("#res3").text(prefix + reg.getShiftValue(true));
    }
    else if(method == 'fixed') {
        let n = $("#n_bits2").val();
        let m = $("#m_bits2").val();

        if(!/^[0-9]+$/.test(n)) {
            Swal.fire({
                icon: 'error',
                title: 'Greška',
                text: 'Neipravno unet broj bitova za celi deo!'
            });
            return;
        }

        if(!/^[0-9]+$/.test(m)) {
            Swal.fire({
                icon: 'error',
                title: 'Greška',
                text: 'Neipravno unet broj bitova za decimalni deo!'
            });
            return;
        }

        n = parseInt(n);
        m = parseInt(m);

        if(n + m != reg.size - 1) {
            Swal.fire({
                icon: 'error',
                title: 'Greška',
                text: `Zbir bitova za celi i decimalni deo mora biti ${reg.size - 1}!`
            });
            return;
        }

        $("#res3").text(prefix + reg.getFixedValue(n, m));
    }
    else if(method == 'float') {
        $("#res3").text(prefix + reg.getFloatValue());
    }
});

$("#bitsize3").on('change', () => {
    renderEditableReg();
});

$(document).ready(() => {
    if($("#method2").val() == 'fixed') {
        $("#fixed_bits1").removeClass('d-none');
    }

    if($("#method3").val() == 'fixed') {
        $("#fixed_bits2").removeClass('d-none');
    }

    renderEditableReg();
});