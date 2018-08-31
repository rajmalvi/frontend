app.controller('ClientsController', ['$scope', '$rootScope', '$routeParams', '$window', 'FileUploader', '$compile', 'ClientsServices', '$uibModal', '$http', '$location', '$timeout', '$q', 'uiUploader', function ($scope, $rootScope, $routeParams, $window, FileUploader, $compile, ClientsServices, $uibModal, $http, $location, $timeout, $q, uiUploader) {
        $scope.currentClient = $routeParams.cID;
        $scope.success_msg = false;
        $scope.danger_msg = false;
        $scope.show_form = false
        $scope.client_grid = false;
        $scope.user_account = false;
        $scope.ota_data = false;
        $scope.room_types = false;
        $scope.event_show = false;
        $scope.qualitym_show = false;
        $scope.seasonality_show = false;
        $scope.competitors_show = false;
        $scope.room_otp_form = false;
        $scope.dow_data_show = false;
        $scope.client_form = true;
        $scope.run_rate_shop = false;
        $scope.mapping_forms = false;
        $scope.loadingClient = false;
        $scope.client_data = {};
        setTimeout(function () {
            $('.select2').select2();
        }, 100);

        // get all System Users on jq
        // get all Members on jqxgrid
        $scope.getAllClients = function () {
            $scope.createWidget = false;
            // prepare the data
            var source_members =
                    {
                        datatype: "json",
                        datafields: [
                            {name: 'id', type: 'int'},
                            {name: 'propertyName', type: 'string'},
                            {name: 'address', type: 'string'},
                            {name: 'accountManager', type: 'string'},
                            {name: 'status', type: 'string'}
                        ],
                        root: "clients",
                        id: 'id',
                        url: $rootScope.backend + '/clients/clients/getAllClients',
                        beforeprocessing: function (data)
                        {
                            source_members.totalrecords = data.totalRows;
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
                        virtualmode: false,
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
                            {text: 'Property Name', datafield: 'propertyName', width: '20%'},
                            {text: 'Address', datafield: 'address', width: '40%'},
                            {text: 'Account Manager', datafield: 'accountManager', width: '20%'},
                            {text: 'Status', datafield: 'status', cellsrenderer: cellsrenderer, width: '10%'}
                        ]
                    };
            $scope.createWidget = true;
        };

        //get all clients
        $scope.getAllClients();

        if ($scope.currentClient !== undefined) {
            ClientsServices.getClientEditData($scope.currentClient, function (response) {
                $scope.hotel_details = response.data.details;
            });
        }

        $('#us3').locationpicker({
            location: {
                latitude: null,
                longitude: null
            },
            radius: 300,
            inputBinding: {
                locationNameInput: $('#us3-address')
            },
            enableAutocomplete: true,
            onchanged: function (currentLocation, radius, isMarkerDropped) {
                // Uncomment line below to show alert on each Location Changed event
                //alert("Location changed. New location (" + currentLocation.latitude + ", " + currentLocation.longitude + ")");
            }
        });
        //after clicked on member show details based on account id
        $scope.account = {};
        $scope.cm_room_types = [];
        $scope.cm_rate_types = [];
        $rootScope.gridSettings.rowselect = function (response) {
            if (typeof (response.args.row !== undefined)) {
                $scope.loadingClient = true;
                ClientsServices.getOtaPerformance(response.args.row.id, '2018-03-07', function (response) {
                    $scope.iSell_otaPerformance = response.data;
                });
                ClientsServices.getCompetitorPricingForISell(response.args.row.id, '2018-03-07', function (response) {
                    $scope.iSell_competitorPricing = response.data;
                });

                ClientsServices.getRatesForISell(response.args.row.id, '2018-03-07', function (response) {
                    $scope.iSell_rates = response.data;
                });

                ClientsServices.getAllRecommendation(response.args.row.id, '2018-03-07', function (response) {
                    $scope.iSell_all_recommendation = response.data;
                });

                ClientsServices.getMinCompetitorPricing(response.args.row.id, '2018-03-07', function (response) {
                    $scope.iSell_min_all_competitor = response.data;
                });

                ClientsServices.getMinCompetitor(response.args.row.id, '2018-03-07', function (response) {
                    $scope.loadMIGrid(response.data);
                });

                ClientsServices.getClientById(response.args.row.id, function (response) {
                    $scope.client=response.data;
                });

                ClientsServices.getClientDetails(response.args.row.id, true, function (response) {
                    $scope.client = response.data.details;
                    $scope.client_id = $scope.client.id;
                    $scope.rateShopSettings.client.otas = response.data.rateshop.client.otas;
                    $scope.rateShopSettings.client.horizon = response.data.rateshop.client.horizon;
                    $scope.rateShopSettings.competitors.otas = response.data.rateshop.competitors.otas;
                    $scope.rateShopSettings.competitors.horizon = response.data.rateshop.competitors.horizon;
                    $scope.rateShopSettings.currency = response.data.rateshop.currency;
                    $scope.rateShopSettings.los = response.data.rateshop.los;
                    $scope.rateShopSettings.ratetypes = response.data.rate_types;
                    $scope.rateShopSettings.roomtypes = response.data.roomtypes_data;
                    $scope.user_account_data = response.data.users;
                    $scope.roomtypes_data = response.data.roomtypesmap_data;
                    $scope.ota_config_data = response.data.ota_mapping;
                    $scope.ota_mapping.rate_ota = response.data.mapped_otas_rs;
                    $scope.ota_mapping.staah_ota = response.data.mapped_otas_staah;
                    $scope.room_type_map.rate_name = response.data.mapped_roomtype_rs;
                    $scope.room_type_map.staah_name = response.data.mapped_roomtype_staah;
                    $scope.dows = response.data.dow_data;
                    $scope.seasonality_definitions = response.data.seasonality_definitions;
                    $scope.clients_qm = response.data.qm;
                    $scope.hotels = response.data.hotels;
                    $scope.events = response.data.events;
                    $scope.isell = response.data.isell;
                    $scope.rro = response.data.rro;
                    $scope.competitors = response.data.competitors;
                    $scope.competitors_suggestions = response.data.competitors_suggestions;
                    $scope.cache_time = response.data.cache_time;
                    $scope.cm_form.cm_hotel = response.data.details.cm_hotel;
                    $scope.cm_form.cm_id = response.data.details.cm_username;
                    $scope.cm_form.cm_password = response.data.details.cm_password;
                    $scope.cm_form.cm_master_room = response.data.details.cm_master_room;
                    $scope.cm_form.cm_master_rate = response.data.details.cm_master_rate;
                    $scope.cm_room_types = response.data.cm_room_types;
                    $scope.cm_rate_types = response.data.cm_rate_types;
                    //$scope.renderClientCharts(response.data.charts);
                   // $scope.loadMIGrid(response.data.rates);
                    $scope.loadingClient = false;
                });
            }
        };

        $scope.getAllClientsDetails = function (id,cache) {
            $scope.loadingClient = true;
            ClientsServices.getClientDetails(id, cache, function (response) {
                $scope.client = response.data.details;
                $scope.preclientid = $scope.client.id;
                $scope.client_id = $scope.client.id;
                $scope.rateShopSettings.client.otas = response.data.rateshop.client.otas;
                $scope.rateShopSettings.client.horizon = response.data.rateshop.client.horizon;
                $scope.rateShopSettings.competitors.otas = response.data.rateshop.competitors.otas;
                $scope.rateShopSettings.competitors.horizon = response.data.rateshop.competitors.horizon;
                $scope.rateShopSettings.currency = response.data.rateshop.currency;
                $scope.rateShopSettings.los = response.data.rateshop.los;
                $scope.rateShopSettings.ratetypes = response.data.rate_types;
                $scope.rateShopSettings.roomtypes = response.data.roomtypes_data;
                $scope.user_account_data = response.data.users;
                $scope.roomtypes_data = response.data.roomtypesmap_data;
                $scope.ota_config_data = response.data.ota_mapping;
                $scope.ota_mapping.rate_ota = response.data.mapped_otas_rs;
                $scope.ota_mapping.staah_ota = response.data.mapped_otas_staah;
                $scope.room_type_map.rate_name = response.data.mapped_roomtype_rs;
                $scope.room_type_map.staah_name = response.data.mapped_roomtype_staah;
                $scope.dows = response.data.dow_data;
                $scope.seasonality_definitions = response.data.seasonality_definitions;
                $scope.clients_qm = response.data.qm;
                $scope.hotels = response.data.hotels;
                $scope.events = response.data.events;
                $scope.isell = response.data.isell;
                $scope.rro = response.data.rro;
                $scope.cm_form.cm_hotel = response.data.details.cm_hotel;
                $scope.cm_form.cm_id = response.data.details.cm_username;
                $scope.cm_form.cm_password = response.data.details.cm_password;
                $scope.cm_form.cm_master_room = response.data.details.cm_master_room;
                $scope.cm_form.cm_master_rate = response.data.details.cm_master_rate;
                $scope.competitors = response.data.competitors;
                $scope.competitors_suggestions = response.data.competitors_suggestions;
                $scope.cache_time = response.data.cache_time;
                $scope.cm_room_types = response.data.cm_room_types;
                $scope.cm_rate_types = response.data.cm_rate_types;
                $scope.loadingClient = false;
                //$scope.renderClientCharts(response.data.charts);
                if ($scope.panel_heading == 'OTA Config') {
                    $scope.otaconfig_show($scope.client.id);
                }
                if ($scope.panel_heading == 'User Accounts') {
                    $scope.userac_show($scope.client.id);
                }
                if ($scope.panel_heading == 'Room Types') {
                    $scope.room_types_show($scope.client.id);
                }
            });
        };
        
        $scope.clearClientCache = function() {
            $scope.getAllClientsDetails($scope.client_id,false);
        };

        $scope.createMIWidget = false;
        $scope.loadMIGrid = function (data) {
            if($scope.gridMISettings !== undefined) {
                var apply = $scope.gridMISettings.apply;
            }
            // prepare the data
            var source_rates = {
                datatype: "json",
                datafields: [
                    {name: 'name', type: 'string'},
                    {name: 'otaName', type: 'string'},
                    {name: 'occupancyDate', type: 'string'},
                    {name: 'regDate', type: 'string'},
                    {name: 'rate', type: 'string'},
                    {name: 'min', type: 'string'},
                    {name: 'rate_type', type: 'string'},
                    {name: 'categoryName', type: 'string'}
                ],
                root: "rates",
                //id: 'id',
                localdata: data
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
            var cellsrenderer_stale = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
                if (value == 'Block') {
                    return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #FF0000;">' + value + '</span>';
                } else if (value == 'Active') {
                    return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #008000;">' + value + '</span>';
                } else if (value == 'Pending') {
                    return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #FFCC00;">' + value + '</span>';
                }
                return '<div class="jqx-grid-cell-left-align" style="margin-top: 10px;">'+value+'</div>';
            };
            var MIDataAdapter = new $.jqx.dataAdapter(source_rates, {
                downloadComplete: function (data, status, xhr) {
                },
                loadComplete: function (data) {

                },
                loadError: function (xhr, status, error) {
                }
            });

            /*End of main grid*/
            $scope.gridMISettings = {
                width: '100%',
                theme: 'newJqx',
                source: MIDataAdapter,
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
                    {text: 'Hotel', datafield: 'name', width: '31%'},
                    {text: 'Check In', datafield: 'occupancyDate', width: '10%'},
                    {text: 'Room Type', datafield: 'categoryName', width: '12%'},
                    {text: 'Website/OTA', datafield: 'otaName', width: '15%'},
                    {text: 'Rate Type', datafield: 'rate_type', width: '12%'},
                    {text: 'Rate', datafield: 'min', cellsrenderer: cellsrenderer, width: '10%'},
                    {text: 'Date Collected-2', datafield: 'regDate', cellsrenderer: cellsrenderer_stale, width: '10%'}
                ]
            };

            $scope.createMIWidget = true;
            $timeout(function() {
                if(apply !== undefined) {
                    $scope.gridMISettings.apply = apply;
                }
            },1000);
            $scope.gridMISettings.rowdoubleclick = function (response) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'partials/clients/modals/clients.rates.html',
                    controller: 'ratesModalController',
                    size: 'lg',
                    resolve: {
                        data: function () {
                            return response.args.row.bounddata;
                        }
                    }
                });
            };
        };

        //client add
        $scope.newClientAdd = {
            hotel_details: {
                id:'',
                hotel_country: '',
                hotel_state: '',
                hotel_city: '',
                hotel_name: '', //hotel name
                name: '', //property_name
                address: '',
                country: '',
                state: '',
                city: '',
                zip: '',
                yield: '',
                type: '',
                flag: '',
                max_capacity: '',
                cm_hotel_id: '',
                cm_id: '',
                cm_password: ''
            },
            rateshop: {
                client: {
                    id: $scope.client_id,
                    otas: [],
                    horizon: [{dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}]
                },
                competitors: {
                    otas: [],
                    horizon: [{dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}]
                },
                roomtypes: [],
                ratetypes:[]
            },
            account_manager: '',
            competitors: [],
            los: '',
            currency: '',
            otas: { rateshopping:[], staah:[] },
            roomtypes: [],
            ratetypes: []
        };
        
        $scope.addingClient = false;
        $scope.addClient = function (valid) {
            console.log($scope.newClientAdd);
            $scope.addingClient = true;
            ClientsServices.postClient($scope.newClientAdd, function (response) {
                $scope.addingClient = false;
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
                    $timeout(function () {
                        $location.path('/clients');
                    }, 1000);
                } else {
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message = response.data.message;
                }
            });
        };
        
        $scope.loading_msg = false;
        $scope.updateClient = function (valid) {
            console.log($scope.hotel_details);
            if(valid) {
                $scope.loading_msg = true;
                ClientsServices.editClient($scope.hotel_details, function (response) {
                    $scope.loading_msg = false;
                    if (response.data.status == true) {
                        $scope.success_msg = true;
                        $scope.danger_msg = false;
                        $scope.sub_message = response.data.message;
                        $timeout(function () {
                            //$location.path('/clients');
                        }, 1000);
                    } else {
                        $scope.success_msg = false;
                        $scope.danger_msg = true;
                        $scope.sub_message = response.data.message;
                    }
                });
            }
        };

        $scope.search = {
            hotel_country:'',
            hotel_state:'',
            hotel_city:''
        };
        
        $scope.fetchedRates = false;
        
        $scope.form_heading = 'Client Form'
        //add client form
        $scope.client_form_next = function (valid) {
            $scope.basicSubmitted = true;
            if(valid) {
                //console.log(JSON.stringify($scope.newClientAdd));
                $scope.run_rate_shop = true;
                $scope.client_form = false;
                $scope.mapping_forms = false;
                $scope.form_heading = 'Run Rate Shop';
            }
        };
        
        $scope.run_rate_shop_next = function () {
            $scope.fetchSubmitted = true;
            if($scope.fetchedRates || 1 == 1) {
                $scope.mapping_forms = true;
                $scope.run_rate_shop = false;
                $scope.client_form = false;
                $scope.form_heading = 'Room Type And OTA Mappings';
            }
        };
        
        $scope.run_rate_shop_back = function () {
            $scope.mapping_forms = false;
            $scope.client_form = true;
            $scope.run_rate_shop = false;
            $scope.form_heading = 'Client Form';
        };
        
        $scope.mapping_forms_back = function () {
            $scope.mapping_forms = false;
            $scope.run_rate_shop = true;
            $scope.client_form = false;
            $scope.rateshop_form = false;
            $scope.form_heading = 'Run Rate Shop';
        };
        
        $scope.mapping_forms_next = function () {
            $scope.mapping_forms = false;
            $scope.run_rate_shop = false;
            $scope.client_form = false;
            $scope.rateshop_form = true;
            $scope.form_heading = 'Client And Competitors Rate Shop Settings';
        };
        
        $scope.rateshop_form_back = function () {
            $scope.mapping_forms = true;
            $scope.run_rate_shop = false;
            $scope.client_form = false;
            $scope.rateshop_form = false;
            $scope.form_heading = 'Room Type And OTA Mappings';
        };
        
        $scope.rateshop_form_next = function (valid) {
            $scope.prefetchSubmitted = true;
            if(valid) {
                $scope.mapping_forms = false;
                $scope.run_rate_shop = false;
                $scope.client_form = false;
                $scope.rateshop_form = false;
                $scope.chmanager_form = true;
                $scope.form_heading = 'Channel Manager Setup';
            }
        };
        
        $scope.chmanager_form_back = function () {
            $scope.mapping_forms = false;
            $scope.run_rate_shop = false;
            $scope.client_form = false;
            $scope.rateshop_form = true;
            $scope.chmanager_form = false;
            $scope.form_heading = 'Client And Competitors Rate Shop Settings';
        };

        //cancel client
        $scope.cancelClient = function () {
            $timeout(function () {
                $location.path('clients');
            }, 1000);
        };

        //get hotel details - search
        $scope.get_hotel = function (hotel) {
            ClientsServices.getHotelDetails(hotel, function (response) {
                if (response.data.status == true) {
                    $scope.show_form = true;
                    $scope.hotel_details = response.data.hotel_details;
                    ClientsServices.getAllState($scope.hotel_details.country, function (response) {
                        if (response.data.status == true) {
                            $scope.states = response.data.states;
                        }
                    });
                    ClientsServices.getAllCity($scope.hotel_details.state, function (response) {
                        if (response.data.status == true) {
                            $scope.cities = response.data.cities;
                        }
                    });
                }
            });
        };

        //get all account managers
        $scope.searchAccountManager = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend2 + '/hotels/hotels/searchAccountManager',
                    {params: params}
            ).then(function (response) {
                $scope.managers = response.data.results;
            });
        };

        //search country 
        $scope.searchCountry = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend + '/import/searchCountries',
                    {params: params}
            ).then(function (response) {
                $scope.countries = response.data.results;
            });
        };

        //on change country
        $scope.country_change = function (item) {
            $scope.country_id = item.id;
            $scope.country_name = item.name;
        }

        //search states
        $scope.searchStates = function (keywords) {
            var params = {keywords: keywords};
//              if(country == '' || country == null){
            return $http.get(
                    $rootScope.backend + '/import/searchStates/?country=' + $scope.country_id,
                    {params: params}
            ).then(function (response) {
                $scope.states = response.data.results;
                $scope.show_error_state = false;
                if ($scope.states == '') {
                    $scope.show_error_state = true;
                    $scope.state_no_msg = 'Please select country first';
                }
            });
        };

        //on cahnge state
        $scope.state_change = function (item) {
            $scope.state_id = item.id;
            $scope.state_name = item.name;
        }

        //search currency
        $scope.searchCurrency = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend2 + '/hotels/hotels/searchCurrency',
                    {params: params}
            ).then(function (response) {
                $scope.currency = response.data.results;
            });
        };

        //search city
        $scope.searchCity = function (keywords) {
            var params = {keywords: keywords, country: $scope.country_id, state: $scope.state_id};
//            if(state == ''){
            return $http.get(
                    $rootScope.backend + '/import/searchCities',
                    {params: params}
            ).then(function (response) {
                $scope.cities = response.data.results;
                $scope.show_error_city = false;
                if ($scope.cities == '') {
                    $scope.show_error_city = true;
                    $scope.state_no_msg = 'No data found';
                }
            });
        };

        //on change city
        $scope.city_change = function (item) {
            $scope.city_name = item.name;
        }
        
        $scope.searchOTAs = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend + '/setup/otasetup/getAllOtas',
                    {params: params}
            ).then(function (response) {
                $scope.otas_name = response.data.details;
            });
        };
        
        //Create an array containing details of 1 hotel and all the competitors
        $scope.tempHotels = [];
        
        function addToTempHotels(item) {
            $scope.tempHotels.push(item);
        }

        //select hotel
        $scope.selectHotel = function (item, model) {
            if(item.client_id === false) {
                addToTempHotels(item);
                $scope.fetchCompetitors(item.id);
                $scope.show_form = true;
                $scope.show_error = false;
                $scope.newClientAdd.hotel_details = item;
                $scope.newClientAdd.hotel_details.country = item.getCountryData;
                $scope.newClientAdd.hotel_details.state = item.getStateData;
                $scope.newClientAdd.hotel_details.city = item.getCityData;
            }
            else {
                $scope.show_form = false;
                $scope.show_error = true;
            }
        };
        
        $scope.selectCompetitor = function (item, model) {
            addToTempHotels(item);
        };
        
        $scope.removeHotelFromTemp = function(item, model) {
            var temp = [];
            angular.forEach($scope.tempHotels, function(v,k){
                if(parseInt(item.id) != parseInt(v.id)) {
                    temp.push(v);
                }
            });
            $scope.tempHotels = temp;
        };

        //competitor hotels
        var hotelSearch = null;
        $scope.searchHotels = function (keywords,competitors) {
            if(hotelSearch !== null) {
                hotelSearch.resolve();
            }
            if(keywords.length >= 3) {
                var params = {keywords: keywords, cities:$scope.city_name};
                console.log('Hotel search..');
                console.log(competitors);
                if(competitors == true) {
                    console.log('Competitor search..');
                    params.hotel=$scope.newClientAdd.hotel_details.id;
                }
                hotelSearch = $q.defer();
                return $http.get(
                        $rootScope.backend2 + '/hotels/hotels/searchHotels',
                        {params: params,timeout: hotelSearch.promise}
                ).then(function (response) {
                    hotelSearch = null;
                    $scope.hotels = response.data.results;
                });
            }
        };
        
        $scope.fetchCompetitors = function(hotel_id) {
            console.log('Fetching competitors for: '+hotel_id);
            $http.get(
                    $rootScope.backend2 + '/hotels/hotels/getCompetitors',
                    {params: {hotel:hotel_id}}
            ).then(function (response) {
                $scope.hotels = response.data.results;
            });
        };

        //get all hotels
        $scope.getAllHotels = function () {
            ClientsServices.getAllHotels(function (response) {
                if (response.data.status == true) {
                    $scope.hotels = response.data.hotels;


                }
            });
        };

        //delete client
        $scope.deleteClient = function (id) {
            bootbox.confirm('Sure you want to delete this client?<br />Once deleted, it cannot be undone!', function (result) {
                if (result == true)
                {
                    ClientsServices.deleteClient(id, function (response) {
                        if (response.data.status == true)
                        {
                            bootbox.alert(response.data.message);
                            $scope.getAllClients();
                        } else {
                            bootbox.alert(response.data.message);
                            $scope.getAllClients();
                        }
                    });
                }
            });
        };


        $scope.panel_heading = 'iSell';
        //client dashboard details show
        $scope.active_panel = 'isell';
        $scope.active_panel_title = 'iSell';
        
        $scope.switchPanel = function(panel,title) {
            $scope.active_panel = panel;
            $scope.active_panel_title = title;
        };

        $scope.switchPanel_hk = function(panel,title,dataRest) {
            $http.get(
                $rootScope.backend + '/hk/get/'+(dataRest.split(',')[0])+'?clientId=' + $scope.client_id
            ).then(function(response){
                eval('$scope.'+(dataRest.split(',')[0])+'_hk = response.data;');
                if(dataRest.split(',').length>1){
                    $scope.switchPanel_hk(panel,title,dataRest.split(',',2)[1]);
                }else{
                    $scope.active_panel = panel;
                    $scope.active_panel_title = title;
                }
            });
        };
        
        // New switch pannel based on on the fly data

       // $scope.switchPanelhk = function(panel,title) {
       //     var params = {clientId=$scope.client_id};
           // $http.get(
           //     $rootScope.backend + '/hk/events/getEvents',
           //     {params:params}
           // ).then(function(response){
           //     $scope.events_hk = response;
           //     $scope.active_panel = panel;
           //     $scope.active_panel_title = title;
           // });
            
       // };






        //Room Types
        $scope.searchRoomtypes = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend2 + '/setup/room_types/searchRoomtypesName',
                    {params: params}
            ).then(function (response) {
                $scope.room_types_name = response.data.details;
            });
        };
        
        //User Accounts
        $scope.getUserAccounts = function(id) {
            ClientsServices.getUsersAccount(id, function (response) {
                if (response.data.status == true) {
                    $scope.user_account_data = response.data.user_account;
                } else {
                }
            });
        };
        
        //Events
        $scope.getEvents = function(id) {
            ClientsServices.getClientEvents(id, function (response) {
                if (response.data.status == true) {
                    $scope.events = response.data.events;
                } else {
                }
            });
        };
        
        //Quality Metrics
        $scope.getQMData = function(id) {
            ClientsServices.getClientQuality(id, function (response) {
                if (response.data.status == true) {
                    $scope.clients_qm = response.data.clients_qm;
                } else {
                }
            });
        };
        
        //Competitors
        $scope.getCompetitors = function(id) {
            ClientsServices.getCompetitors(id, function (response) {
                if (response.data.status == true) {
                    $scope.competitors = response.data.competitors;
                } else {
                }
            });
        };
        
        //DOW
        $scope.searchDowType = function (keywords) {
            var params = {keywords: keywords};
            $scope.types = [{type: 'weekday'}, {type: 'weekend'}];
        }
        $scope.start = new Date(2015, 6, 1);
        $scope.end = new Date(2015, 8, 1);
        $scope.weekends = [];
        $scope.days = {
            get_day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        };
        
        //Seasonality
        $scope.getSeasonality = function(id) {
            ClientsServices.getSeasonsData(id, function (response) {
                if (response.data.status == true) {
                    $scope.seasonality_definitions = response.data.seasonality_definitions;
                } else {
                }
            });
        };
            
        /*if (data == 'reloadClients') {
            $scope.getAllClientsDetails(id);
        }*/

        $scope.days = {
            get_day_two: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        };

        $scope.rateShopSettings = {
            client: {
                id: $scope.client_id,
                otas: [],
                horizon: [{dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}]
            },
            competitors: {
                otas: [],
                horizon: [{dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}, {dow: false, days: 90}]
            },
            los: '',
            currency: '',
            roomtypes: [],
            ratetypes: []
        };

        //sortable list - rate types
        var tmpList = [];
        $scope.getRateTypesSortable = function () {
            ClientsServices.getRateTypesSortable(function (response) {
                $scope.rateShopSettings.ratetypes = $scope.newClientAdd.rateshop.ratetypes = response.data.details;
            });
        };
        $scope.sortingLog = [];
        $scope.update = function (e, ui) {
            var logEntry = tmpList.map(function (i) {
                return i.value;
            }).join(', ');
            $scope.sortingLog.push('Update: ' + logEntry);
        };
        $scope.stop = function (e, ui) {
            // this callback has the changed model
            var logEntry = tmpList.map(function (i) {
                return i.value;
            }).join(', ');
            $scope.sortingLog.push('Stop: ' + logEntry);
        };

        //sortable list - room types
        var tmpList1 = [];
        $scope.getRoomTypesSortable = function () {
            ClientsServices.getRoomTypesSortable(function (response) {
                $scope.rateShopSettings.roomtypes = $scope.newClientAdd.rateshop.roomtypes = response.data.details;
            });
        };
        $scope.sortingLog1 = [];
        $scope.update = function (e, ui) {
            var logEntry = tmpList1.map(function (i) {
                return i.value;
            }).join(', ');
            $scope.sortingLog1.push('Update: ' + logEntry);
        };
        $scope.stop = function (e, ui) {
            // this callback has the changed model
            var logEntry = tmpList1.map(function (i) {
                return i.value;
            }).join(', ');
            $scope.sortingLog1.push('Stop: ' + logEntry);
        };


        //add room type mapping
        $scope.room_type_map = {
            rate_name: [],
            staah_name: []
        };
        $scope.submitRoomTypeMap = function (id) {
            ClientsServices.submitRoomTypeMap($scope.room_type_map, id, function (response) {
                if (response.data.status == true)
                {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;

                } else {
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message = response.data.message;
                }
            });
        }
        //add room type mapping
        $scope.ota_mapping = {
            rate_ota: [],
            staah_ota: []
        };
        $scope.submitOtaMap = function (id) {
            ClientsServices.submitOtaMap($scope.ota_mapping, id, function (response) {
                if (response.data.status == true)
                {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;

                } else {
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message = response.data.message;
                }
            });
        }

        //search OTAs
        $scope.searchOTAs_new = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend + '/setup/otasetup/getAllOtas',
                    {params: params}
            ).then(function (response) {
                $scope.otas_name = response.data.details;
            });
        };
        //search room types
        $scope.searchRoomtypes_new = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend2 + '/setup/room_types/searchRoomtypesName',
                    {params: params}
            ).then(function (response) {
                $scope.room_types_name = response.data.details;
            });
        };

        //search room types mapping
        $scope.searchRoomtypesMapping = function (id, keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend2 + '/setup/room_types/searchRoomtypesMapping/?id=' + id,
                    {params: params}
            ).then(function (response) {
                $scope.room_types_mapping = response.data.details;
            });
        };

        //delete user
        $scope.delete_user = function (id) {
            bootbox.confirm('Sure you want to delete this user?<br />Once deleted, it cannot be undone!', function (result) {
                if (result == true)
                {
                    ClientsServices.deleteUser(id, function (response) {
                        if (response.data.status == true)
                        {
                            bootbox.alert(response.data.message);
                        } else {
                            bootbox.alert(response.data.message);
                        }
                    });
                }
            });
        }
        //delete competitors
        $scope.delete_competitiors = function (id) {
            bootbox.confirm('Sure you want to delete this competitor?<br />Once deleted, it cannot be undone!', function (result) {
                if (result == true)
                {
                    ClientsServices.deleteCompetitiors(id, function (response) {
                        if (response.data.status == true)
                        {
                            bootbox.alert(response.data.message);
                        } else {
                            bootbox.alert(response.data.message);
                        }
                    });
                }
            });
        }
        //delete event
        $scope.delete_event = function (id, client_id) {
            bootbox.confirm('Sure you want to delete this event?<br />Once deleted, it cannot be undone!', function (result) {
                if (result == true)
                {
                    ClientsServices.deleteEvent(id, function (response) {
                        if (response.data.status == true)
                        {
                            bootbox.alert(response.data.message);
                            $scope.events_show(client_id);
                        } else {
                            bootbox.alert(response.data.message);
                            $scope.events_show(client_id);
                        }
                    });
                }
            });
        };
        //delete quality manager
        $scope.delete_qm = function (id, client_id) {
            bootbox.confirm('Sure you want to delete this quality metrics?<br />Once deleted, it cannot be undone!', function (result) {
                if (result == true)
                {
                    ClientsServices.deleteQM(id, function (response) {
                        if (response.data.status == true)
                        {
                            bootbox.alert(response.data.message);
                            $scope.quality_met(client_id);
                        } else {
                            bootbox.alert(response.data.message);
                            $scope.quality_met(client_id);
                        }
                    });
                }
            });
        };
        
        //delete seasons
        $scope.delete_season = function (id, client_id) {
            bootbox.confirm('Sure you want to delete this season?<br />Once deleted, it cannot be undone!', function (result) {
                if (result == true)
                {
                    ClientsServices.deleteSeason(id, function (response) {
                        if (response.data.status == true)
                        {
                            bootbox.alert(response.data.message);
                            $scope.seasonality(client_id);
                        } else {
                            bootbox.alert(response.data.message);
                            $scope.seasonality(client_id);
                        }
                    });
                }
            });
        };
        
        //delete ota
        $scope.delete_ota = function (id, client_id) {
            bootbox.confirm('Sure you want to delete this ota?<br />Once deleted, it cannot be undone!', function (result) {
                if (result == true)
                {
                    ClientsServices.deleteOtaConfig(id, function (response) {
                        if (response.data.status == true)
                        {
                            bootbox.alert(response.data.message);
                            $scope.otaconfig_show(client_id, '');
                        } else {
                            bootbox.alert(response.data.message);
                            $scope.otaconfig_show(client_id, '');
                        }
                    });
                }
            });
        };
        
        //delete room types
        $scope.delete_roomtype = function (id, client_id) {
            bootbox.confirm('Sure you want to delete this room type?<br />Once deleted, it cannot be undone!', function (result) {
                if (result == true)
                {
                    ClientsServices.deleteRoomType(id, function (response) {
                        if (response.data.status == true)
                        {
                            bootbox.alert(response.data.message);
                            $scope.room_types_show(client_id, '');
                        } else {
                            bootbox.alert(response.data.message);
                            $scope.room_types_show(client_id, '');
                        }
                    });
                }
            });
        }
        //type of dow fetch
        
        
        $scope.addAsCompetitor = function (hotel_id,name,index) {
            bootbox.confirm('Sure you want to add <strong>'+name+'</strong> as a competitor?', function (result) {
                if (result == true)
                {
                    ClientsServices.addAsCompetitor($scope.client_id,hotel_id, function (response) {
                        bootbox.alert(response.data.message);
                        if (response.data.status == true) {
                            var c = $scope.competitors_suggestions.splice(index,1);
                            $scope.competitors = $scope.competitors.concat(c);
                            $scope.$apply();
                        }
                    });
                }
            });
        };


        //save dow definations
        $scope.saveDow = function () {
            console.log($scope.dows);
            $scope.loading_msg = true;
            ClientsServices.saveDow($scope.client_id, {dows:$scope.dows}, function (response) {
                $scope.loading_msg = false;
                if (response.data.status == true)
                {
                    $scope.dow_data = true;
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;

                } else {
                    $scope.dow_data = true;
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message = response.data.message;
                }
            });
        };

        //add user modal
        $scope.addClientUser = function (id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/clients/modals/clients.user.add.html',
                controller: 'UserAddController',
                resolve: {
                    data: function () {
                        return {
                            client_id: $scope.client_id,
                            modal_type: 'new'
                        };
                    }
                }
            });
            
            modalInstance.result.then(function(user,key){
                $scope.user_account_data.push(user);
            }, function() {
                
            });
        };

        //edit user modal
        $scope.editClientUser = function (data,index) {
            
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/clients/modals/clients.user.add.html',
                controller: 'UserAddController',
                resolve: {
                    data: function () {
                        return {
                            client_id: $scope.client_id,
                            user: data,
                            modal_type: 'edit'
                        };
                    }
                }
            });
            
            modalInstance.result.then(function(user){
                $scope.user_account_data[index] = user;
            }, function(user) {
            $scope.user_account_data[index] = user;
            });
        };
        
        $scope.deleteClientUser = function(id,index) {
            bootbox.confirm('Sure you want to delete this user?', function(status){
                if(status) {
                    ClientsServices.deleteUser(id,function(response){
                        bootbox.alert(response.data.message);
                        if(response.data.status) {
                            $scope.user_account_data.splice(index, 1);
                        }
                    });
                }
            });
        };

        //add OTA modal
        $scope.otaModal = function (setup) {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/clients/modals/clients.otaconfig.add.html',
                controller: 'OtaConfigController',
                resolve: {
                    value: function () {
                        return {
                            setup: setup,
                            client_id: $scope.client_id,
                            modal_type: 'new',
                            hotels:$scope.tempHotels,
                        }
                    }
                }
            });
            modalInstance.result.then(function(mapping){
                console.log(mapping);
                if(setup) {
                    //mapping.system_record = mapping.system_name_data;
                    mapping.client_ota = mapping.client_ota;
                    mapping.system_ota_id = mapping.ota_name.id;
                    mapping.system_name = mapping.ota_name.name;
                    mapping.type = mapping.type_name;
                    mapping.hotel_id = mapping.hotel_id;
                    $scope.newClientAdd.otas.staah.push(mapping);
                    console.log(JSON.stringify($scope.newClientAdd.otas.staah));
                }
                else {
                    $scope.ota_config_data.push(mapping);
                }
            }, function() {
                
            });
        };

        //edit OTA modal
        $scope.editOtaModal = function (data,setup,index) {
            $scope.return_ota = {
                ota_data: data,
                modal_type: 'edit_ota',
                setup:setup
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/clients/modals/clients.otaconfig.add.html',
                controller: 'OtaConfigController',
                resolve: {
                    value: function () {
                        return $scope.return_ota;
                    }
                }
            });
            modalInstance.result.then(function(mapping){
                if(setup) {
                    //mapping.system_record = mapping.system_name_data;
                    mapping.name = mapping.client_room_type;
                    mapping.system_id = mapping.system_record.id;
                    $scope.newClientAdd.otas.staah[index] = mapping;
                }
                else {
                    $scope.ota_config_data[index] = mapping;
                }
            }, function() {
                
            });
        };
        
        $scope.setupRemoveOTA = function(setup,id,index) {
            bootbox.confirm('Sure you want to remove this mapping record?', function(status){
                if(status) {
                    if(setup) {
                        $scope.newClientAdd.otas.staah.splice(index,1);
                        $scope.$apply();
                    }
                    else {
                        ClientsServices.deleteOtaMapping(id, function (response) {
                            $scope.ota_config_data.splice(index,1);
                            $scope.$apply();
                            bootbox.alert(response.data.message);
                        });
                    }
                }
            });
        };

        //add room type modal
        $scope.roomTypeModal = function (setup) {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/clients/modals/clients.roomtype.add.html',
                controller: 'roomTypesController',
                resolve: {
                    value: function () {
                        return {
                            client_id:$scope.client_id,
                            modal_type:'new',
                            hotels:$scope.tempHotels,
                            setup:setup
                        };
                    }
                }
            });
            modalInstance.result.then(function(mapping){
                if(setup) {
                    //mapping.system_record = mapping.system_name_data;
                    mapping.name = mapping.client_room_type;
                    mapping.system_id = mapping.system_record.id;
                    $scope.newClientAdd.roomtypes.push(mapping);
                }
            }, function() {
                
            });
        };

        //edit room type modal
        $scope.editRoomTypeModal = function (mapping,setup,index) {
            $scope.return_roomtype = {
                roomtypesmap_data: mapping,
                modal_type: 'edit_roomtypes',
                setup: setup,
                client_id: $scope.client_id,
                hotels:$scope.tempHotels
            };
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/clients/modals/clients.roomtype.add.html',
                controller: 'roomTypesController',
                resolve: {
                    value: function () {
                        return $scope.return_roomtype;
                    }
                }
            });
            modalInstance.result.then(function(mapping){
                if(setup) {
                    //mapping.system_record = mapping.system_name_data;
                    mapping.name = mapping.client_room_type;
                    mapping.system_id = mapping.system_record.id;
                    $scope.newClientAdd.roomtypes[index] = mapping;
                }
                else {
                    mapping.system_name = mapping.system_record.name;
                    mapping.room_type_id = mapping.system_name_data;
                    $scope.roomtypes_data[index] = mapping;
                    console.log($scope.roomtypes_data);
                }
            }, function() {
                
            });
        };
        
        $scope.setupRemoveRoomType = function(index) {
            bootbox.confirm('Sure you want to remove this mapping record?', function(status){
                if(status) {
                    $scope.newClientAdd.roomtypes.splice(index,1);
                    $scope.$apply();
                }
            });
        };

        //add Event modal
        $scope.eventModal = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/clients/modals/clients.event.add.html',
                controller: 'eventShowController',
                resolve: {
                    value: function () {
                        return {
                            client_id: $scope.client_id,
                            modal_type: 'new_event'
                        };
                    }
                }
            });
            modalInstance.result.then(function(mapping){
                $scope.events.push(mapping);
            }, function() {
                
            });
        };

        //edit Event modal
        $scope.editEventModal = function (data,index) {
            $scope.return_event = {
                event_data: data,
                modal_type: 'edit_event'
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/clients/modals/clients.event.add.html',
                controller: 'eventShowController',
                resolve: {
                    value: function () {
                        return $scope.return_event;
                    }
                }
            });
            modalInstance.result.then(function(mapping){
                $scope.events[index] = mapping;
            }, function() {
                
            });
        };

        //add quality metrics modal
        $scope.qualityMetricsModal = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/clients/modals/clients.qualitymetrics.add.html',
                controller: 'qualitymatController',
                resolve: {
                    value: function () {
                        return {
                            qm_data: {},
                            modal_type: 'new_qm',
                            client_id: $scope.client_id,
                            hotels:$scope.hotels
                        };
                    }
                }
            });
            modalInstance.result.then(function(mapping){
                console.log(mapping);
                $scope.clients_qm.push(mapping);
            }, function() {
                
            });
        };

        //edit quality metrics modal
        $scope.editQualityMetricsModal = function (data,index) {
            $scope.return_qm = {
                qm_data: data,
                modal_type: 'edit_qm',
                client_id: $scope.client_id,
                hotels:$scope.hotels
            };
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/clients/modals/clients.qualitymetrics.add.html',
                controller: 'qualitymatController',
                resolve: {
                    value: function () {
                        return $scope.return_qm;
                    }
                }
            });
            modalInstance.result.then(function(mapping){
                $scope.client_qm[index] = mapping;
            }, function() {
                
            });
        };

        //add competitor modal
        $scope.competitorModal = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/clients/modals/clients.competitor.add.html',
                controller: 'competitorsController',
                resolve: {
                    value: function () {
                        return { 
                            client_id:$scope.client_id,
                            city:$scope.client.city
                        }
                    }
                }
            });
        };

        //add season modal
        $scope.seasonModal = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/clients/modals/clients.season.add.html',
                controller: 'seasonController',
                resolve: {
                    value: function () {
                        return $scope.client_id;
                    }
                }
            });
            modalInstance.result.then(function(mapping){
                $scope.seasonality_definitions.push(mapping);
            }, function() {
                
            });
        };

        //edit season modal
        $scope.editSeasonModal = function (data,index) {
            $scope.return_season = {
                season_data: data,
                modal_type: 'edit_season'
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/clients/modals/clients.season.add.html',
                controller: 'seasonController',
                resolve: {
                    value: function () {
                        return $scope.return_season;
                    }
                }
            });
            modalInstance.result.then(function(mapping){
                $scope.seasonality_definitions[index] = mapping;
            }, function() {
                
            });
        }

        //reload user data
        $rootScope.$on('reloadUsersData', function (event, id) {
            $scope.userac_show(id);
        });
        //reload event data
        $rootScope.$on('reloadEventData', function (event, id) {
            $scope.events_show(id);
        });
        //reload quality metrics data
        $rootScope.$on('reloadQMData', function (event, id) {
            $scope.quality_met(id);
        });
        //reload seson data
        $rootScope.$on('reloadSeasonData', function (event, id) {
            $scope.seasonality(id);
        });
        //reload room types data
        $rootScope.$on('reloadRoomTypesData', function (event, id) {
            $scope.room_types_show(id, 'reloadClients');
        });
        //reload ota data
        $rootScope.$on('reloadOtaData', function (event, id) {
            $scope.otaconfig_show(id, 'reloadClients');
        });
        //reload competitor data
        $rootScope.$on('reloadCompetitorData', function (event, id) {
            $scope.competitor(id);
        });

        $scope.loadAllUsers = function () {
            $scope.userac_show();
        }

        $scope.resetting = {};


        $scope.addRateShopping = function (valid) {
            $scope.rateshopping_settings = 'loading';
            ClientsServices.editPreSettingData($scope.rateShopSettings, $scope.client_id, function (response) {
                $scope.rs_message = response.data.message;
                if(response.data.status == true) {
                    $scope.rateshopping_settings = 'success';
                }
                else {
                    $scope.rateshopping_settings = 'error';
                }
            })
        };

        //add run rate shop data
        $scope.postRunRate = function () {
            $scope.fetchingRates = true;
            var data = [$scope.newClientAdd.hotel_details.id];
            data = data.concat($scope.newClientAdd.competitors);
            console.log(data);
            ClientsServices.postRunRate({hotels:data},function (response) {
                if(response.data.status == true) {
                    if(response.data.queueid === undefined) {
                        $scope.fetchingRates = false;
                        $scope.queued = false;
                        $scope.fetchedRates = true;
                        $scope.newClientAdd.roomtypes = response.data.room_types;
                        console.log(JSON.stringify($scope.newClientAdd));
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
                            $scope.postRunRate();
                        },response.data.timerem*1000);
                    }
                }
            });
        };

        $scope.uploadBookingFile = function () {
            ClientsServices.uploadBookingFile(function (response) {
            });
        };

        $scope.bookingsUploader = new FileUploader({
            url: $rootScope.backend2+'/clients/importBookings',
            removeAfterUpload: true
        });
        
        $scope.files = [];
        var element = document.getElementById('bookings_file');
        if(element != undefined) {
            element.addEventListener('change', function(e) {
                var files = e.target.files;
                uiUploader.addFiles(files);
                $scope.files = uiUploader.getFiles();
                $scope.$apply();
            });
        }
        
        $scope.importBookings = function () {
            $scope.cm_import_settings = 'loading';
            uiUploader.startUpload({
                url: $rootScope.backend2+'/clients/importBookings',
                concurrency: 2,
                data: {
                    client_id:$scope.client_id
                },
                onProgress: function(file) {
                    $scope.$apply();
                },
                onCompleted: function(file, response) {
                    response = JSON.parse(response);
                    console.log(response);
                    $scope.cm_import_message = response.message;
                    if(response.status == true) {
                        $scope.cm_import_settings = 'success';
                    }
                    else {
                        $scope.cm_import_settings = 'error';
                    }
                    $scope.$apply();
                }
            });
        };

        $scope.saveChannelManagerSettings = function (valid) {
            $scope.cm_settings = 'loading';
            ClientsServices.saveChannelManagerSettings($scope.cm_form, $scope.client_id, function (response) {
                $scope.cm_message = response.data.message;
                if(response.data.status == true) {
                    $scope.cm_settings = 'success';
                }
                else {
                    $scope.cm_settings = 'error';
                }
            })
        };
    
        $scope.downloadClientMI = function() {
            console.log( $scope.gridMISettings);
            $timeout(function() {
                var name = $scope.client.property_name.toLowerCase();
                window.location = $rootScope.backend2+'/export/clientMarketIntel/?client_id='+$scope.client_id;
            },1000);
        };
    
        $scope.downloadClientIsell = function() {
            console.log( $scope.gridMISettings);
            $timeout(function() {
                var name = $scope.client.property_name.toLowerCase();
                window.location = $rootScope.backend2+'/export/clientiSell/?client_id='+$scope.client_id;
            },1000);
        };
    
        $scope.downloadClientRRO = function() {
            console.log( $scope.gridMISettings);
            $timeout(function() {
                var name = $scope.client.property_name.toLowerCase();
                window.location = $rootScope.backend2+'/export/clientRRO/?client_id='+$scope.client_id;
            },1000);
        };
        
        $scope.overrideRate = function (record,key) {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/clients/modals/clients.rate.override.html',
                controller: 'RateOverrideController',
                resolve: {
                    clientDetails: function () {
                        return $scope.client;
                    },
                    record: function() {
                        return record;
                    }
                }
            });
            
            modalInstance.result.then(function(rate,key){
                $scope.rro.records[key] = rate;
            }, function() {
                
            });
        };
        
        $scope.pushRate = function (record,key) {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/clients/modals/clients.rate.push.html',
                controller: 'RatePushController',
                resolve: {
                    clientDetails: function () {
                        return $scope.client;
                    },
                    record: function() {
                        return record;
                    }
                }
            });
            
            modalInstance.result.then(function(rate,key){
                $scope.rro.records[key] = rate;
            }, function() {
                
            });
        };
        
        //Charting codes
        $scope.$watch(function(){
            return $rootScope.enableCharts;
        },function(n,o){
            if(n === true) {
                //$scope.renderClientCharts();
            }
        });
        
        $scope.renderClientCharts = function (charts) {
            $timeout(function(){
                
                if($rootScope.enableCharts === false) { return false; }

                console.log(charts);
                
                //Business On Books
                Highcharts.chart('chart_bob', {
                    chart: {
                        //zoomType: 'xy'
                    },
                    colors:['#7cb5ec','#FCB322','#FF6C60'],
                    title: {
                        text: 'Business On Books'
                    },
                    subtitle: {
                        //text: 'Source: WorldClimate.com'
                    },
                    plotOptions: {
                        spline: {
                            marker: {
                                radius: 4,
                                lineColor: '#666666',
                                lineWidth: 1
                            }
                        }
                    },
                    xAxis: [{
                            categories: charts.bob.dates,
                            crosshair: true
                        }],
                    yAxis: [{// Primary yAxis
                            labels: {
                                format: 'Rs.{value}',
                                style: {
                                    color: Highcharts.getOptions().colors[2]
                                }
                            },
                            title: {
                                text: 'OTA Revenue',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            opposite: true

                        }, {// Secondary yAxis
                            gridLineWidth: 0,
                            title: {
                                text: 'OTA Sold',
                                style: {
                                    color: Highcharts.getOptions().colors[2]
                                }
                            },
                            labels: {
                                format: '{value}',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            }

                        }, {// Secondary yAxis
                            gridLineWidth: 0,
                            title: {
                                text: 'Event',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: '{value}',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            }

                        }],
                    tooltip: {
                        shared: true
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'left',
                        x: 80,
                        verticalAlign: 'top',
                        y: 55,
                        floating: true,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                    },
                    series: [{
                            name: 'OTA Sold',
                            type: 'column',
                            yAxis: 1,
                            data: charts.bob.sales,
                            tooltip: {
                                //valueSuffix: ' mm'
                            }

                        }, {
                            name: 'OTA Revenue',
                            type: 'spline',
                            data: charts.bob.revenue,
                            tooltip: {
                                valuePrefix: 'Rs.'
                            }
                        }, {
                            name: 'Event',
                            type: 'spline',
                            marker: {
                                symbol: 'square'
                            },
                            data: charts.bob.event,
                            tooltip: {
                                valuePrefix: ''
                            }
                        }]
                });
                
                //Pickup Analysis
                Highcharts.chart('chart_pickup_analysis', {
                    chart: {
                        type: 'area'
                    },
                    plotOptions: {
                        area: {
                            stacking: 'normal'
                        }
                    },
                    colors:['#2f5597','#ffc000','#ff6c60'],
                    title: {
                        text: 'Pickup Analysis'
                    },
                    xAxis: {
                        categories: charts.pickup_analysis.dates
                    },
                    credits: {
                        enabled: false
                    },
                    tooltip: {
                        shared: true
                    },
                    series: [{
                        name: 'OB',
                        data: charts.pickup_analysis.ob
                    }, {
                        name: 'Pickup',
                        data: charts.pickup_analysis.pickup
                    }, {
                        name: 'Drops',
                        data: charts.pickup_analysis.drops
                    }]
                });
                
                //Rate Comparison
                Highcharts.chart('chart_rate_comparison', {
                    chart: {
                        zoomType: 'xy'
                    },title: {
                        text: 'Rate Comparison'
                    },
                    colors:['#808080','#ed7d31'],
                    xAxis: {
                        categories: charts.rate_comparison.categories
                    },
                    yAxis: {
                        labels: {
                            format: 'Rs.{value}',
                            style: {
                                color: Highcharts.getOptions().colors[2]
                            }
                        },
                        title: {
                            text: 'Rates',
                            style: {
                                color: Highcharts.getOptions().colors[2]
                            }
                        }
                    },
                    tooltip: {
                        crosshairs: true,
                        shared: true,
                        //valueSuffix: '°C'
                    },
                    legend: {
                    },
                    series: charts.rate_comparison.series
                });
                /*Highcharts.chart('chart_rate_comparison', {
                    chart: {
                        zoomType: 'xy'
                    },
                    colors:['#808080','#ed7d31'],
                    title: {
                        text: 'Rate Comparison'
                    },
                    xAxis: [{
                            categories: charts.rate_comparison.dates,
                        }],
                    yAxis: [{// Primary yAxis
                            labels: {
                                format: 'Rs.{value}',
                                style: {
                                    color: Highcharts.getOptions().colors[2]
                                }
                            },
                            title: {
                                text: 'Rates',
                                style: {
                                    color: Highcharts.getOptions().colors[2]
                                }
                            }

                        }
                    ],
                    tooltip: {
                        shared: true
                    },
                    series: [{
                            name: 'Market Trend',
                            type: 'area',
                            data: charts.rate_comparison.market,
                            tooltip: {
                                valuePrefix: 'Rs.'
                            }

                        }, {
                            name: $scope.client.property_name,
                            type: 'spline',
                            data: charts.rate_comparison.hotel,
                            tooltip: {
                                valuePrefix: 'Rs.'
                            }
                        }
                    ]
                });*/
                
                //OTA Contribution
                var series = [];
                series.push({
                        name: 'ADR OTB',
                        type: 'spline',
                        data: charts.ota_contribution.adr,
                        yAxis: 0,
                        tooltip: {
                            valuePrefix: 'Rs.'
                        }
                });
                angular.forEach(charts.ota_contribution.data,function(value,key){
                    series.push({
                        name: value.label,
                        type: 'area',
                        data: value.count,
                        yAxis: 1,
                        tooltip: {
                            valuePrefix: ''
                        }
                    });
                }) ;
                
                Highcharts.chart('chart_ota_contribution', {
                    chart: {
                        //zoomType: 'xy'
                    },
                    colors:['#843c0c','#ed7d31','#ffc000','#70ad47','#7cb5ec','#FCB322','#FF6C60'],
                    title: {
                        text: 'OTA Contribution'
                    },
                    xAxis: [{
                            categories: charts.ota_contribution.dates,
                            crosshair: true
                        }],
                    yAxis: [{// Primary yAxis
                            labels: {
                                format: 'Rs.{value}',
                                style: {
                                    color: Highcharts.getOptions().colors[2]
                                }
                            },
                            title: {
                                text: 'ADR',
                                style: {
                                    color: Highcharts.getOptions().colors[2]
                                }
                            },
                            opposite: true

                        }, {// Secondary yAxis
                            gridLineWidth: 0,
                            title: {
                                text: 'OTA Sold',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: '{value}',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            }

                        }],
                    tooltip: {
                        shared: true
                    },
                    series: series
                });
                
                //Room nights stacked bar chart
                Highcharts.chart('room_nights_stacked_bar', {
                    chart: {
                        type: 'column',
                        spacingBottom: 100,
                        //height: '500px'
                    },
                    title: {
                        text: 'Room Nights'
                    },
                    subtitle: {
                        text: charts.room_nights_stacked_bar.subtitle
                    },
                    xAxis: {
                        categories: charts.room_nights_stacked_bar.categories
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Total room nights'
                        },
                        stackLabels: {
                            enabled: false,
                            style: {
                                fontWeight: 'bold',
                                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                            }
                        }
                    },
                    legend: {
                        align: 'left',
                        x: 0,
                        verticalAlign: 'bottom',
                        y: 60,
                        floating: false,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                        borderColor: '#CCC',
                        borderWidth: 1,
                        shadow: false
                    },
                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            dataLabels: {
                                //enabled: true,
                                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                            }
                        }
                    },
                    series: charts.room_nights_stacked_bar.values
                });
                
                Highcharts.chart('room_nights_horizontal_bar', {
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: 'Room Nights: LY v/s TY'
                    },
                    subtitle: {
                        text: charts.room_nights_horizontal_bar.subtitle
                    },
                    xAxis: {
                        categories: charts.room_nights_horizontal_bar.categories,
                        title: {
                            text: null
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '',
                            align: 'high'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    tooltip: {
                        valueSuffix: ''
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -40,
                        y: 80,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                        shadow: true
                    },
                    credits: {
                        enabled: false
                    },
                    series: charts.room_nights_horizontal_bar.values
                });
                
                var colors = Highcharts.getOptions().colors,
                categories = charts.room_nights_donut.categories,
                data = charts.room_nights_donut.values,
                contributionData = [],
                i,
                j,
                dataLen = data.length,
                drillDataLen,
                brightness;

                // Build the data arrays
                for (i = 0; i < dataLen; i += 1) {

                    // add version data
                    contributionData.push({
                        name: data[i].name,
                        y: data[i].y,
                        color: Highcharts.Color(data[i].color).brighten(brightness).get()
                    });
                }

                // Create the chart
                Highcharts.chart('room_nights_donut', {
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: 'Room Nights: OTA Contribution'
                    },
                    subtitle: {
                        text: charts.room_nights_donut.subtitle
                    },
                    yAxis: {
                        title: {
                            text: 'Total percent market share'
                        }
                    },
                    plotOptions: {
                        pie: {
                            shadow: false,
                            center: ['50%', '50%'],
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
                        }
                    },
                    tooltip: {
                        //valueSuffix: '%'
                    },
                    series: [{
                            name: 'Contribution',
                            data: contributionData,
                            size: '80%',
                            innerSize: '60%',
                            dataLabels: {
                                formatter: function () {
                                    // display only if larger than 1
                                    return this.y > 1 ? '<b>' + this.point.name + ':</b> ' +
                                            this.y + '%' : null;
                                }
                            },
                            id: 'versions'
                    }],
                    responsive: {
                        rules: [{
                                condition: {
                                    maxWidth: 400
                                },
                                chartOptions: {
                                    series: [{
                                            id: 'versions',
                                            dataLabels: {
                                                enabled: false
                                            }
                                        }]
                                }
                            }]
                    }
                });
                
                //Revenue stacked bar chart
                Highcharts.chart('room_revenue_stacked_bar', {
                    chart: {
                        type: 'column',
                        spacingBottom: 100
                    },
                    title: {
                        text: 'Room Revenue'
                    },
                    subtitle: {
                        text: charts.revenue_stacked_bar.subtitle
                    },
                    xAxis: {
                        categories: charts.revenue_stacked_bar.categories
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Total revenue'
                        },
                        stackLabels: {
                            enabled: false,
                            style: {
                                fontWeight: 'bold',
                                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                            }
                        }
                    },
                    legend: {
                        align: 'left',
                        x: 0,
                        verticalAlign: 'bottom',
                        y: 60,
                        floating: false,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                        borderColor: '#CCC',
                        borderWidth: 1,
                        shadow: false
                    },
                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            dataLabels: {
                                enabled: false,
                                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                            }
                        }
                    },
                    series: charts.revenue_stacked_bar.values
                });
                
                Highcharts.chart('room_revenue_horizontal_bar', {
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: 'Room Revenue: LY v/s TY'
                    },
                    subtitle: {
                        text: charts.revenue_horizontal_bar.subtitle
                    },
                    xAxis: {
                        categories: charts.revenue_horizontal_bar.categories,
                        title: {
                            text: null
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '',
                            align: 'high'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    tooltip: {
                        valueSuffix: ''
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -40,
                        y: 80,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                        shadow: true
                    },
                    credits: {
                        enabled: false
                    },
                    series: charts.revenue_horizontal_bar.values
                });
                
                var colors = Highcharts.getOptions().colors,
                categories = charts.revenue_donut.categories,
                data = charts.revenue_donut.values,
                contributionData = [],
                i,
                j,
                dataLen = data.length,
                drillDataLen,
                brightness;

                // Build the data arrays
                for (i = 0; i < dataLen; i += 1) {

                    // add version data
                    contributionData.push({
                        name: data[i].name,
                        y: data[i].y,
                        color: Highcharts.Color(data[i].color).brighten(brightness).get()
                    });
                }

                // Create the chart
                Highcharts.chart('room_revenue_donut', {
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: 'Room Revenue: OTA Contribution'
                    },
                    subtitle: {
                        text: charts.revenue_donut.subtitle
                    },
                    yAxis: {
                        title: {
                            text: 'Total percent market share'
                        }
                    },
                    plotOptions: {
                        pie: {
                            shadow: false,
                            center: ['50%', '50%'],
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
                        }
                    },
                    tooltip: {
                        //valueSuffix: '%'
                    },
                    series: [{
                            name: 'Contribution',
                            data: contributionData,
                            size: '80%',
                            innerSize: '60%',
                            dataLabels: {
                                formatter: function () {
                                    // display only if larger than 1
                                    return this.y > 1 ? '<b>' + this.point.name + ':</b> ' +
                                            this.y + '%' : null;
                                }
                            },
                            id: 'versions'
                    }],
                    responsive: {
                        rules: [{
                                condition: {
                                    maxWidth: 400
                                },
                                chartOptions: {
                                    series: [{
                                            id: 'versions',
                                            dataLabels: {
                                                enabled: false
                                            }
                                        }]
                                }
                            }]
                    }
                });
                
                //RPD v/s ADR
                Highcharts.chart('rpd_vs_adr', {
                    chart: {
                        zoomType: 'xy'
                    },
                    title: {
                        text: 'RPD v/s ADR'
                    },
                    subtitle: {
                        text: charts.rpd_adr.subtitle
                    },
                    xAxis: [{
                        categories: charts.rpd_adr.categories,
                        crosshair: true
                    }],
                    yAxis: [{ // Primary yAxis
                        labels: {
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
                        title: {
                            text: 'Rooms',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        }
                    },
                    { // Secondary yAxis
                        title: {
                            text: 'Rate',
                            style: {
                                color: Highcharts.getOptions().colors[0]
                            }
                        },
                        labels: {
                            style: {
                                color: Highcharts.getOptions().colors[0]
                            }
                        },
                        opposite: true
                    }],
                    tooltip: {
                        shared: true
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'left',
                        x: 120,
                        verticalAlign: 'top',
                        y: 100,
                        floating: true,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                    },
                    series: [{
                        name: 'RPD',
                        type: 'spline',
                        data: charts.rpd_adr.values.rpd

                    }, {
                        name: 'ADR',
                        type: 'spline',
                        yAxis: 1,
                        data: charts.rpd_adr.values.adr
                    }]
                });
                
                //Arrival v/s LOS
                Highcharts.chart('arrival_vs_los', {
                    chart: {
                        zoomType: 'xy'
                    },
                    title: {
                        text: 'Arrival v/s LOS'
                    },
                    subtitle: {
                        text: charts.arrival_los.subtitle
                    },
                    xAxis: [{
                        categories: charts.arrival_los.categories,
                        crosshair: true
                    }],
                    yAxis: [{ // Primary yAxis
                        labels: {
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
                        title: {
                            text: 'Arrivals Per Day',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        }
                    },
                    { // Secondary yAxis
                        title: {
                            text: 'Average Length of Stay',
                            style: {
                                color: Highcharts.getOptions().colors[0]
                            }
                        },
                        labels: {
                            style: {
                                color: Highcharts.getOptions().colors[0]
                            }
                        },
                        opposite: true
                    }],
                    tooltip: {
                        shared: true
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'left',
                        x: 120,
                        verticalAlign: 'top',
                        y: 100,
                        floating: true,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                    },
                    series: [ {
                        name: 'LOS',
                        type: 'spline',
                        yAxis: 1,
                        data: charts.arrival_los.values.los
                    },
                    {
                        name: 'Arrivals',
                        type: 'spline',
                        data: charts.arrival_los.values.arrivals

                    }]
                });
                
                //Day of Week Contribution
                /*Highcharts.chart('dow_contrib', {
                    chart: {
                        type: 'column',
                        spacingBottom: 100
                    },
                    title: {
                        text: 'DOW Contribution'
                    },
                    subtitle: {
                        text: charts.dow_contrib.subtitle
                    },
                    xAxis: {
                        categories: charts.dow_contrib.categories
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Percentage'
                        },
                        stackLabels: {
                            enabled: false,
                            style: {
                                fontWeight: 'bold',
                                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                            }
                        }
                    },
                    legend: {
                        align: 'left',
                        x: 0,
                        verticalAlign: 'bottom',
                        y: 60,
                        floating: false,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                        borderColor: '#CCC',
                        borderWidth: 1,
                        shadow: false
                    },
                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '{series.name}: {point.y}%'
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            dataLabels: {
                                enabled: false,
                                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                            }
                        }
                    },
                    series: charts.dow_contrib.values
                });*/
                
                //Pace Analysis
                Highcharts.chart('pace_analysis', {

                    title: {
                        text: 'Pace Analysis'
                    },
                    subtitle: {
                        text: charts.pace_analysis.subtitle
                    },
                    yAxis: {
                        title: {
                            text: 'Percent Contribution'
                        },
                        labels: {
                            overflow: 'justify',
                            //format: '{value}%',
                        }
                    },
                    xAxis: {
                        //categories: charts.pace_analysis.categories,
                        title: {
                            text: 'Days to Arrival'
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'center',
                        verticalAlign: 'middle'
                    },
                    series: charts.pace_analysis.values

                });
                
                //OTA Rate Volume Matrix
                /*Highcharts.chart('ota_rate_volume_matric', {
                    chart: {
                        type: 'scatter',
                        plotBorderWidth: 1,
                        spacingBottom: 100,
                        zoomType: 'xy'
                    },
                    title: {
                        text: 'OTA Rate Volume Matrix'
                    },
                    subtitle: {
                        text: charts.rv_matrix.subtitle
                    },
                    xAxis: {
                        gridLineWidth: 1,
                        title: {
                            enabled: true,
                            text: 'Volume'
                        },
                        startOnTick: true,
                        endOnTick: true,
                        showLastLabel: true,
                        plotLines: [{
                            color: 'black',
                            dashStyle: 'dot',
                            width: 2,
                            value: 165,
                            zIndex: 3
                        }]
                    },
                    yAxis: {
                        title: {
                            text: 'Rate'
                        },
                        plotLines: [{
                            color: 'black',
                            dashStyle: 'dot',
                            width: 2,
                            value: 56,
                            zIndex: 3
                        }]
                    },
                    legend: {
                        layout: 'horizontal',
                        align: 'left',
                        verticalAlign: 'bottom',
                        x: 50,
                        y: 70,
                        floating: true,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
                        borderWidth: 1
                    },
                    plotOptions: {
                        scatter: {
                            marker: {
                                radius: 5,
                                states: {
                                    hover: {
                                        enabled: true,
                                        lineColor: 'rgb(100,100,100)'
                                    }
                                }
                            },
                            states: {
                                hover: {
                                    marker: {
                                        enabled: false
                                    }
                                }
                            },
                            tooltip: {
                                headerFormat: '<b>{series.name}</b><br>',
                                pointFormat: 'Volume {point.x}<br>ADR {point.y}'
                            }
                        }
                    },
                    series: charts.rv_matrix.series
                });*/
                
                Highcharts.chart('rate_pace_chart', {

                    title: {
                        text: 'Rate Band v/s Rates'
                    },

                    xAxis: {
                        categories: charts.rate_pace.categories
                    },

                    yAxis: {
                        title: {
                            text: null
                        }
                    },

                    tooltip: {
                        crosshairs: true,
                        shared: true,
                        //valueSuffix: '°C'
                    },

                    legend: {
                    },
                    series: charts.rate_pace.series
                });
                
            },500);
        };
        
        $scope.distanceRange = [0,10];
        
        $scope.fetchCMRoomTypes = function() {
            
            bootbox.confirm('Sure you want to fetch room types from channel manager?',function(status){
                if(status) {
                    ClientsServices.getChannelManagerRoomTypes($scope.client_id,function(response){
                        if(response.data.status == true) {
                            if(response.data.mappings.length > 0) {
                                $scope.roomtypes_data = $scope.roomtypes_data.concat(response.data.mappings);
                                $timeout(function(){
                                    $scope.$apply();
                                },200);
                            }
                            else {
                                bootbox.alert('No new room types detected.');
                            }
                        }
                        else {
                            bootbox.alert(response.data.message);
                        }
                    });
                }
            });
            
        };
        
        $scope.pushAll = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/clients/modals/clients.rate.pushall.html',
                controller: 'RatePushAllController',
                resolve: {
                    clientDetails: function () {
                        return $scope.client;
                    }
                }
            });
            
            modalInstance.result.then(function(){
            }, function() {
                
            });
        };
        
        $scope.takeOverClient = function() {
            
            var admin_token = localStorage.getItem('satellizer_token');
            localStorage.setItem('satellizer_token_admin',admin_token);
            
            ClientsServices.takeover($scope.client_id,function(response){
                if(response.data.status == true) {
                    localStorage.setItem('satellizer_token',response.data.token);
                    localStorage.setItem('client_id',$scope.client_id);
                    localStorage.setItem('current_hotel_name',$scope.client.property_name);
                    $rootScope.current_hotel_name = $scope.client.property_name;
                    $rootScope.sessionData.role = 'admin_client';
                    $location.path('dashboard');
                }
            });
            
        };
        
        $scope.loadiSellModal = function(recordx,competitors,otas,mode,client_id) {
        console.log(client_id);
            if(mode == 'bookings') {
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
                    client_id: function() {
                        return $scope.client_id;
                    },
                    otas: function () {
                        return otas;
                    },
                    mode: function() {
                        return mode;
                    }
                }
            });

            modalInstance.result.then(function(){
            }, function() {

            });
        };
        
        $scope.refreshData = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/clients/modals/clients.refresh.html',
                controller: 'RefreshController',
                size:'sm',
                resolve: {
                    client: function () {
                        return $scope.client;
                    }
                }
            });
            
            modalInstance.result.then(function(){
            }, function() {
                
            });
        };

}]);

