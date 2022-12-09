//Get the context of the canvas which is 2d
const ctx = canvas.getContext('2d');
canvas.height = innerHeight;
canvas.width = innerWidth;
//Define variables needed in the game
let gameSpeed = 0;
let roll = 0;
let gameOver = true;
let obstacleMove = 0;
let distance = 0;
let life = 100;
let enemiesKilled = 0;
let coinPicked = 0;
let levelSpeed = 1;
let score = 0;
let enemyLevel = 0.9;
let levels = [level1, level2, level3, level4, level5, level6, level7, level8, level9, level10, level11, level12, level13, level14, level15];
//let pausedValue = false;
let paused = "played";




gamePause.addEventListener("click", ()=>{
    pausedValue = true;
    gamePause.classList.add("none");
    gamePlay.classList.remove("none");
    paused = 'paused';
    
});

let uiMusic = [uiMusic1, uiMusic2, uiMusic3, uiMusic4, uiMusic4];
let uiMusicGet = uiMusic[Math.floor(Math.random() * uiMusic.length)]

let gameMusic = [gameMusic1, gameMusic2, gameMusic3, gameMusic4, gameMusic5, gameMusic6];
let gameMusicGet = gameMusic[Math.floor(Math.random() * gameMusic.length)];

let endGame = [endGame1, endGame2];
let endGameGet = endGame[Math.floor(Math.random() * endGame.length)];

let birdCry = [birdCry1, birdCry2];
let birdCryGet = birdCry[Math.floor(Math.random() * birdCry.length)];

let coinGet = [coinGet1, coinGet2, coinGet3];
let coinGetGet = coinGet[Math.floor(Math.random() * coinGet.length)];

//Declare variable to hold high score in the game
let highScore=localStorage.getItem("gameHighScore") || 0;
let brokenHighScore=!1;

//***Utility functions that will be used to perform some tasks throughout my code ***//

//Utility function to play audio during some events in the game
function playMusic(audio) {
    audio.play();
}
//Utility function to pause audio during some events in the game
function playMusic(audio) {
    audio.pause();
}

function changeHighScore(){
	if (score>localStorage.getItem("gameHighScore")){
        localStorage.setItem("gameHighScore",score);
		highScore=score;
    }
}

//Utility function to hide a current page or element desired

function currentPage(page) {
    container.classList.add("none");
    levelContainer.classList.add("none");
    canvas.classList.add("none");
    scoreBoard.classList.add("none");
    auxscoreBoard.classList.add("none");
    scoreCont.classList.add("none");
    lifeBar.classList.add("none");
    distanceCont.classList.add("none");
    coinCont.classList.add("none");
    commentBox.classList.add("none");
    enemiesCont.classList.add("none");
    gamePlay.classList.add("none");
    gamePause.classList.add("none");
    page.classList.remove("none");
    
    
}



playButton.addEventListener("click", ()=>{
    powerSound.play();
    currentPage(levelContainer);
    uiMusicGet.play();
});

const backgroundLayer1 = new Image();
backgroundLayer1.src = "bg" + Math.ceil(Math.random() * 25) + ".png";

