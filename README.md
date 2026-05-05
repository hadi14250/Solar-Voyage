# Solar Voyage

A Duolingo-style 3D learning app for exploring the solar system. Click a planet, read the facts, take the quiz, earn stars — finish all planets to complete the mission.

Built for the UAE space-education context, with bilingual content (English + Arabic) and a cameo from the Hope Probe.

## What it does

- **3D solar system** rendered with `@react-three/fiber` and `three.js` — the Sun, all eight planets, an asteroid belt, Saturn's rings, and the UAE Hope Probe orbiting Mars.
- **Click any planet** to focus the camera on it, see real-world facts (distance, diameter, day/year length, trivia), and take a short quiz.
- **Quizzes** unlock progress and award up to 3 stars per planet based on accuracy.
- **Progress is saved** in localStorage — pick up where you left off, with a "Mission Complete" celebration when you finish all planets.
- **Toolbar controls**: toggle real-relative planet sizes, speed up orbits, hide labels, mute audio.
- **Bilingual**: every fact and quiz question is authored in both English and Arabic.
- **Accessible**: respects `prefers-reduced-motion`, mobile-friendly camera framing, keyboard-navigable UI.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **react-three-fiber** + **drei** + **three.js** for the 3D scene
- **Tailwind CSS v4** for styling
- **framer-motion** for UI transitions
- The 3D scene is dynamically imported (`ssr: false`) so the initial JS bundle stays small.

## Project structure

```
src/
├── app/                  # Next.js App Router entry (page.tsx, layout, globals)
├── components/
│   ├── three/            # 3D scene: SolarSystem, Sun, planets, AsteroidBelt, HopeProbe, CameraController
│   └── ui/               # 2D overlay: TitleBar, Toolbar, PlanetPanel, Quiz, LoadingScreen, MissionComplete
├── data/
│   ├── planets.ts        # Planet metadata + bilingual facts
│   └── quizzes.ts        # Bilingual quiz questions per planet
└── lib/
    ├── audio.ts          # Sound effects + mute state
    ├── sceneContext.tsx  # Shared scene state for r3f children
    ├── textures.ts       # Procedural / loaded textures
    ├── useProgress.ts    # localStorage-backed progress + stars
    └── useMediaQuery.ts  # Reduced-motion / desktop hooks
```

## Run it

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

```bash
npm run build && npm run start   # production
npm run lint                     # eslint
```

## Controls

- **Click a planet** (or pick one from the selector) to focus + open the info panel
- **Real sizes** toggle — switch from aesthetic radii to real relative sizes (Earth = 1)
- **Speed** toggle — 1× / 10× orbital speed
- **Labels** toggle — show/hide planet name labels
- **Mute** toggle — silence sound effects
