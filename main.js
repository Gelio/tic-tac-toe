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


    var app = angular.module("ticTacToe", ["message", "ngAnimate"]);

    app.controller("GameCtrl", ["$scope", "$rootScope", "$timeout", function($scope, $rootScope, $timeout) {
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
            var moveMade = false,
                winningMoves = [],
                losingMoves = [];
            // Check if win/lose is possible
            winningPositions.forEach(function(winningSet) {
                var setInfo = {
                    value: 0,
                    blankTiles: []
                };

                winningSet.forEach(function(tile) {
                    var currVal = $scope.board[tile.row][tile.column];
                    setInfo.value += currVal;

                    if(currVal === 0)
                        setInfo.blankTiles.push(tile);
                });


                if(setInfo.blankTiles.length == 1) {
                    // see if there's an empty space
                    var targetTile = setInfo.blankTiles[0];
                    if(setInfo.value == 2*$scope.playerSign) {
                        // player would win
                        losingMoves.push(setInfo.blankTiles[0]);
                    }
                    else if(setInfo.value == 2*computerSign) {
                        // computer can win
                        winningMoves.push(setInfo.blankTiles[0]);
                    }
                }
            });
            if(winningMoves.length > 0) {
                // make a winning move
                $scope.board[winningMoves[0].row][winningMoves[0].column] = computerSign;
            }
            else if(losingMoves.length > 0) {
                // prevent player from winning
                $scope.board[losingMoves[0].row][losingMoves[0].column] = computerSign;
            }
            else {
                // Otherwise pick a random tile
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
            }

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
                    {
                        highlightTiles(winningSet, "win");
                        $rootScope.$broadcast("showMessage", {
                            highlightClass: "win",
                            contents: "You win!"
                        });
                    }
                    else                                // player loses
                    {
                        highlightTiles(winningSet, "lose");
                        $rootScope.$broadcast("showMessage", {
                            highlightClass: "lose",
                            contents: "You lose!"
                        });
                    }

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

                    $rootScope.$broadcast("showMessage", {
                        highlightClass: "draw",
                        contents: "Draw!"
                    });
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