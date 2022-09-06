
$(function(){

    var employeeName = new Array();
    var employeeId = new Array();
    var selected_emp_id = '';
    var VwTable;
     $(document).ready(function() {


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
        $('#LeaveTable').DataTable().ajax.reload(isComplete, false);
        var employee_name = $(this).find(':selected').attr('data-name')
        $('#import-voluntary-work-form').find('.for-name').html('For: <b>'+employee_name+'</b>');
     //  loadTable(employee_id);
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
             url: '/voluntary-work/edit',
             data: { id: id },
             dataType: 'json',
             beforeSend:function(){
                 $('#bodyModal').css('display', 'none');
                 $('#beforeSend').css('display', 'block');
                 $('#beforeSend').html('<i class="spinner-grow text-info"></i> Please wait...');
                  },
             success: function(response) {
                
                 $('#beforeSend').css('display', 'none');
                 $('#bodyModal').css('display', 'block');

                const {NameAddressOrganization,DateFrom,DateTo,NumberHours,id,Position} = response.data
                 $('#voluntary-work-form').find('input[name="nameaddress"]').val(NameAddressOrganization);
                 $('#voluntary-work-form').find('input[name="from"]').val(DateFrom);
                 $('#voluntary-work-form').find('input[name="to"]').val(DateTo);
                 $('#voluntary-work-form').find('input[name="numberhour"]').val(NumberHours);
                 $('#voluntary-work-form').find('input[name="position"]').val(Position);
                 $('#voluntary-work-form').find('input[name="vw_id"]').val(id);
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




    $('#btnVoluntaryWorkSubmit').on('click', function(e){
        e.preventDefault();

            $.ajax({
                url: '/voluntary-work/store',
                method: 'post',
                data: $('#voluntary-work-form').serialize(),
                beforeSend:function(){
                $('#voluntary-work-form').find('.employee_id_error').text('');
                $('#voluntary-work-form').find('.nameaddress_error').text('');
                $('#btnVoluntaryWorkSubmit').prop('disabled',true)
                $('#btnVoluntaryWorkSubmit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...');
                },
                success:function(data){
                   
                    if(data.status === 200){
                        $('#VoluntaryWorkModal').modal('hide')
                        $('#LeaveTable').DataTable().ajax.reload(null, false);
                        toastr.success(data.message) 
                        //loadTable(data.empId)          
                    }else if(data.status === 400){
                        $.each(data.message, function(prefix,val){
                            $('#voluntary-work-form').find('span.'+prefix+'_error').text(val[0]);
                        });
                    }
                    else if(data.status === 401 || data.status === 500 || data.status === 404){
                        toastr.error(data.message);
                    }
                    $('#btnVoluntaryWorkSubmit').prop('disabled',false)
                    $('#btnVoluntaryWorkSubmit').html('<i class="bx bx-save"></i> Save');
                }

            });
    });

    $(document).on("click", ".btn-delete-voluntary-work" , function(e) {
        e.preventDefault();
        var id = $(this).data('id');
        var type = $(this).data('type');
        var thisval = $(this);
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to delete this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            confirmButtonClass: 'btn btn-warning',
            cancelButtonClass: 'btn btn-danger ml-1',
            buttonsStyling: false,
          }).then(function (result) {
              
            if (result.value) {
                  $.ajax({
                      url: '/employee/delete_employee_background_infos',
                      method: 'post',
                      data: {id ,type},
                      beforeSend:function(){
                      // $(form).find('span.error-text').text('');
                      },
                      success:function(result){
                        if(result.status === 200){
                            $('#LeaveTable').DataTable().ajax.reload(null, false);
                            Swal.fire({
                            type: "success",
                            title: 'Deleted!',
                            text: result.message,
                            confirmButtonClass: 'btn btn-success',
                            });
                        }else{
                            Swal.fire({
                                type: "danger",
                                title: 'Deleted!',
                                text: result.message,
                                confirmButtonClass: 'btn btn-danger',
                                })

                        }
                      }
          
                  });
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


    $(document).on('submit', '#import-voluntary-work-form', function(e) {
        e.preventDefault();
              $.ajax({
                  url: '/voluntary-work/import',
                  method: 'post',
                  data:  new FormData(this),
                  contentType: false,
                  cache: false,
                  processData: false,
                  beforeSend:function(){
                   $('#btnimportVoluntaryWorkSubmit').prop('disabled',true)
                  $('#btnimportVoluntaryWorkSubmit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...');
                  },
                  success:function(response){
                      if(response.status == 200){
                          $('#ImportVoluntaryWorkModal').modal('hide')
                          $('#LeaveTable').DataTable().ajax.reload(null, false);
                          toastr.success(response.message)  
                          $("#import-voluntary-work-form")[0].reset();  
                           // loadTable(selected_emp_id);
                      }else{
                            toastr.error(response.message)  
                        }
                      $('#btnimportVoluntaryWorkSubmit').prop('disabled',false)
                      $('#btnimportVoluntaryWorkSubmit').html('<i class="bx bx-save"></i> Save');
                  },
                  error: function(err) {
                    if(err.status === 200){
                        toastr.success('Voluntary Work Successfully Added')  
                    }
                    $('#ImportVoluntaryWorkModal').modal('hide')
                    $('#LeaveTable').DataTable().ajax.reload(null, false);
                    $("#import-voluntary-work-form")[0].reset();  
                    $('#btnimportVoluntaryWorkSubmit').prop('disabled',false)
                    $('#btnimportVoluntaryWorkSubmit').html('<i class="bx bx-save"></i> Save');
                  }
  
              });
      });


      $(document).on('click', '.btn-post-voluntary-work', function() {
        const id = $(this).data('id');
        //var thisval = $(this);
        Swal.fire({
          title: '<h4><b>Post?</b></h4>',
        //   text: "Post?",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirm!',
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-warning ml-1',
          buttonsStyling: false,
        }).then(function (result) {
            if (result.value) {
                    $.ajax({
                        url: '/voluntary-work/posted',
                        method: 'post',
                        data: {id : id},
                        success:function(data){
                           
                            if(data.status === 200){
                                $('#LeaveTable').DataTable().ajax.reload(null, false); 
                              //  loadTable(data.employee_id)
                                Swal.fire({
                                type: "success",
                                title: '<h4><b>Posted!</b></h4>',
                                text: data.message,
                                confirmButtonClass: 'btn btn-success',
                                })
                            }else{
                                Swal.fire({
                                    type: "error",
                                    title: 'Error!',
                                    text: data.message,
                                    confirmButtonClass: 'btn btn-danger',
                                    })
                            }
                        }
                    });
            }
        });
    });





        //     VwTable  =  $('#LeaveTable').DataTable({
        //         processing: true,
        //         info: true,
        //         responsive : true,
        //         ordering: false,
        //         "ajax" : {
        //                 "url" : "{{ route('leave.list') }}",
        //                 "type" : "POST", 
        //                 "data": function(set){
        //                     set.employee_id = selected_emp_id;
        //                 },    
        //                 },
        //         "pageLength": 10,
        //         "aLengthMenu":[[10,25,50,100,-1],[10,25,50,100,'All']],
        //         columns: [
        //                 {data:'action', name:'action'},
        //                 {data: 'description', name: 'description'},
        //                 {data: 'type', name: 'type'},
        //                 {data: 'status', name: 'status'},
        //                 ],
        //         "initComplete": isComplete,
        // });
        
        
        

        // function isComplete() {
        //     var check = $('#VwTable').find('.dataTables_empty').html();
        //     if(check){
        //         if(selected_emp_id){
        //             $(".import-btn-voluntary-work").prop("disabled", false);
        //             toastr.warning('No Record Found')
        //         }
        //     }else{
        //         if(selected_emp_id){
        //         $(".import-btn-voluntary-work").prop("disabled", true);
        //         }
        //     }
        // }








});
