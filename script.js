// 스크롤 트리거 플러그인 활성화
gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   Lenis (Smooth Scroll)
========================================================= */
let lenis = null;

if (window.Lenis) {
  lenis = new Lenis({
    lerp: 0.06,
    wheelMultiplier: 1.2,
    smoothWheel: true,
    smoothTouch: false,
  });

  // Lenis <-> ScrollTrigger sync
  lenis.on("scroll", ScrollTrigger.update);

  // GSAP ticker에 Lenis 연결
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // refresh 시 Lenis 사이즈 재계산
  ScrollTrigger.addEventListener("refresh", () => lenis.resize());
}

// sec-2 scroll-text gsap
gsap.to(".sec-2-scroll-text", {
  "--hlw": "224px",
  duration: 0.9,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".sec-2-scroll-text",
    start: "top 80%",
    toggleActions: "play none none reverse",
  },
});
// sec-3 gsap ------------------------------ //
function scrollTrigger__init() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".sec-3 .content-wrap",
      start: "top top",
      end: "+=600%",
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  tl.set(".sec-3-text", { opacity: 0 });

  tl.to(".sec-3 .bg-container img", {
    scale: 1,
    ease: "none",
    duration: 3,
  });

  // 2) 텍스트 시퀀스 (bg 커진 다음 이어서)
  tl.fromTo(".t1", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2 })
    .to(".t1", { opacity: 0, duration: 0.4 })

    .fromTo(".t2", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2 })
    .to(".t2", { opacity: 0, duration: 0.4 })

    .fromTo(".t3", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2 })
    .to(".t3", { opacity: 0, duration: 0.4 })

    .fromTo(".t4", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2 })
    .to(".t4", { opacity: 0, duration: 0.4 })

    .fromTo(".t5", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2 });
}
// sec-4 tab

$(".tab-btn li").on("click", function (e) {
  e.preventDefault();

  const idx = $(this).index();

  // 탭 active
  $(".tab-btn li").removeClass("active");
  $(this).addClass("active");

  // 탭 전환
  $(".tab-list-box").removeClass("active").eq(idx).addClass("active");
});

window.addEventListener("load", scrollTrigger__init);
