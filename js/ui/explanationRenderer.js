export function renderExplanation(
    container,
    instruction,
    cycle,
    instructionIndex,
    totalInstructions,
    cycleIndex,
    totalCycles
) {

    console.log(
        "RENDER EXPLANATION",
        instructionIndex,
        totalInstructions
    );

    container.innerHTML = `
        <h3>${instruction.code}</h3>

        <hr>

        <h4>${cycle.title}</h4>

        <p>${cycle.description}</p>

        <div class="execution-info">

            <p>
                Instrução <strong>
                ${Math.min(
                    instructionIndex + 1,
                    totalInstructions
                )} </strong>
                de
                ${totalInstructions}
            </p>

            <p>
                Ciclo <strong>
                ${cycleIndex + 1} </strong>
                de
                ${totalCycles}
            </p>

        </div>
    `;
}