$(document).ready(async function () {
    debugger
    await GetAllList();
    
});
async function GetAllList() {
    debugger
    try {
        const Users = await $.ajax({
            url: '/ApplicationUser/GetAll',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        if (Users && Users.length > 0) {
            onSuccess(Users);
        }
    } catch (error) {
        console.log('Error:', error);
    }
}
function onSuccess(Users) {
    debugger
    if (Users.length > 0) {
        if (typeof $.fn.DataTable !== 'undefined' && $.fn.DataTable.isDataTable('#UsersDataTable')) {
            $('#UsersDataTable').DataTable().destroy();
        }
        $('#UsersDataTable').dataTable({
            processing: true,
            lengthChange: true,
            lengthMenu: [[5, 10, 20, 30, -1], [5, 10, 20, 30, 'All']],
            searching: true,
            ordering: true,
            paging: true,
            data: Users,
            columns: [
                {
                    data: 'fullName',
                    render: function (data, type, row, meta) {
                        return data;
                    }
                },
                {
                    data: 'userName',
                    render: function (data, type, row, meta) {
                        return row.userName;
                    }
                },
                {
                    data: 'email',
                    render: function (data, type, row, meta) {
                        return row.email;
                    }
                },
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        return '<button class="btn btn-add btn-sm ms-1" onclick="editCompany(\'' + row.id + '\')"><i class="fa fa-pencil"></i></button>' + ' ' +
                            '<button class="btn btn-info btn-sm ms-1" onclick="showDetails(\'' + row.id + '\')"><i class="fa fa-info-circle"></i></button>' + ' ' +
                            '<button class="btn btn-danger btn-sm ms-1" onclick="deleteItem(\'' + row.id + '\')"><i class="fa fa-trash-o"></i></button>';
                    }
                }
            ]
        });
    }
}


// Start Creat Part 
$('#btn-Create').click(function () {
    //$('#DeleteModel input[type="text"]').val('');
    //$('#DeleteModel').modal('show');
    $('#btnSave').show();
    $('#btnUpdate').hide();
});
$(document).ready(function () {
    // Initialize form validation
  
});

// Initialize form validation
$('#createAndUpdateForm').validate({
    rules: {
        FullName: { required: true },
        UserName: { required: true },
        Email: { required: true, email: true },
        Password: { required: true },
        ConfirmationPassword: { required: true, equalTo: "#Password" }
    },
    messages: {
        FullName: { required: "Customer Name is required" },
        UserName: { required: "User Name is required" },
        Email: { required: "Email is required", email: "Please enter a valid email address" },
        Password: { required: "Password is required" },
        ConfirmationPassword: { required: "Confirmation Password is required", equalTo: "Passwords do not match" }
    },
    errorElement: 'div',
    errorPlacement: function (error, element) {
        error.addClass('invalid-feedback');
        element.closest('.form-group').append(error);
    },
    highlight: function (element, errorClass, validClass) {
        $(element).addClass('is-invalid');
    },
    unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass('is-invalid');
    },
    // Validate on keyup, change, and blur events
    onkeyup: function (element) {
        $(element).valid();
    },
    onchange: function (element) {
        $(element).valid();
    },
    onblur: function (element) {
        $(element).valid();
    }
});



$('#btnSave').click(async function (e) {
    e.preventDefault(); // Prevent default form submission
    debugger
    // Check if the form is valid (assuming you have a validation plugin)
    if ($('#createAndUpdateForm').valid()) {
        var formData = $('#createAndUpdateForm').serialize();
        try {
            const response = await $.ajax({
                url: '/ApplicationUser/Create',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            if (response) {
                // Show success message
                $('#successMessage').text('Your company was successfully saved.');
                $('#successMessage').show();

                // Hide the modal after successful save using jQuery's `modal('hide')`
                $('#ModelCreateAndEdit').modal('hide');

                await GetAllList();
                $('#createAndUpdateForm')[0].reset();
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }
});

function deleteItem(id) {
    debugger;
    console.log(id);
    $('#DeleteModel').modal('show');

    $('#DeleteModel').off('click').on('click', function () { // Remove previous click event handlers
        $.ajax({
            url: '/ApplicationUser/Delete',
            type: 'POST',
            data: { id: id },
            success: function (response) {
                $('#DeleteModel').modal('hide'); // Hide the modal first
            },
            error: function (xhr, status, error) {
                console.log(error);
                $('#DeleteModel').modal('hide'); // Hide the modal on error too
            }
        });
    });
}

// Call GetAllList() after the modal is hidden (assuming it's a separate function)
$('#DeleteModel').on('hidden.bs.modal', function (e) {
    GetAllList();
});