//add user data controller
app.controller('UserAddController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'UsersServices', '$compile', 'FileUploader', 'data', '$rootScope', function ($scope, $rootScope, $uibModalInstance, $window, UsersServices, $compile, FileUploader, data, $rootScope) {
        
    if (data.modal_type == 'edit') {
        $scope.predit = angular.copy(data.user);
        $scope.user_data = data.user;
        $scope.client_id = data.client_id;
        $scope.modal_title = data.user.account_fname+' '+data.user.account_lname+' - Edit User';
    } else {
        $scope.user_data = { account_id:'new' };
        $scope.client_id = data.client_id;
        $scope.modal_title = 'Add New User';
    }

    $scope.addUserData = function (valid) {
        if(valid) {
            $scope.loading_msg = true;
            UsersServices.postClientUser($scope.user_data, $scope.client_id, function (response) {
                $scope.loading_msg = false;
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
                    if(data.modal_type != 'edit') {
                        $scope.user_data.account_id = response.data.id;
                        $scope.user_data.account_regdate = response.data.account_regdate;
                    }
                    setTimeout(function () {
                        $uibModalInstance.close($scope.user_data);
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

//add ota data controller
app.controller('OtaConfigController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'ClientsServices', '$compile', 'FileUploader', 'value', '$rootScope', '$http', function ($scope, $rootScope, $uibModalInstance, $window, ClientsServices, $compile, FileUploader, value, $rootScope, $http) {

    $scope.client_id = value.client_id;
    $scope.modal_type = value.modal_type;
    
    console.log(value);
    
        if (value.modal_type == 'edit_ota') {
            if(value.setup) {
                
            }
            else {
                
            }
            $scope.ota_data = value.ota_data;
            $scope.client_id = value.ota_data.client_id;
            $scope.ota_name_data = [{id:value.ota_data.ota_id, name:value.ota_data.system_name }];
            $scope.ota_data.type_name = value.ota_data.type;
            $scope.modal_heading = 'Edit OTA Mapping';
        } else {
            $scope.modal_heading = 'Add OTA Mapping';
            $scope.ota_data = { id:'new' };
            $scope.hotels = value.hotels;
            $scope.hotelx = {};
        }

        $scope.searchType = function (keywords) {
            var params = {keywords: keywords};
            $scope.types = [{name: 'staah'}];
        };
        
        $scope.searchSystemOtaName = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend + '/setup/otasetup/getAllOtas',
                    {params: params}
            ).then(function (response) {
                $scope.ota_name_data = response.data.details;
            });
        };
        
        $scope.selectH = function(x) { $scope.hotelx = x; };
        
        $scope.selectOTA = function(ota) {
            $scope.ota_data.system_name = ota.name;
        };
        
        $scope.otaConfigAdd = function () {
            if(value.setup) {
                if(value.modal_type == 'new') {
                    $scope.ota_data.hotel_name = $scope.hotelx.name;
                    $scope.ota_data.hotel_id = $scope.hotelx.id;
                    $scope.ota_data.type = $scope.ota_data.type_name;
                }
                $uibModalInstance.close($scope.ota_data);
            }
            else {
                ClientsServices.postOtaConfig($scope.ota_data, $scope.client_id, function (response) {
                    if (response.data.status == true) {
                        $scope.success_msg = true;
                        $scope.danger_msg = false;
                        $scope.sub_message = response.data.message;
                        setTimeout(function () {
                            $uibModalInstance.close($scope.ota_data);
                        }, 1000);
                    } else {
                        $scope.success_msg = false;
                        $scope.danger_msg = true;
                        $scope.sub_message = response.data.message;
                    }
                });
            }
        };

        $scope.loading_msg = false;
        $scope.clientOtaMappingAdd = function () {
            $scope.loading_msg = true;
            ClientsServices.postClientOtaMap($scope.ota_data, $scope.client_id, function (response) {
                $scope.loading_msg = false;
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
                    if($scope.ota_data.id == 'new') {
                        $scope.ota_data.id = response.data.id;
                    }
                    setTimeout(function () {
                        $uibModalInstance.close($scope.ota_data);
                    }, 2000);
                } else {
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message = response.data.message;
                }
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);

//add room types controller
app.controller('roomTypesController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'ClientsServices', '$compile', 'FileUploader', 'value', '$rootScope', '$http', function ($scope, $rootScope, $uibModalInstance, $window, ClientsServices, $compile, FileUploader, value, $rootScope, $http) {

    $scope.client_id = value.client_id;
    $scope.modal_type = value.modal_type;
    
        if (value.modal_type == 'edit_roomtypes') {
            if(value.setup) {
                $scope.roomtypesmap_data = value.roomtypesmap_data;
                $scope.roomtypesmap_data.client_room_type = value.roomtypesmap_data.name;
                $scope.roomtypesmap_data.system_name_data = value.roomtypesmap_data.system_record;
                $scope.roomtypesmap_data.type_name = value.roomtypesmap_data.type;
            }
            else {
                $scope.roomtypesmap_data = value.roomtypesmap_data;
                $scope.roomtypesmap_data.system_name_data = value.roomtypesmap_data.room;
                $scope.roomtypesmap_data.type_name = value.roomtypesmap_data.type;
                $scope.client_id = value.roomtypesmap_data.client_id;
            }
        } else {
            $scope.roomtypesmap_data = {};
            $scope.hotels = value.hotels;
            $scope.hotels = //[{"id":"456412","rm_code":"510006","name":"Le Sutra The Indian Art Hotel","address":"14 Union Park, Khar (W), above Out of the Blue and Olive","city":{"id":"120058","parent":"120056","name":"MUMBAI","type":"city","status":"active"},"city_id":null,"state":{"id":"121684","parent":"119768","name":"Maharashtra","type":"state","status":"active"},"state_id":null,"zip":411515,"country":{"id":"119768","parent":"0","name":"India","type":"country","status":"active"},"country_id":null,"latitude":"19.0718","longitude":"72.8255","status":"active","regdate":"2017-05-02 14:38:47","author":"0","formatted_name":"Le Sutra The Indian Art Hotel, Mumbai, India, Maharashtra","getCountryData":{"id":"119768","parent":"0","name":"India","type":"country","status":"active"},"getStateData":{"id":"121684","parent":"119768","name":"Maharashtra","type":"state","status":"active"},"getCityData":{"id":"120058","parent":"120056","name":"MUMBAI","type":"city","status":"active"}},{"id":"432498","rm_code":"2160","name":"Ace Residency","address":"Opposite N.G.Complex ,Ashok Nagar","city":"Mumbai","city_id":null,"state":"Maharashtra","state_id":null,"zip":"400072","country":"India","country_id":null,"latitude":"19.1171","longitude":"72.8821","status":"active","regdate":"2017-05-02 13:33:20","author":"0","formatted_name":"Ace Residency, Mumbai, India, Maharashtra","getCountryData":{"id":"119768","parent":"0","name":"India","type":"country","status":"active"},"getStateData":{"id":"121684","parent":"119768","name":"Maharashtra","type":"state","status":"active"},"getCityData":{"id":"120058","parent":"120056","name":"MUMBAI","type":"city","status":"active"}},{"id":"432571","rm_code":"15009","name":"Ascot Hotel","address":"38 Garden Road","city":"Mumbai","city_id":null,"state":"Maharashtra","state_id":null,"zip":"400039","country":"India","country_id":null,"latitude":"18.9194","longitude":"72.8297","status":"active","regdate":"2017-05-02 13:33:31","author":"0","formatted_name":"Ascot Hotel, Mumbai, India, Maharashtra","getCountryData":{"id":"119768","parent":"0","name":"India","type":"country","status":"active"},"getStateData":{"id":"121684","parent":"119768","name":"Maharashtra","type":"state","status":"active"},"getCityData":{"id":"120058","parent":"120056","name":"MUMBAI","type":"city","status":"active"}}];
            $scope.hotelx = {};
        }
        
        $scope.roomtypesmap_data.capacity = parseInt($scope.roomtypesmap_data.capacity);
        
        $scope.searchType = function () {
            $scope.types = [{name: 'rateshopping'}, {name: 'staah'}];
        };
        
        $scope.searchSystemName = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend2 + '/setup/room_types/searchRoomtypesName',
                    {params: params}
            ).then(function (response) {
                $scope.roomtypesname_data = response.data.details;
            });
        };
        
        $scope.selectSystemRoomType = function(rt) {
            $scope.roomtypesmap_data.system_record = rt;
        };

        $scope.roomtypesAdd = function () {
            ClientsServices.postRoomTypes($scope.roomtypesmap_data, $scope.client_id, function (response) {
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
                    setTimeout(function () {
                        $uibModalInstance.close();
                    }, 1000);
                    $rootScope.$emit('reloadRoomTypesData', $scope.client_id);
                } else {
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message = response.data.message;
                    //$rootScope.$emit('reloadRoomTypesData', $scope.client_id);
                }
            });
        }
        
        $scope.selectH = function(x) { $scope.hotelx = x; }
        
        $scope.clientRoomtypesAdd = function () {
            if(value.setup) {
                if(value.modal_type == 'new') {
                    $scope.roomtypesmap_data.hotel_name = $scope.hotelx.name;
                    $scope.roomtypesmap_data.hotel_id = $scope.hotelx.id;
                    $scope.roomtypesmap_data.type = $scope.roomtypesmap_data.type_name;
                }
                $uibModalInstance.close($scope.roomtypesmap_data);
            }
            else {
                $scope.loading_msg = true;
                ClientsServices.postClientRoomTypes($scope.roomtypesmap_data, function (response) {
                    $scope.loading_msg = false;
                    if (response.data.status == true) {
                        $scope.success_msg = true;
                        $scope.danger_msg = false;
                        $scope.sub_message = response.data.message;
                        setTimeout(function () {
                            $uibModalInstance.close($scope.roomtypesmap_data);
                        }, 1000);
                    } else {
                        $scope.success_msg = false;
                        $scope.danger_msg = true;
                        $scope.sub_message = response.data.message;
                    }
                });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);

//add event controller
app.controller('eventShowController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'ClientsServices', '$compile', 'FileUploader', 'value', '$rootScope', '$http', function ($scope, $rootScope, $uibModalInstance, $window, ClientsServices, $compile, FileUploader, value, $rootScope, $http) {

        if (value.modal_type == 'edit_event') {
            $scope.event_data = value.event_data;
            $scope.client_id = value.event_data.client_id;
            $scope.event_heading = "Edit Event";
        } else {
            $scope.event_data = {};
            $scope.client_id = value.client_id;
            $scope.event_heading = "Add Event";
        }

        $scope.searchAreaImpact = function (keywords) {
            var params = {keywords: keywords};
            $scope.areas = [{name: 'Area'}, {name: 'City'}, {name: 'State'}];
        }
//        $scope.selectArea = function (item, model) {
//            $scope.area = item;
//        };
        $scope.addEvent = function () {
            ClientsServices.postEvent($scope.event_data, $scope.client_id, function (response) {
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
                    setTimeout(function () {
                        $uibModalInstance.close($scope.event_data);
                    }, 1000);
                } else {
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message = response.data.message;
                }
            });
        };


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);

//add quality matrics controller
app.controller('qualitymatController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'ClientsServices', '$compile', 'FileUploader', 'value', '$rootScope', '$http', function ($scope, $rootScope, $uibModalInstance, $window, ClientsServices, $compile, FileUploader, value, $rootScope, $http) {

    console.log(value);
    $scope.otaOb = {};
    $scope.hotels = value.hotels;
    
        if (value.modal_type == 'edit_qm') {
            $scope.qm_data = value.qm_data;
            $scope.client_id = value.qm_data.client_id;
            $scope.ota_name_data = [value.qm_data.ota_ob];
            $scope.hotelx = [value.qm_data.hotel_ob];
            $scope.modal_heading = 'Edit Quality Metrics';
        } else {
            $scope.qm_data = {};
            $scope.client_id = value.client_id;
            $scope.modal_heading = 'Add Quality Metrics';
        }
        
        $scope.searchQParameters = function (keywords) {
            var params = {keywords: keywords};
            $scope.parameters = [{name: 'Rating'}, {name: 'Review Score'}];
        };
        
        $scope.selectH = function(x) { $scope.qm_data.hotel_name = x.name; }
        
        $scope.addQualityMet = function (valid) {
            
            $scope.loading_msg = true;
            ClientsServices.addQualityMat($scope.qm_data, $scope.client_id, function (response) {
                $scope.loading_msg = false;
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
                    setTimeout(function () {
                        $uibModalInstance.close($scope.qm_data);
                    }, 1000);
                } else {
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message = response.data.message;
                }
            });
        };
        
        $scope.searchSystemOtaName = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend + '/setup/otasetup/getAllOtas',
                    {params: params}
            ).then(function (response) {
                $scope.ota_name_data = response.data.details;
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
        $scope.selectOTA = function(model) {
            console.log(model);
            $scope.otaOb = model;
            $scope.qm_data.ota_name = model.name;
        };
    }]);

//add Season controller
app.controller('seasonController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'ClientsServices', '$compile', 'FileUploader', 'value', '$rootScope', function ($scope, $rootScope, $uibModalInstance, $window, ClientsServices, $compile, FileUploader, value, $rootScope) {

        if (value.modal_type == 'edit_season') {
            $scope.season_data = value.season_data;
            $scope.season_data.number = parseInt($scope.season_data.number);
            $scope.season_data.start_date = parseInt($scope.season_data.start_week);
            $scope.season_data.end_date = parseInt($scope.season_data.end_week);
            $scope.client_id = value.season_data.client_id;
            $scope.modal_heading = "Edit Season";
        } else {
            $scope.season_data = {};
            $scope.client_id = value;
            $scope.modal_heading = "Add Season";
        }
        
        $scope.addSeason = function () {
            ClientsServices.addSeason($scope.season_data, $scope.client_id, function (response) {
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
                    setTimeout(function () {
                        $scope.season_data.start_week = parseInt($scope.season_data.start_date);
                        $scope.season_data.end_week = parseInt($scope.season_data.end_date);
                        $uibModalInstance.close($scope.season_data);
                    }, 1000);
                } else {
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message = response.data.message;
                }
            });
        };
        
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);

//add Competitors controller
app.controller('competitorsController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'ClientsServices', '$compile', 'FileUploader', 'value', '$rootScope', '$http', function ($scope, $rootScope, $uibModalInstance, $window, ClientsServices, $compile, FileUploader, value, $rootScope, $http) {
        if (value != '') {
            $scope.client_id = value;
        }

        $scope.address = {};
        //search country 
        $scope.searchCountry = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend + '/import/searchCountries',
                    {params: params}
            ).then(function (response) {
                $scope.countries = response.data.results;
            });
        };
        //on change country
        $scope.country_change = function (item) {
            $scope.country_id = item.id;
            $scope.country_name = item.name;
        }
        //search states
        $scope.searchStates = function (keywords) {
            var params = {keywords: keywords, country:$scope.country_id};
//              if(country == '' || country == null){
            return $http.get(
                    $rootScope.backend + '/import/searchStates',
                    {params: params}
            ).then(function (response) {
                $scope.states = response.data.results;
                $scope.show_error_state = false;
                if ($scope.states == '') {
                    $scope.show_error_state = true;
                    $scope.state_no_msg = 'Please select country first';
                }
            });
        };
        //on cahnge state
        $scope.state_change = function (item) {
            $scope.state_id = item.id;
            $scope.state_name = item.name;
        }

        //search city
        $scope.searchCity = function (keywords) {
            var params = {keywords: keywords, state:$scope.state_id};
//            if(state == ''){
            return $http.get(
                    $rootScope.backend + '/import/searchCities',
                    {params: params}
            ).then(function (response) {
                $scope.cities = response.data.results;
                $scope.show_error_city = false;
                if ($scope.cities == '') {
                    $scope.show_error_city = true;
                    $scope.state_no_msg = 'No data found';
                }
            });
        };
        //on change city
        $scope.city_change = function (item) {
            $scope.city_name = item.name;
        }
        $scope.searchHotels1 = function (keywords) {
            var params = {keywords: keywords, cities:$scope.city_name };
            return $http.get(
                    $rootScope.backend2 + '/hotels/hotels/searchHotels',
                    {params: params}
            ).then(function (response) {
                $scope.hotels = response.data.results;
            });
        };
        
        /*$scope.selectHotel = function (item, model) {
            $scope.show_form = true;
            $scope.hotel_details = item;
        };*/

        $scope.getAllHotels = function () {
            ClientsServices.getAllHotels(function (response) {
                if (response.data.status == true) {
                    $scope.hotels = response.data.hotels;
                }
            });
        };

        $scope.competitor_data = {};
        $scope.addCompetitors = function () {
            ClientsServices.addCompetitor($scope.competitor_data, $scope.client_id, function (response) {
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
                    setTimeout(function () {
                        $uibModalInstance.close();
                    }, 1000);
                    $rootScope.$emit('reloadCompetitorData', $scope.client_id);
                } else {
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message = response.data.message;
                    setTimeout(function () {
                        $uibModalInstance.close();
                    }, 1000);
                    $rootScope.$emit('reloadCompetitorData', $scope.client_id);
                }
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);

//rates modal
app.controller('ratesModalController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'ClientsServices', '$compile', 'FileUploader', 'data', '$rootScope', '$http', function ($scope, $rootScope, $uibModalInstance, $window, ClientsServices, $compile, FileUploader, data, $rootScope, $http) {

    console.log(data.client_id);
    $scope.hotel_id = data.hotel_id;
    $scope.client_id = data.client_id;
    $scope.hotel_name = data.hotel;
    $scope.checkin_date = data.check_in;
    $scope.dt_collect = data.date_collected;
    $scope.loadingRates = true;
    $scope.rates = [];
    
    $http.get($rootScope.backend2+'/clients/getSubRates',{ params: { hotel_id:$scope.hotel_id, check_in:$scope.checkin_date, dt_collect:$scope.dt_collect, client_id:$scope.client_id } }).then(function(response){
        $scope.loadingRates = false;
        if(response.data.status) {
            $scope.rates = response.data.rates;
        }
    });

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);

//Rate Override
app.controller('RateOverrideController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'ClientsServices', '$compile', 'FileUploader', 'clientDetails', 'record', function ($scope, $rootScope, $uibModalInstance, $window, ClientsServices, $compile, FileUploader, clientDetails, record) {

        $scope.record = record;
        $scope.client = clientDetails;
        $scope.override = {
            rate:parseFloat(record[10]),
            algo:record[20],
            active:record[21],
            checkin_date:record[19],
            client_id:clientDetails.id
        };
        $scope.modal_heading = "Override Rate";
        
        $scope.modifyRate = function () {
            $scope.loading_msg = true;
            ClientsServices.overrideRate($scope.override, function (response) {
                $scope.loading_msg = false;
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
                    setTimeout(function () {
                        if(response.data.message.search('disabled') > 0) {
                            $scope.record[10] = 'None';
                            $scope.record[20] = '';
                            $scope.record[21] = 'No';
                        }
                        else {
                            $scope.record[10] = $scope.override.rate;
                            $scope.record[20] = $scope.override.algo;
                            $scope.record[21] = 'Yes';
                        }
                        $uibModalInstance.close($scope.record);
                    }, 1000);
                } else {
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message = response.data.message;
                }
            });
        };
        
        $scope.selectAlgo = function(algo) {
            if(algo == 'RCP') {
                $scope.override.rate = record[6];
            }
            else if(algo == 'ARI') {
                $scope.override.rate = record[7];
            }
            else if(algo == 'PQM') {
                $scope.override.rate = record[8];
            }
            else if(algo == 'MPI') {
                $scope.override.rate = record[9];
            }
            else if(algo == 'Other') {
                $scope.override.rate = record[10];
            }
        };
        
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);

//Rate Push
app.controller('RatePushController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'ClientsServices', '$compile', 'FileUploader', 'clientDetails', 'record', function ($scope, $rootScope, $uibModalInstance, $window, ClientsServices, $compile, FileUploader, clientDetails, record) {

        $scope.record = record;
        $scope.client = clientDetails;
        $scope.push = {
            rate:parseFloat(record[11]),
            algo:record[20],
            checkin_date:record[19],
            client_id:clientDetails.id
        };
        $scope.modal_heading = "Push Final Rate";
        
        $scope.pushRate = function () {
            $scope.loading_msg = true;
            ClientsServices.pushRate($scope.push, function (response) {
                $scope.loading_msg = false;
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
                    setTimeout(function () {
                        $uibModalInstance.close($scope.record);
                    }, 1000);
                } else {
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message = response.data.message;
                }
            });
        };
        
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);

