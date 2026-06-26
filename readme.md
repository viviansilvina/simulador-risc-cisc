# Simulador RISC x CISC

> **MVP** de um simulador educacional interativo que visualiza o **Datapath** (caminho dos dados) de processadores **MIPS (RISC)** e **x86 (CISC)** em tempo real, executando uma operação de soma simples `C = A + B`.

---

## Sobre o Projeto

Este simulador foi desenvolvido como parte de um trabalho acadêmico de **Arquitetura e Organização de Computadores**, com o objetivo de demonstrar na prática a diferença filosófica entre as arquiteturas RISC e CISC.

Enquanto emuladores tradicionais como **MARS** e **emu8086** mostram apenas o código Assembly e os registradores, este simulador vai além: ele desenha o hardware por dentro, mostrando quais componentes (PC, Memória, ULA, Registradores, etc.) estão ativos em cada ciclo de execução.

### O que ele prova?

A frase clássica do livro *Arquitetura e Organização de Computadores* de **William Stallings**:

> "RISC simplifica o hardware e complica o compilador. CISC complica o hardware para simplificar o código."

---

## Limitações Atuais (MVP Estático)

Este simulador é um **Produto Mínimo Viável (MVP) focado em demonstração educacional**. Atualmente, ele opera de forma estática, ou seja:

- O código Assembly é pré-definido (`C = A + B`).
- Não há editor de código integrado para digitar novas instruções.
- Os valores de memória e registradores são fixos no exemplo.

O objetivo principal deste MVP é permitir a visualização clara do Datapath RISC E CISC.

### Próximos Passos (Roadmap)

Para tornar o simulador totalmente interativo no futuro, planeja-se implementar:

- Editor de código Assembly integrado com destaque de sintaxe.
- Parser/Assembler interno para traduzir texto digitado em micro-operações.
- Definição dinâmica de variáveis e endereços de memória pelo usuário.
- Suporte a mais instruções além das básicas de soma e load/store.
- Visualização de pipeline e hazards de dados.

---

## Tecnologias

- **HTML5** (estrutura e SVG para o Datapath)
- **CSS3** (estilização, temas claro/escuro, animações)
- **JavaScript (ES6 Modules)** (lógica de simulação e renderização)

---

## Funcionalidades

- Duas arquiteturas: MIPS (RISC) e x86 (CISC)
- Datapath visual em SVG com componentes interativos
- Animação em tempo real do fluxo de dados
- Cores dinâmicas:
  - Azul: componente ativo isolado
  - Laranja: processamento paralelo (múltiplos componentes ativos)
  - Verde: componente/caminho já completado
- Linhas tracejadas animadas mostrando o caminho dos dados
- Tema claro e escuro
- Controles de execução: Iniciar, Próximo Ciclo, Próxima Instrução, Executar Tudo, Resetar
- Painéis laterais: Código Assembly, Registradores, Memória e Explicação passo a passo

---

## Como Rodar

### Importante: Módulos ES6

O projeto utiliza **ES6 Modules** (`import` e `export`) no JavaScript. Por motivos de segurança (política CORS), os navegadores modernos bloqueiam o carregamento de módulos locais se você simplesmente abrir o arquivo `index.html` clicando duas vezes nele. É obrigatório rodar o projeto através de um servidor local.

### Opção 1: VS Code com Live Server (Recomendado)

Se você utiliza o Visual Studio Code, a forma mais rápida e prática de rodar o projeto é utilizando a extensão **Live Server**:

1. Abra o projeto no VS Code.
2. Vá até a aba de Extensões (ícone de blocos na barra lateral esquerda).
3. Pesquise por "Live Server" (desenvolvida por Ritwick Dey) e instale-a.
4. Após a instalação, clique com o botão direito no arquivo `index.html` no explorador de arquivos.
5. Selecione a opção **"Open with Live Server"**.
6. O navegador abrirá automaticamente em `http://127.0.0.1:5500` (ou outra porta local).

### Opção 2: Python (Nativo)

Se você tem o Python instalado no seu sistema, pode subir um servidor local rapidamente pelo terminal:

1. Abra o terminal na pasta raiz do projeto.
2. Execute o comando:
   ```bash
   python3 -m http.server 5500
   ```
3. Acesse no navegador: `http://localhost:5500`

### Opção 3: Node.js com http-server

Se preferir usar Node.js:

1. Instale o pacote globalmente (se ainda não tiver):
   ```bash
   npm install -g http-server
   ```
2. Na pasta raiz do projeto, execute:
   ```bash
   http-server -p 5500
   ```
3. Acesse no navegador: `http://localhost:5500`

---

## Estrutura do Projeto

