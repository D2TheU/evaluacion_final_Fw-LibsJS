//Animación cambio de color texto
function color(elemento) {
    var velocidad = 800;
    $(elemento).css('color', '#DCFF0E');
    setTimeout(function() {
        $(elemento).css('color', '#fff');
        setTimeout(function() {
            color(elemento, velocidad);
        }, velocidad);
    }, velocidad);
}
//Create random board
function createBoardData() {
    var board = [];
    for (var i = 0; i < 7; i++) {
        var row = [];
        for (var j = 0; j < 7; j++) {
            do {
                var num = Math.floor(Math.random() * 4) + 1;
                var columnRepeat = false;
                if (i > 1) {
                    columnRepeat = board[i - 2][j] == num && board[i - 1][j] == num;
                }
            } while ((row[j - 1] == num && row[j - 2] == num) || columnRepeat);
            row.push(num);
        }
        board.push(row);
    }
    return board;
}

function printBoard(board) {
    console.log(board);
    for (var i = board.length - 1; i > -1; i--) {
        for (var j = 0; j < board[i].length; j++) {
            $('.col-' + (j + 1)).prepend('<img class="candy-img" src="image/' + board[i][j] + '.png" class="dulce" />');
        }
    }
}
//Document.Ready
$(function() {
    var start = false;
    var board;
    color($(".main-titulo"), 500);
    $('.btn-reinicio').on('click', function functionName() {
        if (!start) {
            start = true;
            this.innerHTML = 'Reiniciar';
            board = createBoardData();
            printBoard(board);
        } else {
            start = false;
            this.innerHTML = 'Iniciar';
        }
    });
});
