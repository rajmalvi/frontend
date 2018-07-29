app.controller('DashboardController', ['$scope', '$rootScope', '$routeParams', '$window', 'FileUploader', '$compile', 'ClientsServices', '$uibModal', '$http', '$location', '$timeout', '$q', 'session', function ($scope, $rootScope, $routeParams, $window, FileUploader, $compile, ClientsServices, $uibModal, $http, $location, $timeout, $q, session) {
        $scope.chartInstances = ['room_nights_donut_ly'];
        $scope.renderClientCharts = function (charts) {
            
            $timeout(function(){
                
                if($rootScope.enableCharts === false) { return false; }

                console.log(charts);
                
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
                        categories: charts.revenue.categories,
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
                        name: charts.revenue.ly,
                        data: charts.revenue.data_ly
                    },
                    {
                        name: charts.revenue_pickup.ty,
                        data: charts.revenue.data
                    }]
                });
                
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
                        categories: charts.revenue_pickup.categories,
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
                        name: charts.revenue_pickup.ly,
                        data: charts.revenue_pickup.data_ly
                    },{
                        name: charts.revenue_pickup.ty,
                        data: charts.revenue_pickup.data
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
                        categories: charts.occupancy.categories,
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
                        name: charts.occupancy.ly,
                        data: charts.occupancy.data_ly
                    },{
                        name: charts.occupancy.ty,
                        data: charts.occupancy.data
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
                        categories: charts.occupancy_pickup.categories,
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
                        name: charts.occupancy_pickup.ly,
                        data: charts.occupancy_pickup.data_ly
                    },{
                        name: charts.occupancy_pickup.ty,
                        data: charts.occupancy_pickup.data
                    }]
                });
                
                //Revenue - 30 Days
                var colors = Highcharts.getOptions().colors,
                categories_booking_status = charts.revenue_30days.categories,
                data_booking_status = charts.revenue_30days.values,
                contributionData = [],
                i,
                j,
                dataLen_booking_status = data_booking_status.length,
                drillDataLen,
                brightness;

                // Build the data arrays
                for (i = 0; i < dataLen_booking_status; i += 1) {

                    // add version data
                    contributionData.push({
                        name: data_booking_status[i].name,
                        y: data_booking_status[i].y,
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
                categories_booking_count = charts.room_nights_30days.categories,
                data_booking_count = charts.room_nights_30days.values,
                contributionData = [],
                i,
                j,
                dataLen_booking_count = data_booking_count.length,
                drillDataLen,
                brightness;

                // Build the data arrays
                for (i = 0; i < dataLen_booking_count; i += 1) {

                    // add version data
                    contributionData.push({
                        name: data_booking_count[i].name,
                        y: data_booking_count[i].y,
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
                categories_arrival = charts.revenue_365days.categories,
                data_arrival = charts.revenue_365days.values,
                contributionData = [],
                i,
                j,
                dataLen_arrival = data_arrival.length,
                drillDataLen,
                brightness;

                // Build the data arrays
                for (i = 0; i < dataLen_arrival; i += 1) {

                    // add version data
                    contributionData.push({
                        name: data_arrival[i].name,
                        y: data_arrival[i].y,
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
                categories_room_count = charts.room_nights_365days.categories,
                data_room_count = charts.room_nights_365days.values,
                contributionData = [],
                i,
                j,
                dataLen_room_count = data_room_count.length,
                drillDataLen,
                brightness;

                // Build the data arrays
                for (i = 0; i < dataLen_room_count; i += 1) {

                    // add version data
                    contributionData.push({
                        name: data_room_count[i].name,
                        y: data_room_count[i].y,
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
        $http.get($rootScope.backend2+'/clients/analysis/getDashboard',{ params:{ } }).then(function(response) {
            $scope.loadingClient = false;
            if(response.data.status == true) {
                $scope.renderClientCharts(response.data.charts);  
            
                $scope.stats = response.data.stats;
                $scope.grid = response.data.grid;
                $scope.competitor_pricing = response.data.competitor_pricing;
                $scope.statBoxRevenuePopover = {
                    revenue_yesterday: response.data.stats.revenue_yesterday,
                    revenue_lm: response.data.stats.revenue_lm,
                    revenue_tm: response.data.stats.revenue_tm,
                    templateUrl: 'statBoxRevenuePopover.html',
                    title: 'Title'
                };

                $scope.statBoxADRPopover = {
                    arr_yesterday: response.data.stats.arr_yesterday,
                    arr_lm: response.data.stats.arr_lm,
                    arr_tm: response.data.stats.arr_tm,
                    templateUrl: 'statBoxADRPopover.html',
                    title: 'Title'
                };

                $scope.statBoxOccupancyPopover = {
                    occupancy_yesterday: response.data.stats.occupancy_yesterday,
                    occupancy_lm: response.data.stats.occupancy_lm,
                    occupancy_tm: response.data.stats.occupancy_tm,
                    templateUrl: 'statBoxOccupancyPopover.html',
                    title: 'Title'
                };

                $scope.statBoxPickupPopover = {
                    pickups_yesterday: response.data.stats.pickups_yesterday,
                    pickups_lm: response.data.stats.pickups_lm,
                    pickups_tm: response.data.stats.pickups_tm,
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