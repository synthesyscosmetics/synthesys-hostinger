const menu=document.querySelector('.menu-button');
const nav=document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
window.matchMedia('(min-width:761px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
document.querySelector('#contact-form').addEventListener('submit',event=>{event.preventDefault();document.querySelector('#form-status').textContent='Teste concluído. Nenhum dado foi enviado ou armazenado. Na versão final, este formulário será conectado ao canal de atendimento.';});

const header=document.querySelector('.site-header');
function updateHeaderHeight(){document.documentElement.style.setProperty('--header-height',`${header.getBoundingClientRect().height + parseFloat(getComputedStyle(header).top || 0) + 12}px`);}
new ResizeObserver(updateHeaderHeight).observe(header);
updateHeaderHeight();

// Relógio único para troca de slides e preenchimento dos indicadores.
(()=>{
const root=document.querySelector('.hero-slider');
if(!root)return;
const slides=[...root.querySelectorAll('.hero-slide')],dots=[...root.querySelectorAll('[data-goto]')],pause=root.querySelector('.slider-pause');
const duration=7000;
let index=0,elapsed=0,last=null,paused=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function render(){slides.forEach((slide,i)=>{const active=i===index;slide.classList.toggle('is-active',active);slide.setAttribute('aria-hidden',String(!active));slide.inert=!active;});dots.forEach((dot,i)=>{dot.setAttribute('aria-current',String(i===index));dot.querySelector('.dot-fill').style.transform=`scaleX(${i===index?elapsed/duration:0})`;});root.querySelector('.slider-count').textContent=`${String(index+1).padStart(2,'0')} / 03`;}
function select(next){index=(next+slides.length)%slides.length;elapsed=0;last=null;render();}
function updatePause(){pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'Retomar apresentação':'Pausar apresentação');pause.firstElementChild.textContent=paused?'▶':'Ⅱ';}
root.querySelector('[data-prev]').addEventListener('click',()=>select(index-1));root.querySelector('[data-next]').addEventListener('click',()=>select(index+1));dots.forEach((dot,i)=>dot.addEventListener('click',()=>select(i)));
pause.addEventListener('click',()=>{paused=!paused;last=null;updatePause();});
root.addEventListener('keydown',e=>{if(e.target.matches('input,textarea'))return;if(e.key==='ArrowRight'){e.preventDefault();select(index+1);}if(e.key==='ArrowLeft'){e.preventDefault();select(index-1);}});
document.addEventListener('visibilitychange',()=>{last=null;});
function tick(time){if(last!==null&&!paused&&!document.hidden){elapsed+=time-last;if(elapsed>=duration){index=(index+1)%slides.length;elapsed=0;render();}dots[index].querySelector('.dot-fill').style.transform=`scaleX(${elapsed/duration})`;}last=time;requestAnimationFrame(tick);}
render();updatePause();requestAnimationFrame(tick);
})();

// Contagem única ao entrar na tela, com desaceleração suave e valores acessíveis fixos.
(()=>{
 const section=document.querySelector('.market-stats');if(!section)return;
 const numbers=[...section.querySelectorAll('[data-count]')];
 const format=new Intl.NumberFormat('pt-BR');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 let started=false,frame;
 function finish(){cancelAnimationFrame(frame);numbers.forEach(n=>n.textContent=format.format(Number(n.dataset.count)));}
 function start(){if(started)return;started=true;if(reduce.matches){finish();return;}section.classList.add('is-counting');const begin=performance.now();
  function tick(now){let complete=true;numbers.forEach((n,i)=>{const progress=Math.max(0,Math.min(1,(now-begin-i*120)/2100));const eased=1-Math.pow(1-progress,4);n.textContent=format.format(Math.round(Number(n.dataset.count)*eased));if(progress<1)complete=false;});if(!complete)frame=requestAnimationFrame(tick);else finish();}
  frame=requestAnimationFrame(tick);
 }
 reduce.addEventListener('change',e=>{if(e.matches&&started)finish();});
 if(!('IntersectionObserver' in window)||reduce.matches){finish();return;}
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){start();observer.disconnect();}},{threshold:.2});observer.observe(section);
})();

