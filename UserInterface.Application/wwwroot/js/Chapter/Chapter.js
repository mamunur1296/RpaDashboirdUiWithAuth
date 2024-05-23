$(document).ready(async function () {
    debugger
    await GetAllList();

});
async function GetAllList() {
    debugger
    try {
        const Chapters = await $.ajax({
            url: '/Chapter/GetAll',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        if (Chapters && Chapters.length > 0) {
            onSuccess(Chapters);
        }
    } catch (error) {
        console.log('Error:', error);
    }
}
function onSuccess(Chapters) {
    debugger
    if (Chapters.length > 0) {
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
            data: Chapters,
            columns: [
                {
                    data: 'title',
                    render: function (data, type, row, meta) {
                        return data;
                    }
                },
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        return '<button class="btn btn-add btn-sm ms-1" onclick="editItem(\'' + row.id + '\')"><i class="fa fa-pencil"></i></button>' + ' ' +
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
    $('#createAndUpdateForm')[0].reset();
});
$(document).ready(function () {
    // Initialize form validation

});

// Initialize form validation
$('#createAndUpdateForm').validate({
    rules: {
        title: { required: true },
    },
    messages: {
        title: { required: "Title Name is required" },
       
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
                url: '/Chapter/Create',
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

// Edit / Update Sections 

async function editItem(id) {
    console.log("Edit company with id:", id);

    // Reset form validation
    debugger
    $('#createAndUpdateForm')[0].reset();
    try {
        const data = await $.ajax({
            url: '/Chapter/GetById/' + id,
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Populate form fields with company data
        $('#btnSave').hide();
        $('#btnUpdate').show();
        $('#title').val(data.title);
        debugger

        // Show modal for editing
        $('#ModelCreateAndEdit').modal('show');
        // Update button click event handler
        $('#btnUpdate').click(async function (e) {
            debugger
            e.preventDefault();
            update(id);
        });
    } catch (error) {
        console.log('Error:', error);
    }
}


async function update(id) {
    debugger
    if ($('#createAndUpdateForm').valid()) {
        const formData = $('#createAndUpdateForm').serialize();
        console.log(formData);
        try {
            const response = await $.ajax({
                url: '/Chapter/Update/' + id,
                type: 'put',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            $('#ModelCreateAndEdit').modal('hide');
            if (response) {
                // Show success message
                $('#successMessage').text('Your company was successfully updated.');
                $('#successMessage').show();
                // Reset the form
                $('#createAndUpdateForm')[0].reset();
                // Update the company list
                await GetAllList();
            }
        } catch (error) {
            console.log('Error:', error);
            // Show error message
            $('#errorMessage').text('An error occurred while updating the company.');
            $('#errorMessage').show();
        }
    }
}





















// Delete Sections 




function deleteItem(id) {
    debugger;
    console.log(id);
    $('#DeleteModel').modal('show');

    $('#btnDelete').click(function () { // Remove previous click event handlers
        $.ajax({
            url: '/Chapter/Delete',
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