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

        // $results = $query->fetchAll();
        $result = $query->fetch(PDO::FETCH_ASSOC);

        $sub = json_decode($result['substasks'], true);
        return $sub;
        // $decoded = json_decode($results);
        // return json_encode($results);


    }


}
