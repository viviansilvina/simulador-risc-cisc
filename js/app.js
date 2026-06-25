console.log("APP JS CARREGOU");

import { mipsProgram } from "./data/mips.js";
import { x86Program } from "./data/x86.js";

import { SimulationService } from "./services/simulationService.js";
import { toggleTheme } from "./services/themService.js";

import {
    activateComponent,
    activateLine,
    resetDatapath
} from "./ui/datapathRenderer.js";

import { renderExplanation } from "./ui/explanationRenderer.js";
import { renderRegisters } from "./ui/registerRenderer.js";

let currentProgram = structuredClone(mipsProgram);
let simulation = null;
let initialState = null;

let isRunning = false;
let stopRequested = false;

// DOM
const assemblyCode = document.getElementById("assembly-code");
const explanationContainer = document.getElementById("explanation-container");
const registersContainer = document.getElementById("registers-container");
const memoryContainer = document.getElementById("memory-container");

const mipsButton = document.getElementById("mips-btn");
const x86Button = document.getElementById("x86-btn");

const startButton = document.getElementById("start-btn");
const nextCycleButton = document.getElementById("next-cycle-btn");
const nextInstructionButton = document.getElementById("next-instruction-btn");
const resetButton = document.getElementById("reset-btn");
const runAllButton = document.getElementById("run-all-btn");
const themeToggleButton = document.getElementById("theme-toggle");

// Mapeamento de componentes que trabalham em paralelo
const parallelComponents = {
    // MIPS
    "mips-control": ["mips-registers", "mips-alu"],
    "mips-registers": ["mips-control", "mips-alu"],
    "mips-alu": ["mips-control", "mips-registers"],
    
    // x86
    "x86-agu": ["x86-memory", "x86-alu"],
    "x86-alu": ["x86-agu", "x86-flags"],
    "x86-flags": ["x86-alu"]
};

function activateComponentWithParallel(componentId) {
    // Pega o componente principal
    let componentsToActivate = [componentId];
    
    // Adiciona componentes paralelos se existirem
    const parallel = parallelComponents[componentId];
    if (parallel) {
        componentsToActivate = [...componentsToActivate, ...parallel];
    }
    
    // Ativa todos juntos
    activateComponent(componentsToActivate);
    
    // Ativa as linhas do componente principal
    activateLine(simulation.program.architecture.toLowerCase(), componentId);
}

initialize();

function initialize() {
    console.log("INITIALIZE");

    document.body.classList.add("dark-theme");

    loadArchitecture("mips");
    bindEvents();
}

function bindEvents() {
    console.log("BIND EVENTS");

    mipsButton.addEventListener("click", () => loadArchitecture("mips"));
    x86Button.addEventListener("click", () => loadArchitecture("x86"));

    startButton?.addEventListener("click", startSimulation);
    nextCycleButton.addEventListener("click", nextCycle);
    nextInstructionButton.addEventListener("click", nextInstruction);
    resetButton.addEventListener("click", resetSimulation);
    runAllButton.addEventListener("click", runAll);

    themeToggleButton.addEventListener("click", toggleTheme);
}

function loadArchitecture(type) {

    console.log("LOAD ARCHITECTURE:", type);

    currentProgram =
        type === "mips"
            ? structuredClone(mipsProgram)
            : structuredClone(x86Program);

    simulation = new SimulationService(structuredClone(currentProgram));

    // 🔥 estado inicial REAL correto
    initialState = structuredClone(currentProgram);

    mipsButton.classList.toggle("active", type === "mips");
    x86Button.classList.toggle("active", type === "x86");

    document.getElementById("mips-datapath").classList.toggle("hidden", type !== "mips");
    document.getElementById("x86-datapath").classList.toggle("hidden", type !== "x86");

    resetDatapath();
    renderAll();

    explanationContainer.innerHTML =
        "Arquitetura carregada. Clique em Iniciar.";
}

function renderAll() {

    console.log("RENDER ALL");

    renderAssembly();

    renderRegisters(
        registersContainer,
        simulation.program.registers
    );

    renderMemory();
}

function renderAssembly() {

    console.log(
        "RENDER ASSEMBLY | instructionIndex:",
        simulation.instructionIndex
    );

    const idx = simulation.instructionIndex;

    let html = "";

    simulation.program.code.forEach((line, index) => {

        html +=
            index === idx
                ? `▶ ${line}\n`
                : `  ${line}\n`;
    });

    assemblyCode.textContent = html;
}

function renderMemory() {

    console.log("RENDER MEMORY");

    let html = "";

    Object.entries(simulation.program.memory)
        .forEach(([address, value]) => {

            html += `
                <div>
                    <strong>${address}</strong>: ${value}
                </div>
            `;
        });

    memoryContainer.innerHTML = html;
}

