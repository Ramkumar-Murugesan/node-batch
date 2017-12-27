/**
 * Modified:
 * @author Pravin
 * Note: integrating activity and noun
 */

/**
 * Modified: July 13, 2015
 * @author Rashmi
 * Note: integrating new screen design's for login and project , integrating new add project and delete project modal
 */

/**
 * Modified: July 30, 2015
 * @author Rashmi
 * Note: edit project not saving values bug fixed
 */

/**
 * Modified: Nov 2017
 * @author khalisaran
 * Note: Braintreepayment
 */

/**
 * Modified: May 31, 2016
 * @author Kumaresan Perumal
 * Note: We had a problem with noun creation that is createNounNow() method. I added some code in createNounNow method to 
 * give response for client to know the noun exist or not and i added a modal variable name 'instance'
 */

app.controller("ProjectCtrl", [
  "$scope",
  "$rootScope",
  "$routeParams",
  "$log",
  "$location",
  "$http",
  "$timeout",
  "$cookies",
  "$cookieStore",
  "$window",
  "ProjectData",
  "languageFactory",
  "RestURL",
  "ActivityInformation",
  "authFactory",
  "$modal",
  "MenuInformation",
  "UserDetailService",
  "Idle",
  function(
    $scope,
    $rootScope,
    $routeParams,
    $log,
    $location,
    $http,
    $timeout,
    $cookies,
    $cookieStore,
    $window,
    ProjectData,
    languageFactory,
    RestURL,
    ActivityInfo,
    authFactory,
    $modal,
    MenuInfo,
    UserDetailService,
    Idle
  ) {
    console.log("inside project controller");
    window.ProjectControllerScope = $scope;

    var userid = $cookieStore.get("current.user")["userid"];
    

    $scope.disabledButton = {};
    $scope.free = 0;
    $scope.init = function() {
    	 
      $scope.gpfree = true;
      $scope.count = 0;
      $http({
        url: RestURL.baseURL + "profile/getProfileby_userid/?userid=" + userid,
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      }).success(function(data) {
        console.log("profile--------------------->", data);
        $scope.profile = data;
      });
      $http({
          url: RestURL.baseURL + "gpconfigs/get_by_name/?name=FREE_subscription" ,
          method: "GET",
          headers: {
            Accept: "application/json"
          }
        }).success(function(data) {
          console.log("free count--------------------->", data.value);
          $scope.free = data.value;
        });
      console.error("calling user for subscritpion");
      $http({
        url:
          RestURL.baseURL + "updateuser/getfree_subscription/?userid=" + userid,
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      }).success(function(data) {
        $scope.freesubscription = data;
//        console.log("the subscribtion ----->", $scope.freesubscription);
        $scope.gpfree = $scope.freesubscription.freesubscription;
        $scope.developer = $scope.freesubscription.developer;
      });

      $http({
        url: RestURL.baseURL + "project/get_project_count/",
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      }).success(function(data) {
    	  $("#loader").modal({
              dataTarget: "#loader",
              backdrop: "static",
              keyboard: false
            });
            $("#loader").modal("show");
        $scope.project_count = data;
        $scope.count = $scope.project_count.count;
        if ($scope.count >= $scope.free) {
          $http({
            url:
              RestURL.baseURL +
              "updateuser/update_subscription/?userid=" +
              userid,
            method: "POST",
            headers: {
              Accept: "application/json"
            }
          }).success(function(data) {
           // console.log("the update subscribtion ----->", data);
            if ($scope.gpfree == false && $scope.developer == false) {
              console.warn("calling payment");
              $http
                .get(
                  RestURL.billingServiceURL +
                    "payment/calculate/?user_id=" +
                    userid +
                    "&project_id=" +
                    ProjectData.project_data.id
                )
                .success(function(data) {
                  $scope.paymentdata = data;
                  $scope.pending = $scope.paymentdata.pending;
                  var shoppingcart = $scope.paymentdata.shoppingcart;
                  var sumprice = 0;
                  for (var i = 0; i < shoppingcart.length; i++) {
                    var price = shoppingcart[i].totalprice;
                    $scope.totalprice =
                      parseFloat(price * 1) + parseFloat(sumprice * 1);
                    sumprice = $scope.totalprice;
                  }
                })
                .error(function(data) {
                  $log.log("payment data" + data);
                });
            }
          });
        }
        setTimeout(function() {
        $("#loader").modal("hide");
        }, 3000);
      });

      $scope.displayToSave = true;
      Idle.watch();	
    
    };

    $scope.init();

    $rootScope.actobj1 = [];
    var link = "";
    $scope.getProjectsForUser = function() {
      $http
        .get(RestURL.baseURL + "project/get_projects_for_user/")
        .success(function(data) {
          $scope.json = data;
          $(".projects > ul").removeClass("hidden");
        })
        .error(function(data) {
          $log.log("projects data" + data);
        });
    };

    $(".projects > ul").addClass("hidden");

    // console.log('before', $scope.json);
    $scope.json = ProjectData.project_data;
    // console.log('after', $scope.json);

    var currentUser = authFactory.getUser();
    //if current user is not set then set again

    $scope.selectedProjectID = selectedProjectID;
    $scope.selectedProjectInfo = selectedProjectInfo;

    $scope.modalData = {};
    /**
	 * select project for editing
	 */
    $scope.selectProject = function(id) {
      /*    if (self.selectedProjectID) {
	   $('#' + self.selectedProjectID).removeClass("landing-project-selected");
	   }
	   $('#' + id).addClass("landing-project-selected");*/
      self.selectedProjectID = id;
      //displayResponseForUser('ProjectCtrl', $scope.getProjectNameByID(self.selectedProjectID));

      for (var i = 0; i < $scope.json.length; ++i) {
        if ($scope.json[i]["id"] == id) {
          ProjectData.setData($scope.json[i]);
        }
      }
      $scope.json = ProjectData.project_data;

      // Setting values for menu builder
      MenuInfo.setProjectId($scope.json["id"]);
      MenuInfo.setProjectName($scope.json["name"]);
      MenuInfo.setPrimaryLanguage($scope.json["default_human_language"]);

      $location.url("/en-US/project/update/");
    };

    //tabs activate
    $rootScope.tabprojectactive = true;
    $scope.tabactivityactive = false;
    $scope.tabnounactive = false;
    $scope.tabmenuactive = false;

    $scope.currentTab = function() {
      $rootScope.tabprojectactive = false;
    };

    /**
	 * procedure to delete a project
	 */
    $scope.deleteProject = function(id) {
      for (var i = 0; i < $scope.json.length; ++i) {
        if ($scope.json[i]["id"] == id) {
          $scope.json = $scope.json[i];
        }
      }

      var jsonForProject = {
        id: id,
        name: $scope.json["name"],
        description: $scope.json["description"],
        label: $scope.json["label"],
        default_module_id: 0,
        default_module_label: "",
        notes: $scope.json["notes"],
        createdate: "",
        createdby: "",
        lastmodifieddate: "",
        lastmodifiedby: "",
        client_os_types: $scope.json["client_os_types"],
        client_device_types: $scope.json["client_device_types"],
        client_dev_language: $scope.json["client_dev_languages"],
        client_dev_framework: $scope.json["client_dev_frameworks"],
        client_widget_frameworks: $scope.json["client_widget_frameworks"],
        default_human_language:
          $scope.project.mainLanguage && $scope.project.mainLanguage["id"]
            ? $scope.project.mainLanguage["id"]
            : 2,
        desktop_css_framework:
          $scope.desktopCssFramework && $scope.desktopCssFramework["id"]
            ? $scope.desktopCssFramework["id"]
            : $scope.defaultTechProperties["desktop_css_framework"],
        mobile_css_framework:
          $scope.mobileCssFramework && $scope.mobileCssFramework["id"]
            ? $scope.mobileCssFramework["id"]
            : $scope.defaultTechProperties["mobile_css_framework"],
        app_ui_template: [],
        client_code_pattern:
          $scope.clientCodePattern && $scope.clientCodePattern["id"]
            ? $scope.clientCodePattern["id"]
            : $scope.defaultTechProperties["client_code_pattern"],
        server_code_pattern:
          $scope.serverCodePattern && $scope.serverCodePattern["id"]
            ? $scope.serverCodePattern["id"]
            : $scope.defaultTechProperties["server_code_pattern"],
        server_dev_lang:
          $scope.serverDevelopmentLanguage &&
          $scope.serverDevelopmentLanguage["id"]
            ? $scope.serverDevelopmentLanguage["id"]
            : $scope.defaultTechProperties["server_dev_lang"],
        server_dev_framework:
          $scope.serverDevelopmentFramework &&
          $scope.serverDevelopmentFramework["id"]
            ? $scope.serverDevelopmentFramework["id"]
            : $scope.defaultTechProperties["server_dev_framework"],
        server_run_time:
          $scope.serverRunTime && $scope.serverRunTime["id"]
            ? $scope.serverRunTime["id"]
            : $scope.defaultTechProperties["server_run_time"],
        server_os:
          $scope.serverOs && $scope.serverOs["id"]
            ? $scope.serverOs["id"]
            : $scope.defaultTechProperties["server_os"],
        server_dbms:
          $scope.serverDbms && $scope.serverDbms["id"]
            ? $scope.serverDbms["id"]
            : $scope.defaultTechProperties["server_dbms"],
        server_deployment_environment:
          $scope.serverDepEnviroment && $scope.serverDepEnviroment["id"]
            ? $scope.serverDepEnviroment["id"]
            : $scope.defaultTechProperties["server_deployment_environment"],

        global_extensions: [],
        ui_navigation_styles: [],
        supported_browsers:
          $scope.getSelectedOptionsForField("supported-browsers").length == 0
            ? new Array(
                $scope.defaultTechProperties["supported_browsers"].toString()
              )
            : $scope.getSelectedOptionsForField("supported-browsers"),
        other_human_languages:
          $scope.getSelectedOptionsForField("additional-language").length == 0
            ? new Array(
                $scope.defaultTechProperties["client_os_types"].toString()
              )
            : $scope.getSelectedOptionsForField("additional-language"),
        entity: $scope.project.projectCompany,
        enforce_documentation: false,
        widget_count: 100,
        generation_type: "100",
        authorization_type: "group_based",
        authorizations: ["1", "2"],
        project_nouns: null,
        project_screens: null,
        processing_mode_ids: null,
        mobile_standalone: false,
        cert_required: false,
        external_module_list: null,
        default_module: null,
        multi_user_status: null,
        multi_user_info: null,
        application_type: ""
      };

      jsonForProject["id"] = id;
      jsonForProject["default_module_id"] = $scope.json["default_module_id"];
      jsonForProject["createdby"] = $scope.json["createdby"];
      jsonForProject["application_type"] = $scope.json["application_type"];
      $http
        .post(RestURL.baseURL + "project/delete_project/", jsonForProject)
        .success(function(data) {
          $log.log("successfully " + $routeParams.action + "d project");
          $location.url("/en-US/projects");
        })
        .error(function(data) {
          $log.log(data);
        });
    };

    $scope.getProjectNameByID = function(id) {
      if (id == 0) {
        return "Default Project";
      } else {
        for (var i = 0; i < $scope.json.length; ++i) {
          if ($scope.json[i].id == id) {
            return $scope.json[i].name;
          }
        }
      }
    };

    $scope.submitProject = function() {
      console.log($scope.defaultTechProperties);
      var jsonForProject = {
        id: 0,
        name: $scope.project.projectName,
        description: $scope.project.projectDescription,
        label: $scope.project.projectLabel,
        default_module_id: 0,
        default_module_label: $scope.project.default_module_label,
        communication_protocal: $scope.project.communication_protocal,
        stand_alone_app: $scope.project.stand_alone_app,
        notes: $scope.project.projectNotes,
        createdate: "",
        createdby: "",
        lastmodifieddate: "",
        lastmodifiedby: "",
        client_os_types: $scope.getSelectedOptionsForField(
          $scope.selectedClientOS
        ),
        client_device_types: $scope.getSelectedOptionsForField(
          $scope.selectedclientdevicetypes
        ), //new Array($scope.defaultTechProperties['client_device_types'].toString()) : $scope.getSelectedOptionsForField('device-type'),
        client_dev_language:
          $scope.selectedclientdevlanguage == undefined
            ? $scope.defaultTechProperties["client_dev_languages"]
            : $scope.selectedclientdevlanguage,
        client_dev_framework:
          $scope.selectedclientdevframework == undefined
            ? $scope.defaultTechProperties["client_dev_frameworks"]
            : $scope.selectedclientdevframework,
        client_widget_frameworks: [], //($scope.getSelectedOptionsForField('widget-frameworks').length == 0) ? $scope.defaultTechProperties['client_widget_frameworks'] : $scope.getSelectedOptionsForField('widget-frameworks'),
        desktop_css_framework:
          $scope.project.desktopCssFramework &&
          $scope.project.desktopCssFramework["id"]
            ? $scope.project.desktopCssFramework["id"]
            : $scope.defaultTechProperties["desktop_css_framework"],
        mobile_css_framework:
          $scope.project.mobileCssFramework &&
          $scope.project.mobileCssFramework["id"]
            ? $scope.project.mobileCssFramework["id"]
            : $scope.defaultTechProperties["mobile_css_framework"],
        app_ui_template: [],
        client_code_pattern:
          $scope.project.clientCodePattern &&
          $scope.project.clientCodePattern["id"]
            ? $scope.project.clientCodePattern["id"]
            : $scope.defaultTechProperties["client_code_pattern"],
        server_code_pattern:
          $scope.project.serverCodePattern &&
          $scope.project.serverCodePattern["id"]
            ? $scope.project.serverCodePattern["id"]
            : $scope.defaultTechProperties["server_code_pattern"],
        server_dev_lang:
          $scope.project.serverDevelopmentLanguage &&
          $scope.project.serverDevelopmentLanguage["id"]
            ? $scope.project.serverDevelopmentLanguage["id"]
            : $scope.defaultTechProperties["server_dev_lang"],
        server_dev_framework:
          $scope.project.serverDevelopmentFramework &&
          $scope.project.serverDevelopmentFramework["id"]
            ? $scope.project.serverDevelopmentFramework["id"]
            : $scope.defaultTechProperties["server_dev_framework"],
        server_run_time:
          $scope.project.serverRunTime && $scope.project.serverRunTime["id"]
            ? $scope.project.serverRunTime["id"]
            : $scope.defaultTechProperties["server_run_time"],
        server_os:
          $scope.project.serverOs && $scope.project.serverOs["id"]
            ? $scope.project.serverOs["id"]
            : $scope.defaultTechProperties["server_os"],
        server_dbms:
          $scope.project.serverDbms && $scope.project.serverDbms["id"]
            ? $scope.project.serverDbms["id"]
            : $scope.defaultTechProperties["server_dbms"],
        server_deployment_environment:
          $scope.project.serverDepEnviroment &&
          $scope.project.serverDepEnviroment["id"]
            ? $scope.project.serverDepEnviroment["id"]
            : $scope.defaultTechProperties["server_deployment_environment"],
        global_extensions: [],
        ui_navigation_styles: [],
        supported_browsers: $scope.getSelectedOptionsForField(
          $scope.selectedbrowsers
        ),
        default_human_language:
          $scope.project.mainLanguage && $scope.project.mainLanguage["id"]
            ? $scope.project.mainLanguage["id"]
            : 2,
        other_human_languages: $scope.getSelectedOptionsForField(
          $scope.selectedadditionallanguage
        ),
        entity: $scope.project.projectCompany,
        enforce_documentation: false,
        widget_count: 100,
        generation_type: "100",
        authorization_type: "group_based",
        authorizations: ["1", "2"],
        project_nouns: null,
        project_screens: null,
        processing_mode_ids: null,
        mobile_standalone: false,
        cert_required: false,
        external_module_list: null,
        default_module: null,
        multi_user_status: null,
        multi_user_info: null,
        application_type: $scope.project.application_type
          ? $scope.project.application_type
          : 1,
        lotus_notes_enabled: $scope.project.lotus_notes_enabled
          ? $scope.project.lotus_notes_enabled
          : "N",
        lotus_notes_cred_enabled: $scope.project.lotus_notes_cred_enabled
          ? $scope.project.lotus_notes_cred_enabled
          : "N",
        extra_project_info: "{}",
        server_deployment_target: $scope.project.server_deployment_target
          ? $scope.project.server_deployment_target
          : $scope.defaultTechProperties["server_deployment_target"],
        user_deployment_target: $scope.project.user_deployment_target
          ? $scope.project.user_deployment_target
          : $scope.defaultTechProperties["user_deployment_target"]
      };

      jsonForProject["id"] = 0;
      jsonForProject["default_module_id"] = 0;
      //var msg="Please Wait....Project is under creation!";
      //$scope.pleaseWaitDialog('sm');
      $scope.showWaitingDialog("sm", jsonForProject, "", "create");
      //				$timeout(function() {
      //				$http.post(RestURL.baseURL + 'project/create_project/', jsonForProject)
      //					.success(function(data){
      //						var msg='Project Successfully created!';
      //						$scope.openSaveDialog('sm',msg);
      //						$scope.deleteCookies();
      //						$location.url("/en-US/projects");
      //					}).error(function(data){
      //						$log.log("create project"+data);
      //					});
      //				}, 3000);
    };

    /**
	 *
	 */
    $scope.beforeopenGenerateModal = function(size) {
      var generatedappcount = 0;
      
      $http({
	        url:
	         RestURL.baseURL +"profile/getProfileby_userid/?userid=" + userid,   
	        method: "GET",
	        headers: {
	          Accept: "application/json"
	        }
	      }).success(function (data){
	    	  $scope.valid_address = data.billing_address_line1;
	    	
	      
	      })
      
      $http({
        url: RestURL.baseURL + "project/project_count/",
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      }).success(function(data) {
        $scope.project_count = data;
        generatedappcount = $scope.project_count.count;
        console.log("the project count ----->", $scope.project_count);
        if (generatedappcount < $scope.free) {
          $("#freesubscription").modal({
            dataTarget: "#freesubscription",
            backdrop: "static",
            keyboard: false
          });
          $("#freesubscription").modal("show"); //generatedappcount
         // $("#generatedappcount").html(generatedappcount+" ");
          $scope.generatedapp = generatedappcount
          $scope.appcount = $scope.free*1 - 1;
        }
        else if($scope.valid_address == undefined){
        	var msg = "address is not defined";
        	$scope.showProfileMessage("sm",msg);
        
        }
        else {
        $scope.openGenerateModal();
        }
      });
    };

    $scope.openGenerateModal = function(size) {
      var modalInstance = $modal.open({
        animation: true,
        size: size,
        backdrop: "static",
        keyboard: false,
        templateUrl: "app/views/en-US/templates/modals/project/generate.html",
        controller: "ModalCtrl",
        resolve: {
          data: function() {
            return angular.copy($scope.json["id"]); // deep copy
          }
        }
      });
      modalInstance.result.then(
        function(dataFromModal) {
          $log.info("Modal dismissed at: " + new Date());
        },
        function() {
          $log.info("Modal dismissed at: " + new Date());
        }
      );
    };

    /**
	 * delete all the cookies
	 */
    $scope.deleteCookies = function() {
      $cookieStore.remove("projectName");
      $cookieStore.remove("projectLabel");
      $cookieStore.remove("projectDescription");
      $cookieStore.remove("projectCompany");
      $cookieStore.remove("mainLanguage");
      $cookieStore.remove("additional-language");
    };

    $scope.cancelProject = function() {
      if ($routeParams["action"] == "create") {
        $scope.deleteCookies();
      }
      $location.url("/en-US/projects/");
    };

    function emptyAllFields($scope) {
      $scope.project.projectName = "";
      $scope.project.projectLabel = "";
      $scope.project.projectCompany = "";
      $scope.project.projectDescription = "";
      $scope.project.default_module_label = "";
      $scope.project.communication_protocal = "";
      $scope.project.stand_alone_app = "";
      $scope.project.mainLanguage = undefined;
      $scope.project.clientCodePattern = undefined;
      $scope.project.serverCodePattern = undefined;
      $scope.project.application_type = undefined;
      $scope.project.serverDevelopmentLanguage = undefined;
      $scope.project.serverDevelopmentFramework = undefined;
      $scope.project.serverRunTime = undefined;
      $scope.project.serverOs = undefined;
      $scope.project.serverDbms = undefined;
      $scope.project.serverDepEnviroment = undefined;
      $scope.appUiTemplate = undefined;
      $scope.uiNavigationStyle = undefined;
    }

    function emptyAdvanceFields($scope) {
      $scope.project.clientCodePattern = undefined;
      $scope.serverCodePattern = undefined;
      $scope.project.serverDevelopmentLanguage = undefined;
      $scope.project.serverDevelopmentFramework = undefined;
      $scope.project.serverRunTime = undefined;
      $scope.project.serverOs = undefined;
      $scope.project.serverDbms = undefined;
      $scope.project.serverDepEnviroment = undefined;
      $scope.appUiTemplate = undefined;
      $scope.uiNavigationStyle = undefined;
    }

    $scope.project = {};
    $scope.project.projectName = $scope.json["name"];
    $scope.project.projectLabel = $scope.json["label"];
    $scope.project.projectCompany = $scope.json["entity"];
    $scope.project.projectDescription = $scope.json["description"];
    $scope.project.default_module_label = $scope.json["default_module_label"];
    $scope.project.communication_protocal =
      $scope.json["communication_protocal"];
    $scope.project.stand_alone_app = $scope.json["stand_alone_app"];
    $scope.project.notes = $scope.json["notes"];
    $scope.project.lotus_notes_enabled =
      $scope.json["lotus_notes_enabled"] == "Y" ? true : false;
    $scope.project.lotus_notes_cred_enabled =
      $scope.json["lotus_notes_cred_enabled"] == "Y" ? true : false;
    $scope.project.extra_project_info = $scope.json["extra_project_info"]
      ? JSON.parse($scope.json["extra_project_info"])
      : {};

    var mainLanguages = [];

    $scope.techProperties = [];
    $scope.serverLanguages = [];

    $scope.serverDevFramework = [];
    $scope.serverRunTimes = [];
    $scope.serverOS = [];
    $scope.serverDBMS = [];
    $scope.serverCodePatterns = [];
    $scope.serverDeploymentEnvironment = [];
    $scope.clientCodePatterns = [];
    $scope.desktopCssFrameworks = [];
    $scope.mobileCssFrameworks = [];
    $scope.clientWidgetFramework = [];

    $scope.activities = [];
    $scope.nouns = [];
    $scope.other_nouns = [];
    $scope.languages = [];
    $scope.tempaddlanguages = [];
    $scope.mainLanguages = [];
    $scope.projectTemplates = [];

    $scope.additionallanguages = [];
    $scope.selectedadditionallanguage = [];

    $scope.clientdevlanguage = [];
    $scope.selectedclientdevlanguage;

    $scope.clientOS = [];
    $scope.selectedClientOS = [];

    $scope.clientdevframework = [];
    $scope.selectedclientdevframework;

    $scope.user_deployment_target = [];
    $scope.server_deployment_target = [];

    $scope.clientDeviceTypes = [];
    $scope.selectedclientdevicetypes = [];

    $scope.browsers = [];
    $scope.selectedbrowsers = [];

    $scope.defaultTechProperties = {};

    $scope.project.projectNotes = "";
    if ($scope.json["notes"] != "") {
      $scope.project.projectNotes = $scope.json["notes"];
    }
    $scope.additionallanguage = [];
    $scope.appUiTemplate = $scope.json["app_ui_template"];
    $scope.uiNavigationStyle = $scope.json["ui_navigation_styles"];

    //getting all langauges
    $scope.getAllPrimaryLanguages = function() {
      $http
        .get(RestURL.baseURL + "language/get_all_languages/")
        .success(function(data) {
          for (var i = 0; data[i]; ++i) {
            var lng = {
              id: data[i]["id"],
              iso_id: data[i]["iso_id"],
              name: data[i]["ref_name"]
            };
            /*var addlng = {
			 id : data[i]['id'],
			 label : data[i]['ref_name']
			 };*/

            $scope.languages.push(lng);
            //$scope.tempaddlanguages.push(addlng);
          }
          languageFactory.setData(data);
          $scope.mainLanguages = $scope.languages;
          //$scope.additionalLanguages= $scope.tempaddlanguages;
          if ($routeParams["action"] == "update") {
            fillInfo($scope);
          }
        })
        .error(function(data) {
          $log.log("lang data" + data);
        });
    };

    $scope.getAllSecondaryLanguages = function(selectedPrimaryLanguage) {
      $http
        .get(RestURL.baseURL + "language/get_all_languages/")
        .success(function(data) {
          $scope.tempaddlanguages = [];
          for (var i = 0; data[i]; ++i) {
            var addlng = {
              id: data[i]["id"],
              label: data[i]["ref_name"]
            };
            if (
              selectedPrimaryLanguage != data[i]["ref_name"] &&
              selectedPrimaryLanguage != data[i]["id"]
            ) {
              $scope.tempaddlanguages.push(addlng);
            }
          }
          languageFactory.setData(data);
          $scope.additionalLanguages = $scope.tempaddlanguages;
          if ($routeParams["action"] == "update") {
            fillInfo($scope);
          }
        })
        .error(function(data) {
          $log.log("lang data" + data);
        });
    };

    $scope.getApplicationType = function() {
      $http
        .get(RestURL.baseURL + "project/find_all_Application_type/")
        .success(function(data) {
          $scope.Apptype = data;
        })
        .error(function(data) {
          $log.log("Application Types" + data);
        });
    };

    $scope.getApplicationType();

    //getting all techProperties
    $scope.getAllTechProperties = function() {
      $http
        .get(RestURL.baseURL + "techproperties/get_all_tech_properties/")
        .success(function(data) {
          $scope.techProperties = data;
          for (var i = 0; i < $scope.techProperties.length; ++i) {
            var obj = data[i];
            var objtouse = {
              id: data[i]["id"],
              label: data[i]["label"]
            };

            switch (obj["type"]) {
              case "GpServerLanguage":
                $scope.serverLanguages.push(obj);

                break;
              case "GpClientLanguage":
                $scope.clientdevlanguage.push(objtouse);

                break;
              case "GpBrowser":
                $scope.browsers.push(objtouse);

                break;
              case "GpServerDevFramework":
                $scope.serverDevFramework.push(obj);

                break;
              case "GpServerRunTime":
                $scope.serverRunTimes.push(obj);

                break;
              case "GpServerOS":
                $scope.serverOS.push(obj);

                break;
              case "GpServerCodePattern":
                $scope.serverCodePatterns.push(obj);

                break;
              case "GpServerDeploymentEnvironment":
                $scope.serverDeploymentEnvironment.push(obj);

                break;
              case "GpClientCodePattern":
                $scope.clientCodePatterns.push(obj);

                break;
              case "GpDesktopCssFramework":
                $scope.desktopCssFrameworks.push(obj);

                break;
              case "GpMobileCssFramework":
                $scope.mobileCssFrameworks.push(obj);

                break;
              case "GpClientOS":
                $scope.clientOS.push(objtouse);

                break;
              case "GpServerDBMS":
                $scope.serverDBMS.push(obj);

                break;
              case "GpClientDevFramework":
                $scope.clientdevframework.push(objtouse);

                break;
              case "GpServerDeploymentTarget":
                $scope.server_deployment_target.push(objtouse);

                break;
              case "GpUserDeploymentTarget":
                $scope.user_deployment_target.push(objtouse);

                break;
            }
          }
        })
        .error(function(data) {
          $log.log("tech prop" + data);
        });
    };

    // getting device types
    $scope.getAllDeviceTypes = function() {
      $http
        .get(RestURL.baseURL + "devicetypes/find_all_devices/")
        .success(function(data) {
          for (var i = 0; data[i]; ++i) {
            var obj = {
              id: data[i]["id"],
              label: data[i]["client_device_type_label"]
            };
            $scope.clientDeviceTypes.push(obj);
          }
          $scope.getAllPrimaryLanguages();
          $scope.getAllTechProperties();
        })
        .error(function(data) {
          $log.log("device type" + data);
        });
    };

    $scope.getAllDeviceTypes();

    // open add project modal
    $scope.openAddProjectModal = function() {
      var tempdata = {
        main: $scope.mainLanguages,
        additional: $scope.additionalLanguages
      };
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: "app/views/en-US/templates/modals/project/create.html",
        controller: "ModalCtrl",
        resolve: {
          data: function() {
            return angular.copy(tempdata); // deep copy
          }
        }
      });

      modalInstance.result.then(
        function(dataFromModal) {
          $scope.modalData = dataFromModal;
          //populate scope vars with modal data
          $scope.project.projectName = $scope.modalData.projectName;
          $scope.project.projectDescription =
            $scope.modalData.projectDescription;
          $scope.project.projectLabel = $scope.modalData.projectLabel;
          $scope.project.projectCompany = $scope.modalData.projectCompany;
          $scope.project.mainLanguage = $scope.modalData.mainLanguage;
          $scope.selectedadditionallanguage =
            $scope.modalData.selectedadditionallanguages;

          if ($scope.modalData.action == "create") {
            $scope.submitProject();
          } else {
            $cookieStore.put("projectName", $scope.project.projectName);
            $cookieStore.put("projectLabel", $scope.project.projectLabel);
            $cookieStore.put(
              "projectDescription",
              $scope.project.projectDescription
            );
            $cookieStore.put("projectCompany", $scope.project.projectCompany);

            $cookieStore.put(
              "additionalLanguage",
              $scope.selectedadditionallanguage
            );

            if ($scope.project.mainLanguage != undefined)
              $cookieStore.put("mainLanguage", $scope.project.mainLanguage);
            else $cookieStore.put("mainLanguage", "");

            $location.url("/en-US/project/create/");
          }
        },
        function() {
          $log.info("Modal dismissed at: " + new Date());
        }
      );
    };

    $scope.multiselectsettings = {
      scrollableHeight: "200px",
      scrollable: true
    };
    /*$scope.pleaseWaitDialog = function (size) {
	 var modalInstance = $modal.open({
	 animation: true,
	 size:size,
	 templateUrl: 'app/views/en-US/templates/modals/project/please_wait.html',
	 controller: 'ModalCtrl',
	 resolve: {
	 data: function () {
	 return size; // deep copy
	 },
	 }
	 });
	 modalInstance.result.then(function (dataFromModal) {
	 alert("HII");
	 }, function () {
	 alert("f");
	 });
	 };*/

    $scope.openUploadingDialog = function(size, file, project_id) {
      var upload_dxl_modal_data = {};
      upload_dxl_modal_data.file = file;
      upload_dxl_modal_data.project_id = project_id;
      var modalInstance = $modal.open({
        animation: true,
        size: size,
        backdrop: "static",
        keyboard: false,
        templateUrl:
          "app/views/en-US/templates/modals/project/uploadingdxl.html",
        controller: "ModalCtrl",
        resolve: {
          data: function() {
            return upload_dxl_modal_data; // deep copy
          }
        }
      });
      modalInstance.result.then(
        function(dataFromModal) {},
        function() {
          $log.info("Modal dismissed at: " + new Date());
        }
      );
    };

    $scope.openSaveDialog = function(size, msg) {
      var modalInstance = $modal.open({
        animation: true,
        size: size,
        templateUrl:
          "app/views/en-US/templates/modals/project/savemessage.html",
        controller: "ModalCtrl",
        resolve: {
          data: function() {
            return msg; // deep copy
          }
        }
      });
      modalInstance.result.then(
        function(dataFromModal) {},
        function() {
          $log.info("Modal dismissed at: " + new Date());
        }
      );
    };

    $scope.showProfileMessage = function(size,msg) {
        var modalInstance = $modal.open({
          animation: true,
          size: size,
          templateUrl:
            "app/views/en-US/templates/modals/project/profilemessage.html",
          controller: "ModalCtrl",
          resolve: {
            data: function() {
              return msg; // deep copy
            }
          }
        });
        modalInstance.result.then(
          function(dataFromModal) {},
          function() {
            $log.info("Modal dismissed at: " + new Date());
          }
        );
      };

    
$scope.Checkpredefined_activities = function(size,jsonforproject,projectid,action){
	console.log("data from node json values--->>>",jsonforproject);
	 var other_activities = {
   		  "project_id" : projectid,
   		  "module_id" : jsonforproject.id
     }
     var other_data ;
     $scope.dependency = [];
     $http({
   	
   	        url: "http://localhost:8000/api/report/getbyprojectid",
            method: "POST",
            data  : other_activities,
           headers: {
             Accept: "application/json"
           }
     
     
     })
     .success(function(data){
   	  console.log("data from node--->>>",data)
   	  other_data = data;
   	  console.log("data from node other data",other_data);
   	  console.log("data from node length-->>",other_data.length);
   	 	 for(var i =0 ; i<other_data.length ; i++){
   	 		 console.log("data from node entering into for loop");
   	 		 if(!other_data[i].status){
   	 			 $scope.dependency.push(other_data[i].name);
   	 		 }
   	 	 }
   	 	 console.log("data from node final dependency",$scope.dependency);
   	 	  
   	 	  if($scope.dependency.length){
   	 	     $scope.dependencyDialog("sm",$scope.dependency,jsonforproject,"dependencies needed");	  
   	 		 console.log("data from node final if dependency");
   	 	 	  
   	 	  }
   	 	  else{
   	 		  //$scope.openSaveDialog("sm",msg);
   	 		 console.log("data from node final else dependency");
   	 	     $scope.showWaitingDialog("sm", jsonforproject, projectid, "add_module");
   	 	 	  
   	 	  }
     })
     .error(function(data){
   	  console.log("data from node failure---->>>",data)
     })
    
		
}    
    $scope.showWaitingDialog = function(
      size,
      jsonForProject,
      projectId,
      action
    ) {
      var data = {
        jsonForProject: jsonForProject,
        action: action,
        projectId: projectId
      };
      
//      var data = {
// 	        jsonForProject: jsonForProject,
// 	        action: action,
// 	        projectId: projectId,
// 	        dependency : $scope.dependency
// 	      };
// 	  
 	  var modalInstance = $modal.open({
        animation: true,
        size: size,
        templateUrl:
          "app/views/en-US/templates/modals/project/please_wait.html",
        controller: "ModalCtrl",
        resolve: {
          data: function() {
            return data; // deep copy
          }
        }
      });

      modalInstance.result.then(
        function(dataFromModal) {
          $scope.modalData = dataFromModal;
          var msg = $scope.modalData.postSuccessMsg;
          //$scope.openSaveDialog("sm", msg);
          if ($scope.modalData.action == "add_module") {
        	$scope.deleteCookies();
            $location.url("/en-US/project/update");
            $scope.getAllPredefinedActivities();
          }
          if ($scope.modalData.action == "create") {
            $scope.deleteCookies();
            $location.url("/en-US/projects");
          }
          if ($scope.modalData.action == "update") {
            // $scope.deleteCookies();
            //$location.url("/en-US/projects");
          }
        },
        function() {
          $scope.deleteCookies();
          $log.info("Modal dismissed at: " + new Date());
        }
      );
    };

    
    
    $scope.dependencyDialog = function(
    	      size,
    	      dependency,
    	      jsonforproject,
    	      action
    	    ) {
    	      var data = {
    	        dependency: dependency,
    	        jsonForProject : jsonforproject,
    	        action: action
    	      };
    	      console.log("data from node dependency dialog values----->><> ",data)
       	      var modalInstance = $modal.open({
    	        animation: true,
    	        size: size,
    	        templateUrl:
    	          "app/views/en-US/templates/modals/project/dependency_activities.html",
    	        controller: "ModalCtrl",
    	        resolve: {
    	          data: function() {
    	            return data; // deep copy
    	          }
    	        }
    	      });

    	      modalInstance.result.then(
    	        function(dataFromModal) {
    	        	console.log("data from node---><><> ",dataFromModal)
    	          $scope.modalData = dataFromModal;
    	          var msg = $scope.modalData.postSuccessMsg;
    	          //$scope.openSaveDialog("sm", msg);
    	          if ($scope.modalData.action == "dependencies needed") {
                    $scope.deleteCookies();
    	            $location.url("/en-US/project/update");
    	            $scope.getAllPredefinedActivities();
    	          }
    	          
    	        },
    	        function() {
    	          $scope.deleteCookies();
    	          $log.info("Modal dismissed at: " + new Date());
    	        }
    	      );
    	    };

    $scope.openDeleteDialog = function(size, id) {
      var modalInstance = $modal.open({
        animation: true,
        size: size,
        templateUrl: "app/views/en-US/templates/modals/project/delete.html",
        controller: "ModalCtrl",
        resolve: {
          data: function() {
            return angular.copy(id); // deep copy
          }
        }
      });
      modalInstance.result.then(
        function(dataFromModal) {
          $scope.deleteProject(dataFromModal);
        },
        function() {
          $log.info("Modal dismissed at: " + new Date());
        }
      );
    };

    //selecting options for update screen
    $scope.setValueForSelect = function() {
      if (
        $scope.project.mainLanguage == undefined &&
        $scope.json["default_human_language"] == 0
      ) {
        $scope.broswerLanguageDetection();
      }
      if (
        $scope.project.mainLanguage == undefined &&
        $scope.json["default_human_language"] != 0
      ) {
        $scope.project.mainLanguage = {
          id: Number($scope.json["default_human_language"])
        };
        $scope.additionalLanguageDropdown($scope.project.mainLanguage.id);
      }

      // $scope.project.mainLanguage = { id : Number($scope.json['default_human_language']) };
      console.log($scope.json);
      $scope.selectedclientdevlanguage = {
        id: Number($scope.json["client_dev_language"])
      };
      $scope.selectedclientdevframework = {
        id: Number($scope.json["client_dev_framework"])
      };
      $scope.project.clientCodePattern = {
        id: Number($scope.json["client_code_pattern"])
      };
      $scope.project.serverCodePattern = {
        id: Number($scope.json["server_code_pattern"])
      };
      $scope.project.serverDevelopmentLanguage = {
        id: Number($scope.json["server_dev_lang"])
      };
      $scope.project.application_type = {
        id: Number($scope.json["application_type"])
      };
      $scope.project.serverDevelopmentFramework = {
        id: Number($scope.json["server_dev_framework"])
      };
      $scope.project.serverRunTime = {
        id: Number($scope.json["server_run_time"])
      };
      $scope.project.desktopCssFramework = {
        id: Number($scope.json["desktop_css_framework"])
      };
      $scope.project.mobileCssFramework = {
        id: Number($scope.json["mobile_css_framework"])
      };
      $scope.project.serverOs = { id: Number($scope.json["server_os"]) };
      $scope.project.serverDbms = { id: Number($scope.json["server_dbms"]) };
      $scope.project.serverDepEnviroment = {
        id: Number($scope.json["server_deployment_environment"])
      };
      $scope.project.server_deployment_target = {
        id: Number($scope.json["server_deployment_target"])
      };
      $scope.project.user_deployment_target = {
        id: Number($scope.json["user_deployment_target"])
      };
    };

    $scope.setValuesForMultiselect = function(selectedOptions) {
      if (selectedOptions != undefined) {
        var selectedmodal = "[";
        var delim = ",";
        for (var i = 0; i < selectedOptions.length; i++) {
          if (i == selectedOptions.length - 1) {
            delim = "";
          }
          if (selectedOptions[i] != "")
            selectedmodal += "{'id':" + selectedOptions[i] + "}" + delim;
        }
        selectedmodal += "]";
        return selectedmodal;
      }
    };

    function fillInfo($scope) {
      //putting project values in fields
      $scope.project.projectName = $scope.json["name"];
      $scope.project.projectLabel = $scope.json["label"];
      $scope.project.projectCompany = $scope.json["entity"];
      $scope.project.projectDescription = $scope.json["description"];
      $scope.project.default_module_label = $scope.json["default_module_label"];
      $scope.project.communication_protocal =
        $scope.json["communication_protocal"];
      $scope.project.stand_alone_app = $scope.json["stand_alone_app"];
      $scope.project.notes = $scope.json["notes"];

      //calling method for Selects
      $scope.setValueForSelect();
      $scope.selectedmodal = [];
      $scope.selectedmodal = $scope.setValuesForMultiselect(
        $scope.json["other_human_languages"]
      );
      $scope.selectedadditionallanguage = eval($scope.selectedmodal);

      $scope.selectedmodal = [];
      $scope.selectedmodal = $scope.setValuesForMultiselect(
        $scope.json["client_os_types"]
      );
      $scope.selectedClientOS = eval($scope.selectedmodal);

      $scope.selectedmodal = [];
      $scope.selectedmodal = $scope.setValuesForMultiselect(
        $scope.json["client_device_types"]
      );
      $scope.selectedclientdevicetypes = eval($scope.selectedmodal);

      $scope.selectedmodal = [];
      $scope.selectedmodal = $scope.setValuesForMultiselect(
        $scope.json["client_widget_frameworks"]
      );
      $scope.selectedclientdevicetypes = eval($scope.selectedmodal);

      $scope.selectedmodal = [];
      $scope.selectedmodal = $scope.setValuesForMultiselect(
        $scope.json["supported_browsers"]
      );
      $scope.selectedbrowsers = eval($scope.selectedmodal);
    }

    console.log("primary language ", $scope.json["default_human_language"]);
    console.log("secondary language ", $scope.json["other_human_languages"]);

    var language_forProj = [];
    language_forProj.push($scope.json["default_human_language"]);

    if ($scope.json["other_human_languages"] != undefined) {
      console.log(
        "actUserDetailServicevalue of language",
        $scope.json["other_human_languages"].length
      );
      for (var i = 0; i < $scope.json["other_human_languages"].length; i++) {
        language_forProj.push($scope.json["other_human_languages"][i]);
      }
      UserDetailService.projectLanguage = language_forProj;
    }

    /**/
    console.log("outside loop", UserDetailService.projectLanguage);

    $scope.getDefaultProperties = function() {
      $http
        .get(RestURL.baseURL + "techproperties/get_default_properties/")
        .success(function(data) {
          for (var i = 0; i < data.length; ++i) {
            var obj = data[i];
            switch (obj["type"]) {
              case "GpServerLanguage":
                if (data[i]["default_value"]) {
                  $scope.defaultTechProperties["server_dev_lang"] =
                    data[i]["id"];
                }

                break;
              case "GpClientLanguage":
                if (data[i]["default_value"]) {
                  $scope.defaultTechProperties["client_dev_languages"] =
                    data[i]["id"];
                }

                break;
              case "GpBrowser":
                if (data[i]["default_value"]) {
                  $scope.defaultTechProperties["supported_browsers"] =
                    data[i]["id"];
                }

                break;
              case "GpServerDevFramework":
                if (data[i]["default_value"]) {
                  $scope.defaultTechProperties["server_dev_framework"] =
                    data[i]["id"];
                }

                break;
              case "GpServerRunTime":
                if (data[i]["default_value"]) {
                  $scope.defaultTechProperties["server_run_time"] =
                    data[i]["id"];
                }

                break;
              case "GpServerOS":
                if (data[i]["default_value"]) {
                  $scope.defaultTechProperties["server_os"] = data[i]["id"];
                }

                break;
              case "GpServerCodePattern":
                if (data[i]["default_value"]) {
                  $scope.defaultTechProperties["server_code_pattern"] =
                    data[i]["id"];
                }

                break;
              case "GpServerDeploymentEnvironment":
                if (data[i]["default_value"]) {
                  $scope.defaultTechProperties[
                    "server_deployment_environment"
                  ] =
                    data[i]["id"];
                }

                break;
              case "GpClientCodePattern":
                if (data[i]["default_value"]) {
                  $scope.defaultTechProperties["client_code_pattern"] =
                    data[i]["id"];
                }

                break;
              case "GpDesktopCssFramework":
                if (data[i]["default_value"]) {
                  $scope.defaultTechProperties["desktop_css_framework"] =
                    data[i]["id"];
                }

                break;
              case "GpMobileCssFramework":
                if (data[i]["default_value"]) {
                  $scope.defaultTechProperties["mobile_css_framework"] =
                    data[i]["id"];
                }

                break;
              case "GpClientOS":
                if (data[i]["default_value"]) {
                  $scope.defaultTechProperties["client_os_types"] =
                    data[i]["id"];
                }

                break;
              case "GpServerDBMS":
                if (data[i]["default_value"]) {
                  $scope.defaultTechProperties["server_dbms"] = data[i]["id"];
                }

                break;
              case "GpClientDevFramework":
                if (data[i]["default_value"]) {
                  $scope.defaultTechProperties["client_dev_frameworks"] =
                    data[i]["id"];
                }

                break;
              case "GpUserDeploymentTarget":
                if (data[i]["default_value"]) {
                  $scope.defaultTechProperties["user_deployment_target"] =
                    data[i]["id"];
                }

                break;
              case "GpServerDeploymentTarget":
                if (data[i]["default_value"]) {
                  $scope.defaultTechProperties["server_deployment_target"] =
                    data[i]["id"];
                }

                break;
            }
          }
        })
        .error(function(data) {
          $log.log(data);
        });
    };

    $scope.getDefaultProperties();

    $scope.openAbout = function() {
      $location.url("/en-US/about/");
    };

    //getting all activities for current project
    $scope.getAllActivities = function($scope, projectID) {
      $log.log("get all activities called!");
      $scope.activities = [];
      $http
        .get(
          RestURL.baseURL +
            "activity/get_all_activities_by_project_id/?project_id=" +
            projectID
        )
        .success(function(data) {
         // $log.log("data of all activities" + angular.toJson(data));

          for (var index = 0; index < data.length; index++) {
            var actObj = data[index];
            var actObj1 = data[index].name;
            $rootScope.actobj1.push(data[index].name);

            $scope.activities.push(actObj);
          }
          $log.log("data in act0bj1" + $rootScope.actobj1);
          $scope.getAllPredefinedActivities();
        })
        .error(function(data) {
          $log.log(data);
        });
    };

    // getting all other activities
    $scope.predefined_activities_other = [];
    $scope.predefined_activities_system = [];
    $scope.predefined_activity = [];

    $scope.getAllPredefinedActivities = function() {
      $log.log("get all predefined activities called!");
      $http
        .get(RestURL.baseURL + "activity/get_all_predefined_activities")
        .success(function(data) {
          for (var index = 0; index < $scope.activities.length; index++) {
            var activity_id = $scope.activities[index].predefined_activity_id;
            $scope.predefined_activity.push(activity_id);
          }
          for (var actIndex = 0; actIndex < data.length; actIndex++) {
            for (
              var preactIndex = 0;
              preactIndex < $scope.predefined_activity.length;
              preactIndex++
            ) {
              if (
                data[actIndex].id == $scope.predefined_activity[preactIndex]
              ) {
                data[actIndex].activity_visibility = false;
                break;
              }
            }
            if (
              data[actIndex].activity_type != null &&
              data[actIndex].activity_type == "GpSystemLevel"
            ) {
              $scope.predefined_activities_system.push(data[actIndex]);
            } else {
              $scope.predefined_activities_other.push(data[actIndex]);
            }
          }
        })
        .error(function(data) {
          $log.log(data);
        });
    };

    /**
	 * used to get all nouns based on project
	 */
    function getAllNounsBasedOnProject($scope, projectID) {
      $http
        .get(
          RestURL.baseURL +
            "noun/get_all_nouns_by_project_id/?project_id=" +
            projectID
        )
        .success(function(response) {
          $scope.nouns = response;
        })
        .error(function(response) {
          $log.log("Error : ", response);
        });
    }

    function getAllERDBasedOnProject($scope, projectID) {
      $http
        .get(
          RestURL.baseURL + "xml/get_xml_by_project_id/?project_id=" + projectID
        )
        .success(function(response) {
          $scope.erds = response;
        })
        .error(function(response) {
          $log.log("Error : ", response);
        });
    }

    //getting all projectTemplates for current project
    $scope.getAllProjectTemplates = function($scope, projectID) {
      //$log.log("get all project templates called!");
      $http
        .get(
          RestURL.baseURL +
            "projecttemplate/get_by_project/?projectId=" +
            projectID
        )
        .success(function(data) {
          $scope.projectTemplates = data;
        })
        .error(function(data) {
          //console.log("project.js -> getAllProjectTemplates -> ERROR: " + JSON.stringify( data ) )
          $log.log(data);
        });
    };

    //getting all Project Templates Devices

    $scope.getDeviceClass = function(device) {
      if (device == "PC") return "fa fa-desktop";
      else if (device == "Tablet") return "fa fa-tablet";
      else if (device == "Mobile") return "fa fa-mobile";
      else if (device == null && device == "") return "";
    };

    var values = [];
    // This method is only for multiselect fields
    $scope.getSelectedOptionsForField = function(fieldID) {
      values = [];

      var options = fieldID;
      for (var i = 0; i < options.length; i++) {
        values.push(options[i].id);
      }
      return values;
    };

    $scope.updateActivity = function(activityId, activityName) {
      ActivityInfo.setActivityId(activityId);
      ActivityInfo.setProjectId($scope.json["id"]);
      ActivityInfo.setActivityName(activityName);
      $location.url("/en-US/activity/update");
    };

    $scope.updateProjectTemplate = function(projectTemplateId, device) {
      ActivityInfo.setProjectId($scope.json["id"]);
      ActivityInfo.setActivityId(projectTemplateId);
      ActivityInfo.setDeviceTypes(device);
      $location.url("/en-US/projecttemplate/update");
    };

    $scope.createActivity = function() {
      ActivityInfo.setProjectId($scope.json["id"]);

      $location.url("/en-US/activity/create");
    };

    $scope.showcreate = false;

    switch ($routeParams["action"]) {
      case undefined:
        $cookieStore.put("back", "/en-US/projects/");
        $scope.getProjectsForUser();
        emptyAllFields($scope);

        break;
      case "create":
        $scope.showcreate = true;
        $cookieStore.put("back", "/en-US/project/create/");
        $scope.project.projectName = $cookieStore.get("projectName");
        $scope.project.projectLabel = $cookieStore.get("projectLabel");
        $scope.project.projectDescription = $cookieStore.get(
          "projectDescription"
        );
        $scope.project.projectCompany = $cookieStore.get("projectCompany");

        if ($cookieStore.get("mainLanguage") != undefined)
          $scope.project.mainLanguage = {
            id: $cookieStore.get("mainLanguage")["id"]
          };

        if ($cookieStore.get("additionalLanguage") != undefined)
          $scope.selectedadditionallanguage = $cookieStore.get(
            "additionalLanguage"
          );

        emptyAdvanceFields($scope);
        $scope.getAllPredefinedActivities();

        break;
      case "update":
        $scope.showcreate = false;
        $cookieStore.put("back", "/en-US/project/update/");
        $scope.getAllActivities($scope, $scope.json["id"]);
        $scope.getAllProjectTemplates($scope, $scope.json["id"]);
        getAllNounsBasedOnProject($scope, $scope.json["id"]);
        getAllERDBasedOnProject($scope, $scope.json["id"]);

        break;
      default:
        //TODO add error page
        $location.url("/en-US/login/");
    }

    $scope.test = function(selectedclientdevframework) {
      $scope.selectedclientdevframework = selectedclientdevframework;
      console.log("selected framework", $scope.selectedclientdevframework);
    };

    $scope.updateProject = function() {
      console.log("11111111" + $scope.project.projectCompany);
      console.log($scope.selectedclientdevframework);
      var jsonForProject = {
        id: 0,
        name: $scope.project.projectName,
        description: $scope.project.projectDescription,
        label: $scope.project.projectLabel,
        default_module_id: 0,
        default_module_label: $scope.project.default_module_label,
        communication_protocal: $scope.project.communication_protocal,
        stand_alone_app: $scope.project.stand_alone_app,
        notes: $scope.project.projectNotes,
        createdate: "",
        createdby: "",
        lastmodifieddate: "",
        lastmodifiedby: "",
        client_os_types: $scope.getSelectedOptionsForField(
          $scope.selectedClientOS
        ),
        client_device_types: $scope.getSelectedOptionsForField(
          $scope.selectedclientdevicetypes
        ), //new Array($scope.defaultTechProperties['client_device_types'].toString()) : $scope.getSelectedOptionsForField('device-type'),
        client_dev_language:
          $scope.selectedclientdevlanguage == undefined
            ? $scope.defaultTechProperties["client_dev_languages"]
            : $scope.selectedclientdevlanguage["id"],
        client_dev_framework:
          $scope.selectedclientdevframework == undefined
            ? $scope.defaultTechProperties["client_dev_frameworks"]
            : $scope.selectedclientdevframework["id"],
        client_widget_frameworks: [], //($scope.getSelectedOptionsForField('widget-frameworks').length == 0) ? $scope.defaultTechProperties['client_widget_frameworks'] : $scope.getSelectedOptionsForField('widget-frameworks'),
        desktop_css_framework:
          $scope.project.desktopCssFramework &&
          $scope.project.desktopCssFramework["id"]
            ? $scope.project.desktopCssFramework["id"]
            : $scope.defaultTechProperties["desktop_css_framework"],
        mobile_css_framework:
          $scope.project.mobileCssFramework &&
          $scope.project.mobileCssFramework["id"]
            ? $scope.project.mobileCssFramework["id"]
            : $scope.defaultTechProperties["mobile_css_framework"],
        app_ui_template: [],
        client_code_pattern:
          $scope.project.clientCodePattern &&
          $scope.project.clientCodePattern["id"]
            ? $scope.project.clientCodePattern["id"]
            : $scope.defaultTechProperties["client_code_pattern"],
        server_code_pattern:
          $scope.project.serverCodePattern &&
          $scope.project.serverCodePattern["id"]
            ? $scope.project.serverCodePattern["id"]
            : $scope.defaultTechProperties["server_code_pattern"],
        server_dev_lang:
          $scope.project.serverDevelopmentLanguage &&
          $scope.project.serverDevelopmentLanguage["id"]
            ? $scope.project.serverDevelopmentLanguage["id"]
            : $scope.defaultTechProperties["server_dev_lang"],
        server_dev_framework:
          $scope.project.serverDevelopmentFramework &&
          $scope.project.serverDevelopmentFramework["id"]
            ? $scope.project.serverDevelopmentFramework["id"]
            : $scope.defaultTechProperties["server_dev_framework"],
        server_run_time:
          $scope.project.serverRunTime && $scope.project.serverRunTime["id"]
            ? $scope.project.serverRunTime["id"]
            : $scope.defaultTechProperties["server_run_time"],
        server_os:
          $scope.project.serverOs && $scope.project.serverOs["id"]
            ? $scope.project.serverOs["id"]
            : $scope.defaultTechProperties["server_os"],
        server_dbms:
          $scope.project.serverDbms && $scope.project.serverDbms["id"]
            ? $scope.project.serverDbms["id"]
            : $scope.defaultTechProperties["server_dbms"],
        server_deployment_environment:
          $scope.project.serverDepEnviroment &&
          $scope.project.serverDepEnviroment["id"]
            ? $scope.project.serverDepEnviroment["id"]
            : $scope.defaultTechProperties["server_deployment_environment"],
        global_extensions: [],
        ui_navigation_styles: [],
        supported_browsers: $scope.getSelectedOptionsForField(
          $scope.selectedbrowsers
        ),
        default_human_language:
          $scope.project.mainLanguage && $scope.project.mainLanguage["id"]
            ? $scope.project.mainLanguage["id"]
            : 2,
        other_human_languages: $scope.getSelectedOptionsForField(
          $scope.selectedadditionallanguage
        ),
        entity: $scope.project.projectCompany,
        enforce_documentation: false,
        widget_count: 100,
        generation_type: "100",
        authorization_type: "group_based",
        authorizations: ["1", "2"],
        project_nouns: null,
        project_screens: null,
        processing_mode_ids: null,
        mobile_standalone: false,
        cert_required: false,
        external_module_list: null,
        default_module: null,
        multi_user_status: null,
        multi_user_info: null,
        application_type: $scope.project.application_type.id,
        lotus_notes_enabled: $scope.project.lotus_notes_enabled ? "Y" : "N",
        lotus_notes_cred_enabled: $scope.project.lotus_notes_cred_enabled
          ? "Y"
          : "N",
        extra_project_info: JSON.stringify($scope.project.extra_project_info),
        server_deployment_target: $scope.project.server_deployment_target.id
          ? $scope.project.server_deployment_target.id
          : $scope.defaultTechProperties["server_deployment_target"],
        user_deployment_target: $scope.project.user_deployment_target.id
          ? $scope.project.user_deployment_target.id
          : $scope.defaultTechProperties["user_deployment_target"]
      };

      var newSecLanguage = [];
      var newLanguage = [];
      newSecLanguage = UserDetailService.projectLanguage;
      newLanguage.push(jsonForProject.default_human_language);
      jQuery.grep(jsonForProject.other_human_languages, function(el) {
        if (jQuery.inArray(el, newSecLanguage) == -1) newLanguage.push(el);
      });

      UserDetailService.projectLanguage = [];
      UserDetailService.projectLanguage = newLanguage;
      console.log(jsonForProject);
      jsonForProject["id"] = $scope.json["id"];
      jsonForProject["default_module_id"] = $scope.json["default_module_id"];
      jsonForProject["createdby"] = $scope.json["createdby"];
      //var msg="Please Wait....Project is getting updated!";
      //$scope.showWaitingDialog('sm',jsonForProject,$routeParams.action);
      $scope.showWaitingDialog("sm", jsonForProject, "", $routeParams.action);
      /*$scope.pleaseWaitDialog('sm');
	   $timeout(function() {
	   $http.post(RestURL.baseURL + 'project/update_project/', jsonForProject)
	   .success(function(data){
	   var msg='Project Successfully ' + $routeParams.action + 'd !';
	   $scope.openSaveDialog('sm',msg);
  
	   }).error(function(data){
	   $log.log(data);
	   });
	   }, 3000);*/
    };

    $scope.addModule = function(module, projId) {
      $scope.Checkpredefined_activities("sm", module, projId, "add_module");
      /*$scope.pleaseWaitDialog('sm');
	   var msg='Module Successfully added!';
	   var url = RestURL.baseURL + 'module/add_module/';
	   $timeout(function() {
	   $http({
	   method : "POST",
	   url : url,
	   data : {
	   name: module.name,
	   label: module.label,
	   description: module.description,
	   projectid: $scope.json['id'],
	   base_location: module.location_path,
	   predefined_activity_id: module.id
	   },
	   headers : {
	   "content-type" : "application/json",
	   "Accept" : "application/json"
	   },
	   }).success(function(data){
	   var msg='Module Successfully added!';
	   $scope.openSaveDialog('sm',msg);
	   $scope.deleteCookies();
	   $location.url("/en-US/project/update");
	   $scope.getAllPredefinedActivities();
	   }).error(function(data){
	   alert("error");
	   $log.log("add module"+data);
	   });
	   }, 3000);*/
    };

    /**
	 * activity creation
	 */
    $scope.activity = {
      id: 0,
      name: "",
      activity_types: [],
      projectid: $scope.json["id"],
      moduleid: $scope.json["default_module_id"],
      primary_noun: {},
      secondary_nouns: [],
      tablet_screens: [],
      phone_screens: [],
      pc_screens: [],
      notes: "<div><br></div>",
      label: "",
      description: "",
      module_type: ""
    };

    /**
	 * creating new activity
	 */
    $scope.createActivityNow = function() {
      $log.log("creating new activity!");

      if (!$scope.checkProjectIsExists($scope.activity)) {
        return;
      }

      $http({
        url: RestURL.baseURL + "activity/create_activity/",
        data: angular.toJson($scope.activity),
        method: "POST",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(response) {
          if (response != "") {
            $scope.activity = {
              id: 0,
              name: "",
              activity_types: [],
              projectid: $scope.json["id"],
              moduleid: $scope.json["default_module_id"],
              primary_noun: {},
              secondary_nouns: [],
              tablet_screens: [],
              phone_screens: [],
              pc_screens: [],
              notes: "<div><br></div>",
              label: "",
              description: ""
            };

            $scope.activities.push(response);
            $scope.$broadcast("activityChangeEvent", "");
            /**This code is used to close the modal*/
            instance.close("dismiss");
          } else {
            /**This code is used to show the message exist or not. it binds the message in html file that project_an.html*/
            console.log(
              "$$ This name is already exist in the table. try to use another name please."
            );
            $scope.myForm.name.$setValidity("ntValidName", false);
            /** time to dispaly message. it will be neccessary. for that i put the code here**/
            /** $timeout(function(){
				  $scope.myForm.name.$setValidity("ntValidName", true);
			   }, 10000);*/
          }
        })
        .error(function(response) {});
    };

    $scope.deleteActivityObj = {};

    $scope.setDeleteActivityObj = function(activityObj) {
      $log.log("setting delete obj for activity");
      $scope.deleteActivityObj = activityObj;
    };

    /**
	 * delete activity
	 */
    $scope.deleteActivity = function() {
      $log.log("delete activity has been called!", $scope.deleteActivityObj);

      $http({
        url: RestURL.baseURL + "activity/delete_activity/",
        data: angular.toJson($scope.deleteActivityObj),
        method: "POST",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(response) {
          $log.debug("deleting activity!");
          var delIdx = -1;
          for (var idx in $scope.activities) {
            if ($scope.activities[idx].id == $scope.deleteActivityObj.id) {
              delIdx = idx;
              break;
            }
          }

          if (delIdx > -1) {
            $scope.activities.splice(delIdx, 1);
          }

          $scope.$broadcast("activityChangeEvent", "");

          $scope.deleteCookies();
          $location.url("/en-US/project/update");
          $scope.getAllPredefinedActivities();
        })
        .error(function(response) {});
    };

    $scope.deleteProjectTemplateObj = {};

    $scope.setDeleteProjectTemplate = function(projectTemplateObj) {
      $log.log("setting delete obj for project template");
      $scope.deleteProjectTemplateObj = projectTemplateObj;
    };

    /**
	 * delete activity
	 */
    $scope.deleteProjectTemplate = function() {
      $log.log(
        "delete project template  has been called!",
        $scope.deleteProjectTemplateObj
      );

      $http
        .get(
          RestURL.baseURL +
            "projecttemplate/delete/?id=" +
            $scope.deleteProjectTemplateObj.projectTemplateId
        )
        .success(function(response) {
          $log.debug("deleting project template!");
          var delIdx = -1;
          for (var idx in $scope.projectTemplates) {
            if (
              $scope.projectTemplates[idx].projectTemplateId ==
              $scope.deleteProjectTemplateObj.projectTemplateId
            ) {
              delIdx = idx;
              break;
            }
          }
          if (delIdx > -1) {
            $scope.projectTemplates.splice(delIdx, 1);
          }
          $scope.$broadcast("activityChangeEvent", "");
          $scope.deleteCookies();
          $location.url("/en-US/project/update");
          //$scope.getAllPredefinedActivities();
        })
        .error(function(response) {});
    };

    /**
	 * project template creation
	 */
    $scope.projectTemplate = {
      projectId: $scope.json["id"],
      name: "",
      label: "",
      description: "",
      device: ""
    };

    /**
	 * creating new project template
	 */
    $scope.createProjectTemplateNow = function() {
      $log.log("creating new project template!");

      if (!$scope.checkProjectIsExists($scope.projectTemplate)) {
        return;
      }
      $http({
        url: RestURL.baseURL + "projecttemplate/create/",
        data: angular.toJson($scope.projectTemplate),
        method: "POST",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(response) {
          if (response != null) {
            $scope.projectTemplate = {
              projectId: $scope.json["id"],
              name: "",
              label: "",
              description: "",
              device: ""
            };
            $scope.projectTemplates.push(response);
            $scope.$broadcast("templateChangeEvent", "");
          }
        })
        .error(function(response) {});
    };

    $scope.noun = {
      technicalname: "",
      activitiesusedin: "",
      cacheenabled: "",
      cacheable: true,
      parents: [],
      children: [],
      nounattributes: [],
      name: "",
      description: "",
      projectid: $scope.json["id"],
      moduleid: $scope.json["default_module_id"],
      label: "",
      notes: ""
    };

    /**
	 * create noun
	 */

    $scope.get_mongo_noun = function(selected_db) {
      console.log("======ONLY OBJECT===>", selected_db);
      console.log("=========>", JSON.stringify(selected_db));
      $http({
        url: RestURL.baseURL + "noun/get_mongo_noun/",
        data: selected_db,
        method: "POST",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(response) {
          console.log("data=========>", response);
          $scope.list_of_mongo_nouns = response;
          x;
        })
        .error(function(response) {});
    };

    $scope.get_couch_design = function(selected_design) {
      console.log("design " + angular.toJson(selected_design));
      //ajax for views
      console.log("success");
      $scope.isDisabled = true;
      console.log("inside success of get_all_couch_views");
      $http
        .get(
          RestURL.baseURL + "noun/get_all_couch_views/" + selected_design.design
        )
        .success(function(data) {
          console.log(angular.toJson(data));
          $scope.couch_views = data;
        })
        .error(function(data) {
          console.log(data);
        });
    };
    $scope.get_couch_views = function(selected_views) {
      console.log("data====views=====>", angular.toJson(selected_views));

      $http({
        url: RestURL.baseURL + "noun/get_couch_noun/",
        data: angular.toJson(selected_views),
        method: "POST",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(data) {
          console.log("data===vies respnse ======>", data.attribute);
          $scope.list_of_mongo_nouns = data;
        })
        .error(function(data) {});
    };

    //couch db noun
    $scope.get_couch_noun = function(selected_db) {
      $log.log("selected_db " + angular.toJson(selected_db.bucket));

      //ajax for design
      $log.log("success");
      $scope.isDisabled = true;
      $log.log("inside success of get_all_couch_design");
      $http
        .get(
          RestURL.baseURL + "noun/get_all_couch_design/" + selected_db.bucket
        )
        .success(function(data) {
          console.log(angular.toJson(data));
          $scope.couch_desing = data;
        })
        .error(function(data) {
          $log.log(data);
        });
    };
    $scope.responseobjecttype = {
      value: -1
    };
    $scope.test = function() {
      console.log("-- > " + $scope.responseobjecttype.value);
    };
    $scope.import_other_noun = function() {
      $log.log("dbselected " + $scope.test.values);
      $log.log("inside success of importing");

      $scope.openpopModal("alert", "wait", "sm", "Importing data.....");
      $http({
        url: RestURL.baseURL + "couch/import_noun/" + $scope.json["id"],
        data: angular.toJson($scope.json["id"]),
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(response) {
          // ajax for buckets
          $scope.modalClose();
          var msg = "Database Successfully Imported !";
          $scope.openSaveDialog("sm", msg);
          $log.log("success");
          $scope.isDisabled = true;
          $log.log("inside success of get_all_couch_buckets");
          $http
            .get(RestURL.baseURL + "noun/get_all_couch_buckets/")
            .success(function(data) {
              console.log(angular.toJson(data));
              $scope.other_nouns = data;

              //ajax for views
              /*log.log("success")
				  $scope.isDisabled = true;
				   $log.log("inside success of get_all_couch_views")
				   $http.get(RestURL.baseURL + 'noun/get_all_couch_views/')
				   .success(function (data) {
					   console.log(angular.toJson(data));
				   }).error(function(data){
					   $log.log(data);
				   })*/
            })
            .error(function(data) {
              $log.log(data);
            });
        })
        .error(function(response) {
          $log.log(response);
        });
    };
    if ($scope.json["id"]) {
      $http
        .get(
          RestURL.baseURL +
            "RestSwaggerNounController/get_operations_by_project_id/?project_id=" +
            $scope.json["id"]
        )
        .success(function(data) {
          console.log(angular.toJson(data));
          $scope.restLinkData = data;
          console.error(
            "display whole rest lin kend data ",
            angular.toJson($scope.restLinkData)
          );
        })
        .error(function(data) {
          $log.log("No Data Available");
        });
    }

    $scope.updateRestEdPoint = function(restData) {
      //alert("in update rest end "+ angular.toJson(restData));
      $http({
        url:
          RestURL.baseURL +
          "RestSwaggerNounController/update_rest_endpoint_data/",
        data: restData,
        method: "POST",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(response) {
          var msg = "Rest End point updated successfully !";
          $scope.get_all_noun_rest_endpoint();
          $scope.displaysec = false;
          $scope.openSaveDialog("sm", msg);
        })
        .error(function(response) {
          console.log(response);
        });
    };

    $scope.deleteRestEdPoint = function(restData) {
      console.error("in update rest end ", angular.toJson(restData));
      $http({
        url:
          RestURL.baseURL +
          "RestSwaggerNounController/delete_rest_endpoint_data/?id=" +
          restData.id,
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(response) {
          var msg = "Rest End point deleted successfully !";
          $scope.openSaveDialog("sm", msg);
          $scope.get_all_noun_rest_endpoint();
          $scope.displaysec = false;
        })
        .error(function(response) {
          $log.log("Error :");
        });
    };

    //update LotusNote

    $scope.updateLotusNote = function(lotusData) {
      console.error("in update rest end ", angular.toJson(lotusData));
      $http({
        url:
          RestURL.baseURL +
          "RestSwaggerNounController/update_lotus_notes_data/",
        data: lotusData,
        method: "POST",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(response) {
          var msg = "LotusNote updated successfully !";
          $scope.openSaveDialog("sm", msg);
        })
        .error(function(response) {
          $log.log("Error :");
        });
    };
    //delete
    $scope.deleteLotusNote = function(lotusData) {
      console.error("in update LotusNote ", angular.toJson(lotusData));
      $http({
        url:
          RestURL.baseURL +
          "RestSwaggerNounController/delete_lotus_notes_data/?id=" +
          lotusData.id,
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(response) {
          var msg = "LotusNote deleted successfully !";
          $scope.openSaveDialog("sm", msg);
          $http
            .get(
              RestURL.baseURL +
                "RestSwaggerNounController/get_lotusNotes_by_project_id/?project_id=" +
                $scope.json["id"]
            )
            .success(function(data) {
              console.log(angular.toJson(data));
              $scope.lotusNoteData = data;
              console.error(
                "display whole lotus note data ",
                angular.toJson($scope.lotusNoteData)
              );
            })
            .error(function(data) {
              ($scope.lotusNoteData = ""),
                console.log("if no data available..... ", $scope.lotusNoteData);
              $log.log("No Data Available");
            });
        })
        .error(function(response) {
          $log.log("Error :");
        });
    };

    //getall lotusnotes
    if ($scope.json["id"] != undefined) {
      $http
        .get(
          RestURL.baseURL +
            "RestSwaggerNounController/get_lotusNotes_by_project_id/?project_id=" +
            $scope.json["id"]
        )
        .success(function(data) {
          console.log(angular.toJson(data));
          $scope.lotusNoteData = data;
          //console.error("display whole lotusNote data---->", angular.toJson($scope.lotusNoteData));
        })
        .error(function(data) {
          $log.log("No Data Available");
        });
    }
    //Rest endpoint section
    $scope.restlink = {};
    $scope.addrestLink = function(link) {
      console.log("link for address Link ", angular.toJson(link));
      $scope.restlink.project_id = $scope.json["id"];
      $scope.restlink.user_id = 0;
      $scope.restlink.status = "Inserted";
      console.log($scope.json["id"]);
      $http({
        url: RestURL.baseURL + "noun/save_rest_link/",
        data: angular.toJson($scope.restlink),
        method: "POST",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(response) {
          //alert('Success');
          //$scope.restlink.rest_endpoint = '';
          $scope.restlink = {};
          console.log("Inside Success restlink.wsdl_endpoint Method");
          var msg = "Rest End point saved !";
          $scope.openSaveDialog("sm", msg);
          $http
            .get(
              RestURL.baseURL +
                "RestSwaggerNounController/get_operations_by_project_id/?project_id=" +
                $scope.json["id"]
            )
            .success(function(data) {
              console.log(angular.toJson(data));
              $scope.restLinkData = data;
              console.error(
                "display whole rest lin kend data ",
                angular.toJson($scope.restLinkData)
              );
              $scope.get_all_noun_rest_endpoint();
            })
            .error(function(data) {
              $log.log("No Data Available");
            });
        })
        .error(function(response) {
          console.log("Inside error restlink.wsdl_endpoint Method");
          var msg = "Rest End point not saved !";
          $scope.openSaveDialog("sm", msg);
          $scope.restlink.rest_endpoint = "";
        });
    };

    $scope.getRestLinkData = function(SelectedSwaggerNoun) {
      $scope.restLinkData = null;

      $http
        .get(
          RestURL.baseURL +
            "RestSwaggerNounController/get_operations_by_project_and_restendpoint/?project_id=" +
            $scope.json["id"] +
            "&rest_endpoint=" +
            SelectedSwaggerNoun.rest_endpoint
        )
        .success(function(data) {
          //console.log(angular.toJson(data));
          $scope.restLinkData = data;
          //console.error("display whole rest lin kend data ", angular.toJson($scope.restLinkData));
        })
        .error(function(data) {
          $log.log("No Data Available");
        });
    };

    $scope.lotusNote = {};
    $scope.addLotusNotes = function(note) {
      console.log("link for address url ", angular.toJson(note));
      $scope.lotusNote.project_id = $scope.json["id"];
      //$scope.lotusNote.user_id = 0;
      console.log($scope.json["id"]);
      $http({
        url: RestURL.baseURL + "noun/save_lotus_note/",
        data: angular.toJson($scope.lotusNote),
        method: "POST",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(response) {
          //alert('Success');
          //$scope.restlink.rest_endpoint = '';
          $scope.lotusNote = {};
          console.log("Inside Success restlink.wsdl_endpoint Method");
          var msg = "lotus Note saved !";
          $scope.openSaveDialog("sm", msg);
          $http
            .get(
              RestURL.baseURL +
                "RestSwaggerNounController/get_lotusNotes_by_project_id/?project_id=" +
                $scope.json["id"]
            )
            .success(function(data) {
              console.log(angular.toJson(data));
              $scope.lotusNoteData = data;
              console.error(
                "display whole lotusNote data ",
                angular.toJson($scope.lotusNoteData)
              );
            })
            .error(function(data) {
              $log.log("No Data Available");
            });
        })
        .error(function(response) {
          //console.log('Inside error restlink.wsdl_endpoint Method')
          var msg = "lotus Note not saved !";
          $scope.openSaveDialog("sm", msg);
          $scope.lotusNote.server_url = "";
        });
    };

    $scope.uploadlotusdxlfile = function() {
      $scope.openUploadingDialog("md", file.files[0], $scope.json["id"]);
      /*
		var formData=new FormData();
		formData.append("file",file.files[0]);
		formData.append("projectId",$scope.json['id']);
		formData.append("job_type",'dxl_import');
		$scope.openpopModal('alert', 'wait', 'sm', 'Uploading File..');
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
				 $scope.modalClose();
				 var msg='File Uploaded!';
				 $scope.openSaveDialog('sm',msg);
			}).error(function (response){
				 var msg='DXL file uploaded failed ';
				 $scope.openSaveDialog('sm',msg);
			});
			*/
    };

    $scope.get_all_noun_rest_endpoint = function() {
      $log.log("inside REST SWAGGER - >  ");

      $http({
        url:
          RestURL.baseURL +
          "RestSwaggerNounController/get_all_swagger_endpoint_by_project_id/?project_id=" +
          $scope.json["id"],
        data: angular.toJson($scope.json["id"]),
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(data) {
          console.warn("data----->" + angular.toJson(data));
          $scope.restNounEndPointList = data;
        })
        .error(function(data) {
          $log.log(data);
        });
    };

    $scope.get_all_noun_rest_endpoint();

    $scope.get_all_noun_rest_endpointForImport = function() {
      $log.log("inside REST SWAGGER - >  ");
      $http({
        url:
          RestURL.baseURL +
          "RestSwaggerNounController/get_all_swagger_endpoint_by_project_id/?project_id=" +
          $scope.json["id"],
        data: angular.toJson($scope.json["id"]),
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(data) {
          console.warn("data----->" + angular.toJson(data));
          $scope.restNounEndPointLists = data;
        })
        .error(function(data) {
          $log.log(data);
        });
    };
    $scope.displaysec = false;

    $scope.get_swagger_endpoint_details = function(SelectedSwaggerNoun) {
      $scope.getRestApiList(SelectedSwaggerNoun);
      $scope.getRestLinkData(SelectedSwaggerNoun);
      $scope.displaysec = true;
    };

    $scope.get_swagger_endpoint_noun = function(SelectedSwaggerNoun) {
      console.log(
        "to get Nonos s------------------------+",
        angular.toJson(SelectedSwaggerNoun)
      );
      $log.log("inside selected wsdl");
      $scope.SelectedSwaggerNoun = SelectedSwaggerNoun;
      $http({
        url:
          RestURL.baseURL +
          "RestSwaggerNounController/get_swagger_dto_by_project_id/?project_id=" +
          SelectedSwaggerNoun.project_id +
          "&swagger_id=" +
          SelectedSwaggerNoun.id,
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(data) {
          $scope.SelectedSwaggerNounList = data;
          $log.log(
            "---get_swagger_endpoint_noun -->" +
              angular.toJson($scope.SelectedSwaggerNounList)
          );
        })
        .error(function(data) {
          $log.log(data);
        });
    };

    $scope.selectedrestapi = {};
    $scope.restendpoint = "";
    $scope.customrestdata = {};
    $scope.getRestApiList = function(SelectedSwaggerNoun) {
      $scope.restendpoint = SelectedSwaggerNoun.rest_endpoint;
      $http({
        url:
          RestURL.baseURL +
          "RestSwaggerNounController/get_swagger_rest_apis/?project_id=" +
          SelectedSwaggerNoun.project_id +
          "&swagger_id=" +
          SelectedSwaggerNoun.id,
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(data) {
          $scope.restApiList = data;
          if (Object.keys($scope.restApiList).length > 0) {
            $scope.customrestdata.user_id = $scope.restApiList[0].user_id;
            $scope.customrestdata.swagger_id = $scope.restApiList[0].swagger_id;
            $scope.customrestdata.project_id = $scope.restApiList[0].project_id;
          }

          $log.log(
            "---get_swagger_endpoint_noun -->" +
              angular.toJson($scope.customrestdata)
          );
        })
        .error(function(data) {
          $log.log(data);
        });
    };

    $scope.getInputParams = function(restapi) {
      $scope.customrestdata.rest_operation_details_id = restapi.id;
      $scope.selectedrestapi = restapi.restapi;
      $scope.displayToSave = "";

      $http
        .get(
          RestURL.baseURL +
            "RestSwaggerNounController/find_rest_parameter_values_by_operation_and_user_id/?rest_operation_details_id=" +
            restapi.id +
            "&user_id=" +
            restapi.user_id
        )
        .success(function(data) {
          if (data.length > 0) {
            $scope.displayToSave = false;
            $scope.updateparams = data;
          } else if (data.length == 0) {
            $http
              .get(
                RestURL.baseURL +
                  "RestSwaggerNounController/get_swagger_dto_parameter_by_project_id/?rest_operation_details_id=" +
                  restapi.id
              )
              .success(function(data) {
                $scope.inputparams = data;
                $scope.displayToSave = true;
                $http
                  .get(
                    RestURL.baseURL +
                      "RestSwaggerNounController/get_swagger_operation_details_by_id/?rest_operation_details_id=" +
                      restapi.id +
                      "&project_id=" +
                      restapi.project_id
                  )
                  .success(function(data) {
                    $scope.operationmethod = data.operationmethod;
                  })
                  .error(function(data) {
                    $log.log(data);
                  });
              })
              .error(function(data) {
                $log.log(data);
              });
          }
        })
        .error(function(data) {
          $scope.displayToSave = true;
          $http
            .get(
              RestURL.baseURL +
                "RestSwaggerNounController/get_swagger_dto_parameter_by_project_id/?rest_operation_details_id=" +
                restapi.id
            )
            .success(function(data) {
              $scope.inputparams = data;
            })
            .error(function(data) {
              $log.log(data);
            });
        });
    };
    $scope.jsonwrapperkey = {
      val: "Entervalue"
    };
    $scope.saveResponseObject = function(responsetype) {
      console.log("$scope.inputparams - > ", $scope.inputparams);
      console.error("responsetype-     >>>>    ", responsetype);
      console.error("jsonwrapperkey-     >>>>    ", $scope.jsonwrapperkey.val);
      if ($scope.inputparams.length == 0) {
        $scope.inputparams = [{}];

        $scope.inputparams[0].rest_link = $scope.selectedrestapi;
        $scope.inputparams[0].restendpoint = $scope.restendpoint;
        $scope.inputparams[0].project_id = $scope.customrestdata.project_id;
        $scope.inputparams[0].user_id = $scope.customrestdata.user_id;
        $scope.inputparams[0].rest_operation_details_id =
          $scope.customrestdata.rest_operation_details_id;
      } else {
        $scope.inputparams[0].rest_link = $scope.selectedrestapi;
        $scope.inputparams[0].restendpoint = $scope.restendpoint;
      }

      //alert(JSON.stringify($scope.selectedrestapi));

      $http({
        url:
          RestURL.baseURL +
          "RestSwaggerNounController/saveresponseobject/" +
          responsetype +
          "/" +
          $scope.jsonwrapperkey.val,
        data: $scope.inputparams,
        method: "POST",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(response) {
          openDialog($modal, response.status);
          /*	     	 $scope.nouns = response;
		  
			  $http.get(RestURL.baseURL + 'noun/get_all_nouns_by_project_id/?project_id=' + rest_noun.project_id
			  ).success(function (response) {
			  $scope.nouns = response;
			 
			  var msg='Noun Successfully Added !';
			  $scope.openSaveDialog('sm',msg);
			  
			   })
		   .error(function (response) {
			   console.error("error in attribure")
		   });*/
        })
        .error(function(response) {
          console.error("error in attribure");
        });
    };

    $scope.updateResponseObject = function() {
      //alert(JSON.stringify($scope.selectedrestapi));
      console.error(
        "data idiojfufjfuiorfjko-=0-=0-0--0>>>>>> ",
        angular.toJson($scope.updateparams)
      );
      $http({
        // Tomorrow I wsikll see you from here ...
        url: RestURL.baseURL + "RestSwaggerNounController/updateresponseobject",
        data: $scope.updateparams,
        method: "POST",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(response) {
          openDialog($modal, "Message: " + response.status);
          console.log("data inserted successfully....");
        })
        .error(function(response) {
          openDialog($modal, response.status);
        });
    };

    $scope.addSwaggerRestEndpointNoun = function(rest_noun) {
      console.error(
        "selected --------------------- > >  >  ------------- ",
        angular.toJson(rest_noun)
      );
      rest_noun.project_id = $scope.json["id"];

      /*	$http({
		 url: RestURL.baseURL + 'RestSwaggerNounController/get_rest_noun_swagger_and_attribute/?id='+rest_noun.id,
		 method: 'GET',
		 headers: {
		   'Accept': 'application/json'
		 }
		}).success(function (data) {
			$log.log("success")
			console.log("data----->"+angular.toJson(data))
			 $scope.openpopModal('alert', 'wait', 'sm', 'Adding, Please Wait.....');
  
	   $http({
		url: RestURL.baseURL + 'RestSwaggerNounController/nouns_to_add_into_project/'+rest_noun.nouns+'/'+rest_noun.project_id,
		data: angular.toJson(data),
		method: 'POST',
		headers: {
		  'Accept': 'application/json'
		}
	  })
	 .success(function (response){
		  $scope.nouns = response;
	  
		  $http.get(RestURL.baseURL + 'noun/get_all_nouns_by_project_id/?project_id=' + rest_noun.project_id
		  ).success(function (response) {
		  $scope.nouns = response;
		 
		  var msg='Noun Successfully Added !';
		  $scope.openSaveDialog('sm',msg);
		  
		   })
	   .error(function (response) {
		   console.error("error in attribure")
	   });
	  })
	 .error(function (response) {
		 console.error("error in attribure")
	 });
		}).error(function (response){
		console.error("error in get class and attribute")
			})*/

      $http
        .get(
          RestURL.baseURL +
            "RestSwaggerNounController/get_swagger_dto_parameter_by_project_id/?rest_operation_details_id=" +
            rest_noun.id
        )
        .success(function(data) {
          //  $scope.nouns = response;

          /* var msg='Noun Successfully Added !';
	   $scope.openSaveDialog('sm',msg);*/
          console.log("rest_noun.id - >>> " + rest_noun.id);
          $http({
            url:
              RestURL.baseURL +
              "RestSwaggerNounController/nouns_to_add_into_project/" +
              rest_noun.operationname +
              "/" +
              rest_noun.project_id +
              "/" +
              rest_noun.id,
            data: angular.toJson(data),
            method: "POST",
            headers: {
              Accept: "application/json"
            }
          })
            .success(function(response) {
              $scope.modalClose();
              $scope.nouns = response;

              $http
                .get(
                  RestURL.baseURL +
                    "noun/get_all_nouns_by_project_id/?project_id=" +
                    rest_noun.project_id
                )
                .success(function(response) {
                  $scope.nouns = response;

                  var msg = "Noun Successfully Added !";
                  $scope.openSaveDialog("sm", msg);
                })
                .error(function(response) {
                  console.error("error in attribure");
                  openDialog($modal, "Error Occured in Noun Import..!");
                });
            })
            .error(function(response) {
              $scope.modalClose();
              openDialog($modal, "Error Occured While Importing Noun..!");
            });
        })
        .error(function(response) {
          console.error("error in attribure");
        });
    };

    //  WSDL nouns

    // Storing the Wsdl link method
    $scope.link = {};
    $scope.addWsdlLink = function(link) {
      //    	$scope.link = angular.copy(link);
      console.log("link =>", angular.toJson($scope.link.wsdl_endpoint));
      $scope.link.project_id = $scope.json["id"];
      $scope.link.user_id = 0;
      console.log($scope.json["id"]);
      $http({
        url: RestURL.baseURL + "noun/save_wsdl_link/",
        data: angular.toJson($scope.link),
        method: "POST",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(response) {
          $scope.link.wsdl_endpoint = "";
          console.log("Inside Success addWsdl Method");
          var msg = "WSDL End point saved !";
          $scope.openSaveDialog("sm", msg);
        })
        .error(function(response) {
          console.log("Inside eRRROR addWsdl Method");
          var msg = "Rest End point not saved !";
          $scope.openSaveDialog("sm", msg);
          $scope.link.wsdl_endpoint = "";
        });
    };

    $scope.noun_wsdl = function() {
      $log.log("inside noun wsdl");
      $http({
        url:
          RestURL.baseURL +
          "wsdlNoun/get_all_wsdl_by_project_id/?project_id=" +
          $scope.json["id"],
        data: angular.toJson($scope.json["id"]),
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(data) {
          $log.log("success");
          console.log("data----->" + angular.toJson(data));
          $scope.wsdlname = data;
        })
        .error(function(data) {
          $log.log(data);
        });
    };

    $scope.get_class = function(SelectedWSDL) {
      $log.log("inside selected wsdl");
      $log.log("SelectedWSDL------->" + angular.toJson(SelectedWSDL));
      $scope.selectedWSDL = SelectedWSDL;
      console.log(
        RestURL.baseURL +
          "wsdlNoun/get_all_class_from_wsdl/?wsdlId=" +
          SelectedWSDL.wsdlId +
          "&project_id=" +
          SelectedWSDL.project_id
      );
      $http({
        url:
          RestURL.baseURL +
          "wsdlNoun/get_all_class_from_wsdl/?wsdlId=" +
          SelectedWSDL.wsdlId +
          "&project_id=" +
          SelectedWSDL.project_id,
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(data) {
          $log.log("success");
          console.log("data---class Name-->" + angular.toJson(data));
          $scope.classname = data;
        })
        .error(function(data) {
          $log.log(data);
        });
    };

    /* $scope.view_import_other_noun = function(){
		
	  $log.log("inside success of importing")
	  $http.get(RestURL.baseURL + 'noun/get_all_predefined_nouns/')
	  .success(function (data) {
	   $scope.other_nouns = data ;
	  }).error(function (data) {
	  $log.log(data);
	  });
	  }
   */
    $scope.addwsdlNoun = function(wsdl_noun) {
      console.log("selected wsdl noun", wsdl_noun);
      wsdl_noun.project_id = $scope.json["id"];

      $scope.openpopModal(
        "alert",
        "wait",
        "sm",
        "Importing WSDL_Noun Please Wait..!"
      );

      $http({
        url:
          RestURL.baseURL +
          "wsdlNoun/get_class_and_attribute/?id=" +
          wsdl_noun.id,
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(data) {
          $log.log("success");
          console.log("data----->" + angular.toJson(data));
          $http({
            url:
              RestURL.baseURL +
              "wsdlNoun/selected_other_noun/" +
              wsdl_noun.class_name +
              "/" +
              wsdl_noun.project_id,
            data: angular.toJson(data),
            method: "POST",
            headers: {
              Accept: "application/json"
            }
          })
            .success(function(response) {
              $scope.nouns = response;

              $http
                .get(
                  RestURL.baseURL +
                    "noun/get_all_nouns_by_project_id/?project_id=" +
                    wsdl_noun.project_id
                )
                .success(function(response) {
                  $scope.nouns = response;

                  $scope.modalClose();
                  var msg = "Noun Successfully Added !";
                  $scope.openSaveDialog("sm", msg);
                })
                .error(function(response) {
                  console.error("error in attribure1 ");
                });
            })
            .error(function(response) {
              $scope.modalClose();
              var msg = "WSDL_Noun already present..!";
              $scope.openSaveDialog("sm", msg);
            });
        })
        .error(function(response) {
          console.error("error in get class and attribute");
        });
    };

    // Storing the LotesNotes
    /* $scope.lotusNote = {};
  $scope.addLotusNotes = function(note){
  
	 console.log('notes =>',angular.toJson($scope.note));
	 $scope.lotusNote.project_id = $scope.json['id'];
	 $scope.lotusNote.user_id = 0;
	 console.log($scope.json['id']);
	 $http({
		 url: RestURL.baseURL + 'noun/save_lotus_notes/',
		 data: angular.toJson($scope.lotusNote),
		 method: 'POST',
		 headers: {
		   'Accept': 'application/json'
		 }
	   })
		 .success(function (response) {
			 $scope.lotusNote.server_url = '';
			 console.log('Inside Success addLotus Method')
			  var msg='LotusNote saved !';
			 $scope.openSaveDialog('sm',msg);
		 }).error(function (response){
			 console.log('Inside eRRROR addWsdl Method')
			  var msg='LotusNote not saved !';
			 $scope.openSaveDialog('sm',msg);
			 $scope.lotusNote.server_url = '';
		 });
  }*/

    $scope.get_Lotus_Nouns = function(SelectedLOTUS) {
      $log.log("inside selected wsdl");
      $log.log("SelectedWSDL------->" + angular.toJson(SelectedLOTUS));
      $scope.selectedLOTUS = SelectedLOTUS;
      console.log(
        RestURL.baseURL +
          "lotusNoun/get_all_nouns_from_lotus/?lotusId=" +
          SelectedLOTUS.lotusId +
          "&project_id=" +
          SelectedLOTUS.project_id
      );
      $http({
        url:
          RestURL.baseURL +
          "lotusNoun/get_all_nouns_from_lotus/?lotusId=" +
          SelectedLOTUS.lotusId +
          "&project_id=" +
          SelectedLOTUS.project_id,
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(data) {
          $log.log("success");
          console.log("data---note Name-->" + angular.toJson(data));
          $scope.classname = data;
        })
        .error(function(data) {
          $log.log(data);
        });
    };

    $scope.addLotusNoun = function(lotus_noun) {
      console.log("selected lotus noun", lotus_noun);
      lotus_noun.project_id = $scope.json["id"];

      $http({
        url:
          RestURL.baseURL +
          "lotusNoun/get_notes_and_attribute/?id=" +
          lotus_noun.id,
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(data) {
          $log.log("success");
          console.log("data----->" + angular.toJson(data));
          $http({
            url:
              RestURL.baseURL +
              "lotusNoun/selected_other_noun/" +
              lotus_noun.class_name +
              "/" +
              lotus_noun.project_id,
            data: angular.toJson(data),
            method: "POST",
            headers: {
              Accept: "application/json"
            }
          })
            .success(function(response) {
              $scope.nouns = response;

              $http
                .get(
                  RestURL.baseURL +
                    "noun/get_all_nouns_by_project_id/?project_id=" +
                    lotus_noun.project_id
                )
                .success(function(response) {
                  $scope.nouns = response;

                  var msg = "Noun Successfully Added !";
                  $scope.openSaveDialog("sm", msg);
                })
                .error(function(response) {
                  console.error("error in attribure");
                });
            })
            .error(function(response) {
              console.error("error in attribure");
            });
        })
        .error(function(response) {
          console.error("error in get class and attribute");
        });
    };

    //

    $scope.addDefaultNoun = function(selected_other_noun) {
      console.log("selected other noun", selected_other_noun);
      selected_other_noun.project_id = $scope.json["id"];
      $scope.openpopModal("alert", "wait", "sm", "Adding Nouns.....");

      console.log("****dewfwesfsdfsscfsdcsdfsd**", selected_other_noun);
      $http({
        url: RestURL.baseURL + "noun/selected_other_noun/",
        data: selected_other_noun,
        method: "POST",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(response) {
          $scope.nouns.push(response);
          $scope.modalClose();
          var msg = "Noun Successfully Added !";
          $scope.openSaveDialog("sm", msg);
        })
        .error(function(response) {});
    };

    $scope.createNounNow = function() {
      if (!$scope.checkProjectIsExists($scope.noun)) {
        return;
      }
      $http({
        url: RestURL.baseURL + "noun/create_noun/",
        data: angular.toJson($scope.noun),
        method: "POST",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(response) {
          if (response != "") {
            $log.log("noun has been created successfully!");
            $scope.noun = {
              technicalname: "",
              activitiesusedin: "",
              cacheenabled: "",
              cacheable: true,
              parents: [],
              children: [],
              nounattributes: [],
              name: "",
              description: "",
              projectid: $scope.json["id"],
              moduleid: $scope.json["default_module_id"],
              label: "",
              notes: ""
            };
            $scope.nouns.push(response);
            $scope.getAllActivities($scope, $scope.json["id"]);
            instance.close("dismiss");
          } else {
            /**This code is used to show the message exist or not. it binds the message in html file that project_an.html*/
            console.log(
              "$$ This name is already exist in the table. try to use another name please."
            );
            $scope.myForm.name.$setValidity("ntValidName", false);
          }
        })
        .error(function(response) {});
    };

    $scope.mxgrapheditor = function() {
      console.log("calling editor");
      //	alert('/en-US/UML_Editor/:'+$scope.json['id']);
      $location.url("/en-US/UML_Editor/:" + $scope.json["id"]);
    };

    /**
	 * update noun
	 */
    $scope.updateNoun = function(noun) {
      $log.log("updating noun:", noun);
      $cookieStore.put("back", "/en-US/project/update/");
      ActivityInfo.setNoun(noun);
      ActivityInfo.setProjectId($scope.json["id"]);
      $location
        .path("/en-US/noun/update")
        .search({ foo: "valueFoo", baz: "valueBaz" });
    };

    $scope.deleteNounObj = {};

    $scope.setDeleteNounObj = function(nounObj) {
      $log.log("setting delete obj for noun");
      $scope.deleteNounObj = nounObj;
    };

    $scope.updateerd = function(erd) {
      console.log("calling editor");
      $location.url(
        "/en-US/UML_Editor/:" +
          $scope.json["id"] +
          "/:" +
          erd.filename +
          "/:" +
          erd.id
      );
    };

    $scope.addErdNountoNounTable = function(erd) {
      console.log("update erd", erd);

      //$location.url('/en-US/UML_Editor/:'+$scope.json['id']+'/:'+erd.filename);

      $http
        .get(
          RestURL.baseURL +
            "xml/get_erdnoun_data_attributes/?nounid=" +
            erd.id +
            "&erdxml_id=" +
            erd.erdxml_id
        )
        .success(function(response) {
          $scope.openpopModal(
            "alert",
            "wait",
            "sm",
            "Parsing and Importing ERD...."
          );
          //	console.log(" --- erd-- > ",response)
          $http({
            url: RestURL.baseURL + "xml/insert_erd_noun_attributes/",
            data: angular.toJson(response),
            method: "POST",
            headers: {
              Accept: "application/json"
            }
          })
            .success(function(response) {
              if (response != "") {
                console.warn("Succes");
              } else {
                console.error("No response is NULL");
              }
              $http
                .get(
                  RestURL.baseURL +
                    "noun/get_all_nouns_by_project_id/?project_id=" +
                    $scope.json["id"]
                )
                .success(function(response) {
                  $scope.nouns = response;
                  $scope.modalClose();
                  var msg = "Imported ERD Successfully!";
                  $scope.openSaveDialog("sm", msg);
                })
                .error(function(response) {
                  $log.log("Error : ", response);
                });
            })
            .error(function(response) {
              console.error("Something went worng..!!!");
            });
        });
    };

    $scope.erd_parser = function(erd) {
      $scope.openpopModal(
        "alert",
        "wait",
        "sm",
        "Parsing and Importing ERD...."
      );
      $http
        .get(
          RestURL.baseURL +
            "xml/get_xml_for_parsing/?id=" +
            erd.id +
            "&project_id=" +
            $scope.json["id"] +
            "&user_id=" +
            $scope.json["createdby"]
        )
        .success(function(response) {
          /*
			console.log("getting nouns from erd")
			$http.get(RestURL.baseURL + 'xml/get_erdnoun_data/?erdxml_id='+erd.id
			).success(function (response) {
				console.log("data----->"+angular.toJson(response))
				$scope.erdnouns = response
			}).error(function (response) {
			  $log.log('Error : ', response);
			});
		*/
          //console.log(" --- erd-- > ",response)
          $http({
            url:
              RestURL.baseURL + "xml/insert_erd_noun_attributes/?id=" + erd.id,
            method: "GET",
            headers: {
              Accept: "application/json"
            }
          }).success(function(response) {
            if (response != "") {
              console.warn("Success..!!!");
            } else {
              console.error("No response is NULL");
            }
            $http
              .get(
                RestURL.baseURL +
                  "noun/get_all_nouns_by_project_id/?project_id=" +
                  $scope.json["id"]
              )
              .success(function(response) {
                $scope.nouns = response;
                $scope.modalClose();
                var msg = "Imported ERD Successfully..!!!";
                $scope.openSaveDialog("sm", msg);
              })
              .error(function(response) {
                $log.log("Error : ", response);
                $scope.modalClose();
                var msg = "Error occured while Importing ERD nouns..!";
                $scope.openSaveDialog("sm", msg);
              });
          });
        })
        .error(function(response) {
          $log.log("Error : ", response);
        });
    };
    if ($scope.json["id"] != undefined) {
      $scope.get_all_erd_parsed_data = function(erd) {
        //console.log("erd data----->"+erd.id)
        $http
          .get(RestURL.baseURL + "xml/get_erdnoun_data/?erdxml_id=" + erd.id)
          .success(function(response) {
            //console.log("data----->"+angular.toJson(response))
            $scope.erdnouns = response;
          })
          .error(function(response) {
            $log.log("Error : ", response);
          });
      };
    }
    $http
      .get(
        RestURL.baseURL +
          "xml/get_xml_by_project_id/?project_id=" +
          $scope.json["id"]
      )
      .success(function(response) {
        $scope.erds = response;
        $scope.get_all_erd_parsed_data($scope.erds[0]);
      })
      .error(function(response) {
        $log.log("Error : ", response);
      });

    $scope.deleteerdnoun = function(erdnoun) {
      //	console.log("erd noun data ------->"+erdnoun.id)

      $http({
        url: RestURL.baseURL + "xml/delete_erd_noun/",
        data: erdnoun,
        method: "POST",
        headers: {
          Accept: "application/json"
        }
      }).success(function(response) {
        $scope.get_all_erd_parsed_data($scope.erds[0]);
      });
    };

    $scope.deleteerd = function(erd) {
      $log.log("delete erd has been called!");

      $http({
        url: RestURL.baseURL + "xml/delete_erd/",
        data: erd,
        method: "POST",
        headers: {
          Accept: "application/json"
        }
      }).success(function(response) {
        $http
          .get(
            RestURL.baseURL +
              "xml/get_xml_by_project_id/?project_id=" +
              $scope.json["id"]
          )
          .success(function(response) {
            $scope.erds = response;
            $http
              .get(
                RestURL.baseURL + "xml/get_erdnoun_data/?erdxml_id=" + erd.id
              )
              .success(function(response) {
                $scope.erdnouns = response;
              })
              .error(function(response) {
                $log.log("Error : ", response);
              });
          })
          .error(function(response) {
            $log.log("Error : ", response);
          });
      });
    };

    /**
	 * delete noun
	 */
    $scope.deleteNoun = function() {
      $log.log("delete noun has been called!", $scope.deleteNounObj);

      $http({
        url: RestURL.baseURL + "noun/delete_noun/",
        data: angular.toJson($scope.deleteNounObj),
        method: "POST",
        headers: {
          Accept: "application/json"
        }
      })
        .success(function(response) {
          var delIdx = -1;
          for (var idx in $scope.nouns) {
            if ($scope.nouns[idx].id == $scope.deleteNounObj.id) {
              delIdx = idx;
              break;
            }
          }

          if (delIdx > -1) {
            $scope.nouns.splice(delIdx, 1);
          }

          $scope.getAllActivities($scope, $scope.json["id"]);
          $scope.disabledButton();
        })
        .error(function(response) {});
    };

    $scope.openProjectComponents = function() {
      if ($routeParams["action"] == "update") {
        $(".project-components").slideToggle();
        $(".create-project-advanced").hide();
        $("html, body").animate(
          {
            scrollTop: $(".project-components").offset().top
          },
          1000
        );
      }
    };

    $scope.accordion = function() {
      $("div.create-project-advanced").slideToggle();
      $("div.project-components").hide();
      $("html, body").animate(
        {
          scrollTop: $("div.create-project-advanced").offset().top
        },
        1000
      );
    };

    /**
	 * modal handler for activity and nouns
	 */
    var instance;
    $scope.openModal = function(action, type, size, msg, title) {
      var modalDataObj = {
        action: action,
        type: type,
        createHandler: $scope.createHandler,
        deleteHandler: $scope.deleteHandler,
        message: msg,
        title: title,
        id: $scope.selectedProjectID
      };
      console.log("modalDataObj=======" + JSON.stringify(modalDataObj));
      instance = $modal.open({
        templateUrl: "app/views/en-US/templates/modals/project/project_an.html",
        controller: "ProjectModalCtrl",
        size: size,
        resolve: {
          modalDataObj: function() {
            return modalDataObj;
          }
        }
      });
      console.log("instance=======" + JSON.stringify(instance));
    };

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

    /**
	 * create handler from modal as callback for noun and activity
	 */
    $scope.createHandler = function(type, obj) {
      $log.log("create in project:", type, obj);
      if (type == "noun") {
        $scope.noun.label = obj.label;
        $scope.noun.name = obj.name;
        $scope.noun.description = obj.description;
        $scope.createNounNow();
      } else if (type == "activity") {
        $scope.activity.label = obj.label;
        $scope.activity.name = obj.name;
        $scope.activity.description = obj.description;
        $scope.activity.module_type = "default";
        $scope.createActivityNow();
      } else if (type == "template") {
        $scope.projectTemplate.label = obj.label;
        $scope.projectTemplate.name = obj.name;
        $scope.projectTemplate.description = obj.description;
        $scope.projectTemplate.device = obj.device;
        $scope.createProjectTemplateNow();
      }
    };

    /**
	 * delete handler from modal as callback for noun and activity
	 */
    $scope.deleteHandler = function(type) {
      $log.log("delete in project:", type);
      if (type == "noun") {
        $scope.deleteNoun();
      } else if (type == "activity") {
        $scope.deleteActivity();
      } else if (type == "template") {
        $scope.deleteProjectTemplate();
      }
    };

    /**
	 * check project is exists
	 */
    $scope.checkProjectIsExists = function(obj) {
      $log.debug("checking project is exists or not!");
      if (obj.projectid || obj.projectId) {
        $log.log("project id is valid!");
        return true;
      }
      $scope.openModal(
        "alert",
        "error",
        "sm",
        "Project is invalid, please create a project and then continue this action!",
        "Invalid Project!"
      );
      $log.log("project id is invalid!");
      return false;
    };

    $scope.additionalLanguageDropdown = function(selectedPrimaryLanguage) {
      $scope.getAllSecondaryLanguages(selectedPrimaryLanguage);
    };

    $scope.disabledButton = function() {
      $http
        .get(
          RestURL.baseURL +
            "noun/get_all_nouns_by_project_id/?project_id=" +
            $scope.json["id"]
        )
        .success(function(data) {
          console.log("starting disabledButton success------", data);
          console.log(
            "starting disabledButton success length------",
            data.length
          );
          if (data.length > 0) {
            console.log("starting disabledButton if condition------", data);
            $scope.disableButton = true;
          } else $scope.disableButton = false;
        })
        .error(function(response) {
          console.log("starting disabledButton fail------");
        });
    };

    $scope.broswerLanguageDetection = function() {
      var lang = $window.navigator.language || $window.navigator.userLanguage;
      console.log("lanag" + lang);
      if (lang === "en-US" || lang === "en") {
        console.log("language is english");
        console.log("$scope.mainLanguages" + $scope.mainLanguages[0]);
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "English") {
            $scope.project.mainLanguage = $scope.mainLanguages[i];
            // $scope.project.mainLanguage = { id : 2 };
          }
        }
      }
      if (lang === "de-de" || lang === "de") {
        console.log("language is German - Germany");
        console.log("$scope.mainLanguages" + $scope.mainLanguages[0]);
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "German") {
            $scope.project.mainLanguage = $scope.mainLanguages[i];
            // $scope.project.mainLanguage = { id : 1 };
          }
        }
      }
      if (lang === "fr" || lang === "fr-fr") {
        console.log("language is French -France");
        console.log("$scope.mainLanguages" + $scope.mainLanguages[0]);
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "French") {
            $scope.project.mainLanguage = $scope.mainLanguages[i];
            // $scope.project.mainLanguage = { id : 3 };
          }
        }
      }
      if (lang === "hy") {
        console.log("language is Armenian");
        console.log("$scope.mainLanguages" + $scope.mainLanguages[0]);
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "Armenian") {
            $scope.project.mainLanguage = $scope.mainLanguages[i];
            // $scope.project.mainLanguage = { id : 4 };
          }
        }
      }
      if (lang === "it-it" || lang === "it") {
        console.log("language is Italian - Italy");
        console.log("$scope.mainLanguages" + $scope.mainLanguages[0]);
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "Italian") {
            $scope.project.mainLanguage = $scope.mainLanguages[i];
            // $scope.project.mainLanguage = { id : 5 };
          }
        }
      }
      if (lang === "ko") {
        console.log("language is Korean");
        console.log("$scope.mainLanguages" + $scope.mainLanguages[0]);
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "Korean") {
            $scope.project.mainLanguage = $scope.mainLanguages[i];
            // $scope.project.mainLanguage = { id : 7 };
          }
        }
      }
      if (lang === "ja") {
        console.log("language is Japanese");
        console.log("$scope.mainLanguages" + $scope.mainLanguages[0]);
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "Japanese") {
            $scope.project.mainLanguage = $scope.mainLanguages[i];
            // $scope.project.mainLanguage = { id : 6 };
          }
        }
      }
      if (lang === "pt-pt" || lang === "pt") {
        console.log("language is Portuguese - portugal");
        console.log("$scope.mainLanguages" + $scope.mainLanguages[0]);
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "Portuguese") {
            $scope.project.mainLanguage = $scope.mainLanguages[i];
            //  $scope.project.mainLanguage = { id : 8 };
          }
        }
      }
      if (lang === "ru") {
        console.log("language is Russian");
        console.log("$scope.mainLanguages" + $scope.mainLanguages[0]);
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "Russian") {
            $scope.project.mainLanguage = $scope.mainLanguages[i];
            //  $scope.project.mainLanguage = { id : 9 };
          }
        }
      }
      if (lang === "es-es" || lang === "es") {
        console.log("language is Spanish - Spain (Traditional)");
        console.log("$scope.mainLanguages" + $scope.mainLanguages[0]);
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "Spanish") {
            //  $scope.project.mainLanguage = { id : 10 };
          }
        }
      }
      if (lang === "ta-ta" || lang === "ta") {
        console.log("language is tamil");
        console.log("$scope.mainLanguages" + $scope.mainLanguages[0]);
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "Tamil") {
            $scope.project.mainLanguage = $scope.mainLanguages[i];
            // $scope.project.mainLanguage = { id : 11 };
          }
        }
      }
      if (lang === "zh-cn" || lang === "zh") {
        console.log("language is Chinese-China");
        console.log("$scope.mainLanguages" + $scope.mainLanguages[0]);
        for (var i in $scope.mainLanguages) {
          if ($scope.mainLanguages[i].name == "Chinese") {
            $scope.project.mainLanguage = $scope.mainLanguages[i];
            // $scope.project.mainLanguage = { id : 12 };
          }
        }
      }
      $scope.additionalLanguageDropdown($scope.project.mainLanguage.name);
    };

    function openDialog($modal, msg) {
      var modalInstance = $modal.open({
        keyboard: false,
        templateUrl:
          "app/views/en-US/templates/modals/project/savemessage.html",
        controller: "MessageModalCtrl",
        resolve: {
          data: function() {
            return angular.copy(msg); // deep copy
          }
        }
      });
      return modalInstance;
    }
    //$scope.totalprice = 670.99;
    $scope.clientd ="";
    var form = document.querySelector("#payment-form");
    //dummy client token for prod
     // "eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiI2ODI2ODJkNjZjYzFlYWM3YzM2Nzk5MzFkYTMzZmFhYTA1M2Y5NWNlODRmNzdmMzM3YzVhNmMxOWNhODk5MTFjfGNyZWF0ZWRfYXQ9MjAxNy0xMS0yNFQxMTo0Mjo1MS40NTcwNDc1MTUrMDAwMFx1MDAyNm1lcmNoYW50X2lkPXB6cnI4cWtxcmZyYzlqdGZcdTAwMjZwdWJsaWNfa2V5PXdyeTdocTJrdzV6NDQ4ZHoiLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzL3B6cnI4cWtxcmZyYzlqdGYvY2xpZW50X2FwaS92MS9jb25maWd1cmF0aW9uIiwiY2hhbGxlbmdlcyI6WyJjdnYiLCJwb3N0YWxfY29kZSJdLCJlbnZpcm9ubWVudCI6InByb2R1Y3Rpb24iLCJjbGllbnRBcGlVcmwiOiJodHRwczovL2FwaS5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzL3B6cnI4cWtxcmZyYzlqdGYvY2xpZW50X2FwaSIsImFzc2V0c1VybCI6Imh0dHBzOi8vYXNzZXRzLmJyYWludHJlZWdhdGV3YXkuY29tIiwiYXV0aFVybCI6Imh0dHBzOi8vYXV0aC52ZW5tby5jb20iLCJhbmFseXRpY3MiOnsidXJsIjoiaHR0cHM6Ly9jbGllbnQtYW5hbHl0aWNzLmJyYWludHJlZWdhdGV3YXkuY29tL3B6cnI4cWtxcmZyYzlqdGYifSwidGhyZWVEU2VjdXJlRW5hYmxlZCI6ZmFsc2UsInBheXBhbEVuYWJsZWQiOmZhbHNlLCJtZXJjaGFudElkIjoicHpycjhxa3FyZnJjOWp0ZiIsInZlbm1vIjoib2ZmIn0";
    $.get(RestURL.baseURL + "payments/clientid/",function(data) {
    	//console.error("the client id------>"+data)
    	 $scope.clientd = data
    })
    
    $scope.payment = function(){
        var button = document.querySelector("#submit-button");
        console.warn("client_token ##- > "+$scope.clientd);

        braintree.dropin.create(
          {
            authorization: $scope.clientd,
            selector: "#bt-container",
            paypal: {
              flow: "vault"
            }
          },
          function(err, instance) {
            form.addEventListener("submit", function(event) {
              $("#myModal").modal("hide");
              $("#paymentModal").modal("hide");
              $("#invoiceModal").modal("hide");
            //  #moneyloader
              $("#moneyloader").modal({
                  dataTarget: "#moneyloader",
                  backdrop: "static",
                  keyboard: false
                });
                $("#moneyloader").modal("show");
              event.preventDefault();
              console.log("instance- > ", instance);
              instance.requestPaymentMethod(function(err, payload) {
                if (err) {
                  console.log("Error", err);
                  $("#instancefailure").modal({
                      dataTarget: "#instancefailure",
                      backdrop: "static",
                      keyboard: false
                    });
                    $("#instancefailure").modal("show");
                    return;
                }

                // Add the nonce to the form and submit
                console.log("payload.nonce- > ", payload.nonce);
                document.querySelector("#nonce").value = payload.nonce;
                console.log("the payload ---->" + angular.toJson(payload));

                // form.submit();
                $http.post(
                  RestURL.baseURL +
                    "payments/transcation/?amount=" +
                    $scope.totalprice +
                    "&payment_method_nonce=" +
                    payload.nonce +
                    "&project_id=" +
                    $scope.json["id"])
                  .success(function(data) {
                    authFactory.set_change_transaction_satatus(data.payment_status);
                    authFactory.set_transactionId(data.transaction_id);
                    console.log("sucess.. calling payment..");
                    $http
                      .post(
                        RestURL.billingServiceURL +
                          "payment/audit/?user_id=" +
                          userid +
                          "&project_id=" +
                          ProjectData.project_data.id,
                        data
                      )
                      .success(function(result) {
                        $scope.pending = result.pending;
                        if (data.payment_status === "SUBMITTED_FOR_SETTLEMENT") {
                          //SUBMITTED_FOR_SETTLEMENT
                         $("#moneyloader").modal("hide");
                          $scope.openGenerateModal();
                        } else {
                        	   $("#moneyloader").modal("hide");
                          $("#myModalSuccess").modal({
                            dataTarget: "#myModalSuccess",
                            backdrop: "static",
                            keyboard: false
                          });
                          $("#myModalSuccess").modal("show");
                          $("#transValue").html(data.transaction_id);
                          $("#status").html(data.payment_status);
                        }
                      })
                      .error(function(error) {
                    	$("#moneyloader").modal("hide");
                        $("#paymentwebfail").modal({
                          dataTarget: "#paymentwebfail",
                          backdrop: "static",
                          keyboard: false
                        });
                        $("#paymentwebfail").modal("show");
                        $("#failed").html(data.errorstring);
                      });
                  }).error(function(error){
                	  $("#moneyloader").modal("hide");
                	  console.log("Error", error);
                      $("#paymentwebfail").modal({
                          dataTarget: "#paymentwebfail",
                          backdrop: "static",
                          keyboard: false
                        });
                        $("#paymentwebfail").modal("show");
                        return;
                  })
            });
          });
        }
      )
    }
  }
]
);
