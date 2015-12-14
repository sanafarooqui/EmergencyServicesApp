
(function(){
    //http://stackoverflow.com/questions/19415394/with-ng-bind-html-unsafe-removed-how-do-i-inject-html
    /* create angular module */    
    var app = angular.module('myapp',['ngTable','ui.bootstrap','angular-loading-bar'])
        .service('sharedService', function () {
            var url = "http://people.rit.edu/dmgics/754/23/proxy.php";
            
            return {
                getURL: function () {
                    return url;
                }
            };
        });
    
    //creating a filter to get the HTML content into the tabs
    app.filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);
    
    app.directive('locationDirective', function () {
        
    return {
       template: '<div class="container"><div class="row"><div class="col-md-6 form-horizontal"><div class="form-inline"><label for="location">Select Location:</label><select id="location" ng-change="detailCtlr.getLocation()" class="form-control" ng-model="detailCtlr.locSelected"><option ng-repeat="option in typeArr" value="{{option.typeId}}">{{option.type}}</option></select></div><div class="form-group"><label class="col-sm-2 control-label">Address1:</label><label class="general-tab1 control-label">{{detailCtlr.locationObj.address1}}</label></div><div class="form-group"><label class="col-sm-2 control-label">Address2:</label><label class="general-tab1 control-label">{{detailCtlr.locationObj.address2}}</label></div><div class="form-group"><label class="col-sm-2 control-label">City:</label><label class="general-tab1 control-label">{{detailCtlr.locationObj.city}}</label></div><div class="form-group"><label class="col-sm-2 control-label">County:</label><label class="general-tab1 control-label">{{detailCtlr.locationObj.countyName}}</label></div><div class="form-group"><label class="col-sm-2 control-label">Fax:</label><label class="general-tab1 control-label">{{detailCtlr.locationObj.fax}}</label></div><div class="form-group"><label class="col-sm-2 control-label">Phone:</label><label class="general-tab1 control-label">{{detailCtlr.locationObj.phone}}</label></div><div class="form-group"><label class="col-sm-2 control-label">State:</label><label class="general-tab1 control-label">{{detailCtlr.locationObj.state}}</label></div><div class="form-group"><label class="col-sm-2 control-label">Zip:</label><label class="general-tab1 control-label">{{detailCtlr.locationObj.zip}}</label></div></div><div class="col-md-5" id="gMap" style="height:300px"></div></div</div>'
       
    };
});
 
app.directive('peopleDirective', function () {
    return {
       template: '<div class="form-inline"><label for="location">Select Location: </label><select id="location" ng-change="detailCtlr.getPersonLoc()" class="form-control" ng-model="detailCtlr.personLocSelected"><option ng-repeat="option in typeArr" value="{{option.typeId}}">{{option.type}}</option></select></div><div class="form-group"><table  show-filter="true" ng-table="detailCtlr.tableParams" class="table table-condensed table-bordered table-striped"><tr ng-repeat="row in $data"><td data-title="\'Name\'"filter="{type: \'text\'}" sortable="\'lName\'" >{{row.lName}}</td><td data-title="\'Role\'" >{{row.role}}</td></tr></table></div>'
    };
});
    
    app.directive('generalDirective', function () {
    return {
       template: '<form class="form-horizontal"><div class="form-group"><label class="col-sm-2 control-label">Name:</label><label class="general-tab control-label">{{detailCtlr.generalData.name}}</label></div><div class="form-group"><label class="col-sm-2 control-label">Email:</label><label class="general-tab control-label">{{detailCtlr.generalData.email }}</label></div><div class="form-group"><label class="col-sm-2 control-label">Website:</label><label class="general-tab control-label">{{detailCtlr.generalData.website}}</label></div><div class="form-group"><label class="col-sm-2 control-label">Number of Members:</label><label class="general-tab control-label">{{detailCtlr.generalData.nummembers}}</label></div></form>'
    };
});
    app.directive('tableDirective', function () {
    return {
       template: '<table ng-table="tableParams" show-filter="true" class="table table-condensed table-bordered table-striped"><tr><th ng-repeat="column in columns" ng-show="column.visible" class="text-center sortable">{{column.title}}</th></tr><tr ng-repeat="user in $data"><td ng-repeat="column in columns" ng-show="column.visible" sortable="column.field">{{user[column.field]}}</td></tr></table>'
    };
});

    /* create module.controllers 
    Each controller handles a different view
    */
    app.controller('SearchController',function($http,NgTableParams,$filter,sharedService,$rootScope,$scope) {

        /* initialize */ 
        var searchCtlr = this;
        searchCtlr.$inject = ["NgTableParams",'$rootScope'];
        searchCtlr.orgTypeList=[];
        searchCtlr.orgType="All Organization Types";
        searchCtlr.cityList = [];
        $scope.resultHeader = "Search Result";
       
        searchCtlr.stateSelected = "NY";
        
        searchCtlr.orgTypeList.push({typeId:"default",type:"All Organization Types"});
         searchCtlr.cityList.push({city:"All Cities"});
        
        console.log("URL");
        console.log( sharedService.getURL());
        
    $http({
      method: 'GET',
      url: sharedService.getURL(),
      params :{path:"/OrgTypes"},
    }).then(function successCallback(response) {
      
        var x2js = new X2JS();
        var xmlText = response.data;
        var jsonObj = x2js.xml_str2json( xmlText );
     
         //searchCtlr.orgTypeList = ;
        searchCtlr.orgTypeList.push.apply(searchCtlr.orgTypeList, jsonObj.data.row);
      
         console.log(" searchCtlr.orgTypeList");
        console.dir( searchCtlr.orgTypeList);
               
        }, function errorCallback(response) {
             console.error("Ajax error in SearchController!");
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
        
        
        searchCtlr.getCities = function(){
            //clearing out the array
            searchCtlr.cityList.splice(0,searchCtlr.cityList.length);
        
            
        console.log(searchCtlr.stateSelected);
        console.log("searchCtlr.stateSelected");
            $http({
              method: 'GET',
              url: sharedService.getURL(),
              params :{path:"/Cities?state="+searchCtlr.stateSelected},
            }).then(function successCallback(response) {
              
                var x2js = new X2JS();
                var xmlText = response.data;
                var jsonObj = x2js.xml_str2json( xmlText );
               
                console.log("jsonObj");
                console.dir( jsonObj);
                
                
                if(jsonObj.data === "" || jsonObj.data.row.length === 0){
                 searchCtlr.cityList.push({city:"There are no cities in "+searchCtlr.stateSelected});
                searchCtlr.citySelected = "There are no cities in "+searchCtlr.stateSelected;
              
                }else{
                var citiesArr = jsonObj.data.row;
                    searchCtlr.cityList.push({city:"All Cities"});
                 searchCtlr.cityList.push.apply(searchCtlr.cityList, citiesArr);
                     searchCtlr.citySelected = "All Cities";

                }
               
                 console.log(" searchCtlr.cityList");
            console.dir( searchCtlr.cityList);

                }, function errorCallback(response) {
                     console.error("Ajax error in SearchController!");
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
  
        }
        
        
        searchCtlr.getResults = function(){
             $scope.resultHeader = "Search Result";
             $scope.status = {open:false};
            //form data
            var type = searchCtlr.orgType === "All Organization Types"?"":searchCtlr.orgType;
            var state = searchCtlr.stateSelected === "All States"?"":searchCtlr.stateSelected;
            var city = searchCtlr.citySelected === "All Cities"?"":searchCtlr.citySelected;
            var name = typeof(searchCtlr.orgName) === "undefined" ? "":searchCtlr.orgName;
            var country = typeof(searchCtlr.country) === "undefined" ? "":searchCtlr.country;
            var zip = typeof(searchCtlr.zipcode) === "undefined" ? "":searchCtlr.zipcode;
                
            console.log("searchCtlr.country");
            console.log(searchCtlr.country);
            console.log("searchCtlr.orgType");
            console.log(searchCtlr.orgType);
            
            
            
        $http({
      method: 'GET',
      url: sharedService.getURL(),
      params :{path:"/Organizations?type="+type+"&name="+name+"&state="+state+"&town="+city+"&country="+country+"&zip="+zip},
    }).then(function successCallback(response) {
      
        var x2js = new X2JS();
        var xmlText = response.data;
        var jsonObj = x2js.xml_str2json( xmlText );
       
        console.log(" searchCtlr.orgTypeList");
        console.dir(jsonObj);
               var data=[];
               if(jsonObj === null || typeof(jsonObj.data) === "undefined"){
                    $scope.resultHeader = "No results found.";
                    $scope.status={open:false};
               }else{
                  data = jsonObj.data.row;
                    $scope.resultHeader = "Search Result (Found "+data.length+" results)";
                $scope.status={open:true};
               }
                   
               searchCtlr.tableParams = new NgTableParams(
                   {page: 1,            // show first page
                    count: 10
                    }, {
                        total: data.length, // length of data
                        getData: function($defer, params) {
                           
                        var filteredData = params.filter() ? $filter('filter')(data, params.filter()):data;

                        var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
                 
                         $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));    
                    }});
               
               
        }, function errorCallback(response) {
             console.error("Ajax error in SearchController!");
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
        
        }
        
         searchCtlr.getDetails = function(id){
             
             $rootScope.$broadcast('getDetail', id);
        }
        
        
         searchCtlr.getCities("NY");
    });//end of SearchController
        
    
    
    app.controller('DetailController',function($http,$scope,sharedService,NgTableParams,$compile,$filter) {
        var detailCtlr = this;
        $scope.detailHeader = "Details";
            
        $scope.$on('getDetail', function(event, data) { 
            detailCtlr.getTabs(data);
            detailCtlr.orgID = data;
        });
 
        detailCtlr.getTabs = function(orgId){
        
              $http({
              method: 'GET',
              url: sharedService.getURL(),
              params :{path:"/Application/Tabs?orgId="+orgId},
            }).then(function successCallback(response) {
              
                var x2js = new X2JS();
                var xmlText = response.data;
                var jsonObj = x2js.xml_str2json( xmlText );
               
                console.log("tab jsonObj");
                console.dir( jsonObj);
                
                
               if(jsonObj.data !== "" || jsonObj.data.row.length !== 0){
                var tArr = jsonObj.data.row;
                $scope.tabs = [];
                $scope.dStatus={open:true};
                   
                //make a json array for tabs
                for(var i=0;i<tArr.length;i++){
                     
                    if(tArr[i].Tab === "Locations"){
                     $scope.tabs.push({title:tArr[i].Tab,isLoaded:false,active:true,location:true});
                    }else if(tArr[i].Tab === "People"){
                     $scope.tabs.push({title:tArr[i].Tab,isLoaded:false,active:true,people:true});
                    }else if(tArr[i].Tab === "General"){
                     $scope.tabs.push({title:tArr[i].Tab,isLoaded:false,active:true,general:true});
                    }else{
                     $scope.tabs.push({title:tArr[i].Tab,isLoaded:false,active:true,showTable:true});
                    }
                 }
                }else{
                //Display no tabs available 
                     $scope.detailHeader = "No details available.";
                     $scope.dStatus = {open:false};
                }
               
                 console.log(" detailCtlr.tabs");
                 console.dir( $scope.tabs);

                }, function errorCallback(response) {
                     console.error("Ajax error in SearchController!");
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        
        }
        
        detailCtlr.getTabInfo = function(tabTitle,index){
        console.log("getTabInfo");
        console.log(tabTitle);
            
              $http({
              method: 'GET',
              url: sharedService.getURL(),
              params :{path:"/"+detailCtlr.orgID+"/"+tabTitle},
            }).then(function successCallback(response) {
              
                var x2js = new X2JS();
                var xmlText = response.data;
                var jsonObj = x2js.xml_str2json( xmlText );
               
                console.log("tab jsonObj");
                console.dir( jsonObj);
                  
                if(typeof(jsonObj.data) === "undefined" || jsonObj.data == null || 
                   (typeof(jsonObj.data.count) !== "undefined" && jsonObj.data.count == "0")){
                     $scope.tabMessage = "No data available for "+tabTitle+".";
                   }else{ 
                    $scope.tabMessage = "";
                    if(tabTitle === "General"){
                        detailCtlr.tabData = jsonObj.data;
                      //  detailCtlr.displayGeneralData(jsonObj.data,index);
                        detailCtlr.generalData = jsonObj.data;
                        
                    }else if(tabTitle === "Training" || tabTitle === "Treatment" || tabTitle === "Facilities" || tabTitle === "Physicians" || tabTitle === "Equipment"){ // TODO - put all the tabled tabs in one function
                        if(tabTitle === "Facilities"){
                            detailCtlr.tableData = jsonObj.data.facility;
                        }else if(tabTitle === "Physicians"){
                            detailCtlr.tableData = jsonObj.data.physician;
                        }else{
                            detailCtlr.tableData = jsonObj.data[tabTitle.toLowerCase()];
                        }
                        if(detailCtlr.tableData.count != 0){
                         detailCtlr.displayTableData(detailCtlr.tableData);
                        }else{
                         $scope.tabMessage = "No data available for "+tabTitle+" tab.";
                        }
                    }else if(tabTitle === "Locations"){
                        detailCtlr.tabData = jsonObj.data.location;
                        
                         if(detailCtlr.tabData.length>0){
                         detailCtlr.displayLocationData(detailCtlr.tabData);
                        
                        console.log("document.getElementById(googleMap)");
                        console.dir(document.getElementById("gMap"));
                             
                        }else{
                         $scope.tabMessage = "No data available for "+tabTitle+" tab.";
                        }
                      
                    }else if(tabTitle === "People"){
                        detailCtlr.tabData = jsonObj.data.site;
                        if(detailCtlr.tabData.length>0){
                         console.log(" detailCtlr.tabData");
                        console.log(detailCtlr.tabData);
                        
                        detailCtlr.displayPersonData(detailCtlr.tabData);
                             
                        }else{
                         $scope.tabMessage = "No data available for "+tabTitle+" tab.";
                        }
                       
                }
            
                }}, function errorCallback(response) {
                     console.error("Ajax error in SearchController!");
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        
        }
        
         detailCtlr.getLocation = function(){
             console.log("displayLocationData");
             console.dir(detailCtlr.locSelected);
             detailCtlr.locationObj=detailCtlr.tabData[detailCtlr.locSelected];
             if(detailCtlr.locationObj.latitude == null){
                document.getElementById("gMap").html("No map available.");
             }else{
                 var myCenter=new google.maps.LatLng(detailCtlr.locationObj.latitude,detailCtlr.locationObj.longitude);
                 var mapProp = {
                    center:myCenter,
                    zoom:5,
                    mapTypeId:google.maps.MapTypeId.ROADMAP
                    };

                var map=new google.maps.Map(document.getElementById("gMap"),mapProp);

                var marker=new google.maps.Marker({
                    position:myCenter,
                    visible: true
                });

            marker.setMap(map);
             }
         }
         
          detailCtlr.getPersonLoc = function(){
            console.log("displayLocationData");
            console.dir(detailCtlr.personLocSelected);
            detailCtlr.locationObj=detailCtlr.tabData[detailCtlr.personLocSelected];
            console.log("locationObj");
            console.dir(detailCtlr.locationObj);
                        
            var data = detailCtlr.locationObj.person;
            console.dir(data);
                   
            detailCtlr.tableParams = new NgTableParams({
                page: 1,          
                count: 10
                },{
                total :data.length,
                getData: function($defer, params) {

                $defer.resolve($filter('orderBy')(data, params.orderBy()));
                }
            });
         }
          
           detailCtlr.displayPersonData = function(data){
              console.log("displayPersonData");
              detailCtlr.locationObj={};
               $scope.typeArr =[];
              
               for(var i=0;i<data.length;i++){
                    $scope.typeArr.push({typeId:i,type:data[i]._siteType});
               }
              console.log("$scope.typeArr");
              console.dir($scope.typeArr);
              detailCtlr.personLocSelected = "0";
              detailCtlr.getPersonLoc();
          }
           
          detailCtlr.displayLocationData = function(data){
               console.log("displayLocationData");
               detailCtlr.locationObj={};
               $scope.typeArr =[];
        
               for(var i=0;i<data.length;i++){
                    $scope.typeArr.push({typeId:i,type:data[i].type});
               }
              console.log("$scope.typeArr");
              console.dir($scope.typeArr);
              detailCtlr.locSelected = "0";
              detailCtlr.getLocation();
          }
          
            detailCtlr.displayTableData = function(tabledata){
            var data = tabledata;
                            
              $scope.columns = [];
             var d = data[0];
            for(var key in d) {
                if(d.hasOwnProperty(key)) {
                    $scope.columns.push({title:key,field:key,visible:true});
                                     
                        }
                }    
                    $scope.tableParams = new NgTableParams({
                    page: 1,          
                    count: 6
                    },{
                    total :data.length,
                    getData: function($defer, params) {
                                
                    //$defer.resolve($filter('orderBy')(data, params.orderBy()));
                    $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));    
                    }
                });
            }
                 
    });//end of detailController
    
 
  String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

})();