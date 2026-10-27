# Quiz da Fraternidade

Quiz escolar feito em React, Vite e styled-components. A cada rodada, o site sorteia 10 das 22 perguntas e também embaralha as alternativas.

O jogador cria um perfil usando apenas o nome. Perfis, tentativas e melhores pontuações são salvos como JSON no `localStorage`, então continuam disponíveis depois de recarregar a página no mesmo navegador. O ranking não é compartilhado entre dispositivos porque o projeto não usa banco de dados.

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
