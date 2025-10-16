# Content & Tone Playbook for griffen.codes

Use this playbook when prompting an assistant or drafting by hand so project showcases and blog posts stay consistent with the Coco and Vercel Doorman examples.

---

## 1. Project Overview Pages (griffen.codes/projects)

**Purpose:** Marketing-forward snapshot that helps visitors understand value quickly.

### Structure
- **Title:** `<Project Name> — <One-line value punch>` (emoji optional but encouraged).
- **Subtitle / lead sentence:** Friendly, results-oriented, one sentence max.
- **Badge row (optional):** npm version, downloads, stars, etc. only when supplied.
- **Suggested section flow:**
  1. `Overview` or `🚀 What is <Project Name>?` — short origin story + value prop.
  2. `✨ Key Features` / `Key Capabilities` — group features by themes (Core Platform, Developer Experience, Enterprise) with emoji callouts.
  3. Audience fit (`🎯 Perfect For`, `Use Cases & Success Stories`, etc.) — tailor benefits to roles.
  4. `Quick Start` / `Get Started` — installation, setup, and core commands in fenced code blocks.
  5. `Measurable Impact` / `Impact & Proof` — metrics, testimonials, adoption stats (real numbers only; flag unknowns).
  6. Supporting sections as needed (`Recognition & Community`, `Technology Stack`, etc.).
  7. `🔗 Links` — GitHub, docs, community, examples (full URLs).
- **Closing:** Single line reinforcing the vision or inviting readers to try or learn more.

### Tone & Style
- Conversational, confident, and marketing-friendly.
- Lead with benefits, then explain the supporting features.
- Keep sentences tight (aim for ≤20 words).
- Use emojis sparingly to cue sections, mirroring `docs/PROJECT_SHOWCASE.md` and `docs/project-showcase.md`.
- Include concrete proof points (downloads, command counts, testimonials) only when provided or verified—otherwise request them.
- Highlight the project’s evolution (“Started as… now a complete platform”) when it adds credibility.

### Linking & Assets
- Use full URLs (e.g., `https://github.com/gfargo/<repo>`).
- Reference screenshots or assets only if supplied with the prompt.

---

## 2. Technical Blog Posts (griffen.codes/blog)

**Purpose:** Developer-centric narrative that shares the journey, technical decisions, and lessons learned.

### Structure
- **H1 title** + *italicized subtitle* framing the story.
- **Conversational intro** anchored in a personal moment (“I realized…”, “I kept…”).
- Follow a narrative arc: **problem → journey → technical decisions → outcomes → lessons → what’s next**.
- Encourage **phase-based storytelling** when the project evolved over time (e.g., Phase 1–4).
- Include **code blocks** with language tags, configuration snippets (JSON/YAML), and CLI examples to illustrate workflows.
- Reference specific files/functions with GitHub links (`https://github.com/gfargo/<repo>/tree/main/<path>`).
- Summarize **testing, reliability, and performance** work when relevant.
- Close with a **reflection and invitation** for discussion or feedback.

### Tone & Style
- First-person voice; be candid about missteps and trade-offs.
- Explain why decisions mattered (privacy, performance, workflow fit).
- Pair AI features with concrete developer outcomes.
- Keep hype in check—let specifics sell the story.
- When details are missing, pause and ask for clarification rather than inventing data.

### Final Checks
- [ ] Claims are backed by real data or labeled as opinion.
- [ ] Missing info is flagged for follow-up (no fabrication).
- [ ] Tone aligns with the principles below.
- [ ] GitHub links point to `main` branch paths.
- [ ] Closing paragraph feels human and invites conversation.
- [ ] Marketing overview and technical blog stay distinct (benefits vs. implementation lessons).
- [ ] Testimonials or quotes are sourced or clearly marked for confirmation.

---

## 3. Tone & Personality Principles

### Core Voice
- **Conversational:** Write like you’d explain the topic to a teammate. Prefer plain language, contractions, and short sentences over corporate tone.
- **Grounded in experience:** Share first-hand moments, small anecdotes, or learnings (e.g., “I lost track…”).
- **Optimistic but measured:** Highlight benefits without overselling; let real outcomes speak.
- **Respectful of time:** Be concise and assume the reader is technically savvy.
- **Transparent about trade-offs:** Call out hurdles, past limitations, and how they were addressed.

### Techniques
- Open with a relatable scene before diving into features.
- Own decisions with first-person voice.
- Show, don’t tell—explain why a design choice mattered and what it enabled.
- Mix short and medium-length sentences for natural rhythm.
- Pair AI capabilities with tangible developer outcomes (privacy, workflow fit, performance).
- Offer gentle invitations rather than hard calls to action (“give it a try if…”).

### Language Patterns

| Use | Instead of | Notes |
| --- | --- | --- |
| “I ended up…” | “We engineered…” | Favors candid, personal narrative. |
| “Helps with standups…” | “Ensures stakeholders…” | Focus on real-life scenarios, not guarantees. |
| “Feels like a teammate…” | “Provides unparalleled…” | Avoid hype; keep comparisons approachable. |
| “Folks told me…” | “Users unanimously agree…” | Reflect genuine feedback, not marketing spin. |

### Do & Don’t
- ✅ Mention model limitations, context windows, and privacy considerations when relevant.
- ✅ Link to source files using full GitHub paths (`https://github.com/gfargo/coco/tree/main/...`).
- ✅ Reference specific functions or modules when they illustrate a point.
- ✅ Ask for clarification when details are missing instead of guessing.
- ❌ Avoid superlatives (“best-ever”, “revolutionary”) unless quoting someone else.
- ❌ Don’t lecture; frame advice as observations or lessons learned.
- ❌ Skip buzzword lists—explain what makes the tool helpful instead.

### Tone Checklist
- [ ] Opening paragraph feels human and specific.
- [ ] Voice stays conversational throughout (reading aloud helps).
- [ ] Every AI-related claim includes context or an example.
- [ ] Technical sections link to relevant GitHub files.
- [ ] Closing invites conversation, doesn’t demand action.
- [ ] Ambiguous sections were clarified with stakeholders rather than imagined.

---

Keep this playbook handy while drafting or prompting. Copy relevant sections into briefs for collaborators so everyone stays aligned on voice, structure, and accuracy.***
