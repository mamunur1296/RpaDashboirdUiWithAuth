$(document).ready(async function () {
    debugger
    await GetAllList();

});
async function GetAllList() {
    debugger
    try {
        const Topics = await $.ajax({
            url: '/Topic/GetAll',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        const Chapters = await $.ajax({
            url: '/Chapter/GetAll',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        if (Topics) {
            onSuccess(Topics,Chapters);
        }
    } catch (error) {
        console.log('Error:', error);
    }
}



function onSuccess(Topics, Chapters) {
    debugger

    if (Topics) {
        // Convert users array to a map for easy lookup
        var ChapterMap = {};
        Chapters.forEach(function (Chapter) {
            ChapterMap[Chapter.id] = Chapter;
        });
        // Merge order and user data
        var mergedData = Topics.map(function (Topic) {
            var chapter = ChapterMap[Topic.chapterid];
            if (Topic) {
                return {
                    id: Topic.id,
                    tipicName: Topic.title,
                    chapterName: chapter.title
                };

            }
            return null; // Skip if any data not found
        }).filter(Boolean); // Remove null entries
        $('#UsersDataTable').dataTable({
            destroy: true,
            processing: true,
            lengthChange: true,
            lengthMenu: [[5, 10, 20, 30, -1], [5, 10, 20, 30, 'All']],
            searching: true,
            ordering: true,
            paging: true,
            data: mergedData,
            columns: [
                {
                    data: 'tipicName',
                    render: function (data, type, row, meta) {
                        return data;
                    }
                },
                {
                    data: 'chapterName',
                    render: function (data, type, row, meta) {
                        return data;
                    }
                },
                {
                    data: 'id',
                    render: function (data) {
                        return '<button class="btn btn-primary btn-sm ms-1" onclick="editItem(\'' + data + '\')">Edit</button>' + ' ' +
                            '<button class="btn btn-info btn-sm ms-1" onclick="showDetails(\'' + data + '\')">Details</button>' + ' ' +
                            '<button class="btn btn-danger btn-sm ms-1" onclick="deleteItem(\'' + data + '\')">Delete</button>';
                    }
                }
            ]
        });
    }
}


// Start Creat Part 
$('#btn-Create').click(function () {
    debugger
    $('#btnSave').show();
    $('#btnUpdate').hide();
    $('#createAndUpdateForm')[0].reset();
    populateChapterDropdown();
    $('#lebelUpdate').hide();
    $('#lebelAdd').show();
});


// Initialize form validation
$('#createAndUpdateForm').validate({
    rules: {
        title: { required: true },
        Chapterid: { required: true },
    },
    messages: {
        title: { required: "Title Name is required" },
        Chapterid: { required: "Chapter Name is required" },

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

async function populateChapterDropdown() {
    debugger
    try {
        const data = await $.ajax({
            url: '/Chapter/GetAll',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Clear existing options
        $('#ChapterDropdown').empty();
        // Add default option
        $('#ChapterDropdown').append('<option value="">Select Chapter</option>');
        // Add user options
        console.log(data);
        $.each(data, function (index, chapter) {
            $('#ChapterDropdown').append('<option value="' + chapter.id + '">' + chapter.title + '</option>');
        });
    } catch (error) {
        console.error(error);
        // Handle error
    }
}

$('#btnSave').click(async function (e) {
    e.preventDefault(); // Prevent default form submission
    debugger
    // Check if the form is valid (assuming you have a validation plugin)
    if ($('#createAndUpdateForm').valid()) {
        var formData = $('#createAndUpdateForm').serialize();
        try {
            const response = await $.ajax({
                url: '/Topic/Create',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            if (response) {
                // Show success message
                $('#successMessage').text('Your Topic successfully saved.');
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
    $('#lebelUpdate').show();
    $('#lebelAdd').hide();
    populateChapterDropdown();
    // Reset form validation
    debugger
    $('#createAndUpdateForm')[0].reset();
    try {
        const data = await $.ajax({
            url: '/Topic/GetById/' + id,
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Populate form fields with company data
        $('#btnSave').hide();
        $('#btnUpdate').show();
        $('#title').val(data.title);
        $('#ChapterDropdown').val(data.chapterid);
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
                url: '/Topic/Update/' + id,
                type: 'put',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            $('#ModelCreateAndEdit').modal('hide');
            if (response) {
                // Show success message
                $('#successMessage').text('Your Topic successfully updated.');
                $('#successMessage').show();
                // Reset the form
                $('#createAndUpdateForm')[0].reset();
                // Update the company list
                await GetAllList();
            }
        } catch (error) {
            console.log('Error:', error);
            // Show error message
            $('#errorMessage').text('An error occurred while updating the Topic.');
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
            url: '/Topic/Delete',
            type: 'POST',
            data: { id: id },
            success: function (response) {
                $('#DeleteModel').modal('hide'); // Hide the modal first
                $('#successMessage').text('Your Topic successfully Delete .');
                $('#successMessage').show();
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