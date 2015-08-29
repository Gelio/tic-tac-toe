(function() {
    // Processing winning positions from just numbers to row/column format
    var winningPositions = [];
    winningPositionsArray.forEach(function(winningSet) {
        var output = [];
        winningSet.forEach(function(position) {
            output.push(new Tile(position));
        });
        winningPositions.push(output);
    });


    var app = angular.module("ticTacToe", ["ngAnimate"]);

    app.controller("GameCtrl", ["$scope", "$timeout", function($scope, $timeout) {
        $scope.playerSign = 1;  // 1 for X, -1 for O
        var computerSign = -1,
            gameInProgress = false;
        $scope.board = [];
        $scope.highlighted = [];

        function newGame() {
            if(gameInProgress)
                return;

            $scope.highlighted = [
                ["", "", ""],
                ["", "", ""],
                ["", "", ""]
            ];

            $scope.board = [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ];
            gameInProgress = true;

            if(computerSign == 1) {
                computerMove();
            }
        }

        function computerMove() {
            var available = [];
            $scope.board.forEach(function(row, rowIndex) {
                row.forEach(function(tile, tileIndex) {
                    if(tile === 0) {
                        available.push(new Tile(rowIndex, tileIndex));
                    }
                });
            });

            var randomed = Math.floor(Math.random()*available.length);
            $scope.board[available[randomed].row][available[randomed].column] = computerSign;

            checkWinningCondition();
        }

        function highlightTiles(tileSet, highlightClass) {
            if(highlightClass === undefined) {
                console.log("highlight class not set while trying to highlight tiles");
                return;
            }

            tileSet.forEach(function(tile) {
                $scope.highlighted[tile.row][tile.column] = highlightClass;
            });
        }

        function checkWinningCondition() {
            winningPositions.forEach(function(winningSet) {
                if(!gameInProgress) // if game is already finished do not check anything
                    return;

                var sum = 0;

                winningSet.forEach(function(tile) {
                    sum += $scope.board[tile.row][tile.column];
                });

                if(sum == -3 || sum == 3) {
                    if(sum == 3*$scope.playerSign)      // player wins
                        highlightTiles(winningSet, "win");
                    else                                // player loses
                        highlightTiles(winningSet, "lose");

                    gameInProgress = false;
                    $timeout(newGame, 2000);
                }
            });

            if(gameInProgress) {
                // check for draw
                var blankTiles = 0;
                $scope.board.forEach(function(row) {
                    row.forEach(function(tile) {
                        if(tile === 0)
                            ++blankTiles;
                    })
                });

                if(blankTiles === 0) {
                    // Draw
                    gameInProgress = false;
                    $timeout(newGame, 2000);
                }
            }
        }

        $scope.changeSign = function(newSign) {
            gameInProgress = false;

            $scope.playerSign = newSign;
            if(newSign == 1)
                computerSign = -1;
            else
                computerSign = 1;

            newGame();
        };

        function failedHighlight(tile, highlightClass) {
            var previousHighlight = $scope.highlighted[tile.row][tile.column];
            $scope.highlighted[tile.row][tile.column] = highlightClass;

            $timeout(function() {
                if($scope.highlighted[tile.row][tile.column] == highlightClass)
                    $scope.highlighted[tile.row][tile.column] = previousHighlight;
            }, 300);
        }

        $scope.playTile = function(row, column) {
            if(!gameInProgress || $scope.board[row][column] !== 0) {
                failedHighlight(new Tile(row, column), "unclickable");
                return;
            }

            $scope.board[row][column] = $scope.playerSign;
            checkWinningCondition();

            if(gameInProgress)
                computerMove();
        };

        newGame();
    }]);
})();