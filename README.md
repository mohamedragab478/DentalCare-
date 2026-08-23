Design a complete, modern, production-quality UI/UX for a Dental Clinic Management System called "DentalCare".

IMPORTANT:

This is a UI/UX design task ONLY.

Do NOT design or implement the backend.
Do NOT create database architecture.
Do NOT create authentication logic.
Do NOT create APIs.
Do NOT create Supabase logic.

Focus entirely on designing the complete frontend experience, screens, layouts, components, interactions, responsive behavior, and visual design.

The final UI will later be implemented separately.

==================================================
PROJECT OVERVIEW
==================================================

DentalCare is a dental clinic management platform with two completely different user experiences:

1. Patient
2. Doctor

The system manages multiple dental clinics, patients, appointments, visits, dental treatment records, dental charts, and before/after treatment images.

There are exactly FOUR clinics.

The UI should feel like a real professional dental healthcare SaaS product, not a generic student dashboard.

==================================================
DESIGN DIRECTION
==================================================

Create a premium modern dental/medical SaaS interface.

Visual style:

- Clean
- Professional
- Modern
- Minimal
- Trustworthy
- Premium
- Friendly
- Spacious
- Excellent typography
- Soft rounded corners
- Subtle shadows
- Modern cards
- Elegant icons
- Smooth micro-interactions
- Clear visual hierarchy

Use a bright healthcare aesthetic with:

- White / very light backgrounds
- Blue / teal medical accents
- Subtle neutral colors
- Strong contrast for important actions
- Carefully chosen accent colors for dental treatment statuses

Avoid making the interface look like a generic CRM or banking dashboard.

It should immediately feel like a modern dental clinic application.

==================================================
DESIGN SYSTEM
==================================================

Create a consistent design system across the entire application.

Include:

- Typography
- Headings
- Body text
- Buttons
- Inputs
- Selects
- Cards
- Badges
- Avatars
- Tabs
- Modals
- Tooltips
- Dropdowns
- Alerts
- Empty states
- Loading states
- Error states

Use consistent spacing and border radius.

The UI must be responsive.

Desktop:
Full dashboard experience.

Tablet:
Adaptive layouts.

Mobile:
Stack cards vertically and provide compact navigation.

==================================================
USER ROLES
==================================================

There are two main interfaces.

PATIENT:

Patients should have a simple, friendly interface.

DOCTOR:

Doctors should have a more powerful clinical workspace with more information and controls.

The two interfaces should feel related but clearly different.

==================================================
PATIENT EXPERIENCE
==================================================

Create the following patient screens.

--------------------------------------------------
1. LANDING / PORTAL SELECTION
--------------------------------------------------

Create a beautiful DentalCare landing page.

Include:

DentalCare logo

Short tagline such as:

"Your smile, managed smarter."

Two main entry cards:

PATIENT
"Access your dental care"

DOCTOR
"Clinical workspace"

Each card should have a relevant dental/medical icon or illustration.

Use a premium hero section.

--------------------------------------------------
2. PATIENT SIGN UP
--------------------------------------------------

Create a modern patient registration page.

Fields:

- Full Name
- Gender
- Age
- Phone Number
- Notes

IMPORTANT:

Do NOT include Date of Birth.

Use Age instead.

The page should include:

- DentalCare branding
- Clean registration form
- Helpful field labels
- Modern inputs
- Primary CTA
- Login link
- Friendly dental visual

Keep the form simple and uncluttered.

--------------------------------------------------
3. PATIENT LOGIN
--------------------------------------------------

Create a simple patient login screen.

Fields:

Phone Number

Patient ID

Primary button:

"Login"

Include:

"Don't have an account? Sign Up"

Keep this screen clean and minimal.

==================================================
PATIENT DASHBOARD
==================================================

Create a modern patient dashboard.

The dashboard should prioritize the information patients actually care about.

Header:

DentalCare logo

Navigation:

- Dashboard
- My Profile
- Visits

Right side:

- Notifications
- Patient avatar
- Logout

