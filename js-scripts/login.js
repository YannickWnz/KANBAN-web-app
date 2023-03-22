
    const login_btn = document.querySelector('.login-btn')
    const register_btn = document.querySelector('.register-btn')
    const register_section = document.querySelector('.register-section')
    const login_section = document.querySelector('.login-section')

    function set_register_section_to_active() {
        if(register_section.classList.contains('display-none')) {
            register_section.classList.remove('display-none')
            localStorage.setItem('active-section', 'register-section')
            login_section.classList.add('display-none')
            register_btn.style.color = 'white'
            login_btn.style.color = 'var(--mediumGrey)'
        }
    }

    console.log('hello from javascript')
    
    function set_login_section_to_active() {
        if(login_section.classList.contains('display-none')) {
            login_section.classList.remove('display-none')
            localStorage.setItem('active-section', 'login-section')
            register_section.classList.add('display-none')
            login_btn.style.color = 'white'
            register_btn.style.color = 'var(--mediumGrey)'
        }
    }

        window.onload = function() {
            const transition_el = document.querySelector('.registration-section')

            if(localStorage.getItem("active-section") == 'register-section') {

                    set_register_section_to_active()

            } else if(localStorage.getItem("active-section") == 'login-section') {

                    set_login_section_to_active()

            }

            setTimeout(() => {
                // transition_el.classList.add("is-active");
            }, 3000)
        }

        const display_register_section = () => {
            
            set_register_section_to_active()

        }
        register_btn.addEventListener('click', display_register_section)

        const display_login_section = () => {
            
            set_login_section_to_active()

        }
        login_btn.addEventListener('click', display_login_section)


        // show/hide passwords SCRIPTS START
        const view_password_icon = document.querySelectorAll('.fa-eye');
        const hide_password_icon = document.querySelectorAll('.fa-eye-slash');
        const passwords = document.querySelectorAll('input[type=password]');

        passwords.forEach((pwd, index) => {
            pwd.addEventListener('keyup', (e) => {
                view_password_icon[index].style.display = 'block';
                if(pwd.value.length == 0) {
                    view_password_icon[index].style.display = 'none';
                }
            })
        })

        view_password_icon.forEach((icon, index) => {
            icon.addEventListener('click', () => {
                if(passwords[index].type == 'password') {
                    icon.style.opacity = 0
                    hide_password_icon[index].style.display = 'block';
                    passwords[index].type = 'text'
                } else {
                    icon.style.opacity = 1
                    hide_password_icon[index].style.display = 'none';
                    passwords[index].type = 'password'
                }
            })
        })
        // show/hide passwords SCRIPTS END



