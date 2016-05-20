$(document).ready(function() {
// Initial formatting of layout
$( "div" ).remove("#sideNavBox");
$( "div" ).remove("#s4-titlerow");
//$('#s4-ribbonrow').remove();
$('div').find(".rac-top-navigation").css('margin-top','15px');
$( "#contentBox" ).css("margin-left","0px");
$( ".ms-rte-layoutszone-inner" ).find('p').remove();

var tabs = $('#tabs-main').tabs();
var tabs2 = $('#main-tabs-patrol').tabs();
var tabs3 = $('#main-tabs-patrol-new').tabs();
var tabs4 = $('#main-tabs-vehicle').tabs();
var accesslevel = 0;
var classname;

// Show Group By Tab & Apply DataTable / Hide all rows except group1
var grouparray = [];
var tableDataArray = [];
var vtableDataArray = [];
var element_array = [];
var velement_array = []
var masterdata_array = [['ag-id','AG_ID'],['cell-number','CellNumber']];
var access_array = [['new-patrol-user','3193'],['new-patrol-manager','3192'],['new-fleet-manager','3191'],['new-read-only','2275'],['new-administrator','2273']];

var finalItemString = null;
var finalItemString2 = null;
var finalItemStringVehicle = null;


var i = 0;
var IsAdmin = null;
var IsPatrolSUser = null;
var IsPatrolSManager = null;
var IsFleetManager = null;
var IsReadOnly = null;
var table;
var table_Assign;




//SP.SOD.executeFunc('sp.js','SP.ClientContext',validateUserGroup);

ExecuteOrDelayUntilScriptLoaded(validateUserGroup,"sp.js");

function validateUserGroup() {
    
    // get web object from context
    clientcontext = SP.ClientContext.get_current();
    //get all groups from clientcontext
    var groupCollection = clientcontext.get_web().get_siteGroups();
    //get group using groupid
    group_a = groupCollection.getById(2273); //The ID of the SharePoint user group PIDB Owners
    group_b = groupCollection.getById(2274); //The ID of the SharePoint user group PIDB Members
    group_c = groupCollection.getById(2275); //The ID of the SharePoint user group PIDB Visitors
    group_d = groupCollection.getById(3191); //The ID of the SharePoint user group PIDB Fleet Managers
    group_e = groupCollection.getById(3192); //The ID of the SharePoint user group PIDB Patrol Support Managers 
    group_f = groupCollection.getById(3193); //The ID of the SharePoint user group PIDB Patrol Support Users

    
    //get users from this group
    groupUsers_a = group_a.get_users();
    groupUsers_b = group_b.get_users();
    groupUsers_c = group_c.get_users();
    groupUsers_d = group_d.get_users();
    groupUsers_e = group_e.get_users();
    groupUsers_f = group_f.get_users();
    
    
    //load groupusers & group
    clientcontext.load(group_a);
    clientcontext.load(group_b);
    clientcontext.load(group_c);
    clientcontext.load(group_d);
    clientcontext.load(group_e);
    clientcontext.load(group_f);
    
    clientcontext.load(groupUsers_a);
    clientcontext.load(groupUsers_b);
    clientcontext.load(groupUsers_c);
    clientcontext.load(groupUsers_d);
    clientcontext.load(groupUsers_e);
    clientcontext.load(groupUsers_f);
    
    //get currently logged user & load in clientcontext
    currentUsergroup = clientcontext.get_web().get_currentUser();
    clientcontext.load(currentUsergroup);
    //execute function to extract all users from group
    clientcontext.executeQueryAsync(onUserFound,onUserNotFound);
    //console.log("Group function executed");
    
}

function onUserFound(sender, args) {
                                if (groupUsers_a.get_count() > 0)
                                {
                                for (var i=0; i < groupUsers_a.get_count() ; i++)
                                {
grouparray.push(["Owners",groupUsers_a.itemAt(i).get_loginName(),groupUsers_a.itemAt(i).get_title(),groupUsers_a.itemAt(i).get_email()]);
                                }
                                }
        
                                if (groupUsers_b.get_count() > 0)
                                {
                                for (var i=0; i < groupUsers_b.get_count() ; i++)
                                {
grouparray.push(["Members",groupUsers_b.itemAt(i).get_loginName(),groupUsers_b.itemAt(i).get_title(),groupUsers_b.itemAt(i).get_email()]);
                                }
                                }

                                if (groupUsers_c.get_count() > 0)
                                {
                                for (var i=0; i < groupUsers_c.get_count() ; i++)
                                {
grouparray.push(["Visitors",groupUsers_c.itemAt(i).get_loginName(),groupUsers_c.itemAt(i).get_title(),groupUsers_c.itemAt(i).get_email()]);
                                }
                                }
                                
                                if (groupUsers_d.get_count() > 0)
                                {
                                for (var i=0; i < groupUsers_d.get_count() ; i++)
                                {
grouparray.push(["Fleet Managers",groupUsers_d.itemAt(i).get_loginName(),groupUsers_d.itemAt(i).get_title(),groupUsers_d.itemAt(i).get_email()]);
                                }
                                }

                                if (groupUsers_e.get_count() > 0)
                                {
                                for (var i=0; i < groupUsers_e.get_count() ; i++)
                                {
grouparray.push(["Patrol Support Managers",groupUsers_e.itemAt(i).get_loginName(),groupUsers_e.itemAt(i).get_title(),groupUsers_e.itemAt(i).get_email()]);
                                }
                                }
                                
                                if (groupUsers_f.get_count() > 0)
                                {
                                for (var i=0; i < groupUsers_f.get_count() ; i++)
                                {
grouparray.push(["Patrol Support Users",groupUsers_f.itemAt(i).get_loginName(),groupUsers_f.itemAt(i).get_title(),groupUsers_f.itemAt(i).get_email()]);
                                }
                                } 
    
// Validate user exists in PIDB group and activate access level else redirect to InteRACt
    for (var j=0;j<grouparray.length;j++)
    {
                                if (grouparray[j][1] == currentUsergroup.get_loginName() && grouparray[j][0] == "Owners")
                                {
                                    //Activate access level for group 2273
                                    console.log("Activating access level for owner");
                                    accesslevel = 1;
                                    IsAdmin = true;
                                    break;
                                }
                else {
                                if (grouparray[j][1] == currentUsergroup.get_loginName() && grouparray[j][0] == "Members")
                                {
                                //Activate access level
                                console.log("Activating access level for Member");
                                accesslevel = 2;
                                IsMember=true;
                                break;
                                }
                else {
                                if (grouparray[j][1] == currentUsergroup.get_loginName() && grouparray[j][0] == "Visitors")
                                {
                                    //Activate access level for group 2275
                                    console.log("Activating access level for Visitor");
                                    accesslevel = 3;
                                    IsReadOnly = true;
                                    break;
                                }
                else {
                                if (grouparray[j][1] == currentUsergroup.get_loginName() && grouparray[j][0] == "Fleet Managers")
                                {
                                    //Activate access level for group 3091
                                    console.log("Activating access level for Fleet Managers");
                                    accesslevel = 4;
                                    IsFleetManager = true;
                                    break;
                                }
                else {
                                if (grouparray[j][1] == currentUsergroup.get_loginName() && grouparray[j][0] == "Patrol Support Managers")
                                {
                                    //Activate access level for group 3092
                                    console.log("Activating access level for Patrol Support Managers");
                                    accesslevel = 5;
                                    IsPatrolSManager = true;
                                    break;
                                }
                else { 
                                if (grouparray[j][1] == currentUsergroup.get_loginName() && grouparray[j][0] == "Patrol Support Users")
                                {
                                    //Activate access level for group 3093
                                    console.log("Activating access level for Patrol Support Users");
                                    accesslevel = 6;
                                    IsPatrolSUser = true;
                                    break;
                                }    
                                }
                                }
                                }
                                }
                                } 
    } 
    //console.log(currentUsergroup.get_loginName());
    
                // Redirect him to interact
                if (accesslevel == 0 )
                {
                alert("You are not authorized to view this page. Please contact service desk for PIDB Access");
                url="https://racfreedom.sharepoint.com";
                //$(location).attr('href', url);
               }
}

function onUserNotFound(sender, args) {

/*
                alert("You are not authorized to view this page. Please contact service desk for PIDB Access");
                // Redirect him to interact
                url="https://racfreedom.sharepoint.com";
                $(location).attr('href', url);

*/
console.log('Failed: \n' + args.get_message() + '\n' + args.get_stackTrace());

}

//console.log(accesslevel);

// PIDB Menu


$('.menu-items').on('click',function(){
    optionid = $(this).attr('id');

    el = document.getElementById("pidb_overlay");
    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";

    if (optionid == 'add-patrol' && ( IsPatrolSManager || IsAdmin ))
    {
        //$(classname).toggle();
        $('#main-tabs-patrol-new').find('input.locked').prop('disabled',true);
        $('#main-tabs-patrol-new').tabs("option", "active", 0);
        /*$('#patrol-detail-new-basic #patrol-job-role').val('');
        $('#patrol-detail-new-basic #patrol-cell-number').val('');
        $('#patrol-detail-new-basic #patrol-agreement-type').val('');
        $('#patrol-detail-new-basic #patrol-regional-manager').val('');
        $('#patrol-detail-new-basic #patrol-service-delivery-manager').val('');
        $('#patrol-detail-new-basic #patrol-team-manager').val('');*/
        $('#patrol-detail-new-basic').find('input').val('');
        $('#patrol-detail-new-basic').find('select').val('');
        $('#patrol-detail-new-personal').find('input[type="text"]').val('');
        $('#patrol-detail-new-personal').find('input[type="date"]').val('');
        $('#patrol-detail-new-personal').find('select').val('');
        $('.sdmonly').css('visibility','hidden');
        $('#patrol-detail-new-basic').find('tr').css('visibility','visible');
        $('#main-tabs-patrol-new').tabs("option","disabled",[1]);
        $('#patrol-form-new-personal').prop('disabled',true);
        $('#patrol-detail-new').toggle();
        
    }
    else
    {
        if (optionid == 'add-vehicle' && ( IsFleetManager || IsAdmin ))
        {
            //$(classname).toggle();
            $('#add-new-vehicle').find("input[type='text']").val('');     //newest
            $('#add-new-vehicle').find("input[type='date']").val('');    //newest
            $('#add-new-vehicle').find('textarea').val('');   //newest
            $('#new-vt-trailer-yn-no').prop('checked',true);     //newest
            $('#add-new-vehicle').find('select').val('');
            $('#add-new-vehicle-submit').val('Submit'); // again add value in buttons
            $('#add-new-vehicle-cancel').val('Cancel');
            $('#add-new-vehicle').toggle();
            $('.other_vehicle_location').hide();
            $('.other_vehicle_type').hide();
            $('.other_trailer_type').hide();
            $('.other_trailer_age').hide();
            $('.other_term_reason').hide();
        }       
        else
        {
        if (( optionid == 'new-patrol-user' )||
            ( optionid == 'new-patrol-manager' ) ||
            ( optionid == 'new-fleet-manager') ||
            ( optionid == 'new-read-only' ) ||
            ( optionid == 'new-administrator') && ( IsAdmin ))
        {
            console.log("Access Management window");
            
            /*if (optionid == "new-patrol-user") {
                window.open("https://racfreedom.sharepoint.com/teams/Ops/PIDB/_layouts/15/people.aspx?MembershipGroupId=3193","access");
                el = document.getElementById("pidb_overlay");
                el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
                            }*/
            
            $.each(access_array,function(index,item){
                        if (optionid == item[0]) {
                            var url = "https://racfreedom.sharepoint.com/teams/Ops/PIDB/_layouts/15/people.aspx?MembershipGroupId="+item[1];
                            window.open(url,"masterdata");
                            el = document.getElementById("pidb_overlay");
                            el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";                          
                        }
                    });
            
            
        }
        else {
                    if(( optionid == "ag-id" ||
                         optionid == "cell-number" ||
                         optionid == "cell-type" ||
                         optionid == "contract-type" ||
                         optionid == "dispatch-group" ||
                         optionid == "job-role" ||
                         optionid == "patrol-manager" ||
                         optionid == "rdt-crt-type" ||
                         optionid == "region" ||
                         optionid == "termination-reason" ||
                         optionid == "vehicle-location" ||
                         optionid == "vehicle-status" ||
                         optionid == "region" ||
                         optionid == "vehicle-termination-reason" ||
                         optionid == "vehicle-type") && (IsAdmin) ) {
                
                $.each(masterdata_array,function(index,item){
                        if (optionid == item[0]) {
                            var url = "https://racfreedom.sharepoint.com/teams/Ops/PIDB/Lists/MasterData/AllItems.aspx#InplviewHash6c34507a-bca6-4308-b984-f0eca7f9ff3f=FilterField1%3DLinkTitle-FilterValue1%3D"+item[1];
                            window.open(url,"masterdata");
                            el = document.getElementById("pidb_overlay");
                            el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";                          
                        }
                    });
                
                
                }    
        
        else {
            //$(classname).toggle();
            console.log("Not authorized to perform this operation");
            $("<div id='errorbox-notauthorised'><div id='closebtn' class='ui-icon ui-icon-close'></div><br>You are not authorized to add new patrol information</div>").appendTo($('body'));
            $('#closebtn').on('click',function(){ $(document).find('#errorbox-notauthorised').remove();
            el = document.getElementById("pidb_overlay");
            el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";                          
            });
        
                }        
            }
        }
    }
});

// PIDB Menu ends

//Esc Key detect
    screens = ["patrol-detail-view","patrol-detail-new","add-new-vehicle","vehicle-detail-view","quick-vehicle-detail-view"];
$(document).on('keyup',function(key){

    if(key.keyCode == 27) {
        $.each(screens,function(index,value){
            
            if ($('#'+value).css('display') == 'block'){
                el = document.getElementById("pidb_overlay");
                el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
                $('#'+value).toggle();
                $('#patrol-form-update').prop('disabled',true);
                $('#patrol-form-edit').prop('disabled',false);
                $('.errorbox-top').each(function(){$(this).remove();}); // remove all errorbox
                $('.errorbox-left').each(function(){$(this).remove();}); // remove all errorbox
            } 
        });

    }

});

$('#patrol-detail-new-basic #patrol-service-delivery-manager-area2, #patrol-detail-view-basic #patrol-service-delivery-manager-area2').on('change',function(){
    var new_sdm_area  = $(this).val();
    if (new_sdm_area != "" ) {
                $('#patrol-detail-new-basic #errorbox-patrol-service-delivery-manager-area2').remove(); // remove errorbox if available
                $('#patrol-detail-view-basic #errorbox-patrol-service-delivery-manager-area2').remove(); // remove errorbox if available
    }
});

$('#patrol-detail-new-basic #patrol-ag-id').on('change',function(){
    var new_ag_id  = $(this).val();
    if (new_ag_id != "" ) {
                $('#patrol-detail-new-basic #errorbox-patrol-ag-id').remove(); // remove errorbox if available
    }
});

$('#patrol-detail-view-basic #patrol-ag-id').on('change',function(){
    var new_ag_id  = $(this).val();
    if (new_ag_id != "" ) {
                $('#patrol-detail-view-basic #errorbox-patrol-ag-id').remove(); // remove errorbox if available
    }
});

$('#patrol-detail-new-personal #patrol-start-date').on('change',function(){
    var start_date  = $(this).val();
    if (start_date != "" || start_date != null) {
                $('#patrol-detail-new-personal #errorbox-patrol-start-date').remove(); // remove errorbox if available
    }
});

$('#patrol-detail-view-personal #patrol-start-date').on('change',function(){
    var start_date  = $(this).val();
    if (start_date != "" || start_date != null) {
                $('#patrol-detail-view-personal #errorbox-patrol-start-date').remove(); // remove errorbox if available
    }
});

$('#patrol-detail-new-personal #patrol-termination-date').on('change',function(){
    var curr_terminationdate  = $('#patrol-detail-new-personal #patrol-termination-date').val();
    
    if ( curr_terminationdate != "" )
    {
        $('#patrol-detail-new-personal #patrol-termination-reason').addClass('required');
    }
    else
        {
            if ( $('#patrol-detail-new-personal #patrol-termination-reason').hasClass('required') )
            {
                $('#patrol-detail-new-personal #errorbox-patrol-termination-reason').remove();
                $('#patrol-detail-new-personal #patrol-termination-reason').removeClass('required');
                
            }
        }
});

$('#patrol-detail-view-personal #patrol-termination-date').on('change',function(){
    var curr_terminationdate  = $('#patrol-detail-view-personal #patrol-termination-date').val();
    if (curr_terminationdate != "") {
        $('#patrol-detail-view-personal #errorbox-patrol-termination-date').remove(); // remove errorbox if available
        $('#patrol-detail-view-personal #patrol-termination-reason').addClass('required');
    }else {
        if ($('#patrol-detail-view-personal #patrol-termination-reason').hasClass('required')) {
            $('#patrol-detail-view-personal #patrol-termination-reason').removeClass('required');
            $('#patrol-detail-view-personal #errorbox-patrol-termination-reason').remove();
        }
    }
});

//,'#patrol-detail-view-basic #patrol-termination-date'

$('#patrol-detail-new-basic input').on('keyup',function(){
        inputid = $(this).attr('id');
        if (inputid == "patrol-forename"||inputid == "patrol-lastname")
        {
    $('#patrol-detail-new-personal #patrol-full-name').val($('#patrol-detail-new-basic #patrol-forename').val()+' '+$('#patrol-detail-new-basic #patrol-lastname').val());
        }else {
            if (inputid == "patrol-call-sign" || inputid == "patrol-payroll-no") {
                $('#patrol-detail-new-personal #'+inputid).val($(this).val());
            }
        }
        
        $('#patrol-form-new-personal').prop('disabled',false);
        
        });

$('#patrol-detail-view-basic input').on('keyup',function(){
        inputid = $(this).attr('id');
        if (inputid == "patrol-forename"||inputid == "patrol-lastname"||inputid == "patrol-call-sign" || inputid == "patrol-payroll-no")
        {
        $('#patrol-detail-view-personal #'+inputid).val($(this).val());
        }});

$('#patrol-detail-view-basic #patrol-agreement-type').on('change',function(){
    if ($(this).val().length > 0) {
    $('#patrol-detail-view-basic #errorbox-patrol-agreement-type').remove();
    }   
    });

$('#patrol-detail-new-basic #patrol-agreement-type').on('change',function(){
    if ($(this).val().length > 0) {
    $('#patrol-detail-new-basic #errorbox-patrol-agreement-type').remove();
    }   
    });

var role_matrix = [
                ["Regional Operations Manager",
                    "patrol-regional-manager",
                    "patrol-call-sign",
                    "patrol-cell-number",
                    "patrol-region",
                    "patrol-cluster",
                    "patrol-resource-planner",
                    "patrol-access-to-motorcycle-yes",
                    "patrol-access-to-motorcycle-no",
                    "patrol-light-duties-yes",
                    "patrol-light-duties-no",
                    "patrol-regional-manager",
                    "patrol-regional-manager-cost-center",
                    "patrol-regional-manager-emailid",
                    "patrol-service-delivery-manager",
                    "patrol-service-delivery-manager-area",
                    "patrol-team-manager",
                    "patrol-cell-type",
                    "patrol-dispatch-group",
                    "patrol-agreement-type",
                    "patrol-service-delivery-manager-cost-center",
                    "patrol-service-delivery-manager-emailid",
                    "patrol-team-manager-cost-center",
                    "patrol-team-manager-emailid"
                ],
                ["Service Delivery Manager",
                    "patrol-service-delivery-manager",
                    "patrol-call-sign",
                    "patrol-cell-number",
                    "patrol-region",
                    "patrol-cluster",
                    "patrol-resource-planner",
                    "patrol-access-to-motorcycle-yes",
                    "patrol-access-to-motorcycle-no",
                    "patrol-light-duties-yes",
                    "patrol-light-duties-no",
                    "patrol-service-delivery-manager",
                    "patrol-service-delivery-manager-cost-center",
                    "patrol-service-delivery-manager-emailid",
                    "patrol-service-delivery-manager-area",
                    "patrol-team-manager",
                    "patrol-cell-type",
                    "patrol-dispatch-group",
                    "patrol-agreement-type"
                ],
                ["Patrol Team Manager",
                    "patrol-team-manager",
                    "patrol-team-manager",
                    "patrol-team-manager-cost-center",
                    "patrol-team-manager-emailid"
                ]
            ];


$('#patrol-detail-new-basic #patrol-job-role').on('change',function(){
                var selection = $('#patrol-detail-new-basic #patrol-job-role option:selected').val();
                $.each(role_matrix, function(index, value) {
                    if (selection == role_matrix[index][0]) {
                        $('#patrol-detail-new-basic').find('tr').css('visibility','visible');
                        $('#patrol-detail-new-basic').find('tr.separator').css('visibility','visible');
                        $.each(value, function(index1, value1) {
                            var elementName = role_matrix[index][index1];
                            $('#patrol-detail-new-basic #'+elementName).closest('tr').css('visibility','hidden');
                            $('#patrol-detail-new-basic #errorbox-'+elementName).remove();
                            $('#patrol-detail-new-basic').find('tr.separator').css('visibility','hidden');
                        });
                        return false;
                    }else {
                        $('#patrol-detail-new-basic').find('tr').css('visibility','visible');
                        $('#patrol-detail-new-basic').find('tr.separator').css('visibility','visible');
                    }
                });
                if (selection == "Regional Operations Manager" || selection == "Service Delivery Manager") {
                    $('#patrol-detail-new-personal #patrol-call-sign').closest('td').css('visibility','hidden');
                    $("#patrol-detail-new-personal td:eq( 7 )").css('visibility','hidden'); // simple hack to hide call sign
                }else{
                    $('#patrol-detail-new-personal #patrol-call-sign').closest('td').css('visibility','visible');
                    $("#patrol-detail-new-personal td:eq( 7 )").css('visibility','visible'); // simple hack to hide call sign
                }
                if (selection == "Service Delivery Manager") {
                $('.sdmonly').css('visibility','visible');
                }else {
                    $('.sdmonly').css('visibility','hidden');
                    $('#errorbox-patrol-service-delivery-manager-area2').remove();
                }
            });

$('#patrol-detail-view-basic #patrol-job-role').on('change',function(){
                var selection = $('#patrol-detail-view-basic #patrol-job-role option:selected').val();
                $.each(role_matrix, function(index, value) {
                    if (selection == role_matrix[index][0]) {
                        $('#patrol-detail-view-basic').find('tr').css('visibility','visible');
                        $('#patrol-detail-view-basic').find('tr.separator').css('visibility','visible');
                        $.each(value, function(index1, value1) {
                            var elementName = role_matrix[index][index1];
                            $('#patrol-detail-view-basic #'+elementName).closest('tr').css('visibility','hidden');
                            $('#patrol-detail-view-basic #errorbox-'+elementName).remove();
                            $('#patrol-detail-view-basic').find('tr.separator').css('visibility','hidden');
                        });
                        return false;
                    }else {
                        $('#patrol-detail-view-basic').find('tr').css('visibility','visible');
                        $('#patrol-detail-view-basic').find('tr.separator').css('visibility','visible');
                    }
                });
                if (selection == "Regional Operations Manager" || selection == "Service Delivery Manager") {
                    $('#patrol-detail-view-personal #patrol-call-sign').closest('td').css('visibility','hidden');
                    $("#patrol-detail-view-personal td:eq( 7 )").css('visibility','hidden'); // simple hack to hide call sign
                    
                }else{
                    $('#patrol-detail-view-personal #patrol-call-sign').closest('td').css('visibility','visible');
                    $("#patrol-detail-view-personal td:eq( 7 )").css('visibility','visible'); // simple hack to hide call sign
                }
                if (selection == "Service Delivery Manager") {
                $('.sdmonly').css('visibility','visible');
                }else {
                    $('.sdmonly').css('visibility','hidden');
                    $('#errorbox-patrol-service-delivery-manager-area2').remove();
                }
            });            
            
            
            
// Views available within Vehicle Table and onChange behaviour

$('#vehicle_drpdwn').on('change',function(){
    var choice = $("#vehicle_drpdwn option:selected").attr("id");
    if (choice == "1" )
    {

        var href = $('#tabs-main').find('a[id="vehicle_region"]').attr('href');
        var p= $('#tabs-main').find('a[id="vehicle_region"]').attr('id');
    
        if (p != null) {
        $('#tabs-main').find('li a').each(function(i,j)
                                        {
                                            aid = $(this).attr('id');
                                                if (p == aid)
                                                {
                                                    $("#tabs-main").tabs("refresh");
                                                    $("#tabs-main").tabs("option", "active", i);
                                                }
                                        });
                        }       
                        else
                        {
                            var num_tabs = $("#tabs-main ul li").length + 1;
                            //console.log(num_tabs);
                            var li = "<li class='ui-state-default ui-corner-top'><a id='vehicle_region' href='#tabs-main-vehicle-region" + num_tabs + "'>Group Vehicle By Region</a><span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
                            tabs.find( ".ui-tabs-nav" ).append( li );
                            // Load waiting logo
                            tabs.append( "<div id='tabs-main-vehicle-region"+ num_tabs +"'><div id='groupbytableV1'></div></div>" );
                            tabs.tabs( "refresh" ).tabs({ active:num_tabs - 1});
                            $('#groupbytableV1').html("<center><img class='loading' src='/teams/Ops/PIDB/Shared Documents/images/pidb-loading.gif'></img></center>");
                            setTimeout(loadtableV1,2000);
                        }
    }
else
if(choice == "2" )
    {

var href = $('#tabs-main').find('a[id="vehicle_type"]').attr('href');
var p= $('#tabs-main').find('a[id="vehicle_type"]').attr('id');

        if (p != null){
        $('#tabs-main').find('li a').each(function(i,j)
                                                {
                                                        aid = $(this).attr('id');
                                                
                                                        if (p == aid)
                                                        {
                                                            $("#tabs-main").tabs("refresh");
                                                            $("#tabs-main").tabs("option", "active", i);
                                                        }
                                                });
                       }        
                        else
                        {      
                            var num_tabs = $("#tabs-main ul li").length + 1;
                            //console.log(num_tabs);
                            var li = "<li class='ui-state-default ui-corner-top'><a id='vehicle_type' href='#tabs-main-vehicle-type" + num_tabs + "'>Group By Vehicle Type</a><span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
                            tabs.find( ".ui-tabs-nav" ).append( li );
                            // Load waiting logo
                            tabs.append( "<div id='tabs-main-vehicle-type"+ num_tabs +"'><div id='groupbytableV2'></div></div>" );
                            tabs.tabs( "refresh" ).tabs({ active:num_tabs - 1});
                            $('#groupbytableV2').html("<center><img class='loading' src='/teams/Ops/PIDB/Shared Documents/images/pidb-loading.gif'></img></center>");
                            setTimeout(loadtableV2,2000);
                        }
    } 
    
//new code
//else for ActiveVehicles
        else if(choice == "3" )
        {      
                        var href = $('#tabs-main').find('a[id="ActiveVehicles"]').attr('href');
                        var p= $('#tabs-main').find('a[id="ActiveVehicles"]').attr('id');
                                if (p != null)
                                {
                                        $('#tabs-main').find('li a').each(function(i,j)
                                        {
                                                aid = $(this).attr('id');
                                                if (p == aid)
                                                {
                                                        $("#tabs-main").tabs("refresh");
                                                        $("#tabs-main").tabs("option", "active", i);
                                                }
                                        });
                                }
else
                {      
                        var num_tabs = $("#tabs-main ul li").length + 1;
                        var li = "<li class='ui-state-default ui-corner-top'><a id='ActiveVehicles' href='#tabs-main-ActiveVehicles" + num_tabs + "'>Active Vehicles</a><span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
                        tabs.find( ".ui-tabs-nav" ).append( li );
                        tabs.append( "<div id='tabs-main-ActiveVehicles"+ num_tabs +"'><div id='ActiveVehicles_div'></div></div>" ); 
                        tabs.tabs( "refresh" ).tabs({ active:num_tabs - 1});;
                        $('#ActiveVehicles_div').html("<center><img class='loading' src='/teams/Ops/PIDB/Shared%20Documents/images/pidb-loading.gif'></img></center>");
                        setTimeout(loadActiveVehicles,1000);
                }

        } //else for ActiveVehicles closing
        
//new code
//else for DetailedActiveVehicles
        else if(choice == "4" )
        {      
                        var href = $('#tabs-main').find('a[id="DetailedActiveVehicles"]').attr('href');
                        var p= $('#tabs-main').find('a[id="DetailedActiveVehicles"]').attr('id');
                                if (p != null)
                                {
                                        $('#tabs-main').find('li a').each(function(i,j)
                                        {
                                                aid = $(this).attr('id');
                                                if (p == aid)
                                                {
                                                        $("#tabs-main").tabs("refresh");
                                                        $("#tabs-main").tabs("option", "active", i);
                                                }
                                        });
                                }
else
                {      
                        var num_tabs = $("#tabs-main ul li").length + 1;
                        var li = "<li class='ui-state-default ui-corner-top'><a id='DetailedActiveVehicles' href='#tabs-main-DetailedActiveVehicles" + num_tabs + "'>Detailed List of Vehicles</a><span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
                        tabs.find( ".ui-tabs-nav" ).append( li );
                        tabs.append( "<div id='tabs-main-DetailedActiveVehicles"+ num_tabs +"'><div id='DetailedActiveVehicles_div'></div></div>" ); 
                        tabs.tabs( "refresh" ).tabs({ active:num_tabs - 1});;
                        $('#DetailedActiveVehicles_div').html("<center><img class='loading' src='/teams/Ops/PIDB/Shared%20Documents/images/pidb-loading.gif'></img></center>");
                        setTimeout(loadDetailedActiveVehicles,1000);
                }
        }
    
//new code
//else for InactiveVehicles
        else if(choice == "5" )
        {      
                        var href = $('#tabs-main').find('a[id="InactiveVehicles"]').attr('href');
                        var p= $('#tabs-main').find('a[id="InactiveVehicles"]').attr('id');
                                if (p != null)
                                {
                                        $('#tabs-main').find('li a').each(function(i,j)
                                        {
                                                aid = $(this).attr('id');
                                                if (p == aid)
                                                {
                                                        $("#tabs-main").tabs("refresh");
                                                        $("#tabs-main").tabs("option", "active", i);
                                                }
                                        });
                                }
else
                {      
                        var num_tabs = $("#tabs-main ul li").length + 1;
                        var li = "<li class='ui-state-default ui-corner-top'><a id='InactiveVehicles' href='#tabs-main-InactiveVehicles" + num_tabs + "'>Inactive Vehicles</a><span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
                        tabs.find( ".ui-tabs-nav" ).append( li );
                        tabs.append( "<div id='tabs-main-InactiveVehicles"+ num_tabs +"'><div id='InactiveVehicles_div'></div></div>" ); 
                        tabs.tabs( "refresh" ).tabs({ active:num_tabs - 1});;
                        $('#InactiveVehicles_div').html("<center><img class='loading' src='/teams/Ops/PIDB/Shared%20Documents/images/pidb-loading.gif'></img></center>");
                        setTimeout(loadInactiveVehicles,1000);
                }

        } //else for InactiveVehicles closing
    
}); //Vehicle View closing

function loadtableV1() { //new code

var newtable = '<table id="exampleV1" class="display compact"><thead><tr><th>Registration No.</th><th>Vehicle Type</th><th>Vehicle Location</th><th>Call Sign</th><th >Patrol Name</th><th>Payroll No.</th><th>Cost Centre</th><th>Region</th><th>Lease Start Date</th><th>Lease End Date</th><th>Vehicle Status</th><th>Trailer Y/N</th><th >Trailer Type</th><th>Termination Date</th><th>Termination Reason</th></tr></thead><tfoot><tr><th>Registration No.</th><th>Vehicle Type</th><th>Vehicle Location</th><th>Call Sign</th><th >Patrol Name</th><th>Payroll No.</th><th>Cost Centre</th><th>Region</th><th>Lease Start Date</th><th>Lease End Date</th><th>Vehicle Status</th><th>Trailer Y/N</th><th >Trailer Type</th><th>Termination Date</th><th>Termination Reason</th></tr></tfoot>';

var rows = $("#vehicle").dataTable().fnGetNodes();

for (var i=0; i<rows.length; i++){
newtable = newtable + '<tr>'+$(rows[i]).html()+'</tr>';
}
newtable = newtable + '</table>';
$('#groupbytableV1').find('img').find('loading').remove();
$('#groupbytableV1').html(newtable);
tabs.tabs( "refresh" );

$('#exampleV1').DataTable({
        "columnDefs": [
    { "visible": false, "targets": 2 },
	{ "visible": false, "targets": 4 },
	{ "visible": false, "targets": 5 },
    { "visible": false, "targets": 6 },
	{ "visible": false, "targets": 7 },
    { "visible": false, "targets": 8 },
    { "visible": false, "targets": 9 },
	{ "visible": false, "targets": 10 },
    { "visible": false, "targets": 11 },
    { "visible": false, "targets": 12 },
    { "visible": false, "targets": 13 },
	{ "visible": false, "targets": 14 }],
        "order": [[ 7, 'asc' ],[ 4, 'asc' ]],
        "displayLength": -1,
        "drawCallback": function ( settings ) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;

            api.column(7, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group1"><td colspan="3" bgcolor="pink"><span>-</span>'+group+'</td></tr>'
                    );
					//$(rows).eq(i).toggle();
                    last = group;
                }
            } );
            api.column(4, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group2"><td colspan="3" bgcolor="cyan"><span>-</span>'+group+'</td></tr>'
                    );
					//$(rows).eq(i).toggle();
                    last = group;
                }
            } );


        } // drawCallback ends
    } );

