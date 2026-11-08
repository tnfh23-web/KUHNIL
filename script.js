gsap.registerPlugin(ScrollTrigger);

// Preserve the site's motion independently of operating-system preferences.
const motionPreferences = { reduce: false };
const stickySceneQuery = matchMedia('(max-width: 900px), (pointer: coarse)');
let lenis = null;
let lenisTick = null;
let refreshFrame = 0;
let sceneWidth = 0;
const sceneControllers = [];
const needsFlowScene = (minHeight = 520) => motionPreferences.reduce || (stickySceneQuery.matches && (parseFloat(document.documentElement.style.getPropertyValue("--scene-height")) || innerHeight) < minHeight);

// Keep touch scenes stable while browser toolbars change the visible height.
// A real width change (rotation or breakpoint change) measures the scene again.
function updateSceneHeight(force = false) {
  const root = document.documentElement;
  if (!stickySceneQuery.matches) {
    root.style.removeProperty('--scene-height'); sceneWidth = innerWidth; return;
  }
  if (!force && sceneWidth === innerWidth && root.style.getPropertyValue('--scene-height')) return;
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;height:100vh;';
  if (CSS.supports('height', '100svh')) probe.style.height = '100svh';
  document.body.append(probe);
  const height = probe.offsetHeight;
  probe.remove();
  root.style.setProperty('--scene-height', `${height}px`);
  sceneWidth = innerWidth;
}

function configureSmoothScroll() {
  if (lenisTick) gsap.ticker.remove(lenisTick);
  lenis?.destroy(); lenis = null; lenisTick = null;
  if (!window.Lenis || motionPreferences.reduce) return;
  lenis = new Lenis({ lerp: .06, wheelMultiplier: 1.2, smoothWheel: !matchMedia('(pointer: coarse)').matches, smoothTouch: false });
  lenis.on('scroll', ScrollTrigger.update);
  lenisTick = time => lenis?.raf(time * 1000);
  gsap.ticker.add(lenisTick);
  gsap.ticker.lagSmoothing(0);
}
configureSmoothScroll();
ScrollTrigger.addEventListener('refresh', () => lenis?.resize());

function requestLayoutRefresh() {
  cancelAnimationFrame(refreshFrame);
  refreshFrame = requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    document.querySelectorAll('[data-aos]').forEach(element => element.setAttribute('data-aos-offset', Math.min(180, innerHeight * .18)));
    window.AOS?.refreshHard();
  });
}

// Facility emphasis follows the measured text width at every breakpoint.
gsap.to('.sec-2-scroll-text', {
  '--hlw': '100%', duration: .9, ease: 'power2.out',
  scrollTrigger: { trigger: '.sec-2-scroll-text', start: () => `top bottom-=${Math.min(180, innerHeight * .18)}`, toggleActions: 'play none none reverse' },
});

function sec_3_scrollTrigger__init() {
  const section = document.querySelector('.sec-3');
  const stage = section.querySelector('.content-wrap');
  const image = section.querySelector('.bg-container img');
  const texts = [...section.querySelectorAll('.sec-3-text')];
  let timeline = null;
  function setup() {
    timeline?.scrollTrigger?.kill(); timeline?.kill();
    gsap.set([image, ...texts], { clearProps: 'opacity,transform' });
    updateSceneHeight();
    if (needsFlowScene()) { section.dataset.sceneMode = 'static'; return; }
    const sticky = stickySceneQuery.matches;
    section.dataset.sceneMode = sticky ? 'sticky' : 'pinned';
    const settings = {
      trigger: sticky ? section : stage, start: 'top top',
      end: () => '+=' + (sticky ? section.offsetHeight - stage.offsetHeight : stage.offsetHeight * 4),
      scrub: sticky ? .5 : 1, invalidateOnRefresh: true,
    };
    if (!sticky) Object.assign(settings, { pin: stage, anticipatePin: 1 });
    timeline = gsap.timeline({ scrollTrigger: settings });
    timeline.set(texts, { opacity: 0 });
    timeline.fromTo(image, { scale: sticky ? .85 : .6 }, { scale: 1, duration: 1, ease: 'none' });
    texts.forEach(text => {
      timeline.fromTo(text, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2 })
        .to(text, { opacity: 0, duration: .4 });
    });
  }
  stickySceneQuery.addEventListener('change', () => { updateSceneHeight(true); setup(); requestLayoutRefresh(); });
  sceneControllers.push(setup);
  setup();
}

