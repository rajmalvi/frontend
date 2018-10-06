app.factory('HotelsServices', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {

      var ob = {};
      
      ob.postClient = function (data,latitude,longitude,callback) {
	var url = $rootScope.backend2 + '/hotels/hotels/postData/?latitude=' + latitude + '&longitude=' +longitude;
         $http.post(url, data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function (response) {
                callback(response);
            });
	};
        //post competitors data
      ob.hotelCompAdd = function (id,data,callback) {
	var url = $rootScope.backend2 + '/hotels/hotels/hotelCompAdd/?id=' + id;
         $http.post(url, data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function (response) {
                callback(response);
            });
	};
        //post hotel_as_client data
      ob.hotel_as_client = function (id,callback) {
	var url = $rootScope.backend2 + '/hotels/hotels/hotel_as_client/?id=' + id;
         $http.post(url, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function (response) {
                callback(response);
            });
	};
     
       ob.getClientDetails = function(id,callback){
           var url = $rootScope.backend + '/hotels/hotels/getClientDetails/?client_id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       ob.getHotelEditData = function(id,callback){
           var url = $rootScope.backend2 + '/hotels/hotels/getHotelEditData/?id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       
       ob.deleteClient = function(id,callback){
           var url = $rootScope.backend2 + '/hotels/hotels/deleteClient/?client_id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       ob.fetchHotelName = function(id,callback){
           var url = $rootScope.backend2 + '/hotels/hotels/fetchHotelName/?hotel_id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       ob.hotelGroupDetails = function(callback){
           var url = $rootScope.backend2 + '/hotels/hotels/hotelGroupDetails';
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       ob.groupHotelAdd = function(data,id,callback){
           var url = $rootScope.backend2 + '/hotels/hotels/groupHotelAdd/?id='+id;
         $http.post(url, data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function (response) {
                callback(response);
            });
       };
       
       ob.getCountries = function(callback) {
           var url = $rootScope.backend2 + '/hotels/hotels/getCountries';
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       
       ob.importFromCountry = function(country,callback) {
           var url = $rootScope.backend2 + '/hotels/hotels/syncHotels';
            $http.post(url, { country:country }).then(function (response) {
                callback(response);
            });
       };
       return ob;
}]);