export function renderRegisters(
    container,
    registers
) {

    let html = "";

    Object.entries(registers)
        .forEach(([register, value]) => {

            html += `
                <div class="register-item">
                    <strong>${register}</strong>
                    <span>${value}</span>
                </div>
            `;

        });

    container.innerHTML = html;
}