(function() {
    var message = angular.module("message", []);

    message.controller("MessageCtrl", ["$scope", "$timeout", function($scope, $timeout) {
        $scope.messageActive = false;
        $scope.messageHighlightClass = "";
        $scope.messageContents = "";
        var timeoutPromise = null;

        $scope.$on("showMessage", function(event, msg) {
            if(timeoutPromise !== null)
                $timeout.cancel(timeoutPromise);

            $scope.messageActive = true;
            $scope.messageHighlightClass = msg.highlightClass;
            $scope.messageContents = msg.contents;
            timeoutPromise = $timeout(function() {
                $scope.messageActive = false;
            }, 2000);
        });
    }]);
})();