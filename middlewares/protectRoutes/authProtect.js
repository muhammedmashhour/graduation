
module.exports = {
  isNotAuth: (req, res, next) => {
    const user = req.session.user || {};
    if (!user.userId) {
      return res.redirect('/login');
    }
    next();
  },
  isAuth: (req, res, next) => {
    const user = req.session.user || {};
    if (user.userId) {
      return res.redirect('/')
    }
    next();
  }
}