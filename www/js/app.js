// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'starter.controllers', 'ionic.contrib.ui.tinderCards', 'starter.directives']); 

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  $ionicPlatform.registerBackButtonAction(function () {    
      navigator.app.exitApp();    
  }, 100);
});


app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('login', {
      url: '/login',      
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'      
    })
  
  .state('chatlist', {
      url: '/chatlist',      
      templateUrl: 'templates/chatlist.html',
      controller: 'ListCtrl'
      
    })

  .state('chatwrite', {
      url: '/chatwrite',      
      templateUrl: 'templates/chatwrite.html',
      controller: 'WriteCtrl'
      
    });

  $urlRouterProvider.otherwise('/login');  

}); 

