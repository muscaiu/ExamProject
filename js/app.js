//Getting main elements by Id
var main = document.getElementById('main')
var loginModal = document.getElementById('loginModal');
var loginUsername = document.getElementById('loginUsername')
var loginPassword = document.getElementById('loginPassword')
var registerModal = document.getElementById('registerModal')
var registerEmail = document.getElementById('registerEmail')
var registerUsername = document.getElementById('registerUsername')
var registerPassword = document.getElementById('registerPassword')
var registerRepeatPassword = document.getElementById('registerRepeatPassword')

//Display Login Modal on Load (rest hidden in css)
loginModal.style.display = 'block'

//Error messages Object
var display = {
    registerEmailError: 'Error: invalid email address.',
    registerUsernameError: 'Error: username must contain at least 2 characters.',
    registerPasswordError: 'Error: password must contain at least 6 characters.',
    registerRepeatPasswordError: "Error: passwords don't match.",
    loginNoToken: "Try to Register first.",
    loginDataError: "Username or Password incorrect!",
    tryLogin: 'You can now try to Login.',
    registerDataError: "Incomplete Data.",
    registerSuccess: 'Redirecting to Login Page...',
    loginSuccess: 'Logging In ...',
    logout: 'Logging Out ...'
}

$(document).ready(function() {

    //Show Error Message and CSS
    var showError = function(id, div, error) {
        // $(div).css('display', 'block')
        $(id).css('border', '1px solid red')
        $(div).html(error)
    }

    //Show Success Message and CSS
    var showSucess = function(id, div, display) {
        $(id).css('border', '1px solid green')
        $(div).css('display', 'none')
    }

    //Email Validation Logic (used in Register and keyup event)
    var CheckRegisterEmail = function() {
        var atpos = registerEmail.value.indexOf('@')
        var dotpos = registerEmail.value.lastIndexOf('.')
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= registerEmail.value.length) {
            showError(registerEmail, '#registerEmailError', display.registerEmailError)
            return false
        } else {
            showSucess(registerEmail, '#registerEmailError')
            return true
        }
    }

    //Username Validation Logic (used in Register Button click and keyup event)
    var CheckRegisterUsername = function() {
        if (registerUsername.value.length < 2) {
            showError(registerUsername, '#registerUsernameError', display.registerUsernameError)
            return false
        } else {
            showSucess(registerUsername, '#registerUsernameError')
            return true
        }
    }

    //Password Validation Logic (used in Register click and keyup event)
    var CheckRegisterPassword = function() {
        if (registerPassword.value.length < 6) {
            showError(registerPassword, '#registerPasswordError', display.registerPasswordError)
            return false
        } else {
            showSucess(registerPassword, '#registerPasswordError')
            return true
        }
    }

    //Repeat Password Validation Logic (used in Register click and keyup event)
    var CheckRegisterRepeatPassword = function() {
        if (registerRepeatPassword.value != registerPassword.value || registerRepeatPassword.value.length == 0) {
            showError(registerRepeatPassword, '#registerRepeatPasswordError', display.registerRepeatPasswordError)
            return false
        } else {
            showSucess(registerRepeatPassword, '#registerRepeatPasswordError')
            return true
        }
    }

    //Email validation
    $(registerEmail).keyup(function() {
        CheckRegisterEmail()
    })

    //Username Validation
    $(registerUsername).keyup(function() {
        CheckRegisterUsername()
    })

    //Password Validation
    $("#registerPassword").keyup(function() {
        CheckRegisterPassword()
    })

    //Confirm Password Validation
    $('#registerRepeatPassword').keyup(function() {
        CheckRegisterRepeatPassword()
    })

    //Submit Register
    SubmitRegister = function(e) {
        e.preventDefault()
        CheckRegisterEmail()
        CheckRegisterUsername()
        CheckRegisterPassword()
        CheckRegisterRepeatPassword()

        if (CheckRegisterEmail() && CheckRegisterUsername() && CheckRegisterPassword() && CheckRegisterRepeatPassword()) {
            //Adding email, username and password to localStorage with JSON.stringify 
            //to be able to access it later as an object
            var token = {
                loggedUser: registerUsername.value,
                loggedEmail: registerEmail.value,
                loggedPassword: registerPassword.value,
                loggedAvatar: selectedAvatar
            }
            localStorage.setItem('token', JSON.stringify(token))
            var tokenString = localStorage.getItem('token')
            token = JSON.parse(tokenString)

            setTimeout(function() {
                ShowLoginModal()
                toastr.info(display.tryLogin)
            }, 3000)
            toastr.success(display.registerSuccess, 'Success !')
        } else {
            toastr.error(display.registerDataError, 'Error !')
        }
    }

    //Submit Login
    SubmitLogin = function(e) {
        e.preventDefault()

        //read data drom localStorage
        var tokenString = localStorage.getItem('token')
        token = JSON.parse(tokenString)

        //Avoid error on testing
        var currentUser = (tokenString != null ? token.loggedUser : "guest")

        if (token == null) {
            toastr.error(display.loginNoToken, 'Error !')
        } else {
            if (loginUsername.value == token.loggedUser && loginPassword.value == token.loggedPassword) {

                setTimeout(function() {
                    //hide login and register
                    registerModal.style.display = 'none'
                    loginModal.style.display = 'none'
                    main.style.display = 'block'

                    //Display Logged Username
                    $('#hello').html("welcome " + currentUser + " <span class='caret'></span>")

                    //Display Selected Avatar
                    $('#navAvatar').attr('src', token.loggedAvatar)

                }, 3000)

                toastr.success(display.loginSuccess, 'Success !')
            } else {
                toastr.error(display.loginDataError, 'Error !')
            }
        }


    }

    //Log Out (clear localStorage) and show Login Modal
    $('#logout').click(function() {
        setTimeout(function() {
            location.reload()
            localStorage.removeItem('token')
            main.style.display = 'none'
        }, 3000)

        toastr.warning(logout, "Warning!")
    })

    //Show Register Modal
    ShowRegisterModal = function() {
        loginModal.style.display = 'none'
        registerModal.style.display = 'block'

        toastr.info("Choose your Avatar!", 'New Feature Available!')
        $("#prevAvatar").fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
        $("#nextAvatar").fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);

        //Navigating to Register clears remaining errors left on Login
        $('.validationSuccess').html('')
        $('.validationmessage').html('')
    }

    //Show Login Modal
    ShowLoginModal = function() {
        registerModal.style.display = 'none'
        loginModal.style.display = 'block'

        //Navigating to Login clears remaining errors left on Register
        $('.validationSuccess').html('')
        $('.validationmessage').html('')
        $(registerEmail).css('border', '1px solid #ccc')
        $(registerUsername).css('border', '1px solid #ccc')
        $(registerPassword).css('border', '1px solid #ccc')
        $(registerRepeatPassword).css('border', '1px solid #ccc')
    }

    //Displaying the next/previous Avatar Picture
    var AvatarArray = [
        'img/avatar-f.png',
        'img/avatar-m.png',
        'img/avatar-f2.png',
        'img/troll.png'
    ]
    var x = 0
    var selectedAvatar
    var ChangeAvatar = function() {
        $("#registerAvatar").fadeOut('fast', function() {
            $("#registerAvatar").attr('src', AvatarArray[x])
            $("#registerAvatar").fadeIn('fast')
        })
    }
    $('#nextAvatar').click(function() {
        x++
        if (x >= AvatarArray.length) x = 0

        selectedAvatar = AvatarArray[x]
        ChangeAvatar()
    })
    $('#prevAvatar').click(function() {
        x--
        if (x < 0) x = AvatarArray.length - 1

        selectedAvatar = AvatarArray[x]
        ChangeAvatar()
    })

    //Gallery Code
    $('#myCarousel').carousel({
        interval: 5000
    });

    //Handles the carousel thumbnails
    $('[id^=carousel-selector-]').click(function() {
        var id_selector = $(this).attr("id");
        try {
            var id = /-(\d+)$/.exec(id_selector)[1];
            console.log(id_selector, id);
            jQuery('#myCarousel').carousel(parseInt(id));
        } catch (e) {
            console.log('Regex failed!', e);
        }
    });
    // When the carousel slides, auto update the text
    $('#myCarousel').on('slid.bs.carousel', function(e) {
        var id = $('.item.active').data('slide-number');
        $('#carousel-text').html($('#slide-content-' + id).html());
    });
})