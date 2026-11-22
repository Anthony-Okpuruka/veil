# VEIL — Interactive Discovery Experience
## Master Development Prompt · Creative Direction V2

Build **VEIL**, a premium, minimalist, single-page interactive reading experience. Visitors discover a randomly selected fascinating article hidden beneath a living field of thousands of tiny particles.

The central idea:

> **There is something interesting beneath the surface. You just have to uncover it.**

This is not a conventional blog with a particle effect added. The particle interaction is the product. Prioritise the quality, responsiveness and visual beauty of that interaction above secondary features.

Act as a senior creative developer, interaction designer and frontend engineer. Inspect the existing repository before making changes. Preserve useful working code, identify problems and implement a coherent, production-quality experience rather than returning a static mockup.

---

# 1. Creative direction

## The feeling

VEIL should feel like a quiet digital art installation crossed with a luxury editorial publication. It should be mysterious, tactile, thoughtful and inviting—not cyberpunk, casino-like, noisy or overly futuristic.

The user should arrive, notice that something is hidden, instinctively move their cursor, and experience a satisfying moment of discovery.

The page should feel calm even while the particle field is moving.

## Colour palette

| Role | Colour |
|---|---|
| Background black | `#08080B` |
| Deep charcoal | `#111015` |
| Elevated surface | `#17141C` |
| Secondary surface | `#211B27` |
| Champagne gold | `#D8BD83` |
| Antique gold | `#C5A46D` |
| Muted violet | `#76618F` |
| Deep violet | `#40304F` |
| Soft near-white | `#F3EFE8` |
| Secondary text | `#A59BAA` |
| Subtle border | `#302A34` |

### Particle colour composition — important

Do **not** make every particle gold.

Use a carefully balanced mixture:
- Champagne and antique gold as the signature highlights.
- Muted violet particles to add depth and atmosphere.
- Soft near-white particles to create delicate contrast.
- A small amount of low-opacity neutral particles to prevent the surface looking patterned or overly decorative.

Vary particle opacity and size subtly. Gold should catch the eye without turning the whole page into glitter. Purple should feel atmospheric, not neon.

The overall field should resemble fine illuminated dust suspended in a dark room.

Use centralised design tokens. Avoid scattered hard-coded colour values.

## Typography

Use an editorial pairing:
- A refined serif such as Cormorant Garamond or a comparable typeface for headlines.
- A clean sans-serif such as Geist or Inter for body copy, navigation and controls.

Use generous line height, comfortable paragraph spacing and a readable article width. Headlines should feel expressive but not oversized to the point of dominating the experience.

Use restrained letter spacing for small metadata labels.

---

# 2. Page composition

Create a one-page experience with a strong visual hierarchy and generous negative space.

### Header

- VEIL wordmark at the upper left.
- A small descriptor such as `A STUDY IN DISCOVERY`.
- One discreet About control.
- Optional sound toggle only if ambient sound is genuinely implemented.

Keep the header quiet. It must not compete with the article or particle interaction.

### Article introduction

Display:
- Article issue number.
- Topic/category.
- Estimated reading time.
- Editorial headline.
- A short introductory paragraph.

The article should have a generous reading width—never force the user to inspect a tiny strip of text. Use a comfortable central column, with enough space around it for the particle field to feel immersive.

### Article body

The hidden content must be real semantic HTML beneath the particle canvas.

Use:
- Readable paragraphs.
- Occasional subheadings for longer pieces.
- A restrained pull quote or highlighted fact when appropriate.
- Comfortable paragraph spacing.
- A clear ending.

Do not render the article text into the canvas. The canvas is a visual overlay; the underlying article remains selectable and accessible HTML.

### Footer / bottom control area

Include a compact, elegant control area:
- `Reveal all`
- `Reset surface`
- `Discover another`
- An approximate reveal-progress indicator
- A quiet interaction hint

Keep the controls visually secondary. Do not create a large toolbar or a wall of buttons.

At the bottom, include this exact line:

**"Not everything reveals itself at once."**

Set it in small, refined typography with muted champagne or secondary text. It should feel like a quiet signature, not a call-to-action banner.

---

# 3. Signature interaction: a living particle surface

This is the most important feature. Implement it using HTML Canvas, not thousands of DOM elements.

The canvas should cover the article reading surface and visually conceal the content beneath it. It should not unnecessarily obscure navigation or controls.

