<?php

class Sanitize {

    private $errorArray = array();
    
    public static function sanitizeInput($input) {
        if(strlen($input) == 0) {
            return;
        }

        $input = str_replace( array( '\'', '"', ',', ';', '<', '>', '*', '`', '=', '?', '!' ), ' ', $input);
        $input = strtolower($input);
        $input = ucfirst($input);
        $input = htmlspecialchars($input);
        return $input;
    }

    public static function sanitizeDescription($input) {
        if(strlen($input) == 0) {
            return;
        }
        $input = str_replace( array( '\'','<', '>', '*', '`', '=', ), ' ', $input);
        $input = htmlspecialchars($input);
        return $input;
    }

    public static function sanitizeStatus($input) {
        $input = htmlspecialchars($input);
        // $input = ucfirst($input);
        $input = strtolower($input);
        return $input;
    }

    public static function sanitizeId($id) {
        $id = str_replace( array( '\'', '"', ',', ';', '<', '>', '*', '`', '=', '?', '!', '-', '.' ), ' ', $id);
        $id = filter_var($id, FILTER_SANITIZE_NUMBER_INT);
        if(strlen($id) > 11) {
            $id = substr($id, 0, 11);
        }
        return $id;
    }

    public static function sanitizeArrayInput($arrayInput) {
        foreach($arrayInput as $key => $value) {
            $result[$key] = htmlspecialchars($value);
            return $result;
        }
    }

    public static function sanitize_password($password){
        $password = strip_tags($password);
        return $password;
    }


}

