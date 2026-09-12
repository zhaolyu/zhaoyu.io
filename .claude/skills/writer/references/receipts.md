# Receipts: verifying a claim before writing it

Non-negotiable 3 says never invent a receipt, and it is usually read as "do not make up
a number." That is the easy half. The failure this file exists to prevent is the other
one: asserting a **mechanism** or a **sequence** that is true-sounding, coherent, and
recorded nowhere.

Measured 2026-09-10. Two notes, ten independent judge passes, zero clean. Every failure
had one shape: a causal story written first and verified afterwards. The deterministic
gates were green on all of them, because a fabricated mechanism has the same word count
as a real one.

## The six traps

**1. Check the exit code before citing anything from a run.** A non-zero exit means the
script aborted partway, so its runtime and line count describe a truncated run, not the
cost of a green one. A draft quoted `bin/validate-workspace` at "32 seconds and 263
lines" from a run that exited 1 partway through, when the complete receipt is several
times that. The figure understated the note's own central claim by roughly five times.

**2. Read whole diffstats, not truncated ones.** The same run miscounted deleted files as
four because `git show --stat | tail -40` had cut the list off at four of six. If a
diffstat goes through `head` or `tail`, count with `grep -c` before quoting the number.

**3. Before crediting a change with a cost or an effect, prove it did not predate it.**
Twice in one day a draft charged a change with something that was already true. A
workspace receipt was credited with a coupling it had carried since the initial commit
three weeks earlier, and the commit blamed for it had actually *removed* a section. Then
a policy consolidation was credited with putting an edit under that receipt, when the
parent revision already ran an equivalent drift gate in the same slot.
`git log --follow --oneline -- <file>` and `git show <commit>^:<file>` settle it in
seconds.

**4. Assert only the mechanism a file or commit actually records, never the one that
would make the incident make sense.** This is the deepest trap and the one the others do
not catch, because these are *inferences* rather than mis-citations. Instances: a set of
gates described as sharing a dependency when that day's settings file registered no such
gate; a fail-open design credited with preserving a recovery path when the gate did not
exist until the very commit under discussion.

> **"At that revision" means `git show <commit>^:<file>`, never the working tree.**
> Reading HEAD and narrating it as the past is how this trap gets passed while still
> failing. A draft said a filename-inference rule "still" fires and was never repaired,
> verified against the file at HEAD. At the incident's parent that function did not
> exist. It was *created by* the fix commit, whose subject line reads "widen inference."

Whenever a sentence turns on **still, already, the whole time, never repaired, predates**
or any other tense claim, that word *is* the claim. Resolve the incident to a commit and
read its parent before the sentence is written.

**5. State the incident at the size its record states it.** A log entry saying a
credential-*named* file slipped past a content-only scanner does not license "a key sat
tracked inside it." Three figures in one run were invented, mis-sourced, or embellished,
and every one made the argument stronger than the evidence did. **If a detail improves
the story, that is the signal to reread the source, not to keep it.**

**6. A mechanism has a host. Name it, and test a cross-platform tool on the host the
incident ran on.** Measured 2026-09-11 and 12. Same GNU Awk 5.3.2 on the two sides of one
machine: Git for Windows opens files in text mode and strips ``, so a `$`-anchored pattern
matches a CRLF line there; Linux gawk preserves ``, so the same pattern misses. A note
verified in WSL attributed the Linux mechanism to a Windows incident and cleared three judge
passes, because all three judges verified in WSL. Its author then called the correct Windows
record fabricated, on the strength of a Linux test. Two friction entries for one incident
recorded contradictory mechanisms, each right on its own host.

> **Whenever a sentence describes what a tool did, the host it did it on is part of the
> claim.** Put it in the receipt (`host:`), and when the incident ran on a different host
> from the one you are verifying on, run the test there before the sentence is written.

## Then check the fit in the other direction

The traps above ask whether the evidence supports the sentence. They do not catch the
inverse, which is the more expensive error: choosing a rule for rhetorical reasons and
fitting the evidence to it afterwards.

One draft's closing rule was reverse-engineered from a reconciliation with the site's own
footer manifesto. The note's first-hand log recorded the *opposite* conclusion about the
same incident. Two receipts and a rule neither supports is not a prose problem, and no
rewrite reaches it.

**Write the rule the incident already taught, in the words its own record used, before
looking for anything to pair it with.** If the pairing then does not fit, the pairing is
wrong, not the rule.

## Order of work

Claim-first drafting is what produced these failures: pick a thesis, then hunt for a
receipt that matches. A receipt recruited to fit a thesis looks like it fits until
someone checks the history. Invert it.

1. Start from an incident already written down. A dated log entry with a root cause is
   most of a paragraph before you write a word.
2. State the rule that incident taught, in its record's own words.
3. Verify every mechanism in it against the artifact at the right revision, on the
   right host.
4. Only now look for external corroboration, and drop it if it does not fit the rule you
   already have.

## First-hand-only notes

A note may ship on a single first-hand source; `agents-re-derive-judgment-you-already-paid-for`
does. But that note's claims are all measurements of his own system. When a note's central
premise is the behaviour of a third-party tool, it needs that tool's documentation cited
even if a personal log already describes it — a log is a record of what happened, not an
authority on how someone else's software works. One draft's own log stated a Python test
discovery pattern loosely enough to contradict the sentence citing it.
