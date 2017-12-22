angular.module('eventManager', ['ngRoute'])
        .config(['$routeProvider','$locationProvider',function ($routeProvider,$locationProvider) {
            $locationProvider.html5Mode(false);
            $locationProvider.hashPrefix('!');
            $routeProvider
                    .when('/home', {
                        templateUrl: 'pages/home.html',
                        controller: 'mainCtrl'
                    })
                    .when('/about', {
                        templateUrl: 'pages/about.html',
                        controller: 'mainCtrl'
                    })
                    .when('/product/:product', {
                        templateUrl: 'pages/productId.html',
                        controller: 'productCtrl'
                    })
                    .when('/gallery/video', {
                        templateUrl: 'pages/video.html',
                        controller: 'videoCtrl'
                    })
                    .when('/gallery/photo', {
                        templateUrl: 'pages/photo.html',
                        controller: 'photoCtrl'
                    })
                    .when('/contact', {
                        templateUrl: 'pages/contact.html',
                        controller: 'contactCtrl'
                    })
                    .otherwise({
                        redirectTo: '/home'
                    });
        }])
  .directive('slider', function() {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      scope: {
        slides: '=',
        animation: '=',
        interval: '='
      },
      controller: 'SliderController',
      templateUrl: 'slider.html'
    };
  })
        .directive('navbar', function() {
        var directive = {}
        directive.restrict = 'E';
        directive.templateUrl = "pages/header.html";
        return directive;
        })
        .filter("trust", ['$sce', function($sce) {
          return function(htmlCode){
          return $sce.trustAsHtml(htmlCode);
          }
        }])
        .factory('httpRequestInterceptor',['$sessionStorage', function ($sessionStorage) {
            return {
                request: function (config) {
                    config.headers['token'] = $sessionStorage.atoken;
                    return config;
                }
            };
        }])
        .factory('MyCache',[ '$cacheFactory',function ($cacheFactory) {
            return $cacheFactory('myCache');
        }])
    .controller('SliderController',[ '$scope','$timeout', function($scope, $timeout) {
    var settings = {
      animation: $scope.animation || 'animate-fade',
      interval: $scope.interval || 5000
    };
    $scope.activeIndex = 0;
    $scope.setActiveIndex = function(index) {
      $scope.isPrev = index < $scope.activeIndex;
      $scope.activeIndex = index;
    };
    $scope.setAnimation = function(animation) {
      return animation || settings.animation;
    };
    $scope.isActiveIndex = function(index) {
      return $scope.activeIndex === index;
    };
    $scope.next = function() {
      $scope.isPrev = false;
      $scope.activeIndex = $scope.activeIndex < $scope.slides.length - 1 ? $scope.activeIndex + 1 : 0;
    };
    $scope.prev = function() {
      $scope.isPrev = true;
      $scope.activeIndex = $scope.activeIndex > 0 ? $scope.activeIndex - 1 : $scope.slides.length - 1;
    };
    if (settings.interval) {
      var interval;
      $scope.play = function() {
        interval = $timeout(function() {
           $scope.next();
        }, settings.interval);
      };
      $scope.pause = function() {
        $timeout.cancel(interval);
      };
      $scope.$watch('activeIndex', function() {
        $scope.pause();
        $scope.play();
      });
    }
    }])
    .controller('mainCtrl',['$scope','$location',function($scope,$location){
            $scope.start = false;
             $scope.slides = [
                { src: './img/9.jpg',
                  caption: 'Slide 1' },
                { src: './img/8.jpg',
                  caption: 'Slide 2' },
                { src: './img/7.jpg',
                  caption: 'Slide 3' },
                { src: './img/6.jpg',
                  caption: 'Slide 4' },
                { src: './img/5.png',
                  caption: 'Slide 5' }
                ];
            $scope.Trigger = function(){
                $scope.start = true;
            };
            $scope.goTo = function(val){
                console.log(val);
                $location.path('/'+val);
            };
    }])
    .controller('contactCtrl', ['$scope','$route', function($scope,$route) {
        $scope.init = function () {
            $route.reload();
        };
    }])
    .controller('videoCtrl', ['$scope',  function($scope) {
    $scope.videos=[{img:'img/6.jpg',no:1},{img:'img/7.jpg',no:1},{img:'img/5.jpg',no:1},{img:'img/7.jpg',no:1}];
    }])
    .controller('photoCtrl', ['$scope', function($scope) {
        $scope.images = [
            '/img/1/1.jpg',
            '/img/1/2.jpg',
            '/img/1/3.jpg',
            '/img/1/4.jpg',
            '/img/1/5.jpg',
            '/img/1/6.jpg',
            '/img/1/7.jpg',
            '/img/1/8.jpg',
            '/img/1/9.jpg',
            '/img/1/10.jpg',
            '/img/1/11.jpg',
            '/img/1/12.jpg',
            '/img/1/13.jpg',
            '/img/1/14.jpg',
            '/img/1/15.jpg'
        ];
    }])
    .controller('productCtrl', ['$scope','$http', '$routeParams',function($scope,$http,$routeParams) {
        var products;
        $http.get("/products").then(function(data){
          product = data.data.products;
        }).then(function(){
          for(var i = 0 ; i<product.length;i++){
            if(product[i].name === $routeParams.product){
              $scope.product = product[i];
              $scope.specs = product[i].specification;
            }
          }  

        });
        
    }])