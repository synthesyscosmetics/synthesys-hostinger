# Revisão de lançamento — SYNTHESYS

Data: 12/10/2026. Escopo: código local atualizado e site publicado em https://synthesys.com.br/. Nenhuma mudança foi publicada automaticamente.

## Resultado

Não foi identificado bloqueio técnico nos testes de desktop realizados. A aprovação completa depende da validação em celular real e do funcionamento dos canais de atendimento.

## Conferido

| Área | Resultado e limite |
| --- | --- |
| Hospedagem | Página inicial, robots.txt e sitemap.xml responderam HTTP 200 por HTTPS. |
| Recursos publicados | 18 referências de arquivos do HTML responderam HTTP 200. Sem imagens quebradas observadas no navegador. |
| Estrutura | Sem IDs duplicados, links internos para destinos inexistentes ou arquivos locais referenciados ausentes. JavaScript passou na verificação de sintaxe. |
| Capa | Os três slides reservaram as mesmas posições e alturas para seus blocos no desktop de 1363 × 936. Pause/play respondeu. |
| Serviços | Os seis cards abriram por Enter e atualizaram aria-expanded. |
| Catálogo | Abertura por teclado, avanço entre categorias, remoção da folha de transição e saída por Escape conferidos. Perfumaria e Cabelos inspecionados; sete briefings e respectivas imagens conferidos no código. Não se afirma teste visual completo de todas as categorias em todos os dispositivos. |
| Contato | Destinos conferidos: WhatsApp 5531990957771, Instagram synthesyscosmetics e mailto:contato@synthesys.com.br. Nenhuma mensagem foi enviada. |
| E-mail | DNS público retornou MX 1 smtp.google.com e SPF include:_spf.google.com. Caixa postal, DKIM, DMARC e entregabilidade não foram validados neste escopo. |
| Console | Nenhum erro associado ao domínio do site nos testes realizados. Mensagens da extensão do navegador foram desconsideradas. |
| Desktop | Nenhum transbordamento horizontal observado. Briefing de Cabelos coube na altura de 936 px sem rolagem interna. |
| Indicadores | Valores conferidos na ABIHPEC. Bases: 2024/2025; datas e fonte documentadas no README. |

## Ajustes incluídos neste pacote

- Descrição para buscadores atualizada para os seis serviços atuais.
- Metadados Open Graph e Twitter para compartilhamento, com imagem JPEG de laboratório.
- Cor de tema do navegador configurada em vinho.
- README reescrito para eliminar referências antigas a Blog, Fornecedores, formulário e seções já removidas.
- ZIP sem pacotes antigos internos e sem imagens das categorias retiradas do catálogo.

## Validação final antes de divulgar

1. Publicar este pacote na Hostinger e conferir a descrição e a prévia de compartilhamento; são novas e ainda não estão no site publicado auditado.
2. Testar em Android e iPhone: menu, capa, cards por toque, catálogo, setas, fechamento e orientação horizontal. Testar também zoom e um notebook com janela baixa. A validação visual mobile não foi concluída nesta revisão.
3. Confirmar que WhatsApp e Instagram atendem nos perfis indicados. Enviar e receber um e-mail de teste por uma conta externa; não foi feito aqui.
4. Conferir se o escopo anunciado corresponde ao serviço que a empresa consegue entregar hoje. Revisar os indicadores de mercado anualmente.

Não é necessário acrescentar uma linguagem de backend para o site institucional atual, que encaminha o contato para canais externos. Formulário, pagamentos ou área de cliente seriam novas funcionalidades com requisitos próprios.