//Rate Push All
app.controller('RatePushAllController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'ClientsServices', '$compile', 'FileUploader', 'clientDetails', function ($scope, $rootScope, $uibModalInstance, $window, ClientsServices, $compile, FileUploader, clientDetails) {

        $scope.loadingChanges = true;
        $scope.rates = [];
        $scope.selectedRates = [];
        $scope.client = clientDetails;
        $scope.push = {
            client_id:clientDetails.id,
            rates:$scope.selectedRates
        };
        
        $scope.isSelected = function(rate) {
            var flag = false;
            angular.forEach($scope.selectedRates,function(v,k) {
                if(v.id == rate.id) {
                    flag = true;
                }
            });
            return flag;
        };
        
        $scope.modal_heading = "Push All Rates";
        
        ClientsServices.getRateChanges(clientDetails.id, function(response){
            $scope.loadingChanges = false;
            $scope.rates = $scope.selectedRates = response.data.rates;
        });
        
        $scope.pushRates = function () {
            $scope.loading_msg = true;
            $scope.push.rates = $scope.selectedRates;
            ClientsServices.pushAllRates($scope.push, function (response) {
                $scope.loading_msg = false;
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
                    setTimeout(function () {
                        $uibModalInstance.close($scope.record);
                    }, 1000);
                } else {
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message = response.data.message;
                }
            });
        };
        
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
        $scope.selectRate = function(index,rate) {
            var flag = false;
            var temp = [];
            angular.forEach($scope.selectedRates,function(v,k) {
                if(v.id == rate.id) {
                    flag = true;
                }
                else {
                    temp.push(v);
                }
                
            });
            if(flag == true) {
                $scope.selectedRates = temp;
            }
            else {
                $scope.selectedRates.push(rate);
            }
            console.log(rate);
            console.log($scope.selectedRates);
        };
}]);

//add user data controller
app.controller('RefreshController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'ClientsServices', '$compile', 'FileUploader', 'client', '$rootScope', function ($scope, $rootScope, $uibModalInstance, $window, ClientsServices, $compile, FileUploader, client, $rootScope) {
        
    $scope.refresh = {
        bookings:false,
        bookings_update:false,
        recommendations:false,
        cm_rates: false,
        mi:false,
        client_id:client.id
    };
    
    $scope.modal_title = 'Refresh Data';

    $scope.refreshData = function (valid) {
        if(valid) {
            $scope.loading_msg = true;
            $scope.success_msg = false;
            ClientsServices.refreshData($scope.refresh, function (response) {
                $scope.loading_msg = false;
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
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