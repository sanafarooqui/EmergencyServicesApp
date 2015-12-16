/* Writing everything in a closure function */
(function() {
  /* create angular module */
  var app = angular.module('myapp', ['ngTable', 'ui.bootstrap', 'angular-loading-bar'])
  /* declaring a service to share the common properties among controllers */
    .service('sharedService', function() {
      var url = "http://people.rit.edu/dmgics/754/23/proxy.php";

      return {
        getURL: function() {
          return url;
        }
      };
    });

/* Declaring custom directives - these return the HTML templates for the tabs */
    
  app.directive('locationDirective', function() {

    return {
      template: '<div class="container"><div class="row"><div class="col-md-6 form-horizontal"><div class="form-inline"><label for="location">Select Location:</label><select id="location" ng-change="detailCtlr.getLocation()" class="form-control" ng-model="detailCtlr.locSelected"><option ng-repeat="option in typeArr" value="{{option.typeId}}">{{option.type}}</option></select></div><div class="form-group"><label class="col-sm-2 control-label">Address1:</label><label class="general-tab1 control-label">{{detailCtlr.locationObj.address1==="null"?"-":detailCtlr.locationObj.address1}}</label></div><div class="form-group"><label class="col-sm-2 control-label">Address2:</label><label class="general-tab1 control-label">{{detailCtlr.locationObj.address2==="null"?"-":detailCtlr.locationObj.address2}}</label></div><div class="form-group"><label class="col-sm-2 control-label">City:</label><label class="general-tab1 control-label">{{detailCtlr.locationObj.city==="null"?"-":detailCtlr.locationObj.city}}</label></div><div class="form-group"><label class="col-sm-2 control-label">County:</label><label class="general-tab1 control-label">{{detailCtlr.locationObj.countyName==="null"?"-":detailCtlr.locationObj.countyName}}</label></div><div class="form-group"><label class="col-sm-2 control-label">Fax:</label><label class="general-tab1 control-label">{{detailCtlr.locationObj.fax==="null"?"-":detailCtlr.locationObj.fax}}</label></div><div class="form-group"><label class="col-sm-2 control-label">Phone:</label><label class="general-tab1 control-label">{{detailCtlr.locationObj.phone==="null"?"-":detailCtlr.locationObj.phone}}</label></div><div class="form-group"><label class="col-sm-2 control-label">State:</label><label class="general-tab1 control-label">{{detailCtlr.locationObj.state==="null"?"-":detailCtlr.locationObj.state}}</label></div><div class="form-group"><label class="col-sm-2 control-label">Zip:</label><label class="general-tab1 control-label">{{detailCtlr.locationObj.zip==="null"?"-":detailCtlr.locationObj.zip}}</label></div></div><div class="col-md-5" id="gMap" style="height:300px"></div></div</div>'

    };
  });

  app.directive('peopleDirective', function() {
    return {
      template: '<div class="form-inline"><label for="location">Select Location: </label><select id="location" ng-change="detailCtlr.getPersonLoc()" class="form-control" ng-model="detailCtlr.personLocSelected"><option ng-repeat="option in typeArr" value="{{option.typeId}}">{{option.type}}</option></select></div><div class="form-group"><table  show-filter="true" ng-table="detailCtlr.tableParams" class="table table-condensed table-bordered table-striped"><tr ng-repeat="row in $data"><td data-title="\'Name\'"filter="{type: \'text\'}" sortable="\'lName\'" >{{row.lName}}</td><td data-title="\'Role\'" >{{row.role}}</td></tr></table></div>'
    };
  });

  app.directive('generalDirective', function() {
    return {
      template: '<form class="form-horizontal"><div class="form-group"><label class="col-sm-2 control-label">Name:</label><label class="general-tab control-label">{{detailCtlr.generalData.name==="null"?"-":detailCtlr.generalData.name}}</label></div><div class="form-group"><label class="col-sm-2 control-label">Email:</label><label class="general-tab control-label">{{detailCtlr.generalData.email === "null"?"-": detailCtlr.generalData.email}}</label></div><div class="form-group"><label class="col-sm-2 control-label">Website:</label><label class="general-tab control-label">{{detailCtlr.generalData.website==="null"?"-":detailCtlr.generalData.website}}</label></div><div class="form-group"><label class="col-sm-2 control-label">Number of Members:</label><label class="general-tab control-label">{{detailCtlr.generalData.nummembers==="null"?"-":detailCtlr.generalData.nummembers}}</label></div></form>'
    };
  });
    
/* A common directive for the tabs with tables in them */
  app.directive('tableDirective', function() {
    return {
      template: '<table id="tab_table" ng-table="tableParams" show-filter="true" class="table table-condensed table-bordered table-striped"><tr><th ng-repeat="column in columns" ng-show="column.visible" class="text-center id="column_title" sortable">{{column.title}}</th></tr><tr ng-repeat="user in $data"><td ng-repeat="column in columns" ng-show="column.visible" sortable="column.field">{{user[column.field]==="null"?"-":user[column.field]}}</td></tr></table>'
    };
  });

    
  /* The search controller */
  app.controller('SearchController', function($http, NgTableParams, $filter, sharedService, $rootScope, $scope) {

    /* initialize */
    var searchCtlr = this;
   // searchCtlr.$inject = ["NgTableParams", '$rootScope'];
    //List for org types
    searchCtlr.orgTypeList = [];
    //default org type
    searchCtlr.orgType = "All Organization Types";
    //List for cities
    searchCtlr.cityList = [];
    //default state
    searchCtlr.stateSelected = "NY";
    //header for the accordion
    $scope.resultHeader = "Search Result";

    
    //push the default value to be selected into the 
    searchCtlr.orgTypeList.push({
      typeId: "default",
      type: "All Organization Types"
    });
    searchCtlr.cityList.push({
      city: "All Cities"
    });

    //Get request for getting the Org types
    $http({
      method: 'GET',
      url: sharedService.getURL(),
      params: {
        path: "/OrgTypes"
      },
    }).then(function successCallback(response) {
      //Using external library to convert XML data into JSON
      var x2js = new X2JS();
      var xmlText = response.data;
      var jsonObj = x2js.xml_str2json(xmlText);
    
      //copy the values from json data into orgTypeList variable
      searchCtlr.orgTypeList.push.apply(searchCtlr.orgTypeList, jsonObj.data.row);

    }, function errorCallback(response) {
      console.error("Ajax error in SearchController!");
    });

      //get the cities for the state selected
    searchCtlr.getCities = function() {
      //clearing out the array
      searchCtlr.cityList.splice(0, searchCtlr.cityList.length);

      
      $http({
        method: 'GET',
        url: sharedService.getURL(),
        params: {
          path: "/Cities?state=" + searchCtlr.stateSelected
        },
      }).then(function successCallback(response) {

        var x2js = new X2JS();
        var xmlText = response.data;
        var jsonObj = x2js.xml_str2json(xmlText);

        //if no cities found populate the info message
        if (jsonObj.data === "" || jsonObj.data.row.length === 0) {
          searchCtlr.cityList.push({
            city: "There are no cities in " + searchCtlr.stateSelected
          });
          searchCtlr.citySelected = "There are no cities in " + searchCtlr.stateSelected;

        } else {
          var citiesArr = jsonObj.data.row;
          searchCtlr.cityList.push({
            city: "All Cities"
          });
          searchCtlr.cityList.push.apply(searchCtlr.cityList, citiesArr);
          searchCtlr.citySelected = "All Cities";
        }

      }, function errorCallback(response) {
        console.error("Ajax error in SearchController!");
      });

    }
    
    // Get the search results
    searchCtlr.getResults = function() {
      //set the accordion header and state to close before a new search begins
      $scope.resultHeader = "Search Result";
      $scope.status = {
        open: false
      };
        
      //form data
      var type = searchCtlr.orgType === "All Organization Types" ? "" : searchCtlr.orgType;
      var state = searchCtlr.stateSelected === "All States" ? "" : searchCtlr.stateSelected;
      var city = searchCtlr.citySelected === "All Cities" ? "" : searchCtlr.citySelected;
      var name = typeof(searchCtlr.orgName) === "undefined" ? "" : searchCtlr.orgName;
      var country = typeof(searchCtlr.country) === "undefined" ? "" : searchCtlr.country;
      var zip = typeof(searchCtlr.zipcode) === "undefined" ? "" : searchCtlr.zipcode;

      
      $http({
        method: 'GET',
        url: sharedService.getURL(),
        params: {
          path: "/Organizations?type=" + type + "&name=" + name + "&state=" + state + "&town=" + city + "&country=" + country + "&zip=" + zip
        },
      }).then(function successCallback(response) {

        var x2js = new X2JS();
        var xmlText = response.data;
        var jsonObj = x2js.xml_str2json(xmlText);

        var data = [];
        //If no data returned display info message
        if (jsonObj === null || typeof(jsonObj.data) === "undefined" || jsonObj.data == "") {
          $scope.resultHeader = "No results found.";
          $scope.status = {
            open: false
          };
        } else {
         // Else update the accordion header to show the result details
          data = jsonObj.data.row;
          $scope.resultHeader = "Search Result (Found " + data.length + " results)";
          $scope.status = {
            open: true
          };
        }
        
        //Define a angularJS table to hold the data
        searchCtlr.tableParams = new NgTableParams({
          page: 1, // show first page
          count: 10
        }, {
          total: data.length, // length of data
          getData: function($defer, params) {  //apply filtering/ordering and pagination 
            var filteredData = params.filter() ? $filter('filter')(data, params.filter()) : data;
            var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }
        });

      }, function errorCallback(response) {
        console.error("Ajax error in SearchController!");
      });
    }

    //Broadcast an event - getDetails to DetailsController when a Org Name is clicked and pass it the id of the Organization
    searchCtlr.getDetails = function(id) {
      $rootScope.$broadcast('getDetail', id);
    }

    //Set the default city to NY when the page loads
    searchCtlr.getCities("NY");
  }); //end of SearchController

/* DetailController to show tab data in the Details accordion */
  app.controller('DetailController', function($http, $scope, sharedService, NgTableParams, $compile, $filter) {
    var detailCtlr = this;
      //header for the detail accordion
    $scope.detailHeader = "Details";
    
    // getDetail event which listen to the broadcasted event
    $scope.$on('getDetail', function(event, data) {
      detailCtlr.getTabs(data);
      detailCtlr.orgID = data;
    });

    //get the tabs  
    detailCtlr.getTabs = function(orgId) {

      $http({
        method: 'GET',
        url: sharedService.getURL(),
        params: {
          path: "/Application/Tabs?orgId=" + orgId
        },
      }).then(function successCallback(response) {

        var x2js = new X2JS();
        var xmlText = response.data;
        var jsonObj = x2js.xml_str2json(xmlText);

        if (jsonObj.data !== "" || jsonObj.data.row.length !== 0) {
          var tArr = jsonObj.data.row;
          $scope.tabs = [];
          $scope.dStatus = {
            open: true
          };

          //make a json array for tabs tobe used to show the custom directives
          for (var i = 0; i < tArr.length; i++) {

            if (tArr[i].Tab === "Locations") {
              $scope.tabs.push({
                title: tArr[i].Tab,
                isLoaded: false,
                active: true,
                location: true
              });
            } else if (tArr[i].Tab === "People") {
              $scope.tabs.push({
                title: tArr[i].Tab,
                isLoaded: false,
                active: true,
                people: true
              });
            } else if (tArr[i].Tab === "General") {
              $scope.tabs.push({
                title: tArr[i].Tab,
                isLoaded: false,
                active: true,
                general: true
              });
            } else {
              $scope.tabs.push({
                title: tArr[i].Tab,
                isLoaded: false,
                active: true,
                showTable: true
              });
            }
          }
        } else {
          //Display no tabs available 
          $scope.detailHeader = "No details available.";
          $scope.dStatus = {
            open: false
          };
        }
      }, function errorCallback(response) {
        console.error("Ajax error in SearchController!");
      });
    }

    //Get individual tab data when that tab is clicked
    detailCtlr.getTabInfo = function(tabTitle, index) {

      $http({
        method: 'GET',
        url: sharedService.getURL(),
        params: {
          path: "/" + detailCtlr.orgID + "/" + tabTitle
        },
      }).then(function successCallback(response) {

        var x2js = new X2JS();
        var xmlText = response.data;
        var jsonObj = x2js.xml_str2json(xmlText);

        //Checking for no data condition
        if (typeof(jsonObj.data) === "undefined" || jsonObj.data == null ||
          (typeof(jsonObj.data.count) !== "undefined" && jsonObj.data.count == "0")) {
          $scope.tabMessage = "No data available for " + tabTitle + ".";
        } else {
          $scope.tabMessage = "";
            //Setting the data objects for the individual tabs and then calling the display methods
          if (tabTitle === "General") {
            detailCtlr.tabData = jsonObj.data;
            detailCtlr.generalData = jsonObj.data;

          } else if (tabTitle === "Training" || tabTitle === "Treatment" || tabTitle === "Facilities" || tabTitle === "Physicians" || tabTitle === "Equipment") {   //All tabs with tabular data together
            if (tabTitle === "Facilities") {
              detailCtlr.tableData = jsonObj.data.facility;
            } else if (tabTitle === "Physicians") {
              detailCtlr.tableData = jsonObj.data.physician;
            } else {
              detailCtlr.tableData = jsonObj.data[tabTitle.toLowerCase()];
            }
            if (detailCtlr.tableData.count != 0) {
              detailCtlr.displayTableData(detailCtlr.tableData);
            } else {
              $scope.tabMessage = "No data available for " + tabTitle + " tab.";
            }
          } else if (tabTitle === "Locations") {
            detailCtlr.tabData = jsonObj.data.location;

            if (detailCtlr.tabData.length > 0) {
              detailCtlr.displayLocationData(detailCtlr.tabData);

            } else {
              $scope.tabMessage = "No data available for " + tabTitle + " tab.";
            }

          } else if (tabTitle === "People") {
            detailCtlr.tabData = jsonObj.data.site;
            if (detailCtlr.tabData.length > 0) {
              detailCtlr.displayPersonData(detailCtlr.tabData);
            } else {
              $scope.tabMessage = "No data available for " + tabTitle + " tab.";
            }
          }
        }
      }, function errorCallback(response) {
        console.error("Ajax error in SearchController!");
      });

    }
    
    //function to display location data
     detailCtlr.displayLocationData = function(data) {
      detailCtlr.locationObj = {};
      $scope.typeArr = [];

      //making array for the location select - typeId(value for the select) = index so that retreival will be easier
      for (var i = 0; i < data.length; i++) {
        $scope.typeArr.push({
          typeId: i,
          type: data[i].type
        });
      }
      //setting default location
      detailCtlr.locSelected = "0";
      detailCtlr.getLocation();
    }

     //gets the location depending on the value in the select
    detailCtlr.getLocation = function() {
      detailCtlr.locationObj = detailCtlr.tabData[detailCtlr.locSelected];
        
      if (detailCtlr.locationObj.latitude == null) {
        $("#gMap").html("No map available.");
      } else {
        //show the map if latitude and longitude exist
        var myCenter = new google.maps.LatLng(detailCtlr.locationObj.latitude, detailCtlr.locationObj.longitude);
        var mapProp = {
          center: myCenter,
          zoom: 5,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("gMap"), mapProp);

        var marker = new google.maps.Marker({
          position: myCenter,
          visible: true
        });

        marker.setMap(map);
      }
    }
    
    //Display data for person
     detailCtlr.displayPersonData = function(data) {
      
      detailCtlr.locationObj = {};
      $scope.typeArr = [];
      //create the select
      for (var i = 0; i < data.length; i++) {
        $scope.typeArr.push({
          typeId: i,
          type: data[i]._siteType
        });
      }
    
      detailCtlr.personLocSelected = "0";
      detailCtlr.getPersonLoc();
    }
    
    //function for person select
    detailCtlr.getPersonLoc = function() {
      detailCtlr.locationObj = detailCtlr.tabData[detailCtlr.personLocSelected];
      var data = detailCtlr.locationObj.person;
     
    //Create table to display person data
      detailCtlr.tableParams = new NgTableParams({
        page: 1,
        count: 10
      }, {
        total: data.length,
        getData: function($defer, params) {

          $defer.resolve($filter('orderBy')(data, params.orderBy()));
        }
      });
    }

   //Display data for the tabs with table in them
    detailCtlr.displayTableData = function(tabledata) {
      var data = tabledata;
    
     //Get the column titles dynamically
      $scope.columns = [];
      var d = data[0];
      for (var key in d) {
        if (d.hasOwnProperty(key)) {
          $scope.columns.push({
            title: key,
            field: key,
            visible: true
          });
        }
      }
    
     //Make the table
      $scope.tableParams = new NgTableParams({
        page: 1,
        count: 7
      }, {
        total: data.length,
        getData: function($defer, params) {
          $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }
    
  
    /* Trying out the jquery plugin  - The plugin method getting called before the table is displayed */
    //      $scope.$on('$viewContentLoaded', function(){
//      $timeout(function () {
//          console.log("hi");
//         var elem = angular.element(document.getElementById('tab_table'));
//         console.log(elem.height());
//      });
//    });
    
    //the mouseenter and mouseout methods called but color not changing
    //$("resultAccordion").changeColor(); 
    
  }); //end of detailController

})();