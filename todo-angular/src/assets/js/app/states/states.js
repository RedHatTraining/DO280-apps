angular.module('todoItemsApp')

    .config(function($stateProvider, $urlRouterProvider){

        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
        $urlRouterProvider

            // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
            // Here we are just setting up some convenience urls.
            .when('/c?id',     '/todoItems/:id')

            // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
            .otherwise('/');

        $stateProvider
            .state('list', {
                url: "/",
                templateUrl: 'assets/partials/list.html',
                controller: 'indexCtl'
            })
            .state('create', {
                url: "/create",
                templateUrl: 'assets/partials/create.html',
                controller: 'addCtl'
            })
            .state('edit', {
                url: "/todoItems/:id",
                templateUrl: 'assets/partials/edit.html',
                controller: 'todoItemCtl'
            })
        ;
    })

    .controller('indexCtl', function($scope, todoItems, $alert) {

        var alert = $alert({
            //title: 'Success!',
            content: 'The todo item was deleted successfully.',
            type: 'success',
            container: '#alertContainer',
            show: false,
            duration: 3,
            animation: "am-flip-x"
        });

        $scope.todoItems = todoItems.get();

        $scope.delete = function(index){
            todoItems.destroy(index);
            alert.show();
        };
    })

    .controller('todoItemCtl', function ($scope, $stateParams, todoItems, focus) {
        $scope.todoItem = todoItems.find($stateParams.id);

        focus('focusMe');
    })

    .controller('addCtl', function ($scope, todoItems, $alert, focus) {

        var alert = $alert({
            //title: 'Success!',
            content: 'The todo item was added successfully.',
            type: 'success',
            container: '#alertContainer',
            show: false,
            duration: 3,
            animation: "am-flip-x"
        });

        focus('focusMe');

        $scope.submit = function(){
            todoItems.set($scope.todoItem);
            $scope.todoItem = null;
            alert.show();
        };

    })
    ;
