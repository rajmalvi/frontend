app.factory('RoomsServices', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {

       var ob = {};
        ob.postRoom = function (data,callback) {
	var url = $rootScope.backend2 + '/setup/room_types/postRoom';
         $http.post(url, data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function (response) {
                callback(response);
            });
	};
     
        ob.postRoomMapping = function (data,callback) {
	var url = $rootScope.backend2 + '/setup/room_types/postRoomMapping';
         $http.post(url, data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function (response) {
                callback(response);
            });
	};
     
       ob.getRoomsDetails = function(id,callback){
           var url = $rootScope.backend2 + '/setup/room_types/getRoomsDetails/?id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       
       ob.editRoom = function(id,callback){
           var url = $rootScope.backend2 + '/setup/room_types/editRole/?id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       ob.editRoomMapping = function(id,callback){
           var url = $rootScope.backend2 + '/setup/room_types/editRoomMapping/?id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       
       ob.deleteRoom = function(id,callback){
           var url = $rootScope.backend2 + '/setup/room_types/deleteRoomMapping/?id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       
        ob.getRoomTypes = function (callback) {
         var url = $rootScope.backend2 + '/setup/room_types/getRoomTypes';
         $http.get(url).then(function (response) {
             callback(response);
         });
        };
     return ob;

    }]);