# HTTPInspector

Uma ferramenta simples e interativa para inspecionar cabeçalhos HTTP e verificar configurações de segurança em sites. Ideal para análises rápidas de segurança web.

## Funcionalidades

- Inspeciona cabeçalhos de segurança como:
  - `Strict-Transport-Security`
  - `X-XSS-Protection`
  - `Content-Security-Policy`
  - `X-Frame-Options`
  - Entre outros.
- Identifica informações sensíveis, como:
  - `Server`
  - `X-Powered-By`
  - `ETag`
  - `Cache-Control`
- Exporta relatórios detalhados em formato PDF.
- Interação simples pelo terminal.

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) (gerenciador de pacotes do Node.js)

---

## Instalação

1. Clone o repositório para sua máquina local:
   ```bash
   git clone https://github.com/Jean13331/HTTPInspect.git
   cd HTTPInspector
2. Instale as dependências necessárias:
   ```bash
   npm install

## Uso

1. Inicie o programa no terminal:
   ```bash
   node index.js

2. Insira a URL do site que deseja inspecionar (incluindo http:// ou https://).
3. Após o resultado da análise ser exibido, você terá a opção de salvar os resultados em um arquivo PDF.

## Exemplo de Saída no Terminal:
Resultados da inspeção para: https://example.com

Configurações de Segurança:
- Strict-Transport-Security: max-age=31536000; includeSubDomains; preload ✅ Presente
- X-XSS-Protection: Não configurado ⚠️ Ausente
- Content-Security-Policy: default-src 'self' ✅ Presente

Informações Sensíveis:
- Server: nginx
- X-Powered-By: Não configurado

   
