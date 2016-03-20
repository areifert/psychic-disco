var MainController = function($scope, ws) {
    $scope.title = 'psychic-disco';

    $scope.sendTestMsg = function() {
        // TODO
        ws.send({
            type: 'TestMessage',
            data: 'Testing 123'
        });
    };
};
