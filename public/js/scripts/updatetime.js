
$(document).on("click", "#btnDTRSearch", function(e){
    e.preventDefault();
    $("#btnDTRSearch").html("Searching...");
    $.ajax({
      type: "POST",
      url: "/router",
      cache: false,
      data: $("#fmrAll2").serialize(),
      success: function(response) {
        $("#btnDTRSearch").html("Search");
        $("#dtrmonth").html(response);
      }
    });
});

$(document).on("click", "#btnTimeIn", function(){
   
    $(this).prop("disabled",true);
    var info = $('#allMsg');
    info.html("<div class = 'alert bg-rgba-info'>Processing...</div>");
    $.ajax({
        type: "POST",
        url: "/save",
        cache: false,
        data: $("#frmAll").serialize(),
        dataType: 'json',
        success: function(response) {
          $("#btnTimeIn").prop("disabled",false);
          if (response.error == "400"){
            info.html(response.message);
            info.slideDown();
          }else if (response.error == "200"){
            $("#btnTimeIn").prop("disabled",true);
            $("#btnTimeIn").text("Done");
            info.html(response.message);
            info.slideDown();
            if (response.Trigger == 1)
              $("#idAMIn").text(response.Time);
            else if (response.Trigger == 2)
              $("#idAMOut").text(response.Time);
            else if (response.Trigger == 3)
              $("#idPMIn").text(response.Time);
            else if (response.Trigger == 4)
              $("#idPMOut").text(response.Time);
          }else{
            info.html(response.error);
            info.slideDown();
          }
          
        },
        error: function(error) {
          $("#btnTimeIn").prop("disabled",false);
          info.html(error.error);
        }

    });
})


function updateTime() {
    var dateInfo = new Date();
    /* time */
    var hr,
      _min = (dateInfo.getMinutes() < 10) ? "0" + dateInfo.getMinutes() : dateInfo.getMinutes(),
      sec = (dateInfo.getSeconds() < 10) ? "0" + dateInfo.getSeconds() : dateInfo.getSeconds(),
      ampm = (dateInfo.getHours() >= 12) ? "PM" : "AM";
    // replace 0 with 12 at midnight, subtract 12 from hour if 13–23
    if (dateInfo.getHours() == 0) {
      hr = 12;
    } else if (dateInfo.getHours() > 12) {
      hr = dateInfo.getHours() - 12;
    } else {
      hr = dateInfo.getHours();
    }
    var currentTime = hr + ":" + _min + ":" + sec;
    // print time
    document.getElementsByClassName("hms")[0].innerHTML = currentTime;
    document.getElementsByClassName("ampm")[0].innerHTML = ampm;
    /* date */
    var dow = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      month = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      day = dateInfo.getDate();
    // store date
    var currentDate = dow[dateInfo.getDay()] + ", " + month[dateInfo.getMonth()] + " " + day;
    document.getElementsByClassName("date")[0].innerHTML = currentDate;
  };

  updateTime();
  setInterval(function() {
    updateTime()
  }, 1000);