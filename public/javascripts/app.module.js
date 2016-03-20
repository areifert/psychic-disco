angular.module("PsychicDisco", [])
    .factory('ws', WSService)
    .controller('MainController', MainController)
    .controller('NavController', NavController);
