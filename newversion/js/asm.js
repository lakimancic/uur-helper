import { Assembler, CPU } from "./cpu_utils.js";
import * as utils from "./utils.js";

let asm = new Assembler();
let cpu = new CPU(asm.memory);

const renderMemory = () => {
    $("#ram").html(``);
    $("#ram").append(`<tr><td></td>${Array.from(new Array(16).keys()).map(i => `<td class='addr'>_${i.toString(16).toUpperCase()}</td>`).join('')}</tr>`)
    $("#ram").append(cpu.memory.getHexValues().map((i, ind) => `<tr><td class='addr'>${ind.toString(16).toUpperCase()}_</td>${i.map(j => `<td class='cell'>${j.toUpperCase()}</td>`)}</tr>`))
};

const renderRegisters = () => {
    $("#regs").html(``);
    cpu.regs.forEach((val, ind) => {
        $("#regs").append(`<tr><td class='addr'>R${ind.toString(16).toUpperCase()}</td><td class='cell'>${val.getHexVal().toUpperCase()}</td></tr>`);
    });
    $("#regs tr:nth-child(1)").append($(`<td class='empty'></td><td class='addr'>AK</td><td class='cell'>${cpu.ac.getHexVal().toUpperCase()}</td>`));
    $("#regs tr:nth-child(2)").append($(`<td class='empty'></td><td class='addr'>PR</td><td class='cell'>${cpu.dr.getHexVal().toUpperCase()}</td>`));
    $("#regs tr:nth-child(4)").append($(`<td class='empty'></td><td class='addr'>BN</td><td class='cell'>${cpu.pc.getHexVal().toUpperCase().slice(0, 2)}</td><td class='cell'>${cpu.pc.getHexVal().toUpperCase().slice(2)}</td>`));
    $("#regs tr:nth-child(5)").append($(`<td class='empty'></td><td class='addr'>RN</td><td class='cell'>${cpu.ir.getHexVal().toUpperCase().slice(0, 2)}</td><td class='cell'>${cpu.ir.getHexVal().toUpperCase().slice(2)}</td>`));
    $("#regs tr:nth-child(7)").append($(`<td class='empty'></td><td class='addr'>RS</td><td class='cell'>${cpu.sr.getHexVal().toUpperCase()}</td>`));
};

renderMemory();
renderRegisters();

const editor = ace.edit("editor");
editor.setTheme("ace/theme/tomorrow_night");
const session = editor.session;

const inEditor = ace.edit("edit_in");
const outEditor = ace.edit("edit_out");

inEditor.setTheme("ace/theme/tomorrow_night");
outEditor.setTheme("ace/theme/tomorrow_night");
outEditor.setOptions({readOnly: true, highlightActiveLine: false, highlightGutterLine: false});

$("#editor").on('click', () => {
    session.setMode('ace/mode/text', function() {
        let rules = session.$mode.$highlightRules.getRules();
        for (let stateName in rules) {
            if (Object.prototype.hasOwnProperty.call(rules, stateName)) {
                rules[stateName].unshift({
                    token: 'keyword.control.assembly',
                    regex: /\b(add|sub|and|or|xor|mul|div|cmp|ld|mov|st|shr|ror|not|neg|jmp|je|jne|jg|jge|jl|jle|in|out|halt)\b/,
                    caseInsensitive: true
                });
            }
    
            if (Object.prototype.hasOwnProperty.call(rules, stateName)) {
                rules[stateName].unshift({
                    token: 'constant.character.decimal.assembly',
                    regex: /\b([0-9]+|0b[0-1]+|0x[0-9A-F]+)\b/,
                    caseInsensitive: true
                });
            }
    
            if (Object.prototype.hasOwnProperty.call(rules, stateName)) {
                rules[stateName].unshift({
                    token: 'variable.parameter.register.assembly',
                    regex: /\b(r[0-9A-F]|ac|dr)\b/,
                    caseInsensitive: true
                });
            }
    
            if (Object.prototype.hasOwnProperty.call(rules, stateName)) {
                rules[stateName].unshift({
                    token: 'entity.name.function.assembly',
                    regex: /^[A-Z]+:$/,
                    caseInsensitive: true
                });
            }

            if (Object.prototype.hasOwnProperty.call(rules, stateName)) {
                rules[stateName].unshift({
                    token: 'comment.assembly',
                    regex: /;(.+)?$/,
                    caseInsensitive: true
                });
            }
        }
    
        session.$mode.$tokenizer = null;
        session.bgTokenizer.setTokenizer(session.$mode.getTokenizer());
        session.bgTokenizer.start(0);
    });
});

