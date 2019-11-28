angular.module('todoItemsApp')

    .factory('todoItems', function(jsonFilter){

        function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function randomInNextFortnight() {

            function nn(x) {
                return x<10? "0" + x: "" + x;
            }
            var nextFortnight = Date.now() + randomInt(0, 14) * (24 * 60 * 60 * 1000);
            var d = new Date(nextFortnight);
            var atMidnight = ""+(1900+d.getYear())+"-"+nn(d.getMonth())+"-"+nn(d.getDay());
            return atMidnight;
        }

        var todoItems = [
            {
                description: 'Take OpenShift training',
                category: 'Domestic',
                complete: false,
                dueBy: randomInNextFortnight(),
                cost: null,
                notes: "Take OpenShift DO280 course"
            },
            {
                description: 'Book exam',
                category: 'Domestic',
                complete: false,
                dueBy: randomInNextFortnight(),
                cost: 200,
                notes: null
            },
            {
                description: 'Read James Joyce',
                category: 'Domestic',
                complete: true,
                dueBy: randomInNextFortnight(),
                cost: null,
                notes: null
            },
            {
                description: 'Pick up laundry',
                category: 'Domestic',
                complete: false,
                dueBy: randomInNextFortnight(),
                cost: 7.50,
                notes: null
            },
            {
                description: 'Vacuum house',
                category: 'Domestic',
                complete: false,
                dueBy: randomInNextFortnight(),
                cost: null,
                notes: null
            },
            {
                description: 'Write blog post',
                category: 'Professional',
                complete: true,
                dueBy: randomInNextFortnight(),
                cost: null,
                notes: null
            }
        ];

        console.log(jsonFilter(todoItems));

        return {
            get: function(){
                return todoItems;
            },
            find: function(index){
                return todoItems[index];
            },
            set: function(todoItem){
                todoItems.push(todoItem);
            },
            destroy: function(index){
                todoItems.splice(index, 1);
            }
        };
    })
;
