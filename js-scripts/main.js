// hide/show sidebar
const sidebar = document.querySelector('.sidebar');
const showSidebarBtn = document.querySelector('.showSidebarBtn');
const hideSidebar = document.querySelector('.hideSidebar');
const bodyContainer = document.querySelector('.body-container');
const logoContainer = document.querySelector('.logo-container');

const hideSidebarFunc = () => {
    sidebar.classList.add('hidebar');
    bodyContainer.classList.add('extend-board-width');
    logoContainer.classList.remove('toggleLogoDisplay');
}

const showSidebarFunc = () => {
    sidebar.classList.remove('hidebar');
    bodyContainer.classList.remove('extend-board-width');
    logoContainer.classList.add('toggleLogoDisplay');
}

hideSidebar.addEventListener('click', hideSidebarFunc);
showSidebarBtn.addEventListener('click', showSidebarFunc);

// add active class to created board
const boards = document.querySelectorAll('.created-boards > div');


const addNewBoardModal = document.querySelector('.addNewBoard');
const addNewBoardSidebarBtn = document.querySelector('.createBoardBtn');
const addNewBoardModalBody = document.querySelector('.addNewBoard');
const addBoardForm = document.querySelector('#addBoardForm');

// toggle add new task modal
const addNewTaskModal = document.querySelector('.add-task-bg-overlay');
const addNewTaskForm = document.querySelector('.add-task-form');

// get add new task button in header
const addNewTaskHeaderBtn = document.querySelector('.newTaskBtnWrapper button');

// enable add new task button in header
const enableHeaderBtn = () => {
    const headerBtn = document.querySelector('.newTaskBtnWrapper button');
    headerBtn.removeAttribute('disabled');
}


// display new board model function
const displayAddNewBoardModal = () => {
    addNewBoardModal.style.display = 'block';
    addBoardForm.style.display = 'block';
}

// hide add new board modal function
function hideAddNewBoardModal() {
    addNewBoardModal.style.display = 'none';
    addBoardForm.reset();
    addBoardForm.style.display = 'none';
}

// display add new task form function
const displayAddNewTaskModal = () => {
    addNewTaskModal.style.display = 'block';
    addNewTaskForm.style.display = 'block';
}

// hide add new task form function
const hideAddNewTaskModal = () => {
    addNewTaskModal.style.display = 'none';
    addNewTaskForm.reset();
    addNewTaskForm.style.display = 'none';
}


// run display add new task form function
addNewTaskHeaderBtn.addEventListener('click', displayAddNewTaskModal);

// run hide add new task form function
addNewTaskModal.addEventListener('click', hideAddNewTaskModal);


// call add new board modal function 
addNewBoardSidebarBtn.addEventListener('click', displayAddNewBoardModal);

// call hide add new board modal function
addNewBoardModalBody.addEventListener('click', hideAddNewBoardModal);


// handle add new board function
const createBoardBtn = document.querySelector('.createBoardBtn input');

// send board's data to php file
const handleNewBoard = () => {
    let boardName = document.querySelector('#board-name').value;
    let emptyBoardError = document.querySelector('#addBoardForm .boardErrorMsg');

    if(boardName.length == 0) {
        emptyBoardError.style.display = 'block';
        return false;
    } else {
        emptyBoardError.style.display = 'none';
    }

    // make post request to add new board
    let xhr = new XMLHttpRequest();
    xhr.open('POST', './include/insertboard.inc.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = () => {

        // call get board function to display boards and number of total board on load
        getBoard();
        getBoardNumber();
    }

    const data = {
        boardName: boardName
    };

    const jsonData = JSON.stringify(data);

    xhr.send(jsonData);

    addBoardForm.reset();
    return false;
}

// handleNewBoard(e);

let createdBoardContainer = document.querySelector('.created-boards');

function getBoard() {

    let xhr = new XMLHttpRequest();
    xhr.open('GET', './getboardname.class.php', true);
    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(this.responseText);

            let output = '';
            for(var i = 0; i < results.length; i++) {
                output += `
                        <div class="board-item">
                            <i class="fa-solid fa-window-restore"></i>
                            <span class="board-item-name">${results[i][1]}</span>
                        </div> 
                `
            }
            createdBoardContainer.innerHTML = output;
            handleActiveBoard();
        }
        // const createdBoardContents = document.querySelectorAll('.created-boards > div');
        // toggleEditOrDeleteBoardBox();
    }
    xhr.send();
}
getBoard();

// get board number container from DOM
let boardNo = document.querySelector('.boards-section h1 span');

const getBoardNumber = () => {

    // request to fetch boards total number
    let xhr = new XMLHttpRequest();
    xhr.open('GET', './getboardnumber.php', true);
    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(this.responseText);
            // updating DOM with fetched total boards number
            boardNo.innerHTML = `(${results[0].boardNo})`;
        }
    }
    xhr.send();
}

getBoardNumber();

// active active board when board is clicked
function handleActiveBoard() {
    // emptyBoardContent();
    const createdBoardContents = document.querySelectorAll('.created-boards > div');
    const filledBoardWrapper = document.querySelectorAll('.filled-board-wrapper');


    // const amendBoardBox = document.querySelector('.amend-board-box')
    // const amendBoardBtn = document.querySelector('.newTaskBtnWrapper .fa-ellipsis-vertical');


    createdBoardContents.forEach((content, index) => {
        function activeBoard() {
            if(!content.classList.contains('active-board')) {
                let getActiveBoard = document.querySelector('.active-board');
                if(getActiveBoard) {getActiveBoard.classList.remove('active-board')}
                content.classList.add('active-board');
                // testing(index)
                
                // function enabling add new task button in header once a board is clicked
                enableHeaderBtn();

                // displayAmendBoardBox(index);
                // toggleEditOrDeleteBoardBox(index)
                // amendBoardBtn.addEventListener('click', () => {
                //     amendBoardBox.classList.toggle('display-none')
                // })
                removeBoardBoxPointerEvent()

                // call display filled-board function
                displayFilledBoard();

                // pass index to fetchTaskData function
                fetchTaskData(index);
            }
        }
        content.addEventListener('click', activeBoard);
    })
}

// handleActiveBoard();

// display filled board when a board is selected SCRIPTS START
function displayFilledBoard() {
    const filledBoard = document.querySelector('.filled-board');
    filledBoard.style.display = 'block';
}
// display filled board when a board is selected SCRIPTS END


// handle adding new substasks scripts
const addSubstaskBtn = document.querySelector('.add-substasks-btn');

