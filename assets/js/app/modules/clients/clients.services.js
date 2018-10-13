app.factory('ClientsServices', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {

    var ob = {};

    //Add and edit Client data
    ob.postClient = function (data, callback) {
        var url = $rootScope.backend2 + '/setup/clients/postClientData';
        $http.post(url, data).then(function (response) {
            callback(response);
        });
    };

    //Add and edit Client data
    ob.refreshData = function (data, callback) {
        var url = $rootScope.backend2 + '/clients/refreshData';
        $http.post(url, data).then(function (response) {
            callback(response);
        });
    };

    //Add and edit Client data
    ob.editClient = function (data, callback) {
        var url = $rootScope.backend2 + '/clients/postClientData';
        $http.post(url, data,).then(function (response) {
            callback(response);
        });
    };

    //Add and edit Ota Config data
    ob.postOtaConfig = function (data, id, callback) {
        data.client_id = id;
        var url = $rootScope.backend2 + '/setup/otasetup/postOtaConfig';
        $http.post(url, data).then(function (response) {
            callback(response);
        });
    };

    //Add and edit Room Types data
    ob.postRoomTypes = function (data, id, callback) {
        var url = $rootScope.backend2 + '/room_types/room_types/postRoomTypes/?client_id=' + id;
        $http.post(url, data).then(function (response) {
            callback(response);
        });
    };

    //Add and edit Events data
    ob.postEvent = function (data, id, callback) {
        data.clientId = id;
        var url = $rootScope.backend2 + '/events/postClientEvent';
        $http.post(url, data).then(function (response) {
            callback(response);
        });
    };

    //Add and edit Competitor data
    ob.addCompetitor = function (data, id, callback) {
        var url = $rootScope.backend2 + '/clients/clients/addCompetitor/?id=' + id;
        $http.post(url, data).then(function (response) {
            callback(response);
        });
    };

    ob.addAsCompetitor = function (client_id, hotel_id, callback) {
        var url = $rootScope.backend2 + '/clients/clients/addAsCompetitor';
        $http.post(url, {client_id: client_id, hotel_id: hotel_id}).then(function (response) {
            callback(response);
        });
    };

    //Add and edit Quality Metrics data
    ob.addQualityMat = function (data, id, callback) {
        data.client_id = id;
        var url = $rootScope.backend2 + '/clients/clients/addQualityMat';
        $http.post(url, data).then(function (response) {
            callback(response);
        });
    };

    //Add and edit Season data
    ob.addSeason = function (data, id, callback) {
        data.client_id = id;
        var url = $rootScope.backend2 + '/clients/clients/addSeason';
        $http.post(url, data).then(function (response) {
            callback(response);
        });
    };

    //Add Dow data
    ob.saveDow = function (id, data, callback) {
        data.id = id;
        var url = $rootScope.backend2 + '/clients/clients/saveDow';
        $http.post(url, data).then(function (response) {
            callback(response);
        });
    };

    //Add and edit room type mapping data
    ob.submitRoomTypeMap = function (data, id, callback) {
        var url = $rootScope.backend2 + '/room_types/room_types/submitRoomTypeMap/?id=' + id;
        $http.post(url, data).then(function (response) {
            callback(response);
        });
    };

    //Add and edit ota mapping data
    ob.submitOtaMap = function (data, id, callback) {
        var url = $rootScope.backend2 + '/setup/otasetup/submitOtaMap/?id=' + id;
        $http.post(url, data).then(function (response) {
            callback(response);
        });
    };

    //get client details
    var clientLoad = null;
    ob.getClientDetails = function (id, cache, callback) {
        if (clientLoad !== null) {
            clientLoad.resolve();
        }
        clientLoad = $q.defer();
        var url = $rootScope.backend + '/clients/clients/getClientDetails';
        //var url = 'http://localhost:8181/clientData.json';
        $http.get(url, {params: {clientId: id, cache: cache}, timeout: clientLoad.promise}).then(function (response) {
            clientLoad = null;
            callback(response);
        });

    };

    //get client otaPerformance
    var clientLoad = null;
    ob.getOtaPerformance = function (id, occupancyDate, callback) {
        if (clientLoad !== null) {
            clientLoad.resolve();
        }
        clientLoad = $q.defer();
        var url = $rootScope.backend + '/clients/clients/getOtaPerformance';
        $http.get(url, {params: {clientId: id, occupancyDate: occupancyDate}}).then(function (response) {
            clientLoad = null;
            callback(response);
        });

    };


    //get client details
    var clientLoad2 = null;
    ob.getCompetitorPricingForISell = function (id, occupancyDate, callback) {
        if (clientLoad2 !== null) {
            clientLoad2.resolve();
        }
        clientLoad2 = $q.defer();
        var url = $rootScope.backend + '/clients/clients/getCompetitorPricing';
        $http.get(url, {params: {clientId: id, occupancyDate: occupancyDate}}).then(function (response) {
            clientLoad2 = null;
            callback(response);
        });
    };

    //get client details
    var clientLoad2 = null;
    ob.getRatesForISell = function (id, occupancyDate, callback) {
        if (clientLoad2 !== null) {
            clientLoad2.resolve();
        }
        clientLoad2 = $q.defer();
        var url = $rootScope.backend + '/clients/clients/getRates';
        $http.get(url, {params: {clientId: id, occupancyDate: occupancyDate}}).then(function (response) {
            clientLoad2 = null;
            callback(response);
        });
    };

    //get client details
    var clientLoad2 = null;
    ob.getMinCompetitorPricing = function (id, occupancyDate, callback) {
        if (clientLoad2 !== null) {
            clientLoad2.resolve();
        }
        clientLoad2 = $q.defer();
        var url = $rootScope.backend + '/clients/clients/getMinCompetitorPricing';
        $http.get(url, {params: {clientId: id, occupancyDate: occupancyDate}}).then(function (response) {
            clientLoad2 = null;
            callback(response);
        });
    };

    //get client details
    var clientLoad2 = null;
    ob.getMinCompetitor = function (id, checkinDate, callback) {
        if (clientLoad2 !== null) {
            clientLoad2.resolve();
        }
        clientLoad2 = $q.defer();
        var url = $rootScope.backend + '/clients/clients/getAllCompetitors';
        $http.get(url, {params: {clientId: id, checkinDate: checkinDate}}).then(function (response) {
            clientLoad2 = null;
            callback(response);
        });
    };

//get client details
    var clientLoad2 = null;
    ob.getClientById = function (id, callback) {
        if (clientLoad2 !== null) {
            clientLoad2.resolve();
        }
        clientLoad2 = $q.defer();
        var url = $rootScope.backend + '/clients/clients/getClientById';
        $http.get(url, {params: {clientId: id}}).then(function (response) {
            clientLoad2 = null;
            callback(response);
        });
    };
    //get client details
    var clientLoad2 = null;
    ob.getAllRecommendation = function (id, checkinDate, callback) {
        if (clientLoad2 !== null) {
            clientLoad2.resolve();
        }
        clientLoad2 = $q.defer();
        var url = $rootScope.backend + '/clients/clients/getAllRecommendation';
        $http.get(url, {params: {clientId: id, checkinDate: checkinDate}}).then(function (response) {
            clientLoad2 = null;
            callback(response);
        });
    };

    //get client eit data
    ob.getClientEditData = function (id, callback) {
        var url = $rootScope.backend2 + '/clients/clients/getClientEditData/?client_id=' + id;
        $http.get(url).then(function (response) {
            callback(response);
        });
    };

    // get all hotel details
    ob.getAllHotels = function (callback) {
        var url = $rootScope.backend2 + '/clients/clients/getAllHotels';
        $http.get(url).then(function (response) {
            callback(response);
        });
    };

    //get hotel detail as per id
    ob.getHotelDetails = function (id, callback) {
        var url = $rootScope.backend2 + '/clients/clients/getHotelDetails/?id=' + id;
        $http.get(url).then(function (response) {
            callback(response);
        });
    };

    //get user data as per id
    ob.getUsersAccount = function (id, callback) {
        var url = $rootScope.backend2 + '/clients/clients/getUsersAccount/?id=' + id;
        $http.get(url).then(function (response) {
            callback(response);
        });
    };

    //get OTA data
    ob.getSystemOta = function (callback) {
        var url = $rootScope.backend2 + '/setup/otasetup/getSystemOta';
        $http.get(url).then(function (response) {
            callback(response);
        });
    };

    //get room types data
    ob.getSystemRoomsData = function (callback) {
        var url = $rootScope.backend2 + '/room_types/room_types/getSystemRoomsData';
        $http.get(url).then(function (response) {
            callback(response);
        });
    };

    //get ota data as per id
    ob.fetchAllOta = function (id, callback) {
        var url = $rootScope.backend2 + '/setup/otasetup/fetchAllOta/?id=' + id;
        $http.get(url).then(function (response) {
            callback(response);
        });
    };

    //get room types data as per id
    ob.getRoomTypes = function (id, callback) {
        var url = $rootScope.backend2 + '/room_types/room_types/getRoomTypes/?id=' + id;
        $http.get(url).then(function (response) {
            callback(response);
        });
    };

    //get event data as per id
    ob.getClientEvents = function (id, callback) {
        var url = $rootScope.backend2 + '/events/getClientEvents/?id=' + id;
        $http.get(url).then(function (response) {
            callback(response);
        });
    };


    //get quality metrics data as per id
    ob.getClientQuality = function (id, callback) {
        var url = $rootScope.backend2 + '/clients/clients/getClientQuality/?id=' + id;
        $http.get(url).then(function (response) {
            callback(response);
        });
    };

    //get seson data as per id
    ob.getSeasonsData = function (id, callback) {
        var url = $rootScope.backend2 + '/clients/clients/getSeasonsData/?id=' + id;
        $http.get(url).then(function (response) {
            callback(response);
        });
    };

    //get competitors data as per id
    ob.getCompetitors = function (id, callback) {
        var url = $rootScope.backend2 + '/clients/clients/getCompetitors/?id=' + id;
        $http.get(url).then(function (response) {
            callback(response);
        });
    };

    //delete competitors
    ob.deleteCompetitiors = function (id, callback) {
        var url = $rootScope.backend2 + '/clients/clients/deleteCompetitiors/?id=' + id;
        $http.get(url).then(function (response) {
            callback(response);
        });
    };

    //delete client details
    ob.deleteClient = function (id, callback) {
        var url = $rootScope.backend2 + '/clients/clients/deleteClient/?client_id=' + id;
        $http.get(url).then(function (response) {
            callback(response);
        });
    };

    //delete event data
    ob.deleteEvent = function (id, callback) {
        var url = $rootScope.backend2 + '/events/deleteEvent/?id=' + id;
        $http.get(url).then(function (response) {
            callback(response);
        });
    };

    //delete quality metrics data
    ob.deleteQM = function (id, callback) {
        var url = $rootScope.backend2 + '/clients/clients/deleteQM/?id=' + id;
        $http.get(url).then(function (response) {
            callback(response);
        });
    };

    //delete season data
    ob.deleteSeason = function (id, callback) {
        var url = $rootScope.backend2 + '/clients/clients/deleteSeason/?id=' + id;
        $http.get(url).then(function (response) {
            callback(response);
        });
    };

    //delete ota config data
    ob.deleteOtaConfig = function (id, callback) {
        var url = $rootScope.backend2 + '/setup/otasetup/deleteOtaMap/?id=' + id;
        $http.get(url).then(function (response) {
            callback(response);
        });
    };

    //delete room type data
    ob.deleteRoomType = function (id, callback) {
        var url = $rootScope.backend2 + '/room_types/room_types/deleteRoomMapping/?id=' + id;
        $http.get(url).then(function (response) {
            callback(response);
        });
    };

    //delete user data
    ob.deleteUser = function (id, callback) {
        var url = $rootScope.backend2 + '/clients/deleteClientUser';
        $http.post(url, {id: id}).then(function (response) {
            callback(response);
        });
    };

    //add and edit rate shoppimg data
    ob.editPreSettingData = function (data, id, callback) {
        data.client_id = id;
        var url = $rootScope.backend2 + '/clients/clients/editPreSettingData';
        $http.post(url, data).then(function (response) {
            callback(response);
        });
    };

    //edit channel manager details
    ob.saveChannelManagerSettings = function (data, id, callback) {
        data.client_id = id;
        var url = $rootScope.backend2 + '/clients/clients/saveChannelManagerSettings';
        $http.post(url, data).then(function (response) {
            callback(response);
        });
    };

    //rate type sortable data
    ob.getRateTypesSortable = function (callback) {
        var url = $rootScope.backend2 + '/clients/clients/getRateTypesSortable';
        $http.get(url).then(function (response) {
            callback(response);
        });
    };

    //room type sortable data
    ob.getRoomTypesSortable = function (callback) {
        var url = $rootScope.backend2 + '/clients/clients/getRoomTypesSortable';
        $http.get(url).then(function (response) {
            callback(response);
        });
    };

    //post run rate sho
    ob.postRunRate = function (data, callback) {
        console.log(data);
        var url = $rootScope.backend2 + '/setup/clients/runRateShop';
        $http.post(url, data).then(function (response) {
            callback(response);
        });
    };

    //post run rate sho
    ob.uploadBookingFile = function (callback) {
        var url = $rootScope.backend2 + '/setup/clients/uploadStaah';
        $http.post(url).then(function (response) {
            callback(response);
        });
    };

    //post client room type
    ob.postClientRoomTypes = function (data, callback) {
        var url = $rootScope.backend2 + '/setup/clients/addRoomTypeMapping';
        $http.post(url, data).then(function (response) {
            callback(response);
        });
    };

    //post client room type
    ob.postClientOtaMap = function (data, client_id, callback) {
        data.client_id = client_id;
        var url = $rootScope.backend2 + '/setup/clients/addOtaMapping';
        $http.post(url, data).then(function (response) {
            callback(response);
        });
    };

    //Delete OTA mapping
    ob.deleteOtaMapping = function (id, callback) {
        var url = $rootScope.backend2 + '/clients/clients/deleteOtaMap';
        $http.post(url, {id: id}).then(function (response) {
            callback(response);
        });
    };

    //get channel manager room types
    ob.getChannelManagerRoomTypes = function (id, callback) {
        var url = $rootScope.backend2 + '/clients/clients/getChannelManagerRoomTypes';
        $http.get(url, {params: {client_id: id}}).then(function (response) {
            callback(response);
        });
    };

	//Rate Disparities
    ob.getRateDisparity = function (clientId,room_type, callback) {
        var url = $rootScope.backend + '/clients/analysis/getRateDisparity';
        $http.get(url, {params: {clientId:clientId,roomTypeId: room_type}}).then(function (response) {
            callback(response);
        });
    };
	
    //Competitor Pricing
    ob.getCompetitorPricing1 = function (room_type, callback) {
        var url = $rootScope.backend2 + '/clients/analysis/getCompetitorPricing';
        $http.get(url, {params: {room_type: room_type}}).then(function (response) {
            callback(response);
        });
    };
	
	    //Competitor Pricing
    ob.getCompetitorPricing = function (clientId,room_type, callback) {
        var url = $rootScope.backend + '/clients/analysis/getCompetitorPricing';
        $http.get(url, {params: {clientId:clientId,roomCategoryTypeId: room_type}}).then(function (response) {
            callback(response);
        });
    };

    //Historical Analysis
    ob.getHistoricalCharts1 = function (range, callback) {
        var url = $rootScope.backend2 + '/clients/analysis/getHistoricalAnalysis';
		var startDate= $.trim(range.split("to")[0]);
		var endDate= $.trim(range.split("to")[1]);
        $http.get(url, {params: {range: range}}).then(function (response) {
            callback(response);
        });
    };

    //Historical Analysis
    ob.getHistoricalCharts = function (clientId,range, callback) {
        var url = $rootScope.backend + '/clients/analysis/getHistoricalAnalysis';
		var startDate= $.trim(range.split("to")[0]);
		var endDate= $.trim(range.split("to")[1]);
        $http.get(url, {params: {startDate: startDate,endDate:endDate,clientId:clientId }}).then(function (response) {
            callback(response);
        });
    };
    ob.getPatternCharts = function (range, clientId, callback) {
        var url = $rootScope.backend + '/clients/analysis/getPatternAnalysis';
        $http.get(url, {params: {clientId:clientId ,range: range}}).then(function (response) {
            callback(response);
        });
    };

    ob.getRoomNightsRateBandLY = function (otas, range, callback) {
        var url = $rootScope.backend2 + '/clients/analysis/getRoomNightsRateBandLY';
        $http.get(url, {params: {range: range, otas: otas.join(',')}}).then(function (response) {
            callback(response);
        });
    };

    ob.getRoomNightsRateBandTY = function (otas, range, callback) {
        var url = $rootScope.backend2 + '/clients/analysis/getRoomNightsRateBandTY';
        $http.get(url, {params: {range: range, otas: otas.join(',')}}).then(function (response) {
            callback(response);
        });
    };

    ob.getPaceAnalysis = function (otas, range,clientId ,callback) {
        var url = $rootScope.backend + '/clients/analysis/getPaceAnalysis';
        $http.get(url, {params: {range: range, clientId: clientId, otas: otas.join(',')}}).then(function (response) {
            callback(response);
        });
    };

    ob.getRateBandDOWLY = function (otas, range, callback) {
        var url = $rootScope.backend2 + '/clients/analysis/getRateBandDOWLY';
        $http.get(url, {params: {range: range, otas: otas.join(',')}}).then(function (response) {
            callback(response);
        });
    };

    ob.getRateBandDOWTY = function (otas, range, callback) {
        var url = $rootScope.backend2 + '/clients/analysis/getRateBandDOWTY';
        $http.get(url, {params: {range: range, otas: otas.join(',')}}).then(function (response) {
            callback(response);
        });
    };

    ob.getArrivalvsLOS = function (otas, range,clientId, callback) {
        var url = $rootScope.backend + '/clients/analysis/getArrivalvsLOS';
        $http.get(url, {params: {range: range,clientId: clientId, otas: otas.join(',')}}).then(function (response) {
            callback(response);
        });
    };

    ob.getArrivalvsLOSLY = function (otas, range,clientId, callback) {
        var url = $rootScope.backend + '/clients/analysis/getArrivalvsLOSLY';
        $http.get(url, {params: {range: range,clientId: clientId, otas: otas.join(',')}}).then(function (response) {
            callback(response);
        });
    };

    ob.getRPDvsADR = function (otas, range,clientId, callback) {
        var url = $rootScope.backend + '/clients/analysis/getRPDvsADR';
        $http.get(url, {params: {range: range,clientId: clientId, otas: otas.join(',')}}).then(function (response) {
            callback(response);
        });
    };

    ob.getRPDvsADRLY = function (otas, range,clientId, callback) {
        var url = $rootScope.backend + '/clients/analysis/getRPDvsADRLY';
        $http.get(url, {params: {range: range, clientId: clientId, otas: otas.join(',')}}).then(function (response) {
            callback(response);
        });
    };

    //Rate Pace
    ob.getRatePaceChart1 = function (rt, callback) {
        var url = $rootScope.backend2 + '/clients/analysis/getRatePace';
        $http.get(url, {params: {room_type: rt}}).then(function (response) {
            callback(response);
        });
    };
	
	    //Rate Pace
    ob.getRatePaceChart = function (rt,clientId, callback) {
        var url = $rootScope.backend + '/clients/analysis/getRatePace';
        $http.get(url,  {params: { clientId:clientId,roomTypeId:rt }}).then(function (response) {
            callback(response);
        });
    };

    //iSell
    ob.getiSellData = function (callback) {
        var url = $rootScope.backend2 + '/clients/analysis/getiSell';
        $http.get(url).then(function (response) {
            callback(response);
        });
    };


    //Override rate
    ob.overrideRate = function (data, callback) {
        var url = $rootScope.backend2 + '/clients/overrideRate';
        $http.post(url, data).then(function (response) {
            callback(response);
        });
    };

    //Push rate
    ob.pushRate = function (data, callback) {
        var url = $rootScope.backend2 + '/clients/pushRate';
        $http.post(url, data).then(function (response) {
            callback(response);
        });
    };

    //Push all rates
    ob.pushAllRates = function (data, callback) {
        var url = $rootScope.backend2 + '/clients/pushAllRates';
        $http.post(url, data).then(function (response) {
            callback(response);
        });
    };

    //Rate Changes
    ob.getRateChanges = function (client_id, callback) {
        var url = $rootScope.backend2 + '/clients/getRateChanges';
        $http.get(url, {params: {client_id: client_id}}).then(function (response) {
            callback(response);
        });
    };

    //Rates
    ob.getAllRatesByDate = function (client_id, date, callback) {
        var url = $rootScope.backend2 + '/clients/getAllRatesByDate';
        $http.get(url, {params: {client_id: client_id, date: date}}).then(function (response) {
            callback(response);
        });
    };

    ob.takeover = function (client_id, callback) {
        var url = $rootScope.backend + '/clients/takeOver';
        $http.post(url, {client_id: client_id}).then(function (response) {
            callback(response);
        });
    };

    return ob;

}]);