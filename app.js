
(function(){
    //http://stackoverflow.com/questions/19415394/with-ng-bind-html-unsafe-removed-how-do-i-inject-html
 
    /* create angular module */    
    var app = angular.module('myapp',['ngTable','ui.bootstrap'])
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
       template: '<div class="container"><div class="row"><div class="col-md-6 form-horizontal" style="border:1px solid"><select id="location" ng-change="detailCtlr.getLocation()" class="form-control" ng-model="detailCtlr.locSelected"><option ng-repeat="option in typeArr" value="{{option.typeId}}">{{option.type}}</option></select> <div class="form-group"><label class="col-sm-2 control-label">Address1:</label><label class="general-tab control-label">{{detailCtlr.locationObj.address1}}</label></div><div class="form-group"><label class="col-sm-2 control-label">Address2:</label><label class="general-tab control-label">{{detailCtlr.locationObj.address2}}</label></div></div><div class="col-md-5" id="gMap" style="border:1px solid;height:300px;width:300px"></div></div</div>'
       
    };
});
 
app.directive('peopleDirective', function () {
        
    return {
       template: '<div class="container"><div class="row"><div class="col-md-6 form-horizontal" style="border:1px solid"><select id="location" ng-change="detailCtlr.getLocation()" class="form-control" ng-model="detailCtlr.locSelected"><option ng-repeat="option in typeArr" value="{{option.typeId}}">{{option.type}}</option></select> <div class="form-group"><label class="col-sm-2 control-label">Address1:</label><label class="general-tab control-label">{{detailCtlr.locationObj.address1}}</label></div><div class="form-group"><label class="col-sm-2 control-label">Address2:</label><label class="general-tab control-label">{{detailCtlr.locationObj.address2}}</label></div></div><div class="col-md-5" id="gMap" style="border:1px solid;height:300px;width:300px"></div></div</div>'
       
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
        
        
         searchCtlr.getDetails = function(id){
            
            console.log(id);
             $rootScope.$broadcast('getDetail', id);
           
        }
        
        
        searchCtlr.getResults = function(){
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
               
               if(typeof(jsonObj.data) !== "undefined"){
                var data = jsonObj.data.row;
                   
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
               
               }
        }, function errorCallback(response) {
             console.error("Ajax error in SearchController!");
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
        
        }
        
         searchCtlr.getCities("NY");
    });//end of SearchController
        
    
    
    app.controller('DetailController',function($http,$scope,sharedService,NgTableParams,$compile) {
        var detailCtlr = this;
        
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
                   
                //make a json array for tabs
                for(var i=0;i<tArr.length;i++){
                     
                    if(tArr[i].Tab === "Locations"){
                     $scope.tabs.push({title:tArr[i].Tab,content:"",isLoaded:false,active:true,location:true});
                    }else if(tArr[i].Tab === "People"){
                     $scope.tabs.push({title:tArr[i].Tab,content:"",isLoaded:false,active:true,people:true});
                    }else{
                     $scope.tabs.push({title:tArr[i].Tab,content:"",isLoaded:false,active:true,location:false});
                    }
                }
                }else{
                //Display no tabs available 
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
                if(typeof(jsonObj.data) !== "undefined" && jsonObj.data !== null && jsonObj.data.count > 0){
                   
                    if(tabTitle === "General"){
                        detailCtlr.tabData = jsonObj.data;
                        //   detailCtlr.tabs[index].content = "'general.html'";
                        detailCtlr.displayGeneralData(jsonObj.data,index);
                    }else if(tabTitle === "Training" || tabTitle === "Treatment" || tabTitle === "Facilities" || tabTitle === "Physicians"){ // TODO - put all the tabled tabs in one function
                        if(tabTitle === "Facilities"){
                            detailCtlr.tableData = jsonObj.data.facility;
                        }else if(tabTitle === "Physicians"){
                            detailCtlr.tableData = jsonObj.data.physician;
                        }else{
                            detailCtlr.tableData = jsonObj.data[tabTitle.toLowerCase()];
                        }
                        
                        detailCtlr.displayTableData(detailCtlr.tableData,index);
                      
                    }else if(tabTitle === "Locations"){
                        detailCtlr.tabData = jsonObj.data.location;
                        
                        detailCtlr.displayLocationData(detailCtlr.tabData,index);
                        
                            console.log("document.getElementById(googleMap)");
                        console.dir(document.getElementById("gMap"));

                         var myCenter=new google.maps.LatLng(51.508742,-0.120850);
                        var mapProp = {
                          center:myCenter,
                          zoom:5,
                          mapTypeId:google.maps.MapTypeId.ROADMAP
                          };

                        var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);

                        var marker=new google.maps.Marker({
                          position:myCenter,
                            visible: true
                          });

                    marker.setMap(map);
                        
                    }else if(tabTitle === "People"){
                        detailCtlr.tabData = jsonObj.data.site;
                        
                       detailCtlr.displayLocationData(detailCtlr.tabData,index);
                        
                        var data = detailCtlr.locationObj.person;
                   
                  detailCtlr.peopleTableParams = new NgTableParams(
                   {page: 1,            // show first page
                    count: 10
                    }, {
                        total: data.length, // length of data
                        getData: function($defer, params) {
                           
                        var filteredData = params.filter() ? $filter('filter')(data, params.filter()):data;

                    var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
                 
                   
                         $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));    
                           
                    }});
                    }
                
                }else{
                 //TODO = Display message tab data doesnt exist
                }
                
            
                }, function errorCallback(response) {
                     console.error("Ajax error in SearchController!");
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        
        }
        
         detailCtlr.getLocation = function(){
             console.log("displayLocationData");
          console.dir(detailCtlr.locSelected);
             detailCtlr.locationObj=detailCtlr.tabData[detailCtlr.locSelected];
             
         }
         
          detailCtlr.displayLocationData = function(data,index){
              detailCtlr.locationObj={};
               $scope.typeArr =[];
              //  detailCtlr.typeArr.push({typeId:"default",type:"Select Location Type"});
               for(var i=0;i<data.length;i++){
                $scope.typeArr.push({typeId:i,type:data[i].type});
               }
              
              detailCtlr.locSelected = "0";
              detailCtlr.getLocation();
              
//              var locationHTML = '<div class="container"><div class="row"><div class="col-md-6 form-horizontal" style="border:1px solid">';
//              locationHTML += '<select id="location" ng-change="detailCtlr.getLocation()" class="form-control" ng-model="detailCtlr.locSelected"><option ng-repeat="option in detailCtlr.typeArr" value="{{option.typeId}}">{{option.type}}</option></select>';
//              locationHTML += ' <div class="form-group"><label class="col-sm-2 control-label">Address1:</label><label class="general-tab control-label">{{detailCtlr.locationObj.address1}}</label></div>';
//              locationHTML += '<div class="form-group"><label class="col-sm-2 control-label">Address2:</label><label class="general-tab control-label">{{detailCtlr.locationObj.address2}}</label></div>';
//              
//              
//              
//              locationHTML +='</div><div class="col-md-5" id="googleMap" style="border:1px solid;height:300px"></div></div</div>';
            
           
              
           //  detailCtlr.tabs[index].content = "<div my-shared-scope></div>";
           //  console.dir(detailCtlr.tabs[index].content);
             

          }
          
        
          detailCtlr.displayTableData = function(data,index){
            var row1 = detailCtlr.tableData[0];  
            //  var tableHTML = "<table class='table table-striped'><thead><tr><th>Type</th><th>Abbreviation</th>";
            var tableHTML = "<table class='table table-striped'><thead><tr>";
                        
            for(var key in row1) {
                if(row1.hasOwnProperty(key)) {
                    tableHTML += "<th>"+key.capitalizeFirstLetter()+"</th>";
                    // console.log(key + " -> " + data[key]);
                    }
            }        
            tableHTML += "</tr></thead><tbody>";
                        
            for(var i=0;i<detailCtlr.tableData.length;i++) {
                var data = detailCtlr.tableData[i];
                tableHTML+= "<tr>";
                            
                for(var key in data) {
                    if(data.hasOwnProperty(key)) {
                        tableHTML+= "<td>"+data[key]+"</td>";
                        console.log(key + " -> " + data[key]);
                        }
                }
                tableHTML += "</tr>";
                       //    tableHTML+= "<tr><td>"+detailCtlr.tableData[i].type+"</td><td>"+detailCtlr.tableData[i].abbreviation+"</td></tr>";
            }
            tableHTML += "</tbody>";
            $scope.tabs[index].content = tableHTML;
          
          }
        
         detailCtlr.displayGeneralData = function(data,index){
             
            var mainForm = document.createElement("form");
             mainForm.setAttribute("class","form-horizontal");
             
             var div = document.createElement("div");
             div.setAttribute("class","form-group");
             
             var label = document.createElement("label");
             label.setAttribute("class","col-sm-2 control-label");
             label.appendChild(document.createTextNode("Name:"));
             div.appendChild(label);
             
             label = document.createElement("label");
             label.setAttribute("class","general-tab control-label");
             label.appendChild(document.createTextNode(data.name));
              div.appendChild(label);
             
             mainForm.appendChild(div);
             
            var div = document.createElement("div");
             div.setAttribute("class","form-group");
             
             var label = document.createElement("label");
             label.setAttribute("class","col-sm-2 control-label");
             label.appendChild(document.createTextNode("Email:"));
             div.appendChild(label);
             
             label = document.createElement("label");
             label.setAttribute("class","general-tab control-label");
             label.appendChild(document.createTextNode(data.email));
              div.appendChild(label);
             
             mainForm.appendChild(div);
             
            var div = document.createElement("div");
             div.setAttribute("class","form-group");
             
             var label = document.createElement("label");
             label.setAttribute("class","col-sm-2 control-label");
             label.appendChild(document.createTextNode("Website:"));
             div.appendChild(label);
             
             label = document.createElement("label");
             label.setAttribute("class","general-tab control-label");
             label.appendChild(document.createTextNode(data.website));
              div.appendChild(label);
             
             mainForm.appendChild(div);
             
             var div = document.createElement("div");
             div.setAttribute("class","form-group");
             
             var label = document.createElement("label");
             label.setAttribute("class","col-sm-2 control-label");
             label.appendChild(document.createTextNode("Number of Members:"));
             div.appendChild(label);
             
             label = document.createElement("label");
             label.setAttribute("class","general-tab control-label");
             label.appendChild(document.createTextNode(data.nummembers));
              div.appendChild(label);
             
             mainForm.appendChild(div);
             
             console.log("tab data");
             console.dir(detailCtlr.tabs[index]);
             $scope.tabs[index].content = mainForm.outerHTML;
              console.dir(detailCtlr.tabs[index].content);
             
//             for (var key in data) {
//              if (data.hasOwnProperty(key)) {
//                  
//                console.log(key + " -> " + data[key]);
//              }
//            }
             
         }
        
        
                               
    });//end of detailController
    
  /*  .directive('contentItem', function ($compile) {
    var locationTemplate = '<div class="container"><div class="row"><div class="col-md-6 form-horizontal" style="border:1px solid"><select id="location" ng-change="detailCtlr.getLocation()" class="form-control" ng-model="detailCtlr.locSelected"><option ng-repeat="option in typeArr" value="{{option.typeId}}">{{option.type}}</option></select> <div class="form-group"><label class="col-sm-2 control-label">Address1:</label><label class="general-tab control-label">{{detailCtlr.locationObj.address1}}</label></div><div class="form-group"><label class="col-sm-2 control-label">Address2:</label><label class="general-tab control-label">{{detailCtlr.locationObj.address2}}</label></div></div><div class="col-md-5" id="gMap" style="border:1px solid;height:300px;width:300px"></div></div></div>';
    var peopleTemplate = '<div class="container">klfdjsfsjldjs</div>';
   // var noteTemplate = '<div class="entry-note"><h2>&nbsp;</h2><div class="entry-text"><div class="entry-title">{{content.title}}</div><div class="entry-copy">{{content.data}}</div></div></div>';
     var template = '';
    var getTemplate = function(contentType) {
       

        switch(contentType) {
            case 'Locations':
                template = locationTemplate;
                break;
            case 'People':
                template = peopleTemplate;
                break;
           
        }

        return template;
    }

    var linker = function(scope, element, attrs) {
        console.log("making templte");
        console.dir(scope.content);
        //template = getTemplate(scope.content);
        //template = getTemplate(attrs.content)(scope);
     //  element.html(getTemplate(scope.content)).show();
      // var html = getTemplate(scope.content);
      //  var e =$compile(html)(scope);
     //       element.replaceWith(e);
      //  $compile(element.contents())(scope);
        scope.template1 = getTemplate(scope.content);
        // element.replaceWith(getTemplate(scope.content));
    }

    return {
     require: 'ngModel',
       template: function(tElement, tAttrs) {
           console.log("in template");
           console.log(tAttrs.content);
         
            console.log("making templte");
      // linker();
         
            return getTemplate(tAttrs.content);
        },
        restrict: "E",
        replace:true,
     //   link: linker,
        scope: {
            ngModel:'='
        }
    };
});    
    */
    
  String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

})();