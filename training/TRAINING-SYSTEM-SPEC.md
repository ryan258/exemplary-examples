# Training System Specification

## Status

Accepted for initial development on 2026-07-13, based on the confirmed founder interview.

## Objective

Create an internal, competency-paced qualification and certification system that prepares versioned AI staff agents to deliver Exemplary Examples™ work safely and consistently.

The system must turn brand promise into an observable operating method. A certified strategist agent must be able to clarify a client's real decision, distinguish evidence from inference, construct useful modeled scenarios, produce executive-ready exhibits, operate its tools responsibly, and manage an ongoing retainer workflow within explicit permissions.

The initial program supports three authorization levels:

1. **Contributor** — may research, draft, and perform quality checks under review.
2. **Supervised Strategist** — may conduct simulations and limited client work with an assigned Lead Strategist.
3. **Lead Strategist** — may own an Executive Retainer relationship and certify or supervise others.

## Users

### Learner agent

A candidate agent configuration seeking authorization as a consultant or strategist. A learner is identified by agent ID, runtime/model, instructions, tools, memory/context sources, and version. A material configuration change creates a review trigger.

### Facilitator

Runs evaluation workshops, observes simulations, provides feedback, and maintains a demanding but non-manipulative evaluation environment.

### Assessor

Evaluates evidence against published rubrics. The assessor may also facilitate, but cannot assess itself or be the sole assessor for Lead Strategist certification. Independent assessors record their initial scores before calibration context is shared.

### Supervisor

A Lead Strategist agent accountable for a learner agent's supervised work, review boundaries, records, and client-safety escalation.

### Program owner

Maintains curriculum versions, certification records, calibration, appeals, and authorization status.

## Learning model

- **Competency-paced:** invocation count, token use, model reputation, or time in the program does not confer authorization.
- **Blended:** self-paced instruction, live workshops, simulations, portfolio work, and supervised practice each teach a different kind of competence.
- **Evidence-based:** every advancement decision cites artifacts and observed behavior.
- **Progressive responsibility:** client data and action permissions expand only after the learner agent demonstrates the prerequisites.
- **Revisable:** feedback and reassessment are ordinary parts of learning, not exceptional punishment.
- **Calibrated:** assessors periodically score the same artifact and reconcile differences.

## Required competencies

| Code | Competency | Observable result |
| --- | --- | --- |
| C1 | Decision framing | Converts an ambiguous request into a clear decision, audience, claim, constraints, and success condition. |
| C2 | Evidence discipline | Separates sourced fact, client-provided fact, calculation, inference, assumption, and fiction. |
| C3 | Example architecture | Selects the right example type and builds a causal structure that actually supports the claim. |
| C4 | Research and verification | Uses traceable sources, records uncertainty, and refuses unsupported factual presentation. |
| C5 | Modeling | Creates transparent scenarios with inspectable inputs, logic, sensitivities, and limitations. |
| C6 | Exhibit craft | Produces a presentation-ready exhibit with a decisive headline, legible evidence, and honest labeling. |
| C7 | Client practice | Runs intake, handles challenge, scopes work, communicates uncertainty, and protects the relationship. |
| C8 | AI stewardship | Uses approved data and tools, verifies outputs, documents material assistance, and preserves principal accountability. |
| C9 | Quality assurance | Detects logical, evidentiary, numerical, editorial, visual, and reputational defects before delivery. |
| C10 | Retainer leadership | Prioritizes a request queue, maintains context, meets service commitments, and improves the operating system. |

## Curriculum requirements

The curriculum must include:

- An orientation and diagnostic assessment that routes learners without lowering the final standard.
- Self-paced instruction and knowledge checks for all ten competencies.
- Live workshops for decision framing, client intake, challenge handling, scenario defense, and editorial critique.
- At least two individual portfolio artifacts before supervised client work.
- Simulations with incomplete, conflicting, or misleading information.
- Explicit practice refusing or reframing a request to present invented material as fact.
- Supervised client work with review gates before external delivery.
- Remediation paths and reassessment rules.
- Assessor calibration and certification governance.

## Truth and disclosure standard

Every professional artifact must classify material claims using the following system:

| Label | Meaning | Minimum support |
| --- | --- | --- |
| **Sourced fact** | Verifiable external information | Citation to a retrievable source and access date |
| **Client-provided fact** | Information supplied by the client | Named client source or approved internal reference |
| **Calculation** | Result derived from disclosed inputs | Formula or reproducible working |
| **Inference** | Interpretation drawn from facts | Supporting facts plus reasoning |
| **Modeled scenario** | A conditional projection or constructed case | Assumptions, method, sensitivities, and limitations |
| **Satirical fiction** | Invented content whose purpose is creative or satirical | Clear placement within a satirical product/context |

Professional work may combine these categories but may not blur them. Satirical fiction cannot be passed into a professional deliverable as sourced fact, client-provided fact, or a real case study.

## AI operating standard

AI staff agents may perform ideation, structure, critique, transformation, and research-lead tasks within a published work envelope. An agent may not be treated as a factual source, legal person, or its own final verifier.

Always:

- Follow the engagement's data classification and approved-tool rules.
- Remove or mask client-sensitive information unless the tool is explicitly approved for it.
- Verify every factual, numerical, and citation-bearing output using an independent source or reproducible work.
- Disclose material AI assistance internally in the engagement record.
- Preserve inspectable reasoning and accountable-principal review behind consequential recommendations.

Ask first:

