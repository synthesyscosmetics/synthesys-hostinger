const menu=document.querySelector('.menu-button');
const nav=document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
window.matchMedia('(min-width:761px)').addEventListener('change',event=>{if(event.matches)closeMenu();});

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
const mediaLayers=[...root.querySelectorAll('.hero-media-layer')],motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
let mediaIndex=null,mediaAnimations=[];
function animateHeroImages(next){
 if(!mediaLayers.length||next===mediaIndex)return;
 mediaAnimations.forEach(a=>a.cancel());mediaAnimations=[];
 const previous=mediaIndex;mediaIndex=next;
 mediaLayers.forEach((layer,i)=>{layer.classList.toggle('is-active',i===next);layer.style.zIndex=i===next?'2':'0';layer.style.visibility=i===next?'visible':'hidden';});
 if(previous===null||motionPreference.matches)return;
 const direction=next===(previous+1)%mediaLayers.length?1:-1,old=mediaLayers[previous],incoming=mediaLayers[next];old.style.visibility='visible';old.style.zIndex='1';
 const timing={duration:950,easing:'cubic-bezier(.22,1,.36,1)'};
 const leaving=old.animate([{transform:'translateY(0) skewY(0deg)',filter:'blur(0px)'},{offset:.45,transform:`translateY(${-direction*48}%) skewY(${direction*2}deg)`,filter:'blur(2px)'},{transform:`translateY(${-direction*105}%) skewY(0deg)`,filter:'blur(0px)'}],timing);
 const arriving=incoming.animate([{transform:`translateY(${direction*105}%) skewY(${-direction*2}deg)`,filter:'blur(2px)'},{offset:.6,transform:`translateY(${direction*12}%) skewY(${direction*.7}deg)`,filter:'blur(.5px)'},{transform:'translateY(0) skewY(0deg)',filter:'blur(0px)'}],timing);
 mediaAnimations=[leaving,arriving];leaving.finished.then(()=>{if(mediaIndex!==previous)old.style.visibility='hidden';}).catch(()=>{});
}

let index=0,elapsed=0,last=null,paused=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function render(){animateHeroImages(index);slides.forEach((slide,i)=>{const active=i===index;slide.classList.toggle('is-active',active);slide.setAttribute('aria-hidden',String(!active));slide.inert=!active;});dots.forEach((dot,i)=>{dot.setAttribute('aria-current',String(i===index));dot.querySelector('.dot-fill').style.transform=`scaleX(${i===index?elapsed/duration:0})`;});}
function select(next){index=(next+slides.length)%slides.length;elapsed=0;last=null;render();}
function updatePause(){pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'Retomar apresentação':'Pausar apresentação');pause.querySelector('[data-play-icon]').toggleAttribute('hidden',!paused);pause.querySelector('[data-pause-icon]').toggleAttribute('hidden',paused);}
root.querySelector('[data-prev]').addEventListener('click',()=>select(index-1));root.querySelector('[data-next]').addEventListener('click',()=>select(index+1));dots.forEach((dot,i)=>dot.addEventListener('click',()=>select(i)));
pause.addEventListener('click',()=>{paused=!paused;last=null;updatePause();});
root.addEventListener('keydown',e=>{if(e.target.matches('input,textarea'))return;if(e.key==='ArrowRight'){e.preventDefault();select(index+1);}if(e.key==='ArrowLeft'){e.preventDefault();select(index-1);}});
document.addEventListener('visibilitychange',()=>{last=null;});
function tick(time){if(last!==null&&!paused&&!document.hidden){elapsed+=time-last;if(elapsed>=duration){index=(index+1)%slides.length;elapsed=0;render();}dots[index].querySelector('.dot-fill').style.transform=`scaleX(${elapsed/duration})`;}last=time;requestAnimationFrame(tick);}
render();updatePause();requestAnimationFrame(tick);
})();

