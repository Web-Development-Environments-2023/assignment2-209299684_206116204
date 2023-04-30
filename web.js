var p = "p";
var username;
var users_list = {};
users_list[p] = p;
var userToShow;
var userIsHere = false;

$(document).ready(function () {
    //Login
    $("#signInForm").validate({
        rules: {
            login_uname: {
                required: true,
            },
            login_psw: {
                required: true,
                validateUser: true
            }
        },
        messages: {
            login_uname: {
                required: "Enter your username."
            },
            login_psw: {
                required: "Enter your password",
                validateUser: "Username or Password is not exist."
            }
        },
        errorElement: 'div',
        submitHandler: function () {
            login();
        },
    });

    //Sign up
    $("#sign_up_form").validate({
        rules: {
            singup_username: {
                required: true,
                validateUniqUname: true
            },
            signup_psw: {
                required: true,
                strongPassword: true
            },
            signup_psw2: {
                required: true,
                validationPass: true
            },
            singup_name: {
                required: true,
                onlyletters: true
            },
            singup_lname: {
                required: true,
                onlyletters: true
            },
            signup_email: {
                required: true,
                email: true
            },
            singup_birthDate: {
                required: true
            }
        },
        messages: {
            singup_username: {
                required: "username",
                validateUniqUname: "Username already exist."
            },
            signup_psw: {
                required: "password",
                strongPassword: "Password must contain 8 charcters. at least one number and one letter"
            },
            signup_psw2: {
                required: "password again",
                validationPass: "have to be same password"
            },
            singup_name: {
                required: "first name",
                onlyletters: "first name must contain letters."
            },
            singup_lname: {
                required: "last name",
                onlyletters: "last name must contain letters."
            },

            signup_email: {
                required: "your e-mail",
                email: "Please enter a valid e-mail address."
            },
            singup_birthDate: {
                required: "birth day."
            }
        },
        errorElement: 'div',
        submitHandler: function () {
            register();
        },
    });
});

$(function () {

    //SIGN UP - constraints

    //Password must contain 8 characters, at least one number and one letter
    $.validator.addMethod('strongPassword', function (value, element) {
        return this.optional(element) ||
            value.length >= 8 &&
            /\d/.test(value) &&
            /[a-z]/i.test(value) && /[0-9]/i.test(value);
    });

    // checks whether the value of an input field contains only alphabetic characters (uppercase or lowercase) using a regular expression pattern.
    $.validator.addMethod('onlyletters', function (value, element) {
        const letterRegex = /^[a-zA-Z]+$/;
        return this.optional(element) || letterRegex.test(value);
    });

    //check if password match the new password
    $.validator.addMethod('validationPass', function (value, element, param) {
        let signup_psw = document.getElementById("signup_psw_id").value;
        return value === signup_psw;
    });

    //check if username already exists in the db
    $.validator.addMethod('validateUniqUname', function (value, element) {
        return !(value in users_list);
    });

    //check if email is valid
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }


    //Login - constraints

    //Check if password match user
    $.validator.addMethod('validateUser', function (password, element) {
        users_list[p] = "testuser";
        let username_input = document.getElementById("login_uname_id").value;
        if (!(username_input in users_list)) {
            return false;
        } else if (users_list[username_input] === password) {
            return true;
        }
        return false;
    });

    //Check if password match user
    $.validator.addMethod('greaterOrEqual', function (value, element, param) {
        return value >= param;
    });

    $.validator.addMethod("notEqualTo", function (value, element, param) {
        return value !== $(param).val();
    });
});

//Register to user.
const register = () => {
    let username = document.getElementById("singup_username_id").value;
    let pass = document.getElementById("signup_psw_id").value;
    users_list[username] = pass;
    showSignin();
};

