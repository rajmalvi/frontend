app.factory('OtpServices', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {

       var ob = {};
        ob.postOta = function (data,callback) {
	var url = $rootScope.backend2 + '/setup/otasetup/postOta';
         $http.post(url, data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function (response) {
                callback(response);
            });
	};
        
        ob.postOtaMapping = function (data,callback) {
	var url = $rootScope.backend2 + '/setup/otasetup/postOtaMapping';
         $http.post(url, data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function (response) {
                callback(response);
            });
	};
     
       ob.getOtaDetails = function(id,callback){
           var url = $rootScope.backend + '/setup/otasetup/getOtaDetails/?id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       
       ob.getOtaMappings = function(callback){
           var url = $rootScope.backend + '/setup/otasetup/getOtaMappings';
            $http.get(url).then(function (response) {
                callback(response);
            });
       };

       ob.getOtaMappings_hk = function(callback){
           var url = $rootScope.backend + '/setup/otasetup/getOtaMappings';
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       
       ob.editOta = function(id,callback){
           var url = $rootScope.backend2 + '/setup/otasetup/editOta/?id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       ob.editRoomMapping = function(id,callback){
           var url = $rootScope.backend2 + '/setup/otasetup/editRoomMapping/?id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       
       ob.deleteOta = function(id,callback){
           var url = $rootScope.backend2 + '/setup/otasetup/deleteOta/?id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       ob.deleteOtaMap = function(id,callback){
           var url = $rootScope.backend2 + '/setup/otasetup/deleteOtaMap/?id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
     return ob;

    }]);