const addNewSubstask = (callback) => {
    const substaskItems = document.querySelectorAll('.substask-input-wrapper');
    const substasksContainer = document.querySelector('.new-task-substasks');
    const substasksIcons = document.querySelectorAll('.substask-input-wrapper i')

    // generate random placeholder
    function shuffle(array) {
        return [...array].sort(() => Math.random() - 0.5);
    }
    let substaskInputPlaceholder = ['e.g. Make tea', 'e.g. Do the boring work', 'e.g. Stay focus'];


    let substasksWrapper = document.createElement('div');
    substasksWrapper.classList.add("substask-input-wrapper");


    let substasksInput = document.createElement('input');
    substasksInput.setAttribute('type', 'text');
    substasksInput.setAttribute('placeholder', shuffle(substaskInputPlaceholder)[0]);
    substasksInput.setAttribute('name', 'array[]');
    substasksInput.setAttribute('autocomplete', 'off');


    let deleteSubstaskIcon = document.createElement('i');
    deleteSubstaskIcon.classList.add('fa-solid');
    deleteSubstaskIcon.classList.add('fa-xmark');

    let substaskErrorMessage = document.createElement('span');
    substaskErrorMessage.classList.add('newTaskEmptyError');
    substaskErrorMessage.innerHTML = "Can't be empty";

    substasksWrapper.appendChild(substasksInput);
    substasksWrapper.appendChild(deleteSubstaskIcon);
    substasksWrapper.appendChild(substaskErrorMessage);
    substasksContainer.appendChild(substasksWrapper);

    // disable button at 3rd substask
    if(substaskItems.length == 2) {
        addSubstaskBtn.style.pointerEvents = 'none';
        addSubstaskBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.559)';
    }

    callback();
}

// function handling subtasks deletion except the first one
function deleteSubstask() {
    const substasksIcons = document.querySelectorAll('.substask-input-wrapper i')
    const substaskItems = document.querySelectorAll('.substask-input-wrapper');

    substasksIcons.forEach((icon, index) => {
            icon.addEventListener('click', () => {
                if(index !== 0) {
                    substaskItems[index].remove();
                }
                return checkSubstaskLength();
            })
    })
}

// set add new substask button to initial if number of substask input is less then 3
function checkSubstaskLength() {
    const substaskItems = document.querySelectorAll('.substask-input-wrapper');
    if(substaskItems.length < 3) {
        addSubstaskBtn.style.pointerEvents = 'initial';
        addSubstaskBtn.style.backgroundColor = 'white';
    }
}


// Function handling add new task form and its inputs once it's been submitted START

// get new task form
const newTaskForm = document.querySelector('.add-task-form');

const newTaskValue = () => {
    const newTaskTitle = document.querySelector('.new-task-name input');
    const newTaskDescription = document.querySelector('.new-task-description textarea');
    const newTaskSubstasks = document.querySelectorAll('.new-task-substasks .substask-input-wrapper input');
    let substaskDeleteIcon = document.querySelectorAll('.substask-input-wrapper i');
    let substaskErrorMessage = document.querySelectorAll('.substask-input-wrapper .newTaskEmptyError');
    const taskStatus = document.querySelector('#task-status').value;
    
    // turn collected subtasks into an array
    newTaskSubstasksWrapper = Array.from(newTaskSubstasks);

    // get title input value
    let newTaskTitleValue = newTaskTitle.value;

    // get description input value
    let taskDescriptionValue = newTaskDescription.value;

    // show error message if task title input is empty
    if(newTaskTitleValue.length == 0) {
        // let taskTitleError = document.querySelector('.new-task-name .newTaskEmptyError');
        let taskTitleError = document.querySelector('.newTaskEmptyError');
        newTaskTitle.style.border = '1px solid var(--red)';
        taskTitleError.style.display = 'block';  
        return false;
    } 

    // show error message if substask input is empty
    newTaskSubstasks.forEach((substask, index) => {
        if(substask.value.length == 0) {
            substask.style.border = '1px solid var(--red)';
            substaskDeleteIcon[index].style.color = 'var(--red)';
            substaskErrorMessage[index].style.display = 'block';
            return false;
        }
    })

    if(newTaskSubstasks.length == 1 && newTaskSubstasks[0].value.length !== 0) {
        collectTaskElements(newTaskTitleValue, taskDescriptionValue, taskStatus, newTaskSubstasks[0].value)
        newTaskForm.reset();
    } else if (newTaskSubstasks.length == 2 &&  newTaskSubstasks[1].value.length !== 0) {
        collectTaskElements(newTaskTitleValue, taskDescriptionValue, taskStatus, newTaskSubstasks[0].value, newTaskSubstasks[1].value)
        newTaskForm.reset();
    } else if(newTaskSubstasks.length == 3 &&  newTaskSubstasks[1].value.length !== 0 && newTaskSubstasks[2].value.length !== 0) {
        collectTaskElements(newTaskTitleValue, taskDescriptionValue, taskStatus, newTaskSubstasks[0].value, newTaskSubstasks[1].value, newTaskSubstasks[2].value);
        newTaskForm.reset();
    }

    // newTaskForm.reset();

    // run function handling the removal of error messages from subtask input on keyup event
    removeSubstasksError();
    return false;
}
// Function handling add new task form and its inputs once it's been submitted END


// remove red border and error message from title input on keyup event START

let newTaskTitle = document.querySelector('.new-task-name input');
let taskTitleError = document.querySelector('.new-task-name .newTaskEmptyError');
let taskIcon = document.querySelector('.substask-input-wrapper i');

function removeTitleErrorMsg() {
    newTaskTitle.style.border = '1px solid var(--lines)';
    taskTitleError.style.display = 'none';
}

// call function handling the removal of error msg from title input on keyup event  
newTaskTitle.addEventListener('keyup', removeTitleErrorMsg);

// remove red border and error message from title input on keyup event END



// function handling the removal of error message from each substask once user starts typing START
function removeSubstasksError() {
    const newTaskSubstasks = document.querySelectorAll('.new-task-substasks .substask-input-wrapper input');
    let substaskDeleteIcon = document.querySelectorAll('.substask-input-wrapper i');
    let substaskErrorMessage = document.querySelectorAll('.substask-input-wrapper .newTaskEmptyError');

    newTaskSubstasks.forEach((substask, index) => {
            function removeEachSubstaskError() {
                substask.style.border = '1px solid var(--lines)';
                substaskDeleteIcon[index].style.color = 'var(--mediumGrey)';
                substaskErrorMessage[index].style.display = 'none';
            }
            substask.addEventListener('keyup', removeEachSubstaskError)
    })
}

// function handling the removal of error message from each substask once user starts typing END

