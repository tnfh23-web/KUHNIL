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
  const rail = stage.querySelector('.history-rail');
  const fill = rail.querySelector('.history-rail-fill');
  const ending = stage.querySelector('.history-ending');
  const endingFrame = ending.querySelector('.history-ending-photo');
  const endingImage = endingFrame.querySelector('img');
  const shade = endingFrame.querySelector('.history-ending-shade');
  const closingText = ending.querySelector('.sec-5-t8');
  const closingButton = ending.querySelector('.button-box');
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
  const travel = events.length - 1, closingAt = travel + .55;
  const total = closingAt + 1.6 + 1.2;
  let timeline = null, closingIntro = null, introPlayed = false;
  let centers = [], photoHeights = [], textTops = [], anchor = 0, active = -1;
  let geometry = null, scrollDistance = 0;
  const state = { frame: 0, expansion: 0, retire: 0, shade: 0 };
  const rendered = events.map(() => ({ opacity: null, y: null }));
  const smoothstep = value => value * value * (3 - 2 * value);
  const mix = (from, to, progress) => from + (to - from) * progress;
  function measure() {
    const width = stage.clientWidth, height = stage.clientHeight;
    centers = photos.map(photo => photo.offsetTop + photo.offsetHeight / 2);
    photoHeights = photos.map(photo => photo.offsetHeight);
    textTops = events.map(event => (height - event.offsetHeight) / 2);
    anchor = height * (stickySceneQuery.matches ? .25 : .5);
    const clearance = Math.max(...events.map(event => event.offsetHeight)) / 2 + 24;
    stage.style.setProperty('--history-clearance', `${clearance}px`);
    // Preserve the continuous travel speed, adding only the final expansion and reading time.
    const photoTravel = centers[centers.length - 1] - centers[0];
    const unit = (height * 5 * photoTravel / (photoTravel + height * .85)) / travel;
    scrollDistance = Math.round(unit * total);
    section.style.setProperty('--history-scroll-distance', `${scrollDistance}px`);
    const last = photos[photos.length - 1];
    const thumb = { x: track.offsetLeft + last.offsetLeft, y: anchor - last.offsetHeight / 2, width: last.offsetWidth, height: last.offsetHeight };
    const sourceWidth = 1758, sourceHeight = 894;
    const cover = Math.max(width / sourceWidth, height / sourceHeight);
    const imageWidth = sourceWidth * cover, imageHeight = sourceHeight * cover;
    const smallScale = Math.max(thumb.width / sourceWidth, thumb.height / sourceHeight) / cover;
    const focus = stickySceneQuery.matches ? .64 : .5;
    geometry = { width, height, thumb, imageWidth, imageHeight, smallScale,
      fromX: thumb.x + thumb.width / 2 - imageWidth * smallScale / 2,
      fromY: thumb.y + thumb.height / 2 - imageHeight * smallScale / 2,
      toX: Math.min(0, Math.max(width - imageWidth, width / 2 - imageWidth * focus)),
      toY: (height - imageHeight) / 2,
    };
    endingImage.style.width = `${imageWidth}px`;
    endingImage.style.height = `${imageHeight}px`;
  }
  function render() {
    if (!geometry) return;
    const progress = Math.max(0, Math.min(1, state.frame / travel));
    const center = centers[0] + (centers[centers.length - 1] - centers[0]) * progress;
    let first = 0;
    while (first < events.length - 2 && center > centers[first + 1]) first++;
    const position = first + (center - centers[first]) / (centers[first + 1] - centers[first]);
    track.style.transform = `translate3d(0,${anchor - center}px,0)`;
    const nextActive = Math.round(position);
    if (nextActive !== active) {
      active = nextActive;
      section.dataset.historyYear = events[active].querySelector('h2').textContent;
    }
    events.forEach((event,index) => {
      const distance = Math.abs(position - index);
      const fade = Math.max(0, Math.min(1, (distance - .18) / .32));
      const clearance = stickySceneQuery.matches
        ? Math.max(0, Math.min(1, (textTops[index] - (anchor + centers[index] - center + photoHeights[index] / 2)) / 48))
        : 1;
      const opacity = +((1 - smoothstep(fade)) * smoothstep(clearance)).toFixed(4);
      const y = +(Math.max(-1, Math.min(1, index - position)) * 18).toFixed(3);
      if (rendered[index].opacity !== opacity) {
        event.style.opacity = opacity; event.style.visibility = opacity > 0 ? 'visible' : 'hidden';
        rendered[index].opacity = opacity;
      }
      if (opacity > 0 && rendered[index].y !== y) {
        event.style.translate = `0 ${y}px`; rendered[index].y = y;
      }
    });
    fill.style.transform = `scaleY(${.08 + .92 * progress})`;
    track.style.opacity = stack.style.opacity = rail.style.opacity = 1 - state.retire;
    const expand = state.expansion, g = geometry;
    ending.style.opacity = Math.min(1, state.retire * 3);
    ending.style.visibility = state.retire > 0 ? 'visible' : 'hidden';
    endingFrame.style.clipPath = `inset(${g.thumb.y * (1-expand)}px ${(g.width-g.thumb.x-g.thumb.width) * (1-expand)}px ${(g.height-g.thumb.y-g.thumb.height) * (1-expand)}px ${g.thumb.x * (1-expand)}px)`;
    endingImage.style.transform = `translate3d(${mix(g.fromX,g.toX,expand)}px,${mix(g.fromY,g.toY,expand)}px,0) scale(${mix(g.smallScale,1,expand)})`;
    shade.style.opacity = state.shade;
    const phase = expand >= .98 ? 'reading' : state.retire > 0 ? 'expanding' : 'history';
    if (section.dataset.historyPhase !== phase) section.dataset.historyPhase = phase;
    if (expand >= .98 && !introPlayed) { introPlayed = true; closingIntro?.play(0); }
    else if (expand < .9 && introPlayed) { introPlayed = false; closingIntro?.pause(0); }
  }
  function setup() {
    timeline?.scrollTrigger?.kill(); timeline?.kill(); closingIntro?.kill();
    gsap.set([track,stack,rail,ending,endingFrame,endingImage,shade,closingText,closingButton], { clearProps: 'transform,opacity,visibility,clipPath' });
    endingImage.style.removeProperty('width'); endingImage.style.removeProperty('height');
    endingFrame.style.removeProperty('will-change'); endingImage.style.removeProperty('will-change');
    events.forEach((event,index) => {
      event.style.removeProperty('opacity'); event.style.removeProperty('visibility'); event.style.removeProperty('transform'); event.style.removeProperty('translate');
      rendered[index].opacity = rendered[index].y = null;
    });
    active = -1; introPlayed = false;
    delete section.dataset.historyYear; delete section.dataset.historyPhase;
    updateSceneHeight();
    stack.setAttribute('aria-hidden', 'true'); track.setAttribute('aria-hidden', 'true');
    if (needsFlowScene(640)) {
      section.dataset.historyMode = 'static'; section.style.removeProperty('--history-scroll-distance'); return;
    }
    // Native sticky owns the stage through its final exit, including desktop.
    section.dataset.historyMode = 'sticky';
    Object.assign(state, {frame: 0, expansion: 0, retire: 0, shade: 0});
    closingIntro = gsap.timeline({paused: true})
      .fromTo(closingText, {autoAlpha: 0, y: 20}, {autoAlpha: 1, y: 0, duration: .7, ease: 'power2.out'})
      .fromTo(closingButton, {autoAlpha: 0, y: 12}, {autoAlpha: 1, y: 0, duration: .6, ease: 'power2.out'}, .22);
    measure(); render();
    const settings = {
      id: 'history-scroll', trigger: section.querySelector('.sec-5-wrap'), start: 'top top',
      end: () => '+=' + scrollDistance, scrub: stickySceneQuery.matches ? .5 : .65, invalidateOnRefresh: true,
      onRefreshInit: measure, onRefresh: render,
      onToggle: self => {
        endingFrame.style.willChange = self.isActive ? 'clip-path' : 'auto';
        endingImage.style.willChange = self.isActive ? 'transform' : 'auto';
      },
    };
    timeline = gsap.timeline({scrollTrigger: settings, onUpdate: render})
      .to(state, {frame: travel, duration: travel, ease: 'none'}, 0)
      .to(state, {retire: 1, duration: .35, ease: 'power1.inOut'}, closingAt)
      .to(state, {expansion: 1, duration: 1.5, ease: 'power2.inOut'}, closingAt + .1)
      .to(state, {shade: .5, duration: .65, ease: 'none'}, closingAt + .65)
      .to({}, {duration: 1.2}, closingAt + 1.6);
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
