import { Assembler, CPU } from "./cpu_utils.js";
import * as utils from "./utils.js";

let text = 
`MOV R1 100
MOV R2 150
ADD R0 R1 R2` 

let asm = new Assembler(text);
let cpu = new CPU(asm.memory);

const renderMemory = () => {
    $("#ram").html(``);
    $("#ram").append(`<tr><td></td>${Array.from(new Array(16).keys()).map(i => `<td class='addr'>_${i.toString(16).toUpperCase()}</td>`).join('')}</tr>`)
    $("#ram").append(cpu.memory.getHexValues().map((i, ind) => `<tr><td class='addr'>${ind.toString(16).toUpperCase()}_</td>${i.map(j => `<td class='cell'>${j.toUpperCase()}</td>`)}</tr>`))
};

const renderRegisters = () => {
    $("#regs").html(``);
    cpu.regs.forEach((val, ind) => {
        $("#regs").append(`<tr><td class='addr'>R${ind.toString(16).toUpperCase()}</td><td class='cell'>${val.getHexVal()}</td></tr>`);
    });
    $("#regs tr:nth-child(1)").append($(`<td class='empty'></td><td class='addr'>AK</td><td class='cell'>${cpu.ac.getHexVal()}</td>`));
    $("#regs tr:nth-child(2)").append($(`<td class='empty'></td><td class='addr'>PR</td><td class='cell'>${cpu.dr.getHexVal()}</td>`));
    $("#regs tr:nth-child(4)").append($(`<td class='empty'></td><td class='addr'>BN</td><td class='cell'>${cpu.pc.getHexVal().slice(0, 2)}</td><td class='cell'>${cpu.pc.getHexVal().slice(2)}</td>`));
    $("#regs tr:nth-child(5)").append($(`<td class='empty'></td><td class='addr'>RN</td><td class='cell'>${cpu.ir.getHexVal().slice(0, 2)}</td><td class='cell'>${cpu.ir.getHexVal().slice(2)}</td>`));
    $("#regs tr:nth-child(7)").append($(`<td class='empty'></td><td class='addr'>RS</td><td class='cell'>${cpu.sr.getHexVal()}</td>`));
};

const syntaxHighlight = () => {
    const keywords = ["add", "sub", "and", "or", "xor", "mul", "div", "cmp", "ld", "mov", "st", "shr", "ror", "not", "neg", "jmp", "je", "jne", "jg", "jge", "jl", "jle", "in", "out", "halt"];
    const regwords = ["ac", "dr"];
    for(let i=0;i<15;i++) regwords.push(`r${i.toString(16)}`);
    let text = $("#code")[0].innerText.split('\n');
    text = text.map(line => {
        return `<div>${line.split(' ').map(word => {
            if(keywords.includes(word.toLowerCase().trim())) return `<span class="keyword">${word}</span>`;
            if(regwords.includes(word.toLowerCase().trim())) return `<span class="regword">${word}</span>`;
            if(/^([0-9]+|0b[0-1]+|0x[0-9A-F]+)$/i.test(word.trim())) return `<span class="numword">${word}</span>`;
            if(/^\[[A-Z0-9]+\]$/i.test(word.trim())) return `<span class="braword">${word}</span>`;
            if(/^[A-Z]+:$/i.test(word.trim())) return `<span class="lblword">${word}</span>`;
            return word;
        }).join(' ')}</div>`;
    }).join('');
    $("#codeOver").html(text);
};

$("#code").on('keyup', (e) => {
    syntaxHighlight();
});

$("#code").on('scroll', (e) => {
    $("#codeOver")[0].scrollTop = $("#code")[0].scrollTop;
});

renderMemory();
renderRegisters();