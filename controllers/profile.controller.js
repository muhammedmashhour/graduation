const Users = require('../models/Users.model');

const getProfile = (req, res) => {
  res.render('pages/profile', {
    page_name: 'profile',
  });
}

const getUpdatePassword = (req, res) => {
  res.render('pages/profile/update_password', {
    page_name: 'profile',
  });
}

const postUpdatePassword = (req, res) => {
  res.end('done');
}

const getUpdateInfo = (req, res) => {
  res.render('pages/profile/update_information', {
    page_name: 'profile',
  });
}


const postUpdateInfo = async (req, res) => {
  try {
    const user = await Users.findOne({_id: req.session.user.userId});
    Users.findByIdAndUpdate(
      user._id,
      req.body
    ).then(_ => {
      res.redirect('/logout');
    })
    .catch(err => {
      console.log(err);
      res.end('there is an err!')
    });
  }
  catch(e) {
    console.log(e);
    res.end('error');
  }
}


module.exports = {
  getProfile,
  getUpdatePassword,
  postUpdatePassword,
  getUpdateInfo,
  postUpdateInfo
}