// get task elements value and send it to function that handles insertion of new task in the database
function collectTaskElements(newTaskTitleValue, taskDescriptionValue, taskStatus, substask1, substask2, substask3) {

    // set substask 2 to null if not specified
    if(substask2 == undefined) {
        substask2 = '';
    }

    // set substask 3 to null if not specified
    if(substask3 == undefined) {
        substask3 = '';
    }

    // get all boards from DOM
    let boards = document.querySelectorAll('.board-item');

    // create empty variable that will contain the selected board index
    let selectedBoardIndex = '';

    // cycle through all boards and get the one with active board class
    boards.forEach((board, index) => {
        if(board.classList.contains('active-board')) {
            selectedBoardIndex = index;
        }
    })

    // create object that will be used as parameter for insertNewTask function
    let newTaskData = {
        selectedBoardIndex: selectedBoardIndex,
        newTaskTitleValue: newTaskTitleValue,
        taskDescriptionValue: taskDescriptionValue, 
        taskStatus: taskStatus,
        substask1: substask1,
        substask2: substask2, 
        substask3: substask3
    }
    
    // call insertNewTask function
    insertNewTask(newTaskData);
}

// insert task function START
function insertNewTask(data) {
    // ajax request to fetch boardId from database using board index
    let xhr = new XMLHttpRequest();
    xhr.open('GET', './getboardname.class.php', true);
    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(this.responseText);
            let boardId = results[data.selectedBoardIndex].boardID;
            // console.log(results[data.selectedBoardIndex].boardID);
            
            // post data to php file START
            // once the boardID is fetched, a post request is made to the server to insert all tasks data in the task table. boardID will be used as a foreign key in the task table
            let xhr = new XMLHttpRequest();

            xhr.open('POST', './include/inserttask.inc.php', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.onload = () => {
                // log response message in console if there is any
                console.log(xhr.responseText);

                // call fetchTaskData function after post request with board index to automatically update the DOM with the new data
                fetchTaskData(data.selectedBoardIndex)
                // displayAmendBoardBox(data.selectedBoardIndex)
            }

            // create object to store tasks elements value
            const newTaskData = {
                taskTitle: data.newTaskTitleValue,
                taskDescription: data.taskDescriptionValue,
                taskStatus: data.taskStatus,
                substask1: data.substask1,
                substask2: data.substask2,
                substask3: data.substask3,
                boardId: boardId
            }

            // convert created object to a json string and send it to the server
            const jsonData = JSON.stringify(newTaskData);
            xhr.send(jsonData);

            // post data to php file END
        }
    }
    xhr.send();
}
// insert task function END

// get column containers
let todoTaskColumnWrapper = document.querySelector('.todo .column-task-wrapper');
let doingTaskColumnWrapper = document.querySelector('.doing .column-task-wrapper');
let doneTaskColumnWrapper = document.querySelector('.done .column-task-wrapper');
let onHoldTaskColumnWrapper = document.querySelector('.on-hold .column-task-wrapper');

// get task number container 
let todoTaskNumberWrapper = document.querySelector('.todo .task-number');
let doingTaskNumberWrapper = document.querySelector('.doing .task-number');
let doneTaskNumberWrapper = document.querySelector('.done .task-number');
let onHoldTaskNumberWrapper = document.querySelector('.on-hold .task-number');

// function handling the return completed subtasks length function START
function returnCompletedSubtaskLength(completedSubtasks) {
    let completedSubtasksLength = completedSubtasks.filter(sub => {
        if(sub == 'true') {
            return true
        }
        return false
    }).length; 

    return completedSubtasksLength
}
// function handling the return completed subtasks length function END


// testEditBoard('boardId')


let currentBoardID = '';
let currentBoardName = '';

// fetch task data based on board id SCRIPTS START
function fetchTaskData(index) {
    // displayAmendBoardBox(index);
    // toggleEditOrDeleteBoardBox(index)



    // fetch boardId from database using board index
    let xhr = new XMLHttpRequest();
    xhr.open('GET', './getboardname.class.php', true);
    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(this.responseText);
            let boardId = results[index].boardID;
            let boardName = results[index].boardName

            // set current board name to board name fetched from the db   
            currentBoardName = boardName;
            // set current board id to board id fetched from the db   
            currentBoardID = boardId;
            
            // console.log(boardName)

            // http request to fetch task data
            let xml = new XMLHttpRequest();

            // http request to fetch number of todo task in column
            let xhr2 = new XMLHttpRequest();

            // http request to fetch number of doing task in column
            let xhr3 = new XMLHttpRequest();

            // http request to fetch number of done task in column
            let xhr4 = new XMLHttpRequest();

            // http request to fetch number of on-hold task in column
            let xhr5 = new XMLHttpRequest();

            xml.open('GET', './include/fetchtaskdata.inc.php?bid='+boardId, true);
            xhr2.open('GET', './include/fetchtodotaskscount.inc.php?bid='+boardId, true);
            xhr3.open('GET', './include/fetchdoingtaskscount.inc.php?bid='+boardId, true);
            xhr4.open('GET', './include/fetchdonetaskscount.inc.php?bid='+boardId, true);
            xhr5.open('GET', './include/fetchonholdtaskscount.inc.php?bid='+boardId, true);

            xml.onload = function() {
                    if(this.status === 200) {
                    let taskData = JSON.parse(this.responseText);
                    
                    // empty output that will be used to update 'todo' column
                    let todoOutput = '';
                    // empty output that will be used to update 'doing' column
                    let doingOutput = '';
                    // empty output that will be used to update 'done' column
                    let doneOutput = '';
                    // empty output that will be used to update 'on-hold' column
                    let onHoldOutput = '';

                    taskData.forEach((task, index) => {
                        let status = task.taskStatus.toLowerCase();

                        // get subtask and parse it into js object
                        let substask = JSON.parse(taskData[index].substasks);

                        // get subtask length
                        let subLength = substask.length;

                        // get completed subtask array and parse it into js object
                        let completedSubtasks = JSON.parse(taskData[index].completedSubtasks);

                        // updating column
                        switch (status) {
                            case 'todo':
                                todoOutput += `
                                    <div class="column-task">
                                        <p>${task.taskTitle}</p>
                                        <p>${returnCompletedSubtaskLength(completedSubtasks)} of ${subLength} substasks</p>
                                    </div>
                                `
                                break;
                            case 'doing':
                                doingOutput += `
                                    <div class="column-task">
                                        <p>${task.taskTitle}</p>
                                        <p>${returnCompletedSubtaskLength(completedSubtasks)} of ${subLength} substasks</p>
                                    </div>
                                `
                                break;
                            case 'done':
                                doneOutput += `
                                    <div class="column-task">
                                        <p>${task.taskTitle}</p>
                                        <p>${returnCompletedSubtaskLength(completedSubtasks)} of ${subLength} substasks</p>
                                    </div>
                                `
                                break;
                            case 'on-hold':
                                onHoldOutput += `
                                    <div class="column-task">
                                        <p>${task.taskTitle}</p>
                                        <p>${returnCompletedSubtaskLength(completedSubtasks)} of ${subLength} substasks</p>
                                    </div>
                                `
                                break;
                        }

                })
                todoTaskColumnWrapper.innerHTML = todoOutput;
                doingTaskColumnWrapper.innerHTML = doingOutput;
                doneTaskColumnWrapper.innerHTML = doneOutput;
                onHoldTaskColumnWrapper.innerHTML = onHoldOutput;
                    
                    let todotasks = document.querySelectorAll('.todo .column-task-wrapper > div');
                    let doingtasks = document.querySelectorAll('.doing .column-task-wrapper > div');
                    let donetasks = document.querySelectorAll('.done .column-task-wrapper > div');
                    let onHoldtasks = document.querySelectorAll('.on-hold .column-task-wrapper > div');

                    displayTodoTasksInfosOnClick(todotasks, boardId);
                    displayDoingTasksInfosOnClick(doingtasks, boardId);
                    displayDoneTasksInfosOnClick(donetasks, boardId);
                    displayOnHoldTasksInfosOnClick(onHoldtasks, boardId);

                }
            }

            xhr2.onload = function() {
                let fetchedTodoTaskNumber = JSON.parse(xhr2.responseText);
                let todoTaskNo = fetchedTodoTaskNumber[0].todo_task_number;
                todoTaskNumberWrapper.innerHTML = `(${todoTaskNo})`
            }

            xhr3.onload = function() {
                let fetchedDoingTaskNumber = JSON.parse(xhr3.responseText);
                let doingTaskNo = fetchedDoingTaskNumber[0].doing_task_number;
                doingTaskNumberWrapper.innerHTML = `(${doingTaskNo})`
            }

            xhr4.onload = function() {
                let fetchedDoneTaskNumber = JSON.parse(xhr4.responseText);
                let doneTaskNo = fetchedDoneTaskNumber[0].done_task_number;
                doneTaskNumberWrapper.innerHTML = `(${doneTaskNo})`
            }

            xhr5.onload = function() {
                let fetchedOnHoldTaskNumber = JSON.parse(xhr5.responseText);
                let onHoldTaskNo = fetchedOnHoldTaskNumber[0].onhold_task_number;
                onHoldTaskNumberWrapper.innerHTML = `(${onHoldTaskNo})`
            }

            xml.send();
            xhr2.send();
            xhr3.send();
            xhr4.send();
            xhr5.send();
        }

    }
    xhr.send();

}

