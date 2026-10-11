# SYNTHESYS — versão demonstrativa atualizada

Site em HTML, CSS e JavaScript. Cabeçalho com Quem Somos, Serviços, Catálogo, Fornecedores, Assessoria, Blog e Contato. Os menus direcionam às respectivas seções. Ao passar o mouse ou usar foco de teclado, o item ganha fundo dourado e texto branco.

## Publicação
Extraia o ZIP. Envie todos os arquivos e a pasta assets para a raiz da branch main do repositório synthesys-hostinger, substituindo a versão anterior. Não envie o ZIP nem uma pasta externa. A Hostinger está configurada para implantação em public_html.

## Conteúdo demonstrativo
Textos e categorias são genéricos para avaliação. O catálogo mostra possibilidades de desenvolvimento, sem oferta de produtos acabados. Os fornecedores não representam parcerias reais. O blog contém prévias expansíveis. O formulário valida campos no navegador e exibe confirmação de teste: não envia nem armazena dados.

## Visualização local
Execute python -m http.server 8000 nesta pasta e abra http://localhost:8000.

## Arquivos
index.html: estrutura e conteúdo. style.css: aparência e responsividade. app.js: menu móvel e formulário de teste. assets: logo e imagens conceituais. robots.txt e sitemap.xml: referências de indexação.

Home foi incluído antes de Quem Somos e leva ao início. O cabeçalho permanece visível durante a rolagem. A altura real da navegação ajusta o deslocamento das âncoras, inclusive no celular.

Correção: cabeçalho fixo no topo, espaço compensado pela altura real e referências CSS/JS versionadas para evitar cache antigo. Substitua index.html, style.css e app.js juntos.

Cabeçalho compacto: largura total da janela, menor espaçamento vertical e logo reduzida em até 15% (216 para 184 px no desktop; 190 para 162 px e 176 para 150 px nas outras faixas). Mantém a posição fixa e os menus distribuídos horizontalmente.

Área segura do cabeçalho: fundo em largura total e conteúdo interno centralizado com limite de 1700 px, igual ao corpo, com margens laterais de 5% (6% no celular).