## Particle field

Create a dense, subtly irregular distribution of approximately 5,000–15,000 particles on capable desktop devices. Dynamically reduce the number for smaller or lower-powered devices.

Each particle should have:
- Home/origin position.
- Current position.
- Velocity.
- Radius/size.
- Opacity.
- Colour.
- Optional subtle variation in response and return speed.

Avoid an obvious rigid grid. Use a gently jittered distribution or another carefully controlled arrangement so the field feels organic while maintaining consistent coverage.

Particles should be tiny—like grains of dust or microscopic fragments of light. Do not use large circles, confetti, stars or obvious sparkles.

## Radial cursor scattering

When a pointer moves across the particle surface:

1. Track its current and previous positions.
2. Find nearby particles efficiently.
3. Calculate their distance and direction relative to the cursor.
4. Apply a smooth radial repulsion force inside a configurable influence radius.
5. Scatter particles away from the cursor.
6. Expose the article naturally through the gaps left behind.
7. Gradually draw particles back toward their original positions after the cursor leaves.

Use a soft falloff curve rather than a hard circular boundary. The reveal area should have an irregular, organic edge.

The opening should look like the user is brushing away a field of microscopic dust—not looking through a perfectly cut transparent circle.

Suggested initial desktop influence radius: 85–135 pixels. Tune it visually and adapt it to viewport size.

## Directional movement and cursor trails

Do not make the particles respond only to cursor position.

Use pointer velocity and direction to influence the interaction:
- Faster movement may create a slightly stronger, broader disturbance.
- Particles should respond subtly in the direction of travel.
- The cursor should leave a short-lived trail of displacement.
- The trail should fade and settle naturally.

Keep the effect restrained. Fast movement should feel expressive, not explosive.

## Ripple physics

Add a travelling radial wave to the particle field.

As the pointer moves meaningfully:
- Emit a subtle ripple from the pointer's previous position or along its path.
- Let the wave propagate outward through nearby particles.
- Apply a brief displacement impulse as the wave reaches each particle.
- Fade the ripple amplitude over time and distance.
- Allow multiple ripples to overlap without creating chaotic motion.

The effect should resemble a disturbance moving through suspended microscopic dust.

Implement the ripple as a travelling radial wave with tunable amplitude, wavelength, propagation speed and decay. Avoid a generic water-filter effect or large visible rings.

## Natural particle movement

Combine:
- Cursor repulsion.
- Directional pointer influence.
- Ripple impulses.
- Spring-like attraction toward each particle's home position.
- Velocity damping.
- Maximum displacement limits.
- Smooth settling.

Particles must return to their original positions. They must not drift permanently or accumulate unbounded velocity.

Use smooth easing and physically plausible movement. The experience should feel tactile, responsive and slightly magical.

## Revealing the actual article

The article is underneath the particle canvas.

As particles scatter, the text becomes visible through the spaces between them. Do not simulate the reveal by placing a giant circular transparent mask over a static particle image.

The particles themselves must visibly move.

The reveal should be readable enough that users can follow the article as they explore. Tune particle density, particle size, spacing and reveal radius together. Do not make the effect so dense that reading becomes frustrating.

The canvas must not intercept text selection or keyboard interaction. Use appropriate pointer handling and layering. Keep the article accessible to assistive technology even while visually concealed.

---

# 4. Article content and random discovery

Each new visitor/session should receive a randomly selected article from a diverse content collection. Different visitors and devices should be able to see different articles at the same time.

## Article topics

Build a varied initial library of genuinely interesting short reads:
- Strange ocean phenomena.
- Space and astronomy.
- Forgotten history.
- Psychology and human behaviour.
- Unusual animals and nature.
- Ancient civilisations.
- Mathematical curiosities.
- Everyday objects with surprising histories.
- Scientific discoveries.
- Technology and forgotten inventions.
- Philosophy and thought experiments.
- Unusual natural phenomena.

Articles should feel like discoveries, not generic encyclopedia entries or clickbait.

## Article structure

Each article should contain:
- Unique ID.
- Category.
- Issue number or editorial identifier.
- Compelling headline.
- Short introduction.
- Approximately 300–600 words of body content.
- Optional subheadings or highlighted facts.
- Estimated reading time.
- Source references for factual claims where appropriate.

Write varied, engaging and factually responsible content. Do not invent scientific discoveries, historical events, quotations or citations.

