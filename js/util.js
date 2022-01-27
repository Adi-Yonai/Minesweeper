function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
      strHTML += '<tr>';
      for (var j = 0; j < mat[0].length; j++) {
        var cell = mat[i][j];
        var className = 'cell cell-' + i + '-' + j;
        strHTML += '<td class="' + className + '">' + cell + '</td>'
      }
      strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
  }
  
  // location such as: {i: 2, j: 7}
  function renderCell(i, j) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`#cell-${i}-${j}`);
    return elCell;
  }

  function getCellCoord(strCellId) {
    var parts = strCellId.split('-')
    var coord = { i: +parts[1], j: +parts[2] };
    return coord;
}

  
  function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function shuffle(items) {
      var shuffArr = new Array(items.length);
    var length = items.length;
    for (i = 0; i <length ; i++) {
      var randIdx = getRandomIntInclusive(0, items.length - 1);
      shuffArr[i] = items[randIdx];
      items.splice(randIdx,1)
    }
    return shuffArr;
  }
  
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function timer() {
    gGame.secPassed++;
    if (gGame.secPassed>=60){
      gGame.secPassed-= 60;
      gGame.minPassed++;
      if (gGame.minPassed<10) {
        elMin.innerText = `0${gGame.minPassed}`;
      } else elMin.innerText = `${gGame.minPassed}`;
    } 
    if (gGame.secPassed<10) {
      elSec.innerText = `0${gGame.secPassed}`;
    } else elSec.innerText =  `${gGame.secPassed}`;
  }