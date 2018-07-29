app.factory('RoleServices', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {

      var ob = {};
       ob.postRole = function (data,callback) {
	var url = $rootScope.backend2 + '/roles/roles/postRoles';
         $http.post(url, data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function (response) {
                callback(response);
            });
	};
     
       ob.getRoleDetails = function(id,callback){
           var url = $rootScope.backend2 + '/roles/roles/getRoleDetails/?id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       
       ob.editRole = function(id,callback){
           var url = $rootScope.backend2 + '/roles/roles/editRole/?id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       
       ob.deleteRole = function(id,callback){
           var url = $rootScope.backend2 + '/roles/roles/deleteRole/?id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
     return ob;
       
    }]);