```text
simulador-risc-cisc/
│
├── index.html                  # Página principal
├── css/
│   ├── animations/
│   │   └── animations.css      # Animações (pulse, flow, etc.)
│   ├── base/
│   │   ├── reset.css           # Reset/normalize CSS
│   │   └── themes.css          # Temas claro e escuro
│   ├── components/
│   │   ├── architecture.css    # Botões de seleção RISC/CISC
│   │   ├── assembly.css        # Código Assembly
│   │   ├── controls.css        # Botões de controle (Iniciar, Resetar...)
│   │   ├── datapath.css        # SVG do Datapath e componentes
│   │   ├── info.css            # Cards de estado atual
│   │   └── panel.css           # Painéis laterais
│   ├── layout/
│   │   ├── container.css       # Container principal
│   │   ├── grid.css            # Grid de 3 colunas
│   │   └── header.css          # Cabeçalho
│   ├── responsive/
│   │   └── responsive.css      # Media queries (mobile)
│   └── style.css               # Arquivo principal (imports)
├── js/
│   ├── app.js                  # Controlador principal da aplicação
│   ├── data/
│   │   ├── mips.js             # Programa MIPS (lw, add, sw)
│   │   └── x86.js              # Programa x86 (MOV, ADD, HLT)
│   ├── services/
│   │   ├── simulationService.js # Motor de simulação (lógica de ciclos)
│   │   └── themService.js       # Alternância de tema (claro/escuro)
│   └── ui/
│       ├── datapathRenderer.js  # Renderização e animação do Datapath
│       ├── explanationRenderer.js # Renderização do painel de explicação
│       └── registerRenderer.js  # Renderização do painel de registradores
└── README.md
```

---

## Arquiteturas Simuladas

### MIPS (RISC)

**Código executado:**
```asm
lw  $t0, A          # Carrega A da memória
lw  $t1, B          # Carrega B da memória
add $t2, $t0, $t1   # Soma registradores
sw  $t2, C          # Salva resultado
```

### x86 (CISC)

**Código executado:**
```asm
MOV AX, [A]   # Carrega A
ADD AX, [B]   # Soma direto da memória
MOV [C], AX   # Salva resultado
HLT           # Para execução
```

---

## Como Usar o Simulador

1. Escolha a arquitetura no topo da página (MIPS ou x86).
2. Clique em **Iniciar** para começar a simulação da primeira instrução.
3. Use **Próximo Ciclo** para avançar passo a passo e ver cada componente acendendo conforme o dado flui pelo hardware.
4. Use **Próxima Instrução** para pular direto para a próxima linha do código Assembly.
5. Use **Executar Tudo** para rodar a simulação automaticamente (clique novamente no botão para pausar).
6. Use **Resetar** para limpar o estado e voltar ao início.
7. Clique em **Alternar Tema** no canto superior direito para mudar entre o modo claro e escuro.

---

## Componentes do Datapath

### MIPS
- **PC** (Program Counter): Ponteiro da próxima instrução.
- **Mem. Instruções**: Onde o código Assembly está armazenado.
- **Controle**: Unidade que decodifica e envia sinais para os outros componentes.
- **Registradores**: Banco de memória ultra-rápida dentro da CPU.
- **ULA** (Unidade Lógica e Aritmética): A "calculadora" do processador.
- **Mem. Dados**: Memória RAM para leitura e escrita de variáveis.

### x86 (componentes extras)
- **Decoder**: Decodificador de instrução, responsável por interpretar códigos complexos.
- **Microcódigo**: Tradutor interno que quebra instruções complexas em micro-operações simples.
- **AGU** (Unidade de Geração de Endereço): Calcula endereços de memória complexos.
- **FLAGS**: Registradores de status (Zero Flag, Carry Flag, Overflow Flag) que indicam o resultado da última operação da ULA.

---

## Contexto Acadêmico

Este projeto demonstra conceitos fundamentais estudados na disciplina de Organização de Computadores:

- Ciclo de instrução (Fetch -> Decode -> Execute -> Memory -> Write Back).
- Filosofia Load/Store (RISC).
- Microprogramação e decodificação complexa (CISC).
- Datapath e sinais de controle.
- Processamento paralelo em hardware (quando múltiplos componentes trabalham simultaneamente).

---

## Créditos

Desenvolvido como trabalho acadêmico de **Arquitetura e Organização de Computadores**.

**Referência principal:**
> STALLINGS, William. *Arquitetura e Organização de Computadores*. 10ª ed. São Paulo: Pearson, 2017.

---

## Licença

Projeto educacional de código aberto. Use livremente para fins acadêmicos e de estudo.