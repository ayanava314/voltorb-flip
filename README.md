# Voltorb Flip (React Clone)

A browser-based clone of the classic Voltorb Flip minigame from Pokémon HeartGold/SoulSilver, built using React and Tailwind CSS.

## Demo

Play it live: [voltrob-flip.vercel.app](https://voltrob-flip.vercel.app)

## Features

- 5x5 grid puzzle
- Randomized board with multipliers and Voltorbs
- Number clues for rows and columns (sum + number of Voltorbs)
- Right-click to mark suspected Voltorbs
- Level progression when all 2x/3x tiles are revealed
- Level resets if a Voltorb is flipped
- Score carries over between levels
- High score tracking

## Controls

- **Left-click**: Flip a tile
- **Right-click**: Mark/unmark a tile as a suspected Voltorb

## Leveling Logic

- Each level increases board difficulty (more Voltorbs and multipliers)
- Reaching level 10 is currently the cap; you stay there upon win

## Tech Stack

- **React** (Vite)
- **Tailwind CSS**
- **Deployed on Vercel**

## Setup & Development

```bash
# Clone the repository
git clone https://github.com/your-username/voltorb-flip.git
cd voltorb-flip

# Install dependencies
npm install

# Run the development server
npm run dev