// Contagem, cor e comprimento usam o mesmo progresso por indicador.
(()=>{
 const section=document.querySelector('.market-stats');if(!section)return;
 const numbers=[...section.querySelectorAll('[data-count]')],format=new Intl.NumberFormat('pt-BR');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const from=[84,46,57],to=[219,122,86];let started=false,frame;
 function render(n,p){n.textContent=format.format(Math.round(Number(n.dataset.count)*p));const card=n.closest('.market-stat');card.style.setProperty('--stat-progress',String(p));card.style.setProperty('--stat-color',`rgb(${from.map((v,i)=>Math.round(v+(to[i]-v)*p)).join(',')})`);}
 function finish(){cancelAnimationFrame(frame);numbers.forEach(n=>render(n,1));}
 function start(){if(started)return;started=true;if(reduce.matches){finish();return;}section.classList.add('is-counting');const begin=performance.now();
  function tick(now){let complete=true;numbers.forEach((n,i)=>{const p=Math.max(0,Math.min(1,(now-begin-i*120)/2100)),eased=1-Math.pow(1-p,4);render(n,eased);if(p<1)complete=false;});if(!complete)frame=requestAnimationFrame(tick);else finish();}
  frame=requestAnimationFrame(tick);
 }
 reduce.addEventListener('change',e=>{if(e.matches)finish();});
 if(!('IntersectionObserver' in window)||reduce.matches){finish();return;}
 numbers.forEach(n=>render(n,0));
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){start();observer.disconnect();}},{threshold:.2});observer.observe(section);
})();

// Cards de serviços: hover, clique, toque e teclado.
(()=>{
 const cards=[...document.querySelectorAll('.service-card')],reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 cards.forEach(card=>{
  const preview=card.querySelector('.service-preview'),detail=card.querySelector('.service-detail');let pinned=false,hovered=false,autoOpen=false;
  function render(){const open=pinned||hovered||autoOpen;card.classList.toggle('is-open',open);card.setAttribute('aria-expanded',String(open));detail.hidden=!open;preview.hidden=open;}
  card.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovered=true;render();}});card.addEventListener('pointerleave',()=>{hovered=false;render();});
  card.addEventListener('mobilecardopen',()=>{if(matchMedia('(max-width:760px)').matches){autoOpen=true;render();}});card.addEventListener('mobilecardreset',()=>{autoOpen=false;render();});card.addEventListener('mobilecardprogress',event=>{if(!matchMedia('(max-width:760px)').matches)return;autoOpen=Boolean(event.detail.open);pinned=false;hovered=false;render();});
  function toggle(){if(autoOpen){autoOpen=false;pinned=false;hovered=false;}else{pinned=!pinned;if(!pinned)hovered=false;}render();}
  card.addEventListener('click',toggle);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}if(e.key==='Escape'){pinned=false;hovered=false;autoOpen=false;render();}});
 });
 if(reduced.matches||!('IntersectionObserver' in window))return;
 const observer=new IntersectionObserver(entries=>{let order=0;entries.forEach(entry=>{if(entry.isIntersecting){entry.target.style.setProperty('--reveal-delay',`${order++*100}ms`);entry.target.classList.remove('reveal-pending');entry.target.classList.add('reveal-ready');observer.unobserve(entry.target);}});},{threshold:.12});
 cards.forEach(card=>{card.classList.add('reveal-pending');observer.observe(card);});reduced.addEventListener('change',e=>{if(e.matches){observer.disconnect();cards.forEach(card=>card.classList.remove('reveal-pending','reveal-ready'));}});
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

