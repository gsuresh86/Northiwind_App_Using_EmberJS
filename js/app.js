'use strict';
//Define an Ember App for our app
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

NorthwindApp.ApplicationAdapter = DS.RESTAdapter.extend({
    namespace: "ember/northwind/data"
});

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

/* Employee Route and Model*/
NorthwindApp.EmployeesRoute = Ember.Route.extend({
    model: function(){
        this.store.init();
        return this.store.find('employee')
    }
});

NorthwindApp.Employee = DS.Model.extend({
    FirstName : DS.attr('string'),
    EmployeeID: DS.attr(),
    LastName: DS.attr(),
    Title: DS.attr(),
    TitleOfCourtesy: DS.attr(),
    BirthDate: DS.attr(),
    HireDate: DS.attr(),
    Address: DS.attr(),
    City: DS.attr(),
    Region: DS.attr(),
    PostalCode: DS.attr(),
    Country: DS.attr(),
    HomePhone: DS.attr(),
    Extension: DS.attr(),
    Notes: DS.attr(),

    ImageUrl: function(){
        return 'img/profile/'+this.get("EmployeeID")+'.jpg';
    }.property('EmployeeID')


});

/* Product Route and Model*/
NorthwindApp.ProductsRoute = Ember.Route.extend({
    model: function(){
        this.store.init();
        return this.store.find('product');
    }
});

NorthwindApp.Product = DS.Model.extend({
    ProductID: DS.attr(),
    ProductName: DS.attr(),
    SupplierID: DS.attr(),
    CategoryID: DS.attr(),
    QuantityPerUnit: DS.attr(),
    UnitPrice: DS.attr(),
    UnitsInStock: DS.attr(),
    UnitsOnOrder: DS.attr(),
    ReorderLevel: DS.attr(),
    Discontinued: DS.attr(),
    Color: DS.attr(),

    ProdImg: function(){
        return 'img/product/'+this.get("ProductID") + '.png';
    }.property('ProductID')
});

/* Customer Route and Model*/
NorthwindApp.CustomersRoute = Ember.Route.extend({
    model: function(){
        this.store.init();
        return this.store.find('customer')
    }
});

NorthwindApp.Customer = DS.Model.extend({
    Phone: DS.attr(),
    PostalCode: DS.attr(),
    ContactName: DS.attr(),
    Fax: DS.attr(),
    Address: DS.attr(),
    CustomerID: DS.attr(),
    CompanyName: DS.attr(),
    Country: DS.attr(),
    City: DS.attr(),
    ContactTitle: DS.attr()
});

/* Order Route and Model*/
NorthwindApp.OrdersRoute = Ember.Route.extend({

});

NorthwindApp.Order = DS.Model.extend({
    Phone: DS.attr(),
    PostalCode: DS.attr(),
    ContactName: DS.attr(),
    Fax: DS.attr(),
    Address: DS.attr(),
    CustomerID: DS.attr(),
    CompanyName: DS.attr(),
    Country: DS.attr(),
    City: DS.attr(),
    ContactTitle: DS.attr()
});

/* Supplier Route and Model*/
NorthwindApp.SuppliersRoute = Ember.Route.extend({

});

NorthwindApp.Supplier = DS.Model.extend({
    Phone: DS.attr(),
    PostalCode: DS.attr(),
    ContactName: DS.attr(),
    Fax: DS.attr(),
    Address: DS.attr(),
    CustomerID: DS.attr(),
    CompanyName: DS.attr(),
    Country: DS.attr(),
    City: DS.attr(),
    ContactTitle: DS.attr()
});
