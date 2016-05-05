var pendingErrors = [];

var errorRunning = false;

function nextError() {
  if(pendingErrors.length == 0) {
    errorRunning = false;
    return;
  }

  errorRunning = true;
  var current = pendingErrors[0];
  console.log(current);
  $(".error").removeClass("shown")
  setTimeout(function() {
    $(".error").addClass("shown").html(current);
  }, 200);

  pendingErrors.shift(1);
  setTimeout(nextError, 2000);
}

function showError(error) {
  pendingErrors.push(error);
  if(!errorRunning) nextError();
}

$(document).ready(function() {  
  $("#submit").click(function() {
    var username = $("#uname").val();
    var password = $("#passwd").val();
    if(!username || !password) {
      alert("请填写完整信息");
      return;
    }

    $.post("/account/login", {
      username,
      password
    }).done(function(data) {
      if(data.success) {
        if(data.site == "admin")
          window.location.href = "admin.html";
        else
          window.location.href = "dashboard.html";
      } else {
        if(data.error == "CredentialsRejected") showError("凭证错误");
        else if(data.error == "AccountInUse") showError("此账户已在其它设备上登录");
        else if(data.error == "AlreadyLoggedIn") {
          window.location.href = "dashboard.html";
        } else alert(data.error);
      }
    });
  });
});
