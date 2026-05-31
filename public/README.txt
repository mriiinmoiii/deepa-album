For Deepa — Memory Album
========================

How to run:
  Open index.html in any modern browser. That's it. No build, no server needed.
  (If videos don't autoplay, serve the folder with a tiny local server:
   `python3 -m http.server` from inside this folder, then open http://localhost:8000)

How to add your own photos & videos:

1) HERO (top of page)
   - Put a photo at:  images/hero/hero.jpg
   - Optional video:  videos/hero.mp4   (auto-detected; replaces the image when present)

2) TIMELINE (6 memory cards)
   - Replace files:   images/timeline/01.jpg ... 06.jpg
   - Edit titles/captions in script.js → CONFIG.timeline

3) GALLERY (100+ photos)
   - Drop files in:   images/gallery/
   - Default filenames are 01.jpg, 02.jpg, ... 36.jpg
   - To add more, open script.js and look for the `gallery` block in CONFIG.
     Change the loop limit from 36 to however many photos you have,
     OR replace the whole array with explicit entries:
       { src: "images/gallery/sunset.jpg", cap: "Goa, 2024", cat: "Trips" }
   - Category chips: edit CONFIG.galleryCategories

4) VIDEOS
   - Drop clips in:   videos/memories/01.mp4, 02.mp4, ...
   - Edit titles & posters in script.js → CONFIG.videos

5) REASONS / LETTER
   - Edit copy in script.js → CONFIG.reasons and CONFIG.letter

6) MUSIC (optional)
   - Put a track at:  music/background.mp3
   - Use the ♪ button in the footer to play (browsers block autoplay).

Tips:
- Every missing image automatically falls back to an elegant SVG placeholder.
- All copy is centralized in CONFIG at the top of script.js — no need to touch HTML.
- Responsive on phone, tablet, and desktop.

Made with love. ❤