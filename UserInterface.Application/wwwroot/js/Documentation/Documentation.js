$(document).ready(async function () {
    // Initial load of chapters and questions
    await populateChapters(false);
    await populateQuestions();

    // Event delegation for dynamically created buttons
    $('#chapter-container').on('click', '.chapter-button', async function () {
        const chapterId = $(this).data('id');
        highlightActiveChapter($(this));
        await populateTopics(chapterId);
        await populateQuestions({ chapterId: chapterId });
    });

    $('#chapter-container').on('click', '#expand-button', async function () {
        await populateChapters(true);
    });

    $('#chapter-container').on('click', '#collapse-button', async function () {
        await populateChapters(false);
    });

    $('#Topic-container').on('click', '.topic-button', async function () {
        const topicId = $(this).data('id');
        const chapterId = $(this).closest('.chapter-button').data('id'); // Get chapter ID from the closest chapter button
        highlightActiveTopic($(this));
        await populateQuestions({ chapterId: chapterId, topicId: topicId });
    });
});

async function populateChapters(expand) {
    debugger
    const chapters = await GetAllChapter();
    const container = $('#chapter-container');
    container.empty();

    const initialChapters = chapters; // First line of chapters
    const allChapters = chapters; // All chapters

    const chaptersToShow = expand ? allChapters : initialChapters;

    chaptersToShow.forEach((chapter) => {
        debugger
        const button = `<button type="button" class="btn btn-secondary chapter-button mb-1 me-1" data-id="${chapter.id}">${chapter.title}</button>`;
        container.append(button);
    });

    //// Add expand and collapse buttons dynamically
    //if (expand) {
    //    const collapseButton = `<button type="button" class="btn btn-secondary" id="collapse-button">Collapse <<</button>`;
    //    container.append(collapseButton);
    //} else {
    //    const expandButton = `<button type="button" class="btn btn-secondary" id="expand-button">Expand >></button>`;
    //    container.append(expandButton);
    //}
}

async function populateTopics(chapterId) {
    debugger
    const topics = await GetAllTopic();
    const container = $('#Topic-container');
    container.empty();

    // Filter topics based on the selected chapterId
    const filterTopics = topics.filter(topic => topic.chapterid === chapterId);

    filterTopics.forEach((topic) => {
        debugger
        const button = `<button type="button" class="btn btn-secondary topic-button mb-1 me-1" data-id="${topic.id}">${topic.title}</button>`;
        container.append(button);
    });
}

function highlightActiveChapter(button) {
    // Remove active class from all buttons
    $('.chapter-button').removeClass('btn-success').addClass('btn-secondary');

    // Add active class to the clicked button
    button.removeClass('btn-secondary').addClass('btn-success');
    $('#Topic-container').empty(); // Clear topics on new chapter selection
}

function highlightActiveTopic(button) {
    // Remove active class from all buttons
    $('.topic-button').removeClass('btn-success').addClass('btn-secondary');

    // Add active class to the clicked button
    button.removeClass('btn-secondary').addClass('btn-success');
}




async function populateQuestions(filter = {}) {
    debugger;
    const questions = await GetAllQuestions();
    const container = $('#QuessainDataTable');

    // Destroy the existing DataTable instance if it exists
    if ($.fn.DataTable.isDataTable(container)) {
        container.DataTable().clear().destroy();
    }

    container.find('tbody').empty(); 

    console.log("ChapterID", filter.chapterId);
    console.log("topicId", filter.topicId);

    let filteredQuestions = questions;

    if (filter.chapterId) {
        filteredQuestions = filteredQuestions.filter(q => q.chapterId === filter.chapterId);
    }

    if (filter.topicId) {
        filteredQuestions = filteredQuestions.filter(q => q.topicId === filter.topicId);
    }

    console.log(filteredQuestions);

    const mergedData = filteredQuestions.map((question, i) => {
        debugger;
        return {
            id: question.id,
            srNo: i + 1,
            title: question.title,
            answers: question.answers.length > 30 ? question.answers.slice(0, 35) + "..." : question.answers
        };
    });

    $('#QuessainDataTable').DataTable({
        processing: true,
        lengthChange: true,
        lengthMenu: [[15, 20, 30, -1], [ 15, 20, 30, 'All']],
        searching: true,
        ordering: true,
        paging: true,
        data: mergedData,
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return row.srNo;
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return `<p class="text-success font-weight-bold">${row.title}</p>`;
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return row.answers;
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return '<button class="btn btn-dark btn-sm ms-1" onclick="SowDetails(\'' + row.id + '\')">Details</button>';
                }
            }
        ]
    });
}


async function SowDetails(id) {
    debugger;
    console.log(id);
    const quessain = await getquessainByid(id);

    $('#title').text(quessain.title);
    $('#answers').text(quessain.answers);

    $('#ansModel').modal('show');
}




async function getquessainByid(id) {
    debugger
    try {
        const question = await $.ajax({
            url: '/Questions/GetById/' + id,
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        if (question) {
            return question;
        }
    } catch (error) {
        console.log('Error:', error);
    }
}














async function GetAllChapter() {
    debugger
    try {
        const Chapters = await $.ajax({
            url: '/Chapter/GetAll',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        if (Chapters) {
            return Chapters;
        }
    } catch (error) {
        console.log('Error:', error);
    }
}
async function GetAllTopic() {
    debugger
    try {
        const Topics = await $.ajax({
            url: '/Topic/GetAll',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        if (Topics) {
            return Topics;
        }
        
    } catch (error) {
        console.log('Error:', error);
    }
}

async function GetAllQuestions() {
    debugger
    try {
        const Questions = await $.ajax({
            url: '/Questions/GetAll',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        });
        if (Questions) {
            return Questions;
        }
    } catch (error) {
        console.log('Error:', error);
    }
}