$('#exampleV1 tbody').find('tr').each( function()
{
if ($(this).is('.group2') || $(this).is('.even') || $(this).is('.odd'))
{
$(this).toggle();
}
$(this).closest('.group1').find('span').text('+');
}); 

$('.group1').click(function ()
                {
                    $(document).css('cursor','progress');
                    $(this).find('span').text(function(_, value){return value=='-'?'+':'-'});
                    $(this).nextAll('tr').each( function()
                    {
                            if ($(this).is('.group1'))
                           {
                              return false;
                           } 
                           if ($(this).is('.group2') && $(this).is(":visible") ) { $(this).toggle();} else
                           {	
                               if ($(this).is('.even') && $(this).is(":visible") ) { $(this).toggle();	} else
                               {	
                                   if ($(this).is('.odd') && $(this).is(":visible") ) { $(this).toggle();	} else
                                   {	 
                                       $(this).closest('.group2').find('span').text('+');
                                       $(this).closest('.group2').toggle();
                                   }
                               }
                           }
					});
					$(document).css('cursor','default');
				});
$('.group2').click(function ()
                {
					$(document).css('cursor','progress');						
  					$(this).find('span').text(function(_, value){return value=='-'?'+':'-'});
                    $(this).nextAll('tr').each( function()
                    {
                            if ($(this).is('.group1')||$(this).is('.group2'))
                            {
                            return false;
                            }
                            $(this).toggle();
					});
                            $(document).css('cursor','default');
				});
} // loadtableV1() ends


//loadtableV2()
 
function loadtableV2() { //new code

var newtable = '<table id="exampleV2" class="display"><thead><tr><th>Registration No.</th><th>Vehicle Type</th><th>Vehicle Location</th><th>Call Sign</th><th >Patrol Name</th><th>Payroll No.</th><th>Cost Centre</th><th>Region</th><th>Lease Start Date</th><th>Lease End Date</th><th>Vehicle Status</th><th>Trailer Y/N</th><th >Trailer Type</th><th>Termination Date</th><th>Termination Reason</th></tr></thead><tfoot><tr><th>Registration No.</th><th>Vehicle Type</th><th>Vehicle Location</th><th>Call Sign</th><th >Patrol Name</th><th>Payroll No.</th><th>Cost Centre</th><th>Region</th><th>Lease Start Date</th><th>Lease End Date</th><th>Vehicle Status</th><th>Trailer Y/N</th><th >Trailer Type</th><th>Termination Date</th><th>Termination Reason</th></tr></tfoot>';

var rows = $("#vehicle").dataTable().fnGetNodes();

for (var i=0; i<rows.length; i++)
    {
        newtable = newtable + '<tr>'+$(rows[i]).html()+'</tr>';
    }
    newtable = newtable + '</table>';
    $('#groupbytableV2').find('img').find('loading').remove();
    $('#groupbytableV2').html(newtable);
    tabs.tabs( "refresh" );

$('#exampleV2').DataTable({
    "columnDefs": [
    { "visible": false, "targets": 1 },
    { "visible": false, "targets": 3 },
    { "visible": false, "targets": 7 },
    { "visible": false, "targets": 8 },
    { "visible": false, "targets": 9 },
	{ "visible": false, "targets": 10 },
    { "visible": false, "targets": 11 },
    { "visible": false, "targets": 12 },
    { "visible": false, "targets": 13 },
	{ "visible": false, "targets": 14 }],
    "order": [[ 1, 'asc' ]],
    "displayLength": -1,
    "drawCallback": function ( settings )
    {
                var api = this.api();
                var rows = api.rows( {page:'current'} ).nodes();
                var last=null;
        api.column(1,{page:'current'}).data().each( function ( group, i ){
                            if ( last !== group )
                            {
                                $(rows).eq( i ).before('<tr class="groupv1"><td colspan="5" bgcolor="pink"><span>-</span>'+group+'</td></tr>');
                                last = group;
                            }
            });
    } // drawCallback ends
    });

$('#exampleV2 tbody').find('tr').each( function()
{
    if ($(this).is('.even') || $(this).is('.odd'))
    {
        $(this).toggle();
    }
        $(this).closest('.groupv1').find('span').text('+');
}); 

$('.groupv1').click(function ()
                 {
					 $(document).css('cursor','progress');						
  					 $(this).find('span').text(function(_, value){return value=='-'?'+':'-'});
					 $(this).nextAll('tr').each( function()
                     {
                         if ($(this).is('.groupv1'))
                        {
                           return false;
                        }
                        $(this).toggle();
						});
					 $(document).css('cursor','default');
				 });

} // loadtableV2() ends

//loadInactiveVehicles() Opens

function loadInactiveVehicles() { //new code
var newtable = '<table id="example_InactiveVehicles" class="display compact" cellspacing="0" width="100%" height="100%"><thead><tr><th>Registration Number</th><th>Vehicle Type</th><th>Location</th><th>Lease Start Date</th><th>Lease End Date</th><th>Termination Date</th></tr></thead><tfoot><tr><th>Registration Number</th><th>Vehicle Type</th><th>Location</th><th>Lease Start Date</th><th>Lease End Date</th><th>Termination Date</th></tr></tfoot></table>';

        
$.ajax({
        url: "/teams/ops/pidb/_api/web/lists/getbytitle('Vehicles')/items?$top=500&$Filter=VehicleStatus eq 'Inactive'",
        type: "GET",
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
        success: mySuccessHandlerInactiveVehicles,
		error: myErrorHandlerInactiveVehicles
});
function myErrorHandlerInactiveVehicles(data, errCode, errMessage){ alert("Error: " + errMessage + " "+errCode); }

function mySuccessHandlerInactiveVehicles(data){		// AJAX Call Success Handler

$('#InactiveVehicles_div').find('img').find('loading').remove();
$('#InactiveVehicles_div').html(newtable);

//console.log(data.d.results.length);

var tablex = $('#example_InactiveVehicles').DataTable({
		"aaData": data.d.results,
		"aoColumns": [{
            "mData": "Title"
        },{
            "mData": "VehicleType"
        },{
            "mData": "VehicleLocation"
        }, {	
            "mData": "LeaseStartDate"    
        }, {
            "mData": "LeaseEndDate"
        }, {
            "mData": "TerminationDate"}],
		"aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"select": true,
		"colReorder": true,
		"stateSave":  true,
		"order": [[3, 'asc']]	
		}); // DataTable() closing..
        }
} //loadInactiveVehicles() Closing

// new code
// loadActiveVehicles opens
function loadActiveVehicles() {

var newtable = '<table id="example_ActiveVehicles" class="display compact"><thead><tr><th>Registration No.</th><th>Vehicle Type</th><th>Vehicle Location</th><th>Call Sign</th><th >Patrol Name</th><th>Payroll No.</th><th>Cost Centre</th><th>Region</th><th>Lease Start Date</th><th>Lease End Date</th><th>Vehicle Status</th><th>Trailer Y/N</th><th >Trailer Type</th><th>Termination Date</th><th>Termination Reason</th></tr></thead><tfoot><tr><th>Registration No.</th><th>Vehicle Type</th><th>Vehicle Location</th><th>Call Sign</th><th >Patrol Name</th><th>Payroll No.</th><th>Cost Centre</th><th>Region</th><th>Lease Start Date</th><th>Lease End Date</th><th>Vehicle Status</th><th>Trailer Y/N</th><th >Trailer Type</th><th>Termination Date</th><th>Termination Reason</th></tr></tfoot>';

var rows = $("#vehicle").dataTable().fnGetNodes();

for (var i=0; i<rows.length; i++){
newtable = newtable + '<tr>'+$(rows[i]).html()+'</tr>';
}
newtable = newtable + '</table>';
$('#ActiveVehicles_div').find('img').find('loading').remove();
$('#ActiveVehicles_div').html(newtable);
tabs.tabs( "refresh" );

$('#example_ActiveVehicles').DataTable({
        "columnDefs":
[
    { "visible": false, "targets": 5 },
	{ "visible": false, "targets": 7 },
    { "visible": false, "targets": 8 },
    { "visible": false, "targets": 9 },
	{ "visible": false, "targets": 10 },
    { "visible": false, "targets": 12 },
    { "visible": false, "targets": 13 },
	{ "visible": false, "targets": 14 }
],
        "displayLength": -1,
	});  
   
} // loadActiveVehicles ends

//new code
//loadDetailedActiveVehicles() opens

function loadDetailedActiveVehicles() {

var newtable = '<table id="example_DetailedActiveVehicles" class="display compact"><thead><tr><th>Registration No.</th><th>Vehicle Type</th><th>Vehicle Location</th><th>Call Sign</th><th >Patrol Name</th><th>Payroll No.</th><th>Cost Centre</th><th>Region</th><th>Lease Start Date</th><th>Lease End Date</th><th>Vehicle Status</th><th>Trailer Y/N</th><th >Trailer Type</th><th>Termination Date</th><th>Termination Reason</th></tr></thead><tfoot><tr><th>Registration No.</th><th>Vehicle Type</th><th>Vehicle Location</th><th>Call Sign</th><th >Patrol Name</th><th>Payroll No.</th><th>Cost Centre</th><th>Region</th><th>Lease Start Date</th><th>Lease End Date</th><th>Vehicle Status</th><th>Trailer Y/N</th><th >Trailer Type</th><th>Termination Date</th><th>Termination Reason</th></tr></tfoot>';

var rows = $("#vehicle").dataTable().fnGetNodes();

for (var i=0; i<rows.length; i++){
newtable = newtable + '<tr>'+$(rows[i]).html()+'</tr>';
}
newtable = newtable + '</table>';
$('#DetailedActiveVehicles_div').find('img').find('loading').remove();
$('#DetailedActiveVehicles_div').html(newtable);
tabs.tabs( "refresh" );

$('#example_DetailedActiveVehicles').DataTable({
        "columnDefs":
[
    { "visible": false, "targets": 3 },
	{ "visible": false, "targets": 4 },
    { "visible": false, "targets": 5 },
    { "visible": false, "targets": 6 },
	{ "visible": false, "targets": 7 },
],
        "displayLength": -1,
	});  
   
} // loadDetailedActiveVehicles ends

