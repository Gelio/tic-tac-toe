(function() {
    var app = angular.module("ticTacToe", ["ngAnimate"]);

    app.controller("GameCtrl", ["$scope", function($scope) {
        $scope.playerSign = 1;  // 1 for X, -1 for O
        $scope.board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        $scope.highlighted = [
            [false, false, false],
            [false, false, false],
            [false, false, false]
        ];

        $scope.changeSign = function(newSign) {
            $scope.playerSign = newSign;
        };

        $scope.playTile = function(row, column) {
            console.log("playing", row, column);

            switch($scope.board[row][column]) {
                case -1:
                    $scope.board[row][column] = 0;
                    break;

                case 0:
                    $scope.board[row][column] = 1;
                    break;

                case 1:
                    $scope.board[row][column] = -1;
                    break;

                default:
                    console.log("error, unknown value in board at row " + row + " and column " + column, $scope.board);
                    break;
            }

            $scope.highlighted[row][column] = !$scope.highlighted[row][column];
        };
    }]);
})();