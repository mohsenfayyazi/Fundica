
<script type="text/javascript">

    
(function ($) {
    $.callAction = function (action, controller, postData, options) {
        $retVal = false;
        //alert(action);
        //alert(postData.grid);
        var settings = $.extend({
            askConfrim: false,
            showMessageResult: true,
            confrimMsg: "آیا مطمئن هستید؟",
            successMsgTitle: "انجام شد",
            failureMsgTitle: "انجام نشد",
            grid: options.grid,
            onSuccess: function (e) {
            },
            onFailure: function (e) {
                swal({
                    title: settings.failureMsgTitle,
                    text: e.ExceptionMessage,
                    type: "warning",
                    confirmButtonClass: 'btn-success',
                    confirmButtonText: 'بستن',
                    closeOnConfirm: true
                });
            }
        }, options || {});

        $address = "/" + controller + "/" + action;
        //__________________________________________________________________________________________
        if (settings.askConfrim) {
            //_____________________________________________
            swal({
                title: settings.confrimMsg,
                text: "",
                type: "error",
                showCancelButton: true,
                confirmButtonClass: 'btn-danger',
                confirmButtonText: 'حذف',
                closeOnConfirm: false,
                cancelButtonText: "انصراف"
            }, function (isConfirm) {
                if (isConfirm) {
                    $.ajax({
                        type: "POST",
                        url: $address,
                        data: postData,
                        success: function (serverResponse) {
                            if (serverResponse.Success === true) {
                                $retVal = true;
                                if (type(settings.grid) === 'string') {
                                    $(settings.grid).data('kendoGrid').dataSource.read();
                                    $(settings.grid).data('kendoGrid').refresh();
                                }

                                if (settings.showMessageResult)
                                    jQuery.successMessage(serverResponse.Message);
                                else
                                    swal.close();

                                try {
                                    settings.onSuccess(serverResponse);
                                }
                                catch (e) {
                                }
                            }
                            else {
                                $retVal = false;
                                settings.onFailure(serverResponse);
                            }
                        },
                        dataType: "json",
                        traditional: true
                    });
                }
                else {
                    return;
                }
            });
            //_____________________________________________
            //Confrim Message Before Send Ajax Request
        }
        else {
            //Send Ajax Request Without Confrim
            $.ajax({
                type: "POST",
                url: $address,
                data: postData,
                success: function (serverResponse) {
                    if (serverResponse.Success === true) {
                        $retVal = true;
                        settings.onSuccess(serverResponse);
                    }
                    else {
                        $retVal = false;
                        settings.onFailure(serverResponse);
                    }
                },
                dataType: "json",
                traditional: true
            });
        }
        return $retVal;
    };

    
    $.callDelete = function (tableName, pKeyFieldName, pKeyValue, options) {

        var settings = $.extend({
            askConfrim: true,
            DomToHide: null,
            onSuccess: null,
            grid: null
        }, options || {});

        if (settings.onSuccess === null) {
            $.callAction("Delete", "Public", {
                targetID: pKeyValue,
                targettable: tableName,
                field: pKeyFieldName
            }, {
                grid: settings.grid,
                onSuccess: settings.onSuccess,
                //onSuccess: function (e) {
                //    if (grid===null){alert("PP");}

                //    },

                //},
                askConfrim: settings.askConfrim,
                confrimMsg: "آیا مطمئن هستید که میخواهید رکورد را حذف کنید",

            }
                );
        }
        else {
            $.callAction("Delete", "Public", {
                targetID: pKeyValue,
                targettable: tableName,
                field: pKeyFieldName,
                onSuccess: settings.onSuccess

            }, {
                grid: settings.grid,
                //onSuccess: function (e) {

                //        alert("OK");
                //    },

                //},
                onSuccess: settings.onSuccess,
                askConfrim: settings.askConfrim,
                confrimMsg: "آیا مطمئن هستید که میخواهید رکورد را حذف کنید"
            }
                );
        }
    }

    $.handleServerMessages = function (serverResponse, options) {
        var settings = $.extend({
            manageType: "normal",
            viewTargetId: "",
            hideTimeout: 0, // <-- time in milliseconds
            onSuccess: function (e) {
            }
        }, options || {});

        if (settings.viewTarget !== "") {
            var upTrgt = $("#" + settings.viewTargetId);
            upTrgt.hide();
            upTrgt.addClass("k-block");
            if (serverResponse.Success !== undefined)
                if (serverResponse.Success === true) {
                    settings.onSuccess(serverResponse);
                    upTrgt.removeClass("k-error-colored");
                    upTrgt.addClass("k-success-colored");
                    upTrgt[0].innerHTML = serverResponse.Message + "<span class='k-icon k-si-tick'></span>";
                    upTrgt.slideDown();

                    if (settings.hideTimeout > 0)
                        setTimeout(function () {
                            upTrgt.slideUp('fast');
                        }, settings.hideTimeout);
                }
                else {
                    upTrgt.removeClass("k-success-colored");
                    upTrgt.addClass("k-error-colored");
                    upTrgt[0].innerHTML = serverResponse.ExceptionMessage + "<span class='k-icon k-si-cancel'></span>";
                    upTrgt.fadeOut();
                    upTrgt.fadeIn();
                    upTrgt.fadeOut();
                    upTrgt.fadeIn();
                    upTrgt.fadeOut();
                    upTrgt.fadeIn();
                    upTrgt.fadeOut();
                    upTrgt.fadeIn();

                    if (settings.hideTimeout > 0)
                        setTimeout(function () {
                            upTrgt.fadeOut('fast');
                        }, settings.hideTimeout);
                }                 
            
        }
    }
    $.refreshGrid = function (g) {
        $(g).data('kendoGrid').dataSource.read();
        $(g).data('kendoGrid').refresh();
    }
    $.showGridTotal = function (ds) {
        $('#totalBits').remove();
        $('.k-grid-pager').append('<span class="k-block k-info-colored"  id="totalBits">تعداد رکورد ها:' + ds.dataSource.total() + '</span>');
    }
    $.saveChangesGrid = function (g) {
        $(g).data('kendoGrid').saveChanges();
    }

    jQuery.errorMessage = function (msg) {
        swal({
            title: "خطا",
            text: msg,
            type: "error",
            confirmButtonClass: 'btn-danger',
            confirmButtonText: 'بستن',
            closeOnConfirm: true
        });
    }

    jQuery.successMessage = function (msg) {
        swal({
            title: "انجام شد",
            text: msg,
            type: "success",
            confirmButtonClass: 'btn-success',
            confirmButtonText: 'بستن',
            closeOnConfirm: true
        });
    }

    jQuery.warningMessage = function (msg) {
        swal({
            title: "هشدار",
            text: msg,
            type: "warning",
            confirmButtonClass: 'btn-success',
            confirmButtonText: 'بستن',
            closeOnConfirm: true
        });
    }

    jQuery.changeButtonClass = function (btnName, btnClass) {
        $("a.k-grid-" + btnName).removeClass("k-button").removeClass("k-button-icontext").addClass("btn").addClass(btnClass);
    }
})(jQuery);


