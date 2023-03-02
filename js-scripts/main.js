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

    let xhr = new XMLHttpRequest();
    xhr.open('POST', './include/insertboard.inc.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = () => {
        console.log(xhr.responseText);
        getBoard();
        getBoardNumber();
    }

    const data = {
        boardName: boardName
    };

    const jsonData = JSON.stringify(data);

    xhr.send(jsonData);

    // console.log(boardName);
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
                // console.log(results[i].boardUniqID);
                // testing(results[i].boardUniqID);
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
    }
    xhr.send();
}
getBoard();

// test START
function testing(index) {
    let tryI = '';
    // console.log(index)
    let xhr = new XMLHttpRequest();
    // xhr.open('GET', './getdata.php', true);
    xhr.open('GET', './getboardname.class.php', true);
    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(this.responseText);
            console.log(results[index].boardID);
            // tryI = results[index].boardID;
        }
    }
    // console.log(tryI);
    xhr.send();

}
// test END

let boardNo = document.querySelector('.boards-section h1 span');

const getBoardNumber = () => {

    let xhr = new XMLHttpRequest();
    xhr.open('GET', './getboardnumber.php', true);
    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(this.responseText);
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

    createdBoardContents.forEach((content, index) => {
        function activeBoard() {
            if(!content.classList.contains('active-board')) {
                let getActiveBoard = document.querySelector('.active-board');
                if(getActiveBoard) {getActiveBoard.classList.remove('active-board')}
                content.classList.add('active-board');
                // testing(index)
                
                // function enabling add new task button in header once a board is clicked
                enableHeaderBtn();

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

// scripts to delete substasks
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
    
    newTaskSubstasksWrapper = Array.from(newTaskSubstasks);
    // console.log(newTaskSubstasksWrapper);

    // get title input value
    let newTaskTitleValue = newTaskTitle.value;

    // get description input value
    let taskDescriptionValue = newTaskDescription.value;

    // show error message if task title input is empty
    if(newTaskTitleValue.length == 0) {
        let taskTitleError = document.querySelector('.new-task-name .newTaskEmptyError');
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

    // run function handling the removal of error messages once user start typing in subtask input
    removeSubstasksError();
    return false;
}
// Function handling add new task form and its inputs once it's been submitted START


// remove red border and error message when user start typing in title input START

let newTaskTitle = document.querySelector('.new-task-name input');
let taskTitleError = document.querySelector('.new-task-name .newTaskEmptyError');
let taskIcon = document.querySelector('.substask-input-wrapper i');
// const newTaskSubstasks = document.querySelectorAll('.new-task-substasks .substask-input-wrapper input');

function removeTitleErrorMsg() {
    newTaskTitle.style.border = '1px solid var(--lines)';
    taskTitleError.style.display = 'none';
}
// remove error message when user start typing
newTaskTitle.addEventListener('keyup', removeTitleErrorMsg);

// remove red border and error message when user start typing in title input END



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
// removeSubstasksError();

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

    // get all boards
    let boards = document.querySelectorAll('.board-item');

    // create empty variable that will contain the selected board index
    let selectedBoardIndex = '';

    // loop through all boards and get the one with active board class
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
    // fetch boardId from database using board index
    let xhr = new XMLHttpRequest();
    xhr.open('GET', './getboardname.class.php', true);
    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(this.responseText);
            let boardId = results[data.selectedBoardIndex].boardID;
            // console.log(results[data.selectedBoardIndex].boardID);
            
            // post data to php file START
            let xhr = new XMLHttpRequest();

            xhr.open('POST', './include/inserttask.inc.php', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.onload = () => {
                // console.log(xhr.responseText);
                let errorMsgFromInsertTaskFile = xhr.responseText;
                console.log(errorMsgFromInsertTaskFile);
                fetchTaskData(data.selectedBoardIndex)
            }

            const newTaskData = {
                taskTitle: data.newTaskTitleValue,
                taskDescription: data.taskDescriptionValue,
                taskStatus: data.taskStatus,
                substask1: data.substask1,
                substask2: data.substask2,
                substask3: data.substask3,
                boardId: boardId
            }

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
let onHoldTaskColumnWrapper = document.querySelector('.onhold .column-task-wrapper');

// get task number container 
let todoTaskNumberWrapper = document.querySelector('.todo .task-number');
let doingTaskNumberWrapper = document.querySelector('.doing .task-number');
let doneTaskNumberWrapper = document.querySelector('.done .task-number');
let onHoldTaskNumberWrapper = document.querySelector('.onhold .task-number');

// fetch task data based on board id SCRIPTS START
function fetchTaskData(index) {

    // fetch boardId from database using board index
    let xhr = new XMLHttpRequest();
    xhr.open('GET', './getboardname.class.php', true);
    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(this.responseText);
            let boardId = results[index].boardID;
            // console.log(boardId);
            // console.log(results[data.selectedBoardIndex].boardID);
            
            // http request to fetch task data
            let xhr = new XMLHttpRequest();

            // http request to fetch number of todo task in column
            let xhr2 = new XMLHttpRequest();

            // http request to fetch number of doing task in column
            let xhr3 = new XMLHttpRequest();

            // http request to fetch number of done task in column
            let xhr4 = new XMLHttpRequest();

            // http request to fetch number of on-hold task in column
            let xhr5 = new XMLHttpRequest();

            xhr.open('GET', './include/fetchtaskdata.inc.php?bid='+boardId, true);
            xhr2.open('GET', './include/fetchtodotaskscount.inc.php?bid='+boardId, true);
            xhr3.open('GET', './include/fetchdoingtaskscount.inc.php?bid='+boardId, true);
            xhr4.open('GET', './include/fetchdonetaskscount.inc.php?bid='+boardId, true);
            xhr5.open('GET', './include/fetchonholdtaskscount.inc.php?bid='+boardId, true);

            xhr.onload = function() {
                let taskData = JSON.parse(xhr.responseText);
                
                let todoOutput = '';
                let doingOutput = '';

                taskData.forEach((task, index) => {
                    let status = task.taskStatus.toLowerCase();

                    let substask = JSON.parse(taskData[index].substasks);
                    let subLength = substask.length;
                    let stat = taskData[index].taskStatus;
                    // console.log(stat);

                    switch (status) {
                        case 'todo':
                            todoOutput += `
                                <div class="column-task">
                                    <p>${task.taskTitle}</p>
                                    <p>0 of ${subLength} substasks</p>
                                </div>
                            `
                            break;
                        case 'doing':
                            doingOutput += `
                                <div class="column-task">
                                    <p>${task.taskTitle}</p>
                                    <p>0 of ${subLength} substasks</p>
                                </div>
                            `
                            break;
                    }

                    todoTaskColumnWrapper.innerHTML = todoOutput;
                    doingTaskColumnWrapper.innerHTML = doingOutput;
                })
                
                let todotasks = document.querySelectorAll('.todo .column-task-wrapper > div');
                displayTaskInfoOnClick(todotasks);
                // displayTaskInfoOnClick(taskData);


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

            xhr.send();
            xhr2.send();
            xhr3.send();
            xhr4.send();
            xhr5.send();
        }

    }
    xhr.send();

}

// fetch task data based on board id SCRIPTS END


const displayTaskInfoOnClick = (task) => {
let data = Array.from(task);

    for (let i = 0; i < data.length; i++) {
        function clicked() {
            console.log(data[i], i);
            // let req = new XMLHttpRequest();
            // req.open('GET', './getboardname.class.php', true);
            // req.onload = () => {
            //     if(this.status === 200) {
            //         // let fetcheddata = JSON.parse(req.responseText);
            //         // taskdata = data[i]
            //         // console.log(fetcheddata)
            //         console.log(req.responseText)
            //     }
            // }
            // req.send();
            // console.log('yup')
            // console.log(data[i].querySelector('p:nth-child(1)'))
        }
        data[i].addEventListener('click', clicked);
    }

    // data.forEach(el => {
    //     console.log(el)
    //     el.addEventListener('click', () => console.log(el));
    // })

    // console.log(task)
    
    // console.log(data)

}

