
(function(){
    
    var url = "http://people.rit.edu/dmgics/754/23/proxy.php";
    /* create angular module */    
    var app = angular.module('myapp',["ngTable"]);

    /* create module.controllers 
    Each controller handles a different view
    */
    app.controller('SearchController',function($http,NgTableParams,$filter) {

        /* initialize */ 
        var searchCtlr = this;
        searchCtlr.$inject = ["NgTableParams"];
        searchCtlr.orgTypeList=[];
        searchCtlr.orgType="All Organization Types";
        searchCtlr.cityList = [];
       
        searchCtlr.stateSelected = "NY";
        
        searchCtlr.orgTypeList.push({typeId:"default",type:"All Organization Types"});
         searchCtlr.cityList.push({city:"All Cities"});
        
        
    $http({
      method: 'GET',
      url: url,
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
              url: url,
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
      url: url,
      params :{path:"/Organizations?type="+type+"&name="+name+"&state="+state+"&town="+city+"&country="+country+"&zip="+zip},
    }).then(function successCallback(response) {
      
        var x2js = new X2JS();
        var xmlText = response.data;
        var jsonObj = x2js.xml_str2json( xmlText );
        var data = jsonObj.data.row;
               
        console.log(" searchCtlr.orgTypeList");
    console.dir(data);
               
               
               searchCtlr.tableParams = new NgTableParams(
                   {page: 1,            // show first page
                    count: 10,
                    sorting: { Name: "asc" }
                    }, {
                        total: data.length, // length of data
                        getData: function($defer, params) {
                            $defer.resolve($filter('orderBy')(data, params.orderBy()));
                            $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }});
               
               
        }, function errorCallback(response) {
             console.error("Ajax error in SearchController!");
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
        
        }
        
         searchCtlr.getCities("NY");
    });//end of SearchController
        
    app.controller('tableController',function($http) {

      
        var tableDetail=this; 
        tableDetail.data={};
       
        
 
                               
    });//end of ProductDetailsController
        
  /*  app.controller('ReviewController',function() {
        

        var rCtlr=this;
        rCtlr.userReview="";
        rCtlr.email="";

        rCtlr.addReview = function() {
          
            console.log("HELLO reviews");
        };
                                    
    });//end of ReviewController
*/

})();