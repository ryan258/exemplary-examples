# Exemplary Examples™ Roadmap

## Purpose

Turn the existing satirical concept into a real, trustworthy consulting and creative company for consultants, agencies, and presentation professionals.

Exemplary Examples™ will use an openly satirical brand to attract and challenge its audience while delivering legitimate professional work through named human strategists, AI-supported systems, and explicit truth standards. The initial commercial experience is an application-based Executive Retainer pilot. Its primary goal is to prove the operating and training process before optimizing for revenue or scale.

The current HTML artifact remains a strong brand prototype, but it is no longer the complete product definition. The confirmed business model and the internal training system are co-equal sources of truth for the launch.

## Definition of success

The project is ready when:

- A first-time visitor can identify both the satirical premise and the existence of a real professional service without mistaking fictional brand material for a real client claim.
- Every line consistently describes *developing* examples while distinguishing satirical fiction, sourced examples, and professionally modeled scenarios.
- At least one Lead Strategist and the people supporting the pilot have demonstrated the competencies and authorization required by the training system.
- The company can intake, scope, research, build, review, deliver, and retrospect on a pilot request using documented artifacts and review gates.
- Professional work clearly distinguishes sourced facts, client-provided facts, calculations, inferences, and modeled scenarios.
- Qualified visitors can apply for the limited Executive Retainer pilot and receive an accurate confirmation and follow-up expectation.
- The complete Home → About → Offering → Proof → Contact journey works at mobile, tablet, and desktop widths.
- Keyboard and screen-reader users can navigate and submit the pilot application without losing meaning or context.
- The page has no avoidable console errors, broken links, missing assets, or major automated accessibility findings.
- The site loads quickly on an ordinary mobile connection and remains legible if external fonts fail.
- There is a documented, repeatable way to train staff, operate the pilot, preview the site, verify changes, and publish the artifact.

## Product principles

1. **The dual proposition must work on a skim.** The audience should understand that the brand is satirical and the professional service is real.
2. **Disclose once, play straight.** Brand-level framing can identify the satirical nature of the company; the experience should not explain every joke, lapse into camp, or use satire to hide professional terms.
3. **Develop responsibly.** “Build,” “engineer,” and “develop” are on-strategy. Professional claims must still be classified, sourced, calculated, inferred, or modeled honestly.
4. **Institutional restraint is the aesthetic.** Typography, exhibit numbering, spacing, and small details should create credibility; animation and ornament should remain quiet.
5. **Human-accountable, AI-supported.** AI can assist production and critique; a named human remains accountable for sources, assumptions, decisions, and delivery.
6. **Accessibility is part of the straight-faced execution.** Semantic structure, focus behavior, contrast, reduced motion, and form clarity are launch requirements.
7. **Prove the operating process before scaling.** The pilot optimizes for reliable practice, supervision, and learning—not enrollment, automation, or revenue.
8. **Static-first where possible.** Add only the minimal secure service needed for a real pilot application; no broader framework, CMS, CRM, or platform is justified yet.
9. **Target the mechanism, not a real organization.** Satirical names, marks, testimonials, and claims remain fictional and non-identifying; real professional proof must be authorized and accurately represented.

## Scope boundaries

### Launch scope

- One responsive page with five exhibit-numbered sections: Home, About, Offering, Proof, and Contact.
- Existing navy, cream, and brass identity with Fraunces, Inter, and IBM Plex Mono.
- In-page navigation and tier-specific calls to action.
- Clear brand-level satirical framing plus an accurate description of the real professional practice.
- An application for a limited Executive Retainer pilot with a named owner, minimal data collection, consent/context, retention rules, spam protection, failure handling, and follow-up expectations.
- A documented human-plus-AI operating method with professional truth and review standards.
- The internal, competency-paced Contributor → Supervised Strategist → Lead Strategist certification system in [`training/`](training/).
- At least one dry run of the training system and one end-to-end simulated engagement before accepting a pilot client.
- Static hosting, basic metadata, favicon/social preview assets, and a lightweight verification workflow.

