let playerName = '';
let score = 0;
let level = 1;

function startGame() {
    const nameInput = document.getElementById('player-name').value.trim();
    
    if (nameInput === '') {
        alert('Please enter your name.');
        return;
    }
    
    playerName = nameInput;
    document.cookie = `playerName=${playerName}; path=/`;
    
    startNewLevel();
}

function startNewLevel() {
    document.getElementById('game-start').style.display = 'none';
    document.getElementById('game-section').style.display = 'block';
    generateQuestion();
}

function generateQuestion() {
    const systems = ['decimal', 'binary', 'quaternary'];
    const fromSystem = systems[Math.floor(Math.random() * systems.length)];
    let toSystem;
    
    do {
        toSystem = systems[Math.floor(Math.random() * systems.length)];
    } while (fromSystem === toSystem);
    
    let number;

    switch (fromSystem) {
        case 'decimal':
            number = Math.floor(Math.random() * Math.pow(10, level)); 
            break;
        case 'binary':
            number = Math.floor(Math.random() * Math.pow(2, level)).toString(2);
            break;
        case 'quaternary':
            number = Math.floor(Math.random() * Math.pow(4, level)).toString(4);
            break;
    }

    const questionText = `Convert ${number} from ${fromSystem} to ${toSystem}:`;
    
    document.getElementById('question').innerText = questionText;
    document.getElementById('feedback').innerText = '';
    document.getElementById('answer').value = '';
}

function checkAnswer() {
    const answer = document.getElementById('answer').value.trim();
    const questionText = document.getElementById('question').innerText;
    const number = questionText.split(' ')[1];
    const fromSystem = questionText.split(' ')[3];
    const toSystem = questionText.split(' ')[5];
    
    const decimalNumber = convertToDecimal(number, fromSystem);
    const correctAnswer = convertFromDecimal(decimalNumber, toSystem);
    
    if (answer === correctAnswer) {
        score += level;
        level++;
        document.getElementById('feedback').innerText = 'Correct! Moving to next level.';
        document.getElementById('score').innerText = `Score: ${score}`;
        saveScore();
        setTimeout(generateQuestion, 1000);
    } else {
        document.getElementById('feedback').innerText = `Incorrect. The correct answer was ${correctAnswer}.`;
        setTimeout(generateQuestion, 2000);
    }
}

function convertToDecimal(number, system) {
    switch (system) {
        case 'decimal':
            return parseInt(number, 10);
        case 'binary':
            return parseInt(number, 2);
        case 'quaternary':
            return parseInt(number, 4);
    }
}

function convertFromDecimal(decimalNumber, system) {
    switch (system) {
        case 'decimal':
            return decimalNumber.toString(10);
        case 'binary':
            return decimalNumber.toString(2);
        case 'quaternary':
            return decimalNumber.toString(4);
    }
}

function saveScore() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || {};
    
    if (!highScores[playerName] || highScores[playerName] < score) {
        highScores[playerName] = score;
        localStorage.setItem('highScores', JSON.stringify(highScores));
    }
}

function showHighScores() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || {};
    let highScoreText = 'High Scores:\n\n';
    
    for (const [name, score] of Object.entries(highScores)) {
        highScoreText += `${name}: ${score}\n`;
    }
    
    alert(highScoreText);
}

window.onload = function() {
    const cookies = document.cookie.split('; ');
    const playerCookie = cookies.find(cookie => cookie.startsWith('playerName='));
    
    if (playerCookie) {
        playerName = playerCookie.split('=')[1];
        document.getElementById('welcome-message').innerText = `Welcome back, ${playerName}!`;
        startNewLevel();
    } else {
        document.getElementById('game-start').style.display = 'block';
    }
};