// Views available within Patrol Table and onChange behaviour
$('#pidb-view').on('change',function(){

var choice = $("#pidb-view option:selected").attr("id");

if (choice == "2" )
        {
                        var href = $('#tabs-main').find('a[id="region"]').attr('href');
                        var p= $('#tabs-main').find('a[id="region"]').attr('id');
                                if (p != null)
                                {
                                        $('#tabs-main').find('li a').each(function(i,j)
                                        {
                                                aid = $(this).attr('id');
                                                if (p == aid)
                                                {
                                                        $("#tabs-main").tabs("refresh");
                                                        $("#tabs-main").tabs("option", "active", i);
                                                }
                                        });
                                }
                                else
                                {
                                        var num_tabs = $("#tabs-main ul li").length + 1;
                                        var li = "<li class='ui-state-default ui-corner-top'><a id='region' href='#tabs-main-region" + num_tabs + "'>Group By Region</a><span  class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
                                                
                                                tabs.find( ".ui-tabs-nav" ).append( li );
                                                tabs.append( "<div id='tabs-main-region"+ num_tabs +"'><div id='groupbytable'></div></div>" );
                                                tabs.tabs( "refresh" ).tabs({ active:num_tabs - 1});
                                                // Load waiting logo
                                                $('#groupbytable').html("<center><img class='loading' src='/teams/Ops/PIDB/Shared%20Documents/images/pidb-loading.gif'></img></center>");
                                                        setTimeout(loadtable,2000); // Function Call to load Group by Region Table
                }
        }
// Hide Waiting logo here
        else
        if(choice == "3" )
        {
                        var href = $('#tabs-main').find('a[id="detail"]').attr('href');
                        var p= $('#tabs-main').find('a[id="detail"]').attr('id');
                        
                                if (p != null)
                                {
                                        $('#tabs-main').find('li a').each(function(i,j)
                                        {
                                                aid = $(this).attr('id');
                                                if (p == aid)
                                                {
                                                        $("#tabs-main").tabs("refresh");
                                                        $("#tabs-main").tabs("option", "active", i);    
                                                }
                                        });
    
                                }
else
                {
                                        var num_tabs = $("#tabs-main ul li").length + 1;
                                        var li = "<li class='ui-state-default ui-corner-top'><a id='detail' href='#tabs-main-detail" + num_tabs + "'>Detail</a><span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
                                                tabs.find( ".ui-tabs-nav" ).append( li );
                                                tabs.append( "<div id='tabs-main-detail"+ num_tabs +"'><div id='groupbytable3'></div></div>" ); 
                                                tabs.tabs( "refresh" ).tabs({ active:num_tabs - 1});;
                                                // Load waiting logo
                                                $('#groupbytable3').html("<center><img class='loading' src='/teams/Ops/PIDB/Shared%20Documents/images/pidb-loading.gif'></img></center>");
                                                setTimeout(loadtable3,1000);
                }
        }
                else
                if(choice == "4" )
                {
                        var href = $('#tabs-main').find('a[id="manager"]').attr('href');
                        var p= $('#tabs-main').find('a[id="manager"]').attr('id');

                                if (p != null)
                                {
                        
                                        $('#tabs-main').find('li a').each(function(i,j)
                                        {
                                                aid = $(this).attr('id');
                                                if (p == aid)
                                                {
                                                        $("#tabs-main").tabs("refresh");
                                                        $("#tabs-main").tabs("option", "active", i);
                                                }
                                        });
                                }
        else
                        {
                                        var num_tabs = $("#tabs-main ul li").length + 1;
                                        var li = "<li class='ui-state-default ui-corner-top'><a id='manager' href='#tabs-main-manager" + num_tabs + "'>Group By Manager</a><span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
                                                tabs.find( ".ui-tabs-nav" ).append( li );
                                                tabs.append( "<div id='tabs-main-manager"+ num_tabs +"'><div id='groupbytable1'></div></div>" ); 
                                                tabs.tabs( "refresh" ).tabs({ active:num_tabs - 1});;
                                                // Load waiting logo
                                                $('#groupbytable1').html("<center><img class='loading' src='/teams/Ops/PIDB/Shared%20Documents/images/pidb-loading.gif'></img></center>");

                                                setTimeout(loadtable1,2000);
                        }
                }
else
        if(choice == "1" )
        {

                        var href = $('#tabs-main').find('a[id="general"]').attr('href');
                        var p= $('#tabs-main').find('a[id="general"]').attr('id');

                                if (p != null)
                                {
    
                                        $('#tabs-main').find('li a').each(function(i,j)
                                        {
                                                aid = $(this).attr('id');
                                                if (p == aid)
                                                {
                                                        $("#tabs-main").tabs("refresh");
                                                        $("#tabs-main").tabs("option", "active", i);
                                                }
                                        });
                                }
else
                {
                                        var num_tabs = $("#tabs-main ul li").length + 1;
                                        var li = "<li class='ui-state-default ui-corner-top'><a id='general' href='#tabs-main-general" + num_tabs + "'>General</a><span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
                                                tabs.find( ".ui-tabs-nav" ).append( li );
                                                tabs.append( "<div id='tabs-main-general"+ num_tabs +"'><div id='groupbytable2'></div></div>" );
                                                tabs.tabs( "refresh" ).tabs({ active:num_tabs - 1});;
                                                $('#groupbytable2').html("<center><img class='loading' src='/teams/Ops/PIDB/Shared%20Documents/images/pidb-loading.gif'></img></center>");

                                                setTimeout(loadtable2,2000);

                }
        }
//else for inactive patrols

        else if(choice == "5" )
        {
        
                        var href = $('#tabs-main').find('a[id="inactive"]').attr('href');
                        var p= $('#tabs-main').find('a[id="inactive"]').attr('id');

                                if (p != null)
                                {
                                        $('#tabs-main').find('li a').each(function(i,j)
                                        {
                                                aid = $(this).attr('id');
                                                if (p == aid)
                                                {
                                                        $("#tabs-main").tabs("refresh");
                                                        $("#tabs-main").tabs("option", "active", i);
                                                }
                                        });
                                }

else
                {
      
                                        var num_tabs = $("#tabs-main ul li").length + 1;
                                        var li = "<li class='ui-state-default ui-corner-top'><a id='inactive' href='#tabs-main-inactive" + num_tabs + "'>Inactive Patrols</a><span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
                                                tabs.find( ".ui-tabs-nav" ).append( li );
                                                tabs.append( "<div id='tabs-main-inactive"+ num_tabs +"'><div id='inactive_div'></div></div>" ); 
                                                tabs.tabs( "refresh" ).tabs({ active:num_tabs - 1});;
                                                $('#inactive_div').html("<center><img class='loading' src='/teams/Ops/PIDB/Shared%20Documents/images/pidb-loading.gif'></img></center>");

                                                setTimeout(loadInactive,1000);


                }

        } //else for inactive Patrols closing
        
//new code
//else for Active Patrols Addresses

        else if(choice == "6" )
        {
        
                        var href = $('#tabs-main').find('a[id="ActivePatrolAddresses"]').attr('href');
                        var p= $('#tabs-main').find('a[id="ActivePatrolAddresses"]').attr('id');

                                if (p != null)
                                {
                                        $('#tabs-main').find('li a').each(function(i,j)
                                        {
                                                aid = $(this).attr('id');
                                                if (p == aid)
                                                {
                                                        $("#tabs-main").tabs("refresh");
                                                        $("#tabs-main").tabs("option", "active", i);
                                                }
                                        });
                                }

else
                {
      
var num_tabs = $("#tabs-main ul li").length + 1;
var li = "<li class='ui-state-default ui-corner-top'><a id='ActivePatrolAddresses' href='#tabs-main-ActivePatrolAddresses" + num_tabs + "'>Active Patrol Addresses</a><span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
tabs.find( ".ui-tabs-nav" ).append( li );
tabs.append( "<div id='tabs-main-ActivePatrolAddresses"+ num_tabs +"'><div id='ActivePatrolAddresses_div'></div></div>" ); 
tabs.tabs( "refresh" ).tabs({ active:num_tabs - 1});;
$('#ActivePatrolAddresses_div').html("<center><img class='loading' src='/teams/Ops/PIDB/Shared%20Documents/images/pidb-loading.gif'></img></center>");
setTimeout(loadActivePatrolAddresses,1000);


                }

        } //else for Active Patrols Addresses closing  
        
//new code
//else for ActivePatrolBD        
 
else
                if(choice == "7" )
                {
                        var href = $('#tabs-main').find('a[id="ActivePatrolBD"]').attr('href');
                        var p= $('#tabs-main').find('a[id="ActivePatrolBD"]').attr('id');

                                if (p != null)
                                {
                        
                                        $('#tabs-main').find('li a').each(function(i,j)
                                        {
                                                aid = $(this).attr('id');
                                                if (p == aid)
                                                {
                                                        $("#tabs-main").tabs("refresh");
                                                        $("#tabs-main").tabs("option", "active", i);
                                                }
                                        });
                                }
        else
                        {
var num_tabs = $("#tabs-main ul li").length + 1;
var li = "<li class='ui-state-default ui-corner-top'><a id='ActivePatrolBD' href='#tabs-main-ActivePatrolBD" + num_tabs + "'>Active Patrol Basic Details</a><span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
tabs.find( ".ui-tabs-nav" ).append( li );
tabs.append( "<div id='tabs-main-ActivePatrolBD"+ num_tabs +"'><div id='ActivePatrolBD_div'></div></div>" ); 
tabs.tabs( "refresh" ).tabs({ active:num_tabs - 1});;
                                                // Load waiting logo
 $('#ActivePatrolBD_div').html("<center><img class='loading' src='/teams/Ops/PIDB/Shared%20Documents/images/pidb-loading.gif'></img></center>");
setTimeout(loadtableActivePatrolBD,100);
                        }
                }   //else for ActivePatrolBD         
        
}); // Patrol View onChange closing


tabs.delegate( "span.ui-icon-close", "click", function() {
var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
$( "#" + panelId ).remove();
tabs.tabs( "refresh" );
});  // for closing tabs


function loadtable() {

var newtable = '<table id="example3" class="display compact" cellspacing="0" width="100%" height="100%"><thead><tr> <th></th> <th>Call Sign</th><th>Payroll Number</th><th>First Name</th><th>Last Name</th><th>Region</th><th>Job Role</th><th>Mobile Number</th><th>Zone</th><th>Patrol Manager</th><th>Lead Patrol</th><th>Cell Number</th><th>Cell Type</th><th>Agreement Type</th><th>Regional Manager</th><th>In Active Duty</th></tr></thead><tfoot><tr><th></th><th>Call Sign</th><th>Payroll Number</th><th>First Name</th><th>Last Name</th><th>Region</th><th>Job Role</th><th>Mobile Number</th><th>Zone</th><th>Patrol Manager</th><th>Lead Patrol</th><th>Cell Number</th><th>Cell Type</th><th>Agreement Type</th><th>Regional Manager</th><th>In Active Duty</th></tr></tfoot>';

var rows = $("#patrol").dataTable().fnGetNodes();

for (var i=0; i<rows.length; i++){
newtable = newtable + '<tr>'+$(rows[i]).html()+'</tr>';
}
newtable = newtable + '</table>';
$('#groupbytable').find('img').find('loading').remove();
$('#groupbytable').html(newtable);
tabs.tabs( "refresh" );

$('#example3').DataTable({
        "columnDefs": [
            { "visible": false, "targets": 5 },
            { "visible": false, "targets": 8 },
            { "visible": false, "targets": 11 }
        ],
        "order": [[ 5, 'asc' ],[ 7, 'asc' ],[ 10, 'asc' ]],
        "displayLength": -1,
        "drawCallback": function ( settings ) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;
 
            api.column(5, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group1"><td colspan="13" style="background:rgb(180, 208, 253)"><span>-</span><b>'+group+'<b></td></tr>'
                    );
                    //$(rows).eq(i).toggle();
                    last = group;
                }
            } );

            api.column(8, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group2"><td colspan="13" style="background:rgb(205, 224, 254)"><span>-</span><b>'+group+'</b></td></tr>'
                    );
                    //$(rows).eq(i).toggle();
                    last = group;
                }
            } ); 

            api.column(11, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group3"><td colspan="13" style="background:rgb(230, 239, 254)"><span>-</span><b>'+group+'<b></td></tr>'
                    );
                    //$(rows).eq(i).toggle();
                    last = group;
                }
            } ); 

        } // drawCallback ends
    } );

$('#example3 tbody').find('tr').each( function()
{
if ($(this).is('.group2') || $(this).is('.group3') || $(this).is('.even') ||$(this).is('.odd'))
{

$(this).toggle();
}
$(this).closest('.group1').find('span').text('+');
}); 

$('.group1').click(function ()
                 {
                     $(document).css('cursor','progress');
                     $(this).find('span').text(function(_, value){return value=='-'?'+':'-'});
                     $(this).nextAll('tr').each( function()
                     {
                         if ($(this).is('.group1'))
                        {
                           return false;
                        } 
    if ($(this).is('.group2') && $(this).is(":visible") ) { $(this).toggle();   }else {
    if ($(this).is('.group3') && $(this).is(":visible") ) { $(this).toggle();   }else { 
    if ($(this).is('.even') && $(this).is(":visible") ) { $(this).toggle(); }else { 
    if ($(this).is('.odd') && $(this).is(":visible") ) { $(this).toggle();  }else {  
    $(this).closest('.group2').find('span').text('+');
    $(this).closest('.group2').toggle();

                        }}}}
                     });
                     $(document).css('cursor','default');
                 });

$('.group2').click(function ()
                 {
                     $(document).css('cursor','progress');
                     $(this).find('span').text(function(_, value){return value=='-'?'+':'-'});
                     $(this).nextAll('tr').each( function()
                     {
                         if ($(this).is('.group2'))
                        {
                           return false;
                        } 
    if ($(this).is('.group3') && $(this).is(":visible") ) { $(this).toggle();   }else { 
    if ($(this).is('.even') && $(this).is(":visible") ) { $(this).toggle(); }else { 
    if ($(this).is('.odd') && $(this).is(":visible") ) { $(this).toggle();  }else {  
    $(this).closest('.group3').find('span').text('+');
    $(this).closest('.group3').toggle();

                        }}}
                     });
                     $(document).css('cursor','default');
                 });

$('.group3').click(function ()
                 {
                     $(document).css('cursor','progress');                      
                     $(this).find('span').html(function(_, value){return value==value=='-'?'+':'-'});
                     //console.log(value);
                     $(this).nextAll('tr').each( function()
                     {
                         if ($(this).is('.group1')||$(this).is('.group2')||$(this).is('.group3'))
                        {
                           return false;
                        }
                        $(this).toggle();
                        });
                     $(document).css('cursor','default');
                 });
                 
} // LoadTable() closing

//LoadTable1() Opening

function loadtable1() {

var newtable = '<table id="example4" class="display compact" cellspacing="0" width="100%" height="100%"><thead><tr> <th></th> <th>Call Sign</th><th>Payroll Number</th><th>First Name</th><th>Last Name</th><th>Region</th><th>Job Role</th><th>Mobile Number</th><th>Zone</th><th>Patrol Manager</th><th>Lead Patrol</th><th>Cell Number</th><th>Cell Type</th><th>Agreement Type</th><th>Regional Manager</th><th>In Active duty</th></tr></thead><tfoot><tr><th></th><th>Call Sign</th><th>Payroll Number</th><th>First Name</th><th>Last Name</th><th>Region</th><th>Job Role</th><th>Mobile Number</th><th>Zone</th><th>Patrol Manager</th><th>Lead Patrol</th><th>Cell Number</th><th>Cell Type</th><th>Agreement Type</th><th>Regional Manager</th><th>In Active duty</th></tr></tfoot>';

var rows = $("#patrol").dataTable().fnGetNodes();

for (var i=0; i<rows.length; i++){
newtable = newtable + '<tr>'+$(rows[i]).html()+'</tr>';
}
newtable = newtable + '</table>';
$('#groupbytable1').find('img').find('loading').remove();
$('#groupbytable1').html(newtable);
tabs.tabs( "refresh" );

$('#example4').DataTable({
        "columnDefs": [
        { "visible": false, "targets": 6 },
        { "visible": false, "targets": 7 },
        { "visible": false, "targets": 9 },
        { "visible": false, "targets": 10},
        { "visible": false, "targets": 13},
        { "visible": false, "targets": 14}
        ],
        "order": [[ 14, 'asc' ],[ 9, 'asc' ],[ 10, 'asc' ]],
        "displayLength": -1,
        "drawCallback": function ( settings ) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;
 
            api.column(14, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group1-1"><td colspan="13" style="background:rgb(180, 208, 253)"><span>-</span><b>'+group+'</b></td></tr>'
                    );
                    //$(rows).eq(i).toggle();
                    last = group;
                }
            } );

            api.column(9, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group2-1"><td colspan="13" style="background:rgb(205, 224, 254)"><span>-</span><b>'+group+'</b></td></tr>'
                    );
                    //$(rows).eq(i).toggle();
                    last = group;
                }
            } ); 

            api.column(10, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group3-1"><td colspan="13" style="background:rgb(230, 239, 254)"><span>-</span><b>'+group+'</b></td></tr>'
                    );
                    //$(rows).eq(i).toggle();
                    last = group;
                }
            } ); 

        } // drawCallback ends
    } );

$('#example4 tbody').find('tr').each( function()
{
if ($(this).is('.group2-1') || $(this).is('.group3-1') || $(this).is('.even') ||$(this).is('.odd'))
{
$(this).toggle();
}
$(this).closest('.group1-1').find('span').text('+');
}); 

$('.group1-1').click(function ()
                 {
                     $(document).css('cursor','progress');
                     $(this).find('span').text(function(_, value){return value=='-'?'+':'-'});
                     $(this).nextAll('tr').each( function()
                     {
                         if ($(this).is('.group1-1'))
                        {
                           return false;
                        } 
    if ($(this).is('.group2-1') && $(this).is(":visible") ) { $(this).toggle(); }else {
    if ($(this).is('.group3-1') && $(this).is(":visible") ) { $(this).toggle(); }else { 
    if ($(this).is('.even') && $(this).is(":visible") ) { $(this).toggle(); }else { 
    if ($(this).is('.odd') && $(this).is(":visible") ) { $(this).toggle();  }else {  
    $(this).closest('.group2-1').find('span').text('+');
    $(this).closest('.group2-1').toggle();

                        }}}}
                     });
                     $(document).css('cursor','default');
                 });

$('.group2-1').click(function ()
                 {
                     $(document).css('cursor','progress');                      
                     $(this).find('span').text(function(_, value){return value=='-'?'+':'-'});
                     $(this).nextAll('tr').each( function()
                     {
                         if ($(this).is('.group2-1'))
                        {
                           return false;
                        }
                        //$(this).toggle();
                if ($(this).is('.group3-1') && $(this).is(":visible") )
                {
                                $(this).toggle();
                                }else
                                {   
                                if ($(this).is('.even') && $(this).is(":visible") )
                                {
                                                $(this).toggle();
                                                }
                                                else
                                                {   
                                                if ($(this).is('.odd') && $(this).is(":visible") )
                                                {
                                                                $(this).toggle();
                                                                }
                                                                else
                                                                {    
                                                                                $(this).closest('.group2-1').find('span').text('+');
                                                                                $(this).closest('.group3-1').toggle();
                                                                }
                                                }
                        }
                });
                     $(document).css('cursor','default');
                 });
$('.group3-1').click(function ()
                 {
                     $(document).css('cursor','progress');                      
                     $(this).find('span').text(function(_, value){return value=='-'?'+':'-'});
                     $(this).nextAll('tr').each( function()
                     {
                         if ($(this).is('.group1-1')||$(this).is('.group2-1')||$(this).is('.group3-1'))
                        {
                           return false;
                        }
                        $(this).toggle();
                        });
                     $(document).css('cursor','default');
                 });
} // loadTable1 ends

//LoadTable3() Opens

function loadtable2() {

var newtable = '<table id="example5" class="display compact" cellspacing="0" width="100%" height="100%"><thead><tr> <th></th> <th>Call Sign</th><th>Payroll Number</th><th>First Name</th><th>Last Name</th><th>Region</th><th>Job Role</th><th>Mobile Number</th><th>Zone</th><th>Patrol Manager</th><th>Lead Patrol</th><th>Cell Number</th><th>Cell Type</th><th>Agreement Type</th><th>Regional Manager</th><th>In Active Duty</th></tr></thead><tfoot><tr><th></th><th>Call Sign</th><th>Payroll Number</th><th>First Name</th><th>Last Name</th><th>Region</th><th>Job Role</th><th>Mobile Number</th><th>Zone</th><th>Patrol Manager</th><th>Lead Patrol</th><th>Cell Number</th><th>Cell Type</th><th>Agreement Type</th><th>Regional Manager</th><th>In Active Duty</th></tr></tfoot>';

var rows = $("#patrol").dataTable().fnGetNodes();

for (var i=0; i<rows.length; i++){
newtable = newtable + '<tr>'+$(rows[i]).html()+'</tr>';
}
newtable = newtable + '</table>';
$('#groupbytable2').find('img').find('loading').remove();
$('#groupbytable2').html(newtable);
tabs.tabs( "refresh" );

$('#example5').DataTable({
        "columnDefs": [
    { "visible": false, "targets": 5 },
    { "visible": false, "targets": 6 },
    { "visible": false, "targets": 7 },
    { "visible": false, "targets": 8 },
    { "visible": false, "targets": 9  },
    { "visible": false, "targets": 10 },
    { "visible": false, "targets": 11 },
    { "visible": false, "targets": 12 },
    { "visible": false, "targets": 14 }
        ],
        "displayLength": -1,
    });  
   
} // loadTable()2 ends

