'use strict';
//Define an angular module for our app
var NorthwindApp = angular.module('NorthwindApp', ['ngRoute', 'ngResource']);

/* Router */
NorthwindApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/employees', {
                templateUrl: 'partials/employee-list.html',
                controller: 'EmployeeController'
            }).
            when('/customers', {
                templateUrl: 'partials/customer-list.html',
                controller: 'CustomerController'
            }).
            when('/products', {
                templateUrl: 'partials/product-list.html',
                controller: 'ProductController'
            }).
            when('/orders', {
                templateUrl: 'partials/order-list.html',
                controller: 'OrderController'
            }).
            when('/suppliers', {
                templateUrl: 'partials/supplier-list.html',
                controller: 'SupplierController'
            }).
            otherwise({
                redirectTo: '/customers'
            });
    }
]);


/* Controller */
NorthwindApp.controller('NavigationController', ['$scope',
    function($scope){
        $scope.navs = [
            {id: 1, navID: 'employees', caption: 'Employees'},
            {id: 2, navID: 'customers', caption: 'Customers'},
            {id: 3, navID: 'products', caption: 'Products'},
            {id: 4, navID: 'orders', caption: 'Orders'},
            {id: 5, navID: 'suppliers', caption: 'Suppliers'}
        ];
    }
]);

NorthwindApp.controller('EmployeeController', ['$scope', 'NorthwindService',
    function($scope, NorthwindService){
        $scope.$parent.selected = 1;

        NorthwindService.getData('data/employees.json')
            .success(function(response){
                $scope.employees = response;
                $scope.selected = $scope.employeeInfo = $scope.employees[0];
                $scope.showEmployee = true;
            })
            .error(function(response){ /*todo error case */ });

        $scope.handleClick = function($event){
            if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
            $scope.selected = $scope.employeeInfo = this.employee;
            $scope.showEmployee = true;
        };

        $scope.isSelected = function(employee) {
            return $scope.selected === employee;
        };

        $scope.hideEmpInfo = function($event){
            $scope.showEmployee = false;
            $scope.selected = "";
            if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
        };
    }
]);

NorthwindApp.controller('CustomerController', ['$scope', 'NorthwindService',
    function($scope, NorthwindService){

        $scope.$parent.selected = 2;
        NorthwindService.trigger('loadMap');

        NorthwindService.getData('data/customers.json')
            .success(function(response){
                $scope.customers = response;
                var customer = $scope.customers[0];
                $scope.selected = customer;
                $scope.showLocation(customer);
            })
            .error(function(response){ /*todo error case */ });

        NorthwindService.getData('data/orders.json').success(function(response){ $scope.orders = response; });

        $scope.handleRowClick = function($event){
            $scope.selected = this.customer;
            $scope.selCustomer = this.customer.CustomerID;
            $scope.showLocation(this.customer);
        };

        $scope.isSelected = function(customer) {
            return $scope.selected === customer;
        };

        $scope.showLocation = function(customer){
            var address = customer.Address + "," + customer.City + "," + customer.Country;
            NorthwindService.trigger('locateByAddress', address);
        }
    }
]);

NorthwindApp.controller('OrderController', ['$scope', 'NorthwindService',
    function($scope, NorthwindService){
        $scope.$parent.selected = 4;
        $scope.showProduct = false;
        $scope.currentPage = 0;
        $scope.pageSize = 10;
        $scope.orders = [];
        $scope.selPage = 1;
        NorthwindService.getData('data/orders.json')
            .success(function(response){
                $scope.orders = response;
                $scope.noOfPages = Math.round($scope.orders.length/$scope.pageSize)
            })
            .error(function(response){ /*todo error case */ });

        $scope.handleRowClick = function(){
            $scope.selected = this.order;
            $scope.showOrder = true;
            $scope.orderInfo = this.order;
        };

        $scope.test = function(){
            alert($scope.selPage);
        }


        $scope.isSelected = function(order) {
            return $scope.selected === order;
        }
}]);