// fetch task data based on board id SCRIPTS END


// handle input checkbox SCRIPTS START

function updateSubtasksInputCheckbox(taskID, inputIndex, taskIndex, taskStatus) {
    let xml = new XMLHttpRequest();
    xml.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(xml.responseText)
            let myarr = JSON.parse(data[0].completedSubtasks) 
            // myarr[idx] = 'true';
            if(myarr[inputIndex] == 'false') {
                myarr[inputIndex] = 'true';
            } else {
                myarr[inputIndex] = 'false';
            }
            let xhr = new XMLHttpRequest();
            xhr.open('POST', './include/updateTask.inc.php', true)
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            xhr.onload = function() {
                if(this.status === 200) {
                    let tasksWrapper = document.querySelectorAll(`.${taskStatus} .column-task-wrapper > div p:nth-child(2)`)
                    let viewTaskSubtask = document.querySelector('.view-task-subtasks h5')

                    console.log(xhr.responseText)

                    let xml = new XMLHttpRequest();
                    xml.open('GET', './include/fetchSubtasks.inc.php?taskID='+taskID, true)
                    xml.onload = function() {
                        let output = '';
                        let output2 = '';

                        let data = JSON.parse(xml.responseText);
                        let completedSubtasks = JSON.parse(data[0].completedSubtasks);
                        let subLength = completedSubtasks.length
                        output += `${returnCompletedSubtaskLength(completedSubtasks)} of ${subLength} substasks`
                        output2 += `Subtasks (${returnCompletedSubtaskLength(completedSubtasks)} of ${subLength})`
                        // console.log(output)
                        tasksWrapper[taskIndex].innerHTML = output;
                        viewTaskSubtask.innerHTML = output2;
                    }
                    xml.send();
                }
            }
            const CompleteSubtask = {myarr, taskID}
            const CompletedSubtaskJson = JSON.stringify(CompleteSubtask)
            xhr.send(CompletedSubtaskJson)
        }
    }
    xml.open('GET', './include/fetchSubtasks.inc.php?taskID='+taskID, true)
    xml.send();

}

function handleSubtaskCheckboxChange(taskID, taskIndex, taskStatus) {
    const subtaskInputCheckbox = document.querySelectorAll('.subtask-checkbox-wrapper input[type="checkbox"]')
    const subtaskTextContent = document.querySelectorAll('.subtask-checkbox-wrapper p')
    
    let subtaskInputs = Array.from(subtaskInputCheckbox)
    let subtaskContents = Array.from(subtaskTextContent)
    
    // console.log(subtaskInputs)

    subtaskInputs.forEach((input, index) => {
        input.addEventListener('click', () => {
            updateSubtasksInputCheckbox(taskID, index, taskIndex, taskStatus)
            if(input.checked){
                subtaskTextContent[index].classList.add('subtask-checked')
            } else {
                subtaskTextContent[index].classList.remove('subtask-checked')
            }
        })
    })
}
// handle input checkbox SCRIPTS END

// handle showing/hiding of task view modal onclik SCRIPTS START
const viewTaskBgOverlay = document.querySelector('.view-task-bg-overlay')
const viewTaskModal = document.querySelector('.view-task-modal');

function showViewTaskModal() {
    viewTaskBgOverlay.classList.remove('display-none')
    viewTaskModal.classList.remove('display-none')
}

function hideViewTaskModal() {
    viewTaskBgOverlay.classList.add('display-none')
    viewTaskModal.classList.add('display-none')
}
viewTaskBgOverlay.addEventListener('click', hideViewTaskModal)
// handle showing/hiding of task view modal onclik SCRIPTS END

let selected_task_id = '';
let selected_task_title = '';
let selected_task_description = '';
let selected_task_subtasks = '';

