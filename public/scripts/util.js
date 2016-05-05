$(document).ready(function() {
  $("button").mousedown(function() {
    $(this).addClass("pressed");
  });

  $("button").mouseup(function() {
    $(this).removeClass("pressed");
  });

  $("button").mouseleave(function() {
    $(this).removeClass("pressed");
  });
});
