app.controller('RoomsController', ['$scope', '$rootScope', '$routeParams', '$window', 'FileUploader', '$compile', 'RoomsServices', '$uibModal', function ($scope, $rootScope, $routeParams, $window, FileUploader, $compile, RoomsServices, $uibModal) {

        $scope.currentAccount = $routeParams.mID;

        setTimeout(function () {
            $('.select2').select2();
        }, 100);

        // get all System Users on jq
        // get all Members on jqxgrid
        $scope.getAllRooms = function () {
            $scope.createWidget = false;
            // prepare the data
            var source_members =
                    {
                        datatype: "json",
                        datafields: [
                            {name: 'id', type: 'int'},
                            {name: 'name', type: 'string'},
                            {name: 'description', type: 'string'},
                            {name: 'regdate', type: 'datetime'},
                            {name: 'author', type: 'int'},
                            {name: 'status', type: 'string'}
                        ],
                        root: "room_types",
                        id: 'id',
                        url: $rootScope.backend2 + '/setup/room_types/getAllroomtypes',
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
                            {text: 'Name', datafield: 'name', width: '20%'},
                            {text: 'Description', datafield: 'description', width: '40%'},
                            {text: 'Registration Date', datafield: 'regdate', width: '20%'},
                            {text: 'Status', datafield: 'status', cellsrenderer: cellsrenderer, width: '10%'}
                        ]
                    };
            $scope.createWidget = true;
        };
        $scope.getAllRooms();

        $rootScope.$on('reloadData', function (notice) {
            $scope.getAllRooms();
        });


        //after clicked on member show details based on account id
        $scope.hotel = {};
        $rootScope.gridSettings.rowselect = function (response) {
            if (typeof (response.args.row != 'undefined'))
            {
                RoomsServices.getRoomsDetails(response.args.row.id, function (response) {
                    $scope.rooms = response.data.details;
                });
            }
        };

        $scope.getRoomMappings = function () {
            RoomsServices.getRoomTypes(function (response) {
                if (response.data.status == true) {
                    $scope.roomtypes_data = response.data.roomtypes_data;
                }
            });
        }



        $scope.getRoomMappings();

        $rootScope.$on('reloadMappingData', function (notice) {
            $scope.getRoomMappings();
        });
        $scope.deleteRoom = function (id) {
            bootbox.confirm('Sure you want to delete this room type?<br />Once deleted, it cannot be undone!', function (result) {
                if (result == true)
                {
                    RoomsServices.deleteRoom(id, function (response) {
                        if (response.data.status == true)
                        {
                            bootbox.alert(response.data.message);
                            $scope.getAllRooms();
                        } else {
                            bootbox.alert(response.data.message);
                            $scope.getAllRooms();
                        }
                    });
                }
            });
        }
        $scope.delete_roomMapping = function (id) {
            bootbox.confirm('Sure you want to delete this room mapping?<br />Once deleted, it cannot be undone!', function (result) {
                if (result == true)
                {
                    RoomsServices.deleteRoom(id, function (response) {
                        if (response.data.status == true)
                        {
                            bootbox.alert(response.data.message);
                            $scope.getRoomMappings();
                        } else {
                            bootbox.alert(response.data.message);
                            $scope.getRoomMappings();
                        }
                    });
                }
            });
        }

        //add room type modal
        $scope.openRoomTypeModal = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'room_type_add.html',
                controller: 'RoomController',
                resolve: {
                    value: function () {
                    }
                }
            });
        };

        //edit room type data
        $scope.editRoomTypeModal = function (data) {
            $scope.roomTypeDetails = {
                room_type_data: data,
                modal_type: 'edit_roomType'
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'room_type_add.html',
                controller: 'RoomController',
                resolve: {
                    value: function () {
                        return $scope.roomTypeDetails;
                    }
                }
            });
        }


        //add room type mapping modal
        $scope.openRoomTypeMapModal = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'room_mapping.html',
                controller: 'RoomMappingController',
                resolve: {
                    value: function () {

                    }
                }
            });
        };

        //edit room type mapping data
        $scope.editRoomTypeMapModal = function (data) {
            $scope.roomTypeDetails = {
                roomTypeMap_data: data,
                modal_type: 'edit_roomTypeMap'
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'room_mapping.html',
                controller: 'RoomMappingController',
                resolve: {
                    value: function () {
                        return $scope.roomTypeDetails;
                    }
                }
            });
        }
    }]);

//add data controller
app.controller('RoomController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'RoomsServices', '$compile', 'FileUploader', 'value', '$rootScope', function ($scope, $rootScope, $uibModalInstance, $window, RoomsServices, $compile, FileUploader, value, $rootScope) {
        if (value != null) {
            if (value.modal_type == 'edit_roomType') {
                $scope.room_data = value.room_type_data;
                $scope.status = [{name: value.room_type_data.status}];
                $scope.modal_heading = 'Edit Room Type'
            }
        } else {
            $scope.room_data = {};
            $scope.modal_heading = 'Add Room Type'
        }
        $scope.searchStatus = function () {
            $scope.status = [{name: 'Active'}, {name: 'Disabled'}];
        }

        $scope.addRoom = function () {
            RoomsServices.postRoom($scope.room_data, function (response) {
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
                    setTimeout(function () {
                        $uibModalInstance.close();
                    }, 1000);
                    $rootScope.$emit('reloadData');
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

//add room mapping controller
app.controller('RoomMappingController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'RoomsServices', '$compile', 'FileUploader', 'value', '$rootScope', '$http', function ($scope, $rootScope, $uibModalInstance, $window, RoomsServices, $compile, FileUploader, value, $rootScope, $http) {
        if (value != null) {
            if (value.modal_type == 'edit_roomTypeMap') {
                $scope.modal_heading = 'Edit Room Mapping'
                $scope.room_detail = value.roomTypeMap_data;
                $scope.types = [{name: value.roomTypeMap_data.type}];
               $scope.room_detail.room_detail = value.roomTypeMap_data.room_data;
            }
        } else {
            $scope.room_detail = {};
            $scope.modal_heading = 'Add Room Mapping'
        }
        $scope.searchType = function () {
            $scope.types = [{name: 'Rateshopping'}, {name: 'STAAH'}];
        }
        $scope.selectfor = function (item) {
            $scope.for_label = item.name;
        }
        $scope.searchRoomTypes = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend2 + '/setup/Room_types/searchRoomTypes',
                    {params: params}
            ).then(function (response) {
                $scope.room_details = response.data.room_details;
            });
        };

        $scope.addRoomMapping = function () {
            RoomsServices.postRoomMapping($scope.room_detail, function (response) {
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
                    setTimeout(function () {
                        $uibModalInstance.close();
                    }, 1000);
                    $rootScope.$emit('reloadMappingData');
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
