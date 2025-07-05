// Game Configuration
const GAME_CONFIG = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    PLAYER_SIZE: 30,
    FOOTBALL_SIZE: 20,
    ROUNDS: [
        { duration: 30, spawnRate: 2000, speedMultiplier: 1 },
        { duration: 20, spawnRate: 1500, speedMultiplier: 1.3 },
        { duration: 10, spawnRate: 1000, speedMultiplier: 1.6 }
    ],
    POINTS: {
        BLUE: 5,
        YELLOW: 2,
        RED: -5
    },
    COLORS: {
        BLUE: '#4a90e2',
        YELLOW: '#f5d50a',
        RED: '#e74c3c'
    }
};

// Game State
class GameState {
    constructor() {
        this.score = 0;
        this.currentRound = 0;
        this.timeLeft = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.footballs = [];
        this.player = null;
        this.gameIntervals = [];
    }

    reset() {
        this.score = 0;
        this.currentRound = 0;
        this.timeLeft = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.footballs = [];
        this.clearIntervals();
    }

    clearIntervals() {
        this.gameIntervals.forEach(interval => clearInterval(interval));
        this.gameIntervals = [];
    }
}

// Player Class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = GAME_CONFIG.PLAYER_SIZE;
        this.height = GAME_CONFIG.PLAYER_SIZE;
        this.speed = 5;
        this.keys = {};
    }

    update() {
        // Movement with WASD and Arrow Keys
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            this.x = Math.max(0, this.x - this.speed);
        }
        if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            this.x = Math.min(GAME_CONFIG.CANVAS_WIDTH - this.width, this.x + this.speed);
        }
        if (this.keys['ArrowUp'] || this.keys['KeyW']) {
            this.y = Math.max(0, this.y - this.speed);
        }
        if (this.keys['ArrowDown'] || this.keys['KeyS']) {
            this.y = Math.min(GAME_CONFIG.CANVAS_HEIGHT - this.height, this.y + this.speed);
        }
    }

    draw(ctx) {
        // Draw player as a simple receiver figure
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add jersey number
        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('WR', this.x + this.width/2, this.y + this.height/2 + 5);
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// Football Class
class Football {
    constructor(x, y, color, type) {
        this.x = x;
        this.y = y;
        this.width = GAME_CONFIG.FOOTBALL_SIZE;
        this.height = GAME_CONFIG.FOOTBALL_SIZE;
        this.color = color;
        this.type = type;
        this.speed = 2 + Math.random() * 3;
        this.caught = false;
        this.direction = Math.random() * Math.PI * 2; // Random direction
    }

    update(speedMultiplier) {
        // Move football in random direction
        this.x += Math.cos(this.direction) * this.speed * speedMultiplier;
        this.y += Math.sin(this.direction) * this.speed * speedMultiplier;

        // Bounce off walls
        if (this.x <= 0 || this.x >= GAME_CONFIG.CANVAS_WIDTH - this.width) {
            this.direction = Math.PI - this.direction;
        }
        if (this.y <= 0 || this.y >= GAME_CONFIG.CANVAS_HEIGHT - this.height) {
            this.direction = -this.direction;
        }

        // Keep within bounds
        this.x = Math.max(0, Math.min(GAME_CONFIG.CANVAS_WIDTH - this.width, this.x));
        this.y = Math.max(0, Math.min(GAME_CONFIG.CANVAS_HEIGHT - this.height, this.y));
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(
            this.x + this.width/2, 
            this.y + this.height/2, 
            this.width/2, 
            this.height/3, 
            0, 0, 2 * Math.PI
        );
        ctx.fill();

        // Add football laces
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2, this.y + 5);
        ctx.lineTo(this.x + this.width/2, this.y + this.height - 5);
        ctx.stroke();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// Game Class
class ReceivingGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) {
            console.error('Canvas element not found!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Canvas context not available!');
            return;
        }
        
        this.gameState = new GameState();
        
        // Ensure canvas is properly sized
        this.canvas.width = GAME_CONFIG.CANVAS_WIDTH;
        this.canvas.height = GAME_CONFIG.CANVAS_HEIGHT;
        console.log('Game initialized, canvas size:', this.canvas.width, 'x', this.canvas.height);
        
        this.setupEventListeners();
        this.setupUI();
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.gameState.player && this.gameState.isPlaying) {
                this.gameState.player.keys[e.code] = true;
                e.preventDefault(); // Prevent scrolling
            }
        });

        document.addEventListener('keyup', (e) => {
            if (this.gameState.player) {
                this.gameState.player.keys[e.code] = false;
                e.preventDefault();
            }
        });

        // Button events
        const startBtn = document.getElementById('start-game-btn');
        const playAgainBtn = document.getElementById('play-again-btn');
        const mainMenuBtn = document.getElementById('main-menu-btn');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startGame();
            });
        }

        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                this.startGame();
            });
        }

        if (mainMenuBtn) {
            mainMenuBtn.addEventListener('click', () => {
                this.showInstructions();
            });
        }
    }

    setupUI() {
        this.showInstructions();
        
        // Initialize canvas with field
        this.drawField();
        console.log('Game UI setup complete');
    }

    showInstructions() {
        document.getElementById('instructions-screen').classList.remove('hidden');
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
        this.gameState.reset();
    }

    showGameScreen() {
        console.log('Showing game screen...');
        document.getElementById('instructions-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
        
        // Ensure canvas is visible and properly drawn
        setTimeout(() => {
            this.drawField();
            console.log('Game screen canvas initialized');
        }, 100);
    }

    showGameOver() {
        document.getElementById('instructions-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.remove('hidden');
        
        // Calculate performance rating and XP
        const finalScore = this.gameState.score;
        let rating, xp;
        
        if (finalScore >= 100) {
            rating = "All-American";
            xp = 150;
        } else if (finalScore >= 75) {
            rating = "Varsity";
            xp = 100;
        } else if (finalScore >= 50) {
            rating = "JV";
            xp = 75;
        } else if (finalScore >= 25) {
            rating = "Practice Squad";
            xp = 50;
        } else {
            rating = "Rookie";
            xp = 25;
        }

        document.getElementById('final-score').textContent = `Final Score: ${finalScore}`;
        document.getElementById('performance-rating').textContent = `Rating: ${rating}`;
        document.getElementById('xp-earned').textContent = `Experience Points Earned: ${xp}`;
    }

    startGame() {
        console.log('Starting game...');
        this.gameState.reset();
        this.gameState.isPlaying = true;
        this.showGameScreen();
        this.initializePlayer();
        console.log('Player initialized at:', this.gameState.player.x, this.gameState.player.y);
        
        // Start immediately for testing, then show transition
        this.drawField();
        if (this.gameState.player) {
            this.gameState.player.draw(this.ctx);
        }
        
        this.startRound(0);
    }

    initializePlayer() {
        this.gameState.player = new Player(
            GAME_CONFIG.CANVAS_WIDTH / 2 - GAME_CONFIG.PLAYER_SIZE / 2,
            GAME_CONFIG.CANVAS_HEIGHT / 2 - GAME_CONFIG.PLAYER_SIZE / 2
        );
    }

    startRound(roundIndex) {
        if (roundIndex >= GAME_CONFIG.ROUNDS.length) {
            this.endGame();
            return;
        }

        this.gameState.currentRound = roundIndex;
        const roundConfig = GAME_CONFIG.ROUNDS[roundIndex];
        this.gameState.timeLeft = roundConfig.duration;
        this.gameState.footballs = [];

        // Show round transition
        this.showRoundTransition(roundIndex + 1, () => {
            this.runRound(roundConfig);
        });

        this.updateUI();
    }

    showRoundTransition(roundNumber, callback) {
        const transitionElement = document.getElementById('round-transition');
        const titleElement = document.getElementById('round-title');
        const messageElement = document.getElementById('round-message');
        const countdownElement = document.getElementById('countdown');

        if (!transitionElement || !titleElement || !messageElement || !countdownElement) {
            console.error('Round transition elements not found');
            callback(); // Continue anyway
            return;
        }

        titleElement.textContent = `Round ${roundNumber}`;
        messageElement.textContent = roundNumber === 1 ? 'Get ready!' : 'Next round incoming!';
        
        transitionElement.classList.remove('hidden');

        let countdown = 3;
        countdownElement.textContent = countdown;

        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                countdownElement.textContent = countdown;
            } else {
                countdownElement.textContent = 'GO!';
                setTimeout(() => {
                    transitionElement.classList.add('hidden');
                    callback();
                }, 500);
                clearInterval(countdownInterval);
            }
        }, 1000);
    }

    runRound(roundConfig) {
        // Timer
        const timerInterval = setInterval(() => {
            this.gameState.timeLeft--;
            this.updateUI();
            
            if (this.gameState.timeLeft <= 0) {
                clearInterval(timerInterval);
                this.endRound();
            }
        }, 1000);
        this.gameState.gameIntervals.push(timerInterval);

        // Football spawning
        const spawnInterval = setInterval(() => {
            this.spawnFootball();
        }, roundConfig.spawnRate);
        this.gameState.gameIntervals.push(spawnInterval);

        // Game loop
        const gameLoop = setInterval(() => {
            this.update(roundConfig.speedMultiplier);
            this.draw();
        }, 1000 / 60); // 60 FPS
        this.gameState.gameIntervals.push(gameLoop);
    }

    spawnFootball() {
        const types = ['BLUE', 'YELLOW', 'RED'];
        const weights = [40, 40, 20]; // Blue and Yellow more common than Red
        
        const randomValue = Math.random() * 100;
        let cumulativeWeight = 0;
        let selectedType = types[0];
        
        for (let i = 0; i < types.length; i++) {
            cumulativeWeight += weights[i];
            if (randomValue <= cumulativeWeight) {
                selectedType = types[i];
                break;
            }
        }

        const x = Math.random() * (GAME_CONFIG.CANVAS_WIDTH - GAME_CONFIG.FOOTBALL_SIZE);
        const y = Math.random() * (GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.FOOTBALL_SIZE);
        
        const football = new Football(x, y, GAME_CONFIG.COLORS[selectedType], selectedType);
        this.gameState.footballs.push(football);
    }

    update(speedMultiplier) {
        if (!this.gameState.isPlaying) return;

        // Update player
        this.gameState.player.update();

        // Update footballs
        this.gameState.footballs.forEach(football => {
            football.update(speedMultiplier);
        });

        // Check collisions
        this.checkCollisions();
    }

    checkCollisions() {
        const playerBounds = this.gameState.player.getBounds();
        
        this.gameState.footballs = this.gameState.footballs.filter(football => {
            if (football.caught) return false;

            const footballBounds = football.getBounds();
            
            // Simple AABB collision detection
            if (playerBounds.x < footballBounds.x + footballBounds.width &&
                playerBounds.x + playerBounds.width > footballBounds.x &&
                playerBounds.y < footballBounds.y + footballBounds.height &&
                playerBounds.y + playerBounds.height > footballBounds.y) {
                
                // Football caught!
                football.caught = true;
                this.gameState.score += GAME_CONFIG.POINTS[football.type];
                this.updateUI();
                return false; // Remove from array
            }
            
            return true; // Keep in array
        });
    }

    drawField() {
        // Clear canvas and draw field
        this.ctx.fillStyle = '#228b22'; // Football field green
        this.ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
        
        // Draw field markings
        this.drawFieldMarkings();
        console.log('Field drawn');
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#228b22'; // Football field green
        this.ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

        // Draw field markings
        this.drawFieldMarkings();

        // Draw footballs
        this.gameState.footballs.forEach(football => {
            football.draw(this.ctx);
        });

        // Draw player
        if (this.gameState.player) {
            this.gameState.player.draw(this.ctx);
        }
    }

    drawFieldMarkings() {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        
        // Draw yard lines
        for (let i = 0; i <= 10; i++) {
            const x = (GAME_CONFIG.CANVAS_WIDTH / 10) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, GAME_CONFIG.CANVAS_HEIGHT);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let i = 0; i <= 6; i++) {
            const y = (GAME_CONFIG.CANVAS_HEIGHT / 6) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(GAME_CONFIG.CANVAS_WIDTH, y);
            this.ctx.stroke();
        }
    }

    endRound() {
        this.gameState.clearIntervals();
        
        setTimeout(() => {
            this.startRound(this.gameState.currentRound + 1);
        }, 1000);
    }

    endGame() {
        this.gameState.isPlaying = false;
        this.gameState.clearIntervals();
        this.showGameOver();
    }

    updateUI() {
        const scoreElement = document.getElementById('score');
        const roundElement = document.getElementById('round-info');
        const timerElement = document.getElementById('timer');
        
        if (scoreElement) scoreElement.textContent = `Score: ${this.gameState.score}`;
        if (roundElement) roundElement.textContent = `Round: ${this.gameState.currentRound + 1}/3`;
        if (timerElement) timerElement.textContent = `Time: ${this.gameState.timeLeft}s`;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    try {
        const game = new ReceivingGame();
        console.log('Game successfully initialized');
        
        // Make game globally accessible for debugging
        window.game = game;
    } catch (error) {
        console.error('Error initializing game:', error);
    }
});