function CreateChart() {
        for (i = 1; i < 25; i++) {
            var MWList = [], MVARList = [], KVList = [];
            for (i = 1; i < 25; i++) {
                MWList.push($("#IMW_" + i).val());
                MVARList.push($("#IMVAR_" + i).val());
                KVList.push($("#IKV_" + i).val());
            }
        }
        var ctxL = document.getElementById("lineChart").getContext('2d');

        var gradientFill = ctxL.createLinearGradient(0, 0, 0, 290);

        gradientFill.addColorStop(0, "rgba(28, 150, 19, 1)");

        gradientFill.addColorStop(1, "rgba(28, 150, 19, 0.01)");


        var myLineChart = new Chart(ctxL, {

            type: 'line',

            data: {

                labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"],

                datasets: [

                    {

                        label: "MW",

                        data: MWList,

                        backgroundColor: [
                            'rgba(104, 177, 116, .2)',
                        ],

                        borderColor: [

                            '#08A320',

                        ],

                        borderWidth: 2,

                        pointBorderColor: "#fff",

                        pointBackgroundColor: "rgba(28, 150, 19, 0.3)",

                    },
                    {

                        label: "MVAR",

                        data: MVARList,

                        backgroundColor: [
                            'rgba(105, 0, 132, .2)',
                        ],

                        borderColor: [

                            '#AD35BA',

                        ],

                        borderWidth: 2,

                        pointBorderColor: "#fff",

                        pointBackgroundColor: "rgba(173, 53, 186, 0.1)",

                    },
                    {

                        label: "KV",

                        data: KVList,

                        backgroundColor: [
                            'rgba(242, 222, 2, .2)',
                        ],

                        borderColor: [

                            '#f2de02',

                        ],

                        borderWidth: 2,

                        pointBorderColor: "#fff",

                        pointBackgroundColor: "rgba(173, 53, 186, 0.1)",

                    }

                ]

            },

            options: {

                responsive: true

            }

        });

    }
    
    
     function onSuccess(arg) {
         jQuery.handleServerMessages(arg, {
             viewTargetId: "UpdateTarget",
             onSuccess: function () {
                 hideModalProgress();
                 swal("اطلاعات با موفقیت ثبت شد", "", 'success');

             }
         });
        
     }
     var header = document.getElementById("myHeader");
     window.onscroll = function () { myFunction() };
     // Get the offset position of the navbar
     var sticky = header.offsetTop;

     // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
     function myFunction() {
         if (window.pageYOffset > sticky) {
             header.classList.add("sticky");

         } else {
             header.classList.remove("sticky");

         }
     }
     var change = false;
     $("input").change(function () {
         change = true;


     });

     $(document).ready(function () {
       

         $("#btbsubmitform").bind("click", function () {
         });
         $('.gridtable').formNavigation();
     });
     function checkall(element) {
         var inputs = $("#" + element).find($("input"));

         $("input").each(function (index) {
             var FieldName = $(this).attr('name');
             var row = FieldName.split("_");
             var field, type,epiu_id;

             if ((FieldName.indexOf("MW") != -1 || FieldName.indexOf("MVAR") != -1) && FieldName.indexOf("_") != -1) {
                 if (FieldName.indexOf("MW") != -1) { field = "MW"; } else { field = "MVAR"; }
                 if (FieldName.indexOf("IMW") != -1 || FieldName.indexOf("IMVAR") != -1) { type = 6; } else { type = 0; }
                 var value = parseFloat(Math.abs($(this).val()));

                 FieldName.indexOf("_") == -1 ? row[1] = 0 : row[1] = row[1];
                 if (type == 0) {
                     switch (row[0].substr(row[0].length - 1)) {
                         case "1":
                             epiu_id = '@(Line_epiu_id[1])';
                             break;
                         case "2":
                             epiu_id = '@(Line_epiu_id[2])';
                             break;
                         case "3":
                             epiu_id = '@(Line_epiu_id[3])';
                             break;
                         case "4":
                             epiu_id = '@(Line_epiu_id[4])';
                             break;
                         case "5":
                             epiu_id = '@(Line_epiu_id[5])';
                             break;
                         case "6":
                             epiu_id = '@(Line_epiu_id[6])';
                             break;
                         case "7":
                             epiu_id = '@(Line_epiu_id[7])';
                             break;
                         case "8":
                             epiu_id = '@(Line_epiu_id[8])';
                             break;
                         default:
                             epiu_id = "0";


                     }

                     console.log(value, FieldName, row[0].substr(row[0].length - 1), field, '@(dateTime)', '@(lastweek)', epiu_id);
                 } else {
                     epiu_id = '@(epui_id)';
                 }
                 if (epiu_id == "") { epiu_id = 0;}
              $.post("/POSTVAR/Ajax_Get_Avg", { INFV_TIME: row[1], SVAR_DATE: '@(dateTime)', EVAR_DATE: '@(lastweek)', EPIV_TYPE: type, EPIU_EPIU_ID: epiu_id, field: field },
              function (data) {
             $("#Ajax_Get_Avg").html(data);



           if (parseFloat(value) > (parseFloat(data) + (parseFloat(data) * 0.2))) {
               $("#" + FieldName + "").css("background-color", "red");
           } else {
               $("#" + FieldName + "").css("background-color", "white");
           }
          });
        }

    });

}

     function Filter() {


       
         eunl_id = "";

       
         return {
             EPOL_ID: $("#EPOL_EPOL_ID").val(),
             eunl_id: eunl_id
         };

     }


     function Validate() {
         showModalProgress('save');
         var check = "true";
         var MaxLimit = "@(Post_Unit_level * (decimal)0.05 + Post_Unit_level)";
         var MinLimit = "@(Post_Unit_level - Post_Unit_level * (decimal)0.1)";
         switch ("@(Post_Unit_level)") {
             case "63":
                 Limit = 45;
                 break;
             case "132":
                 Limit = 75;
                 break;
             case "230":
                 Limit = 400;
                 break;
             case "400":
                 Limit = 500;
                 break;
             default:
                 Limit = 0;
         }
         console.log(MaxLimit + '-' + MinLimit);
         for (i = 1; i < 25; i++) {
             if (Math.abs($("#IMW_" + i).val()) > "@(Trans_Cap * (decimal)0.9)" && $("#EPOL_EPOL_ID").val() != "891") {
                 check = "false";
                 swal({
                     type: 'error',
                     title: 'مقدار MW در ساعت ' + i + '   Incoming بیشتر از 90 درصد ظرفیت ترانس('+ '@(Trans_Cap)' +') است',
                     text: 'حد مجاز MW پست شما:' + '@(Trans_Cap * (decimal)0.9)'
                 });
                 $("#IMW_" + i).css("background-color", "red");
                 break;
             }

             if (Math.abs($("#IMVAR_" + i).val()) > "@(Trans_Cap * (decimal)0.9)" && $("#EPOL_EPOL_ID").val() != "891") {
                 check = "false";
                 swal({
                     type: 'error',
                     title: 'مقدار MVAR در ساعت ' + i + '   Incoming بیشتر از 90 درصد ظرفیت ترانس(' + '@(Trans_Cap)' + ') است',
                     text: 'حد مجاز MVAR پست شما:' + '@(Trans_Cap * (decimal)0.9)'
                 });
                 $("#IMVAR_" + i).css("background-color", "red");
                 break;
             }
             if (( Math.abs($("#IKV_" + i).val()) > MaxLimit || Math.abs($("#IKV_" + i).val()) < MinLimit) && ($("#IKV_" + i).val() != "" && $("#IKV_" + i).val() != 0)) {
                 check = "false";
                 swal({
                     type: 'error',
                     title: 'مقدار KV در ساعت ' + i +  ' از حد مجاز خارج میباشد',
                     text: 'حد مجاز ولتاژ پست شما:' + '@(Post_Unit_level - Post_Unit_level * (decimal)0.1)' + ',' + '@(Post_Unit_level * (decimal)0.05 + Post_Unit_level)'
                 });
                 $("#IKV_" + i).css("background-color", "red");
                 break;

             }
         }

         for (j = 1; j < 9; j++) {
             if ($("#tl" + j).val() != "--") {
                 for (i = 1; i < 25; i++) {
                     if ($("#TMW" + j + "_" + i).val() != "" && Math.abs($("#TMW" + j + "_" + i).val()) > Limit) {
                        
                         swal({
                             type: 'error',
                             title: 'مقدار MW در ساعت ' + i + ' در خط ' + $("#tl" + j).val() + ' از حد مجاز خارج میباشد',
                             text: 'حد مجاز MW پست شما:' + Limit
                         });
                         check = "false";
                         $("#TMW" + j + "_" + i).css("background-color", "red");
                         break;
                     }
                     if ($("#TMVAR" + j + "_" + i).val() != "" && Math.abs($("#TMVAR" + j + "_" + i).val()) > Limit) {
                       
                         swal({
                             type: 'error',
                             title: 'مقدار MVAR در ساعت ' + i + ' در خط ' + $("#tl" + j).val() + ' از حد مجاز خارج میباشد',
                             text: 'حد مجاز MVAR پست شما:' + Limit
                         });
                         $("#TMVAR" + j + "_" + i).css("background-color", "red");
                         check = "false";
                         break;
                     }

                 }
             }
         }
        
         if (check == "false") {
             hideModalProgress();
             return false;
         } else {
             return true;
         }

     }

    
     $("input[type='text']").on("focus", function () {
         $(this).select();
     });
     $('input').bind('paste', null, function (e) {
         $this = $(this);

         setTimeout(function () {

             var rows = $this.val().split(' ');

             var $focused = $(document.activeElement);

             for (var i = 0; i < rows.length; i++) {
                 var columns = rows[i].split(/\s+/);
                 $($focused).focusNextInputField(columns, i);

             }

         }, 0);
     });
     $.fn.focusNextInputField = function (cell, row) {
         var field;
         if (row == 0) {
             return this.each(function () {
                 var fields = $(this).parents('form:eq(0),body').find('input');
                 var index = fields.index(this);
                 for (var j = 0; j < cell.length; j++) {
                     fields.eq(index - j).val('');
                     fields.eq(index - j).val(cell[j]);
                     cal();
                     var row = fields.eq(index - j).attr('id').split("_");
                     if (fields.eq(index - j).attr('id').indexOf("MW") != -1) { field = "MW"; } else { field = "MVAR"; }
                  
                 }

                 return false;
             });

         } else {
             $('input:focus').closest('tr').next().children().eq($('input:focus').closest('td').index()).find('input').focus();
             var fields = $(this).parents('form:eq(0),body').find('input');
             var index = fields.index($('input:focus'));
             for (var j = 0; j < cell.length; j++) {
                 fields.eq(index - j).val('');
                 fields.eq(index - j).val(cell[j]);
                 cal();

                 var row = fields.eq(index - j).attr('id').split("_");
                 if (fields.eq(index - j).attr('id').indexOf("MW") != -1) { field = "MW"; } else { field = "MVAR"; }
               

             }

         }
     };
     $.fn.formNavigation = function () {

         $(this).each(function () {

             $(this).find('input').on('keyup', function (e) {

                 switch (e.which) {
                     case 37:
                         $(this).closest('td').next().find('input').focus().select(); break;
                     case 39:
                         $(this).closest('td').prev().find('input').focus().select(); break;
                     case 40:
                         $(this).closest('tr').next().children().eq($(this).closest('td').index()).find('input').focus().select(); break;
                     case 13:
                         $(this).closest('tr').next().children().eq($(this).closest('td').index()).find('input').focus().select(); break;

                     case 38:
                         $(this).closest('tr').prev().children().eq($(this).closest('td').index()).find('input').focus().select(); break;
                 }
             });
         });
     };



</script>