// Interação por mouse, teclado e toque; revelação uma vez por card.
(()=>{
 const cards=[...document.querySelectorAll('.service-card')];
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 cards.forEach(card=>{
  const toggle=card.querySelector('.service-toggle'),preview=card.querySelector('.service-preview'),detail=card.querySelector('.service-detail'),contact=card.querySelector('.service-contact');
  let pinned=false,hovered=false;
  function render(){const open=pinned||hovered;card.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));detail.hidden=!open;preview.hidden=open;contact.hidden=!open;toggle.firstChild.textContent=pinned?'Fechar detalhes ':'Como funciona ';}
  card.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovered=true;render();}});
  card.addEventListener('pointerleave',()=>{hovered=false;render();});
  toggle.addEventListener('click',()=>{pinned=!pinned;if(!pinned)hovered=false;render();});
  card.addEventListener('keydown',e=>{if(e.key==='Escape'){pinned=false;hovered=false;render();toggle.focus();}});
 });
 if(reduced.matches||!('IntersectionObserver' in window))return;
 const observer=new IntersectionObserver(entries=>{let order=0;entries.forEach(entry=>{if(entry.isIntersecting){entry.target.style.setProperty('--reveal-delay',`${order++*100}ms`);entry.target.classList.remove('reveal-pending');entry.target.classList.add('reveal-ready');observer.unobserve(entry.target);}});},{threshold:.12});
 cards.forEach(card=>{card.classList.add('reveal-pending');observer.observe(card);});
 reduced.addEventListener('change',e=>{if(e.matches){observer.disconnect();cards.forEach(card=>card.classList.remove('reveal-pending','reveal-ready'));}});
})();

// Painéis expansíveis por hover, foco e toque; os vizinhos cedem espaço.
(()=>{
 const track=document.querySelector('.catalog-track');if(!track)return;
 const panels=[...track.querySelectorAll('.catalog-panel')];
 let active=null;
 function select(panel){active=panel;track.classList.toggle('has-active',Boolean(panel));panels.forEach(item=>{const expanded=item===panel;item.classList.toggle('is-active',expanded);item.setAttribute('aria-expanded',String(expanded));});}
 panels.forEach((panel,index)=>{
  let wasOpenOnTouch=false;
  panel.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse')wasOpenOnTouch=active===panel;});
  panel.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'||event.pointerType==='pen')select(panel);});
  panel.addEventListener('focus',()=>select(panel));
  panel.addEventListener('click',event=>{if(event.detail===0||event.pointerType==='mouse'||wasOpenOnTouch){select(panel);track.dispatchEvent(new CustomEvent('catalogopen',{detail:{panel}}));}else select(panel);});
  panel.addEventListener('keydown',event=>{let target=null;if(event.key==='ArrowRight'||event.key==='ArrowDown')target=panels[(index+1)%panels.length];if(event.key==='ArrowLeft'||event.key==='ArrowUp')target=panels[(index+panels.length-1)%panels.length];if(event.key==='Home')target=panels[0];if(event.key==='End')target=panels[panels.length-1];if(target){event.preventDefault();target.focus({preventScroll:true});}if(event.key==='Escape'){select(null);panel.blur();}});
 });
 track.addEventListener('pointerleave',()=>{const focused=document.activeElement;if(panels.includes(focused)&&focused.matches(':focus-visible'))select(focused);else select(null);});
 track.addEventListener('focusout',event=>{if(!track.contains(event.relatedTarget)&&!track.matches(':hover'))select(null);});
})();