## Randomisation behaviour

- Select an article independently for each new session or visitor.
- Keep the selected article stable during normal interaction and rerenders.
- Provide a deliberate `Discover another` action.
- Avoid immediately selecting the same article again when alternatives exist.
- Update headline, category, introduction, reading time and article body together.
- Reset the particle reveal state when changing articles.

Use a curated local article library for the first implementation. An AI content-generation service may be added later behind a server-side service, but it must not be required. Never claim that AI generated an article when the application merely selected it from a local collection.

---

# 5. Additional interactions

Keep the experience minimal. Every control should serve discovery.

## Discover another

When activated:
1. Fade or gently transition the current article.
2. Let the particle surface briefly settle or sweep across the reading area.
3. Select a different article.
4. Update all article metadata and content.
5. Restore the particle field to its covered state.
6. Reveal the new article through the same interaction.

No full-page reload.

## Reveal all

Gradually disperse or fade the particle field so the whole article becomes readable. Do not instantly remove every particle. Make the transition feel deliberate and satisfying.

## Reset surface

Return particles to their original positions and conceal the article again. The return should be animated, not abrupt.

## Reveal progress

Show a subtle approximate progress indicator based on the area or content region exposed. Label it honestly: it is an estimate of revealed area, not proof that the article has been read.

## About panel

Use a small, elegant modal or side panel. Suggested copy:

"Some stories deserve to be discovered slowly. Move through the surface and uncover what lies beneath."

Keep it short and visually consistent with the rest of the page.

## Optional ambient sound

Only implement sound if it adds genuine value. If included:
- Use original or appropriately licensed sounds.
- Keep sound off by default.
- Never autoplay.
- Provide an obvious sound toggle.
- Ensure the experience is complete without audio.

---

# 6. Mobile and touch experience

Hover does not exist on touchscreens. Support touch-and-drag as a first-class interaction.

On mobile:
- Use touch movement to scatter particles.
- Adapt particle count and radius to screen size.
- Make touch response smooth and accurate.
- Preserve readable article typography.
- Keep controls comfortably tappable.
- Avoid trapping the user inside the canvas or blocking normal page scrolling.
- Provide a simple reveal-all option.

Show a suitable hint such as `Touch and drag to uncover` on touch devices and `Move to uncover` on pointer devices.

Do not shrink the desktop layout mechanically. Recompose it for smaller screens.

---

# 7. Accessibility

The particle effect must not become an accessibility barrier.

- Keep article content in semantic HTML.
- Ensure screen readers can access the article.
- Provide a keyboard-accessible reveal option.
- Provide a reveal-all action.
- Use visible focus indicators.
- Maintain sufficient text contrast.
- Respect `prefers-reduced-motion`.
- Keep the canvas decorative and out of the keyboard tab order.
- Do not rely on colour alone to communicate state.
- Ensure the page remains usable without a mouse or touch gesture.

For reduced-motion preferences, reduce or disable ripple and particle movement and provide a clear static reveal mode.

---

# 8. Technical architecture

Inspect the existing repository and adapt to its framework. Do not rewrite working infrastructure without a reason.

If starting from scratch, use:
- Next.js or the existing React framework.
- TypeScript.
- Tailwind CSS.
- Framer Motion for interface transitions only.
- HTML Canvas for particle rendering.
- Lucide icons for restrained interface icons.

Suggested structure:

    src/
      app/
        page.tsx
        layout.tsx
        globals.css
      components/
        navigation/
          Header.tsx
        article/
          ArticleHeader.tsx
          ArticleBody.tsx
          ArticleMetadata.tsx
        particles/
          ParticleCanvas.tsx
          particle-engine.ts
          particle-types.ts
        controls/
          ExperienceControls.tsx
          RevealProgress.tsx
        overlays/
          AboutDialog.tsx
      hooks/
        useParticleEngine.ts
        useArticle.ts
      data/
        articles.ts
      lib/
        article-selector.ts
        reading-time.ts
      types/
        article.ts

Adapt this structure to the existing codebase. Do not create empty files or unnecessary abstractions.

## Rendering and performance

