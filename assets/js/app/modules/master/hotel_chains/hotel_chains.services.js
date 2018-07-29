app.factory('HotelChainsServices', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {

      var ob = {};
      
       ob.postHotelChain = function (data,callback) {
	var url = $rootScope.backend2 + '/hotelChains/hotelChains/postHotelChain';
         $http.post(url, data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function (response) {
                callback(response);
            });
	};
     
       ob.getHotelChainDetails = function(id,callback){
           var url = $rootScope.backend2 + '/hotelChains/hotelChains/getHotelChainDetails/?id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       
       ob.editHotelChain = function(id,callback){
           var url = $rootScope.backend2 + '/hotelChains/hotelChains/editHotelChain/?id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
       
       ob.deleteHotelChain = function(id,callback){
           var url = $rootScope.backend2 + '/hotelChains/hotelChains/deleteHotelChain/?id=' + id;
            $http.get(url).then(function (response) {
                callback(response);
            });
       };
     return ob;
       
    }]);