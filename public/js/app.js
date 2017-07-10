angular.module('eventManager', ['ngRoute', 'ngStorage', 'angularModalService','ngFileUpload','typer'])
        .config(function ($routeProvider, $httpProvider) {
//            $locationProvider.html5Mode({
//             enabled: true,
//             rewriteLinks: false
//             });
            // $httpProvider.interceptors.push('httpRequestInterceptor');
            $routeProvider
                    .when('/home', {
                        templateUrl: 'pages/home.html',
                        controller: 'mainCtrl'
                    })
                    .when('/events', {
                        templateUrl: 'pages/events.html',
                        controller: 'eventCtrl'
                    })
                    .when('/event/:event', {
                        templateUrl: 'pages/eventbyid.html',
                        controller: 'eventCtrl'
                    })
                    .when('/contact', {
                        templateUrl: 'pages/contact_form.html',
                        controller: 'contactCtrl'
                    })
                    .when('/admin', {
                        templateUrl: 'pages/admin.html',
                        controller: 'adminCtrl'
                    })
                    .when('/adminEvent', {
                        templateUrl: 'pages/adminEvent.html',
                        controller: 'adminCtrl'
                    })
                    .when('/adminEvent/:name', {
                        templateUrl: 'pages/adminEventByid.html',
                        controller: 'eventAdminCtrl'
                    })
                    .when('/queryList', {
                        templateUrl: 'pages/queryList.html',
                        controller: 'queryCtrl'
                    })
                    .when('/query/:id', {
                        templateUrl: 'pages/queryById.html',
                        controller: 'queryCtrl'
                    })
                    .when('/login', {
                        templateUrl: 'pages/login.html',
                        controller: 'loginCtrl'
                    })
                    .otherwise({
                        redirectTo: '/home'
                    });
        })
        .run(function ($rootScope, $location, $http, $sessionStorage) {
            // register listener to watch route changes
            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                if ($sessionStorage.atoken === null || $sessionStorage.atoken === undefined) {
                    // no logged user, we should be going to #login
                    if (next.templateUrl === "pages/home.html" || next.templateUrl === "pages/login.html" || next.templateUrl === "pages/admin.html"
                     || next.templateUrl === "pages/events.html" || next.templateUrl === "pages/eventbyid.html"
                      || next.templateUrl === "pages/contact_form.html") {
                        // already going to #login, no redirect needed
                    } else {
                        // not going to #login, we should redirect now
                        $location.path('/home');
                    }
                }
            });
        })
        .factory('httpRequestInterceptor', function ($sessionStorage) {
            return {
                request: function (config) {
                    config.headers['token'] = $sessionStorage.atoken;
                    return config;
                }
            };
        })
        .controller('mainCtrl',function($sessionStorage,$scope){
            $scope.start = false;
            $scope.Trigger = function(){
                $scope.start = true;
            };
        })
        .controller('eventCtrl',function($sessionStorage,$location,$scope,$http,$routeParams){
            $http.get('/eventlist').then(function(data){
                console.log(data.data);
                $scope.events = data.data;
            });
            console.log($routeParams.event);
            $scope.getEvent = function(){
               $http.get('/event/'+$routeParams.event).then(function(data){
                console.log(data.data);
                $scope.event = data.data;
            }); 
            };
        })
        .controller('queryCtrl',function($sessionStorage,$location,$scope,$http,$routeParams){
            $scope.getList = function(){

            $http.get('/admin/querylist').then(function(data){
                console.log(data.data);
                $scope.query = data.data;
            });
            };
            $scope.getQuery = function(){
                $http.get('/admin/query/'+$routeParams.id).then(function(data){
                    $scope.queryOne = data.data;
                    console.log(data);
                });
            };

            $scope.getLoc = function(u){
                $location.path('/query/'+u);
            };
        })
        .controller('contactCtrl',function($sessionStorage,$location,$scope,$http){
            $scope.submit = function(){
                var data = {
                    name: $scope.name,
                    email: $scope.email,
                    subject: $scope.subject,
                    message: $scope.message,
                    phone: $scope.phone
                };    
            $http({
                    url: '/addQuery',
                    method: "POST",
                    data: data,
                }).then(function(data){
                console.log(data);
            });
            };
            
        })
        .controller('adminCtrl',function($sessionStorage,$location,$scope,$http){
            if($sessionStorage.atoken === undefined)
                $location.path('/login');
            $http.get('/eventlist').then(function(data){
                console.log(data.data);
                $scope.events = data.data;
            });
            $scope.getLoc = function(u){
                $location.path('/adminEvent/'+u);
            };
        })
        .controller('imageCtrl', ['Upload', '$window','$scope', function (Upload, $window,$scope) {
                var vm = this;
                vm.submit = function () { //function to call on form submit
                    if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
                        vm.upload(vm.file); //call upload function
                    }
                };

                vm.upload = function (file) {
                    var data = {
                        file: file,
                        event: $scope.eventName,
                        description: $scope.eventDescription
                    };
                    Upload.upload({
                        url: '/admin/upload', //webAPI exposed to upload the file
                        data: data //pass file as data, should be user ng-model
                    }).then(function (resp) { //upload function returns a promise
                        if (resp.data.error_code === 0) { //validate success
                            $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                        } else {
                            $window.alert('an error occured');
                        }
                    }, function (resp) { //catch error
                        console.log('Error status: ' + resp.status);
                        $window.alert('Error status: ' + resp.status);
                    }, function (evt) {
                        console.log(evt);
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                        vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
                    });
                };
            }])
        .controller('eventAdminCtrl',function($sessionStorage,$location,$scope,$http,$routeParams,$route){
            $scope.getEvent = function(){
                $http.get('/event/'+$routeParams.name).then(function(data){
                    $scope.event = data.data;
                });
            };
            
        })
        .controller('loginCtrl',function($sessionStorage,$location,$scope,$http,$routeParams,$route){
          $scope.check = function () {
            $http.post('/admin/checkUsr').then(function(data){
                });  
          };
          $scope.showErr = false;
            $scope.login = function () {
                var data = {
                    username: $scope.user,
                    password: $scope.pass
                }
                $http({
                    url: '/admin/login',
                    method: "POST",
                    data: data,
                })
                        .then(function (data) {
                            console.log(data);
                            if (data.data.message) {
                                $scope.showErr = true;
                                $scope.err = data.data.message;
                            } else {
                                $sessionStorage.atoken = data.data.token;
                                $sessionStorage.id = data.data.user._id;
                            }
                        }).then(function (data) {
                            if($scope.showErr === false)
                        $location.path('/admin');
                });
            };  
        })