### Deferred until evidence supports it

- Separate routes for all five sections.
- CRM integration or a general-purpose lead database beyond the minimum secure pilot-application workflow.
- CMS/editorial workflows.
- Accounts, payments, dashboards, or client portals.
- Elaborate animation, custom illustration systems, or a broader component library.
- Traffic analytics beyond a privacy-conscious, explicitly chosen launch need.
- Public course enrollment, paid external certification, or an LMS.
- Automated client delivery or unsupervised AI agents.

### Explicitly out of scope

- Open self-service subscriptions or an unlimited retainer promise.
- Referencing, imitating, or criticizing a named real consultancy.
- Publishing satirical fiction, composites, assumptions, or modeled scenarios as verified real-world evidence.
- Allowing clients to decide whether professional disclosure standards apply.
- Certifying consultants by attendance, tenure, confidence, or quizzes alone.
- Adding copy that explains every joke or weakens the straight-faced brand execution.

## Decisions to settle before implementation

These are small decisions with downstream consequences. Record the chosen answers in the project description or a short decision note.

| Decision | Recommended default | Why it matters |
| --- | --- | --- |
| Site shape | Keep one page for the pilot launch | The existing scroll journey is coherent, faster to validate, and does not yet justify five routes. |
| Primary offer | Application-only Executive Retainer pilot | This proves recurring service and operating discipline without implying unlimited readiness. |
| Pilot success | A proven, documented operating process | The first milestone is reliable delivery and supervision; revenue and renewal are secondary evidence. |
| Delivery model | Named human strategist supported by AI and repeatable systems | Preserves speed while keeping truth, judgment, and client accountability human-owned. |
| Training | Competency-paced blended certification | Mixed-experience learners can progress without lowering the authorization standard. |
| Contact behavior | Secure pilot application with minimal data | A real application must transmit intentionally, name its purpose, and have an operating owner and retention policy. |
| Public framing | Clearly satirical brand; clearly real service | Visitors must not confuse brand fiction with professional proof or mistake the site for a purely fictional artifact. |
| Hosting | Static host with HTTPS and preview deployments | Matches the artifact and keeps operating cost and failure modes low. |
| Analytics | None at first | There is no stated measurement question that warrants a tracker. |
| Browser support | Current and previous major versions of Chrome, Safari, Firefox, and Edge | Provides a practical verification target without legacy complexity. |

## Delivery plan

Each task is sized to fit one focused implementation session. Complete tasks in order unless a dependency explicitly allows parallel work.

### Company Track — Prove the practice before accepting clients

The website may be refined in parallel, but the pilot application must not open until Checkpoint P is complete.

#### Task P0.1 — Assign governance and finish operating decisions

**Outcome:** The training and client process have accountable owners and usable policies.

**Work:**

- Name the program owner, initial facilitators, assessors, Lead supervisors, pilot application owner, and client escalation owner.
- Approve the six-class truth standard and critical-failure definitions in `training/TRAINING-SYSTEM-SPEC.md`.
- Define client data classifications, approved AI tools, prohibited inputs, storage locations, retention, and incident escalation.
- Choose a curriculum version, certification-record location, and authorization review cadence.
- Set pilot capacity based on named supervision and review availability.

**Acceptance criteria:**

- [ ] Every training, application, supervision, delivery, and escalation responsibility has a named owner and backup.
- [ ] Approved AI/data rules are specific enough to evaluate a proposed use before client information is entered.
- [ ] Pilot capacity cannot exceed the number of clients the certified team can supervise and review.

**Verification:** Run a tabletop exercise covering an AI data question, a disclosure dispute, an unavailable Lead, and an applicant-data deletion request; each event reaches a documented owner and decision.

**Dependencies:** None  
**Estimated scope:** Medium

#### Task P0.2 — Dry-run the complete training system

**Outcome:** A learner and facilitator can use the written training materials without relying on undocumented founder knowledge.

**Work:**

