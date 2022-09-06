$(document).on("click", "#chkAll", function(){
    if ($("#chkAll").is(':checked')) {
        $(".allchk").prop("checked", true)
        $("#empid").attr("data-empid",getID());
    }else{
        $(".allchk").prop("checked", false)
        $("#empid").attr("data-empid",getID());
    }
    
})

$(document).on("click", ".allchk", function(){
    var checked = $(".allchk:checked").length;
    var ctr = $(".allchk").length;
    $("#empid").attr("data-empid",getID());
    if (checked == ctr){
        $("#chkAll").prop("checked", true);
    }else{
        $("#chkAll").prop("checked", false);
    }
    
});

function getID(){
    var valuesArray = $('.allchk:checked:checked').map( function() {
        return this.value;
    }).get().join(",");
    return valuesArray;
}

$("#allModalDTR").on("shown.bs.modal", function(e){
    var flag = $(e.relatedTarget).data('flag');
    var button = $(e.relatedTarget).data('button');
    var id = $(e.relatedTarget).data('id');
    var empid = $(e.relatedTarget).data('empid');
 
    $.ajax({
        type: "POST",
        url: "/router",
        cache: false,
        data: {flag:flag,button:button,id:id,empid:empid},
        success: function (data) {
          $("#bodyModalDTR").html(data);
        }
    });

})

$("#allModalDTR").on("hidden.bs.modal", function(e){
    location.reload();
})

$(document).on("click",".btnPrintAll", function(){
    // alert ("FFF");
    printElement(document.getElementById("printThis"));
    window.print();
    // $('#printThis').printThis();
});

function printElement(elem, append, delimiter) {
    var domClone = elem.cloneNode(true);
    var $printSection = document.getElementById("printSection");

    if (!$printSection) {
        var $printSection = document.createElement("div");
        $printSection.id = "printSection";
        document.body.appendChild($printSection);
    }

    if (append !== true) {
        $printSection.innerHTML = "";
    }else if (append === true) {
        if (typeof(delimiter) === "string") {
            $printSection.innerHTML += delimiter;
        }
        else if (typeof(delimiter) === "object") {
            $printSection.appendChlid(delimiter);
        }
    }

    $printSection.appendChild(domClone);
}