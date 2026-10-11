const menu=document.querySelector('.menu-button');
const nav=document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
window.matchMedia('(min-width:761px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
document.querySelector('#contact-form').addEventListener('submit',event=>{event.preventDefault();document.querySelector('#form-status').textContent='Teste concluído. Nenhum dado foi enviado ou armazenado. Na versão final, este formulário será conectado ao canal de atendimento.';});

const header=document.querySelector('.site-header');
function updateHeaderHeight(){document.documentElement.style.setProperty('--header-height',`${header.getBoundingClientRect().height}px`);}
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

const catalogData=[["perfumaria", "Perfumaria", "#694654", "Perfumes, body splashes e brumas perfumadas.", "Uma assinatura que permanece.", "Exploramos famílias olfativas, intensidade e experiência de uso para construir uma identidade perfumada alinhada à sua marca. O briefing orienta o perfil de fragrância, a apresentação e o momento de consumo.", "Perfil olfativo · Intensidade · Experiência de uso"], ["higiene", "Higiene pessoal", "#275b56", "Sabonetes líquidos, desodorantes e produtos para banho.", "O cuidado começa no cotidiano.", "Desenvolvemos propostas para tornar a rotina de higiene uma experiência agradável. Avaliamos público, formato, sensorial e aplicação para orientar a formulação e a seleção da embalagem.", "Rotina de uso · Limpeza · Sensorial"], ["labiais", "Cuidados labiais", "#a45341", "Balms, óleos labiais e esfoliantes.", "Pequenos gestos. Novas sensações.", "Criamos conceitos de cuidado labial com atenção à textura, ao acabamento e à praticidade. O projeto pode explorar diferentes formatos e experiências, conforme o posicionamento da marca.", "Textura · Acabamento · Aplicação"], ["masculinos", "Cuidados masculinos", "#304b38", "Produtos para barba, barbear e cuidados pós-barba.", "Uma rotina com identidade própria.", "Planejamos produtos para diferentes hábitos de cuidado masculino. Definimos sensorial, fragrância e apresentação a partir das necessidades do público e da experiência desejada para a linha.", "Barba · Barbear · Pós-barba"], ["infantis", "Cuidados infantis", "#45647d", "Shampoos, sabonetes e hidratantes para o público infantil.", "Delicadeza em cada escolha.", "Estruturamos o desenvolvimento considerando a faixa etária, o modo de uso e as avaliações necessárias ao projeto. A escolha dos ingredientes e da apresentação acompanha os cuidados técnicos específicos desse público.", "Faixa etária · Modo de uso · Avaliações técnicas"], ["solar", "Proteção solar", "#ad6d25", "Protetores faciais, corporais e produtos pós-sol.", "Cuidado para os dias de sol.", "Organizamos propostas de proteção e cuidado pós-sol a partir do público, da aplicação e do sensorial desejado. Projetos de protetores incluem planejamento das comprovações de eficácia e das etapas regulatórias aplicáveis.", "Aplicação · Sensorial · Comprovação de eficácia"], ["maos-pes", "Cuidados para mãos e pés", "#57425e", "Cremes, esfoliantes e cuidados para cutículas.", "Atenção aos detalhes da rotina.", "Desenvolvemos conceitos para hidratação, esfoliação e cuidado de mãos, pés e cutículas. Textura, espalhabilidade e acabamento são definidos conforme a ocasião de uso e a proposta de cada produto.", "Hidratação · Esfoliação · Cutículas"]];

// Carrossel horizontal e abertura imersiva com transição de expansão.
(()=>{
 const section=document.querySelector('.catalog-section');if(!section)return;
 const track=section.querySelector('.catalog-track'),panels=[...track.querySelectorAll('.catalog-panel')],dialog=document.querySelector('.catalog-dialog');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 let origin=null,busy=false,ghost=null,drag=null,dragged=false,oldOverflow='';
 const prev=section.querySelector('[data-catalog-prev]'),next=section.querySelector('[data-catalog-next]');
 function updateNavigation(){prev.disabled=track.scrollLeft<4;next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-4;}
 function move(direction){const step=panels[0].offsetWidth+parseFloat(getComputedStyle(track).gap||0);track.scrollBy({left:direction*step,behavior:reduce.matches?'instant':'smooth'});}
 prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));track.addEventListener('scroll',updateNavigation,{passive:true});new ResizeObserver(updateNavigation).observe(track);updateNavigation();
 track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
 track.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,left:track.scrollLeft};dragged=false;});
 window.addEventListener('pointermove',e=>{if(!drag)return;const delta=e.clientX-drag.x;if(Math.abs(delta)>6){dragged=true;track.classList.add('is-dragging');track.scrollLeft=drag.left-delta;}});
 window.addEventListener('pointerup',()=>{drag=null;track.classList.remove('is-dragging');});
 window.addEventListener('pointercancel',()=>{drag=null;dragged=false;track.classList.remove('is-dragging');});
 async function open(panel){if(busy||dialog.open)return;busy=true;origin=panel;const [key,title,color,examples,headline,brief,topics]=catalogData[Number(panel.dataset.category)];const rect=panel.getBoundingClientRect();
  dialog.style.setProperty('--category-color',color);dialog.querySelector('h2').textContent=title;dialog.querySelector('.catalog-detail-headline').textContent=headline;dialog.querySelector('.catalog-detail-brief').textContent=brief;dialog.querySelector('.catalog-detail-topics').textContent=topics;dialog.querySelector('.catalog-detail-examples').textContent=examples;const img=dialog.querySelector('.catalog-detail-image img');img.src=`assets/catalog-${key}.webp`;img.alt=`Produtos conceituais de ${title}`;
  oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();dialog.scrollTop=0;
  if(!reduce.matches&&Element.prototype.animate){ghost=document.createElement('div');ghost.className='catalog-expansion';ghost.style.setProperty('--category-color',color);ghost.style.cssText+=`;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;border-radius:6px`;ghost.append(panel.querySelector('img').cloneNode());dialog.append(ghost);dialog.classList.add('is-visible');
   try{const animation=ghost.animate([{left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,borderRadius:'6px'},{left:'0px',top:'0px',width:`${window.innerWidth}px`,height:`${window.innerHeight}px`,borderRadius:'0px'}],{duration:800,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});setTimeout(()=>ghost?.classList.add('is-dissolving'),260);await animation.finished;}catch{}
   ghost?.remove();ghost=null;
  }else dialog.classList.add('is-visible');
  dialog.classList.add('is-ready');busy=false;
 }
 panels.forEach(panel=>panel.addEventListener('click',e=>{if(dragged){e.preventDefault();dragged=false;return;}open(panel);}));
 function close(){if(busy)return;dialog.close();}
 dialog.querySelector('.catalog-close').addEventListener('click',close);
 dialog.addEventListener('cancel',e=>{if(busy)e.preventDefault();});
 dialog.addEventListener('close',()=>{ghost?.remove();ghost=null;dialog.classList.remove('is-visible','is-ready');document.body.style.overflow=oldOverflow;busy=false;origin?.focus({preventScroll:true});});
 dialog.querySelector('.catalog-detail-cta').addEventListener('click',e=>{e.preventDefault();if(busy)return;close();document.querySelector('#contato').scrollIntoView({behavior:reduce.matches?'instant':'smooth'});document.querySelector('#contato input')?.focus({preventScroll:true});});
})();
