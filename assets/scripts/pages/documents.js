window.onload = () => {
  // variables control pagination
  let currentPage = 1;
  let pageSize = 10;
  let appendItems = document.querySelector(".append-items");
  let appendPagination = document.querySelector(".append-pagination");
  let loader = document.querySelector(".loader");

  async function fetchData() {
    loader.classList.remove('hide');
    await fetch(
      `/apis/v1/get_documents?currentPage=${currentPage}&pageSize=${pageSize}`,
      {
        headers: {
          'Content-type': 'application/json',
        }
      }
    )
    .then(response => response.json())
    .then(data => {
      handleItems(data.data.result, appendItems);
      handlePagination(data.data.metadata.totalPages, appendPagination);
    })
    .catch(err => console.log(err));

    loader.classList.add('hide');
  }

  function handleItems(items, appendTo) {
    let AllItems = '';
    appendTo.innerHTML = '';
    for (let i = 0; i < items.length; i++) {
      AllItems += `
        <tr>
          <td>${i + 1}</td>
          <td>
            <a href="/documents/${items[i].uuid}/details">${items[i].uuid}</a>
          </td>
          <td>${items[i].internalId}</td>
          <td>${items[i].typeName}</td>
          <td>${items[i].typeVersionName}</td>
          <td>${items[i].issuerName}</td>
          <td>${items[i].receiverName}</td>
          <td>${new Date(items[i].dateTimeIssued).toLocaleString()}</td>
          <td>${new Date(items[i].dateTimeReceived).toLocaleString()}</td>
          <td>${items[i].status}</td>
          <td class="d-flex align-items-center">
            <a href="${items[i].publicUrl}" class="update-item" target="_blank">
              <span class="material-icons">insert_link</span>
            </a>
            <a href="/documents/${items[i].uuid}/pdf" class="pdf-item">
              <span class="material-icons">picture_as_pdf</span>
            </a>
            <a href="/documents/${items[i].uuid}/cancel" class="delete-item">
              <span class="material-icons">close</span>
            </a>
          </td>
        </tr>
      `;
    }
    appendTo.innerHTML = AllItems
  }

  function handlePagination(totalPages, appendTo) {
    let paginationBlock = '';
    appendTo.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      paginationBlock +=
        `${
          currentPage === i ?
          `<li class="active">
            <a class="pagination-link">${i}</a>
          </li>`
          :
          `<li class="waves-effect">
            <a class="pagination-link" href="#" data-page=${i}>${i}</a>
          </li>`
        }`
    }
    appendTo.innerHTML = paginationBlock;

    const paginationLinks = appendTo.querySelectorAll('li:not(.active) .pagination-link');
    paginationLinks.forEach(el => {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        currentPage = +this.dataset.page || 1;
        fetchData();
      });
    });
  }

  fetchData();
}