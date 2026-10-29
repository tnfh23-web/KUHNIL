# Code map

| File | Responsibility |
| --- | --- |
| `index.html` | Original sections and research markup, added vision/product content, loading overlay and boot fallback. Placeholder menu/View More destinations remain by request. |
| `variable.css` | Existing brand palette and maximum container width. |
| `style.css` | Original desktop styling, unchanged. |
| `script.js` | Existing Lenis integration and facility emphasis; responsive building/history scenes with shared history progress, stable touch height and static short-screen/reduced-motion modes. Research keeps its original click tabs. |
| `additions.css` | Shared section type/buttons, vision expanding cards, product presentation and hero loading styles. |
| `additions.js` | Vision hover/tap/keyboard accordion, product crossfade and viewport-triggered entrances, centered character reveal transferring the real hero text to its original position. Loading locks and restores input with a fallback. |
| `responsive.css` | Page gutters, fluid facility images, tablet/mobile layout, touch-readable equipment captions, sticky scenes and small-screen footer. Research changes apply only below 1100px. |

## Flow
The page retains its existing GSAP/ScrollTrigger, Swiper and Lenis dependencies. `script.js` owns scrolling and original scene controllers; `additions.js` owns added content and loading. Desktop scenes use pinning; touch/narrow scenes use CSS sticky tracks. Height-only touch resize preserves the scene height; width changes remeasure it. Reduced motion and very short screens present scene information in normal flow.

Research HTML and desktop design match the original project. Vision photos are separate from existing research/history assets. Asset origins are listed in `content-sources.md`.

<!-- code-map-review:start -->
{
  "version": 1,
  "files": {
    "additions.css": "27636e6a12ae3ea2673251c02e49d8a617a49c2af929635226439aaa8cba4374",
    "additions.js": "1d0e0eec1575205d666d4b13513b4a3cf7dcbf2aa0d0fa19f3f9d19a81728230",
    "index.html": "d2ade6ebdfe1b423f0a46c009e908f59c8b4de3cf2ad56fb79b24264c1098b75",
    "responsive.css": "3e5bdf1911e841b09c6759499e1319a26d3ec6fe3a7fce8633bc428d4eb448a9",
    "script.js": "dcd8cdffe138986d89cea637ae519a840c42fdeb40283b6c068b85118ac60c1f",
    "style.css": "130a5041838ef62ecccb465bd4f02babd96647640f9347fa3c1742cf4857fcfd",
    "variable.css": "d81016d4e2420655ee5c271bff5295e052d635f9a9727fb447781360200a016f"
  }
}
<!-- code-map-review:end -->