// display todo task infos onclick SCRIPTS START
const displayTodoTasksInfosOnClick = (todoTasks, boardid) => {
const subtaskInputCheckbox = document.querySelectorAll('.subtask-checkbox-wrapper input[type="checkbox"]')
const subtaskTextContent = document.querySelectorAll('.subtask-checkbox-wrapper p')

let subtaskInputs = Array.from(subtaskInputCheckbox)
let subtaskContents = Array.from(subtaskTextContent)

let todoData = Array.from(todoTasks);

for (let i = 0; i < todoData.length; i++) {
    const viewTaskModal = document.querySelector('.view-task-modal');
    function clicked() {
        showViewTaskModal()
            let req = new XMLHttpRequest();
            // req.open('GET', './getboardname.class.php', true);
            req.open('GET', './include/fetchTodoTask.inc.php?bid='+boardid, true);
            req.onload = function() {
                if(this.status === 200) {

                    let fetcheddata = JSON.parse(req.responseText);
                    // console.log(fetcheddata[i].taskStatus);

                    let taskStatus = fetcheddata[i].taskStatus;

                    // get subtask and parse it into js object
                    let subtask = JSON.parse(fetcheddata[i].substasks);

                    // console.log(subtask);

                    // get subtask length
                    let subLength = subtask.length;

                    // get completed subtask array and parse it into js object
                    let completedSubtasks = JSON.parse(fetcheddata[i].completedSubtasks);

                    // set description to empty string if its value is null
                    if(fetcheddata[i].taskDescription == null) {
                        fetcheddata[i].taskDescription = '';
                    }
                    
                    let output = '';
                    let output2 = '';

                    subtask.forEach((sub, index) => {
                        if(completedSubtasks[index] == 'true') {
                            output2 += `
                                <div class="subtask-checkbox-wrapper">
                                    <input type="checkbox" checked name="" id="">
                                    <p class='subtask-checked'>${sub}</p>
                                </div>
                            `
                        } else {
                            output2 += `
                                <div class="subtask-checkbox-wrapper">
                                    <input type="checkbox" name="" id="">
                                    <p>${sub}</p>
                                </div>
                            `
                        }
                    })

                    output += `
                            <div class="view-task-title">
                                <h3>${fetcheddata[i].taskTitle}</h3>
                                <i class="fa-solid fa-ellipsis-vertical"></i>
                                <div class="amend-view-task display-none">
                                <a>Edit task</a>
                                <a>Delete task</a>
                                </div>
                            </div>
                            <div class="view-task-description">
                                <p>${fetcheddata[i].taskDescription}</p>
                            </div>
                            <div class="view-task-subtasks">
                                <h5>Subtasks (${returnCompletedSubtaskLength(completedSubtasks)} of ${subLength})</h5>
                                ${output2}
                            </div> 
                        `

                    viewTaskModal.innerHTML = output;

                    selected_task_id = fetcheddata[i].taskID;
                    selected_task_title = fetcheddata[i].taskTitle;
                    selected_task_description = fetcheddata[i].taskDescription;
                    selected_task_subtasks = subtask;

                    const amend_task_box_wrapper = document.querySelector('.amend-view-task')
                    const toggle_amend_task_options_btn = document.querySelector('.view-task-title i')
                    const edit_task_btn = document.querySelector('.amend-view-task a:nth-child(1)')
                    const delete_task_btn = document.querySelector('.amend-view-task a:nth-child(2)')
                    const edit_task_data = {amend_task_box_wrapper, toggle_amend_task_options_btn, edit_task_btn, delete_task_btn}
                    amend_task_options(edit_task_data)
                    // amend_task_options(toggle_amend_task_options_btn, amend_task_box_wrapper, edit_task_btn, delete_task_btn)
                    // testi.addEventListener('click', () => {
                    //     console.log('clicking it', fetcheddata[i].taskID)
                    //     testmodal.classList.toggle('display-none')
                    // })
                    handleSubtaskCheckboxChange(fetcheddata[i].taskID, i, taskStatus)
                    // testedittask()
                }
            }
            req.send();
        }
        todoData[i].addEventListener('click', clicked);
    }


}
// display todo task infos onclick SCRIPTS END


// display doing task infos onclick SCRIPTS START
const displayDoingTasksInfosOnClick = (doingTasks, boardid) => {
    const viewTaskModal = document.querySelector('.view-task-modal');
let doingData = Array.from(doingTasks);

    for (let i = 0; i < doingData.length; i++) {

        function clicked() {
            showViewTaskModal()
                let req = new XMLHttpRequest();

                req.open('GET', './include/fetchDoingTaskData.inc.php?bid='+boardid, true);
                req.onload = function() {
                    if(this.status === 200) {
                        let fetcheddata = JSON.parse(req.responseText);

                        let taskStatus = fetcheddata[i].taskStatus

                        // get subtask and parse it into js object
                        let subtask = JSON.parse(fetcheddata[i].substasks);
    
                        let subLength = subtask.length;
    
                        // get completed subtask array and parse it into js object
                        let completedSubtasks = JSON.parse(fetcheddata[i].completedSubtasks);
    
                        // set description to empty string if its value is null
                        if(fetcheddata[i].taskDescription == null) {
                            fetcheddata[i].taskDescription = '';
                        }
                        
                        let output = '';
                        let output2 = '';
    
                        subtask.forEach((sub, index) => {
                            if(completedSubtasks[index] == 'true') {
                                output2 += `
                                    <div class="subtask-checkbox-wrapper">
                                        <input type="checkbox" checked name="" id="">
                                        <p class='subtask-checked'>${sub}</p>
                                    </div>
                                `
                            } else {
                                output2 += `
                                    <div class="subtask-checkbox-wrapper">
                                        <input type="checkbox" name="" id="">
                                        <p>${sub}</p>
                                    </div>
                                `
                            }
                        })
    
                        output += `
                                <div class="view-task-title">
                                    <h3>${fetcheddata[i].taskTitle}</h3>
                                    <i class="fa-solid fa-ellipsis-vertical"></i>
                                    <div class="amend-view-task display-none">
                                    <a>Edit task</a>
                                    <a>Delete task</a>
                                    </div>
                                </div>
                                <div class="view-task-description">
                                    <p>${fetcheddata[i].taskDescription}</p>
                                </div>
                                <div class="view-task-subtasks">
                                    <h5>Subtasks (${returnCompletedSubtaskLength(completedSubtasks)} of ${subLength})</h5>
                                    ${output2}
                                </div> 
                            `

                        viewTaskModal.innerHTML = output;
                        selected_task_id = fetcheddata[i].taskID;
                        selected_task_title = fetcheddata[i].taskTitle;
                        selected_task_subtasks = subtask;

                        const testmodal = document.querySelector('.amend-view-task')
                        const testi = document.querySelector('.view-task-title i')
                        testingthing(testmodal, testi)
                        handleSubtaskCheckboxChange(fetcheddata[i].taskID, i, taskStatus)
                    }

                }
                req.send();
            }
            doingData[i].addEventListener('click', clicked);
    }

}
// display doing task infos onclick SCRIPTS START


