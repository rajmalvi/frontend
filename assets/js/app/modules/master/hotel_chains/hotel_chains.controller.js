app.controller('HotelChainsController', ['$scope', '$rootScope', '$routeParams', '$window', 'FileUploader', '$compile', 'HotelChainsServices', '$uibModal',function ($scope, $rootScope, $routeParams, $window, FileUploader, $compile, HotelChainsServices, $uibModal) {

        $scope.currentAccount = $routeParams.mID;
        $scope.success_msg = false;
        $scope.danger_msg = false;
        
        $scope.hotel_chain_data = {};
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
                            {name: 'description', type: 'string'},
                            {name: 'regdate', type: 'datetime'},
                            {name: 'author', type: 'int'},
                            {name: 'status', type: 'string'},
                          
                        ],
                        root: "hotelchains",
                        id: 'id',
                        url: $rootScope.backend2 + '/hotelChains/HotelChains/getAllHotelchains',
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
                            {text: 'Description', datafield: 'description', width: '40%'},
                            {text: 'Datetime', datafield: 'regdate', width: '10%'},
                            {text: 'Author', datafield: 'author', width: '10%'},
                            {text: 'Status', datafield: 'status', cellsrenderer: cellsrenderer, width: '10%'}
                        ]
                    };
            $scope.createWidget = true;
        };
        $scope.getAllHotels();
        
         $rootScope.$on('reloadData', function (notice) {
            $scope.getAllHotels();
        });

        //after clicked on member show details based on account id
        $scope.hotel = {};
        $rootScope.gridSettings.rowselect = function (response) {
            if (typeof(response.args.row !== undefined))
            {
                HotelChainsServices.getHotelChainDetails(response.args.row.id, function (response) {
                    $scope.hotel_chain = response.data.details;
                  
                });
            }
        };
        
        $scope.deleteHotelChain = function(id){
             bootbox.confirm('Sure you want to delete this hotel chain?<br />Once deleted, it cannot be undone!', function (result) {
                if (result == true)
                {
                    HotelChainsServices.deleteHotelChain(id, function (response) {
                        if (response.data.status == true)
                        {
                            bootbox.alert(response.data.message);
                            $scope.getAllHotels();
                        }
                        else{
                            bootbox.alert(response.data.message);
                            $scope.getAllHotels();
                        }
                    });
                }
            });
        }
        
        
         $scope.openModal = function () {
            var modalInstance = $uibModal.open({
                    templateUrl: 'hotel_chain_add.html',
                    controller: 'HotelChainAddController',
                   resolve: {
			 value: function () {
				   
			 }
			}
                });
        
        };
        
         $scope.openModal1 = function (id) {
            HotelChainsServices.editHotelChain(id,function(response){	
			if(response.data.status == true){
			$scope.edit_hotelchain = response.data.details;
		     var modalInstance = $uibModal.open({
				 templateUrl: 'hotel_chain_edit.html',
                                controller: 'HotelChainEditController',
				resolve: {
				    value: function () {
				        return $scope.edit_hotelchain;
				    }
				}
			    });
			}
			
		});
        };
        
         }]);  
       
       //add modal
     app.controller('HotelChainAddController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'HotelChainsServices', '$compile', 'FileUploader', 'value', '$rootScope', function ($scope, $rootScope, $uibModalInstance, $window ,HotelChainsServices, $compile, FileUploader, value, $rootScope) {
             $scope.searchStatus = function(keywords){
            var params = {keywords: keywords};
                  $scope.status =  [{ name: 'Active'},{ name: 'Disabled'}];
             }  
        $scope.hotel_chain_data = {};
        $scope.addHotelChain = function(){
            HotelChainsServices.postHotelChain($scope.hotel_chain_data,function(response){
			if(response.data.status == true){
                            $scope.success_msg = true;
                            $scope.danger_msg = false;
                         $scope.sub_message = response.data.message;
			setTimeout(function () {
                            $uibModalInstance.close();
 			  }, 1000);
		        $rootScope.$emit('reloadData');
		      }else{
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
   
   //edit modal
     app.controller('HotelChainEditController', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'HotelChainsServices', '$compile', 'FileUploader', 'value', '$rootScope', function ($scope, $rootScope, $uibModalInstance, $window ,HotelChainsServices, $compile, FileUploader, value, $rootScope) {
    $scope.searchStatus = function(keywords){
            var params = {keywords: keywords};
                $scope.status =  [{ name: 'Active'},{ name: 'Disabled'}];
        }  
     if(value != null){
	$scope.hotel_chain_data = value;
    }
        $scope.addHotelChain = function(){
            HotelChainsServices.postHotelChain($scope.hotel_chain_data, function(response){
			if(response.data.status == true){
                            $scope.success_msg = true;
                            $scope.danger_msg = false;
                         $scope.sub_message = response.data.message;
			setTimeout(function () {
                            $uibModalInstance.close();
 			  }, 1000);
		        $rootScope.$emit('reloadData');
		      }else{
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