Hero/welcome section:

"Good morning, Mohamed"

Subtitle:

"Here's an overview of your dental care."

--------------------------------------------------
4. PATIENT PROFILE CARD
--------------------------------------------------

Create a profile card containing:

- Patient photo/avatar
- Full Name
- Patient ID
- Age
- Gender
- Phone Number

Use a polished modern card.

--------------------------------------------------
5. NEXT VISIT
--------------------------------------------------

Create a prominent upcoming appointment card.

Example:

NEXT VISIT

01 September 2026

10:30 AM

Dr. Ahmed

Clinic 3

Make this card visually important.

Use a calendar icon.

--------------------------------------------------
6. CURRENT DOCTORS / CLINICS
--------------------------------------------------

There are exactly FOUR clinics.

Display four elegant clinic cards.

Each clinic should be visually represented by a large circular area.

Example:

CLINIC 1

[ Doctor Photo ]

Dr. Ahmed

Available

CLINIC 2

[ Doctor Photo ]

Dr. Mohamed

Available

CLINIC 3

[ Doctor Photo ]

Dr. Mahmoud

Available

CLINIC 4

[ Empty Avatar ]

No Doctor Currently

IMPORTANT:

The doctor's photo must appear inside a large circular avatar.

The doctor name appears directly below the circle.

The clinic number/name should be clearly visible.

If there is no doctor:

Show an empty/default avatar and:

"No Doctor Currently"

The patient should understand the current doctor availability immediately.

==================================================
7. BEFORE / AFTER TREATMENT SECTION
==================================================

Add a visually impressive Before & After section to the patient dashboard.

This section is intended to eventually display dental treatment progress.

Create a horizontal image carousel / slider.

Each item should have:

BEFORE

[ Image ]

AFTER

[ Image ]

OR use a side-by-side comparison card.

Include:

- Previous button
- Next button
- Pagination dots
- Treatment title
- Optional treatment date

Example:

"Smile Restoration"

BEFORE              AFTER

[ photo ]           [ photo ]

18 Aug 2026

IMPORTANT:

These images are intended for patient-visible treatment progress.

Design the component so real images can be connected later.

For now use realistic dental placeholder images.

Do not hardcode the final image content.

The component should support multiple before/after cases.

Example:

Case 1:
Smile Restoration

Case 2:
Crown Treatment

Case 3:
Teeth Whitening

Make this section visually attractive and premium.

==================================================
8. PATIENT VISIT HISTORY
==================================================

Create a visit history section.

Each visit should be displayed as a clean card/timeline.

Example:

18 AUG 2026

Dr. Ahmed

Clinic 3

Treatment completed

Next Visit:
01 SEP 2026

Keep the information patient-friendly.

Do not expose private clinical notes.

==================================================
DOCTOR EXPERIENCE
==================================================

Create a completely separate doctor interface.

The doctor interface should feel like a professional clinical workspace.

==================================================
9. DOCTOR LOGIN
==================================================

Create a professional doctor login page.

Fields:

- Username
- Password

Primary button:

"Login"

Use a premium medical visual.

==================================================
10. DOCTOR DASHBOARD
==================================================

Create a doctor workspace.

Use a professional sidebar navigation.

Sidebar:

DentalCare logo

- Dashboard
- Patients
- Visits
- Clinic Status
- Settings

Bottom:

Doctor avatar

Dr. Ahmed

Clinical Lead

Main area:

"Good morning, Dr. Ahmed"

Summary cards:

- Today's Patients
- Upcoming Visits
- Total Patients
- Current Clinic

==================================================
11. CURRENT CLINIC SELECTOR
==================================================

Create a prominent clinic status component.

Show four clinic choices:

Clinic 1
Clinic 2
Clinic 3
Clinic 4

The selected clinic must have a very clear active state.

Example:

CURRENT CLINIC

[ Clinic 1 ]
[ Clinic 2 ]
[ Clinic 3 ]
[ Clinic 4 ]

Selected:

Clinic 3

