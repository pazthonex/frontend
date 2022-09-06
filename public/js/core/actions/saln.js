var children_array = new Array();
var assetrp_array = new Array();
var assetpp_array = new Array();
var liablities_net_array = new Array();
var liablities_bifc_array = new Array();
var liablities_rgs_array = new Array();
var assetRealPropCard = 0;
var assetPersonalPropCard = 0;

$(document).on("click", ".submit-saln", function (e) {
  e.preventDefault();
  var salnChecked = $('input[name="salnoption"]:checked').val();
  var salnYear = $('select[name="year-saln"]').val();
  if (salnChecked && salnYear) {
    $.ajax({
      // url: "saln/createmain",
      url: "saln/option",
      type: "post", //send it through get method
      data: { year: salnYear, status: salnChecked },
      cache : false,
      success: function (response) {
        if (response.status === 200) {
            window.location.href = "saln/create";
        } else {
          toastr.error("Something went wrong");
        }
        //Do Something
      },
      error: function (xhr) {
        //Do Something to handle error
      },
    });
    $("#salnOptionModal").find('select[name="year-saln"]').removeClass("error");
  } else {
    if (salnChecked == undefined) {
      $("#salnOptionModal")
        .find("span.err_status")
        .text("Please select option");
    }
    if (salnYear == "") {
      $("#salnOptionModal").find('select[name="year-saln"]').addClass("error");
      // $('#salnOptionModal').find('span.err_year').text('Required')
    }
  }
});

$(document).on("click", ".generate-saln-pdf", function (e) {
  e.preventDefault();
  $("#isLoading").find("span.loading-type-label").text("SALN PDF");
  $("#isLoading").modal({ backdrop: "static", keyboard: false });
  const id = $(this).data('id');
  $.ajax({
    // url: "saln/createmain",
    url: "saln/pdf",
    type: "post", //send it through get method
    data : { id:id },
    success: function (response) {
      if (response.status === 200) {
        $("#isLoading").modal("hide");
        $(".generate-saln-pdf").prop("disabled", true);
        $("#SALN-Table").DataTable().ajax.reload();
        toastr.success(response.message);
      } else {
        toastr.error("Something went wrong");
      }
      //Do Something
    },
    error: function (xhr) {
      console.log("ERR:", xhr);
    },
  });
});
$(document).on("click", ".create-saln", function (e) {
  e.preventDefault();
  $("#salnOptionModal").modal("show");
});
$(document).on("click", ".btn-add-saln-children", function (e) {
  e.preventDefault();
  var firstname = $("#personal").find('input[name="firstname"]').val();
  var lastname = $("#personal").find('input[name="lastname"]').val();
  var middlename = $("#personal").find('input[name="middlename"]').val();
  var dateofbirth = $("#personal").find('input[name="dateofbirth"]').val();
  var checkT = false;
  if (!firstname) {
    $("#personal").find('input[name="firstname"]').addClass("error");
    $(".errfn").text("required");
    checkT = false;
  } else if (!middlename) {
    $("#personal").find('input[name="middlename"]').addClass("error");
    $(".errmi").text("required");
    checkT = false;
  } else if (!lastname) {
    $("#personal").find('input[name="lastname"]').addClass("error");
    $(".errln").text("required");
    checkT = false;
  } else if (!dateofbirth) {
    $("#personal").find('input[name="dateofbirth"]').addClass("error");
    $(".errdob").text("required");
    checkT = false;
  } else {
    checkT = true;
    $(".errfn").text("");
    $(".errln").text("");
    $(".errdob").text("");
    $(".errmi").text("");
    $("#personal").find('input[name="firstname"]').removeClass("error");
    $("#personal").find('input[name="lastname"]').removeClass("error");
    $("#personal").find('input[name="middlename"]').removeClass("error");
    $("#personal").find('input[name="dateofbirth"]').removeClass("error");
  }
  if (checkT) {
    id = new Date().getTime();
    dob = new Date(dateofbirth);
    var today = new Date();
    var age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
    data = {
      id: id,
      firstname: firstname,
      middlename: middlename,
      lastname: lastname,
      dateofbirth: dateofbirth,
      age: age,
    };
    if (age < 18) {
      $("#personal").find('input[name="dateofbirth"]').addClass("error");
      $(".errdob").text("must be 18+(plus) of age");
    } else {
      $("#btn-save-children").prop("disabled", false);
      children_array.push(data);
      $(".children-table > tbody:last-child").append(
        "<tr>\
                    <td>" +
          firstname +
          " " +
          lastname +
          " " +
          middlename +
          "</td>\
                    <td>" +
          dateofbirth +
          "</td>\
                    <td>" +
          age +
          '</td>\
                    <td>\
                    <div class="dropdown">\
                            <span class="bx bx-dots-vertical-rounded font-medium-3 dropdown-toggle nav-hide-arrow cursor-pointer"\
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="menu"></span>\
                                <div class="dropdown-menu dropdown-menu-left">\
                                    <a class="dropdown-item btn-children-delete" href="#" data-id="' +
          id +
          '"><i class="bx bx-trash mr-1"></i> delete</a>\
                                </div>\
                            </div>\
                    </td>\
                    </tr>'
      );
      $(".errdob").text("");
      $("#personal").find('input[name="dateofbirth"]').removeClass("error");
      $("#personal").find('input[name="firstname"]').val("");
      $("#personal").find('input[name="lastname"]').val("");
      $("#personal").find('input[name="middlename"]').val("");
      $("#personal").find('input[name="dateofbirth"]').val("");
    }
  }
});
//    $(document).on('click','.btn-children-edit', function(e){
//     e.preventDefault();
//         const id = $(this).data('id')
//         var item = children_array.find(item => item.id === id);
//         $('#salnEditModal').modal('show');

