app.controller('MarketIntelController', ['$scope', '$rootScope', '$routeParams', '$window', 'FileUploader', '$compile', 'ClientsServices', '$uibModal', '$http', '$location', '$timeout', '$q', 'session', function ($scope, $rootScope, $routeParams, $window, FileUploader, $compile, ClientsServices, $uibModal, $http, $location, $timeout, $q, session) {
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
                            {name: 'property_name', type: 'string'},
                            {name: 'address', type: 'string'},
                            {name: 'account_manager', type: 'string'},
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
                            {text: 'Property Name', datafield: 'property_name', width: '20%'},
                            {text: 'Address', datafield: 'address', width: '40%'},
                            {text: 'Account Manager', datafield: 'account_manager', width: '20%'},
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
        $rootScope.gridSettings.rowselect = function (response) {
            if (typeof (response.args.row !== undefined)) {
                $scope.loadingClient = true;

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
                    $scope.competitors = response.data.competitors;
                    $scope.competitors_suggestions = response.data.competitors_suggestions;
                    $scope.cache_time = response.data.cache_time;
                    $scope.cm_form.cm_hotel = response.data.details.cm_hotel;
                    $scope.cm_form.cm_id = response.data.details.cm_username;
                    $scope.cm_form.cm_password = response.data.details.cm_password;
                    $scope.renderClientCharts(response.data.charts);
                    $scope.loadMIGrid(response.data.rates);
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
                $scope.cm_form.cm_hotel = response.data.details.cm_hotel;
                $scope.cm_form.cm_id = response.data.details.cm_username;
                $scope.cm_form.cm_password = response.data.details.cm_password;
                $scope.competitors = response.data.competitors;
                $scope.competitors_suggestions = response.data.competitors_suggestions;
                $scope.cache_time = response.data.cache_time;
                $scope.loadingClient = false;
                $scope.renderClientCharts(response.data.charts);
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
            console.log(data);
            // prepare the data
            var source_rates = {
                datatype: "json",
                datafields: [
                    {name: 'hotel', type: 'string'},
                    {name: 'hotel_id', type: 'int'},
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
                    {text: 'Hotel', datafield: 'hotel', width: '31%'},
                    {text: 'Check In', datafield: 'check_in', width: '10%'},
                    {text: 'Room Type', datafield: 'room_type', width: '12%'},
                    {text: 'Website/OTA', datafield: 'website', width: '15%'},
                    {text: 'Rate Type', datafield: 'rate_type', width: '12%'},
                    {text: 'Rate', datafield: 'onsiterate', cellsrenderer: cellsrenderer, width: '10%'},
                    {text: 'Date Collected 1', datafield: 'date_collected', width: '10%'}
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
                max_capacity: ''
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
            ratetypes: [],
            cm_id: '',
            cm_password: ''
        };
        
        //$scope.newClientAdd = {"otas": { "rateshopping":[], "staah":[{"client_ota":"GIBIBO","ota_name":{"id":"5","name":"GOIBIBO","domain_name":"GOIBIBO","regdate":"2017-05-10 14:22:45","author":null,"status":"active"},"type_name":"staah","hotel_name":"Le Sutra The Indian Art Hotel","hotel_id":"456412","type":"staah","system_ota_id":"5","system_name":"GOIBIBO","$$hashKey":"object:88"},{"client_ota":"BKING","ota_name":{"id":"2","name":"BOOKING.COM","domain_name":"BOOKING.COM","regdate":"2017-05-10 14:21:49","author":null,"status":"active"},"type_name":"staah","hotel_name":"Le Sutra The Indian Art Hotel","hotel_id":"456412","type":"staah","system_ota_id":"2","system_name":"BOOKING.COM","$$hashKey":"object:110"},{"client_ota":"hotelscom","ota_name":{"id":"6","name":"HOTELS.COM","domain_name":"HOTELS.COM","regdate":"2017-05-10 14:23:01","author":null,"status":"active"},"type_name":"staah","hotel_name":"Le Sutra The Indian Art Hotel","hotel_id":"456412","type":"staah","system_ota_id":"6","system_name":"HOTELS.COM","$$hashKey":"object:132"},{"client_ota":"Xpedia","ota_name":{"id":"1","name":"EXPEDIA","domain_name":null,"regdate":"2017-05-03 01:14:38","author":"0","status":"active"},"type_name":"staah","hotel_name":"Ace Residency","hotel_id":"432498","type":"staah","system_ota_id":"1","system_name":"EXPEDIA"}] }, "hotel_details":{"id":"456412","rm_code":"510006","name":"Le Sutra The Indian Art Hotel","address":"14 Union Park, Khar (W), above Out of the Blue and Olive","city":{"id":"120058","parent":"120056","name":"MUMBAI","type":"city","status":"active"},"city_id":null,"state":{"id":"121684","parent":"119768","name":"Maharashtra","type":"state","status":"active"},"state_id":null,"zip":"400052","country":{"id":"119768","parent":"0","name":"India","type":"country","status":"active"},"country_id":null,"latitude":"19.0718","longitude":"72.8255","status":"active","regdate":"2017-05-02 14:38:47","author":"0","formatted_name":"Le Sutra The Indian Art Hotel, Mumbai, India, Maharashtra","getCountryData":{"id":"119768","parent":"0","name":"India","type":"country","status":"active"},"getStateData":{"id":"121684","parent":"119768","name":"Maharashtra","type":"state","status":"active"},"getCityData":{"id":"120058","parent":"120056","name":"MUMBAI","type":"city","status":"active"}},"room_type":{"rate_room_type":[],"staah_room_type":[]},"ota_setup":{"rate":"","staah":""},"rateshop":{"roomtypes": [], "ratetypes": [], "client":{"otas":[],"horizon":[{"dow":false,"days":90},{"dow":false,"days":90},{"dow":false,"days":90},{"dow":false,"days":90},{"dow":false,"days":90},{"dow":false,"days":90},{"dow":false,"days":90},{"dow":false,"days":90}]},"competitors":{"otas":[],"horizon":[{"dow":false,"days":90},{"dow":false,"days":90},{"dow":false,"days":90},{"dow":false,"days":90},{"dow":false,"days":90},{"dow":false,"days":90},{"dow":false,"days":90},{"dow":false,"days":90}]}},"account_manager":"1","competitors":["432498","432571"],"los":"","currency":"","roomtypes":[{"name":"Rajas","slug":"rajas","system_id":"5","hotel_id":"456412","client_id":null,"system_record":{"id":"5","name":"Uncategorized","description":"All unmapped room types. The room types under this need to be mapped to appropriate room type","regdate":"2017-05-30 04:44:40","author":"1","status":"active"},"hotel_name":"Le Sutra The Indian Art Hotel","type":"rateshopping"},{"name":"Sattva","slug":"sattva","system_id":"5","hotel_id":"456412","client_id":null,"system_record":{"id":"5","name":"Uncategorized","description":"All unmapped room types. The room types under this need to be mapped to appropriate room type","regdate":"2017-05-30 04:44:40","author":"1","status":"active"},"hotel_name":"Le Sutra The Indian Art Hotel","type":"rateshopping"},{"name":"Tamas Room","slug":"tamasroom","system_id":"5","hotel_id":"456412","client_id":null,"system_record":{"id":"5","name":"Uncategorized","description":"All unmapped room types. The room types under this need to be mapped to appropriate room type","regdate":"2017-05-30 04:44:40","author":"1","status":"active"},"hotel_name":"Le Sutra The Indian Art Hotel","type":"rateshopping"},{"name":"Superior Double Room","slug":"superiordoubleroom","system_id":"5","hotel_id":"432571","client_id":null,"system_record":{"id":"5","name":"Uncategorized","description":"All unmapped room types. The room types under this need to be mapped to appropriate room type","regdate":"2017-05-30 04:44:40","author":"1","status":"active"},"hotel_name":"Ascot Hotel","type":"rateshopping"},{"name":"Deluxe Double Room","slug":"deluxedoubleroom","system_id":"5","hotel_id":"432571","client_id":null,"system_record":{"id":"5","name":"Uncategorized","description":"All unmapped room types. The room types under this need to be mapped to appropriate room type","regdate":"2017-05-30 04:44:40","author":"1","status":"active"},"hotel_name":"Ascot Hotel","type":"rateshopping"}],"ratetypes":[]};
        $scope.addingClient = false;
        $scope.addClient = function (valid) {
            console.log(JSON.stringify($scope.newClientAdd));
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
        
        $scope.rateshop_form_next = function () {
            $scope.mapping_forms = false;
            $scope.run_rate_shop = false;
            $scope.client_form = false;
            $scope.rateshop_form = false;
            $scope.chmanager_form = true;
            $scope.form_heading = 'Channel Manager Setup';
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
                        $rootScope.backend + '/hotels/hotels/searchHotels',
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


        $scope.panel_heading = 'Dashboard';
        //client dashboard details show
        $scope.active_panel = 'dashboard';
        $scope.active_panel_title = 'Dashboard';
        
        $scope.switchPanel = function(panel,title) {
            $scope.active_panel = panel;
            $scope.active_panel_title = title;
        };
        
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
        $scope.dows = [];
        $scope.saveDow = function (id) {
            ClientsServices.saveDow(id, {'dows': $scope.dows}, function (response) {
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
        }

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
            }, function() {
                
            });
        };
        
        $scope.setupRemoveOTA = function(index) {
            bootbox.confirm('Sure you want to remove this mapping record?', function(status){
                if(status) {
                    $scope.newClientAdd.otas.staah.splice(index,1);
                    $scope.$apply();
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
                $scope.gridMISettings.apply('exportdata', 'xls', name, true, null, true, $rootScope.backend2+'/export');
            },1000);
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
                                text: 'OTA Sold',
                                style: {
                                    color: Highcharts.getOptions().colors[2]
                                }
                            },
                            opposite: true

                        }, {// Secondary yAxis
                            gridLineWidth: 0,
                            title: {
                                text: 'OTA Revenue',
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
                    colors:['#2f5597','#ffc000'],
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
                    }]
                });
                
                //Rate Comparison
                Highcharts.chart('chart_rate_comparison', {
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
                });
                
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

    }]);