//Handle the width of the canvas if browser is resized
addEventListener("resize", ()=>{
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

//Handle all the objects in the game using javascript classes
addEventListener("load", ()=>{
    //Create arrays for all enemy types
    changeHighScore();
    let Obstacles = [];
    let enemies = [];
    let enemiesBat = [];
    let enemiesSpider = [];
    let enemiesGhost = [];
    let enemiesOwl = [];
    let enemiesRaven = [];
    let enemiesSpinner = [];
    let enemiesSideBat = [];
    let projectiles = [];
    let explosions = [];
    let powerUps = [];
    let coins = [];

//function changeHighScore(){
//	if (score>localStorage.getItem("gameHighScore")){
//        localStorage.setItem("gameHighScore",score);
//		highScore=score;
//    }
//}
    
    //Createa game over fubction to handle  enemy player collisions
    function gameoverFunction() {
    if (life >= 5) {
        life -= 5;
        lifeLoader.style.width = life + "%";
        gameOver = false;
        playerDie.play();
    } else {
        gameMusicGet.pause();
        gameOverSound.play();
        endGameGet.play();
       swal.fire({
        title: "Game Over",
        footer: "Powered by Henqsoft Solutions",
        html: `<hr><b class="scoreVal">Score: ${score}</b><br><small>You were eaten by Enemies of the underworld</small>`,
        icon:"error",
        preDeny: 5000,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        confirmButtonColor:"tomato",
        footer:"Powered By Henqsoft solutions"
        }).then(willProceed =>{
           location.reload();
            currentPage(levelContainer);
        });
        changeHighScore();
    };
    if (life <= 30) lifeBar.style.background = "red";
    
};
    
    //Create a back button to access the homepage
    landScaper.addEventListener("click", ()=>{
        currentPage(container);
    })
    
    highScoreBtn.addEventListener("click", ()=>{
//        if (highScore === null) {
//            localStorage.setItem("gameHighScore",0);
//            highScore = 0;
//        }
        swal.fire({
        title: "High score",
        footer: "Powered by Henqsoft Solutions",
        html: `<hr><b class="scoreVal">Score: ${localStorage.getItem("gameHighScore")}</b><br><small>Thanks for downloading this great resource. Do you want to reset high scores?</small>`,
        icon:"error",
        preDeny: 5000,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showDenyButton: false,
        showCloseButton: true,
        allowEnterKey: false,
        confirmButtonColor:"tomato",
        confirmButtonText:"Reset",
        denyButtonText: 'cancel',
        denyButtonColor: "#287bff",
        footer:"Powered By Henqsoft solutions"
        }).then(willProceed =>{
            localStorage.setItem("gameHighScore", 0);
        });
    })
    
    function explode(projectile) {
        enemiesKilled += 1;
        enemiesCont.innerText = enemiesKilled;
        for(let i = 0; i < 12; i++) {
            explosions.push(new Explosion(projectile.x, projectile.y, (Math.random() * 2) + 1, "black", {
                x: (Math.random() - 0.5) * (Math.random() * 10),
                y: (Math.random() - 0.5) * (Math.random() * 10)
            }));
        };
    };
    
    //AddEvent Listener for the body of the container so as to proceed to the level container
    container.addEventListener("click", ()=>{
        powerSound.play();
        currentPage(levelContainer);
    })
    
    
    
//This is a class to handle all the keyboard input in the game
class inputHandler {
    constructor() {
        this.keys = [];
        this.space = false;
        this.touchY = '';
        this.touchX = '';
        this.touchTreshold = 5;
        window.addEventListener("keydown", e => {
            if((e.key === "ArrowDown" ||
                e.key === "ArrowUp" || 
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight") 
               && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
                obstacleMove = 15;
            };
            
            if (e.key === " ") {
                this.space = true;
                if (!dog.onGround()) {
                    const velocity = {
                        x: 60,
                        y: 0
                    };
        
                    projectiles.push(new Projectile(dog.x + dog.width / 4, dog.y + dog.height / 4, 5, 'black',velocity));
                };
            };
        })
        
        window.addEventListener("keyup", e => {
            if(e.key === "ArrowDown" ||
                e.key === "ArrowUp" || 
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight") {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                    obstacleMove = 0;
            }

            if (e.key === " ") {
                this.space = false;
                
            }
        });
        
        //AddEventListener for phone users
        //AddEventListener for touchstart
        window.addEventListener("touchstart", e => {
            this.touchY = e.changedTouches[0].pageY;
            this.touchX = e.changedTouches[0].pageX;
            
            //Add the shoot to the keys array to allow the player to shoot
            if (!dog.onGround()) {
                const velocity = {
                    x: 60,
                    y: 0
                };
        
                projectiles.push(new Projectile(dog.x + dog.width / 4, dog.y + dog.height / 4, 5, 'black',velocity));
            };
        });
        
        //AddEventListener for touch mouve event
        window.addEventListener("touchmove", e => {
            const swipeDistanceX = e.changedTouches[0].pageX - this.touchX;
            const swipeDistanceY = e.changedTouches[0].pageY - this.touchY;
            
            //Check the direction of the swipes
            if (swipeDistanceX < -this.touchTreshold && this.keys.indexOf('swipe left') === -1) this.keys.push("swipe left");
            else if (swipeDistanceX > this.touchTreshold && this.keys.indexOf('swipe right') === -1) this.keys.push('swipe right');
            
            //Check the direction of the swipes horizontally
            //Check the direction of the swipes
            if (swipeDistanceY < -this.touchTreshold && this.keys.indexOf('swipe up') === -1) this.keys.push("swipe up");
            else if (swipeDistanceY > this.touchTreshold && this.keys.indexOf('swipe down') === -1) this.keys.push('swipe down');
        });
        
        //AddEventListener for touch end
        window.addEventListener("touchend", e => {
            this.keys.splice(this.keys.indexOf("swipe up"), 1);
            this.keys.splice(this.keys.indexOf("swipe down"), 1);
            
            this.keys.splice(this.keys.indexOf("swipe left"), 1);
            this.keys.splice(this.keys.indexOf("swipe right"), 1);
        });
    }
};

//This is a class to handle all the background of the game
class Layer {
    constructor(image, speedModifier) {
        this.x = 0;
        this.y = 0;
        this.width = innerWidth;
        this.height = innerHeight;
//        this.x2 = this.width;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }
    
    //    Method that updates the background to give it a moving effect
    update() {
        this.speed = gameSpeed * this.speedModifier;
        if (this.x <= -this.width) {
            this.x = 0; //this.width + this.x2 - this.speed;
        }
        
        //  Reset the x values of the images in the game
        this.x = Math.floor(this.x - this.speed);
    }
    //    Method to draw the background image to the canvas
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}
    
//This class handles all the explosion which occurs after hitting an enemy
    class Explosion {
        constructor(x, y, radius, color, velocity) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.velocity = velocity;
            this.alpha = 1;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
        
        update() {
            this.draw();
            this.alpha -= 0.01;
            this.x = this.x + this.velocity.x;
            this.y = this.y + this.velocity.y;
        }
    }
    
    class Powerup {
        constructor(gameWidth, gameHeight, image, width, height) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.x = gameWidth;
            this.y = Math.random() * (this.gameHeight - 200);
            this.image = image;
            this.width = width;
            this.height = height;
            this.resoluteX = this.width / 5;
            this.resoluteY = this.height / 5;
            this.speed = 5 * levelSpeed;
            this.markedForDeletion = false
        }
        
        draw() {
            ctx.drawImage(this.image,this.x, this.y, this.resoluteX, this.resoluteY);
        }
        
        update() {
            this.x -= this.speed;
             if (this.x <= 0 - this.resoluteX) {
                 this.markedForDeletion = true;
             };
        }
    }
    
//This is a class to handle the shadow dog class
    class shadowDog {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 573;
            this.height = 523;
            this.x = 0;
            this.y = this.gameHeight - this.height / 2.5 - 20;
            this.image = shadowDogSprite;
            this.frameX = 1;
            this.frameY = 3;
            this.speed = 0;
            this.vy = 0;
            this.weight = 3.5;
            this.addedWeight = 0;
            this.directon = "none";
            this.maxFrame = 6;
            this.fps = 10;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.rollSeconds = false;
            this.gameOver = gameOver;
        }
        
        //Method to draw the player dog to the screen(canvas)
        draw() {
            ctx.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width / 3, this.height / 3);
        }
        
        //Method to move the player dog by updating its x value
        update(input, deltaTime, enemies, enemiesBat, enemiesSpider, enemiesGhost, enemyOwl, enemiesSpinner, enemyRaven) {
            //Collision detection between player and enemyWorm
            enemies.forEach(enemy => {
                let dist = Math.hypot(this.x - enemy.x, this.y - enemy.y);
                
                //End game on enemy collision
                if (dist - enemy.width / 2.7 - this.width / 10 < 1) {
                    gameOver = true;
                    brutality.play();
                };
            });
            
            //Collision detection between player and enemyWorm
            coins.forEach((coin, coinIndex) => {
                let distCoin = Math.hypot(this.x - coin.x, this.y - coin.y);
                
                //End game on enemy collision
                if (distCoin - coin.width / 8 - this.width / 10 < 1) {
                    coins.splice(coinIndex, 1);
                    coinPicked += 1;
                    coinCont.innerText = coinPicked;
                    coinGetGet.play();
                };
            });
            
            //Collision detection between player and enemyWorm
            powerUps.forEach((powerUp, powerUpIndex) => {
                let distpowerUp = Math.hypot(this.x - powerUp.x, this.y - powerUp.y);
                
                //End game on enemy collision
                if (distpowerUp - powerUp.width / 8 - this.width / 10 < 1) {
                    powerUps.splice(powerUpIndex, 1);
                    if (life <= 90) life += 10;
                    if (life >= 30) lifeBar.style.background = "White";
                    lifeLoader.style.width = life + "%";
                        ctx.font = '50px corbel';
                        ctx.fillText("+10", powerUp.x, powerUp.y);
                        powerSound.play();
                };
            });
            
            //Collision detection between player and enemyBat
            enemiesBat.forEach(enemyBat => {
                let distBat = Math.hypot(this.x - enemyBat.x, this.y - enemyBat.y);
                
                //End game on enemy collision
                if (distBat - enemyBat.width / 5 - this.width/ 27.5 < 1) {
                    gameOver = true;
                };
            });
            
            //Collision detection between player and enemyBat
            enemiesSpider.forEach(enemySpider => {
                let distSpider = Math.hypot(this.x - enemySpider.x, this.y - enemySpider.y);
                
                //End game on enemy collision
                if (distSpider - enemySpider.width / 4 - this.width/ 31.58 < 1) {
                    gameOver = true;
                };
            });
            
            //Collision detection between player and enemyGhost
            enemiesGhost.forEach(enemyGhost => {
                let distGhost = Math.hypot(this.x - enemyGhost.x, this.y - enemyGhost.y);
                
                //End game on enemy collision
                if (distGhost - enemyGhost.width / 3.3 - this.width/ 21.5 < 1) {
                    gameOver = true;
                };
            });
            
            //Collision detection between player and enemy Owl
            enemiesOwl.forEach(enemyOwl => {
                let distOwl = Math.hypot(this.x - enemyOwl.x, this.y - enemyOwl.y);
                
                //End game on enemy collision
                if (distOwl - enemyOwl.width / 3 - this.width/ 20 < 1) {
                    gameOver = true;
                };
            });
            
            //Collision detection between player and enemy Raven
            enemiesRaven.forEach(enemyRaven => {
                let distRaven = Math.hypot(this.x - enemyRaven.x, this.y - enemyRaven.y);
                
                //End game on enemy collision
                if (distRaven - enemyRaven.width / 3 - this.width/ 18.7 < 1) {
                    gameOver = true;
                };
            });
            
            //Collision detection between player and enemyGhost
            enemiesSpinner.forEach(enemySpinner => {
                let distSpinner = Math.hypot(this.x - enemySpinner.x, this.y - enemySpinner.y);
                
                //End game on enemy collision
                if (distSpinner - enemySpinner.width / 3 - this.width/ 20 < 1) {
                    gameOver = true;
                };
            });
            
            //Collision detection between player and enemyGhost
            enemiesSideBat.forEach(enemySideBat => {
                let distSideBat = Math.hypot(this.x - enemySideBat.x, this.y - enemySideBat.y);
                
                //End game on enemy collision
                if (distSideBat - enemySideBat.width / 3 - this.width/ 24 < 1) {
                    gameOver = true;
                };
            });
            
            //Check if enemy hits player and stop the game by calling the game over function
            if (gameOver) {
                //Run the game over function 
                gameoverFunction(); //Utility function
            }
            
            //A conditional statement which tests if the arrowright key is pressed
            //If condition is true it will increase player speed
            if (input.keys.indexOf("ArrowRight") > -1 || input.keys.indexOf("swipe right") > -1) {
                this.speed = 15;
                gameSpeed = 15;
                this.frameY = 3;
                this.direction = "right";
                distance += 15;
                distanceCont.innerText = distance;
//                running.play();
            } else if((input.keys.indexOf("ArrowLeft") > -1 || input.keys.indexOf("swipe left") > -1)) {
                this.speed = -15;
                this.direction = "none"
            } else if ((input.keys.indexOf("ArrowUp") > -1 || input.keys.indexOf("swipe up") > -1) && this.onGround()) {
                this.vy -= 45;
                this.frameY = 2;
                this.direction = "up";
                this.addedWeight = 0;
                this.weight = 3.5;
                distance += 10;
                distanceCont.innerText = distance;
//                running.pause();
            } else if((!input.keys.indexOf("ArrowUp") > -1 || !input.keys.indexOf("swipe up") > -1) && (!this.onGround())) {
                this.frameY = 1;
            } else if((input.keys.indexOf("ArrowDown") > -1 || input.keys.indexOf("swipe down") > -1)) {
                this.frameY = 5;
                gameSpeed = 0;
                this.speed = 0;
                this.rollSeconds = true;
                this.direction = "down";
//                running.pause();
            } else {
                this.vy = 0;
                this.speed = 0;
                gameSpeed = 0;
                this.frameY = 0;
                this.direction = "none";
            }
            
            if (!this.onGround()) {
                this.vy += this.weight;
                this.frameY = 2;
                gameSpeed = 5;
                if ((input.keys.indexOf("ArrowUp") > -1 || input.keys.indexOf("swipe up") > -1)) {
                    this.frameY = 1;
                    this.weight = 3.5;
                }
                if (input.keys.indexOf("ArrowDown") > -1 || input.keys.indexOf("swipe down") > -1) {
                    this.frameY = 6;
                    this.direction = "none";
                    this.weight = 100;
                }
            }
            
            //Reset the maximum number of cycling ot the sritesheet according to the player state
            if (this.direction = "none") {
                this.maxFrame = 6;
            } else if (this.direction = "up") {
                this.maxFrame = 6;
            } else if (this.direction = "right") {
                this.maxFrame = 8;
            } else if (this.direction = "down") {
                this.maxFrame = 5;
            }
            
            //Sprite Animation
            //This helps to animate the state of the player in the spritesheet
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX <= this.maxFrame - 1) {
                    this.frameX++; //Increase the frame in the spritesheet to animate it
                } else {
                    this.frameX = 0;
                }
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            
            //Horizontal movement of the player
            this.x += this.speed;
            if (this.x < 0) this.x = 0;
            else if (this.x + this.width / 3 > innerWidth) this.x = 0;
            //Vertical movement of the player
            this.y += this.vy;
            
            //Check if the player's height is greater than the expected height below due to the gravity
            if (this. y > this.gameHeight - this.height / 3) this.y = this.gameHeight - this.height / 3;
        }
        
        //This checks if the player is on the solid ground
        //If it is not on the ground then it adds gravity to it
        onGround() {
            return this.y >= this.gameHeight - this.height / 3;
        }
    }
    
    class Enemy {
        constructor(image, gameWidth, gameHeight, width, height, position) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = image;
            this.width = width;
            this.height = height;
            this.x = this.gameWidth;
            this.y = position;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.speed = 10 * levelSpeed;
            this.markedForDeletion = false;
        }
        
        draw() {
            ctx.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width / 2, this.height / 2);
        }
        
        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            
            this.x -= this.speed;
            //Check if the enemy has gone away from the screen and delete it
            if (this.x < 0 - this.width) this.markedForDeletion = true;
        }
    }
    
    class Obstacle {
        constructor(image, gameWidth, gameHeight, width, height, position, respawn) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = image;
            this.width = width;
            this.height = height;
            this.x = (this.gameHeight * respawn) - 4;
            this.y = position - this.height;
            this.respawn = respawn;
        }
        
        draw() {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        
        update(input) {
            if (input.keys.indexOf("ArrowUp") > -1 || input.keys.indexOf("ArrowRight") > -1) {
                this.x -= (obstacleMove + Math.random() * obstacleMove/3 + Math.random() * 1);
            }
            
            //Check if the enemy has gone away from the screen and delete it
            if (this.x < 0 - this.width) this.x = (this.gameWidth * this.respawn);
        }
    }
    
    class Bird {
        constructor(image, gameWidth, gameHeight, width, height, position, respawn) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = image;
            this.width = 200.333;
            this.height = 200.333;
            this.x = (0 * respawn) - 4;
            this.y = 40;
            this.respawn = respawn;
            this.frameX = 1;
            this.frameY = 1;
            this.maxFrame = 7;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
        }
        
        draw() {
            ctx.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width / 2, this.height/ 2);
        }
        
        update(deltaTime) {
            //Handle moving of birds in the sky
            this.x += 10;
            
            //Handle the frame animation for the bird
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            
            //Check if the enemy has gone away from the screen and delete it
            if (this.x > this.gameWidth) {
                birdCryGet.play();
                this.x = (0 - this.width/ 2);
            }
        }
    }
    
    class EnemyOwl {
        constructor(image, gameWidth, gameHeight, width, height, position) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = image;
            this.width = width;
            this.height = height;
            this.x = this.gameWidth;
            this.y = position;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.speed = 10 * levelSpeed;
            this.markedForDeletion = false;
        }
        
        draw() {
            ctx.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width / 2, this.height / 2);
        }
        
        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            
            this.x -= this.speed;
            //Check if the enemy has gone away from the screen and delete it
            if (this.x < 0 - this.width) this.markedForDeletion = true;
        }
    }
    
    class EnemyGhost {
        constructor(image, gameWidth, gameHeight, width, height, position) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = image;
            this.width = width;
            this.height = height;
            this.x = this.gameWidth;
            this.y = position;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.speed = 10 * levelSpeed;
            this.markedForDeletion = false;
            this.angle = 0;
            this.globalAlpha = 0.7
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.globalAlpha;
            ctx.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width / 2, this.height / 2);
            ctx.restore();
        }
        
        update(deltaTime) {
            this.y += Math.sin(this.angle);
            this.angle++;
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            
            this.x -= this.speed;
            //Check if the enemy has gone away from the screen and delete it
            if (this.x < 0 - this.width) this.markedForDeletion = true;
        }
    }
    
    class EnemySpider {
        constructor(image, gameWidth, gameHeight, width, height, position) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = image;
            this.width = width;
            this.height = height;
            this.x = Math.random() * this.gameWidth;
            this.y = 0 - this.height;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.speed = 15 * levelSpeed;
            this.maxLength = Math.random()* (this.gameHeight - 150) + 40;
            this.markedForDeletion = false;
        }
        
        draw() {
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 4, 0);
            ctx.lineTo(this.x + this.width / 4, this.y + 10);
            ctx.stroke();
            ctx.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width / 2, this.height / 2);
        }
        
        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            
            this.y += this.speed;
            //Check if the spider has reached its limit
            if (this.y > this.maxLength) this.y *= -1;
            //Check if the enemy has gone away from the screen and delete it
            if (this.y < 0 - this.height) this.markedForDeletion = true;
        }
    }
    
    class EnemyBat {
        constructor(image, gameWidth, gameHeight, width, height, position) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = image;
            this.width = width;
            this.height = height;
            this.x = this.gameWidth;
            this.y = position;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.speed = 10 * levelSpeed;
            this.markedForDeletion = false;
        }
        
        draw() {
            ctx.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width / 2, this.height / 2);
        }
        
        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            
            this.x -= this.speed;
            //Check if the enemy has gone away from the screen and delete it
            if (this.x < 0 - this.width) this.markedForDeletion = true;
        }
    }
    
    class EnemySpinner {
        constructor(image, gameWidth, gameHeight, width, height, position) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = image;
            this.width = width;
            this.height = height;
            this.x = this.gameWidth;
            this.y = position;
            this.frameX = 0;
            this.maxFrame = 8;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.speed = 30 * levelSpeed;
            this.markedForDeletion = false;
        }
        
        draw() {
            ctx.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width / 2, this.height / 2);
        }
        
        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            
            this.x -= this.speed;
            //Check if the enemy has gone away from the screen and delete it
            if (this.x < 0 - this.width) this.markedForDeletion = true;
        }
    }
    
    class EnemySideBat {
        constructor(image, gameWidth, gameHeight, width, height, position) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = image;
            this.width = width;
            this.height = height;
            this.x = this.gameWidth;
            this.y = position;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.speed = 10 * levelSpeed;
            this.markedForDeletion = false;
        }
        
        draw() {
            ctx.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width / 2, this.height / 2);
        }
        
        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            
            this.x -= this.speed;
            //Check if the enemy has gone away from the screen and delete it
            if (this.x < 0 - this.width) this.markedForDeletion = true;
        }
    }
    
    class EnemyRaven {
        constructor(image, gameWidth, gameHeight, width, height, position) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = image;
            this.width = width;
            this.height = height;
            this.x = this.gameWidth;
            this.y = position;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.speed = 10 * levelSpeed;
            this.markedForDeletion = false;
        }
        
        draw() {
            ctx.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width / 2, this.height / 2);
        }
        
        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            
            this.x -= this.speed;
            //Check if the enemy has gone away from the screen and delete it
            if (this.x < 0 - this.width) this.markedForDeletion = true;
        }
    }
    
    class Projectile {
        constructor(x,y,radius,color,velocity) {
            this.x= x;
            this.y= y;
            this.radius= radius;
            this.color= color;
            this.velocity= velocity;
        }
    
        draw() {
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2, false);
            ctx.fillStyle=this.color;
            ctx.fill();
        }
    
        update() {
            this.draw();
            this.x = this.x + this.velocity.x;
            this.y = this.y + this.velocity.y;
        }
    }
    
    
    
    function handleEnemies(deltaTime) {
        if (enemyTimer > enemyInterval + 2000 + randomEnemyInterval) {
            enemies.push(new Enemy(wormImg, innerWidth, innerHeight, 229, 171, innerHeight - 171 / 2));
            enemyTimer = 0;
        } else {
            enemyTimer += deltaTime;
        }
        
        enemies.forEach(enemy => {
            enemy.draw();
            enemy.update(deltaTime);
        });
        
        enemies = enemies.filter(enemy => !enemy.markedForDeletion);
    }
    
    function handleEnemiesBat(deltaTime) {
        if (enemyTimerBat > enemyIntervalBat + randomEnemyIntervalBat) {
            enemiesBat.push(new EnemyBat(batImg, innerWidth, innerHeight, 293, 155, Math.random() * (innerHeight - 80)))
            enemyTimerBat = 0;
        } else {
            enemyTimerBat += deltaTime;
        }
        
        enemiesBat.forEach(enemyBat => {
            enemyBat.draw();
            enemyBat.update(deltaTime);
        });
        
        enemiesBat = enemiesBat.filter(enemyBat => !enemyBat.markedForDeletion);
    }
    
    function handleEnemiesSpinner(deltaTime) {
        if (enemyTimerSpinner > enemyIntervalSpinner + randomEnemyIntervalSpinner) {
            enemiesSpinner.push(new EnemySpinner(spinnerImg, innerWidth, innerHeight, 213, 212, Math.random() * (innerHeight - 190)))
            enemyTimerSpinner = 0;
        } else {
            enemyTimerSpinner += deltaTime;
        }
        
        enemiesSpinner.forEach(enemySpinner => {
            enemySpinner.draw();
            enemySpinner.update(deltaTime);
        });
        
        enemiesSpinner = enemiesSpinner.filter(enemySpinner => !enemySpinner.markedForDeletion);
    }
    
    function handleEnemiesSpider(deltaTime) {
        if (enemyTimerSpider > enemyIntervalSpider + randomEnemyIntervalSpider) {
            enemiesSpider.push(new EnemySpider(spiderImg, innerWidth, innerHeight, 310, 175, Math.random() * (innerHeight - 80)))
            enemyTimerSpider = 0;
        } else {
            enemyTimerSpider += deltaTime;
        }
        
        enemiesSpider.forEach(enemySpider => {
            enemySpider.draw();
            enemySpider.update(deltaTime);
        });
        
        enemiesSpider = enemiesSpider.filter(enemySpider => !enemySpider.markedForDeletion);
    }
    
    function handleEnemiesGhost(deltaTime) {
        if (enemyTimerGhost > enemyIntervalGhost + randomEnemyIntervalGhost) {
            enemiesGhost.push(new EnemyGhost(ghostImg, innerWidth, innerHeight, 261, 209, Math.random() * (innerHeight - 280)))
            enemyTimerGhost = 0;
        } else {
            enemyTimerGhost += deltaTime;
        }
        
        enemiesGhost.forEach(enemyGhost => {
            enemyGhost.draw();
            enemyGhost.update(deltaTime);
        });
        
        enemiesGhost = enemiesGhost.filter(enemyGhost => !enemyGhost.markedForDeletion);
    }
    
    function handleEnemiesOwl(deltaTime) {
        if (enemyTimerOwl > enemyIntervalOwl + randomEnemyIntervalOwl) {
            enemiesOwl.push(new EnemyOwl(owlImg, innerWidth, innerHeight, 218, 177, Math.random() * (innerHeight - 170)))
            enemyTimerOwl = 0;
        } else {
            enemyTimerOwl += deltaTime;
        }
        
        enemiesOwl.forEach(enemyOwl => {
            enemyOwl.draw();
            enemyOwl.update(deltaTime);
        });
        
        enemiesOwl = enemiesOwl.filter(enemyOwl => !enemyOwl.markedForDeletion);
    }
    
    
    function handleEnemiesRaven(deltaTime) {
        if (enemyTimerRaven > enemyIntervalRaven + randomEnemyIntervalRaven) {
            enemiesRaven.push(new EnemyRaven(ravenImg, innerWidth, innerHeight, 271, 194, Math.random() * (innerHeight - 100)))
            enemyTimerRaven = 0;
        } else {
            enemyTimerRaven += deltaTime;
        }
        
        enemiesRaven.forEach(enemyRaven => {
            enemyRaven.draw();
            enemyRaven.update(deltaTime);
        });
        
        enemiesRaven = enemiesRaven.filter(enemyRaven => !enemyRaven.markedForDeletion);
    }
    
    function handleEnemiesSideBat(deltaTime) {
        if (enemyTimerSideBat > enemyIntervalSideBat + randomEnemyIntervalSideBat) {
            enemiesSideBat.push(new EnemySideBat(sideBatImg, innerWidth, innerHeight, 266, 188, Math.random() * (innerHeight - 150)))
            enemyTimerSideBat = 0;
        } else {
            enemyTimerSideBat += deltaTime;
        }
        
        enemiesSideBat.forEach(enemySideBat => {
            enemySideBat.draw();
            enemySideBat.update(deltaTime);
        });
        
        enemiesSideBat = enemiesSideBat.filter(enemySideBat => !enemySideBat.markedForDeletion);
    }
    
    function handleCoins(deltaTime) {
        if (coinTimer > coinTimerInterval + randomcoinTimerInterval) {
            coins.push(new Powerup(innerWidth, innerHeight, coin3 , 415, 415));
            coinTimer = 0;
        } else {
            coinTimer += deltaTime;
        }
        
        
       if (powerTimer > powerTimerInterval + randomPowerTimer) {
            powerUps.push(new Powerup(innerWidth, innerHeight, PowerUp1 , 415, 415));
            powerTimer = 0;
        } else {
            powerTimer += deltaTime;
        }
        
        powerUps.forEach(powerUp =>{
            powerUp.draw();
            powerUp.update();
        });
        
        coins.forEach(coin =>{
            coin.draw();
            coin.update();
        });
    }
    