//LoadTable3() opens

function loadtable3() {

var newtable = '<table id="example6" class="display compact" cellspacing="0" width="100%" height="100%"><thead><tr> <th></th> <th>Call Sign</th><th>Payroll Number</th><th>First Name</th><th>Last Name</th><th>Region</th><th>Job Role</th><th>Mobile Number</th><th>Zone</th><th>Patrol Manager</th><th>Lead Patrol</th><th>Cell Number</th><th>Cell Type</th><th>Agreement Type</th><th>Regional Manager</th><th>In Active Duty</th></tr></thead><tfoot><tr><th></th><th>Call Sign</th><th>Payroll Number</th><th>First Name</th><th>Last Name</th><th>Region</th><th>Job Role</th><th>Mobile Number</th><th>Zone</th><th>Patrol Manager</th><th>Lead Patrol</th><th>Cell Number</th><th>Cell Type</th><th>Agreement Type</th><th>Regional Manager</th><th>In Active Duty</th></tr></tfoot>';

var rows = $("#patrol").dataTable().fnGetNodes();

for (var i=0; i<rows.length; i++){
newtable = newtable + '<tr>'+$(rows[i]).html()+'</tr>';
}
newtable = newtable + '</table>';
$('#groupbytable3').find('img').find('loading').remove();
$('#groupbytable3').html(newtable);
tabs.tabs( "refresh" );

$('#example6').DataTable({ "columnDefs": [{ "visible": false, "targets": 14 },],"displayLength": -1,});
} // loadTable()3 Closing


//LoadInactive() Opens

function loadInactive() { //new code
var newtable = '<table id="example_inactive" class="display compact" cellspacing="0" width="100%" height="100%"><thead><tr><th></th><th>Patrol Name</th><th>Payroll Number</th><th>Call Sign</th><th>Termination Date</th><th>Termination Reason</th></tr></thead><tfoot><tr><th></th><th>Patrol Name</th><th>Payroll Number</th><th>Call Sign</th><th>Termination Date</th><th>Termination Reason</th></tr></tfoot></table>';

        
$.ajax({
        url: "/teams/ops/pidb/_api/web/lists/getbytitle('patrol_personal')/items?$top=500&$Filter=InActiveDuty eq 'No'",
        type: "GET",
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
        success: mySuccessHandlerinactive,
		error: myErrorHandlerinactive
});
function myErrorHandlerinactive(data, errCode, errMessage){ alert("Error: " + errMessage + " "+errCode); }

function mySuccessHandlerinactive(data){		// AJAX Call Success Handler

$('#inactive_div').find('img').find('loading').remove();
$('#inactive_div').html(newtable);

console.log(data.d.results.length);

var tablex = $('#example_inactive').DataTable({
		"aaData": data.d.results,
		"aoColumns": [{
		"className": 'details-control',
		"orderable":      false,
		"data":           null,
		"defaultContent": ''
        },{
            "mData": "PatrolName"
        },{
            "mData": "Title"
        }, {	
            "mData": "PatrolCallSign"    
        }, {
            "mData": "TerminationDate"
        }, {
            "mData": "TerminationReason"}],
		"aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"select": true,
		"colReorder": true,
		"stateSave":  true,
		"order": [[3, 'asc']]	
		}); // DataTable() closing..
        }
} //LoadInactive() Closing

//new code
//loadActivePatrolAddresses() Opens

function loadActivePatrolAddresses() { //new code
var newtable = '<table id="example_ActivePatrolAddresses" class="display compact" cellspacing="0" width="100%" height="100%"><thead><tr><th></th><th>Patrol Name</th><th>Payroll Number</th><th>Call Sign</th><th>Address 1</th><th>Address 2</th><th>Town/City</th><th>County</th><th>Post Code</th><th>Telephone Number</th><th>Email Address</th><th>Start Date</th></tr></thead><tfoot><tr><th></th><th>Patrol Name</th><th>Payroll Number</th><th>Call Sign</th><th>Address 1</th><th>Address 2</th><th>Town/City</th><th>County</th><th>Post Code</th><th>Telephone Number</th><th>Email Address</th><th>Start Date</th></tr></tfoot></table>';

$.ajax({
        url: "/teams/ops/pidb/_api/web/lists/getbytitle('patrol_personal')/items?$top=500&$Filter=InActiveDuty eq 'Yes'",
        type: "GET",
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
        success: mySuccessHandlerActivePatrolAddresses,
		error: myErrorHandlerActivePatrolAddresses
});
function myErrorHandlerActivePatrolAddresses(data, errCode, errMessage){ alert("Error: " + errMessage + " "+errCode); }

function mySuccessHandlerActivePatrolAddresses(data){		// AJAX Call Success Handler

$('#ActivePatrolAddresses_div').find('img').find('loading').remove();
$('#ActivePatrolAddresses_div').html(newtable);

console.log(data.d.results.length);

var tablex = $('#example_ActivePatrolAddresses').DataTable({
		"aaData": data.d.results,
		"aoColumns": [{
		"className": 'details-control',
		"orderable":      false,
		"data":           null,
		"defaultContent": ''
        },{
            "mData": "PatrolName"
        },{
            "mData": "Title"
        }, {	
            "mData": "PatrolCallSign"    
        }, {
            "mData": "HomeAddress_1"
        }, {
            "mData": "HomeAddress_2"
        }, {	
            "mData": "HomeTown"    
        }, {
            "mData": "HomeCounty"
        }, {
            "mData": "HomePostCode" 
        }, {
            "mData": "HomeTelephone"
        }, {
            "mData": "HomeEmail"
        }, {
            "mData": "StartDate" 
        }],
		"aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"select": true,
		"colReorder": true,
		"stateSave":  true,
		"order": [[3, 'asc']]	
		}); // DataTable() closing..
        }
} //loadActivePatrolAddresses() Closing

 //new code
//loadtableActivePatrolBD() Opens

function loadtableActivePatrolBD() {

var newtable = '<table id="example_ActivePatrolBD" class="display compact" cellspacing="0" width="100%" height="100%"><thead><tr><th></th><th>Patrol Name</th><th>Job Role</th><th>Payroll No</th><th>Call Sign</th><th>Mobile No</th><th>Region</th><th>Cell Number</th><th>Cell Type</th><th>Cluster</th><th>Service Delivery Manager</th><th>Patrol Team Manager</th><th>Agreement Type</th><th>Cost Centre</th><th>Regional Operations Manager</th></tr></thead><tfoot><tr><th></th><th>Patrol Name</th><th>Job Role</th><th>Payroll No</th><th>Call Sign</th><th>Mobile No</th><th>Region</th><th>Cell Number</th><th>Cell Type</th><th>Cluster</th><th>Service Delivery Manager</th><th>Patrol Team Manager</th><th>Agreement Type</th><th>Cost Centre</th><th>Regional Operations Manager</th></tfoot>';

var rows = $("#patrol").dataTable().fnGetNodes();

for (var i=0; i<rows.length; i++){
newtable = newtable + '<tr>'+$(rows[i]).html()+'</tr>';
}
newtable = newtable + '</table>';
$('#ActivePatrolBD_div').find('img').find('loading').remove();
$('#ActivePatrolBD_div').html(newtable);
tabs.tabs( "refresh" );

$('#example_ActivePatrolBD').DataTable({
        "columnDefs": [
	{ "visible": false, "targets": 13 },
	{ "visible": false, "targets": 14 },],
        "displayLength": -1,
	});  
   
} // loadTableActivePatrolBD() ends


// Get current HTML table and store in a variable //
var curr_html = $('#patrol').html();
$('#patrol').html("<center><img class='loading' src='/teams/Ops/PIDB/Shared%20Documents/images/pidb-loading.gif'></img></center>");

// Create AJAX call to SharePoint List and get All Patrols //
$.ajax({   //new code
       url: "/teams/ops/pidb/_api/web/lists/getbytitle('patrol_basic')/items?$select= Title,PatrolPayrollNo,PatrolFirstName,PatrolLastName,PatrolName,Region,PatrolJobRole,PatrolMobileNo,Zone,CostCentre,PatrolManager,LeadPatrol,EmailID,CellNo,CellType,PatrolCluster,ContractType,RegionalManager,InActiveDuty,ResourcePlanner,RegionalManagerCostCentre,LeadPatrol,LeadPatrolCostCentre,PatrolManager,PatrolManagerCostCentre,AG_ID,PatrolManagerEtxt,DGroup,LightDuties,AccessToTrailer,AccessToMotorCycle,Author/FirstName,Author/LastName,Editor/FirstName,Editor/LastName,Created,Modified&$expand=Author/FirstName,Author/LastName,Editor/FirstName,Editor/LastName&$Filter=InActiveDuty eq 'Yes'&$top=200",
        type: "GET",
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
        success: mySuccessHandler,
        error: myErrorHandler
}); // ajax call closing..

// Vehicle AJAX data 
// Create AJAX call to SharePoint List and get All Vehicles //
$.ajax({   //new code
        url: "/teams/ops/pidb/_api/web/lists/getbytitle('vehicles')/items?$select=PatrolName,PatrolCallSign,CostCentre,PatrolPayrollNo,Region,Title,VehicleStatus,VehicleLocation,VehicleLocationOther,FurtherDetails,VehicleLeaseSupplier,LeaseStartDate,LeaseEndDate,VehicleType,VehicleTypeOther,CADMask,UnitType,Symnum,TrailerType,VehicleTrailerTypeOther,VehicleHistory,TerminationDate,TerminationReason,VehicleTerminationReasonOther,GeneralComments,CommentsRestricted,VTrailer,TrailerEndDate,TrailerStatus,Trailer,Author/FirstName,Author/LastName,Editor/FirstName,Editor/LastName,Created,Modified&$expand=Author/FirstName,Author/LastName,Editor/FirstName,Editor/LastName&$Filter=VehicleStatus eq 'Active'&$top=3000",
        type: "GET",
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
        success: mySuccessHandlerVehicle,
		error: myErrorHandlerVehicle
}); // ajax call closing..
// Create AJAX call to get all Lookup data

// Ajax call to get trailer type
var vttrailertypemaxsize;

$.ajax({
        url: "/teams/ops/pidb/_api/web/lists/getbytitle('masterdata')/items?$select Value&$Filter=Title eq 'RDTCRTTYpe'&$top=1000",
        type: "GET",
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
        success: function(data){
                $.each(data.d.results, function(index, item){
                        $('#vt-trailer-type, #add-new-vehicle #vt-trailer-type').append($('<option>',{ value:item.Value,text : item.Value}));
                        //$('#add-new-vehicle #vt-trailer-type').append($('<option>',{ value:item.Value,text : item.Value}));
                        });
                        $('#vt-trailer-type, #add-new-vehicle #vt-trailer-type').append($('<option>',{ value:'none',text : ''})); // Empty row
                },
        error: function(){ console.log("Error in getting Cellnumber lookup data"); console.log(error); }
});


//Ajax call to get vehicle termination reason
$.ajax({
        url: "/teams/ops/pidb/_api/web/lists/getbytitle('masterdata')/items?$select Value&$Filter=Title eq 'VehicleTerminationReason'&$top=1000",
        type: "GET",
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
        success: function(data){
                $.each(data.d.results, function(index, item){
                        $('#vt-termination-reason, #add-new-vehicle #vt-termination-reason').append($('<option>',{ value:item.Value,text : item.Value}));
                        //$('#add-new-vehicle #vt-termination-reason').append($('<option>',{ value:item.Value,text : item.Value}));
                        });
                        $('#vt-termination-reason, #add-new-vehicle #vt-termination-reason').append($('<option>',{ value:'none',text : ''})); // Empty row
                },
        error: function(){ console.log("Error in getting Cellnumber lookup data"); console.log(error); }
});

//Ajax call to get vehicle location
$.ajax({
        url: "/teams/ops/pidb/_api/web/lists/getbytitle('masterdata')/items?$select Value&$Filter=Title eq 'VehicleLocation'&$top=1000",
        type: "GET",
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
        success: function(data){
                $.each(data.d.results, function(index, item){
                        $('#vt-vehcile-location, #add-new-vehicle #vt-vehcile-location').append($('<option>',{ value:item.Value,text : item.Value}));
                        //$('#add-new-vehicle #vt-vehcile-location').append($('<option>',{ value:item.Value,text : item.Value}));
                        });
                //$('#add-new-vehicle #vt-vehcile-location').append($('<option>',{ value:'none',text : ''})); //new code, not reqd since mandatory
                },
        error: function(){ console.log("Error in getting Cellnumber lookup data"); console.log(error); }
});

//Ajax call to get vehicle Status
$.ajax({
        url: "/teams/ops/pidb/_api/web/lists/getbytitle('masterdata')/items?$select Value&$Filter=Title eq 'VehicleStatus'&$top=1000",
        type: "GET",
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
        success: function(data){
                $.each(data.d.results, function(index, item){
                        $('#vt-vehcile-status, #add-new-vehicle #vt-vehcile-status').append($('<option>',{ value:item.Value,text : item.Value}));
                        //$('#add-new-vehicle #vt-vehcile-status').append($('<option>',{ value:item.Value,text : item.Value}));
                        });
                //$('#add-new-vehicle #vt-vehcile-status').append($('<option>',{ value:'none',text : ''})); //new code, not reqd since mandatory 
                },
        error: function(){ console.log("Error in getting Cellnumber lookup data"); console.log(error); }
});

//Ajax call to get Vehicle Type
var vehicletype = [];
$.ajax({
        url: "/teams/ops/pidb/_api/web/lists/getbytitle('masterdata')/items?$select Value&$Filter=Title eq 'VehicleType'&$top=1000",
        type: "GET",
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
        success: function(data){
                $.each(data.d.results, function(index, item){
                        $('#vt-vehicle-type, #add-new-vehicle #vt-vehicle-type').append($('<option>',{ value:item.Value,text : item.Value}));
                        //$('#add-new-vehicle #vt-vehicle-type').append($('<option>',{ value:item.Value,text : item.Value}));
                        vehicletype.push([item.Value,item.Attrib1,item.Attrib2]);
                        });
               // $('#add-new-vehicle #vt-vehicle-type').append($('<option>',{ value:'none',text : ''})); //new code, not reqd since mandatory 
                 },
        error: function(){ console.log("Error in getting Cellnumber lookup data"); console.log(error); }
});

// Patrol AJAX data
$.ajax({
        url: "/teams/ops/pidb/_api/web/lists/getbytitle('masterdata')/items?$select Value&$Filter=Title eq 'AG_ID'",
        type: "GET",
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
        success: function(data){
                $.each(data.d.results, function(index, item){
//                        jobroles.push(item.Title)
                        $('#patrol-detail-view-basic #patrol-ag-id').append($('<option>',{ value:item.Value,text : item.Value}));
                        $('#patrol-detail-new-basic #patrol-ag-id').append($('<option>',{ value:item.Value,text : item.Value}));
                        });
                        $('#patrol-detail-new-basic #patrol-ag-id').append($('<option>',{ value:'none',text : ''})); // Empty row
                        $('#patrol-detail-view-basic #patrol-ag-id').append($('<option>',{ value:'none',text : ''})); // Empty row
                },
        error: function(){ console.log("Error in getting ag_id lookup data"); console.log(error); }
});


var jobroles = [];
$.ajax({
        url: "/teams/ops/pidb/_api/web/lists/getbytitle('masterdata')/items?$select Value&$Filter=Title eq 'JobRole'",
        type: "GET",
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
        success: function(data){
                $.each(data.d.results, function(index, item){
//                        jobroles.push(item.Title)
                        $('#patrol-job-role').append($('<option>',{ value:item.Value,text : item.Value}));
                        $('#patrol-detail-new-basic #patrol-job-role').append($('<option>',{ value:item.Value,text : item.Value}));
                        });
                        $('#patrol-detail-new-basic #patrol-job-role').append($('<option>',{ value:'none',text : ''})); // Empty row
                },
        error: function(){ console.log("Error in getting jobrole lookup data"); console.log(error); }
});

$.ajax({
        url: "/teams/ops/pidb/_api/web/lists/getbytitle('masterdata')/items?$select Value&$Filter=Title eq 'Region'",
        type: "GET",
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
        success: function(data){
                $.each(data.d.results, function(index, item){
//                        jobroles.push(item.Title)
                        $('#patrol-region').append($('<option>',{ value:item.Value,text : item.Value}));
                        });
                },
        error: function(){ console.log("Error in getting region lookup data"); console.log(error); }
});
var cellnumbers = [];
$.ajax({
        url: "/teams/ops/pidb/_api/web/lists/getbytitle('masterdata')/items?$select Value&$Filter=Title eq 'CellNumber'&$top=1000",
        type: "GET",
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
        success: function(data){
                $.each(data.d.results, function(index, item){
                        cellnumbers.push([item.Value,item.Attrib1,item.Attrib2,item.Attrib3,item.Attrib4]);
                        $('#patrol-cell-number').append($('<option>',{ value:item.Value,text : item.Value}));
                        $('#patrol-detail-new-basic #patrol-cell-number').append($('<option>',{ value:item.Value,text : item.Value}));
                        
                        });
                        $('#patrol-detail-new-basic #patrol-cell-number').append($('<option>',{ value:'none',text : ''})); // Empty row
                },
        error: function(){ console.log("Error in getting Cellnumber lookup data"); console.log(error); }
});

$.ajax({
        url: "/teams/ops/pidb/_api/web/lists/getbytitle('masterdata')/items?$select Value&$Filter=Title eq 'ContractType'&$top=1000",
        type: "GET",
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
        success: function(data){
                $.each(data.d.results, function(index, item){
//                        jobroles.push(item.Title)
                        $('#patrol-agreement-type').append($('<option>',{ value:item.Value,text : item.Value}));
                        $('#patrol-detail-new-basic #patrol-agreement-type').append($('<option>',{ value:item.Value,text : item.Value}));
                        });
                        $('#patrol-detail-new-basic #patrol-agreement-type').append($('<option>',{ value:'none',text : ''})); // Empty row
                },
        error: function(){ console.log("Error in getting Cellnumber lookup data"); console.log(error); }
});

var regional_managers = [];

$.ajax({
        url: "/teams/ops/pidb/_api/web/lists/getbytitle('patrol_basic')/items?$select PatrolFirstName,PatrolLastName,EmailID,CostCentre &$Filter=PatrolJobRole eq 'Regional Manager'&$top=1000",
        type: "GET",
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
        success: function(data){
                $.each(data.d.results, function(index, item){
//                        jobroles.push(item.Title)
                          var regional_manager_name =  item.PatrolFirstName+' '+item.PatrolLastName;
                          regional_managers.push([regional_manager_name,item.CostCentre,item.EmailID]);
                        $('#patrol-regional-manager').append($('<option>',{ value:regional_manager_name,text : regional_manager_name}));
                        $('#patrol-detail-new-basic  #patrol-regional-manager').append($('<option>',{ value:regional_manager_name,text : regional_manager_name}));
                        });
                        $('#patrol-detail-new-basic #patrol-regional-manager').append($('<option>',{ value:'none',text : ''})); // Empty row
                        $('#patrol-detail-view-basic #patrol-regional-manager').append($('<option>',{ value:'none',text : ''})); // Empty row
                        
                },
        error: function(){ console.log("Error in getting Regional ops managers lookup data"); console.log(error); }
});

var service_delivery_managers = [];
$.ajax({
        url: "/teams/ops/pidb/_api/web/lists/getbytitle('patrol_basic')/items?$select PatrolFirstName,PatrolLastName,EmailID,CostCentre,PatrolManagerEtxt&$Filter=PatrolJobRole eq 'Patrol Manager'&$top=1000",
        type: "GET",
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
        success: function(data){
                $.each(data.d.results, function(index, item){
                        var service_manager_name =  item.PatrolFirstName+' '+item.PatrolLastName;
                        service_delivery_managers.push([service_manager_name,item.CostCentre,item.EmailID,item.PatrolManagerEtxt]);
                        $('#patrol-service-delivery-manager').append($('<option>',{ value:service_manager_name,text : service_manager_name}));
                        $('#patrol-detail-new-basic #patrol-service-delivery-manager').append($('<option>',{ value:service_manager_name,text : service_manager_name}));
                        });
                        $('#patrol-detail-new-basic #patrol-service-delivery-manager').append($('<option>',{ value:'none',text : ''})); // Empty row
                        $('#patrol-detail-view-basic #patrol-service-delivery-manager').append($('<option>',{ value:'none',text : ''})); // Empty row
                },
        error: function(){ console.log("Error in getting Service Delivery managers lookup data"); console.log(error); }
});

$.ajax({
        url: "/teams/ops/pidb/_api/web/lists/getbytitle('masterdata')/items?$select Value&$Filter=Title eq 'ServiceDeliveryManagerArea'&$top=1000",
        type: "GET",
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
        success: function(data){
                $.each(data.d.results, function(index, item){
                        $('#patrol-detail-new-basic #patrol-service-delivery-manager-area2').append($('<option>',{ value:item.Value,text : item.Value}));
                        $('#patrol-detail-view-basic #patrol-service-delivery-manager-area2').append($('<option>',{ value:item.Value,text : item.Value}));
                        });
                        $('#patrol-detail-new-basic #patrol-service-delivery-manager-area2').append($('<option>',{ value:'none',text : ''})); // Empty row
                        $('#patrol-detail-view-basic #patrol-service-delivery-manager-area2').append($('<option>',{ value:'none',text : ''})); // Empty row
                },
        error: function(){ console.log("Error in getting Service Delivery managers area lookup data"); console.log(error); }
});


