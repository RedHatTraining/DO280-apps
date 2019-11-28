angular.module('todoItemsApp')

    .filter('truncate', function(){
        return function(input, limit){
            return (input.length > limit) ? input.substr(0, limit)+'…' : input;
        };
    })

    .filter('paragraph', function(){
        return function(input){
            return input.replace(/\n/g, '<br />');
        };
    })

;
