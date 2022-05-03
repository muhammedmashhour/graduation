window.onload = () => {
  const loader = document.querySelector(".loader");

  const nextStep = document.querySelector('.next-step-btn');

  const generateInternalIdBtn = document.querySelector('.generate-internal-id');

  const searchCodeBtn = document.querySelector(".search-code");
  const egsSelect = document.querySelector('select[name="item_type"]');
  const egsBlock = document.querySelector('.search-code-content__items');
  const appendPagination = document.querySelector('.append-pagination');
  let currentPage = 1;

  const appendItemBlock = document.querySelector(".append-item-line");

  const addTaxBtn = document.querySelector(".add-tax");
  const taxesBlock = document.querySelector(".append-tax-items");


  nextStep.onclick = handleNextStep;

  function handleNextStep() {
    const activeStep = document.querySelector('.main-form .tabs .tab a.active');
    activeStep.parentNode.nextElementSibling.querySelector('a').click();
  }


  generateInternalIdBtn.onclick = handleGeneratelId;

  function handleGeneratelId() {
    const generatedNumber = Math.floor(Math.random() * 10);
    let number = '';

    for (let i = 0; i <= (generatedNumber > 5 ? generatedNumber : 10); i++) {
      number += Math.floor(Math.random() * (generatedNumber > 5 ? generatedNumber : 10));
    }

    document.querySelector('input[name="internal_id"]').focus();

    document.querySelector('input[name="internal_id"]').value = number

  }


  searchCodeBtn.onclick = fetchData;

  async function fetchData() {
    if (egsSelect.value !== 'EGS') return;
    loader.classList.remove('hide');

    await fetch(
      `/apis/v1/get_codes?currentPage=${currentPage}&pageSize=${10}&status=Approved&active=${true}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then(response => response.json())
    .then(res => {
      
      handleItems(res.data.result, egsBlock);
      handlePagination(res.data.metadata.totalPages, appendPagination)
    });
    loader.classList.add('hide');
  }

  function handleItems(items, appendTo) {
    let allItems = '';
    appendTo.innerHTML = '';
    appendTo.classList.remove('hide');
    for (let i = 0; i < items.length; i++) {
      allItems+= `
        <button
          type="button"
          class="select-item"
          data-item-code="${items[i].itemCode}"
          data-item-desc="${items[i].descriptionPrimaryLang}"
          data-item-name="${items[i].codeNamePrimaryLang}"
        >
          ${items[i].itemCode} - ${items[i].descriptionPrimaryLang}
        </button>
      `;
    }
    appendTo.innerHTML = allItems;


    const selectedItems = document.querySelectorAll('.select-item');
    selectedItems.forEach(el => {
      el.addEventListener('click', function() {
        appendTo.classList.add('hide');
        appendTo.innerHTML = '';
        document.querySelector('input[name="item_code"]').value = this.dataset.itemCode;
        document.querySelector('input[name="item_code"]').focus();
        document.querySelector('input[name="item_name"]').value = this.dataset.itemName;
        document.querySelector('input[name="item_name"]').focus();
        document.querySelector('textarea[name="item_desc"]').value = this.dataset.itemDesc;
        document.querySelector('textarea[name="item_desc"]').focus();
      });
    })
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


  /*== validation add item line ==*/
  const addItemLineForm = document.querySelector('.add-item-line');

  addItemLineForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const itemType = document.querySelector('select[name="item_type"]').value;
    const itemCode = document.querySelector('input[name="item_code"]').value;
    const itemName = document.querySelector('input[name="item_name"]').value;
    const itemInternalCode = document.querySelector('input[name="internal_code"]').value;
    const itemDesc = document.querySelector('textarea[name="item_desc"]').value;
    const quantity = document.querySelector('input[name="quantity"]').value;
    const unitType = document.querySelector('select[name="unit_type"]').value;
    const currency = document.querySelector('select[name="currency"]').value;
    const unitValue = document.querySelector('input[name="unit_value"]').value;
    const discount = document.querySelector('input[name="discount"]').value;
    const tr = document.createElement('tr');



    // handle totals
    let totalSale = +quantity * +unitValue
    let netTotal = +totalSale - +discount;
    let allTaxes = [];

    /* handle taxes */
    let selectTaxType = document.querySelectorAll('select[name="tax_type"]');

    selectTaxType.forEach(el => {
      const taxType = el.value;
      const taxSubtype = el.parentNode.parentNode.querySelector('select[name="tax_subtype"]').value;
      const taxRate = +el.parentNode.parentNode.querySelector('input[name="tax_rate"]').value;
      allTaxes.push({
        taxType: taxType,
        subType: taxSubtype,
        rate: +parseFloat(taxRate).toFixed(5),
        amount: +parseFloat(+netTotal * (+taxRate / 100)).toFixed(5),
      });
    });

    tr.innerHTML += `
      <tr>
        <td><input type="text" name="selected_item_type" value="${itemType}" readonly></td>
        <td><input type="text" name="selected_item_code" value="${itemCode}" readonly></td>
        <td><input type="text" name="selected_item_name" value="${itemName}" readonly></td>
        <td><input type="text" name="selected_internal_code" value="${itemInternalCode}" readonly></td>
        <td><input type="text" name="selected_item_desc" value="${itemDesc}" readonly></td>
        <td><input type="text" name="selected_quantity" value="${+parseFloat(quantity).toFixed(5)}" readonly></td>
        <td><input type="text" name="selected_unit_type" value="${unitType}" readonly></td>
        <td><input type="text" name="selected_currency" value="${currency}" readonly></td>
        <td><input type="text" name="selected_unit_value" value="${+parseFloat(unitValue).toFixed(5)}" readonly></td>
        <td><input type="text" name="selected_discount" value="${+parseFloat(discount).toFixed(5)}" readonly></td>
        <td><input type="text" name="selected_total_sale" value="${+parseFloat(totalSale).toFixed(5)}" readonly></td>
        <td><input type="text" name="selected_net_total" value="${+parseFloat(netTotal).toFixed(5)}" readonly></td>
        <input type="hidden" name="selected_taxes" value=${JSON.stringify(allTaxes)}>
        <td>
          <a class="remove-item-line delete-item" href="#">
            <span class="material-icons">clear</span>
          <a>
        </td>
      </tr>
    `;

    appendItemBlock.appendChild(tr);

    addItemLineForm.reset();

    selectedTaxes = [];

    taxesBlock.innerHTML = '';

    checkItemsLinseIsEmpty();

    const removeItemLineBtns = document.querySelectorAll(".remove-item-line");

    removeItemLineBtns.forEach(el => {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        this.parentNode.parentNode.remove();
        checkItemsLinseIsEmpty();
      });
    })

    
  });

  function checkItemsLinseIsEmpty() {
    const itemsLines = document.querySelector('.items-lines');
    const emptyItemsLines = document.querySelector('.empty-items-lines');
    appendItemBlock.innerHTML === '' ? itemsLines.classList.add('d-none') : itemsLines.classList.remove('d-none');
    appendItemBlock.innerHTML === '' ? emptyItemsLines.classList.remove('d-none') : emptyItemsLines.classList.add('d-none');
  }

  checkItemsLinseIsEmpty();



  addTaxBtn.onclick = handleAddTax;
  var selectedTaxes = [];


  function handleAddTax() {
    const tr = document.createElement('tr');

    tr.innerHTML += `
      <tr>
        <td>
          <select name="tax_type" class="browser-default" required>
            <option value="">select tax</option>
            ${getAllTaxTypes()}
          </select>
        </td>
        <td>
          <select name="tax_subtype" class="browser-default" required>
          </select>
        </td>
        <td><input type="text" name="tax_rate" required></td>
        <td>
          <a class="remove-tax-item delete-item material-icons" href="#">clear<a>
        </td>
      </tr>
    `;

    taxesBlock.appendChild(tr);

    const selectTax = taxesBlock.querySelectorAll('select[name="tax_type"]');

    selectTax.forEach(el => {
      el.onchange = function() {
        if (selectedTaxes.includes(this.value)) {
          this.parentNode.parentNode.remove();
        } else {
          selectedTaxes.push(this.value);
          getSubtypes(this);
        }
      }
    })

  }

  taxesBlock.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-tax-item')) {
      selectedTaxes.splice(selectedTaxes.indexOf(e.target.parentNode.parentNode.querySelector('select[name="tax_type"]').value), 1);
      e.target.parentNode.parentNode.remove();
    }
  });

  function getAllTaxTypes() {
    let options = '';
    const t = [
      {
        "Code": "T1",
        "Desc_en": "Value added tax",
        "Desc_ar": "ضريبه القيمه المضافه"
      },
      {
        "Code": "T2",
        "Desc_en": "Table tax (percentage)",
        "Desc_ar": "ضريبه الجدول (نسبيه)"
      },
      {
        "Code": "T3",
        "Desc_en": "Table tax (Fixed Amount)",
        "Desc_ar": "ضريبه الجدول (قطعيه)"
      },
      {
        "Code": "T4",
        "Desc_en": "Withholding tax (WHT)",
        "Desc_ar": "الخصم تحت حساب الضريبه"
      },
      {
        "Code": "T5",
        "Desc_en": "Stamping tax (percentage)",
        "Desc_ar": "ضريبه الدمغه (نسبيه)"
      },
      {
        "Code": "T6",
        "Desc_en": "Stamping Tax (amount)",
        "Desc_ar": "ضريبه الدمغه (قطعيه بمقدار ثابت )"
      },
      {
        "Code": "T7",
        "Desc_en": "Entertainment tax",
        "Desc_ar": "ضريبة الملاهى"
      },
      {
        "Code": "T8",
        "Desc_en": "Resource development fee",
        "Desc_ar": "رسم تنميه الموارد"
      },
      {
        "Code": "T9",
        "Desc_en": "Table tax (percentage)",
        "Desc_ar": "رسم خدمة"
      },
      {
        "Code": "T10",
        "Desc_en": "Municipality Fees",
        "Desc_ar": "رسم المحليات"
      },
      {
        "Code": "T11",
        "Desc_en": "Medical insurance fee",
        "Desc_ar": "رسم التامين الصحى"
      },
      {
        "Code": "T12",
        "Desc_en": "Other fees",
        "Desc_ar": "رسوم أخري"
      },
      {
        "Code": "T13",
        "Desc_en": "Stamping tax (percentage)",
        "Desc_ar": "ضريبه الدمغه (نسبيه)"
      },
      {
        "Code": "T14",
        "Desc_en": "Stamping Tax (amount)",
        "Desc_ar": "ضريبه الدمغه (قطعيه بمقدار ثابت )"
      },
      {
        "Code": "T15",
        "Desc_en": "Entertainment tax",
        "Desc_ar": "ضريبة الملاهى"
      },
      {
        "Code": "T16",
        "Desc_en": "Resource development fee",
        "Desc_ar": "رسم تنميه الموارد"
      },
      {
        "Code": "T17",
        "Desc_en": "Table tax (percentage)",
        "Desc_ar": "رسم خدمة"
      },
      {
        "Code": "T18",
        "Desc_en": "Municipality Fees",
        "Desc_ar": "رسم المحليات"
      },
      {
        "Code": "T19",
        "Desc_en": "Medical insurance fee",
        "Desc_ar": "رسم التامين الصحى"
      },
      {
        "Code": "T20",
        "Desc_en": "Other fees",
        "Desc_ar": "رسوم أخرى"
      }
    ];

    for (let i = 0; i < t.length; i++) {
      if (!selectedTaxes.includes(t[i].Code)) {
        options += `<option value=${t[i].Code} title="${t[i].Desc_ar + ' - ' + t[i].Desc_en}">${t[i].Desc_ar}</option>`;
      }
    }

    return options;
  }

  function getSubtypes(taxTypeElement) {
    const s = [
      {
        "Code": "V001",
        "Desc_en": "Export",
        "Desc_ar": "تصدير للخارج",
        "TaxtypeReference": "T1"
      },
      {
        "Code": "V002",
        "Desc_en": "Export to free areas and other areas",
        "Desc_ar": "تصدير مناطق حرة وأخرى",
        "TaxtypeReference": "T1"
      },
      {
        "Code": "V003",
        "Desc_en": "Exempted good or service",
        "Desc_ar": "سلعة أو خدمة معفاة",
        "TaxtypeReference": "T1"
      },
      {
        "Code": "V004",
        "Desc_en": "A non-taxable good or service",
        "Desc_ar": "سلعة أو خدمة غير خاضعة للضريبة",
        "TaxtypeReference": "T1"
      },
      {
        "Code": "V005",
        "Desc_en": "Exemptions for diplomats, consulates and embassies",
        "Desc_ar": "إعفاءات دبلوماسين والقنصليات والسفارات",
        "TaxtypeReference": "T1"
      },
      {
        "Code": "V006",
        "Desc_en": "Defence and National security Exemptions",
        "Desc_ar": "إعفاءات الدفاع والأمن القومى",
        "TaxtypeReference": "T1"
      },
      {
        "Code": "V007",
        "Desc_en": "Agreements exemptions",
        "Desc_ar": "إعفاءات اتفاقيات",
        "TaxtypeReference": "T1"
      },
      {
        "Code": "V008",
        "Desc_en": "Special Exemptios and other reasons",
        "Desc_ar": "إعفاءات خاصة و أخرى",
        "TaxtypeReference": "T1"
      },
      {
        "Code": "V009",
        "Desc_en": "General Item sales",
        "Desc_ar": "سلع عامة",
        "TaxtypeReference": "T1"
      },
      {
        "Code": "V010",
        "Desc_en": "Other Rates",
        "Desc_ar": "نسب ضريبة أخرى",
        "TaxtypeReference": "T1"
      },
      {
        "Code": "Tbl01",
        "Desc_en": "Table tax (percentage)",
        "Desc_ar": "ضريبه الجدول (نسبيه)",
        "TaxtypeReference": "T2"
      },
      {
        "Code": "Tbl02",
        "Desc_en": "Table tax (Fixed Amount)",
        "Desc_ar": "ضريبه الجدول (النوعية)",
        "TaxtypeReference": "T3"
      },
      {
        "Code": "W001",
        "Desc_en": "Contracting",
        "Desc_ar": "المقاولات",
        "TaxtypeReference": "T4"
      },
      {
        "Code": "W002",
        "Desc_en": "Supplies",
        "Desc_ar": "التوريدات",
        "TaxtypeReference": "T4"
      },
      {
        "Code": "W003",
        "Desc_en": "Purachases",
        "Desc_ar": "المشتريات",
        "TaxtypeReference": "T4"
      },
      {
        "Code": "W004",
        "Desc_en": "Services",
        "Desc_ar": "الخدمات",
        "TaxtypeReference": "T4"
      },
      {
        "Code": "W005",
        "Desc_en": "Sumspaid by the cooperative societies for car transportation to their members",
        "Desc_ar": "المبالغالتي تدفعها الجميعات التعاونية للنقل بالسيارات لاعضائها",
        "TaxtypeReference": "T4"
      },
      {
        "Code": "W006",
        "Desc_en": "Commissionagency & brokerage",
        "Desc_ar": "الوكالةبالعمولة والسمسرة",
        "TaxtypeReference": "T4"
      },
      {
        "Code": "W007",
        "Desc_en": "Discounts& grants & additional exceptional incentives granted by smoke &cement companies",
        "Desc_ar": "الخصوماتوالمنح والحوافز الاستثنائية ةالاضافية التي تمنحها شركات الدخان والاسمنت ",
        "TaxtypeReference": "T4"
      },
      {
        "Code": "W008",
        "Desc_en": "Alldiscounts & grants & commissions granted by petroleum &telecommunications & other companies",
        "Desc_ar": "جميعالخصومات والمنح والعمولات  التيتمنحها  شركات البترول والاتصالات ...وغيرها من الشركات المخاطبة بنظام الخصم",
        "TaxtypeReference": "T4"
      },
      {
        "Code": "W009",
        "Desc_en": "Supporting export subsidies",
        "Desc_ar": "مساندة دعم الصادرات التي يمنحها صندوق تنمية الصادرات ",
        "TaxtypeReference": "T4"
      },
      {
        "Code": "W010",
        "Desc_en": "Professional fees",
        "Desc_ar": "اتعاب مهنية",
        "TaxtypeReference": "T4"
      },
      {
        "Code": "W011",
        "Desc_en": "Commission & brokerage _A_57",
        "Desc_ar": "العمولة والسمسرة _م_57",
        "TaxtypeReference": "T4"
      },
      {
        "Code": "W012",
        "Desc_en": "Hospitals collecting from doctors",
        "Desc_ar": "تحصيل المستشفيات من الاطباء",
        "TaxtypeReference": "T4"
      },
      {
        "Code": "W013",
        "Desc_en": "Royalties",
        "Desc_ar": "الاتاوات",
        "TaxtypeReference": "T4"
      },
      {
        "Code": "W014",
        "Desc_en": "Customs clearance",
        "Desc_ar": "تخليص جمركي ",
        "TaxtypeReference": "T4"
      },
      {
        "Code": "W015",
        "Desc_en": "Exemption",
        "Desc_ar": "أعفاء",
        "TaxtypeReference": "T4"
      },
      {
        "Code": "W016",
        "Desc_en": "advance payments",
        "Desc_ar": "دفعات مقدمه",
        "TaxtypeReference": "T4"
      },
      {
        "Code": "ST01",
        "Desc_en": "Stamping tax (percentage)",
        "Desc_ar": "ضريبه الدمغه (نسبيه)",
        "TaxtypeReference": "T5"
      },
      {
        "Code": "ST02",
        "Desc_en": "Stamping Tax (amount)",
        "Desc_ar": "ضريبه الدمغه (قطعيه بمقدار ثابت)",
        "TaxtypeReference": "T6"
      },
      {
        "Code": "Ent01",
        "Desc_en": "Entertainment tax (rate)",
        "Desc_ar": "ضريبة الملاهى (نسبة)",
        "TaxtypeReference": "T7"
      },
      {
        "Code": "Ent02",
        "Desc_en": "Entertainment tax (amount)",
        "Desc_ar": "ضريبة الملاهى (قطعية)",
        "TaxtypeReference": "T7"
      },
      {
        "Code": "RD01",
        "Desc_en": "Resource development fee (rate)",
        "Desc_ar": "رسم تنميه الموارد (نسبة)",
        "TaxtypeReference": "T8"
      },
      {
        "Code": "RD02",
        "Desc_en": "Resource development fee (amount)",
        "Desc_ar": "رسم تنميه الموارد (قطعية)",
        "TaxtypeReference": "T8"
      },
      {
        "Code": "SC01",
        "Desc_en": "Service charges (rate)",
        "Desc_ar": "رسم خدمة (نسبة)",
        "TaxtypeReference": "T9"
      },
      {
        "Code": "SC02",
        "Desc_en": "Service charges (amount)",
        "Desc_ar": "رسم خدمة (قطعية)",
        "TaxtypeReference": "T9"
      },
      {
        "Code": "Mn01",
        "Desc_en": "Municipality Fees (rate)",
        "Desc_ar": "رسم المحليات (نسبة)",
        "TaxtypeReference": "T10"
      },
      {
        "Code": "Mn02",
        "Desc_en": "Municipality Fees (amount)",
        "Desc_ar": "رسم المحليات (قطعية)",
        "TaxtypeReference": "T10"
      },
      {
        "Code": "MI01",
        "Desc_en": "Medical insurance fee (rate)",
        "Desc_ar": "رسم التامين الصحى (نسبة)",
        "TaxtypeReference": "T11"
      },
      {
        "Code": "MI02",
        "Desc_en": "Medical insurance fee (amount)",
        "Desc_ar": "رسم التامين الصحى (قطعية)",
        "TaxtypeReference": "T11"
      },
      {
        "Code": "OF01",
        "Desc_en": "Other fees (rate)",
        "Desc_ar": "رسوم أخرى (نسبة)",
        "TaxtypeReference": "T12"
      },
      {
        "Code": "OF02",
        "Desc_en": "Other fees (amount)",
        "Desc_ar": "رسوم أخرى (قطعية)",
        "TaxtypeReference": "T12"
      },
      {
        "Code": "ST03",
        "Desc_en": "Stamping tax (percentage)",
        "Desc_ar": "ضريبه الدمغه (نسبيه)",
        "TaxtypeReference": "T13"
      },
      {
        "Code": "ST04",
        "Desc_en": "Stamping Tax (amount)",
        "Desc_ar": "ضريبه الدمغه (قطعيه بمقدار ثابت)",
        "TaxtypeReference": "T14"
      },
      {
        "Code": "Ent03",
        "Desc_en": "Entertainment tax (rate)",
        "Desc_ar": "ضريبة الملاهى (نسبة)",
        "TaxtypeReference": "T15"
      },
      {
        "Code": "Ent04",
        "Desc_en": "Entertainment tax (amount)",
        "Desc_ar": "ضريبة الملاهى (قطعية)",
        "TaxtypeReference": "T15"
      },
      {
        "Code": "RD03",
        "Desc_en": "Resource development fee (rate)",
        "Desc_ar": "رسم تنميه الموارد (نسبة)",
        "TaxtypeReference": "T16"
      },
      {
        "Code": "RD04",
        "Desc_en": "Resource development fee (amount)",
        "Desc_ar": "رسم تنميه الموارد (قطعية)",
        "TaxtypeReference": "T16"
      },
      {
        "Code": "SC03",
        "Desc_en": "Service charges (rate)",
        "Desc_ar": "رسم خدمة (نسبة)",
        "TaxtypeReference": "T17"
      },
      {
        "Code": "SC04",
        "Desc_en": "Service charges (amount)",
        "Desc_ar": "رسم خدمة (قطعية)",
        "TaxtypeReference": "T17"
      },
      {
        "Code": "Mn03",
        "Desc_en": "Municipality Fees (rate)",
        "Desc_ar": "رسم المحليات (نسبة)",
        "TaxtypeReference": "T18"
      },
      {
        "Code": "Mn04",
        "Desc_en": "Municipality Fees (amount)",
        "Desc_ar": "رسم المحليات (قطعية)",
        "TaxtypeReference": "T18"
      },
      {
        "Code": "MI03",
        "Desc_en": "Medical insurance fee (rate)",
        "Desc_ar": "رسم التامين الصحى (نسبة)",
        "TaxtypeReference": "T19"
      },
      {
        "Code": "MI04",
        "Desc_en": "Medical insurance fee (amount)",
        "Desc_ar": "رسم التامين الصحى (قطعية)",
        "TaxtypeReference": "T19"
      },
      {
        "Code": "OF03",
        "Desc_en": "Other fees (rate)",
        "Desc_ar": "رسوم أخرى (نسبة)",
        "TaxtypeReference": "T20"
      },
      {
        "Code": "OF04",
        "Desc_en": "Other fees (amount)",
        "Desc_ar": "رسوم أخرى (قطعية)",
        "TaxtypeReference": "T20"
      }
    ]

    const taxTypeSubtypes = s.filter(el => el.TaxtypeReference === taxTypeElement.value);

    const subtypeSelect = taxTypeElement.parentNode.parentNode.querySelector('select[name="tax_subtype"]');

    subtypeSelect.innerHTML = '';

    taxTypeSubtypes.forEach(el => {
      subtypeSelect.innerHTML +=
      `
        <option value="${el.Code}">${el.Desc_ar}</option>
      `;
    });
  }

}