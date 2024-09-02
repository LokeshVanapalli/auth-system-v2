
document.addEventListener('DOMContentLoaded', () => {

  const formContainer = document.querySelector('.form-container');
  const wrapper = document.querySelector('.wrapper');
  const showRegister = document.getElementById('show-register');
  const showLogin = document.getElementById('show-login');
  const showForgotPassword = document.getElementById('show-forgot-password');
  const showLoginFromForgot = document.getElementById('show-login-from-forgot');
  const sendOtpButton = document.getElementById('send-otp');
  const otpBoxes = document.querySelector('.otp-boxes');
  const togglePasswordIcons = document.querySelectorAll('.toggle-password');
  const checkBox = document.getElementById('rememberMe')


  if(checkBox){
    checkBox.checked = false
  }

//   Swal.fire({
//     title: 'Error!',
//     text: 'Invalid link.',
//     icon: 'error',
//     confirmButtonText: 'OK'
// });

  function adjustWrapperHeight() {
    if (formContainer.classList.contains('rotate')) {
      if (document.querySelector('.register-form').style.display === 'block') {
        wrapper.style.height = '480px'; // Height for register form
      } else if (document.querySelector('.forgot-password-form').style.display === 'block') {
        wrapper.style.height = '518px'; // Height for forgot password form
      }
    } else {
      wrapper.style.height = '400px'; // Height for login form
    }
  }

  function showForm(formToShow) {
    document.querySelectorAll('.form').forEach(form => {
      form.style.display = 'none';
    });
    formToShow.style.display = 'block';
  }

  showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    formContainer.classList.add('rotate');
    setTimeout(() => {
      showForm(document.querySelector('.register-form'));
      adjustWrapperHeight();
    }, 600); // Delay to ensure rotation is complete
  });

  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    formContainer.classList.remove('rotate');
    setTimeout(() => {
      showForm(document.querySelector('.login-form'));
      adjustWrapperHeight();
    }, 600); // Delay to ensure rotation is complete
  });

  showForgotPassword.addEventListener('click', (e) => {
    e.preventDefault();
    formContainer.classList.add('rotate');
    setTimeout(() => {
      showForm(document.querySelector('.forgot-password-form'));
      adjustWrapperHeight();
    }, 600); // Delay to ensure rotation is complete
  });

  showLoginFromForgot.addEventListener('click', (e) => {
    e.preventDefault();
    formContainer.classList.remove('rotate');
    setTimeout(() => {
      showForm(document.querySelector('.login-form'));
      adjustWrapperHeight();
    }, 600); // Delay to ensure rotation is complete
  });

  sendOtpButton.addEventListener('click', () => {
    otpBoxes.style.display = 'flex';
    adjustWrapperHeight();
  });

  togglePasswordIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      const target = document.querySelector(icon.getAttribute('data-target'));
      const type = target.getAttribute('type') === 'password' ? 'text' : 'password';
      target.setAttribute('type', type);
      icon.classList.toggle('bx-hide');
      icon.classList.toggle('bx-show');
    });
  });

  // Set initial height
  adjustWrapperHeight();

  const otp_inputs = document.querySelectorAll('.otp-box')
  otp_inputs.forEach(
    (ip) => {
      ip.addEventListener('keyup', moveNext)
    }
  )
  function moveNext(event) {
    try {
      let currentInput = event.target;
      let index = currentInput.classList[1].slice(-1)
      if(event.keyCode == 8 && index > 0){
        currentInput.previousElementSibling.focus()
      } else if(index < 6){
        currentInput.nextElementSibling.focus()
      }
    } catch (error) {
      // console.log("eooro")
    }
  }
  
});

async function registerUser() {
  let regEmail = document.getElementById('reg-email').value
  let fullName = document.getElementById('reg-name').value
  let regPassword = document.getElementById('register-password').value

  try {
      const response = await fetch('/api/v2/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: regEmail,
            name: fullName,
            password: regPassword
            })
      })
      // console.log(response)
      const data = await response.json()
      
      // console.log(data)
      if(response.status === 201){
        // alert(data.message)
        console.log('sucess')
        Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          window.location.href = '/';
        });
        // window.location.href = '/';
      }else if(response.status === 400){
        // alert(data.message)
        Swal.fire({
          title: 'Error!',
          text: data.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } 
    catch (error) {
      console.log('Error in register form submission')
    }
}

async function loginUser() {
  let email = document.getElementById('login-email').value
  let password = document.getElementById('login-password').value
  const checkBox = document.getElementById('rememberMe').checked

  try {
    const response = await fetch('/api/v2/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          checkBox
          })
    })

    // console.log(response)
    const data = await response.json()
    // console.log(data)
    
    if(response.status === 200){
      // alert('Login Successfull')
      // localStorage.setItem('token', data.token)
      // window.location.href = './home.html';
      Swal.fire({
        title: 'Success!',
        text: data.message,
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        localStorage.setItem('token', data.token);
        window.location.href = './home.html';
      });
    }else if(response.status === 401){
      // alert(data.message)
      Swal.fire({
        title: 'Error!',
        text: data.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  } 
  catch (error) {
    console.log('Error in login form submission')
  }
}

async function forgetPassword() {
  let forgetEmail = document.getElementById('forget-email').value
  
  // console.log(forgetEmail)
    try {
      const response  = await fetch('/api/v2/auth/forget-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: forgetEmail
            })
        })

        const data = await response.json()
        // alert(data.message)
        if(response.status === 400){
          Swal.fire({
            text: data.message,
            icon: 'info',
            confirmButtonText: 'OK'
          });
        } else if (response.status === 200){
          Swal.fire({
            title: 'Success!',
            text: data.message,
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: data.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
        
    } catch (error) {
      console.log('Error in OTP sending')
    }
}

async function verifyOTP() {
  const otpBoxes  = document.querySelectorAll('.otp-box')
  let forgetEmail = document.getElementById('forget-email').value
  let otpValue = "";

  
  otpBoxes.forEach(box => {
    otpValue += box.value
  })

  for (let input of otpBoxes) {
    if (input.value === '') {
        // alert('Please fill out all OTP fields.');
        Swal.fire({
          title: 'Error!',
          text: 'Please fill out all OTP fields.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        input.focus();
        return;
    }
  }

  try {
    const response = await fetch('/api/v2/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: otpValue,
          email: forgetEmail
          })
    })

    const data = await response.json()
    if(response.status === 200){
      // alert(data.message)
      Swal.fire({
        title: 'Success!',
        text: data.message,
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } else {
      // alert(data.message)
      Swal.fire({
        title: 'Error!',
        text: data.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
    

  } catch (error) {
    console.log('Error in OTP verification')
  }
}
