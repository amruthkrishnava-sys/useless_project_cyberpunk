<img width="1280" height="640" alt="git (1)" src="https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd" />



# Do Nothing 🎯


## Basic Details
### Team Name: Cyberpunk


### Team Members
- Team Lead: Devanand P M - Thejus Engineering college vellarakad
- Member 2: Amruthkrishna V A - Thejus Engineering college vellarakad
- Member 3: [Name] - [College]

### Project Description
Do Nothing! is a satirical anti-productivity web app that tracks how long you waste staring at it, rewarding your idleness with XP, levels, achievements, and a fake "session analysis" report. It includes joke features like a pause button that refuses to pause, a pointless basketball arcade, cloud-staring weather simulator, and a flashlight that lights up nothing.

### The Problem (that doesn't exist)
In a world obsessed with productivity hacks, focus timers, and "10x your life" apps, nobody has built a tool that celebrates doing absolutely nothing. There is a critical gap in the market for an app that:
-Actively discourages you from being productive
-Punishes you for trying to pause
-Rewards you for staring at a screen doing nothing
-Generates a fake PDF report proving you achieved nothing

### The Solution (that nobody asked for)
We built Do Nothing! — a beautiful, neon-cyberpunk web app that:
-Tracks your wasted time with a live timer, XP, and levels
-Refuses to let you pause — pressing pause triggers escalating warnings, and on the third attempt, it "terminates" your tab (with a fake report)
-Unlocks a pointless arcade at 30 seconds with a basketball game (no reward) and a cloud-staring weather simulator
-Provides a fake torch that illuminates nothing
-Generates a downloadable PDF report of your session using raw PDF generation in JavaScript (no libraries)
-Awards 7 achievements for wasting increasing amounts of time (30s → 5 hours)

## Technical Details
### Technologies/Components Used
For Software:
-Languages: HTML5, CSS3, Vanilla JavaScript (ES6+)
-Frameworks: None — 100% framework-free
-Libraries: None — zero external dependencies
-Tools: Git, GitHub, VS Code
-Fonts: Google Fonts (DM Mono, Space Grotesk)
-APIs: Web Audio API (for sound effects), LocalStorage (for session persistence), Canvas-free DOM animations, requestAnimationFrame for ball physics, Blob API + raw PDF generation for report download

### Implementation
For Software:
# Installation

bash
# Clone the repository
git clone https://github.com/your-username/do-nothing.git

# Navigate into the project folder
cd do-nothing
No build step, no npm install, no dependencies. Just open the file.

# Run
bash
# Option 1: Open directly in browser
open index.html

# Option 2: Serve locally (recommended for full feature support)
npx serve .
# or
python3 -m http.server 8000
Then visit http://localhost:8000 (or the port shown).

### Project Documentation
For Software:

# Screenshots (Add at least 3)
![Screenshot1](Add screenshot 1 here with proper name)
<img width="1920" height="1080" alt="Screenshot 2026-09-12 155651" src="https://github.com/user-attachments/assets/cb1adbac-a263-4313-9dbc-27537c544dcb" />

The main landing view. This screen introduces the "Waste Quest" with a mission timer counting up in real time, XP and level tracking, an active quest progress bar ("Do absolutely nothing"), and the signature "Pause the inevitable" button that triggers escalating warnings if pressed. The player HUD shows the user as "PLAYER 001 / ROOKIE WASTER" with a live "actively wasting" status.

![Screenshot2](Add screenshot 2 here with proper name)
<img width="1920" height="1080" alt="Screenshot 2026-09-12 155716" src="https://github.com/user-attachments/assets/3997a38f-dc14-416c-a41b-1e9edb0a28f6" />

The Arcade window's "Nothing but net" basketball mini-game. This is the only playable game (unlocked at 30 seconds). It features a neon court with a backboard and rim, aim and power sliders, a dashed trajectory preview, and a "Throw ball" button. The score stays at 0 until you make a basket, and the sidebar lists five other "games" that all return a "CONNECTION LOST" error because they were never built.

![Screenshot3](Add screenshot 3 here with proper name)
<img width="1920" height="1080" alt="Screenshot 2026-09-12 155742" src="https://github.com/user-attachments/assets/1cbaadf9-d63c-4755-8f7a-f2e091ce57c9" />

The "Cloud staring" weather simulator. This screen shows an accelerated sky with drifting clouds, a glowing sun, and a dynamic weather system that cycles through clear, cloudy, rain, and thunderstorm states. At the bottom, an hourly forecast (NOW, T+07H, T+09H, etc.) and a weekly forecast (TODAY, MON–SAT) display changing temperatures and weather icons, all generated procedurally with no real weather data.

<img width="1920" height="1080" alt="Screenshot 2026-09-12 160311" src="https://github.com/user-attachments/assets/0f09d04f-2bb5-4629-8dbe-0638469d948b" />

The final session analysis report. After clicking "End session," the app runs a fake "analysis" loading animation, then reveals this summary card: total time wasted, XP earned (20 XP for 1 minute 43 seconds), quest progress (100%), page analysed, and data source. It also includes a "Download PDF" button that generates a real, raw PDF client-side, and an "Exit" button that unlocks after a 6-second countdown and then tries to close the tab.

# Diagrams
<img width="5162" height="1940" alt="deepseek_mermaid_20260912_cd73ed" src="https://github.com/user-attachments/assets/55ffc11d-7a1b-437b-8254-a2656280c2b1" />

Architecture overview: The app runs entirely client-side. State is persisted in LocalStorage, the timer ticks via setInterval, ball physics use requestAnimationFrame, weather simulation runs on a 250ms interval, and the PDF report is generated by manually constructing PDF objects and streams in JavaScript.

## Team Contributions
Devanand P M: Project lead, core architecture, timer/XP/achievement system, pause-button warning logic, PDF report generator, and overall integration,cloud-staring weather simulator, accelerated day/night cycle, forecast rendering, fake torch utility, and sound design (Web Audio API).

Amruthkrishna V A: UI/UX design, neon cyberpunk styling, responsive layouts, arcade window, basketball game physics & animation, particle effects.

---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--26-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)



