app.factory('EventsServices', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {

       var ob = {};
       ob.postEvent = function (data, callback) {
            var url = $rootScope.backend2 + '/events/postEvent';
            $http.post(url, data).then(function (response) {
                callback(response);
            });
        };
        ob.getEventDetails = function (id, callback) {
            var url = $rootScope.backend2 + '/events/getEventDetails/?id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
        };
        ob.editEvent = function (id, callback) {
            var url = $rootScope.backend2 + '/events/editEvent/?id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
        };
        ob.deleteEvent = function (id, callback) {
         var url = $rootScope.backend2 + '/events/deleteEvent/?id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
        };

     return ob;

    }]);