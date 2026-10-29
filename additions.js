/* Existing GSAP, ScrollTrigger, Swiper and Lenis are reused throughout. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const productRoot = document.querySelector('.kuhnil-product-slider');
  if (window.Swiper && productRoot) {
    const names = [...productRoot.querySelectorAll('h3')].map(title => title.textContent);
    const syncProduct = swiper => {
      swiper.slides.forEach(slide => slide.setAttribute('aria-hidden', String(!slide.classList.contains('swiper-slide-active'))));
      document.querySelectorAll('.kuhnil-product-pagination button').forEach((button,index) => {
        if (index === swiper.realIndex) button.setAttribute('aria-current','true');
        else button.removeAttribute('aria-current');
      });
    };
    const slider = new Swiper(productRoot, {
      slidesPerView: 1, effect: 'fade', fadeEffect: { crossFade: true }, speed: reduce.matches ? 0 : 850, loop: true,
      pagination: {
        el: document.querySelector('.kuhnil-product-pagination'), clickable: true,
        renderBullet: (index,className) => `<button type="button" class="${className}" aria-label="${names[index]} 보기"></button>`,
      },
      a11y: { paginationBulletMessage: '{{index}}번 제품 보기' },
      on: { init: syncProduct, slideChange: syncProduct, paginationUpdate: syncProduct },
    });
    reduce.addEventListener('change',()=>{slider.params.speed=reduce.matches?0:850;});
  }

  const accordion = document.querySelector('.kuhnil-capabilities');
  const cards = [...accordion.querySelectorAll('.kuhnil-capability')];
  const toggleMode = matchMedia('(max-width: 1100px), (hover: none)');
  let active = -1, resizeFrame = 0;
  function setActive(index) {
    active = index;
    cards.forEach((card,current) => {
      const expanded = current === active;
      card.classList.toggle('is-active',expanded);
      card.querySelector('button').setAttribute('aria-expanded',String(expanded));
      card.querySelector('.kuhnil-capability-detail').setAttribute('aria-hidden',String(!expanded));
    });
  }
  function measureAccordion() {
    accordion.dataset.accordionMode = toggleMode.matches ? 'toggle' : 'hover';
    const gap = parseFloat(getComputedStyle(accordion).columnGap) || 0;
    const available = accordion.clientWidth - gap * (cards.length-1);
    const padding = parseFloat(getComputedStyle(cards[0]).paddingLeft) * 2 + 2;
    accordion.style.setProperty('--vision-detail-width',`${Math.max(140,Math.floor((available-padding*cards.length)*2.35/(cards.length+1.35))-1)}px`);
  }
  cards.forEach((card,index) => {
    const button = card.querySelector('button');
    card.addEventListener('pointerenter',event=>{if(!toggleMode.matches && event.pointerType!=='touch')setActive(index);});
    card.addEventListener('focusin',()=>{if(!toggleMode.matches)setActive(index);});
    button.addEventListener('click',()=>setActive(toggleMode.matches && active===index ? -1 : index));
    button.addEventListener('keydown',event=>{
      if(event.ctrlKey||event.metaKey||event.altKey)return;
      let next=index;
      if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%cards.length;
      else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index-1+cards.length)%cards.length;
      else if(event.key==='Home')next=0;
      else if(event.key==='End')next=cards.length-1;
      else if(event.key==='Escape'){event.preventDefault();setActive(-1);return;}
      else return;
      event.preventDefault();cards[next].querySelector('button').focus({preventScroll:true});setActive(next);
    });
  });
  accordion.addEventListener('pointerleave',()=>{if(!toggleMode.matches && !accordion.contains(document.activeElement))setActive(-1);});
  accordion.addEventListener('focusout',event=>{if(!toggleMode.matches && !accordion.contains(event.relatedTarget))setActive(-1);});
  accordion.addEventListener('transitionend',event=>{if(event.propertyName==='height')requestLayoutRefresh();});
  toggleMode.addEventListener('change',()=>{measureAccordion();setActive(active);});
  window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(measureAccordion);},{passive:true});
  if(window.ResizeObserver){
    let observedWidth=0;
    new ResizeObserver(entries=>{
      const width=entries[0].contentRect.width;
      if(Math.abs(width-observedWidth)<.5)return;
      observedWidth=width;cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(measureAccordion);
    }).observe(accordion);
  }
  accordion.dataset.accordionReady='true';
  document.addEventListener('kuhnil:ready',measureAccordion);
  measureAccordion();

  if (!window.gsap || !window.ScrollTrigger) return;
  const revealSetups=[];
  function revealGroup(targets,trigger,{fadeOnly=false,delay=0}={}) {
    if(!targets.length)return;
    let timeline=null,scrollTrigger=null;
    function setup(){
      scrollTrigger?.kill();timeline?.kill();
      gsap.set(targets,{clearProps:'opacity,transform,clipPath'});
      if(reduce.matches||targets.every(target=>target.dataset.revealed==='true'))return;
      timeline=gsap.timeline({paused:true,onComplete:()=>targets.forEach(target=>target.dataset.revealed='true')});
      targets.forEach((target,index)=>{
        timeline.fromTo(target,fadeOnly?{opacity:0}:{opacity:0,y:22},
          {opacity:1,...(fadeOnly?{}:{y:0}),duration:fadeOnly?.95:.8,ease:'power2.out',clearProps:'opacity,transform'},delay+index*.16);
      });
      scrollTrigger=ScrollTrigger.create({trigger,start:fadeOnly?'top 74%':'top 85%',once:true,onEnter:()=>timeline.play()});
    }
    trigger.addEventListener('focusin',()=>timeline?.progress(1));
    revealSetups.push(setup);setup();
  }
  const visionIntro=document.querySelector('.kuhnil-vision-intro');
  revealGroup([...visionIntro.querySelectorAll('[data-added-reveal]')],visionIntro);
  cards.forEach((card,index)=>revealGroup([card],card,{delay:toggleMode.matches?0:index*.08}));
  const productCopy=document.querySelector('.kuhnil-product-copy');
  revealGroup([...productCopy.querySelectorAll('[data-added-reveal]')],productCopy,{fadeOnly:true});
  const productGallery=document.querySelector('.kuhnil-product-gallery');
  revealGroup([productGallery],productGallery,{fadeOnly:true,delay:.12});
  reduce.addEventListener('change',()=>revealSetups.forEach(setup=>setup()));

  function initHeroLoader(){
    const root=document.documentElement;
    const overlay=document.querySelector('.kuhnil-loader');
    if(!root.classList.contains('is-kuhnil-loading')){overlay.remove();return;}
    const paragraphs=[...document.querySelectorAll('.sec-1 .text-box > p')];
    const header=document.querySelector('.top-bar');
    const locked=[...document.querySelectorAll('header,main,footer')].map(node=>({node,inert:node.inert}));
    const startingWidth=innerWidth;
    let finished=false,timeline=null,lines=[],characters=[];
    const blockScroll=event=>event.preventDefault();
    const blockKeys=event=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key))event.preventDefault();};
    function finish(){
      if(finished)return;finished=true;
      timeline?.kill();
      gsap.set([...lines,...characters,header],{clearProps:'opacity,transform'});
      root.classList.remove('is-kuhnil-loading','is-loader-ready','is-loader-transfer');
      overlay.remove();
      document.body.removeAttribute('aria-busy');
      locked.forEach(({node,inert})=>node.inert=inert);
      window.removeEventListener('wheel',blockScroll);window.removeEventListener('touchmove',blockScroll);
      window.removeEventListener('keydown',blockKeys,true);window.removeEventListener('resize',onResize);
      document.removeEventListener('kuhnil:load-fallback',finish);
      reduce.removeEventListener('change',onMotion);
      if(typeof lenis!=='undefined')lenis?.start();
      document.dispatchEvent(new Event('kuhnil:ready'));requestLayoutRefresh();
    }
    const onResize=()=>{if(innerWidth!==startingWidth)finish();};
    const onMotion=()=>{if(reduce.matches)finish();};
    document.addEventListener('kuhnil:load-fallback',finish,{once:true});
    window.addEventListener('resize',onResize);reduce.addEventListener('change',onMotion);
    window.addEventListener('wheel',blockScroll,{passive:false});window.addEventListener('touchmove',blockScroll,{passive:false});
    window.addEventListener('keydown',blockKeys,true);
    document.body.setAttribute('aria-busy','true');locked.forEach(({node})=>node.inert=true);
    if(typeof lenis!=='undefined'){lenis?.stop();lenis?.scrollTo(0,{immediate:true});}
    window.scrollTo(0,0);
    const fontReady=Promise.race([document.fonts?.ready||Promise.resolve(),new Promise(resolve=>setTimeout(resolve,1500))]);
    fontReady.then(()=>{
      if(finished)return;
      paragraphs.forEach(paragraph=>{
        const text=paragraph.textContent.trim();
        const readable=document.createElement('span');readable.className='kuhnil-sr-only';readable.textContent=text;
        const line=document.createElement('span');line.className='hero-line';line.setAttribute('aria-hidden','true');
        text.split(/(\s+)/).forEach(word=>{
          if(/^\s+$/.test(word)){line.append(document.createTextNode(word));return;}
          const group=document.createElement('span');group.className='hero-word';
          Array.from(word).forEach(character=>{const span=document.createElement('span');span.className='hero-character';span.textContent=character;group.append(span);});
          line.append(group);
        });
        paragraph.replaceChildren(readable,line);lines.push(line);
      });
      characters=lines.flatMap(line=>[...line.querySelectorAll('.hero-character')]);
      gsap.set(characters,{opacity:0,yPercent:105});
      root.classList.add('is-loader-ready');
      timeline=gsap.timeline({onComplete:finish});
      lines.forEach((line,index)=>timeline.to(line.querySelectorAll('.hero-character'),
        {opacity:1,yPercent:0,duration:.65,stagger:.022,ease:'power3.out'},index*.6));
      timeline.addLabel('transfer','+=.35');
      timeline.call(()=>{
        const centered=lines.map(line=>line.getBoundingClientRect());
        root.classList.add('is-loader-transfer');
        lines.forEach((line,index)=>{
          const target=line.getBoundingClientRect();gsap.set(line,{x:centered[index].left-target.left,y:centered[index].top-target.top});
        });
      },null,'transfer');
      timeline.to(lines,{x:0,y:0,duration:1.15,ease:'power3.inOut'},'transfer');
      timeline.to(overlay,{opacity:0,duration:1.05,ease:'power2.inOut'},'transfer');
      timeline.fromTo(header,{opacity:0,y:-12},{opacity:1,y:0,duration:.65,ease:'power2.out'},'transfer+=.35');
    });
  }
  initHeroLoader();
})();
