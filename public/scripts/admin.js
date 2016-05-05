$(document).ready(function() {
  $.get('/account/restore')
  .done(function(data) {
    if(!data.success) {
      // Assume that user is not logged in
      window.location.href="login.html"
    } else {
      if(data.site != "admin")
        window.location.href="dashboard.html";

      $(".container").removeClass("hidden");
    }
  })

  $("#site-btn").click(function() {
    $(".panel").fadeOut(200);
    setTimeout(function() {
      $(".sites").fadeIn(200);
    }, 200);
  });

  $("#user-btn").click(function() {
    $(".panel").fadeOut(200);
    setTimeout(function() {
      $(".users").fadeIn(200);
    }, 200);
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
