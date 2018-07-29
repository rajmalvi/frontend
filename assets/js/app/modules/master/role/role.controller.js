app.controller('RoleController', ['$scope', '$rootScope', '$routeParams', '$window', 'FileUploader', '$compile', 'RoleServices', '$location', '$timeout', function ($scope, $rootScope, $routeParams, $window, FileUploader, $compile, RoleServices, $location, $timeout) {

        $scope.currentRole = $routeParams.eID;

        $scope.success_msg = false;
        $scope.danger_msg = false;
        $scope.role_data = {};
        setTimeout(function () {
            $('.select2').select2();
        }, 100);

        // get all System Users on jq
        $scope.getAllRoles = function () {
            $scope.createWidget = false;
            // prepare the data
            var source_members =
                    {
                        datatype: "json",
                        datafields: [
                            {name: 'id', type: 'int'},
                            {name: 'name', type: 'string'},
                            {name: 'description', type: 'int'},
                            {name: 'rights', type: 'string'},
                            {name: 'regdate', type: 'datetime'},
                            {name: 'author', type: 'int'},
                            {name: 'status', type: 'string'}

                        ],
                        root: "roles",
                        id: 'id',
                        url: $rootScope.backend2 + '/roles/Roles/getAllRoles',
                        beforeprocessing: function (data)
                        {
                            source_members.totalrecords = data.totalRows;
                        }
                    };
            var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
                if (value == 'Active') {
                    return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #008000;">' + value + '</span>';
                } else if (value == 'Disabled') {
                    return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #FF0000;">' + value + '</span>';
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
                            {text: 'Description', datafield: 'description', width: '30%'},
                            {text: 'Datetime', datafield: 'regdate', width: '10%'},
                            {text: 'Author', datafield: 'author', width: '20%'},
                            {text: 'Status', datafield: 'status', cellsrenderer: cellsrenderer, width: '10%'}
                        ]
                    };
            $scope.createWidget = true;
        };
        $scope.getAllRoles();

        $rootScope.$on('reloadData', function (notice) {
            $scope.getAllRoles();
        });

        //after clicked on member show details based on account id
        $scope.hotel = {};
        $rootScope.gridSettings.rowselect = function (response) {
            if (typeof (response.args.row != 'undefined'))
            {
                RoleServices.getHotelChainDetails(response.args.row.id, function (response) {
                    $scope.hotel_chain = response.data.details;

                });
            }
        };

        $scope.searchStatus = function () {
            $scope.status = [{name: 'Active'}, {name: 'Disabled'}];
        }

        //after clicked on member show details based on account id
        $scope.account = {};
        $rootScope.gridSettings.rowselect = function (response) {
            if (typeof (response.args.row != 'undefined'))
            {
                RoleServices.getRoleDetails(response.args.row.id, function (response) {
                    $scope.role_details = response.data.details;
                });
            }
        };

        if ($scope.currentRole !== undefined) {
            RoleServices.editRole($scope.currentRole, function (response) {
                if (response.data.status == true) {
                    $scope.role_data = response.data.details;
                    $scope.status = [{name : response.data.details.status}];
                  }
            });
        }
        $scope.role_data = {};
        $scope.addRole = function () {
            RoleServices.postRole($scope.role_data, function (response) {
                if (response.data.status == true) {
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message = response.data.message;
                    $scope.getAllRoles();
                    $timeout(function () {
                        $location.path('master/role');
                    }, 1000);
                } else {
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message = response.data.message;
                    $scope.getAllRoles();
                    $timeout(function () {
                        $location.path('master/role');
                    }, 1000);

                }
            });
        }

        $scope.deleteRole = function (id) {
            bootbox.confirm('Sure you want to delete this role?<br />Once deleted, it cannot be undone!', function (result) {
                if (result == true)
                {
                    RoleServices.deleteRole(id, function (response) {
                        if (response.data.status == true)
                        {
                            bootbox.alert(response.data.message);
                            $scope.getAllRoles();
                        } else {
                            bootbox.alert(response.data.message);
                            $scope.getAllRoles();
                        }
                    });
                }
            });
        }


    }]);

   