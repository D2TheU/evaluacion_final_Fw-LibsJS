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
            $('.col-' + (j + 1))[0].innerHTML = '';
        }
        board.push(row);
    }
    return board;
}

function printBoard(board) {
    for (var i = board.length - 1; i > -1; i--) {
        for (var j = 0; j < board[i].length; j++) {
            $('.col-' + (j + 1)).prepend('<img class="candy-img ' + (i + 1) + '-' + (j + 1) + '" src="image/' + board[i][j] + '.png" class="dulce" />');
            var topStart = parseInt($('.' + (i + 1) + '-' + (j + 1)).css('height')) * -(i + 1);
            animateCandy($('.' + (i + 1) + '-' + (j + 1)), topStart, board.length - i, i, j);
        }
    }
}

function animateCandy(candy, topStart, num, i, j) {
    $(candy).css('opacity', '0');
    var self = this;
    candy.animate({
        'top': topStart + 'px',
        'opacity': 0
    }, 75 * num, function() {
        $(this).animate({
            'top': 0,
            'opacity': 1
        }, 500)
    });
    $(candy).draggable({
        start: function() {
            $('img').css("z-index", "auto");
            $(this).css("z-index", "2");
        },
        revert: function(event, ui) {
            $(this).data("uiDraggable").originalPosition = {
                top: 0,
                left: 0
            };
            return !event;
        }
    })
    $(candy).droppable({
        drop: function(event, ui) {
            // console.log(ui.draggable.attr("class"));
            var candyMoved = [
                parseInt(ui.draggable.attr("class")[0]),
                parseInt(ui.draggable.attr("class")[2])
            ];
            var candyDrop = [
                parseInt($(this).attr("class")[0]),
                parseInt($(this).attr("class")[2])
            ];
            // console.log(candyMoved);
            // console.log(candyDrop);
            var moveTo = [candyDrop[1] - candyMoved[1], candyDrop[0] - candyMoved[0]];
            if (moveTo[0] == -1 && moveTo[1] == 0) {
                swapCandy(candyMoved, candyDrop, "left");
            } else if (moveTo[0] == 1 && moveTo[1] == 0) {
                swapCandy(candyMoved, candyDrop, "right");
            } else if (moveTo[0] == 0 && moveTo[1] == -1) {
                swapCandy(candyMoved, candyDrop, "top");
            } else if (moveTo[0] == 0 && moveTo[1] == 1) {
                swapCandy(candyMoved, candyDrop, "bottom");
            } else {
                ui.draggable.animate({
                    top: 0,
                    left: 0
                });
            }
        }
    })
    candy.removeClass((i + 1) + '-' + (j + 1));
    candy[0].className = ((i + 1) + '-' + (j + 1)) + ' ' + candy[0].className;
}

function swapCandy(candyMoved, candyDrop, side) {
    var candy1 = $('.' + candyMoved[0] + '-' + candyMoved[1]);
    var candy2 = $('.' + candyDrop[0] + '-' + candyDrop[1]);
    switch (side) {
        case "left":
        case "right":
            if (candyMoved[0] < 7) {
                candy1.insertBefore($('.' + (candyDrop[0] + 1) + '-' + candyDrop[1]));
                candy2.insertBefore($('.' + (candyMoved[0] + 1) + '-' + candyMoved[1]));
            } else {
                candy1.insertAfter($('.' + (candyDrop[0] - 1) + '-' + candyDrop[1]));
                candy2.insertAfter($('.' + (candyMoved[0] - 1) + '-' + candyMoved[1]));
            }
            break;
        case "top":
            candy1.insertBefore(candy2);
            break;
        case "bottom":
            candy1.insertAfter(candy2);
            break;
    }
    candy1.animate({
        top: 0,
        left: 0
    }, 0);
    candy2.animate({
        top: 0,
        left: 0
    }, 0);

    candy1.removeClass(candyMoved[0] + '-' + candyMoved[1]);
    candy2.removeClass(candyDrop[0] + '-' + candyDrop[1]);
    candy1[0].className = candyDrop[0] + '-' + candyDrop[1] + ' ' + candy1[0].className;
    candy2[0].className = candyMoved[0] + '-' + candyMoved[1] + ' ' + candy2[0].className;
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
            location.reload();
        }
    });
});
