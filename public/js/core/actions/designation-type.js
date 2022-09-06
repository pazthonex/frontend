$('.btn-add-designation-type').on('click', function(e){
    e.preventDefault();
    $('#DesinationTypeModal').modal('show');
});  
$(document).on("click", ".btn-edit-designation-type" , function(e) {
    e.preventDefault();
    const id = $(this).data('id')
    $('#designation-type-form').find('input[name="id"]').val(id);
     $('#bodyModal').hide();
    $('#DesinationTypeModal').modal('show');
    getRow(id)
}); 
$('#DesinationTypeModal').on('hidden.bs.modal', function () {
    $('#designation-type-form').find('input[name="id"]').val('');
    $('#designation-type-form').find('input[name="description"]').val('');
    $('#designation-type-form').find('span.description_error').text('');
});

$(document).on('submit', '#designation-type-form', function(e) {
   e.preventDefault();
      
         $.ajax({
             url: '/designation-type/create',
             //url : "{{ route('designation.type.add') }}",
             method: 'post',
             data:  new FormData(this),
             contentType: false,
             cache: false,
             processData: false,
             beforeSend:function(){
             $('#btnDesignationTypeSubmit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Saving...');
             },
             success:function(data){
                 if(data.status === 200){
                     $('#DesinationTypeModal').modal('hide')
                     toastr.success(data.message)  
                     $("#designation-type-form")[0].reset();  
                     $('#DesignationTypeTable').DataTable().ajax.reload();         
                 }else if(data.status === 400){
                     $.each(data.message, function(prefix,val){
                         $('#designation-type-form').find('span.'+prefix+'_error').text(val[0]);
                     });
                 }
                 $('#btnDesignationTypeSubmit').html('<i class="bx bx-save"></i> Save');
             }

         });
 });

$(document).on("click", ".btn-delete-designation-type" , function() {
    const id = $(this).data('id');
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
                     url: '/designation-type/delete',
                     method: 'post',
                     data: {id : id},
                     success:function(data){
                         if(data.status === 200){
                           $('#DesignationTypeTable').DataTable().ajax.reload();
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


 function getRow(id) {
    $.ajax({
        type: 'POST',
        url: '/designation-type/edit',
        data: { id: id },
        dataType: 'json',
        beforeSend: function(){
          $('.loading').html('<i class="spinner-grow text-info"></i> Please wait...')
        },
        success: function(response) {
            $('#bodyModal').show();
            $('.loading').html('')
            const {description } = response.data;
            if(response.status === 200){
                $('#designation-type-form').find('input[name="description"]').val(description);
            }else{
                toastr.error(response.message);
            }
        },
        error: function() {
            toastr.error('Server Error')
        }
    });
}

 