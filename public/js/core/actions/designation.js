$(function(){

    var employeeName = new Array();
    var employeeId = new Array();
     $(document).ready(function() {
      $.ajax({
          url: '/employee/employeelist',
          method: 'post',
          dataType: 'json',
          success:function(result){
                  var i = 0;
                  if (employeeName === undefined || employeeName.length == 0){
                      result.employees.data.map( function (data){
                        employeeName[i] = data.FirstName+' '+(data.MiddleName?data.MiddleName:'') +' '+data.LastName;
                        employeeId[i] = data.id;
                        i++;
                        $('.select-designation-list-modal').append('<option value="'+data.id+'"> '+data.FirstName+' '+(data.MiddleName?data.MiddleName:'') +' '+data.LastName+' </option>');
                        });
                  } else{
                        for (let index = 0; index < employeeName.length; index++) {
                            $('.select-designation-list-modal').append('<option value="'+employeeId[index]+'"> '+employeeName[index]+' </option>');
                        }  
                    }
                  
          }
      });

     });
  $('#DesignationModal').on('hidden.bs.modal', function () {
      $(".select-designation-list-modal").val('').trigger('change')
  });

     
    $(document).on("click", ".btn-edit-designation" , function() {
       const id = $(this).data('id');
       $('#bodyModal').css('display', 'none');
       $('#DesignationModal').modal('show');
         getRow(id);
    });
    $(document).on("click", ".btn-delete-designation" , function() {
       const id = $(this).data('id');
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
                        url: '/designation/delete',
                        method: 'post',
                        data: {id : id},
                        success:function(data){
                            if(data.status === 200){
                              $('#table-designation').DataTable().ajax.reload();
                               // thisval.closest("tr").remove();
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

    $('.btn-add-designation').on('click', function(e){
        e.preventDefault();
        $('#hideforadd').css('display', 'block');
        $('#designation-form')[0].reset();
        $('#DesignationModal').modal('show');
        if (employeeName === undefined || employeeName.length == 0){
        } else{
            for (let index = 0; index < employeeName.length; index++) {
            $('.select-employee-list-modal').append('<option value="'+employeeId[index]+'"> '+employeeName[index]+' </option>');
          }  
          $('.loading-select-modal').html('');
      }

    });  

    
    $(document).on('click', '.refresh', function(e) {
      e.preventDefault()
      $('#table-designation').DataTable().ajax.reload();
    });
    
    $(document).on('click', '.view-memo', function(e) {
      e.preventDefault()
      var filepath = $(this).data('id');
      if(filepath === null){
        toastr.error('No File Memo Attach!')
      }else{
      var url = document.location.origin+'/'+filepath;
      var win = window.open(url, '_blank');
        if (win) {
            //Browser has allowed it to be opened
            win.focus();
        } else {
            //Browser has blocked it
           toastr.error('Please allow popups for this website');
        }
      }

    });
    $(document).on('submit', '#designation-form', function(e) {
      e.preventDefault();
         
            $.ajax({
                url: '/designation/create',
                method: 'post',
                data:  new FormData(this),
                contentType: false,
                cache: false,
                processData: false,
                beforeSend:function(){
                $('#btnDesignationSubmit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Saving...');
                $('#designation-form').find('span.employee_id_error').text('');
                },
                success:function(data){
                    if(data.status === 200){
                        $('#DesignationModal').modal('hide')
                        toastr.success(data.message)  
                        $("#designation-form")[0].reset();  
                        $('#table-designation').DataTable().ajax.reload();
                    }else if(data.status === 400){
                        $.each(data.message, function(prefix,val){
                            $('#designation-form').find('span.'+prefix+'_error').text(val[0]);
                        });
                    }
                    else if(data.status === 402){
                        $('#DesignationModal').modal('hide')
                        $("#designation-form")[0].reset();  
                        toastr.error(data.message);
                    }
                    $('#btnDesignationSubmit').html('<i class="bx bx-save"></i> Save');
                },
                error: function(err) {
                  const result = TextToObject(err.responseText)
                  if(result.status === 200){
                    toastr.success(result.message);
                    $('#DesignationModal').modal('hide')
                    $("#designation-form")[0].reset();  
                    $('#table-designation').DataTable().ajax.reload();
                  }else if(result.status === 402){
                    toastr.error(result.message);
                    $('#DesignationModal').modal('hide')
                    $("#designation-form")[0].reset();  
                  }
                  $('#btnDesignationSubmit').html('<i class="bx bx-save"></i> Save');
              }

            });
    });


    function TextToObject(string){
      const splitArray = string.split("{");    
      var result =  splitArray[1].replace("}", "");
      var toObject = "{"+result+"}"
      var resultob = JSON.parse(toObject);
      return resultob;
    }
   

    function getRow(id) {
        $.ajax({
            type: 'POST',
            url: '/designation/edit',
            data: { id: id },
            dataType: 'json',
            beforeSend: function(){
              $('.loading').html('<i class="spinner-grow text-info"></i> Please wait...')
            },
            success: function(response) {
              $('#bodyModal').css('display', 'block');
              $('#hideforadd').css('display', 'none');
              $('.loading').html('')
              let {sid, FirstName,MiddleName,LastName,designation_type,description,to,from,memo } = response.data;
              var R_MiddleName = '';
              if(MiddleName){
                R_MiddleName = response.data.MiddleName.charAt(0)+'.';
              }
              if(response.status === 200){
                  $('.loading-select-modal').html('<h4 class="text-primary">'+FirstName+' '+R_MiddleName+' '+LastName+'</h4>');
                  $('#designation-form').find('input[name="id"]').val(sid);
                  $('#designation-form').find('input[name="d_description"]').val(description);
                  $('#designation-form').find('select[name="designationtype"]').val(designation_type).change();
                  $('#designation-form').find('input[name="from"]').val(from);
                  $('#designation-form').find('input[name="to"]').val(to);
                  $('#designation-form').find('input[name="memonum"]').val(memo);
              }else{
                toastr.error(response.message);
              }
            },
            error: function() {
                toastr.error('Server Error')
            }
        });
    }
  
    function loadTable(){

        $.ajax({
            url: '/designation/list',
            method: 'post',
            dataType: 'json',
            beforeSend:function(){
              $('#tbody-designation').html('<tr><td class="text-center" colspan="7"><i class="spinner-border spinner-border-sm"></i> Loading...</td></tr>') 
            },
            success:function(result){
               $('#tbody-designation').html('')
                if(result.status === 200){
                      $.each(result.data , function (key, item){
                        var from = new Date(item['from']);
                        var to = new Date(item['to']);
                        var MiddleName = '';
                        if(item['MiddleName']){
                          MiddleName = item['MiddleName'].charAt(0)+'.';
                        }
                          $('#tbody-designation').append('<tr>\
                              <td><div class="dropdown">\
                              <span class="bx bx-dots-vertical-rounded font-medium-3 dropdown-toggle nav-hide-arrow cursor-pointer icon-light" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="menu"></span>\
                              <div class="dropdown-menu dropdown-menu-right">\
                                  <a class="dropdown-item btn-edit-designation" href="#" data-id="'+item['sid']+'"><i class="bx bx-edit-alt mr-1"></i> edit</a>\
                                  <a class="dropdown-item btn-delete-designation" href="#" data-id="'+item['sid']+'"><i class="bx bx-trash mr-1"></i> delete</a>\
                              </div>\
                          </div></td>\
                              <td>'+item['LastName']+' , '+item['FirstName']+' '+MiddleName+'</td>\
                              <td>'+item['dt_description']+'</td>\
                              <td>'+(from?from.toDateString():'')+' - '+(to?to.toDateString():'')+'</td>\
                              <td>'+(item['description']?item['description']:'')+'</td>\
                              <td>'+(item['memo']?item['memo']:'')+'</td>\
                              <td> <a class="badge badge-light-info badge-pill view-memo" href="#" data-id="'+item['file']+'">view</a></td>\
                              </tr>');
                          });  
                }else{
                    toastr.error(result.message)
                    $('#service-record-table-data').html('<tr><td class="text-center" colspan="4"> No Service Record Found! </td></tr>')
                }
               
            }
          });

    }

});
