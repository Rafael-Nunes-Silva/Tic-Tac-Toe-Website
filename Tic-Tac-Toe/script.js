const EMPTY = 'Images/Empty.png'
const CIRCLE = 'Images/Circle.png';
const X = 'Images/X.png';

const DRAW = 'draw';
const USER = 'user';
const BOT = 'bot';

const BODY = document.getElementById('body');
const WLTEXT = document.getElementById('wlText');

var canPlay = true;

var table = [9];

function clampToTableVert(i) {
    if (i < 0)
        return 9 + i;
    if (i > 8)
        return i - 9;
    return i;
}
function clampToTableHor(i, min, max) {
    if (i < min)
        return max;
    if (i > max)
        return min;
    return i;
}

function setTable() {
    for (let i = 0; i < 9; i++)
        table[i] = document.getElementById('b' + i);
}

function getAvailablePos() {
    if (!canPlay)
        return;
    
    for (let i = 0; i < 9; i++){
        if (canPlayAt(i))
            return i;
    }

    canPlay = false;
    return -1;
}
function canPlayAt(i) {
    if (!canPlay)
        return false;
    
    return table[i].getAttribute('src') == EMPTY;
}
function getSymbolAt(i) {
    return table[i].getAttribute('src');
}

function userPlay(i) {
    if (!canPlay || !canPlayAt(i))
        return;
    
    table[i].setAttribute('src', X);

    endTurn(USER);
}
function botPlay(i) {
    if (!canPlay || !canPlayAt(i))
        return;
    
    table[i].setAttribute('src', CIRCLE);

    endTurn(BOT);
}
function endTurn(lastPlayer) {
    checkForWin();

    if (lastPlayer == USER)
        botAI();
        // botPlay(getAvailablePos());
}

function botAI() {
    let availableMoves = [];
    for (let i = 0, j=0; i < 9; i++){
        if (canPlayAt(i)) {
            if (willWinIfPlayAt(i, BOT)) {
                console.log('bot will win if it plays at ' + i);
                botPlay(i);
                return;
            }
            if (willWinIfPlayAt(i, USER)) {
                console.log('user will win if it plays at ' + i);
                botPlay(i);
                return;
            }
            availableMoves[j++] = i;
        }
    }
    
    botPlay(availableMoves[Math.floor(Math.random() * availableMoves.length)]);
}
// returns if the specified player will win after playing at a specified position
function willWinIfPlayAt(i, player) {
    let symbol = (player == USER) ? X : CIRCLE;
    
    if (table[clampToTableVert(i - 3)].getAttribute('src') ==
        table[clampToTableVert(i + 3)].getAttribute('src') == symbol)
        return true;
    
    switch (i) {
        case (i >= 0 && i <= 2):
            if (table[clampToTableHor(i - 1, 0, 2)].getAttribute('src') ==
                table[clampToTableHor(i + 1, 0, 2)].getAttribute('src') == symbol)
                return true;
            break;
        case (i >= 3 && i <= 5):
            if (table[clampToTableHor(i - 1, 3, 5)].getAttribute('src') ==
                table[clampToTableHor(i + 1, 3, 5)].getAttribute('src') == symbol)
                return true;
            break;
        case (i >= 6 && i <= 8):
            if (table[clampToTableHor(i - 1, 6, 8)].getAttribute('src') ==
                table[clampToTableHor(i + 1, 6, 8)].getAttribute('src') == symbol)
                return true;
            break;
    }
    
    if (i == 0 && (table[4].getAttribute('src') == table[8].getAttribute('src') == symbol))
        return true;
    if (i == 2 && (table[4].getAttribute('src') == table[6].getAttribute('src') == symbol))
        return true;
    if (i == 4 && (table[0].getAttribute('src') == table[8].getAttribute('src') == symbol))
        return true;
    if (i == 4 && (table[2].getAttribute('src') == table[6].getAttribute('src') == symbol))
        return true;
    if (i == 6 && (table[4].getAttribute('src') == table[2].getAttribute('src') == symbol))
        return true;
    if (i == 8 && (table[4].getAttribute('src') == table[0].getAttribute('src') == symbol))
        return true;
    
    return false;
}

function checkForWin() {
    if (getAvailablePos() == -1)
        endGame(DRAW);
    else if (checkForUserWin())
        endGame(USER);
    else if (checkForBotWin())
        endGame(BOT);
}
function checkForUserWin() {
    if (getSymbolAt(0) == X && getSymbolAt(1) == X && getSymbolAt(2) == X)
        return true;
    else if (getSymbolAt(3) == X && getSymbolAt(4) == X && getSymbolAt(5) == X)
        return true;
    else if (getSymbolAt(6) == X && getSymbolAt(7) == X && getSymbolAt(8) == X)
        return true;
    else if (getSymbolAt(0) == X && getSymbolAt(3) == X && getSymbolAt(6) == X)
        return true;
    else if (getSymbolAt(1) == X && getSymbolAt(4) == X && getSymbolAt(7) == X)
        return true;
    else if (getSymbolAt(2) == X && getSymbolAt(5) == X && getSymbolAt(8) == X)
        return true;
    else if (getSymbolAt(0) == X && getSymbolAt(4) == X && getSymbolAt(8) == X)
        return true;
    else if (getSymbolAt(6) == X && getSymbolAt(4) == X && getSymbolAt(2) == X)
        return true;
    return false;
}
function checkForBotWin() {
    if (getSymbolAt(0) == CIRCLE && getSymbolAt(1) == CIRCLE && getSymbolAt(2) == CIRCLE)
        return true;
    else if (getSymbolAt(3) == CIRCLE && getSymbolAt(4) == CIRCLE && getSymbolAt(5) == CIRCLE)
        return true;
    else if (getSymbolAt(6) == CIRCLE && getSymbolAt(7) == CIRCLE && getSymbolAt(8) == CIRCLE)
        return true;
    else if (getSymbolAt(0) == CIRCLE && getSymbolAt(3) == CIRCLE && getSymbolAt(6) == CIRCLE)
        return true;
    else if (getSymbolAt(1) == CIRCLE && getSymbolAt(4) == CIRCLE && getSymbolAt(7) == CIRCLE)
        return true;
    else if (getSymbolAt(2) == CIRCLE && getSymbolAt(5) == CIRCLE && getSymbolAt(8) == CIRCLE)
        return true;
    else if (getSymbolAt(0) == CIRCLE && getSymbolAt(4) == CIRCLE && getSymbolAt(8) == CIRCLE)
        return true;
    else if (getSymbolAt(6) == CIRCLE && getSymbolAt(4) == CIRCLE && getSymbolAt(2) == CIRCLE)
        return true;
    return false;
}

function endGame(winner) {
    switch (winner) {
        case DRAW:
            BODY.style.setProperty('background-color', 'gray');
            WLTEXT.innerHTML = 'DRAW:|';
            WLTEXT.style.setProperty('color', 'black');
            break;
        case USER:
            BODY.style.setProperty('background-color', 'darkgreen');
            WLTEXT.innerHTML = 'You Won:)';
            WLTEXT.style.setProperty('color', 'green');
            break;
        case BOT:
            BODY.style.setProperty('background-color', 'darkred');
            WLTEXT.innerHTML = 'You Lost:(';
            WLTEXT.style.setProperty('color', 'red');
            break;
    }
}
function restartGame() {
    BODY.style.setProperty('background-color', 'gray');
    WLTEXT.innerHTML = '';
    WLTEXT.style.setProperty('color', 'black');
    for (let i = 0; i < 9; i++)
        table[i].setAttribute('src', EMPTY);
    canPlay = true;
}