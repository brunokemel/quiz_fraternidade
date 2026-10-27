# Quiz da Fraternidade

Quiz escolar feito em React, Vite e styled-components. A cada rodada, o site sorteia 10 das 22 perguntas e também embaralha as alternativas.

O jogador informa o nome para começar. O nome é enviado somente ao finalizar a partida e aparece no ranking oficial carregado da API; não há perfis salvos no navegador.

## Configurar a API

Copie `.env.example` para `.env` e informe a URL real da API do Render, sem barra no final:

```env
VITE_API_URL=https://sua-api.onrender.com
```

Na Vercel, cadastre a mesma variável `VITE_API_URL` em **Settings → Environment Variables** e faça um novo deploy.

## Rodar no computador

```bash
npm install
npm run dev
```

## Publicar na Vercel

1. Crie um repositório no GitHub e envie esta pasta.
2. Na Vercel, clique em **Add New → Project** e importe o repositório.
3. A Vercel deve reconhecer o Vite automaticamente. Se pedir as opções, use:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Clique em **Deploy**.

Também é possível instalar a Vercel CLI e executar `npx vercel` nesta pasta.

O arquivo HTML antigo foi mantido apenas como referência e não participa do build.
