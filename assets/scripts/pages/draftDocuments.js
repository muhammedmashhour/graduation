window.onload = () => {
  const uploadJsonFileInput = document.querySelector('input[name="upload_json_file"]');

  uploadJsonFileInput.addEventListener('change', function() {
    const file = this.files[0];
    const createInstanceUrl = URL.createObjectURL(file);
    fetch(createInstanceUrl)
    .then(response => response.json())
    .then(json => {
      document.querySelector('input[name="selected_json_file"]').value = JSON.stringify(json);
    })
    .catch(e => {
      alert('select valid file');
    })
  })
}