//        // $('#salnEditModal').find('#salnbodyModal').html('<h1>Hello</h1>');

//    });

// btn-liabilities-net btn-liabilities-bifc btn-liabilities-rgs

$("#personal")
  .find('input[name="no-child"]')
  .change(function () {
    if ($(this).is(":checked")) {
      $("#form-asset-children :input").prop("disabled", true);
      $(".btn-add-saln-children").prop("disabled", true);
      $("#personal").find('input[name="firstname"]').val("");
      $("#personal").find('input[name="lastname"]').val("");
      $("#personal").find('input[name="middlename"]').val("");
      $("#personal").find('input[name="dateofbirth"]').val("");
    } else {
      $("#form-asset-children :input").prop("disabled", false);
      $(".btn-add-saln-children").prop("disabled", false);
    }
  });

$("#assets")
  .find('input[name="no-rp"]')
  .change(function () {
    if ($(this).is(":checked")) {
      $(".content-real-prop :input").prop("disabled", true);
      $(".add-asset-div-real-prop").prop("disabled", true);
    } else {
      $(".content-real-prop :input").prop("disabled", false);
      $(".add-asset-div-real-prop").prop("disabled", false);
    }
  });

$("#assets")
  .find('input[name="no-pp"]')
  .change(function () {
    if ($(this).is(":checked")) {
      $(".content-personal-prop :input").prop("disabled", true);
      $(".add-asset-div-personal-prop").prop("disabled", true);
    } else {
      $(".content-personal-prop :input").prop("disabled", false);
      $(".add-asset-div-personal-prop").prop("disabled", false);
    }
  });

$("#liabilities")
  .find('input[name="no-l"]')
  .change(function () {
    if ($(this).is(":checked")) {
      $(".content-net :input").prop("disabled", true);
      $(".btn-liabilities-net").prop("disabled", true);
    } else {
      $(".content-net :input").prop("disabled", false);
      $(".btn-liabilities-net").prop("disabled", false);
    }
  });

$("#liabilities")
  .find('input[name="no-rgs"]')
  .change(function () {
    if ($(this).is(":checked")) {
      $(".content-rgs :input").prop("disabled", true);
      $(".btn-liabilities-rgs").prop("disabled", true);
    } else {
      $(".content-rgs :input").prop("disabled", false);
      $(".btn-liabilities-rgs").prop("disabled", false);
    }
  });

