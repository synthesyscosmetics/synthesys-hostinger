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
