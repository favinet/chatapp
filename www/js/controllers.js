var app = angular.module('starter.controllers', ['ionic', 'ngMessages']);

//app.constant('USER_URL', '/user');
//app.constant('USER_URL', 'http://58.180.56.34:3000/chat/user');

//app.constant('ROOM_URL', '/room');
//app.constant('ROOM_URL', 'http://58.180.56.34:3000/chat/room');

//app.constant('CHAT_URL', '/chat');
//app.constant('PAGE_URL', 'http://58.180.56.34:3000/chat/' + room + '/' + dataParams._id + '/' + order);

app.constant('config', {
    
    USER_URL: '/user',
    ROOM_URL: '/room',
    CHAT_URL: '/chat'
  
    /*
    USER_URL: 'http://58.180.56.34:3000/chat/user',
    ROOM_URL: 'http://58.180.56.34:3000/chat/room',
    CHAT_URL: 'http://58.180.56.34:3000/chat'   
    */
     
});

app.controller('AppCtrl', ['$scope', function($scope, $state) {}]);

app.controller('LoginCtrl', ['$scope', '$http', '$rootScope', '$state', '$stateParams', 'config', function($scope, $http, $rootScope, $state, $stateParams, config) {
  $scope.data = {};

    var user = "";
    if(window.localStorage['usrData'] != null)
    {
      user = JSON.parse(window.localStorage['usrData']);
      $scope.data.user = user._id;
    }
    else
      $scope.data.user = '';
    
    var login = function login(id, room, logindate)
    {
        var link = config.USER_URL;
        //var link = 'http://58.180.56.34:3000/chat/user'; 
        var dataParams =
        {
            _id : id,
            room : room,
            logindate : logindate
        };
        
        $http({
          method : 'POST',
          url : link,
          data : dataParams,
          headers : {'Content-Type': 'application/json; charset=utf-8'}
        })
        .success(function (res, status, headers, config) {          

           
            if(status == 200)
            {
             // alert('로그인 성공!!');
              $state.go('chatlist');
            }              
            else
            {
              alert('로그인 실패!!');
            }
        })
        .error(function(data, status, headers, config){
            alert('네트워크 에러 : ' + status)
        });
    };

    $scope.signIn = function(form){
        var link = config.ROOM_URL;
        //var link = 'http://58.180.56.34:3000/chat/room';

        console.log('form.$valid===>' + form.$valid);
        if(form.$valid)
        {
          var time = Date.parse(new Date());
          var dataParams =
          {
              _id : $scope.data.user,
              room : 1,
              logindate : time
          };
          
          $http({
            method : 'POST',
            url : link,
            data : dataParams,
            headers : {'Content-Type': 'application/json; charset=utf-8'}
          })
          .success(function (res, status, headers, config) {          

              var result = res._id;  

              window.localStorage['usrData'] = JSON.stringify(dataParams);          

              if(angular.isUndefined(result))
              {
                console.log('no');  
                login(dataParams._id, dataParams.room, dataParams.logindate);
              }              
              else
              {
                console.log('yes');
                //alert('이미 등록된 대화명입니다.\n 채팅방으로 이동합니다.');
                $scope.data.user = '';
                $state.go('chatlist');
              }
          })
          .error(function(data, status, headers, config){
              alert('네트워크 에러 : ' + status)
          });
        }
        else
          alert('로그인 실패!')
    };

}]);

app.controller('ListCtrl', ['$scope', '$http', '$rootScope', '$state', '$stateParams',function($scope, $http, $rootScope, $state, $stateParams) {

 console.log('ListCtrl===>');

}]);  

app.controller('WriteCtrl', ['$scope', '$http', '$rootScope', '$state', '$stateParams',function($scope, $http, $rootScope, $state, $stateParams) {

 console.log('WriteCtrl===>');

}]);  


