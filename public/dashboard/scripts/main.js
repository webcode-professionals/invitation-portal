$(document).ready(function() {
    toastr.options.timeOut = "5000";
    toastr.options.closeButton = true;
    if (typeof notification_type !== "undefined" && notification_type.length && notification_msg.length) {
        toastr[notification_type](notification_msg);
    }

    $("body").on("click", "#backToHome", function() {
        window.location.href = app_url;
    });

    if ($("#users_table").length) {
        var data_table = $("#users_table").DataTable({
            responsive: true,
            orderCellsTop: true,
            fixedHeader: true,
        });
    } else {
        var data_table = $("#mail_template_table, #files_table, #anniversary_table, #spouse_birthday_table, #member_birthday_table").DataTable({
            responsive: true,
            orderCellsTop: true,
            fixedHeader: true,
            "lengthMenu": [
                [10, 25, 50, 100, -1],
                [10, 25, 50, 100, "All"]
            ],
        });
    }

    if (data_table.length)
        new $.fn.dataTable.FixedHeader(data_table);

    $("body").on('change', '.all_select', function(e) {
        var checkbox_input = $('input[type=checkbox].select_member');
        var checked_member = false;
        if (e.originalEvent === undefined) {
            var allChecked = true;
            checkbox_input.each(function() {
                allChecked = allChecked && this.checked;
                if (this.checked)
                    checked_member = this.checked;
            });
            this.checked = allChecked;
        } else {
            checkbox_input.prop('checked', this.checked);
        }

        if (this.checked || checked_member)
            $("#bulk_btn").removeAttr("disabled");
        else
            $("#bulk_btn").attr("disabled", "disabled");
    });

    $("body").on('change', 'input[type=checkbox].select_member', function() {
        $('.all_select').trigger('change');
    });

    $("body").on("click", ".selected-action", function() {
        let action_for = $(this).attr("data-for");
        let action_type = $(this).attr("data-type");
        var active_count = delete_count = inactive_count = 0;
        if (action_for == "member") {
            var checkbox_input = $(".select_member:checked");
            var ids = [];
            checkbox_input.each(function() {
                ids.push(this.value);
            });
            $("#selected_member_id").val(ids);
            $("#select_delete").addClass("hidden");
            $("#select_member_modal-btn").attr("disabled", "disabled");
            if (action_type == "delete") {
                delete_count = checkbox_input.length;
                $("#select_member_modal-msg").text("You are about to delete selected " + delete_count + " " + action_for + "s,");
                $("#selected_member_type").val(action_type);
                $("#select_delete").removeClass("hidden");
                if (delete_count > 0)
                    $("#select_member_modal-btn").removeAttr("disabled");
            } else if (action_type == "active") {
                inactive_count = checkbox_input.parent().parent().find(".label-default").length;
                $("#select_member_modal-msg").text("You are about to active selected " + inactive_count + " " + action_for + "s");
                $("#selected_member_type").val(action_type);
                if (inactive_count > 0)
                    $("#select_member_modal-btn").removeAttr("disabled");
            } else if (action_type == "inactive") {
                active_count = checkbox_input.parent().parent().find(".label-success").length;
                $("#select_member_modal-msg").text("You are about to inactive selected " + active_count + " " + action_for + "s");
                $("#selected_member_type").val(action_type);
                if (active_count > 0)
                    $("#select_member_modal-btn").removeAttr("disabled");
            }
        }
    });

    $('.datepicker').datetimepicker({
        format: 'DD-MM-YYYY',
    });

    $(".btn-login").on("click", function() {
        $(this).html('<i class="fa fa-spinner fa-spin"></i> Loging...');
    });
    $(".btn-register, .btn-password-reset").on("click", function() {
        $(this).html('<i class="fa fa-spinner fa-spin"></i> Processing...');
    });

    $(".btn-send").on("click", function() {
        $(this).attr("disabled", "disabled");
        $(this).html('<i class="fa fa-spinner fa-spin"></i> Sending...');
    });

    $(".csv_file_input").change(function() {
        if (this.files && this.files[0]) {
            $('.drag_drop_text').html('<span>' + this.files[0]['name'] + '</span>');
        }
    });

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('.drag_drop_text').html('<span>' + input.files[0]['name'] + '</span>');
                $('#image_preview').css('background-image', 'url(' + e.target.result + ')');
                $('#image_preview').hide();
                $('.image-preview').fadeIn(600);
                $('#image_preview').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $(".file_input").change(function() {
        readURL(this);
    });

    if ($("#content").length) {
        tinymce.init({
            selector: '#content',
            toolbar: 'undo redo styleselect bold italic alignleft aligncenter alignright bullist numlist outdent indent forecolor backcolor image',
            plugins: 'paste, link, table, codesample, textcolor, code, image',
            browser_spellcheck: true,
            contextmenu: false,
            formats: {
                alignleft: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'left' },
                aligncenter: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'center' },
                alignright: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'right' },
                alignjustify: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'full' },
                bold: { inline: 'span', 'classes': 'bold' },
                italic: { inline: 'span', 'classes': 'italic' },
                underline: { inline: 'span', 'classes': 'underline', exact: true },
                strikethrough: { inline: 'del' },
                forecolor: { inline: 'span', classes: 'forecolor', styles: { color: '%value' } },
                hilitecolor: { inline: 'span', classes: 'hilitecolor', styles: { backgroundColor: '%value' } },
                custom_format: { block: 'h1', attributes: { title: 'Header' }, styles: { color: 'red' } }
            },
            image_list: window.location.origin + "/admin/file/list",
            image_uploadtab: false,
            automatic_uploads: false,
            image_advtab: true,
            image_prepend_url: app_url + '/' + image_upload_path + '/',
            schema: 'html5',
            max_height: 900,
            max_width: 500,
            min_height: 700,
            min_width: 400,
            branding: false
        });
    }

    if ($('#active_from').length) {
        $('#active_from').datetimepicker({
            format: 'DD-MM-YYYY',
        });
        $('#active_to').datetimepicker({
            useCurrent: false,
            format: 'DD-MM-YYYY',
        });
        $("#active_from").on("dp.change", function(e) {
            $('#active_to').data("DateTimePicker").minDate(e.date);
        });
        $("#active_to").on("dp.change", function(e) {
            $('#active_from').data("DateTimePicker").maxDate(e.date);
        });
    }

    function validateEmail(email) {
        var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
        if (email == '' || !re.test(email))
            return false;
        else
            return true;
    }

    function validatedate(date) {
        var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
        if (date.match(dateformat)) {
            var opera2 = date.split('-');
            lopera2 = opera2.length;
            if (lopera2 > 1)
                var pdate = date.split('-');
            var dd = parseInt(pdate[0]);
            var mm = parseInt(pdate[1]);
            var yy = parseInt(pdate[2]);
            var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (mm == 1 || mm > 2) {
                if (dd > ListofDays[mm - 1])
                    return false;
            }
            if (mm == 2) {
                var lyear = false;
                if ((!(yy % 4) && yy % 100) || !(yy % 400))
                    lyear = true;
                if ((lyear == false) && (dd >= 29))
                    return false;
                if ((lyear == true) && (dd > 29))
                    return false;
            }
            return true;
        } else {
            return false;
        }
    }

    $('body').on("input", ".numeric", function(event) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    /** form validation */
    $('body').on("click", ".member_form_submit_btn", function() {
        var is_error = false;
        if ($.trim($('#club_name').val()) == "") {
            toastr["error"]("Club name can't be blank");
            is_error = true;
        } else if ($.trim($('#name').val()) == "") {
            toastr["error"]("Member name can't be blank");
            is_error = true;
        } else if ($.trim($('#email').val()) == "") {
            toastr["error"]("Member email can't be blank");
            is_error = true;
        } else if (!validateEmail($("#email").val())) {
            toastr["error"]("Member email not valid");
            is_error = true;
        } else if ($.trim($('#contact').val()) == "") {
            toastr["error"]("Member contact no. can't be blank");
            is_error = true;
        } else if ($('#contact').val().length < 10) {
            toastr["error"]("Member contact no. must be 10 digit long");
            is_error = true;
        } else if ($.trim($('#dob').val()) == "") {
            toastr["error"]("Member date of birth can't be blank");
            is_error = true;
        } else if (!validatedate($.trim($("#dob").val()))) {
            toastr["error"]("Member date of birth not valid");
            is_error = true;
        } else if ($.trim($('#anniversary_date').val()) == "") {
            toastr["error"]("Member anniversary can't be blank");
            is_error = true;
        } else if (!validatedate($.trim($("#anniversary_date").val()))) {
            toastr["error"]("Member anniversary not valid");
            is_error = true;
        } else if ($.trim($('#spouse_name').val()) == "") {
            toastr["error"]("Spouse name can't be blank");
            is_error = true;
        } else if ($.trim($('#spouse_email').val()) == "") {
            toastr["error"]("Spouse email can't be blank");
            is_error = true;
        } else if (!validateEmail($("#spouse_email").val())) {
            toastr["error"]("Spouse email not valid");
            is_error = true;
        } else if ($.trim($('#spouse_contact').val()) == "") {
            toastr["error"]("Spouse contact no. can't be blank");
            is_error = true;
        } else if ($('#spouse_contact').val().length < 10) {
            toastr["error"]("Spouse contact no. must be 10 digit long");
            is_error = true;
        } else if ($.trim($('#spouse_dob').val()) == "") {
            toastr["error"]("Spouse date of birth can't be blank");
            is_error = true;
        } else if (!validatedate($.trim($("#spouse_dob").val()))) {
            toastr["error"]("Spouse date of birth not valid");
            is_error = true;
        }
        if (is_error == false) {
            $('.member_form_submit_btn').attr("disabled", "disabled");
            $('.btn-cancel').attr("disabled", "disabled");
            $('.member_form_submit_btn').html('<i class="fa fa-spinner fa-spin"></i> Saving...');
            $("#member_form").submit();
        } else
            return false;

    });
    /** end */

    $("body").on("click", ".list-action", function() {
        let id = $(this).attr("data-id");
        let action_for = $(this).attr("data-for");
        let action_type = $(this).attr("data-type");
        if (action_type == "delete") {
            $("#modal-notification-msg").text("You are about to delete selected " + action_for);
            $("#modal-notification-btn").attr("data-id", id);
            $("#modal-notification-btn").attr("data-type", action_type);
            $("#modal-notification-btn").attr("data-for", action_for);
        }
    });

    $("body").on("click", ".modal-submit-btn", function() {
        let id = $(this).attr("data-id");
        let action_for = $(this).attr("data-for");
        let action_type = $(this).attr("data-type");
        if (id.length) {
            if (action_type == "delete" && action_for == "member")
                window.location = window.location.origin + "/admin/member/delete/" + id;
            if (action_type == "delete" && action_for == "file")
                window.location = window.location.origin + "/admin/files/delete/" + id;
            if (action_type == "delete" && action_for == "mail template")
                window.location = window.location.origin + "/admin//mail-template/delete/" + id;
        }
    });

    /** csv form validation */
    $('body').on("click", ".member_csv_submit_btn", function() {
        var is_error = false;
        if ($.trim($('.csv_file_input').val()) == "") {
            toastr["error"]("CSV file can't be blank");
            is_error = true;
        }

        if (is_error == false) {
            $('.member_csv_submit_btn').attr("disabled", "disabled");
            $('.btn-cancel').attr("disabled", "disabled");
            $('.member_csv_submit_btn').html('<i class="fa fa-spinner fa-spin"></i> Uploading...');
            $("#member_csv_form").submit();
        } else
            return false;
    });
    /** end */

    $('form#file_form').on("change", "#type", function() {
        if ($('#type').val() == 1)
            $('#adv_section').removeClass('hidden');
        else {
            $('#adv_section').addClass('hidden');
            $('#active_from, #active_to').val("");
        }
    });

    /** file form validation */
    $('body').on("click", ".file_submit_btn", function() {
        var is_error = false;
        let img_url = "";
        if ($('#img_url').length)
            img_url = $('#img_url').val();
        if ($.trim($('.file_input').val()) == "" && img_url == "") {
            toastr["error"]("File can't be blank");
            is_error = true;
        }
        // image update
        if (img_url != "" && $.trim($('.file_input').val()) != "")
            $('#img_url').remove();

        if (is_error == false) {
            $('.file_submit_btn').attr("disabled", "disabled");
            $('.btn-cancel').attr("disabled", "disabled");
            $('.file_submit_btn').html('<i class="fa fa-spinner fa-spin"></i> Uploading...');
            $("#file_form").submit();
        } else
            return false;
    });
    /** end */

    $('body').on("click", ".copy_url", function() {
        copyTextToClipboard($(this).html());
    });

    function copyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = 0;
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            toastr.options.timeOut = "5000";
            toastr.options.closeButton = true;
            toastr["info"]("Copied: " + text);
        } catch (err) {
            console.log('Oops, unable to copy');
        }
        document.body.removeChild(textArea);
    }

    /** mail form validation */
    $('body').on("click", ".mail_template_submit_btn", function() {
        var is_error = false;
        if ($.trim(tinymce.activeEditor.getContent()) == "") {
            toastr["error"]("Mail template can't be blank");
            is_error = true;
        } else if ($.trim($('#mail_from').val()) == "") {
            toastr["error"]("From email can't be blank");
            is_error = true;
        } else if (!validateEmail($("#mail_from").val())) {
            toastr["error"]("From email not valid");
            is_error = true;
        }

        if (is_error == false) {
            $('.mail_template_submit_btn').attr("disabled", "disabled");
            $('.btn-cancel').attr("disabled", "disabled");
            $('.mail_template_submit_btn').html('<i class="fa fa-spinner fa-spin"></i> Saving...');
            $("#mail_template_form").submit();
        } else
            return false;
    });
    /** end */

    /** mail form validation */
    $('body').on("click", ".mail_setting_submit_btn", function() {
        var is_error = false;
        if ($.trim($('#name_from').val()) == "") {
            toastr["error"]("From name can't be blank");
            is_error = true;
        } else if ($.trim($('#subject').val()) == "") {
            toastr["error"]("Subject can't be blank");
            is_error = true;
        } else if ($.trim($('#mail_from').val()) == "") {
            toastr["error"]("From email can't be blank");
            is_error = true;
        } else if (!validateEmail($("#mail_from").val())) {
            toastr["error"]("From email not valid");
            is_error = true;
        } else if ($.trim($('#reply_to').val()) != "" && !validateEmail($("#reply_to").val())) {
            toastr["error"]("Reply to email not valid");
            is_error = true;
        } else if ($.trim($('#cc').val()) != "" && !validateEmail($("#cc").val())) {
            toastr["error"]("CC email not valid");
            is_error = true;
        } else if ($.trim($('#bcc').val()) != "" && !validateEmail($("#bcc").val())) {
            toastr["error"]("Bcc email not valid");
            is_error = true;
        }

        if (is_error == false) {
            $('.mail_setting_submit_btn').attr("disabled", "disabled");
            $('.btn-cancel').attr("disabled", "disabled");
            $('.mail_setting_submit_btn').html('<i class="fa fa-spinner fa-spin"></i> Saving...');
            $("#mail_setting_form").submit();
        } else
            return false;
    });
    /** end */

    /** mail form validation */
    $('body').on("click", ".modal_password_change_btn", function() {
        var is_error = false;
        if ($.trim($('#password').val()) == "") {
            toastr["error"]("Password can't be blank");
            is_error = true;
        } else if ($.trim($('#re_password').val()) == "") {
            toastr["error"]("Re enter password can't be blank");
            is_error = true;
        } else if ($.trim($('#password').val()) != $.trim($('#re_password').val())) {
            toastr["error"]("Password & re enter password doesn't match");
            is_error = true;
        }


        if (is_error == false) {
            $('.modal_password_change_btn').attr("disabled", "disabled");
            $('.btn-cancel').attr("disabled", "disabled");
            $('.modal_password_change_btn').html('<i class="fa fa-spinner fa-spin"></i> Saving...');
            $("#change_password_form").submit();
        } else
            return false;
    });
    /** end */
    //send mail manually
    $("body").on("click", "#sendMailBg", function() {
        $.ajax({
            url: window.location.origin + "/admin/send/manually/mail",
            type: "POST",
            dataType: "json",
            data: {},
            async: true,
            beforeSend: function(xhr) {
                toastr["info"]("Mail sending in background, it takes some time please wait.");
            },
            success: function(data) {
                toastr["info"]("Mail successfully sent");
                window.location.reload();
                return true;
            }
        });
    });

    $("body").on("click", ".mail_template_edit_btn", function() {
        $("#preview_mail_template_div").slideUp(300);
        $("#edit_mail_template_div").slideDown(700);
    });
});