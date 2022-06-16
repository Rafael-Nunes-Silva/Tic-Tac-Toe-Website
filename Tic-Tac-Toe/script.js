const EMPTY = 'Images/Empty.png'
const CIRCLE = 'Images/Circle.png';
const X = 'Images/X.png';

const TIE = 'tie';
const USER = 'user';
const BOT = 'bot';

const BODY = document.getElementById('body');
const WLTEXT = document.getElementById('wlText');

var canPlay = true;

var table = [9];

function setupTable() {
    for (let i = 0; i < 9; i++)
        table[i] = document.getElementById('b' + i);
}
function clampToTableRow(pos, row) {
    switch (row) {
        case 1:
            if (pos < 0)
                return 2;
            else if (pos > 2)
                return 0;
            return 1;
        case 2:
            if (pos < 3)
                return 5;
            else if (pos > 5)
                return 3;
            return 4;
        case 3:
            if (pos < 6)
                return 8;
            else if (pos > 8)
                return 6;
            return 7;
    }
    console.log('column index ' + row + ' not viable');
}
function clampToTableColumn(pos, column) {
    switch (column) {
        case 1:
            if (pos < 0)
                return 6;
            else if (pos > 6)
                return 0;
            return 3;
        case 2:
            if (pos < 1)
                return 7;
            else if (pos > 7)
                return 1;
            return 4;
        case 3:
            if (pos < 2)
                return 8;
            else if (pos > 8)
                return 2;
            return 5;
    }
    console.log('column index ' + column + ' not viable');
}

function playerToSymbol(player) {
    if (player == USER)
        return X;
    if (player == BOT)
        return CIRCLE;
    console.log('can\'t translate ' + player + ' to symbol');
}
function symbolToPlayer(symbol) {
    if (symbol == X)
        return USER;
    if (symbol == CIRCLE)
        return BOT;
    console.log('can\'t translate ' + symbol + ' to user');
}

function hasAvailablePos() {
    for (let i=0; i < 9; i++){
        if (canPlayAt(i))
            return true;
    }
    return false;
}
function getRandomAvailablePos() {
    if (!canPlay)
        return -1;
    
    let positions = [0];
    for (let i=0, j=0; i < 9; i++){
        if (canPlayAt(i))
            positions[j++] = i;
    }

    return positions[Math.floor(Math.random() * positions.length + 1)];
}

function canPlayAt(pos) {
    if (!canPlay)
        return false;
    
    return table[pos].getAttribute('src') == EMPTY;
}
function getSymbolAt(pos) {
    return table[pos].getAttribute('src');
}

function userPlay(pos) {
    if (!canPlay || !canPlayAt(pos))
        return;
    
    table[pos].setAttribute('src', X);

    endTurn(USER);
}
function botPlay(pos) {
    if (!canPlay || !canPlayAt(pos))
        return;
    
    table[pos].setAttribute('src', CIRCLE);

    endTurn(BOT);
}
function endTurn(lastPlayer) {
    checkForWin();

    if (lastPlayer == USER)
        botAI();
    else if (lastPlayer == BOT)
        userAI();
}

