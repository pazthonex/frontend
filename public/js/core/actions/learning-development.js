$(function(){

    var employeeName = new Array();
    var employeeId = new Array();
    var departmentList = new Array();
    var selected_emp_id = '';
    var serviceRecordData = new Array();
    var LdTable;
    var isComplete;
     $(document).ready(function() {
      $("#add-btn-learning-development").prop("disabled", true);
      $(".print-btn-learning-development").prop("disabled", true);
      $(".import-btn-learning-development").prop("disabled", true);
      $('#employee-list-data-select').css('display', 'none');
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
                    $("#add-btn-learning-development").prop("disabled", false);
          }
      });

     });



     $('.select-employee-list').on('change', function() {
        var employee_id = this.value;
        selected_emp_id = employee_id
        var employee_name = $(this).find(':selected').attr('data-name')
        //loadTable(employee_id);
          LdTable.ajax.reload(isComplete, false);
          $('#import-learning-development-form').find('.for-name').html('For: <b>'+employee_name+'</b>');
      });

    $('#add-btn-learning-development').on('click', function(e){
        e.preventDefault();
        $('#hideforadd').css('display', 'flex');
        $('#beforeSend').css('display', 'none');
        $('#LearningDevelopmentModal').modal('show');
        $('#learning-development-form').find('input[name="ldt_id"]').val('');
        if (employeeName === undefined || employeeName.length == 0){
        $('.loading-select-modal').html('<i class="spinner-border spinner-border-sm"></i> Loading... ');
        } else{
            for (let index = 0; index < employeeName.length; index++) {
            $('.select-employee-list-modal').append('<option value="'+employeeId[index]+'"> '+employeeName[index]+' </option>');
          }
          $('.loading-select-modal').html('');
      }

    });
    $(document).on("click", ".btn-edit-learning-development" , function() {
         $('#LearningDevelopmentModal').modal('show');
         $('#hideforadd').css('display', 'none');
         const id = $(this).data('id');
         getRow(id);
     });
 function getRow(id) {
         $.ajax({
             type: 'POST',
             url: '/learning-development/edit',
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
                const {TiltleLearningDev,NumberHours,DateFrom,DateTo,ConductedBy,id,Type} = response.data
                 $('#learning-development-form').find('input[name="titleld"]').val(TiltleLearningDev);
                 $('#learning-development-form').find('input[name="numberhours"]').val(NumberHours);
                 $('#learning-development-form').find('input[name="from"]').val(DateFrom);
                 $('#learning-development-form').find('input[name="to"]').val(DateTo);
                 $('#learning-development-form').find('input[name="conducted"]').val(ConductedBy);
                 $('#learning-development-form').find('input[name="type"]').val(Type);
                 $('#learning-development-form').find('input[name="ldt_id"]').val(id);
             },
             error: function() {
                 toastr.error('Server Error')
             }
         });
     }

     $('#LearningDevelopmentModal').on('hidden.bs.modal', function () {
        $("#learning-development-form")[0].reset();     
        $('#learning-development-form').find('.employee_id_error').text('');
        $('#learning-development-form').find('.title_error').text('');
      //  $(".select-employee-list-modal").val('').trigger('change')
      });    

    $('#idAllTable').dataTable({searching: false, paging: false, info: false , ordering: false});




    $('#btnLearningDevSubmit').on('click', function(e){
        e.preventDefault();

            $.ajax({
                url: '/learning-development/store',
                method: 'post',
                data: $('#learning-development-form').serialize(),
                beforeSend:function(){
                $('#learning-development-form').find('.employee_id_error').text('');
                $('#learning-development-form').find('.title_error').text('');
                $('#btnLearningDevSubmit').prop('disabled', true)
                $('#btnLearningDevSubmit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...');
                },
                success:function(data){
                   
                    if(data.status === 200){
                        $('#LearningDevelopmentModal').modal('hide')
                        LdTable.ajax.reload(null, false);
                        toastr.success(data.message) 
                       // loadTable(data.empId)          
                    }else if(data.status === 400){
                        $.each(data.message, function(prefix,val){
                            $('#learning-development-form').find('span.'+prefix+'_error').text(val[0]);
                        });
                    }
                    else if(data.status === 500 || data.status === 404){
                        toastr.error(data.message);
                    }
                    $('#btnLearningDevSubmit').prop('disabled', false)
                    $('#btnLearningDevSubmit').html('<i class="bx bx-save"></i> Save');
                }

            });
    });

    $(document).on("click", ".btn-delete-learning-development" , function(e) {
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
                         LdTable.ajax.reload(null, false);
                          //  thisval.closest("tr").remove();
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


    $(document).on("click", ".import-btn-learning-development" , function() {
        $('#import-learning-development-form').find('input[name="id"]').val(btoa(selected_emp_id));
        $('#ImportLearningDevelopmentModal').modal('show');
     });

     $(document).on("click", ".download-btn-learning-development" , function() {
       
        window.location.href = '/learning-development/download-csv';

    });


    $(document).on('submit', '#import-learning-development-form', function(e) {
        e.preventDefault();
              $.ajax({
                  url: '/learning-development/import',
                  method: 'post',
                  data:  new FormData(this),
                  contentType: false,
                  cache: false,
                  processData: false,
                  beforeSend:function(){
                  $('#btnimportLearningDevelopSubmit').prop('disabled',true)
                  $('#btnimportLearningDevelopSubmit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...');
                  },
                  success:function(response){
                      if(response.status == 200){
                          $('#ImportLearningDevelopmentModal').modal('hide')
                          LdTable.ajax.reload(null, false);
                          toastr.success(response.message)  
                          $("#import-learning-development-form")[0].reset();  
                            //loadTable(selected_emp_id);
                      }else{
                        toastr.error(response.message)  
                      }
                      $('#btnimportLearningDevelopSubmit').prop('disabled',false)
                      $('#btnimportLearningDevelopSubmit').html('<i class="bx bx-save"></i> Save');
                  },
                  error: function(err) {
                    if(err.status === 200){
                        toastr.success('Learning Development Successfully Added!')  
                    }
                    $('#ImportLearningDevelopmentModal').modal('hide')
                    LdTable.ajax.reload(null, false);
                    $("#import-learning-development-form")[0].reset(); 
                    $('#btnimportLearningDevelopSubmit').html('<i class="bx bx-save"></i> Save');
                  }
  
              });
      });


      $(document).on('click', '.btn-post-learning-development', function() {
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
                        url: '/learning-development/posted',
                        method: 'post',
                        data: {id : id},
                        success:function(data){
                            if(data.status === 200){
                                LdTable.ajax.reload(null, false);
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


        LdTable  =  $('.LDtable').DataTable({
                processing: true,
                info: true,
                responsive : true,
                ordering: false,
                "ajax" : {
                        "url": "/learning-development/search",
                        "type" : "POST", 
                        "data": function(set){
                            set.employee_id = selected_emp_id;
                           },    
                        },
                "pageLength": 10,
                "aLengthMenu":[[10,25,50,100,-1],[10,25,50,100,'All']],
                columns: [
                        {data:'postedBtn', name:'postedBtn'},
                        {data: 'empfullname', name: 'empfullname'},
                        {data: 'title', name: 'title'},
                        {data: 'nohours', name: 'nohours'},
                        {data: 'type', name: 'type'},
                        {data: 'from', name: 'from'},
                        {data: 'to', name: 'to'},
                        {data: 'conducted', name: 'conducted'},
                        ],
                "initComplete": isComplete,
        });


        function isComplete() {
            var check = $('.LDtable').find('.dataTables_empty').html();
            if(check){
                if(selected_emp_id){
                    $(".import-btn-learning-development").prop("disabled", false);
                    toastr.warning('No Record Found')
                }
            }else{
                if(selected_emp_id){
                $(".import-btn-learning-development").prop("disabled", true);
                }
            }
          }





});
