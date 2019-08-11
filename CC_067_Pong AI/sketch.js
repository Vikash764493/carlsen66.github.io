// port of Daniel Shiffman's Pong coding challenge
// by madacoo
// Changed to AI and color by Johnny Carlsen alis Carlsen66

let bestGames = []
let activeGames = []
let allGames = []

let leftscore = 0;
let rightscore = 0;
let runBest = 0
let bestGame = 0

let HighScoreLeftSpan;
let allTimeHighScoreLeftSpan;
let HighScoreRightSpan;
let allTimeHighScoreRightSpan;
let GameCounter = 0
// All time high score
let HighScoreLeft = 0;
let HighScoreRight = 0;
let runManuel = 0
let gameover = 0
let puck_speed = 10;

let NumOfGames = 200

function setup() {
    var cnv = createCanvas(600, 400);
    cnv.parent(canvascontainer)
    console.log('PingPong AI 20190811')

    for (let i = 0; i < NumOfGames; i++) {

        let g = new TheGame()

        activeGames[i] = g
        allGames[i] = g
    }
    speedSlider = select('#speedSlider');
    speedSpan = select('#speed');
    Puckspeed = select('#Puckspeed');
    Pspeed = select('#Pspeed');
    HighScoreLeftSpan = select('#hsl');
    allTimeHighScoreLeftSpan = select('#ahsl');
    HighScoreRightSpan = select('#hsr');
    allTimeHighScoreRightSpan = select('#ahsr');
    GameScore = select('#gs');
    runBestButton = select('#best');
    runBestButton.mousePressed(RunBestOnOff);
    SaveButton = select('#savebest');
    SaveButton.mousePressed(SaveBestGame);
    LoadButton = select('#loadbest');
    LoadButton.mousePressed(LoadBestGame);
    ManButton = select('#manuel');
    ManButton.mousePressed(ManuelGame);
}

function RunBestOnOff() {
    runBest = !runBest;
    if (runBest) {
        resetGame();
        runBestButton.html('continue training');
        // Go train some more
    } else {
        nextGeneration();
        runBestButton.html('run best');
    }
}

function ManuelGame() {
    runManuel = !runManuel;
    if (runManuel) {
        // resetGame();
        leftscore = 0
        rightscore = 0
        puck_speed = 10
        Pspeed.html(puck_speed)
        LoadBestGame()
        ManButton.html('AI Mode')
        // Go train some more
    } else {
        nextGeneration()
        ManButton.html('Manuel')
    }
}