var lead_patrol_managers = [];
$.ajax({
        url: "/teams/ops/pidb/_api/web/lists/getbytitle('patrol_basic')/items?$select PatrolFirstName,PatrolLastName,EmailID,CostCentre&$Filter=PatrolJobRole eq 'Lead Patrol'&$top=1000",
        type: "GET",
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
        success: function(data){
                $.each(data.d.results, function(index, item){
                        var lead_patrol_manager_name =  item.PatrolFirstName+' '+item.PatrolLastName;
                        lead_patrol_managers.push([lead_patrol_manager_name,item.CostCentre,item.EmailID]);
                        $('#patrol-team-manager').append($('<option>',{ value:lead_patrol_manager_name,text : lead_patrol_manager_name}));
                        $('#patrol-detail-new-basic #patrol-team-manager').append($('<option>',{ value:lead_patrol_manager_name,text : lead_patrol_manager_name}));
                        });
                        $('#patrol-detail-new-basic #patrol-team-manager').append($('<option>',{ value:'none',text : ''})); // Empty row
                        $('#patrol-detail-view-basic #patrol-team-manager').append($('<option>',{ value:'none',text : ''})); // Empty row
                },
        error: function(){ console.log("Error in getting Lead Parol managers lookup data"); console.log(error); }
});

function myErrorHandler(data, errCode, errMessage){ alert("Error: " + errMessage + " "+errCode); } 
function myErrorHandlerVehicle(data, errCode, errMessage){ alert("Error: " + errMessage + " "+errCode); } 

var patrol_forename;
var patrol_lastname;
var patrol_callsign;
var patrol_payroll_no;

function mySuccessHandler(data){        // AJAX Call 1 Success Handler

$('#patrol').find('img').find('loading').remove();
$('#patrol').html(curr_html);

table = $('#patrol').DataTable({
		"aaData": data.d.results,
		"aoColumns": [{
		"className": 'details-control',
		"orderable":      false,
		"data":           null,
		"defaultContent": ''
		}, {	
            "mData": "PatrolName"
        }, {
            "mData": "PatrolJobRole"
        }, {
            "mData": "PatrolPayrollNo"
        }, {
            "mData": "Title"
        }, {
            "mData": "PatrolMobileNo"
        }, {
            "mData": "Region"
        }, {
            "mData": "CellNo"
        }, {
            "mData": "CellType"
        }, {
            "mData": "PatrolCluster"
        }, {
            "mData": "PatrolManager"
        }, {
            "mData": "LeadPatrol"
        }, {
            "mData": "ContractType"  
        }, {
            "mData": "CostCentre"
        }, {
            "mData": "RegionalManager"                  
        }],
		"aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"select": true,
//		"deferRender": true,
		"colReorder": true,
		"stateSave":  true,
		"order": [[1, 'asc']]
		}); // DataTable() closing..

$('select[name="patrol_length"]').css('margin-left','91px');

$('#patrol tbody').on('click', 'td.details-control', function () {
    var tr = $(this).closest('tr');
        var row = table.row( tr );
        
        var idsa = row.data();
        var callsign = idsa["Title"];
        
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child(format(callsign)).show();
            tr.addClass('shown');
            $('.display-vehicle-id').on('click',function() { 

            el = document.getElementById("pidb_overlay");
            el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
            $('#quick-vehicle-detail-view').find('input.locked').prop('disabled',true);
            $('#quick-vehicle-detail-view').toggle();
            vehicle_number = $(this).text();
            console.log(vehicle_number);
            getFullVehicleDetails(callsign,vehicle_number);
            });
    }
    } );

$('#patrol tbody').on( 'click', 'tr', function () { 
    if ( $(this).hasClass('selected') ) {
        $(this).removeClass('selected'); 
            }else{ 
                table.$('tr.selected').removeClass('selected'); 
                    $(this).addClass('selected');
                        }
});

$('#patrol tbody').not('td.details-control').on('dblclick','tr',function() { 

var tableData = table.row($(this)).data();


//toggle patrol view
el = document.getElementById("pidb_overlay");
el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";

$('#patrol-detail-view').toggle();

//set first tab active
$('#main-tabs-patrol').tabs( "option", "active", 0 );

//reset all fields

        /*$('#patrol-detail-view-basic').find('input').val('');
        $('#patrol-detail-view-basic').find('select').val('');
        $('#patrol-detail-view-personal').find('input[type="text"]').val('');
        $('#patrol-detail-view-personal').find('input[type="date"]').val('');
        $('#patrol-detail-view-personal').find('select').val('');*/

//Hide fields based on job role

var AuthorFName = tableData["Author"];
$('#patrol-created').html(tableData["Author"]["FirstName"]+' '+tableData["Author"]["LastName"]+' on '+tableData["Created"].toString().replace("T"," ").replace("Z"," "));
$('#patrol-modified-on').html(tableData["Editor"]["FirstName"]+' '+tableData["Editor"]["LastName"]+' on '+tableData["Modified"].toString().replace("T"," ").replace("Z"," "));
$('#patrol-job-role').val(tableData["PatrolJobRole"]);
$('#patrol-call-sign').val(tableData["Title"]);

patrol_callsign = tableData["Title"];

$('#patrol-payroll-no').val(tableData["PatrolPayrollNo"]);
patrol_payroll_no = tableData["PatrolPayrollNo"]; // set variable value to reuse in personal form

$('#patrol-forename').val(tableData["PatrolFirstName"]);
patrol_forename = tableData["PatrolFirstName"]; // set variable value to reuse in personal form

$('#patrol-lastname').val(tableData["PatrolLastName"]);
patrol_lastname = tableData["PatrolLastName"]; // set variable value to reuse in personal form

$('#patrol-mobile-no').val(tableData["PatrolMobileNo"]);
$('#patrol-email-address').val(tableData["EmailID"]);
$('#patrol-service-delivery-manager-area2').val(tableData["PatrolManagerEtxt"]);
$('#patrol-region').val(tableData["Region"]);
$('#patrol-cell-number').val(tableData["CellNo"]);
$('#patrol-cell-type').val(tableData["CellType"]);
$('#patrol-cluster').val(tableData["PatrolCluster"]);
$('#patrol-agreement-type').val(tableData["ContractType"]);
$('#patrol-resource-planner').val(tableData["ResourcePlanner"]);
$('#patrol-service-delivery-manager-area').val(tableData["PatrolManagerEtxt"]);
$('#patrol-regional-manager').val(tableData["RegionalManager"]);
$('#patrol-regional-manager-cost-center').val(tableData["RegionalManagerCostCentre"]);
//$('#patrol-regional-manager-emailid').val(tableData["EmailID"]); //Lotus notes has notes mail id format. Updated in SharePoint with Outlook email id. Updated as NA if not found.
$.each(regional_managers,function(index,item){
    if (item[0] == tableData["RegionalManager"]) {
        $('#patrol-regional-manager-emailid').val(item[2]);
        return false;
        }
        });

$('#patrol-service-delivery-manager').val(tableData["PatrolManager"]);
$('#patrol-service-delivery-manager-cost-center').val(tableData["PatrolManagerCostCentre"]);

$.each(service_delivery_managers,function(index,item){
    if (item[0] == tableData["PatrolManager"]) {
        $('#patrol-service-delivery-manager-emailid').val(item[2]);
        return false;
        }
        });

        
$('#patrol-team-manager').val(tableData["LeadPatrol"]);
$('#patrol-team-manager-cost-center').val(tableData["LeadPatrolCostCentre"]);

$.each(lead_patrol_managers,function(index,item){
    if (item[0] == tableData["LeadPatrol"]) {
        $('#patrol-team-manager-emailid').val(item[2]);
        return false;
        }
        });

        
if (tableData["AccessToMotorCycle"] == "Yes") {
    $('#patrol-access-to-motorcycle-yes').prop('checked',true);
}
    else {
        $('#patrol-access-to-motorcycle-no').prop('checked',true);
    }
    
if (tableData["AccessToTrailer"] == "Yes") {
    $('#patrol-access-to-trailer-yes').prop('checked',true);
}
    else {
        $('#patrol-access-to-trailer-no').prop('checked',true);
    }

if (tableData["LightDuties"] == "Yes") {
    $('#patrol-light-duties-yes').prop('checked',true);
}
    else {
        $('#patrol-light-duties-no').prop('checked',true);
    }
  
$('#patrol-in-active-duty').val([tableData["InActiveDuty"]]);
$('#patrol-ag-id').val(tableData["AG_ID"]);
//$('#idy26').val(tableData["Xcoordinate"]);
//$('#idy27').val(tableData["Ycoordinate"]);
$('#patrol-dispatch-group').val(tableData["DGroup"]);
//$('#idy29').val(tableData["MealBreak"]);


// capture data for checkChange() function
tableDataArray = [];

$.each(tableData,function(index, item){
    if ( index != "__metadata" && index != "Author" && index != "Editor" )
    {
                        tableDataArray.push([index,item]);
    }
    });


// disable few form elements by default 
$('#patrol-form').find('td').each(function()
                                {
                                    $(this).find('input').prop('disabled',true);
                                    $(this).find('textarea').prop('disabled',true);
                                    $(this).find('select').prop('disabled',true);
                                });

$('#patrol-form-personal').find('td').each(function()
                                {
                                    $(this).find('input').prop('disabled',true);
                                    $(this).find('textarea').prop('disabled',true);
                                    $(this).find('select').prop('disabled',true);
                                });

if (IsPatrolSUser) //disable personal tab for visitors/Fleet Managers/Patrol Support User/General Users
        {
            console.log("User not authorized to view personal information");
            $('#patrol-form-view-personal').css("display","none");
            $('#main-tabs-patrol').tabs("option","disabled",[1]);
        }
        else
        if (IsReadOnly) {
            console.log("User not authorized to edit any information");
            $('#patrol-form-view-personal').css("display","none");
            $('#patrol-form-edit').css("display","none");
            $('#main-tabs-patrol').tabs("option","disabled",[1]);
        }else                // For authorized users, disable personal tab initially and activate on button click
        {   
            $('#main-tabs-patrol').tabs("option","disabled",[1]);
        }
        // Make all fields visible except SDM Area
        $('#patrol-detail-view').find('tr').css('visibility','visible');
        $('.sdmonly').css('visibility','hidden');
        
        


var selection = $('#patrol-detail-view-basic #patrol-job-role option:selected').val();
                $.each(role_matrix, function(index, value) {
                    if (selection == role_matrix[index][0]) {
                        $('#patrol-detail-view-basic').find('tr').css('visibility','visible');
                        $('#patrol-detail-view-basic').find('tr.separator').css('visibility','visible');
                        $.each(value, function(index1, value1) {
                            var elementName = role_matrix[index][index1];
                            $('#patrol-detail-view-basic #'+elementName).closest('tr').css('visibility','hidden');
                            $('#patrol-detail-view-basic #errorbox-'+elementName).remove();
                            $('#patrol-detail-view-basic').find('tr.separator').css('visibility','hidden');
                        });
                        return false;
                    }else {
                        $('#patrol-detail-view-basic').find('tr').css('visibility','visible');
                        $('#patrol-detail-view-basic').find('tr.separator').css('visibility','visible');
                    }
                });
}); // patrol tbody dblclick closing

$('#patrol-detail-view-basic #patrol-job-role').on('change',function(){});
$('#patrol-detail-new-basic #patrol-job-role').on('change',function(){});

$('#patrol-detail-view-basic #patrol-regional-manager').on('change',function(){
        var current_regional_manager = $(this).val();
        
        if (current_regional_manager == "none") {
            $('#patrol-detail-view-basic  #patrol-regional-manager-cost-center').val("");
            $('#patrol-detail-view-basic  #patrol-regional-manager-emailid').val("");
        }else {
        
        $.each(regional_managers,function(index,data){
                    if (data[0] == current_regional_manager) {
                        var rmconstcenter = data[1];
                        var rmemailid  = data[2];
                    $('#patrol-detail-view-basic  #patrol-regional-manager-cost-center').val(rmconstcenter);
                    $('#patrol-detail-view-basic  #patrol-regional-manager-emailid').val(rmemailid);
                    }
                    });
        $('#errorbox-patrol-regional-manager').remove();
        $('#errorbox-patrol-regional-manager-cost-center').remove();
        $('#errorbox-patrol-regional-manager-emailid').remove();
        
        }
    });

$('#patrol-detail-view-basic #patrol-team-manager').on('change',function(){
        var current_patrol_lead_manager = $(this).val();
        
        if (current_patrol_lead_manager == "none") {
                    $('#patrol-detail-view-basic  #patrol-team-manager-cost-center').val("");
                    $('#patrol-detail-view-basic  #patrol-team-manager-emailid').val("");
        }else {
        
        $.each(lead_patrol_managers,function(index,data){
                    if (data[0] == current_patrol_lead_manager) {
                        var lpmconstcenter = data[1];
                        var lpmemailid = data[2];
                    $('#patrol-detail-view-basic  #patrol-team-manager-cost-center').val(lpmconstcenter);
                    $('#patrol-detail-view-basic  #patrol-team-manager-emailid').val(lpmemailid);
                    }
                    });
        $('#errorbox-patrol-team-manager').remove();
        $('#errorbox-patrol-team-manager-cost-center').remove();
        $('#errorbox-patrol-team-manager-emailid').remove();
        }
    });    
    
$('#patrol-detail-view-basic  #patrol-service-delivery-manager').on('change',function(){
        var current_service_d_manager = $(this).val();
        
        if (current_service_d_manager == "none") {
                    $('#patrol-detail-view-basic  #patrol-service-delivery-manager-cost-center').val("");
                    $('#patrol-detail-view-basic  #patrol-service-delivery-manager-emailid').val("");
                    $('#patrol-detail-view-basic  #patrol-service-delivery-manager-area').val("");
        }else {
        
        $.each(service_delivery_managers,function(index,data){
                    if (data[0] == current_service_d_manager) {
                        var sdmconstcenter = data[1];
                        var sdmemailid = data[2];
                        var sdmarea = data[3];
                    $('#patrol-detail-view-basic  #patrol-service-delivery-manager-cost-center').val(sdmconstcenter);
                    $('#patrol-detail-view-basic  #patrol-service-delivery-manager-emailid').val(sdmemailid);
                    $('#patrol-detail-view-basic  #patrol-service-delivery-manager-area').val(sdmarea);
                    }
                    });
        $('#errorbox-patrol-service-delivery-manager').remove();
        $('#errorbox-patrol-service-delivery-cost-center').remove();
        $('#errorbox-patrol-service-delivery-emailid').remove();
        $('#errorbox-patrol-service-delivery-area').remove();
        }
    });    
    
$('#patrol-cell-number').on('change',function()
                            {
                                var current_cellnumber = $('#patrol-cell-number option:selected').val();
                                
                                if ($('#patrol-cell-number option:selected').val().length > 0 ) {
                                    $('#errorbox-patrol-cell-number').remove();

                                    $.each(cellnumbers,function(index,data){
                                    if (data[0] == current_cellnumber)
                                    {
                                        dispatchgroup = data[1];
                                        cluster = data[2];
                                        celltype = data[3];
                                        regioncode = data[4];
                                        
                                        $('#patrol-region').val(regioncode);
                                        $('#patrol-cell-type').val(celltype);
                                        $('#patrol-cluster').val(function()
                                                                { if(cluster != "" )
                                                                    {
                                                                        $('#errorbox-patrol-cluster').remove();
                                                                            return cluster;
                                                                    }
                                                                });
                                        $('#patrol-dispatch-group').val(dispatchgroup);
                                    }});
                                }
                            });

$('#patrol-detail-new-basic #patrol-cell-number').on('change',function()
                            {
                                var current_cellnumber = $('#patrol-detail-new-basic #patrol-cell-number option:selected').val();
                                
                                if ($('#patrol-cell-number option:selected').val().length > 0 ) {
                                    $('#errorbox-patrol-cell-number').remove();
                                    
                                    $.each(cellnumbers,function(index,data){
                                        if (data[0] == current_cellnumber)
                                        {
                                            dispatchgroup = data[1];
                                            cluster = data[2];
                                            celltype = data[3];
                                            regioncode = data[4];
                                            
                                            $('#patrol-detail-new-basic #patrol-region').val(regioncode);
                                            $('#patrol-detail-new-basic #patrol-cell-type').val(celltype);
                                            $('#patrol-detail-new-basic #patrol-cluster').val(cluster);
                                            $('#patrol-detail-new-basic #patrol-dispatch-group').val(dispatchgroup);
                                            
                                            $('#patrol-detail-new-basic #errorbox-patrol-cell-number').remove();
                                            $('#patrol-detail-new-basic #errorbox-patrol-region').remove();
                                            $('#patrol-detail-new-basic #errorbox-patrol-cell-type').remove();
                                            $('#patrol-detail-new-basic #errorbox-patrol-cluster').remove();
                                            $('#patrol-detail-new-basic #errorbox-patrol-dispatch-group').remove();
                                        }});
                                }
                            });

$('#patrol-detail-new-basic #patrol-regional-manager, #patrol-detail-new-basic #patrol-service-delivery-manager, #patrol-detail-new-basic #patrol-team-manager').on('change',function()
                            {
                                var elementid = $(this).attr('id');
                                var manager_name = $(this).val();
                                if (elementid == "patrol-regional-manager") {
                                    $.each(regional_managers,function(index,data){
                                        if (data[0] == manager_name) {
                                        managercostcenter = data[1];
                                        manageremail = data[2];
                                        
                                        $('#patrol-detail-new-basic #patrol-regional-manager-cost-center').val(managercostcenter);
                                        $('#patrol-detail-new-basic #patrol-regional-manager-emailid').val(manageremail);
                                        
                                        
                                        $('#patrol-detail-new-basic #errorbox-patrol-regional-manager').remove();
                                        $('#patrol-detail-new-basic #errorbox-patrol-regional-manager-cost-center').remove();
                                        $('#patrol-detail-new-basic #errorbox-patrol-regional-manager-emailid').remove();
                                        }
                                        });
                                    
                                }
                                if (elementid == "patrol-service-delivery-manager") {
                                    $.each(service_delivery_managers,function(index,data){
                                    if (data[0] == manager_name) {
                                        managercostcenter = data[1];
                                        manageremail = data[2];
                                        managerarea = data[3];
                                        $('#patrol-detail-new-basic #patrol-service-delivery-manager-cost-center').val(managercostcenter);
                                        $('#patrol-detail-new-basic #patrol-service-delivery-manager-emailid').val(manageremail);
                                        $('#patrol-detail-new-basic #patrol-service-delivery-manager-area').val(managerarea);

                                        $('#patrol-detail-new-basic #errorbox-patrol-service-delivery-manager').remove();
                                        $('#patrol-detail-new-basic #errorbox-patrol-service-delivery-manager-cost-center').remove();
                                        $('#patrol-detail-new-basic #errorbox-patrol-service-delivery-manager-emailid').remove();
                                        }
                                    });
                                }
                                if (elementid == "patrol-team-manager") {
                                    $.each(lead_patrol_managers,function(index,data){
                                    if (data[0] == manager_name) {
                                        managercostcenter = data[1];
                                        manageremail = data[2];
                                        $('#patrol-detail-new-basic #patrol-team-manager-cost-center').val(managercostcenter);
                                        $('#patrol-detail-new-basic #patrol-team-manager-emailid').val(manageremail);
                                        
                                        $('#patrol-detail-new-basic #errorbox-patrol-team-manager').remove();
                                        $('#patrol-detail-new-basic #errorbox-patrol-team-manager-cost-center').remove();
                                        $('#patrol-detail-new-basic #errorbox-patrol-team-manager-emailid').remove();
                                        }
                                    });
                                }
                            });
                            
$('#patrol-form-update').attr('disabled','disabled');

// Code to check current usergroup and set personal tab state



function ValidateForEmpty(divbodyid){

var retvalue;
// Get active tab information and disable other tab during updation

 if ($("[aria-controls='"+divbodyid+"']").hasClass('ui-state-disabled')) {
    console.log(divbodyid+" Tab is disabled & hence not verified for changes");
    retvalue = 1;
    return retvalue;
 }else {
    
    //patrol-detail-view-basic
        var tposition = 0;
        var lposition = 0;
        var flposition = 0;
        var errorboxtype;
    
   //Validate if Payroll no. is 6 digits only

   $('#'+divbodyid+' .required').each(function(){
    //inputlength = $(this).val().length;
    inputlength = $(this).val();
    if (inputlength == null) {
        inputlength = 0;
    }else {
    inputlength = $(this).val().length;
    console.log("Element "+$(this).attr('id')+" has length: "+inputlength);
    }
    
    if ( (inputlength == 0 || $(this).val() == "none" ) && $(this).css('visibility') != "hidden" ) {
            console.log($(this).attr('id')+" is Empty");
            tposition = $(this).position().top;
            lposition = $(this).position().left;
            flposition = parseInt($(this).css('width')) + parseInt(lposition) + 15;
            

            if (flposition >= 950) {
                flposition = 950;
                tposition = parseInt(tposition) + parseInt("30");
                errorboxtype = "errorbox-top";
            }
                else
            {
                errorboxtype = "errorbox-left";
            }

            thisid = $(this).attr('id');
            thiselement = "errorbox-"+thisid;
            if ( $("#"+thiselement).length == 0)
            {
            $("<div class='"+errorboxtype+"' id='errorbox-"+$(this).attr('id')+"' style='left:"+ flposition +"px; top:"+tposition+"px'>This field can not be blank</div>").appendTo( $('#'+divbodyid) );
            }         
            }
         
         if (inputlength < 6 && $(this).attr('id') == "patrol-payroll-no" )
         {
            tposition = $(this).position().top;
            lposition = $(this).position().left;
            flposition = 210 + lposition;
            
            if (flposition >= 950) {
                flposition = 950;
                tposition = tposition + 30;
                errorboxtype = "errorbox-top";
            }else {
                errorboxtype = "errorbox-left";
            }
            
            thisid = $(this).attr('id');
            thiselement = "errorbox-"+thisid;
            if ( $("#"+thiselement).length == 0)
            {
            $("<div class='"+errorboxtype+"' id='errorbox-"+$(this).attr('id')+"' style='left:"+ flposition +"px; top:"+tposition+"px'>Payroll no can not be lesser than 6 digits</div>").appendTo( $('#'+divbodyid) );
            }
         }
    });
    retvalue = 0;
    return retvalue;
    }
}

    $('.required').on('keypress',function(){
        $('#errorbox-'+$(this).attr('id')).remove();
        });

    
