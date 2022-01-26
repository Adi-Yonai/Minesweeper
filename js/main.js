'use strict';
const MINE = '*'
var gGame = {
    isSecureContext: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};
var gBoard;
var gLevel;
var gGame;
var gLevel= {
    i: 4,
    j: 4,
    Mines: 4
};


function initGame() {
    gBoard = buildBoard();
    console.table(gBoard);
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
                                if (board[ii][jj]) negCount++;
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
    var idStr =  getCellCoord(elCell.id);
    //console.log(elCell.dataset.j)
    if (elCell.classList.contains('mine')) {
        elCell.classList.add('deadCell');
        //console.log(elCell.classList);
    } else {
        console.log(idStr);

        //expandShown(gBoard, elCell, idStr.i, idStr.j);
    }
}

function cellMarked(elCell) {

}

function checkGameOver() {

}

function expandShown(board, elCell, i, j) {
    if (!(board[i][j] === MINE)) {
        var elCell2 = document.querySelector(`#cell-${i}-${j}`)
        elCell2.classList
        for (var ii = i-1 ; ii<i+2 ; ii++) {
            if (ii > -1 && ii < gLevel.i) {
                for (var jj = j-1 ; jj<j+2 ; jj++) {
                    if (jj > -1 && jj < gLevel.j) {
                        if (board[ii][jj] === MINE) negCount++;
                    }
                }
            }
        }
    }
    for (var ii = i-1 ; ii<i+2 ; ii++) {
        for (var jj = j-1 ; jj<j+2 ; j++) {
            if (elCell.classList.contains('mine')) continue
            else {
                var elCell2 = document.querySelector(`#cell-${ii}-${jj}`)
            }
        }
    }
}
