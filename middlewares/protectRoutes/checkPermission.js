module.exports = {
  checkAuthPermission: (permission => {
    return (req, res, next) => {
      const userPermissions = req.session.user.permissions;
      if (userPermissions.length) {
        if (!req.session.user.permissions.includes(permission)) {
          return res.redirect('/not_allowed')
        }
      }
      next();
    }
  }),
}