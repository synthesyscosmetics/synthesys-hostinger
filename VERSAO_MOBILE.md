# Versão mobile — 14/10/2026

## Escopo

Mudanças limitadas a larguras de até 760 px. O CSS e o JavaScript anteriores foram preservados; os novos estilos estão dentro de media queries e as novas interações verificam o breakpoint antes de agir. A estrutura HTML não foi alterada, exceto pelo identificador de versão dos arquivos para atualização do cache.

## Ajustes

- Cabeçalho compacto; menu sobreposto não altera a altura da capa; links de contato com área de toque de 48 px.
- Capa com imagem inteira, textos abaixo e CTA em largura confortável. Gesto horizontal na fotografia avança ou retrocede; a rolagem vertical continua disponível.
- Textos de corpo alinhados à esquerda no celular para evitar espaços excessivos entre palavras. No computador, os alinhamentos anteriores são preservados.
- Indicadores em duas colunas e serviços em uma coluna; cards crescem conforme o conteúdo aberto.
- Catálogo em lista com miniaturas inteiras, título e frase sempre visíveis. Um toque abre o briefing.
- Detalhes do catálogo com leitura vertical, botão de retorno fixo e setas inferiores de 48 px.
- Regulatório em uma coluna, com altura flexível e sem rolagem interna do texto.
- Contato e rodapé empilhados, respeitando margens e áreas seguras.

## Validação

CSS analisado sem erros nas declarações adicionadas. Comparação confirmou preservação integral do CSS anterior e da estrutura HTML. JavaScript passou na verificação de sintaxe. Testes de lógica confirmaram: um toque abre o catálogo no breakpoint mobile, gesto horizontal troca slides, gesto vertical não troca slides e os novos manipuladores não interceptam essas ações no computador. Referências de arquivos conferidas.

Esses testes não substituem a inspeção visual: não houve navegador local disponível para capturas e testes em dispositivos reais. Após publicar, conferir larguras de 320, 360, 390, 430 e 760 px, menu, abertura e retorno do catálogo, rolagem dos briefings e contatos. Atualizar com Ctrl+F5 no computador; no celular, atualizar a página ou abrir uma nova aba se o cache persistir.


## Logo de abertura

A abertura usa LOGO 4 em SVG marfim somente até 760 px, com nove letras/grupos aparecendo sequencialmente. O fundo vinho e os tempos de abertura foram preservados. No computador, permanece a LOGO 3. Geometria dos vetores conferida contra o SVG original.


## Abertura durante a rolagem

Em celulares, serviços e regulatório abrem automaticamente quando alcançam a linha central da tela. Cada card abre uma vez e permanece aberto; o toque ainda permite fechar e reabrir. Ao mudar para largura de computador, o estado automático é removido, preservando o controle manual e o hover. A leitura utiliza a altura visível do viewport quando disponível, com processamento agrupado por requestAnimationFrame. Animações respeitam a preferência por movimento reduzido. Testadas a linha central, a abertura única por card e a desativação no desktop; inspeção visual em dispositivo real pendente.


## Cards e direção da rolagem

Atualização: na descida, os cards que alcançam a linha central abrem; na subida, fecham ao alcançar essa linha novamente. A próxima descida permite reabrir. O controle por toque permanece disponível; estados abertos manualmente não são removidos pelo fechamento automático. O comportamento segue restrito a até 760 px.


## Correção da progressão reversível

A lógica atual substitui o controle anterior por direção/cruzamento. A posição dos cards define uma sequência contínua de abertos até a linha central; os seguintes permanecem fechados. Ao subir, os cards fecham quando retornam para baixo dessa linha. Uma tolerância de 12 px evita mudanças excessivas na fronteira. Cada card é medido após a atualização do anterior, considerando as mudanças de altura. O toque continua disponível, mas a próxima rolagem volta a sincronizar a sequência.

Testes com alturas variáveis: descida contínua, subida reversa, pequenas inversões, saltos rápidos, recuperação de card fechado para trás, modal aberto e breakpoint desktop. Todos passaram, assim como a verificação de sintaxe JavaScript. Inspeção visual em telefone real ainda pendente.


## Espaçamento, controles e justificação

Até 760 px: removidas as alturas mínimas que criavam lacunas entre títulos/subtítulos/corpos dos slides; margens reduzidas. Controles sobre a imagem no canto inferior direito, com fundo vinho para contraste. Textos de corpo justificados, sem hifenização. Distância horizontal entre colunas de estatísticas aumentada de 20 para 28 px; margens externas preservadas.

Comparação confirmou que o JavaScript e a estrutura HTML são iguais à versão anterior, salvo atualização do cache. Todo o novo CSS está dentro do breakpoint mobile. Conferida a geometria dos controles entre 320 e 760 px. Prints enviados foram inspecionados; a nova versão não foi renderizada em navegador nesta sessão.


## Controles e destino dos botões

Controles da capa no canto inferior esquerdo da foto, levemente reduzidos, com altura de toque de 44 px. Os três CTAs preservam seus destinos anteriores. No celular, os cards anteriores são ajustados antes do cálculo da rolagem, que posiciona o título da seção 12 px abaixo do cabeçalho. A progressão dos cards fica suspensa durante esse movimento e retoma ao final. Testada a posição final dos três botões com mudança de altura e preservação da navegação desktop. Inspeção visual em aparelho pendente.


## Estabilidade dos cards

Resumo e texto completo compartilham a mesma área de grid; o conteúdo oculto reserva o espaço necessário. No celular, alturas uniformes por grupo evitam crescimento na abertura. Removido o deslocamento visual dos serviços. O ícone regulatório diminui dentro de uma área fixa, mantendo o título no lugar. Desktop conserva a área de rolagem interna quando necessária.

Verificados HTML, sintaxe JavaScript, leitura reversível e ancoragem dos três botões. Inspeção visual da nova geometria em navegador pendente.
