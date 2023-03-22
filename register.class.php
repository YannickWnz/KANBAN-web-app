<?php 

class RegisterUser {

    private $con;
    private $errorArray = array();

    public function __construct($con){
        $this->con = $con;
    }

    public function registerUser($username, $pwd, $pwd2) {
        $this->check_username_availability($username);
        $this->validate_password($pwd, $pwd2);
        $this->check_empty_input($username, $pwd, $pwd2);

        if(empty($this->errorArray)) {
            return $this->insertUser($username, $pwd);
        }

    }

    private function check_username_availability($username) {
        $query = $this->con->prepare("SELECT username FROM users WHERE username = :user ");
        $query->bindValue(':user', $username);
        $query->execute();
        if($query->rowCount() > 0) {
            array_push($this->errorArray, Constants::$usernameTaken);
        }  
    }

    private function validate_password($pwd, $pwd2) {
        if(strlen($pwd) < 6) {
            array_push($this->errorArray, Constants::$pwdCharLength); 
            return;
        }
        if($pwd !== $pwd2) {
            array_push($this->errorArray, Constants::$pwdMatch);
            return;
        }

        $pwd = hash("sha512", $pwd);
        $query = $this->con->prepare('SELECT password FROM users WHERE password = :password ');
        $query->bindValue(':password', $pwd);
        $query->execute();
        if($query->rowCount() > 0) {
            array_push($this->errorArray, Constants::$pwdTaken);
        }
    }

    private function insertUser($username, $password) {

        $pwd = hash("sha512", $password);

        $query = $this->con->prepare('INSERT INTO users (username, password) VALUES (:user, :password)');
        $query->bindValue(':user', $username);
        $query->bindValue(':password', $pwd);
        $query->execute();

        if(!$query) {
            array_push($this->errorArray, Constants::$error);
        } else {
            // echo 'user registered successfully';
            $_SESSION['user'] = $username;
            echo $_SESSION['user'];
        }

    }

    private function check_empty_input($username, $password, $password2) {
        if(empty($username) || empty($password) || empty($password2)) {
            array_push($this->errorArray, Constants::$emptyInput);
            return;
        }
    }

    public function getError($error) {
        if(in_array($error, $this->errorArray)) {
            return "<span class='errorMsg'>$error</span>";
        }
    }

}
