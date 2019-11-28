angular.module('todoItemsApp')

    .directive('editable', function(){
        return {
            restrict: 'AE',
            templateUrl: '/assets/partials/editable.html',
            scope: {
                value: '=editable',
                field: '@fieldType'
            },
            controller: function($scope){

                // create a new model to edit, and something for ng-show/ng-hide to watch
                $scope.editor = {
                    showing: false,
                    value: $scope.value
                };

                $scope.toggleEditor = function(){
                    $scope.editor.showing = !$scope.editor.showing;
                };

                $scope.field = ($scope.field) ? $scope.field : 'text';

                $scope.save = function(){
                    $scope.value = $scope.editor.value;
                    $scope.toggleEditor();
                };
            }


        };
    })


;
