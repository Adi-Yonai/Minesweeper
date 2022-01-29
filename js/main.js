'use strict';
var gGame = {
    ready: true,
    isOn: false,
    shownCount: 0,
    leftCount: 0,
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
    Mines: 3,
    diff: 'Easy',
    isManual: false
};
var record = {
    EasyMin: 0,
    EasySec: 0,
    IntermediateMin: 0,
    IntermediateSec: 0,
    HardMin: 0,
    HardSec: 0
};
var elSec=document.querySelector('.sec');
elSec.innerText='00';
var elMin=document.querySelector('.min');
elMin.innerText='00';
var elButt=document.querySelector('.reset');
var elLife=document.querySelector('.life');
elLife.innerText=`LIFE: ${gGame.hp}`;
var intervalID;
var elDiff = document.querySelector('.diffButt');
elDiff.classList.add('currDiff');
var elMines = document.querySelector('.mines');
var elModal = document.querySelector(".modal");
var elModalButt = document.querySelector(".modalButt");
var elRec = document.getElementById('recordModal')
var elRecButt = document.querySelector(".recordButt");
var elEasy = document.getElementById('Easy');
var elInter = document.getElementById('Intermediate');
var elHard = document.getElementById('Hard');
var manCount = 0;

if (localStorage.Easy==null || localStorage.Easy == Infinity) localStorage.Easy = Infinity;
else{
    var timeSTR = 'Easy: '
    if (Math.floor(localStorage.Easy/60)<10) {
        timeSTR += `0${Math.floor(localStorage.Easy/60)}:`;
      } else timeSTR += `${Math.floor(localStorage.Easy/60)}:`;
    if (localStorage.Easy%60<10) {
        timeSTR += `0${localStorage.Easy%60}`;
      } else timeSTR += `${localStorage.Easy%60}`;
      elEasy.innerText = timeSTR
}
if (localStorage.Intermediate==null || localStorage.Intermediate == Infinity) localStorage.Intermediate = Infinity;
 else{
    var timeSTR = 'Intermediate: '
    if (Math.floor(localStorage.Intermediate/60)<10) {
        timeSTR += `0${Math.floor(localStorage.Intermediate/60)}:`;
      } else timeSTR += `${Math.floor(localStorage.Intermediate/60)}:`;
    if (localStorage.Intermediate%60<10) {
        timeSTR += `0${localStorage.Intermediate%60}`;
      } else timeSTR += `${localStorage.Intermediate%60}`;
      elInter.innerText = timeSTR
}
if (localStorage.Hard==null || localStorage.Hard == Infinity) localStorage.Hard = Infinity;
else{
    var timeSTR = 'Hard: '
    if (Math.floor(localStorage.Hard/60)<10) {
        timeSTR += `0${Math.floor(localStorage.Hard/60)}:`;
      } else timeSTR += `${Math.floor(localStorage.Hard/60)}:`;
    if (localStorage.Hard%60<10) {
        timeSTR += `0${localStorage.Hard%60}`;
      } else timeSTR += `${localStorage.Hard%60}`;
      elHard.innerText = timeSTR
}

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
    gGame.hp=3;
    elLife.innerText=`LIFE: ${gGame.hp}`;
    gLevel.notMines = gLevel.i * gLevel.j -gLevel.Mines;
    elDiff = document.querySelector('.currDiff');
    gGame.isOn=true;
    gGame.ready=true;
    gGame.leftCount=gLevel.Mines;
    elMines.innerText = `Mines: ${gGame.leftCount}`;
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
            
			strHTML += '>\n\t</td>\n';            
		}
		strHTML += '</tr>\n';
	}
    var elBoard = document.querySelector('.game-board');
    elBoard.innerHTML = strHTML;
}

function cellClicked(elCell) {
    var idStr =  getCellCoord(elCell.id);
    if (gLevel.isManual) {
        if (manCount>0) {
            if (gBoard[idStr.i][idStr.j].isMine == false){
                gBoard[idStr.i][idStr.j].isMine = true;
                manCount--;
                elCell.classList.add('manCell');
                setTimeout(function () { elCell.classList.remove('manCell')}, 1000)
            }
            return;
        } else {
            gLevel.isManual = false;
            setMinesNegsCount(gBoard);
        }
    }
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
        elCell.innerText = '💣';
        gGame.hp--;
        elLife.innerText=`LIFE: ${gGame.hp}`;
        gGame.leftCount--;
        elMines.innerText = `Mines: ${gGame.leftCount}`;
        if (gGame.hp<=0) checkGameOver();
        elCell.classList.add('deadCell');
        //console.log(elCell.classList);
    } else {
        //console.log(idStr);
        expandShown(gBoard, idStr.i, idStr.j);
    }
}

