$(function(){
    var GetYear;
    $(document).on("click", ".btn-approve-notarized" , function(e) {
       e.preventDefault();
              var id = $(this).data('id');
              const status = 'approved'
              const remarks = ''
                Swal.fire({
                  title: 'Approved?',
                  text: "Notarized SALN",
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
                            "url" : "/employee/status_notarized_saln",
                            method: 'post',
                            data: {id ,status,remarks},
                            beforeSend:function(){
                            // $(form).find('span.error-text').text('');
                            },
                            success:function(response){
                                if(response.status == 200){
                                    //thisval.closest("tr").remove();
                                    NotarizedTable.ajax.reload(null, false);
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
               var rejectType = '';
                Swal.fire({
                  title: 'Reject?',
                  text: "Notarized SALN",
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
                      title: '<h4>Why documents rejected?</h4>',
                      input: 'radio',
                      inputOptions: {
                        '1': 'in Signatures',
                        '2': 'in Contents'
                      },
                      confirmButtonText: 'Next',
                      // validator is optional
                      inputValidator: function(result) {
                        if (!result) {
                          return 'You need to select option!';
                        }
                      }
                    }).then(function(result) {
                      if (result.value) {
                        rejectType = result.value;
                        Swal.fire({
                          title: '<h5>Reason for Disapproved</h5>',
                          input: 'text',
                          confirmButtonClass: 'btn btn-sm btn-primary',
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
                          },
                          inputValidator: function(result) {
                            if (!result) {
                              return 'Reason is Required!';
                            }
                          }
                        }).then(function (result) {
                              if (result.value) {
                                  var remarks = result.value;

                                  $.ajax({
                                      url: '/employee/status_notarized_saln',
                                      method: 'post',
                                      data: {id ,status,remarks,rejectType},
                                      beforeSend:function(){
                                      // $(form).find('span.error-text').text('');
                                      },
                                      success:function(response){
                                          if(response.status == 200){
                                              //thisval.closest("tr").remove();
                                              NotarizedTable.ajax.reload(null, false);
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
                    })            
                  }
                });
    });
        NotarizedTable  =  $('#SALN-hrTable').DataTable({
                processing: true,
                info: true,
                responsive : true,
                ordering: true,
                 "ajax" : {
                            "url": "/employee/saln_dt",
                            "type" : "POST", 
                            "data": function(set){
                                set.year = GetYear;
                            },
                        },
                "pageLength": 10,
                "aLengthMenu":[[20,50,100,-1],[20,50,100,'All']],
                columns: [
                        {data: 'empname', name: 'empname'},
                        {data: 'year', name: 'year'},
                        {data: 'filename', name: 'filename'},
                        {data:'action', name:'action'},
                        ],
                        "oLanguage": {
                            "sEmptyTable": "No SALN Record Found"
                        },
        });
         $('select[name="year-selected"]').on('change', function() {
            GetYear = this.value;
            NotarizedTable.ajax.reload(null, false);
            
          });
      



});
