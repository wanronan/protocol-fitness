# Wanderson Performance v2

Versão com treino automático pelo dia da semana e registro avançado.

## Novidades

- Treino do dia em destaque na página inicial
- Seleção automática de segunda a sexta
- Fim de semana mostra recuperação e a próxima sessão
- Registro de carga, repetições e RIR por série
- Última carga usada por exercício
- Cronômetro automático de descanso
- Sugestão simples de progressão
- Resumo da sessão, volume e recordes
- Histórico de treinos concluídos
- Dados antigos de carga continuam sendo usados como referência

## Publicar no GitHub

Envie todos os arquivos desta pasta para a raiz do repositório `wan-performance`, substituindo os antigos. Depois abra o site com `?v=2` ou pressione Ctrl+F5.


## Correção do cache do GitHub Pages

Versão: `20260716-2`

O novo `index.html` já estava publicado, mas o `sw.js` antigo continuava entregando a página anterior salva no navegador. Esta versão:
- troca o nome do cache;
- busca o HTML novo primeiro;
- força a atualização do service worker;
- recarrega o app uma vez após a troca da versão.


## Versão 2.1

Versão: `20260716-3`

- repetições programadas aparecem automaticamente em cada série;
- o campo continua editável para registrar o que realmente foi realizado;
- exercícios com faixa usam como valor inicial o mínimo programado;
- botão de cronômetro visível e ativo em cada exercício;
- ao marcar a série como feita, o cronômetro continua iniciando automaticamente;
- série pode ser concluída sem carga, útil para exercícios com peso corporal.


## Versão 3
Versão: `20260716-4`

- indicadores alimentados pelo último registro de medidas;
- meta calórica configurável;
- dieta reiniciada automaticamente por data;
- histórico e adesão dos últimos 7 dias;
- formulário completo de medidas e gráfico de peso;
- comparativos na página inicial.
