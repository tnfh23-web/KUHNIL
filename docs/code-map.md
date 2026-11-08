# Code map

| File | Responsibility |
| --- | --- |
| `index.html` | Original sections and research markup, added vision/product content, loading overlay and boot fallback. Placeholder menu/View More destinations remain by request. |
| `variable.css` | Existing brand palette and maximum container width. |
| `style.css` | Original desktop styling, unchanged. |
| `script.js` | Existing Lenis integration and facility emphasis; responsive building/history scenes with shared history progress, stable touch height and static short-screen mode. Research keeps its original click tabs. |
| `additions.css` | Shared section type/buttons, vision expanding cards, product presentation and hero loading styles. |
| `additions.js` | Vision hover/tap/keyboard accordion, product crossfade and per-item entrances at the lower viewport inset (18%, capped at 180px), centered character reveal transferring the real hero text to its original position. Loading locks and restores input with a fallback. |
| `responsive.css` | Page gutters, fluid facility images, tablet/mobile layout, touch-readable equipment captions, sticky scenes and small-screen footer. Research changes apply only below 1100px. |

## Flow
The page retains its existing GSAP/ScrollTrigger, Swiper and Lenis dependencies. `script.js` owns scrolling and original scene controllers; `additions.js` owns added content and loading. Desktop scenes use pinning; touch/narrow scenes use CSS sticky tracks. Height-only touch resize preserves the scene height; width changes remeasure it. Very short screens present scene information in normal flow. Animation runs independently of OS motion preferences. Existing AOS entries and GSAP entrances share the 18%/180px start line; each item owns its trigger. Pinned scenes retain their authored scroll progression.

Research HTML and desktop design match the original project. Vision photos are separate from existing research/history assets. Asset origins are listed in `content-sources.md`.

<!-- code-map-review:start -->
{
  "version": 1,
  "files": {
    "additions.css": "35427a6db45d072fee28fbdddf52c33fd1d1e35aa2f903378dbb19808f2621fa",
    "additions.js": "7564c5ec8c18ecfe975a470b3a22744ce0c79fc1b5f7511931a8dfdb7f6847e3",
    "index.html": "b3effec7c86cad039ff8ab2d033090ab761a0d25f6d526ec827d61ee502bdf8f",
    "responsive.css": "7f805f4babbeea34f9b13b2a69746f970c18d736e24b64d9cb3f3c3ba49bbe41",
    "script.js": "6c0ec9663dd580cb80cfe1ef395a68c43dec6c7e13c2f3a08c536854757940e5",
    "style.css": "130a5041838ef62ecccb465bd4f02babd96647640f9347fa3c1742cf4857fcfd",
    "variable.css": "d81016d4e2420655ee5c271bff5295e052d635f9a9727fb447781360200a016f"
  }
}
<!-- code-map-review:end -->
