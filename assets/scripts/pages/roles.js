window.onload = () => {
  const checkAllPermissionsBtn = document.querySelector(".check-all-permissions");
  const removeAllPermissionsBtn = document.querySelector(".remove-all-permissions");
  const allPermissionsInputs = document.querySelectorAll("input[type='checkbox']");

  checkAllPermissionsBtn.onclick = () => {
    allPermissionsInputs.forEach(el => {
      el.checked === true ? null : el.checked = true;
    });
  }
  removeAllPermissionsBtn.onclick = () => {
    allPermissionsInputs.forEach(el => {
      el.checked === true ? el.checked = false : null;
    });
  }
}