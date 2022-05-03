document.addEventListener('DOMContentLoaded', function() {
  /*== init sidebar collapse ==*/
  const collapseBtns = document.querySelectorAll('.collapsible');
  M.Collapsible.init(collapseBtns);

  /*== init select box ==*/
  const selectItems = document.querySelectorAll('select');
  M.FormSelect.init(selectItems);

  /*== init tabs ==*/
  const tabsItems = document.querySelectorAll(".tabs");
  M.Tabs.init(tabsItems);

  /*== init tooltips ==*/
  const toolTips = document.querySelectorAll('.tooltipped');
  M.Tooltip.init(toolTips);

  /*== init datepicker ==*/
  const datePickerInputs = document.querySelectorAll('.datepicker');
  M.Datepicker.init(datePickerInputs, {
    format: 'yyyy-mm-dd',
    showClearBtn: true,
  });

  /*== init floating buttons ==*/
  const floatingBtns = document.querySelectorAll('.fixed-action-btn');
  M.FloatingActionButton.init(floatingBtns);

  /*== init modals ==*/
  const modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  /*== sidebar functionality ==*/
  const sidebar = document.querySelector(".sidebar");
  const collapseSidebar = document.querySelector(".navbar-collapse button");
  const sidebarOverlay = document.querySelector(".sidebar-overlay");

  sidebarOverlay.onclick = handleCollapseSidebar;

  collapseSidebar.onclick = handleCollapseSidebar;

  function handleCollapseSidebar() {
    if (window.matchMedia('(min-width: 992px)').matches) {
      document.body.classList.contains("nav-fluded") ? document.body.classList.remove("nav-fluded") : document.body.classList.add("nav-fluded");
    } else {
      document.body.classList.contains("nav-open") ? document.body.classList.remove("nav-open") : document.body.classList.add("nav-open");
    }
  }

  const uploadMediaInputs = document.querySelectorAll(".media-block .upload-media");
  const uploadMediaBlocks = document.querySelectorAll(".media-block");

  uploadMediaInputs.forEach((el, index) => {
    el.addEventListener("change", function() {
      handleUploadMedia(this)
    })
  });


  function handleUploadMedia(el) {

    const file = el.files[0];

    const createInstanceUrl = URL.createObjectURL(file)

    const blockContainer = document.createElement('div');
    blockContainer.classList.add('media-view');

    blockContainer.innerHTML = `
      ${
        file.type == "image/png" || file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/webb'
        ?
          `<img src=${createInstanceUrl}>`
        :
          `<h4>
            <span>${file.name}</span>
          </h4>`
      }
      <a href="#" class="clear-media material-icons">clear</a>
      <a href="${createInstanceUrl}" target="_blank" class="view-media material-icons">remove_red_eye</a>
    `;

    el.parentElement.prepend(blockContainer);
  }

  uploadMediaBlocks.forEach(el => {
    el.addEventListener('click', function(e) {
      if (e.target.classList.contains('clear-media')) {
        e.preventDefault();
        e.target.parentElement.parentElement.childNodes[2].value = '';
        if (e.target.parentElement.parentElement.childNodes[3] !== undefined) {
          e.target.parentElement.parentElement.childNodes[3].value = '';
        }
        e.target.parentElement.remove();
      }
    })
  });


  /*== remove duplicated save ==*/
  const forms = document.querySelectorAll('form');
  forms.forEach((element, index) => {
    element.addEventListener('submit', (e) => {
      const btnSubmit = element.querySelector('button[type=submit]');
      btnSubmit.setAttribute('disabled', 'disabled');
      setTimeout(() => {
        btnSubmit.removeAttribute('disabled');
      }, 6000);
    });
  });


  /*== convert arabic number to english function ==*/
  function parseArabic(arNum) {
    arNum = (arNum.replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (d) {
        return d.charCodeAt(0) - 1632;
      }).replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function (d) {
        return d.charCodeAt(0) - 1776;
      })
    );
    return arNum;
  };


  /*== Convert any inputed arabic number to english ==*/
  const inputText = document.querySelectorAll('input[type="text"]');
  inputText.forEach(el => {
    el.addEventListener('input', function() {
      const inputVal = this.value;
      const enValue = parseArabic(inputVal);
      this.value = enValue;
    });
  });


});