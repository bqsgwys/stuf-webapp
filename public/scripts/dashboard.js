function isWeiXin(){
  var ua = navigator.userAgent.toLowerCase();
  if(ua.match(/MicroMessenger/i)=="micromessenger") {
    return true;
  } else {
    return false;
  }
}

function getQRCodeResult(cb) {
  if(isWeiXin()) {
    wx.scanQRCode({
      needResult: 1,
      scanType: ["qrCode","barCode"],
      success: function (res) {
        cb(res.resultStr);
      }
    });
  } else {
    alert("请使用微信浏览器");
    cb("123457");
  }
}

var voterLocked = false;
var score;
function setVote(num) {
  if(voterLocked) return true;
  score = num;
  $(".voter .voter-star").slice(num, 5).css("background-image", "url('images/star_border.png')");
  $(".voter .voter-star").slice(0, num).css("background-image", "url('images/star_black.png')");
}

function showLamp(lampId) {
  if(lampId == 1) alert("您获得了红灯!");
  else if(lampId == 2) alert("您获得了绿灯!");
  else if(lampId == 3) alert("您获得了蓝灯!");
  else if(lampId == 4) alert("您获得了黄灯!");
}

function showThanks() {
  alert("感谢您的评分");
}

var store;

$(document).ready(function() {
  $.get('/account/restore')
  .done(function(data) {
    if(!data.success) {
      // Assume that user is not logged in

      console.log(data);
      
      //window.location.href="login.html"
    } else {
      $(".site-info").html(data.site);
      $(".container").removeClass("hidden");
    }
  });

  $("#scan-btn").click(function() {
    getQRCodeResult(function(res) {
      // Invoke /visit API
      
      store = res;
      
      $.get('/visit/' + res)
      .done(function(data) {
        var prevVote = parseInt(data);
        if(prevVote != 0) {
          // Previously voted
          setVote(prevVote);
          voterLocked = true;
          $(".voter-submit").hide();
          $(".voter-title").html("您已进行过评分");

          $(".voter").fadeIn(200);
        } else {
          setVote(3);
          voterLocked = false;
          $(".voter-submit").show();
          $(".voter-title").html("请为本活动评分");

          $(".voter").fadeIn(200);
        }
      });
    });
  });

  $(".voter-submit").click(function() {
    $.get('/vote/perform/' + store, {
      score: score
    }).then(function(data) {
      if(!data.success) {
        // Error
        alert("未知错误!");
        $(".voter").hide();
      } else {
        if(data.lamp) showLamp(data.lamp);
      }
    });

    $(".voter").fadeOut(200);
  });

  $(".voter-close").click(function() {
    $(".voter").fadeOut(200);
  });

  $("#logout").click(function() {
    $.get('/account/logout').done(function(data) {
      if(data.success) window.location.href = 'login.html';
      else if(data.error == "NotLoggedIn") {
        alert("未登录");
        window.location.href = 'login.html';
      } else {
        alert(data.error);
      }
    });
  });
});
