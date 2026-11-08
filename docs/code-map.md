# Code map

| File | Responsibility |
| --- | --- |
| `index.html` | Original sections and research markup, added vision/product content, loading overlay and boot fallback. Placeholder menu/View More destinations remain by request. |
| `variable.css` | Existing brand palette and maximum container width. |
| `style.css` | Original desktop styling, unchanged. |
| `script.js` | Existing Lenis integration and facility emphasis; responsive building/history scenes. History uses one continuous playhead for photo travel, gently fading years and rail fill; photo arrival marks the corresponding text. Stable touch height and static short-screen mode remain. Research keeps its original click tabs. |
| `additions.css` | Shared section type/buttons, vision expanding cards, product presentation and hero loading styles. |
| `additions.js` | Vision hover/tap/keyboard accordion, product crossfade and per-item entrances at the lower viewport inset (18%, capped at 180px), centered character reveal transferring the real hero text to its original position. Loading locks and restores input with a fallback. |
| `responsive.css` | Page gutters, fluid facility images, tablet/mobile layout, touch-readable equipment captions, sticky scenes and small-screen footer. Research changes apply only below 1100px. |

## Flow
The page retains its existing GSAP/ScrollTrigger, Swiper and Lenis dependencies. `script.js` owns scrolling and original scene controllers; `additions.js` owns added content and loading. Desktop scenes use pinning; touch/narrow scenes use CSS sticky tracks. Height-only touch resize preserves the scene height; width changes remeasure it. Very short screens present scene information in normal flow. Animation runs independently of OS motion preferences. Existing AOS entries and GSAP entrances share the 18%/180px start line; each item owns its trigger. Pinned scenes retain their authored scroll progression.

Research HTML and desktop design match the original project. Vision photos are separate from existing research/history assets. Asset origins are listed in `content-sources.md`.

History's `history-scroll` trigger measures photo centers, photo heights and copy bounds only on refresh. A linear track removes per-year motion stops; the nearest year uses a smooth fade with a quiet vertical offset, and the rail fills from the same playhead. Desktop photos meet the text's center; narrow screens wait until the photo clears the central copy lane. No extra animation clock or wheel-input correction is used.

<!-- code-map-review:start -->
{
  "version": 1,
  "files": {
    "additions.css": "35427a6db45d072fee28fbdddf52c33fd1d1e35aa2f903378dbb19808f2621fa",
    "additions.js": "7564c5ec8c18ecfe975a470b3a22744ce0c79fc1b5f7511931a8dfdb7f6847e3",
    "index.html": "7ebedb1d4f57a02e57a3a553d746195f57d14d431bd3f953f401acf4512017a7",
    "responsive.css": "7f805f4babbeea34f9b13b2a69746f970c18d736e24b64d9cb3f3c3ba49bbe41",
    "script.js": "4dbef5be142223d3dc051aeeeb1c7ac9345f0ee3819a8f93bfe70a94f3b5b2b5",
    "style.css": "130a5041838ef62ecccb465bd4f02babd96647640f9347fa3c1742cf4857fcfd",
    "variable.css": "d81016d4e2420655ee5c271bff5295e052d635f9a9727fb447781360200a016f"
  }
}
<!-- code-map-review:end -->
