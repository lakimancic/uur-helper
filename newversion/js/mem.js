const UNITS = {
    0: 'B', 10: 'KB', 20: 'MB', 30: 'GB', 40: 'TB', 50: 'PB'
};

$("#solve1").click(() => {
    $("#res1").html('');

    let num1 = $("#num1").val();
    const unit1 = $("#unit1").val();
    const unit2 = $("#unit2").val();

    if(!/^\d+?$/.test(num1)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno unet kapacitet!'
        });
        return;
    }

    if(unit1 == null) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Niste izabrali jedinicu!'
        });
        return;
    }

    if(unit2 == null) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Niste izabrali jedinicu rezultata!'
        });
        return;
    }

    num1 = Number(num1);

    let decP = 10 ** (3 * (unit1 - unit2) / 10);
    let binR = 2 ** (unit1 - unit2);
    let resText = `${num1} ${UNITS[unit1]} = ${num1} \\cdot 2^{${unit1 - unit2}} ${UNITS[unit2]} = ${num1} \\cdot ${binR} ${UNITS[unit2]} \\approx ${num1 * binR / decP} \\cdot 10^{${(unit1 - unit2) * 3 / 10}} ${UNITS[unit2]}`;

    $("#res1").html(`\\[${resText}\\]`);

    MathJax.typeset();
});

$("#solve2").click(() => {
    $("#res2").html('');

    let num1 = $("#num2").val();
    let num2 = $("#num3").val();
    const unit1 = $("#unit3").val();

    if(!/^\d+?$/.test(num1)) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neispravno unet kapacitet!'
        });
        return;
    }

    if(unit1 == null) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Niste izabrali jedinicu!'
        });
        return;
    }

    num1 = Number(num1);
    num2 = Number(num2);

    if(!Number.isInteger(Math.log2(num1)) || !Number.isInteger(Math.log2(num2))) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Kapacitet i adresibilnost moraju biti stepen dvojke!'
        });
        return;
    }

    let num1exp = Math.log2(num1) + Number(unit1);
    let num2exp = Math.log2(num2);

    let resText = `\\dfrac{${num1} ${UNITS[unit1]}}{${num2} B} = \\dfrac{2^${Math.log2(num1)} \\cdot ${unit1 != 0 ? `2^{${unit1}}`: ``} B}{2^${num2exp} B} = 2^{${num1exp - num2exp}}`;
    let resText2 = `\\text{Broj lokacija (adresa) u memorji je } 2^{${num1exp - num2exp}} \\text{ ,potrebno je } ${num1exp - num2exp} \\text{ bita za predstavljanje adrese}`;
    let resText3 = `\\text{Poslednja adresa u memorji je } (${'1'.repeat(num1exp - num2exp)})_2 = (${(2 ** (num1exp - num2exp) - 1).toString(16).toUpperCase()})_{16}`;

    $("#res2").html(`<p>\\[${resText}\\]<p><p>\\[${resText2}\\]</p><p>\\[${resText3}\\]</p>`);

    MathJax.typeset();
});