function startSimulation() {

    console.log("START SIMULATION");

    const instruction =
        simulation.program.instructions[
            simulation.instructionIndex
        ];

    if (!instruction) {

        console.log("NENHUMA INSTRUÇÃO");

        return;
    }

    const firstCycle = instruction.cycles[0];

    console.log(
        "INSTRUÇÃO ATUAL:",
        instruction.code
    );

    console.log(
        "PRIMEIRO CICLO:",
        firstCycle
    );

    resetDatapath();

    activateComponentWithParallel(firstCycle.component);

    explanationContainer.innerHTML = `
        <h3>${instruction.code}</h3>

        <hr>

        <h4>Simulação Iniciada</h4>

        <p>
            A instrução foi carregada e o Program Counter (PC)
            está apontando para ela.
        </p>

        <p>
            Clique em <strong>Próximo Ciclo</strong>
            para acompanhar a execução passo a passo.
        </p>

        <div class="execution-info">

            <p>
                Aguardando execução...
            </p>

        </div>
    `;

    renderAssembly();
}

function nextCycle() {

    console.log("NEXT CYCLE");

    const instructionIndex =
        simulation.instructionIndex;

    const cycleIndex =
        simulation.cycleIndex;

    const result =
        simulation.nextCycle();

        if (!result) {

            console.log("FIM DOS CICLOS");
        
            resetDatapath();
        
            explanationContainer.innerHTML = `
                <h3>Fim da Execução</h3>
        
                <hr>
        
                <p>
                    Todas as instruções foram executadas.
                </p>
        
                <p>
                    Os registradores e a memória exibem o estado final do programa.
                </p>
        
                <p>
                    Clique em <strong>Resetar</strong>
                    para voltar ao estado inicial.
                </p>
            `;
        
            return;
        }
    const { instruction, cycle } = result;

    console.log(
        "INSTRUCTION INDEX SALVO:",
        instructionIndex
    );

    console.log(
        "SIMULATION INDEX ATUAL:",
        simulation.instructionIndex
    );

    resetDatapath();

    if (cycle.component) {

        console.log(
            "ATIVANDO:",
            cycle.component
        );

        activateComponentWithParallel(cycle.component);
    }

    renderExplanation(
        explanationContainer,
        instruction,
        cycle,
        instructionIndex,
        simulation.program.instructions.length,
        cycleIndex,
        instruction.cycles.length
    );

    renderAssembly();
    renderMemory();

    renderRegisters(
        registersContainer,
        simulation.program.registers
    );
}

function nextInstruction() {

    console.log("NEXT INSTRUCTION");

    const currentInstruction =
        simulation.instructionIndex;

    console.log(
        "INSTRUÇÃO ATUAL:",
        currentInstruction
    );

    let result;

    do {

        result = simulation.nextCycle();

        console.log(
            "RESULT:",
            result
        );

        if (!result) {

            console.log(
                "FIM DO PROGRAMA"
            );

            return;
        }

    } while (
        simulation.instructionIndex ===
        currentInstruction
    );

    console.log(
        "NOVA INSTRUÇÃO:",
        simulation.instructionIndex
    );

    renderAll();

    const instruction =
        simulation.getInstruction();

    if (instruction) {

        const cycle =
            instruction.cycles[0];

        renderExplanation(
            explanationContainer,
            instruction,
            cycle,
            simulation.instructionIndex,
            simulation.program.instructions.length,
            0,
            instruction.cycles.length
        );

    }

    console.log(
        "RENDER FINALIZADO"
    );
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAll() {

    if (isRunning) {
        console.log("PAUSANDO EXECUÇÃO");
        stopRequested = true;
        isRunning = false;
        runAllButton.textContent = "Executar Tudo";
        return;
    }

    console.log("INICIANDO EXECUÇÃO AUTOMÁTICA");

    isRunning = true;
    stopRequested = false;
    runAllButton.textContent = "Pausar";

    resetDatapath();

    while (!stopRequested) {

        const result = simulation.nextCycle();

        if (!result) {
            console.log("FIM DA EXECUÇÃO");

            break;
        }

        const { instruction, cycle } = result;

        const instructionIndex = simulation.instructionIndex;
        const cycleIndex = simulation.cycleIndex;

        resetDatapath();

        if (cycle.component) {
            activateComponentWithParallel(cycle.component);
        }

        renderExplanation(
            explanationContainer,
            instruction,
            cycle,
            instructionIndex,
            simulation.program.instructions.length,
            cycleIndex,
            instruction.cycles.length
        );

        renderAssembly();
        renderRegisters(registersContainer, simulation.program.registers);
        renderMemory();

        await new Promise(r => setTimeout(r, 900));
    }

    isRunning = false;
    stopRequested = false;
    runAllButton.textContent = "Executar Tudo";

    resetDatapath();

    explanationContainer.innerHTML = `
        <h3>Fim da Execução</h3>
        <hr>
        <p>Execução automática finalizada.</p>
    `;
}

function resetSimulation() {

    console.log("RESET SIMULATION");

    stopRequested = true;
    isRunning = false;
    runAllButton.textContent = "Executar Tudo";

    simulation = new SimulationService(structuredClone(initialState));

    resetDatapath();
    renderAll();

    explanationContainer.innerHTML =
        "Simulação resetada.";
}