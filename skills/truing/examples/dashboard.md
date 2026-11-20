# Dashboard: answer a data question

Synthetic illustration. These observations and outcomes describe a worked scenario, not an executed benchmark or an actual user's dashboard.

## Applicable context

An equipment coordinator asks, "Which instruments need calibration before the next booking?" This is operational UI. The supplied list contains M-12, calibration overdue, next booking Tuesday; M-27, calibration current, next booking Thursday; and M-31, calibration due Monday, next booking Friday. Dates are relative labels supplied by the scenario, not live computed deadlines. Required controls are Lab filter, Status filter, Instrument details, and Export calibration history. Required labels include "下一次预约前需要完成校准的设备" and "Calibration status".

## Diagnosis and evidence

In the scenario's starting markup, each instrument's booking and calibration status sit in separate tile groups. The displayed IDs establish the relationship, but the user has to join them mentally. This supports D-01, weak information representation, under [R-SYN-001](../references/product-ui.md#r-syn-001). A large decorative "Workspace snapshot" banner competes with the overdue status, supporting D-02 under [R-SYN-002](../references/information-and-attention.md#r-syn-002). The suspected cause is component-led grouping. No observation establishes a measured search-time loss.

## Smallest repair and reason

Place the existing booking and calibration facts beside each instrument ID in the current list, without changing record order or inventing a computed priority. Reduce the decorative banner's emphasis. Comparing the facts within a record answers the task without replacing the data model. Grouping by due date is an alternative only if the owner permits reordered records; it can make cross-group comparisons harder.

For a request limited to filter/error feedback, leave the list, banner, and copy intact. Correct only the affected handler so retry uses the visible selections and the empty state offers a clear-filter path. [R-SYN-006](../references/interaction-and-states.md#r-syn-006) governs that state repair.

## Retained facts and controls

Keep all three IDs, all supplied dates, both filters, detail return, and Export calibration history. Keep both long Chinese and English labels and allow wrapping. Export is infrequent but required. Do not hide it behind hover. [R-SYN-003](../references/purpose-and-content.md#r-syn-003) and [R-SYN-005](../references/product-ui.md#r-syn-005) explain the preservation boundary.

## Near miss and do-not-change condition

A chronological audit list whose order is required must keep that chronology. A prominent Lab filter directly supports the task and should remain. Several genuine urgent statuses can stay prominent together. The repair does not need chips, a chart, extra whitespace, or a single focal point.

## Before and after check

Before, record the same three facts and the exact selections used to reach an error. After the repair, identify M-12's overdue state and M-31's Monday due date beside their bookings, without losing M-27. Apply and clear both filters; open a detail and return to its trigger; force a controlled error and retry with selections retained. Inspect wide, 390, and 320 CSS pixel views, 200% text, visible keyboard focus, tap access, and reduced motion. Use actual request completion events. These are expected checks, not a claim that this example was rendered or that users became faster.
