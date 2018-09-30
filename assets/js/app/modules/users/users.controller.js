app.controller('UsersController', ['$scope', '$rootScope', '$routeParams', '$window', 'FileUploader', '$compile', 'UsersServices', '$uibModal', function ($scope, $rootScope, $routeParams, $window, FileUploader, $compile, MembersServices, $uibModal) {

     $scope.currentAccount = $routeParams.mID;

        $scope.success_msg = false;
        $scope.danger_msg = false;
        
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
                            {name: 'client_id', type: 'int'},
                            {name: 'client_name', type: 'string'},
                            {name: 'client_property_id', type: 'int'},
                            {name: 'client_password', type: 'string'},
                            {name: 'client_email', type: 'string'},
                            {name: 'client_phone_no', type: 'string'},
                            {name: 'client_role', type: 'int'},
                            {name: 'client_reg_date', type: 'string'},
                            {name: 'client_status', type: 'string'}
                        ],
                        root: "clients",
                        id: 'client_id',
                        url: $rootScope.backend2 + '/clients/getAllClients',
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
                        showfilterrow: true,
                        selectionmode: 'singlerow',
                        columns: [
                            {text: 'ID', datafield: 'client_id', width: '10%'},
                            {text: 'User Name', datafield: 'client_name', width: '20%'},
                            {text: 'User Property', datafield: 'client_property_id', width: '20%'},
                            {text: 'User Password', datafield: 'client_password', width: '20%'},
                            {text: 'User Email', datafield: 'client_email', width: '20%'},
                            {text: 'User Phone Number', datafield: 'client_phone_no', width: '10%'},
                            {text: 'User Role', datafield: 'client_role', width: '10%'},
                            {text: 'User Registration Date', datafield: 'client_reg_date', width: '10%'},
                            {text: 'User Status', datafield: 'client_status', cellsrenderer: cellsrenderer, width: '10%'}
                        ]
                    };
            $scope.createWidget = true;
        };
        $scope.getAllAccounts();
         $rootScope.$on('getAllAccounts', function (notice) {
            $scope.getAllAccounts();
        });

        //after clicked on member show details based on account id
        $scope.account = {};
        $rootScope.gridSettings.rowselect = function (response) {
            if (typeof (response.args.row != 'undefined'))
            {
                UsersServices.getClientDetails(response.args.row.client_id, function (response) {
                    $scope.user = response.data.details;
                });
            }
        };
        
        $scope.deleteClient = function(id){
            UsersServices.deleteClient(id,function(response){
               if(response.data.status == true){
                    $scope.getAllAccounts();
                   alert(response.data.message);
               } else{
                    $scope.getAllAccounts();
                   alert(response.data.message);
               }
            });
        }
        
        $scope.openModal = function () {
            var modalInstance = $uibModal.open({
                    templateUrl: 'user_add.html',
                    controller: 'UsertModalController',
                   resolve: {
			 value: function () {
				   
			 }
			}
                });
        
        };
        
         }]);  
        
     app.controller('UsertModalController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'UsersServices', '$compile', 'FileUploader', 'value', '$rootScope', function ($scope, $rootScope, $uibModalInstance, $window ,UsersServices, $compile, FileUploader, value, $rootScope) {
          
        $scope.client_data = {};  
        $scope.addClient = function(){
           UsersServices.postClient (function(response){
               if(response.data.status == true){
                    $scope.success_msg = true;
                    $scope.danger_msg = false;
                    $scope.sub_message= response.data.message;
                    setTimeout(function () {
                            $uibModalInstance.close();
 			  }, 1000);
		$rootScope.$emit('getAllAccounts');
               }else{
                    $scope.success_msg = false;
                    $scope.danger_msg = true;
                    $scope.sub_message= response.data.message;
                    alert(response.data.message);
               }
           });
//               console.log($scope.client_data);
        }
        
	$scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);