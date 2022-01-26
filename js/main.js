'use strict';
const MINE = '*'

var gBoard;
var gLevel;
var gGame;
var gMineNum = 4;
var iSize= 4;
var jSize= 4;


function initGame() {
    gBoard = buildBoard();
    //console.table(gBoard);
    renderBoard(gBoard);
}

function buildBoard() {
    var order = new Array(iSize**2);
    var board = [];
    order.fill(MINE, 0, gMineNum);
    order.fill('#', gMineNum);
    order= shuffle(order);
    console.log(order)

    for (var i=0 ; i<iSize ; i++) {
        board[i] = []
        for (var j=0 ; j<jSize ; j++) {
            board[i][j] = order[i*iSize+j];
            //console.log(board[i][j])
        }
    }
    return board;
}

function setMinesNegsCount(board) {
    

}

function renderBoard(board) {
    var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			strHTML += `\t<td id="cell-${i}-${j}" onclick="cellClicked(this)"`;


			if (board[i][j] === MINE) strHTML += ' class="mine" ';

			strHTML += '>\n';

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
    var elBoard = document.querySelector('.game-board');
    elBoard.innerHTML = strHTML;
}

function cellClicked(elCell) {
    //console.log(elCell.dataset.j)
    if (elCell.classList.contains('mine')) {
        elCell.classList.add('deadCell');
        //console.log(elCell.classList);
    } else {
        var idStr =  getCellCoord(elCell.id)
        console.log(idStr)
        //expandShown(gBoard, elCell, idStr.i, idStr.j)
    }
}

function cellMarked(elCell) {

}

function checkGameOver() {

}

function expandShown(board, elCell, i, j) {
    for (var ii = i-1 ; ii<i+2 ; ii++) {
        for (var jj = j-1 ; jj<j+2 ; j++) {
            if (elCell.classList.contains('mine')) continue
            else {
                var elCell2 = document.querySelector(`#cell-${ii}-${jj}`)
            }
        }
    }
}