$("#liabilities")
  .find('input[name="no-bifc"]')
  .change(function () {
    if ($(this).is(":checked")) {
      $(".content-bifc :input").prop("disabled", true);
      $(".btn-liabilities-bifc").prop("disabled", true);
    } else {
      $(".content-bifc :input").prop("disabled", false);
      $(".btn-liabilities-bifc").prop("disabled", false);
    }
  });

  $("#personal")
  .find('input[name="no-spouse"]')
  .change(function () {
    if ($(this).is(":checked")) {
      $('.div-spouse').hide();
    } else {
      $('.div-spouse').show();
    }
  });
  


$(document).on("click", ".btn-liabilities-net", function (e) {
  e.preventDefault();
  var nature = $("#form-liabilities").find('input[name="net_nature"]').val();
  var creditors = $("#form-liabilities")
    .find('input[name="net_creditors"]')
    .val();
  var balance = $("#form-liabilities").find('input[name="net_balance"]').val();
  var checkT = true;
  if (!nature) {
    $("#form-liabilities").find('input[name="net_nature"]').addClass("error");
    checkT = false;
  } else {
    checkT = true;
    $("#personal").find('input[name="net_nature"]').removeClass("error");
  }
  if (checkT) {
    id = new Date().getTime();
    data = {
      id: id,
      nature: nature,
      creditors: creditors,
      balance: balance,
    };
    liablities_net_array.push(data);
    $("#LiabilitiesNetTable > tbody:last-child").append(
      "<tr>\
                <td>" +
        nature +
        "</td>\
                <td>" +
        creditors +
        "</td>\
                <td> <b>&#8369;</b> " +
                toDecimal(balance) +
        '</td>\
                <td>\
                <div class="dropdown">\
                        <span class="bx bx-dots-vertical-rounded font-medium-3 dropdown-toggle nav-hide-arrow cursor-pointer"\
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="menu"></span>\
                            <div class="dropdown-menu dropdown-menu-left">\
                                <a class="dropdown-item btn-liablities_net-delete" href="#" data-id="' +
        id +
        '"><i class="bx bx-trash mr-1"></i> delete</a>\
                            </div>\
                        </div>\
                </td>\
                </tr>'
    );
    $("#form-liabilities").find('input[name="net_nature"]').val("");
    $("#form-liabilities").find('input[name="net_creditors"]').val("");
    $("#form-liabilities").find('input[name="net_balance"]').val("");
    $("#btn-submit-liabilities").prop("disabled", false);
  }
});

$(document).on("click", ".btn-liabilities-rgs", function (e) {
  e.preventDefault();
  var name = $("#form-liabilities").find('input[name="rgs_name"]').val();
  var relationship = $("#form-liabilities")
    .find('input[name="rgs_relationship"]')
    .val();
  var position = $("#form-liabilities")
    .find('input[name="rgs_position"]')
    .val();
  var agency = $("#form-liabilities").find('input[name="rgs_agency"]').val();
  var checkT = true;
  if (!name) {
    $("#form-liabilities").find('input[name="rgs_name"]').addClass("error");
    checkT = false;
  } else {
    checkT = true;
    $("#form-liabilities").find('input[name="rgs_name"]').removeClass("error");
  }
  if (checkT) {
    id = new Date().getTime();
    data = {
      id: id,
      name: name,
      relationship: relationship,
      position: position,
      agency: agency,
    };
    liablities_rgs_array.push(data);
    $("#LiabilitiesRGSTable > tbody:last-child").append(
      "<tr>\
                <td>" +
        name +
        "</td>\
                <td>" +
        relationship +
        "</td>\
                <td>" +
        position +
        "</td>\
                <td>" +
        agency +
        '</td>\
                <td>\
                <div class="dropdown">\
                        <span class="bx bx-dots-vertical-rounded font-medium-3 dropdown-toggle nav-hide-arrow cursor-pointer"\
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="menu"></span>\
                            <div class="dropdown-menu dropdown-menu-left">\
                                <a class="dropdown-item btn-liablities_rgs-delete" href="#" data-id="' +
        id +
        '"><i class="bx bx-trash mr-1"></i> delete</a>\
                            </div>\
                        </div>\
                </td>\
                </tr>'
    );
    $("#form-liabilities").find('input[name="rgs_name"]').val("");
    $("#form-liabilities").find('input[name="rgs_relationship"]').val("");
    $("#form-liabilities").find('input[name="rgs_position"]').val("");
    $("#form-liabilities").find('input[name="rgs_agency"]').val("");
    $("#btn-submit-liabilities").prop("disabled", false);
  }
});