$('.form-button').on('click',function(){
            var buttonid = $(this).attr('id');
                if (buttonid == "patrol-form-edit" && (IsAdmin || IsPatrolSManager) )
                { // Access to edit only for specific group (Admin & Patrol Support Manager)
                    $(this).prop('disabled',true);
                    $('#patrol-form-update').prop('disabled',false);
                    //enable all text fields for change
                    $('#patrol-form').find('td').each(function()
                                {
                                    $(this).find('input').not('.locked').prop('disabled',false);
                                    $(this).find('textarea').prop('disabled',false);
                                    $(this).find('select').prop('disabled',false);
                                    $(this).find('input.locked').css('background-color','#f2f2f2');
                                });
                    $('#patrol-form-personal').find('td').each(function()
                                {
                                    $(this).find('input').not('.locked').prop('disabled',false);
                                    $(this).find('textarea').prop('disabled',false);
                                    $(this).find('select').prop('disabled',false);
                                    $(this).find('input.locked').css('background-color','#f2f2f2');
                                    
                                });
                }
                else
                {
                    if (buttonid == "patrol-form-edit" &&  IsPatrolSUser )
                            {
                                $('#patrol-form-update').prop('disabled',false);
                                $('#patrol-form').find('td').each(function()
                                    {
                                        $(this).find('input').prop('disabled',false);
                                        $(this).find('textarea').prop('disabled',false);
                                        $(this).find('select').prop('disabled',false);
                                        $(this).find('input.locked').css('background-color','#f2f2f2');
                                    });
                            }
                }    
                
                if (buttonid == "patrol-form-cancel")
                {
                                    
                                                    /*$('.patrol-key-column').each(function(){
                                                    $(this).css("background","white");
                                                    $(this).css("border","solid 1px #ABABAB");
                                                    });*/
                                    el = document.getElementById("pidb_overlay");
                                    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
                            
                                    $('#patrol-form-update').prop('disabled',true);
                                    $('#patrol-form-edit').prop('disabled',false);
                                    $('.errorbox-top').each(function(){$(this).remove();}); // remove all errorbox
                                    $('.errorbox-left').each(function(){$(this).remove();}); // remove all errorbox
                                    
                                    $('#patrol-detail-view').toggle();
                }
                else
                {
                    
                }
                
                if (buttonid == "patrol-form-update")
                {
                   //New code
                    //$('#main-tabs-patrol').tabs("option","active",0);
                        var patrol_basic_ret_value = ValidateForEmpty('patrol-detail-view-basic');
                      //      $('#main-tabs-patrol').tabs("option","active",1);
                        var patrol_personal_ret_value = ValidateForEmpty('patrol-detail-view-personal');
                            
                            
                            var first_left_element = $('#main-tabs-patrol').find('.errorbox-left').length;
                            if (first_left_element > 0 )
                            {
                                first_left_element = $('#main-tabs-patrol').find('.errorbox-left').first().attr('id').split('errorbox-')[1];
                            var first_left_element_tab_name = $('#main-tabs-patrol').find('.errorbox-left').first().parent().closest('div.ui-tabs-panel').attr('id');
                            }
                            
                            var first_top_element = $('#main-tabs-patrol').find('.errorbox-top').length;
                            
                            if (first_top_element > 0) {
                                first_top_element = $('#main-tabs-patrol').find('.errorbox-top').first().attr('id').split('errorbox-')[1];
                            var first_top_element_tab_name = $('#main-tabs-patrol').find('.errorbox-top').first().parent().closest('div.ui-tabs-panel').attr('id');    
                            }
                            
                            if ( (first_left_element > 0) )
                            {
                                
                                console.log("Element tab is "+first_left_element_tab_name);

                                    if(first_left_element_tab_name == "patrol-detail-view-basic"){
                                                
                                                $('#main-tabs-patrol').tabs("option","active",0);
                                                $('#'+first_left_element_tab_name+' #'+first_left_element).focus();

                                    }else {

                                                $('#main-tabs-patrol').tabs("option","active",1);
                                                $('#'+first_left_element_tab_name+' #'+first_left_element).focus();
                                    }
                            }
                            else
                            {
                                if ( (first_top_element > 0) )
                                {
                                    console.log("Element tab is "+first_top_element_tab_name);
                                    if(first_top_element_tab_name == "patrol-detail-view-personal"){
                                                
                                                $('#main-tabs-patrol').tabs("option","active",0);
                                                $('#'+first_top_element_tab_name+' #'+first_top_element).focus();

                                    }else {

                                                $('#main-tabs-patrol').tabs("option","active",1);
                                                $('#'+first_top_element_tab_name+' #'+first_top_element).focus();
                                    }
                                }
                            }
                        //console.log("About to update record outer");
                        // Validate if there are any errorbox else proceed with update task
    if ( ( ($('#patrol-detail-view').find('.errorbox-left').length == 0) && (   $('#patrol-detail-view').find('.errorbox-top').length == 0) ) && (IsAdmin || IsPatrolSUser ))
    {
                            //console.log("About to update record inner");
                            if (patrol_basic_ret_value == 0  && !$("[aria-controls='patrol-detail-view-basic']").hasClass('ui-state-disabled')) {
                            checkchanges('patrol-detail-view-basic');
                            Update('Patrol_Basic' , finalItemString);
                            }
                            
                            if (patrol_personal_ret_value == 0 && !$("[aria-controls='patrol-detail-view-personal']").hasClass('ui-state-disabled') ){
                            checkchanges('patrol-detail-view-personal');
                            Update('Patrol_Personal' , finalItemString);
                            }
                        }
                        
                                        
                    }
                
                if (buttonid == "patrol-form-view-personal") {
                        // Create an Ajax call using call sign & show values in personal tab
                        var payrollno = $('#patrol-payroll-no').val();
                        viewpersonalinfo( payrollno );
                        $('#main-tabs-patrol').tabs( "enable", 1 );
                        $('#main-tabs-patrol').tabs( "option", "active", 1 );
                        
                    }
                if (buttonid == "patrol-form-new-cancel"){
                $('#patrol-detail-new').toggle();


                    el = document.getElementById("pidb_overlay");
                    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";                
                }
                if (buttonid == "patrol-form-new-personal")
                {
                        pfname =    $('#patrol-detail-new-basic #patrol-forename').val().length;
                        psname =    $('#patrol-detail-new-basic #patrol-lastname').val().length;
                        pcallsign = $('#patrol-detail-new-basic #patrol-call-sign').val().length;
                        ppayrollno  = $('#patrol-detail-new-basic #patrol-payroll-no').val().length;
                        pjobrole =  $('#patrol-detail-new-basic #patrol-job-role option:selected').val();
                            if ( pfname <= 0){
                                alert("Forename can not be blank");
                                $('#patrol-detail-new-basic #patrol-forename').focus();
                                return false;
                                }else
                                {
                                    if ( psname <= 0) {
                                            alert("Surname can not be blank");
                                            $('#patrol-detail-new-basic #patrol-surname').focus();
                                            return false;
                                            }else
                                            {
                                                if ( pcallsign <= 0 && ( pjobrole != "Regional Operations Manager" && pjobrole != "Service Delivery Manager") ) {
                                                        alert("Call Sign can not be blank");
                                                        $('#patrol-detail-new-basic #patrol-call-sign').focus();
                                                        return false;
                                                }else {
                                                if (ppayrollno <= 0) {
                                                        alert("Payroll number can not be blank");
                                                        $('#patrol-detail-new-basic #patrol-payroll-no').focus();
                                                        return false;
                                                    }
                                                else
                                                {
                                                    $('#main-tabs-patrol-new').tabs( "enable", 1 );
                                                    $('#main-tabs-patrol-new').tabs( "option", "active", 1 );
                                                }
                                        }
                                            }
                                }
                }
                if (buttonid == "patrol-form-new-submit"){
                    
                    var patrol_basic_ret_value = ValidateForEmpty('patrol-detail-new-basic');
                        var patrol_personal_ret_value = ValidateForEmpty('patrol-detail-new-personal');
                                    
                            /*var first_left_element = $('#main-tabs-patrol-new').find('.errorbox-left').first().attr('id').split('errorbox-')[1];
                            var first_left_element_tab_name = $('#main-tabs-patrol-new').find('.errorbox-left').first().parent().closest('div.ui-tabs-panel').attr('id');
                            var first_top_element = $('#main-tabs-patrol-new').find('.errorbox-top').first().attr('id').split('errorbox-')[1];
                            var first_top_element_tab_name = $('#main-tabs-patrol-new').find('.errorbox-top').first().parent().closest('div.ui-tabs-panel').attr('id');
                            

                            if (first_left_element.length != 0)
                            {
                                
                                console.log("Element tab is "+first_left_element_tab_name);

                                    if(first_left_element_tab_name == "patrol-detail-new-basic"){
                                                
                                                $('#main-tabs-patrol-new').tabs("option","active",0);
                                                $('#'+first_left_element_tab_name+' #'+first_left_element).focus();

                                    }else {

                                                $('#main-tabs-patrol-new').tabs("option","active",1);
                                                $('#'+first_left_element_tab_name+' #'+first_left_element).focus();
                                    }
                            }
                            else
                            {
                                if (first_top_element.length != 0)
                                {
                                    console.log("Element tab is "+first_top_element_tab_name);
                                    if(first_top_element_tab_name == "patrol-detail-new-personal"){
                                                
                                                $('#main-tabs-patrol-new').tabs("option","active",0);
                                                $('#'+first_top_element_tab_name+' #'+first_top_element).focus();

                                    }else {

                                                $('#main-tabs-patrol-new').tabs("option","active",1);
                                                $('#'+first_top_element_tab_name+' #'+first_top_element).focus();
                                    }
                                }
                            */
                            
                            var first_left_element = $('#main-tabs-patrol').find('.errorbox-left').length;
                            if (first_left_element > 0 )
                            {
                                first_left_element = $('#main-tabs-patrol').find('.errorbox-left').first().attr('id').split('errorbox-')[1];
                            var first_left_element_tab_name = $('#main-tabs-patrol').find('.errorbox-left').first().parent().closest('div.ui-tabs-panel').attr('id');
                            }
                            
                            var first_top_element = $('#main-tabs-patrol').find('.errorbox-top').length;
                            
                            if (first_top_element > 0) {
                                first_top_element = $('#main-tabs-patrol').find('.errorbox-top').first().attr('id').split('errorbox-')[1];
                            var first_top_element_tab_name = $('#main-tabs-patrol').find('.errorbox-top').first().parent().closest('div.ui-tabs-panel').attr('id');    
                            }
                            
                            if ( (first_left_element > 0) )
                            {
                                
                                console.log("Element tab is "+first_left_element_tab_name);

                                    if(first_left_element_tab_name == "patrol-detail-new-basic"){
                                                
                                                $('#main-tabs-patrol').tabs("option","active",0);
                                                $('#'+first_left_element_tab_name+' #'+first_left_element).focus();

                                    }else {

                                                $('#main-tabs-patrol').tabs("option","active",1);
                                                $('#'+first_left_element_tab_name+' #'+first_left_element).focus();
                                    }
                            }
                            else
                            {
                                if ( (first_top_element > 0) )
                                {
                                    console.log("Element tab is "+first_top_element_tab_name);
                                    if(first_top_element_tab_name == "patrol-detail-new-personal"){
                                                
                                                $('#main-tabs-patrol').tabs("option","active",0);
                                                $('#'+first_top_element_tab_name+' #'+first_top_element).focus();

                                    }else {

                                                $('#main-tabs-patrol').tabs("option","active",1);
                                                $('#'+first_top_element_tab_name+' #'+first_top_element).focus();
                                    }
                                }
                            }
                            
                            
                            
                            
                            
if ( ( ($('#patrol-detail-new').find('.errorbox-left').length == 0) && (   $('#patrol-detail-new').find('.errorbox-top').length == 0) ) && (IsAdmin || IsPatrolSUser ))
    {
                            //console.log("About to update record inner");
                            if (patrol_basic_ret_value == 0 && !$("[aria-controls='patrol-detail-new-basic']").hasClass('ui-state-disabled')) {
                            
                            prepareDataForAdd('patrol-detail-new-basic');
                            Add('Patrol_Basic' , finalItemString2);
                            }
                            
                            if (patrol_personal_ret_value == 0 && !$("[aria-controls='patrol-detail-new-personal']").hasClass('ui-state-disabled')){
                            
                            prepareDataForAdd('patrol-detail-new-personal');
                            console.log(finalItemString2);
                            Add('Patrol_Personal' , finalItemString2);
                            }
                        }
                }
                
                if (buttonid == "patrol-form-new-cancel"){
                    
                        $('.errorbox-top').each(function(){$(this).remove();}); // remove all errorbox
                        $('.errorbox-left').each(function(){$(this).remove();}); // remove all errorbox
                        
                }
                if((buttonid == "vehicle-detail-tab-assign") && (IsFleetManager || IsAdmin))
                {
                    var el_assign = document.getElementById("pidb_overlay_assign");
                        el_assign.style.visibility = (el_assign.style.visibility == "visible") ? "hidden" : "visible";
                        $('#Main_Assign').toggle();
                        $('#Main_Assign1').hide();
                        $('#assign-vehicle-div').html("<center><img class='loading' src='/teams/Ops/PIDB/Shared Documents/images/pidb-loading.gif'></img></center>");
                        setTimeout(loadtableAssign,500);
                }

                if (buttonid == "vehicle-detail-tab-cancel")
                { 
                        el = document.getElementById("pidb_overlay");
                        el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
                            $('.errorbox-top').each(function(){$(this).remove();}); // remove all errorbox
                            $('.errorbox-left').each(function(){$(this).remove();}); // remove all errorbox
                            $('#vehicle-detail-view').toggle(); 
                }
                
                if (buttonid== "vehicle-detail-tab-edit")
                {
                    $('#vehicle-tab-view').find('td').each(function()
                                                {
                                                    $(this).find('input').not('.readonly').prop('disabled',false);
                                                    $(this).find('textarea').prop('disabled',false);
                                                    $(this).find('select').prop('disabled',false);
                                                    $(this).find('input.readonly').css('background-color','#f2f2f2');
                                                });
                }

                if (buttonid == "vehicle-detail-tab-update")
                {
                       ValidateForEmpty('main-tabs-vehicle-view');
                        if (!$(".errorbox-left")[0] && !$(".errorbox-left")[0])
                            {
                                checkvehiclechanges('main-tabs-vehicle-view');
                                Update('Vehicles' , finalItemStringVehicle);
                                 //Update('Vehicles');
                            }
                }
                if (buttonid == "add-new-vehicle-cancel") {
                    el = document.getElementById("pidb_overlay");
                    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
                    $('.errorbox-top').each(function(){$(this).remove();}); // remove all errorbox      //newest
                    $('.errorbox-left').each(function(){$(this).remove();}); // remove all errorbox     //newest
                    $('#add-new-vehicle').toggle();
                }
                if (buttonid == "add-new-vehicle-submit")  //new code
            {   
                    ValidateForEmpty('add-new-vehicle');
                    
            if (!$(".errorbox-left")[0] && !$(".errorbox-top")[0])
                {        
                     Getnewvehiclevalues();
                }
            }
});

function Getnewvehiclevalues()
                {
                    regno  =  $('#add-new-vehicle #vt-reg-no').val();   
                    vehcilestatus  =  $('#add-new-vehicle #vt-vehcile-status').val();
                    vehcilelocation  =  $('#add-new-vehicle #vt-vehcile-location').val();
                    othervehiclelocation  =  $('#add-new-vehicle #vt-other-vehicle-location').val();
                    furtherlocationdetails  =  $('#add-new-vehicle #vt-further-location-details').val();
                    vehicleleasesupplier  =  $('#add-new-vehicle #vt-vehicle-lease-supplier').val();
                    leasestartdate  =  $('#add-new-vehicle #vt-lease-start-date').val();
                    leaseenddate  =  $('#add-new-vehicle #vt-lease-end-date').val();
                    vehicletype  =  $('#add-new-vehicle #vt-vehicle-type').val();
                    othervehicletype  =  $('#add-new-vehicle #vt-other-vehicle-type').val();
                    cadmask  =  $('#add-new-vehicle #vt-cad-mask').val();
                    unittype  =  $('#add-new-vehicle #vt-unit-type').val();
                    symnum  =  $('#add-new-vehicle #vt-symnum').val();
                    trailertype  =  $('#add-new-vehicle #vt-trailer-type').val();
                    othertrailertype  =  $('#add-new-vehicle #vt-other-trailer-type').val(); 
                    historyofvehicle  =  $('#add-new-vehicle #vt-history-of-vehicle').val(); 
                    terminationdate  =  $('#add-new-vehicle #vt-termination-date').val();
                    if (terminationdate.length == 0) {
                      terminationdate = null;  
                    }
                    terminationreason  =  $('#add-new-vehicle #vt-termination-reason').val();
                    otherterminationreason  =  $('#add-new-vehicle #vt-other-termination-reason').val();
                    generalcomments  =  $('#add-new-vehicle #vt-general-comments').val();
                    commentsrestricted  =  $('#add-new-vehicle #vt-comments-restricted').val();
                    trailer  =  $('#add-new-vehicle #vt-trailer').val();
                    trailerenddate  =  $('#add-new-vehicle #vt-trailer-end-date').val();
                    if (trailerenddate.length == 0)
                    {
                       trailerenddate = null; 
                    }                   
                    trailerstatus  =  $('#add-new-vehicle #vt-trailer-status').val();


                addvehicleListItem(regno,vehcilestatus,vehcilelocation,othervehiclelocation,furtherlocationdetails,vehicleleasesupplier,leasestartdate,leaseenddate,vehicletype,othervehicletype,cadmask,unittype,symnum,trailertype,othertrailertype,historyofvehicle,terminationdate,terminationreason,otherterminationreason,generalcomments,commentsrestricted,trailer,trailerenddate,trailerstatus);

            }

                function addvehicleListItem(regno,vehcilestatus,vehcilelocation,othervehiclelocation,furtherlocationdetails,vehicleleasesupplier,leasestartdate,leaseenddate,vehicletype,othervehicletype,cadmask,unittype,symnum,trailertype,othertrailertype,historyofvehicle,terminationdate,terminationreason,otherterminationreason,generalcomments,commentsrestricted,trailer,trailerenddate,trailerstatus)
                {
                    var data = {
                    __metadata: { 'type': 'SP.Data.VehiclesListItem'},
                    Title  : regno,
                    VehicleStatus  : vehcilestatus,
                    VehicleLocation   : vehcilelocation,
                    VehicleLocationOther : othervehiclelocation,
                    FurtherDetails   : furtherlocationdetails, 
                    VehicleLeaseSupplier  : vehicleleasesupplier,
                    LeaseStartDate  : new Date(leasestartdate).toISOString(), 
                    LeaseEndDate  : new Date(leaseenddate).toISOString(), 
                    VehicleType  : vehicletype,
                    VehicleTypeOther  : othervehicletype, 
                    CADMask  : cadmask, 
                    UnitType  : unittype, 
                    Symnum  : symnum, 
                    TrailerType  : trailertype, 
                    VehicleTrailerTypeOther  : othertrailertype, 
                    VehicleHistory  : historyofvehicle,
                    TerminationDate  : new Date(terminationdate).toISOString(), 
                    TerminationReason  : terminationreason, 
                    VehicleTerminationReasonOther  : otherterminationreason, 
                    GeneralComments  : generalcomments, 
                    CommentsRestricted  : commentsrestricted, 
                    VTrailer  : trailer, 
                    TrailerEndDate  : new Date(trailerenddate).toISOString(),
                    TrailerStatus  : trailerstatus
                };
 
                        $.ajax({
                                url: "/teams/ops/pidb/_api/web/lists/getbytitle('Vehicles')/items",
                                    type: "POST",
                                    contentType: "application/json;odata=verbose",
                                    data: JSON.stringify(data),
                                    headers: {
                                        "Accept": "application/json;odata=verbose",
                                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                                    "content-Type": "application/json;odata=verbose"
                                    },
                                    success: function (data) {location.reload(true);},
                                    error: function (error) {console.log(error);}
                                });                   
                }

