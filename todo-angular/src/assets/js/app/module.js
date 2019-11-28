angular.module('todoItemsApp', ['ngRoute', 'ngSanitize', 'mgcrea.ngStrap', 'ui.router', 'xeditable'])

    .run([ '$rootScope', '$state', '$stateParams', 'editableOptions',
        function ($rootScope,   $state,   $stateParams, editableOptions) {

        // from angular-ui-router example

        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ui-sref-active="active }"> will set the <li> // to active whenever
        // 'todoItems.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;


        // http://vitalets.github.io/angular-xeditable/#getstarted
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }])

    .controller('appCtl', function($scope, $location) {

        $scope.startSearch = function(){
            $location.path('/');
        };
    });

;
