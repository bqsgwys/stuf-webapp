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
    $("#site-" + e).val(data[e]);
  });
}

function getValues() {
  var result = {};
  fields.forEach(function(e) {
    result[e] = $("#site-" + e).val();
  });
  return result;
}

function gotoModify(name) {
  $(".panel").fadeOut(200);

  setTimeout(function() {
    $(".modify").fadeIn(200);
    $("#site-not-found").hide();
    $("#modify-form").hide();

    $.get('/map/admin/' + name).done(function(data) {
      setupValues(data);
      $("#modify-form").fadeIn(200);
    }).fail(function(data) {
      $("#site-not-found").fadeIn(200);
    });
  }, 200);
}

function getList() {
  $(".list .placeholder").show();
  $(".site-list").hide();

  $.get('/map/sites').then(function(data) {
    var content = "<thead><th>摊位名</th><th>所有者</th><th>类别</th><th>分数</th><th>操作</th></thead><tbody>";

    data.forEach(function(e) {
      content += "<tr><td>" + e.name + "</td><td>" + e.class + "</td><td>" + e.category + "</td><td>" + e.score + '</td><td><span class="modify-link" onclick="gotoModify(' + e.site + ')">修改</td></tr>';
    });

    content += "</tbody>"
    console.log(content);
    $(".site-list").html(content);
    $(".list .placeholder").fadeOut(200);
    setTimeout(function() { $(".site-list").fadeIn(200); }, 200);
  });
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

  $("#list-btn").click(function() {
    $(".panel").fadeOut(200);
    setTimeout(function() {
      getList();
      $(".list").fadeIn(200);
    }, 200);
  });

  $("#new-btn").click(function() {
    $(".panel").fadeOut(200);
    setTimeout(function() {
      setupValues({});
      $("#site-not-found").hide();
      $("#modify-form").show();
      $(".modify").fadeIn(200);
    }, 200);
  });

  $("#form-submit").click(function() {
    console.log(getValues());
    $.post("/create/sites", getValues()).done(function() {
      $("#list-btn").click();
    }).fail(function() {
      alert("提交失败!");
    });
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
