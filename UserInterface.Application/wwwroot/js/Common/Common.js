// Get All List 
async function GetAllList(endpoint) {
    debugger
    try {
        const reisponse = await $.ajax({
            url: endpoint,
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        if (reisponse && reisponse.length > 0) {
            return reisponse;
        }
    } catch (error) {
        console.log('Error:', error);
    }
}