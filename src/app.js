import orders from '../data/orders.json';
import users from '../data/users.json';
import companies from '../data/companies.json';

import './app.css';

const formDate = (dateUnix) => {
  const dateTime = new Date(Number(dateUnix));
  const date = dateTime.toLocaleDateString('en-GB');
  const time = dateTime.toLocaleTimeString('en-GB');
  
  return date.concat(' ', time);
};

const formCardNumber = (cardNumber) => {
 return cardNumber.replace(/([\d]{2})(\d+)([\d]{4})/, (all, begin, middle, end) => {
    return begin.concat(('*').repeat(middle.length), end);
    });
};

const getUser = (userId) => {
  return users.find(el => el.id === userId);
};

const formUserFullName = (firstName, lastName, gender) => {
  const fullName = firstName.concat(' ', lastName);

  return gender === 'Male' ? 'Mr.'.concat(' ', fullName): 'Ms.'.concat(' ', fullName);
};

const formUserBirthday = (birthday) => {
  return new Date(Number(birthday)).toLocaleDateString('en-GB');
};

const getCompany = (companyId) => {
  return companies.find(el => el.id === companyId);
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
      companyInfo += `<p>Company: <a href="${company.url}" target=_blank>${company.title}</a></p>`;
    } else {
      companyInfo += `<p>Company: ${company.title}</p>`;
    }
    companyInfo += `<p>Industry: ${company.industry} / ${company.sector}</p>`;
  }

  return birthday.concat(avatar, companyInfo);
};

const renderTable = () => {
  let table = `
  <table>
    <thead>
      <tr>
        <th>Transaction ID</th>
        <th>User Info</th>
        <th>Order Date</th>
        <th>Order Amount</th>
        <th>Card Number</th>
        <th>Card Type</th>
        <th>Location</th>
      </tr>
    </thead>
  <tbody>`;

  for (let i = 0; i < orders.length; i += 1) {
    const user = getUser(orders[i].user_id);
    const company = getCompany(user.company_id);

    table += `
    <tr id="order_${orders[i].id}">
      <td>${orders[i].transaction_id}</td>
      <td class="user-data">
        <a class="user-name" href="#">${formUserFullName(user.first_name, user.last_name, user.gender)}</a>
        <div class="user-details hidding">
          ${formUserDetailsBlock(user, company)}
        </div>
      </td>
      <td>${formDate(orders[i].created_at)}</td>
      <td>$${orders[i].total}</td>
      <td>${formCardNumber(orders[i].card_number)}</td>
      <td>${orders[i].card_type}</td>
      <td>${orders[i].order_country} (${orders[i].order_ip})</td>
    </tr>`;
  }

  table += `
    </tbody>
  </table>`;

  return table;
};

export default (function () {
  document.getElementById("app").innerHTML = renderTable();

  document.querySelectorAll('a.user-name').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      link.nextElementSibling.classList.toggle('hidding');
    });
  });
}());

//q.match(/^\$([\d,.]+)/);
