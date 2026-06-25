export function activateComponent(componentId) {
    document.querySelectorAll(".component").forEach(component => {
        if (component.classList.contains("component-active")) {
            component.classList.remove("component-active");
            component.classList.add("component-completed");
        }
    });

    const component = document.getElementById(componentId);
    if (!component) return;
    component.classList.add("component-active");
}

export function activateLine(architecture, componentId) {
    document.querySelectorAll(".path-line").forEach(line => {
        if (line.classList.contains("path-line-active")) {
            line.classList.remove("path-line-active");
            line.classList.add("path-line-completed");
        }
    });

    // MIPS: cada componente pode ter múltiplas linhas
    const mipsMap = {
        "mips-pc": ["mips-line-1"],
        "mips-inst-memory": ["mips-line-2"],
        "mips-control": ["mips-line-3", "mips-line-control-alu-1", "mips-line-control-alu-2", "mips-line-control-alu-3"],
        "mips-registers": ["mips-line-4", "mips-line-4b", "mips-line-5"],
        "mips-alu": ["mips-line-alu-mem-1", "mips-line-alu-mem-2"],
        "mips-data-memory": ["mips-line-mem-reg-1", "mips-line-mem-reg-2", "mips-line-mem-reg-3"]
    };

    // x86: cada componente pode ter múltiplas linhas
    const x86Map = {
        "x86-pc": ["x86-line-1"],
        "x86-inst-memory": ["x86-line-2"],
        "x86-decoder": ["x86-line-3"],
        "x86-microcode": ["x86-line-4"],
        "x86-agu": ["x86-line-agu-mem-1", "x86-line-agu-mem-2", "x86-line-agu-alu"],
        "x86-memory": ["x86-line-mem-reg-1", "x86-line-mem-reg-2"],
        "x86-alu": ["x86-line-7", "x86-line-alu-reg-1", "x86-line-alu-reg-2"],
        "x86-flags": [],
        "x86-registers": ["x86-line-reg-agu"]
    };

    const map = architecture === "mips" ? mipsMap : x86Map;
    const lineIds = map[componentId];

    if (!lineIds || lineIds.length === 0) return;

    lineIds.forEach(id => {
        const line = document.getElementById(id);
        if (line) {
            line.classList.add("path-line-active");
        }
    });
}

export function resetDatapath() {
    document.querySelectorAll(".component").forEach(component => {
        component.classList.remove("component-active", "component-completed");
    });

    document.querySelectorAll(".path-line").forEach(line => {
        line.classList.remove("path-line-active", "path-line-completed");
    });
}