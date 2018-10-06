app.controller('HotelsController', ['$scope', '$rootScope', '$routeParams', '$window', 'FileUploader', '$compile', 'HotelsServices', '$uibModal', '$http',function ($scope, $rootScope, $routeParams, $window, FileUploader, $compile, HotelsServices, $uibModal, $http) {
        $scope.currentHotel = $routeParams.hID;

        $scope.success_msg = false;
        $scope.danger_msg = false;
        setTimeout(function () {
            $('.select2').select2();
        }, 100);

        // get all System Users on jq
        // get all Members on jqxgrid
        $scope.getAllHotels = function () {
            $scope.createWidget = false;
            // prepare the data
            var source_members =
                    {
                        datatype: "json",
                        datafields: [
                            {name: 'id', type: 'int'},
                            {name: 'name', type: 'string'},
                            {name: 'address', type: 'string'},
                            {name: 'country', type: 'string'},
                            {name: 'state', type: 'string'},
                            {name: 'city', type: 'string'},
                            {name: 'pincode', type: 'string'},
                            {name: 'latitude', type: 'string'},
                            {name: 'longitude', type: 'string'},
                            {name: 'type', type: 'string'},
                            {name: 'status', type: 'string'}
                        ],
                        root: "content",
                        id: 'id',
                        url: $rootScope.backend + '/hotels/hotels/getAllHotels',
                        beforeprocessing: function (data)
                        {
                            source_members.totalrecords = data.totalElements;
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
                        }
                    };
            var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
                if (value == 'Block') {
                    return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #FF0000;">' + value + '</span>';
                } else if (value == 'Active') {
                    return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #008000;">' + value + '</span>';
                } else if (value == 'Pending') {
                    return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #FFCC00;">' + value + '</span>';
                }
            };
            var dataAdapter = new $.jqx.dataAdapter(source_members, {
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
            $rootScope.gridSettings =
                    {
                        width: '100%',
                        theme: 'newJqx',
                        source: dataAdapter,
                        pageable: true,
                        autoheight: true,
                        filterable: true,
                        sortable: true,
                        altrows: true,
                        virtualmode: true,
                        rowsheight: 35,
                        filterrowheight: 35,
                        ready: function ()
                        {
                            $rootScope.gridSettings.apply('selectrow', 0);
                        },
                        rendergridrows: function (obj)
                        {
                            return obj.data;
                        },
                        enabletooltips: true,
                        showfilterrow: true,
                        selectionmode: 'singlerow',
                        columns: [
                            {text: 'ID', datafield: 'id', width: '10%'},
                            {text: 'Hotel Name', datafield: 'name', width: '20%'},
                            {text: 'Address', datafield: 'address', width: '25%'},
                            {text: 'City', datafield: 'city', width: '15%'},
                            {text: 'State', datafield: 'state', width: '10%'},
                            {text: 'Country', datafield: 'country', width: '10%'},
                            {text: 'Status', datafield: 'status', cellsrenderer: cellsrenderer, width: '10%'}
                        ]
                    };
            $scope.createWidget = true;
        };
        $scope.getAllHotels();

        if ($scope.currentHotel !== undefined) {
            HotelsServices.getHotelEditData($scope.currentHotel, function (response) {
                $scope.hotel_edit = response.data.details;
            });
        }

        //after clicked on member show details based on account id
        $scope.account = {};
        $rootScope.gridSettings.rowselect = function (response) {
            if (typeof (response.args.row != 'undefined'))
            {
                HotelsServices.getClientDetails(response.args.row.id, function (response) {
                    $scope.hotel = response.data.details;
//                     setTimeout(function () {
//                            $('.select2').select('destroye').select2();
//                        }, 100);
                });
            }
        };

      
        $scope.deleteClient = function (id) {
            bootbox.confirm('Sure you want to delete this hotel?<br />Once deleted, it cannot be undone!', function (result) {
                if (result == true)
                {
                    HotelsServices.deleteClient(id, function (response) {
                        if (response.data.status == true)
                        {
                            bootbox.alert(response.data.message);
                            $scope.getAllHotels();
                        } else {
                            bootbox.alert(response.data.message);
                            $scope.getAllHotels();
                        }
                    });
                }
            });
        }

            $('#us3').locationpicker({
                location: {
                    latitude: null,
                    longitude: null
                },
                radius: 300,
                inputBinding: {
//                    latitudeInput: $('#us3-lat'),
//                    longitudeInput: $('#us3-lon'),
                    locationNameInput: $('#us3-address')
                },
                enableAutocomplete: true,
                onchanged: function (currentLocation, radius, isMarkerDropped) {
                    $scope.latitude = currentLocation.latitude;
                    $scope.longitude = currentLocation.longitude;
                }
            });
            
            $scope.hotel_details = {};
        $scope.addClient = function () {
            HotelsServices.postClient($scope.hotel_details,$scope.latitude,$scope.longitude,function (response) {
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
                    $scope.getAllHotels();
                } else {
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message = response.data.message;
                    alert(response.data.message);
                }
            });
//               console.log($scope.client_data);
        }
        $scope.panel_heading = 'Dashboard';
        $scope.histanalysis_show = function () {
            $scope.panel_heading = 'Historical Analysis';
        }
        $scope.rateanalysis_show = function () {
            $scope.panel_heading = 'Rate Analysis';
        }
        $scope.ratepace_show = function () {
            $scope.panel_heading = 'Rate Pace';
        }
        $scope.rate_reveiw_show = function () {
            $scope.panel_heading = 'Rate Review And Override';
        }
        $scope.room_types_show = function () {
            $scope.panel_heading = 'Room Types';
        }
        $scope.otaconfig_show = function () {
            $scope.panel_heading = 'OTA Config';
        }
        $scope.cmconfig_show = function () {
            $scope.panel_heading = 'CM Config';
        }
        $scope.userac_show = function () {
            $scope.panel_heading = 'User Accounts';
        }
        $scope.dashboard = function () {
            $scope.panel_heading = 'Dashboard';
        }
        $scope.quality_met = function () {
            $scope.panel_heading = 'Quality Metrics';
        }
        $scope.competitor = function () {
            $scope.panel_heading = 'Competitors';
        }
        $scope.dow = function () {
            $scope.panel_heading = 'DOW Definitions';
        }
        $scope.seasonality = function () {
            $scope.panel_heading = 'Seasonality Definitions';
        }
       
       
        $scope.searchCountry = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend + '/hotels/searchCountry',
                    {params: params}
            ).then(function (response) {
                $scope.countries = response.data.results;
            });
        };
        $scope.country_change = function(item){
            $scope.country_id = item.id;
        }
       $scope.searchStates = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend2 + '/hotels/hotels/searchState/?country_id=' + $scope.country_id,
                    {params: params}
            ).then(function (response) {
                $scope.states = response.data.results;
                 $scope.show_error_state = false;
                if($scope.states == ''){
                    $scope.show_error_state = true;
                    $scope.state_no_msg = 'Please select country first';
                }
            });
        };
        $scope.state_change = function(item){
            $scope.state_id = item.id;
        }
         $scope.searchCity = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend2 + '/hotels/hotels/searchCity/?state_id=' + $scope.state_id,
                    {params: params}
            ).then(function (response) {
                $scope.cities = response.data.results;
                 $scope.show_error_city = false;
                if($scope.cities == ''){
                    $scope.show_error_city = true;
                    $scope.state_no_msg = 'Please select state first';
                }
            });
        };
         
        $scope.hotel_as_client= function(hotel_id){
            bootbox.confirm('Sure you want to add hotel as client?<br />Once deleted, it cannot be undone!', function (result) {
            if (result == true){
            HotelsServices.hotel_as_client(hotel_id, function (response) {
                if (response.data.status == true) {
                    bootbox.alert(response.data.message);
                }else{
                     bootbox.alert(response.data.message);
                }
            });
        }
            });
    }
    
        $scope.addFromCountry = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/hotels/modals/hotels.add.country.html',
                controller: 'AddFromCountryController',
                resolve: {
                }
            });
            
            modalInstance.result.then(function(user,key){
                //$scope.user_account_data.push(user);
            }, function() {
                
            });
        };
        
        $scope.openModal = function (id) {
            HotelsServices.fetchHotelName(id, function (response) {
                if (response.data.status == true) {
                    $scope.fetch_hotel = response.data.details;
                    var modalInstance = $uibModal.open({
                        templateUrl: 'competitors_add.html',
                        controller: 'competitorsfigController',
                        resolve: {
                            value: function () {
                                return $scope.fetch_hotel;
                            }
                        }
                    });
                }

            });
        }
        $scope.openMergeModal = function (id) {
            HotelsServices.hotelGroupDetails(function (response) {
                if (response.data.status == true) {
                    $scope.hotel_det = {
                        hotel_details : response.data.hotel_details,
                        hotel_id : id
                    }
                    var modalInstance = $uibModal.open({
                        templateUrl: 'merger_hotel.html',
                        controller: 'mergeHotelController',
                        resolve: {
                            value: function () {
                                return $scope.hotel_det;
                            }
                        }
                    });
                }

            });
        }
        $scope.location = function(){
             return $http.get(
                    $rootScope.backend2 + '/hotels/hotels/countryId'
            );
        }
        $scope.addStateCity = function(){
             return $http.get(
                    $rootScope.backend2 + '/hotels/hotels/addStateCity'
            );
        }

}]);