const catalogBriefings=[{"key": "perfumaria", "title": "Perfumaria", "color": "#694654", "examples": "Perfumes, body splashes e brumas perfumadas.", "headline": "Uma assinatura que permanece.", "intro": "Exploramos famílias olfativas, intensidade e experiência de uso para construir uma identidade perfumada alinhada à sua marca. O briefing orienta o perfil de fragrância, a apresentação e o momento de consumo.", "heading": "Perfis e formatos", "body": "O projeto pode partir de uma coleção autoral, de fragrâncias para diferentes ocasiões ou de uma assinatura olfativa para a marca. Definimos referências, família olfativa, intensidade desejada e características da experiência, em diálogo com os parceiros de fragrâncias.", "points": ["Perfumes, body splashes e brumas perfumadas.", "Público, ocasiões de uso e referências olfativas.", "Formato de aplicação, embalagem e identidade visual.", "Planejamento de avaliações de estabilidade e compatibilidade."]}, {"key": "higiene", "title": "Higiene pessoal", "color": "#275b56", "examples": "Sabonetes líquidos, desodorantes e produtos para banho.", "headline": "O cuidado começa no cotidiano.", "intro": "Desenvolvemos propostas para tornar a rotina de higiene uma experiência agradável. Avaliamos público, formato, sensorial e aplicação para orientar a formulação e a seleção da embalagem.", "heading": "Uma rotina que faz sentido", "body": "A proposta combina finalidade de uso e experiência sensorial. O briefing considera frequência de aplicação, tipo de pele, fragrância, textura e praticidade, além do formato de apresentação e das informações que orientarão a comunicação do produto.", "points": ["Sabonetes líquidos, desodorantes e produtos para banho.", "Tipo de aplicação, frequência de uso e público.", "Espuma, espalhabilidade e sensação após o uso.", "Seleção de embalagem e planejamento das avaliações técnicas."]}, {"key": "labiais", "title": "Cuidados labiais", "color": "#a45341", "examples": "Balms, óleos labiais e esfoliantes.", "headline": "Pequenos gestos. Novas sensações.", "intro": "Criamos conceitos de cuidado labial com atenção à textura, ao acabamento e à praticidade. O projeto pode explorar diferentes formatos e experiências, conforme o posicionamento da marca.", "heading": "Texturas e acabamentos", "body": "Podemos explorar propostas de uso diário, cuidado noturno ou experiências sensoriais específicas. A escolha do formato considera conforto na aplicação, acabamento e portabilidade, com desenvolvimento alinhado ao conceito da marca.", "points": ["Balms, óleos labiais e esfoliantes.", "Formato em stick, bisnaga, pote ou aplicador.", "Acabamento, brilho, textura e experiência de uso.", "Compatibilidade com embalagem e avaliações adequadas ao produto."]}, {"key": "masculinos", "title": "Cuidados masculinos", "color": "#304b38", "examples": "Produtos para barba, barbear e cuidados pós-barba.", "headline": "Uma rotina com identidade própria.", "intro": "Planejamos produtos para diferentes hábitos de cuidado masculino. Definimos sensorial, fragrância e apresentação a partir das necessidades do público e da experiência desejada para a linha.", "heading": "Hábitos e experiências", "body": "O desenvolvimento começa pela rotina que a linha pretende acompanhar: barba, barbear ou cuidado após o barbear. Trabalhamos a coerência entre desempenho desejado, sensorial, fragrância e apresentação, para construir uma coleção com identidade.", "points": ["Óleos e cuidados para barba, produtos de barbear e pós-barba.", "Perfil de uso, tipo de barba e preferências sensoriais.", "Textura, aplicação e sensação de acabamento.", "Conceito de linha, embalagens e comunicação dos diferenciais."]}, {"key": "infantis", "title": "Cuidados infantis", "color": "#45647d", "examples": "Shampoos, sabonetes e hidratantes para o público infantil.", "headline": "Delicadeza em cada escolha.", "intro": "Estruturamos o desenvolvimento considerando a faixa etária, o modo de uso e as avaliações necessárias ao projeto. A escolha dos ingredientes e da apresentação acompanha os cuidados técnicos específicos desse público.", "heading": "Um público que exige atenção", "body": "O briefing identifica a faixa etária e a rotina de uso, inclusive quem fará a aplicação. O projeto considera seleção de ingredientes, comunicação, apresentação e planejamento das avaliações pertinentes. Alegações específicas dependem da documentação e das comprovações aplicáveis.", "points": ["Shampoos, sabonetes e hidratantes infantis.", "Faixa etária, frequência e condições de uso.", "Sensorial, fragrância e facilidade de aplicação.", "Planejamento técnico, avaliações de segurança e revisão das informações."]}, {"key": "solar", "title": "Proteção solar", "color": "#ad6d25", "examples": "Protetores faciais, corporais e produtos pós-sol.", "headline": "Cuidado para os dias de sol.", "intro": "Organizamos propostas de proteção e cuidado pós-sol a partir do público, da aplicação e do sensorial desejado. Projetos de protetores incluem planejamento das comprovações de eficácia e das etapas regulatórias aplicáveis.", "heading": "Do conceito às comprovações", "body": "Para protetores, definimos o perfil de aplicação e os atributos desejados, incluindo o fator de proteção pretendido, sem antecipar resultados. As alegações de proteção precisam ser sustentadas por ensaios apropriados. Produtos pós-sol seguem uma proposta própria de cuidado e sensorial.", "points": ["Protetores faciais, corporais e produtos pós-sol.", "Textura, acabamento, aplicação e público.", "Planejamento de ensaios de eficácia conforme as alegações pretendidas.", "Estabilidade, compatibilidade e requisitos regulatórios do projeto."]}, {"key": "maos-pes", "title": "Cuidados para mãos e pés", "color": "#57425e", "examples": "Cremes, esfoliantes e cuidados para cutículas.", "headline": "Atenção aos detalhes da rotina.", "intro": "Desenvolvemos conceitos para hidratação, esfoliação e cuidado de mãos, pés e cutículas. Textura, espalhabilidade e acabamento são definidos conforme a ocasião de uso e a proposta de cada produto.", "heading": "Cuidado nos detalhes", "body": "A linha pode reunir produtos para uma rotina diária ou para etapas específicas, como hidratação, esfoliação e cuidado das cutículas. O briefing orienta a intensidade sensorial, o formato de aplicação e a praticidade, pensando na experiência completa.", "points": ["Cremes para mãos e pés, esfoliantes e cuidados para cutículas.", "Ocasião de uso, textura e sensação de absorção.", "Formato de embalagem, dosagem e aplicação.", "Coerência de linha e planejamento das avaliações técnicas."]}];

