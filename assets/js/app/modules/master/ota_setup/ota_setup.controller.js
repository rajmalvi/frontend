app.controller('OtpController', ['$scope', '$rootScope', '$routeParams', '$window', 'FileUploader', '$compile', 'OtpServices', '$uibModal', function ($scope, $rootScope, $routeParams, $window, FileUploader, $compile, OtpServices, $uibModal) {
        $scope.currentAccount = $routeParams.mID;

        $scope.currentAccount = $routeParams.mID;

        setTimeout(function () {
            $('.select2').select2();
        }, 100);

        // get all System Users on jq
        // get all Members on jqxgrid
        $scope.getAllOta = function () {
            $scope.createWidget = false;
            // prepare the data
            var source_members =
                    {
                        datatype: "json",
                        datafields: [
                            {name: 'id', type: 'int'},
                            {name: 'name', type: 'string'},
                            {name: 'domainName', type: 'string'},
                            {name: 'regdate', type: 'datetime'},
                            {name: 'author', type: 'int'},
                            {name: 'status', type: 'string'},
                        ],
                        root: "otas",
                        id: 'id',
                        url: $rootScope.backend + '/setup/otasetup/getAllota',
                        beforeprocessing: function (data)
                        {
                            source_members.totalrecords = data.totalRows;
                        }
                    };
            var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
                if (value == 'Disabled') {
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
            // initialize jqxGrid
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
                            {text: 'Name', datafield: 'name', width: '40%'},
                            {text: 'Domain Name', datafield: 'domainName', width: '30%'},
                            {text: 'Registration Date', datafield: 'regdate', width: '10%'},
                            {text: 'Status', datafield: 'status', cellsrenderer: cellsrenderer, width: '10%'}
                        ]
                    };
            $scope.createWidget = true;
        };
        $scope.getAllOta();

        $rootScope.$on('reloadData', function (notice) {
            $scope.getAllOta();
        });
        
        //after clicked on member show details based on account id
        $scope.hotel = {};
        $rootScope.gridSettings.rowselect = function (response) {
            if (typeof (response.args.row != 'undefined'))
            {
                OtpServices.getOtaDetails(response.args.row.id, function (response) {
                    $scope.ota_details = response.data.details;
                });
            }
        };
        
        $scope.getOtaMappings = function () {
            OtpServices.getOtaMappings(function (response) {
                $scope.ota_mapping = response.data.ota_mapping;
            });
        };
        
        $rootScope.$on('reloadMapData', function (notice) {
            $scope.getOtaMappings();
        });
        $scope.getOtaMappings();


        $scope.openOtaSetupModal = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'ota_add.html',
                controller: 'OtaModalController',
                resolve: {
                    value: function () {

                    }
                }
            });
        };
        
        $scope.editOtaSetupModal = function (data) {
            $scope.otaSetupData = {
                edit_otaData: data,
                modal_type: 'edit_ota_setup'
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'ota_add.html',
                controller: 'OtaModalController',
                resolve: {
                    value: function () {
                        return $scope.otaSetupData;
                    }
                }
            });
        };

        $scope.openOtaMappingModal = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'ota_mapping.html',
                controller: 'OtaMappingController',
                size:'sm',
                resolve: {
                    value: function () {

                    }
                }
            });
        };

        $scope.editOtaMapModal = function (data) {
            $scope.ota_mapping_details = {
                ota_map_detail:data,
                modal_type:'edit_ota_mapping'
            };
            var modalInstance = $uibModal.open({
                templateUrl: 'ota_mapping.html',
                controller: 'OtaMappingController',
                size:'sm',
                resolve: {
                    value: function () {
                        return $scope.ota_mapping_details;
                    }
                }
            });
        };

        $scope.deleteOta = function (id) {
            bootbox.confirm('Sure you want to delete this OTA?<br />Once deleted, it cannot be undone!', function (result) {
                if (result == true)
                {
                    OtpServices.deleteOta(id, function (response) {
                        if (response.data.status == true) {
                            bootbox.alert(response.data.message);
                            $scope.gridSettings.apply('updatebounddata');
                        } else {
                            bootbox.alert(response.data.message);
                        }
                    });
                }
            });
        };
        
        $scope.delete_otaMapping = function (id) {
            bootbox.confirm('Sure you want to delete this OTA mapping?<br />Once deleted, it cannot be undone!', function (result) {
                if (result == true)
                {
                    OtpServices.deleteOtaMap(id, function (response) {
                        if (response.data.status == true)
                        {
                            bootbox.alert(response.data.message);
                            $scope.getOtaMappings();
                        } else {
                            bootbox.alert(response.data.message);
                            $scope.getOtaMappings();
                        }
                    });
                }
            });
        };

}]);

//add ota setup modal controller
app.controller('OtaModalController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'OtpServices', '$compile', 'FileUploader', 'value', '$rootScope', function ($scope, $rootScope, $uibModalInstance, $window, OtpServices, $compile, FileUploader, value, $rootScope) {
        if (value != null) {
            if (value.modal_type == 'edit_ota_setup') {
                $scope.modal_heading = 'Edit OTA';
                $scope.ota_data = value.edit_otaData;
                $scope.status = [{name:value.edit_otaData.status}];
            }
        } else {
            $scope.modal_heading = 'Add OTA';
            $scope.ota_data = {};
        }

        $scope.searchStatus = function () {
            $scope.status = [{name: 'active'}, {name: 'disabled'}];
        }

        $scope.addOta = function () {
            OtpServices.postOta($scope.ota_data, function (response) {
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
                    setTimeout(function () {
                        $uibModalInstance.close();
                    }, 1000);
                } else {
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message = response.data.message;
                }
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);

//add ota mapping modal controller
app.controller('OtaMappingController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'OtpServices', '$compile', 'FileUploader', 'value', '$rootScope', '$http', function ($scope, $rootScope, $uibModalInstance, $window, OtpServices, $compile, FileUploader, value, $rootScope, $http) {

        if (value != null) {
            if(value.modal_type == 'edit_ota_mapping'){
                $scope.modal_heading = 'Edit OTA Mapping';
                $scope.ota_detail = value.ota_map_detail;
                $scope.types = [{name:value.ota_map_detail.type}];
            }
        } else {
            $scope.modal_heading = 'Add OTA Mapping';
            $scope.ota_detail = {};
        }
        
        $scope.searchType = function () {
            $scope.types = [{name: 'Rateshopping'}, {name: 'STAAH'}];
        };
        
        $scope.ota_details = [];
        $http.get($rootScope.backend2 + '/setup/otasetup/searchOtaTypes'
            ).then(function (response) {
                $scope.ota_details = response.data.ota_details;
                $timeout(function(){
                    $scope.$apply();
                },100);
        });
        
        $scope.sources = [];
        $http.get(
                    $rootScope.backend2 + '/setup/otasetup/getRateShoppingOTAs',
            ).then(function (response) {
                $scope.sources = response.data.sources;
                $timeout(function(){
                    $scope.$apply();
                },100);
        });

        $scope.selectfor = function (item) {
            $scope.for_label = item.name;
        };

        $scope.addOtaMapping = function () {
            OtpServices.postOtaMapping($scope.ota_detail, function (response) {
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
                    setTimeout(function () {
                        $uibModalInstance.close();
                    }, 1000);
                    $rootScope.$emit('reloadMapData');
                } else {
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message = response.data.message;
                    setTimeout(function () {
                        $uibModalInstance.close();
                    }, 1000);
                    $rootScope.$emit('reloadMapData');
                }
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);
