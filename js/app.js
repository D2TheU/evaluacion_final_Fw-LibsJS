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
    var boardWidth = $('[class*="col-"]').length;
    for (var i = 0; i < boardWidth; i++) {
        var row = [];
        for (var j = 0; j < boardWidth; j++) {
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
            $(this).attr('data-x', $(this)[0].getBoundingClientRect().left);
            $(this).attr('data-y', $(this)[0].getBoundingClientRect().top);
            $('img').css("z-index", "auto");
            $(this).css("z-index", "2");
        },
        revert: function(event, ui) {
            $(this).data("uiDraggable").originalPosition = {
                top: 0,
                left: 0
            };
            return !event;
        },
        revertDuration: 200
    });
    $(candy).droppable({
        drop: function(event, ui) {
            disableDrag();
            $(this).attr('data-x', $(this)[0].getBoundingClientRect().left);
            $(this).attr('data-y', $(this)[0].getBoundingClientRect().top);
            var candyMoved = [
                parseInt(ui.draggable.attr("class")[0]),
                parseInt(ui.draggable.attr("class")[2])
            ];
            var candyDrop = [
                parseInt($(this).attr("class")[0]),
                parseInt($(this).attr("class")[2])
            ];
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
                }, 200, function() {
                    enableDrag();
                });
            }
        }
    });
    candy.removeClass((i + 1) + '-' + (j + 1));
    candy[0].className = ((i + 1) + '-' + (j + 1)) + ' ' + candy[0].className;
}

function swapCandy(candyMoved, candyDrop, side) {
    addMovement();
    var candy1 = $('.' + candyMoved[0] + '-' + candyMoved[1]);
    var candy2 = $('.' + candyDrop[0] + '-' + candyDrop[1]);
    var difX = parseInt($('.' + candyDrop[0] + '-' + candyDrop[1]).attr("data-x") - $('.' + candyMoved[0] + '-' + candyMoved[1]).attr("data-x"));
    var difY = parseInt($('.' + candyDrop[0] + '-' + candyDrop[1]).attr("data-y") - $('.' + candyMoved[0] + '-' + candyMoved[1]).attr("data-y"));
    switch (side) {
        case "left":
        case "right":
            if (candyMoved[0] < $('[class*="col-"]').length) {
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
        left: "-=" + difX,
        top: "-=" + difY
    }, 0, function() {
        $(this).animate({
            left: 0,
            top: 0
        }, 200);
    });
    candy2.animate({
        left: 0 + difX,
        top: 0 + difY
    }, 0, function() {
        $(this).animate({
            left: 0,
            top: 0
        }, 200, function() {
            checkBoard(1);
        });
    });

    candy1.removeClass(candyMoved[0] + '-' + candyMoved[1]);
    candy2.removeClass(candyDrop[0] + '-' + candyDrop[1]);
    candy1[0].className = candyDrop[0] + '-' + candyDrop[1] + ' ' + candy1[0].className;
    candy2[0].className = candyMoved[0] + '-' + candyMoved[1] + ' ' + candy2[0].className;
}

function checkBoard(mult) {
    disableDrag();
    var complete = [];
    var boardWidth = $('[class*="col-"]').length;
    for (var col = 1; col <= boardWidth; col++) {
        var countColumn = 1,
            countRow = 1,
            imgColumn = 'start',
            imgRow = 'start';
        for (var row = 1; row <= boardWidth; row++) {
            // Check for columnRepeat
            if ($('.' + row + '-' + col).attr('src') == imgColumn) {
                countColumn++;
            } else {
                countColumn = 1;
                imgColumn = $('.' + row + '-' + col).attr('src');
            }
            if (countColumn == 3) {
                complete = addToArray(complete, (row - 2) + '-' + col);
                complete = addToArray(complete, (row - 1) + '-' + col);
                complete = addToArray(complete, row + '-' + col);
            } else if (countColumn > 3) {
                complete = addToArray(complete, row + '-' + col);
            }
            // Check for RowRepeat
            if ($('.' + col + '-' + row).attr('src') == imgRow) {
                countRow++;
            } else {
                countRow = 1;
                imgRow = $('.' + col + '-' + row).attr('src');
            }
            if (countRow == 3) {
                complete = addToArray(complete, col + '-' + (row - 2));
                complete = addToArray(complete, col + '-' + (row - 1));
                complete = addToArray(complete, col + '-' + row);
            } else if (countRow > 3) {
                complete = addToArray(complete, col + '-' + row);
            }
        }
    }
    if (complete.length == 0) {
        enableDrag();
    } else {
        deleteCandy(complete, mult);
    }
}

function deleteCandy(candyArr, mult) {
    var speed = 300;
    for (var i = 0; i < candyArr.length; i++) {
        $('.' + candyArr[i]).animate({
            opacity: 0
        }, speed);
        $('.' + candyArr[i]).animate({
            opacity: 1
        }, speed);
        $('.' + candyArr[i]).animate({
            opacity: 0
        }, speed);
        $('.' + candyArr[i]).animate({
            opacity: 1
        }, speed);
        $('.' + candyArr[i]).animate({
            opacity: 0
        }, speed);
        $('.' + candyArr[i]).animate({
            opacity: 1
        }, speed, function() {
            $(this).remove();
            refillCandy(mult + 1);
        });
        addPoints(10 * (i + 1) * mult);
        console.log('10 * (' + i + ' + 1)' + ' * ' + mult + ' = ' + (10 * (i + 1) * mult));
    }
}

function refillCandy(mult) {
    var boardWidth = $('[class*="col-"]').length;
    for (var col = 1; col <= boardWidth; col++) {
        var childNum = $('.col-' + col)[0].childElementCount;
        if (childNum < boardWidth) {
            for (var i = 1; i <= childNum; i++) {
                var newName = boardWidth + i - childNum;
                var sliceClassName = $('.col-' + col + ' img:nth-child(' + i + ')')[0].className.slice(4)
                $('.col-' + col + ' img:nth-child(' + i + ')')[0].className = (newName + '-' + col) + ' ' + sliceClassName;
            }
            var missing = boardWidth - childNum;
            for (var i = missing; i >= 1; i--) {
                var randomPic = Math.floor(Math.random() * 4) + 1;
                $('.col-' + col).prepend('<img class="candy-img ' + i + '-' + col + '" src="image/' + randomPic + '.png" class="dulce" />');

                var topStart = parseInt($('.' + i + '-' + col).css('height')) * -i;
                animateCandy($('.' + i + '-' + col), topStart, 1, i - 1, col - 1);
                setTimeout(function() {
                    checkBoard(mult);
                }, 1000);
            }
        }
    }
}

function addMovement() {
    $('#movimientos-text').text(parseInt($('#movimientos-text').text()) + 1);
}

function addPoints(value) {
    $('#score-text').text(parseInt($('#score-text').text()) + value);
}

function addToArray(arr, term) {
    if (arr.indexOf(term) == -1) {
        arr.push(term);
    }
    return arr;
}

function enableDrag() {
    if ($('img[class*="candy-img"]').draggable('option', 'disabled')) {
        console.log("enable");
        $('img[class*="candy-img"]').draggable("enable");
    }
}

function disableDrag() {
    if (!$('img[class*="candy-img"]').draggable('option', 'disabled')) {
        console.log('disable');
        $('img[class*="candy-img"]').draggable({
            disabled: true
        });
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
            location.reload();
        }
    });
});