Status:

● On Duty

Include:

"Leave Clinic"

button.

The interaction should be extremely simple.

==================================================
12. PATIENT MANAGEMENT
==================================================

Create a doctor patient management page.

Header:

"Patients"

Search bar:

"Search by name, phone, or patient ID"

Patient list/table:

- Patient Name
- Patient ID
- Age
- Phone
- Last Visit
- Next Visit
- Action

Action:

"View Profile"

Include filtering and sorting controls where appropriate.

==================================================
13. DOCTOR PATIENT PROFILE
==================================================

This is one of the most important screens.

Create a detailed clinical patient profile.

Top section:

Patient avatar

Patient name

Patient ID

Age

Gender

Phone

Actions:

Edit Patient

Add Visit

Upload Image

Below:

Tabs:

Overview
Dental Chart
Visits
Medical Images

==================================================
14. PATIENT OVERVIEW
==================================================

Display:

PERSONAL INFORMATION

- Name
- Gender
- Age
- Phone
- Patient ID
- Notes

UPCOMING VISIT

- Date
- Time
- Doctor
- Clinic

RECENT VISITS

Show recent visit cards.

==================================================
15. INTERACTIVE DENTAL CHART
==================================================

THIS IS A CRITICAL DESIGN REQUIREMENT.

Create a professional interactive dental chart.

The dental chart MUST be visually arranged like a REAL HUMAN JAW / DENTAL ARCH.

DO NOT use two straight horizontal rows of teeth.

DO NOT use a simple table.

DO NOT arrange the teeth as rectangular cards.

The teeth must follow the natural curved shape of the upper and lower jaw.

Think of the layout as an anatomical dental arch:

              11 12 13 14 15 16 17 18
          ╭──────────────────────────────╮
        21                                28
        22                                27
        23                                26
        24                                25

                 LOWER JAW

        31                                38
        32                                37
        33                                36
        34                                35
          ╰──────────────────────────────╯

The actual visual design should be much more polished and anatomical than this example.

Use actual tooth-shaped vector/SVG elements.

The teeth should follow the curvature of the jaw.

Upper jaw:
- FDI 11–18
- FDI 21–28

Lower jaw:
- FDI 31–38
- FDI 41–48

Every tooth must be an independent interactive element.

Each tooth should have:

- Tooth number
- Tooth shape
- Hover state
- Selected state
- Treatment color state

The overall chart should visually resemble a real dental chart.

==================================================
16. TOOTH INTERACTION
==================================================

When the doctor clicks a tooth, display a contextual menu or side panel.

Example:

TOOTH 26

Current Status:

🟡 Filling

Treatment:

🔴 Extraction
🟡 Filling
🟢 Root Canal
🟣 Crown / Prosthetic
🔵 Implant
⚪ No Treatment

Include:

"Add Note"

"View Treatment History"

The interaction should feel fast and clinical.

==================================================
17. DENTAL TREATMENT COLORS
==================================================

Use this exact treatment color system:

RED
Extraction

YELLOW
Filling

GREEN
Root Canal

PURPLE
Crown / Prosthetic

BLUE
Implant

WHITE
No Treatment

Create a polished legend beside or underneath the dental chart.

Example:

🔴 Extraction

🟡 Filling

🟢 Root Canal

🟣 Crown / Prosthetic

🔵 Implant

⚪ No Treatment

Do not rely on color alone.

Always include text labels.

==================================================
18. TOOTH DETAILS
==================================================

When a tooth is selected, show a detail panel.

Example:

Tooth 26

Current Status:
🟡 Filling

Last Treatment:
18 August 2026

Doctor:
Dr. Ahmed

Notes:
Composite filling performed.

Button:

"View Treatment History"

==================================================
19. TOOTH TREATMENT HISTORY
==================================================

Create a visual timeline for a tooth.

Example:

TOOTH 26

Current Status:
🟣 Crown

Treatment History:

18 Aug 2026
🟣 Crown
Dr. Ahmed