function draw() {
    let ng = 1
    background(0, 100, 0)
    strokeWeight(4)
    stroke(255, 255)
    line(width / 2, 0, width / 2, height)
    strokeWeight(1)

    //  Should we speed up cycles per frame
    let cycles = speedSlider.value()
    speedSpan.html(cycles)

    //  Pick Speed setup
    if (puck_speed != Puckspeed.value() && (runBest || runManuel)) {
        LoadBestGame()
    }
    puck_speed = Puckspeed.value()
    Pspeed.html(puck_speed)

    //  RunBest Game 
    if (runBest) {
        activeGames[0] = bestGame
        ng = activeGames.length
    } else {
        ng = 1

    }
    if (runManuel) {
        textSize(14)
        text("USE J AND M", width - 100, height - 10)
    }
    //  GameOver sign
    if (gameover > 0) {
        gameover--;
        if (gameover <= 1) {
            LoadBestGame()
        } else {
            textAlign(CENTER)
            textSize(28)
            text("GAME  OVER", width / 2, height / 2)
        }
    }

    //   Main Loop
    if (gameover == 0) {
        for (n = 0; n < cycles; n++) {
            for (let i = activeGames.length - ng; i >= 0; i--) {
                // if (activeGames[i].dead == false) {

                if (activeGames[i].puck.checkPaddleRight(activeGames[i].right)) {
                    activeGames[i].right.score += 1
                }
                if (activeGames[i].puck.checkPaddleLeft(activeGames[i].left)) {
                    activeGames[i].left.score += 1
                }
                if (n == 0 && i == 0) {
                    activeGames[i].left.show();
                    activeGames[i].right.show();
                }
                activeGames[i].left.update();
                activeGames[i].right.update();
                activeGames[i].left.think(activeGames[i].puck)
                if (!runManuel) {
                    activeGames[i].right.think(activeGames[i].puck)
                }
                activeGames[i].puck.update();
                if (n == 0 && i == 0) {
                    activeGames[i].puck.show();
                }
                if (activeGames[i].puck.edges() == true) {
                    if (runManuel || runBest) {
                        gameover = 100;
                        // LoadBestGame()
                    } else {
                        activeGames.splice(i, 1)
                    }
                    // activeGames[i].dead = true
                    // console.log('Død')
                }

                if (activeGames.length == 0) {
                    console.log('New Game')
                    nextGeneration()
                    leftscore = 0
                    rightscore = 0
                }
                fill(255);
                textSize(32);
                text(leftscore, 32, 40);
                text(rightscore, width - 64, 40);
                // }
                // What is highest score of the current population
                let tempHighScoreLeft = 0;
                // If we're training
                if (!runBest) {
                    // Which is the best Game?
                    let tempBestGame = null;
                    for (let i = 0; i < activeGames.length; i++) {
                        let s = activeGames[i].left.score;
                        if (s > tempHighScoreLeft) {
                            tempHighScoreLeft = s;
                            tempBestGame = activeGames[i];
                        }
                    }

                    // Is it the all time high scorer?
                    if (tempHighScoreLeft > HighScoreLeft) {
                        HighScoreLeft = tempHighScoreLeft;
                        bestGame = tempBestGame;
                    }
                } else {
                    // Just one Game, the best one so far
                    tempHighScoreLeft = bestGame.score;
                    if (tempHighScoreLeft > HighScoreLeft) {
                        HighScoreLeft = tempHighScoreLeft;
                    }
                }

                // Update DOM Elements
                HighScoreLeftSpan.html(tempHighScoreLeft);
                allTimeHighScoreLeftSpan.html(HighScoreLeft);

                let tempHighScoreRight = 0;
                // If we're training
                if (!runBest) {
                    // Which is the best Game?
                    let tempBestGame = null;
                    for (let i = 0; i < activeGames.length; i++) {
                        let s = activeGames[i].right.score;
                        if (s > tempHighScoreRight) {
                            tempHighScoreRight = s;
                            tempBestGame = activeGames[i];
                        }
                    }

                    // Is it the all time high scorer?
                    if (tempHighScoreRight > HighScoreRight) {
                        HighScoreRight = tempHighScoreRight;
                        bestGame = tempBestGame;
                    }
                } else {
                    // Just one Game, the best one so far
                    tempHighScoreRight = bestGame.score;
                    if (tempHighScoreRight > HighScoreRight) {
                        HighScoreRight = tempHighScoreRight;
                    }
                }

                // Update DOM Elements
                HighScoreRightSpan.html(tempHighScoreRight);
                allTimeHighScoreRightSpan.html(HighScoreRight);
                GameScore.html(((HighScoreLeft + HighScoreRight) / 2) / GameCounter)

                if (activeGames.length == 0) {
                    console.log('New Game')
                    nextGeneration();
                }
            }
        }
    }
}


function keyReleased() {
    bestGame.left.move(0);
    bestGame.right.move(0);
}

function keyPressed() {
    console.log(key);
    if (key == 'A') {
        bestGame.left.move(-10);
    } else if (key == 'Z') {
        bestGame.left.move(10);
    }

    if (key == 'J') {
        bestGame.right.move(-10);
    } else if (key == 'M') {
        bestGame.right.move(10);
    }
}

function SaveBestGame() {
    let json = {};
    json = bestGame;

    saveJSON(json, 'GameBrain.json')
}

function getdata(json) {
    if (typeof json == 'string') {
        json = JSON.parse(json);
    }
    let GameBrain = new TheGame()
    GameBrain.left.brain = NeuralNetwork.deserialize(json.left.brain);
    GameBrain.right.brain = NeuralNetwork.deserialize(json.right.brain);
    bestGame = GameBrain;

    runBest = true;
    resetGames();
    if (!runManuel) {
        leftscore = 0
        rightscore = 0
    }
    runBestButton.html('continue training');
}

function LoadBestGame() {
    loadJSON('GameBrain.json', getdata);
}