- Run orientation, truth classification, decision framing, evidence review, scenario construction, exhibit critique, AI red-team, and one client simulation.
- Test at least one accessibility accommodation in a workshop and simulation.
- Have two assessors independently score the same artifact and reconcile differences.
- Record confusing instructions, missing artifacts, hidden facilitator knowledge, timing observations, and rubric disagreement.
- Revise the curriculum as a versioned release.

**Acceptance criteria:**

- [ ] Every competency has usable instruction, practice, and assessment evidence.
- [ ] Facilitators can run the selected sessions from the written guides.
- [ ] Assessors reach the agreed calibration tolerance after discussion.
- [ ] No unresolved critical truth, confidentiality, authorization, or accessibility defect remains.

**Verification:** Complete the training-system quality checks in `training/TRAINING-SYSTEM-SPEC.md` and publish a dry-run report linked to the curriculum version.

**Dependencies:** Task P0.1  
**Estimated scope:** Medium

#### Task P0.3 — Certify the initial pilot team

**Outcome:** The people serving pilot clients have evidence-backed authorization.

**Work:**

- Route each candidate through the diagnostic without waiving required brand-specific assessments.
- Assess Contributors, Supervised Strategists, and at least one Lead Strategist using the published rubrics.
- Record scope conditions, remediation, assessor conflicts, and review dates.
- Confirm supervision capacity and backup coverage for every proposed pilot assignment.

**Acceptance criteria:**

- [ ] At least one active Lead Strategist is certified by two assessors, including one independent of direct supervision.
- [ ] Every pilot team member has a current certification record and works within its authorization.
- [ ] No unresolved critical failure or missing client-facing review gate remains.

**Verification:** Audit every team member against `training/templates/CERTIFICATION-RECORD.md` and rehearse assignment of an urgent request without exceeding authorization.

**Dependencies:** Task P0.2  
**Estimated scope:** Medium

#### Task P0.4 — Simulate the Executive Retainer end to end

**Outcome:** The operating system produces responsible work under realistic retainer pressure.

**Work:**

- Run a fictional engagement from application qualification through intake, queue triage, research, modeling, exhibit production, review, client challenge, delivery, and retrospective.
- Include incomplete evidence, a false AI citation, deadline pressure, a disclosure challenge, and a staff-availability change.
- Record supervisor correction and rescue work rather than hiding it.
- Revise service classes, review gates, templates, training, or capacity where the simulation exposes fragility.

**Acceptance criteria:**

- [ ] The team completes the cycle using the published system and approved tools.
- [ ] All planted defects are detected before simulated delivery.
- [ ] A reasonable audience can distinguish sourced, client-provided, calculated, inferred, and modeled material in the final artifact.
- [ ] The retrospective produces a prioritized improvement list with owners.

**Verification:** Conduct an independent quality review using `training/templates/QUALITY-REVIEW.md` and trace every final claim to the Evidence Register.

**Dependencies:** Task P0.3  
**Estimated scope:** Medium

#### Task P0.5 — Define the limited pilot offer and application operation

**Outcome:** The public invitation accurately matches what the certified team can deliver and safely operate.

**Work:**

- Define ideal pilot applicant, exclusions, capacity, service classes, expected client participation, pilot duration, and what discounted/unpaid participation does and does not include.
- Create selection criteria that do not imply the pilot is mature or unlimited.
- Define application fields, purpose, consent/context, access, retention, deletion, spam handling, response time, acceptance/decline communication, and owner.
- Prepare professional terms covering confidentiality, intellectual property, AI use, truth/disclosure, reliance, and termination for qualified review before real engagements.

**Acceptance criteria:**

- [ ] Public claims match certified capacity and the simulated operating process.
- [ ] The application collects only information required to qualify and contact a pilot applicant.
- [ ] Every submission has a secure destination, owner, response expectation, and deletion path.
- [ ] Professional terms and privacy language receive appropriate qualified review before the first client begins.

**Verification:** Process synthetic applications through acceptance, decline, no-response, deletion, and abuse scenarios; confirm each follows the documented operation.

**Dependencies:** Tasks P0.1 and P0.4  
**Estimated scope:** Medium