const input = new inputHandler();
const background = new Layer(backgroundLayer1, 6.5);
const dog = new shadowDog(innerWidth, innerHeight);
const worm = new Enemy(wormImg, innerWidth, innerHeight, 229, 171);
const bat = new Enemy(batImg, innerWidth, innerHeight, 293, 155);
const owl = new Enemy(wormImg, innerWidth, innerHeight, 160, 119);
const spinner = new Enemy(wormImg, innerWidth, innerHeight, 160, 119);
const sideBat = new Enemy(wormImg, innerWidth, innerHeight, 160, 119);
const ghost = new Enemy(wormImg, innerWidth, innerHeight, 160, 119);
const spider = new Enemy(wormImg, innerWidth, innerHeight, 160, 119);
const raven = new Enemy(wormImg, innerWidth, innerHeight, 160, 119);
let crate = new Obstacle(crateImg, innerWidth, innerHeight, 101, 101, innerHeight, 1.1);
let sign = new Obstacle(signImg, innerWidth, innerHeight, 87, 130, innerHeight, 1.2);
let signsec = new Obstacle(signsecImg, innerWidth, innerHeight, 87, 93, innerHeight, 1);
let tree = new Obstacle(treeImg, innerWidth, innerHeight, 364, 280, innerHeight, 1.7);
let stone = new Obstacle(stoneImg, innerWidth, innerHeight, 124, 78, innerHeight, 2);
let snow = new Obstacle(snowImg, innerWidth, innerHeight, 193, 210, innerHeight, 2.4);
let treesec = new Obstacle(treesecImg, innerWidth, innerHeight, 228, 280, innerHeight, 2.8);
let crystal = new Obstacle(crystalImg, innerWidth, innerHeight, 97, 78, innerHeight, 3);
let icebox = new Obstacle(iceboxImg, innerWidth, innerHeight, 101, 101, innerHeight, 3.4);
let igloo = new Obstacle(iglooImg, innerWidth, innerHeight, 511, 201, innerHeight, 3.6);
    
