var app = angular.module('starter.directives', []);
console.log('directive!!!!!!!!!!!!!!!');
app.directive('noScroll', function($document) {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $document.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
}); 

/*
app.directive('focusMe', function($timeout) {

  return {
    restrict: 'A',
    link: function(scope, element, attr) {

      $timeout(function() {
      	console.log('element[0]====>' + element[0]);
        element[0].focus(); 
      });
    }
  }
});  
*/
window.addEventListener('native.keyboardshow', keyboardShowHandler);

function keyboardShowHandler(e){
   //alert('Keyboard height is: ' + e.keyboardHeight);
}
 
window.addEventListener('native.keyboardhide', keyboardHideHandler);
 
function keyboardHideHandler(e){
   // alert('Goodnight, sweet prince');
}

app.directive('focusMe', function($timeout) {
  return {
    scope: { trigger: '=focusMe' },
    link: function(scope, element) {
      scope.$watch('trigger', function(value) {
      	console.log('trigger',value);
        if(value === true) {           
          
            element[0].focus();
            scope.trigger = false;
            cordova.plugins.Keyboard.show();   
            
        }
        
      });
    }
  };
});  