### Checkpoint P — Pilot readiness

- [ ] Initial team authorization and supervision capacity are current.
- [ ] End-to-end simulation and training dry run have no unresolved critical issue.
- [ ] Pilot offer, application operation, professional terms, and client escalation are owned.
- [ ] The team can explain what the service is, what it is not, and how constructed professional material is disclosed.

### Website Track — Phase 0: Align the artifact and source of truth

#### Task 0.1 — Resolve format and premise inconsistencies

**Outcome:** The project description and artifact describe the same launch product and use one vocabulary for the central idea.

**Work:**

- Clarify that launch is a five-section single-page site, or deliberately choose five separate pages before structural work begins.
- Replace the `<title>` phrase “Precedent-Driven Strategy Consulting” with example-development language.
- Change “Tier II — The Precedent Package” in the contact form to “The Example Development Package.”
- Change the post-submit “Sourcing Your Precedent” message to example-development language.
- Audit every CTA, metric, tier, testimonial, and exhibit reference against the project description.

**Acceptance criteria:**

- [ ] The project description and public artifact no longer disagree about page structure.
- [ ] No unintended “source/find precedent” language remains.
- [ ] Tier names, prices, timelines, and quantities match everywhere they appear.

**Verification:** Search the repository for `precedent`, `sourc`, all three tier names, and all price strings; review every match in context.

**Dependencies:** None  
**Estimated scope:** Small

#### Task 0.2 — Establish a concise content and exhibit map

**Outcome:** Every public claim and cross-reference has an intentional role.

**Work:**

- Create a short content inventory covering headline, supporting premise, metrics, founder narrative, tiers, testimonials, CTA, and confirmation state.
- Define whether references such as “See Exhibit 3.2” are intentionally non-clickable texture or should resolve to a visible sub-exhibit.
- Establish a visible brand-level framing that identifies the satirical context without explaining every joke.
- Reframe the current fictional testimonials and performance metrics as unmistakable satirical brand exhibits, or replace the “Proof” section with real methodology/process proof until authorized pilot evidence exists.
- Check fictional names, roles, company descriptions, and quantitative claims for plausibility without accidental real-world identification or implied real-client endorsement.

**Acceptance criteria:**

- [ ] Each section reinforces the central mechanism without simply repeating the hero.
- [ ] Every exhibit reference is either resolvable or deliberately documented as a stylistic citation.
- [ ] A reasonable visitor can distinguish satirical creative claims from factual claims about the real service.
- [ ] Copy contains no named real firms or people and does not imply fictional testimonials are real endorsements.

**Verification:** Perform one headline-only skim and one full read aloud; record and fix any place where the premise becomes ambiguous or the tone turns winking.

**Dependencies:** Task 0.1  
**Estimated scope:** Small

### Checkpoint A — Narrative lock

- [ ] A reviewer unfamiliar with the project can explain the premise after viewing only the hero and offering headings.
- [ ] The reviewer describes the tone as credible/consultative rather than cartoonish.
- [ ] Structure, vocabulary, and contact behavior are decided before markup is reorganized.

### Phase 1 — Build the maintainable static baseline

#### Task 1.1 — Organize the static artifact

**Outcome:** The page remains simple but gains a clear local-development and maintenance structure.

**Work:**

- Choose the smallest viable layout: an `index.html` plus external stylesheet and script only if separation improves readability.
- Add a short `README.md` with purpose, local preview command, file map, verification commands, and deployment notes.
- Add formatting/lint configuration only where it catches real errors; avoid introducing a framework or package manager solely for convention.

**Acceptance criteria:**

- [ ] A new contributor can preview the site from documented instructions.
- [ ] Content, presentation, and interaction code are easy to locate.
- [ ] The project does not require a build step unless that step provides a concrete launch capability.

**Verification:** Follow the README from a clean shell and load the site over a local HTTP server.

**Dependencies:** Checkpoint A  
**Estimated scope:** Small

#### Task 1.2 — Strengthen document semantics and navigation

**Outcome:** The visual structure is represented accurately in HTML and works without a mouse.

