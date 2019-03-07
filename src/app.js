import initialOrders from '../data/orders.json';
import initialUsers from '../data/users.json';
import initialCompanies from '../data/companies.json';

import { formDate, formCardNumber, formUserFullName, formUserBirthday, formMoney } from './utils/formData';
import { isElementExist, removeChildren } from './utils/helpers';
import { singleSort, doubleSort } from './utils/sorts';
import * as statistics from './utils/statistics';
import searchOrders from './utils/search';

import './app.css';

let orders = [...initialOrders];
let users = [...initialUsers];
let companies = [...initialCompanies];

const sortInf = {
  'transaction': {
    'fields': [
      {'key': 'transaction_id', 'type': 'string'}, 
    ],
    'dependency': null,
  },
  'user': {
    'fields': [
      {'key': 'first_name', 'type': 'string'},
      {'key': 'last_name', 'type': 'string'},
    ],
    'dependency': {'arr': users, 'key': 'user_id'},
  },
  'amount': {
    'fields': [
      {'key': 'total', 'type': 'number'}, 
    ],
    'dependency': null,
  },
  'card': {
    'fields': [
      {'key': 'card_type', 'type': 'string'}, 
    ],
    'dependency': null,
  },
  'location': {
    'fields': [
      {'key': 'order_country', 'type': 'string'},
      {'key': 'order_ip', 'type': 'string'},
    ],
    'dependency': null,
  },
};

let sortedColumn = null;

const renderBlankTableWithHeaders = () => {
  let table = `
    <table>
      <thead>
        <tr>
          <th><label for="search">Search:</label></th>
          <th colspan="6"><input type="text" id="search" autofocus autocomplete="off"></th>
        </tr>
        <tr>
          <th data-sort="transaction">Transaction ID</th>
          <th data-sort="user">User Info</th>
          <th>Order Date</th>
          <th data-sort="amount">Order Amount</th>
          <th>Card Number</th>
          <th data-sort="card" >Card Type</th>
          <th data-sort="location">Location</th>
        </tr>
      </thead>
    </table>`;

  document.querySelector("#app").insertAdjacentHTML('afterbegin', table);
};

const formUserDetailsBlock = (user, company) => {
  const birthday = user.birthday
    ? `<p>Birthday: ${formUserBirthday(user.birthday)}</p>`
    : '';

  const avatar = user.avatar 
    ? `<p><img src="${user.avatar}" alt="user avatar" width="100px"></p>`
    : '';

  let companyInfo = '';
  if (company) {
    if (company.url) {
      companyInfo += `<p>Company: <a class="link" href="${company.url}" target=_blank>${company.title}</a></p>`;
    } else {
      companyInfo += `<p>Company: ${company.title}</p>`;
    }
    companyInfo += `<p>Industry: ${company.industry} / ${company.sector}</p>`;
  }

  return birthday.concat(avatar, companyInfo);
};

const prepareTableBody = () => {
  if (isElementExist('tbody')) {
    removeChildren(document.querySelector('tbody'));
  } else {
    document.querySelector('thead').insertAdjacentHTML('afterend', '<tbody></tbody>');
  }
};

const getUser = (userId) => {
  return users.find(el => el.id === userId);
};

const getCompany = (companyId) => {
  return companies.find(el => el.id === companyId);
};

const renderTableBody = () => {
  let tableBody = '';

  if (!orders.length) {
    tableBody += `
    <tr>
      <td class="message" colspan="7">Nothing found</td>
    </tr>
    `;
  } else {
    for (let i = 0; i < orders.length; i += 1) {
      const user = getUser(orders[i].user_id);
      const company = getCompany(user.company_id);

      tableBody += `
        <tr id="order_${orders[i].id}">
          <td>${orders[i].transaction_id}</td>
          <td class="user-data">
            <a class="user-name link" href="#">${formUserFullName(user.first_name, user.last_name, user.gender)}</a>
            <div class="user-details hidding">
              ${formUserDetailsBlock(user, company)}
            </div>
          </td>
          <td>${formDate(orders[i].created_at)}</td>
          <td>${formMoney(orders[i].total)}</td>
          <td>${formCardNumber(orders[i].card_number)}</td>
          <td>${orders[i].card_type}</td>
          <td>${orders[i].order_country} (${orders[i].order_ip})</td>
        </tr>`;
    }
  }

  document.querySelector('tbody').insertAdjacentHTML('afterbegin', tableBody);
};

const renderTableContent = () => {
  prepareTableBody();
  renderTableBody();
  setLinkListener();
};

