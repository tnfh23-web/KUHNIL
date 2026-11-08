# Code map

| File | Responsibility |
| --- | --- |
| `index.html` | Original sections and research markup, vision/product content, loading overlay and history ending: upscaled final photo, final message and existing View More button in a full-screen layer. Placeholder menu/View More destinations remain by request. |
| `variable.css` | Existing brand palette and maximum container width. |
| `style.css` | Original desktop styling, unchanged. |
| `script.js` | Existing Lenis integration and facility emphasis; responsive building/history scenes. Continuous photo/year/rail timing leads into a full-screen last-photo expansion and an automatic final-copy/button entrance. Stable touch height and short-screen flow remain. Research keeps its original click tabs. |
| `additions.css` | Shared section type/buttons, vision cards, product presentation, hero loading and full-screen history ending layers. |
| `additions.js` | Vision hover/tap/keyboard accordion, product crossfade and per-item entrances at the lower viewport inset (18%, capped at 180px), centered character reveal transferring the real hero text to its original position. Loading locks and restores input with a fallback. |
| `responsive.css` | Page gutters, fluid facility images, tablet/mobile layout, touch-readable equipment captions, sticky scene distance and full-width history stage; short screens use a readable list then a full-screen closing photo. Research changes apply only below 1100px. |

## Flow
The page retains its existing GSAP/ScrollTrigger, Swiper and Lenis dependencies. `script.js` owns scrolling and scene controllers; `additions.js` owns added content and loading. The building scene retains desktop GSAP pinning and touch CSS sticky. History uses a CSS sticky track at every width, so the complete ending stays in place through its exit into the footer. Height-only touch resize preserves the scene height; width changes remeasure it. Very short screens present scene information in normal flow. Animation runs independently of OS motion preferences. Existing AOS entries and GSAP entrances share the 18%/180px start line; each item owns its trigger.

Research HTML and desktop design match the original project. Vision photos are separate from existing research/history assets. Asset origins are listed in `content-sources.md`.

History's `history-scroll` trigger measures photo centers, photo heights, copy bounds and ending geometry only on refresh. A linear track keeps the photo travel continuous; the nearest year gently fades, and the rail fills from the same playhead. Desktop photos meet the text's center; narrow screens wait until the photo clears the copy lane. After 2011 is read, the rail and historical copy retire; the same last photograph expands from its thumbnail bounds to every edge of the viewport. The image uses one transform and its frame uses a rectangular clip. Shade follows the expansion; at 98% the final message then the existing button play automatically, even if scrolling stops. Reversing below 90% resets that entrance. A final reading hold releases the complete image/copy/button scene into normal flow before the unchanged footer.

The added ending distance is calculated once with the original photo travel speed preserved. Narrow screens use the same measured distance in their CSS sticky track. Very short screens keep all seven dates in an accessible list and show the closing photo/message/button in normal flow. The upscaled WebP is shared by the last thumbnail and the ending image; the original PNG remains. See `docs/content-sources.md` for the AI-restoration provenance and prompt direction. No wheel-input correction or new animation clock is used.

<!-- code-map-review:start -->
{
  "version": 1,
  "files": {
    "additions.css": "1e85befef9b4f5027b72ba9d7f3c7daf13b5a85f57581e17ba8f99e91e315848",
    "additions.js": "7564c5ec8c18ecfe975a470b3a22744ce0c79fc1b5f7511931a8dfdb7f6847e3",
    "index.html": "5225a72bed014aa871319e80dd43bcec44bfbf36ff20288fd58477645440c08a",
    "responsive.css": "41024f1d180034baf771846905a653d2f56f28b177b235b95e5f7e559ddbf404",
    "script.js": "72d0661ad9d50dfb0448d3bc7e21fdf667e4fac8ed7a1f1f2e6a3ba3b4705289",
    "style.css": "130a5041838ef62ecccb465bd4f02babd96647640f9347fa3c1742cf4857fcfd",
    "variable.css": "d81016d4e2420655ee5c271bff5295e052d635f9a9727fb447781360200a016f"
  }
}
<!-- code-map-review:end -->
