'use strict';
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    hp: 3
};
var gBoard;
var gLevel;
var gGame;
var gLevel= {
    i: 10,
    j: 10,
    Mines: 30
};


function initGame() {
    gGame.isOn=true;
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
                Marked: false
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


			strHTML += (board[i][j].isMine) ? ` class="mine" ` :
            ` class="${board[i][j].neighNum}" `

			strHTML += '>\n';

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
    var elBoard = document.querySelector('.game-board');
    elBoard.innerHTML = strHTML;
}

function cellClicked(elCell) {
    if (!gGame.isOn) return
    var idStr =  getCellCoord(elCell.id);
    console.log(elCell);
    if (gBoard[idStr.i][idStr.j].isMine) {
        elCell.classList.add('clicked');
        console.log(--gGame.hp);
        if (gGame.hp<=0) lose();
        elCell.classList.add('deadCell');
        console.log(elCell.classList);
    } else {
        //console.log(idStr);
        expandShown(gBoard, idStr.i, idStr.j);
    }
}

function lose() {
    gGame.isOn=false;

}

function cellMarked(elCell) {
    
}

function checkGameOver() {
    
}

function expandShown(board, i, j) {
    if (!(board[i][j].isMine) && !(board[i][j].isShown)) {
        board[i][j].isShown=true
        var elCell=renderCell(i, j);
        elCell.classList.add('clicked');
        elCell.innerText = `${board[i][j].neighNum}`;
        if (!board[i][j].neighNum) {

            for (var ii = i-1 ; ii<i+2 ; ii++) {
                if (ii > -1 && ii < gLevel.i) {
                    for (var jj = j-1 ; jj<j+2 ; jj++) {
                        if (jj > -1 && jj < gLevel.j) expandShown(board, ii, jj)
                    }
                }
            }
        }
    }
}
