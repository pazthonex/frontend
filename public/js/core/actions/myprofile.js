$(function(){

   
     $(document).on('submit', '#my-profile-form', function(e) {
      e.preventDefault();

     
           // var form = $('#my-profile-form')[0];
           // var formData = new FormData(form);
            $.ajax({
                url: '/my-profile/update',
                method: 'post',
                data:  new FormData(this),
                contentType: false,
                cache: false,
                processData: false,
                beforeSend:function(){
                 $('#my-profile-form').find('span').text('')
                 $('#btnSubmit-EditMyProfile').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Sending...');
                },
                success:function(response){
                    if(response.status === 200){
                        toastr.success(response.message)
                       $('#view-Modal').modal('hide') 
                    }else if(response.status === 400){
                        $.each(response.message, function(prefix,val){
                            $('#my-profile-form').find('span.'+prefix+'_error').text(val[0]);
                        });
                      //  $('#my-profile-form').find('span.file_error').text(response.message.file);
                    }else if(response.status === 205){
                        $('#view-Modal').modal('hide') 
                    }
                    else{
                        toastr.error(response.message)
                    }
                    $('#btnSubmit-EditMyProfile').html('<i class="bx bx-send font-size-small mr-25"></i><span>Request Changes</span>');
                },
                error: function(err) {
                    if(err.status === 200){
                        toastr.success('Request Sent!')
                    }
                    $('#view-Modal').modal('hide') 
                    $('#btnSubmit-EditMyProfile').html('<i class="bx bx-send font-size-small mr-25"></i><span>Request Changes</span>');
                  }

            });
     });
     

      $(document).on("click", ".add-myprofile-educationBackground" , function() {
        var id = $(this).data('id');
        AddDataEducationBackground(id)
        $('#myProfileTitle').html('Education Background')
        $('#view-Modal').modal('show');
        });
        $(document).on("click", ".add-myprofile-CivilService" , function() {
            var id = $(this).data('id');
            AddDataCivilService(id)
            $('#myProfileTitle').html('Civil Service Eligibility')
            $('#view-Modal').modal('show');
        });
        $(document).on("click", ".edit-myprofile-educationBackground" , function() {
            var id = $(this).data('id');
            var eb_id = $(this).data('ebid');
            $('#myProfileTitle').html('Education Background')
             getDataEducationBackground(id,eb_id)
           // $('#btnSubmit-EditMyProfile').prop("disabled", true);
            $('#view-Modal').modal('show');
        });
        
        $(document).on("click", ".edit-myprofile-voluntaryWork" , function() {
            var id = $(this).data('id');
            var vw_id = $(this).data('vwid');
           
            //var eb_id = $(this).data('ebid');
            getDataVoluntaryWork(id,vw_id)
            $('#myProfileTitle').html('Voluntary Work')
           // $('#btnSubmit-EditMyProfile').prop("disabled", true);
            $('#view-Modal').modal('show');
        });
        $(document).on("click", ".edit-myprofile-learningDevelopment" , function() {
            var id = $(this).data('id');
            var ld_id = $(this).data('ldid');
           
            //var eb_id = $(this).data('ebid');
            getDataLearningDevelopment(id,ld_id)
            $('#myProfileTitle').html('Learning and Development')
           // $('#btnSubmit-EditMyProfile').prop("disabled", true);
            $('#view-Modal').modal('show');
        });
        $(document).on("click", ".edit-myprofile-civilService" , function() {
            var id = $(this).data('id');
            var cs_id = $(this).data('csid');
           
            //var eb_id = $(this).data('ebid');
            getDataCivilService(id,cs_id)
            $('#myProfileTitle').html('Civil Service Eligibility')
           // $('#btnSubmit-EditMyProfile').prop("disabled", true);
            $('#view-Modal').modal('show');
        });
        $(document).on("click", ".edit-myprofile-familyBackground" , function() {
            var id = $(this).data('id');
            var fbid = $(this).data('fbid');
            getDataFamilyBackground(id,  fbid)
        // $('#btnSubmit-EditMyProfile').prop("disabled", true);
            $('#myProfileTitle').html('Family Background')
            $('#view-Modal').modal('show');
        });
        
        $(document).on("click", ".edit-myprofile-cardnumber" , function() {
            var id = $(this).data('id');
            getDataCardNumber(id)
            $('#myProfileTitle').html('Card Number')
            $('#view-Modal').modal('show');
        });
        $(document).on("click", ".edit-myprofile-personalInfo" , function() {
        
            var id = $(this).data('id');
            getDataPersonalInfo(id);
            $('#myProfileTitle').html('Personal Information')
            $('#view-Modal').modal('show');
        });
    
        $(document).on("click", ".edit-myprofile-address" , function() {
            const type = $(this).data('type');
            const id = $(this).data('id');
    
            getDataAddress(id,type);
            $('#myProfileTitle').html('Address')
            $('#view-Modal').modal('show');
         });

         $('#my-profile-form').find('select[name="rregion"]').on('change', function() {
            var id = $(this).find(':selected').data('id');
            var des = $(this).val();
            $.ajax({
                url: '/ref_address/province',
                method: 'post',
                data: {id : id},
                beforeSend:function(){
                    $('#my-profile-form').find('select[name="rprovince"]').html('<option value="" selected="true" disabled="disabled"><i class="spinner-border spinner-border-sm"></i> Loading...</option>');
                },
                success:function(result){
                    if(result.status === 200){
                        $('#my-profile-form').find('select[name="rprovince"]').html('')
                        $('#my-profile-form').find('select[name="rprovince"]').append('<option value="" selected="true" disabled="disabled">Select Province</option>');
                        $.each(result.data , function (key, item){
                            $('#my-profile-form').find('select[name="rprovince"]').append('<option data-description="'+item.provDesc+'" data-id="'+item.provCode+'" value="'+item.id+'" id="'+item.provDesc+'">'+item.provDesc+'</option>');
                            });
                    }else{
                        $('#my-profile-form').find('select[name="rprovince"]').html('<option value=""></option>');
                    }
                }
            });
         });
         $('#my-profile-form').find('select[name="rprovince"]').on('change', function() {
            var id = $(this).find(':selected').data('id');
            var des = $(this).val();
            
            $.ajax({
                url: '/ref_address/city',
                method: 'post',
                data: {id : id},
                beforeSend:function(){
                    $('#my-profile-form').find('select[name="rcity"]').html('<option value="" selected="true" disabled="disabled">Loading...</option>');
                },
                success:function(result){
                    if(result.status === 200){
                        $('#my-profile-form').find('select[name="rcity"]').html('')
                        $('#my-profile-form').find('select[name="rcity"]').append('<option value="" selected="true" disabled="disabled">Select City/Municipal</option>');
                        $.each(result.data , function (key, item){
                            $('#my-profile-form').find('select[name="rcity"]').append('<option data-description="'+item.citymunDesc+'" data-id="'+item.citymunCode+'" value="'+item.id+'">'+item.citymunDesc+'</option>');
                            });
                    }else{
                        $('#my-profile-form').find('select[name="rcity"]').html('<option value=""></option>');
                    }
                }
            });
         });
         $('#my-profile-form').find('select[name="rcity"]').on('change', function() {
            var id = $(this).find(':selected').data('id');
            var des = $(this).val();
            
            $.ajax({
                url: '/ref_address/brgy',
                method: 'post',
                data: {id : id},
                beforeSend:function(){
                    $('#my-profile-form').find('select[name="rbrgy"]').html('<option value="" selected="true" disabled="disabled">Loading...</option>');
                },
                success:function(result){
                    if(result.status === 200){
                        $('#my-profile-form').find('select[name="rbrgy"]').html('')
                        $('#my-profile-form').find('select[name="rbrgy"]').append('<option value="" disabled="disabled" selected="true">Select Barangay</option>');
                        $.each(result.data , function (key, item){
                            $('#my-profile-form').find('select[name="rbrgy"]').append('<option data-description="'+item.brgyDesc+'" value="'+item.brgyDesc+'">'+item.brgyDesc+'</option>');
                            });
                    }else{
                        $('#my-profile-form').find('select[name="rbrgy"]').html('<option value=""></option>');
                    }
                }
            });
         });
    
    
    
    
        // $(document).ready(function () {  
    // $('#my-profile-form').find('select[name="rregion"]').on('change', function() {
       $(document).on("change", ".region" , function(e) {
          e.preventDefault()
            var id = $(this).find(':selected').data('code');
            var val = $(this).find(':selected').val();
            $.ajax({
                url: '/ref_address/province',
                method: 'post',
                data: {id : id},
                beforeSend:function(){
                    $('.province').html('<option>Loading...</option>');
                },
                success:function(result){
                    if(result.status === 200){
                        $('.province').html('')
                        $('.province').append('<option value="" selected="true" disabled="disabled">Select Province</option>');
                        $.each(result.data , function (key, item){
                            $('.province').append('<option data-code="'+item.provCode+'" value="'+item.id+'" >'+item.provDesc+'</option>');
                            });
                    }else{
                        $('.province').html('<option value=""></option>');
                    }
                }
            });
         });
     //   });
       //  $('#my-profile-form').find('select[name="pprovince"]').on('change', function() {
        $(document).on("change", ".province" , function(e) {
            var id = $(this).find(':selected').data('code');
            var val = $(this).find(':selected').val();
            $.ajax({
                url: '/ref_address/city',
                method: 'post',
                data: {id : id},
                beforeSend:function(){
                    $('.city').html('<option>Loading...</option>');
                },
                success:function(result){
                    if(result.status === 200){
                        $('.city').html('')
                        $('.city').append('<option value="" selected="true" disabled="disabled">Select City/Municipal</option>');
                        $.each(result.data , function (key, item){
                            $('.city').append('<option data-code="'+item.citymunCode+'" value="'+item.id+'">'+item.citymunDesc+'</option>');
                            });
                    }else{
                        $('.city').html('<option value=""></option>');
                    }
                }
            });
         });
       //  $('#my-profile-form').find('select[name="pcity"]').on('change', function() {
            $(document).on("change", ".city" , function(e) {
            var id = $(this).find(':selected').data('code');
            var val = $(this).find(':selected').val();
            $.ajax({
                url: '/ref_address/brgy',
                method: 'post',
                data: {id : id},
                beforeSend:function(){
                    $('.brgy').html('<option>Loading...</option>');
                },
                success:function(result){
                    if(result.status === 200){
                        $('.brgy').html('')
                        $('.brgy').append('<option value="" disabled="disabled" selected="true">Select Barangay</option>');
                        $.each(result.data , function (key, item){
                            $('.brgy').append('<option data-code="'+item.citymunCode+'" value="'+item.brgyDesc+'">'+item.brgyDesc+'</option>');
                            });
                    }else{
                        $('.brgy').html('<option value=""></option>');
                    }
                }
            });
         });

          $(document).on("click", ".add-myprofile-voluntaryWork" , function() {
            var id = $(this).data('id');
            AddDataVoluntaryWork(id)
            $('#myProfileTitle').html('Voluntary Work')
            $('#view-Modal').modal('show');
        });

        $(document).on("click", ".add-myprofile-learningDevelopment" , function() {
            var id = $(this).data('id');
            AddDataLearningDevelopment(id)
            $('#myProfileTitle').html('Learning and Development')
            $('#view-Modal').modal('show');
        });

        
         
        function getDataPersonalInfo(id) {
            $.ajax({
                type: 'POST',
                url: '/my-profile/personalinfo',
                data: { id: id },
                dataType: 'json',
                beforeSend:function(){
                    $('#my-profile-div').html('<i class="spinner-grow text-info"></i> Loading...');
                    },
                success: function(response) {
                
                    var optionDepartment = '';
                    var optionEmploymentStatus = '';
                    response.returnData.departments.map(function(element){
                        optionDepartment += '<option '+(response.returnData.employee.data.department.DepartmentName.trim().toLowerCase()===element.DepartmentName.trim().toLowerCase()?'selected':'')+' value="'+element.id+'" >'+element.DepartmentName+'</option>'  
                    });
                    response.returnData.employmentStatus.map(function(element){
                        optionEmploymentStatus += '<option '+(response.returnData.employee.data.EmploymentStatus.trim().toLowerCase()===element.trim().toLowerCase()?'selected="true"':'')+' >'+element+'</option>'  
                });
                
                  // $(".modal-content").css({"overflow-y":"auto"});
                    $('#my-profile-div').html('<input type="hidden" name="edittype" value="pinfo"><input type="hidden" name="id" value="'+id+'"><div class="row">\
                    <div class="col-md-4">\
                        <fieldset class="form-group ">\
                        <label for="basicInput">Firstname *</label>\
                        <input type="text" name="firstname" class="form-control" value="'+(response.returnData.employee.data.FirstName?response.returnData.employee.data.FirstName:'')+'">\
                        <span class="text-danger firstname_error"></span>\
                        </fieldset>\
                    </div>\
                    <div class="col-md-4">\
                        <fieldset class="form-group ">\
                        <label for="basicInput">Middlename</label>\
                        <input type="text" name="middlename" class="form-control" value="'+(response.returnData.employee.data.MiddleName?response.returnData.employee.data.MiddleName:'')+'">\
                        <span class="text-danger middlename_error"></span>\
                        </fieldset>\
                    </div>\
                    <div class="col-md-4">\
                        <fieldset class="form-group ">\
                        <label for="basicInput">Lastname *</label>\
                        <input type="text" class="form-control" name="lastname" value="'+(response.returnData.employee.data.LastName?response.returnData.employee.data.LastName:'')+'">\
                        <span class="text-danger lastname_error"></span>\
                        </fieldset>\
                    </div>\
                </div>\
                <div class="row">\
                <div class="col-md-2">\
                    <fieldset class="form-group ">\
                    <label for="basicInput">Ext</label>\
                    <input type="text" name="ext" class="form-control" placeholder="eg. Jr" value="'+(response.returnData.employee.data.Ext?response.returnData.employee.data.Ext:'')+'">\
                    <span class="text-danger ext_error"></span>\
                    </fieldset>\
                </div>\
                <div class="col-md-2">\
                    <fieldset class="form-group ">\
                    <label for="basicInput">Suffix</label>\
                    <input type="text" name="suffix" class="form-control" placeholder="eg. Mr" value="'+(response.returnData.employee.data.Suffix?response.returnData.employee.data.Suffix:'')+'">\
                    <span class="text-danger suffix_error"></span>\
                    </fieldset>\
                </div>\
                <div class="col-md-3">\
                    <fieldset class="form-group ">\
                    <label for="basicInput">Prefix</label>\
                    <input type="text" class="form-control" name="prefix" placeholder="eg. PhD" value="'+(response.returnData.employee.data.Prefix?response.returnData.employee.data.Prefix:'')+'">\
                    <span class="text-danger prefix_error"></span>\
                    </fieldset>\
                </div>\
                <div class="col-md-5">\
                    <fieldset class="form-group ">\
                    <label for="basicInput">Civil Status *</label>\
                    <select class="form-control" name="civilstatus">\
                        <option value="" selected="true" disabled="disabled"></option>\
                        <option '+(response.returnData.employee_enc.civilstatus.trim().toLowerCase()==='single'?'selected="true"':'')+' value="Single">Single</option>\
                        <option '+(response.returnData.employee_enc.civilstatus.trim().toLowerCase()==='married'?'selected="true"':'')+' value="Married">Married</option>\
                        <option '+(response.returnData.employee_enc.civilstatus.trim().toLowerCase()==='widowed'?'selected="true"':'')+' value="Widowed">Widowed</option>\
                        <option '+(response.returnData.employee_enc.civilstatus.trim().toLowerCase()==='divorced'?'selected="true"':'')+' value="Divorced">Divorced</option>\
                        <option '+(response.returnData.employee_enc.civilstatus.trim().toLowerCase()==='separated'?'selected="true"':'')+' value="Separated">Separated</option>\
                        <option '+(response.returnData.employee_enc.civilstatus.trim().toLowerCase()==='domestic partnership'?'selected="true"':'')+' value="Domestic Partnership">Domestic Partnership</option>\
                    <select>\
                    <span class="text-danger civilstatus_error"></span>\
                    </fieldset>\
                </div>\
                </div>\
                <div class="row">\
                    <div class="col-md-8">\
                        <fieldset>\
                            <label for="basicInput">Email Address *</label>\
                            <div class="input-group">\
                                <input type="text" name="emailaddress" id="emailaddress" class="form-control" placeholder="" aria-describedby="basic-addon2" style="text-align:right;" value="'+(response.returnData.employee_enc.emailaddress?response.returnData.employee_enc.emailaddress:'')+'">\
                                <div class="input-group-append">\
                                <small class="input-group-text" id="basic-addon2">@southernleytestateu.edu.ph</small>\
                                </div>\
                            </div>\
                            <span class="text-danger emailaddress_error"></span> <span class="text-danger email_error"></span>\
                            </fieldset>\
                    </div>\
                    <div class="col-md-4">\
                        <fieldset class="form-group ">\
                        <label for="basicInput">Gender *</label>\
                            <select class="form-control" name="sex">\
                                <option value="" selected="true" disabled="disabled"></option>\
                                <option '+(response.returnData.employee_enc.sex.trim().toLowerCase()==='male'?'selected="true"':'')+' value="Male">Male</option>\
                                <option '+(response.returnData.employee_enc.sex.trim().toLowerCase()==='female'?'selected="true"':'')+' value="Female">Female</option>\
                            <select>\
                            <span class="text-danger sex_error"></span>\
                        </fieldset>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-md-6">\
                        <fieldset class="form-group ">\
                        <label for="basicInput">Date Of Birth *</label>\
                            <input type="date" class="form-control" name="dateofbirth" value="'+(response.returnData.employee_enc.dateofbirth?response.returnData.employee_enc.dateofbirth:'')+'">\
                            <span class="text-danger dateofbirth_error"></span>\
                        </fieldset>\
                    </div>\
                    <div class="col-md-6">\
                        <fieldset class="form-group ">\
                        <label for="basicInput">Place Of Birth *</label>\
                        <input type="text" class="form-control"  name="placeofbirth" value="'+(response.returnData.employee_enc.placeofbirth?response.returnData.employee_enc.placeofbirth:'')+'">\
                        <span class="text-danger placeofbirth_error"></span>\
                        </fieldset>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-md-7">\
                        <fieldset class="form-group ">\
                        <label for="basicInput">Department *</label>\
                        <select class="form-control" name="department">\
                            <option value="" selected="true" disabled="disabled"></option>\
                            '+optionDepartment+'\
                        </select>\
                        <span class="text-danger department_error"></span>\
                        </fieldset>\
                    </div>\
                    <div class="col-md-5">\
                        <fieldset class="form-group ">\
                        <label for="basicInput">Cellphone *</label>\
                        <input type="text" class="form-control" name="cellphone" placeholder="eg. 09123456789" maxlength="11" value="'+(response.returnData.employee.data.Cellphone?response.returnData.employee.data.Cellphone:'')+'">\
                        <span class="text-danger cellphone_error"></span>\
                        </fieldset>\
                    </div>\
                </div>\
                <div class="row">\
                <div class="col-md-4">\
                    <fieldset class="form-group ">\
                    <label for="basicInput">Citizenship *</label>\
                        <input type="text" class="form-control" name="citizenship" value="'+(response.returnData.employee_enc.citizenship?response.returnData.employee_enc.citizenship:'')+'">\
                        <span class="text-danger citizenship_error"></span>\
                    </fieldset>\
                </div>\
                <div class="col-md-4">\
                    <fieldset class="form-group ">\
                    <label for="basicInput">Agency Number *</label>\
                    <input type="text" class="form-control" name="agencynumber" disabled value="'+(response.returnData.employee.data.AgencyNumber?response.returnData.employee.data.AgencyNumber:'')+'">\
                    <span class="text-danger agencynumber_error"></span>\
                    </fieldset>\
                </div>\
                <div class="col-md-4">\
                    <div class="form-group ">\
                        <label>Employment Status *</label>\
                        <select class="form-control  border-input"  name="employmentstatus"  required>\
                            <option value="" selected="true" disabled="disabled"></option>\
                            '+optionEmploymentStatus+'\
                            <span class="text-danger employmentstatus_error"></span>\
                        </select>\
                    </div>\
                </div>\
                </div><hr><div class="col-md-12"><fieldset class="form-group ">\
                <label for="basicInput">Attach File as Proof (IMAGE/PDF Format) </label>\
                <input type="file" class="form-control" name="file"  accept=".pdf, image/*">\
                <span class="text-danger file_error"></span>\
                </fieldset>\</div>');
               // $('#btnSubmit-EditMyProfile').prop("disabled", false);
                },
                error: function() {
                    toastr.error('Server Error')
                }
            });
        }
        function getDataAddress(id,type) {
           
            $.ajax({
                type: 'POST',
                url: '/my-profile/address',
                data: { id: id },
                dataType: 'json',
                beforeSend:function(){
                    $('#my-profile-div').html('<i class="spinner-grow text-info"></i> Loading...');
                    },
                success: function(response) {
                  
                    if(response.status === 200){
                            var optionRegion = '';
                            var optionProvince = '';
                            var optionCity = '';
                            var optionBrgy = '';
                        var typeDes = '';
                        var typeA = '';
                        var typeString;
                       
                        if(type === 'permanent'){
                            typeA = 1;
                            typeString = 'p';
                            typeDes = 'Permanent Address'
                            if(response.returnData.employee.data.pregion){
                                response.returnData.region.map(function(element){
                                optionRegion += '<option '+(response.returnData.employee.data?.pregion?.regDesc.trim().toLowerCase()===element.regDesc.trim().toLowerCase()?'selected="true"':'')+' value="'+element.id+'" data-code="'+element.regCode+'" >'+element.regDesc+'</option>'  
                                });
                                response.returnData.pprovince.map(function(element){
                                    optionProvince += '<option '+(response.returnData.employee.data?.pprovince?.provDesc.trim().toLowerCase()===element.provDesc.trim().toLowerCase()?'selected="true"':'')+' value="'+element.id+'" data-code="'+element.provCode+'" >'+element.provDesc+'</option>'   
                                });
                                response.returnData.pcity.map(function(element){
                                    optionCity += '<option '+(response.returnData.employee.data?.pcitymun?.citymunDesc.trim().toLowerCase()===element.citymunDesc.trim().toLowerCase()?'selected="true"':'')+' value="'+element.id+'" data-code="'+element.citymunCode+'"  >'+element.citymunDesc+'</option>'  
                                });
                                response.returnData.pbrgy.map(function(element){
                                    optionBrgy += '<option '+(response.returnData?.employee_pbrgy.trim().toLowerCase()===element.brgyDesc.trim().toLowerCase()?'selected="true"':'')+' value="'+element.brgyDesc+'" >'+element.brgyDesc+'</option>'  
                                });
                            }
                        }else{
                            typeA = 0;
                            typeDes = 'Residential Address'
                            typeString = 'r';
                         if(response.returnData.employee.data.rregion){
                            response.returnData.region.map(function(element){
                                optionRegion += '<option '+(response.returnData.employee.data?.rregion?.regDesc.trim().toLowerCase()===element.regDesc.trim().toLowerCase()?'selected="true"':'')+' value="'+element.id+'" data-code="'+element.regCode+'">'+element.regDesc+'</option>'  
                                });
                                response.returnData.rprovince.map(function(element){
                                    optionProvince += '<option '+(response.returnData.employee.data?.rprovince?.provDesc.trim().toLowerCase()===element.provDesc.trim().toLowerCase()?'selected="true"':'')+'  value="'+element.id+'" data-code="'+element.provCode+'" >'+element.provDesc+'</option>'  
                                });
                                response.returnData.rcity.map(function(element){
                                    optionCity += '<option '+(response.returnData.employee.data?.rcitymun?.citymunDesc.trim().toLowerCase()===element.citymunDesc.trim().toLowerCase()?'selected="true"':'')+' value="'+element.id+'" data-code="'+element.citymunCode+'" >'+element.citymunDesc+'</option>'  
                                });
                                response.returnData.rbrgy.map(function(element){
                                    optionBrgy += '<option '+(response.returnData?.employee_rbrgy.trim().toLowerCase()===element.brgyDesc.trim().toLowerCase()?'selected="true"':'')+' value="'+element.brgyDesc+'" >'+element.brgyDesc+'</option>'  
                                });
                            }
                        }
                      
                            if(optionRegion && optionProvince && optionBrgy){
                                    $('#my-profile-div').html('<input type="hidden" name="edittype" value="'+typeString+'address"><input type="hidden" name="id" value="'+id+'"><h6><b>'+typeDes+'</b></h6><hr>\
                                        <div class="row">\
                                            <div class="col-md-6">\
                                                <div class="form-group input-group-sm">\
                                                    <label> Region</label>\
                                                    <div class="controls">\
                                                        <select class="form-control region" name="'+typeString+'region">\
                                                            <option value="" selected="true" disabled="disabled">- Select Region -</option>\
                                                            '+optionRegion+'\
                                                        <select>\
                                                        <span class="text-danger '+typeString+'region_error"></span>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                            <div class="col-md-6">\
                                                <div class="form-group input-group-sm">\
                                                    <label>Province</label>\
                                                    <div class="controls">\
                                                        <select class="form-control province" name="'+typeString+'province">\
                                                            <option value="" selected="true" disabled="disabled">- Select Province -</option>\
                                                            '+optionProvince+'\
                                                        </select>\
                                                        <span class="text-danger '+typeString+'province_error"></span>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                        </div>\
                                        <div class="row">\
                                            <div class="col-md-5">\
                                                <div class="form-group input-group-sm">\
                                                    <label>City/Municipal</label>\
                                                    <div class="controls">\
                                                        <select class="form-control city" name="'+typeString+'city">\
                                                        <option value="" selected="true" disabled="disabled">- Select City/Municipal -</option>\
                                                        '+optionCity+'\
                                                        <select>\
                                                        <span class="text-danger '+typeString+'city_error"></span>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                            <div class="col-md-5">\
                                                <div class="form-group input-group-sm">\
                                                    <label> Barangay</label>\
                                                    <div class="controls">\
                                                        <select class="form-control brgy" name="'+typeString+'brgy">\
                                                        <option value="" selected="true" disabled="disabled">- Select Barangay -</option>\
                                                        '+optionBrgy+'\
                                                        <select>\
                                                        <span class="text-danger '+typeString+'brgy_error"></span>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                            <div class="col-md-2">\
                                                <div class="form-group input-group-sm">\
                                                    <label>Zip Code</label>\
                                                    <div class="controls">\
                                                        <input type="text" name="'+typeString+'zip" class="form-control" value="'+(typeA === 1?response.returnData.employee_pzip:response.returnData.employee_rzip)+'">\
                                                    </div>\
                                                </div>\
                                            </div>\
                                        </div>\
                                        <div class="row">\
                                            <div class="col-md-3">\
                                                <div class="form-group input-group-sm">\
                                                    <label> House No.</label>\
                                                    <div class="controls">\
                                                        <input type="text" name="'+typeString+'houseno" class="form-control " value="'+(typeA === 1?response.returnData.employee_phouseno:response.returnData.employee_rhouseno)+'" >\
                                                    </div>\
                                                </div>\
                                            </div>\
                                            <div class="col-md-4">\
                                                <div class="form-group input-group-sm">\
                                                    <label> HouseStreet</label>\
                                                    <div class="controls">\
                                                        <input type="text" name="'+typeString+'housestreet" class="form-control " value="'+(typeA === 1?response.returnData.employee_phouesestreet:response.returnData.employee_rhouesestreet)+'" >\
                                                    </div>\
                                                </div>\
                                            </div>\
                                            <div class="col-md-5">\
                                                <div class="form-group input-group-sm">\
                                                    <label> SubDivision</label>\
                                                    <div class="controls">\
                                                        <input type="text" name="'+typeString+'subdivision" class="form-control " value="'+(typeA === 1?response.returnData.employee_psubdivision:response.returnData.employee_rsubdivision)+'">\
                                                    </div>\
                                                </div>\
                                            </div>\
                                        </div><hr><div class="col-md-12"><fieldset class="form-group input-group-sm">\
                                        <label for="basicInput">Attach File as Proof (IMAGE/PDF Format) </label>\
                                        <input type="file" class="form-control" name="file"  accept=".pdf, image/*">\
                                        <span class="text-danger file_error"></span>\
                                        </fieldset>\</div>');
                            }else{
                                var optionRegion = '';
                                response.returnData.region.map(function(element){
                                    optionRegion += '<option value="'+element.id+'" data-code="'+element.regCode+'">'+element.regDesc+'</option>'  
                                    });
                                $('#my-profile-div').html('<input type="hidden" name="edittype" value="'+typeString+'address"><input type="hidden" name="id" value="'+id+'"><h6><b>'+typeDes+'</b></h6><hr>\
                                <div class="row">\
                                    <div class="col-md-6">\
                                        <div class="form-group input-group-sm">\
                                            <label> Region</label>\
                                            <div class="controls">\
                                                <select class="form-control region" name="'+typeString+'region">\
                                                    <option value="" selected="true" disabled="disabled">- Select Region -</option>\
                                                    '+optionRegion+'\
                                                <select>\
                                                <span class="text-danger '+typeString+'region_error"></span>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="col-md-6">\
                                        <div class="form-group input-group-sm">\
                                            <label>Province</label>\
                                            <div class="controls">\
                                                <select class="form-control province" name="'+typeString+'province">\
                                                    <option value="" selected="true" disabled="disabled">- Select Province -</option>\
                                                </select>\
                                                <span class="text-danger '+typeString+'province_error"></span>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="row">\
                                    <div class="col-md-5">\
                                        <div class="form-group input-group-sm">\
                                            <label>City/Municipal</label>\
                                            <div class="controls">\
                                                <select class="form-control city" name="'+typeString+'city">\
                                                <option value="" selected="true" disabled="disabled">- Select City/Municipal -</option>\
                                                <select>\
                                                <span class="text-danger '+typeString+'city_error"></span>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="col-md-5">\
                                        <div class="form-group input-group-sm">\
                                            <label> Barangay</label>\
                                            <div class="controls">\
                                                <select class="form-control brgy" name="'+typeString+'brgy">\
                                                <option value="" selected="true" disabled="disabled">- Select Barangay -</option>\
                                                <select>\
                                                <span class="text-danger '+typeString+'brgy_error"></span>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="col-md-2">\
                                        <div class="form-group input-group-sm">\
                                            <label>Zip Code</label>\
                                            <div class="controls">\
                                                <input type="text" name="'+typeString+'zip" class="form-control" value="'+(typeA === 1?response.returnData.employee_pzip:response.returnData.employee_rzip)+'">\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="row">\
                                    <div class="col-md-3">\
                                        <div class="form-group input-group-sm">\
                                            <label> House No.</label>\
                                            <div class="controls">\
                                                <input type="text" name="'+typeString+'houseno" class="form-control " value="'+(typeA === 1?response.returnData.employee_phouseno:response.returnData.employee_rhouseno)+'" >\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="col-md-4">\
                                        <div class="form-group input-group-sm">\
                                            <label> HouseStreet</label>\
                                            <div class="controls">\
                                                <input type="text" name="'+typeString+'housestreet" class="form-control " value="'+(typeA === 1?response.returnData.employee_phouesestreet:response.returnData.employee_rhouesestreet)+'" >\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="col-md-5">\
                                        <div class="form-group input-group-sm">\
                                            <label> SubDivision</label>\
                                            <div class="controls">\
                                                <input type="text" name="'+typeString+'subdivision" class="form-control " value="'+(typeA === 1?response.returnData.employee_psubdivision:response.returnData.employee_rsubdivision)+'">\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div><hr><div class="col-md-12"><fieldset class="form-group input-group-sm">\
                                <label for="basicInput">Attach File as Proof (IMAGE/PDF Format) </label>\
                                <input type="file" class="form-control" name="file"  accept=".pdf, image/*">\
                                <span class="text-danger file_error"></span>\
                                </fieldset>\</div>');
                            }
                    }else{
                        toastr.error('Server Error! Try Again!')
                    }
                },
                error: function() {
                    toastr.error('Server Error')
                }
            });
        }
        function getDataCardNumber(id) {
            $.ajax({
                type: 'POST',
                url: '/my-profile/personalinfo',
                data: { id: id },
                dataType: 'json',
                beforeSend:function(){
                    $('#my-profile-div').html('<i class="spinner-grow text-info"></i> Loading...');
                    },
                success: function(response) {
                    if(response.status === 200){
                    $('#my-profile-div').html('<input type="hidden" name="edittype" value="cardNum"><input type="hidden" name="id" value="'+id+'"><div class="row">\
                <div class="col-md-3">\
                    <div class="form-group input-group-sm">\
                        <label>Tin</label>\
                        <div class="controls">\
                            <input type="text" name="tin" class="form-control " value="'+(response.returnData.employee.data.TIN?response.returnData.employee.data.TIN:'')+'">\
                        </div>\
                    </div>\
                </div>\
                <div class="col-md-3">\
                    <div class="form-group input-group-sm">\
                        <label>GSIS ID</label>\
                        <div class="controls">\
                            <input type="text" name="gsisid" class="form-control " value="'+(response.returnData.employee.data.GSISID?response.returnData.employee.data.GSISID:'')+'">\
                        </div>\
                    </div>\
                </div>\
                <div class="col-md-3">\
                    <div class="form-group input-group-sm">\
                        <label>PagIbig-ID</label>\
                        <div class="controls">\
                            <input type="text" name="pagibigid" class="form-control " value="'+(response.returnData.employee.data.PagIbigID?response.returnData.employee.data.PagIbigID:'')+'">\
                        </div>\
                    </div>\
                </div>\
                <div class="col-md-3">\
                    <div class="form-group input-group-sm">\
                        <label>PhilHealth</label>\
                        <div class="controls">\
                            <input type="text" name="philhealth" class="form-control " value="'+(response.returnData.employee.data.PhilHealth?response.returnData.employee.data.PhilHealth:'')+'">\
                        </div>\
                    </div>\
                </div>\
            </div>\
            <div class="row">\
                <div class="col-md-3">\
                    <div class="form-group input-group-sm">\
                        <label>SSS</label>\
                        <div class="controls">\
                            <input type="text" name="sss" class="form-control" value="'+(response.returnData.employee.data.SSS?response.returnData.employee.data.SSS:'')+'">\
                        </div>\
                    </div>\
                </div>\
                <div class="col-md-3">\
                    <div class="form-group input-group-sm">\
                        <label>Height <span style="text-transform: lowercase;">(m)</span></label>\
                        <div class="controls">\
                            <input type="text" name="height" class="form-control" value="'+(response.returnData.employee.data.Height?response.returnData.employee.data.Height:'')+'">\
                        </div>\
                    </div>\
                </div>\
                <div class="col-md-3">\
                    <div class="form-group input-group-sm">\
                        <label>Weight <span style="text-transform: lowercase;">(kg)</span></label>\
                        <div class="controls">\
                            <input type="text" name="weight" class="form-control"value="'+(response.returnData.employee.data.Weight?response.returnData.employee.data.Weight:'')+'">\
                        </div>\
                    </div>\
                </div>\
                <div class="col-md-3">\
                    <div class="form-group input-group-sm">\
                        <label>Blood Type</label>\
                        <div class="controls">\
                            <input type="text" name="bloodtype" class="form-control" value="'+(response.returnData.employee.data.BloodType?response.returnData.employee.data.BloodType:'')+'">\
                        </div>\
                    </div>\
                </div>\
                    </div><hr><div class="col-md-12"><fieldset class="form-group input-group-sm">\
                    <label for="basicInput">Attach File as Proof (IMAGE/PDF Format) </label>\
                    <input type="file" class="form-control" name="file"  accept=".pdf, image/*">\
                    <span class="text-danger file_error"></span>\
                    </fieldset>\</div>');
                    }else{
                        toastr.error('Server Error') 
                    }
                },
                error: function() {
                    toastr.error('Server Error')
                }
            });
        }
        function getDataFamilyBackground(id,fbid) {
            $.ajax({
                type: 'POST',
                url: '/my-profile/personalinfo',
                data: { id: id },
                dataType: 'json',
                beforeSend:function(){
                    $('#my-profile-div').html('<i class="spinner-grow text-info"></i> Loading...');
                    },
                success: function(response) {
                    if(response.status === 200){
                        $('#my-profile-div').html('<input type="hidden" name="edittype" value="familyB"><input type="hidden" name="id" value="'+id+'"><input type="hidden" name="fbid" value="'+fbid+'"><h6><b>Spouse\'s</b></h6>\
                        <hr>\
                        <div class="row">\
                            <div class="col-md-4">\
                                <div class="form-group">\
                                    <label>Firstname</label>\
                                    <div class="controls">\
                                        <input type="text" name="sfirstname" class="form-control" value="'+(response.returnData.employee.data.familybackground?.SpouseFirstName?response.returnData.employee.data.familybackground?.SpouseFirstName:'')+'">\
                                        <span class="text-danger sfirstname_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="col-md-3">\
                                <div class="form-group">\
                                    <label>Middlename</label>\
                                    <div class="controls">\
                                        <input type="text" name="smiddlename" class="form-control" value="'+(response.returnData.employee.data.familybackground?.SpouseMiddleName?response.returnData.employee.data.familybackground?.SpouseMiddleName:'')+'" >\
                                        <span class="text-danger smiddlename_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="col-md-3">\
                                <div class="form-group">\
                                    <label>Lastname</label>\
                                    <div class="controls">\
                                        <input type="text" name="slastname" class="form-control" value="'+(response.returnData.employee.data.familybackground?.SpouseSurName?response.returnData.employee.data.familybackground?.SpouseSurName:'')+'" >\
                                        <span class="text-danger slastname_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="col-md-2">\
                                <div class="form-group">\
                                    <label>Ext</label>\
                                    <div class="controls">\
                                        <input type="text" name="sext" class="form-control" placeholder=""value="'+(response.returnData.employee.data.familybackground?.SpouseExt?response.returnData.employee.data.familybackground?.SpouseExt:'')+'" >\
                                        <span class="text-danger sext_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-md-3">\
                                <div class="form-group">\
                                    <label>Occupation</label>\
                                    <div class="controls">\
                                        <input type="text" name="occupation" class="form-control" value="'+(response.returnData.employee.data.familybackground?.Occupation?response.returnData.employee.data.familybackground?.Occupation:'')+'">\
                                        <span class="text-danger occupation_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="col-md-3">\
                                <div class="form-group">\
                                    <label>Employer/Business Name</label>\
                                    <div class="controls">\
                                        <input type="text" name="employer" class="form-control" value="'+(response.returnData.employee.data.familybackground?.Employer?response.returnData.employee.data.familybackground?.Employer:'')+'">\
                                        <span class="text-danger employer_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="col-md-4">\
                                <div class="form-group">\
                                    <label>Business Address</label>\
                                    <div class="controls">\
                                        <input type="text" name="businessaddress" class="form-control" value="'+(response.returnData.employee.data.familybackground?.BusinessAddress?response.returnData.employee.data.familybackground?.BusinessAddress:'')+'">\
                                        <span class="text-danger businessaddress_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="col-md-2">\
                                <div class="form-group">\
                                    <label>Telephone No.</label>\
                                    <div class="controls">\
                                        <input type="text" name="telephone" class="form-control" value="'+(response.returnData.employee.data.familybackground?.TelephoneNumber?response.returnData.employee.data.familybackground?.TelephoneNumber:'')+'">\
                                        <span class="text-danger telephone_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                        <h6><b>Father\'s</b></h6>\
                        <hr>\
                        <div class="row">\
                            <div class="col-md-4">\
                                <div class="form-group">\
                                    <label>Firstname</label>\
                                    <div class="controls">\
                                        <input type="text" name="ffirstname" class="form-control" value="'+(response.returnData.employee.data.familybackground?.FatherFirstName?response.returnData.employee.data.familybackground?.FatherFirstName:'')+'">\
                                        <span class="text-danger ffirstname_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="col-md-3">\
                                <div class="form-group">\
                                    <label>Middlename</label>\
                                    <div class="controls">\
                                        <input type="text" name="fmiddlename" class="form-control" value="'+(response.returnData.employee.data.familybackground?.FatherMiddleName?response.returnData.employee.data.familybackground?.FatherMiddleName:'')+'" >\
                                        <span class="text-danger fmiddlename_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="col-md-3">\
                                <div class="form-group">\
                                    <label>Lastname</label>\
                                    <div class="controls">\
                                        <input type="text" name="flastname" class="form-control" value="'+(response.returnData.employee.data.familybackground?.FatherSurName?response.returnData.employee.data.familybackground?.FatherSurName:'')+'" >\
                                        <span class="text-danger flastname_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="col-md-2">\
                                <div class="form-group">\
                                    <label>Ext</label>\
                                    <div class="controls">\
                                        <input type="text" name="fext" class="form-control" placeholder="" value="'+(response.returnData.employee.data.familybackground?.FatherExt?response.returnData.employee.data.familybackground?.FatherExt:'')+'" >\
                                        <span class="text-danger fext_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                        <h6><b>Mother\'s</b></h6>\
                        <hr>\
                        <div class="row">\
                            <div class="col-md-4">\
                                <div class="form-group">\
                                    <label>Firstname</label>\
                                    <div class="controls">\
                                        <input type="text" name="mfirstname" class="form-control" value="'+(response.returnData.employee.data.familybackground?.MotherFirstName?response.returnData.employee.data.familybackground?.MotherFirstName:'')+'">\
                                        <span class="text-danger mfirstname_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="col-md-4">\
                                <div class="form-group">\
                                    <label>Middlename</label>\
                                    <div class="controls">\
                                        <input type="text" name="mmiddlename" class="form-control" value="'+(response.returnData.employee.data.familybackground?.MotherMiddleName?response.returnData.employee.data.familybackground?.MotherMiddleName:'')+'" >\
                                        <span class="text-danger mmiddlename_error"></span>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="col-md-4">\
                                <div class="form-group">\
                                    <label>Lastname</label>\
                                    <div class="controls">\
                                        <input type="text" name="mlastname" class="form-control" value="'+(response.returnData.employee.data.familybackground?.MotherSurName?response.returnData.employee.data.familybackground?.MotherSurName:'')+'" >\
                                        <span class="text-danger mlastname_error"></span>\
                                </div>\
                            </div>\
                        </div><hr><div class="col-md-12"><fieldset class="form-group input-group-sm">\
                        <label for="basicInput">Attach File as Proof (IMAGE/PDF Format) </label>\
                        <input type="file" class="form-control" name="file"  accept=".pdf, image/*">\
                        <span class="text-danger file_error"></span>\
                        </fieldset>\</div>');
                    }else{
                        toastr.error('Server Error! Try Again') 
                    }
                },
                error: function() {
                    toastr.error('Server Error')
                }
            });
        }

        function getDataEducationBackground(id,eb_id) {
           var ebid = atob(eb_id);
            $.ajax({
                type: 'POST',
                url: '/my-profile/personalinfo',
                data: { id: id },
                dataType: 'json',
                beforeSend:function(){
                    $('#my-profile-div').html('<i class="spinner-grow text-info"></i> Loading...');
                },
                success: function(response) {
                  var found = false;
                    if(response.status === 200){
                    $.each(response.returnData.employee.data.educationbackground , function (key, data){
                        if(data.id == ebid){
                            found = true;
                        $('#my-profile-div').html('<input type="hidden" name="edittype" value="educationB"><input type="hidden" name="id" value="'+id+'"><input type="hidden" name="ebid" value="'+btoa(data.id)+'">\
                                <div class="row">\
                                    <div class="col-md-5">\
                                        <div class="form-group">\
                                            <label>Level</label>\
                                            <div class="controls">\
                                                <select class="form-control  border-input" name="level" value="'+data.StudentLevel+'" >\
                                                     <option value="" disabled >--Select Level--</option>\
                                                    <option '+(data.StudentLevel==='Elementary'?'Selected':'')+' >Elementary</option>\
                                                    <option '+(data.StudentLevel==='Secondary'?'Selected':'')+'>Secondary</option>\
                                                    <option '+(data.StudentLevel==='College'?'Selected':'')+'>College</option>\
                                                    <option '+(data.StudentLevel==='Graduate Studies'?'Selected':'')+'>Graduate Studies</option>\
                                                    <option '+(data.StudentLevel==='Vocational'?'Selected':'')+'>Vocational</option>\
                                                </select>\
                                                <span class="text-danger level_error"></span>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="col-md-7">\
                                        <div class="form-group">\
                                            <label>Name Of School</label>\
                                            <div class="controls">\
                                                <input type="text" name="nameschool" class="form-control" value="'+(data.NameOfSchool?data.NameOfSchool:'')+'"  placeholder="eg. Mahaplag National HighSchool - Upper" >\
                                                <span class="text-danger nameschool_error"></span>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="row">\
                                    <div class="col-md-8">\
                                        <div class="form-group">\
                                            <label>Basic Education/Degree/Course</label>\
                                            <div class="controls">\
                                                <input type="text" name="degreecourse" class="form-control" value="'+(data.DegreeCourse?data.DegreeCourse:'')+'" placeholder="eg. Bachelor of Science in Information Technology" >\
                                                <span class="text-danger degreecourse_error"></span>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="col-md-4">\
                                        <div class="form-group">\
                                            <label>Year Graduated</label>\
                                            <div class="controls">\
                                                <input type="text" name="yeargraduated" class="form-control" value="'+(data.YearGraduated?data.YearGraduated:'')+'" placeholder="eg. 2005">\
                                                <span class="text-danger yeargraduated_error"></span>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="row">\
                                    <div class="col-md-2">\
                                        <div class="form-group">\
                                            <label>From<br></label>\
                                            <div class="controls">\
                                                <input type="text" name="from" class="form-control" value="'+(data.DateFrom?data.DateFrom:'')+'" placeholder="eg. 2001">\
                                                <span class="text-danger from_error"></span>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="col-md-2">\
                                        <div class="form-group">\
                                            <label>To<br></label>\
                                            <div class="controls">\
                                                <input type="text" name="to" class="form-control" value="'+(data.DateTo?data.DateTo:'')+'" placeholder="eg. 2005">\
                                                <span class="text-danger to_error"></span>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="col-md-4">\
                                        <div class="form-group">\
                                            <label>Highest Level/Units Earned <span style="text-transform:lowercase">(if not graduated)</span></label>\
                                            <div class="controls">\
                                                <input type="text" name="unitsearned" class="form-control" value="'+(data.UnitsEarned?data.UnitsEarned:'')+'" placeholder="eg. graduated"  >\
                                                <span class="text-danger unitsearned_error"></span>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="col-md-4">\
                                    <div class="form-group">\
                                        <label>Scholarship/Academic Honors Recieved</label>\
                                        <div class="controls">\
                                            <input type="text" name="academichonors" class="form-control" value="'+(data.AcademicHonors?data.AcademicHonors:'')+'" placeholder="eg. Valedictorian">\
                                            <span class="text-danger academichonors_error"></span>\
                                        </div>\
                                    </div>\
                                </div>\
                        </div><hr><div class="col-md-12"><fieldset class="form-group input-group-sm">\
                        <label for="basicInput">Attach File as Proof (IMAGE/PDF Format) </label>\
                        <input type="file" class="form-control" name="file"  accept=".pdf, image/*">\
                        <span class="text-danger file_error"></span>\
                        </fieldset>\</div>');
                        }
                    });
                    if(!found){
                        toastr.error('Server Error! Try Again Later!') 
                        $('#view-Modal').modal('hide');
                    }
                    }else{
                        toastr.error('Server Error! Try Again Later')
                        $('#view-Modal').modal('hide'); 
                    }
                },
                error: function() {
                    toastr.error('Server Error')
                }
            });
        }

        function AddDataEducationBackground(id) {
                         $('#my-profile-div').html('<input type="hidden" name="addtype" value="add_educationB"><input type="hidden" name="id" value="'+id+'">\
                                 <div class="row">\
                                     <div class="col-md-5">\
                                         <div class="form-group">\
                                             <label>Level</label>\
                                             <div class="controls">\
                                                 <select class="form-control border-input" name="level" value="" >\
                                                    <option Selected disabled value="" >-- select level --</option>\
                                                     <option>Elementary</option>\
                                                     <option>Secondary</option>\
                                                     <option>College</option>\
                                                     <option>Graduate Studies</option>\
                                                     <option>Vocational</option>\
                                                 </select>\
                                                 <span class="text-danger level_error"></span>\
                                             </div>\
                                         </div>\
                                     </div>\
                                     <div class="col-md-7">\
                                         <div class="form-group">\
                                             <label>Name Of School</label>\
                                             <div class="controls">\
                                                 <input type="text" name="nameschool" class="form-control" value="" placeholder="eg. Mahaplag National HighSchool-Upper" >\
                                                 <span class="text-danger nameschool_error"></span>\
                                             </div>\
                                         </div>\
                                     </div>\
                                 </div>\
                                 <div class="row">\
                                     <div class="col-md-8">\
                                         <div class="form-group">\
                                             <label>Basic Education/Degree/Course</label>\
                                             <div class="controls">\
                                                 <input type="text" name="degreecourse" class="form-control" value="" placeholder="eg. Bachelor of Science in Information Technology" >\
                                                 <span class="text-danger degreecourse_error"></span>\
                                             </div>\
                                         </div>\
                                     </div>\
                                     <div class="col-md-4">\
                                         <div class="form-group">\
                                             <label>Year Graduated</label>\
                                             <div class="controls">\
                                                 <input type="text" name="yeargraduated" class="form-control" value="" placeholder="eg. 2005">\
                                                 <span class="text-danger yeargraduated_error"></span>\
                                             </div>\
                                         </div>\
                                     </div>\
                                 </div>\
                                 <div class="row">\
                                     <div class="col-md-2">\
                                         <div class="form-group">\
                                             <label>From<br></label>\
                                             <div class="controls">\
                                                 <input type="text" name="from" class="form-control" value="" placeholder="eg. 2001">\
                                                 <span class="text-danger from_error"></span>\
                                             </div>\
                                         </div>\
                                     </div>\
                                     <div class="col-md-2">\
                                         <div class="form-group">\
                                             <label>To<br></label>\
                                             <div class="controls">\
                                                 <input type="text" name="to" class="form-control" value="" placeholder="eg. 2005">\
                                                 <span class="text-danger to_error"></span>\
                                             </div>\
                                         </div>\
                                     </div>\
                                     <div class="col-md-4">\
                                         <div class="form-group">\
                                             <label>Highest Level/Units Earned <span style="text-transform:lowercase">(if not graduated)</span></label>\
                                             <div class="controls">\
                                                 <input type="text" name="unitsearned" class="form-control" value="" placeholder="eg. Graduated">\
                                                 <span class="text-danger unitsearned_error"></span>\
                                             </div>\
                                         </div>\
                                     </div>\
                                     <div class="col-md-4">\
                                     <div class="form-group">\
                                         <label>Scholarship/Academic Honors Recieved</label>\
                                         <div class="controls">\
                                             <input type="text" name="academichonors" class="form-control" value="" placeholder="eg. Valedictorian">\
                                             <span class="text-danger academichonors_error"></span>\
                                         </div>\
                                     </div>\
                                 </div>\
                         </div><hr><div class="col-md-12"><fieldset class="form-group input-group-sm">\
                         <label for="basicInput">Attach File as Proof (IMAGE/PDF Format) </label>\
                         <input type="file" class="form-control" name="file"  accept=".pdf, image/*">\
                         <span class="text-danger file_error"></span>\
                         </fieldset>\</div>');
        }

        function AddDataCivilService(id) {
            $('#my-profile-div').html('<input type="hidden" name="addtype" value="add_civilService"><input type="hidden" name="id" value="'+id+'">\
            <div class="row">\
            <div class="col-md-7">\
                <div class="form-group">\
                    <label>Career Service</label>\
                    <div class="controls">\
                        <input type="text" name="careerservice" class="form-control" value="" placeholder="eg. Career Service - Professional">\
                        <span class="text-danger careerservice_error"></span>\
                    </div>\
                </div>\
            </div>\
            <div class="col-md-2">\
                <div class="form-group">\
                    <label>Rating</label>\
                    <div class="controls">\
                        <input type="text" name="rating" class="form-control" value="" placeholder="eg. 90.0">\
                        <span class="text-danger rating_error"></span>\
                    </div>\
                </div>\
            </div>\
            <div class="col-md-3">\
                <div class="form-group">\
                    <label>Date of Examination</label>\
                    <div class="controls">\
                        <input type="date" name="datexam" class="form-control" value="" >\
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
                    <input type="text" name="placexam" class="form-control" value="" placeholder="eg. Maasin, Southern Leyte">\
                    <span class="text-danger placexam_error"></span>\
                </div>\
            </div>\
        </div>\
        <div class="col-md-3">\
            <div class="form-group">\
                <label>License No.</label>\
                <div class="controls">\
                    <input type="text" name="licenseno" class="form-control" value="" placeholder="eg. 000001" >\
                    <span class="text-danger licenseno_error"></span>\
                </div>\
            </div>\
        </div>\
        <div class="col-md-3">\
            <div class="form-group">\
                <label>Date of Validity</label>\
                <div class="controls">\
                    <input type="date" name="datevalidity" class="form-control" value="" >\
                    <span class="text-danger datevalidity_error"></span>\
                </div>\
            </div>\
        </div>\
    </div><hr><div class="col-md-12"><fieldset class="form-group input-group-sm">\
            <label for="basicInput">Attach File as Proof (IMAGE/PDF Format) </label>\
            <input type="file" class="form-control" name="file"  accept=".pdf, image/*">\
            <span class="text-danger file_error"></span>\
            </fieldset>\</div>');
         }
         function AddDataLearningDevelopment(id) {
            $('#my-profile-div').html('<input type="hidden" name="addtype" value="add_learningDevelopment"><input type="hidden" name="id" value="'+id+'">\
            <div class="row">\
            <div class="col-md-6">\
                <div class="form-group">\
                    <label>Title Of Learning And Development</label>\
                    <div class="controls">\
                        <input type="text" name="titleld" class="form-control" value="">\
                        <span class="text-danger titleld_error"></span>\
                    </div>\
                </div>\
            </div>\
            <div class="col-md-3">\
                <div class="form-group">\
                    <label>Number of Hours</label>\
                    <div class="controls">\
                        <input type="text" name="numberhours" class="form-control" value="">\
                        <span class="text-danger numberhours_error"></span>\
                    </div>\
                </div>\
            </div>\
            <div class="col-md-3">\
                <div class="form-group">\
                    <label>Type</label>\
                    <div class="controls">\
                        <input type="text" name="type" class="form-control" value="" placeholder="eg. Technical skills development">\
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
                        <input type="date" name="from" class="form-control" value="">\
                        <span class="text-dangerfrom_error"></span>\
                    </div>\
                </div>\
            </div>\
            <div class="col-md-3">\
                <div class="form-group">\
                    <label>Date To:</label>\
                    <div class="controls">\
                        <input type="date" name="to" class="form-control" value="">\
                        <span class="text-danger to_error"></span>\
                    </div>\
                </div>\
            </div>\
            <div class="col-md-6">\
                <div class="form-group">\
                    <label>Conducted/Sponsored By:</label>\
                    <div class="controls">\
                        <input type="text" name="conducted" class="form-control" value="">\
                        <span class="text-danger naturework_error"></span>\
                    </div>\
                </div>\
            </div>\
        </div><hr><div class="col-md-12"><fieldset class="form-group input-group-sm">\
            <label for="basicInput">Attach File as Proof (IMAGE/PDF Format) </label>\
            <input type="file" class="form-control" name="file"  accept=".pdf, image/*">\
            <span class="text-danger file_error"></span>\
            </fieldset>\</div>');
         }
         
        
        function getDataCivilService(id,cs_id) {
            var csid = atob(cs_id);
             $.ajax({
                 type: 'POST',
                 url: '/my-profile/personalinfo',
                 data: { id: id },
                 dataType: 'json',
                 beforeSend:function(){
                     $('#my-profile-div').html('<i class="spinner-grow text-info"></i> Loading...');
                 },
                 success: function(response) {
                   
                   var found = false;
                     if(response.status === 200){
                     $.each(response.returnData.employee.data.eligibility , function (key, data){
                         if(data.id == csid){
                             found = true;
                         $('#my-profile-div').html('<input type="hidden" name="edittype" value="civilService"><input type="hidden" name="id" value="'+id+'"><input type="hidden" name="csid" value="'+btoa(data.id)+'">\
                         <div class="row">\
                         <div class="col-md-7">\
                             <div class="form-group">\
                                 <label>Career Service</label>\
                                 <div class="controls">\
                                     <input type="text" name="careerservice" class="form-control" value="'+(data.EligibilityName?data.EligibilityName:'')+'" placeholder="eg. Career Service - Professional" >\
                                     <span class="text-danger careerservice_error"></span>\
                                 </div>\
                             </div>\
                         </div>\
                         <div class="col-md-2">\
                             <div class="form-group">\
                                 <label>Rating</label>\
                                 <div class="controls">\
                                     <input type="text" name="rating" class="form-control" value="'+(data.Rating?data.Rating:'')+'" placeholder="eg. 90.0">\
                                     <span class="text-danger rating_error"></span>\
                                 </div>\
                             </div>\
                         </div>\
                         <div class="col-md-3">\
                             <div class="form-group">\
                                 <label>Date of Examination</label>\
                                 <div class="controls">\
                                     <input type="date" name="datexam" class="form-control" value="'+(data.DateOfExam?data.DateOfExam:'')+'" >\
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
                                 <input type="text" name="placexam" class="form-control" value="'+(data.PlaceOfExam?data.PlaceOfExam:'')+'" placeholder="eg. Maasin, Southern Leyte">\
                                 <span class="text-danger placexam_error"></span>\
                             </div>\
                         </div>\
                     </div>\
                     <div class="col-md-3">\
                         <div class="form-group">\
                             <label>License No.</label>\
                             <div class="controls">\
                                 <input type="text" name="licenseno" class="form-control" value="'+(data.LicenseNumber?data.LicenseNumber:'')+'" placeholder="eg. 000001">\
                                 <span class="text-danger licenseno_error"></span>\
                             </div>\
                         </div>\
                     </div>\
                     <div class="col-md-3">\
                         <div class="form-group">\
                             <label>Date of Validity</label>\
                             <div class="controls">\
                                 <input type="date" name="datevalidity" class="form-control" value="'+(data.DateOfRelease?data.DateOfRelease:'')+'" >\
                                 <span class="text-danger datevalidity_error"></span>\
                             </div>\
                         </div>\
                     </div>\
                 </div><hr><div class="col-md-12"><fieldset class="form-group input-group-sm">\
                         <label for="basicInput">Attach File as Proof (IMAGE/PDF Format) </label>\
                         <input type="file" class="form-control" name="file"  accept=".pdf, image/*">\
                         <span class="text-danger file_error"></span>\
                         </fieldset>\</div>');
                         }
                     });
                     if(!found){
                         toastr.error('Server Error! Try Again Later!') 
                         $('#view-Modal').modal('hide');
                     }
                     }else{
                         toastr.error('Server Error! Try Again Later')
                         $('#view-Modal').modal('hide'); 
                     }
                 },
                 error: function() {
                     toastr.error('Server Error')
                 }
             });
         }
        function getDataVoluntaryWork(id,vw_id) {
            var vwid = atob(vw_id);
             $.ajax({
                 type: 'POST',
                 url: '/my-profile/personalinfo',
                 data: { id: id },
                 dataType: 'json',
                 beforeSend:function(){
                     $('#my-profile-div').html('<i class="spinner-grow text-info"></i> Loading...');
                 },
                 success: function(response) {
                   
                   var found = false;
                     if(response.status === 200){
                     $.each(response.returnData.employee.data.voluntarywork , function (key, data){
                         if(data.id == vwid){
                             found = true;
                         $('#my-profile-div').html('<input type="hidden" name="edittype" value="voluntaryWork"><input type="hidden" name="id" value="'+id+'"><input type="hidden" name="vwid" value="'+btoa(data.id)+'">\
                         <div class="row">\
                         <div class="col-md-9">\
                             <div class="form-group">\
                                 <label>Name & Address of Organization</label>\
                                 <div class="controls">\
                                     <input type="text" name="nameaddress" class="form-control" value="'+data.NameAddressOrganization+'">\
                                     <span class="text-danger nameaddress_error"></span>\
                                 </div>\
                             </div>\
                         </div>\
                         <div class="col-md-3">\
                             <div class="form-group">\
                                 <label>Number of Hours</label>\
                                 <div class="controls">\
                                     <input type="text" name="numberhours" class="form-control" value="'+data.NumberHours+'">\
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
                                     <input type="text" name="from" class="form-control" value="'+data.DateFrom+'">\
                                     <span class="text-danger from_error"></span>\
                                 </div>\
                             </div>\
                         </div>\
                         <div class="col-md-3">\
                             <div class="form-group">\
                                 <label>Date To:</label>\
                                 <div class="controls">\
                                     <input type="text" name="to" class="form-control" value="'+data.DateTo+'">\
                                     <span class="text-danger to_error"></span>\
                                 </div>\
                             </div>\
                         </div>\
                         <div class="col-md-6">\
                             <div class="form-group">\
                                 <label>Position / Nature of Work</label>\
                                 <div class="controls">\
                                     <input type="text" name="naturework" class="form-control" value="'+data.Position+'">\
                                     <span class="text-danger naturework_error"></span>\
                                 </div>\
                             </div>\
                         </div>\
                     </div><hr><div class="col-md-12"><fieldset class="form-group input-group-sm">\
                         <label for="basicInput">Attach File as Proof (IMAGE/PDF Format) </label>\
                         <input type="file" class="form-control" name="file"  accept=".pdf, image/*">\
                         <span class="text-danger file_error"></span>\
                         </fieldset>\</div>');
                         }
                     });
                     if(!found){
                         toastr.error('Server Error! Try Again Later!') 
                         $('#view-Modal').modal('hide');
                     }
                     }else{
                         toastr.error('Server Error! Try Again Later')
                         $('#view-Modal').modal('hide'); 
                     }
                 },
                 error: function() {
                     toastr.error('Server Error')
                 }
             });
         }
        
         function  getDataLearningDevelopment(id,ld_id) {
            var ldid = atob(ld_id);
             $.ajax({
                 type: 'POST',
                 url: '/my-profile/personalinfo',
                 data: { id: id },
                 dataType: 'json',
                 beforeSend:function(){
                     $('#my-profile-div').html('<i class="spinner-grow text-info"></i> Loading...');
                 },
                 success: function(response) {
                  
                   var found = false;
                     if(response.status === 200){
                     $.each(response.returnData.employee.data.learningdevelopment , function (key, data){
                         if(data.id == ldid){
                             found = true;
                        $('#my-profile-div').html('<input type="hidden" name="edittype" value="learningDevelopment"><input type="hidden" name="id" value="'+id+'"><input type="hidden" name="ldid" value="'+btoa(data.id)+'">\
                         <div class="row">\
                        <div class="col-md-6">\
                            <div class="form-group">\
                                <label>Title Of Learning And Development</label>\
                                <div class="controls">\
                                    <input type="text" name="titleld" class="form-control" value="'+data.TiltleLearningDev+'">\
                                    <span class="text-danger titleld_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-3">\
                            <div class="form-group">\
                                <label>Number of Hours</label>\
                                <div class="controls">\
                                    <input type="text" name="numberhours" class="form-control" value="'+data.NumberHours+'">\
                                    <span class="text-danger numberhours_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-3">\
                            <div class="form-group">\
                                <label>Type</label>\
                                <div class="controls">\
                                    <input type="text" name="type" class="form-control" value="'+data.Type+'" placeholder="eg. Technical skills development">\
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
                                    <input type="date" name="from" class="form-control" value="'+data.DateFrom+'">\
                                    <span class="text-dangerfrom_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-3">\
                            <div class="form-group">\
                                <label>Date To:</label>\
                                <div class="controls">\
                                    <input type="date" name="to" class="form-control" value="'+data.DateTo+'">\
                                    <span class="text-danger to_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-6">\
                            <div class="form-group">\
                                <label>Conducted/Sponsored By:</label>\
                                <div class="controls">\
                                    <input type="text" name="conducted" class="form-control" value="'+data.ConductedBy+'">\
                                    <span class="text-danger naturework_error"></span>\
                                </div>\
                            </div>\
                        </div>\
                    </div><hr><div class="col-md-12"><fieldset class="form-group input-group-sm">\
                         <label for="basicInput">Attach File as Proof (IMAGE/PDF Format) </label>\
                         <input type="file" class="form-control" name="file"  accept=".pdf, image/*">\
                         <span class="text-danger file_error"></span>\
                         </fieldset>\</div>');
                         }
                     });
                     if(!found){
                         toastr.error('Server Error! Try Again Later!') 
                         $('#view-Modal').modal('hide');
                     }
                     }else{
                         toastr.error('Server Error! Try Again Later')
                         $('#view-Modal').modal('hide'); 
                     }
                 },
                 error: function() {
                     toastr.error('Server Error')
                 }
             });
         }

         function AddDataVoluntaryWork(id) {
            $('#my-profile-div').html('<input type="hidden" name="addtype" value="add_voluntaryWork"><input type="hidden" name="id" value="'+id+'">\
            <div class="row">\
            <div class="col-md-9">\
                <div class="form-group">\
                    <label>Name & Address of Organization</label>\
                    <div class="controls">\
                        <input type="text" name="nameaddress" class="form-control" value="">\
                        <span class="text-danger nameaddress_error"></span>\
                    </div>\
                </div>\
            </div>\
            <div class="col-md-3">\
                <div class="form-group">\
                    <label>Number of Hours</label>\
                    <div class="controls">\
                        <input type="text" name="numberhours" class="form-control" value="">\
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
                        <input type="text" name="from" class="form-control" value="">\
                        <span class="text-danger from_error"></span>\
                    </div>\
                </div>\
            </div>\
            <div class="col-md-3">\
                <div class="form-group">\
                    <label>Date To:</label>\
                    <div class="controls">\
                        <input type="text" name="to" class="form-control" value="">\
                        <span class="text-danger to_error"></span>\
                    </div>\
                </div>\
            </div>\
            <div class="col-md-6">\
                <div class="form-group">\
                    <label>Position / Nature of Work</label>\
                    <div class="controls">\
                        <input type="text" name="naturework" class="form-control" value="">\
                        <span class="text-danger naturework_error"></span>\
                    </div>\
                </div>\
            </div>\
        </div><hr><div class="col-md-12"><fieldset class="form-group input-group-sm">\
            <label for="basicInput">Attach File as Proof (IMAGE/PDF Format) </label>\
            <input type="file" class="form-control" name="file"  accept=".pdf, image/*">\
            <span class="text-danger file_error"></span>\
            </fieldset>\</div>');
         }
         
    


});
