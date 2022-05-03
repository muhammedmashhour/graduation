window.onload = () => {
  // variables control pagination
  let currentPage = 1;
  let pageSize = 10;
  let status = '';
  let active = false;
  let appendItems = document.querySelector(".append-items");
  let appendPagination = document.querySelector(".append-pagination");
  let sortBy = document.querySelector("select.sort-by");
  let selectPageSize = document.querySelector("select.page-size");
  let loader = document.querySelector(".loader");

  async function fetchData() {
    loader.classList.remove('hide');
    await fetch(
      `/apis/v1/get_codes?currentPage=${currentPage}&pageSize=${pageSize}&status=${status}&active=${active}`,
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
            ${
              items[i].status == 'Approved'
              ?
              `<a href="/codes/${items[i].itemCode}/details">
                ${items[i].itemCode}
              </a>`
              :
              `${items[i].itemCode}`
            }
          </td>
          <td>${items[i].codeNamePrimaryLang}</td>
          <td>${items[i].codeNameSecondaryLang}</td>
          <td>${new Date(items[i].activeFrom).toLocaleString()}</td>
          <td>${new Date(items[i].activeTo).toLocaleString()}</td>
          <td>
            <span class="code-status ${items[i].status == 'Approved' ? 'approved' : 'pending'}">
              <i class="material-icons">check</i>
              ${items[i].status == 'Approved' ? 'approved' : 'pending'}
            </span>
          </td>
          <td>
            ${
              items[i].status == 'Approved'
              ?
              `<a class="update-item" href="/codes/${items[i].itemCode}/update/?codeUsageRequestID=${items[i].codeUsageRequestID}">
                <i class="material-icons">edit</i>
              </a>`
              :
              `<i class="material-icons">edit</i>`
            }
            
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

  if (selectPageSize) {
    selectPageSize.addEventListener('change', function() {
      currentPage = 1;
      pageSize = +this.value || 10;
      fetchData();
    });
  }

  if (sortBy) {
    sortBy.addEventListener('change', function() {
      currentPage = 1;
      if (this.value === 'Active') {
        active = true;
        status = '';
        return fetchData();
      } else if (this.value === 'Approved') {
        active = false;
        status = 'Approved';
        return fetchData();
      }
      active = false;
      status = '';
      fetchData();
    });
  }
}