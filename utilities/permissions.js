const permissions = [
  {
    page_name: 'settings',
    permissions: ['read', 'update']
  },
  {
    page_name: 'roles',
    permissions: ['read', 'create', 'update', 'delete']
  },
  {
    page_name: 'users',
    permissions: ['read', 'create', 'update', 'delete']
  },
];
module.exports = permissions;
