var app = angular.module("DoBoondApp",['ngMaterial','ngStorage','ngMessages','md.data.table']);



app.controller("mainCtrl",function($scope,$mdDialog,$localStorage,$http,$sessionStorage,$timeout,$interval,$mdSidenav,$mdToast,$mdMedia,$mdEditDialog,$mdBottomSheet){
	$scope.products;
	$scope.cart = [];
	$scope.init = function(){
		$sessionStorage.cart= [];
		$http({
					method : "GET",
					url : "http://127.0.0.1:8000/api/list_products",
					header : {
						"Content-Type" : "application/json"
					}
		})
		.success(function(data){
			if(data){
				$scope.products = data;
				return ;
			}
		})
	}

	$scope.cartStatus = function(){
		// console.log("weqee"+$scope.cart.length);
		if($scope.isLoggedIn()){
			$http({
				method : "POST",
				url : "http://127.0.0.1:8000/api/cart/"+$scope.id,
				header : {
					"Content-Type" : "application/json"
				}
			})
			.success(function(data){
				// console.log("XXX"+data.cart);
				$scope.cart= data.cart;
			})
			
		}
		// console.log("sdwa"+$scope.cart.length);
		return $scope.cart.length;
	}

	



/*

################################## LOGGED IN check ############################################

*/
	$scope.isLoggedIn =function(){
		if($sessionStorage.message){
			$scope.name= $sessionStorage.name;
			return true;
		}
		else{
			return false;
		}
		
	}

/*

################################## LOGIN call ############################################

*/
	$scope.login = function(userdata){
		$http(
				{
					method : "POST",
					data : userdata,
					url : "http://127.0.0.1:8000/api/authenticate",
					header : {
						"Content-Type" : "application/json"
					}
				})
				.success(function(data){
					console.log(data.success);
					if(data.success === true){
						$sessionStorage.message = data;
						$sessionStorage.name = data.name;
						$sessionStorage.type = data.type;
						$sessionStorage.cart = data.cart;
						$scope.name = data.name;
						$scope.id = data.userid;
						$scope.cart = data.cart;
						$scope.showSimpleToast("Login Successfull !!!");

						console.log("Login Successfull!!");
					}
					else{
						$scope.showSimpleToast("Login Failed !!!");
						console.log("Login Failed!!");
					}
				})
	};
/*

################################## LOGOUT call ############################################

*/
	$scope.logout = function(){
		$sessionStorage.message = null;
		$sessionStorage.cart = [];
		$scope.cart=[];
		console.log("Logged Out");
	};

/*

################################## Register call ############################################

*/
	$scope.register = function(userdata) {

		$http(

		{
			method: "POST",
			data : userdata,
			url : "http://127.0.0.1:8000/api/register",
			header : {
				"Content-Type" : "application/json"
			}
		}

			)
		.success(function(data){
			if(data.Success){
				$scope.showSimpleToast("SignUP Successfull !!!");
			}
			else{
				$scope.showSimpleToast("Some error occurred. Please try again !!!");
			}
		})

	}


/*

######################## Dialoga and other UI functions ###################################

*/
	function DialogController($scope, $mdDialog) {
	  $scope.hide = function() {
	    $mdDialog.hide();
	  };
	  $scope.cancel = function() {
	    $mdDialog.cancel();
	  };
	  $scope.answer = function(answer) {
	    $mdDialog.hide(answer);
	  };
	};
	$scope.showDialog = function(path,controller,index,ev) {
	  var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
	  $mdDialog.show({
	    controller: DialogController,
	    templateUrl: path,
	    locals: {parent: $scope},
	    targetEvent: ev,
	    controllerAs: controller,
	    bindToController: true,
	    clickOutsideToClose:true,
	    fullscreen: useFullScreen
	  })
	  .then(function(answer){
	  	if(answer=='loggedIn'){
	  		$scope.path="partials/logged_in.html"
	  	}
	  })
	};
	
	 $scope.showSimpleToast = function(data) {
	   

	   $mdToast.show(
	     $mdToast.simple()
	       .textContent(data)
	       .position("top right" )
	       .hideDelay(3000)
	   );
	 };

	  $scope.items = [
    { name: 'Youtube', icon: 'youtube' , url: '#'},
    { name: 'Google Plus', icon: 'google-plus', url: '#' },
    { name: 'Facebook', icon: 'facebook', url: '#' },
    { name: 'Twitter', icon: 'twitter', url: '#' },
  ];
})