const catalogBriefings=[{"key": "perfumaria", "title": "Perfumaria", "color": "#542E39", "examples": "Perfumes, body splashes e brumas perfumadas.", "headline": "Uma assinatura que permanece.", "intro": "Exploramos famílias olfativas, intensidade e experiência de uso para construir uma identidade perfumada alinhada à sua marca. O briefing orienta o perfil da fragrância, a apresentação e as ocasiões de uso.", "heading": "Perfis e formatos", "body": "O projeto pode partir de uma coleção autoral, de fragrâncias para diferentes ocasiões ou de uma assinatura olfativa para a marca. Definimos referências, família olfativa, intensidade desejada e características de uso, em diálogo com os parceiros de fragrâncias.", "points": ["Perfumes, body splashes e brumas perfumadas.", "Público, ocasiões de uso e referências olfativas.", "Formato de aplicação, embalagem e identidade visual.", "Planejamento de avaliações de estabilidade e compatibilidade."]}, {"key": "cabelos", "title": "Hair Care", "color": "#542E39", "examples": "Shampoos, condicionadores, máscaras e finalizadores.", "headline": "Da rotina de cuidado à expressão de cada cabelo.", "intro": "Criamos propostas capilares para diferentes tipos de cabelo, hábitos e objetivos de cuidado. O desenvolvimento conecta limpeza, condicionamento, tratamento e finalização a uma experiência que traduza a identidade da sua marca.", "heading": "Uma linha com propósito", "body": "Definimos o público, a rotina e os atributos desejados para orientar ingredientes, textura, fragrância e desempenho. Desenvolvemos e refinamos protótipos para criar produtos complementares, considerando aplicação, sensorial, embalagem e viabilidade técnica.", "points": ["Shampoos, condicionadores, máscaras e finalizadores.", "Óleos, leave-ins e cuidados para o couro cabeludo.", "Tipos de cabelo, textura e experiência de aplicação.", "Avaliações de estabilidade, compatibilidade e desempenho."]}, {"key": "higiene", "title": "Body Care", "color": "#542E39", "examples": "Sabonetes, desodorantes e hidratantes corporais.", "headline": "O cuidado começa no cotidiano.", "intro": "Desenvolvemos propostas de higiene e cuidado corporal para uma rotina agradável. Avaliamos público, formato, sensorial e aplicação para orientar a formulação e a seleção da embalagem.", "heading": "Uma rotina que faz sentido", "body": "A proposta combina limpeza, hidratação e experiência sensorial. O briefing considera frequência de uso, tipo de pele, fragrância, textura e praticidade, além da apresentação e das informações que orientarão a comunicação do produto.", "points": ["Sabonetes, desodorantes e hidratantes corporais.", "Forma de aplicação, frequência de uso e público.", "Limpeza, hidratação e sensação após o uso.", "Seleção de embalagem e planejamento das avaliações técnicas."]}, {"key": "skincare", "title": "Skin Care", "color": "#542E39", "examples": "Séruns, hidratantes, tônicos e produtos de limpeza.", "headline": "Cuidado que acompanha a sua pele.", "intro": "Desenvolvemos conceitos para rotinas faciais e corporais, unindo sensorial, praticidade e objetivos de cuidado. Cada proposta parte das necessidades do público e do posicionamento da marca para construir uma experiência coerente.", "heading": "Texturas e rotinas de cuidado", "body": "A linha pode combinar limpeza, hidratação e cuidados específicos em diferentes formatos. Definimos ingredientes, acabamento e modo de aplicação conforme o briefing. A comunicação dos benefícios considera as avaliações e comprovações pertinentes a cada produto.", "points": ["Séruns, hidratantes, tônicos e produtos de limpeza.", "Esfoliantes, máscaras e cuidados faciais e corporais.", "Tipo de pele, rotina e acabamento sensorial.", "Compatibilidade, estabilidade e comprovação de benefícios."]}, {"key": "maquiagem", "title": "Makeup", "color": "#542E39", "examples": "Bases, corretivos, blushes e pós.", "headline": "Cor, expressão e identidade em cada detalhe.", "intro": "Exploramos produtos de maquiagem que conectam cor, textura e experiência de aplicação. O conceito considera o público, o acabamento desejado e a personalidade da marca para transformar uma ideia em uma coleção com identidade.", "heading": "Acabamentos que fazem a diferença", "body": "Definimos cobertura, pigmentação, espalhabilidade e apresentação conforme a proposta. O desenvolvimento pode explorar produtos para rosto, olhos e lábios, com protótipos e ajustes de sensorial, tonalidade e compatibilidade entre formulação e embalagem.", "points": ["Bases, corretivos, blushes e pós.", "Batons, glosses e produtos para olhos e lábios.", "Tonalidades, cobertura, textura e acabamento.", "Aplicadores, embalagens e avaliações técnicas."]}, {"key": "masculinos", "title": "Man Care", "color": "#542E39", "examples": "Produtos para barba, barbear, pele e cabelos.", "headline": "Uma rotina com identidade própria.", "intro": "Planejamos produtos para diferentes hábitos de cuidado masculino. Definimos sensorial, fragrância e apresentação a partir das necessidades do público e da experiência desejada para a linha.", "heading": "Hábitos e experiências", "body": "O desenvolvimento considera hábitos de cuidado com barba, pele e cabelos, incluindo barbear e pós-barba. Alinhamos desempenho, sensorial, fragrância e apresentação para criar uma linha com identidade.", "points": ["Cuidados para barba, pele e cabelos; barbear e pós-barba.", "Hábitos de cuidado e preferências sensoriais do público.", "Textura, aplicação e sensação de acabamento.", "Conceito de linha, embalagens e comunicação dos diferenciais."]}, {"key": "infantis", "title": "Infantil", "color": "#542E39", "examples": "Shampoos, sabonetes e hidratantes para o público infantil.", "headline": "Delicadeza em cada escolha.", "intro": "Estruturamos o desenvolvimento considerando a faixa etária, o modo de uso e as avaliações necessárias ao projeto. A escolha dos ingredientes e da apresentação acompanha os cuidados técnicos específicos desse público.", "heading": "Um público que exige atenção", "body": "O briefing identifica a faixa etária e a rotina de uso, incluindo quem aplicará o produto. O projeto considera ingredientes, comunicação, apresentação e planejamento das avaliações pertinentes. Alegações específicas dependem da documentação e das comprovações aplicáveis.", "points": ["Shampoos, sabonetes e hidratantes infantis.", "Faixa etária, frequência e condições de uso.", "Sensorial, fragrância e facilidade de aplicação.", "Planejamento técnico, avaliações de segurança e revisão das informações."]}];

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
})();

