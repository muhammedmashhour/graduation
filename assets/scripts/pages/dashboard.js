window.onload = () => {


  const usersCount = document.querySelector('.users-count');
  fetch(
    '/apis/v1/dashboard/users_count',
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  )
  .then(response => response.json())
  .then(data => {
    usersCount.textContent = data.usersLength;
  })
  .catch(err => console.log(err));


  const documentsCount = document.querySelector('.documents-count');
  const validDocumentsCount = document.querySelector('.valid-documents-count')
  fetch(
    '/apis/v1/dashboard/documents',
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  )
  .then(response => response.json())
  .then(data => {
    documentsCount.textContent = data.data.metadata.totalCount;
    validDocumentsCount.textContent = data.data.result.filter(el => el.status == "Valid").length;
  })
  .catch(err => console.log(err));


  const clientsCount = document.querySelector('.clients-count')
  fetch(
    '/apis/v1/dashboard/clients_count',
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  )
  .then(response => response.json())
  .then(data => {
    clientsCount.textContent = data.clientsCount;
  })
  .catch(err => console.log(err));
}