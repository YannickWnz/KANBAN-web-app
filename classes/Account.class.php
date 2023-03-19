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
        $query = $this->con->prepare('SELECT COUNT(*) AS todo_task_number FROM task WHERE taskStatus = :status AND boardID = :id');
        $query->bindValue(':id', $boardID);
        $query->bindValue(':status', "todo");
        $query->execute();
        $results = $query->fetchAll();
        return json_encode($results);
    }

    public function fetchNumberOfDoingTask($boardID) {
        $query = $this->con->prepare('SELECT COUNT(*) AS doing_task_number FROM task WHERE taskStatus = :status AND boardID = :id');
        $query->bindValue(':id', $boardID);
        $query->bindValue(':status', "doing");
        $query->execute();
        $results = $query->fetchAll();
        return json_encode($results);
    }

    public function fetchNumberOfDoneTask($boardID) {
        $query = $this->con->prepare('SELECT COUNT(*) AS done_task_number FROM task WHERE taskStatus = :status AND boardID = :id');
        $query->bindValue(':id', $boardID);
        $query->bindValue(':status', "done");
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

    public function fetchDoneTasksData($boardID) {
        $query = $this->con->prepare('SELECT * FROM task WHERE taskStatus = :status AND boardID = :id');
        $query->bindValue(':status', "done");
        $query->bindValue(':id', $boardID);
        $query->execute();
        $results = $query->fetchAll();
        return json_encode($results);
    }

    public function fetchOnHoldTasksData($boardID) {
        $query = $this->con->prepare('SELECT * FROM task WHERE taskStatus = :status AND boardID = :id');
        $query->bindValue(':status', "on-hold");
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

    public function deleteBoard($boardID) {
        $query = $this->con->prepare('DELETE FROM board WHERE boardID = :boardID');
        $query->bindValue(':boardID', $boardID);
        $query->execute();
    }

    public function editBoardName($boardID, $newBoardName) {
        $query = $this->con->prepare('UPDATE board SET boardName = :name WHERE boardID = :ID ');
        $query->bindValue(':ID', $boardID);
        $query->bindValue(':name', $newBoardName);
        $query->execute();
        
        if($query) {
            echo "Board Name Successfully changed";
        }
    }

    public function updateTaskData($taskID, $taskTitle, $taskDescription, $subtasks, $completeSubtask, $taskStatus) {
        $query = $this->con->prepare('UPDATE task SET taskTitle = :title, taskDescription = :description, substasks = :sub, completedSubtasks = :completedsub, taskStatus = :status WHERE taskID = :id');
        $query->bindValue(':title', $taskTitle);
        $query->bindValue(':description', $taskDescription);
        $query->bindValue(':sub', $subtasks);
        $query->bindValue(':completedsub', $completeSubtask);
        $query->bindValue(':status', $taskStatus);
        $query->bindValue(':id', $taskID);

        $query->execute();

        if($query) {
            echo "Task successfully updated";
        }
    }

    public function deleteTask($taskID) {
        $query = $this->con->prepare('DELETE FROM task WHERE taskID = :taskID');
        $query->bindValue(':taskID', $taskID);
        $query->execute();
        if($query) {
            echo "Task deleted successfully";
        }
    }

}