// Documents du mural : ouverture au survol, au toucher et au clavier.
(()=>{
 document.querySelectorAll('.reg-document').forEach(card=>{
  const detail=card.querySelector('.reg-doc-detail'),teaser=card.querySelector('.reg-teaser');let pinned=false,hovered=false,autoOpen=false;
  function render(){const open=pinned||hovered||autoOpen;card.classList.toggle('is-open',open);card.setAttribute('aria-expanded',String(open));detail.hidden=!open;teaser.hidden=open;}
  card.addEventListener('mobilecardopen',()=>{if(matchMedia('(max-width:760px)').matches){autoOpen=true;render();}});card.addEventListener('mobilecardreset',()=>{autoOpen=false;render();});card.addEventListener('mobilecardprogress',event=>{if(!matchMedia('(max-width:760px)').matches)return;autoOpen=Boolean(event.detail.open);pinned=false;hovered=false;render();});
  function toggle(){if(autoOpen){autoOpen=false;pinned=false;hovered=false;}else{pinned=!pinned;if(!pinned)hovered=false;}render();}
  card.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hovered=true;render();}});card.addEventListener('pointerleave',()=>{hovered=false;render();});card.addEventListener('click',toggle);card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();toggle();}if(event.key==='Escape'){pinned=false;hovered=false;autoOpen=false;render();}});
 });
})();