//create a variable to draw bird by creating a new instance of bird;
let bird = new Bird(birdImg, innerWidth, innerHeight, 200.67, 205.33,(8/100) * innerHeight , 3.6);
    


//Time variables
let lastTime = 0;
let enemyTimer = 0;
let enemyInterval = 18000 / enemyLevel;
let randomEnemyInterval = Math.random() * 1000 + 500;
    
let enemyTimerBat = 0;
let enemyIntervalBat = 19000 / enemyLevel;
let randomEnemyIntervalBat = Math.random() * 2000 + 500

let enemyTimerSpider = 0;
let enemyIntervalSpider = 32000 / enemyLevel;
let randomEnemyIntervalSpider = Math.random() * 5000 + 500;
    
let enemyTimerGhost = 0;
let enemyIntervalGhost = 18000 / enemyLevel;
let randomEnemyIntervalGhost = Math.random() * 2000 + 500;
    
let enemyTimerOwl = 0;
let enemyIntervalOwl = 12000 / enemyLevel;
let randomEnemyIntervalOwl = Math.random() * 2000 + 500;
    
let enemyTimerSpinner = 0;
let enemyIntervalSpinner = 25000 / enemyLevel;
let randomEnemyIntervalSpinner = Math.random() * 2000 + 500;
    
