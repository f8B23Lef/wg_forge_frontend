import orders from '../data/orders.json';
import users from '../data/users.json';

import './app.css';

const formDate = (dateUnix) => {
  let date = new Date(Number(dateUnix)).toLocaleString('en-US').split('/');
  [date[1], date[0]] = [date[0], date[1]]

  return date.join('/');
};

const formCardNumber = (cardNumber) => {
 return cardNumber.replace(/([\d]{2})(\d+)([\d]{4})/, (all, begin, middle, end) => {
    return begin.concat(('*').repeat(middle.length), end);
    });
};

const formUserInfo = (userId) => {
  const user = users.find(el => el.id === userId);
  const fullName = user.first_name.concat(' ', user.last_name);

  return user.gender === 'Male' ? 'Mr.'.concat(' ', fullName): 'Ms.'.concat(' ', fullName);
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
    table += `
    <tr id="order_${orders[i].id}">
      <td>${orders[i].transaction_id}</td>
      <td class="user_data"><a href="#">${formUserInfo(orders[i].user_id)}</a></td>
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
    document.getElementById("app").innerHTML = `<section>${renderTable()}</section>`;
}());
