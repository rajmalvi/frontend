var app = angular.module('revseed', ['ngRoute', 'jqwidgets', 'customFilters', 'angularFileUpload', 'ngSanitize', 'satellizer', 'ui.bootstrap', 'ui.select', 'locator', 'ui.sortable', 'ui.slider','ui.grid', 'ui.grid.pinning','ui.uploader']);

app.config(['$routeProvider', '$locationProvider', '$authProvider', function ($routeProvider, $locationProvider, $authProvider) {

        $routeProvider.
                when('/', {
                    templateUrl: 'partials/login.html',
                    controller: 'LoginController'
                }).
                when('/dashboard', {
                    templateUrl: 'partials/dashboard.html',
                    controller: 'DashboardController',
                    resolve: {
                        session: function($rootScope) {
                            return $rootScope.sessionLoad.promise;
                        }
                    }
                }).
                when('/clients', {
                    templateUrl: 'partials/clients/clients.grid.html',
                    controller: 'ClientsController'
                }).
                when('/clients/new', {
                    templateUrl: 'partials/clients/clients.new.html',
                    controller: 'ClientsController'
                }).
                when('/clients/edit/:cID', {
                    templateUrl: 'partials/clients/clients.edit.html',
                    controller: 'ClientsController'
                }).
                when('/rm', {
                    templateUrl: 'partials/rm/rm.grid.html',
                    controller: 'RMController'
                }).
                when('/calendar', {
                    templateUrl: 'partials/calendar/calendar.grid.html',
                    controller: 'CalendarController'
                }).
                when('/users', {
                    templateUrl: 'partials/users/users.grid.html',
                    controller: 'UsersController'
                }).
                when('/users/new', {
                    templateUrl: 'partials/users/users.new.html',
                    controller: 'UsersController'
                }).
                when('/users/edit/:uID', {
                    templateUrl: 'partials/users/users.edit.html',
                    controller: 'UsersController'
                }).
                when('/master/hotels', {
                    templateUrl: 'partials/master/hotels/hotels.grid.html',
                    controller: 'HotelsController'
                }).            
                when('/master/hotels/new', {
                    templateUrl: 'partials/master/hotels/hotels.new.html',
                    controller: 'HotelsController'
                }).            
                when('/master/hotels/edit/:hID', {
                    templateUrl: 'partials/master/hotels/hotels.edit.html',
                    controller: 'HotelsController'
                }).            
                when('/master/hotel_chains', {
                    templateUrl: 'partials/master/hotel_chains/hotel_chains.grid.html',
                    controller: 'HotelChainsController'
                }).            
                when('/master/hotel_chains/edit/id', {
                    templateUrl: 'partials/master/hotel_chains/hotel_chains.edit.html',
                    controller: 'HotelChainsController'
                }).            
                when('/master/role', {
                    templateUrl: 'partials/master/role/role.grid.html',
                    controller: 'RoleController'
                }).            
                when('/master/role/new', {
                    templateUrl: 'partials/master/role/role.new.html',
                    controller: 'RoleController'
                }).            
                when('/master/role/edit/:eID', {
                    templateUrl: 'partials/master/role/role.edit.html',
                    controller: 'RoleController'
                }).            
                when('/master/room_types', {
                    templateUrl: 'partials/master/room_types/room_types.grid.html',
                    controller: 'RoomsController'
                }).
                when('/master/room_types/new', {
                    templateUrl: 'partials/master/room_types/room_types.new.html',
                    controller: 'RoomsController'
                }).
                when('/master/master_rates', {
                    templateUrl: 'partials/master/master_rates/master_rates.grid.html',
                    controller: 'MasterRatesController'
                }).
                when('/master/ota_setup', {
                    templateUrl: 'partials/master/ota_setup/ota_setup.grid.html',
                    controller: 'OtpController'
                }).
                when('/master/seasonality', {
                    templateUrl: 'partials/master/seasonality/seasonality.grid.html',
                    controller: 'SeasonalityController'
                }).
                when('/master/events', {
                    templateUrl: 'partials/master/events/events.grid.html',
                    controller: 'EventsController'
                }).
                when('/isell', {
                    templateUrl: 'partials/clients/clients.isell.html',
                    controller: 'IsellController',
                    resolve: {
                        session: function($rootScope) {
                            return $rootScope.sessionLoad.promise;
                        }
                    }
                }).
                when('/market', {
                    templateUrl: 'partials/clients/clients.mi.html',
                    controller: 'MarketIntelController'
                }).
                when('/analysis/rate-disparity', {
                    templateUrl: 'partials/clients/clients.analysis.html',
                    controller: 'AnalysisController',
                    resolve: {
                        view: function() {
                            return 'rate_disparity';
                        },
                        session: function($rootScope) {
                            return $rootScope.sessionLoad.promise;
                        }
                    }
                }).
                when('/analysis/rate-pace', {
                    templateUrl: 'partials/clients/clients.analysis.html',
                    controller: 'AnalysisController',
                    resolve: {
                        view: function() {
                            return 'rate_pace';
                        },
                        session: function($rootScope) {
                            return $rootScope.sessionLoad.promise;
                        }
                    }
                }).
                when('/analysis/rate-analysis', {
                    templateUrl: 'partials/clients/clients.analysis.html',
                    controller: 'AnalysisController',
                    resolve: {
                        view: function() {
                            return 'rate_analysis';
                        },
                        session: function($rootScope) {
                            return $rootScope.sessionLoad.promise;
                        }
                    }
                }).
                when('/analysis/historical', {
                    templateUrl: 'partials/clients/clients.analysis.html',
                    controller: 'AnalysisController',
                    resolve: {
                        view: function() {
                            return 'historical';
                        },
                        session: function($rootScope) {
                            return $rootScope.sessionLoad.promise;
                        }
                    }
                }).
                when('/analysis/pattern', {
                    templateUrl: 'partials/clients/clients.analysis.html',
                    controller: 'AnalysisController',
                    resolve: {
                        view: function() {
                            return 'pattern';
                        },
                        session: function($rootScope) {
                            return $rootScope.sessionLoad.promise;
                        }
                    }
                }).
                when('/analysis/competitor-pricing', {
                    templateUrl: 'partials/clients/clients.analysis.html',
                    controller: 'AnalysisController',
                    resolve: {
                        view: function() {
                            return 'competitor';
                        },
                        session: function($rootScope) {
                            return $rootScope.sessionLoad.promise;
                        }
                    }
                }).
                otherwise({
                    templateUrl: 'partials/dashboard.html'
                });

        $locationProvider.html5Mode(true);
        // use the HTML5 History API
        $authProvider.httpInterceptor = function () {
            return true;
        },
        $authProvider.withCredentials = false;
        $authProvider.tokenRoot = null;
        //$authProvider.baseUrl = 'http://localhost/admin';
       $authProvider.baseUrl = 'http://localhost:8080/auth';
//        $authProvider.baseUrl = 'http://backend.revseed.dev/clients';
        $authProvider.loginUrl = '/login/doLogin';
        $authProvider.signupUrl = '/signup';
        $authProvider.unlinkUrl = '/unlink/';
        $authProvider.tokenName = 'token';
        $authProvider.tokenPrefix = 'satellizer';
        $authProvider.authHeader = 'Authorization';
        $authProvider.authToken = 'Bearer';
        $authProvider.storageType = 'localStorage';
    }]);