NorthwindApp.controller('ProductController', ['$scope', '$rootScope', 'NorthwindService',
    function($scope, $rootScope, NorthwindService){
        $scope.$parent.selected = 3;
        $scope.showProduct = false;
        $scope.currentPage = 0;
        $scope.pageSize = 15;
        $scope.products = [];
        NorthwindService.getData('data/products.json')
            .success(function(response){
                $scope.initialize(response);
            })
            .error(function(response){ /*todo error case */ });

        $scope.initialize = function(products){
            angular.forEach(products, function(product){
                product.prodImg = 'img/product/' + product.ProductID + '.png';
                $scope.products.push(product);
            });
            $scope.noOfPages =  $scope.products.length/$scope.pageSize;
        };

        $scope.handleRowClick = function(){
            $scope.showProduct = true;
            $scope.$parent.showOverlay = true;
            $scope.productInfo = this.product;
            angular.element(".prod-detail input")[0].focus();
        };

        $scope.handleKeyDown = function(){
            if (event.keyCode == 27) {
                $scope.showProduct = false;
                $scope.$parent.showOverlay = false;
            } else {
                return;
            }
        };

        $scope.isSelected = function(product) {
            return $scope.selected === product;
        }
    }
]);

NorthwindApp.controller('SupplierController', ['$scope', 'NorthwindService',
    function($scope, NorthwindService){
        $scope.$parent.selected = 5;
        NorthwindService.getData('data/suppliers.json')
            .success(function(response){ $scope.suppliers = response; })
            .error(function(response){ /*todo error case */ });
    }
]);

/* Service */
/*
NorthwindApp.service('NorthwindService', ['$resource', '$rootScope', '$http', function($resource, $rootScope, $http){
        this.trigger = function(method) {
            var args = Array.prototype.slice.call(arguments, 1);
            args = args.join(',');
            $rootScope.$broadcast(method, args);
        }

        this.getData = function(url){
            return $http.get(url);
        }
    }]
);
*/

/* Factory */
NorthwindApp.factory('NorthwindService', ['$rootScope', '$http',
    function($rootScope, $http){
        return {

            trigger: function(method) {
                var args = Array.prototype.slice.call(arguments, 1);
                args = args.join(',');
                $rootScope.$broadcast(method, args);
            },

            getData: function(url){
                return $http.get(url);
            }
        };
    }]);

/* Directive */
NorthwindApp.directive('orderDetail', function(){
    return{
        restrict: 'A',
        templateUrl : 'partials/order-detail.html'
    };
});

NorthwindApp.directive('productDetail', function(){
    return{
        restrict: 'A',
        templateUrl : 'partials/product-detail.html',
        link: function(scope, element){
            scope.close = function(){
                this.showProduct = false;
                this.$parent.showOverlay = false;
            }
        }
    };
});

NorthwindApp.directive('employeeDetail', function(){
    return{
        restrict: 'A',
        templateUrl : 'partials/employee-detail.html',
        link: function(scope, element){
            scope.close = function(){
                this.showEmployee = false;
            }
        }
    };
});

NorthwindApp.directive('ngGoogleMap', function(){
    return {
        restrict: 'E',
        link: function(scope, element){
            scope.init = function(){
                if(typeof(google) == "undefined"){
                    scope.el.html("<p><h1>You are not connected to internet to access the Google Map</h1></p>");
                    return;
                }
                google.maps.visualRefresh = true;
                var mapOptions = {
                    zoom: 10,
                    center: new google.maps.LatLng(1, 1),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                scope.map = new google.maps.Map(element[0], mapOptions);
                scope.marker = new google.maps.Marker({ map: scope.map});
            }

            scope.$on('locateByAddress', function(event, data) {
                scope.locateByAddress(data);
            });

            scope.$on('loadMap', function(event, data) {
                scope.init();
            });

            scope.locateByAddress = function(address){
                var position = null;
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'address': address }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        position =  results[0].geometry.location;
                        scope.render(position);
                    }
                });
            };

            scope.render = function(position){
                scope.map.setCenter(position);
                scope.marker.setPosition(position);
                //this.marker.setTitle(this.model.get("title"));
                scope.marker.setAnimation("BOUNCE");
            };

            scope.init();
        }
    }
});

NorthwindApp.directive('ngOverlay', function(){
    return{
        restrict: 'E',
        link: function(scope){
            scope.showOverlay = function(){

            }
            scope.hideOverlay = function(){

            }
        }
    };
});

/* Filter */
NorthwindApp.filter('startFrom', function() {
    return function(data, index){
        index = +index; //parse to int
        return data.slice(index);
    }
});