**Work:**

- Add semantic header, navigation, main, section, form, and footer relationships.
- Provide a visible-on-focus skip link and a useful document heading hierarchy.
- Give the navigation an accessible name and expose current/active section behavior only if it is accurate.
- Ensure sticky navigation does not cover anchored headings and that mobile users have access to navigation rather than losing it entirely.

**Acceptance criteria:**

- [ ] All primary sections and controls are reachable in a logical keyboard order.
- [ ] Anchor targets land with their headings visible.
- [ ] Mobile navigation exposes all five destinations.
- [ ] The page retains a coherent outline with CSS disabled.

**Verification:** Keyboard-only walkthrough at desktop and narrow widths; inspect the accessibility tree and heading outline.

**Dependencies:** Task 1.1  
**Estimated scope:** Medium

#### Task 1.3 — Make the consultation interaction honest and complete

**Outcome:** Qualified visitors can apply for the limited pilot through an accessible interaction whose data behavior and follow-up are accurate.

**Work:**

- Replace general tier selection with the approved Executive Retainer pilot application fields from Task P0.5.
- Associate every label with its control; add names, autocomplete guidance, and an explicit required/optional model.
- Explain the application purpose, what happens next, expected response time, and relevant privacy/retention information before submission.
- Implement secure transmission to the approved destination, server-side validation, spam/abuse controls, failure handling, duplicate handling, and delivery monitoring.
- Replace button-text mutation with accessible submitting, success, and failure states plus a safe retry path.
- Do not ask for sensitive client material during initial qualification.

**Acceptance criteria:**

- [ ] The application collects only the approved minimum qualification and contact fields.
- [ ] Validation, submitting, success, failure, and retry states are understandable visually and to a screen reader.
- [ ] Data reaches only the approved destination and does not appear in logs, analytics, URLs, or other unintended locations.
- [ ] Repeated, duplicate, malicious, and failed submissions do not create misleading confirmations or an unmanaged queue.
- [ ] The named application owner can retrieve, respond to, and delete a synthetic submission using the documented process.

**Verification:** Submit empty, valid, repeated, failed, and abusive synthetic attempts with keyboard and screen reader; inspect the network and approved destination; exercise response and deletion; confirm no sensitive data appears in unintended telemetry.

**Dependencies:** Tasks 1.1, 1.2, P0.5, and Checkpoint P  
**Estimated scope:** Medium

### Checkpoint B — Complete vertical journey

- [ ] Home → pilot understanding → application → confirmation works end to end on desktop and mobile.
- [ ] The experience remains understandable with JavaScript disabled; enhancement may be reduced, but core content is present.
- [ ] HTML validation and automated accessibility checks report no unresolved serious issues.

### Phase 2 — Visual refinement and resilience

#### Task 2.1 — Codify the visual system

**Outcome:** The page feels intentionally art-directed and future edits remain consistent.

**Work:**

- Consolidate color, typography, spacing, border, radius, and width values into a small token set.
- Define repeatable styles for exhibit tags, section headings, cards, buttons, form controls, and focus states.
- Review brass-on-cream and muted text combinations for contrast at their actual sizes and weights.
- Preserve sensible system fallbacks for all external fonts.

**Acceptance criteria:**

- [ ] Repeated visual decisions come from shared tokens rather than near-duplicate literals.
- [ ] Text and interactive-component contrast meets WCAG 2.2 AA targets.
- [ ] Focus indicators are visible on every interactive element.
- [ ] Blocking Google Fonts does not break layout or hierarchy.

**Verification:** Contrast audit, keyboard focus review, and font-blocked screenshot comparison.

**Dependencies:** Checkpoint B  
**Estimated scope:** Medium

#### Task 2.2 — Refine responsive layout and interaction states

**Outcome:** The institutional feel survives across screen sizes and input modes.

**Work:**

- Test representative widths from 320px through wide desktop, including zoomed text.
- Tune hero measure, tier cards, testimonials, statistics, form spacing, and sticky navigation behavior.
- Add restrained hover/active states without making hover the only feedback.
- Respect `prefers-reduced-motion`; avoid decorative motion unless it materially improves orientation.