// Slider de etapas: troca em 5 segundos, pausa preserva o tempo restante.
(()=>{
 const root=document.querySelector('.contact-process-slider');if(!root)return;
 const slides=[...root.querySelectorAll('.journey-slide')],steps=[...root.querySelectorAll('[data-journey-step]')],pause=root.querySelector('.journey-pause');
 let index=0,elapsed=0,last=null,inView=false,paused=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function render(){slides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===index);slide.setAttribute('aria-hidden',String(i!==index));slide.inert=i!==index;});steps.forEach((step,i)=>{step.setAttribute('aria-pressed',String(i===index));step.style.setProperty('--journey-progress',i===index?String(elapsed/5000):'0');});}
 function renderPause(){pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'Retomar etapas':'Pausar etapas');pause.querySelector('[data-journey-play-icon]').toggleAttribute('hidden',!paused);pause.querySelector('[data-journey-pause-icon]').toggleAttribute('hidden',paused);}
 steps.forEach((step,i)=>step.addEventListener('click',()=>{index=i;elapsed=0;last=null;render();}));pause.addEventListener('click',()=>{paused=!paused;last=null;renderPause();});
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;last=null;},{threshold:.2}).observe(root);else inView=true;
 document.addEventListener('visibilitychange',()=>{last=null;});
 function tick(time){if(last!==null&&inView&&!paused&&!document.hidden){elapsed+=time-last;if(elapsed>=5000){index=(index+1)%slides.length;elapsed=0;render();}steps[index].style.setProperty('--journey-progress',String(elapsed/5000));}last=time;requestAnimationFrame(tick);}
 render();renderPause();requestAnimationFrame(tick);
})();

// Logo do rodapé acompanha a altura real do bloco de apresentação.
(()=>{const text=document.querySelector('.footer-about'),company=document.querySelector('.footer-company');if(!text||!company)return;const update=()=>company.style.setProperty('--footer-logo-height',`${Math.ceil(text.getBoundingClientRect().height)}px`);new ResizeObserver(update).observe(text);update();document.fonts?.ready.then(update);})();

// Réserve la hauteur du plus grand bloc sur les trois slides, même invisibles.
(()=>{
 const slider=document.querySelector('.hero-slider');if(!slider)return;
 const groups=[['.slide-title-line','--slide-title-height'],['.slide-inner em','--slide-subtitle-height'],['.slide-description','--slide-body-height']];
 let frame;
 function align(){
  groups.forEach(([,property])=>slider.style.removeProperty(property));
  const heights=groups.map(([selector])=>Math.ceil(Math.max(...[...slider.querySelectorAll(selector)].map(el=>el.getBoundingClientRect().height))));
  groups.forEach(([,property],i)=>slider.style.setProperty(property,heights[i]+'px'));
 }
 function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(align);}
 new ResizeObserver(schedule).observe(slider);
 window.addEventListener('resize',schedule);document.fonts?.ready.then(schedule);align();
})();

