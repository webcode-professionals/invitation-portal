$(document).ready(function() {
    toastr.options.timeOut = "5000";
    toastr.options.closeButton = true;
    if (typeof notification_type !== "undefined" && notification_type.length && notification_msg.length) {
        toastr[notification_type](notification_msg);
    }

    $("body").on("click", "#backToHome", function() {
        window.location.href = app_url;
    });

    setTimeout(function () {
	    $('#login_page .preloader').hide();
    }, 1000);

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
            if (action_type == "delete" && action_for == "user")
                window.location = window.location.origin + "/admin/users/delete/" + id;
            if (action_type == "delete" && action_for == "file")
                window.location = window.location.origin + "/admin/files/delete/" + id;
        }
    });
    var data_table = [];
    if($("#users_table").length) {
            data_table = $("#users_table").DataTable({
            responsive: true,
            orderCellsTop: true,
            fixedHeader: true,
            "columnDefs": [
                { "searchable": false, "orderable": false, "targets": 0 },
                { "searchable": false, "orderable": false, "targets": 6 },
            ],
            "order": [
                [1, "asc"]
            ]
        });
    }
    else if($("#files_images_table").length) {
            data_table = $("#files_images_table").DataTable({
            responsive: true,
            orderCellsTop: true,
            fixedHeader: true,
            "columnDefs": [
                { "searchable": false, "orderable": false, "targets": 1 },
                { "searchable": false, "orderable": false, "targets": 3 },
                login_as=="admin"?{ "searchable": false, "orderable": false, "targets": 4 }:'',
                // { "searchable": false, "orderable": false, "targets": 4 },
            ],
            "order": [
                [0, "asc"]
            ]
        });
    }
    else if($("#files_videos_table").length) {
            data_table = $("#files_videos_table").DataTable({
            responsive: true,
            orderCellsTop: true,
            fixedHeader: true,
            "columnDefs": [
                { "searchable": false, "orderable": false, "targets": 2 },
                login_as=="admin"?{ "searchable": false, "orderable": false, "targets": 3 }:'',
                // { "searchable": false, "orderable": false, "targets": 3 },
            ],
            "order": [
                [0, "asc"]
            ]
        });
    }


    if (data_table.length)
        new $.fn.dataTable.FixedHeader(data_table);

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

    $("body").on('change', '.all_select', function(e) {
        var checkbox_input = $('input[type=checkbox].select_items');
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

    $("body").on('change', 'input[type=checkbox].select_items', function() {
        $('.all_select').trigger('change');
    });

    $("body").on("click", ".selected-action", function() {
        let action_for = $(this).attr("data-for");
        let action_type = $(this).attr("data-type");
        let active_count = 0;
        let delete_count = 0;
        let disapprove_count = 0;
        if (action_for == "users") {
            let checkbox_input = $(".select_items:checked");
            let ids = [];
            checkbox_input.each(function() {
                ids.push(this.value);
            });
            $("#selected_users_id").val(ids);
            $("#select_delete").addClass("hidden");
            $("#select_users_modal-btn").attr("disabled", "disabled");
            $("#selected_users_type").val(action_type);
            $("#selected_users_for").val(action_for);
            if (action_type == "delete") {
                delete_count = checkbox_input.length;
                $("#select_users_modal-msg").text("You are about to delete selected " + delete_count + " " + action_for + ",");
                $("#select_delete").removeClass("hidden");
                if (delete_count > 0)
                    $("#select_users_modal-btn").removeAttr("disabled");
            } else if (action_type == "approve") {
                disapprove_count = checkbox_input.parent().parent().find(".status.label-warning").length;
                $("#select_users_modal-msg").text("You are about to approve selected " + disapprove_count + " " + action_for + ".");
                if (disapprove_count > 0)
                    $("#select_users_modal-btn").removeAttr("disabled");
            } else if (action_type == "disapprove") {
                active_count = checkbox_input.parent().parent().find(".status.label-success").length;
                $("#select_users_modal-msg").text("You are about to disapprove selected " + active_count + " " + action_for + ".");
                if (active_count > 0)
                    $("#select_users_modal-btn").removeAttr("disabled");
            }
        }
    });

    // if($('.shared-image-box').length) {
    //     $('.shared-image-box').fancybox();
    // }
    Fancybox.bind('[data-fancybox]', {
        // Custom options
      }); 

    /** file uploader js start*/
    const fileUploadBox = document.querySelector(".file-upload-box");
    if(fileUploadBox) {
        const fileList = document.querySelector(".file-list");
        const fileBrowseButton = document.querySelector(".file-browse-button");
        const fileBrowseInput = document.querySelector(".file-browse-input");
        const fileCompletedStatus = document.querySelector(".file-completed-status");
        const fileType = $("#file_type").val();
        let totalFiles = 0;
        let completedFiles = 0;
        // Function to create HTML for each file item
        const createFileItemHTML = (file, uniqueIdentifier) => {
            // Extracting file name, size, and extension
            const {name, size} = file;
            const extension = name.split(".").pop();
            const extensionResult = validateFileExtension(extension);
            if (extensionResult) {
                const formattedFileSize = size >= 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(2)} MB` : `${(size / 1024).toFixed(2)} KB`;
                // Generating HTML for file item
                return `<li class="file-item" id="file-item-${uniqueIdentifier}">
                        <div class="file-extension">${extension}</div>
                        <div class="file-content-wrapper">
                        <div class="file-content">
                            <div class="file-details">
                            <h5 class="file-name">${name}</h5>
                            <div class="file-info">
                                <small class="file-size">0 MB / ${formattedFileSize}</small>
                                <small class="file-divider">•</small>
                                <small class="file-status">Uploading...</small>
                            </div>
                            </div>
                            <button class="cancel-button">
                            <i class="bx bx-x"></i>
                            </button>
                        </div>
                        <div class="file-progress-bar">
                            <div class="file-progress"></div>
                        </div>
                        </div>
                    </li>`;
            }
            else {
                return false;
            }
        }
        // Function to validate file extension
        const validateFileExtension = (ext) => {
            if(fileType == 2) {
                requiredExtension ="mp4,webm,mov";
            }
            else {
                requiredExtension ="png,jpg,jpeg,gif";
            }
            let position = requiredExtension.indexOf(ext.toLocaleLowerCase());
            return position > -1 ? true : false;
        }
        // Function to handle selected files
        const handleSelectedFiles = ([...files]) => {
            if(files.length === 0) return; // Check if no files are selected
            totalFiles += files.length;
            files.forEach((file, index) => {
                const uniqueIdentifier = Date.now() + index;
                const fileItemHTML = createFileItemHTML(file, uniqueIdentifier);
                if (fileItemHTML) {
                    // restrict file to upload if file size is more than 1 gb
                    if (file.size <= (1024*1024*1024)) {
                        // Inserting each file item into file list
                        fileList.insertAdjacentHTML("afterbegin", fileItemHTML);
                        const currentFileItem = document.querySelector(`#file-item-${uniqueIdentifier}`);
                        const cancelFileUploadButton = currentFileItem.querySelector(".cancel-button");
                        const xhr = handleFileUploading(file, uniqueIdentifier);
                        // Update file status text and change color of it 
                        const updateFileStatus = (status, color) => {
                            currentFileItem.querySelector(".file-status").innerText = status;
                            currentFileItem.querySelector(".file-status").style.color = color;
                        }
                        xhr.addEventListener("readystatechange", () => {
                            // Handling completion of file upload
                            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                                completedFiles++;
                                cancelFileUploadButton.remove();
                                updateFileStatus("Completed", "#00B125");
                                fileCompletedStatus.innerText = `${completedFiles} / ${totalFiles} files completed`;
                            }
                        });
                        // Handling cancellation of file upload
                        cancelFileUploadButton.addEventListener("click", () => {
                            xhr.abort(); // Cancel file upload
                            updateFileStatus("Cancelled", "#E3413F");
                            cancelFileUploadButton.remove();
                        });
                        // Show Alert if there is any error occured during file uploading
                        xhr.addEventListener("error", () => {
                            updateFileStatus("Error", "#E3413F");
                            // alert("An error occurred during the file upload!");
                            toastr["error"]("An error occurred during the file upload.");
                        });
                    }
                    else {
                        toastr["error"]("Maximum file size 1GB, file is too large to handle.");
                    }
                }
                else {
                    toastr["error"]("This file extension does not supported.");
                }
            });
            fileCompletedStatus.innerText = `${completedFiles} / ${totalFiles} files completed`;
        }
        // Function to handle file drop event
        fileUploadBox.addEventListener("drop", (e) => {
            e.preventDefault();
            handleSelectedFiles(e.dataTransfer.files);
            fileUploadBox.classList.remove("active");
            fileUploadBox.querySelector(".file-instruction").innerText = "Drag files here or";
        });
        // Function to handle file dragover event
        fileUploadBox.addEventListener("dragover", (e) => {
            e.preventDefault();
            fileUploadBox.classList.add("active");
            fileUploadBox.querySelector(".file-instruction").innerText = "Release to upload or";
        });
        // Function to handle file dragleave event
        fileUploadBox.addEventListener("dragleave", (e) => {
            e.preventDefault();
            fileUploadBox.classList.remove("active");
            fileUploadBox.querySelector(".file-instruction").innerText = "Drag files here or";
        });
        fileBrowseInput.addEventListener("change", (e) => handleSelectedFiles(e.target.files));
        fileBrowseButton.addEventListener("click", () => fileBrowseInput.click());
        // Function to handle file uploading
        const handleFileUploading = (file, uniqueIdentifier) => {
            const folderNameInput = $("#folderNameInput").val();
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder_name", folderNameInput);
            // Adding progress event listener to the ajax request
            xhr.upload.addEventListener("progress", (e) => {
                // Updating progress bar and file size element
                const fileProgress = document.querySelector(`#file-item-${uniqueIdentifier} .file-progress`);
                const fileSize = document.querySelector(`#file-item-${uniqueIdentifier} .file-size`);
                // Formatting the uploading or total file size into KB or MB accordingly
                const formattedFileSize = file.size >= 1024 * 1024  ? `${(e.loaded / (1024 * 1024)).toFixed(2)} MB / ${(e.total / (1024 * 1024)).toFixed(2)} MB` : `${(e.loaded / 1024).toFixed(2)} KB / ${(e.total / 1024).toFixed(2)} KB`;
                const progress = Math.round((e.loaded / e.total) * 100);
                fileProgress.style.width = `${progress}%`;
                fileSize.innerText = formattedFileSize;
            });
            // Opening connection to the server API endpoint "" and sending the form data
            if(fileType == 2) {
                xhr.open("POST", "/admin/files/upload/videos", true);
            }
            else {
                xhr.open("POST", "/admin/files/upload/images", true);
            }
            xhr.send(formData);
            return xhr;
        }
    }

    $("#folderNameSelect").on('change', function(){
        let folder_name = $(this).val().trim();
        if(folder_name) {
            $("#folderNameInput").val(folder_name);
            $(".file-uploader").show();
        }
        else {
            $("#folderNameInput").val(folder_name);
            $(".file-uploader").hide();
        }
    });

    $("#folderNameInput").on('keyup change', function(){
        let folder_name = $(this).val().trim();
        if(folder_name) {
            $(".file-uploader").show();
        }
        else {
            $(".file-uploader").hide();
        }
    });

/** file uploader js end */
});