// display done task infos onclick SCRIPTS START
const displayDoneTasksInfosOnClick = (donetasks, boardid) => {
    const viewTaskModal = document.querySelector('.view-task-modal');
let doneTaskData = Array.from(donetasks);

    for (let i = 0; i < doneTaskData.length; i++) {
        function clicked() {
            showViewTaskModal()
                let req = new XMLHttpRequest();
                req.open('GET', './include/fetchDoneTask.inc.php?bid='+boardid, true);
                req.onload = function() {
                    if(this.status === 200) {
                        let fetcheddata = JSON.parse(req.responseText);
                        
                        let taskStatus = fetcheddata[i].taskStatus
    
                        let subtask = JSON.parse(fetcheddata[i].substasks);
    
                        // get subtask length
                        let subLength = subtask.length;
    
                        // get completed subtask array and parse it into js object
                        let completedSubtasks = JSON.parse(fetcheddata[i].completedSubtasks);
    
                        // set description to empty string if its value is null
                        if(fetcheddata[i].taskDescription == null) {
                            fetcheddata[i].taskDescription = '';
                        }
                        
                        let output = '';
                        let output2 = '';
    
                        subtask.forEach((sub, index) => {
                            if(completedSubtasks[index] == 'true') {
                                output2 += `
                                    <div class="subtask-checkbox-wrapper">
                                        <input type="checkbox" checked name="" id="">
                                        <p class='subtask-checked'>${sub}</p>
                                    </div>
                                `
                            } else {
                                output2 += `
                                    <div class="subtask-checkbox-wrapper">
                                        <input type="checkbox" name="" id="">
                                        <p>${sub}</p>
                                    </div>
                                `
                            }
                        })
    
                        output += `
                                <div class="view-task-title">
                                    <h3>${fetcheddata[i].taskTitle}</h3>
                                    <i class="fa-solid fa-ellipsis-vertical"></i>
                                    <div class="amend-view-task display-none">
                                    <a>Edit task</a>
                                    <a>Delete task</a>
                                    </div>
                                </div>
                                <div class="view-task-description">
                                    <p>${fetcheddata[i].taskDescription}</p>
                                </div>
                                <div class="view-task-subtasks">
                                    <h5>Subtasks (${returnCompletedSubtaskLength(completedSubtasks)} of ${subLength})</h5>
                                    ${output2}
                                </div> 
                            `

                        viewTaskModal.innerHTML = output;
                        handleSubtaskCheckboxChange(fetcheddata[i].taskID, i, taskStatus)
                    }

                }
                req.send();
            }
            doneTaskData[i].addEventListener('click', clicked);
    }

}
// display done task infos onclick SCRIPTS START

// display on-hold task infos onclick SCRIPTS START
const displayOnHoldTasksInfosOnClick = (onHoldtasks, boardid) => {
    const viewTaskModal = document.querySelector('.view-task-modal');
let onHoldTaskData = Array.from(onHoldtasks);

    for (let i = 0; i < onHoldTaskData.length; i++) {
        function clicked() {
            showViewTaskModal()
                let req = new XMLHttpRequest();
                req.open('GET', './include/fetchOnHoldTaskData.inc.php?bid='+boardid, true);
                req.onload = function() {
                    if(this.status === 200) {
                        let fetcheddata = JSON.parse(req.responseText);

                        let taskStatus = fetcheddata[i].taskStatus
    
                        // get subtask and parse it into js object
                        let subtask = JSON.parse(fetcheddata[i].substasks);
    
                        // get subtask length
                        let subLength = subtask.length;
    
                        // get completed subtask array and parse it into js object
                        let completedSubtasks = JSON.parse(fetcheddata[i].completedSubtasks);
    
                        // set description to empty string if its value is null
                        if(fetcheddata[i].taskDescription == null) {
                            fetcheddata[i].taskDescription = '';
                        }
                        
                        let output = '';
                        let output2 = '';
    
                        subtask.forEach((sub, index) => {
                            if(completedSubtasks[index] == 'true') {
                                output2 += `
                                    <div class="subtask-checkbox-wrapper">
                                        <input type="checkbox" checked name="" id="">
                                        <p class='subtask-checked'>${sub}</p>
                                    </div>
                                `
                            } else {
                                output2 += `
                                    <div class="subtask-checkbox-wrapper">
                                        <input type="checkbox" name="" id="">
                                        <p>${sub}</p>
                                    </div>
                                `
                            }
                        })
    
                        output += `
                                <div class="view-task-title">
                                    <h3>${fetcheddata[i].taskTitle}</h3>
                                    <i class="fa-solid fa-ellipsis-vertical"></i>
                                    <div class="amend-view-task display-none">
                                    <a>Edit task</a>
                                    <a>Delete task</a>
                                    </div>
                                </div>
                                <div class="view-task-description">
                                    <p>${fetcheddata[i].taskDescription}</p>
                                </div>
                                <div class="view-task-subtasks">
                                    <h5>Subtasks (${returnCompletedSubtaskLength(completedSubtasks)} of ${subLength})</h5>
                                    ${output2}
                                </div> 
                            `

                        viewTaskModal.innerHTML = output;
                        handleSubtaskCheckboxChange(fetcheddata[i].taskID, i, taskStatus)
                    }

                }
                req.send();
            }
            onHoldTaskData[i].addEventListener('click', clicked);
    }

}
// display on-hold task infos onclick SCRIPTS START


// handle view task modal SCRIPTS START
const amendViewTaskBtn = document.querySelector('.view-task-title i');
const amendViewTaskWrapper = document.querySelector('.amend-view-task')

const toggleAmendViewTaskWrapper = () => {
    amendViewTaskWrapper.classList.toggle('display-none')
}

// amendViewTaskBtn.addEventListener('click', toggleAmendViewTaskWrapper)

// handle view task modal SCRIPTS END

