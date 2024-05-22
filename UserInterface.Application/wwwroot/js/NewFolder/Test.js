
$(document).ready(async function () {
    await GetCompanyList();
});

async function GetCompanyList() {
    debugger
    try {
        const data = await $.ajax({
            url: '/Company/GetCompanyList',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        if (data && data.data && data.data.length > 0) {
            const companies = data.data;
            console.log('companies:', companies);
            onSuccess(companies);
        }
    } catch (error) {
        console.log('Error:', error);
    }
}

function onSuccess(companies) {
    if (companies.length > 0) {
        if ($.fn.DataTable.isDataTable('#CompanyTable')) {
             If initialized, destroy the DataTable first
            $('#CompanyTable').DataTable().destroy();
        }
        $('#CompanyTable').dataTable({
            processing: true,
            lengthChange: true,
            lengthMenu: [[5, 10, 20, 30, -1], [5, 10, 20, 30, 'All']],
            searching: true,
            ordering: true,
            paging: true,
            data: companies,
            columns: [
                {
                    data: 'Name',
                    render: function (data, type, row, meta) {
                        return row.name;
                    }
                },
                {
                    data: 'Contactperson',
                    render: function (data, type, row, meta) {
                        return row.contactperson;
                    }
                },
                {
                    data: 'ContactPerNum',
                    render: function (data, type, row, meta) {
                        return row.contactPerNum;
                    }
                },
                {
                    data: 'ContactNumber',
                    render: function (data, type, row, meta) {
                        return row.contactNumber;
                    }
                },
                {
                    data: 'IsActive',
                    render: function (data, type, row, meta) {
                        return row.isActive ? '<button class="btn btn-sm btn-primary rounded-pill">Yes</button>' : '<button class="btn btn-sm btn-danger rounded-pill">No</button>';
                    }
                },
                {
                    data: 'BIN',
                    render: function (data, type, row, meta) {
                        return row.bin;
                    }
                },
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        return '<button class="btn btn-primary btn-sm ms-1" onclick="editCompany(\'' + row.id + '\')">Edit</button>' + ' ' +
                            '<button class="btn btn-info btn-sm ms-1" onclick="showDetails(\'' + row.id + '\')">Details</button>' + ' ' +
                            '<button class="btn btn-danger btn-sm ms-1" onclick="deleteCompany(\'' + row.id + '\')">Delete</button>';
                    }
                }
            ]
        });
    }
}

// Initialize validation
const companyForm = $('#CompanyForm').validate({
    onkeyup: function (element) {
        $(element).valid();
    },
    rules: {
        Name: {
            required: true,
            minlength: 2,
            maxlength: 50
        },
        Contactperson: {
            required: true,
            minlength: 2,
            maxlength: 50
        },
        ContactPerNum: {
            required: true,
            digits: true,
            minlength: 11,
            maxlength: 11
        },
        ContactNumber: {
            required: true,
            digits: true,
            minlength: 11,
            maxlength: 11
        },
        BIN: {
            required: true
        }
    },
    messages: {
        Name: {
            required: "Name is required.",
            minlength: "Name must be between 2 and 50 characters.",
            maxlength: "Name must be between 2 and 50 characters."
        },
        Contactperson: {
            required: "Contact Person is required.",
            minlength: "Contact Person must be between 2 and 50 characters.",
            maxlength: "Contact Person must be between 2 and 50 characters."
        },
        ContactPerNum: {
            required: "Contact Person Number is required.",
            digits: "Contact Person Number must contain only digits.",
            minlength: "Contact Person Number must be exactly 11 digits.",
            maxlength: "Contact Person Number must be exactly 11 digits."
        },
        ContactNumber: {
            required: "Contact Number is required.",
            digits: "Contact Number must contain only digits.",
            minlength: "Contact Number must be exactly 11 digits.",
            maxlength: "Contact Number must be exactly 11 digits."
        },
        BIN: {
            required: "BIN is required."
        }
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
    }
});

// Bind validation on change
$('#CompanyForm input[type="text"]').on('change', function () {
    companyForm.element($(this));
});
$('#CompanyForm input[type="text"]').on('focus', function () {
    companyForm.element($(this));
});
function resetValidation() {
    companyForm.resetForm(); // Reset validation
    $('.form-group .invalid-feedback').remove(); // Remove error messages
    $('#CompanyForm input').removeClass('is-invalid'); // Remove error styling
}


