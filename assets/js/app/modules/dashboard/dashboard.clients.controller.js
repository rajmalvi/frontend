app.controller('DashboardController', ['$scope', '$rootScope', '$routeParams', '$window', 'FileUploader', '$compile', 'ClientsServices', '$uibModal', '$http', '$location', '$timeout', '$q', 'session', function ($scope, $rootScope, $routeParams, $window, FileUploader, $compile, ClientsServices, $uibModal, $http, $location, $timeout, $q, session) {
        $scope.chartInstances = ['room_nights_donut_ly'];
        $scope.renderClientCharts = function (charts) {
            
            $timeout(function(){
                
                if($rootScope.enableCharts === false) { return false; }

                console.log(charts);
                
				 //Pickup Revenue Chart
                $scope.chartInstances['dashboard_revenue_pickup'] = Highcharts.chart('dashboard_revenue_pickup', {
                    chart: {
                        type: 'area',
                        height: 200
                    },
                    title: {
                        text: ''
                    },
                    colors:['#cccccc','#7cb5ec'],
                    xAxis: {
                        allowDecimals: true,
                        categories: Object.keys(charts.revenue_last_month),
                        labels: {
                            formatter: function () {
                                return this.value; // clean, unformatted number for year
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Amount'
                        },
                        labels: {
                            formatter: function () {
                                return this.value / 1000 + 'k';
                            }
                        }
                    },
                    tooltip: {
                        pointFormat: 'Total Revenue Pickup: <b>{point.y:,.0f}</b>'
                    },
                    plotOptions: {
                        area: {
                            marker: {
                                enabled: false,
                                symbol: 'circle',
                                radius: 2,
                                states: {
                                    hover: {
                                        enabled: true
                                    }
                                }
                            }
                        }
                    },
                    series: [{
                        name: 'Last Year',
                        data: Object.values(charts.revenue_last_year)
                    },{
                        name: 'This Year',
                        data: Object.values(charts.revenue_last_month)
                    }]
                });
                
                //Occupancy Chart
                $scope.chartInstances['dashboard_occupancy'] = Highcharts.chart('dashboard_occupancy', {
                    chart: {
                        type: 'area'
                    },
                    title: {
                        text: ''
                    },
                    colors:['#cccccc','#7cb5ec'],
                    xAxis: {
                        allowDecimals: true,
                        categories: Object.keys(charts.sold_current_month),
                        labels: {
                            formatter: function () {
                                return this.value; // clean, unformatted number for year
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Rooms Occupied'
                        }
                    },
                    tooltip: {
                        //pointFormat: '{series.name} earned <b>{point.y:,.0f}</b>'
                    },
                    plotOptions: {
                        area: {
                            marker: {
                                enabled: false,
                                symbol: 'circle',
                                radius: 2,
                                states: {
                                    hover: {
                                        enabled: true
                                    }
                                }
                            }
                        }
                    },
                    series: [{
                        name: 'Last Year',
                        data: Object.values(charts.sold_last_year_current)
                    },{
                        name: 'This Year',
                        data: Object.values(charts.sold_current_month)
                    }]
                });
                
				
                //Revenue Chart
                $scope.chartInstances['dashboard_revenue'] = Highcharts.chart('dashboard_revenue', {
                    chart: {
                        type: 'area'
                    },
                    title: {
                        text: ''
                    },
                    colors:['#cccccc','#7cb5ec'],
                    xAxis: {
                        allowDecimals: true,
                        categories: Object.keys(charts.revenue_current_month),
                        labels: {
                            formatter: function () {
                                return this.value; // clean, unformatted number for year
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Amount'
                        },
                        labels: {
                            formatter: function () {
                                return this.value / 1000 + 'k';
                            }
                        }
                    },
                    tooltip: {
                        pointFormat: 'Total Revenue: <b>{point.y:,.0f}</b>'
                    },
                    plotOptions: {
                        area: {
                            marker: {
                                enabled: false,
                                symbol: 'circle',
                                radius: 2,
                                states: {
                                    hover: {
                                        enabled: true
                                    }
                                }
                            }
                        }
                    },
                    series: [{
                        name: 'Last Year',
                        data: Object.values(charts.revenue_last_year_current)
                    },
                    {
                        name: 'This Year',
                        data: Object.values(charts.revenue_current_month)
                    }]
                });
                
               
                //Pickup Occupancy Chart
                $scope.chartInstances['dashboard_occupancy_pickup'] = Highcharts.chart('dashboard_occupancy_pickup', {
                    chart: {
                        type: 'area',
                        height: 200
                    },
                    title: {
                        text: ''
                    },
                    colors:['#cccccc','#7cb5ec'],
                    xAxis: {
                        allowDecimals: true,
                        categories: Object.keys(charts.revenue_last_month),
                        labels: {
                            formatter: function () {
                                return this.value; // clean, unformatted number for year
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Rooms Occupied'
                        }
                    },
                    tooltip: {
                        //pointFormat: '{series.name} earned <b>{point.y:,.0f}</b>'
                    },
                    plotOptions: {
                        area: {
                            marker: {
                                enabled: false,
                                symbol: 'circle',
                                radius: 2,
                                states: {
                                    hover: {
                                        enabled: true
                                    }
                                }
                            }
                        }
                    },
                    series: [{
                        name: 'Last Year',
                        data: Object.values(charts.sold_last_year)
                    },{
                        name: 'This Year',
                        data: Object.values(charts.sold_last_month)
                    }]
                });
                
                //Revenue - 30 Days
                var colors = Highcharts.getOptions().colors,
                categories_booking_status = Object.keys(charts.revenue_current_month_by_ota),
                data_booking_status = Object.values(charts.revenue_current_month_by_ota),
                contributionData = [],
                i,
                j,
                dataLen_booking_status = Object.keys(charts.revenue_current_month_by_ota).length,
                drillDataLen,
                brightness;

                // Build the data arrays
                for (i = 0; i < dataLen_booking_status; i += 1) {

                    // add version data
                    contributionData.push({
                        name: categories_booking_status[i],
                        y: data_booking_status[i],
                        color: Highcharts.Color(data_booking_status[i].color).brighten(brightness).get()
                    });
                }
                
                $scope.chartInstances['dashboard_revenue_30days'] = Highcharts.chart('dashboard_revenue_30days', {
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
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
                                enabled: true
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
                                                enabled: true
                                            }
                                        }]
                                }
                            }]
                    }
                });
                
                //Room Nights 30 Days
                var colors = Highcharts.getOptions().colors,
                categories_booking_count = Object.keys(charts.sold_current_month_by_ota),
                data_booking_count = Object.values(charts.sold_current_month_by_ota),
                contributionData = [],
                i,
                j,
                dataLen_booking_count = Object.keys(charts.sold_current_month_by_ota).length,
                drillDataLen,
                brightness;

                // Build the data arrays
                for (i = 0; i < dataLen_booking_count; i += 1) {

                    // add version data
                    contributionData.push({
                        name: categories_booking_count[i],
                        y: data_booking_count[i],
                        color: Highcharts.Color(data_booking_count[i].color).brighten(brightness).get()
                    });
                }
                
                $scope.chartInstances['dashboard_booking_count'] = Highcharts.chart('dashboard_booking_count', {
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
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
                                enabled: true
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
                                                enabled: true
                                            }
                                        }]
                                }
                            }]
                    }
                });
                
                //Revenue 365
                var colors = Highcharts.getOptions().colors,
                categories_arrival = Object.keys(charts.revenue_last_year_current_by_ota),
                data_arrival = Object.values(charts.revenue_last_year_current_by_ota),
                contributionData = [],
                i,
                j,
                dataLen_arrival = Object.keys(charts.revenue_last_year_current_by_ota).length,
                drillDataLen,
                brightness;

                // Build the data arrays
                for (i = 0; i < dataLen_arrival; i += 1) {

                    // add version data
                    contributionData.push({
                        name: categories_arrival[i],
                        y: data_arrival[i],
                        color: Highcharts.Color(data_arrival[i].color).brighten(brightness).get()
                    });
                }
                
                $scope.chartInstances['dashboard_revenue_365days'] = Highcharts.chart('dashboard_revenue_365days', {
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
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
                                enabled: true
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
                                                enabled: true
                                            }
                                        }]
                                }
                            }]
                    }
                });
                
                //Room Nights 365
                var colors = Highcharts.getOptions().colors,
                categories_room_count = Object.keys(charts.sold_last_year_current_by_ota),
                data_room_count = Object.values(charts.sold_last_year_current_by_ota),
                contributionData = [],
                i,
                j,
                dataLen_room_count = Object.keys(charts.sold_last_year_current_by_ota).length,
                drillDataLen,
                brightness;

                // Build the data arrays
                for (i = 0; i < dataLen_room_count; i += 1) {

                    // add version data
                    contributionData.push({
                        name: categories_room_count[i],
                        y: data_room_count[i],
                        color: Highcharts.Color(data_room_count[i].color).brighten(brightness).get()
                    });
                }
                
                $scope.chartInstances['dashboard_room_count'] = Highcharts.chart('dashboard_room_count', {
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
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
                
            },500);
        };

        $scope.loadingClient = true;
		$http.get($rootScope.backend+'/clients/clients/getDashboard/getMinCompetitorPricingForNextTenDays',{ params:{clientId:localStorage.getItem("client_id") } }).then(function(response) {
            $scope.competitor_pricing= response.data;
		});
        //$http.get($rootScope.backend2+'/clients/analysis/getDashboard',{ params:{ } }).then(function(response) {
       $http.get($rootScope.backend+'/clients/clients/getDashboard/getOtaPerformanceSummary',{ params:{clientId:localStorage.getItem("client_id") } }).then(function(response) {
            $scope.loadingClient = false;
			response.data.status = true;
            if(response.data.status == true) {
				$scope.charts={};
				
				//last 
				$scope.charts.revenue_last_month = response.data.lastMonthRevenuePickup;
				$scope.charts.sold_last_month = response.data.lastMonthRoomSoldPickup;
				
				$scope.charts.revenue_last_year = response.data.lastYearRevenuePickup;				
				$scope.charts.sold_last_year = response.data.lastYearRoomSoldPickup;
				
				//current
				$scope.charts.revenue_current_month = response.data.currentRevenueTrend;
				$scope.charts.sold_current_month = response.data.currentRoomSoldTrend;
				
				$scope.charts.revenue_last_year_current = response.data.lastYearCurrentRevenueTrend;				
				$scope.charts.sold_last_year_current = response.data.lastYearCurrentRoomSoldTrend;
				
				//byOta
				$scope.charts.revenue_current_month_by_ota = response.data.currentRevenueTrendByOta;
				$scope.charts.sold_current_month_by_ota = response.data.currentRoomSoldTrendByOta;
				
				$scope.charts.revenue_last_year_current_by_ota = response.data.lastYearCurrentRevenueTrendByOta;				
				$scope.charts.sold_last_year_current_by_ota = response.data.lastYearCurrentRoomSoldTrendByOta;
				
                $scope.renderClientCharts($scope.charts);  
                $scope.stats = response.data.stats;
                $scope.competitor_pricing = response.data.competitor_pricing;
				
				$scope.grid = response.data.nextTenDaysOtaList;

                $scope.statBoxRevenuePopover  = {
                    revenue_yesterday: response.data.yesterdaysOta.revenue,
                    revenue_lm: response.data.lastMontOta.revenue,
                    revenue_tm: response.data.thisMonthOta.revenue,
                    templateUrl: 'statBoxRevenuePopover.html',
                    title: 'Title'
                };

                $scope.statBoxADRPopover = {
                    arr_yesterday: response.data.yesterdaysOta.adr,
                    arr_lm: response.data.lastMontOta.adr,
                    arr_tm: response.data.thisMonthOta.adr,
                    templateUrl: 'statBoxADRPopover.html',
                    title: 'Title'
                };

                $scope.statBoxOccupancyPopover = {
                    occupancy_yesterday: response.data.yesterdaysOta.sold,
                    occupancy_lm: response.data.lastMontOta.sold,
                    occupancy_tm: response.data.thisMonthOta.sold,
                    templateUrl: 'statBoxOccupancyPopover.html',
                    title: 'Title'
                };

                $scope.statBoxPickupPopover = {
                    pickups_yesterday: response.data.yesterdaysOta.pickup,
                    pickups_lm: response.data.lastMontOta.pickup,
                    pickups_tm: response.data.thisMonthOta.pickup,
                    templateUrl: 'statBoxPickupPopover.html',
                    title: 'Title'
                };
            }
        });
                
        $('.btn-chart-zoom').click(function(){
            $(this).parent('.chart-container').addClass('chart-modal');
            $(this).hide();
            $(this).siblings('.btn-chart-zoom-out').show();
            var chart = $(this).attr('data-chart');
            $scope.chartInstances[chart].setSize(null,400);
            $scope.chartInstances[chart].reflow();
        });

        $('.btn-chart-zoom-out').click(function(){
            $(this).parent('.chart-container').removeClass('chart-modal');
            $(this).hide();
            $(this).siblings('.btn-chart-zoom').show();
            var chart = $(this).attr('data-chart');
            if(chart == 'dashboard_revenue_pickup' || chart == 'dashboard_occupancy_pickup') {
                $scope.chartInstances[chart].setSize(undefined,200);
            }
            else {
                $scope.chartInstances[chart].setSize(undefined,400);
            }
            $scope.chartInstances[chart].reflow();
        });
        

    }]);