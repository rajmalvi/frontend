app.controller('ChannelsController', ['$scope', '$rootScope', '$routeParams', '$window', 'FileUploader', '$compile', 'ChannelsServices', '$uibModal', function ($scope, $rootScope, $routeParams, $window, FileUploader, $compile, AwardsServices, $uibModal) {
        
           $scope.currentAccount = $routeParams.mID;

        setTimeout(function () {
            $('.select2').select2();
        }, 100);

        // get all System Users on jq
        // get all Members on jqxgrid
        $scope.getAllAccounts = function () {
            $scope.createWidget = false;
            // prepare the data
            var source_members =
                    {
                        datatype: "json",
                        datafields: [
                            {name: 'room_id', type: 'int'},
                            {name: 'room_name', type: 'int'},
                            {name: 'room_description', type: 'string'},
                            {name: 'room_sttaus', type: 'string'},
                        ],
                        root: "accounts",
                        id: 'account_id',
                        url: $rootScope.backend + '/hotels/getAllHotels',
                        beforeprocessing: function (data)
                        {
                            source_members.totalrecords = data.totalRows;
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
                }
            });
            /*End of main grid*/
            // initialize jqxGrid
            $rootScope.gridSettings =
                    {
                        width: '100%',
                        source: dataAdapter,
                        pageable: true,
                        autoheight: true,
                        filterable: true,
                        sortable: true,
                        altrows: true,
                        virtualmode: true,
                        ready: function ()
                        {
                            $rootScope.gridSettings.apply('selectrow', 0);
                        },
                        rendergridrows: function (obj)
                        {
                            return obj.data;
                        },
                        enabletooltips: true,
                        //showfilterrow: true,
                        selectionmode: 'singlerow',
                        columns: [
                            {text: 'ID', datafield: 'room_id', width: '25%'},
                            {text: 'Room Name', datafield: 'room_name', width: '25%'},
                            {text: 'Room Description', datafield: 'room_description', width: '35%'},
                            {text: 'Room Status', datafield: 'room_status', filtertype: 'checkedlist', cellsrenderer: cellsrenderer, width: '15%'}
                        ]
                    };
            $scope.createWidget = true;
        };
        $scope.getAllAccounts();

        //after clicked on member show details based on account id
        $scope.account = {};
        $rootScope.gridSettings.rowselect = function (response) {
            if (typeof (response.args.row != 'undefined'))
            {
                MembersServices.getAccountDetails(response.args.row.account_id, function (response) {
                    $scope.account = response.data.details;
                });
            }
        };
        
         $scope.openModal = function () {
            var modalInstance = $uibModal.open({
                    templateUrl: 'room_type_add.html',
                    controller: 'RoomController',
                   resolve: {
			 value: function () {
				   
			 }
			}
                });
        
        };
        
         }]);  
        
     app.controller('RoomController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'RoomsServices', '$compile', 'FileUploader', 'value', '$rootScope', function ($scope, $rootScope, $uibModalInstance, $window ,RoomsServices, $compile, FileUploader, value, $rootScope) {

	$scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

	
	
    }]);
