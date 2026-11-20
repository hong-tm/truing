# Form: validation, pending, error and retry

Synthetic illustration. The state observations are premises for the worked repair, not results from a live service.

## Applicable context

A resident files an equipment access request. Required inputs are room, email, and a 30 to 600 character explanation. "Preferred access window" is optional and must remain. Supplied labels include "需要工作人员协助进入的房间与具体位置" and "Email for request updates". The controlled successful result is ACCESS-73. This is operational UI with a local test response, not a promise of access or response time.

## Diagnosis and evidence

The scenario's failed-submit handler resets the form before showing a generic error. This is direct code evidence of lost correction context, D-05 under [R-SYN-006](../references/interaction-and-states.md#r-syn-006). Its valid-submit handler correctly awaits the result and guards duplicate submission; retain that behavior. The copy "Continue the journey" identifies neither submission nor next state, supporting D-04 under [R-SYN-004](../references/purpose-and-content.md#r-syn-004). Whether users misunderstand it remains unmeasured.

## Smallest repair and reason

Remove the reset from the failure path. Keep values in their existing state owner, show "Request was not sent. Your entries are still here", and let Retry submit those values. Keep the pending label "Sending request" tied to the real promise. Display ACCESS-73 only when the controlled response succeeds. For a broadly authorized copy repair, rename the submit action "Send access request". If authorization covers error feedback only, preserve labels and field order.

Validation remains separate from transport failure. An invalid email identifies that field in text and retains every valid value. A connection failure does not mark all fields invalid. Apply [R-WCAG-3-3-1](../references/accessibility-and-responsive.md#r-wcag-3-3-1), [R-WCAG-3-3-2](../references/accessibility-and-responsive.md#r-wcag-3-3-2), and [R-WCAG-4-1-3](../references/accessibility-and-responsive.md#r-wcag-4-1-3) at their actual triggers and levels.

## Retained facts and controls

Keep room, email, explanation limits, optional access window, current option values, and both long labels. Preserve label associations, error associations, duplicate-submit protection, keyboard submission, and the exact controlled reference. Static pending text is an acceptable alternative to an overlay. Keeping context uses space but allows recovery.

## Near miss and do-not-change condition

Clear existing field groups need no reordering. A suitably subordinate optional access window should not become the main heading. A static informational page needs no pending state, and a successful response should not acquire a decorative hold before the ready action becomes available.

## Before and after check

Before, capture values immediately before and after the failure event. After, test empty submission, invalid email, explanation boundaries 29/30/600/601, and correction without losing valid values. Register completion observers before submit; verify pending, duplicate-submit guard, failure, Retry, and ACCESS-73 from the success response. Check labels and errors by keyboard and programmatic association, then render Chinese labels at 320/390 CSS pixels and 200% text. Exercise reduced motion. DOM checks alone do not prove screen-reader speech or real transport cancellation. Report those as unverified unless exercised.