function loadtableAssign() {     // newcode

var table_Assign;
var Data;

var newtable = '<table id="exampleAssign" class="display compact" cellspacing="0" width="100%" height="100%"><thead><tr><th></th><th>Patrol Name</th><th>Job Role</th><th>Payroll No</th><th>Call Sign</th><th>Mobile No</th><th>Region</th><th>Cell Number</th><th>Cell Type</th><th>Cluster</th><th>Service Delivery Manager</th><th>Patrol Team Manager</th><th>Agreement Type</th><th>Cost Centre</th><th>Regional Operations Manager</th></tr></thead><tfoot><tr><th></th><th>Patrol Name</th><th>Job Role</th><th>Payroll No</th><th>Call Sign</th><th>Mobile No</th><th>Region</th><th>Cell Number</th><th>Cell Type</th><th>Cluster</th><th>Service Delivery Manager</th><th>Patrol Team Manager</th><th>Agreement Type</th><th>Cost Centre</th><th>Regional Operations Manager</th></tr></tfoot>';

//var newtable1='<table width="100%"><tr><td><input type="button" class="vform-button" id="vehicle-assign-ok" value="OK"/></td><td></td><td><input type="button" class="vform-button" id="vehicle-assign-cancel" value="Cancel"/></td></tr></table>';

var rows = $("#patrol").dataTable().fnGetNodes();

for (var i=0; i<rows.length; i++)
    {
        newtable = newtable + '<tr>'+$(rows[i]).html()+'</tr>';
    }
    newtable = newtable + '</table>';
//    newtable = newtable  + newtable1;
    //$('#Main_Assign').find('img').remove();
   $('#assign-vehicle-div').find('img').find('loading').remove();
    $('#assign-vehicle-div').html(newtable);
    //$('#Main_Assign1').toggle();
    //$('.banner').toggle();
    $('#Main_Assign1').show();  

table_Assign = $('#exampleAssign').DataTable({
        "columnDefs": [
        { "visible": false, "targets": 0 }, //new code
        { "visible": false, "targets": 2 },
	      { "visible": false, "targets": 5 },
        { "visible": false, "targets": 7 },
	      { "visible": false, "targets": 8 },
	      { "visible": false, "targets": 9 },        
        { "visible": false, "targets": 10 },
	      { "visible": false, "targets": 11 },
	      { "visible": false, "targets": 12 },
	      { "visible": false, "targets": 14 }
        ],
    "order": [[ 6, 'asc' ]],
    "displayLength": -1,
    "bFilter": false,
    "bPaginate": false,
    "select":true,
    "drawCallback": function ( settings )
    {
                var api = this.api();
                var rows = api.rows( {page:'current'} ).nodes();
                var last=null;
        api.column(6,{page:'current'}).data().each( function ( group, i ){
                            if ( last !== group )
                            {
                                $(rows).eq( i ).before('<tr class="groupva"><td colspan="5" bgcolor="pink"><span>-</span>'+group+'</td></tr>');
                                last = group;
                            }
            });
    } // drawCallback ends
    });

$('#exampleAssign tbody').find('tr').each( function()
{
    if ($(this).is('.even') || $(this).is('.odd'))
    {
        $(this).toggle();
    }
        $(this).closest('.groupva').find('span').text('+');
}); 

$('.groupva').click(function ()
                 {
					 $(document).css('cursor','progress');						
  					 $(this).find('span').text(function(_, value){return value=='-'?'+':'-'});
					 $(this).nextAll('tr').each( function()
                     {
                         if ($(this).is('.groupva'))
                        {
                           return false;
                        }
                        $(this).toggle();
						});
					 $(document).css('cursor','default');
				 });

$('#exampleAssign tbody').on('click','tr', function () {
	//var tr = $(this).closest('tr');
    //       Data = table_Assign.row($(this)).data();
    		if ( $(this).hasClass('selected') ) {
			$(this).removeClass('selected'); 
				}	else	{ 
					table_Assign.$('tr.selected').removeClass('selected'); 
						$(this).addClass('selected');
						}
        //var row = table_Assign.row( tr );
        //$(this).css("background-color","red");
       	//var info = row.data();
        //alert(callsign);
        //var regno = document.getElementById('vt-reg-no').value;
        //var retvalue = confirm("You have chosen to re-assign vehicle " +regno+" to patrol "+info[1]+"-"+info[3]+" "+info[4]+". Are you sure you want to proceed?");
});

$('#vehicle-assign-ok').on('click', function () {

//Get the selected row
Data = null;
table_Assign = $('#exampleAssign').DataTable();
Data = table_Assign.row($('tr.selected')).data();

var regno = document.getElementById('vt-reg-no').value;
var retvalue = confirm("You have chosen to re-assign vehicle " +regno+" to patrol "+Data[4]+"-"+Data[1]+". Are you sure you want to proceed?");
var callsign=Data[4];
var payrollnumber=Data[3];
var pname=Data[1];
var costcentre=Data[13];
var region = Data[6];

$('#Main_Assign').hide();
table_Assign.destroy();

if(retvalue)
{
AssignVehicle('Vehicles',callsign,payrollnumber,pname,costcentre,region);
//updateTable('Vehicles')
}



});

} // loadtableAssign() ends

$('#vehicle-assign-cancel').on('click',function() {
el_assign = document.getElementById("pidb_overlay_assign");
el_assign.style.visibility = "hidden";
$('#Main_Assign').toggle();
table_Assign.destroy();
});

function viewpersonalinfo( payrollno ){
                
                // Call Allclear() function here to reset existing form values.
                $('#patrol-form-personal').find('td').each(function(){
                    $(this).find('input[type="text"]').val(null);
                    $(this).find('input[type="date"]').val(null);
                    $(this).find('div').html(null);
                    $(this).find('textarea').val(null);
                    });

                if ((IsAdmin) || (IsPatrolSManager)) {
                  //validate if user has access to view this information  
                
                
       
                $.ajax({
url: "/teams/ops/pidb/_api/web/lists/getbytitle('patrol_personal')/items?$select=HomeAddress_1,HomeTown,HomeCounty,HomePostCode,HomeTelephone,HomeEmail,PatrolMobileNumber,StartDate,ServiceDays,UnionRep,InActiveDuty,TerminationDate,TerminationReason,Author/FirstName,Author/LastName,Editor/FirstName,Editor/LastName,Created,Modified&$Filter=Title eq"+"'"+payrollno+"'&$expand=Author/FirstName,Author/LastName,Editor/FirstName,Editor/LastName",
                type: "GET",
                dataType: 'json',
                headers: { "Accept": "application/json; odata=verbose" },
                success: function(data){
                                if(data.d.results.length == 0) {
                                                alert("No matching personal data");
                                                $('#main-tabs-patrol').tabs( "option", "active", 0 );
                                                $('#main-tabs-patrol').tabs( "option","disabled",[1]);
                                                } else {
                                var xyz_personal = data.d.results;
                                var authorfname_personal=xyz_personal[0].Author['FirstName'];
                                var authorsname_personal=xyz_personal[0].Author['LastName'];
                                var editorfname_personal=xyz_personal[0].Editor['FirstName'];
                                var editorsname_personal=xyz_personal[0].Editor['LastName'];
                                $.each(data.d.results, function(index1, item1)
                                {        

$('#patrol-personal-created').html('By '+authorfname_personal+' '+authorsname_personal+' On '+(item1.Created).toString().replace("T"," ").replace("Z"," "));
$('#patrol-personal-modified').html('By '+editorfname_personal+' '+editorsname_personal+' On ' +(item1.Modified).toString().replace("T"," ").replace("Z"," "));
                                $('#patrol-detail-view-personal #patrol-forename').val(patrol_forename);
                                $('#patrol-detail-view-personal #patrol-surname').val(patrol_lastname);
                                $('#patrol-detail-view-personal #patrol-call-sign').val(patrol_callsign);
                                $('#patrol-payroll-no-personal').val(patrol_payroll_no);
                                $('#patrol-mobile-no').val(function(){ if(!item1.PatrolMobileNumber){ return null;}else {return item1.PatrolMobileNumber}});
                                $('#patrol-home-address1').val(function(){ if(!item1.HomeAddress_1){ return null;}else {return item1.HomeAddress_1}});
                                $('#patrol-home-address2').val(function(){ if(!item1.HomeTown){ return null;}else {return item1.HomeTown}});
                                $('#patrol-home-address3').val(function(){ if(!item1.HomeCounty){ return null;}else {return item1.HomeCounty}});
                                $('#patrol-home-address4').val(function(){ if(!item1.HomePostCode){ return null;}else {return item1.HomePostCode}});
                                $('#patrol-home-telephone-no').val(function(){ if(!item1.HomeTelephone){ return null;}else {return item1.HomeTelephone}});
                                $('#patrol-home-email').val(function(){ if(!item1.HomeEmail){ return null;}else {return item1.HomeEmail}});
                                $('#patrol-start-date').val(function(){ if(!item1.StartDate){ return null;}else {return item1.StartDate.split('T')[0]}});
                                $('#patrol-sevice-days').val(function(){ if(!item1.ServiceDays){ return null;}else {return item1.ServiceDays}});
                                var isunionrep = item1.UnionRep;
                                if (isunionrep == "Yes") {
                                                $('#patrol-union-rep[value="Yes"]').prop("checked",true);
                                }else {
                                                $('#patrol-union-rep[value="No"]').prop("checked",true);
                                }
                                
                                var isInactiveduty = item1.InActiveDuty;
                                if (isInactiveduty == "Yes") {
                                                $('#patrol-in-active-duty[value="Yes"]').prop("checked",true);
                                }else {
                                                $('#patrol-in-active-duty[value="No"]').prop("checked",true);
                                }
                                
$('#patrol-termination-date').val(function(){ if(!item1.TerminationDate){ return null;}else {return item1.TerminationDate.split('T')[0]}});
$('#patrol-termination-reason').val(function(){ if(!item1.TerminationReason){return null;}else {return item1.TerminationReason;}});

                    });
                                var offset = tableDataArray.length + 1;
                                $.each(data.d.results[0],function(index, item){
                                    if ( index != "__metadata" && index != "Author" && index != "Editor" )
                                    {
                                                        tableDataArray.push([index,item]);
                                    }
                                    });
                                
                                
                }
                },
                error: function (error) { console.log("Error in getting personal data"); console.log(error); }
                });
                
}                
} //viewpersonalinfo() closing

//new code
//removing options from patrol dropdown as per access
if(IsFleetManager || IsReadOnly)
{
console.log("truncated patrol select box");
$("#pidb-view option[id=5]").remove();
}

if(IsReadOnly)
{
console.log("truncated patrol select box");
$("#pidb-view option[id=6]").remove();
}

} // AJAX Call 1 mySuccessHandler() closing..

function format ( callsign ) {      // AJAX Call 1 Format Data // Gets Vehicle Information Runtime 
var vehicle_title_make = null;
$.ajax({
        url: "/teams/ops/pidb/_api/web/lists/getbytitle('vehicles')/items?$select=Title,VehicleType&$Filter=PatrolCallSign eq"+"'"+callsign+"'",
        type: "GET",
        async: false,
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
    success: function(data){
    if(data.d.results.length == 0) {
    console.log("0 vehicles assigned");
    vehicle_title_make =  '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
    '<tr>'+
    '<td>No Vehicles assigned to this Patrol</td>'+
    '</tr>'+
    '</table>';
            }else {

        vehicle_title_make = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';
                
    $.each(data.d.results, function(index1, item1){
        vehicle_title_make = vehicle_title_make + '<tr>'+
                '<td>Registration Number:</td><td><a href="#" class="display-vehicle-id"><div id='+item1.Title+'>'+item1.Title+'</div></a></td>'+
                '</tr>'+
                '<tr>'+
                '<td>Make :</td><td>'+item1.VehicleType+'</td>'+
                '</tr>';    
                });
        vehicle_title_make = vehicle_title_make +'</table>';
        }
    },
    error: function (error) { console.log("Error in getting vehicle data"); console.log(error); }
    });
return vehicle_title_make;
} // AJAX Call 1 function format() closing..


function mySuccessHandlerVehicle(data){ // AJAX Call 2 Success Handler //new code

  table2 = $('#vehicle').DataTable({
		"aaData": data.d.results,
		"aoColumns": [{	
		"mData": "Title"
        },{
            "mData": "VehicleType"
        }, {
            "mData": "VehicleLocation"
        }, {
            "mData": "PatrolCallSign"
        }, {
            "mData": "PatrolName"
        }, {
            "mData": "PatrolPayrollNo"
        }, {
            "mData": "CostCentre"
        }, {
            "mData": "Region"
        },{
             "mData": "LeaseStartDate",
             "mRender": function ( data, type, row ) 
             {
            sdate = new Date(data);
            if(data != null)
            {return sdate.getFullYear()+'/'+(sdate.getMonth()+1)+'/'+sdate.getDate();}
            else
            {return null;}
             }
        },{
            "mData": "LeaseEndDate",
             "mRender": function ( data, type, row ) 
             {
            edate = new Date(data);
            if(data != null)
            {return edate.getFullYear()+'/'+(edate.getMonth()+1)+'/'+edate.getDate();}
            else
            {return null;}
             }
        }, {
            "mData": "VehicleStatus"
        }, {
            "mData": "Trailer"
        }, {
            "mData": "TrailerType"
        }, {
            "mData": "TerminationDate",
             "mRender": function ( data, type, row ) 
             {
            tdate = new Date(data);
            if(data != null)
            {return tdate.getFullYear()+'/'+(tdate.getMonth()+1)+'/'+tdate.getDate();}
            else
            {return null;}
            }
        }, {
            "mData": "TerminationReason"            
        }],
		"aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"select": true,
//		"deferRender": true,
		"colReorder": true,
		"stateSave":  true,
		"order": [[1, 'asc']]
    }); // DataTable() closing..

$('select[name="vehicle_length"]').css('margin-left','91px');

$('#vehicle tbody').on( 'click', 'tr', function () { 
		if ( $(this).hasClass('selected') ) {
			$(this).removeClass('selected'); 
				}	else	{ 
					table2.$('tr.selected').removeClass('selected'); 
						$(this).addClass('selected');
						}
						});

                        
$('#vehicle tbody').on('dblclick','tr',function() { 


var tableData1 = table2.row($(this)).data(); //new code

//var AuthorFName = tableData1["Author"];
//console.log(AuthorFName["FirstName"]);
//console.log(AuthorFName["LastName"]);
$('#main-tabs-vehicle-view #vt-created').html(tableData1["Author"]["FirstName"]+' '+tableData1["Author"]["LastName"]+' on '+tableData1["Created"].toString().replace("T"," ").replace("Z"," "));

$('#main-tabs-vehicle-view #vt-last-modified').html(tableData1["Editor"]["FirstName"]+' '+tableData1["Editor"]["LastName"]+' on '+tableData1["Modified"].toString().replace("T"," ").replace("Z"," "));

$('#main-tabs-vehicle-view #vt-patrol-name').val(tableData1["PatrolName"]);
$('#main-tabs-vehicle-view #vt-patrol-call-sign').val(tableData1["PatrolCallSign"]);
$('#main-tabs-vehicle-view #vt-patrol-payroll-no').val(tableData1["PatrolPayrollNo"]);
$('#main-tabs-vehicle-view #vt-patrol-cost-centre').val(tableData1["CostCentre"]);
$('#main-tabs-vehicle-view #vt-reg-no').val(tableData1["Title"]);
$('#main-tabs-vehicle-view #vt-vehicle-type').val(function(){ if(!tableData1["VehicleType"]){ return null;}else {return tableData1["VehicleType"]}});
$('#main-tabs-vehicle-view #vt-other-vehicle-type').val(tableData1["VehicleTrailerTypeOther "]); 
$('#main-tabs-vehicle-view #vt-vehicle-status').val(function(){ if(!tableData1["VehicleStatus"]){ return null;}else {return tableData1["VehicleStatus"]}});
$('#main-tabs-vehicle-view #vt-vehicle-location').val(function(){ if(!tableData1["VehicleLocation"]){ return null;}else {return tableData1["VehicleLocation"]}});
$('#main-tabs-vehicle-view #vt-other-vehicle-location').val(tableData1["VehicleLocationOther"]); 
$('#main-tabs-vehicle-view #vt-further-location-details').val(function(){ if(!tableData1["FurtherDetails"]){ return null;}else {return tableData1["FurtherDetails"]}});
$('#main-tabs-vehicle-view #vt-vehicle-lease-supplier').val(function(){ if(!tableData1["VehicleLeaseSupplier"]){ return null;}else {return tableData1["VehicleLeaseSupplier"]}});

$('#main-tabs-vehicle-view #vt-lease-start-date').val(function(){ if(!tableData1["LeaseStartDate"]){ return null;}else { 
return tableData1["LeaseStartDate"].split('T')[0];
}});
 
$('#main-tabs-vehicle-view #vt-lease-end-date').val(function(){ if(!tableData1["LeaseEndDate"]){ return null;}else {return tableData1["LeaseEndDate"].split('T')[0]}}); 
$('#main-tabs-vehicle-view #vt-cad-mask').val(function(){ if(!tableData1["CADMask"]){ return "M";}else {return tableData1["CADMask"]}});
$('#main-tabs-vehicle-view #vt-unit-type').val(function(){ if(!tableData1["UnitType"]){ return null;}else {return tableData1["UnitType"]}});
$('#main-tabs-vehicle-view #vt-symnum').val(function(){ if(!tableData1["Symnum"]){ return null;}else {return tableData1["Symnum"]}});
//$('[name="vt-trailer-yn"]').val(function(){ if(!tableData1["Trailer"]){ return "No";}else {return tableData1["Trailer"]}});

if (tableData1["Trailer"] == "Yes") {
    $('#vt-trailer-yn-yes').prop('checked',true);
}
    else {
    $('#vt-trailer-yn-no').prop('checked',true);
    }


$('#main-tabs-vehicle-view #vt-trailer-type').val(function(){ if(!tableData1["TrailerType"]){ return null;}else {return tableData1["TrailerType"]}});  
$('#main-tabs-vehicle-view #vt-other-trailer-type').val(tableData1["VehicleTrailerTypeOther"]); 
$('#main-tabs-vehicle-view #vt-history-of-vehicle').val(function(){ if(!tableData1["VehicleHistory"]){ return null;}else {return tableData1["VehicleHistory"]}});
$('#main-tabs-vehicle-view #vt-termination-date').val(function(){ if(!tableData1["TerminationDate"]){ return null;}else {return tableData1["TerminationDate"].split('T')[0]}});
$('#main-tabs-vehicle-view #vt-termination-reason').val(tableData1["TerminationReason"]);
$('#main-tabs-vehicle-view #vt-other-termination-reason').val(tableData1["VehicleTerminationReasonOther"]);    
$('#main-tabs-vehicle-view #vt-general-comments').val(function(){ if(!tableData1["GeneralComments"]){ return null;}else {return tableData1["GeneralComments"]}});    
$('#main-tabs-vehicle-view #vt-comments-restricted').val(function(){ if(!tableData1["CommentsRestricted"]){ return null;}else {return tableData1["CommentsRestricted"]}});   
$('#main-tabs-vehicle-view #vt-trailer').val(function(){ if(!tableData1["VTrailer"]){ return null;}else {return tableData1["VTrailer"]}});   
$('#main-tabs-vehicle-view #vt-trailer-end-date').val(function(){ if(!tableData1["TrailerEndDate"]){ return null;}else {return tableData1["TrailerEndDate"].split('T')[0]}}); 
$('#main-tabs-vehicle-view #vt-trailer-status').val(function(){ if(!tableData1["TrailerStatus"]){ return null;}else {return tableData1["TrailerStatus"]}}); 
el = document.getElementById("pidb_overlay");
el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";

$('#vehicle-detail-view').toggle();


//$('.mandatory').css("border","solid 1px #ABABAB");
//$('.sc_mandatory').css("border","solid 1px #ABABAB");
//$( ".error_msg" ).empty();
$('.other_vehicle_location').hide();
$('.other_vehicle_type').hide();
$('.other_trailer_type').hide();
$('.other_trailer_age').hide();
$('.other_term_reason').hide();



$('#vehicle-tab-view').find('td').each(function()
                                {
                                    $(this).find("input[type='text']").not('.readonly').prop('disabled',true);
                                    $(this).find("input[type='date']").not('.readonly').prop('disabled',true);
                                    $(this).find("input[type='radio']").not('.readonly').prop('disabled',true); //new code
                                    //$(this).find('input').not('.mandatory').prop('disabled',true);
                                    //$(this).find('input.editable').prop('disabled',true);
                                    $(this).find('textarea').prop('disabled',true);
                                    $(this).find('select').prop('disabled',true);
                                    
                                  //  $(this).find('input.vform-button').prop('disabled',false);
                                    $(this).find('input.readonly').css('background-color','#f2f2f2');
                                });

$('.form-button').each( function() {

var buttonid = $(this).attr('id');

if ((IsPatrolSUser || IsPatrolSManager|| IsReadOnly) && ((buttonid == "vehicle-detail-tab-assign")||(buttonid == "vehicle-detail-tab-edit") || (buttonid == "vehicle-detail-tab-update") ))
{
$(this).prop('disabled',true);
$("#main-tabs-vehicle-view td:eq( 73 )").css('visibility','hidden'); // simple hack to hide call sign //new code
$("#main-tabs-vehicle-view td:eq( 74 )").css('visibility','hidden'); // simple hack to hide call sign
}

if(IsFleetManager || IsAdmin)
{
$(this).find('input').prop('disabled',false);
$('#vt-comments-restricted').show();
$("#main-tabs-vehicle-view td:eq( 73 )").css('visibility','visible'); // simple hack to hide call sign
$("#main-tabs-vehicle-view td:eq( 74 )").css('visibility','visible'); // simple hack to hide call sign
}

});
$('#vehicle-detail-tab-cancel').prop('disabled',false);

// capture data for checkChange() function

$.each(tableData1,function(index, item){                                    //new code
    if ( index != "__metadata" && index != "Author" && index != "Editor" )
    {
                        vtableDataArray.push([index,item]);
    }
    });

});                        
                        
//new code
//removing options from dropdown as per access
if(IsPatrolSUser || IsPatrolSManager || IsReadOnly)
{
console.log("truncated select box");
$("#vehicle_drpdwn option[id=4]").remove();
$("#vehicle_drpdwn option[id=5]").remove();
}
                        
} // AJAX Call 2 Success Handler Ends

//vehicle on change functions

$('#main-tabs-vehicle-view #vt-lease-start-date, #add-new-vehicle #vt-lease-start-date').on('change',function(){
    
    if ($(this).val().length > 0) {
        $('#errorbox-vt-lease-start-date').remove();
    }
    });

$('#main-tabs-vehicle-view #vt-lease-end-date, #add-new-vehicle #vt-lease-end-date').on('change',function(){
    
    if ($(this).val().length > 0) {
        $('#errorbox-vt-lease-end-date').remove();
    }
    });    
    