- Use `requestAnimationFrame`.
- Scale canvas resolution using device pixel ratio with sensible limits.
- Handle resizing robustly using `ResizeObserver` or an equivalent approach.
- Use spatial partitioning or a grid to avoid testing every particle against every pointer/ripple on every frame.
- Reuse arrays and particle objects where possible.
- Avoid excessive allocations inside the animation loop.
- Keep particle position updates outside React state.
- Use React state for article selection and interface state, not thousands of per-frame updates.
- Pause or reduce animation when the tab is hidden.
- Adapt particle density and effects to device capability.
- Clean up animation frames, observers and event listeners correctly.
- Prevent layout shifts when the canvas initialises.

The particle engine should be a separate reusable module with configurable parameters. Keep rendering, physics, pointer input and article state cleanly separated.

---

# 9. Visual quality requirements

The final site must have:
- A subtle ambient background glow.
- A carefully balanced mixture of gold, violet and near-white particles.
- Organic particle displacement rather than a perfect circular hole.
- Overlapping, restrained ripple waves.
- A generous editorial reading column.
- Beautiful serif headlines and highly readable body copy.
- Elegant article transitions.
- Delicate borders and dividers.
- Refined hover and focus states.
- Responsive typography and spacing.
- The quiet closing line: **"Not everything reveals itself at once."**

Avoid:
- Gold-only particles.
- Neon purple.
- Oversized glowing circles.
- A tiny, cramped article column.
- Excessive gradients.
- Generic dashboard cards.
- Loud futuristic fonts.
- Constant distracting animation.
- Unnecessary navigation.
- Fake buttons or placeholder interactions.
- Decorative charts or features unrelated to discovery.

The article should be comfortably readable as the user uncovers it. Do not sacrifice usability for visual novelty.

---

# 10. Testing and acceptance criteria

## Particle engine
- Thousands of particles render smoothly on capable desktop devices.
- Particle density adapts to device capability.
- Pointer movement produces visible radial scattering.
- Pointer speed and direction subtly influence the disturbance.
- Ripples propagate through particles and fade naturally.
- Particles return to their original positions.
- The reveal edge is organic, not a perfect cut-out circle.
- The underlying article is genuinely revealed through particle movement.
- Resizing does not break the simulation.
- The animation does not trigger continuous React rerenders.
- Reduced-motion mode works.

## Articles
- Different sessions can receive different random articles.
- The current article remains stable during ordinary interaction.
- Discover another selects a different article when possible.
- All article metadata updates correctly.
- Reading time is calculated from actual content.
- Content is not placeholder text.
- Articles remain accessible when the particle canvas is disabled.

## Interface
- Desktop, tablet and mobile layouts work.
- Touch-and-drag works.
- All controls perform their advertised actions.
- No horizontal overflow or broken layout.
- No dead buttons.
- Loading and transitions feel intentional.
- Keyboard navigation works.
- The bottom signature line is present.
- The overall design remains calm, luxurious and uncluttered.

---

# 11. Implementation sequence

Do not attempt to generate the entire project in one unverified code dump.

### Phase 1 — Foundation
Inspect the repository. Establish design tokens, typography, page composition, article data types and the responsive editorial layout.

### Phase 2 — Particle engine
Build the canvas renderer, particle distribution, radial scattering, directional influence, ripple physics and spring return. Tune the actual interaction before adding decorative features.

### Phase 3 — Reading experience
Add random article selection, article metadata, article content, reveal progression and article transitions.

### Phase 4 — Controls
Implement reveal all, reset surface, discover another, About panel and the approximate reveal indicator.

### Phase 5 — Mobile and accessibility
Add touch interaction, responsive particle settings, keyboard reveal, reduced-motion support and screen-reader-friendly content.

### Phase 6 — Polish and verification
Tune particle colour balance, density, motion, ripple decay, reveal radius, typography and spacing. Test on multiple viewport sizes and lower-powered devices.

After each phase, report:
- What was implemented.
- What works.
- What remains.
- Tests performed and their actual results.

Do not claim that a feature or test works unless it has been implemented and verified.

---

# 12. Final creative direction

When someone opens VEIL, they should feel curious before they understand how it works.

The first cursor movement should be delightful. The particles should behave like a living material, scattering with a soft ripple and gradually settling behind the user.

The article should reward exploration with a genuinely interesting discovery. The reading column should feel like a real publication, not a narrow strip of text hidden behind a gimmick.

The page should remain minimal. The controls should be few. The visual treatment should be luxurious but calm.

**The particle interaction is the experience. Everything else exists to support it.**

Build VEIL as a small, beautifully executed digital experience that people want to show their friends.
