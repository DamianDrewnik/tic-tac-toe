let originalBoard;
const humanPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame(){
    document.querySelector(".endgame").style.display = "none"; //Hide summary
    originalBoard = Array.from(Array(9).keys()); //Create new array from 0 to 8
    for (let i = 0; i < cells.length; i++){ //Clear the board
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color'); //Remove highlight of the winner combo
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square){ //Runs when human player clicks the target
    if (typeof originalBoard[square.target.id] == 'number') { //If no one has played in a clicked spot
        
    turn(square.target.id, humanPlayer) //Human Player Plays
    if (!checkWin(originalBoard, humanPlayer) && !checkTie()) turn(bestSpot(), aiPlayer) //Computer Player Plays
 
}
}

function turn (squareId, player) { //Runs when turn is made (By either human or AI)
    originalBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(originalBoard, player); 
    if (gameWon) gameOver(gameWon); 
}

function checkWin(board, player){
    let plays = board.reduce((a, e, i) =>(e===player) ? a.concat(i) : a, []); //Finds every index that player has played in
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) { //winCombos.entries() is the way to get both index and win variables
        if (win.every(elem => plays.indexOf(elem)>-1)){   //For every win, checks if player played on all the spots that contribute to the winning combo
            gameWon = {index: index, player: player};
            break;
        } 
    }
return gameWon;
}

function gameOver(gameWon){
    for(let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = gameWon.player == humanPlayer ? "blue" : "red";
    }
    for(let i = 0; i < cells.length; i++){
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == humanPlayer ? "You win!" : "You lose.")
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "flex";
    document.querySelector(".endgame .text").innerText = who;

}

function emptySquares(){
    return originalBoard.filter(n => typeof n === 'number');
}

function randomSpot() { 
    return emptySquares()[0]; //Find first playable field and play here (Random AI)
}

function bestSpot(){
    return minimax(originalBoard, aiPlayer).index;
}

function checkTie(){
    if (emptySquares().length == 0){

        for (let i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor = 'green';
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!")
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, humanPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}