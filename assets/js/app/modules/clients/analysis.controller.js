app.controller('AnalysisController', ['$scope', '$rootScope', '$routeParams', '$window', 'FileUploader', '$compile', 'ClientsServices', '$uibModal', '$http', '$location', '$timeout', '$q', 'session', 'view', function ($scope, $rootScope, $routeParams, $window, FileUploader, $compile, ClientsServices, $uibModal, $http, $location, $timeout, $q, session, view) {
        
        $scope.disparities = {};
        $scope.view_title = '';
        $scope.view = view;
        $scope.daterange = '';
        
        $timeout(function(){
            switch(view) {
                case 'rate_disparity':
                    $scope.view_title = 'Rate Disparity';
                    $scope.roomType = '';
                    $scope.room_types = [];
                    $scope.getRateDisparity = function(rt) {
                        $scope.loadingClient = true;
                        ClientsServices.getRateDisparity(rt, function(response){
                            $scope.loadingClient = false;
                            if(response.data.status) {
                                $scope.disparities = response.data.disparities;
                                $scope.room_types = response.data.room_types;
                            }
                        });
                    };
                    $scope.getRateDisparity('');
                break;
                case 'rate_pace':
                    $scope.view_title = 'Market Price Position';
                    $scope.getRatePace = function(rt) {
                        $scope.loadingClient = true;
                        ClientsServices.getRatePaceChart(rt,function(response){
                            $scope.loadingClient = false;
                            if(response.data.status) {
                                $scope.renderRatePaceChart(response.data.rate_pace);
                                $scope.room_types = response.data.room_types;
                            }
                        });
                    };
                    $scope.getRatePace('');
                break;
                case 'rate_analysis':
                    $scope.view_title = 'Rate Analysis';
                break;
                case 'historical':
                    $scope.view_title = 'Performance Analysis (Max 1 Year)';
                    $scope.reloadHistoricalGraphs = function(range) {
                        $scope.daterange = range;
                        $scope.loadingClient = true;
                        ClientsServices.getHistoricalCharts(range,function(response){
                            $scope.loadingClient = false;
                            if(response.data.status) {
                                $scope.otas = response.data.otas;
                                $scope.renderHistoricalCharts(response.data.analysis);
                            }
                        });
                    };
                    $scope.reloadHistoricalGraphs('');
                break;
                case 'pattern':
                    $scope.view_title = 'Pattern Analysis (Max 1 Year)';
                    $scope.charts = {
                        room_nights_rate_band_ly: {
                            otas:[]
                        },
                        room_nights_rate_band_ty: {
                            otas:[]
                        },
                        pace_analysis: {
                            otas:[]
                        },
                        rate_band_dow_ly: {
                            otas:[]
                        },
                        rate_band_dow_ty: {
                            otas:[]
                        },
                        rpd_vs_adr_ly: {
                            otas:[]
                        },
                        arrival_vs_los: {
                            otas:[]
                        },
                        arrival_vs_los_ly: {
                            otas:[]
                        },
                        rpd_vs_adr: {
                            otas:[]
                        },
                        rpd_vs_adr_ly: {
                            otas:[]
                        }
                    };
                    $scope.reloadHistoricalGraphs = function(range) {
                        $scope.loadingClient = true;
                        $scope.daterange = range;
                        ClientsServices.getPatternCharts(range,function(response){
                            $scope.loadingClient = false;
                            if(response.data.status) {
                                $scope.otas = response.data.otas;
                                $scope.renderPatternCharts(response.data.analysis);
                            }
                        });
                    };
                    $scope.reloadHistoricalGraphs('');
                break;
                case 'competitor':
                    $scope.view_title = 'Competitor Pricing';
                    $scope.roomType = '';
                    $scope.room_types = [];
                    $scope.getCompetitorComparison = function(rt) {
                        $scope.loadingClient = true;
                        ClientsServices.getCompetitorPricing(rt, function(response){
                            $scope.loadingClient = false;
                            if(response.data.status) {
                                $scope.competitor_pricing = response.data.competitor_pricing;
                                $scope.room_types = response.data.room_types;
                            }
                        });
                    };
                    $scope.getCompetitorComparison('');
                break;
            }
        },200);
        
        $scope.loadingClient = false;

        //search country 
        $scope.searchCountry = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend + '/import/searchCountries',
                    {params: params}
            ).then(function (response) {
                $scope.countries = response.data.results;
            });
        };

        //on change country
        $scope.country_change = function (item) {
            $scope.country_id = item.id;
            $scope.country_name = item.name;
        };

        //search states
        $scope.searchStates = function (keywords) {
            var params = {keywords: keywords};
//              if(country == '' || country == null){
            return $http.get(
                    $rootScope.backend + '/import/searchStates/?country=' + $scope.country_id,
                    {params: params}
            ).then(function (response) {
                $scope.states = response.data.results;
                $scope.show_error_state = false;
                if ($scope.states == '') {
                    $scope.show_error_state = true;
                    $scope.state_no_msg = 'Please select country first';
                }
            });
        };

        //on cahnge state
        $scope.state_change = function (item) {
            $scope.state_id = item.id;
            $scope.state_name = item.name;
        }

        //search currency
        $scope.searchCurrency = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend2 + '/hotels/hotels/searchCurrency',
                    {params: params}
            ).then(function (response) {
                $scope.currency = response.data.results;
            });
        };

        //search city
        $scope.searchCity = function (keywords) {
            var params = {keywords: keywords, country: $scope.country_id, state: $scope.state_id};
//            if(state == ''){
            return $http.get(
                    $rootScope.backend + '/import/searchCities',
                    {params: params}
            ).then(function (response) {
                $scope.cities = response.data.results;
                $scope.show_error_city = false;
                if ($scope.cities == '') {
                    $scope.show_error_city = true;
                    $scope.state_no_msg = 'No data found';
                }
            });
        };
        
        $scope.searchOTAs = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend + '/setup/otasetup/getAllOtas',
                    {params: params}
            ).then(function (response) {
                $scope.otas_name = response.data.details;
            });
        };
        
        //Room Types
        $scope.searchRoomtypes = function (keywords) {
            var params = {keywords: keywords};
            return $http.get(
                    $rootScope.backend2 + '/setup/room_types/searchRoomtypesName',
                    {params: params}
            ).then(function (response) {
                $scope.room_types_name = response.data.details;
            });
        };
                
        //Charting codes
        $scope.$watch(function(){
            return $rootScope.enableCharts;
        },function(n,o){
            if(n === true) {
                //$scope.renderClientCharts();
            }
        });
        
        $scope.chartInstances = ['room_nights_donut_ly'];
        
        $scope.renderRatePaceChart = function (chart) {
            
            console.log('Loading rate pace chart..');
            $timeout(function(){
                
                if($rootScope.enableCharts === false) { return false; }

                Highcharts.chart('rate_pace_chart', {

                    title: {
                        text: 'Market Price Range v/s Hotel Rates'
                    },

                    xAxis: {
                        categories: chart.categories
                    },

                    yAxis: {
                        title: {
                            text: null
                        }
                    },

                    tooltip: {
                        crosshairs: true,
                        shared: true,
                        //valueSuffix: '°C'
                    },

                    legend: {
                    },
                    series: chart.series
                });
            },500);
            
        };
        
        $scope.selectGraphOTA = function(item,modal,type) {
            $scope.$apply();
                console.log($scope.daterange);
            if(type == 'room_nights_rate_band_ly') {
                ClientsServices.getRoomNightsRateBandLY($scope.charts.room_nights_rate_band_ly.otas,$scope.daterange,function(response){
                    if(response.data.status) {
                        $scope.renderRoomNightsRateBandLY(response.data.data);
                    }
                });
            }
            else if(type == 'room_nights_rate_band_ty') {
                ClientsServices.getRoomNightsRateBandTY($scope.charts.room_nights_rate_band_ty.otas,$scope.daterange,function(response){
                    if(response.data.status) {
                        $scope.renderRoomNightsRateBandTY(response.data.data);
                    }
                });
            }
            else if(type == 'pace_analysis') {
                ClientsServices.getPaceAnalysis($scope.charts.pace_analysis.otas,$scope.daterange,function(response){
                    if(response.data.status) {
                        $scope.renderPaceAnalysis(response.data.data);
                    }
                });
            }
            else if(type == 'rate_band_dow_ly') {
                ClientsServices.getRateBandDOWLY($scope.charts.rate_band_dow_ly.otas,$scope.daterange,function(response){
                    if(response.data.status) {
                        $scope.renderRateBandDOWLY(response.data.data);
                    }
                });
            }
            else if(type == 'rate_band_dow_ty') {
                ClientsServices.getRateBandDOWTY($scope.charts.rate_band_dow_ty.otas,$scope.daterange,function(response){
                    if(response.data.status) {
                        $scope.renderRateBandDOWTY(response.data.data);
                    }
                });
            }
            else if(type == 'arrival_vs_los') {
                ClientsServices.getArrivalvsLOS($scope.charts.arrival_vs_los.otas,$scope.daterange,function(response){
                    if(response.data.status) {
                        $scope.renderArrivalvsLOS(response.data.data);
                    }
                });
            }
            else if(type == 'arrival_vs_los_ly') {
                ClientsServices.getArrivalvsLOSLY($scope.charts.arrival_vs_los_ly.otas,$scope.daterange,function(response){
                    if(response.data.status) {
                        $scope.renderArrivalvsLOSLY(response.data.data);
                    }
                });
            }
            else if(type == 'rpd_vs_adr') {
                ClientsServices.getRPDvsADR($scope.charts.rpd_vs_adr.otas,$scope.daterange,function(response){
                    if(response.data.status) {
                        $scope.renderRPDvsADR(response.data.data);
                    }
                });
            }
            else if(type == 'rpd_vs_adr_ly') {
                ClientsServices.getRPDvsADRLY($scope.charts.rpd_vs_adr_ly.otas,$scope.daterange,function(response){
                    if(response.data.status) {
                        $scope.renderRPDvsADRLY(response.data.data);
                    }
                });
            }
        };
        
        $scope.renderRoomNightsRateBandLY = function(room_nights_rate_band_ly) {
            $scope.chartInstances['room_nights_rate_band_ly'] = Highcharts.chart('room_nights_rate_band_ly', {
                chart: {
                    type: 'waterfall'
                },

                title: {
                    text: 'Room Nights Rate Band Last Year'
                },

                xAxis: {
                    type: 'category',
                    title: {
                        text: 'Rate Band'
                    }
                },

                yAxis: {
                    title: {
                        text: 'Room Nights'
                    }
                },
                legend: {
                    enabled: false
                },

                tooltip: {
                    pointFormat: '<b>{point.y:,.2f}</b>'
                },

                series: [{
                    upColor: Highcharts.getOptions().colors[0],
                    color: Highcharts.getOptions().colors[3],
                    data: room_nights_rate_band_ly.categories,
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            //return Highcharts.numberFormat(this.y / 1000, 0, ',') + 'k';
                        },
                        style: {
                            fontWeight: 'bold'
                        }
                    },
                    pointPadding: 0
                }]
            });  
        };
        
        $scope.renderRoomNightsRateBandTY = function(room_nights_rate_band_ty) {
            $scope.chartInstances['room_nights_rate_band_ty'] = Highcharts.chart('room_nights_rate_band_ty', {
                chart: {
                    type: 'waterfall'
                },

                title: {
                    text: 'Room Nights Rate Band This Year'
                },

                xAxis: {
                    type: 'category',
                    title: {
                        text: 'Rate Band'
                    }
                },

                yAxis: {
                    title: {
                        text: 'Room Nights'
                    }
                },
                legend: {
                    enabled: false
                },

                tooltip: {
                    pointFormat: '<b>{point.y:,.2f}</b>'
                },

                series: [{
                    upColor: Highcharts.getOptions().colors[0],
                    color: Highcharts.getOptions().colors[3],
                    data: room_nights_rate_band_ty.categories,
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            //return Highcharts.numberFormat(this.y / 1000, 0, ',') + 'k';
                        },
                        style: {
                            fontWeight: 'bold'
                        }
                    },
                    pointPadding: 0
                }]
            });
        };
        
        $scope.renderPaceAnalysis = function(pace_analysis) {
            $scope.chartInstances['pace_analysis'] = Highcharts.chart('pace_analysis', {

                title: {
                    text: 'Pace Analysis'
                },
                subtitle: {
                    text: pace_analysis.subtitle
                },
                yAxis: {
                    title: {
                        text: 'Percent Contribution'
                    },
                    labels: {
                        overflow: 'justify',
                        //format: '{value}%',
                    }
                },
                xAxis: {
                    //categories: charts.pace_analysis.categories,
                    title: {
                        text: 'Days to Arrival'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'center',
                    verticalAlign: 'middle'
                },
                series: pace_analysis.values

            });
        };
        
        $scope.renderRateBandDOWLY = function(rate_band_dow_ly) {
            if(canLoadGoogleCharts) {
                var data = google.visualization.arrayToDataTable(rate_band_dow_ly.values, true);

                var options = {
                    //title:'Rate Band by Day of Week This Year',
                    legend:'none',
                    chartArea:{
                        left:75,
                        top: 50,
                        right:0,
                        bottom:50,
                        width: '100%',
                        height: '400',
                    }
                };

                var chart = new google.visualization.CandlestickChart(document.getElementById('rate_band_dow_ly'));

                chart.draw(data, options);
            }
        };
        
        $scope.renderRateBandDOWTY = function(rate_band_dow_ty) {
            if(canLoadGoogleCharts) {
                var data = google.visualization.arrayToDataTable(rate_band_dow_ty.values, true);

                var options = {
                      //title:'Rate Band by Day of Week This Year',
                      legend:'none',
                      chartArea:{
                          left:75,
                          top: 50,
                          right:0,
                          bottom:50,
                          width: '100%',
                          height: '400',
                      }
                };

                var chart = new google.visualization.CandlestickChart(document.getElementById('rate_band_dow_ty'));

                chart.draw(data, options);
            }
        };
        
        $scope.renderArrivalvsLOS = function(arrival_vs_los) {
            $scope.chartInstances['arrival_vs_los'] = Highcharts.chart('arrival_vs_los', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Arrival v/s LOS'
                },
                subtitle: {
                    text: arrival_vs_los.subtitle
                },
                xAxis: [{
                    categories: arrival_vs_los.categories,
                    crosshair: true
                }],
                yAxis: [{ // Primary yAxis
                    labels: {
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'Arrivals Per Day',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                },
                { // Secondary yAxis
                    title: {
                        text: 'Average Length of Stay',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true
                }],
                tooltip: {
                    shared: true
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    x: 120,
                    verticalAlign: 'top',
                    y: 100,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                },
                series: [ {
                    name: 'LOS',
                    type: 'spline',
                    yAxis: 1,
                    data: arrival_vs_los.values.los
                },
                {
                    name: 'Arrivals',
                    type: 'spline',
                    data: arrival_vs_los.values.arrivals

                }]
            });
        };
        
        $scope.renderArrivalvsLOSLY = function(arrival_vs_los_ly) {
            $scope.chartInstances['arrival_vs_los_ly'] = Highcharts.chart('arrival_vs_los_ly', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Arrival v/s LOS (Last Year)'
                },
                subtitle: {
                    text: arrival_vs_los_ly.subtitle
                },
                xAxis: [{
                    categories: arrival_vs_los_ly.categories,
                    crosshair: true
                }],
                yAxis: [{ // Primary yAxis
                    labels: {
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'Arrivals Per Day',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                },
                { // Secondary yAxis
                    title: {
                        text: 'Average Length of Stay',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true
                }],
                tooltip: {
                    shared: true
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    x: 120,
                    verticalAlign: 'top',
                    y: 100,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                },
                series: [ {
                    name: 'LOS',
                    type: 'spline',
                    yAxis: 1,
                    data: arrival_vs_los_ly.values.los
                },
                {
                    name: 'Arrivals',
                    type: 'spline',
                    data: arrival_vs_los_ly.values.arrivals

                }]
            });
        };
        
        $scope.renderRPDvsADR = function(rpd_vs_adr) {
            $scope.chartInstances['rpd_vs_adr'] = Highcharts.chart('rpd_vs_adr', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'RPD v/s ADR (This Year)'
                },
                subtitle: {
                    text: rpd_vs_adr.subtitle
                },
                xAxis: [{
                    categories: rpd_vs_adr.categories,
                    crosshair: true
                }],
                yAxis: [{ // Primary yAxis
                    labels: {
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'Rooms',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                },
                { // Secondary yAxis
                    title: {
                        text: 'Rate',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true
                }],
                tooltip: {
                    shared: true
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    x: 120,
                    verticalAlign: 'top',
                    y: 100,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                },
                series: [{
                    name: 'RPD',
                    type: 'spline',
                    data: rpd_vs_adr.values.rpd

                }, {
                    name: 'ADR',
                    type: 'spline',
                    yAxis: 1,
                    data: rpd_vs_adr.values.adr
                }]
            });
        };
        
        $scope.renderRPDvsADRLY = function(rpd_vs_adr_ly) {
            $scope.chartInstances['rpd_vs_adr_ly'] = Highcharts.chart('rpd_vs_adr_ly', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'RPD v/s ADR (Last Year)'
                },
                subtitle: {
                    text: rpd_vs_adr_ly.subtitle
                },
                xAxis: [{
                    categories: rpd_vs_adr_ly.categories,
                    crosshair: true
                }],
                yAxis: [{ // Primary yAxis
                    labels: {
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'Rooms',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                },
                { // Secondary yAxis
                    title: {
                        text: 'Rate',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true
                }],
                tooltip: {
                    shared: true
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    x: 120,
                    verticalAlign: 'top',
                    y: 100,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                },
                series: [{
                    name: 'RPD',
                    type: 'spline',
                    data: rpd_vs_adr_ly.values.rpd

                }, {
                    name: 'ADR',
                    type: 'spline',
                    yAxis: 1,
                    data: rpd_vs_adr_ly.values.adr
                }]
            });
        };
        
        $scope.renderHistoricalCharts = function (charts) {
            
            console.log('Loading historical charts..');
            $timeout(function(){
                
                if($rootScope.enableCharts === false) { return false; }

                //Room nights stacked bar chart
                $scope.chartInstances['room_nights_stacked_bar'] = Highcharts.chart('room_nights_stacked_bar', {
                    chart: {
                        type: 'column',
                        spacingBottom: 100,
                        //height: '500px'
                    },
                    title: {
                        text: 'Room Nights (This Year)'
                    },
                    subtitle: {
                        text: charts.room_nights_stacked_bar.subtitle
                    },
                    xAxis: {
                        categories: charts.room_nights_stacked_bar.categories
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Total room nights'
                        },
                        stackLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold',
                                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                            }
                        }
                    },
                    legend: {
                        align: 'left',
                        x: 0,
                        verticalAlign: 'bottom',
                        y: 60,
                        floating: false,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                        borderColor: '#CCC',
                        borderWidth: 1,
                        shadow: false
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            tooltip: {
                                headerFormat: '<b>{point.x}</b><br/>',
                                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                            },
                            dataLabels: {
                                //enabled: true,
                                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                            }
                        }
                    },
                    series: charts.room_nights_stacked_bar.values
                });
                
                $scope.chartInstances['room_nights_stacked_bar_ly'] = Highcharts.chart('room_nights_stacked_bar_ly', {
                    chart: {
                        type: 'column',
                        spacingBottom: 100,
                        //height: '500px'
                    },
                    title: {
                        text: 'Room Nights (Last Year)'
                    },
                    subtitle: {
                        text: charts.room_nights_stacked_bar_ly.subtitle
                    },
                    xAxis: {
                        categories: charts.room_nights_stacked_bar_ly.categories
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Total room nights'
                        },
                        stackLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold',
                                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                            }
                        }
                    },
                    legend: {
                        align: 'left',
                        x: 0,
                        verticalAlign: 'bottom',
                        y: 60,
                        floating: false,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                        borderColor: '#CCC',
                        borderWidth: 1,
                        shadow: false
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            tooltip: {
                                headerFormat: '<b>{point.x}</b><br/>',
                                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                            },
                            dataLabels: {
                                //enabled: true,
                                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                            }
                        }
                    },
                    series: charts.room_nights_stacked_bar_ly.values
                });
                
                $scope.chartInstances['room_nights_horizontal_bar'] = Highcharts.chart('room_nights_horizontal_bar', {
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: 'Room Nights: LY v/s TY'
                    },
                    subtitle: {
                        text: charts.room_nights_horizontal_bar.subtitle
                    },
                    xAxis: {
                        categories: charts.room_nights_horizontal_bar.categories,
                        title: {
                            text: null
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '',
                            align: 'high'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    tooltip: {
                        valueSuffix: ''
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -40,
                        y: 80,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                        shadow: true
                    },
                    credits: {
                        enabled: false
                    },
                    series: charts.room_nights_horizontal_bar.values
                });
                
                var colors = Highcharts.getOptions().colors,
                categories = charts.room_nights_donut.categories,
                data = charts.room_nights_donut.values,
                contributionData = [],
                i,
                j,
                dataLen = data.length,
                drillDataLen,
                brightness;

                // Build the data arrays
                for (i = 0; i < dataLen; i += 1) {

                    // add version data
                    contributionData.push({
                        name: data[i].name,
                        y: data[i].y,
                        color: Highcharts.Color(data[i].color).brighten(brightness).get()
                    });
                }

                // Create the chart
                $scope.chartInstances['room_nights_donut'] = Highcharts.chart('room_nights_donut', {
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: 'Room Nights: OTA Contribution (This Year)'
                    },
                    subtitle: {
                        text: charts.room_nights_donut.subtitle
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
                                            (((this.y/charts.room_nights_donut.total)*100)).toFixed(2) + '%' : null;
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
                
                var colors = Highcharts.getOptions().colors,
                categories = charts.room_nights_donut_ly.categories,
                data = charts.room_nights_donut_ly.values,
                contributionData = [],
                i,
                j,
                dataLen = data.length,
                drillDataLen,
                brightness;

                // Build the data arrays
                for (i = 0; i < dataLen; i += 1) {

                    // add version data
                    contributionData.push({
                        name: data[i].name,
                        y: data[i].y,
                        color: Highcharts.Color(data[i].color).brighten(brightness).get()
                    });
                }

                // Create the chart
                $scope.chartInstances['room_nights_donut_ly'] = Highcharts.chart('room_nights_donut_ly', {
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: 'Room Nights: OTA Contribution (Last Year)'
                    },
                    subtitle: {
                        text: charts.room_nights_donut_ly.subtitle
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
                                            (((this.y/charts.room_nights_donut_ly.total)*100)).toFixed(2) + '%' : null;
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
                
                //Revenue stacked bar chart
                $scope.chartInstances['room_revenue_stacked_bar'] = Highcharts.chart('room_revenue_stacked_bar', {
                    chart: {
                        type: 'column',
                        spacingBottom: 100
                    },
                    title: {
                        text: 'Room Revenue (This Year)'
                    },
                    subtitle: {
                        text: charts.revenue_stacked_bar.subtitle
                    },
                    xAxis: {
                        categories: charts.revenue_stacked_bar.categories
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Total revenue'
                        },
                        stackLabels: {
                            enabled: true,
                            formatter: function() {
                                return kFormatter(this.total);
                            },
                            style: {
                                fontWeight: 'bold',
                                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                            }
                        }
                    },
                    legend: {
                        align: 'left',
                        x: 0,
                        verticalAlign: 'bottom',
                        y: 60,
                        floating: false,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                        borderColor: '#CCC',
                        borderWidth: 1,
                        shadow: false
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            tooltip: {
                                headerFormat: '<b>{point.x}</b><br/>',
                                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                            },
                            dataLabels: {
                                enabled: false,
                                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                            }
                        }
                    },
                    series: charts.revenue_stacked_bar.values
                });
                
                $scope.chartInstances['room_revenue_stacked_bar_ly'] = Highcharts.chart('room_revenue_stacked_bar_ly', {
                    chart: {
                        type: 'column',
                        spacingBottom: 100
                    },
                    title: {
                        text: 'Room Revenue (Last Year)'
                    },
                    subtitle: {
                        text: charts.revenue_stacked_bar_ly.subtitle
                    },
                    xAxis: {
                        categories: charts.revenue_stacked_bar_ly.categories
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Total revenue'
                        },
                        stackLabels: {
                            enabled: true,
                            formatter: function() {
                                return kFormatter(this.total);
                            },
                            style: {
                                fontWeight: 'bold',
                                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                            }
                        }
                    },
                    legend: {
                        align: 'left',
                        x: 0,
                        verticalAlign: 'bottom',
                        y: 60,
                        floating: false,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                        borderColor: '#CCC',
                        borderWidth: 1,
                        shadow: false
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            tooltip: {
                                headerFormat: '<b>{point.x}</b><br/>',
                                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                            },
                            dataLabels: {
                                enabled: false,
                                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                            }
                        }
                    },
                    series: charts.revenue_stacked_bar_ly.values
                });
                
                $scope.chartInstances['room_revenue_horizontal_bar'] = Highcharts.chart('room_revenue_horizontal_bar', {
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: 'Room Revenue: LY v/s TY'
                    },
                    subtitle: {
                        text: charts.revenue_horizontal_bar.subtitle
                    },
                    xAxis: {
                        categories: charts.revenue_horizontal_bar.categories,
                        title: {
                            text: null
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '',
                            align: 'high'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    tooltip: {
                        valueSuffix: ''
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -40,
                        y: 80,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                        shadow: true
                    },
                    credits: {
                        enabled: false
                    },
                    series: charts.revenue_horizontal_bar.values
                });
                
                var colors = Highcharts.getOptions().colors,
                categories = charts.revenue_donut.categories,
                data = charts.revenue_donut.values,
                contributionData = [],
                i,
                j,
                dataLen = data.length,
                drillDataLen,
                brightness;

                // Build the data arrays
                for (i = 0; i < dataLen; i += 1) {

                    // add version data
                    contributionData.push({
                        name: data[i].name,
                        y: data[i].y,
                        color: Highcharts.Color(data[i].color).brighten(brightness).get()
                    });
                }

                // Create the chart
                $scope.chartInstances['room_revenue_donut'] = Highcharts.chart('room_revenue_donut', {
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: 'Room Revenue: OTA Contribution (This Year)'
                    },
                    subtitle: {
                        text: charts.revenue_donut.subtitle
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
                                            (((this.y/charts.revenue_donut.total)*100)).toFixed(2) + '%' : null;
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
                
                var colors = Highcharts.getOptions().colors,
                categories = charts.revenue_donut_ly.categories,
                data = charts.revenue_donut_ly.values,
                contributionData = [],
                i,
                j,
                dataLen = data.length,
                drillDataLen,
                brightness;

                // Build the data arrays
                for (i = 0; i < dataLen; i += 1) {

                    // add version data
                    contributionData.push({
                        name: data[i].name,
                        y: data[i].y,
                        color: Highcharts.Color(data[i].color).brighten(brightness).get()
                    });
                }

                // Create the chart
                $scope.chartInstances['room_revenue_donut_ly'] = Highcharts.chart('room_revenue_donut_ly', {
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: 'Room Revenue: OTA Contribution (Last Year)'
                    },
                    subtitle: {
                        text: charts.revenue_donut_ly.subtitle
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
                                            (((this.y/charts.revenue_donut_ly.total)*100)).toFixed(2) + '%' : null;
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
        
        $scope.renderPatternCharts = function (charts) {
            
            console.log('Loading pattern charts..');
            $timeout(function(){
                
                if($rootScope.enableCharts === false) { return false; }
                
                //RPD v/s ADR
                $scope.renderRPDvsADR(charts.rpd_adr);
                
                $scope.renderRPDvsADRLY(charts.rpd_adr_ly);
                
                //Arrival v/s LOS
                $scope.renderArrivalvsLOS(charts.arrival_los);
                
                $scope.renderArrivalvsLOSLY(charts.arrival_los_ly);
        
                //Pace Analysis
                $scope.renderPaceAnalysis(charts.pace_analysis);
                
                $scope.renderRoomNightsRateBandTY(charts.room_nights_rate_band_ty);
                
                $scope.renderRoomNightsRateBandLY(charts.room_nights_rate_band_ly);
                
                $scope.renderRateBandDOWLY(charts.rate_band_by_dow_ly);
                
                $scope.renderRateBandDOWTY(charts.rate_band_by_dow_ty);
                
                //Day of Week Contribution
                /*
                Highcharts.chart('dow_contrib', {
                    chart: {
                        type: 'column',
                        spacingBottom: 100
                    },
                    title: {
                        text: 'DOW Contribution'
                    },
                    subtitle: {
                        text: charts.dow_contrib.subtitle
                    },
                    xAxis: {
                        categories: charts.dow_contrib.categories
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Percentage'
                        },
                        stackLabels: {
                            enabled: false,
                            style: {
                                fontWeight: 'bold',
                                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                            }
                        }
                    },
                    legend: {
                        align: 'left',
                        x: 0,
                        verticalAlign: 'bottom',
                        y: 60,
                        floating: false,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                        borderColor: '#CCC',
                        borderWidth: 1,
                        shadow: false
                    },
                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '{series.name}: {point.y}%'
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            dataLabels: {
                                enabled: false,
                                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                            }
                        }
                    },
                    series: charts.dow_contrib.values
                });
                */
                
                //OTA Rate Volume Matrix
                /*
                Highcharts.chart('ota_rate_volume_matric', {
                    chart: {
                        type: 'scatter',
                        plotBorderWidth: 1,
                        spacingBottom: 100,
                        zoomType: 'xy'
                    },
                    title: {
                        text: 'OTA Rate Volume Matrix'
                    },
                    subtitle: {
                        text: charts.rv_matrix.subtitle
                    },
                    xAxis: {
                        gridLineWidth: 1,
                        title: {
                            enabled: true,
                            text: 'Volume'
                        },
                        startOnTick: true,
                        endOnTick: true,
                        showLastLabel: true,
                        plotLines: [{
                            color: 'black',
                            dashStyle: 'dot',
                            width: 2,
                            value: 165,
                            zIndex: 3
                        }]
                    },
                    yAxis: {
                        title: {
                            text: 'Rate'
                        },
                        plotLines: [{
                            color: 'black',
                            dashStyle: 'dot',
                            width: 2,
                            value: 56,
                            zIndex: 3
                        }]
                    },
                    legend: {
                        layout: 'horizontal',
                        align: 'left',
                        verticalAlign: 'bottom',
                        x: 50,
                        y: 70,
                        floating: true,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
                        borderWidth: 1
                    },
                    plotOptions: {
                        scatter: {
                            marker: {
                                radius: 5,
                                states: {
                                    hover: {
                                        enabled: true,
                                        lineColor: 'rgb(100,100,100)'
                                    }
                                }
                            },
                            states: {
                                hover: {
                                    marker: {
                                        enabled: false
                                    }
                                }
                            },
                            tooltip: {
                                headerFormat: '<b>{series.name}</b><br>',
                                pointFormat: 'Volume {point.x}<br>ADR {point.y}'
                            }
                        }
                    },
                    series: charts.rv_matrix.series
                });
                */
                
            },500);
        };
                
        $('.btn-chart-zoom').click(function(){
            $(this).parent('.chart-container').addClass('chart-modal');
            $(this).hide();
            $(this).siblings('.btn-chart-zoom-out').show();
            var chart = $(this).attr('data-chart');
            $scope.chartInstances[chart].reflow();

        });

        $('.btn-chart-zoom-out').click(function(){
            $(this).parent('.chart-container').removeClass('chart-modal');
            $(this).hide();
            $(this).siblings('.btn-chart-zoom').show();
            var chart = $(this).attr('data-chart');
            $scope.chartInstances[chart].reflow();
        });

    }]);