$(document).on("click", ".btn-liabilities-bifc", function (e) {
  e.preventDefault();
  var name = $("#form-liabilities").find('input[name="bifc_name"]').val();
  var address = $("#form-liabilities")
    .find('input[name="bifc_baddress"]')
    .val();
  var nature = $("#form-liabilities").find('input[name="bifc_nature"]').val();
  var date = $("#form-liabilities").find('input[name="bifc_date"]').val();
  var checkT = true;
  if (!name) {
    $("#form-liabilities").find('input[name="bifc_name"]').addClass("error");
    checkT = false;
  } else {
    checkT = true;
    $("#form-liabilities").find('input[name="bifc_name"]').removeClass("error");
  }
  if (checkT) {
    id = new Date().getTime();
    data = {
      id: id,
      name: name,
      address: address,
      nature: nature,
      date: date,
    };
    liablities_bifc_array.push(data);
    $("#LiabilitiesBIFCTable > tbody:last-child").append(
      "<tr>\
                <td>" +
        name +
        "</td>\
                <td>" +
        address +
        "</td>\
                <td>" +
        nature +
        "</td>\
                <td>" +
        date +
        '</td>\
                <td>\
                <div class="dropdown">\
                        <span class="bx bx-dots-vertical-rounded font-medium-3 dropdown-toggle nav-hide-arrow cursor-pointer"\
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="menu"></span>\
                            <div class="dropdown-menu dropdown-menu-left">\
                                <a class="dropdown-item btn-liablities_bifc-delete" href="#" data-id="' +
        id +
        '"><i class="bx bx-trash mr-1"></i> delete</a>\
                            </div>\
                        </div>\
                </td>\
                </tr>'
    );
    $("#form-liabilities").find('input[name="bifc_name"]').val("");
    $("#form-liabilities").find('input[name="bifc_baddress"]').val("");
    $("#form-liabilities").find('input[name="bifc_nature"]').val("");
    $("#form-liabilities").find('input[name="bifc_date"]').val("");
    $("#btn-submit-liabilities").prop("disabled", false);
  }
});

$(document).on("click", ".btn-children-delete", function (e) {
  e.preventDefault();
  var thisval = $(this);
  var id = $(this).data("id");
  var index = children_array.findIndex(function (i) {
    return i.id === id;
  });
  if (index !== -1) children_array.splice(index, 1);
  thisval.closest("tr").remove();
  if (children_array.length === 0) {
    $("#btn-save-children").prop("disabled", true);
  }
});
$(document).on("click", ".btn-assetrp-delete", function (e) {
  e.preventDefault();
  var thisval = $(this);
  var id = $(this).data("id");
  var index = assetrp_array.findIndex(function (i) {
    return i.id === id;
  });
  if (index !== -1) assetrp_array.splice(index, 1);
  thisval.closest("tr").remove();
  if (assetrp_array.length === 0 && assetpp_array.length == 0) {
    $("#btn-submit-asset").prop("disabled", true);
  }
});

$(document).on("click", ".btn-assetpp-delete", function (e) {
  e.preventDefault();
  var thisval = $(this);
  var id = $(this).data("id");
  var index = assetpp_array.findIndex(function (i) {
    return i.id === id;
  });
  if (index !== -1) assetpp_array.splice(index, 1);
  thisval.closest("tr").remove();
  if (assetrp_array.length === 0 && assetpp_array.length == 0) {
    $("#btn-submit-asset").prop("disabled", true);
  }
});

