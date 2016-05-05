var currentTarget;

var fields = [
  'username',
  'password',
  'site',
  'score',
  'name',
  'class',
  'category',
  'position',
  'description'
];

function setupValues(data) {
  fields.forEach(function(e) {
    $("#user-" + e).val(data[e]);
  });
}

function getValue() {
  var result = {};
  fields.forEach(function(e) {
    result[e] = $("#user-" + e).val();
  });
  return result;
}

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

  $("#user-search").click(function() {
    $("#user-not-found").fadeOut(200);
    $("#user-form").fadeOut(200);

    currentTarget = $("#user-search-target").val();
    $.get('/admin/' + currentTarget).done(function(data) {
      setupValues(data);
      $("#user-form").fadeIn(200);
    }).fail(function(data) {
      $("#user-not-found").fadeIn(200);
    });
  });

  $("#user-add").click(function() {
    $("#user-not-found").fadeOut(200);
    $("#user-form").fadeOut(200);

    setTimeout(function() {
      setupValues({});
      $("#user-form").fadeIn(200);
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
