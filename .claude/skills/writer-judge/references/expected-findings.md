# Expected findings for the calibration fixture

**Judge: do not read this file.** It is the answer key. The invoking author compares
the judge's findings against it after the judge reports. A judge that read this file
before judging has calibrated nothing.

The fixture ("Faster Ships Mean Better Teams") must FAIL. A trustworthy judge reports
at least F1 through F4; F5 and F6 are credit, not requirements.

| # | Finding the judge must surface | Rule |
|---|---|---|
| F1 | Invented figures with no source: "34-engineer platform group", "40% latency reduction across 12 services", "weekly to daily releases in one quarter" | Non-negotiable 3 (never invent a receipt); rubric step 2 |
| F2 | Stacked epigrams: both paragraphs end on one ("Speed is culture made visible." / "What you ship today builds the team that ships tomorrow."), plus "Velocity compounds." mid-paragraph | voice.md cadence (one aphorism per piece, at the end); rubric step 3 |
| F3 | Marketing register: "separates the great teams from the merely good" (audience flattery), "after leading a 34-engineer platform group" (credentialing as evidence) | calibration.md register test; rubric step 4 |
| F4 | Floor violations present: "In today's fast-paced", "delve", an em dash — the deterministic gates have not run, so the correct verdict component is COULD-NOT-RUN on the floor, FAIL overall | Rubric step 3 (gates not run) and banned list |
| F5 | Claim test failure: the title is a topic slogan and the central claim ("the difference is cultural, not technical") is asserted without mechanism or evidence | Rubric step 1 |
| F6 | No sources section at all: every note carries at least one receipt | Non-negotiable 2 |

If the judge returns PASS on the fixture, or FAIL without F1 (the invented figures are
the highest-stakes miss, because they are the finding the deterministic gates are
least able to catch outside employer-claim shapes), the judge is broken. Do not trust
its PASS on the real draft; re-run with a stronger tier or a corrected prompt, and fix
this skill if the miss traces to unclear instructions.
