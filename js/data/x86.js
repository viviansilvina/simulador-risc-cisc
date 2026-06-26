export const x86Program = {
    architecture: "x86",

    code: [
        "MOV AX, [A]",
        "ADD AX, [B]",
        "MOV [C], AX",
        "HLT"
    ],

    memory: {
        A: 5,
        B: 3,
        C: 0
    },

    registers: {
        AX: 0
    },

    instructions: [

        {
            code: "MOV AX, [A]",

            cycles: [
                {
                    component: "x86-pc",
                    title: "FETCH",
                    description: "O PC aponta para MOV AX,[A]."
                },
                {
                    component: "x86-inst-memory",
                    title: "INSTRUCTION FETCH",
                    description: "A instrução é buscada."
                },
                {
                    component: "x86-decoder",
                    title: "DECODE",
                    description: "O decoder interpreta MOV."
                },
                {
                    component: "x86-microcode",
                    title: "MICROCODE",
                    description: "Microcódigo gera micro-operações."
                },
                {
                    component: "x86-agu",
                    title: "ADDRESS GENERATION",
                    description: "AGU calcula endereço de A."
                },
                {
                    component: "x86-memory",
                    title: "MEMORY READ",
                    description: "Valor encontrado: 5."
                },
                {
                    component: "x86-registers",
                    title: "WRITE REGISTER",
                    description: "AX recebe 5.",

                    effect: {
                        type: "register",
                        target: "AX",
                        value: 5
                    }
                }
            ]
        },

        {
            code: "ADD AX, [B]",

            cycles: [
                {
                    component: "x86-pc",
                    title: "FETCH",
                    description: "Buscando ADD."
                },
                {
                    component: "x86-inst-memory",
                    title: "INSTRUCTION FETCH",
                    description: "A instrução ADD é buscada da memória."
                },
                {
                    component: "x86-decoder",
                    title: "DECODE",
                    description: "ADD identificado."
                },
                {
                    component: "x86-microcode",
                    title: "MICROCODE",
                    description: "Micro-operações sendo geradas."
                },
                {
                    component: "x86-agu",
                    title: "ADDRESS GENERATION",
                    description: "Calculando endereço de B."
                },
                {
                    component: "x86-memory",
                    title: "MEMORY READ",
                    description: "Valor lido: 3."
                },
                {
                    component: "x86-alu",
                    title: "EXECUTE",
                    description: "ULA executa 5 + 3 = 8."
                },
                {
                    component: ["x86-alu", "x86-flags"],
                    title: "FLAGS UPDATE",
                    description: "ZF=0 CF=0 OF=0."
                },
                {
                    component: "x86-registers",
                    title: "WRITE REGISTER",
                    description: "AX recebe 8.",

                    effect: {
                        type: "register",
                        target: "AX",
                        value: 8
                    }
                }
            ]
        },

        {
            code: "MOV [C], AX",

            cycles: [
                {
                    component: "x86-pc",
                    title: "FETCH",
                    description: "Buscando MOV."
                },
                {
                    component: "x86-inst-memory",
                    title: "INSTRUCTION FETCH",
                    description: "MOV carregado da memória."
                },
                {
                    component: "x86-decoder",
                    title: "DECODE",
                    description: "MOV identificado."
                },
                {
                    component: "x86-microcode",
                    title: "MICROCODE",
                    description: "Micro-operações geradas."
                },
                {
                    component: "x86-registers",
                    title: "READ REGISTER",
                    description: "AX = 8 é lido do banco de registradores."
                },
                {
                    component: "x86-agu",
                    title: "ADDRESS GENERATION",
                    description: "Calculando endereço de C."
                },
                {
                    component: "x86-memory",
                    title: "MEMORY WRITE",
                    description: "Valor 8 armazenado em C.",

                    effect: {
                        type: "memory",
                        target: "C",
                        value: 8
                    }
                }
            ]
        },

        {
            code: "HLT",

            cycles: [
                {
                    component: "x86-pc",
                    title: "HALT",
                    description: "Execução encerrada."
                }
            ]
        }

    ]
};