// Navigation continue dans les briefings, avec une feuille qui se tourne.
(()=>{
 const dialog=document.querySelector('.category-dialog'),track=document.querySelector('.catalog-track');if(!dialog||!track)return;
 const detail=dialog.querySelector('.category-detail'),reduce=matchMedia('(prefers-reduced-motion: reduce)');let index=0,busy=false,token=0,sheet=null,motions=[];
 track.addEventListener('catalogopen',event=>{index=Number(event.detail.panel.dataset.category);});
 const announcement=dialog.querySelector('.category-announcement');
 function render(i){
  const d=catalogBriefings[i];for(const [selector,value] of Object.entries({'h2':d.title,'.category-headline':d.headline,'.category-intro':d.intro,'.category-heading':d.heading,'.category-body':d.body}))detail.querySelector(selector).textContent=value;
  const img=detail.querySelector('img');img.src=`assets/catalog-${d.key}.webp`;img.alt=`Produtos conceituais de ${d.title}`;
  detail.querySelector('.category-points').replaceChildren(...d.points.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
  announcement.textContent=d.title;dialog.scrollTop=0;
 }
 async function navigate(direction){
  if(!dialog.open||busy||!dialog.classList.contains('is-ready'))return;busy=true;const current=++token,next=(index+direction+catalogBriefings.length)%catalogBriefings.length;
  const preload=new Image();preload.src=`assets/catalog-${catalogBriefings[next].key}.webp`;try{await preload.decode();}catch{}
  if(current!==token||!dialog.open)return;
  if(reduce.matches){index=next;render(index);busy=false;return;}
  sheet=document.createElement('div');sheet.className='category-page-sheet';sheet.setAttribute('aria-hidden','true');sheet.inert=true;
  const copy=detail.cloneNode(true);copy.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));sheet.append(copy);dialog.append(sheet);
  sheet.style.top=dialog.scrollTop+'px';sheet.style.bottom='auto';sheet.style.height=Math.max(dialog.clientHeight,detail.scrollHeight)+'px';
  index=next;render(index);sheet.style.transformOrigin=direction>0?'left center':'right center';
  motions=[sheet.animate([{transform:'rotateY(0deg)',opacity:1},{transform:`rotateY(${direction>0?-105:105}deg)`,opacity:0}],{duration:850,easing:'cubic-bezier(.25,.65,.2,1)',fill:'forwards'}),detail.animate([{opacity:.35,transform:`translateX(${direction*24}px)`},{opacity:1,transform:'translateX(0)'}],{duration:700,delay:100,easing:'cubic-bezier(.22,1,.36,1)'})];
  try{await Promise.all(motions.map(a=>a.finished));}catch{}
  if(current===token){sheet?.remove();sheet=null;motions=[];busy=false;}
 }
 dialog.querySelector('.category-prev').addEventListener('click',()=>navigate(-1));dialog.querySelector('.category-next-arrow').addEventListener('click',()=>navigate(1));
 dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();navigate(event.key==='ArrowLeft'?-1:1);}});
 dialog.addEventListener('close',()=>{token++;motions.forEach(a=>a.cancel());motions=[];sheet?.remove();sheet=null;busy=false;announcement.textContent='';});
})();

// Interações exclusivas para celulares; o comportamento no computador é preservado.
(()=>{
 const mobile=matchMedia('(max-width:760px)');
 const menuButton=document.querySelector('.menu-button'),navigation=document.querySelector('#navigation');
 function labelMenu(){if(!menuButton)return;if(mobile.matches)menuButton.setAttribute('aria-label',menuButton.getAttribute('aria-expanded')==='true'?'Fechar menu':'Abrir menu');else menuButton.removeAttribute('aria-label');}
 menuButton?.addEventListener('click',labelMenu);
 navigation?.addEventListener('click',()=>{if(mobile.matches)labelMenu();});
 document.addEventListener('pointerdown',event=>{if(!mobile.matches||!navigation?.classList.contains('open')||event.target.closest('.site-header'))return;closeMenu();labelMenu();});
 document.addEventListener('keydown',event=>{if(mobile.matches&&event.key==='Escape')labelMenu();});
 mobile.addEventListener('change',labelMenu);labelMenu();
 const track=document.querySelector('.catalog-track');
 track?.addEventListener('click',event=>{
  if(!mobile.matches)return;
  const panel=event.target.closest('.catalog-panel');if(!panel)return;
  event.stopImmediatePropagation();
  track.dispatchEvent(new CustomEvent('catalogopen',{detail:{panel}}));
 },true);
 const hero=document.querySelector('.hero-slider');let gesture=null;
 hero?.addEventListener('pointerdown',event=>{
  if(!mobile.matches||event.pointerType!=='touch'||!event.isPrimary||event.target.closest('a,button'))return;
  const media=hero.querySelector('.hero-media')?.getBoundingClientRect();
  if(!media||event.clientY<media.top||event.clientY>media.bottom)return;
  gesture={id:event.pointerId,x:event.clientX,y:event.clientY,time:performance.now()};
 });
 hero?.addEventListener('pointerup',event=>{
  const start=gesture;gesture=null;
  if(!mobile.matches||!start||start.id!==event.pointerId)return;
  const dx=event.clientX-start.x,dy=event.clientY-start.y;
  if(Math.abs(dx)<60||Math.abs(dx)<Math.abs(dy)*1.5||performance.now()-start.time>700)return;
  hero.querySelector(dx<0?'[data-next]':'[data-prev]')?.click();
 });
 hero?.addEventListener('pointercancel',()=>{gesture=null;});
})();

