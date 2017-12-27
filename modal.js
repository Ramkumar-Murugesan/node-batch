/**
 * Created: July 7, 2015
 * @author Henrikh Kantuni
 * Note: controller for Angular UI Bootstrap Modals
 */

/**
 * Modified: July 13, 2015
 * @author Rashmi
 * Note: adding new project
 */

app.controller('ModalCtrl', ['$scope', '$modalInstance', 'data', 'authFactory', '$http', 'RestURL', '$timeout', '$window', '$log','$rootScope','$modal','MenuInformation','$location',
  function ($scope, $modalInstance, data, authFactory, $http, RestURL, $timeout, $window, $log, $rootScope, $modal, MenuInformation, $location) {

    $scope.modalData = {};
    console.log("data " + angular.toJson(data));
    var mname = [];
    mname= $rootScope.actobj1;
    
    $scope.modalData.mainLanguage = "";
    $scope.modalData.projectName = "";
    $scope.modalData.projectLabel = "";
    $scope.modalData.projectCompany = "";
    $scope.modalData.projectDescription = "";
    $scope.modalData.mainLanguages = [];
    $scope.mainLanguages = data.main;
    $scope.modalData.additionalLanguages = [];
    //$scope.modalData.additionalLanguages = data.additional;
    $scope.modalData.selectedadditionallanguages = [];
    
    //$('#mig_submit').prop("disabled", true);

    $scope.additionalLanguageDropdown = function (selectedPrimaryLanguage) {
      $scope.getAllSecondaryLanguages(selectedPrimaryLanguage);
    };

    $scope.getAllSecondaryLanguages = function (selectedPrimaryLanguage) {
      $http.get(RestURL.baseURL + 'language/get_all_languages/')
        .success(function (data) {
          $scope.tempaddlanguages = [];
          for (var i = 0; data[i]; ++i) {
            var addlng = {
              id: data[i]['id'],
              label: data[i]['ref_name']
            };
            if (selectedPrimaryLanguage != data[i]['ref_name']) {
              $scope.tempaddlanguages.push(addlng);
            }
          }
          //languageFactory.setData(data);
          $scope.modalData.additionalLanguages = $scope.tempaddlanguages;
          /*if ($routeParams['action'] == 'update') {
           fillInfo($scope);
           }*/

        }).error(function (data) {
        $log.log("lang data" + data);
      });
    };

    $scope.broswerLanguageDetection = function () {
      var lang = $window.navigator.language || $window.navigator.userLanguage;
      if (lang === 'en-US' || lang === 'en') {
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "English") {
            $scope.modalData.mainLanguage = $scope.mainLanguages[i];
          }
        }
      }
      if (lang === 'de-de' || lang === 'de') {
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "German") {
            $scope.modalData.mainLanguage = $scope.mainLanguages[i];
          }
        }
      }
      if (lang === 'fr' || lang === 'fr-fr') {
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "French") {
            $scope.modalData.mainLanguage = $scope.mainLanguages[i];
          }
        }
      }
      if (lang === 'hy') {
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "Armenian") {
            $scope.modalData.mainLanguage = $scope.mainLanguages[i];
          }
        }
      }
      if (lang === 'it-it' || lang === 'it') {
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "Italian") {
            $scope.modalData.mainLanguage = $scope.mainLanguages[i];
          }
        }
      }
      if (lang === 'ko') {
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "Korean") {
            $scope.modalData.mainLanguage = $scope.mainLanguages[i];
          }
        }
      }
      if (lang === 'ja') {
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "Japanese") {
            $scope.modalData.mainLanguage = $scope.mainLanguages[i];
          }
        }
      }
      if (lang === 'pt-pt' || lang === 'pt') {
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "Portuguese") {
            $scope.modalData.mainLanguage = $scope.mainLanguages[i];
          }
        }
      }
      if (lang === 'ru') {
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "Russian") {
            $scope.modalData.mainLanguage = $scope.mainLanguages[i];
          }
        }
      }
      if (lang === 'es-es' || lang === 'es') {
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "Spanish") {
            $scope.modalData.mainLanguage = $scope.mainLanguages[i];
          }
        }
      }
      if (lang === 'ta-ta' || lang === 'ta') {
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "Tamil") {
            $scope.modalData.mainLanguage = $scope.mainLanguages[i];
          }
        }
      }
      if (lang === 'zh-cn' || lang === 'zh') {
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "Chinese") {
            $scope.modalData.mainLanguage = $scope.mainLanguages[i];
          }
        }
      }
      $scope.additionalLanguageDropdown($scope.modalData.mainLanguage.name);
    };
    $scope.broswerLanguageDetection();

    $scope.modalData.multiselectsettings = {
      scrollableHeight: '200px',
      scrollable: true
    };

    //send when save message modal gets open
    $scope.modalData.action = data.action;
    $scope.modalData.message = data;
    $scope.modalData.jsonForProject = data.jsonForProject;
    $scope.modalData.dependency = data.dependency;
    console.log("begin modaldata dependency in data from node",$scope.modalData.dependency);
    
    console.log("begin jsonforproject in data from node",$scope.modalData.jsonForProject);
    $scope.modalData.projectId = data.projectId;

    //send when delete modal gets open
    $scope.modalData.id = data;

    $scope.ok = function (action) {
      $scope.modalData.action = action;
      $modalInstance.close($scope.modalData);
    };

    $scope.close = function () {
      $scope.canceled = true;
      $modalInstance.dismiss('cancel');
    };

    $scope.deleteHandler = function () {
      $modalInstance.close($scope.modalData.id);
    };

    $scope.finish = function () {
      $modalInstance.close($scope.modalData.id);
    };

    $scope.dxl_finish = function () {
    	console.log("@@@@@@@iiiddd@@@",MenuInformation.projectId);
        $http.get(RestURL.baseURL + 'noun/get_all_nouns_by_project_id/?project_id=' + MenuInformation.projectId
  	  ).success(function (response) {
  	//  $scope.nouns = response;
  		  $modalInstance.close($scope.modalData.id);
  		 $location.url("/en-US/projects");
  	  })
     .error(function (response) {
  	   console.error("error in attribure")
  	  $modalInstance.close($scope.modalData.id);
     });
      //  $modalInstance.close($scope.modalData.id);
      };
    // $scope.closePleaseWaitModal = function () {
    //   $timeout(function () {
    //     $modalInstance.close($scope.modalData.id);
    //   }, 3000);
    // };
      
      $scope.showprofile = function(){
    	  console.log("relocation to profile");
    	  $location.url('/en-US/user/profile/');
    	  $modalInstance.close($scope.modalData.id);
      }
    $scope.openModaldialog = function(){
  		$modalInstance.close('dismiss');
  	}
  	

    $scope.show_selects_noun_attach = false;
    $scope.toggleFinishBtn = true;
    $scope.toggleMigrateBtn = true;
    $scope.modalData.generatemessage = "";
    $scope.generate_status = "";
    $scope.modalData.DesktopApp = false;
    $scope.modalData.gitCheck = false;
    $scope.modalData.AndroidApp = false;
    $scope.modalData.AndroidAppfail = false;
    $scope.modalData.IphoneIpa = false;
    $scope.modalData.IphoneIpafail = false;
    $scope.modalData.selected_view = {};
    $scope.showFinishBtn = false;
    $scope.showErrorMsg = false;
    $scope.canceled = false;
    $scope.calculating_billing = false;
    $scope.mytransactionstatus = authFactory.get_change_transaction_satatus();
    $scope.tarnsactionId = authFactory.get_transactionId();
    
    var instancepop;
    $scope.openpopModal = function(action, type, size, msg) {
      var modalDataObj = {
        action: action,
        type: type,
        createHandler: $scope.createHandler,
        deleteHandler: $scope.deleteHandler,
        message: msg,
        id: $scope.selectedProjectID
      };
      console.log("modalDataObj=======" + JSON.stringify(modalDataObj));
      instancepop = $modal.open({
        templateUrl: "app/views/en-US/templates/modals/project/modalpop.html",
        controller: "ProjectModalCtrl",
        size: size,
        backdrop: "static",
        resolve: {
          modalDataObj: function() {
            return modalDataObj;
          }
        }
      });
      // $('modal').click(false);
      console.log("instancepop=======" + JSON.stringify(instancepop));
    };
    
    $scope.modalClose = function() {
        $(".projectpop").modal("hide");
        instancepop.close();
      };
      
    $scope.requestDownloadDockerContainers = function () {
    	var currentUser = authFactory.getUser();
    	$('#btn-dockerDC').prop('disabled', true);
    	$http.post(RestURL.baseURL + 'docker/downloadrequests/start_generation?user_id=' + currentUser.userid,{headers: {'Accept': 'application/json'}})
    	.success(function (data) {
    		console.log(data);
    	}).error(function (data) {
    		$('#btn-dockerDC').prop('disabled', false);
    		console.log("generate error" + data);
    	});
    }
    
    $scope.migrate_dxl = function () {
    	document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
    	var config = {headers: {'Accept': 'application/json'}};
    	$('#status').removeClass( "alert-success" ).addClass( "alert-info" );
    	$scope.modalData.uploadingdxl_text_msg_value = "Migrating...";
    	$scope.modalData.spinner = true;
    	
    	var custom_json = {};
    	custom_json.job = $scope.modalData.migrate_job;
    	custom_json.json = $scope.modalData.json_gdc_data;
    	$scope.toggleMigrateBtn = true;
    	
    	$scope.openpopModal("alert", "wait", "sm", "Migrating data to couchbase ..! ");
    	
    	$http.post(RestURL.baseURL + 'lotusAddDXL/migrate',custom_json, config)
        .success(function (data) {
        	(function tick() {
        		  
        		var timer = $timeout(tick, 2000);
        		$http.get(RestURL.baseURL + 'lotusAddDXL/get_migration_status?job_id=' + $scope.modalData.migrate_job.id, config)
                .success(function (data) {
                	if($scope.canceled){
                		$timeout.cancel(timer);
                	}
                	if(data.status.match('migration_error')){
                		$scope.modalClose();
                		$scope.showErrorMsg = true;
                		$scope.modalData.error_message = data.stacktrace;
                		$timeout.cancel(timer);
                		$scope.showFinishBtn = true;
                	}
                	if(data.claimed.match('Y') && data.status.match('migration_done')){
                		$scope.modalClose();
                		$timeout.cancel(timer);
                		$scope.modalData.spinner = false;
                		$scope.modalData.uploadingdxl_text_msg_value = "Migration done!";
                		$('#status').removeClass( "alert-info" ).addClass( "alert-success" );
                		$scope.showFinishBtn = true;
                	}
                });
        	})();
        });
    }
    
    $scope.calculate_billing = function () {
    	if(!$scope.calculating_billing){
	    	var config = {headers: {'Accept': 'application/json'}};
	    	var json_data = [
	    		{
	    			"name": "LotusNotes_Screen",
	    			"quantity": $scope.modalData.views_to_select.length
	    		},
	    		{
	    			"name": "LotusNotes_Noun",
	    			"quantity": $scope.modalData.selected_nouns.length
	    		},
	    		{
	    			"name": "LotusNotes_Document",
	    			"quantity": $scope.modalData.documents_to_migrate
	    		}
	    	];
	    	
	    	console.log('calculatin billing...');
	    	$scope.modalData.spinner = true;
	    	$scope.calculating_billing = true;
	    	$http.post(RestURL.billingServiceURL + 'payment/ln/calculate', json_data, config)
	        .success(function (data) {
	        	$scope.modalData.spinner = false;
	        	$scope.modalData.migration_total_price = data.total_price;
	        	$scope.calculating_billing = false;
	        });
    	}
    }
    
    $scope.upload_dxl_file = function () {
    	var config = {headers: {'Accept': 'application/json'}};
    	console.log('uploading...');
    	$scope.modalData.uploadingdxl_text_header_value = "Lotus Notes dxl migration";
    	$scope.modalData.uploadingdxl_text_msg_value = "Uploading...";
    	$scope.modalData.spinner = true;
    	var formData=new FormData();
    	formData.append("file",$scope.modalData.id.file);
    	formData.append("projectId",$scope.modalData.id.project_id);
    	formData.append("job_type",'dxl_import');
    	
    	 $http({
		        url:
		         RestURL.baseURL +"project/update_project_dxl/?project_id=" + $scope.modalData.id.project_id,   
		        method: "PUT",
		        headers: {
		          Accept: "application/json"
		        }
		      })
    	$http({
    		url: RestURL.baseURL + 'lotusAddDXL/upload/',
    		data: formData,
            method: 'POST',
            headers: {
            	"content-type" :undefined
            },
    	 transformRequest: function(data, headersGetterFunction) {
		        return data; 
		    }
          })
            .success(function (response) {
            	$scope.modalData.uploadingdxl_text_msg_value = "Upload finished!";
            	console.log('response', response);
            	(function tick() {
            		var timer = $timeout(tick, 2000);
            		$http.get(RestURL.baseURL + 'lotusAddDXL/get_migration_status?job_id=' + response.id, config)
                    .success(function (data) {
                    	if($scope.canceled){
                    		$timeout.cancel(timer);
                    	}
                    	if(data.status.match('migration_error')){
                    		$scope.showErrorMsg = true;
                    		$scope.modalData.error_message = data.stacktrace;
                    		$timeout.cancel(timer);
                    		$scope.showFinishBtn = true;
                    	}
                    	if(data.claimed.match('Y') && data.status.match('json_created')){
                    		$scope.modalData.migrate_job = data;
                    		$timeout.cancel(timer);
                    		$http.get(data.gdc_file_url, config)
                            .success(function (json_gdc_data) {
                            	$scope.toggleMigrateBtn = false;
                            	$scope.modalData.spinner = false;
                            	$('#status').removeClass( "alert-info" ).addClass( "alert-success" );
                            	$scope.modalData.uploadingdxl_text_msg_value = "Obtained metadata from dxl file";
                            	$scope.modalData.show_dxl_meta_data = true;
                            	$scope.modalData.json_gdc_data = json_gdc_data;
                            	$scope.modalData.number_of_docs = $scope.modalData.json_gdc_data.documents.length;
                            	$scope.modalData.number_of_nouns = $scope.modalData.json_gdc_data.nouns.length;
                            	$scope.modalData.number_of_views = $scope.modalData.json_gdc_data.other_screens.length + $scope.modalData.json_gdc_data.screens.length;
                            	$scope.modalData.default_views = $scope.modalData.json_gdc_data.screens;
                            	$scope.modalData.all_views = $scope.modalData.json_gdc_data.other_screens;
                            	$scope.modalData.documents_to_migrate = 10;
                        		$scope.modalData.views_to_select = $scope.modalData.json_gdc_data.screens;
                        		$scope.modalData.nouns = $scope.modalData.json_gdc_data.nouns;
                            });
                    	}
                    });
            	})();
            }).error(function (response){
            	$scope.modalData.spinner = false;
            	$('#status').removeClass( "alert-info" ).addClass( "alert-danger" );
            	$scope.uploadingdxl_text_msg_value = "There was an error, try again...";
            });
    }
    
    $scope.change_selected_view_attach= function (){
    	for(x in $scope.modalData.json_gdc_data.screens){
    		if($scope.modalData.json_gdc_data.screens[x].name === $scope.modalData.selected_view.name){
    			$scope.modalData.json_gdc_data.screens[x].attached_to_noun = $scope.modalData.selected_view.attached_to_noun;
    		}
    	}
    	for(x in $scope.modalData.json_gdc_data.other_screens){
    		if($scope.modalData.json_gdc_data.other_screens[x].name === $scope.modalData.selected_view.name){
    			$scope.modalData.json_gdc_data.other_screens[x].attached_to_noun = $scope.modalData.selected_view.attached_to_noun;
    		}
    	}
    	$scope.calculate_billing();
    }
    
    $scope.change_to_be_import = function (){
    	var other_views_to_generate = [];
    	for(x in $scope.modalData.all_views){
    		if($scope.modalData.all_views[x].to_be_imported){
    			other_views_to_generate.push($scope.modalData.all_views[x]);
    		}
    	}
    	$scope.modalData.views_to_select = $scope.modalData.json_gdc_data.screens;
    	$scope.modalData.views_to_select = $scope.modalData.views_to_select.concat(other_views_to_generate);
    	
    	$scope.calculate_billing();
    }
    
    $scope.change_to_be_import_nouns = function (){
    	var nouns_to_generate = [];
    	$('#mig_submit').prop("disabled", true);
    	for(x in $scope.modalData.nouns){
    		if($scope.modalData.nouns[x].to_be_imported){
    			$('#mig_submit').prop("disabled", false);
    			nouns_to_generate.push($scope.modalData.nouns[x]);
    		}
    	}
    	$scope.modalData.selected_nouns = nouns_to_generate;
    	$scope.calculate_billing();
    }
    
    $scope.updategeneratemodal = function () {
    	console.log("------------trabs--------- > ",$scope.mytransactionstatus);
    	console.log("--------$scope.tarnsactionId->>>>>>>>>>>>",$scope.tarnsactionId);
      var config = {headers: {'Accept': 'application/json'}};
      var currentUser = authFactory.getUser();
      $scope.modalData.generatemessage_title = "Generating Code , Please Wait........";
      var data_to_send = JSON.stringify({"user_id": currentUser.userid, "project_id": $scope.modalData.id, "user_name": currentUser.username});
   // if($scope.mytransactionstatus ==true  && $scope.tarnsactionId!=0){
    	
    
      $http.post(RestURL.baseURL + 'job/start_generation', data_to_send, {headers: {'Accept': 'application/json'}})
        .success(function (the_job) {
          console.log("DATA " + JSON.stringify(the_job));
        $scope.modalData.generatemessage = "Generation Requested";
      //  alert($scope.modalData.generatemessage)
        (function tick() {
          var timer = $timeout(tick, 2000);
          $http.get(RestURL.baseURL + 'job/get_generation_status?parent_job_id=' + the_job.id, config)
            .success(function (data) {
            	console.log("DATA " + JSON.stringify(data));
              var gen_status = data.status;
              if(gen_status){
	              console.log("status: " + gen_status);
	              if (gen_status.match("gen_started")) {
	                $scope.modalData.generatemessage = "Generation started...";
	                $scope.modalData.spinner = true;
	              }
	              if (gen_status.match("gen_building")) {
	                $scope.modalData.generatemessage = "Building...";
	                $scope.modalData.spinner = true;
	              }
	              if (gen_status.match("gen_mobile")) {
	                $scope.modalData.generatemessage = "Building mobile apps...";
	                $scope.modalData.spinner = true;
	              }
	              if (gen_status.match("gen_github")) {
		                $scope.modalData.generatemessage = "Pushing code to GitHub...";
		                $scope.modalData.spinner = true;
		              }
	              if(gen_status.match("IPA_started")){
            		  $scope.modalData.generatemessage = "Building IPA...";
		              $scope.modalData.spinner = true; 
		              
            	  }
	              
	              if (gen_status.match("gen_ipa_finished")) {
	            	  
	            	  $scope.modalData.generationDone = true;
	            	  $scope.modalData.spinner =false;
	                $scope.toggleFinishBtn = false;
	                $scope.modalData.generatemessage_title = "Generation and deploy done!";
	                $scope.modalData.generatemessage = "Generation finished...";
	                angular.forEach(mname, function(value, key){
	                    console.log(key + ': ' + value);
	                $log.log("module name :"+value);
	                if(value != "GeppettoLogin Activity"){
	                	$log.log("GeppettoLogin Activity is absent")
	                }
	                else{
	                	if( $scope.modalData.generatemessage = "Generation finished..."){
	                		$scope.logincreds = true;
	                		$scope.modalData.spinner = false;
	                	}
	                }
	                });
	                $('#status').removeClass( "alert-info" ).addClass( "alert-success" );
	                $timeout.cancel(timer);
	                $scope.after_generation(the_job);
	              }
	              
                  if (gen_status.match("gen_ipa_failed")) {  
	            	  $scope.modalData.generationDone = true;
	            	  $scope.modalData.spinner =false;
	                $scope.toggleFinishBtn = false;
	                $scope.modalData.generatemessage_title = "Generation and deploy done!";
	                $scope.modalData.generatemessage = "Generation finished...";
	                angular.forEach(mname, function(value, key){
	                    console.log(key + ': ' + value);
	                $log.log("module name :"+value);
	                if(value != "GeppettoLogin Activity"){
	                	$log.log("GeppettoLogin Activity is absent")
	                }
	                else{
	                	if( $scope.modalData.generatemessage = "Generation finished..."){
	                		$scope.logincreds = true;
	                		$scope.modalData.spinner = false;
	                	}
	                }
	                });
	                $('#status').removeClass( "alert-info" ).addClass( "alert-success" );
	                $timeout.cancel(timer);
	                $scope.after_generation(the_job);
	              }
	              
	              if (gen_status.match("gen_error")) {
	                $scope.toggleFinishBtn = false;
	                $scope.modalData.generatemessage_title = "Something didn't work........";
	                $scope.modalData.generatemessage = "An Error has occurred while generating the application, please try again.. If the problem persist, please contact the administrator..";
	                $('#status').removeClass( "alert-info" ).addClass( "alert-danger" );
	                $scope.modalData.spinner = false;
	                $timeout.cancel(timer);
	                $http.get(RestURL.baseURL + 'gpconfigs/get_by_name?name=show_errors_in_web_app', config).success(function(response) {
	                    console.log('errors handling response' + JSON.stringify(response));
	                    if(response.value == 'true'){
	                    	$http.get(RestURL.baseURL + 'job/get_job_errors/' + the_job.id, config).success(function(errors) {
	                            console.log('errors ' + JSON.stringify(errors));
	                            $scope.generation_errors = errors;
	                            $scope.modalData.showerrors = true;
	                        });
	                    }
	                });
	                $scope.after_generation(the_job);
	              }
	              if(gen_status.match("gen_finished")){
	            	  
	            	  $scope.modalData.generationDone = true;
	            	  $scope.modalData.spinner =false;
	                $scope.toggleFinishBtn = false;
	                $scope.modalData.generatemessage_title = "Generation and deploy done!";
	                $scope.modalData.generatemessage = "Generation finished...";
	                angular.forEach(mname, function(value, key){
	                    console.log(key + ': ' + value);
	                $log.log("module name :"+value);
	                if(value != "GeppettoLogin Activity"){
	                	$log.log("GeppettoLogin Activity is absent")
	                }
	                else{
	                	if( $scope.modalData.generatemessage = "Generation finished..."){
	                		$scope.logincreds = true;
	                		$scope.modalData.spinner = false;
	                	}
	                }
	                });
	                $('#status').removeClass( "alert-info" ).addClass( "alert-success" );
	                $timeout.cancel(timer);
	                $scope.after_generation(the_job);
	              }
              }
            });
        })();

        }).error(function (data) {
        	
        console.log("generate error" + data);
        $scope.toggleFinishBtn = false;
        $scope.modalData.spinner = false;
        $scope.modalData.generatemessage = "An Error has occurred while generating the application, please try again.. If the problem persist, please contact the administrator..";
      });
   /* }else{
    	if($scope.tarnsactionId!=0 && $scope.mytransactionstatus ==false){
    		 console.log("generate error" + data);
    	        $scope.toggleFinishBtn = false;
    	        $scope.modalData.spinner = false;
    		 $scope.modalData.generatemessage = "Generation Terminated Bcoz Transaction Falied..";
    	}
    }*/
    };
    
    $scope.after_generation = function (the_job) {
    	var config = {headers: {'Accept': 'application/json'}};
   /* 	$http.get(RestURL.baseURL + 'job/get_job_by_status?parent_job_id=' + the_job.id + '&gen_status=gen_desktop_app', config).success(function(data) {
            console.log('desktop data ' + data);
            var app_desktop_status = data.status; 
            if(app_desktop_status.match("gen_desktop_app")){
            	$scope.modalData.DesktopApp = true;
            	$scope.modalData.AppDesktopLink = data.status_message;
            }
        });*/
    	
    	  $http.get(RestURL.baseURL + 'job/get_job_by_status?parent_job_id=' + the_job.id + '&gen_status=gen_desktop_app_awake', config).success(function(data) {
              var app_desktop_status = data.status; 
              if(app_desktop_status.match("gen_desktop_app_awake")){
            	$scope.modalData.desktopContainerComeUp = true;
              	$scope.modalData.DesktopApp  = false ;
              	$scope.modalData.desktopContainerComeUpMsg = data.status_message;
              }
          });
    	
    	  
    	  $http.get(RestURL.baseURL + 'job/get_job_by_status?parent_job_id=' + the_job.id + '&gen_status=gen_desktop_app_fail', config).success(function(data) {
              var app_desktop_status = data.status; 
              if(app_desktop_status.match("gen_desktop_app_fail")){
            	  $scope.modalData.container_fail = true;
              	$scope.modalData.container_fail_message = data.status_message;
              }
          });
    	  //apk genearation
    	  $http.get(RestURL.baseURL + 'job/get_job_by_status?parent_job_id=' + the_job.id + '&gen_status=gen_apk_finished', config).success(function(data) {
              var android_apk_status = data.status; 
              if(android_apk_status.match("gen_apk_finished")){
            	$scope.modalData.androidApk = true;
              	$scope.modalData.AndroidApp  = false ;
              	$scope.modalData.android_finished_message = "Android Apk generated email notification has been sent!";
              }
          });
    	  
    	  $http.get(RestURL.baseURL + 'job/get_job_by_status?parent_job_id=' + the_job.id + '&gen_status=gen_apk_failed', config).success(function(data) {
              var android_apk_status = data.status; 
              if(android_apk_status.match("gen_apk_failed")){
            	$scope.modalData.androidApkfail = true;
              	$scope.modalData.AndroidAppfail  = false ;
              	$scope.modalData.android_failed_message = "Android Apk generation failed!";
              }
          });
    	  
    	//ipa genearation
    	  $http.get(RestURL.baseURL + 'job/get_job_by_status?parent_job_id=' + the_job.id + '&gen_status=gen_ipa_finished', config).success(function(data) {
              var iphone_ipa_status = data.status; 
              if(iphone_ipa_status.match("gen_ipa_finished")){
            	$scope.modalData.iphoneIpa = true;
              	$scope.modalData.IphoneIpa  = false ;
              	$scope.modalData.ipa_finished_message = "IPA generated email notification has been sent!";
              }
          });
    	  
    	  $http.get(RestURL.baseURL + 'job/get_job_by_status?parent_job_id=' + the_job.id + '&gen_status=gen_ipa_failed', config).success(function(data) {
              var iphone_ipa_status = data.status; 
              if(iphone_ipa_status.match("gen_ipa_failed")){
            	$scope.modalData.iphoneIpafail = true;
              	$scope.modalData.IphoneIpafail  = false ;
              	$scope.modalData.ipa_failed_message = "IPA generation failed!";
              }
          });
    	  
        $http.get(RestURL.baseURL + 'job/get_job_by_status?parent_job_id=' + the_job.id + '&gen_status=gen_github_finished', config).success(function(data) {
            console.log('desktop data ' + data);
            var app_desktop_status = data.status; 
            if(app_desktop_status.match("gen_github_finished")){
            	$scope.modalData.gitCheck = true;
            	$scope.modalData.gitUrl = data.status_message;
            }
        });
        
        $http.get(RestURL.baseURL + 'job/get_job_by_status?parent_job_id=' + the_job.id + '&gen_status=gen_ios_app_deploying', config).success(function(data) {
            console.log('gen_ionic_finished data ' + data);
            var gen_ionic_finished = data.status; 
            if(gen_ionic_finished.match("gen_ios_app_deploying")){
            	$scope.modalData.ionic_finished = true;
            	$scope.modalData.ionic_finished_message = "You can generate IOS mobile app after the successful " +
            			" \n installation of GeppettoConfigApp in your iPhone";//data.status_message;
            }
        });
 	  
      
    }

    $scope.projectModal = function () {
      var urlPart = "";
      var action = $scope.modalData.action;
      //var postSuccessMsg ="";
      var dataToPost;
      //var location_url = "";
      var proj_id = $scope.modalData.projectId;
      //$scope.modalData.message = "Please Wait....";
      if (action == "create") {
        urlPart = 'project/create_project/';
        $scope.modalData.postSuccessMsg = "Project Successfully created!";
        dataToPost = $scope.modalData.jsonForProject;
        //location_url = "/en-US/projects";

      }
      if (action == "update") {
        urlPart = 'project/update_project/';
        $scope.modalData.postSuccessMsg = "Project Successfully updated!";
        dataToPost = $scope.modalData.jsonForProject;
        //location_url = "/en-US/projects";
      }
      if (action == "add_module") {
    	  urlPart = 'module/add_module/';
        $scope.modalData.postSuccessMsg = "Module Successfully added!";
        var module = $scope.modalData.jsonForProject;
        dataToPost = {
          name: module.name,
          label: module.label,
          description: module.description,
          projectid: $scope.modalData.projectId,
          base_location: module.location_path,
          predefined_activity_id: module.id
        };
        //location_url = "/en-US/project/update";
      }
     
      $timeout(function () {
        $http({
          method: 'POST',
          url: RestURL.baseURL + urlPart,
          data: dataToPost,
          headers: {
            "content-type": "application/json",
            "Accept": "application/json"
          }
        }).success(function (data) {
          $modalInstance.close($scope.modalData);
          //$scope.modalData.message=postSuccessMsg;
          //$scope.toggleFinishBtn = false;
          //$location.url(location_url);
        }).error(function (data) {
          $log.log(data);
        });
      }, 3000);
      
      // alert("Action" + $scope.modalData.action);
      // if ($scope.modalData.action == "update") {
      //   $http.post(RestURL.baseURL + 'project/update_project/', jsonForProject)
      //     .success(function (data) {
      //       var msg = 'Project Successfully ' + $routeParams.action + 'd !';
      //       $scope.openSaveDialog('sm', msg);
      //       $scope.modalData.message = 'Project Successfully created!';
      //       $scope.toggleFinishBtn = false;
      //     }).error(function (data) {
      //     $log.log(data);
      //   });
      // }
      // if ($scope.modalData.action == "create") {
      //   $scope.modalData.message = "Please Wait....Project is under creation!";
      //   $timeout(function () {
      //     $http.post(RestURL.baseURL + 'project/create_project/', $scope.modalData.jsonForProject)
      //       .success(function (data) {
      //         $scope.modalData.message = 'Project Successfully created!';
      //         $scope.toggleFinishBtn = false;
      //         //$scope.openSaveDialog('sm',msg);
      //         //$scope.deleteCookies();
      //         $location.url("/en-US/projects");
      //       }).error(function (data) {
      //       $log.log("create project" + data);
      //     });
      //   }, 3000);
      // }
    }

  }]);