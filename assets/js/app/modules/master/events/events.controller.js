app.constant("moment", moment);
app.controller('EventsController', ['$scope', '$rootScope', '$routeParams', '$window', 'FileUploader', '$compile', 'moment', 'EventsServices', '$uibModal', function ($scope, $rootScope, $routeParams, $window, FileUploader, $compile, moment, EventsServices, $uibModal) {

        $scope.getAllEvents = function () {
            $scope.createWidget = false;
            // prepare the data
            var source_members =
                    {
                        datatype: "json",
                        datafields: [
                            {name: 'id', type: 'int'},
                            {name: 'name', type: 'string'},
                            {name: 'startDate', type: 'string'},
                            {name: 'endDate', type: 'string'},
                            {name: 'status', type: 'string'},
                        ],
                        root: "events",
                        id: 'id',
                        url: $rootScope.backend + '/events/getAllEvents',
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
                            {text: 'Name', datafield: 'name', width: '40%'},
                            {text: 'Start Date', datafield: 'startDate', width: '20%'},
                            {text: 'End Date', datafield: 'endDate', width: '20%'},
                            {text: 'Status', datafield: 'status', cellsrenderer: cellsrenderer, width: '10%'}
                        ]
                    };
            $scope.createWidget = true;
        };
        $scope.getAllEvents();

        $rootScope.$on('reloadData', function () {
            $scope.getAllEvents();
        });

        //after clicked on member show details based on account id
        $scope.account = {};
        $rootScope.gridSettings.rowselect = function (response) {
            if (typeof (response.args.row != 'undefined'))
            {
                EventsServices.getEventDetails(response.args.row.id, function (response) {
                    $scope.event = response.data.details;
                });
            }
        };

        $scope.deleteEvent = function (id) {
            bootbox.confirm('Sure you want to delete this event?<br />Once deleted, it cannot be undone!', function (result) {
                if (result == true)
                {
                    EventsServices.deleteEvent(id, function (response) {
                        if (response.data.status == true)
                        {
                            bootbox.alert(response.data.message);
                            $scope.getAllEvents();
                        } else {
                            bootbox.alert(response.data.message);
                            $scope.getAllEvents();
                        }
                    });
                }
            });
        }

        $scope.openEventModal = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'event_add.html',
                controller: 'EventModalController',
                resolve: {
                    value: function () {

                    }
                }
            });

        };

        $scope.openEventEditModal = function (data) {
                    $scope.get_event_edit = {
                        edit_event:data,
                        modal_type:'edit_event'
                    };
                    var modalInstance = $uibModal.open({
                        templateUrl: 'event_add.html',
                        controller: 'EventModalController',
                        resolve: {
                            value: function () {
                                return $scope.get_event_edit;
                            }
                        }
                    });
        };

    }]);

//add and edit event modal 
app.controller('EventModalController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'EventsServices', '$compile', 'FileUploader', 'value', '$rootScope', function ($scope, $rootScope, $uibModalInstance, $window, EventsServices, $compile, FileUploader, value, $rootScope) {
        if(value != null){
            if(value.modal_type == 'edit_event'){
                $scope.modal_heading = 'Edit Event';
                $scope.event_data = value.edit_event;
                $scope.areas = [{name:value.edit_event.area_impact}];
            }
        }else{
            $scope.modal_heading = 'Add Event';
            $scope.event_data = {};
        }
        
        $scope.searchAreaImpact = function () {
            $scope.areas = [{name: 'Area'}, {name: 'State'}];
        }
        
        $scope.addEvent = function () {
            EventsServices.postEvent($scope.event_data, function (response) {
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
                    setTimeout(function () {
                        $uibModalInstance.close();
                    }, 1000);
                    $rootScope.$emit('reloadData');
                }
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);