// handle edit/delete board SCRIPTS START

    function hideDeleteBoardPrompt() {
        const deleteBoardBgOverlay = document.querySelector('.delete-board-bg-overlay')
        const deleteBoardPrompt = document.querySelector('.delete-board-prompt')

        if(!deleteBoardBgOverlay.classList.contains('display-none')) {
            deleteBoardBgOverlay.classList.add('display-none')
        }
        if(!deleteBoardPrompt.classList.contains('display-none')) {
            deleteBoardPrompt.classList.add('display-none')
        }
    }


    const hideAmendBoardBox = () => {
        const amendBoardBox = document.querySelector('.amend-board-box')
        if(!amendBoardBox.classList.contains('display-none')) {
            amendBoardBox.classList.add('display-none')
        }
    }

    // toggle amend board box on btn click START 
    const amendBoardBox = document.querySelector('.amend-board-box')
    const amendBoardBtn = document.querySelector('.newTaskBtnWrapper .fa-ellipsis-vertical');

    amendBoardBtn.addEventListener('click', () => {
        amendBoardBox.classList.toggle('display-none')
    })
    // toggle amend board box on btn click END

    // function enabling button that show edit or delete board box START
    function removeBoardBoxPointerEvent() {
        const amendBoardBtn = document.querySelector('.newTaskBtnWrapper .fa-ellipsis-vertical');
        amendBoardBtn.style.pointerEvents = 'initial';
    }
    // function enabling button that show edit or delete board box END



    // Show edith or delete board box function START
    let deleteBoardBtn = document.querySelector('.amend-board-box a:nth-child(2)')
    function showEditOrDeleteBoardBox() {

        const deleteBoardBgOverlay = document.querySelector('.delete-board-bg-overlay')
        const deleteBoardPrompt = document.querySelector('.delete-board-prompt')
        hideAmendBoardBox()
        deleteBoardBgOverlay.classList.remove('display-none')
        deleteBoardPrompt.classList.remove('display-none')

    }
    deleteBoardBtn.addEventListener('click', showEditOrDeleteBoardBox)
    // Show edith or delete board box function END


    // cancel delete board function START
    const cancelDeleteBoardBtn = document.querySelector('.delete-btn-options .cancel')
    function cancelDeleteBoard() {
        hideAmendBoardBox()
        hideDeleteBoardPrompt()
        return;
    }
    cancelDeleteBoardBtn.addEventListener('click', cancelDeleteBoard)
    // cancel delete board function START


    // proceed to board deletion function START
    const proceedToDeleteBoardBtn = document.querySelector('.delete-btn-options .delete')
        function proceedToDeleteBoard() {
            const createdBoardContents = document.querySelectorAll('.created-boards > div');
            
            createdBoardContents.forEach((board, index) => {
                if(board.classList.contains('active-board')) {
                    console.log(index)
                    let xml = new XMLHttpRequest();
                    xml.open('GET', './getboardname.class.php', true);
                    xml.onload = function() {
                        if(this.readyState == 4 && this.status == 200) {
                            let results = JSON.parse(this.responseText)
                            let boardID = results[index].boardID
                            console.log(boardID)
                            let serverDeleteRequest = new XMLHttpRequest();
                            serverDeleteRequest.open('POST', './include/deleteBoard.inc.php', true)
                            serverDeleteRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
                            serverDeleteRequest.onload = function() {
                                if(this.status === 200 && this.readyState == 4) {
                                    console.log(this.responseText)
                                    getBoard();
                                    getBoardNumber();
                                }
                            }
                            const id = {boardID}
                            const jsonBoardID = JSON.stringify(id)
                            serverDeleteRequest.send(jsonBoardID)
                            hideDeleteBoardPrompt();

                        }
                    }
                    xml.send()
                }

        })
            
        }
        proceedToDeleteBoardBtn.addEventListener('click', proceedToDeleteBoard)
    // proceed to board deletion function END

    // edit board scripts START
    const editBoardBtn = document.querySelector('.amend-board-box a:nth-child(1)')
    const editBoardPromptBgOverlay = document.querySelector('.edit-board-bg-overlay')
    const editBoardPrompt = document.querySelector('.edit-board-form')
    const edit_board_form = document.querySelector('.edit-board-form form')
    const edit_board_form_text_input = document.querySelector('.edit-board-form input[type=text]')

    function set_edit_form_input_to_current_boardname() {
        edit_board_form_text_input.value = currentBoardName;
    }

    function process_board_changes(e) {
        e.preventDefault();
        let emptyBoardError = document.querySelector('.edit-board-form .boardErrorMsg');
        let newBoardName = edit_board_form_text_input.value

        if(newBoardName.length == 0) {
            emptyBoardError.style.display = 'block';
            return false;
        } else {
            emptyBoardError.style.display = 'none';
        }

        let request_to_change_board_name = new XMLHttpRequest();
        request_to_change_board_name.open('POST', './include/editBoardName.inc.php', true)
        request_to_change_board_name.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        request_to_change_board_name.onload = function() {
            if(this.status == 200 && this.readyState == 4) {
                console.log(this.responseText)
                getBoard();
            }
        }
        const newBoardData = { newBoardName, currentBoardID }
        const newBoardJsonData = JSON.stringify(newBoardData)
        request_to_change_board_name.send(newBoardJsonData)


        hide_Edit_Board_Form_Prompt();
    }

    edit_board_form.addEventListener('submit', process_board_changes)

    
    function show_Edit_Board_Form_Prompt() {
        const createdBoardContents = document.querySelectorAll('.created-boards > div');

        editBoardPromptBgOverlay.classList.remove('display-none')
        editBoardPrompt.classList.remove('display-none')
        hideAmendBoardBox()
        set_edit_form_input_to_current_boardname();

    }
    editBoardBtn.addEventListener('click', show_Edit_Board_Form_Prompt)


    function hide_Edit_Board_Form_Prompt() {
        editBoardPromptBgOverlay.classList.add('display-none')
        editBoardPrompt.classList.add('display-none')
    }
    editBoardPromptBgOverlay.addEventListener('click', hide_Edit_Board_Form_Prompt)

    // edit board scripts END
    


    // edit task scripts START

    

        const amend_task_box_btn = document.querySelector('.view-task-title i')
        const amend_task_box = document.querySelector('.amend-view-task')


        function toggle_amend_task_box() {
            amend_task_box.classList.toggle('display-none')
        }

        function amend_task_options(edit_task_data) {
            const {amend_task_box_wrapper, toggle_amend_task_options_btn, edit_task_btn, delete_task_btn} = edit_task_data
            
            toggle_amend_task_options_btn.addEventListener('click', () => {
                amend_task_box_wrapper.classList.toggle('display-none')
            })

            edit_task_btn.addEventListener('click', show_edit_task_form)

            // console.log(edit_task_btn, delete_task_btn)

        }



        function runEdit() {
            console.log('edit...')
        }

        function testingthing(a, b) {
            console.log(a, b, selected_task_title, selected_task_subtasks)
            b.addEventListener('click', () => {
                console.log('we pimpin nigga')
            })
        }

    const edit_task_form_bg_overlay = document.querySelector('.edit-task-bg')
    const edit_task_form_wrapper = document.querySelector(".edit-task-form")
    const edit_task_form = document.querySelector(".edit-task-form form")
    const edit_subtask_button = document.querySelector('.edit-substasks-btn')
    const edit_task_form_title = edit_task_form.querySelector('.edit-task-name input[type=text]')
    const edit_task_form_description = edit_task_form.querySelector('.edit-task-description textarea')
    let edit_task_title_error = edit_task_form.querySelector('.newTaskEmptyError');
    let edit_subtask_error_msg = edit_task_form.querySelectorAll('.edit-substask-input-wrapper .editTaskEmptyError');
    const edit_task_subtasks = document.querySelectorAll('.edit-task-substasks .edit-substask-input-wrapper input');
    let edit_substask_delete_icon = document.querySelectorAll('.edit-substask-input-wrapper i');







    function hide_edit_task_form() {
        edit_task_form_wrapper.classList.add('display-none')
        edit_task_form_bg_overlay.classList.add('display-none')
    }
    edit_task_form_bg_overlay.addEventListener('click', hide_edit_task_form)

    function show_edit_task_form() {
        edit_task_form_bg_overlay.classList.remove('display-none')
        edit_task_form_wrapper.classList.remove('display-none')

        edit_task_form_title.value = selected_task_title
        edit_task_form_description.value = selected_task_description

    }

    
    function process_edit_task_form(e) {
            e.preventDefault();
            let edit_task_title_error = edit_task_form.querySelector('.newTaskEmptyError');
            let edit_subtask_error_msg = edit_task_form.querySelectorAll('.edit-substask-input-wrapper .editTaskEmptyError');
            const edit_task_subtasks = document.querySelectorAll('.edit-task-substasks .edit-substask-input-wrapper input');
            let edit_substask_delete_icon = document.querySelectorAll('.edit-substask-input-wrapper i');

            if(edit_task_form_title.value.length == 0) {
                edit_task_form_title.style.border = '1px solid var(--red)';
                edit_task_title_error.style.display = 'block';  
                return false;
            }

            edit_task_subtasks.forEach((substask, index) => {


                    if(substask.value.length == 0) {
                    // console.log(substask)
                    substask.style.border = '1px solid var(--red)';
                    edit_substask_delete_icon[index].style.color = 'var(--red)';
                    edit_subtask_error_msg[index].style.display = 'block';

                    return false;
                }
            })
                
            remove_edit_task_substasks_error()
            
            console.log('submitted')
        }

        edit_task_form.addEventListener('submit', process_edit_task_form)


        function remove_edit_title_error_msg() {
            edit_task_form_title.style.border = '1px solid var(--lines)';
            edit_task_title_error.style.display = 'none';
        }

        edit_task_form_title.addEventListener('keyup', remove_edit_title_error_msg)

        function remove_edit_task_substasks_error() {
            const edit_task_subtasks = document.querySelectorAll('.edit-task-substasks .edit-substask-input-wrapper input');
            let edit_substask_delete_icon = document.querySelectorAll('.edit-substask-input-wrapper i');
            let edit_subtask_error_msg = edit_task_form.querySelectorAll('.edit-substask-input-wrapper .editTaskEmptyError');

            edit_task_subtasks.forEach((substask, index) => {
                    function removeEachSubstaskError() {
                        substask.style.border = '1px solid var(--lines)';
                        edit_substask_delete_icon[index].style.color = 'var(--mediumGrey)';
                        edit_subtask_error_msg[index].style.display = 'none';
                    }
                    substask.addEventListener('keyup', removeEachSubstaskError)
            })

        }
        



        function process_edit_task_form_subtask() {
            const substaskItems = document.querySelectorAll('.edit-substask-input-wrapper');
            const substasksContainer = document.querySelector('.edit-task-substasks');
            const addSubstaskBtn = document.querySelector('.edit-substasks-btn');


            // generate random placeholder
            function shuffle(array) {
                return [...array].sort(() => Math.random() - 0.5);
            }
            let substaskInputPlaceholder = ['e.g. Make tea', 'e.g. Do the boring work', 'e.g. Stay focus'];


            let substasksWrapper = document.createElement('div');
            substasksWrapper.classList.add("edit-substask-input-wrapper");


            let substasksInput = document.createElement('input');
            substasksInput.setAttribute('type', 'text');
            substasksInput.setAttribute('placeholder', shuffle(substaskInputPlaceholder)[0]);
            substasksInput.setAttribute('name', 'array[]');
            substasksInput.setAttribute('autocomplete', 'off');


            let deleteSubstaskIcon = document.createElement('i');
            deleteSubstaskIcon.classList.add('fa-solid');
            deleteSubstaskIcon.classList.add('fa-xmark');

            let substaskErrorMessage = document.createElement('span');
            substaskErrorMessage.classList.add('editTaskEmptyError');
            substaskErrorMessage.innerHTML = "Can't be empty";

            substasksWrapper.appendChild(substasksInput);
            substasksWrapper.appendChild(deleteSubstaskIcon);
            substasksWrapper.appendChild(substaskErrorMessage);
            substasksContainer.appendChild(substasksWrapper);

            // disable button at 3rd substask
            if(substaskItems.length == 2) {
                addSubstaskBtn.style.pointerEvents = 'none';
                addSubstaskBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.559)';
            }


            // callback()
            delete_edit_task_form_subtask()
        }

        edit_subtask_button.addEventListener('click', process_edit_task_form_subtask)

        function delete_edit_task_form_subtask() {
            const substasksIcons = edit_task_form.querySelectorAll('.edit-substask-input-wrapper i')
            const substaskItems = edit_task_form.querySelectorAll('.edit-substask-input-wrapper');
        
            substasksIcons.forEach((icon, index) => {
                    icon.addEventListener('click', () => {
                        if(index !== 0) {
                            substaskItems[index].remove();
                        }
                        return reenable_edit_form_subtask_btn();
                    })
            })
        }

        function reenable_edit_form_subtask_btn() {
            const substaskItems = edit_task_form.querySelectorAll('.edit-substask-input-wrapper');
            const addSubstaskBtn = edit_task_form.querySelector('.edit-substasks-btn');

            if(substaskItems.length < 3) {
                addSubstaskBtn.style.pointerEvents = 'initial';
                addSubstaskBtn.style.backgroundColor = 'white';
            }
        }






    // edit task scripts END