**Acceptance criteria:**

- [ ] No horizontal overflow appears at 320 CSS pixels or at 200% zoom.
- [ ] Controls meet practical touch-target sizing and do not overlap.
- [ ] Tier comparison remains readable without forcing tiny text.
- [ ] Meaning and interaction do not depend on hover or motion.

**Verification:** Screenshot matrix at 320, 375, 768, 1024, and 1440 pixels; keyboard and touch-emulation walkthrough; 200% zoom check.

**Dependencies:** Task 2.1  
**Estimated scope:** Medium

#### Task 2.3 — Add complete identity and sharing metadata

**Outcome:** The site looks deliberate in browser chrome, search previews, and social shares.

**Work:**

- Write a concise title and description that land the premise while staying in character.
- Add canonical URL only after the production URL is known.
- Create a restrained favicon and social preview image from the established identity.
- Add Open Graph and social metadata; add structured data only if it truthfully represents the real company and will not turn satirical copy, prototype pricing, or fictional proof into factual service claims.

**Acceptance criteria:**

- [ ] Title, description, favicon, and preview image match the final brand language.
- [ ] Metadata contains no stale “precedent sourcing” terminology.
- [ ] All referenced assets exist and have appropriate dimensions/file sizes.

**Verification:** Inspect the document head, request every asset locally, and validate a production preview with at least one link-preview debugger after deployment.

**Dependencies:** Tasks 0.2 and 2.1  
**Estimated scope:** Small

### Checkpoint C — Design and accessibility review

- [ ] Side-by-side screenshots show a coherent system at mobile, tablet, and desktop widths.
- [ ] Automated checks are followed by manual keyboard, zoom, reduced-motion, and screen-reader review.
- [ ] A tone review confirms that visual polish increases plausibility without becoming a parody of consulting design.

### Phase 3 — Quality gates and launch

#### Task 3.1 — Establish a compact verification suite

**Outcome:** The critical journey and known failure modes are cheap to re-check.

**Work:**

- Add automated checks for valid markup, internal anchors, missing local assets, and serious accessibility violations.
- Add a browser smoke test for navigation, tier preselection, required-field handling, and confirmation behavior.
- Keep the suite proportional to a static site; avoid broad unit-test infrastructure for declarative content.

**Acceptance criteria:**

- [ ] One documented command runs the repeatable checks.
- [ ] A deliberately broken anchor, label, or pilot-application state causes a check to fail.
- [ ] Checks run reliably from a clean project state.

**Verification:** Run the suite successfully, introduce one temporary known failure to prove detection, revert it, and run clean again.

**Dependencies:** Checkpoint C  
**Estimated scope:** Medium

#### Task 3.2 — Set and meet a performance budget

**Outcome:** The page remains fast without sacrificing its typographic identity.

**Initial budgets:**

- No unexpected layout shift from font loading.
- No render-blocking script required for core content.
- Compressed launch page plus first-party assets stays comfortably below 500 KB, excluding optional external font files.
- Lighthouse targets on a production-like mobile run: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90. Treat scores as signals, not substitutes for manual checks.

**Acceptance criteria:**

- [ ] The measured artifact meets the budgets or documents a specific, approved exception.
- [ ] Fonts use only required families/weights and an appropriate loading strategy.
- [ ] No unused third-party runtime is shipped.

**Verification:** Run a production-like Lighthouse audit and inspect transferred resources, layout shift, and render-blocking requests.

**Dependencies:** Tasks 2.3 and 3.1  
**Estimated scope:** Small

#### Task 3.3 — Publish a release candidate

**Outcome:** A stable HTTPS preview is available for final review before the public URL is promoted.

**Work:**

- Configure static hosting with a production build/publish directory appropriate to the final file layout.
- Add preview deployments for changes if supported without meaningful maintenance overhead.
- Configure cache behavior, a useful not-found response, HTTPS, and production URL metadata.
- Document deploy and rollback steps.

