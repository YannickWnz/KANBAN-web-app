<?php

class Sanitize {
    
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
        $input = ucfirst($input);
        return $input;
    }

    public static function sanitizeId($id) {
        $id = str_replace( array( '\'', '"', ',', ';', '<', '>', '*', '`', '=', '?', '!', '-', '.' ), ' ', $id);
        if(strlen($id) > 5) {
            $id = substr($id, 0, 5);
        }
        return $id;
    }


}