let enemyTimerSideBat = 0;
let enemyIntervalSideBat = 17000 / enemyLevel;
let randomEnemyIntervalSideBat = Math.random() * 2000 + 500;
    
let enemyTimerRaven = 0;
let enemyIntervalRaven = 14000 / enemyLevel;
let randomEnemyIntervalRaven = Math.random() * 2000 + 500;
    
//Create interval for spawning of powerups and coins
//Coins
let coinTimer = 0;
let coinTimerInterval = 20000 / enemyLevel;
let randomcoinTimerInterval = Math.random() * 2000 + 500;
    
//Powerup
let powerTimer = 0;
let powerTimerInterval = 45000 / enemyLevel;
let randomPowerTimer = Math.random() * 2000 + 500;


//Timing variable for obstacles
let ObstacleTimer = 0;
let ObstacleInterval = 7000 / enemyLevel;
let randomObstacleInterval = Math.random() * 2000 + 500;
    
function animate(timeStamp) {
    //Calculate delta time so the game works at the same rate on all systems
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //Calculate the score of the player
    score = distance + (coinPicked * 100) + (enemiesKilled * 150);
    scoreCont.innerText = score;
    //    Call the draw and update method of the Layer class to make the background show and animate respectively
    background.draw();
    background.update();
    //Drawing obstacles individually
    tree.draw();
    tree.update(input);
    treesec.draw();
    treesec.update(input);
    snow.draw();
    snow.update(input);
    stone.draw();
    stone.update(input);
    sign.draw();
    sign.update(input);
    signsec.draw();
    signsec.update(input);
    crate.draw();
    crate.update(input)
    crystal.draw();
    crystal.update(input);
    igloo.draw();
    igloo.update(input);
    
    //Handle drawing of birds
    bird.draw();
    bird.update(deltaTime);
    
    //Handle drawing of powerup
    handleCoins(deltaTime);
    //    Call the draw and update method of the shadowDog class to draw and animate the player dog to the screen
    dog.draw();
    dog.update(input, deltaTime, enemies, enemiesBat, enemiesSpider, enemiesGhost, enemiesOwl, enemiesSpinner, enemiesSideBat, enemiesRaven);
    explosions.forEach((explosion, explosionIndex) =>{
        explosion.update();
        if (explosion.alpha <= 0) {
            explosions.splice(explosionIndex, 1);
        };
    });
    handleEnemies(deltaTime);
    handleEnemiesBat(deltaTime);
    handleEnemiesGhost(deltaTime);
    handleEnemiesSpider(deltaTime);
    handleEnemiesOwl(deltaTime);
    handleEnemiesSpinner(deltaTime);
    handleEnemiesSideBat(deltaTime);
    handleEnemiesRaven(deltaTime);
    
    //Handle drawing of powerup
    handleCoins(deltaTime);
    
    //Handle projectiles
    projectiles.forEach((projectile, projectileIndex)=> {
        projectile.update();
        
        enemiesOwl.forEach((enemyOwl, enemyOwlIndex) => {
            let OwlDistance = Math.hypot(projectile.x - enemyOwl.x, projectile.y - enemyOwl.y);
            
            //Check if the bullet hits the worm enemy
            if (OwlDistance - enemyOwl.width / 4 - projectile.radius < 1) {
                enemiesOwl.splice(enemyOwlIndex, 1);
                projectiles.splice(projectileIndex, 1);
                explode(projectile);
            };
        });
        
        enemiesBat.forEach((enemyBat, enemyBatIndex) => {
            let BatDistance = Math.hypot(projectile.x - enemyBat.x, projectile.y - enemyBat.y);
            
            //Check if the bullet hits the worm enemy
            if (BatDistance - enemyBat.width / 5 - projectile.radius < 1) {
                enemiesBat.splice(enemyBatIndex, 1);
                projectiles.splice(projectileIndex, 1);
                explode(projectile);
            };
        });
        
        enemiesGhost.forEach((enemyGhost, enemyGhostIndex) => {
            let GhostDistance = Math.hypot(projectile.x - enemyGhost.x, projectile.y - enemyGhost.y);
            
            //Check if the bullet hits the worm enemy
            if (GhostDistance - enemyGhost.width / 5 - projectile.radius < 1) {
                enemyGhost.globalAlpha -= 0.1
                projectiles.splice(projectileIndex, 1);
                explode(projectile);
            };
            
            if (enemyGhost.globalAlpha <= 0.3) {
                enemiesGhost.splice(enemyGhostIndex, 1);
                explode(projectile);
            }
        });
        
        enemiesSideBat.forEach((enemySideBat, enemySideBatIndex) => {
            let SideBatDistance = Math.hypot(projectile.x - enemySideBat.x, projectile.y - enemySideBat.y);
            
            //Check if the bullet hits the worm enemy
            if (SideBatDistance - enemySideBat.width / 5 - projectile.radius < 1) {
                enemiesSideBat.splice(enemySideBatIndex, 1);
                projectiles.splice(projectileIndex, 1);
                explode(projectile);
            };
        });
        
        enemiesSpinner.forEach((enemySpinner, enemySpinnerIndex) => {
            let SpinnerDistance = Math.hypot(projectile.x - enemySpinner.x, projectile.y - enemySpinner.y);
            
            //Check if the bullet hits the worm enemy
            if (SpinnerDistance - enemySpinner.width / 5 - projectile.radius < 1) {
                enemiesSpinner.splice(enemySpinnerIndex, 1);
                projectiles.splice(projectileIndex, 1);
                explode(projectile);
            };
        });
        
        enemiesRaven.forEach((enemyRaven, enemyRavenIndex) => {
            let RavenDistance = Math.hypot(projectile.x - enemyRaven.x, projectile.y - enemyRaven.y);
            
            //Check if the bullet hits the worm enemy
            if (RavenDistance - enemyRaven.width / 5 - projectile.radius < 1) {
                enemiesRaven.splice(enemyRavenIndex, 1);
                projectiles.splice(projectileIndex, 1);
                explode(projectile);
            };
        });
    
        //Remove projectiles form the edges of the screen
        if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height){
            setTimeout(() =>{
                projectiles.splice(projectileIndex, 1)                    
            }, 0);  
        };
    });
    
    //Check if the game is Over
    if (!gameOver && paused === 'played') {
        requestAnimationFrame(animate);
    }
}
    
