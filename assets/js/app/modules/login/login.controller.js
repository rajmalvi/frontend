app.controller('LoginController', ['$scope', '$rootScope', 'LoginServices', 'FileUploader', '$window', '$auth', function ($scope, $rootScope, LoginServices, FileUploader, $window, $auth) {

        $scope.login = {
            user_email: '',
            user_password: ''
        };

        // do login 
        $scope.doLogin = function () {
            $scope.login_form.loading = true;
            $scope.login_form.success = false;
            $scope.login_form.danger = false;
            $auth.login($scope.login)
                    .then(function (response) {
                        $scope.login_form.message = response.data.message;
                        if (response.data.status == true)
                        {
                            $scope.login_form.loading = false;
                            $scope.login_form.success = true;
                            $scope.login_form.danger = false;
                            $scope.login = {};
                            $scope.login_form.$setPristine();
                            setTimeout(function () {
                                if(response.data.role == 'client') {
                                    $window.location.href = '/dashboard';
                                    //localStorage.setItem('client_id',$scope.client_id);
                                    localStorage.setItem('current_hotel_name',response.data.hotel_name);
                                }
                                else {
                                    $window.location.href = '/clients';
                                }
                            });
                        }
                        else
                        {
                            $scope.login_form.loading = false;
                            $scope.login_form.success = false;
                            $scope.login_form.danger = true;
                        }
                    })
                    .catch(function (error) {

                    });
        };


    }]);