export class SimulationService {

    constructor(program) {

        this.program = program;

        this.instructionIndex = 0;
        this.cycleIndex = 0;
    }

    getInstruction() {

        return this.program.instructions[
            this.instructionIndex
        ];
    }

    getCycle() {

        const instruction =
            this.getInstruction();

        if (!instruction) {
            return null;
        }

        return instruction.cycles[
            this.cycleIndex
        ];
    }

    applyEffect(effect) {

        if (!effect) {
            return;
        }

        if (
            effect.type === "register"
        ) {

            this.program.registers[
                effect.target
            ] = effect.value;
        }

        if (
            effect.type === "memory"
        ) {

            this.program.memory[
                effect.target
            ] = effect.value;
        }
    }

    nextCycle() {

        const instruction =
            this.getInstruction();

        if (!instruction) {
            return null;
        }

        const cycle =
            this.getCycle();

        if (!cycle) {
            return null;
        }

        this.applyEffect(
            cycle.effect
        );

        this.cycleIndex++;

        if (
            this.cycleIndex >=
            instruction.cycles.length
        ) {

            this.cycleIndex = 0;

            this.instructionIndex++;
        }

        return {
            instruction,
            cycle
        };
    }

    reset() {

        this.instructionIndex = 0;
        this.cycleIndex = 0;
    }

    nextInstruction() {

        const currentInstruction =
            this.instructionIndex;
    
        while (
            this.instructionIndex === currentInstruction
        ) {
    
            const result =
                this.nextCycle();
    
            if (!result) {
                break;
            }
        }
    
        return this.getInstruction();
    }
}