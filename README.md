# College Football Receiving Minigame

A web-based mini-game that helps players practice receiving skills and earn experience points in a College Football game environment.

## Overview

This interactive minigame challenges players to control a receiver and catch footballs while avoiding penalties. The game features 3 progressively difficult rounds with decreasing time limits and increasing football spawn rates.

## Features

### Gameplay
- **3 Rounds**: 30s, 20s, and 10s duration with increasing difficulty
- **Scoring System**:
  - 🔵 Blue footballs: +5 points
  - 🟡 Yellow footballs: +2 points
  - 🔴 Red footballs: -5 points (avoid these!)
- **Progressive Difficulty**: Each round increases football spawn rate and movement speed
- **Player Controls**: WASD or Arrow keys for receiver movement

### User Experience
- Modern, responsive design that works on desktop and mobile
- Clear instructions and intuitive controls
- Performance ratings and experience point rewards
- Smooth 60fps gameplay with HTML5 Canvas

### Accessibility
- Color-blind friendly design considerations
- Keyboard-only controls
- Clear visual feedback and instructions
- Reduced motion support for accessibility preferences

## How to Play

1. **Start the Game**: Click "Start Game" from the main menu
2. **Control Your Receiver**: Use WASD or Arrow keys to move around the field
3. **Catch Footballs**: Move into position to catch the falling footballs
4. **Avoid Red Footballs**: Red footballs subtract points from your score
5. **Complete 3 Rounds**: Each round gets faster and more challenging
6. **Earn XP**: Your final score determines your performance rating and experience points

## Performance Ratings

- **All-American** (100+ points): 150 XP
- **Varsity** (75-99 points): 100 XP  
- **JV** (50-74 points): 75 XP
- **Practice Squad** (25-49 points): 50 XP
- **Rookie** (0-24 points): 25 XP

## Technical Details

### Technologies Used
- HTML5 Canvas for game rendering
- Vanilla JavaScript for game logic
- CSS3 for styling and animations
- Responsive design principles

### Game Architecture
- **Object-oriented design** with separate classes for Player, Football, and Game state
- **60fps game loop** for smooth animation
- **Collision detection** using AABB (Axis-Aligned Bounding Box)
- **State management** for different game screens and rounds

### File Structure
```
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── game.js             # Core game logic and mechanics
├── .github/
│   └── copilot-instructions.md  # Development guidelines
└── README.md           # This file
```

## Installation & Setup

1. **Clone or Download** the project files
2. **Open** `index.html` in a modern web browser
3. **Play** the game directly - no additional setup required!

### For Development
- Use a local web server for best results (e.g., Live Server extension in VS Code)
- Modern browser with HTML5 Canvas support required
- No build process or dependencies needed

## Game Balance & Design

The game is designed to be challenging but fair:
- **Round 1**: 30 seconds to learn the mechanics
- **Round 2**: 20 seconds with increased pace
- **Round 3**: 10 seconds for maximum challenge

Football spawn rates and movement speeds are carefully tuned to create an engaging difficulty curve that encourages multiple playthroughs.

## Future Enhancements

Potential features for future versions:
- Sound effects and background music
- Multiple receiver characters with different abilities
- Combo scoring for consecutive catches
- Leaderboard system
- Power-ups and special footballs
- Multi-player competitive mode

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

When contributing to this project:
1. Maintain the college football theme
2. Ensure 60fps performance
3. Test on both desktop and mobile
4. Follow the existing code style and architecture
5. Consider accessibility in all changes

---

**Game Type**: Educational Sports Minigame  
**Target Audience**: College Football game players  
**Platform**: Web Browser (HTML5)  
**License**: Educational/Demo Project
