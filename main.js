(function() {
    // Processing winning positions from just numbers to row/column format
    var winningPositions = [];
    winningPositionsArray.forEach(function(winningSet) {
        var output = [];
        winningSet.forEach(function(position) {
            output.push([
                Math.floor(position/3),
                position%3
            ]);
        });
        winningPositions.push(output);
    });


    var app = angular.module("ticTacToe", ["ngAnimate"]);

    app.controller("GameCtrl", ["$scope", "$timeout", function($scope, $timeout) {
        $scope.playerSign = 1;  // 1 for X, -1 for O
        var computerSign = -1;
        $scope.board = [];
        $scope.highlighted = [];

        function newGame() {
            $scope.highlighted = [
                [false, false, false],
                [false, false, false],
                [false, false, false]
            ];

            $scope.board = [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ];

            if($scope.playerSign == -1) {
                computerMove();
            }
        }

        function computerMove() {
            var available = [];
            $scope.board.forEach(function(row, rowIndex) {
                row.forEach(function(tile, tileIndex) {
                    if(tile === 0) {
                        available.push([rowIndex, tileIndex]);
                    }
                });
            });

            var randomed = Math.floor(Math.random()*available.length);
            $scope.board[available[randomed][0]][available[randomed][1]] = computerSign;

            checkWinningCondition();
        }

        function highlightTiles(tileSet, highlight) {
            if(highlight === undefined)
                highlight = true;

            tileSet.forEach(function(tile) {
                $scope.highlighted[tile[0]][tile[1]] = highlight;
            });
        }

        function checkWinningCondition() {
            winningPositions.forEach(function(winningSet) {
                var sum = 0;
                //console.log(winningSet);
                winningSet.forEach(function(tile) {
                    //console.log(tile);
                    sum += $scope.board[tile[0]][tile[1]];
                });

                if(sum == -3) {
                    // O wins
                    highlightTiles(winningSet);
                    $timeout(newGame, 2000);
                }
                else if(sum == 3) {
                    // X wins
                    highlightTiles(winningSet);
                    $timeout(newGame, 2000);
                }
            });
        }


        newGame();

        $scope.changeSign = function(newSign) {
            $scope.playerSign = newSign;
            if(newSign == 1)
                computerSign = -1;
            else
                computerSign = 1;

            newGame();
        };

        $scope.playTile = function(row, column) {
            if($scope.board[row][column] !== 0) {
                $scope.highlighted[row][column] = true;
                $timeout(function() {
                    $scope.highlighted[row][column] = false;
                }, 300);
                return;
            }

            $scope.board[row][column] = $scope.playerSign;
            checkWinningCondition();
            computerMove();
        };
    }]);
})();