//add data controller
app.controller('competitorsfigController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'HotelsServices', '$compile', 'FileUploader', 'value', '$rootScope', '$http', function ($scope, $rootScope, $uibModalInstance, $window, HotelsServices, $compile, FileUploader, value, $rootScope, $http) {

        $scope.searchCountry = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend2 + '/hotels/hotels/searchCountry',
                    {params: params}
            ).then(function (response) {
                $scope.countries = response.data.results;
            });
        };
        $scope.searchStates = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend2 + '/hotels/hotels/searchState',
                    {params: params}
            ).then(function (response) {
                $scope.states = response.data.results;
            });
        };
        $scope.searchCity = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend2 + '/hotels/hotels/searchCity',
                    {params: params}
            ).then(function (response) {
                $scope.cities = response.data.results;
            });
        };
        $scope.hotel_details = value;

        $scope.searchClient = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend2 + '/hotels/hotels/searchClient',
                    {params: params}
            ).then(function (response) {
                $scope.clients = response.data.results;
                 });
        };
        
        $scope.client_data = {};
        $scope.hotelCompAdd = function () {
            HotelsServices.hotelCompAdd($scope.hotel_details.id,$scope.client_data, function (response) {
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
                    setTimeout(function () {
                        $uibModalInstance.close();
                    }, 1000);
//                     $rootScope.$emit('reloadUsersData', $scope.client_id);
                } else {
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message = response.data.message;
                    setTimeout(function () {
                        $uibModalInstance.close();
                    }, 1000);
//                     $rootScope.$emit('reloadUsersData', $scope.client_id);
                }
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

}]);

