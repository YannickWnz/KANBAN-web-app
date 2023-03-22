<?php

class SignIn {
    private $con;
    private $errorArray = array();

    public function __construct($con) {
        $this->con = $con;
    }

    public function signUserIn($username, $pwd) {
        $this->check_empty_input($username, $pwd);

        if(empty($this->errorArray)) {
            $this->checkUser($username, $pwd);
        }
    }


    private function checkUser($username, $password) {
        // $pwd = hash("sha512", $password);

        $query= $this->con->prepare('SELECT username, password FROM users WHERE username = :user AND password = :password ');
        $query->bindValue(':user', $username);
        $query->bindValue(':password', $password);
        $query->execute();

        if($query->rowCount() == 1) {
            echo 'user logged in successfully';
            $_SESSION['user'] = $username;
            echo $_SESSION['user'];
        } else {
            array_push($this->errorArray, Constants::$invalidUser);
        }

    }

    private function check_empty_input($username, $password) {
        if(empty($username) || empty($password)) {
            array_push($this->errorArray, Constants::$emptyLoginInputs);
            // echo 'cant be empty';
            return;
        }
    }

    public function getError($error) {
        if(in_array($error, $this->errorArray)) {
            return "<span class='errorMsg'>$error</span>";
        }
    }

}