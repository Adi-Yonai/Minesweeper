'use strict';
var gGame = {
    ready: true,
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secPassed: 0,
    minPassed: 0,
    hp: 3
};
var gBoard;
var gLevel;
var gGame;
var gLevel= {
    i: 4,
    j: 4,
    Mines: 3
};
var elSec=document.querySelector('.sec');
elSec.innerText='00';
var elMin=document.querySelector('.min');
elMin.innerText='00';
var elButt=document.querySelector('.reset');
var elLife=document.querySelector('.life');
elLife.innerText=`LIFE: ${gGame.hp}`;
var intervalID;

window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    if (!gGame.isOn) return
    if (!e.path[0].id.includes('cell') || e.path[0].classList.contains('clicked')) return;
    if (gGame.ready) {
        intervalID = setInterval(timer, 1000);
        gGame.ready=false
    }
    cellMarked(e.path[0]);
}, false);

function initGame() {
    clearInterval(intervalID);
    gGame.secPassed = 0;
    gGame.minPassed = 0;
    elButt.innerText = '😃';
    elSec.innerText='00';
    elMin.innerText='00';
    gGame.hp=3
    elLife.innerText=`LIFE: ${gGame.hp}`
    gLevel.notMines = gLevel.i * gLevel.j -gLevel.Mines;
    gGame.isOn=true;
    gGame.ready=true;
    gGame.markedCount=0;
    gGame.shownCount=0;
    gBoard = buildBoard();
    //console.table(gBoard);
    renderBoard(gBoard);
}

function buildBoard() {
    var order = new Array(gLevel.i*gLevel.j);
    var board = [];
    order.fill(true, 0, gLevel.Mines);
    order.fill(false, gLevel.Mines);
    order= shuffle(order);
    
    for (var i=0 ; i<gLevel.i ; i++) {
        board[i] = []
        for (var j=0 ; j<gLevel.j ; j++) {
            var filler = {
                isMine: order[i*gLevel.i+j],
                isShown: false,
                isMarked: false
            };
            board[i][j]=filler;
        }
    }
    //console.table(board);
    setMinesNegsCount(board);
    return board;
}

function setMinesNegsCount(board) {
    for (var i=0 ; i<gLevel.i ; i++) {
        for (var j=0 ; j<gLevel.j ; j++) {
            if (!(board[i][j].isMine)) {
                var negCount = 0;
                for (var ii = i-1 ; ii<i+2 ; ii++) {
                    if (ii > -1 && ii < gLevel.i) {
                        for (var jj = j-1 ; jj<j+2 ; jj++) {
                            if (jj > -1 && jj < gLevel.j) {
                                if (board[ii][jj].isMine) negCount++;
                            }
                        }
                    }
                }
                board[i][j].neighNum=negCount;
            }
        }
    }    
    
}

function renderBoard(board) {
    var strHTML = '';
	for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
            strHTML += `\t<td id="cell-${i}-${j}" onclick="cellClicked(this)"`;
            
            
			//strHTML += (board[i][j].isMine) ? ` class="mine" ` :
            //` class="${board[i][j].neighNum}" `
            
			strHTML += '>\n\t</td>\n';
            
			strHTML += '';
		}
		strHTML += '</tr>\n';
	}
    var elBoard = document.querySelector('.game-board');
    elBoard.innerHTML = strHTML;
}

function cellClicked(elCell) {
    var idStr =  getCellCoord(elCell.id);
    if (gGame.ready) {
        if (gBoard[idStr.i][idStr.j].isMine) {
            console.log(':)')
            gBoard = buildBoard();
            elCell=renderCell(idStr.i, idStr.j);
            cellClicked(elCell);
            return
        }
        intervalID = setInterval(timer, 1000);
        gGame.ready=false
    }
    if (!gGame.isOn) return;
    if (elCell.classList.contains('flag')) return;
    //console.log(elCell);
    if (gBoard[idStr.i][idStr.j].isMine) {
        elCell.classList.add('clicked');
        elCell.innerText = '💣'
        gGame.hp--;
        elLife.innerText=`LIFE: ${gGame.hp}`;
        gGame.markedCount++;
        if (gGame.hp<=0) checkGameOver();
        elCell.classList.add('deadCell');
        //console.log(elCell.classList);
    } else {
        //console.log(idStr);
        expandShown(gBoard, idStr.i, idStr.j);
    }
}

function lose() {
    gGame.isOn=false;
    
}

function cellMarked(elCell) {
    elCell.classList.toggle('flag');
    //console.dir(elCell);
    var cell = getCellCoord(elCell.id);
    gBoard[cell.i][cell.j].isMarked = !gBoard[cell.i][cell.j].isMarked;
    //console.log(gBoard[cell.i][cell.j].isMarked);
    if (gBoard[cell.i][cell.j].isMarked) {
        gGame.markedCount++;
        checkGameOver();
    } else gGame.markedCount--;
    if (gBoard[cell.i][cell.j].isMarked) {
        elCell.innerText= '🚩';
    } else elCell.innerText= '';
    
}

function checkGameOver() {
    if (gGame.hp<=0) {
        clearInterval(intervalID);
        gGame.isOn=false;
        gGame.ready=true;
        elButt.innerText = '🤯';
        console.log('You lose');
        return
    } 
    if (gGame.markedCount === gLevel.Mines && gGame.shownCount === gLevel.notMines) {
        clearInterval(intervalID);
        gGame.isOn=false;
        gGame.ready=true;
        elButt.innerText = '😎';
        console.log('You win');
    }

}

function expandShown(board, i, j) {
    if (!(board[i][j].isMine) && !(board[i][j].isShown)) {
        board[i][j].isShown=true;
        gGame.shownCount++;
        checkGameOver();
        var elCell=renderCell(i, j);
        elCell.classList.add('clicked');
        if (board[i][j].neighNum) elCell.innerText = `${board[i][j].neighNum}`;
        if (!board[i][j].neighNum) {
            for (var ii = i-1 ; ii<i+2 ; ii++) {
                if (ii > -1 && ii < gLevel.i) {
                    for (var jj = j-1 ; jj<j+2 ; jj++) {
                        if (jj > -1 && jj < gLevel.j) expandShown(board, ii, jj);
                    }
                }
            }
        }
    }
}

function diffChange(elCell) {
    if (elCell.innerText.includes('Easy')) {
        gLevel.i = gLevel.j = 4;
        gLevel.Mines = 2
    }
    if (elCell.innerText.includes('Intermediate')) {
        gLevel.i = gLevel.j = 8;
        gLevel.Mines = 12
    }
    if (elCell.innerText.includes('Hard')) {
        gLevel.i = gLevel.j = 12;
        gLevel.Mines = 30
    }
    if (elCell.innerText.includes('Custom')) { 
        gLevel.i = +prompt('Number of columns');
        gLevel.j = +prompt('Number of rows');
        gLevel.Mines = +prompt('Number of mines');
    }
    initGame();
}