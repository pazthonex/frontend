$.ajaxSetup({
    headers: {  'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') }
});
$(function(){

    // fetchEmployee()
      var card_id = 0;
      var card_id_cse = 0;
      var card_id_vw = 0;
      var card_id_ldt = 0;
      var card_id_skills = 0;
      var card_id_recognition = 0;
      var card_id_member_assoc = 0;
      var card_id_refences = 0;
     var skills_array_id = new Array();
     var recognition_array_id = new Array();
     var member_assoc_array_id = new Array();
     var R_address = new Array();
     var RB_array = new Array();
    $(document).ready(function() {
        var countref_id = $('input[name="ref_id[]"]').length;
        card_id_refences = countref_id;
        for (let index = 1; index <= 12; index++) {
            RB_array[index] =  $('#divrbqy'+index).find('input[name="yes_rbqy'+index+'"]').val();
            RB_array[13] =  $('#divrbqy4').find('input[name="yes2_rbqy4"]').val();
        }      
    });
    $('#allEmployeeModal').on('hidden.bs.modal', function () {
        $('#btnemployeeSubmit').prop('disabled',false);
        $('#add-employee-form')[0].reset();
    });
     $('#add-employee-btn').on('click', function(e){
         e.preventDefault();
         $('#allEmployeeModal').modal('show');
        
     });
     $('.btnrefresh').on('click', function(){
         location.reload();
     });
     $('#btnemployeeSubmit').on('click', function(e){
         e.preventDefault();
         $.ajax({
             url: '/employee/create',
             method: 'post',
             data: $('#add-employee-form').serialize(),
             // processData: false,
             // dataType: false,
             // contentType: false,
             beforeSend:function(){
             // $(form).find('span.error-text').text('');
             $('#add-employee-form').find('span').text('');
             $('#btnemployeeSubmit').prop('disabled',true);
             $('#btnemployeeSubmit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...');
             },
             success:function(data){
               
                 if(data.status === 200){
                     $('#allEmployeeModal').modal('hide');
                     toastr.success(data.message);
                     $('#Employee-DTable').DataTable().ajax.reload();   
                 }else if(data.status === 400){
                    
                     $.each(data.message, function(prefix,val){
                         $('#add-employee-form').find('span.'+prefix+'_error').text(val[0]);
                     });
                 }
                 else if(data.status === 401 || data.status === 500 || data.status === 404){
                     toastr.error(data.message);
                 }
                 $('#btnemployeeSubmit').prop('disabled',false);
                 $('#btnemployeeSubmit').html('<i class="bx bx-save"></i> Save');
             }
 
         });
     });
 
     $(document).on("click", ".back-active-employee" , function(e) {
      e.preventDefault();

        var id = $(this).data('id')
             Swal.fire({
               title: 'Recover?',
               text: "You want to back this employee Active!",
               type: 'warning',
               showCancelButton: true,
               confirmButtonColor: '#3085d6',
               cancelButtonColor: '#d33',
               confirmButtonText: 'Yes, recover it!',
               confirmButtonClass: 'btn btn-success',
               cancelButtonClass: 'btn btn-danger ml-1',
               buttonsStyling: false,
             }).then(function (result) {
               if (result.value) {
                     $.ajax({
                         url: '/employee/restore',
                         method: 'post',
                         data: {id : id},
                         beforeSend:function(){
                         // $(form).find('span.error-text').text('');
                         },
                         success:function(response){
                         var errormsg = ''
                         if(response.status == 401){
                            errormsg = '<h5><small>'+response.message+'</small></h5>'
                            Swal.fire({type: 'error',title: errormsg,  })
                         }else if(response.status == 400){
                            errormessageArray = new Array();
                            $.each(response.message, function(prefix,msg){
                                errormessageArray[prefix] = msg[0]
                            });
                            errormsg = '<ul>\
                                '+(errormessageArray['emailaddress']?'<li><h5><small>'+errormessageArray['emailaddress']+'</small></h5></li>':'')+'\
                                '+(errormessageArray['cellphone']?'<li><h5><small>'+errormessageArray['cellphone']+'</small></h5></li>':'')+'\
                             </ul>';
                             Swal.fire({type: 'error',title: errormsg,  })
                         }else if(response.status == 200){
                            Swal.fire({
                                type: "success",
                                title: 'Restored!',
                                text: response.message,
                                confirmButtonClass: 'btn btn-success',
                                })
                         }
                         $('#Employee-DTable').DataTable().ajax.reload();
                         }
                     });
               }
             });
       });
     $(document).on("click", ".btn-employee-delete" , function(e) {
         e.preventDefault();
         var thisval = $(this);
         const id = $(this).data('id');
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
                         url: '/employee/delete',
                         method: 'post',
                         data: {id : id},
                         beforeSend:function(){
                         // $(form).find('span.error-text').text('');
                         },
                         success:function(data){
                         // thisval.closest("tr").remove();
                         $('#Employee-DTable').DataTable().ajax.reload();
                           Swal.fire({
                             type: "success",
                             title: 'Deleted!',
                             text: data.message,
                             confirmButtonClass: 'btn btn-success',
                             })
                         }
                     });
               }
             });
     });
     $('#btn-update-employee-personal-profile').on('click', function(e){
         e.preventDefault();
         // alert ("FF");
         $.ajax({
             url: '/employee/update',
             method: 'post',
             data: $('#form-update-employee-personal-profile').serialize(),
             // processData: false,
             // dataType: false,
             // contentType: false,
             beforeSend:function(){
                 $('#btn-update-employee-personal-profile').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Saving...');
                 $('#form-update-employee-personal-profile').find('span').text('');
             },
             success:function(result){
                if(result.status === 200){
                    if (result.data.status == 200){
                        toastr.success(result.data.message);
                    }else if (result.data.status == 400){
                        $.each(result.data.message, function(prefix,val){
                            $('#form-update-employee-personal-profile').find('span.'+prefix+'_error').text(val[0]);
                        });
                    }else{
                        toastr.error(result.data.message);
                    }
                }else{
                    toastr.error("Server Error");
                }
                $('#btn-update-employee-personal-profile').html('<i class="bx bxs-check-square"></i> Save Changes');
             }
         });
     }); 
     $('#btn-update-employee-familybackground').on('click', function(e){
        e.preventDefault();
        // alert ("FF");
        $.ajax({
            url: '/employee/update',
            method: 'post',
            data: $('#form-update-employee-familybackground').serialize(),
            // processData: false,
            // dataType: false,
            // contentType: false,
            beforeSend:function(){
                $('#btn-update-employee-familybackground').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Saving...');
                $('#form-update-employee-familybackground').find('span').text('');
            },
            success:function(result){
                if(result.status === 200){
                    toastr.success(result.data.message);
               }
               else if(result.status === 400 || result.status === 500 || result.status === 404){
                  toastr.error(result.message);
              }

              $('#btn-update-employee-familybackground').html('<i class="bx bxs-check-square"></i> Save Changes');
            }

        });

    });
 
     $('#btn-edit-employee-address').on('click', function(e){
         e.preventDefault();
         $.ajax({
             url: '/employee/update',
             method: 'post',
             data: $('#form-employee-address').serialize(),
             // processData: false,
             // dataType: false,
             // contentType: false,
             beforeSend:function(){
                 // $('#btn-edit-employee-cardnumber').text('Loading..');
                 $('#btn-edit-employee-address').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Saving...');
                 $('#form-employee-address').find('span').text('');
             },
             success:function(data){
                 if(data.data.status === 200){
                      toastr.success(data.data.message);
                 }
                 else if(data.status === 400 || data.status === 500 || data.status === 404){
                    toastr.error(data.message);
                }
                  $('#btn-edit-employee-address').html('<i class="bx bxs-check-square"></i> Save Changes');
             }
         });
     });
 
     $('#btn-edit-employee-cardnumber').on('click', function(e){
         e.preventDefault();
         $.ajax({
             url: '/employee/update',
             method: 'post',
             data: $('#form-employee-cardnumber').serialize(),
             // processData: false,
             // dataType: false,
             // contentType: false,
             beforeSend:function(){
                 $('#btn-edit-employee-cardnumber').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Saving...');
                 $('#form-employee-cardnumber').find('span').text('');
 
             },
             success:function(data){
                 if(data.data.status === 200){
                     toastr.success(data.data.message);
                }
                else if(data.status === 400 || data.status === 500 || data.status === 404){
                    toastr.error(data.message);
                }
                 $('#btn-edit-employee-cardnumber').html('<i class="bx bxs-check-square"></i> Save Changes');
 
             }
 
         });
 
     });
 
     $('#btn-edit-employee-other').on('click', function(e){
         e.preventDefault();
         $.ajax({
             url: '/employee/update',
             method: 'post',
             data: $('#form-employee-other').serialize(),
             // processData: false,
             // dataType: false,
             // contentType: false,
             beforeSend:function(){
                 $('#btn-edit-employee-other').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Saving...');
                 $('#form-employee-other').find('span').text('');
             },
             success:function(data){
                 if(data.data.status === 200){
                     toastr.success(data.data.message);
                }
                else if(data.status === 400 || data.status === 500 || data.status === 404){
                    toastr.error(data.message);
                }
                 $('#btn-edit-employee-other').html('<i class="bx bxs-check-square"></i> Save Changes');
             }
 
         });
 
     });

     $('#btn-update-employee-educationalbackground').on('click', function(e){
        e.preventDefault();
        $.ajax({
            url: '/employee/update',
            method: 'post',
            data: $('#form-update-employee-educationalbackground').serialize(),
            // processData: false,
            // dataType: false,
            // contentType: false,
            beforeSend:function(){
                $('#btn-update-employee-educationalbackground').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Saving...');
                $('#form-employee-btn-update-employee-educationalbackground').find('span').text('');
            },
            success:function(result){
                
                if(result.status === 200){
                    loadEducationBackground(result.data.data)
                    toastr.success(result.data.message);
                    $('.added-data-educationbackground').remove();
               }
               else if(result.status === 400 || result.status === 500 || result.status === 404){
                   toastr.error(result.message);
               }
                $('#btn-update-employee-educationalbackground').html('<i class="bx bxs-check-square"></i> Save Changes');
            }

        });

    });

    $('#btn-update-employee-eligibility').on('click', function(e){
        e.preventDefault();
        $.ajax({
            url: '/employee/update',
            method: 'post',
            data: $('#form-update-employee-eligibility').serialize(),
            // processData: false,
            // dataType: false,
            // contentType: false,
            beforeSend:function(){
                $('#btn-update-employee-eligibility').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Saving...');
                $('#form-employee-btn-update-employee-eligibility').find('span').text('');
            },
            success:function(result){
                
                if(result.status === 200){
                    loadEligibility(result.data.data)
                    toastr.success(result.data.message);
                    $('.added-data-eligibility').remove();
               }
               else if(result.status === 400 || result.status === 500 || result.status === 404){
                   toastr.error(result.message);
               }
                $('#btn-update-employee-eligibility').html('<i class="bx bxs-check-square"></i> Save Changes');
            }
        });
    });
    $('#btn-update-employee-voluntarywork').on('click', function(e){
        e.preventDefault();
        $.ajax({
            url: '/employee/update',
            method: 'post',
            data: $('#form-update-employee-voluntarywork').serialize(),
            // processData: false,
            // dataType: false,
            // contentType: false,
            beforeSend:function(){
                $('#btn-update-employee-voluntarywork').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Saving...');
                $('#form-employee-btn-update-employee-voluntarywork').find('span').text('');
            },
            success:function(result){
                if(result.status === 200){
                    loadVoluntaryWork(result.data.data)
                    toastr.success(result.data.message);
                    $('.added-data-voluntarywork').remove();
               }
               else if(result.status === 400 || result.status === 500 || result.status === 404){
                   toastr.error(result.message);
               }
                $('#btn-update-employee-voluntarywork').html('<i class="bx bxs-check-square"></i> Save Changes');
            }
        });
    });
    $('#btn-update-employee-learn-dev-train').on('click', function(e){
        e.preventDefault();
        $.ajax({
            url: '/employee/update',
            method: 'post',
            data: $('#form-update-employee-learn-dev-train').serialize(),
            // processData: false,
            // dataType: false,
            // contentType: false,
            beforeSend:function(){
                $('#btn-update-employee-learn-dev-train').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Saving...');
              //  $('#form-employee-btn-update-employee-voluntarywork').find('span').text('');
            },
            success:function(result){
                if(result.status === 200){
                    loadLearningDevelopment(result.data.data)
                    toastr.success(result.data.message);
                    $('.added-data-learn-dev-train').remove();
               }
               else if(result.status === 400  || result.status === 404){
                   toastr.error(result.message);
               }
                $('#btn-update-employee-learn-dev-train').html('<i class="bx bxs-check-square"></i> Save Changes');
            }
        });
    });
    $('#btn-update-employee-other-info').on('click', function(e){
        e.preventDefault();
        $.ajax({
            url: '/employee/update',
            method: 'post',
            data: $('#form-update-employee-other-info').serialize(),
            // processData: false,
            // dataType: false,
            // contentType: false,
            beforeSend:function(){
                $('#btn-update-employee-other-info').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Saving...');
              //  $('#form-employee-btn-update-employee-voluntarywork').find('span').text('');
            },
            success:function(result){
                if(result.status === 200){
                    toastr.success(result.data.message);
                    $('#skill-content-list-child').remove();
                    $('#recognition-content-list-child').remove();
                    $('#member_assoc-content-list-child').remove();
                    skills_array_id.map(function(element){
                        $('#skill_input'+element).remove();
                    })
                    recognition_array_id.map(function(element){
                        $('#recognition_input'+element).remove();
                    })
                    member_assoc_array_id.map(function(element){
                        $('#member_assoc_input'+element).remove();
                    })
                    //$('#skills-content').find('.remove-child').remove();
                     loadSkills(result.data.data)
                     loadRecognition(result.data.data)
                     loadMemberAssoc(result.data.data)
                     loadReference(result.data.data)
                     
                      for (let index = 1; index <= 12; index++) {
                            RB_array[index] =  $('#divrbqy'+index).find('input[name="yes_rbqy'+index+'"]').val();
                            RB_array[13] =  $('#divrbqy4').find('input[name="yes2_rbqy4"]').val();
                        }  

               }
               else if(result.status === 400  || result.status === 404){
                   toastr.error(result.message);
               }
                $('#btn-update-employee-other-info').html('<i class="bx bxs-check-square"></i> Save Changes');
            }

        });

    });

    $('#btn-update-employee-other-info-emp').on('click', function(e){
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to save the Changes of your Profile?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger ml-1',
            buttonsStyling: false,
          }).then(function (result) {
              
            if (result.value) {
                $.ajax({
                    url: '/employee/update',
                    method: 'post',
                    data: $('#form-update-employee-other-info-emp').serialize(),
                    // processData: false,
                    // dataType: false,
                    // contentType: false,
                    beforeSend:function(){
                        $('#btn-update-employee-other-info-emp').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Saving...');
                      //  $('#form-employee-btn-update-employee-voluntarywork').find('span').text('');
                    },
                    success:function(result){
                        if(result.status === 200){
                            toastr.success('Succesfully Udpated!');
                            $('#skill-content-list-child').remove();
                            $('#recognition-content-list-child').remove();
                            $('#member_assoc-content-list-child').remove();
                            skills_array_id.map(function(element){
                                $('#skill_input'+element).remove();
                            })
                            recognition_array_id.map(function(element){
                                $('#recognition_input'+element).remove();
                            })
                            member_assoc_array_id.map(function(element){
                                $('#member_assoc_input'+element).remove();
                            })
                            //$('#skills-content').find('.remove-child').remove();
                             loadSkills(result.data.data)
                             loadRecognition(result.data.data)
                             loadMemberAssoc(result.data.data)
                            // loadReference(result.data.data)
                             
                              for (let index = 1; index <= 12; index++) {
                                    RB_array[index] =  $('#divrbqy'+index).find('input[name="yes_rbqy'+index+'"]').val();
                                    RB_array[13] =  $('#divrbqy4').find('input[name="yes2_rbqy4"]').val();
                                }  
        
                       }
                       else if(result.status === 400  || result.status === 404){
                           toastr.error(result.message);
                       }
                        $('#btn-update-employee-other-info-emp').html('<i class="bx bxs-check-square"></i> Save Changes');
                    }
        
                });
            }
          });
    });

    $('#btn-add-refences').on('click', function(){
        if((card_id_refences < 3)){
            card_id_refences++;
                $('.add-new-reference').append('<div class="card p-2 border-top border-primary"  id="cardref'+card_id_refences+'">\
                <div class="card-header">\
                    <div class="heading-elements">\
                        <ul class="list-inline m-0 p-0">\
                        <li>\
                            <a href="#" data-type="" data-id="'+card_id_refences+'" class="btn btn-sm text-danger card-references-remove">\
                            <i class="bx bx-x text-danger"></i>\
                            </a>\
                        </li>\
                        </ul>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-md-4">\
                        <div class="form-group">\
                            <label>NAME</label>\
                            <div class="controls">\
                                <input type="text" name="ref_name[]" class="form-control" value="">\
                                <span class="text-danger titleld_error"></span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-md-5">\
                        <div class="form-group">\
                            <label>Address</label>\
                            <div class="controls">\
                                <input type="text" name="ref_address[]" class="form-control" value="">\
                                <span class="text-danger numberhours_error"></span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-md-3">\
                        <div class="form-group">\
                            <label>Cellphone/Telephone</label>\
                            <div class="controls">\
                                <input type="text" name="ref_cell[]" class="form-control" value="">\
                                <span class="text-danger type_error"></span>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>');
        }else{
            $('#btn-add-refences').prop('disabled',true);
        }
    });

    $(document).on("click", ".card-references-remove" , function(e) {
        e.preventDefault();
        var cardid = $(this).data('id');
        $('#cardref'+cardid).remove();
        card_id_refences--;
        $('#btn-add-refences').prop('disabled',false);
    });

    $(document).on("click", ".card-educationalbackground-remove" , function(e) {
        e.preventDefault();
        var cardid = $(this).data('id');
        $('#card'+cardid).remove();
    });
    $(document).on("click", ".card-eligibility-remove" , function(e) {
        e.preventDefault();
        var cardid = $(this).data('id');
        $('#cardcse'+cardid).remove();
    });
    $(document).on("click", ".card-voluntarywork-remove" , function(e) {
        e.preventDefault();
        var cardid = $(this).data('id');
        $('#voluntarywork'+cardid).remove();
    });
    $(document).on("click", ".card-learn-dev-train-remove" , function(e) {
        e.preventDefault();
        var cardid = $(this).data('id');
        $('#learn-dev-train'+cardid).remove();
    });
    
    $(document).on("click", ".card-employee-pds-infos-delete" , function(e) {
        e.preventDefault();
        var id = $(this).data('id');
        var type = $(this).data('type');
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
                        $('#card'+type+''+id).remove();
                        if(result.status === 200){
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
    $(document).on("click", ".btn-remove-member_assoc-input" , function(e) {
        e.preventDefault();
        var id = $(this).data('id');
        member_assoc_array_id = member_assoc_array_id.filter(item => item !== id)
        $('#member_assoc_input'+id).remove();
    });
    $('#btn-add-member_assoc-content').on('click', function(){
        card_id_member_assoc++;
        member_assoc_array_id[card_id_member_assoc] = card_id_member_assoc
       $('#member_assoc-content').append('<div class="col-md-10 mb-1" id="member_assoc_input'+card_id_member_assoc+'">\
            <fieldset>\
                <div class="input-group">\
                <input type="hidden" name="member_assoc_id[]" value="">\
                <input type="text" name="member_assoc[]" class="form-control" placeholder="Enter Membership in Association/Organization" aria-describedby="button-addon2">\
                <div class="input-group-append" id="button-addon2">\
                    <button data-id='+card_id_member_assoc+' data-toggle="tooltip" data-placement="right" title="Remove" class="btn btn-danger btn-remove-member_assoc-input" type="button"> <i class="bx bx-minus-circle"></i></button>\
                </div>\
                </div>\
            </fieldset>\
        </div>');
    });
    $(document).on("click", ".btn-remove-recognition-input" , function(e) {
        e.preventDefault();
        var id = $(this).data('id');
        recognition_array_id  = recognition_array_id.filter(item => item !== id)
        $('#recognition_input'+id).remove();
    });

    $('#btn-add-recognition-content').on('click', function(){
        card_id_recognition++;
        recognition_array_id[card_id_recognition] = card_id_recognition
       $('#recognition-content').append('<div class="col-md-10 mb-1" id="recognition_input'+card_id_recognition+'">\
            <fieldset>\
                <div class="input-group">\
                <input type="hidden" name="recognition_id[]" value="">\
                <input type="text" name="recognition[]" class="form-control" placeholder="Enter Non-Academic Distinctions/Recognition" aria-describedby="button-addon2">\
                <div class="input-group-append" id="button-addon2">\
                    <button data-id='+card_id_recognition+' data-toggle="tooltip" data-placement="right" title="Remove" class="btn btn-danger btn-remove-recognition-input" type="button"> <i class="bx bx-minus-circle"></i></button>\
                </div>\
                </div>\
            </fieldset>\
        </div>');
    });
    
    $(document).on("click", ".btn-remove-skill-input" , function(e) {
        e.preventDefault();
        var id = $(this).data('id');
        skills_array_id = skills_array_id.filter(item => item !== id)
        $('#skill_input'+id).remove();
    });

    $('#btn-add-skills-content').on('click', function(){
        card_id_skills++;
       skills_array_id[card_id_skills] = card_id_skills
       $('#skills-content').append('<div class="col-md-10 mb-1 remove-child" id="skill_input'+card_id_skills+'">\
            <fieldset>\
                <div class="input-group">\
                <input type="hidden" name="skills_id[]" value="">\
                <input type="text" name="skills[]" class="form-control" placeholder="Enter Skills and Hobbies">\
                <div class="input-group-append" >\
                    <button data-id='+card_id_skills+' data-toggle="tooltip" data-placement="right" title="Remove" class="btn btn-danger btn-remove-skill-input" type="button"> <i class="bx bx-minus-circle"></i></button>\
                </div>\
                </div>\
            </fieldset>\
        </div>');
    });

     $('#btn-add-card-educationalbackground').on('click', function(){
        card_id++;
        $('.add-new-card').append('<div class="card p-2 border-top border-success" id="card'+card_id+'">\
                    <div class="card-header">\
                        <div class="heading-elements">\
                            <ul class="list-inline m-0 p-0">\
                            <li>\
                                <a href="#" data-id="'+card_id+'" class="card-educationalbackground-remove">\
                                <i class="bx bx-x text-danger"></i>\
                                </a>\
                            </li>\
                            </ul>\
                        </div>\
                        </div>\
                <div class="row">\
                    <div class="col-md-3">\
                        <div class="form-group">\
                            <label>Level</label>\
                            <div class="controls">\
                                <select class="form-control  border-input" name="level[]" value="" >\
                                    <option disabled Selected></option>\
                                    <option >Elementary</option>\
                                    <option>Secondary</option>\
                                    <option>College</option>\
                                    <option>Graduate Studies</option>\
                                    <option>Vocational</option>\
                                 </select>\
                                <span class="text-danger level_error"></span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-md-5">\
                        <div class="form-group">\
                            <label>Name Of School</label>\
                            <div class="controls">\
                                <input type="text" name="nameschool[]" class="form-control" value="" >\
                                <span class="text-danger nameschool_error"></span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-md-4">\
                        <div class="form-group">\
                            <label>Basic Education/Degree/Course</label>\
                            <div class="controls">\
                                <input type="text" name="degreecourse[]" class="form-control" value="">\
                                <span class="text-danger degreecourse_error"></span>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-md-2">\
                        <div class="form-group">\
                            <label>From</label>\
                            <div class="controls">\
                                <input type="text" name="from[]" class="form-control" value="">\
                                <span class="text-danger from_error"></span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-md-2">\
                        <div class="form-group">\
                            <label>To</label>\
                            <div class="controls">\
                                <input type="text" name="to[]" class="form-control" value="">\
                                <span class="text-danger to_error"></span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-md-3">\
                        <div class="form-group">\
                            <label>Highest Level/Units Earned <span style="text-transform:lowercase">(if not graduated)</span></label>\
                            <div class="controls">\
                                <input type="text" name="unitsearned[]" class="form-control" value="">\
                                <span class="text-danger unitsearned_error"></span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-md-2">\
                        <div class="form-group">\
                            <label>Year Graduated</label>\
                            <div class="controls">\
                                <input type="text" name="yeargraduated[]" class="form-control" value="">\
                                <span class="text-danger yeargraduated_error"></span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-md-3">\
                        <div class="form-group">\
                            <label>Scholarship/Academic Honors Recieved</label>\
                            <div class="controls">\
                                <input type="text" name="academichonors[]" class="form-control" value="">\
                                <span class="text-danger academichonors_error"></span>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>');


     });
     $('#btn-add-card-eligibility').on('click', function(){
        card_id_cse++;
        $('.add-new-cardcse').append('<div class="card p-2 border-top border-success"  id="cardcse'+card_id_cse+'">\
        <div class="card-header">\
            <div class="heading-elements">\
                <ul class="list-inline m-0 p-0">\
                <li>\
                    <a href="#" data-id="'+card_id_cse+'" class="btn btn-sm text-danger card-eligibility-remove">\
                    <i class="bx bx-x text-danger"></i> \
                    </a>\
                </li>\
                </ul>\
            </div>\
            </div>\
            <div class="row">\
                <div class="col-md-7">\
                    <div class="form-group">\
                        <label>Career Service</label>\
                        <div class="controls">\
                            <input type="text" name="careerservice[]" class="form-control" value="">\
                            <span class="text-danger level_error"></span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-md-2">\
                    <div class="form-group">\
                        <label>Rating</label>\
                        <div class="controls">\
                            <input type="text" name="rating[]" class="form-control" value="" >\
                            <span class="text-danger nameschool_error"></span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-md-3">\
                    <div class="form-group">\
                        <label>Date of Examination</label>\
                        <div class="controls">\
                            <input type="date" name="datexam[]" class="form-control" value="" >\
                            <span class="text-danger degreecourse_error"></span>\
                        </div>\
                    </div>\
                </div>\
            </div>\
            <div class="row">   \
                <div class="col-md-6">\
                    <div class="form-group">\
                        <label>Place of Examination</label>\
                        <div class="controls">\
                            <input type="text" name="placexam[]" class="form-control" value="">\
                            <span class="text-danger from_error"></span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-md-3">\
                    <div class="form-group">\
                        <label>License No.</label>\
                        <div class="controls">\
                            <input type="text" name="licenseno[]" class="form-control" value="">\
                            <span class="text-danger to_error"></span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-md-3">\
                    <div class="form-group">\
                        <label>Date of Validity</label>\
                        <div class="controls">\
                            <input type="date" name="datevalidity[]" class="form-control" value="">\
                            <span class="text-danger unitsearned_error"></span>\
                        </div>\
                    </div>\
                </div>\
            </div>\
    </div>');
     });
     $('#btn-add-card-voluntarywork').on('click', function(){
        card_id_vw++;
        $('.add-new-voluntarywork').append('<div class="card p-2 border-top border-success"  id="voluntarywork'+card_id_vw+'">\
        <div class="card-header">\
            <div class="heading-elements">\
                <ul class="list-inline m-0 p-0">\
                <li>\
                    <a href="#" data-id="'+card_id_vw+'" class="btn btn-sm text-danger card-voluntarywork-remove">\
                    <i class="bx bx-x text-danger"></i> \
                    </a>\
                </li>\
                </ul>\
            </div>\
            </div>\
            <div class="row">\
            <div class="col-md-9">\
                <div class="form-group">\
                    <label>Name & Address of Organization</label>\
                    <div class="controls">\
                        <input type="text" name="nameaddress[]" class="form-control" value="">\
                        <span class="text-danger nameaddress_error"></span>\
                    </div>\
                </div>\
            </div>\
            <div class="col-md-3">\
                <div class="form-group">\
                    <label>Number of Hours</label>\
                    <div class="controls">\
                        <input type="text" name="numberhours[]" class="form-control" value="">\
                        <span class="text-danger numberhours_error"></span>\
                    </div>\
                </div>\
            </div>\
        </div>\
        <div class="row">\
            <div class="col-md-3">\
                <div class="form-group">\
                    <label>Date From:</label>\
                    <div class="controls">\
                        <input type="date" name="from[]" class="form-control" value="">\
                        <span class="text-danger from_error"></span>\
                    </div>\
                </div>\
            </div>\
            <div class="col-md-3">\
                <div class="form-group">\
                    <label>Date To:</label>\
                    <div class="controls">\
                        <input type="date" name="to[]" class="form-control" value="">\
                        <span class="text-danger to_error"></span>\
                    </div>\
                </div>\
            </div>\
            <div class="col-md-6">\
                <div class="form-group">\
                    <label>Position / Nature of Work</label>\
                    <div class="controls">\
                        <input type="text" name="naturework[]" class="form-control" value="">\
                        <span class="text-danger naturework_error"></span>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>');
     });

     $('#btn-add-card-learn-dev-train').on('click', function(){
        card_id_ldt++;
        $('.add-new-learn-dev-train').append('<div class="card p-2 border-top border-success"  id="learn-dev-train'+card_id_ldt+'">\
        <div class="card-header">\
            <div class="heading-elements">\
                <ul class="list-inline m-0 p-0">\
                <li>\
                    <a href="#" data-id="'+card_id_ldt+'" class="btn btn-sm text-danger card-learn-dev-train-remove">\
                    <i class="bx bx-x text-danger"></i> \
                    </a>\
                </li>\
                </ul>\
            </div>\
            </div>\
            <div class="row">\
            <div class="col-md-6">\
                <div class="form-group">\
                    <label>Title Of Learning And Development</label>\
                    <div class="controls">\
                        <input type="text" name="titleld[]" class="form-control" value="">\
                        <span class="text-danger titleld_error"></span>\
                    </div>\
                </div>\
            </div>\
            <div class="col-md-3">\
                <div class="form-group">\
                    <label>Number of Hours</label>\
                    <div class="controls">\
                        <input type="text" name="numberhours[]" class="form-control" value="">\
                        <span class="text-danger numberhours_error"></span>\
                    </div>\
                </div>\
            </div>\
            <div class="col-md-3">\
                <div class="form-group">\
                    <label>Type of Learning Development</label>\
                    <div class="controls">\
                        <input type="text" name="type[]" class="form-control" value="">\
                        <span class="text-danger type_error"></span>\
                    </div>\
                </div>\
            </div>\
        </div>\
        <div class="row">\
            <div class="col-md-3">\
                <div class="form-group">\
                    <label>Date From:</label>\
                    <div class="controls">\
                        <input type="date" name="from[]" class="form-control" value="">\
                        <span class="text-dangerfrom_error"></span>\
                    </div>\
                </div>\
            </div>\
            <div class="col-md-3">\
                <div class="form-group">\
                    <label>Date To:</label>\
                    <div class="controls">\
                        <input type="date" name="to[]" class="form-control" value="">\
                        <span class="text-danger to_error"></span>\
                    </div>\
                </div>\
            </div>\
            <div class="col-md-6">\
                <div class="form-group">\
                    <label>Conducted/Sponsored By:</label>\
                    <div class="controls">\
                        <input type="text" name="conducted[]" class="form-control" value="">\
                        <span class="text-danger conducted_error"></span>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>');
     });
     
     
     
     $('#form-employee-address').find('select[name="rregion"]').on('change', function() {
        var id = $(this).find(':selected').data('id');
        var des = $(this).val();
        R_address[0] = des;
        $.ajax({
            url: '/ref_address/province',
            method: 'post',
            data: {id : id},
            beforeSend:function(){
                $('#form-employee-address').find('select[name="rprovince"]').html('<option value="" selected="true" disabled="disabled"><i class="spinner-border spinner-border-sm"></i> Loading...</option>');
            },
            success:function(result){
                if(result.status === 200){
                    $('#form-employee-address').find('select[name="rprovince"]').html('<option value="" selected="true" disabled="disabled">Select Province</option>');
                    $.each(result.data , function (key, item){
                        $('#form-employee-address').find('select[name="rprovince"]').append('<option data-description="'+item.provDesc+'" data-id="'+item.provCode+'" value="'+item.id+'" id="'+item.provDesc+'">'+item.provDesc+'</option>');
                        });
                }else{
                    $('#form-employee-address').find('select[name="rprovince"]').html('<option value=""></option>');
                }
            }
        });
     });
     $('#form-employee-address').find('select[name="rprovince"]').on('change', function() {
        var id = $(this).find(':selected').data('id');
        var des = $(this).val();
        R_address[1] = des;
        $.ajax({
            url: '/ref_address/city',
            method: 'post',
            data: {id : id},
            beforeSend:function(){
                $('#form-employee-address').find('select[name="rcity"]').html('<option value="" selected="true" disabled="disabled">Loading...</option>');
            },
            success:function(result){
                if(result.status === 200){
                    $('#form-employee-address').find('select[name="rcity"]').html('<option value="" selected="true" disabled="disabled">Select City/Municipal</option>');
                    $.each(result.data , function (key, item){
                        $('#form-employee-address').find('select[name="rcity"]').append('<option data-description="'+item.citymunDesc+'" data-id="'+item.citymunCode+'" value="'+item.id+'">'+item.citymunDesc+'</option>');
                        });
                }else{
                    $('#form-employee-address').find('select[name="rcity"]').html('<option value=""></option>');
                }
            }
        });
     });
     $('#form-employee-address').find('select[name="rcity"]').on('change', function() {
        var id = $(this).find(':selected').data('id');
        var des = $(this).val();
        R_address[2] = des;
        $.ajax({
            url: '/ref_address/brgy',
            method: 'post',
            data: {id : id},
            beforeSend:function(){
                $('#form-employee-address').find('select[name="rbrgy"]').html('<option value="" selected="true" disabled="disabled">Loading...</option>');
            },
            success:function(result){
                if(result.status === 200){
                    $('#form-employee-address').find('select[name="rbrgy"]').html('<option value="" disabled="disabled" selected="true">Select Barangay</option>');
                    $.each(result.data , function (key, item){
                        $('#form-employee-address').find('select[name="rbrgy"]').append('<option data-description="'+item.brgyDesc+'" value="'+item.brgyDesc+'">'+item.brgyDesc+'</option>');
                        });
                }else{
                    $('#form-employee-address').find('select[name="rbrgy"]').html('<option value=""></option>');
                }
            }
        });
     });





     $('#form-employee-address').find('select[name="pregion"]').on('change', function() {
        var id = $(this).find(':selected').data('id');
      
        $.ajax({
            url: '/ref_address/province',
            method: 'post',
            data: {id : id},
            success:function(result){
                if(result.status === 200){
                    $('#form-employee-address').find('select[name="pprovince"]').html('<option value="" selected="true" disabled="disabled">Select Province</option>');
                    $.each(result.data , function (key, item){
                        $('#form-employee-address').find('select[name="pprovince"]').append('<option data-id="'+item.provCode+'" value="'+item.id+'" id="'+item.provDesc+'">'+item.provDesc+'</option>');
                        });
                }else{
                    $('#form-employee-address').find('select[name="pprovince"]').html('<option value=""></option>');
                }
            }
        });
     });
     $('#form-employee-address').find('select[name="pprovince"]').on('change', function() {
        var id = $(this).find(':selected').data('id');
        $.ajax({
            url: '/ref_address/city',
            method: 'post',
            data: {id : id},
            success:function(result){
                if(result.status === 200){
                    $('#form-employee-address').find('select[name="pcity"]').html('<option value="" selected="true" disabled="disabled">Select City/Municipal</option>');
                    $.each(result.data , function (key, item){
                        $('#form-employee-address').find('select[name="pcity"]').append('<option data-id="'+item.citymunCode+'" value="'+item.id+'">'+item.citymunDesc+'</option>');
                        });
                }else{
                    $('#form-employee-address').find('select[name="pcity"]').html('<option value=""></option>');
                }
            }
        });
     });
     $('#form-employee-address').find('select[name="pcity"]').on('change', function() {
        var id = $(this).find(':selected').data('id');
        $.ajax({
            url: '/ref_address/brgy',
            method: 'post',
            data: {id : id},
            success:function(result){
                if(result.status === 200){
                    $('#form-employee-address').find('select[name="pbrgy"]').html('<option value="" disabled="disabled" selected="true">Select Barangay</option>');
                    $.each(result.data , function (key, item){
                        $('#form-employee-address').find('select[name="pbrgy"]').append('<option value="'+item.brgyDesc+'">'+item.brgyDesc+'</option>');
                        });
                }else{
                    $('#form-employee-address').find('select[name="pbrgy"]').html('<option value=""></option>');
                }
            }
        });
     });


     $('#chksameaddress').on('click', function(e){
        if($(this).prop('checked')){

            
       var region = $('#form-employee-address').find('select[name="rregion"]').find(':selected').data('description');
       var province = $('#form-employee-address').find('select[name="rprovince"]').find(':selected').data('description');
       var city = $('#form-employee-address').find('select[name="rcity"]').find(':selected').data('description')//val();
       var brgy = $('#form-employee-address').find('select[name="rbrgy"]').find(':selected').data('description')//val();
       var zip = $('#form-employee-address').find('input[name="rzip"]').val();
       var houseno = $('#form-employee-address').find('input[name="rhouseno"]').val();
       var housestrt = $('#form-employee-address').find('input[name="rhousestreet"]').val();
       var subDivision = $('#form-employee-address').find('input[name="rsubdivision"]').val();  
       var regionv = $('#form-employee-address').find('select[name="rregion"]').val();
       var provincev = $('#form-employee-address').find('select[name="rprovince"]').val();
       var cityv = $('#form-employee-address').find('select[name="rcity"]').val();
       var brgyv = $('#form-employee-address').find('select[name="rbrgy"]').val();

           if(region){ $('#form-employee-address').find('select[name="pregion"]').append('<option value="'+regionv+'" selected="true">'+region+'</option>') }
           if(province){$('#form-employee-address').find('select[name="pprovince"]').html('<option value="'+provincev+'" selected="true">'+province+'</option> <option value="" disabled="disabled">Select Region to Change</option>')}
           if(city){  $('#form-employee-address').find('select[name="pcity"]').html('<option value="'+cityv+'" selected="true">'+city+'</option> <option value="" disabled="disabled">Select Province to Change</option>');}
           if(brgy){ $('#form-employee-address').find('select[name="pbrgy"]').html('<option value="'+brgyv+'" selected="true">'+brgy+'</option> <option value="" disabled="disabled">Select City/Municipal to Change</option>'); }
            $('#pzipcode').val(zip);
            $('#phouseno').val(houseno);
            $('#phousestreet').val(housestrt);
            $('#psubdivision').val(subDivision);
            // $('#form-employee-address').find('select[name="pzip"]').val(zip);
            // $('#form-employee-address').find('select[name="phouseno"]').val(houseno);
            // $('#form-employee-address').find('select[name="phousestreet"]').val(housestrt);
            // $('#form-employee-address').find('select[name="psubdivision"]').val(subDivision);
        }else{
           if(region){ $('#form-employee-address').find('select[name="pregion"]').val('');}
            // $('#form-employee-address').find('select[name="pprovince"]').val('');
            // $('#form-employee-address').find('select[name="pcity"]').val('');
            // $('#form-employee-address').find('select[name="pbrgy"]').val('');
           // $('#form-employee-address').find('select[name="pregion"]').append('<option value="" selected="true">'+region+'</option>')//val(region).change();
            if(province){ $('#form-employee-address').find('select[name="pprovince"]').html('<option value="" selected="true"></option> <option value="" disabled="disabled">Select Region to Change</option>') } //val(province).change();
            if(city) { $('#form-employee-address').find('select[name="pcity"]').html('<option value="" selected="true"></option> <option value="" disabled="disabled">Select Province to Change</option>');}
            if(brgy) { $('#form-employee-address').find('select[name="pbrgy"]').html('<option value="" selected="true"></option> <option value="" disabled="disabled">Select City/Municipal to Change</option>');}
            $('#pzipcode').val('');
            $('#phouseno').val('');
            $('#phousestreet').val('');
            $('#psubdivision').val('');
            // $('#form-employee-address').find('select[name="pzip"]').val('');
            // $('#form-employee-address').find('select[name="phouseno"]').val('');
            // $('#form-employee-address').find('select[name="phousestreet"]').val('');
            // $('#form-employee-address').find('select[name="psubdivision"]').val('');
        }

     });


     $(document).on("click", ".request_view_details" , function(e) {
        e.preventDefault();
        var id = $(this).data('id');
        var sa_ebid = $(this).data('sa_ebid');
        $('.viewdetails-modal-title').html('')
        loadDetailsForRequestAdd(id)
        $('#viewDetailsModal').modal('show');
        //$('#cardref'+cardid).remove();
    });

    function loadDetailsForRequestAdd(id){
        $.ajax({
            type: 'POST',
            url: '/employee/getonedetailsaddrequest',
            data: { id: id },
            dataType: 'json',
            beforeSend:function(){
                $('#viewdetailsbodyModal').html('<i class="spinner-grow text-info"></i> Loading...');
                },
            success: function(response) {
                if(response.status === 200){
                    if(response.returnData?.sa_educationbackground){
                    const { StudentLevel,NameOfSchool, DegreeCourse,DateFrom,DateTo,UnitsEarned,YearGraduated,AcademicHonors} = response.returnData.sa_educationbackground
                    $('.viewdetails-modal-title').html('Education Background')
                    $('#viewdetailsbodyModal').html('<div class="row">\
                    <div class="col-md-5 col-sm-6">\
                    <h6>Level:</h6>\
                    </div>\
                    <div class="col-md-7 col-sm-6 text-left">\
                    <h6> <b>'+(StudentLevel?StudentLevel:'')+'</b></h6>\
                    </div>\
                    <div class="col-md-5 col-sm-6">\
                        <h6>Name of School:</h6>\
                    </div>\
                    <div class="col-md-7 col-sm-6 text-left">\
                        <h6> <b>'+(NameOfSchool?NameOfSchool:'')+'</b></h6>\
                    </div>\
                    <div class="col-md-5 col-sm-6">\
                        <h6>Basic Education/Degree/Course:</h6>\
                    </div>\
                    <div class="col-md-7 col-sm-6 text-left">\
                        <h6> <b>'+(DegreeCourse?DegreeCourse:'')+'</b></h6>\
                    </div>\
                    <div class="col-md-5 col-sm-6">\
                        <h6>From:</h6>\
                    </div>\
                    <div class="col-md-5 col-sm-6 text-left">\
                        <h6> <b>'+(DateFrom?DateFrom:'')+'</b></h6>\
                    </div>\
                    <div class="col-md-5 col-sm-6">\
                        <h6>To:</h6>\
                    </div>\
                    <div class="col-md-5 col-sm-6 text-left">\
                        <h6> <b>'+(DateTo?DateTo:'')+'</b></h6>\
                    </div>\
                    <div class="col-md-5 col-sm-6">\
                        <h6>Highest Level/Units Earned<small>(if not graduated)</small>:</h6>\
                    </div>\
                    <div class="col-md-7 col-sm-6 text-left">\
                        <h6> <b>'+(UnitsEarned?UnitsEarned:'')+'</b></h6>\
                    </div>\
                    <div class="col-md-5 col-sm-6">\
                        <h6>Year Graduated:</h6>\
                    </div>\
                    <div class="col-md-7 col-sm-6 text-left">\
                        <h6> <b>'+(YearGraduated?YearGraduated:'')+'</b></h6>\
                    </div>\
                    <div class="col-md-5 col-sm-6">\
                        <h6>Scholarship / Academic Honors Recieved:</h6>\
                    </div>\
                    <div class="col-md-7 col-sm-6 text-left">\
                        <h6> <b>'+(AcademicHonors?AcademicHonors:'')+'</b></h6>\
                    </div>\
                    </div>')

                    }
                    if(response.returnData?.sa_eligibility){
                    const { EligibilityName, PlaceOfExam, Rating,LicenseNumber,DateOfRelease,DateOfExam} = response.returnData.sa_eligibility
                        $('.viewdetails-modal-title').html('Civil Service Eligibility')
                        $('#viewdetailsbodyModal').html('<div class="row">\
                        <div class="col-md-5 col-sm-6">\
                        <h6>Career Service:</h6>\
                        </div>\
                        <div class="col-md-7 col-sm-6 text-left">\
                        <h6> <b>'+(EligibilityName?EligibilityName:'')+'</b></h6>\
                        </div>\
                        <div class="col-md-5 col-sm-6">\
                            <h6>Rating:</h6>\
                        </div>\
                        <div class="col-md-7 col-sm-6 text-left">\
                            <h6> <b>'+(Rating?Rating:'')+'</b></h6>\
                        </div>\
                        <div class="col-md-5 col-sm-6">\
                            <h6>Date of Examination:</h6>\
                        </div>\
                        <div class="col-md-7 col-sm-6 text-left">\
                            <h6> <b>'+(DateOfExam?DateOfExam:'')+'</b></h6>\
                        </div>\
                        <div class="col-md-5 col-sm-6">\
                            <h6>Place of Examination:</h6>\
                        </div>\
                        <div class="col-md-7 col-sm-6 text-left">\
                            <h6> <b>'+(PlaceOfExam?PlaceOfExam:'')+'</b></h6>\
                        </div>\
                        <div class="col-md-5 col-sm-6">\
                            <h6>License No.:</h6>\
                        </div>\
                        <div class="col-md-7 col-sm-6 text-left">\
                            <h6> <b>'+(LicenseNumber?LicenseNumber:'')+'</b></h6>\
                        </div>\
                        <div class="col-md-5 col-sm-6">\
                            <h6>Date of Validity:</h6>\
                        </div>\
                        <div class="col-md-7 col-sm-6 text-left">\
                            <h6> <b>'+(DateOfRelease?DateOfRelease:'')+'</b></h6>\
                        </div>\
                        </div>')
                    }
                    if(response.returnData?.sa_voluntarywork){
                        const { DateFrom, DateTo, NameAddressOrganization,NumberHours,Position} = response.returnData.sa_voluntarywork
                            $('.viewdetails-modal-title').html('Voluntary Work')
                            $('#viewdetailsbodyModal').html('<div class="row">\
                            <div class="col-md-5 col-sm-6">\
                            <h6>Name & Address of Organization:</h6>\
                            </div>\
                            <div class="col-md-7 col-sm-6 text-left">\
                            <h6> <b>'+(NameAddressOrganization?NameAddressOrganization:'')+'</b></h6>\
                            </div>\
                            <div class="col-md-5 col-sm-6">\
                                <h6>Number of Hours:</h6>\
                            </div>\
                            <div class="col-md-7 col-sm-6 text-left">\
                                <h6> <b>'+(NumberHours?NumberHours:'')+'</b></h6>\
                            </div>\
                            <div class="col-md-5 col-sm-6">\
                                <h6>Date From:</h6>\
                            </div>\
                            <div class="col-md-7 col-sm-6 text-left">\
                                <h6> <b>'+(DateFrom?DateFrom:'')+'</b></h6>\
                            </div>\
                            <div class="col-md-5 col-sm-6">\
                                <h6>Date To:</h6>\
                            </div>\
                            <div class="col-md-7 col-sm-6 text-left">\
                                <h6> <b>'+(DateTo?DateTo:'')+'</b></h6>\
                            </div>\
                            <div class="col-md-5 col-sm-6">\
                                <h6>Position / Nature of Work:</h6>\
                            </div>\
                            <div class="col-md-7 col-sm-6 text-left">\
                                <h6> <b>'+(Position?Position:'')+'</b></h6>\
                            </div>\
                            </div>')
                    }
                    if(response.returnData?.sa_learningdevelopment){
                        const { DateFrom, DateTo, TiltleLearningDev,NumberHours,ConductedBy,Type} = response.returnData.sa_learningdevelopment
                            $('.viewdetails-modal-title').html('Learning & Development')
                            $('#viewdetailsbodyModal').html('<div class="row">\
                            <div class="col-md-5 col-sm-6">\
                            <h6>Title of Learning and Development::</h6>\
                            </div>\
                            <div class="col-md-7 col-sm-6 text-left">\
                            <h6> <b>'+(TiltleLearningDev?TiltleLearningDev:'')+'</b></h6>\
                            </div>\
                            <div class="col-md-5 col-sm-6">\
                                <h6>Number of Hours:</h6>\
                            </div>\
                            <div class="col-md-7 col-sm-6 text-left">\
                                <h6> <b>'+(NumberHours?NumberHours:'')+'</b></h6>\
                            </div>\
                            <div class="col-md-5 col-sm-6">\
                                <h6>Type:</h6>\
                            </div>\
                            <div class="col-md-7 col-sm-6 text-left">\
                                <h6> <b>'+(Type?Type:'')+'</b></h6>\
                            </div>\
                            <div class="col-md-5 col-sm-6">\
                                <h6>Date From:</h6>\
                            </div>\
                            <div class="col-md-7 col-sm-6 text-left">\
                                <h6> <b>'+(DateFrom?DateFrom:'')+'</b></h6>\
                            </div>\
                            <div class="col-md-5 col-sm-6">\
                                <h6>Date To:</h6>\
                            </div>\
                            <div class="col-md-7 col-sm-6 text-left">\
                                <h6> <b>'+(DateTo?DateTo:'')+'</b></h6>\
                            </div>\
                            <div class="col-md-5 col-sm-6">\
                                <h6>Conducted/Sponsored By:</h6>\
                            </div>\
                            <div class="col-md-7 col-sm-6 text-left">\
                                <h6> <b>'+(ConductedBy?ConductedBy:'')+'</b></h6>\
                            </div>\
                            </div>')
                    }
                    if(response.returnData?.sa_address){
                        const { new_region, new_province, new_citymun,old_citymun,old_province,old_region ,new_brgy,old_brgy, type} = response.returnData.sa_address
                        var typeString = '';
                        if(type == 'P'){
                            typeString = 'Permanent Address'
                        }else if(type == 'R'){
                            typeString = 'Residential Address'
                        }
                        var newRegion = new_region.split(","); 
                        var newProvince = new_province.split(","); 
                        var newCityMun = new_citymun.split(","); 
                        var oldRegion = old_region.split(","); 
                        var oldProvince = old_province.split(","); 
                        var oldCityMun = old_citymun.split(",");  
                            $('.viewdetails-modal-title').html(typeString)
                            $('#viewdetailsbodyModal').html('<table class="table"><thead><tr><td></td><td><b>From</b></td><td><b>To</b></td></tr></thead><tbody class="viewdetailsaddress"></tbody></table>');
                            if(new_region != '' || old_region != ''){
                                $('.viewdetailsaddress').append('<tr>\
                                        <td ><b>Region</b></td>\
                                        <td > <i> '+(oldRegion[1]?oldRegion[1]:'')+' </i> </td>\
                                        <td> '+(newRegion[1]?newRegion[1]:'')+'</td>\
                                    </tr>\
                                ')
                            }
                            if(new_province || old_province){
                                $('.viewdetailsaddress').append('<tr>\
                                        <td ><b>Province</b></td>\
                                        <td > <i>'+(oldProvince[1]?oldProvince[1]:'')+'</i></td>\
                                        <td >'+(newProvince[1]?newProvince[1]:'')+'</td>\
                                    </tr>\
                                ')
                            }
                            if(new_citymun || old_citymun){
                                $('.viewdetailsaddress').append('<tr>\
                                        <td><b>City/Municipality</b></td>\
                                        <td >  <i> '+(oldCityMun[1]?oldCityMun[1]:'')+'</td>\
                                        <td >'+(newCityMun[1]?newCityMun[1]:'')+'</td>\
                                    </tr>\
                                ')
                            }
                            if(new_brgy || old_brgy){
                                $('.viewdetailsaddress').append('<tr>\
                                        <td ><b>Barangay</b></td>\
                                        <td>  <i> '+(old_brgy?old_brgy:'')+'  </i> </td>\
                                        <td >'+(new_brgy?new_brgy:'')+'</td>\
                                    </tr>\
                                ')
                            }
                           
                    }
                    
                }
            }
        }) 
    }
    
     function loadEducationBackground(response){
         $('.add-new-card').html('');
        $.each(response , function (key, data){
            $('.add-new-card').append('<input type="hidden" name="eb_id[]" value="'+data.id+'">\
            <div class="card p-2 border-top border-primary"  id="card_'+data.id+'">\
                <div class="card-header">\
                    <div class="heading-elements">\
                        <ul class="list-inline m-0 p-0">\
                        <li>\
                            <a href="#" data-type="eb" data-id="'+data.id+'" class="btn btn-sm text-danger card-employee-pds-infos-delete">\
                            <i class="bx bx-trash text-danger"></i> Delete\
                            </a>\
                        </li>\
                        </ul>\
                    </div>\
                    </div>\
                    <div class="row">\
                        <div class="col-md-3">\
                            <div class="form-group">\
                                <label>Level</label>\
                                <div class="controls">\
                                        <select class="form-control  border-input" name="level[]" value="'+(data.StudentLevel?data.StudentLevel:'')+'" >\
                                                                        <option '+(data.StudentLevel=='Elementary'?'Selected':'')+' >Elementary</option>\
                                                                        <option '+(data.StudentLevel=='Secondary'?'Selected':'')+'>Secondary</option>\
                                                                        <option '+(data.StudentLevel=='College'?'Selected':'')+'>College</option>\
                                                                        <option '+(data.StudentLevel=='Graduate Studies'?'Selected':'')+'>Graduate Studies</option>\
                                                                        <option '+(data.StudentLevel=='Vocational'?'Selected':'')+'>Vocational</option>\
                                        </select>\
                                    <span class="text-danger level_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-5">\
                            <div class="form-group">\
                                <label>Name Of School</label>\
                                <div class="controls">\
                                    <input type="text" name="nameschool[]" class="form-control" value="'+data.NameOfSchool+'" >\
                                    <span class="text-danger nameschool_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-4">\
                            <div class="form-group">\
                                <label>Basic Education/Degree/Course</label>\
                                <div class="controls">\
                                    <input type="text" name="degreecourse[]" class="form-control" value="'+data.DegreeCourse+'" >\
                                    <span class="text-danger degreecourse_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="row">\
                        <div class="col-md-2">\
                            <div class="form-group">\
                                <label>From</label>\
                                <div class="controls">\
                                    <input type="text" name="from[]" class="form-control" value="'+data.DateFrom+'">\
                                    <span class="text-danger from_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-2">\
                            <div class="form-group">\
                                <label>To</label>\
                                <div class="controls">\
                                    <input type="text" name="to[]" class="form-control" value="'+data.DateTo+'">\
                                    <span class="text-danger to_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-3">\
                            <div class="form-group">\
                                <label>Highest Level/Units Earned <span style="text-transform:lowercase">(if not graduated)</span></label>\
                                <div class="controls">\
                                    <input type="text" name="unitsearned[]" class="form-control" value="'+data.UnitsEarned+'">\
                                    <span class="text-danger unitsearned_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-2">\
                            <div class="form-group">\
                                <label>Year Graduated</label>\
                                <div class="controls">\
                                    <input type="text" name="yeargraduated[]" class="form-control" value="'+data.YearGraduated+'">\
                                    <span class="text-danger yeargraduated_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-3">\
                            <div class="form-group">\
                                <label>Scholarship/Academic Honors Recieved</label>\
                                <div class="controls">\
                                    <input type="text" name="academichonors[]" class="form-control" value="'+data.AcademicHonors+'">\
                                    <span class="text-danger academichonors_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
            </div>');
     });
     }
 
     function loadEligibility(response){
        $('.add-new-cardcse').html('');
       $.each(response , function (key, data){
           $('.add-new-cardcse').append('<input type="hidden" name="el_id[]" value="'+data.id+'">\
           <div class="card p-2 border-top border-primary"  id="cardcse'+data.id+'">\
               <div class="card-header">\
                   <div class="heading-elements">\
                       <ul class="list-inline m-0 p-0">\
                       <li>\
                           <a href="#" data-id="'+data.id+'" class="btn btn-sm text-danger card-eligibility-delete">\
                           <i class="bx bx-trash text-danger"></i> Delete\
                           </a>\
                       </li>\
                       </ul>\
                   </div>\
                   </div>\
                   <div class="row">\
                       <div class="col-md-7">\
                           <div class="form-group">\
                               <label>Career Service</label>\
                               <div class="controls">\
                                   <input type="text" name="careerservice[]" class="form-control" value="'+data.EligibilityName+'">\
                                   <span class="text-danger careerservice_error"></span>\
                               </div>\
                           </div>\
                       </div>\
                       <div class="col-md-2">\
                           <div class="form-group">\
                               <label>Rating</label>\
                               <div class="controls">\
                                   <input type="text" name="rating[]" class="form-control" value="'+data.Rating+'" >\
                                   <span class="text-danger rating_error"></span>\
                               </div>\
                           </div>\
                       </div>\
                       <div class="col-md-3">\
                           <div class="form-group">\
                               <label>Date of Examination</label>\
                               <div class="controls">\
                                   <input type="date" name="datexam[]" class="form-control" value="'+data.DateOfExam+'" >\
                                   <span class="text-danger datexam_error"></span>\
                               </div>\
                           </div>\
                       </div>\
                   </div>\
                   <div class="row">\
                   <div class="col-md-6">\
                       <div class="form-group">\
                           <label>Place of Examination</label>\
                           <div class="controls">\
                               <input type="text" name="placexam[]" class="form-control" value="'+data.PlaceOfExam+'">\
                               <span class="text-danger placexam_error"></span>\
                           </div>\
                       </div>\
                   </div>\
                   <div class="col-md-3">\
                       <div class="form-group">\
                           <label>License No.</label>\
                           <div class="controls">\
                               <input type="text" name="licenseno[]" class="form-control" value="'+data.LicenseNumber+'" >\
                               <span class="text-danger licenseno_error"></span>\
                           </div>\
                       </div>\
                   </div>\
                   <div class="col-md-3">\
                       <div class="form-group">\
                           <label>Date of Validity</label>\
                           <div class="controls">\
                               <input type="date" name="datevalidity[]" class="form-control" value="'+data.DateOfRelease+'" >\
                               <span class="text-danger datevalidity_error"></span>\
                           </div>\
                       </div>\
                   </div>\
               </div>\
           </div>');
      });
    }
    function loadVoluntaryWork(response){
        $('.add-new-voluntarywork').html('');
        $.each(response , function (key, data){
            $('.add-new-voluntarywork').append('<input type="hidden" name="vw_id[]" value="'+data.id+'">\
            <div class="card p-2 border-top border-primary"  id="cardvw'+data.id+'">\
                <div class="card-header">\
                    <div class="heading-elements">\
                        <ul class="list-inline m-0 p-0">\
                        <li>\
                            <a href="#" data-type="vw" data-id="'+data.id+'" class="btn btn-sm text-danger card-employee-pds-infos-delete">\
                            <i class="bx bx-trash text-danger"></i> Delete\
                            </a>\
                        </li>\
                        </ul>\
                    </div>\
                    </div>\
                    <div class="row">\
                        <div class="col-md-9">\
                            <div class="form-group">\
                                <label>Name & Address of Organization</label>\
                                <div class="controls">\
                                    <input type="text" name="nameaddress[]" class="form-control" value="'+data.NameAddressOrganization+'">\
                                    <span class="text-danger nameaddress_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-3">\
                            <div class="form-group">\
                                <label>Number of Hours</label>\
                                <div class="controls">\
                                    <input type="text" name="numberhours[]" class="form-control" value="'+data.NumberHours+'">\
                                    <span class="text-danger numberhours_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="row">\
                        <div class="col-md-3">\
                            <div class="form-group">\
                                <label>Date From:</label>\
                                <div class="controls">\
                                    <input type="text" name="from[]" class="form-control" value="'+data.DateFrom+'">\
                                    <span class="text-danger from_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-3">\
                            <div class="form-group">\
                                <label>Date To:</label>\
                                <div class="controls">\
                                    <input type="text" name="to[]" class="form-control" value="'+data.DateTo+'">\
                                    <span class="text-danger to_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-6">\
                            <div class="form-group">\
                                <label>Position / Nature of Work</label>\
                                <div class="controls">\
                                    <input type="text" name="naturework[]" class="form-control" value="'+data.Position+'">\
                                    <span class="text-danger naturework_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
            </div>');
        });

    }
    function loadLearningDevelopment(response){
        $('.add-new-learn-dev-train').html('');
        $.each(response , function (key, data){
            $('.add-new-learn-dev-train').append('<input type="hidden" name="ldt_id[]" value="'+data.id+'">\
            <div class="card p-2 border-top border-primary"  id="cardldt'+data.id+'">\
                <div class="card-header">\
                    <div class="heading-elements">\
                        <ul class="list-inline m-0 p-0">\
                        <li>\
                            <a href="#" data-type="ldt" data-id="'+data.id+'" class="btn btn-sm text-danger card-employee-pds-infos-delete">\
                            <i class="bx bx-trash text-danger"></i> Delete\
                            </a>\
                        </li>\
                        </ul>\
                    </div>\
                    </div>\
                    <div class="row">\
                        <div class="col-md-6">\
                            <div class="form-group">\
                                <label>Title Of Learning And Development</label>\
                                <div class="controls">\
                                    <input type="text" name="titleld[]" class="form-control" value="'+data.TiltleLearningDev+'">\
                                    <span class="text-danger titleld_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-3">\
                            <div class="form-group">\
                                <label>Number of Hours</label>\
                                <div class="controls">\
                                    <input type="text" name="numberhours[]" class="form-control" value="'+data.NumberHours+'">\
                                    <span class="text-danger numberhours_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-3">\
                            <div class="form-group">\
                                <label>Type of Learning Development</label>\
                                <div class="controls">\
                                    <input type="text" name="type[]" class="form-control" value="'+data.Type+'">\
                                    <span class="text-danger type_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="row">\
                        <div class="col-md-3">\
                            <div class="form-group">\
                                <label>Date From:</label>\
                                <div class="controls">\
                                    <input type="date" name="from[]" class="form-control" value="'+data.DateFrom+'">\
                                    <span class="text-dangerfrom_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-3">\
                            <div class="form-group">\
                                <label>Date To:</label>\
                                <div class="controls">\
                                    <input type="date" name="to[]" class="form-control" value="'+data.DateTo+'">\
                                    <span class="text-danger to_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-6">\
                            <div class="form-group">\
                                <label>Conducted/Sponsored By:</label>\
                                <div class="controls">\
                                    <input type="text" name="conducted[]" class="form-control" value="'+data.ConductedBy+'">\
                                    <span class="text-danger naturework_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
            </div>');
        });
    }
    function loadSkills(result){
        $('#skill-content-list').html('')
        var countthis = 0;
       
        if(result?.skills){
            $.each(result?.skills , function (key, data){ 
                countthis++
                $('#skill-content-list').append('<div id="skill-content-list-child"><fieldset>\
                <div class="input-group mb-1">\
               <input type="hidden" name="skills_id[]" value="'+data.id+'">\
                <input type="text" name="skills[]" class="form-control" placeholder="Enter Skills and Hobbies" value="'+data.description+'" aria-describedby="button-addon2">\
                <div class="input-group-append" id="button-addon2">\
                    <button class="btn btn-danger btn-delete-skill-input" type="button"> <i class="bx bx-trash"></i></button>\
                </div>\
                </div>\
            </fieldset></div>');
            });
            if(countthis === 0){
                $('#skill-content-list').append('<fieldset>\
                    <div class="input-group mb-1">\
                        <input type="hidden" name="skills_id[]" value="">\
                        <input type="text" name="skills[]" class="form-control" placeholder="Enter Skills and Hobbies" value="">\
                    </div>\
                </fieldset>');
            }
        }else{
            $('#skill-content-list').append('<fieldset>\
            <div class="input-group mb-1">\
                <input type="hidden" name="skills_id[]" value="">\
                <input type="text" name="skills[]" class="form-control" placeholder="Enter Skills and Hobbies" value="">\
            </div>\
        </fieldset>');
        }
    }
    function loadRecognition(result){
        $('#recognition-content-list').html('')
        var countthis = 0;
        if(result?.recognition){
            $.each(result?.recognition , function (key, data){ 
                countthis++
                $('#recognition-content-list').append('<div id="recognition-content-list-child"><fieldset>\
                <div class="input-group mb-1">\
            <input type="hidden" name="recognition_id[]" value="'+data.id+'">\
                <input type="text" name="recognition[]" class="form-control" placeholder="Enter Non-Academic Distinctions/Recognition" value="'+data.description+'" aria-describedby="button-addon2">\
                <div class="input-group-append" id="button-addon2">\
                    <button class="btn btn-danger btn-delete-recognition-input" type="button"> <i class="bx bx-trash"></i></button>\
                </div>\
                </div>\
            </fieldset></div>');
            });
            if(countthis === 0){
                $('#recognition-content-list').append('<fieldset>\
                    <div class="input-group mb-1">\
                        <input type="hidden" name="recognition_id[]" value="">\
                        <input type="text" name="recognition[]" class="form-control" placeholder="Enter Non-Academic Distinctions/Recognition" value="">\
                    </div>\
                </fieldset>');
            }
        }else{
            $('#recognition-content-list').append('<fieldset>\
            <div class="input-group mb-1">\
                <input type="hidden" name="recognition_id[]" value="">\
                <input type="text" name="recognition[]" class="form-control" placeholder="Enter Non-Academic Distinctions/Recognition" value="">\
            </div>\
        </fieldset>');
        }
    }
    function loadMemberAssoc(result){
        $('#member-assoc-content-list').html('')
        var countthis = 0;
        if(result?.member_assoc){
            $.each(result?.member_assoc , function (key, data){ 
                countthis++
                $('#member-assoc-content-list').append('<div id="member-assoc-content-list-child"><fieldset>\
                <div class="input-group mb-1">\
            <input type="hidden" name="member_assoc_id[]" value="'+data.id+'">\
                <input type="text" name="member_assoc[]" class="form-control" placeholder="Enter Membership in Association/Organization" value="'+data.description+'" aria-describedby="button-addon2">\
                <div class="input-group-append" id="button-addon2">\
                    <button class="btn btn-danger btn-delete-member-assoc-input" type="button"> <i class="bx bx-trash"></i></button>\
                </div>\
                </div>\
            </fieldset></div>');
            });
            if(countthis === 0){
                $('#member-assoc-content-list').append('<fieldset>\
                <div class="input-group mb-1">\
                    <input type="hidden" name="member_assoc_id[]" value="">\
                    <input type="text" name="member_assoc[]" class="form-control" placeholder="Enter Membership in Association/Organization" value="">\
                </div>\
            </fieldset>');
            }
        }else{
            $('#member-assoc-content-list').append('<fieldset>\
                <div class="input-group mb-1">\
                    <input type="hidden" name="member_assoc_id[]" value="">\
                    <input type="text" name="member_assoc[]" class="form-control" placeholder="Enter Membership in Association/Organization" value="">\
                </div>\
            </fieldset>');
        }
    }
    function loadReference(response){
            $('.add-reference').html('');
            var countthis = 0;
         if(response?.references){
            $.each(response?.references , function (key, data){
                countthis++
                $('.add-reference').append('<input type="hidden" name="ref_id[]" value="'+data.id+'">\
                <div class="card p-2 border-top border-primary" >\
                         <div class="card-header">\
                        </div>\
                        <div class="row">\
                            <div class="col-md-4">\
                                <div class="form-group">\
                                    <label>NAME</label>\
                                    <div class="controls">\
                                        <input type="text" name="ref_name[]" class="form-control" value="'+data.Name+'">\
                                        <span class="text-danger titleld_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="col-md-5">\
                                <div class="form-group">\
                                    <label>Address</label>\
                                    <div class="controls">\
                                        <input type="text" name="ref_address[]" class="form-control" value="'+data.Address+'">\
                                        <span class="text-danger numberhours_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="col-md-3">\
                                <div class="form-group">\
                                    <label>Cellphone/Telephone</label>\
                                    <div class="controls">\
                                        <input type="text" name="ref_cell[]" class="form-control" value="'+data.TelNo+'">\
                                        <span class="text-danger type_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                </div>');

            });
            if(countthis === 0){
                $('.add-reference').append('<input type="hidden" name="ref_id[]" value="">\
                <div class="card p-2 border-top border-primary" >\
                         <div class="card-header">\
                        </div>\
                        <div class="row">\
                            <div class="col-md-4">\
                                <div class="form-group">\
                                    <label>NAME</label>\
                                    <div class="controls">\
                                        <input type="text" name="ref_name[]" class="form-control" value="">\
                                        <span class="text-danger titleld_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="col-md-5">\
                                <div class="form-group">\
                                    <label>Address</label>\
                                    <div class="controls">\
                                        <input type="text" name="ref_address[]" class="form-control" value="">\
                                        <span class="text-danger numberhours_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="col-md-3">\
                                <div class="form-group">\
                                    <label>Cellphone/Telephone</label>\
                                    <div class="controls">\
                                        <input type="text" name="ref_cell[]" class="form-control" value="">\
                                        <span class="text-danger type_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                </div>');
            }
        }else{
            $('.add-reference').append('<input type="hidden" name="ref_id[]" value="">\
                <div class="card p-2 border-top border-primary" >\
                         <div class="card-header">\
                        </div>\
                        <div class="row">\
                            <div class="col-md-4">\
                                <div class="form-group">\
                                    <label>NAME</label>\
                                    <div class="controls">\
                                        <input type="text" name="ref_name[]" class="form-control" value="">\
                                        <span class="text-danger titleld_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="col-md-5">\
                                <div class="form-group">\
                                    <label>Address</label>\
                                    <div class="controls">\
                                        <input type="text" name="ref_address[]" class="form-control" value="">\
                                        <span class="text-danger numberhours_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="col-md-3">\
                                <div class="form-group">\
                                    <label>Cellphone/Telephone</label>\
                                    <div class="controls">\
                                        <input type="text" name="ref_cell[]" class="form-control" value="">\
                                        <span class="text-danger type_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                </div>');
        }
    }
    $('#form-update-employee-other-info').find('input[type=radio]').change(function() {
        if($(this).attr("id") === 'rbqy1') {
            $(this).val("1");
          $('#divrbqy1').html('<small>If Yes, give details: <input name="yes_rbqy1" class="inp" value="'+(RB_array[1]?RB_array[1]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn1'){
            $(this).val("0");
            $('#divrbqy1').html('');
        }else if($(this).attr("id") === 'rbqy2'){
            $(this).val("1");
            $('#divrbqy2').html('<small>If Yes, give details: <input name="yes_rbqy2" class="inp" value="'+(RB_array[2]?RB_array[2]:'')+'"/></small>');
        }
        else if($(this).attr("id") === 'rbqn2'){
            $(this).val("0");
            $('#divrbqy2').html('');
        }else if($(this).attr("id") === 'rbqy3'){
            $(this).val("1");
            $('#divrbqy3').html('<small>If Yes, give details: <input name="yes_rbqy3" class="inp" value="'+(RB_array[3]?RB_array[3]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn3'){
            $(this).val("0");
            $('#divrbqy3').html('');
        }else if($(this).attr("id") === 'rbqy4'){
            $(this).val("1");
            $('#divrbqy4').html('<small>If Yes, give details: <br> Date Filed: <input name="yes_rbqy4" class="inp" value="'+(RB_array[4]?RB_array[4]:'')+'"/> <br>  Status of Case/s: <input name="yes2_rbqy4" class="inp" value="'+(RB_array[13]?RB_array[13]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn4'){
            $(this).val("0");
            $('#divrbqy4').html('');
        }else if($(this).attr("id") === 'rbqy5'){
            $(this).val("1");
            $('#divrbqy5').html('<small>If Yes, give details: <input name="yes_rbqy5" class="inp" value="'+(RB_array[5]?RB_array[5]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn5'){
            $(this).val("0");
            $('#divrbqy5').html('');
        }else if($(this).attr("id") === 'rbqy6'){
            $(this).val("1");
            $('#divrbqy6').html('<small>If Yes, give details: <input name="yes_rbqy6" class="inp" value="'+(RB_array[6]?RB_array[6]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn6'){
            $(this).val("0");
            $('#divrbqy6').html('');
        }else if($(this).attr("id") === 'rbqy7'){
            $(this).val("1");
            $('#divrbqy7').html('<small>If Yes, give details: <input name="yes_rbqy7" class="inp" value="'+(RB_array[7]?RB_array[7]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn7'){
            $(this).val("0");
            $('#divrbqy7').html('');
        }else if($(this).attr("id") === 'rbqy8'){
            $(this).val("1");
            $('#divrbqy8').html('<small>If Yes, give details: <input name="yes_rbqy8" class="inp" value="'+(RB_array[8]?RB_array[8]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn8'){
            $(this).val("0");
            $('#divrbqy8').html('');
        }else if($(this).attr("id") === 'rbqy9'){
            $(this).val("1");
            $('#divrbqy9').html('<small>If Yes, give details (country): <input name="yes_rbqy9" class="inp" value="'+(RB_array[9]?RB_array[9]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn9'){
            $(this).val("0");
            $('#divrbqy9').html('');
        }else if($(this).attr("id") === 'rbqy10'){
            $(this).val("1");
            $('#divrbqy10').html('<small>If Yes, please specify: <input name="yes_rbqy10" class="inp" value="'+(RB_array[10]?RB_array[10]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn10'){
            $(this).val("0");
            $('#divrbqy10').html('');
        }else if($(this).attr("id") === 'rbqy11'){
            $(this).val("1");
            $('#divrbqy11').html('<small>If Yes, please specify ID No: <input name="yes_rbqy11" class="inp" value="'+(RB_array[11]?RB_array[11]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn11'){
            $(this).val("0");
            $('#divrbqy11').html('');
        }else if($(this).attr("id") === 'rbqy12'){
            $(this).val("1");
            $('#divrbqy12').html('<small>If Yes, please specify ID No: <input name="yes_rbqy12" class="inp" value="'+(RB_array[12]?RB_array[12]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn12'){
            $(this).val("0");
            $('#divrbqy12').html('');
        }
    });
    $('#form-update-employee-other-info-emp').find('input[type=radio]').change(function() {
        if($(this).attr("id") === 'rbqy1') {
            $(this).val("1");
          $('#divrbqy1').html('<small>If Yes, give details: <input name="yes_rbqy1" class="inp" value="'+(RB_array[1]?RB_array[1]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn1'){
            $(this).val("0");
            $('#divrbqy1').html('');
        }else if($(this).attr("id") === 'rbqy2'){
            $(this).val("1");
            $('#divrbqy2').html('<small>If Yes, give details: <input name="yes_rbqy2" class="inp" value="'+(RB_array[2]?RB_array[2]:'')+'"/></small>');
        }
        else if($(this).attr("id") === 'rbqn2'){
            $(this).val("0");
            $('#divrbqy2').html('');
        }else if($(this).attr("id") === 'rbqy3'){
            $(this).val("1");
            $('#divrbqy3').html('<small>If Yes, give details: <input name="yes_rbqy3" class="inp" value="'+(RB_array[3]?RB_array[3]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn3'){
            $(this).val("0");
            $('#divrbqy3').html('');
        }else if($(this).attr("id") === 'rbqy4'){
            $(this).val("1");
            $('#divrbqy4').html('<small>If Yes, give details: <br> Date Filed: <input name="yes_rbqy4" class="inp" value="'+(RB_array[4]?RB_array[4]:'')+'"/> <br>  Status of Case/s: <input name="yes2_rbqy4" class="inp" value="'+(RB_array[13]?RB_array[13]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn4'){
            $(this).val("0");
            $('#divrbqy4').html('');
        }else if($(this).attr("id") === 'rbqy5'){
            $(this).val("1");
            $('#divrbqy5').html('<small>If Yes, give details: <input name="yes_rbqy5" class="inp" value="'+(RB_array[5]?RB_array[5]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn5'){
            $(this).val("0");
            $('#divrbqy5').html('');
        }else if($(this).attr("id") === 'rbqy6'){
            $(this).val("1");
            $('#divrbqy6').html('<small>If Yes, give details: <input name="yes_rbqy6" class="inp" value="'+(RB_array[6]?RB_array[6]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn6'){
            $(this).val("0");
            $('#divrbqy6').html('');
        }else if($(this).attr("id") === 'rbqy7'){
            $(this).val("1");
            $('#divrbqy7').html('<small>If Yes, give details: <input name="yes_rbqy7" class="inp" value="'+(RB_array[7]?RB_array[7]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn7'){
            $(this).val("0");
            $('#divrbqy7').html('');
        }else if($(this).attr("id") === 'rbqy8'){
            $(this).val("1");
            $('#divrbqy8').html('<small>If Yes, give details: <input name="yes_rbqy8" class="inp" value="'+(RB_array[8]?RB_array[8]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn8'){
            $(this).val("0");
            $('#divrbqy8').html('');
        }else if($(this).attr("id") === 'rbqy9'){
            $(this).val("1");
            $('#divrbqy9').html('<small>If Yes, give details (country): <input name="yes_rbqy9" class="inp" value="'+(RB_array[9]?RB_array[9]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn9'){
            $(this).val("0");
            $('#divrbqy9').html('');
        }else if($(this).attr("id") === 'rbqy10'){
            $(this).val("1");
            $('#divrbqy10').html('<small>If Yes, please specify: <input name="yes_rbqy10" class="inp" value="'+(RB_array[10]?RB_array[10]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn10'){
            $(this).val("0");
            $('#divrbqy10').html('');
        }else if($(this).attr("id") === 'rbqy11'){
            $(this).val("1");
            $('#divrbqy11').html('<small>If Yes, please specify ID No: <input name="yes_rbqy11" class="inp" value="'+(RB_array[11]?RB_array[11]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn11'){
            $(this).val("0");
            $('#divrbqy11').html('');
        }else if($(this).attr("id") === 'rbqy12'){
            $(this).val("1");
            $('#divrbqy12').html('<small>If Yes, please specify ID No: <input name="yes_rbqy12" class="inp" value="'+(RB_array[12]?RB_array[12]:'')+'"/></small>');
        }else if($(this).attr("id") === 'rbqn12'){
            $(this).val("0");
            $('#divrbqy12').html('');
        }
    });

    $(document).on("click", ".btn-approve-request" , function(e) {
        e.preventDefault();
              var thisval = $(this);
              const id = $(this).data('id');
              const status = 'approved'
              const remarks = ''
                Swal.fire({
                  title: 'Approved?',
                  text: "You want to approved this request?",
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
                            url: '/employee/update-request-changes',
                            method: 'post',
                            data: {id ,status,remarks},
                            beforeSend:function(){
                            // $(form).find('span.error-text').text('');
                            },
                            success:function(response){
                                if(response.status == 200){
                                    //thisval.closest("tr").remove();
                                    $('.request-employee-table').DataTable().ajax.reload(null,false);
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
    $(document).on("click", ".btn-reject-request" , function(e) {
        e.preventDefault();
            var thisval = $(this);
    
               const id = $(this).data('id');
               var thisval = $(this);
               const status = 'reject'
                Swal.fire({
                  title: 'Reject?',
                  text: "You want to reject this request?",
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
                                    url: '/employee/update-request-changes',
                                    method: 'post',
                                    data: {id ,status,remarks},
                                    beforeSend:function(){
                                    // $(form).find('span.error-text').text('');
                                    },
                                    success:function(response){
                                        if(response.status == 200){
                                            //thisval.closest("tr").remove();
                                            $('.request-employee-table').DataTable().ajax.reload(null,false);
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
      
 });
 
 