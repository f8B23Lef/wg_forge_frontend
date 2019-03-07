const searchOrders = (inputStr, orders, users) => {
  const searchFields = [
    'transaction_id',
    'total',
    'card_type',
    'order_country',
    'order_ip'
  ];

  const filteredOrders = [];

  orders.forEach(order => {
    searchFields.forEach(searchField => {
      if (order[searchField].toLowerCase().indexOf(inputStr) !== -1) {
        filteredOrders.push(order);
      }
    });

    const user = users.find(user => user.id === order.user_id);

    if (user.first_name.toLowerCase().indexOf(inputStr) !== -1 || user.last_name.toLowerCase().indexOf(inputStr) !== -1) {
      filteredOrders.push(order);
    }
  });

  return filteredOrders;
};

export default searchOrders;
