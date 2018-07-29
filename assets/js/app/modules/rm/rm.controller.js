app.controller('RMController', ['$scope', '$rootScope', '$routeParams', '$window', 'FileUploader', '$compile', 'RMServices', '$uibModal', '$http', '$timeout', function ($scope, $rootScope, $routeParams, $window, FileUploader, $compile, ClientsServices, $uibModal, $http, $timeout) {

    $scope.showGrid = false;
    $scope.fetchingRates = false;
    $scope.showForm = true;
    $scope.showSummary = false;
    $scope.queued = false;
    $scope.queueid = $scope.timerem = 0;
    $scope.qEmail = '';
    $scope.updatingQEmail = false;
    
    $scope.rate = {
        country:'',
        state:'',
        city:[],
        dates:'',
        los:1,
        hotels:[],
        otas:[]
    };
    
    $('.drpicker').daterangepicker({
        alwaysShowCalendars: true,
        "ranges": {
            'Next 2 Days': [moment().add(1, 'days'), moment().add(2, 'days')],
            'Next 7 Days': [moment().add(1, 'days'), moment().add(7, 'days')],
            'Next 15 Days': [moment().add(1, 'days'), moment().add(15, 'days')],
            'Next 30 Days': [moment().add(1, 'days'), moment().add(30, 'days')],
            'Next 60 Days': [moment().add(1, 'days'), moment().add(60, 'days')],
            'Next 90 Days': [moment().add(1, 'days'), moment().add(90, 'days')]
            /*'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]*/
        },
        locale: {
            format: 'DD-MM-YYYY'
        },
        separator: ' to '
    }, function(start, end, label) {
        console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
    });
    
    $scope.fetchRates = function() {
        $scope.fetchingRates = true;
        $scope.fetchingFailed = false;
        $http.post('http://revseed.backend.revnomix.com/import/fetchRates',$scope.rate).then(function(response){
            if(response.data.status == true) {
                $scope.showSummary = true;
                $scope.showForm = $scope.fetchingRates = false;
                if(response.data.queueid === undefined) {
                    $scope.queued = false;
                    $scope.loadGrid(response.data);
                }
                else {
                    $scope.queued = true;
                    $scope.queueid = response.data.queueid;
                    $('#countdown').countdown(moment().add(response.data.timerem,'seconds').toDate(),function(event) {
                        $(this).text(
                          event.strftime('%M:%S')
                        );
                    });
                    $timeout(function(){
                        $scope.fetchRates();
                    },response.data.timerem*1000);
                }
            }
            else {
                $scope.fetchingFailed = true;
                $scope.showSummary = true;
                $scope.showForm = $scope.fetchingRates = false;
                $scope.failedMessage = response.data.message;
            }
        });
    };
    
    $scope.createWidget = false;
    $scope.loadGrid = function (data) {
        if($scope.gridSettings !== undefined) {
            var apply = $scope.gridSettings.apply;
        }
        console.log(data);
        // prepare the data
        var source_rates =
                {
                    datatype: "json",
                    datafields: [
                        {name: 'hotel', type: 'string'},
                        {name: 'website', type: 'string'},
                        {name: 'check_in', type: 'string'},
                        {name: 'check_out', type: 'string'},
                        {name: 'date_collected', type: 'string'},
                        {name: 'rate', type: 'string'},
                        {name: 'onsiterate', type: 'string'},
                        {name: 'rate_type', type: 'string'},
                        {name: 'room_type', type: 'string'},
                        {name: 'currency', type: 'string'},
                        {name: 'message', type: 'string'}
                    ],
                    root: "rates",
                    //id: 'id',
                    localdata: data
                    /*beforeprocessing: function (data)
                    {
                        source_rates.totalrecords = data.totalRows;
                    },
                    filter: function ()
                    {
                        // update the grid and send a request to the server.
                        $rootScope.gridSettings.apply('updatebounddata', 'filter');
                    },
                    pager: function (pagenum, pagesize, oldpagenum) {
                    },
                    sort: function () {
                        $rootScope.gridSettings.apply('updatebounddata', 'sort');
                    }*/
                };
        var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
            if (value == 'Block') {
                return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #FF0000;">' + value + '</span>';
            } else if (value == 'Active') {
                return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #008000;">' + value + '</span>';
            } else if (value == 'Pending') {
                return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #FFCC00;">' + value + '</span>';
            }
            return '<div class="jqx-grid-cell-left-align" style="margin-top: 10px;">'+value+'</div>';
        };
        var dataAdapter = new $.jqx.dataAdapter(source_rates, {
            downloadComplete: function (data, status, xhr) {
            },
            loadComplete: function (data) {

            },
            loadError: function (xhr, status, error) {
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('satellizer_token'));
            }
        });

        /*End of main grid*/
        $scope.gridSettings =
                {
                    width: '100%',
                    theme: 'newJqx',
                    source: dataAdapter,
                    pageable: true,
                    autoheight: true,
                    filterable: true,
                    sortable: true,
                    altrows: true,
                    virtualmode: false,
                    rowsheight: 35,
                    filterrowheight: 35,
                    rendergridrows: function (obj)
                    {
                        return obj.data;
                    },
                    enabletooltips: true,
                    showfilterrow: true,
                    selectionmode: 'singlerow',
                    columns: [
                        {text: 'Hotel', datafield: 'hotel', width: '31%'},
                        {text: 'Website/OTA', datafield: 'website', width: '15%'},
                        {text: 'Check In', datafield: 'check_in', width: '10%'},
                        {text: 'Rate', datafield: 'onsiterate', cellsrenderer: cellsrenderer, width: '10%'},
                        {text: 'Rate Type', datafield: 'rate_type', width: '12%'},
                        {text: 'Room Type', datafield: 'room_type', width: '12%'},
                        {text: 'Date Collected', datafield: 'date_collected', width: '10%'}
                    ]
                };
        $scope.createWidget = true;
        $scope.showGrid = true;
        $scope.fetchingRates = false;
        $timeout(function() {
            if(apply !== undefined) {
                $scope.gridMISettings.apply = apply;
            }
        },1000);
    };
    
    $scope.notifyEmailUpdated = false;
    $scope.updateQEmail = function() {
        $scope.updatingQEmail = true;
        $http.post($rootScope.backend2+'/import/updateQEmail',{ email: $scope.qEmail, q:$scope.queueid }).then(function(response){
            $scope.updatingQEmail = false;
            if(response.data.status == true) {
                $scope.notifyEmailUpdated = true;
            }
        });
    };

    $scope.searchHotels = function (keywords) {
        var cities = function(cities) {
            var c = '';
            angular.forEach(cities, function(v,k){
               c += v.name+'-'; 
            });
            return c.substr(0,c.length-1);
        };
        var params = {keywords: keywords, cities: cities($scope.rate.city) };
        return $http.get(
                $rootScope.backend2 + '/hotels/hotels/searchHotels',
                {params: params}
        ).then(function (response) {
            $scope.hotels = response.data.results;
        });
    };

    $scope.selectHotel = function (item, model) {
        $scope.show_form = true;
        $scope.hotel_details = item;
    };

    $scope.searchCountries = function (keywords) {
        var params = {keywords: keywords};
        return $http.get(
                $rootScope.backend2 + '/import/searchCountries',
                {params: params}
        ).then(function (response) {
            $scope.countries = response.data.results;
        });
    };

    $scope.selectCountry = function (item, model) {
    };

    $scope.searchStates = function (keywords) {
        var params = {keywords: keywords, country: $scope.rate.country.id };
        return $http.get(
                $rootScope.backend2 + '/import/searchStates',
                {params: params}
        ).then(function (response) {
            $scope.states = response.data.results;
        });
    };

    $scope.selectState = function (item, model) {
    };

    $scope.searchCities = function (keywords) {
        var params = {keywords: keywords, state: $scope.rate.state.id, country: $scope.rate.country.id };
        return $http.get(
                $rootScope.backend2 + '/import/searchCities',
                {params: params}
        ).then(function (response) {
            $scope.cities = response.data.results;
        });
    };

    $scope.selectCity = function (item, model) {
    };

    $scope.searchOTAs = function (keywords) {
        var params = {keywords: keywords };
        return $http.get(
                $rootScope.backend2 + '/import/searchOTAs',
                {params: params}
        ).then(function (response) {
            $scope.otas = response.data.results;
        });
    };

    $scope.selectOTA = function (item, model) {
    };
    
    $scope.exportXLS = function() {
        var name = '';
        angular.forEach($scope.rate.hotels, function(v,k){
           name += v.name+'-'; 
        });
        name = name.substr(0,name.length-1).toLowerCase();
        $scope.gridSettings.apply('exportdata', 'xls', name, true, null, true, $rootScope.backend2+'/export');
    };

}]);