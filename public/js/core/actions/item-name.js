$(function(){

    var thisVal = '';
    $('#add-btn-item-name').on('click', function(e){
        e.preventDefault();
        $("#item-name-form")[0].reset();      
        $('#ItemNameModal').modal('show');
    });  
    $('#ItemNameModal').on('hidden.bs.modal', function () {
        $('#item-name-form').find('span').text('');
    });  
     $(document).on("click", ".back-active" , function() {
        const id = $(this).data('id');
        var thisval = $(this);
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to back this to active?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger ml-1',
            buttonsStyling: false,
          }).then(function (result) {
            if (result.value) {
                  $.ajax({
                      url: '/item-name/backactive',
                      method: 'post',
                      data: {id : id},
                      success:function(data){
                         
                          if(data.status === 200){
                             // thisval.closest("tr").remove();
                              $('#ItemNameTable').DataTable().ajax.reload(null, false); 
                              Swal.fire({
                                type: "success",
                                title: 'Restored!',
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
    $(document).on("click", ".btn-item-name-edit" , function() {
        thisval = $(this);
        $('#item-name-form').css('display', 'none', 'width','100%');
        $('#ItemNameModal').modal('show');
         const id = $(this).data('id');
         $('#inid').val(id);
         getRow(id);
     });

     $(document).on("click", ".btn-item-name-delete" , function() {
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
                         url: '/item-name/delete',
                         method: 'post',
                         data: {id : id},
                         success:function(data){
                             if(data.status === 200){
                                $('#ItemNameTable').DataTable().ajax.reload(null, false); 
                               //  thisval.closest("tr").remove();
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

     $('#btnItemNameSubmit').on('click', function(e){
        e.preventDefault();
            $.ajax({
                url: '/item-name/create',
                method: 'post',
                data: $('#item-name-form').serialize(),
                // processData: false,
                // dataType: false,
                // contentType: false,
                beforeSend:function(){
                 $('#item-name-form').find('span').text('');
                $('#btnItemNameSubmit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...');
                },
                success:function(data){
                 
                    if(data){
                        if(data.type === 'edit'){
                                thisval.closest("tr").remove();
                        }
                        if(data.status === 200){
                            $('#ItemNameModal').modal('hide')
                            toastr.success(data.message) 
                            $("#item-name-form")[0].reset(); 

                            $('#ItemNameTable').DataTable().ajax.reload(null, false);  
                                         
                        }else if(data.status === 400){
                            $.each(data.message, function(prefix,val){
                                $('#item-name-form').find('span.'+prefix+'_error').text(val[0]);
                            });
                        }
                        else if(data.status === 401 || data.status === 500 || data.status === 404){
                            toastr.error(data.message);
                        }
                    }
                    $('#btnItemNameSubmit').html('<i class="bx bx-save"></i> Save');
                }

            });
    });

     function getRow(id) {
        $.ajax({
            type: 'POST',
            url: '/item-name/edit',
            data: { id: id },
            dataType: 'json',
            beforeSend: function(){
                $('.loading').html('<i class="spinner-grow text-info"></i> Please wait...')
            },
            success: function(response) {
                $('#itemname').val(response.data.ItemName);
                $('#description').val(response.data.Description);
                $('.loading').html('');
                $('#item-name-form').css('display', 'block');
            },
            error: function() {
                toastr.error('Server Error')
            }
        });
    }

});