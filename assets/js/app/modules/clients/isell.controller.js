app.controller('IsellController', ['$scope', '$rootScope', '$routeParams', '$window', 'FileUploader', '$compile', 'ClientsServices', '$uibModal', '$http', '$location', '$timeout', '$q', 'session', 'uiGridConstants', function ($scope, $rootScope, $routeParams, $window, FileUploader, $compile, ClientsServices, $uibModal, $http, $location, $timeout, $q, session, uiGridConstants) {

    $scope.loadingClient = true;
    $scope.isell = $scope.otas_rs = $scope.otas_cm = $scope.competitors = [];
    $scope.gridOptions = {};
    $scope.iSell_otaPerformance={};
    $scope.iSell_competitorPricing={};
    $scope.iSell_rates={};

    $scope.renderGrid = function () {

        var data = [];
        var columnDefs = [
            {name: 'date', displayName: 'Date', width: 100, pinnedLeft: true, superCol: 'dateanddow'},
            {name: 'dow', displayName: 'DOW', width: 100, pinnedLeft: true, superCol: 'dateanddow'},
            {name: 'events', displayName: 'Events', width: 150, superCol: 'house_perf', enablePinning: false},
            {name: 'event_type', displayName: 'Event Type', width: 150, superCol: 'house_perf', enablePinning: false},
            {name: 'capacity', displayName: 'Capacity', width: 100, superCol: 'house_perf', enablePinning: false},
            {
                name: 'room_available_to_sell',
                displayName: 'Rooms Available to Sell',
                width: 100,
                superCol: 'house_perf',
                enablePinning: false
            },
            {
                name: 'room_available_to_sell_online',
                displayName: 'Rooms Available to Sell Online',
                width: 100,
                superCol: 'house_perf',
                enablePinning: false
            },
            {name: 'ota_sold', displayName: 'OTA Sold', width: 100, superCol: 'ota_perf', enablePinning: false},
            {
                name: 'pickup_from_lr',
                displayName: 'Pickup from LR',
                width: 100,
                superCol: 'ota_perf',
                enablePinning: false
            },
            {name: 'ota_revenue', displayName: 'OTA Revenue', width: 200, superCol: 'ota_perf', enablePinning: false},
            {name: 'adr_otb', displayName: 'ADR OTB', width: 150, superCol: 'ota_perf', enablePinning: false},
            {
                name: 'rate_cm',
                displayName: 'Rate on Channel Manager',
                width: 150,
                superCol: 'rate',
                enablePinning: false
            },
            {
                name: 'recommended_rate',
                displayName: 'Recommended Rate',
                width: 150,
                superCol: 'rate',
                enablePinning: false
            }
        ];

        angular.forEach($scope.competitors, function (value, key) {
            columnDefs.push({name: 'competitor_' + key, displayName: value, width: 150, superCol: 'competitor'});
        });

        angular.forEach($scope.otas_cm, function (value, key) {
            columnDefs.push({name: 'bob_' + key, displayName: value.name, width: 150, superCol: 'bob'});
        });

        $scope.gridOptions = {
            headerTemplate: 'header-template.html',
            superColDefs: [{
                name: 'dateanddow',
                displayName: 'Date & DOW',
                pinnedLeft: true
            }, {
                name: 'house_perf',
                displayName: 'House Performance',
                enablePinning: false
            }, {
                name: 'ota_perf',
                displayName: 'OTA Performance',
                enablePinning: false
            }, {
                name: 'rate',
                displayName: 'Rate',
                enablePinning: false
            }, {
                name: 'competitor',
                displayName: 'Competitor Pricing',
                enablePinning: false
            }, {
                name: 'bob',
                displayName: 'OTA Business on Books',
                enablePinning: false
            }],
            columnDefs: columnDefs,
            data: $scope.isell
        };

        /*$('.table-isell-containerx table').sticky( {
          cellWidth: 150,
          columnCount: 2
        });*/
    };

    //$scope.gridOptions.data = data;

    ClientsServices.getiSellData(function (response) {
        if (response.data.status) {
            $scope.loadingClient = false;
            $scope.otas_rs = response.data.isell.otas_rs;
            $scope.otas_cm = response.data.isell.otas_cm;
            $scope.isell = response.data.isell.records;
            $scope.competitors = response.data.isell.competitors;
            $scope.client_id = response.data.client_id;
            $scope.renderGrid();
        }
    });

    $scope.downloadiSell = function () {
        window.location = $rootScope.backend2 + '/export/clientiSell/?client_id=' + $rootScope.sessionData.client_id;
    };

    $scope.loadiSellModal = function (recordx, competitors, otas, mode, client_id) {
        if (mode == 'bookings') {
            var size = '';
        }
        else {
            var size = 'lg';
        }
        var modalInstance = $uibModal.open({
            templateUrl: 'partials/clients/modals/clients.isell.html',
            controller: 'ISellDetailsController',
            size: size,
            resolve: {
                record: function () {
                    return recordx;
                },
                competitors: function () {
                    return competitors;
                },
                client_id: function () {
                    return $scope.client_id;
                },
                otas: function () {
                    return otas;
                },
                mode: function () {
                    return mode;
                }
            }
        });

        modalInstance.result.then(function () {
        }, function () {

        });
    };

}]);


//Rate Push
app.controller('ISellDetailsController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'ClientsServices', 'record', 'competitors', 'client_id', 'otas', 'mode', function ($scope, $rootScope, $uibModalInstance, $window, ClientsServices, record, competitors, client_id, otas, mode) {

    $scope.loading = true;
    $scope.mode = mode;
    $scope.record = record;
    $scope.competitors = competitors;
    $scope.otas_cm = otas;
    console.log(record);
    console.log(otas);
    console.log(competitors);
    if (mode == 'competitors') {
        $scope.modal_title = record[0] + ' ' + record[1] + ' / Competitor Pricing';
        ClientsServices.getAllRatesByDate(client_id, record[0], function (response) {
            $scope.loading = false;
            if (response.data.status == true) {
                $scope.records = response.data.records;
            }
        });
    }
    else {
        $scope.loading = false;
        $scope.modal_title = record[0] + ' ' + record[1] + ' / OTA Business on Books';
    }


    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);