const renderTableFooter = () => {
  if (isElementExist('tfoot')) {
    removeChildren(document.querySelector('tfoot'));
  } else {
    document.querySelector('tbody').insertAdjacentHTML('afterend', '<tfoot></tfoot>');
  }

  const numberMergedCells = 6;

  let tableFooter = `
      <tr>
        <td colspan=${numberMergedCells}>Orders Count:</td>
        <td>${orders.length ? statistics.calculateOrdersCount(orders) : 'n/a'}</td>
      </tr>
      <tr>
        <td colspan=${numberMergedCells}>Orders Total:</td>
        <td>${orders.length ? formMoney(statistics.calculateOrdersTotal(orders)) : 'n/a'}</td>
      </tr>
      <tr>
        <td colspan=${numberMergedCells}>Median Value:</td>
        <td>${orders.length ? formMoney(statistics.calculateOrdersMedian(orders)) : 'n/a'}</td>
      </tr>
      <tr>
        <td colspan=${numberMergedCells}>Average Check:</td>
        <td>${orders.length ? formMoney(statistics.calculateOrdersAverage(orders)) : 'n/a'}</td>
      </tr>
      <tr>
        <td colspan=${numberMergedCells}>Average Check (Female):</td>
        <td>${orders.length ? formMoney(statistics.calculateFemaleAverageOrders(orders, users)) : 'n/a'}</td>
      </tr>
      <tr>
        <td colspan=${numberMergedCells}>Average Check (Male):</td>
        <td>${orders.length ? formMoney(statistics.calculateMaleAverageOrders(orders, users)) : 'n/a'}</td>
      </tr>
  `;

  document.querySelector('tfoot').insertAdjacentHTML('afterbegin', tableFooter);
};

const renderTable = () => {
  renderBlankTableWithHeaders();
  renderTableContent();
  renderTableFooter();
};

const renderSortIcon = (element) => {
  const headers = [...document.querySelectorAll('th')];

  headers.forEach((header) => {
    const sortIconIndex = header.innerHTML.indexOf(' <span>'); // /\s*<span>\&\#8595\;<\/span>/g

    if (sortIconIndex !== -1) {
      header.innerHTML = header.innerHTML.slice(0, sortIconIndex);
    }
  });

  element.innerHTML += ' <span>&#8595;</span>';
};

const sortDependences = (fields, dependency) => {
  if (fields.length === 1) {
    singleSort(dependency.arr, fields[0]);
  } else {
    doubleSort(dependency.arr, fields[0], fields[1]);
  }

  const sorted = [];

  dependency['arr'].forEach(dep => {
    orders.forEach(order => {
      if (order[dependency.key] === dep.id) {
        sorted.push(order);
      };
    });
    
  });

  orders = [...sorted];
};

const sortOrders = (fields) => {
  if (fields.length === 1) {
    singleSort(orders, fields[0])
  } else {
    doubleSort(orders, fields[0], fields[1]);
  }
};

const sortTableContent = (sortData) => {
  if (sortData.dependency) {
    sortDependences(sortData.fields, sortData.dependency);
  } else {
    sortOrders(sortData.fields);
  }
};

const inputSearch = (inputStr) => {
  orders = [...searchOrders(inputStr, initialOrders, users)];

  if (sortedColumn) {
    sortTableContent(sortedColumn);
  }

  renderTableContent();
  renderTableFooter();
};

const setSearchInputListener = () => {
  document.querySelector('#search').addEventListener('change', (e) => {
    const searchStr = e.target.value.trim();

    if (searchStr) {
      inputSearch((e.target.value).toLowerCase());
    } 
    else {
      orders = [...initialOrders];

      if (sortedColumn) {
        sortTableContent(sortedColumn);
      }
    
      renderTableContent();
      renderTableFooter();
    }
  });
};

const setLinkListener = () => {
  document.querySelectorAll('a.user-name').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      link.nextElementSibling.classList.toggle('hidding');
    });
  });
};

const setTableHeaderListener = () => {
  document.querySelector('thead').addEventListener('click', (e) => {
    const headerEl = e.target;

    if (headerEl.tagName != 'TH' || !headerEl.dataset.sort || sortedColumn === sortInf[headerEl.dataset.sort]) {
      return;
    }

    sortedColumn = sortInf[headerEl.dataset.sort];
    sortTableContent(sortInf[headerEl.dataset.sort]);
    renderSortIcon(headerEl);
    renderTableContent();
  });
};

const setListeners = () => {
  setSearchInputListener();
  setTableHeaderListener();
};

export default (function () {
  renderTable();
  setListeners();
}());
