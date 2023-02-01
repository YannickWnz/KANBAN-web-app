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
    public function insertTask($boardId, $taskTitle, $taskDescription, $json, $taskStatus) {
        $query = $this->con->prepare('INSERT INTO task (taskTitle, taskDescription, substasks, taskStatus, boardID) VALUES (:title, :desc, :json, :status, :id)');
        $query->bindValue(':title', $taskTitle);
        $query->bindValue(':desc', $taskDescription);
        $query->bindValue(':json', $json);
        $query->bindValue(':status', $taskStatus);
        $query->bindValue(':id', $boardId);

        $query->execute();
    }

    public function fetchTaskBasedOnBoard($boardID) {

        $query = $this->con->prepare('SELECT * FROM task WHERE boardID = :boardID');
        $query->bindValue(':boardID', $boardID);
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
        $query = $this->con->prepare('SELECT COUNT(*) AS onhold_task_number FROM task WHERE taskStatus = "on-hold" AND boardID = :id');
        $query->bindValue(':id', $boardID);
        $query->execute();
        $results = $query->fetchAll();
        return json_encode($results);
    }

}