app.run(['$rootScope', '$location', '$http', '$auth', '$q', function ($rootScope, $location, $http, $auth, $q) {
//        $rootScope.backend = 'http://demos.revseed.backend.exusys.com/admin';
//        $rootScope.backend2 = 'http://demos.revseed.backend.exusys.com';
        $rootScope.backend2 = 'http://localhost';
         $rootScope.backend = 'http://localhost:8080';

    $rootScope.enableCharts = false;
    
    google.charts.setOnLoadCallback(function(){
        $rootScope.enableCharts = true;
    });
    
        $rootScope.isAuthenticated = function () {
            return $auth.isAuthenticated();
        };

        $rootScope.logout = function () {
            $auth.logout();
            localStorage.clear();
            $location.path('/');
        };

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            $rootScope.hideSection = true;
            jQuery('#main-content').css({
                'margin-left': '0px'
            });
            jQuery('#sidebar').css({
                'margin-left': '-210px'
            });
            jQuery('#sidebar > ul').hide();
            jQuery("#container").addClass("sidebar-closed");
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/']) === -1;
            if (restrictedPage && !$auth.isAuthenticated()) {
                $location.path('/');
            }
            if ($location.path() == '/' && $auth.isAuthenticated()) {
                $location.path('/dashboard');
            }
        });
        
        $rootScope.token = localStorage.getItem('satellizer_token');

        $rootScope.sessionLoad = $q.defer();
        if ($rootScope.token != null) {

            $rootScope.hideSection = true;

            var url = $rootScope.backend + '/clients/login/getSessionData';
            $http.get(url).then(function (response) {
                $rootScope.sessionData = response.data;
                $rootScope.sessionLoad.resolve($rootScope.sessionData);
            });

        } else {
            $rootScope.hideSection = false;
            angular.element('#main-content').css('margin-left', '0' + 'px');
        }
        
        $rootScope.backToAdmin = function() {
            localStorage.removeItem('current_hotel_name');
            $rootScope.current_hotel_name = '';
            var admin_token = localStorage.getItem('satellizer_token_admin');
            localStorage.setItem('satellizer_token',admin_token);
            window.location = '/clients';
        };
        
        $rootScope.current_hotel_name = localStorage.getItem('current_hotel_name');

    }
]);

app.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function (item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});
Highcharts.setOptions({
    lang: {
        numericSymbols: 'k' //otherwise by default ['k', 'M', 'G', 'T', 'P', 'E']
    }
});

function kFormatter(num) {
    return num > 999 ? (num/1000).toFixed(0) + 'k' : num
}