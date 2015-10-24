angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('CategoriesCtrl', function($scope, $http, $ionicLoading) {

  $scope.loadingIndicator = $ionicLoading.show({
      content: 'Loading Data',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 200,
      showDelay: 500
  });

  $http.get('http://lactoseapi.mariojorge.net/categories').then(function(resp) {
    $scope.categories = resp.data.categories
    //for(i = 0; i < $categories.length; i++){
      //console.error('DATA', $categories[i].title);
    //}
    $ionicLoading.hide()
  }, function(err) {
    console.error('ERR', err);
    $ionicLoading.hide()
  })
})

.controller('ProductsCtrl', function($scope, $http, $ionicLoading, $stateParams) {

  $scope.loadingIndicator = $ionicLoading.show({
      content: 'Loading Data',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 200,
      showDelay: 500
  });

  var url = 'http://lactoseapi.mariojorge.net/categories/' + $stateParams.categoryId;

  $http.get(url).then(function(resp) {
    $scope.products = resp.data.category.products
    //for(i = 0; i < $categories.length; i++){
      //console.error('DATA', $categories[i].title);
    //}
    $ionicLoading.hide()
  }, function(err) {
    console.error('ERR', err);
    $ionicLoading.hide()
  })
})

.controller('ProductCtrl', function($scope, $http, $ionicLoading, $stateParams) {
  $scope.loadingIndicator = $ionicLoading.show({
      content: 'Loading Data',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 200,
      showDelay: 500
  });

  var url = 'http://lactoseapi.mariojorge.net/products/' + $stateParams.productId;

  $http.get(url).then(function(resp) {
    $scope.product = resp.data.product
    $scope.places = resp.data.product.locations
    //for(i = 0; i < $categories.length; i++){
      //console.error('DATA', $categories[i].title);
    //}
    $ionicLoading.hide()
  }, function(err) {
    console.error('ERR', err);
    $ionicLoading.hide()
  })
})

.controller('PlaceCtrl', function($scope, $ionicLoading, $compile) {
  var geocoder;
  var map;
  var myLatlng

  function initialize() {
    var address = "Av. Washington Soares, 85 - Edson Queiroz,Fortaleza - CE,60811-340";
    //var myLatlng = new google.maps.LatLng(-3.733863, -38.516256);
    geocoder = new google.maps.Geocoder();

    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        myLatlng = map.setCenter(results[0].geometry.location);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });

    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"),
        mapOptions);
    
    //Marker + infowindow + angularjs compiled ng-click
    var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
    var compiled = $compile(contentString)($scope);

    var infowindow = new google.maps.InfoWindow({
      content: compiled[0]
    });

    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Uluru (Ayers Rock)'
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });

    $scope.map = map;
  }

  google.maps.event.addDomListener(window, 'load', initialize);

  $scope.centerOnMe = function() {
    if(!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function(pos) {
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
    }, function(error) {
      alert('Unable to get location: ' + error.message);
    });
  };
  
  $scope.clickTest = function() {
    alert('Example of infowindow with ng-click')
  };
});