$('#main-tabs-vehicle-view #vt-vehicle-type').on('change',function(){
                
var current_vehicletype = $(this).val();
    
    if (current_vehicletype != "none") {
        $('#errorbox-vt-vehicle-type').remove();                    //new code
        
            $.each(vehicletype,function(index,data){
                        if (data[0] == current_vehicletype)
                        {
                            symnum = data[1];
                            unittype = data[2];
                            $('#main-tabs-vehicle-view #vt-symnum').val(symnum);
                            $('#main-tabs-vehicle-view #vt-unit-type').val(unittype);
                        }});
                    }
                    });

$('#add-new-vehicle #vt-vehicle-type').on('change',function()
    { 
        var current_vehicletype = $(this).val();
        $.each(vehicletype,function(index,data)
               {
                if (data[0] == current_vehicletype)
                {
                        symnum = data[1];
                        unittype = data[2];
                                $('#add-new-vehicle #vt-symnum').val(symnum);
                                $('#add-new-vehicle #vt-unit-type').val(unittype);
                }
                });
                });

$('#main-tabs-vehicle-view #vt-vehcile-location').on('change',function(){ 
var choice = $(this).val();
    if(choice=="Other")
    {$('.other_vehicle_location').show();}
    else
    {$('.other_vehicle_location').hide();}
});

$('#add-new-vehicle #vt-vehcile-location').on('change',function(){
var choice_new = $(this).val();   
if(choice_new=="Other")
{$('#add-new-vehicle .other_vehicle_location').show();}
else{$('#add-new-vehicle .other_vehicle_location').hide();}
});

$('#main-tabs-vehicle-view #vt-termination-reason').on('change',function(){
var choice = $(this).val();
if(choice=="Other")
{$('.other_term_reason').show();}
else{$('.other_term_reason').hide();}
});

$('#add-new-vehicle #vt-termination-reason').on('change',function(){
var choice_new = $(this).val();  
if(choice_new=="Other")
{$('#add-new-vehicle .other_term_reason').show();}
else{$('#add-new-vehicle .other_term_reason').hide();}
});

$('#main-tabs-vehicle-view #vt-trailer-type').on('change',function(){
    var choice = $(this).val();  
if(choice=="Other")
{$('.other_trailer_type').show();}
else{$('.other_trailer_type').hide();}
});

$('#add-new-vehicle #vt-trailer-type').on('change',function(){
var choice_new = $(this).val();  
if(choice_new=="Other")
{$('#add-new-vehicle .other_trailer_type').show();}
else{$('#add-new-vehicle .other_trailer_type').hide();}
});

$('#main-tabs-vehicle-view #vt-vehicle-type').on('change',function(){
var choice = $(this).val();
if(choice=="Other")
{$('.other_vehicle_type').show();}
else{$('.other_vehicle_type').hide();}
});

$('#add-new-vehicle #vt-vehicle-type').on('change',function(){
var choice_new = $(this).val();  
if(choice_new=="Other")
{$('#add-new-vehicle .other_vehicle_type').show();}
else{$('#add-new-vehicle .other_vehicle_type').hide();}
});

// validates termination reason when date is entered in vehicle view
$('#main-tabs-vehicle-view #vt-termination-date').on('change',function(){
    var curr_vehicle_terminationdate  = $('#main-tabs-vehicle-view #vt-termination-date').val().length;
    if ( curr_vehicle_terminationdate > 0 )
        {
            $('#main-tabs-vehicle-view #vt-termination-reason').addClass('required');
        }
    else if (curr_vehicle_terminationdate == 0) 
        {
                $('#main-tabs-vehicle-view #vt-termination-reason').removeClass('required');
                $('#main-tabs-vehicle-view #errorbox-vt-termination-reason').remove();
        }
});

$('#main-tabs-vehicle-view #vt-termination-reason').on('change',function(){ //new code
    if ($(this).val() != "none")
    {
        $('#main-tabs-vehicle-view #vt-termination-reason').removeClass('required');
        $('#main-tabs-vehicle-view #errorbox-vt-termination-reason').remove();
    }
});

$('#add-new-vehicle #vt-termination-date').on('change',function(){
    var curr_vehicle_terminationdate  = $('#add-new-vehicle #vt-termination-date').val().length;
    if ( curr_vehicle_terminationdate > 0 )
        {
            $('#add-new-vehicle #vt-termination-reason').addClass('required');
        }
    else if (curr_vehicle_terminationdate == 0) 
        {
                $('#add-new-vehicle #vt-termination-reason').removeClass('required');
                $('#add-new-vehicle #errorbox-vt-termination-reason').remove();
        }
});

$('#add-new-vehicle #vt-termination-reason').on('change',function(){ //new code
    if ($(this).val() != "none" )
    {
    $('#add-new-vehicle #vt-termination-reason').removeClass('required');
    $('#add-new-vehicle #errorbox-vt-termination-reason').remove(); 
    }
    
});

$("input[name='vt-trailer-yn']").on('change',function () {  //new code
             if  ($(this)[0].value == "Yes")
                {
                   console.log($(this)[0].value);
                   $('#main-tabs-vehicle-view #vt-trailer-type').addClass('required');
                }
            else
                {
                    $('#errorbox-vt-trailer-type').remove();
                    $('#main-tabs-vehicle-view #vt-trailer-type').removeClass('required');
                }
        });

$('#main-tabs-vehicle-view #vt-trailer-type').on('change',function(){   //new code
if ($(this).val() != "none" )
{
    console.log($(this).val());
    $('#main-tabs-vehicle-view #vt-trailer-type').removeClass('required');
    $('#errorbox-vt-trailer-type').remove();
}
else if (($(this).val() == "none")  && (($("input[name='vt-trailer-yn']")[0].value == "Yes")))
{
    console.log(($('input[name="vt-trailer-yn"]:checked').val()));
    console.log($(this).val());  
    $('#main-tabs-vehicle-view #vt-trailer-type').addClass('required');
}
});

$("input[name='new-vt-trailer-yn']").on('change',function () {  //new code
             if  ($(this)[0].value == "Yes")
                {
                   console.log($(this)[0].value);
                   $('#add-new-vehicle #vt-trailer-type').addClass('required');
                }
            else
                {
                    $('#errorbox-vt-trailer-type').remove();
                    $('#add-new-vehicle #vt-trailer-type').removeClass('required');
                }
        });



$('#add-new-vehicle #vt-trailer-type').on('change',function(){   //new code
if ($(this).val() != "none")
{
    console.log($(this).val());
    $('#add-new-vehicle #vt-trailer-type').removeClass('required');
    $('#errorbox-vt-trailer-type').remove();
}
else if (($(this).val() == "none")  && (($("input[name='new-vt-trailer-yn']")[0].value == "Yes")))
{
    console.log(($('input[name="new-vt-trailer-yn"]:checked').val()));
    console.log($(this).val());  
    $('#add-new-vehicle #vt-trailer-type').addClass('required');
}
});

$('#add-new-vehicle #vt-vehcile-status').on('change',function(){

if ($(this).val().length > 0)
    {
        $('#errorbox-vt-vehcile-status').remove();
    } 

});

$('#add-new-vehicle #vt-vehcile-location').on('change',function(){

if ($(this).val().length > 0)
    {
        $('#errorbox-vt-vehcile-location').remove();
    } 

});

$('#add-new-vehicle #vt-vehicle-type').on('change',function(){

if ($(this).val().length > 0)
    {
        $('#errorbox-vt-vehicle-type').remove();
    } 

});                                                         //new code
               
function getFullVehicleDetails( callsign , vehicle_number ){  // GET Full vehicel Details when called //

$.ajax({
// url: "/teams/ops/pidb/_api/web/lists/getbytitle('vehicles')/items?$select=Title,Author/FirstName&$Filter=PatrolCallSign eq"+"'"+callsign+"'&$expand=Author/FirstName",
    url:"/teams/ops/pidb/_api/web/lists/getbytitle('vehicles')/items?$select=PatrolName,PatrolCallSign,CostCentre,PatrolPayrollNo,Region,Title,VehicleStatus,VehicleLocation,VehicleLocationOther,FurtherDetails,VehicleLeaseSupplier,LeaseStartDate,LeaseEndDate,VehicleType,VehicleTypeOther,CADMask,UnitType,Symnum,TrailerType,VehicleTrailerTypeOther,VehicleHistory,TerminationDate,TerminationReason,VehicleTerminationReasonOther,GeneralComments,CommentsRestricted,VTrailer,TrailerEndDate,TrailerStatus,Trailer,Author/FirstName,Author/LastName,Editor/FirstName,Editor/LastName,Created,Modified&$Filter=Title eq "+"'"+vehicle_number+"' &PatrolCallSign eq"+"'"+callsign+"'&$expand=Author/FirstName,Author/LastName,Editor/FirstName,Editor/LastName",
        type: "GET",
        async: true,
        dataType: 'json',
        headers: { "Accept": "application/json; odata=verbose" },
    success: function(data){
    var xyz = data.d.results;
    var authorfname=xyz[0].Author['FirstName']
    var authorsname=xyz[0].Author['LastName']
    var editorfname=xyz[0].Editor['FirstName']
    var editorsname=xyz[0].Editor['LastName']
    $.each(data.d.results, function(index1, item1){
    $('#quick-vehicle-detail-view #vehicle-created').html('On '+(item1.Created).toString().replace("T"," ").replace("Z"," ")+' By '+authorfname+' '+authorsname);
    $('#quick-vehicle-detail-view #vehicle-last-modified').html('On ' +(item1.Modified).toString().replace("T"," ").replace("Z"," ")+' By '+editorfname+' '+editorsname);
$('#quick-vehicle-detail-view #vehicle-patrol-name').val(item1.PatrolName);
$('#quick-vehicle-detail-view #vehicle-patrol-call-sign').val(item1.PatrolCallSign);
$('#quick-vehicle-detail-view #vehicle-patrol-payroll-no').val(item1.PatrolPayrollNo);
$('#quick-vehicle-detail-view #vehicle-patrol-cost-centre').val(item1.CostCentre)
$('#quick-vehicle-detail-view #vehicle-reg-no').val(item1.Title);
$('#quick-vehicle-detail-view #vehicle-type').val(item1.VehicleType);
$('#quick-vehicle-detail-view #other-vehicle-type').val(item1.VehicleTypeOther);
$('#quick-vehicle-detail-view #vehicle-status').val(item1.VehicleStatus);
$('#quick-vehicle-detail-view #vehicle-location').val(item1.VehicleLocation);
$('#quick-vehicle-detail-view #other-vehicle-location').val(item1.VehicleLocationOther);
$('#quick-vehicle-detail-view #vehicle-further-location-details').val(item1.FurtherDetails);
$('#quick-vehicle-detail-view #vehicle-lease-supplier').val(item1.VehicleLeaseSupplier);

$('#quick-vehicle-detail-view #vehicle-lease-start-date').val(function(){ if(!item1.LeaseStartDate){ return null;}else {return (item1.LeaseStartDate).split('T')[0]}});  
$('#quick-vehicle-detail-view #vehicle-lease-end-date').val(function(){ if(!item1.LeaseEndDate){ return null;}else {return (item1.LeaseEndDate).split('T')[0]}}); 
$('#quick-vehicle-detail-view #vehicle-cad-mask').val(item1.CADMask);
$('#quick-vehicle-detail-view #vehicle-unit-type').val(item1.UnitType);
$('#quick-vehicle-detail-view #vehicle-symnum').val(item1.Symnum);
if (item1.Trailer == "Yes") {
    $('#vehicle-trailer-yn-yes').prop('checked',true);
}
    else {
    $('#vehicle-trailer-yn-no').prop('checked',true);
    }


$('#quick-vehicle-detail-view #vehicle-trailer-type').val(item1.TrailerType);  
$('#quick-vehicle-detail-view #vehicle-other-trailer-type').val(item1.VehicleTrailerTypeOther); 
$('#quick-vehicle-detail-view #vehicle-history-of-vehicle').val(item1.VehicleHistory);
$('#quick-vehicle-detail-view #vehicle-termination-date').val(function(){ if(!item1.TerminationDate){ return null;}else {return (item1.TerminationDate).split('T')[0]}}); 
$('#quick-vehicle-detail-view #vehicle-termination-reason').val(item1.TerminationReason);
$('#quick-vehicle-detail-view #vehicle-other-termination-reason').val(item1.VehicleTerminationReasonOther);    
$('#quick-vehicle-detail-view #vehicle-general-comments').val(item1.GeneralComments);    
$('#quick-vehicle-detail-view #vehicle-comments-restricted').val(item1.CommentsRestricted);   
$('#quick-vehicle-detail-view #vehicle-trailer').val(item1.VTrailer);   
$('#quick-vehicle-detail-view #vehicle-trailer-end-date').val(function(){ if(!item1.TrailerEndDate){ return null;}else {return (item1.TrailerEndDate).split('T')[0]}});   
$('#quick-vehicle-detail-view #vehicle-trailer-status').val(item1.TrailerStatus); 
    });
    },
    error: function (error) { console.log("Error in getting vehicle data"); console.log(error); }
    });
}  //getFullVehicleDetails() closing

//      var table = $('#example').DataTable();
//      var table1 = $('#example1').DataTable();
    $('#tabs-main').tabs();
    
    /*$('.submenu-title').on('click',function(){ 

        classname='#'+$(this).attr('id')+'-item';
        var position = $(this).position();
        //$('.menu-items').css('display','none');
        //$('.menu-items').css('left',position.left+10);
        $(classname).toggle();
    });*/

    /*$('.menu-items').on('mouseleave',function(){ 
            $('.menu-items').css('display','none');
    });*/

    $('#vehicle-detail-close').on('click',function() { 
        el = document.getElementById("pidb_overlay");
        el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
        //$('.vehicle-detail-view').toggle();
        $('#quick-vehicle-detail-view').toggle();
});

var this_tab_index;

$("#tabs-main").on('click',function(){
        this_tab_index = $(this).tabs('option', 'active'); });

$('#tabs-main').tabs( "option", "active", 0 );

//var this_tab_index;
this_tab_index = $('#tabs-main').tabs('option', 'active');


$('#column-setting-box').click(function() {  
// Get current tab state and hide table row on settings
if ( this_tab_index == 0 ) {

_position = $(this).position();

console.log(_position.top);

var _top = _position.top + 180;
var _left = _position.left + 25;


$('.column-list').css('top',_top);
$('.column-list').css('left',_left);

$('.vehicle-basic').hide(); $('.patrol-basic').show();
}else {
$('.patrol-basic').hide(); $('.vehicle-basic').show();
}
$('.column-list').toggle(); 
});


$('a.toggle-vis').on( 'click', function (e) { 
e.preventDefault();

thisclass = $(this).closest('table').attr('id');

if (thisclass == "patrolbasic"){
var column = table.column( $(this).attr('data-column') ); 
}else {
var column = table2.column( $(this).attr('data-column') ); 
}
column.visible( ! column.visible() ); 
} );

$('.column-list').on('mouseleave',function() {
    $('.column-list').toggle();
});

function checkchanges(divbodyid) {
//    tableDataArray
finalItemString = null;
element_array = [];
var elementarealabel;

$('#' + divbodyid).find('input, select').each(function() {
    var nodetype = $(this)[0].nodeName.toLowerCase();

    if ( (nodetype == "input" && ($(this).attr('type') == "text" || $(this).attr('type') == "date" ) ) && $(this).css('visibility') == 'visible' && ( !$(this).hasClass('dummy') ) ) {

        var elementid = $(this).attr('id');
            elementarealabel = $(this).attr('aria-label');
        element_array.push([elementid, elementarealabel, $(this).val()]);

    } else {
        if ( nodetype == "input" && ($(this).attr('type') == "radio") && $(this).css('visibility') == 'visible' && ( !$(this).hasClass('dummy') )) {
            var elementname = $(this).attr('name');
            elementarealabel = $(this).attr('aria-label');
            element_array.push([elementname, elementarealabel, $('input[name='+elementname+']:checked','#'+divbodyid).val()]);
            
        } else {
            if ( nodetype == "select" && $(this).css('visibility') == 'visible' && ( !$(this).hasClass('dummy') ) ) {
                var elementid = $(this).attr('id');
                elementarealabel = $(this).attr('aria-label');
                element_array.push([elementid, elementarealabel, $('select[id=' + elementid + '] option:selected','#'+divbodyid).val()]);
            }
        }
    }
});
    // Compare new values with old

finalItemString = ' "__metadata": { "type": itemType }, ';

    $.each(element_array,function(index , nData ) {
        //code to check date types and convert them into ISOString format for SP to accept.
        
        if ( (nData[1].toString().toLowerCase().indexOf('date') > 0 ) && nData[2].toString() != "") {
    
            //date found. do the conversion
            nData[2] = new Date(nData[2].toString()).toISOString();
        }
        if (nData[2] == "") {

                        finalItemString = finalItemString + '"' + nData[1] +'":'+ 'null' + ','
        }
        else 
        {
                        finalItemString = finalItemString + '"' + nData[1] +'":' + '"' + nData[2] + '"' + ','
                    }
    });

finalItemString = finalItemString.substr(0,finalItemString.length - 1);

}


function prepareDataForAdd(divbodyid) {
//    tableDataArray
finalItemString2 = null;
element_array = [];
var elementarealabel;

$('#' + divbodyid).find('input, select').each(function() {
    var nodetype = $(this)[0].nodeName.toLowerCase();

    if ( (nodetype == "input" && ($(this).attr('type') == "text" || $(this).attr('type') == "date" ) ) && $(this).css('visibility') == 'visible' && ( !$(this).hasClass('dummy') ) )
    {

        var elementid = $(this).attr('id');
            elementarealabel = $(this).attr('aria-label');
        element_array.push([elementid, elementarealabel, $(this).val()]);

    } else {
        if (nodetype == "input" && $(this).attr('type') == "radio" && $(this).css('visibility') == 'visible' && ( !$(this).hasClass('dummy') ) ) {
            var elementname = $(this).attr('name');
            elementarealabel = $(this).attr('aria-label');
            
            element_array.push([elementname, elementarealabel, $('input[name='+elementname+']:checked','#'+divbodyid).val()]);
        } else {
            if (nodetype == "select" && $(this).css('visibility') == 'visible' && ( !$(this).hasClass('dummy') ) ) {
                var elementid = $(this).attr('id');
                elementarealabel = $(this).attr('aria-label');
                element_array.push([elementid, elementarealabel, $('select[id=' + elementid + '] option:selected').val()]);
            }
        }
    }
});

finalItemString2 = ' "__metadata": { "type": itemType }, ';

    $.each(element_array,function(index , nData ) {
        //code to check date types and convert them into ISOString format for SP to accept.
        
        if ( (nData[1].toString().toLowerCase().indexOf('date') > 0 ) && nData[2].toString() != "") {
    
            //date found. do the conversion
            nData[2] = new Date(nData[2].toString()).toISOString();
        }
        if (nData[2] == "") {

                        finalItemString2 = finalItemString2 + '"' + nData[1] +'":'+ 'null' + ','
        }
        else 
        {
                        finalItemString2 = finalItemString2 + '"' + nData[1] +'":' + '"' + nData[2] + '"' + ','
                    }
    });

finalItemString2 = finalItemString2.substr(0,finalItemString2.length - 1);

}


//check changes function for vehicle

function checkvehiclechanges(divbodyid) {  //new code
//    tableDataArray
velement_array = [];
var velementarealabel;
var velementdate;

$('#' + divbodyid).find('input, select,textarea').each(function() {
    var nodetype = $(this)[0].nodeName.toLowerCase();

    if (nodetype == "input" && $(this).attr('type') == "text" && ($(this).css('visibility') == 'visible')) {

        var elementid = $(this).attr('id');
        velementarealabel = $(this).attr('aria-label');
        velement_array.push([elementid, velementarealabel, $(this).val()]);
        
    } else {
        if (nodetype == "textarea") {
            var elementid = $(this).attr('id');
            velementarealabel = $(this).attr('aria-label');
            velement_array.push([elementid, velementarealabel, $(this).val()]);   

    } else {
        if (nodetype == "input" && ($(this).attr('type') == "radio")) {
            var elementname = $(this).attr('name');
            velementarealabel = $(this).attr('aria-label');
            velement_array.push([elementname, velementarealabel, $('input[name='+elementname+']:checked','#'+divbodyid).val()]);
            
        } else {
            if (nodetype == "select") { 
                var elementid = $(this).attr('id');
                velementarealabel = $(this).attr('aria-label');
                velement_array.push([elementid, velementarealabel, $('select[id=' + elementid + '] option:selected').val()]);  
        } else {
               if(nodetype == "input" && ($(this).attr('type') == "date") && ($(this).css('visibility') == 'visible')){
               
                var elementid = $(this).attr('id');
                velementarealabel = $(this).attr('aria-label');
                velement_array.push([elementid, velementarealabel, $(this).val()]);
               }
        
               } 
                
           }
        }
    }
    
    
});
    // Compare new values with old

finalItemStringVehicle = ' "__metadata": { "type": itemType }, ';

    $.each(velement_array,function(index , nData ) {
        //code to check date types and convert them into ISOString format for SP to accept.
        
        if ( (nData[1].toString().toLowerCase().indexOf('date') > 0 ) && nData[2].toString() != "") {
    
            //date found. do the conversion
            nData[2] = new Date(nData[2].toString()).toISOString();
        }
        if (nData[2] == "") {

                        finalItemStringVehicle = finalItemStringVehicle + '"' + nData[1] +'":'+ 'null' + ','
        }
        else 
        {
                        finalItemStringVehicle = finalItemStringVehicle + '"' + nData[1] +'":' + '"' + nData[2] + '"' + ','
                    }
    });

finalItemStringVehicle = finalItemStringVehicle.substr(0,finalItemStringVehicle.length - 1);


}


} ); //document.ready closing