function userAI() {
    let availableMoves = [];
    for (let i = 0, j=0; i < 9; i++){
        if (canPlayAt(i)) {
            if (willWinIfPlayAt(USER, i)) {
                
                userPlay(i);
                return;
            }
            if (willWinIfPlayAt(BOT, i)) {
                
                userPlay(i);
                return;
            }
            availableMoves[j++] = i;
        }
    }
    
    userPlay(availableMoves[Math.floor(Math.random() * availableMoves.length)]);
}
function botAI() {
    let availableMoves = [];
    for (let i = 0, j=0; i < 9; i++){
        if (canPlayAt(i)) {
            if (willWinIfPlayAt(BOT, i)) {
                
                botPlay(i);
                return;
            }
            if (willWinIfPlayAt(USER, i)) {
                
                botPlay(i);
                return;
            }
            availableMoves[j++] = i;
        }
    }
    
    botPlay(availableMoves[Math.floor(Math.random() * availableMoves.length)]);
}
function willPlayerCompleteRow(player, pos) {
    let row = 0;
    if (pos == 0 || pos == 1 || pos == 2)
        row = 1
    else if (pos == 3 || pos == 4 || pos == 5)
        row = 2;
    else if (pos == 6 || pos == 7 || pos == 8)
        row = 3;
    if (playerToSymbol(player) == getSymbolAt(clampToTableRow(pos - 1, row)) &&
        playerToSymbol(player) == getSymbolAt(clampToTableRow(pos + 1, row)))
        return true;
    return false;
}
function willPlayerCompleteColumn(player, pos) {
    let column = 0;
    if (pos == 0 || pos == 3 || pos == 6)
        column = 1;
    if (pos == 1 || pos == 4 || pos == 7)
        column = 2;
    else if (pos == 2 || pos == 5 || pos == 8)
        column = 3;
    if (playerToSymbol(player) == getSymbolAt(clampToTableColumn(pos - 1, column)) &&
        playerToSymbol(player) == getSymbolAt(clampToTableColumn(pos + 1, column)))
        return true;
    return false;
}
function willWinIfPlayAt(player, pos) {
    let symbol = playerToSymbol(player);
    if (willPlayerCompleteRow(player, pos))
        return true;
    else if (willPlayerCompleteColumn(player, pos))
        return true;
    else {
        if (pos == 0 && (symbol == getSymbolAt(4) && symbol == getSymbolAt(8)))
            return true;
        if (pos == 2 && (symbol == getSymbolAt(4) && symbol == getSymbolAt(6)))
            return true;
        if (pos == 4 && (symbol == getSymbolAt(0) && symbol == getSymbolAt(8)))
            return true;
        if (pos == 4 && (symbol == getSymbolAt(2) && symbol == getSymbolAt(6)))
            return true;
        if (pos == 6 && (symbol == getSymbolAt(4) && symbol == getSymbolAt(2)))
            return true;
        if (pos == 8 && (symbol == getSymbolAt(4) && symbol == getSymbolAt(0)))
            return true;
    }
    return false;
}

function checkForWin() {
    let winner = EMPTY;
    
    if (getSymbolAt(0) == getSymbolAt(1) && getSymbolAt(0) == getSymbolAt(2))
        winner = getSymbolAt(0);
    else if (getSymbolAt(3) == getSymbolAt(4) && getSymbolAt(3) == getSymbolAt(5))
        winner = getSymbolAt(3);
    else if (getSymbolAt(6) == getSymbolAt(7) && getSymbolAt(6) == getSymbolAt(8))
        winner = getSymbolAt(6);
    else if (getSymbolAt(0) == getSymbolAt(3) && getSymbolAt(0) == getSymbolAt(6))
        winner = getSymbolAt(0);
    else if (getSymbolAt(1) == getSymbolAt(4) && getSymbolAt(1) == getSymbolAt(7))
        winner = getSymbolAt(1);
    else if (getSymbolAt(2) == getSymbolAt(5) && getSymbolAt(2) == getSymbolAt(8))
        winner = getSymbolAt(2);
    else if (getSymbolAt(0) == getSymbolAt(4) && getSymbolAt(0) == getSymbolAt(8))
        winner = getSymbolAt(0);
    else if (getSymbolAt(2) == getSymbolAt(4) && getSymbolAt(2) == getSymbolAt(6))
        winner = getSymbolAt(2);
    
    if (winner == X)
        endGame(USER);
    else if (winner == CIRCLE)
        endGame(BOT);
    else if (!hasAvailablePos())
        endGame(TIE);
}

function endGame(winner) {
    switch (winner) {
        case TIE:
            canPlay = false;
            BODY.style.setProperty('background-color', 'gray');
            WLTEXT.innerHTML = 'TIE :|';
            WLTEXT.style.setProperty('color', 'black');
            break;
        case USER:
            canPlay = false;
            BODY.style.setProperty('background-color', 'darkgreen');
            WLTEXT.innerHTML = 'You Won :)';
            WLTEXT.style.setProperty('color', 'green');
            break;
        case BOT:
            canPlay = false;
            BODY.style.setProperty('background-color', 'darkred');
            WLTEXT.innerHTML = 'You Lost :(';
            WLTEXT.style.setProperty('color', 'red');
            break;
    }
    document.getElementById('restartButton').style.setProperty('display', 'block');
}
function restartGame() {
    BODY.style.setProperty('background-color', 'gray');
    WLTEXT.innerHTML = '';
    WLTEXT.style.setProperty('color', 'black');
    for (let i = 0; i < 9; i++)
        table[i].setAttribute('src', EMPTY);
    canPlay = true;
    document.getElementById('restartButton').style.setProperty('display', 'none');
}