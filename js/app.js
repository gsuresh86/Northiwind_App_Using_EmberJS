'use strict';
//Define an Ember App
var NorthwindApp = Ember.Application.create({
    LOG_TRANSITIONS: true
});

/* Router */
NorthwindApp.Router.map(function(){
    this.resource("employees", function(){
        this.resource("employee", {path: ":EmployeeID"})
    });
    this.resource('customers');
    this.resource('products');
    this.resource('orders');
    this.resource('suppliers');
});

NorthwindApp.IndexRoute = Ember.Route.extend({
    redirect: function(){
        this.transitionTo("employees");
    }
})

/* Application Route */
NorthwindApp.ApplicationRoute = Ember.Route.extend({
        model: function(){
        return [
            {id: 1, routeID: 'employees', caption: 'Employees'},
            {id: 2, routeID: 'customers', caption: 'Customers'},
            {id: 3, routeID: 'products', caption: 'Products'},
            {id: 4, routeID: 'orders', caption: 'Orders'},
            {id: 5, routeID: 'suppliers', caption: 'Suppliers'}
        ];
    }
});

/* Employee Route and Model */
NorthwindApp.Employee = Ember.Object.extend({
    ImageUrl: function(){
        return 'img/profile/'+this.get("EmployeeID")+'.jpg';
    }.property('EmployeeID')
});

NorthwindApp.EmployeesRoute = Ember.Route.extend({
    model: function(){
        return $.getJSON('data/employees.json').then(function(response){
            var employees = [];
            $.each(response, function(index, employee){
                employees.push(NorthwindApp.Employee.create(employee))
            });
            return employees;
        });
    }
});

/* Product Route and Model */
NorthwindApp.Product = Ember.Object.extend({
    ProductImg: function(){
        return 'img/product/'+this.get("ProductID") + '.png';
    }.property('ProductID')
});

NorthwindApp.ProductsRoute = Ember.Route.extend({

    model: function(){
        var that = this;
        var products = []
        return $.getJSON('data/Products.json').then(function(response){
            $.each(response, function (index, product) {
                products.push(NorthwindApp.Product.create(product));
            });
            return products;
        });
    }
});

NorthwindApp.ProductsController = Ember.Controller.extend({
    currentPage: 0,
    limit: 15,
    filteredProducts : function(){
        return this.get('model').slice(this.currentPage*this.limit, (this.currentPage+1)*this.limit)
    }.property('currentPage'),

    actions: {
        navRight: function(){
            var currentPage = this.get('currentPage');
            this.set('currentPage', currentPage+1);
        },
        navLeft: function(){
            var currentPage = this.get('currentPage');
            this.set('currentPage', currentPage-1);
        }
    }
});

/* Customer Route and Model */
NorthwindApp.CustomersRoute = Ember.Route.extend({
    model: function(){
        return $.getJSON('data/customers.json');
    }
});

/* Order Route and Model */
NorthwindApp.OrdersRoute = Ember.Route.extend({
    model: function(){
        var that = this;
        var orders = [];
        return $.getJSON('data/Orders.json').then(function(response){
            $.each(response, function (index, order) {
                orders.push(Ember.Object.create(order));
            });
            return orders;
        });
    }
});

NorthwindApp.OrdersController = Ember.Controller.extend({
    currentPage: 1,
    pageSize: 10,
    selPage: 1,
    showAllClass: "collapse",
    showAllCaption: "ShowAll",
    filteredProducts : function(){
        this.set('noOfPages', Math.ceil(this.get('model').length/this.pageSize));
        return this.get('model').slice((this.currentPage-1)*this.pageSize, (this.currentPage)*this.pageSize)
    }.property('currentPage', 'pageSize'),
    disableLeft: function(){ return this.currentPage == 1; }.property('currentPage'),
    disableFirst: function(){
        return this.currentPage == 1;
    }.property('currentPage'),
    disableRight: function(){
        return this.currentPage == this.noOfPages;
    }.property('currentPage', 'noOfPages'),
    disableLast: function(){
        return this.currentPage == this.noOfPages;
    }.property('currentPage', 'noOfPages'),
    disableGoto: function(){
        return this.pageSize == this.get('model').length;
    }.property('pageSize'),
    actions: {
        navRight: function(){
            var currentPage = this.get('currentPage');
            if(currentPage < this.get('noOfPages'))
                this.set('currentPage', currentPage+1);
        },
        navLeft: function(){
            var currentPage = this.get('currentPage');
            if(currentPage > 0)
                this.set('currentPage', currentPage-1);
        },
        navFirst: function(){
            this.set('currentPage', 1);
        },
        navLast: function(){
            this.set('currentPage', this.get('noOfPages'));
        },
        showAll: function(){
            var pageSize= this.get("pageSize");
            if(pageSize != 10){
                pageSize = 10;
                this.set('showAllCaption', 'Collapse');
                this.set('showAllClass', "collapse")
            }else {
                pageSize = this.get('model').length;
                this.set('showAllClass', "showAll");
                this.set('showAllCaption', 'ShowAll');
            }
            this.set('currentPage',1);
            this.set('pageSize',pageSize);
        },
        gotoPage: function(){
            this.set('currentPage', this.get("selPage"));
        }
    }
});

NorthwindApp.OrdersView = Ember.View.extend({

});

/* Supplier Route */
NorthwindApp.SuppliersRoute = Ember.Route.extend({
    model: function(){
        return $.getJSON('data/suppliers.json');
    }
});