// $(document).ready(function() {  
//     ajaxReq();
//    Emp_ajaxReq();
//    // setInterval(ajaxReq(), 1000);


  
       

// });

// //   setInterval(function() {
// //     ajaxReq()
// //   }, 1000);

//     function ajaxReq(){
//         $.ajax({
//             type: 'POST',
//             url: '/my-profile/checkchanges',
//             dataType: 'json',
//             cache: false,
//             // beforeSend:function(){
//             //     $('#my-profile-div').html('<i class="spinner-grow text-info"></i> Loading...');
//             // },
//             success: function(response) {
//                 console.log('rrr:',response);
//                var url = window.location.origin;
//                var countnotification = 0
//                if(response.status == 200){
//                         $('.media-list').html('')
//                         //response.employee.map(function(element){
//                         $.each(response.employee , function (key, element){
//                         if(element.id){
//                             countnotification++
//                         }
//                         $('.media-list').append('<a href="/employee/request-changes/show?f='+element.id+'" class="d-flex justify-content-between navbar-fromrequest-notification" >\
//                             <div class="media d-flex align-items-center">\
//                             <div class="media-left pr-0">\
//                                 <div class="avatar mr-1 m-0"><img src="'+(element.photo?element.photo:url+'/images/logo/emptyprofile.png')+'" alt="avatar" height="39" width="39"></div>\
//                             </div>\
//                             <div class="media-body">\
//                                 <h6 class="media-heading"><span class="text-bold-500">'+element.firstname+' '+element.lastname+'</span> request for changes her Name </h6><small class="notification-text">'+element.created_at+'</small>\
//                             </div>\
//                             </div>\
//                         </a>') 
//                   })
//                   if(countnotification <= 0){
//                     $('.bell-class-notify').removeClass('bx-tada');
//                 }else{
//                     $('.bell-class-notify').addClass('bx-tada');
//                  }
               
//                 $('.countnotify').html(countnotification===0?'':countnotification);
//                 $('.notification-count').html(countnotification?countnotification+' new notification':'no notification');
//                }
               
//             }
//          });
//     }

//     function Emp_ajaxReq(){
//         $.ajax({
//             type: 'POST',
//             url: '/my-profile/notify-Reg-emp',
//            // dataType: 'json',
//             cache: false,
//             // beforeSend:function(){
//             //     $('#my-profile-div').html('<i class="spinner-grow text-info"></i> Loading...');
//             //     },
//             success: function(response) {
//                 console.log('empppp:',response);
//                 var countnotification = 0;
//                 if(response.status == 200){
//                     var url = window.location.origin;
//                         $('.msg-class-notify').addClass('bx-tada');
//                         $('.media-list2').html('');
//                         $('.countnotify').html('');
//                         $('.notification-count').html('');
//                         //response.data.map(function(element){
//                         $.each(response.data , function (key, element){
//                                 if(element.emp_seen != 1){
//                                     countnotification++
//                                 }
//                                 $('.media-list2').append('<a href="#" data-id="'+element.EmpId+'" class="d-flex justify-content-between emp-navbar-fromrequest-notification" >\
//                                 <div class="media d-flex align-items-center">\
//                                 <div class="media-left pr-0">\
//                                     <div class="avatar ml-1 mr-1 m-0"><i class="bx bx-error-circle font-size-large"></i></div>\
//                                 </div>\
//                                 <div class="media-body mt-1 mb-1">\
//                                     <h6 class="media-heading"><span class="text-bold-500">Your Request for <b><i>'+element.ColumnName+'</i></b>:  <b><i>'+(element.OldData?element.OldData:'')+'</i></b> <i class="bx bx-right-arrow-alt font-size-small text-primary"></i> <i><b>'+(element.NewData?element.NewData:'')+'</i></b> is <b><i>'+element.Status.toUpperCase()+'</i></b> '+(element.Remarks?'<small class="text-danger"> for the reason of '+element.Remarks:'')+' </small>\
//                                 </div>\
//                                 </div>\
//                             </a>')    
//                     })

//                     $('.countnotifymsg').html(countnotification===0?'':countnotification);
//                    // $('.notification-count').html(countnotification+' new notification');
//                     $('.notification-count').html(countnotification?countnotification+' new notification':'notification');
                    
//                }
//                $('.msg-class-notify').removeClass('bx-tada');
               
//             }
//          });
//     }
    

//        $(document).on('click','.notification-emp-c', function(e){
//         e.preventDefault();

//        // var id = $(this).data('id')
//         //console.log('asdsad: ');
//             // const id = $(this).data('id');
//             $.ajax({
//                 type: 'post',
//                 url: '/my-profile/seen-emp',
//                 // beforeSend:function(){
//                 // // $('#my-profile-div').html('<i class="spinner-grow text-info"></i> Loading...');
//                 //     },
//                 success: function(response) {
//                     if(response.status == 200){
//                         $('.countnotifymsg').html('');
//                     }
//                   // console.log('seene emp;',response);
//                    // window.location.href = '/employee/request-changes';
//                 }
//             });

//         });

//     //  $(document).on('click','.navbar-fromrequest-notification', function(e){
//     //   e.preventDefault();
//     //       const id = $(this).data('id');
//     //       $.ajax({
//     //         type: 'GET',
//     //         url: '/employee/request-changes',
//     //         data: { id : id},
//     //         dataType: 'json',
//     //         beforeSend:function(){
//     //            // $('#my-profile-div').html('<i class="spinner-grow text-info"></i> Loading...');
//     //             },
//     //         success: function(response) {
//     //            //console.log(response);
//     //             window.location.href = '/employee/request-changes';
//     //         }
//     //      });
        
//     //  });


    

