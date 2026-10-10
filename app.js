const tabButtons=[...document.querySelectorAll('[data-tab]')];
const panelIds=tabButtons.map(b=>b.dataset.tab);
function selectArea(id,focus=false){if(!panelIds.includes(id))return;tabButtons.forEach(b=>{const selected=b.dataset.tab===id;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;if(selected&&focus)b.focus()});panelIds.forEach(p=>document.getElementById(p).hidden=p!==id)}
tabButtons.forEach((button,i)=>{button.addEventListener('click',()=>{selectArea(button.dataset.tab);history.replaceState(null,'','#'+button.dataset.tab)});button.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabButtons.length;if(e.key==='ArrowLeft')next=(i-1+tabButtons.length)%tabButtons.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabButtons.length-1;if(next!==undefined){e.preventDefault();selectArea(tabButtons[next].dataset.tab,true)}})});
const menu=document.querySelector('.menu-button'),nav=document.querySelector('nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
document.querySelectorAll('[data-area]').forEach(link=>link.addEventListener('click',()=>{selectArea(link.dataset.area);nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
function fromHash(){selectArea(location.hash.slice(1))}window.addEventListener('hashchange',fromHash);fromHash();