$('#btn-Create').click(function () {
    $('#modelCreate input[type="text"]').val('');
    $('#modelCreate').modal('show');
    $('#btnSave').show();
    $('#btnUpdate').hide();
});



// Function to handle Enter key press
function handleEnterKey(event) {
    if (event.keyCode === 13) { // Check if Enter key is pressed
        event.preventDefault(); // Prevent default form submission
        if ($('#btnSave').is(":visible")) {
            $('#btnSave').click(); // Trigger save button click if Save button is visible
        } else if ($('#btnUpdate').is(":visible")) {
            $('#btnUpdate').click(); // Trigger update button click if Update button is visible
        }
    }
}


// Open modal and focus on the first input field
$('#modelCreate').on('shown.bs.modal', function () {
    $('#CompanyForm input:first').focus();
});

// Listen for Enter key press on input fields
$('#modelCreate').on('keypress', 'input', handleEnterKey);

// Submit button click event
$('#btnSave').click(async function () {
    // Check if the form is valid
    if ($('#CompanyForm').valid()) {
        // Proceed with form submission
        var formData = $('#CompanyForm').serialize();
        try {
            const response = await $.ajax({
                url: '/Company/Create',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            $('#modelCreate').modal('hide');
            if (response === true) {
                // Show success message
                $('#successMessage').text('Your company was successfully saved.');
                $('#successMessage').show();
                await GetCompanyList();
                $('#CompanyForm')[0].reset();
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }
});

// Edit Company
async function editCompany(id) {
    console.log("Edit company with id:", id);

    // Reset form validation
    debugger

    try {
        const data = await $.ajax({
            url: '/Company/GetCompany/' + id,
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });

        // Populate form fields with company data
        $('#btnSave').hide();
        $('#btnUpdate').show();
        $('#Name').val(data.name);
        $('#Contactperson').val(data.contactperson);
        $('#ContactPerNum').val(data.contactPerNum);
        $('#ContactNumber').val(data.contactNumber);
        $('#BIN').val(data.bin);
        debugger
        resetValidation()
        // Show modal for editing
        $('#modelCreate').modal('show');
        // Update button click event handler
        $('#btnUpdate').off('click').on('click', function () {
            updateCompany(id);
        });
    } catch (error) {
        console.log('Error:', error);
    }
}


async function updateCompany(id) {
    if ($('#CompanyForm').valid()) {
        const formData = $('#CompanyForm').serialize();
        console.log(formData);
        try {
            const response = await $.ajax({
                url: '/Company/Update/' + id,
                type: 'put',
                contentType: 'application/x-www-form-urlencoded',
                data: formData
            });

            $('#modelCreate').modal('hide');
            if (response === true) {
                // Show success message
                $('#successMessage').text('Your company was successfully updated.');
                $('#successMessage').show();
                // Reset the form
                $('#CompanyForm')[0].reset();
                // Update the company list
                await GetCompanyList();
            }
        } catch (error) {
            console.log('Error:', error);
            // Show error message
            $('#errorMessage').text('An error occurred while updating the company.');
            $('#errorMessage').show();
        }
    }
}

// Details Company
async function showDetails(id) {
    $('#deleteAndDetailsModel').modal('show');
    // Fetch company details and populate modal
    try {
        const response = await $.ajax({
            url: '/Company/GetCompany', // Assuming this is the endpoint to fetch company details
            type: 'GET',
            data: { id: id }
        });

        console.log(response);
        // Assuming response contains company details
        populateCompanyDetails(response);
    } catch (error) {
        console.log(error);
    }
}

function deleteCompany(id) {
    $('#deleteAndDetailsModel').modal('show');

    $('#companyDetails').empty();
    $('#btnDelete').click(function () {
        $.ajax({
            url: '/Company/Delete',
            type: 'POST',
            data: { id: id },
            success: function (response) {
                $('#deleteAndDetailsModel').modal('hide');
                GetCompanyList();
            },
            error: function (xhr, status, error) {
                console.log(error);
                $('#deleteAndDetailsModel').modal('hide');
            }
        });
    });
}







//$(document).ready(async function () {
//    await GetOrderList();
//});

//async function GetOrderList() {
//    debugger
//    try {
//        const orders = await $.ajax({
//            url: '/Order/GetOrderList',
//            type: 'get',
//            dataType: 'json',
//            contentType: 'application/json;charset=utf-8'
//        });
//        const userData = await $.ajax({
//            url: '/User/GetallUser',
//            type: 'get',
//            dataType: 'json',
//            contentType: 'application/json;charset=utf-8'
//        });
//        const productData = await $.ajax({
//            url: '/Product/GetAllProduct',
//            type: 'get',
//            dataType: 'json',
//            contentType: 'application/json;charset=utf-8'
//        });
//        const returnProductData = await $.ajax({
//            url: '/ProdReturn/GetallProdReturn',
//            type: 'get',
//            dataType: 'json',
//            contentType: 'application/json;charset=utf-8'
//        });

//        if (orders && orders.data) { // Check if orders and orders.data exist
//            onSuccess(orders.data, userData.data, productData.data, returnProductData.data);
//        }
//    } catch (error) {
//        console.log('Error:', error);

//    }
//}


//function onSuccess(orders, usersData, productsData, returnProductsData) {
//    debugger
//    console.log('orders:', orders);
//    console.log('usersData:', usersData);
//    console.log('productsData:', productsData);
//    console.log('returnProductsData:', returnProductsData);

//    if (orders && usersData && productsData && returnProductsData) {
//        // Convert users array to a map for easy lookup
//        var usersMap = {};
//        usersData.forEach(function (user) {
//            usersMap[user.id] = user;
//        });

//        // Convert products array to a map for easy lookup
//        var productsMap = {};
//        productsData.forEach(function (product) {
//            productsMap[product.id] = product;
//        });

//        // Convert return products array to a map for easy lookup
//        var returnProductsMap = {};
//        returnProductsData.forEach(function (returnProduct) {
//            returnProductsMap[returnProduct.id] = returnProduct;
//        });

//        // Merge order and user data
//        var mergedData = orders.map(function (order) {
//            var user = usersMap[order.userId];
//            var product = productsMap[order.productId];
//            var returnProduct = returnProductsMap[order.returnProductId];
//            console.log('order:', order);
//            console.log('user:', user);
//            console.log('product:', product);
//            console.log('returnProduct:', returnProduct);
//            if (order) {
//                return {
//                    id: order.id,
//                    fullName: user.firstName + ' ' + user.lastName,
//                    phone: user ? user.phoneNumber : "No Number",
//                    productOrder: product ? product.name : "No Order",
//                    productReturn: returnProduct ? returnProduct.name : "No Return",
//                    isActive: order.isActive
//                };

//            }
//            return null; // Skip if any data not found
//        }).filter(Boolean); // Remove null entries

//        console.log('onSuccess:', mergedData);
//        $('#CompanyTable').dataTable({
//            destroy: true,
//            processing: true,
//            lengthChange: true,
//            lengthMenu: [[5, 10, 20, 30, -1], [5, 10, 20, 30, 'All']],
//            searching: true,
//            ordering: true,
//            paging: true,
//            data: mergedData,
//            columns: [
//                {
//                    data: 'fullName',
//                    render: function (data, type, row, meta) {
//                        return data;
//                    }
//                },
//                {
//                    data: 'phone',
//                    render: function (data, type, row, meta) {
//                        return data;
//                    }
//                },
//                {
//                    data: 'productOrder',
//                    render: function (data, type, row, meta) {
//                        return data;
//                    }
//                },
//                {
//                    data: 'productReturn',
//                    render: function (data, type, row, meta) {
//                        return data;
//                    }
//                },
//                {
//                    data: 'isActive',
//                    render: function (data, type, row, meta) {
//                        return data ? '<button class="btn btn-sm btn-primary rounded-pill">Yes</button>' : '<button class="btn btn-sm btn-danger rounded-pill">No</button>';
//                    }
//                },
//                {
//                    data: 'id',
//                    render: function (data) {
//                        return '<button class="btn btn-primary btn-sm ms-1" onclick="editCompany(\'' + data + '\')">Edit</button>' + ' ' +
//                            '<button class="btn btn-info btn-sm ms-1" onclick="showDetails(\'' + data + '\')">Details</button>' + ' ' +
//                            '<button class="btn btn-danger btn-sm ms-1" onclick="deleteCompany(\'' + data + '\')">Delete</button>';
//                    }
//                }
//            ]
//        });
//    }
//}




////======================================================================



//// Initialize validation
//const companyForm = $('#CompanyForm').validate({
//    onkeyup: function (element) {
//        $(element).valid();
//    },
//    rules: {
//        UserId: {
//            required: true,
//        },
//        ProductId: {
//            required: true,
//        }
//    },
//    messages: {
//        UserId: {
//            required: " User Name is required.",
//        },
//        ProductId: {
//            required: " Product Name is required.",
//        }
//    },
//    errorElement: 'div',
//    errorPlacement: function (error, element) {
//        error.addClass('invalid-feedback');
//        element.closest('.form-group').append(error);
//    },
//    highlight: function (element, errorClass, validClass) {
//        $(element).addClass('is-invalid');
//    },
//    unhighlight: function (element, errorClass, validClass) {
//        $(element).removeClass('is-invalid');
//    }
//});

//// Bind validation on change
//$('#userDropdown, #productDropdown, #ReturnProductDropdown').on('change focus', function () {
//    companyForm.element($(this));
//});
//function resetValidation() {
//    companyForm.resetForm(); // Reset validation
//    $('.form-group .invalid-feedback').remove(); // Remove error messages
//    $('#CompanyForm input').removeClass('is-invalid'); // Remove error styling
//}


//$('#btn-Create').click(function () {
//    $('#modelCreate input[type="text"]').val('');
//    $('#modelCreate').modal('show');
//    $('#btnSave').show();
//    $('#btnUpdate').hide();
//    populateUserDropdown();
//    populateProductDropdown();
//    populateReturnProductDropdown();
//});



//// Function to handle Enter key press
//function handleEnterKey(event) {
//    if (event.keyCode === 13) { // Check if Enter key is pressed
//        event.preventDefault(); // Prevent default form submission
//        if ($('#btnSave').is(":visible")) {
//            $('#btnSave').click(); // Trigger save button click if Save button is visible
//        } else if ($('#btnUpdate').is(":visible")) {
//            $('#btnUpdate').click(); // Trigger update button click if Update button is visible
//        }
//    }
//}


//// Open modal and focus on the first input field
//$('#modelCreate').on('shown.bs.modal', function () {
//    $('#CompanyForm input:first').focus();
//});

//// Listen for Enter key press on input fields
//$('#modelCreate').on('keypress', 'input', handleEnterKey);

////======================================================================
//// Submit button click event
//$('#btnSave').click(async function () {
//    console.log("Save");
//    debugger
//    // Check if the form is valid
//    if ($('#CompanyForm').valid()) {
//        // Proceed with form submission
//        var formData = $('#CompanyForm').serialize();
//        console.log(formData);
//        try {
//            var response = await $.ajax({
//                url: '/Order/Create',
//                type: 'post',
//                contentType: 'application/x-www-form-urlencoded',
//                data: formData
//            });

//            $('#modelCreate').modal('hide');
//            if (response === true) {
//                // Show success message
//                $('#successMessage').text('Your Delivery Address was successfully saved.');
//                $('#successMessage').show();
//                await GetOrderList();
//                $('#CompanyForm')[0].reset();
//            }
//        } catch (error) {
//            console.log('Error:', error);
//        }
//    }
//});

//async function populateUserDropdown() {
//    try {
//        const data = await $.ajax({
//            url: '/User/GetallUser',
//            type: 'get',
//            dataType: 'json',
//            contentType: 'application/json;charset=utf-8'
//        });

//        // Clear existing options
//        $('#userDropdown').empty();
//        // Add default option
//        $('#userDropdown').append('<option value="">Select User</option>');
//        // Add user options
//        console.log(data.data);
//        $.each(data.data, function (index, user) {
//            $('#userDropdown').append('<option value="' + user.id + '">' + user.userName + '</option>');
//        });
//    } catch (error) {
//        console.error(error);
//        // Handle error
//    }
//}
//async function populateProductDropdown() {
//    debugger
//    try {
//        const data = await $.ajax({
//            url: '/Product/GetAllProduct',
//            type: 'get',
//            dataType: 'json',
//            contentType: 'application/json;charset=utf-8'
//        });

//        // Clear existing options
//        $('#productDropdown').empty();
//        // Add default option
//        $('#productDropdown').append('<option value="">Select User</option>');
//        // Add user options
//        console.log(data.data);
//        $.each(data.data, function (index, product) {
//            $('#productDropdown').append('<option value="' + product.id + '">' + product.name + '</option>');
//        });
//    } catch (error) {
//        console.error(error);
//        // Handle error
//    }
//}
//async function populateReturnProductDropdown() {
//    debugger
//    try {
//        const data = await $.ajax({
//            url: '/ProdReturn/GetallProdReturn',
//            type: 'get',
//            dataType: 'json',
//            contentType: 'application/json;charset=utf-8'
//        });

//        // Clear existing options
//        $('#ReturnProductDropdown').empty();
//        // Add default option
//        $('#ReturnProductDropdown').append('<option value="">Select User</option>');
//        // Add user options
//        console.log(data.data);
//        $.each(data.data, function (index, returnProduct) {
//            $('#ReturnProductDropdown').append('<option value="' + returnProduct.id + '">' + returnProduct.name + '</option>');
//        });
//    } catch (error) {
//        console.error(error);
//        // Handle error
//    }
//}

//// Call the function to populate the dropdown when the page loads
//populateUserDropdown();
//populateProductDropdown();
//populateReturnProductDropdown();

//// Optionally, you can refresh the user list on some event, like a button click
//$('#refreshButton').click(function () {
//    populateUserDropdown();
//});

//// Edit Company
//async function editCompany(id) {
//    console.log("Edit company with id:", id);
//    await populateUserDropdown();
//    await populateProductDropdown();
//    await populateReturnProductDropdown();
//    // Reset form validation
//    debugger

//    try {
//        const data = await $.ajax({
//            url: '/Order/GetById/' + id,
//            type: 'get',
//            dataType: 'json',
//            contentType: 'application/json;charset=utf-8'
//        });

//        // Populate form fields with company data
//        $('#btnSave').hide();
//        $('#btnUpdate').show();
//        $('#userDropdown').val(data.userId);
//        $('#productDropdown').val(data.productId);
//        $('#ReturnProductDropdown').val(data.returnProductId);


//        debugger
//        resetValidation()
//        // Show modal for editing
//        $('#modelCreate').modal('show');
//        // Update button click event handler
//        $('#btnUpdate').off('click').on('click', function () {
//            updateCompany(id);
//        });
//    } catch (error) {
//        console.log('Error:', error);
//    }
//}

//async function updateCompany(id) {
//    if ($('#CompanyForm').valid()) {
//        const formData = $('#CompanyForm').serialize();
//        console.log(formData);
//        try {
//            var response = await $.ajax({
//                url: '/Order/Update/' + id,
//                type: 'put',
//                contentType: 'application/x-www-form-urlencoded',
//                data: formData
//            });

//            $('#modelCreate').modal('hide');
//            if (response === true) {
//                // Show success message
//                $('#successMessage').text('Your Delivery Address was successfully updated.');
//                $('#successMessage').show();
//                // Reset the form
//                $('#CompanyForm')[0].reset();
//                // Update the company list
//                await GetOrderList();
//            }
//        } catch (error) {
//            console.log('Error:', error);
//            // Show error message
//            $('#errorMessage').text('An error occurred while updating the company.');
//            $('#errorMessage').show();
//        }
//    }
//}

//// Details Company
//async function showDetails(id) {
//    $('#deleteAndDetailsModel').modal('show');
//    // Fetch company details and populate modal
//    try {
//        const response = await $.ajax({
//            url: '/Company/GetCompany',
//            type: 'GET',
//            data: { id: id }
//        });

//        console.log(response);
//        // Assuming response contains company details
//        populateCompanyDetails(response);
//    } catch (error) {
//        console.log(error);
//    }
//}

//async function deleteCompany(id) {
//    debugger
//    $('#deleteAndDetailsModel').modal('show');

//    $('#companyDetails').empty();
//    $('#btnDelete').click(async function () {
//        try {
//            const response = await $.ajax({
//                url: '/Order/Delete',
//                type: 'POST',
//                data: { id: id }
//            });

//            $('#deleteAndDetailsModel').modal('hide');
//            await GetOrderList();
//        } catch (error) {
//            console.log(error);
//            $('#deleteAndDetailsModel').modal('hide');
//        }
//    });
//}


