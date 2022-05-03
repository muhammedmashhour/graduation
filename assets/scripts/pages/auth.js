window.onload = () => {
  const togglePasswordVisibilityBtn = document.querySelector(".toggle-password");
  const inputPassword = document.querySelector("input[type='password']");

  togglePasswordVisibilityBtn.onclick = () => {
    inputPassword.type === 'password' ? inputPassword.setAttribute('type', 'text') : inputPassword.setAttribute('type', 'password');
    togglePasswordVisibilityBtn.innerHTML = `<span class="material-icons">${inputPassword.type === 'password' ? 'visibility' : 'visibility_off'}</span>`;
  }
}