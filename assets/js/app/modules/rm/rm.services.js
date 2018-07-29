app.factory('RMServices', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {

      var ob = {};
      
      ob.postClient = function (callback) {
	var url = $rootScope.backend2 + '/clients/postData';
	var data = $('#client_form').serialize();
         $http.post(url, data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function (response) {
                callback(response);
            });
	};
     
       ob.getClientDetails = function(id,callback){
           var url = $rootScope.backend2 + '/clients/getClientDetails/?client_id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       ob.deleteClient = function(id,callback){
           var url = $rootScope.backend2 + '/clients/deleteClient/?client_id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       return ob;
    }]);