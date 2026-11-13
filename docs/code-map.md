# Code map

| File | Responsibility |
| --- | --- |
| `index.html` | Original sections and research markup, vision/product content and three mobile-only VISION flow gaps, loading overlay and history ending: upscaled final photo, final message and existing View More button in a full-screen layer. Placeholder menu/View More destinations remain by request. |
| `variable.css` | Existing brand palette and maximum container width. |
| `style.css` | Original desktop styling, unchanged. |
| `script.js` | Existing Lenis integration and facility emphasis; responsive building/history scenes. Continuous photo/year/rail timing leads into a full-screen last-photo expansion and an automatic final-copy/button entrance. Stable touch height and short-screen flow remain. Research keeps its original click tabs. |
| `additions.css` | Shared section type/buttons, vision cards, product presentation, hero loading and full-screen history ending layers. |
| `additions.js` | Vision hover/tap/keyboard accordion above 640px and always-visible mobile card copy, product crossfade and per-item entrances at the lower viewport inset (18%, capped at 180px). Hero characters reveal in centered paragraphs, then word-level position matching carries centered wrapped rows to the final left-aligned hero without a jump. Loading locks and restores input with a fallback. |
| `responsive.css` | Page gutters, fluid facility images, tablet/mobile layout, touch-readable equipment captions, mobile VISION sticky card stack with short-screen flow, sticky scene distance and full-width history stage; short screens use a readable list then a full-screen closing photo. Research changes apply only below 1100px. |

## Flow
The page retains its existing GSAP/ScrollTrigger, Swiper and Lenis dependencies. `script.js` owns scrolling and scene controllers; `additions.js` owns added content and loading. The building scene retains desktop GSAP pinning and touch CSS sticky. History uses a CSS sticky track at every width, so the complete ending stays in place through its exit into the footer. Height-only touch resize preserves the scene height; width changes remeasure it. Very short screens present scene information in normal flow. Animation runs independently of OS motion preferences. Existing AOS entries and GSAP entrances share the 18%/180px start line; each item owns its trigger.

Research HTML and desktop design match the original project. Vision photos are separate from existing research/history assets. Asset origins are listed in `content-sources.md`.

VISION uses the mobile layout at widths up to 640px. The existing button label supplies a static heading in that layout, its accordion button is hidden, and every description stays visible and accessible. At heights of at least 560px, native CSS sticky cards stack below the measured header with 14px offsets. Card height is 54% of the small viewport height, clamped to 300–440px. Three mobile-only flow gaps provide the reading distance independently of each card's bottom margin. The bottom margins compensate the 14px top offsets so all four cards share one release boundary and leave together. A short trailing flow hold keeps the final copy readable before the facility section. Shorter screens show the same expanded content in normal flow. Width changes restore the original tablet toggles and desktop hover/keyboard controls. The stack adds no scrub animation or per-scroll layout measurement.

The loading hero centers both paragraph boxes and the rows inside them. At transfer, all word bounds are read before and after switching to the final left alignment and normal scrollbar layout, then their transform offsets animate to zero together. Wheel/touch/key input remains locked until completion. Glyph reveal stays on inner character spans; movement stays on outer word spans. Measurement happens once at transfer, and the original 1.15-second transfer and cleanup/fallback remain. Restoring the scrollbar before the target measurement avoids a text-width change at completion.

History's `history-scroll` trigger measures photo centers, photo heights, copy bounds and ending geometry only on refresh. A linear track keeps the photo travel continuous; the nearest year gently fades, and the rail fills from the same playhead. Desktop photos meet the text's center; narrow screens wait until the photo clears the copy lane. After 2011 is read, the rail and historical copy retire; the same last photograph expands from its thumbnail bounds to every edge of the viewport. The image uses one transform and its frame uses a rectangular clip. Shade follows the expansion; at 98% the final message then the existing button play automatically, even if scrolling stops. Reversing below 90% resets that entrance. A final reading hold releases the complete image/copy/button scene into normal flow before the unchanged footer.

The added ending distance is calculated once with the original photo travel speed preserved. Expansion uses 2.85 timeline units, 1.9 times the original 1.5-unit range, with steady linear easing. This is about 19% less expansion distance than the preceding 3.5-unit version, and about 1.8 viewport heights at 1440×900. The shade follows the expansion, while final-copy timing and reading hold are preserved. Narrow screens use the same measured distance in their CSS sticky track. Very short screens keep all seven dates in an accessible list and show the closing photo/message/button in normal flow. The upscaled WebP is shared by the last thumbnail and the ending image; the original PNG remains. See `docs/content-sources.md` for the AI-restoration provenance and prompt direction. No wheel-input correction or new animation clock is used.

<!-- code-map-review:start -->
{
  "version": 1,
  "files": {
    "additions.css": "947f08df3eb030380d8aef0ea3f34342e75922e96bb39affd25ec0cd51619f8b",
    "additions.js": "b99627542d94b5a11ebe300ed1f123af3dec194971c2ed9ef1103af3fce3af8e",
    "index.html": "934fd5de1e5b2d3ff92ca6b80442d36c7417452ba671e744cd97fb40b59526b5",
    "responsive.css": "bbf806d3574887c2881b54e5ad409731451eb64cfdf4f00f0891c27456b5dcf8",
    "script.js": "b5340dc21dbcbbce5c92613816406709a2cf16e6a9c04036c9215dac8908e069",
    "style.css": "130a5041838ef62ecccb465bd4f02babd96647640f9347fa3c1742cf4857fcfd",
    "variable.css": "d81016d4e2420655ee5c271bff5295e052d635f9a9727fb447781360200a016f"
  }
}
<!-- code-map-review:end -->
