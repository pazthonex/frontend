$(function(){

    var employeeName = new Array();
    var employeeId = new Array();
    var selected_emp_id = '';
    var VwTable;
    var GetType;
    
     $(document).ready(function() {
        GetType = 'unread'
        NotarizedTable.ajax.reload(isComplete, false);

      $("#add-btn-voluntary-work").prop("disabled", true);
      $(".print-btn-voluntary-work").prop("disabled", true);
      $(".import-btn-voluntary-work").prop("disabled", true);
      $('#employee-list-data-select').css('display', 'none');
     //document.getElementById("add-btn-service-record").disabled = true;
      $.ajax({
          url: '/employee/employeelist',
          method: 'post',
          dataType: 'json',
          beforeSend:function(){
              $('.loading-select').html('<i class="spinner-border spinner-border-sm"></i> Loading... ');
              $('.select-employee-list').hide();
          },
          success:function(result){
                  $('#employee-list-data-select').css('display', 'flex');
                  $('.loading-select').html('');
                  var i = 0;
                  if (employeeName === undefined || employeeName.length == 0){
                      result.employees.data.map( function (data){
                        employeeName[i] = data.FirstName+' '+(data.MiddleName?data.MiddleName:'') +' '+data.LastName;
                        employeeId[i] = data.id;
                        i++;
                        $('.select-employee-list').append('<option data-name="'+data.FirstName+' '+(data.MiddleName?data.MiddleName:'') +' '+data.LastName+'" value="'+data.id+'"> '+data.FirstName+' '+(data.MiddleName?data.MiddleName:'') +' '+data.LastName+' </option>');
                        });
                  } else{
                        for (let index = 0; index < employeeName.length; index++) {
                            $('.select-employee-list').append('<option data-name="'+employeeName[index]+'" value="'+employeeId[index]+'"> '+employeeName[index]+' </option>');
                        }  
                    }
                    $("#add-btn-voluntary-work").prop("disabled", false);
          }
      });

     });



     $('.select-employee-list').on('change', function() {
        var employee_id = this.value;
        selected_emp_id = employee_id
        GetType = selected_emp_id
        NotarizedTable.ajax.reload(isComplete, false);
      });
    $('#add-btn-voluntary-work').on('click', function(e){
        e.preventDefault();
        $('#hideforadd').css('display', 'flex');
        $('#beforeSend').css('display', 'none');
        $('#VoluntaryWorkModal').modal('show');
        $('#voluntary-work-form').find('input[name="ldt_id"]').val('');
        if (employeeName === undefined || employeeName.length == 0){
        $('.loading-select-modal').html('<i class="spinner-border spinner-border-sm"></i> Loading... ');
        } else{
            for (let index = 0; index < employeeName.length; index++) {
            $('.select-employee-list-modal').append('<option value="'+employeeId[index]+'"> '+employeeName[index]+' </option>');
          }
          $('.loading-select-modal').html('');
      }

    });
    $(document).on("click", ".btn-edit-voluntary-work" , function() {
          $('#VoluntaryWorkModal').modal('show');
         $('#hideforadd').css('display', 'none');
         const id = $(this).data('id');
         getRow(id);
     });
    function getRow(id) {
            $.ajax({
                type: 'POST',
                url: '/employee/notarized-pds/search',
                data: { employee_id: id },
                dataType: 'json',
                beforeSend:function(){
                //  $('#bodyModal').css('display', 'none');
                    // $('#beforeSend').css('display', 'block');
                    // $('#beforeSend').html('<i class="spinner-grow text-info"></i> Please wait...');
                    },
                success: function(response) {
                 
                    //  $('#beforeSend').css('display', 'none');
                    //  $('#bodyModal').css('display', 'block');

                    // const {NameAddressOrganization,DateFrom,DateTo,NumberHours,id,Position} = response.data
                    //  $('#voluntary-work-form').find('input[name="nameaddress"]').val(NameAddressOrganization);
                    //  $('#voluntary-work-form').find('input[name="from"]').val(DateFrom);
                    //  $('#voluntary-work-form').find('input[name="to"]').val(DateTo);
                    //  $('#voluntary-work-form').find('input[name="numberhour"]').val(NumberHours);
                    //  $('#voluntary-work-form').find('input[name="position"]').val(Position);
                    //  $('#voluntary-work-form').find('input[name="vw_id"]').val(id);
                },
                error: function() {
                    toastr.error('Server Error')
                }
            });
        }

     $('#VoluntaryWorkModal').on('hidden.bs.modal', function () {
        $("#voluntary-work-form")[0].reset();   
        $(".select-employee-list-modal").val('').trigger('change')
        $('#voluntary-work-form').find('.employee_id_error').text('');
        $('#voluntary-work-form').find('.nameaddress_error').text('');
      });    

    $('#idAllTable').dataTable({searching: false, paging: false, info: false , ordering: false});


   


    $(document).on("click", ".btn-approve-notarized" , function(e) {
       e.preventDefault();
              var id = $(this).data('id');
              const status = 'approved'
              const remarks = ''
                Swal.fire({
                  title: 'Approved?',
                  text: "Notarized PDS",
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes !',
                  confirmButtonClass: 'btn btn-success',
                  cancelButtonClass: 'btn btn-warning ml-1',
                  buttonsStyling: false,
                }).then(function (result) {
                  if (result.value) {
                
                        $.ajax({
                            "url" : "/employee/status_notarized",
                            method: 'post',
                            data: {id ,status,remarks},
                            beforeSend:function(){
                            // $(form).find('span.error-text').text('');
                            },
                            success:function(response){

                              
                                if(response.status == 200){
                                    //thisval.closest("tr").remove();
                                    NotarizedTable.ajax.reload(isComplete, false);
                                    Swal.fire({
                                    type: "success",
                                    title: 'Approved!',
                                    text: response.message,
                                    confirmButtonClass: 'btn btn-success',
                                    })
                                }else{
                                    Swal.fire({
                                    type: "error",
                                    title: 'Error!',
                                    text: response.message,
                                    confirmButtonClass: 'btn btn-danger',
                                    })
                                }
                            }
                        });
                  }
                });
     });

     $(document).on("click", ".btn-reject-notarized" , function(e) {
        e.preventDefault();
               const id = $(this).data('id');
               const status = 'reject'
                Swal.fire({
                  title: 'Reject?',
                  text: "Notarized PDS",
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Reject !',
                  confirmButtonClass: 'btn btn-danger',
                  cancelButtonClass: 'btn btn-warning ml-1',
                  buttonsStyling: false,
                }).then(function (result) {
                   
                  if (result.value) {
                    Swal.fire({
                        title: '<h5>Reason for Disapproved</h5>',
                        input: 'text',
                        confirmButtonClass: 'btn btn-sm btn-primary',
                        buttonsStyling: false,
                        inputAttributes: {
                          autocapitalize: 'off'
                        },
                        showCancelButton: true,
                        confirmButtonText: 'Okay',
                        showLoaderOnConfirm: true,
                        cancelButtonClass: "btn btn-danger btn-sm ml-1",
                        // preConfirm: function (login) {
                        //     console.log('loh:',login);
                        // },
                        allowOutsideClick: function () {
                          !Swal.isLoading()
                        }
                      }).then(function (result) {
                            if (result.value) {
                                var remarks = result.value;
                                $.ajax({
                                    url: '/employee/status_notarized',
                                    method: 'post',
                                    data: {id ,status,remarks},
                                    beforeSend:function(){
                                    // $(form).find('span.error-text').text('');
                                    },
                                    success:function(response){
                                        if(response.status == 200){
                                            //thisval.closest("tr").remove();
                                            NotarizedTable.ajax.reload(isComplete, false);
                                            Swal.fire({
                                            type: "warning",
                                            title: 'DisApproved!',
                                            text: response.message,
                                            confirmButtonClass: 'btn btn-success',
                                            })
                                        }else{
                                            
                                            Swal.fire({
                                            type: "error",
                                            title: 'Error!',
                                            text: response.message,
                                            confirmButtonClass: 'btn btn-danger',
                                            })
                                        }
                                    }
                                });
                            }
                      })
                  }
                });
    });



    $(document).on("click", ".import-btn-voluntary-work" , function() {
        $('#import-voluntary-work-form').find('input[name="id"]').val(btoa(selected_emp_id));
        $('#ImportVoluntaryWorkModal').modal('show');
     });

     $(document).on("click", ".download-btn-voluntary-work" , function() {
        window.location.href = '/voluntary-work/download-csv';
    });

    $(document).on("click", ".unread-notarized-pds" , function() {
        $(".select-employee-list").val('').trigger('change')
        elected_emp_id = 'unread'
        GetType = elected_emp_id
        NotarizedTable.ajax.reload(isComplete, false);
       
    });
    $(document).on("click", ".all-notarized-pds" , function() {
        $(".select-employee-list").val('').trigger('change')
        elected_emp_id = 'all'
        GetType = elected_emp_id
        NotarizedTable.ajax.reload(isComplete, false);
        
    });

    


        NotarizedTable  =  $('#NotarizedTable').DataTable({
                processing: true,
                info: true,
                responsive : true,
                ordering: false,
                 "ajax" : {
                            "url": "/employee/notarized-pds/search",
                            "type" : "POST", 
                            "data": function(set){
                                set.employee_id = GetType;
                            },
                        },
                "pageLength": 10,
                "aLengthMenu":[[10,25,50,100,-1],[10,25,50,100,'All']],
                columns: [
                      //  {data:'file', name:'file'},
                        {data: 'empname', name: 'empname'},
                        {data: 'notarized', name: 'notarized'},
                        {data: 'btnactions', name: 'btnactions'},
                        ],
             //   "initComplete": isComplete,
        });


        function isComplete() {
            var check = $('#NotarizedTable').find('.dataTables_empty').html();
            if(check){
                if(selected_emp_id){
                    $(".import-btn-voluntary-work").prop("disabled", false);
                    toastr.warning('No Record Found')
                }
            }else{
                if(selected_emp_id){
                $(".import-btn-voluntary-work").prop("disabled", true);
                }
            }
        }


        $(document).on("click", ".refresh-notarized-pds" , function() {
            NotarizedTable.ajax.reload(isComplete, false);
         });

      



});
