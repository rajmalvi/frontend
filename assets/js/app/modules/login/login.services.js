app.factory('LoginServices', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {

        var ob = {};

        // do login 
        ob.doLogin = function (details, callback) {
            var url = $rootScope.backend + '/login/doLogin';
            var data = $('#login_form').serialize();
            $http.post(url, data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function (response) {
                callback(response);
            });
        };


        return ob;
    }]);