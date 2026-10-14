# Ajuste da capa responsiva — 14/10/2026

Causa: fotos 4:3 dentro de uma área quase quadrada, com object-fit: contain, deixavam faixas acima e abaixo.

Correção: três versões quadradas com extensão do cenário; a largura da área fotográfica acompanha sua altura. Em monitores ultrawide, o elemento picture seleciona a versão horizontal 4:3, com área na mesma proporção. Telas com proporção de até 3:2 usam composição empilhada, sem espremer o texto.

Mantidos os textos revisados, o link do Gmail, o contorno estático dos botões, o carrossel vertical e a separação entre foto e texto.

Validação geométrica: 14.651 combinações de largura/altura, em incrementos de 16 px entre 1280×720 e 3840×2160; sem cortes, deformação ou faixas geométricas. Incluídos tamanhos 16:9, 16:10 e ultrawide. Conferidas referências de imagens, IDs do HTML e sintaxe JavaScript.

A validação é geométrica e de código. Não foi possível executar o navegador local porque o download do Chromium falhou; uma inspeção visual após publicação ainda é necessária.