//add data controller
app.controller('mergeHotelController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'HotelsServices', '$compile', 'FileUploader', 'value', '$rootScope', '$http', function ($scope, $rootScope, $uibModalInstance, $window, HotelsServices, $compile, FileUploader, value, $rootScope, $http) {
        $scope.hotel_id = value.hotel_id;
        $scope.hotel_details = value.hotel_details;
        $scope.hotel_det = {};
        $scope.groupHotelAdd = function () {
            HotelsServices.groupHotelAdd($scope.hotel_det, $scope.hotel_id, function (response) {
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
                    setTimeout(function () {
                        $uibModalInstance.close();
                    }, 1000);
//                     $rootScope.$emit('reloadUsersData', $scope.client_id);
                } else {
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message = response.data.message;
                    setTimeout(function () {
                        $uibModalInstance.close();
                    }, 1000);
//                     $rootScope.$emit('reloadUsersData', $scope.client_id);
                }
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };




    }]);

//add from country
app.controller('AddFromCountryController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'HotelsServices', '$compile', 'FileUploader', '$rootScope', function ($scope, $rootScope, $uibModalInstance, $window, HotelsServices, $compile, FileUploader, $rootScope) {
        
    $scope.modal_title = 'Add Hotels from Country';
    $scope.loadingCountries = true;
    
    $scope.countries = [];
    
    HotelsServices.getCountries(function(response){
        $scope.countries = response.data.countries;
        $scope.loadingCountries = false;
    });

    $scope.importFromCountry = function (valid) {
        if(valid) {
            $scope.loading_msg = true;
            HotelsServices.importFromCountry($scope.country, function (response) {
                $scope.loading_msg = false;
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
                    setTimeout(function () {
                        //$uibModalInstance.close($scope.user_data);
                    }, 2000);
                } else {
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message = response.data.message;
                }
            });
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss($scope.predit);
    };
    
}]);