function initResearchTabs() {
  $('.tab-btn li').on('click', function (event) {
    event.preventDefault();
    const index = $(this).index();
    $('.tab-btn li').removeClass('active');
    $(this).addClass('active');
    $('.tab-list-box').removeClass('active').eq(index).addClass('active');
    requestLayoutRefresh();
  });
}

function sec_5_scrollTrigger__init() {
  const section = document.querySelector('.sec-5');
  const stage = section.querySelector('.history-stage');
  const track = stage.querySelector('.img-box');
  const photos = [...track.querySelectorAll('img')];
  const stack = stage.querySelector('.sec-5-text-con-box');
  const events = [...stack.querySelectorAll('.sec-5-text-box')];
  const fill = stage.querySelector('.history-rail-fill');
  const list = document.createElement('ol'); list.className = 'history-accessible';
  events.forEach((event,index) => {
    const item = document.createElement('li');
    if (photos[index]) {
      const picture = photos[index].cloneNode();
      picture.removeAttribute('class'); picture.alt = `${event.querySelector('h2').textContent}년 연혁 관련 이미지`;
      picture.loading = 'lazy'; picture.width = 465; picture.height = 402; item.append(picture);
    }
    const title = document.createElement('h3'); title.textContent = event.querySelector('h2').textContent; item.append(title);
    const detail = event.querySelector('.sec-5-text-2');
    if (detail) { const copy = document.createElement('p'); copy.textContent = detail.textContent; item.append(copy); }
    list.append(item);
  });
  section.prepend(list);
  let timeline = null, centers = [], photoHeights = [], textTops = [], anchor = 0, active = -1;
  const state = { frame: 0 };
  const rendered = events.map(() => ({ opacity: null, y: null }));
  const smoothstep = value => value * value * (3 - 2 * value);
  function measure() {
    centers = photos.map(photo => photo.offsetTop + photo.offsetHeight / 2);
    photoHeights = photos.map(photo => photo.offsetHeight);
    textTops = events.map(event => (stage.clientHeight - event.offsetHeight) / 2);
    // Photos meet the text on desktop; narrow screens keep a clear photo lane above it.
    anchor = stage.clientHeight * (stickySceneQuery.matches ? .25 : .5);
    const clearance = Math.max(...events.map(event => event.offsetHeight)) / 2 + 24;
    stage.style.setProperty('--history-clearance', `${clearance}px`);
  }
  function render() {
    const progress = Math.max(0, Math.min(1, state.frame / (events.length - 1)));
    const centerAt = index => centers[index] === undefined ? centers[centers.length - 1] + stage.clientHeight * .85 : centers[index];
    const center = centerAt(0) + (centerAt(events.length - 1) - centerAt(0)) * progress;
    let first = 0;
    while (first < events.length - 2 && center > centerAt(first + 1)) first++;
    const position = first + (center - centerAt(first)) / (centerAt(first + 1) - centerAt(first));
    // One uninterrupted movement, without the old stop / travel / stop quantization.
    track.style.transform = `translate3d(0,${anchor - center}px,0)`;
    const nextActive = Math.round(position);
    if (nextActive !== active) {
      active = nextActive;
      section.dataset.historyYear = events[active].querySelector('h2').textContent;
    }
    events.forEach((event,index) => {
      // Read at the photo's arrival. Fade gently between years without overlapping copy.
      const distance = Math.abs(position - index);
      const fade = Math.max(0, Math.min(1, (distance - .18) / .32));
      // In the narrow layout, the moving photo must clear the central copy lane first.
      const clearance = stickySceneQuery.matches && photos[index]
        ? Math.max(0, Math.min(1, (textTops[index] - (anchor + centers[index] - center + photoHeights[index] / 2)) / 48))
        : 1;
      const opacity = +((1 - smoothstep(fade)) * smoothstep(clearance)).toFixed(4);
      const y = +(Math.max(-1, Math.min(1, index - position)) * 18).toFixed(3);
      if (rendered[index].opacity !== opacity) {
        event.style.opacity = opacity;
        event.style.visibility = opacity > 0 ? 'visible' : 'hidden';
        rendered[index].opacity = opacity;
      }
      if (opacity > 0 && rendered[index].y !== y) {
        event.style.translate = `0 ${y}px`;
        rendered[index].y = y;
      }
    });
    fill.style.transform = `scaleY(${.08 + .92 * progress})`;
  }
  function setup() {
    timeline?.scrollTrigger?.kill(); timeline?.kill();
    gsap.set(track, { clearProps: 'transform' });
    events.forEach((event,index) => {
      event.style.removeProperty('opacity'); event.style.removeProperty('visibility'); event.style.removeProperty('transform'); event.style.removeProperty('translate');
      rendered[index].opacity = rendered[index].y = null;
    });
    active = -1;
    delete section.dataset.historyYear;
    updateSceneHeight();
    stack.setAttribute('aria-hidden', 'true'); track.setAttribute('aria-hidden', 'true');
    if (needsFlowScene(640)) { section.dataset.historyMode = 'static'; return; }
    const sticky = stickySceneQuery.matches;
    section.dataset.historyMode = sticky ? 'sticky' : 'animated';
    state.frame = 0; measure(); render();
    const settings = {
      id: 'history-scroll', trigger: sticky ? section.querySelector('.sec-5-wrap') : stage, start: 'top top',
      end: () => '+=' + (sticky ? section.querySelector('.sec-5-wrap').offsetHeight - stage.offsetHeight : stage.offsetHeight * 5),
      scrub: sticky ? .5 : .65, invalidateOnRefresh: true, onRefreshInit: measure, onRefresh: render,
    };
    if (!sticky) Object.assign(settings, { pin: stage, pinSpacing: true, anticipatePin: 1 });
    timeline = gsap.timeline({ scrollTrigger: settings })
      .to(state, { frame: events.length - 1, duration: events.length - 1, ease: 'none', onUpdate: render });
  }
  stickySceneQuery.addEventListener('change', () => { updateSceneHeight(true); setup(); requestLayoutRefresh(); });
  sceneControllers.push(setup);
  setup();
}

function syncHeroVideo() {
  const video = document.querySelector('.sec-1 video');
  if (motionPreferences.reduce) video.pause();
  else video.play().catch(() => {});
}
function initscrollani() {
  updateSceneHeight(true);
  sec_3_scrollTrigger__init(); sec_5_scrollTrigger__init(); initResearchTabs(); syncHeroVideo();
}
window.addEventListener('DOMContentLoaded', initscrollani);
window.addEventListener('load', requestLayoutRefresh);
document.fonts?.ready.then(requestLayoutRefresh);
let lastWidth = innerWidth, lastHeight = innerHeight, resizeTimer = 0;
window.addEventListener('resize', () => {
  const widthChanged = innerWidth !== lastWidth;
  const heightChanged = Math.abs(innerHeight - lastHeight) > 1;
  if (!widthChanged && (stickySceneQuery.matches || !heightChanged)) return;
  lastWidth = innerWidth; lastHeight = innerHeight;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    updateSceneHeight();
    if (widthChanged) sceneControllers.forEach(setup => setup());
    requestLayoutRefresh();
  }, 180);
}, { passive: true });
