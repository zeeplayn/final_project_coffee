# Bean There Coffee

## Topic
Coffee Shop Website (Web Development: midterm project, endterm project and final project)

## Group members
- Member 1: Zharkyn Lukpan
- Member 2: Yelaman Orazkhan
- Member 3: Said sana ullah Sadat

## Short description
A multi-page responsive website for a small coffee shop. In the midterm we made the main pages (home, menu, about, gallery, contact). In the endterm we added JavaScript and jQuery: a registration form with validation, a live search with category filter, a table with CRUD operations and a gallery with a lightbox. In the final project we added a Coffee Guide page that loads data from a public API, a light/dark theme, a demo sign-in, a shopping cart and an FAQ page.

## Features implemented

### Midterm
- 5 pages connected with a navigation bar (index, menu, about, gallery, contact)
- Header with logo and menu (Flexbox), main, footer with contacts, copyright and social links
- Table (drinks price table) and form (contact form)
- CSS Grid for cards, Flexbox for header and form
- Positioning: sticky header, absolute badge and gallery captions
- :hover and :focus on links, buttons and inputs
- :nth-child() for alternating cards and table rows
- 5 CSS variables in :root, Google Fonts (Poppins, Pacifico)
- loading="lazy" on images below the fold
- Media queries for tablet (768px) and mobile (576px)
- Bootstrap grid and utility classes

### Endterm
- **Registration form (register.html):** required fields (name, email, password, confirm password), email check with RegEx, password strength indicator (weak / medium / strong), password confirmation check, real-time messages with icons, form is not sent if there are errors
- **Search and filter (menu.html):** live search while typing (case-insensitive) and category buttons (All / Coffee / Desserts) that work together
- **Table with CRUD (manage.html):** list of products, add and edit with a Bootstrap modal, delete with confirmation, messages after every action
- **Gallery lightbox (gallery.html):** click on a photo to enlarge it, arrows (and keyboard arrows) to go to the next/previous photo, close with X, Esc or click on the dark background, fadeIn / fadeOut / animate effects with jQuery
- New pages were added to the navigation bar (Register, Admin)
- All midterm requirements are still working

### Final project
- **Coffee Guide (coffee-guide.html):** data from the Hot Coffee API (`https://api.sampleapis.com/coffee/hot`) loaded with `fetch()`, `response.ok` check, JSON parsing, cards created with `createElement` and `textContent`, search by name, filter by ingredient (made from the real data), loading message, error message with "Try again" button, message when nothing is found
- **Light / Dark theme:** button on every page, the choice is saved in `localStorage` and restored on every page
- **Sign in / Sign out:** modal form with validation (name, email, password). Only the display name is saved in `localStorage`; the password is never saved. The header shows "Hi, name" and a Sign out button after refresh
- **Menu cart (menu.html):** add to cart, plus / minus / remove, subtotal of each row, total, 10% discount for signed-in users, checkout needs sign in, cart is saved in `localStorage`
- **FAQ (faq.html):** 6 questions, jQuery `.slideToggle()`, `+` / `−` indicator that follows the state of the answer
- **Home and About:** call-to-action block on Home, values, location and opening hours on About
- Shared navigation with 7 links on all pages; AI assistance is mentioned in the footer of every page

## Technologies used
HTML5, CSS3 (Flexbox, Grid, CSS variables), Bootstrap 5, JavaScript (fetch, localStorage, DOM), jQuery 3, Hot Coffee API, Google Fonts, Netlify

## Individual contribution

### Midterm
- Member 1: index.html, about.html, header, footer, hero section, CSS variables and base styles
- Member 2: menu.html (table + dessert cards), gallery.html, CSS for cards, grid, table and gallery
- Member 3: contact.html (form), CSS for form, media queries (tablet + mobile)

### Endterm
- Member 1 (Zharkyn Lukpan): register.html, form validation in js/script.js (RegEx, password strength, confirm password, real-time feedback), CSS for the registration form, adding the new links to the navigation
- Member 2 (Yelaman Orazkhan): search and category filter on menu.html, gallery lightbox with jQuery effects on gallery.html, CSS for search, filter buttons and lightbox
- Member 3 (Said sana ullah Sadat): manage.html (table with CRUD and Bootstrap modal), CRUD code in js/script.js, CSS for the table page, README update and publishing the updated repository

### Final project
- Member 1 (Zharkyn Lukpan): shared navigation and visual design, responsive layout and shared CSS (including dark theme styles), `js/theme.js`, Coffee Guide page and API integration (`js/coffee-api.js`), loading / error states and testing
- Member 2 (Yelaman Orazkhan): menu page, cart and price calculations (`js/cart.js`), category filtering, sign in / sign out with `localStorage` (`js/auth.js`)
- Member 3 (Said sana ullah Sadat): FAQ page with jQuery (`js/faq.js`), Home page and About page updates

## Project structure
```
index.html  menu.html  coffee-guide.html  about.html  faq.html
gallery.html  contact.html  register.html  manage.html
css/style.css
js/theme.js  js/auth.js  js/cart.js  js/coffee-api.js  js/faq.js  js/script.js
```

## AI assistance
Parts of the code and text of this project were prepared with the help of Claude, an AI assistant by Anthropic.

## Published website
Link: https://lopaf.netlify.app
