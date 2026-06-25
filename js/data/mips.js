export const mipsProgram = {
    architecture: "MIPS",

    code: [
        "lw $t0, A",
        "lw $t1, B",
        "add $t2, $t0, $t1",
        "sw $t2, C"
    ],

    memory: {
        A: 5,
        B: 3,
        C: 0
    },

    registers: {
        "$t0": 0,
        "$t1": 0,
        "$t2": 0
    },

    instructions: [

        {
            code: "lw $t0, A",

            cycles: [
                {
                    component: "mips-pc",
                    title: "FETCH",
                    description: "O PC aponta para a instrução lw $t0, A."
                },
                {
                    component: "mips-inst-memory",
                    title: "INSTRUCTION MEMORY",
                    description: "A instrução é buscada na memória."
                },
                {
                    component: "mips-control",
                    title: "DECODE",
                    description: "A Unidade de Controle identifica uma operação LOAD."
                },
                {
                    component: "mips-alu",
                    title: "ADDRESS CALCULATION",
                    description: "A ULA calcula o endereço da variável A."
                },
                {
                    component: "mips-data-memory",
                    title: "MEMORY READ",
                    description: "A memória retorna o valor 5."
                },
                {
                    component: "mips-registers",
                    title: "WRITE BACK",
                    description: "$t0 recebe o valor 5.",

                    effect: {
                        type: "register",
                        target: "$t0",
                        value: 5
                    }
                }
            ]
        },

        {
            code: "lw $t1, B",

            cycles: [
                {
                    component: "mips-pc",
                    title: "FETCH",
                    description: "O PC aponta para lw $t1, B."
                },
                {
                    component: "mips-inst-memory",
                    title: "INSTRUCTION MEMORY",
                    description: "A instrução é carregada."
                },
                {
                    component: "mips-control",
                    title: "DECODE",
                    description: "LOAD identificado."
                },
                {
                    component: "mips-alu",
                    title: "ADDRESS CALCULATION",
                    description: "Calculando endereço de B."
                },
                {
                    component: "mips-data-memory",
                    title: "MEMORY READ",
                    description: "Valor encontrado: 3."
                },
                {
                    component: "mips-registers",
                    title: "WRITE BACK",
                    description: "$t1 recebe 3.",

                    effect: {
                        type: "register",
                        target: "$t1",
                        value: 3
                    }
                }
            ]
        },

        {
            code: "add $t2, $t0, $t1",

            cycles: [
                {
                    component: "mips-pc",
                    title: "FETCH",
                    description: "Buscando instrução ADD."
                },
                {
                    component: "mips-inst-memory",
                    title: "INSTRUCTION MEMORY",
                    description: "ADD carregado."
                },
                {
                    component: "mips-control",
                    title: "DECODE",
                    description: "Operação aritmética identificada."
                },
                {
                    component: "mips-registers",
                    title: "READ REGISTERS",
                    description: "$t0 = 5 e $t1 = 3 são enviados para a ULA."
                },
                {
                    component: "mips-alu",
                    title: "EXECUTE",
                    description: "ULA executa 5 + 3 = 8."
                },
                {
                    component: "mips-registers",
                    title: "WRITE BACK",
                    description: "$t2 recebe 8.",

                    effect: {
                        type: "register",
                        target: "$t2",
                        value: 8
                    }
                }
            ]
        },

        {
            code: "sw $t2, C",

            cycles: [
                {
                    component: "mips-pc",
                    title: "FETCH",
                    description: "Buscando SW."
                },
                {
                    component: "mips-inst-memory",
                    title: "INSTRUCTION MEMORY",
                    description: "SW carregado."
                },
                {
                    component: "mips-control",
                    title: "DECODE",
                    description: "STORE identificado."
                },
                {
                    component: "mips-registers",
                    title: "READ REGISTER",
                    description: "$t2 = 8."
                },
                {
                    component: "mips-data-memory",
                    title: "MEMORY WRITE",
                    description: "Valor 8 armazenado em C.",

                    effect: {
                        type: "memory",
                        target: "C",
                        value: 8
                    }
                }
            ]
        }

    ]
};