$(document).on("click", ".btn-liablities_bifc-delete", function (e) {
  e.preventDefault();
  var thisval = $(this);
  var id = $(this).data("id");
  var index = liablities_bifc_array.findIndex(function (i) {
    return i.id === id;
  });
  if (index !== -1) liablities_bifc_array.splice(index, 1);
  thisval.closest("tr").remove();
  if (
    liablities_net_array.length == 0 &&
    liablities_bifc_array.length == 0 &&
    liablities_rgs_array.length == 0
  ) {
    $("#btn-submit-liabilities").prop("disabled", true);
  }
});
$(document).on("click", ".btn-liablities_net-delete", function (e) {
  e.preventDefault();
  var thisval = $(this);
  var id = $(this).data("id");
  var index = liablities_net_array.findIndex(function (i) {
    return i.id === id;
  });
  if (index !== -1) liablities_net_array.splice(index, 1);
  thisval.closest("tr").remove();
  if (
    liablities_net_array.length == 0 &&
    liablities_bifc_array.length == 0 &&
    liablities_rgs_array.length == 0
  ) {
    $("#btn-submit-liabilities").prop("disabled", true);
  }
});
$(document).on("click", ".btn-liablities_rgs-delete", function (e) {
  e.preventDefault();
  var thisval = $(this);
  var id = $(this).data("id");
  var index = liablities_rgs_array.findIndex(function (i) {
    return i.id === id;
  });
  if (index !== -1) liablities_rgs_array.splice(index, 1);
  thisval.closest("tr").remove();
  if (
    liablities_net_array.length == 0 &&
    liablities_bifc_array.length == 0 &&
    liablities_rgs_array.length == 0
  ) {
    $("#btn-submit-liabilities").prop("disabled", true);
  }
});

$(document).on("click", "#btn-save-children", function (e) {
  e.preventDefault();
  var info = $(".tab-content").find('input[name="option_id"]').val();
  data = {
    child_data: children_array,
    type: "child",
    info: info,
  };
  $.ajax({
    url: "/saln/store",
    method: "POST", //send it through get method
    data: { data },
    success: function (response) {
      if (response.status == 200) {
        children_array = []
        $('#btn-save-children').prop('disabled',true)
        toastr.success(response.message);
      } else {
        toastr.error(response.message);
      }
    },
    error: function (xhr) {
      //Do Something to handle error
    },
  });
});

$(document).on("click", "#btn-submit-asset", function (e) {
  e.preventDefault();
  var info = $(".tab-content").find('input[name="option_id"]').val();
  data = {
    assetrp: assetrp_array,
    assetpp: assetpp_array,
    type: "asset",
    info: info,
  };
  $.ajax({
    url: "/saln/store",
    method: "POST", //send it through get method
    data: { data },
    success: function (response) {
      if (response.status == 200) {
        assetrp_array = []
        assetpp_array = []
        $('#btn-submit-asset').prop('disabled',true)
        toastr.success(response.message);
      } else {
        toastr.error(response.message);
      }
    },
    error: function (xhr) {
      //Do Something to handle error
    },
  });
});

$(document).on("click", "#btn-submit-liabilities", function (e) {
  e.preventDefault();
  var info = $(".tab-content").find('input[name="option_id"]').val();
  data = {
    bifc: liablities_bifc_array,
    rgs: liablities_rgs_array,
    net: liablities_net_array,
    type: "liabilities",
    info: info,
  };
  $.ajax({
    url: "/saln/store",
    method: "POST", //send it through get method
    data: { data },
    success: function (response) {
      if (response.status == 200) {
        liablities_bifc_array = []
        liablities_rgs_array = []
        liablities_net_array = []
        $('#btn-submit-liabilities').prop('disabled',true)
        toastr.success(response.message);
      } else {
        toastr.error(response.message);
      }
    },
    error: function (xhr) {
      //Do Something to handle error
    },
  });
});