app.controller('CardsCtrl', ['$scope', '$http', '$state', '$rootScope', '$timeout', '$interval', 'TDCardDelegate', 'config', '$ionicLoading', function($scope, $http, $state, $rootScope, $timeout, $interval, TDCardDelegate, config, $ionicLoading) {
  console.log('CARDS CTRL');
  var cardTypes = [];

  $ionicLoading.show({
      duration: 30000,
      noBackdrop: false,
      template: '<p class="item-icon-left">Loading..<ion-spinner icon="lines"/></p>'
    });


  $scope.btn = {};
  $scope.ndata = {};

  var isShowBtn = function(c) {
      console.log('chk===>' + c); 
      $scope.btn.show = c;
      $scope.btn.css = 'bar bar-header bar-calm';
  };
  
 
  var chkChatMsg;


  var startChkMsg = function()
  {
    //chkChatMsg = $interval(chkChatList(1, 'n'), 5000);
    cancelChkMsg();
    chkChatMsg = $interval(function () 
    {                    
       chkChatList(1, 'n')     
    }, 5000);
  };

  var cancelChkMsg = function()
  {
    $interval.cancel(chkChatMsg);
  };

  var getChatList = function(room, id, order)
  {
   
    isShowBtn(true);   
    var link = config.CHAT_URL+'/'+room;
    //var link = 'http://58.180.56.34:3000/chat/'+room;
    console.log('getChatList===>' + link);
    var dataParams =
    {
       
    };
    
    $http({
      method : 'GET',
      url : link,
      data : dataParams,
      headers : {'Content-Type': 'application/json; charset=utf-8'}
    })
    .success(function (res, status, headers, config) {          



        if(status == 200)
        {

          startChkMsg();
          cardTypes = res;     
          
          // /http://codefactory.kr/2011/12/06/jquery-sourcecode-analysis-javascript-study-toarray/ 
          $scope.cards = Array.prototype.slice.call(cardTypes, 0); 
         
          if(res.length > 0)
          {  
              
              window.localStorage['nidData'] = cardTypes[$scope.cards.length-1]._id; 

              //$scope.data.nid = window.localStorage['nidData'];
              var loginUsr = JSON.parse(window.localStorage['usrData']);
              console.log('loginUsrloginUsrloginUsr===>' + loginUsr._id);
              $scope.ndata.nid = loginUsr._id;
              console.log('CardsCtrl===>' + $scope.cards.length);    
              $scope.cardDestroyed = function(index) {
                $scope.cards.splice(index, 1);
              };

              $scope.addCard = function() {
                var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
                newCard.id = Math.random();
                $scope.cards.push(angular.extend({}, newCard));
                $scope.$apply();
              };  

              
          }
         
          console.log('getChatList  $scope.cards===>' + angular.toJson($scope.cards));
          $ionicLoading.hide();
        }              
        else
        {
          alert('채팅리스트 가져오기 실패!!');
        }
    })
    .error(function(data, status, headers, config){
        cancelChkMsg();
        alert('네트워크 에러 : ' + status)
    });
  };

  var chkChatList = function(room, order)
  { 

    console.log('돌고있나!!!!===>' + $scope.cards.length);
    console.log('돌고있나 order!!!!===>' + order);
    var dataParams =
    {
        _id : '',
        room : 1,
        order : 'n',
        nid : ''
    };


    if($scope.cards.length > 0)
    {
      console.log('체크  메세지 확인!!!!===>' + angular.toJson($scope.cards));
      

      if(order == 'n')
      {
         
          console.log(window.localStorage['nidData']);
          if(window.localStorage['nidData'] == null || window.localStorage['nidData'] == 'undefined')          
            window.localStorage['nidData'] = $scope.cards[$scope.cards.length-1]._id;  

          dataParams._id = window.localStorage['nidData'];     
 
      }        
      else
        dataParams._id = $scope.cards[0]._id;


      
    }
    else
    {
      
        var newCard = cardTypes;
        newCard._id = ''; 
        newCard.user = '메세지 쓰기';
        newCard.msg = '';
        $scope.cards.push(angular.extend({}, newCard));
      
    }
   
    console.log('체크  dataParams._id!!!!===>' + dataParams._id);
    if(dataParams._id == 'undefined' || dataParams._id == '')
      return;
       
    var link = config.CHAT_URL+'/' + room + '/' + dataParams._id + '/' + order;
    //var link = 'http://58.180.56.34:3000/chat/' + room + '/' + dataParams._id + '/' + order;  

    console.log('주소 확인!!!!===>' + link);
    $http({
      method : 'GET',
      url : link,
      data : dataParams,
      headers : {'Content-Type': 'application/json; charset=utf-8'}
    })
    .success(function (res, status, headers, config) {          

       
        if(status == 200)
        {          
          //alert('메세지 전송 성공!!');
          console.log('추가 메세지 확인!!!!===>' + angular.toJson(res.length));

          var cnt = res.length;
          if(cnt > 0)
          {
            console.log('$키존 메세지 배열 ===>' + $scope.cards.length);
            console.log('추가 메세지 ===>' + angular.toJson(res));
            /*
            for(int i = 0; i < res.length; i++)
            {
              var newCard = cardTypes[$scope.cards.length-1];
              newCard._id = res[i]._id;
              newCard.user = res[i].user;
              newCard.room = res[i].room;
              newCard.msg = res[i].msg;
              newCard.regdate = res[i].regdate;
              $scope.cards.push(angular.extend({}, newCard));                
            }
            */
            
            cardTypes = res[0];     
            if(order == 'p')
            {               
               console.log('cardTypescardTypescardTypes ===>' + angular.toJson(cardTypes));
               $scope.cards.splice(0, 0, cardTypes); 
            }
            else
            {              
              console.log('cardTypescardTypescardTypesnnnnnnnnnnnnnnn ===>' + angular.toJson(cardTypes));
               window.localStorage['nidData'] = cardTypes._id; 
              $scope.cards.splice($scope.cards.length, 1, cardTypes);  


            }
            

            
           //  $scope.cards = Array.prototype.slice.call(cardTypes, 0);
           // $scope.$apply();

            console.log('$추가 후 메세지 배열 ===>' + angular.toJson($scope.cards));
          }
        }              
        else
        {
          cancelChkMsg();
          alert('추가 채팅리스트 가져오기 실패!!');
        }
    })
    .error(function(data, status, headers, config){
        cancelChkMsg();
        alert('네트워크 에러 : ' + status)
    });
  }

  var chatInsert = function(room, index)
  {

    $ionicLoading.show();

     cordova.plugins.Keyboard.close();   
    isShowBtn(true);
    startChkMsg();
    $timeout(function(){
      $scope.focusInput = false;
    }, 500);    

    var link = config.CHAT_URL+'/'+room;
    //var link = 'http://58.180.56.34:3000/chat/'+room;
    var time = Date.parse(new Date());
    var user = JSON.parse(window.localStorage['usrData']);
    var cardsCnt = document.getElementsByTagName('td-card').length;
    var card = document.getElementsByTagName('td-card')[cardsCnt-1];
    var cardTxtArea = card.getElementsByTagName('textarea')[0];
    var msg = cardTxtArea.value;
    var dataParams =
    {
        user : user._id,
        room : 1,
        msg : msg,
        regdate : time
    };
     
    $http({
      method : 'POST',
      url : link,
      data : dataParams,
      headers : {'Content-Type': 'application/json; charset=utf-8'}
    })
    .success(function (res, status, headers, config) {          

       
        if(status == 200)
        {          

          $timeout(function(){
            $ionicLoading.hide();
          }, 3000);   
          console.log('글 쓴 후====>' + angular.toJson(res.ops[0]));
         // $scope.cards.splice(0, 0, res.ops[0]);
          //alert('메세지 전송 성공!!');
          $timeout(function(){
            getChatList(1);
          }, 500);    
        }              
        else
        {
          cancelChkMsg();
          alert('채팅리스트 가져오기 실패!!');
        }
    })
    .error(function(data, status, headers, config){
        cancelChkMsg();
        $ionicLoading.hide();
        alert('네트워크 에러 : ' + status)
    });
  };

  $scope.goReply = function(index) {

    cancelChkMsg();

    var newCard = cardTypes;
    newCard.user = '메세지 쓰기';
    newCard.msg = '';
    $scope.cards.push(angular.extend({}, newCard));
   // $scope.user = '메세지';
    //$state.go('chatwrite');
    console.log('goReply');

    isShowBtn(false);

    $timeout(function(){
      $scope.focusInput = true;
    }, 500);     

  };

  $scope.someFunction = function($event) {
    console.log('touch!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  };


  $scope.cardSwipedLeft = function(index) {   
    console.log('LEFT SWIPE');  
    chatInsert(1, index);
    //chkChatMsg();
  };
  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE');  
    chatInsert(1, index);
    //chkChatMsg();
  };
  $scope.cardSwipedDown = function(index) {
    console.log('DOWN SWIPE');  
   // chatInsert(1, index);
   //cancelChkMsg();
   isShowBtn(true);
   $timeout(function(){
        console.log('페이지 후 남은 갯수 ===>' + $scope.cards.length);
        console.log('페이지 후 남은 갯수 ===>' + angular.toJson($scope.cards));
        
        //if($scope.cards.length >= 5)
          chkChatList(1, 'p')  
        /*
          else if($scope.cards.length == 1)
          {
            
            var newCard = cardTypes;
            newCard._id = ''; 
            newCard.user = '메세지 쓰기';
            newCard.msg = '';
            $scope.cards.splice(0, 1, newCard);//$scope.cards.push(angular.extend({}, newCard));
            cancelChkMsg();
          }*/
    }, 0);     
  };
 
  $timeout(function(){getChatList(1);}, 500);    
  
  $scope.$on(
      "$destroy",
        function( event ) {
            console.log('destroydestroydestroy=>' + event);  
            cancelChkMsg();
        }
      );

}]);

app.controller('CardCtrl', function($scope, TDCardDelegate) {

  
  
  $scope.cardSwipedLeft = function(index) {   
    $scope.addCard();
  };
  $scope.cardSwipedRight = function(index) {
    
    $scope.addCard();
  };

  $scope.someFunction = function($event) {
    console.log('touch!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  };
 
});