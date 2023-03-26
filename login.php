<?php
include './config/dbh.php';
include './classes/sanitize.class.php';
include 'register.class.php';
include 'SignIn.class.php';
include './classes/Constants.class.php';


$registerUser = new RegisterUser($con);
$logUserIn = new SignIn($con);

if(isset($_POST['register'])) {
    $username = Sanitize::sanitizeInput($_POST['username']);
    $pwd = Sanitize::sanitize_password($_POST['pwd']);
    $pwd2 = Sanitize::sanitize_password($_POST['pwd-repeat']);
    
    $registerUser->registerUser($username, $pwd, $pwd2);
}

if(isset($_POST['login'])) {
    $username = Sanitize::sanitizeInput($_POST['login-user']);
    $pwd = Sanitize::sanitize_password($_POST['login-pwd']);

    $logUserIn->signUserIn($username, $pwd);
}





?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- FontAwesome v6.6.6 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <link rel="stylesheet" href="./css/login.css">

    <title>Login</title>
</head>
<body>

    <div class="container">
        <img src="./starter-code/assets/logo-dark.svg" alt="">
    </div>
    <div class="registration-section ">
        <div class="logo">
            <img src="./starter-code/assets/logo-light.svg" height="40" alt="">
        </div>
        <div class="form-container">
            <form action="login.php" method="POST" id="registration-form">
                <div class="btn-wrapper">
                    <div class="login-btn">
                        <i class="fa-solid fa-arrow-right-to-bracket"></i>
                        <span>Sign in</span>
                    </div>
                    <div class="register-btn">
                        <i class="fa-solid fa-user-plus"></i>
                        <span>Register</span>
                    </div>
                </div>
                <div class="login-register-sections-container">
                    <div class="login-section ">
                        <input type="text" autocomplete="off" name="login-user" placeholder="Username">
                        <br>
                        <input type="password" name="login-pwd" placeholder="Password">
                        <i class="fa-solid fa-eye login-pwd"></i>
                        <i class="fa-solid fa-eye-slash hide-login-pwd"></i>
                        <br>
                        <input type="submit" name="login" value="Sign in">
                    </div>
                    <div class="register-section display-none">
                        <input type="text" autocomplete="off" name="username" placeholder="Username">
                        <br>
                        <input type="password" name="pwd" id="pwd" placeholder="Password">
                        <i class="fa-solid fa-eye view-pwd"></i>
                        <i class="fa-solid fa-eye-slash hide-pwd"></i>
                        <br>
                        <input type="password" name="pwd-repeat" id="pwd2" placeholder="Confirm password">
                        <i class="fa-solid fa-eye view-pwd2"></i>
                        <i class="fa-solid fa-eye-slash hide-pwd2"></i>
                        <br>
                        <input type="submit" name="register" value="Register">
                    </div>
                </div>
                <div class="error-msg-container">
                    <p><?php echo $registerUser->getError(Constants::$usernameTaken); ?></p>
                    <p><?php echo $registerUser->getError(Constants::$pwdValidation); ?></p>
                    <p><?php echo $registerUser->getError(Constants::$emptyInput); ?></p>
                    <p><?php echo $registerUser->getError(Constants::$pwdMatch); ?></p>
                    <p><?php echo $registerUser->getError(Constants::$pwdCharLength); ?></p>
                    <p><?php echo $registerUser->getError(Constants::$pwdTaken); ?></p>
                    <p><?php echo $registerUser->getError(Constants::$error); ?></p>
                    <p><?php echo $logUserIn->getError(Constants::$emptyInput); ?></p>
                    <p><?php echo $logUserIn->getError(Constants::$invalidUser); ?></p>
                </div>
            </form>
        </div>
    </div>



    <script src="./js-scripts/login.js"></script>
</body>
</html>