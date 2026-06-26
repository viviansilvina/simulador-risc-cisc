console.log("APP JS CARREGOU");

// IMPORTS
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

// ESTADO GLOBAL
let currentProgram = structuredClone(mipsProgram);
let simulation = null;
let initialState = null;
let isRunning = false;
let stopRequested = false;

// ELEMENTOS DOM
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

// CONFIGURAÇÕES
const parallelComponents = {
    "mips-control": ["mips-registers", "mips-alu"],
    "mips-registers": ["mips-control", "mips-alu"],
    "mips-alu": ["mips-control", "mips-registers"],
    "x86-agu": ["x86-memory", "x86-alu"],
    "x86-alu": ["x86-agu", "x86-flags"],
    "x86-flags": ["x86-alu"]
};

// FUNÇÕES AUXILIARES

// Ativa componente principal e seus componentes paralelos
function activateComponentWithParallel(componentId) {
    let componentsToActivate = [componentId];
    
    const parallel = parallelComponents[componentId];
    if (parallel) {
        componentsToActivate = [...componentsToActivate, ...parallel];
    }
    
    activateComponent(componentsToActivate);
    activateLine(simulation.program.architecture.toLowerCase(), componentId);
}

// Função de delay para execução automática
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// FUNÇÕES DE RENDERIZAÇÃO

// Renderiza todos os elementos (assembly, registradores, memória)
function renderAll() {
    console.log("RENDER ALL");
    renderAssembly();
    renderRegisters(registersContainer, simulation.program.registers);
    renderMemory();
}

// Renderiza o código assembly com a instrução atual destacada
function renderAssembly() {
    console.log("RENDER ASSEMBLY | instructionIndex:", simulation.instructionIndex);
    
    const idx = simulation.instructionIndex;
    let html = "";
    
    simulation.program.code.forEach((line, index) => {
        html += index === idx ? `▶ ${line}\n` : `  ${line}\n`;
    });
    
    assemblyCode.textContent = html;
}

// Renderiza o conteúdo da memória
function renderMemory() {
    console.log("RENDER MEMORY");
    
    let html = "";
    Object.entries(simulation.program.memory).forEach(([address, value]) => {
        html += `
            <div>
                <strong>${address}</strong>: ${value}
            </div>
        `;
    });
    
    memoryContainer.innerHTML = html;
}

// FUNÇÕES DE CONTROLE DA SIMULAÇÃO

// BOTÃO INICIAR - Carrega a primeira instrução e mostra mensagem inicial
function startSimulation() {
    console.log("START SIMULATION");
    
    const instruction = simulation.program.instructions[simulation.instructionIndex];
    
    if (!instruction) {
        console.log("NENHUMA INSTRUÇÃO");
        return;
    }
    
    const firstCycle = instruction.cycles[0];
    
    console.log("INSTRUÇÃO ATUAL:", instruction.code);
    console.log("PRIMEIRO CICLO:", firstCycle);
    
    resetDatapath();
    activateComponentWithParallel(firstCycle.component);
    
    explanationContainer.innerHTML = `
        <h3>${instruction.code}</h3>
        <hr>
        <h4>Simulação Iniciada</h4>
        <p>A instrução foi carregada e o Program Counter (PC) está apontando para ela.</p>
        <p>Clique em <strong>Próximo Ciclo</strong> para acompanhar a execução passo a passo.</p>
        <div class="execution-info">
            <p>Aguardando execução...</p>
        </div>
    `;
    
    renderAssembly();
}

// BOTÃO PRÓXIMO CICLO - Avança um ciclo da instrução atual
function nextCycle() {
    console.log("NEXT CYCLE");
    
    const instructionIndex = simulation.instructionIndex;
    const cycleIndex = simulation.cycleIndex;
    const result = simulation.nextCycle();
    
    if (!result) {
        console.log("FIM DOS CICLOS");
        
        resetDatapath();
        explanationContainer.innerHTML = `
            <h3>Fim da Execução</h3>
            <hr>
            <p>Todas as instruções foram executadas.</p>
            <p>Os registradores e a memória exibem o estado final do programa.</p>
            <p>Clique em <strong>Resetar</strong> para voltar ao estado inicial.</p>
        `;
        
        return;
    }
    
    const { instruction, cycle } = result;
    
    console.log("INSTRUCTION INDEX SALVO:", instructionIndex);
    console.log("SIMULATION INDEX ATUAL:", simulation.instructionIndex);
    
    resetDatapath();
    
    if (cycle.component) {
        console.log("ATIVANDO:", cycle.component);
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
    renderRegisters(registersContainer, simulation.program.registers);
}

// BOTÃO PRÓXIMA INSTRUÇÃO - Avança até a próxima instrução completa
function nextInstruction() {
    console.log("NEXT INSTRUCTION");
    
    const currentInstruction = simulation.instructionIndex;
    console.log("INSTRUÇÃO ATUAL:", currentInstruction);
    
    let result;
    do {
        result = simulation.nextCycle();
        console.log("RESULT:", result);
        
        if (!result) {
            console.log("FIM DO PROGRAMA");
            return;
        }
    } while (simulation.instructionIndex === currentInstruction);
    
    console.log("NOVA INSTRUÇÃO:", simulation.instructionIndex);
    
    renderAll();
    
    const instruction = simulation.getInstruction();
    if (instruction) {
        const cycle = instruction.cycles[0];
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
    
    console.log("RENDER FINALIZADO");
}

// BOTÃO EXECUTAR TUDO - Executa automaticamente todas as instruções
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

// BOTÃO RESETAR - Volta ao estado inicial do programa
function resetSimulation() {
    console.log("RESET SIMULATION");
    
    stopRequested = true;
    isRunning = false;
    runAllButton.textContent = "Executar Tudo";
    
    simulation = new SimulationService(structuredClone(initialState));
    resetDatapath();
    renderAll();
    
    explanationContainer.innerHTML = "Simulação resetada.";
}

// FUNÇÕES DE ARQUITETURA

// Carrega arquitetura MIPS ou x86
function loadArchitecture(type) {
    console.log("LOAD ARCHITECTURE:", type);
    
    currentProgram = type === "mips"
        ? structuredClone(mipsProgram)
        : structuredClone(x86Program);
    
    simulation = new SimulationService(structuredClone(currentProgram));
    initialState = structuredClone(currentProgram);
    
    mipsButton.classList.toggle("active", type === "mips");
    x86Button.classList.toggle("active", type === "x86");
    
    document.getElementById("mips-datapath").classList.toggle("hidden", type !== "mips");
    document.getElementById("x86-datapath").classList.toggle("hidden", type !== "x86");
    
    resetDatapath();
    renderAll();
    
    explanationContainer.innerHTML = "Arquitetura carregada. Clique em Iniciar.";
}

// EVENTOS

// Registra todos os event listeners dos botões
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

// INICIALIZAÇÃO

// Inicializa a aplicação
function initialize() {
    console.log("INITIALIZE");
    document.body.classList.add("dark-theme");
    loadArchitecture("mips");
    bindEvents();
}

initialize();