10 Jan 2025
🟢 Root Canal
Dr. Mohamed

15 Dec 2024
🟡 Filling
Dr. Ahmed

The timeline should clearly show the progression of treatment.

==================================================
20. MEDICAL / DENTAL IMAGES — DOCTOR ONLY
==================================================

Create a doctor-only medical image gallery.

The doctor can:

- Upload images
- View images
- Preview images
- Associate images with visits
- Add descriptions
- Delete images

Use a modern gallery layout.

Possible categories:

- X-Ray
- Intraoral
- Extraoral
- Other

IMPORTANT:

These clinical images are PRIVATE.

They must NOT appear in the patient dashboard.

They must NOT appear in the patient profile.

The patient should not have a Medical Images tab.

==================================================
21. VISIT CREATION
==================================================

Create an Add Visit interface.

Fields:

- Visit Date
- Clinic
- Diagnosis
- Treatment Notes
- Private Doctor Notes
- Next Visit Date

Buttons:

Save Visit

Cancel

Use a clean professional medical form.

==================================================
22. EDIT PATIENT
==================================================

Create an Edit Patient modal/page.

Fields:

- Name
- Gender
- Age
- Phone
- Notes

Use modern form validation states.

==================================================
PATIENT VS DOCTOR INFORMATION
==================================================

PATIENT CAN SEE:

- Their profile
- Age
- Gender
- Phone
- Patient ID
- Next visit
- Doctor availability
- Clinic availability
- Patient-friendly visit history
- Before/After treatment showcase

PATIENT CANNOT SEE:

- Private medical images
- Doctor private notes
- Internal treatment history
- Clinical dental chart
- Internal medical records

DOCTOR CAN SEE:

- Complete patient profile
- Dental chart
- Tooth treatment history
- Medical images
- Visits
- Private notes
- Patient information

==================================================
BEFORE / AFTER IMAGE DESIGN
==================================================

The Before/After carousel should be designed as a reusable component.

It should support:

Multiple cases

Each case:

- Before image
- After image
- Treatment name
- Date
- Optional description

Create smooth carousel interaction.

Possible layouts:

Option A:

BEFORE
[ image ]

AFTER
[ image ]

Option B:

A large image with a draggable before/after comparison slider.

Prefer a modern interactive comparison slider if it looks elegant and usable.

The component should still work well on mobile.

==================================================
RESPONSIVE DESIGN
==================================================

Desktop:

Full dashboard layouts.

Patient:
Bento-style dashboard.

Doctor:
Sidebar + clinical workspace.

Tablet:

Adaptive two-column layouts.

Mobile:

Stack content vertically.

Use compact navigation.

The dental chart must remain usable on mobile.

The Before/After carousel must remain usable on mobile.

==================================================
ACCESSIBILITY
==================================================

Make the UI accessible.

Use:

- Proper labels
- Keyboard-friendly controls
- Tooltips
- Accessible buttons
- Text labels for color-coded treatments
- Sufficient contrast
- Clear focus states

The dental chart must not depend only on color.

==================================================
FINAL DESIGN REQUIREMENTS
==================================================

The final design should look like a real commercial dental healthcare SaaS platform.

Prioritize:

1. Professional dental aesthetic
2. Clean patient experience
3. Powerful doctor workspace
4. Anatomical jaw-shaped dental chart
5. Interactive tooth treatment states
6. Beautiful Before/After carousel
7. Excellent responsive design
8. Clear information hierarchy
9. Consistent design system
10. Premium visual quality

IMPORTANT:

The dental chart must follow the actual shape of the jaw.

The Before/After section must be present in the patient experience.

The private medical image gallery must only exist in the doctor experience.

Do not simplify the dental chart into straight rows.

Do not simplify the Before/After section into two static images.

Create the complete UI for all major screens and states needed for both Patient and Doctor experiences.

Again:

THIS IS A UI/UX DESIGN TASK ONLY.

Do not implement backend, authentication, database, APIs, or Supabase.

Focus entirely on producing the complete Google Stitch UI.