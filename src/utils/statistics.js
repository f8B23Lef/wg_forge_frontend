const calculateOrdersCount = (orders) => {
  return orders.length;
};

const calculateOrdersTotal = (orders) => {
  return orders
    .map(order => Number(order.total))
    .reduce((acc, cur) => acc + cur).toFixed(3);
};

const calculateOrdersMedian = (orders) => {
  const totals = orders.map(order => Number(order.total));
  totals.sort((a, b) => a - b);

  if (totals.length % 2 === 0) {
    const prevHalf = totals[totals.length / 2 - 1];
    const nextHalf = totals[totals.length / 2];

    return ((prevHalf + nextHalf) / 2).toFixed(3);
  } else {
    return (totals[Math.floor(totals.length / 2)]).toFixed(3);
  }
};

const calculateOrdersAverage = (orders) => {
  return (calculateOrdersTotal(orders) / calculateOrdersCount(orders)).toFixed(3); 
};

const calculateMaleAverageOrders = (orders, users) => {
  const maleUsers = users.filter(user => user.gender === 'Male');
  const maleOrders = [];

  orders.forEach(order => {
    maleUsers.forEach(user => {
      if (order.user_id === user.id) {
        maleOrders.push(order);
      }
    });
  });

  return maleOrders.length ? calculateOrdersAverage(maleOrders) : 0;
};

const calculateFemaleAverageOrders = (orders, users) => {
  const femaleUsers = users.filter(user => user.gender === 'Female');
  const femaleOrders = [];
  
  orders.forEach(order => {
    femaleUsers.forEach(user => {
      if (order.user_id === user.id) {
        femaleOrders.push(order);
      }
    });
  });

  return femaleOrders.length ? calculateOrdersAverage(femaleOrders) : 0;
};

export { 
  calculateOrdersCount,
  calculateOrdersTotal,
  calculateOrdersMedian,
  calculateOrdersAverage,
  calculateMaleAverageOrders,
  calculateFemaleAverageOrders
};