// Progressão reversível: o estado acompanha a posição, sem depender de cruzamentos.
(()=>{
 const mobile=matchMedia('(max-width:760px)');
 const cards=[...document.querySelectorAll('.service-card,.reg-document')];
 let frame=0,navigating=false;
 function scan(){
  frame=0;if(navigating||!mobile.matches||document.querySelector('.category-dialog')?.open)return;
  const viewport=window.visualViewport;
  const middle=(viewport?.offsetTop||0)+(viewport?.height||window.innerHeight)/2;
  let frontierReached=false;
  for(const card of cards){
   const open=card.getAttribute('aria-expanded')==='true';
   // A altura anterior já foi atualizada antes de medir o próximo card.
   const top=card.getBoundingClientRect().top;
   const shouldOpen=!frontierReached&&top<=middle+(open?12:0);
   if(!shouldOpen)frontierReached=true;
   if(shouldOpen!==open)card.dispatchEvent(new CustomEvent('mobilecardprogress',{detail:{open:shouldOpen}}));
  }
 }
 function schedule(){if(!mobile.matches||frame)return;frame=requestAnimationFrame(scan);}
 document.addEventListener('mobileanchorstart',()=>{navigating=true;cancelAnimationFrame(frame);frame=0;});
 document.addEventListener('mobileanchorend',()=>{navigating=false;schedule();});
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 window.visualViewport?.addEventListener('resize',schedule,{passive:true});
 document.querySelector('.category-dialog')?.addEventListener('close',schedule);
 mobile.addEventListener('change',()=>{
  cancelAnimationFrame(frame);frame=0;
  if(!mobile.matches)cards.forEach(card=>card.dispatchEvent(new Event('mobilecardreset')));
  else schedule();
 });
 document.fonts?.ready.then(schedule);schedule();
})();

// Botões da capa: posiciona o título abaixo do cabeçalho somente no celular.
(()=>{
 const mobile=matchMedia('(max-width:760px)');let cancelNavigation=null;
 document.querySelectorAll('.hero-slider .slide-cta').forEach(link=>link.addEventListener('click',event=>{
  if(!mobile.matches||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const section=document.querySelector(link.hash);if(!section)return;
  event.preventDefault();cancelNavigation?.();closeMenu();
  const title=section.querySelector('.eyebrow')||section;
  document.dispatchEvent(new Event('mobileanchorstart'));
  // Expande os cards anteriores antes de calcular a posição final da seção.
  document.querySelectorAll('.service-card,.reg-document').forEach(card=>{
   const before=Boolean(title.compareDocumentPosition(card)&Node.DOCUMENT_POSITION_PRECEDING);
   card.dispatchEvent(new CustomEvent('mobilecardprogress',{detail:{open:before}}));
  });
  function destination(){return Math.max(0,window.scrollY+title.getBoundingClientRect().top-document.querySelector('.site-header').getBoundingClientRect().bottom-12);}
  const top=destination(),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  history.pushState(null,'',link.hash);
  let frame=0,finished=false;const begin=performance.now();
  function finish(correct){if(finished)return;finished=true;cancelAnimationFrame(frame);if(correct)window.scrollTo({top:destination(),behavior:'instant'});cancelNavigation=null;document.dispatchEvent(new Event('mobileanchorend'));}
  cancelNavigation=()=>finish(false);
  window.scrollTo({top,behavior:reduce?'instant':'smooth'});
  function settle(){if(Math.abs(window.scrollY-top)<1||performance.now()-begin>1800){finish(true);return;}frame=requestAnimationFrame(settle);}
  frame=requestAnimationFrame(settle);
 }));
})();