// Abertura do briefing: foco contido no dialog, Escape e retorno ao painel.
(()=>{
 const track=document.querySelector('.catalog-track'),dialog=document.querySelector('.category-dialog');if(!track||!dialog)return;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');let origin=null,ghost=null,animation=null,oldOverflow='',opening=false;
 async function open(panel){if(dialog.open||opening)return;origin=panel;opening=true;const data=catalogBriefings[Number(panel.dataset.category)],rect=panel.getBoundingClientRect();dialog.style.setProperty('--category-color',data.color);
  const fields={'h2':data.title,'.category-headline':data.headline,'.category-intro':data.intro,'.category-heading':data.heading,'.category-body':data.body};for(const [selector,value]of Object.entries(fields))dialog.querySelector(selector).textContent=value;
  const image=dialog.querySelector('.category-image img');image.src=`assets/catalog-${data.key}.webp`;image.alt=`Produtos conceituais de ${data.title}`;
  const list=dialog.querySelector('.category-points');list.replaceChildren(...data.points.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();dialog.scrollTop=0;
  if(!reduce.matches&&typeof panel.animate==='function'){
   ghost=document.createElement('div');ghost.className='category-transition';ghost.style.setProperty('--category-color',data.color);ghost.style.cssText+=`;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;border-radius:7px`;ghost.append(panel.querySelector('img').cloneNode());dialog.append(ghost);
   animation=ghost.animate([{left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,borderRadius:'7px'},{left:'0px',top:'0px',width:`${window.innerWidth}px`,height:`${window.innerHeight}px`,borderRadius:'0px'}],{duration:780,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});
   const dissolve=setTimeout(()=>ghost?.classList.add('is-dissolving'),280);try{await animation.finished;}catch{}clearTimeout(dissolve);ghost?.remove();ghost=null;animation=null;
  }
  if(dialog.open)dialog.classList.add('is-ready');opening=false;
 }
 track.addEventListener('catalogopen',event=>open(event.detail.panel));
 dialog.querySelector('.category-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{animation?.cancel();animation=null;ghost?.remove();ghost=null;dialog.classList.remove('is-ready');document.body.style.overflow=oldOverflow;origin?.focus({preventScroll:true});});
 dialog.querySelector('.category-cta').addEventListener('click',event=>{event.preventDefault();dialog.close();document.querySelector('#contato').scrollIntoView({behavior:reduce.matches?'instant':'smooth'});document.querySelector('#contato input')?.focus({preventScroll:true});});
})();