$("#inEditor").on('click', () => {
    session.setMode('ace/mode/text');
});

$("#outEditor").on('click', () => {
    session.setMode('ace/mode/text');
});

let ready = false;
let delay = 1000;

$("#assemble").on('click', () => {
    try {
        asm.assemble(editor.getValue());
    }
    catch(err) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: err
        });
        return;
    }
    cpu.reset();
    ready = true;

    $(".my-marker").removeClass('my-marker');
    if(asm.memToLine[cpu.pc.value] != undefined && asm.memToLine[cpu.pc.value] < $(`#editor .ace_line`).length)
        $(`#editor .ace_line:nth-child(${asm.memToLine[cpu.pc.value]+1})`).addClass('my-marker');


    $("#start")[0].disabled = false;
    $("#step1")[0].disabled = false;

    renderMemory();
    renderRegisters();
});

$("#step1").on('click', () => {
    let isFin = cpu.isFinished;

    if(!cpu.executeInstruction()) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: `Neispravna instrukcija`
        });
        renderMemory();
        renderRegisters();
        return;
    }

    $("#stop")[0].disabled = false;
    $("#assemble")[0].disabled = true;

    editor.setOptions({readOnly: true, highlightActiveLine: false, highlightGutterLine: false});
    inEditor.setOptions({readOnly: true, highlightActiveLine: false, highlightGutterLine: false});

    if(!isFin && cpu.isFinished) {
        outEditor.setValue(outEditor.getValue() + '\nKraj programa!');
        outEditor.selection.clearSelection();
    }

    $(".my-marker").removeClass('my-marker');
    if(asm.memToLine[cpu.pc.value] != undefined && asm.memToLine[cpu.pc.value] < $(`#editor .ace_line`).length)
        $(`#editor .ace_line:nth-child(${asm.memToLine[cpu.pc.value]+1})`).addClass('my-marker');

    renderMemory();
    renderRegisters();
});

$("#stop").on('click', () => {
    $(".my-marker").removeClass('my-marker');

    $("#start")[0].disabled = true;
    $("#step1")[0].disabled = true;
    $("#assemble")[0].disabled = false;
    $("#stop")[0].disabled = true;

    cpu.isFinished = true;

    ready = false;

    editor.setOptions({readOnly: false, highlightActiveLine: true, highlightGutterLine: true});
    inEditor.setOptions({readOnly: false, highlightActiveLine: true, highlightGutterLine: true});

    outEditor.setValue('');
});

const executeOne = () => {
    let isFin = cpu.isFinished;

    if(!cpu.executeInstruction()) {
        Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: `Neispravna instrukcija`
        });
        renderMemory();
        renderRegisters();
        return;
    }

    if(!isFin && cpu.isFinished) {
        outEditor.setValue(outEditor.getValue() + '\nKraj programa!');
        outEditor.selection.clearSelection();
    }

    $(".my-marker").removeClass('my-marker');
    if(asm.memToLine[cpu.pc.value] != undefined && asm.memToLine[cpu.pc.value] < $(`#editor .ace_line`).length)
        $(`#editor .ace_line:nth-child(${asm.memToLine[cpu.pc.value]+1})`).addClass('my-marker');

    renderMemory();
    renderRegisters();

    if(ready) setTimeout(executeOne, delay);
};

$("#start").on('click', () => {
    $("#stop")[0].disabled = false;
    $("#assemble")[0].disabled = true;
    $("#start")[0].disabled = true;
    $("#step1")[0].disabled = true;

    editor.setOptions({readOnly: true, highlightActiveLine: false, highlightGutterLine: false});
    inEditor.setOptions({readOnly: true, highlightActiveLine: false, highlightGutterLine: false});

    executeOne();
});

$("#runSpeed").change(() => {
    delay = 1010 - parseFloat($("#runSpeed").val());
});