// $(document).on("click", ".remove-asset-div-real-prop", function (e) {
//   e.preventDefault();
//   const id = $(this).data("id");
//   $(".card-assetrp-" + id).hide();
// });

$(document).on("click", ".add-asset-div-real-prop", function (e) {
  e.preventDefault();
  var description = $("#form-realprop").find('input[name="description"]').val();
  var kind = $("#form-realprop").find('input[name="kind"]').val();
  var eloc = $("#form-realprop").find('input[name="eloc"]').val();
  var assvalue = $("#form-realprop").find('input[name="assvalue"]').val();
  var cfmv = $("#form-realprop").find('input[name="cfmv"]').val();
  var ac_year = $("#form-realprop").find('input[name="ac_year"]').val();
  var ac_mode = $("#form-realprop").find('input[name="ac_mode"]').val();
  var ac_cost = $("#form-realprop").find('input[name="ac_cost"]').val();
  var checkT = true;
  var id = "";
  if (!description) {
    $("#form-realprop").find('input[name="description"]').addClass("error");
    $(".errdes").text("required");
    checkT = false;
  } else if (!kind) {
    $("#form-realprop").find('input[name="kind"]').addClass("error");
    $(".errkind").text("required");
    checkT = false;
  } else {
    checkT = true;
    $(".errdes").text("");
    $(".errkind").text("");
    $("#form-realprop").find('input[name="description"]').removeClass("error");
    $("#form-realprop").find('input[name="kind"]').removeClass("error");
    $("#form-realprop").find('input[name="description"]').val("");
    $("#form-realprop").find('input[name="kind"]').val("");
    $("#form-realprop").find('input[name="eloc"]').val("");
    $("#form-realprop").find('input[name="assvalue"]').val("");
    $("#form-realprop").find('input[name="cfmv"]').val("");
    $("#form-realprop").find('input[name="ac_year"]').val("");
    $("#form-realprop").find('input[name="ac_mode"]').val("");
    $("#form-realprop").find('input[name="ac_cost"]').val("");
  }
  if (checkT) {
    id = new Date().getTime();
    data = {
      id: id,
      description: description,
      kind: kind,
      eloc: eloc,
      assvalue: assvalue,
      cfmv: cfmv,
      ac_year: ac_year,
      ac_mode: ac_mode,
      ac_cost: ac_cost,
    };
    $("#btn-submit-asset").prop("disabled", false);
    assetrp_array.push(data);
    $("#AssetRPTable > tbody:last-child").append(
      "<tr>\
             <td>" +
        description +
        "</td>\
             <td>" +
        kind +
        "1</td>\
             <td>" +
        eloc +
        "</td>\
             <td> <b>&#8369;</b> " +
        toDecimal(assvalue) +
        "</td>\
             <td> <b>&#8369;</b> " +
             toDecimal(cfmv) +
        "</td>\
             <td>" +
        ac_year +
        "</td>\
             <td>" +
        ac_mode +
        "</td>\
             <td> <b>&#8369;</b> " +
             toDecimal(ac_cost) +
        '</td>\
             <td>\
               <div class="dropdown">\
                     <span class="bx bx-dots-vertical-rounded font-medium-3 dropdown-toggle nav-hide-arrow cursor-pointer"\
                             data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="menu"></span>\
                         <div class="dropdown-menu dropdown-menu-left">\
                             <a class="dropdown-item btn-assetrp-delete" href="#" data-id="' +
        id +
        '"><i class="bx bx-trash mr-1"></i> delete</a>\
                         </div>\
                     </div>\
             </td>\
          </tr>'
    );
  }
  //content-real-prop
});
$(document).on("click", ".remove-asset-div-personal-prop", function (e) {
  e.preventDefault();
  const id = $(this).data("id");
  $(".card-assetpp-" + id).hide();
});

