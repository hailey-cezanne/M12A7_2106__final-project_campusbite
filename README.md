# CampusBites
**A Web-Based Cafeteria Guide for Holy Angel University**

CampusBites helps students explore food categories and compare budgets through an independent student-made guide. Built with HTML, CSS, and vanilla JavaScript. Branding uses the supplied Campus Bites “Eat Easy.” logo, red, yellow, and cream.

## Run locally
Open index.html in a modern browser, or use VS Code Live Server from this repository folder. No build, framework, backend, or package installation is required.

## Features
- Four connected pages with shared navigation, current-page indicators, keyboard focus, and a skip link.
- Home category links open a filtered Food Spots page; detail links open the selected listing.
- Case-insensitive search across listing text, combined category and maximum starting-price filters, sorting, result counts, empty state, and reset.
- Native expandable listing details; listings remain readable without JavaScript.
- Personal tasting notes with ratings, safe text rendering, up to 20 recent entries, browser storage, and clear control. Storage failures fall back to the current visit.
- Required suggestion fields, validation, and a downloadable text file. Suggestions are not delivered to the team.
- Responsive grids and navigation for desktop, tablet, and phones.

## File organization
- index.html — home, categories, sample food cards, and guide introduction.
- food-spots.html — searchable sample directory.
- deals-reviews.html — fictional deal/review examples and personal notes.
- contact.html — actual team responsibilities and local suggestion form.
- styles.css / script.js — shared presentation and understandable page-guarded behavior.
- assets/campusbites-logo.png — supplied logo, copied inside the repository for portable paths.
- project/DIVISION.md — user-confirmed Week 1 responsibilities.
- project/verify.cjs — browser verification script.
- project/home-desktop.png / home-mobile.png — verification screenshots.
- AI-USAGE.md — AI assistance, limitations, attribution, and evidence status.

## Content and scope
All four stalls, price ranges, and deal/review examples are explicitly illustrative. No verified stall names, locations, menu, opening hours, photos, public team email, or vendor contacts were supplied. Replace these with researched information before presenting the site as a live cafeteria directory. Food icons are category illustrations, not stall photographs. Starting-price filters do not guarantee every menu item fits the selected budget.

This is a guide, not an ordering service. Personal notes remain in the browser and may be lost when browser data is cleared. Contact downloads must be shared manually. No accounts, payments, server delivery, or database are implemented.

## Team and course evidence
All four members contributed to Week 1 coding and development. See project/DIVISION.md for the supplied responsibilities. No individual line ownership or new Git history is inferred. No course rubric or increment report was present in the inspected repository; rubric compliance requires the actual rubric and member evidence.

## Verification
Run node --check script.js. The browser check in project/verify.cjs uses the desktop environment's bundled Playwright path; adjust that require path if running elsewhere. Run node project/verify.cjs. It checks local links/assets, all pages at 1440/768/375 pixels, JavaScript errors, directory controls, deep links, note persistence and safe rendering, and suggestion validation/download.

Finalization is prepared for publication to https://github.com/hailey-cezanne/M12A7_2106__final-project_campusbite under the commit message “Complete CampusBites final project”. See Git history for publication evidence.
