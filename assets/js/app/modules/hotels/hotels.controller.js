app.controller('HotelsController', ['$scope', '$rootScope', '$routeParams', '$window', 'FileUploader', '$compile', 'HotelsServices', function ($scope, $rootScope, $routeParams, $window, FileUploader, $compile, MembersServices) {

//     $scope.currentAccount = $routeParams.mID;
//
//        setTimeout(function () {
//            $('.select2').select2();
//        }, 100);
//
//        // get all System Users on jq
//        // get all Members on jqxgrid
//        $scope.getAllAccounts = function () {
//            $scope.createWidget = false;
//            // prepare the data
//            var source_members =
//                    {
//                        datatype: "json",
//                        datafields: [
//                            {name: 'hotel_id', type: 'int'},
//                            {name: 'hotel_code', type: 'int'},
//                            {name: 'hotel_name', type: 'string'},
//                            {name: 'hotel_address', type: 'string'},
//                            {name: 'hotel_city', type: 'string'},
//                            {name: 'hotel_state', type: 'string'},
//                            {name: 'hotel_zip', type: 'int'},
//                            {name: 'hotel_country', type: 'string'},
//                            {name: 'hotel_latitude', type: 'string'},
//                            {name: 'hotel_longitude', type: 'string'}
//                        ],
//                        root: "accounts",
//                        id: 'account_id',
//                        url: $rootScope.backend + '/hotels/getAllHotels',
//                        beforeprocessing: function (data)
//                        {
//                            source_members.totalrecords = data.totalRows;
//                        },
//                        filter: function ()
//                        {
//                            // update the grid and send a request to the server.
//                            $rootScope.gridSettings.apply('updatebounddata', 'filter');
//                        },
//                        pager: function (pagenum, pagesize, oldpagenum) {
//                        },
//                        sort: function () {
//                            $rootScope.gridSettings.apply('updatebounddata', 'sort');
//                        }
//                    };
//            var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
//                if (value == 'Block') {
//                    return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #FF0000;">' + value + '</span>';
//                } else if (value == 'Active') {
//                    return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #008000;">' + value + '</span>';
//                } else if (value == 'Pending') {
//                    return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #FFCC00;">' + value + '</span>';
//                }
//            };
//            var dataAdapter = new $.jqx.dataAdapter(source_members, {
//                downloadComplete: function (data, status, xhr) {
//                },
//                loadComplete: function (data) {
//
//                },
//                loadError: function (xhr, status, error) {
//                }
//            });
//            /*End of main grid*/
//            // initialize jqxGrid
//            $rootScope.gridSettings =
//                    {
//                        width: '100%',
//                        source: dataAdapter,
//                        pageable: true,
//                        autoheight: true,
//                        filterable: true,
//                        sortable: true,
//                        altrows: true,
//                        virtualmode: true,
//                        ready: function ()
//                        {
//                            $rootScope.gridSettings.apply('selectrow', 0);
//                        },
//                        rendergridrows: function (obj)
//                        {
//                            return obj.data;
//                        },
//                        enabletooltips: true,
//                        //showfilterrow: true,
//                        selectionmode: 'singlerow',
//                        columns: [
//                            {text: 'ID', datafield: 'hotel_id', width: '10%'},
//                            {text: 'Hotel Code', datafield: 'hotel_code', width: '20%'},
//                            {text: 'Hotel Name', datafield: 'hotel_name', width: '20%'},
//                            {text: 'Hotel Address', datafield: 'hotel_address', width: '20%'},
//                            {text: 'Hotel City', datafield: 'hotel_city', width: '20%'},
//                            {text: 'Hotel State', datafield: 'hotel_state', width: '10%'},
//                            {text: 'Hotel Zip', datafield: 'hotel_zip', width: '10%'},
//                            {text: 'Hotel Country', datafield: 'hotel_country', width: '10%'},
//                            {text: 'Hotel Latitude', datafield: 'hotel_latitude', width: '10%'},
//                            {text: 'Hotel Longitude', datafield: 'hotel_longitude', filtertype: 'checkedlist', cellsrenderer: cellsrenderer, width: '10%'}
//                        ]
//                    };
//            $scope.createWidget = true;
//        };
//        $scope.getAllAccounts();
//
//        //after clicked on member show details based on account id
//        $scope.account = {};
//        $rootScope.gridSettings.rowselect = function (response) {
//            if (typeof (response.args.row != 'undefined'))
//            {
//                MembersServices.getAccountDetails(response.args.row.account_id, function (response) {
//                    $scope.account = response.data.details;
//                });
//            }
//        };

       }]);