$(document).on("click", ".add-asset-div-personal-prop", function (e) {
  e.preventDefault();
  var description = $("#form-realprop")
    .find('input[name="ppdescription"]')
    .val();
  var year = $("#form-realprop").find('input[name="ppyear"]').val();
  var ac_cost = $("#form-realprop").find('input[name="ppac_cost"]').val();
  var checkT = false;
  if (!description) {
    $("#form-realprop").find('input[name="ppdescription"]').addClass("error");
    $(".errdes").text("required");
    checkT = false;
  } else if (!year) {
    $("#form-realprop").find('input[name="ppyear"]').addClass("error");
    $(".errkind").text("required");
    checkT = false;
  } else {
    checkT = true;
    $(".errpdes").text("");
    $(".errpyear").text("");
    $("#form-realprop")
      .find('input[name="ppdescription"]')
      .removeClass("error");
    $("#form-realprop").find('input[name="ppyear"]').removeClass("error");
    $("#form-realprop").find('input[name="ppdescription"]').val("");
    $("#form-realprop").find('input[name="ppyear"]').val("");
    $("#form-realprop").find('input[name="ppac_cost"]').val("");
  }
  if (checkT) {
    id = new Date().getTime();
    data = {
      id: id,
      description: description,
      year: year,
      acp_cost: ac_cost,
    };
    assetpp_array.push(data);
    $("#btn-submit-asset").prop("disabled", false);
    $("#AssetPPTable > tbody:last-child").append(
      "<tr>\
                    <td>" +
        description +
        "</td>\
                    <td>" +
        year +
        "</td>\
                    <td> <b>&#8369;</b> " +
            toDecimal(ac_cost) +
        '</td>\
                    <td>\
                    <div class="dropdown">\
                            <span class="bx bx-dots-vertical-rounded font-medium-3 dropdown-toggle nav-hide-arrow cursor-pointer"\
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="menu"></span>\
                                <div class="dropdown-menu dropdown-menu-left">\
                                    <a class="dropdown-item btn-assetpp-delete" href="#" data-id="' +
        id +
        '"><i class="bx bx-trash mr-1"></i> delete</a>\
                                </div>\
                            </div>\
                    </td>\
                </tr>'
    );
    // console.log(assetpp_array);
  }
});



$(document).on("click", ".btn-upload-notarized-saln", function (e) {
  e.preventDefault();
  const id  = $(this).data('id');
  $('#notarized-saln-form').find('input[name="id"]').val(id);
  $('#UploadNotarizedSALNModal').modal('show');
});

$(document).on('submit', '#notarized-saln-form', function(e) {
  e.preventDefault();
        $.ajax({
            url: '/saln/saln-notarized',
            method: 'post',
            data:  new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            beforeSend:function(){
            $('#btnNotarizedSALNSubmit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Uploading...');
            },
            success:function(response){
             
                if(response.status == 200){
                    $('#UploadNotarizedSALNModal').modal('hide')
                    toastr.success(response.message)  
                    $("#notarized-saln-form")[0].reset();  
                    $("#SALN-Table").DataTable().ajax.reload();
                    //  loadTable(selected_emp_id);
                      //loadTableDT(selected_emp_id)
                    //  ServiceRecorddtTable.ajax.reload(null, false);     
                }else{
                  toastr.error(response.message)  
                }
                $('#btnNotarizedSALNSubmit').html('<i class="bx bx-upload"></i> Upload');
            },
            error: function(err) {
              if(err.status === 200){
                  $('#UploadNotarizedSALNModal').modal('hide')
                  toastr.success('File Successfully Upload')  
                  $("#notarized-saln-form")[0].reset(); 
                  $("#SALN-Table").DataTable().ajax.reload();
              }
              $('#UploadNotarizedSALNModal').modal('hide')
              $("#notarized-saln-form")[0].reset(); 
              $('#btnNotarizedSALNSubmit').html('<i class="bx bx-upload"></i> Upload');
            }

       });
});


function toDecimal(val){
 var dec = 0;
 if(isNaN(val)){
  parseFloat(val).toFixed(2)
 }
 return dec;
}






