# Fundos por Letra (`fundos-por-letra`)

Plugin para o **sPresenter** que permite vincular automaticamente fundos (vídeos, imagens ou apresentações) a músicas específicas. Ao colocar uma música ao vivo, o fundo configurado entra automaticamente na camada (`layer`) definida, prevenindo recarregamentos desnecessários durante a troca de estrofes/slides.

---

## 🎯 Objetivo

Automatizar a troca de fundos visuais de acordo com a música em exibição no sPresenter (comportamento similar ao Holyrics), permitindo configurar a camada de exibição e garantindo reprodução contínua e sem interrupções.

---

## 🛠️ Tecnologias e Ferramentas

- **Linguagem & Frameworks:** TypeScript, React 18, Tailwind CSS, PostCSS
- **Bundler / Build:** Vite (configurações separadas para `code` em background e `ui`)
- **SDK:** `@spresenter/plugin-sdk` (comunicação com a API de live, assets, storage e UI Kit)
- **IDE:** WebStorm (JetBrains)
- **Assistente de IA:** Junie (JetBrains Autonomous Agent powered by `gemini-3.7-flash`)

---

## 📂 Estrutura do Projeto

```
fundos-por-letra/
├── manifest.json              # Manifesto do plugin (permissões, endpoints e metadados)
├── package.json               # Dependências e scripts de build/desenvolvimento
├── vite.code.config.ts        # Configuração do Vite para o bundle de background (code.ts)
├── vite.ui.config.ts          # Configuração do Vite para o painel de interface (UI)
├── scripts/
│   └── package.mjs            # Script para gerar pacote compactado (.zip) do plugin
├── sdk/
│   └── spresenter-plugin-sdk.tgz  # SDK local do sPresenter
├── src/
│   ├── code.ts                # Lógica em background (escuta evento live, gerencia storage e API)
│   └── ui/                    # Interface gráfica do plugin
│       ├── App.tsx            # Componente raiz, controle de estado e mensagens
│       ├── main.tsx           # Ponto de entrada React da UI
│       └── components/
│           └── MusicPanel.tsx # Item de mapeamento (seleção de letra, fundo, camada e remoção)
└── dist/                      # Saída de compilação (gerada pelo build)
    ├── code.js                # Bundle da lógica de execução
    └── ui/                    # Bundle HTML/CSS/JS da interface
```

---

## 🚀 Como Rodar e Desenvolver

### 1. Instalar dependências
```bash
npm install
```

### 2. Modo Desenvolvimento (Watch)
Compila em tempo real as alterações feitas no código de background e na interface:
```bash
npm run dev
```
Abre um localhost para visualizaçã do front-end
```bash
npm run start
```

### 3. Compilar para Produção
Gera os bundles otimizados na pasta `dist/`:
```bash
npm run build
```

### 4. Gerar Pacote de Distribuição (.zip)
Cria o arquivo `.zip` pronto para distribuição contendo `manifest.json` e a pasta `dist/`:
```bash
npm run package
```

---

## 🖥️ Como Instalar e Usar no sPresenter

1. **Carregar o plugin:**
   - No sPresenter, vá em **Configurações → Plugins → Carregar pasta (dev)** e selecione a pasta raiz deste projeto (ou instale o arquivo `.zip` gerado via `npm run package`).
2. **Configurar os vínculos:**
   - Abra o painel **Fundos por letra**.
   - Clique em **+ Adicionar letra**, selecione a letra da música, o fundo desejado e informe a camada (`layer`, padrão `0`).
   - Os mapeamentos são salvos automaticamente no armazenamento local do sPresenter.
3. **Exibir ao vivo:**
   - Ao colocar a letra ao vivo em qualquer camada, o sPresenter acionará o fundo correspondente na camada configurada.