levels.forEach((level, levelIndex)=>{
    level.addEventListener("click", ()=>{
        currentPage(canvas);
        animate(0);
        gameOver = false;
        life = 100;
        lifeLoader.style.width = life + "%";
        scoreBoard.classList.remove("none");
        scoreCont.classList.remove("none");
        lifeBar.classList.remove("none");
        lifeLoader.classList.remove("none");
        distanceCont.classList.remove("none");
        coinCont.classList.remove("none");
        commentBox.classList.remove("none");
        enemiesCont.classList.remove("none");
        auxscoreBoard.classList.remove("none");
        gamePause.classList.remove("none");
        gameSpeed = (levels.indexOf(levelIndex) + 15);
        enemyLevel = (levels.indexOf(levelIndex) + 1);
        levelSpeed = (levels.indexOf(levelIndex)+ 1) + 5;
        commentBox.innerText += ` ${level.innerText}: prepare for all kinds of enemies bro...`
        powerSound.play();
        uiMusicGet.pause();
        gameMusicGet.play();
        canvas.width = innerWidth;
        canvas.height = innerHeight;    
    });
});
    
    gamePlay.addEventListener("click", ()=>{
        gamePlay.classList.add("none");
        gamePause.classList.remove("none");
        paused = 'played';
        requestAnimationFrame(animate);
        paused = 'played';
    
});

//Run a function to check if the canvas is onscreen
    if (!canvas.classList.contains("none") || gameOver == false || !paused === "paused") {
        animate(0);
    }
});
