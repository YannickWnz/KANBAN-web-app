<?php

class Account {

    private $con;
    private $errorArray = array();

    public function __construct($con) {
        $this->con = $con;
    }

    // insert bord name into board table
    public function insertBoard($board, $boardUniqID) {
        $query = $this->con->prepare('INSERT INTO board (boardName, boardUniqID) VALUES (:name, :uniqid)');
        $query->bindValue(':name', $board);
        $query->bindValue(':uniqid', $boardUniqID);
        $query->execute();
    }

    // insert task details into task table
    public function insertTask($boardId, $taskTitle, $taskDescription, $json, $completeSubJson, $taskStatus) {
        $query = $this->con->prepare('INSERT INTO task (taskTitle, taskDescription, substasks, completedSubtasks, taskStatus, boardID) VALUES (:title, :desc, :json, :compSub, :status, :id)');
        $query->bindValue(':title', $taskTitle);
        $query->bindValue(':desc', $taskDescription);
        $query->bindValue(':json', $json);
        $query->bindValue(':compSub', $completeSubJson);
        $query->bindValue(':status', $taskStatus);
        $query->bindValue(':id', $boardId);

        $query->execute();
    }

    // public function insertTasks($boardId, $taskTitle, $taskDescription, $taskStatus, $taskUniqID) {
    //     $query = $this->con->prepare('INSERT INTO tasks (taskTitle, taskDescription, taskStatus, taskUniqID, boardID) VALUES (:title, :desc, :status, :uniq, :id)');
    //     $query->bindValue(':title', $taskTitle);
    //     $query->bindValue(':desc', $taskDescription);
    //     $query->bindValue(':status', $taskStatus);
    //     $query->bindValue(':uniq', $taskUniqID);
    //     $query->bindValue(':id', $boardId);
    //     $query->execute();
    // }

    public function fetchTasksDataUsingBoardID($boardID) {
        $query = $this->con->prepare('SELECT * FROM task WHERE boardID = :boardID');
        // $query = $this->con->prepare('SELECT taskTitle, taskStatus, subtaskContent FROM tasks t, subtasks s WHERE t.boardID = :boardID AND s.boardID = :boardID AND t.taskUniqID = s.taskUniqID; ');
        $query->bindValue(':boardID', $boardID);
        $query->execute();
        $results = $query->fetchAll();
        return json_encode($results);
    }

    public function fetchSubtask($taskID) {
        $query = $this->con->prepare('SELECT completedSubtasks FROM task WHERE taskID = :taskID');
        $query->bindValue(':taskID', $taskID);
        $query->execute();
        $results = $query->fetchAll();
        return json_encode($results);
    }

    public function fetchNumberOfTodoTask($boardID) {
        $query = $this->con->prepare('SELECT COUNT(*) AS todo_task_number FROM task WHERE taskStatus = "todo" AND boardID = :id');
        $query->bindValue(':id', $boardID);
        $query->execute();
        $results = $query->fetchAll();
        return json_encode($results);
    }

    public function fetchNumberOfDoingTask($boardID) {
        $query = $this->con->prepare('SELECT COUNT(*) AS doing_task_number FROM task WHERE taskStatus = "doing" AND boardID = :id');
        $query->bindValue(':id', $boardID);
        $query->execute();
        $results = $query->fetchAll();
        return json_encode($results);
    }

    public function fetchNumberOfDoneTask($boardID) {
        $query = $this->con->prepare('SELECT COUNT(*) AS done_task_number FROM task WHERE taskStatus = "done" AND boardID = :id');
        $query->bindValue(':id', $boardID);
        $query->execute();
        $results = $query->fetchAll();
        return json_encode($results);
    }
    
    public function fetchNumberOfOnHoldTask($boardID) {
        $query = $this->con->prepare('SELECT COUNT(*) AS onhold_task_number FROM tasks WHERE taskStatus = "on-hold" AND boardID = :id');
        $query->bindValue(':id', $boardID);
        $query->execute();
        $results = $query->fetchAll();
        return json_encode($results);
    }

    public function fetchTodoTasks($boardID) {
        $query = $this->con->prepare('SELECT * FROM task WHERE taskStatus = :status AND boardID = :id');
        $query->bindValue(':status', "todo");
        $query->bindValue(':id', $boardID);
        $query->execute();
        $results = $query->fetchAll();
        return json_encode($results);

    }

    public function fetchDoingTasksData($boardID) {
        $query = $this->con->prepare('SELECT * FROM task WHERE taskStatus = :status AND boardID = :id');
        $query->bindValue(':status', "doing");
        $query->bindValue(':id', $boardID);
        $query->execute();
        $results = $query->fetchAll();
        return json_encode($results);
    }

    public function updateCompletedSubtasks($taskID, $completedSubtasks) {
        $query = $this->con->prepare('UPDATE task SET completedSubtasks = :completedSubtasks WHERE taskID = :taskID');
        $query->bindValue(':completedSubtasks', $completedSubtasks);
        $query->bindValue(':taskID', $taskID);
        $query->execute();

        if($query) {
            echo "Subtasks updated successfully";
        }

    }



}
