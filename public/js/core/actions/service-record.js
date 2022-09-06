$(function(){

    var employeeName = new Array();
    var employeeId = new Array();
    var departmentList = new Array();
    var selected_emp_id = '';
    var serviceRecordData = new Array();

    var ServiceRecorddtTable;
    var GetempId;
    //var mayCallBack;

     $(document).ready(function() {
      $("#add-btn-service-record").prop("disabled", true);
      $(".print-btn-service-record").prop("disabled", true);
      $(".import-btn-service-record").prop("disabled", true);
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
                  var j = 6;
                 
                  if (departmentList === undefined || departmentList.length == 0){
                    departmentList[0] = 'SLSU-Sogod';
                    departmentList[1] = 'SLSU-Maasin';
                    departmentList[2] = 'SLSU-Tomas Oppus';
                    departmentList[3] = 'SLSU-Bontoc';
                    departmentList[4] = 'SLSU-San Juan';
                    departmentList[5] = 'SLSU-Hinunangan';
                    result.departmentServiceRecord.data.map( function (data){
                        if(data.Department !== null){
                            if(data.Department.toLowerCase() !== 'slsu-sogod' 
                               || data.Department.toLowerCase() !== 'slsu-maasin'
                               || data.Department.toLowerCase() !== 'slsu-tomas oppus'
                               || data.Department.toLowerCase() !== 'slsu-bontoc'
                               || data.Department.toLowerCase() !== 'slsu-san juan'
                               || data.Department.toLowerCase() !== 'slsu-hinunangan'
                               )
                            {
                                departmentList[j] = data.Department;
                                j++;
                            }
                           
                        }
                    });
                }
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
                    $("#add-btn-service-record").prop("disabled", false);
          }
      });
   

     });


    $('#SeriveRecordModal').on('hidden.bs.modal', function () {
        $('#service-record-form').find('input[name="station"]').prop("disabled", false);
        $('.select-employee-list-modal').html('<option value=""></option>');
        $("#service-record-form")[0].reset();     
      });    
    $('#idAllTable').dataTable({searching: false, paging: false, info: false , ordering: false});
    
    $('.select-employee-list').on('change', function() {
      var employee_id = this.value;
      var employee_name = $(this).find(':selected').attr('data-name')
      $('#mod').html('Position Title')
      selected_emp_id = employee_id
      GetempId = employee_id


      $('#import-service-record-form').find('.for-name').html('For: <b>'+employee_name+'</b>');
     
      ServiceRecorddtTable.ajax.reload(isComplete, false);

    });
   
    $(document).on("click", ".import-btn-service-record" , function() {
        $('#import-service-record-form').find('input[name="id"]').val(btoa(selected_emp_id));
        $('#ImportServiceRecordModal').modal('show');
     });

     
     $(document).on("click", ".download-btn-service-record" , function() {
         window.location.href = '/service-record/download-csv';
     });
    $(document).on("click", ".btn-edit-service-record" , function() {
       $('#station').typeahead({source: departmentList });
       $('.employee_id_error').text('');
       $('.from_error').text('');
       $('.to_error').text('');
       $('.designation_error').text('');
       $('#SeriveRecordModal').modal('show');
       $('#hideforadd').css('display', 'none');
       $('#labelservicerecordtop').text('Employee Name:');
        const id = $(this).data('id');
        getRow(id);
    });
    $(document).on("click", ".btn-delete-service-record" , function() {
       const id = $(this).data('id');
       const empid = $(this).data('empid');
        var thisval = $(this);
            Swal.fire({
              title: 'Are you sure?',
              text: "You want to delete this record!",
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
                        url: '/service-record/delete',
                        method: 'post',
                        data: {id : id},
                        success:function(data){
                            if(data.status === 200){
                               // thisval.closest("tr").remove();
                              // loadTableDT(empid)
                               ServiceRecorddtTable.ajax.reload(null, false); 
                                Swal.fire({
                                  type: "success",
                                  title: 'Deleted!',
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

    $('#add-btn-service-record').on('click', function(e){
        e.preventDefault();
       
        $('#hideforadd').css('display', 'flex');
        $('#SeriveRecordModal').modal('show');
        $('#labelservicerecordtop').text('');
      //  $('#labelservicerecordtop').text('Search Employee');
        $('#srid').val('');
        $('.employee_id_error').text('');
        $('.from_error').text('');
        $('.to_error').text('');
        $('.designation_error').text('');
        $('#station').typeahead({source: departmentList });
        if (employeeName === undefined || employeeName.length == 0){
        $('.loading-select-modal').html('<i class="spinner-border spinner-border-sm"></i> Loading... ');
        } else{
            for (let index = 0; index < employeeName.length; index++) {
            $('.select-employee-list-modal').append('<option value="'+employeeId[index]+'"> '+employeeName[index]+' </option>');
          }
          $('.loading-select-modal').html('');
      }

    });  

    
    $(document).on('click', '.btn-post-service-record', function() {
        const id = $(this).data('id');
        const empid = $(this).data('empid');
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
                        url: '/service-record/posted',
                        method: 'post',
                        data: {id : id},
                        success:function(data){
                            if(data.status === 200){
                               //(data.employee_id)
                               // loadTableDT(empid)
                                ServiceRecorddtTable.ajax.reload(null, false); 
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

    $(document).on('submit', '#import-service-record-form', function(e) {
        e.preventDefault();
              $.ajax({
                  url: '/service-record/import',
                  method: 'post',
                  data:  new FormData(this),
                  contentType: false,
                  cache: false,
                  processData: false,
                  beforeSend:function(){
                  $('#btnimportServiceRecordSubmit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...');
                  },
                  success:function(response){
                     
                      if(response.status == 200){
                          $('#ImportServiceRecordModal').modal('hide')
                          toastr.success(response.message)  
                          $("#import-service-record-form")[0].reset();  
                          //  loadTable(selected_emp_id);
                            //loadTableDT(selected_emp_id)
                            ServiceRecorddtTable.ajax.reload(null, false); 
                            
                      }else{
                        toastr.error(response.message)  
                      }
                      $('#btnimportServiceRecordSubmit').html('<i class="bx bx-save"></i> Save');
                  },
                  error: function(err) {
                    if(err.status === 200){
                        toastr.success('Service Record Successfully Added')  
                    }
                    $('#ImportServiceRecordModal').modal('hide')
                    $("#import-service-record-form")[0].reset();  
                    ServiceRecorddtTable.ajax.reload(null, false);  
                    $('#btnimportServiceRecordSubmit').html('<i class="bx bx-save"></i> Save');
                  }
  
              });
      });


    $('#btnServiceRecordSubmit').on('click', function(e){
        e.preventDefault();

            $.ajax({
                url: '/service-record/create',
                method: 'post',
                data: $('#service-record-form').serialize(),
                // processData: false,
                // dataType: false,
                // contentType: false,
                beforeSend:function(){
                $('.employee_id_error').text('');
                $('.from_error').text('');
                $('.to_error').text('');
                $('.designation_error').text('');
                $('.islsu_error').text('');
                $('.branch_error').text('');
                $('.salary_error').text('');
                $('.salaryrate_error').text('');
                $('.station_error').text('');
                $('.govservice_error').text('');
                $('.employmentstatus_error').text('');
                $('#btnServiceRecordSubmit').prop('disabled',true)
                $('#btnServiceRecordSubmit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...');
                },
                success:function(data){
                    if(data.status === 200){
                        $('#SeriveRecordModal').modal('hide')
                        toastr.success(data.message) 
                      //  loadTable(data.emp_id) 
                     //   loadTableDT(data.emp_id)
                        ServiceRecorddtTable.ajax.reload(null, false); 
                        $("#service-record-form")[0].reset();           
                    }else if(data.status === 400){
                        $.each(data.message, function(prefix,val){
                            $('#service-record-form').find('span.'+prefix+'_error').text(val[0]);
                        });
                    }
                    else if(data.status === 401 || data.status === 500 || data.status === 404){
                        toastr.error(data.message);
                    }
                    $('#btnServiceRecordSubmit').prop('disabled',false)
                    $('#btnServiceRecordSubmit').html('<i class="bx bx-save"></i> Save');
                }

            });
    });


    $(".print-btn-service-record").on('click', function(){
        let CSRF_TOKEN = $('meta[name="csrf-token"').attr('content');
        $.ajaxSetup({
        url: '/service-record/print-sr',
        type: 'POST',
        data: {
            _token: CSRF_TOKEN,
            employee_id : GetempId
        },
        beforeSend: function() {
            console.log('printing ...');
        },
        complete: function() {
            console.log('printed!');
        }
        });
        $.ajax({
        success: function(viewContent) {
            if(viewContent){
                $.print(viewContent);
            }else{
                toastr.error('Can\'t print. No HRMO Assigned!')
            }
             // This is where the script calls the printer to print the viwe's content.
        }
        });
    });
 

    $(".btn-length-service-record").on('click', function(){
       // loadslsuservice()
        //loadTableSLSUDT()
        $(".select-employee-list").val('').trigger('change')
        $('#mod').html('Length Of Service')
        GetempId = 'slsu';
        ServiceRecorddtTable.ajax.reload(null,false);
    });

    
    

    function getRow(id) {
        $.ajax({
            type: 'POST',
            url: '/service-record/edit',
            data: { id: id },
            dataType: 'json',
            beforeSend: function(){
                $('.body-form-sr').hide();
                $('.beforeLoading').html('<i class="spinner-grow text-info"></i> Please wait...')
                $('#btnServiceRecordSubmit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Updating...');
            },
            success: function(response) {
                $('.body-form-sr').show();
                $('.beforeLoading').html('Service')
                $('.loading-select-modal').html('<h4>'+response.data[0].EmployeeFullname+'</h4>');
                $('#srid').val(response.data[0].id);
                $('#designation').val(response.data[0].PositionTitleCode).change();
                $('#salary').val(response.data[0].MonthlySalary);
                $('#employmentstatus').val(response.data[0].StatusofAppointment).change();
                $('#islsu').val(response.data[0].islsu).change();
                $('#salarygrade').val(response.data[0].SalaryGrade);
                $('#branch').val(response.data[0].Branch).change();
                $('#leaveabsense').val(response.data[0].lawopay);
                $('#s_date').val(response.data[0].SeparationDate);
                $('#s_cause').val(response.data[0].SeparationCause);
                $('#govservice').val(response.data[0].GovtService).change();
                $('#remark').val(response.data[0].Remarks);
                $('#to').val(response.data[0].ToDate);
                $('#from').val(response.data[0].FromDate);
                $('#station').val(response.data[0].Department);
                $('#salaryrate').val(response.data[0].RateOption).change();
                $('#btnServiceRecordSubmit').html('<i class="bx bx-save"></i> Save')
            },
            error: function() {
                toastr.error('Server Error')
            }
        });
    }
  

    $('#service-record-form').find('select[name="islsu"]').on('change', function() {
        if(this.value == 1){
            $('#service-record-form').find('input[name="station"]').prop("disabled", true);
            $('#service-record-form').find('input[name="station"]').val('Auto generated');
        }else{
            $('#service-record-form').find('input[name="station"]').prop("disabled", false);
            $('#service-record-form').find('input[name="station"]').val("");
            $('#service-record-form').find('input[name="station"]').focus();
        }
      });

    $('.btnclose').on('click', function(){$('#SeriveRecordModal').modal('hide'); });

  

   
  
  
    ServiceRecorddtTable =  $('.ServiceRecordTable').DataTable({
            // destroy: true,
            processing: true,
            info: true,
            responsive : true,
             ordering: false,
            cache: false,
            //  dom: 'Bfrtip',
            //  buttons: [
            //      'print'
            //  ],
            "ajax" : {
                // "url" : "{{ route('search.service-record') }}",
                    "url": "/service-record/searchdt",
                    "type" : "POST", 
                    //"data"  : { employee_id: getEmpIdF() },
                    "data": function(d){
                        d.employee_id = GetempId;
                    },    
                    //  "error": function (xhr, error, thrown) {
                    //      console.log('here you can track the error');
                    //   }
                    },
                    "pageLength": 10,
                    "aLengthMenu":[[10,25,50,100,-1],[10,25,50,100,'All']],
                    columns: [
                        {data:'postedBtn', name:'postedBtn'},
                        {data: 'empfullname', name: 'empfullname'},
                        {data: 'from', name: 'from'},
                        {data: 'to', name: 'to'},
                        {data: 'department', name: 'department'},
                        {data: 'employmentstatus', name: 'employmentstatus'},
                        {data: 'position', name: 'position'},
                        {data: 'salary', name: 'salary'},
                    ],
                    //  "initComplete": function(settings,json){
                    //      console.log('json:',json);
                    //  },
                    "initComplete": isComplete,
     });


  function isComplete() {
    var check = $('.dataTables_empty').html();
     if(GetempId){
        if(check){
            $(".print-btn-service-record").prop("disabled", true);
            $(".import-btn-service-record").prop("disabled", false);
            toastr.warning('No Record Found')
        }else{
            $(".print-btn-service-record").prop("disabled", false);
            $(".import-btn-service-record").prop("disabled", true);
        }
     }
  }


});
