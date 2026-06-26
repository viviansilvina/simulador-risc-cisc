export function activateComponent(componentIds) {
    document.querySelectorAll(".component").forEach(c => {
        c.classList.remove("component-active", "component-completed", "component-parallel");
    });

    const components = Array.isArray(componentIds) ? componentIds : [componentIds];

    components.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("component-active");
    });

    if (components.length > 1) {
        components.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add("component-parallel");
        });
    }
}

// Mapeia cada linha para os componentes que ela conecta (origem e destino)
// Mapeamento simplificado: 1 componente = 1 linha principal
const simpleLineMap = {
    // MIPS
    "mips-pc": ["mips-line-1"],           // PC -> Inst Memory
    "mips-inst-memory": ["mips-line-2"],  // Inst Memory -> Control
    "mips-control": ["mips-line-3"],      // Control -> Registers (sinal)
    "mips-registers": ["mips-line-4"],    // Registers -> ALU
    "mips-alu": ["mips-line-5"],          // ALU -> Data Memory (endereço)
    "mips-data-memory": ["mips-line-mem-reg-1"], // Data Memory -> Registers (dado)
    
    // x86 (adapte os IDs conforme seu SVG)
    "x86-pc": ["x86-line-1"],
    "x86-inst-memory": ["x86-line-2"],
    "x86-decoder": ["x86-line-3"],
    "x86-microcode": ["x86-line-4"],
    "x86-agu": ["x86-line-agu-mem-1"],
    "x86-memory": ["x86-line-mem-reg-1"],
    "x86-alu": ["x86-line-7"],
    "x86-flags": [], // Flags não tem linha de fluxo principal
    "x86-registers": ["x86-line-reg-agu"]
};

// Mapeamento de quais linhas cada componente PODE ativar
const mipsMap = {
    "mips-pc": ["mips-line-1"],
    "mips-inst-memory": ["mips-line-2"],
    "mips-control": ["mips-line-3", "mips-line-control-alu-1", "mips-line-control-alu-2", "mips-line-control-alu-3"],
    "mips-registers": ["mips-line-4", "mips-line-4b", "mips-line-mem-reg-1", "mips-line-mem-reg-2", "mips-line-mem-reg-3"],
    "mips-alu": ["mips-line-5", "mips-line-alu-mem-1", "mips-line-alu-mem-2"],
    "mips-data-memory": ["mips-line-mem-reg-1", "mips-line-mem-reg-2", "mips-line-mem-reg-3"]
};

const x86Map = {
    "x86-pc": ["x86-line-1"],
    "x86-inst-memory": ["x86-line-2"],
    "x86-decoder": ["x86-line-3"],
    "x86-microcode": ["x86-line-4"],
    "x86-agu": ["x86-line-agu-mem-1", "x86-line-agu-mem-2", "x86-line-agu-alu", "x86-line-reg-agu"],
    "x86-memory": ["x86-line-mem-reg-1", "x86-line-mem-reg-2"],
    "x86-alu": ["x86-line-7", "x86-line-alu-reg-1", "x86-line-alu-reg-2"],
    "x86-flags": [],
    "x86-registers": ["x86-line-reg-agu"]
};

export function activateLine(architecture, componentIdOrArray) {
    // Limpa TUDO antes de desenhar
    document.querySelectorAll(".path-line").forEach(line => {
        line.classList.remove("path-line-active", "path-line-completed");
    });

    const map = architecture === "mips" ? simpleLineMap : x86SimpleLineMap;
    
    // Se for array, pega o primeiro componente como referência da linha
    const primaryComponent = Array.isArray(componentIdOrArray) 
        ? componentIdOrArray[0] 
        : componentIdOrArray;

    const lineIds = map[primaryComponent];
    if (!lineIds) return;

    lineIds.forEach(id => {
        const line = document.getElementById(id);
        if (line) line.classList.add("path-line-active");
    });
}

export function resetDatapath() {
    document.querySelectorAll(".component").forEach(component => {
        component.classList.remove("component-active", "component-completed", "component-parallel");
    });

    document.querySelectorAll(".path-line").forEach(line => {
        line.classList.remove("path-line-active", "path-line-completed");
    });
}