function cellMarked(elCell) {
    elCell.classList.toggle('flag');
    //console.dir(elCell);
    var cell = getCellCoord(elCell.id);
    gBoard[cell.i][cell.j].isMarked = !gBoard[cell.i][cell.j].isMarked;
    //console.log(gBoard[cell.i][cell.j].isMarked);
    if (gBoard[cell.i][cell.j].isMarked) {
        gGame.leftCount--;
        elMines.innerText = `Mines: ${gGame.leftCount}`;
        checkGameOver();
        elCell.innerText= '🚩';
    } else {
        gGame.leftCount++;
        elMines.innerText = `Mines: ${gGame.leftCount}`;
        elCell.innerText= '';
    }     
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
    if (gGame.leftCount === 0 && gGame.shownCount === gLevel.notMines) {
        clearInterval(intervalID);
        gGame.isOn=false;
        gGame.ready=true;
        elButt.innerText = '😎';
        console.log('You win');
        Store(gLevel.diff,gGame.minPassed*60+gGame.secPassed);
    }

}

function expandShown(board, i, j) {
    if (!board[i][j].isMine && !board[i][j].isShown && !board[i][j].isMarked) {
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
    elDiff.classList.remove('currDiff');
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
        gLevel.isCustom = false;
    }
    if (elCell.innerText.includes('Custom')) { 
        gLevel.i = +prompt('Number of columns');
        gLevel.j = +prompt('Number of rows');
        gLevel.Mines = +prompt('Number of mines');
    }
    if (gLevel.diff == 'Easy') {
        
    }
    gLevel.diff = elCell.innerText;
    elDiff = elCell;
    elDiff.classList.add('currDiff');
    initGame();
}

function openModal() {
    elModal.style.display = "block";
}

function closeModal() {
    elModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == elModal) {
        elModal.style.display = "none";
    }
    if (event.target == elRec) {
        elRec.style.display = "none";
    }
}

function Store(diff, time) {
    if ( diff == 'Easy' && time < Number(localStorage.Easy)) {
        localStorage.Easy = time;
        elEasy.innerText = `Easy: ${elMin.innerText} : ${elSec.innerText}`
    }
    if ( diff == 'Intermediate' && time < Number(localStorage.Intermediate)) {
        localStorage.Intermediate = time;
        elInter.innerText = `Easy: ${elMin.innerText} : ${elSec.innerText}`
    }
    if ( diff == 'Hard' && time < Number(localStorage.Hard)) {
        localStorage.Hard = time;
        elHard.innerText = `Easy: ${elMin.innerText} : ${elSec.innerText}`
    }
}
function openRecord() {
    elRec.style.display = "block";
}

function closeRec() {
    elRec.style.display = "none";
}

function initManual() {
    gLevel.isManual=true;
    closeModal();
    initGame();
    var board = []; 
    for (var i=0 ; i<gLevel.i ; i++) {
        board[i] = []
        for (var j=0 ; j<gLevel.j ; j++) {
            var filler = {
                isMine: false,
                isShown: false,
                isMarked: false
            };
            board[i][j]=filler;
        }
    }
    setMinesNegsCount(board);
    gBoard = board;
    manCount = gLevel.Mines;
}

function sBoom() {
    closeModal();
    initGame();
    gGame.leftCount = Math.floor((gLevel.i*gLevel.j)/7);
    elMines.innerText = `Mines: ${gGame.leftCount}`;
    gLevel.notMines = gLevel.i * gLevel.j -gLevel.Mines;
    var order = new Array(gLevel.i*gLevel.j);
    var board = [];
    order.fill(false);
    
    for (var i=6 ; i<order.length ; i+=7) {
        order[i] = true;
    }
    
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
    setMinesNegsCount(board);
    gBoard = board;
}