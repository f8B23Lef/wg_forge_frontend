let orders, users, companies;

const loadData = async () => {
  [orders, users, companies]  = await Promise.all([
    fetch('/api/orders.json').then(response => response.json()),
    fetch('/api/users.json').then(response => response.json()),
    fetch('/api/companies.json').then(response => response.json()),
  ]);
};

const getInitialOrders = () => orders;

const getInitialUsers = () => users;

const getInitialCompanies = () => companies;

export { loadData, getInitialOrders, getInitialUsers, getInitialCompanies };
