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
    window.AOS?.refresh();
  });
}

// Facility emphasis follows the measured text width at every breakpoint.
gsap.to('.sec-2-scroll-text', {
  '--hlw': '100%', duration: .9, ease: 'power2.out',
  scrollTrigger: { trigger: '.sec-2-scroll-text', start: 'top 80%', toggleActions: 'play none none reverse' },
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
  let timeline = null, centers = [], anchor = 0;
  const state = { frame: 0 };
  function measure() {
    centers = photos.map(photo => photo.offsetTop + photo.offsetHeight / 2);
    anchor = stage.clientHeight * (stickySceneQuery.matches ? .25 : .36);
    const clearance = Math.max(...events.map(event => event.offsetHeight)) / 2 + 24;
    stage.style.setProperty('--history-clearance', `${clearance}px`);
  }
  function render() {
    const position = Math.max(0, Math.min(events.length - 1, state.frame));
    const first = Math.floor(position);
    const fraction = Math.max(0, Math.min(1, (position - first - .22) / .56));
    const centerAt = index => centers[index] === undefined ? centers[centers.length - 1] + stage.clientHeight * .85 : centers[index];
    const center = centerAt(first) + (centerAt(Math.min(first + 1, events.length - 1)) - centerAt(first)) * fraction;
    gsap.set(track, { y: anchor - center });
    const visibleRange = stickySceneQuery.matches ? .25 : .32;
    events.forEach((event,index) => {
      const opacity = Math.max(0, Math.min(1, (visibleRange - Math.abs(position - index)) / .12));
      event.style.opacity = opacity; event.style.visibility = opacity > 0 ? 'visible' : 'hidden';
    });
    fill.style.transform = `scaleY(${.08 + .92 * position / (events.length - 1)})`;
  }
  function setup() {
    timeline?.scrollTrigger?.kill(); timeline?.kill();
    gsap.set(track, { clearProps: 'transform' });
    events.forEach(event => { event.style.removeProperty('opacity'); event.style.removeProperty('visibility'); event.style.removeProperty('transform'); });
    updateSceneHeight();
    stack.setAttribute('aria-hidden', 'true'); track.setAttribute('aria-hidden', 'true');
    if (needsFlowScene(640)) { section.dataset.historyMode = 'static'; return; }
    const sticky = stickySceneQuery.matches;
    section.dataset.historyMode = sticky ? 'sticky' : 'animated';
    state.frame = 0; measure(); render();
    const settings = {
      trigger: sticky ? section.querySelector('.sec-5-wrap') : stage, start: 'top top',
      end: () => '+=' + (sticky ? section.querySelector('.sec-5-wrap').offsetHeight - stage.offsetHeight : stage.offsetHeight * 5),
      scrub: sticky ? .5 : 1, invalidateOnRefresh: true, onRefreshInit: measure, onRefresh: render,
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
