
     $(document).on('click','.generate-pds', function(e){
      e.preventDefault();
            $.ajax({
                type: 'POST',
            url: '/generate-pds',
            // url : "{{ route('generatepds') }}",
                beforeSend:function(){
                    $('#isLoading').find('span.loading-type-label').text('PDS')
                    $('#isLoading').modal({backdrop: 'static',keyboard: false})
                    },success: function(response) {
                        if(response['status'] === 200){
                            window.location.href = '/view-pds';
                        }
                }
            });
        
     });

     $(document).on('click','.upload-notarized-pds', function(e){
        e.preventDefault();
        const id = $(this).data('id');
        $('#NotarizedPdsSubmit-form').find('input[name="npds_id"]').val(id);
        $('#Upload-Notarized-pds-Modal').modal('show')
          
       });


       $(document).on('submit', '#NotarizedPdsSubmit-form', function(e) {
        e.preventDefault();
              $.ajax({
                  url: '/up-notarized-pds',
                  method: 'post',
                  data:  new FormData(this),
                  contentType: false,
                  cache: false,
                  processData: false,
                  beforeSend:function(){
                  $('#btnNotarizedPdsSubmit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...');
                  },
                  success:function(response){
                   
                      if(response.status == 200){
                          $('#Upload-Notarized-pds-Modal').modal('hide')
                          toastr.success(response.message)  
                          $("#NotarizedPdsSubmit-form")[0].reset();  
                          //  loadTable(selected_emp_id);
                            //loadTableDT(selected_emp_id)
                          //  ServiceRecorddtTable.ajax.reload(null, false);     
                      }else{
                        toastr.error(response.message)  
                      }
                      $('#btnNotarizedPdsSubmit').html('<i class="bx bx-upload"></i> Upload');
                  },
                  error: function(err) {
                    if(err.status === 200){
                        $('#Upload-Notarized-pds-Modal').modal('hide')
                        toastr.success('File Successfully Upload')  
                        $("#NotarizedPdsSubmit-form")[0].reset(); 
                    }
                    $('#Upload-Notarized-pds-Modal').modal('hide')
                    $("#NotarizedPdsSubmit-form")[0].reset(); 
                    $('#btnNotarizedPdsSubmit').html('<i class="bx bx-upload"></i> Upload');
                  }
  
             });
      });


       

    

     


    