//Login to user
const login = () => {
    document.getElementById("nav_logout").style.display = 'block';
    document.getElementById("myButton").style.display = 'block';
    document.getElementById("setting_show").style.display = 'block';
    document.getElementById("signin_welcome_btn").disabled = false;
    document.getElementById("signin_welcome_btn").disabled = false;
    document.getElementById("signin_welcome_btn").style.backgroundColor = '#ffaaaf';
    document.getElementById("signin_welcome_btn").style.cursor = 'not-allowed';
    document.getElementById("signup_welcome_btn").disabled = false;
    document.getElementById("signup_welcome_btn").style.backgroundColor = '#ffaaaf';
    document.getElementById("signup_welcome_btn").style.cursor = 'not-allowed';

    userToShow = document.getElementById("login_uname_id").value;
    document.getElementById("loged_in_uname").innerHTML = userToShow;

    userIsHere = true;
    showSettings();

};

function showSettings() {
    userIsHere = true;
    var Temp = document.getElementById("settings");
    Temp.style.display = "block";

    document.getElementById("welcome").style.display = "none";
    document.getElementById("about").style.display = "none";
    document.getElementById("signup").style.display = "none";
    document.getElementById("play").style.display = "none";
    document.getElementById("signin").style.display = "none";
}


function logout() {
    document.getElementById("loged_in_uname").innerHTML = 'guest';
    document.getElementById("nav_logout").style.display = 'none';
    document.getElementById("myButton").style.display = 'none';
    document.getElementById("setting_show").style.display = 'none';
    userIsHere = false;
    showWelcome();
    location.reload();

}

function showAbout() {
    var Temp = document.getElementById("about");
    Temp.style.display = "block";

    document.getElementById("welcome").style.display = "none";
    document.getElementById("signup").style.display = "none";
    document.getElementById("signin").style.display = "none";

    if (userIsHere === false) {
        document.getElementById("play").style.display = "none";
        document.getElementById("myButton").style.display = false;
        document.getElementById("setting_show").style.display = false;
    } else {
        document.getElementById("play").style.display = "none";
        document.getElementById("myButton").style.display = true;
        document.getElementById("setting_show").style.display = true;
        document.getElementById("settings").style.display = true;
    }

    $(document).on(
        'keydown', function (event) {
            if (event.key === "Escape") {
                Temp.style.display = "none";
            }
        });

    window.onclick = function (event) {
        if (event.target === Temp) {
            Temp.style.display = "none";
        }
    }

    var span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        Temp.style.display = "none";
    }
}

function showWelcome() {
    var Temp = document.getElementById("welcome");
    Temp.style.display = "block";

    document.getElementById("about").style.display = "none";
    document.getElementById("signup").style.display = "none";
    document.getElementById("signin").style.display = "none";
    document.getElementById("play").style.display = "none";
    document.getElementById("settings").style.display = "none";
}

function showSignup() {
    var Temp = document.getElementById("signup");
    Temp.style.display = "block";

    document.getElementById("welcome").style.display = "none";
    document.getElementById("about").style.display = "none";
    document.getElementById("signin").style.display = "none";
    document.getElementById("play").style.display = "none";
    document.getElementById("settings").style.display = "none";
}

function showSignin() {
    var Temp = document.getElementById("signin");
    Temp.style.display = "block";

    document.getElementById("welcome").style.display = "none";
    document.getElementById("about").style.display = "none";
    document.getElementById("signup").style.display = "none";
    document.getElementById("play").style.display = "none";
    document.getElementById("settings").style.display = "none";
}

function showPlay() {
    userIsHere = true;
    var Temp = document.getElementById("play");
    Temp.style.display = "block";

    if (document.getElementById('setting_show').onclick === true) {
        T.style.display = "none";
        showSettings()
    }

    document.getElementById("welcome").style.display = "none";
    document.getElementById("about").style.display = "none";
    document.getElementById("signup").style.display = "none";
    document.getElementById("signin").style.display = "none";
    document.getElementById("settings").style.display = "none";
}