var employeeName = new Array();
var employeeId = new Array();
var selected_emp_id = '';
var VwTable;

$(function(){
    $.ajax({
        url: '/employee/employeelist',
        method: 'post',
        dataType: 'json',
        beforeSend:function(){
            $('.loading-select').html('<i class="spinner-border spinner-border-sm"></i> Loading... ');
        },
        success:function(result){
                $('.loading-select').html('');
                var i = 0;
                if (employeeName === undefined || employeeName.length == 0){
                    result.employees.data.map( function (data){
                      employeeName[i] = data.FirstName+' '+(data.MiddleName?data.MiddleName:'') +' '+data.LastName;
                      employeeId[i] = data.id;
                      i++;
                      $('.select-superadmin-list-modal').append('<option data-name="'+data.FirstName+' '+(data.MiddleName?data.MiddleName:'') +' '+data.LastName+'" value="'+data.id+'"> '+data.FirstName+' '+(data.MiddleName?data.MiddleName:'') +' '+data.LastName+' </option>');
                      });
                } else{
                      for (let index = 0; index < employeeName.length; index++) {
                          $('.select-superadmin-list-modal').append('<option data-name="'+employeeName[index]+'" value="'+employeeId[index]+'"> '+employeeName[index]+' </option>');
                      }  
                  }
                  $("#add-btn-voluntary-work").prop("disabled", false);
        }
    });

    $('#allAccountModal').on('hidden.bs.modal', function () {
        $(".select-superadmin-list-modal").val('').trigger('change')
        $('#account-form').find('span.employee_id_error').text('');
    });

    var formthis = '';
    $('#allAccountModal').on('hidden.bs.modal', function () {
        $('#account-form')[0].reset();
      })
    $('#add-account-btn').on('click', function(e){
        e.preventDefault();
        $('#account-form').find('input[name="id"]').val('')
        $(".account_pass").show();
        $('.employeesearchlabel').show();
        $("#account_id").val('');
        $('#allAccountModal').modal('show');
    });

    
  
    $(document).on("click", ".btn-account-edit" , function(e) {
        e.preventDefault()
      
        const id = $(this).data('id');
       $('.employeesearchlabel').hide();
        $('#allAccountModal').modal('show');
        $('#account-form').find('input[name="id"]').val(id)

        $.ajax({
            url: 'account/edit',
            method: 'post',
            data: { id:id },
            // processData: false,
            // dataType: false,
            // contentType: false,
            beforeSend:function(){
            // $(form).find('span.error-text').text('');
           // $('#add-account-form').find('span').text('');
             $('.account-error-msg').html('<i class="spinner-grow text-info"></i> Please wait...')
            },
            success:function(response){
              var  arr_length = response.data.length;
                if(arr_length == 1){
                    $('.account-error-msg').html('')
                    $('#account-form').find('select[name="role"]').val(response.data[0])
                }else{
                    $('.account-error-msg').html('<h5>'+response.data[0]+'</h5>')
                    $('#account-form').find('select[name="role"]').val(response.data[1])
                }
            }

       });
       

    });

    $('#account-form').on('submit', function(e){
        e.preventDefault();
        $.ajax({
           // url:  'account/'+id===''?'create':'update',
            url:  'account/create',
            method: 'post',
            data: $('#account-form').serialize(),
            // processData: false,
            // dataType: false,
            // contentType: false,
            beforeSend:function(){
            $('#add-account-form').find('span').text('');
            $('#btnAccountSubmit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...');
            },
            success:function(data){
                if(data.status === 200){
                    $('#allAccountModal').modal('hide');
                    $('#account-table').DataTable().ajax.reload();
                    toastr.success(data.message);
                }else if(data.status === 400){
                        $.each(data.message, function(prefix,val){
                            $('#account-form').find('span.'+prefix+'_error').text(val[0]);
                        });
                    } 
                  $('#btnAccountSubmit').html('<i class="bx bx-save"></i> Save');


            }

        });
    });

    $('#login-form').on('submit', function(e){
        e.preventDefault();
        $.ajax({
            url: '/signin',
            method: 'post',
            data: $('#login-form').serialize(),
            // processData: false,
            // dataType: false,
            // contentType: false,
            beforeSend:function(){
            $('#btn-auth-login').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...');
            },
            success:function(data){
                if(data.status === 200){
                  window.location.href = data.message;
                }else if(data.status === 400){
                   $('.login-error-msg').html('<div class="alert bg-rgba-danger alert-dismissible mb-2" role="alert">\
                   <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
                   <span aria-hidden="true">×</span>\
                   </button>\
                   <div class="d-flex align-items-center">\
                   <i class="bx bx-error"></i>\
                   <span>'+data.message+'</span>\
                   </div>')
                }
                else if(data.status === 404){
                    toastr.error('Something went wrong. Try again!');
                }
                $('#btn-auth-login').html('<i id="icon-arrow" class="bx bx-right-arrow-alt"></i> Login ');
            }

        });
    });
    $(document).on("click", "a.btn-account-delete" , function() {

        const id = $(this).data('id');
            Swal.fire({
              title: 'Are you sure?',
              text: "You want delete this!",
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
                        url: '/account/delete',
                        method: 'post',
                        data: {id : id},
                        beforeSend:function(){
                        // $(form).find('span.error-text').text('');
                        },
                        success:function(response){
                        if(response.status == 200){
                            $('#account-table').DataTable().ajax.reload();
                            Swal.fire({
                                type: "success",
                                title: 'Deleted!',
                                text: response.message,
                                confirmButtonClass: 'btn btn-success',
                                })
                        }else{
                            Swal.fire({
                                type: "error",
                                title: 'Deleted!',
                                text: response.message,
                                confirmButtonClass: 'btn btn-danger',
                                })

                        }
                         
                        }
            
                    });
              }
            });
    });

});
