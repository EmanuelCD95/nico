# Photo-Music Gallery

A mobile-first, minimal single-page gallery that synchronizes photos with background music.

## Setup
1. Clone the repository.
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`

## Adding Content
1. Place photos in `public/photos/` (e.g., `p1.jpeg`, `p2.jpeg`).
2. Place music files in `public/music/` (e.g., `m1.mp3`).
3. Update `public/data.csv` to map photos and music.
   - Format: `id,photo,music`
   - Example: `1,/photos/p1.jpeg,/music/m1.mp3`
   - Note: Leaving the `music` field empty for a row will continue playing the previous track.

## Deployment
This project is configured for Vercel deployment. Pushing changes to the `main` branch will automatically trigger a new deployment.
