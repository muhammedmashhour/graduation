const selectClientType = document.querySelector("select[name='client_type']");
const inputClientId = document.querySelector("input[name='client_id']");


// handle change select client type
selectClientType.onchange = handleChangeClientType;

// init client type
handleChangeClientType();

function handleChangeClientType() {
  const selectedOption = selectClientType.options[selectClientType.selectedIndex];
  const optionTarget = selectedOption.dataset.target;
  inputClientId.placeholder = optionTarget;
};