**Acceptance criteria:**

- [ ] The release candidate is reachable over HTTPS at a stable preview URL.
- [ ] Direct navigation and all in-page anchors work in the hosted environment.
- [ ] A previous known-good version can be restored using documented steps.
- [ ] Production metadata uses the final canonical URL and assets.

**Verification:** Run the full quality suite against the hosted URL and rehearse rollback before launch approval.

**Dependencies:** Tasks 3.1 and 3.2  
**Estimated scope:** Medium

#### Task 3.4 — Final editorial and release review

**Outcome:** The release is approved on product, editorial, accessibility, and operational grounds.

**Work:**

- Conduct an outsider five-second test focused on premise recognition.
- Test whether outsiders understand both halves of the proposition: openly satirical brand and real professional service.
- Perform a final line edit for tone, internal consistency, brand-level satire disclosure, and accurate separation of fictional versus professional claims.
- Re-run browser, device, accessibility, metadata, and performance checks on production.
- Process and delete a final synthetic pilot application through the production operation.
- Record the release date, deployed revision, known limitations, application owner, certified delivery capacity, and owner for future fixes.

**Acceptance criteria:**

- [ ] At least three readers unfamiliar with the project understand that the brand is satirical, the professional service is real, and modeled work will be disclosed; at least two understand the first two points from the initial viewport alone.
- [ ] No release-blocking issue remains in the launch checklist.
- [ ] The deployed revision and rollback target are recorded.

**Verification:** Signed launch checklist with links to final test results and the deployed revision.

**Dependencies:** Task 3.3  
**Estimated scope:** Small

### Checkpoint D — Launch

- [ ] Checkpoint P remains valid: team authorization, supervision capacity, terms, and application operation are current.
- [ ] Narrative lock, interaction, responsive, accessibility, and performance checkpoints remain green in production.
- [ ] Production URL and rollback path are documented.
- [ ] The application queue is monitored by its named owner; collection, response, retention, and deletion match the published operation.

## Post-launch work

Post-launch work should respond to observed confusion or a new publishing need, not a desire to keep adding surface area.

### First 72 hours

- Confirm page and asset availability from more than one network/device.
- Check that link previews, favicon, and canonical metadata resolve correctly.
- Confirm application delivery, abuse controls, response ownership, and deletion without exposing applicant data in general logs.
- Fix regressions, misleading service claims, or premise-breaking copy immediately; batch non-critical polish.

### First review cycle

- Repeat the dual-proposition test with fresh readers.
- Review whether visitors understand the pilot's limited nature and can complete the application.
- Review application fit, team capacity, supervision load, quality defects, and hidden rescue work before admitting more clients.
- Decide whether any measurement need is important enough to justify privacy-conscious analytics.
- Revise the training and operating system from observed pilot evidence before expanding the offer.

### Expansion triggers

Consider a deferred capability only when its trigger occurs:

| Capability | Trigger |
| --- | --- |
| Five separate pages | Sections acquire enough unique content that the single page becomes hard to scan or share. |
| Broader CRM | Pilot application volume or coordination can no longer be managed securely through the minimal approved workflow. |
| CMS | Non-technical editors need recurring content changes and static edits are demonstrably blocking them. |
| Analytics | A concrete decision depends on a metric that cannot be gathered through small qualitative tests. |
| Broader Sandbox navigation | The parent universe has a defined cross-brand information architecture. |
| Reusable parody-brand template | At least one additional brand needs the same proven structure without inheriting this brand’s copy or visual identity. |

## Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Visitors cannot tell that the brand is satirical | High | Add clear brand-level framing and test the initial viewport with unfamiliar readers. |
| Visitors assume the real service manufactures undisclosed evidence | High | Explain the professional truth standard in plain language and show process proof rather than fictional client proof. |
| Satirical framing becomes constant winking | Medium | Disclose the context clearly, then use straight-faced execution and an editorial gate. |
| Old “precedent sourcing” language blurs the twist | High | Maintain a terminology audit and search for stale terms before every release. |
| Five-page intent and single-page implementation drift apart | Medium | Decide site shape in Phase 0 and update the source-of-truth description. |
| Fictional testimonials or metrics are mistaken for real professional proof | High | Visibly contain them within the satirical context or replace them with methodology proof until authorized real evidence exists. |
| Consultants reproduce the unethical behavior the brand satirizes | High | Require competency certification, truth classification, critical-failure rules, and accountable Lead review. |
| AI produces plausible fabricated support | High | Use approved tools/data, preserve AI work logs, independently verify outputs, and keep humans accountable. |
| Pilot demand exceeds certified supervision capacity | High | Make access application-only, publish no unlimited promise, and cap admissions by named Lead capacity. |
| External fonts delay rendering or fail | Medium | Limit weights, use resilient fallbacks, and test with font requests blocked. |
| Mobile navigation hides core content paths | Medium | Replace the current hidden navigation with an accessible small-screen pattern. |
| Pilot application creates privacy or abuse obligations | High | Minimize fields, define purpose/retention/deletion, secure the destination, monitor delivery, and assign a named owner. |
| Tooling grows larger than the site | Medium | Require every dependency and build step to state the failure it prevents or capability it provides. |

## Recommended implementation order

```text
Training/data governance
        ↓
Training dry run and calibration
        ↓
Initial team certification
        ↓
End-to-end retainer simulation
        ↓
Pilot offer and application operation
        ↓
Narrative and dual-proposition lock
        ↓
Static baseline and semantics
        ↓
Complete pilot-application journey
        ↓
Visual/accessibility refinement
        ↓
Metadata and identity assets
        ↓
Automated smoke checks
        ↓
Performance pass
        ↓
Hosted release candidate
        ↓
Outside-reader test and launch
```

The critical path runs through pilot readiness and then the application journey. Brand refinement may proceed while the practice is being proven, but the application cannot open until Checkpoint P. After Checkpoint B, metadata/identity work and responsive refinement can proceed independently, then reunite for the quality gates.

## Launch checklist

### Editorial

- [ ] Hero communicates “we manufacture the perfect supporting example.”
- [ ] Visitors can identify the satirical brand and the real professional service.
- [ ] Professional truth/disclosure standards are clear without turning the page into legal or ethical exposition.
- [ ] Pilot terms, capacity, service claims, durations, and participation expectations are consistent.
- [ ] Fictional testimonials, metrics, and entities cannot reasonably be mistaken for real endorsements or evidence.
- [ ] Copy does not identify a real satirical target.
- [ ] Exhibit references and testimonial details are intentional.

### Experience

- [ ] All five sections are reachable on small and large screens.
- [ ] The CTA accurately describes application rather than purchase or guaranteed acceptance.
- [ ] Application labels, validation, submission, confirmation, failure, retry, and data behavior are clear.
- [ ] Keyboard, screen-reader, zoom, and reduced-motion checks pass.

### Technical

- [ ] No broken anchors, missing assets, console errors, unintended data exposure, or unexpected network requests.
- [ ] Automated checks pass from a clean state and against the hosted candidate.
- [ ] Performance budgets are met or approved exceptions are recorded.
- [ ] Metadata, favicon, preview image, HTTPS, and canonical URL are correct.

### Operational

- [ ] Initial team certification, supervision capacity, and backup coverage are current.
- [ ] Training dry run, assessor calibration, and retainer simulation are recorded.
- [ ] Application purpose, owner, response, access, retention, deletion, failure, and abuse procedures are operational.
- [ ] Professional terms, privacy language, AI/data policy, and client escalation have completed the appropriate review.
- [ ] Preview, deployment, and rollback instructions are current.
- [ ] Final deployed revision and release owner are recorded.
- [ ] There is no unattended submission channel or unnecessary persistent service.

## Immediate next action

Complete Task P0.1 by naming the program, assessment, supervision, application, and escalation owners and approving the initial AI/data rules. Then run Task P0.2 as a small internal dry run of the training system. Website copy can be revised in parallel, but do not open the pilot application until Checkpoint P is complete.