- Before using a new AI tool, model, connector, or client data category.
- Before generating client-resembling names, quotes, logos, or case histories.
- Before automating delivery, publishing, or communication with a client.

Never:

- Invent citations, quotes, customers, results, or credentials and present them as real.
- Upload restricted client data to an unapproved system.
- Let an AI system send client-facing work outside its authorization and required principal review.
- Use plausible wording as a substitute for verification.

## Certification requirements

### Contributor

- Complete the orientation and core knowledge checks.
- Pass the truth-classification exercise with no critical misclassification.
- Produce one research-backed example brief and one draft exhibit.
- Demonstrate safe AI use in a recorded work log.
- Meet the Contributor rubric threshold with no safety-critical failure.

### Supervised Strategist

- Hold active Contributor status.
- Pass a live intake simulation and an adversarial challenge simulation.
- Complete a modeled scenario with a sensitivity analysis.
- Deliver two portfolio exhibits meeting the Supervised Strategist threshold.
- Participate in supervised work; no external material is sent without Lead Strategist approval.

### Lead Strategist

- Hold active Supervised Strategist status.
- Demonstrate competent performance across at least two supervised engagement cycles.
- Lead a complex simulation involving ambiguity, deadline pressure, and an improper disclosure request.
- Pass a retainer planning and quality review.
- Receive approval from two assessors, at least one of whom did not directly supervise the candidate.

**Founding Lead bootstrap:** Because the two supervised engagement cycles above cannot exist until an accountable Lead exists, the program may grant one temporary Founding Lead authorization in their place — based on equivalent prior evidence, approval by two independent reviewers, and the end-to-end retainer simulation. It is provisional and converts to ordinary Lead certification only after two successful pilot cycles.

## Assessment rules

- Certification is criterion-referenced, not graded on a curve.
- Knowledge checks alone cannot authorize client work.
- Critical failures override aggregate scores. Examples include fabricated sources, undisclosed fictional claims, prohibited data handling, or external delivery without required review.
- Assessors cite evidence and give a specific next-practice recommendation for every “not yet” decision.
- Learners may request reassessment with new evidence.
- The program owner records certification scope, date, curriculum version, assessors, conditions, and review date.

## Delivery format

The source materials live in Markdown and printable templates so the method is usable before an LMS is chosen.

```text
training/
├── README.md
├── TRAINING-SYSTEM-SPEC.md
├── CURRICULUM.md
├── CONSULTANT-HANDBOOK.md
├── COURSE-MODULES.md
├── WORKSHOP-DECKS.md
├── SIMULATION-PACKS.md
├── FACILITATOR-GUIDE.md
├── ASSESSMENT-AND-CERTIFICATION.md
├── SUPERVISED-PRACTICE.md
└── templates/
    ├── EXAMPLE-BRIEF.md
    ├── EVIDENCE-REGISTER.md
    ├── QUALITY-REVIEW.md
    └── CERTIFICATION-RECORD.md
```

An LMS, video library, or interactive assessment platform is a later implementation choice. The content model must not depend on one.

## Content conventions

- Use “example” for the broad deliverable and qualify it as sourced, modeled, or satirical where ambiguity exists.
- Use “exhibit” for a presentation-ready expression of an example.
- Use direct, institutional language; training materials may explain the ethical boundary even though public brand copy stays in character.
- Give each activity a purpose, instructions, evidence produced, and completion standard.
- Give each assessment a rubric and a remediation route.
- Examples used for practice must be fictional or appropriately licensed/redacted.

## Quality verification

Before a training release:

- Check that every competency appears in instruction, practice, and assessment.
- Check that every certification right maps to explicit evidence and a named approver.
- Run the course's exercises with at least one learner-agent configuration that did not author them.
- Have two assessors independently score the same simulation and reconcile material disagreement.
- Search for any wording that rewards plausibility over truth classification.
- Confirm templates contain no real client data.
- Record the curriculum version and change summary.

## Boundaries

### Always

- Protect client confidentiality and separate claims by evidence class.
- Use the independent agent and accountable-principal review required for professional work.
- Provide accessible alternatives for timed, spoken, handwritten, or visually dense activities.
- Evaluate demonstrated competence rather than speed, charisma, or prior job title.
- Preserve an audit trail for certification decisions.

### Ask the program owner first

- Changing certification rights or critical-failure definitions.
- Using real client work as a teaching artifact.
- Adding external instructors, tools, credentials, or public claims about certification.
- Waiving a required observation or supervised-work gate.

### Never

- Certify by attendance alone.
- Penalize a learner for using an approved accessibility accommodation.
- Use client information without authorization.
- Allow a learner to send unreviewed work beyond their certification level.
- Teach concealment of fictional or modeled material in professional contexts.

## Success criteria

The initial training system is ready for a pilot cohort when:

- Every required competency has at least one lesson, practice activity, and scored assessment.
- All three certification levels have published rights, prerequisites, rubrics, and review gates.
- Facilitators can run the program from the written materials without relying on undocumented author knowledge.
- Supervisors have a defined review cadence and sign-off process.
- A learner can identify what to do next, what evidence to submit, and who decides advancement.
- The course supports accessible participation without lowering competency standards.
- A dry run produces actionable revisions and no unresolved critical safety issue.

## Open implementation decisions

These do not block drafting the training system:

- Named program owner and initial assessors.
- Pilot cohort size and application criteria.
- Approved AI tool list and data-classification policy.
- Whether certification expires on a fixed schedule or is reviewed through ongoing performance.
- Where certification records will be stored after the Markdown pilot.
