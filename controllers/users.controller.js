const Users = require("../models/Users.model");
const Roles = require("../models/Roles.model");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const getUsers = async (req, res) => {
  const users = await Users.find();
  res.render("pages/users", {
    page_name: "users",
    users,
    successMsg: req.flash("successMsg")
  });
};

const getCreateUser = async (req, res) => {
  const roles = await Roles.find();
  res.render("pages/users/create", {
    page_name: "users",
    validationErrors: req.flash('validationErrors'),
    roles
  });
};

const postCreateUser = async (req, res) => {
  // handle validation errors if exists
  if (!validationResult(req).isEmpty()) {
    req.flash("validationErrors", validationResult(req).array());
    return res.redirect('/admin/users/create');
  }


  try {

    if (req.body.password !== req.body.confirm_password) {
      req.flash("validationErrors", [{"msg": "password and confirm password don't match!"}]);
      return res.redirect('/admin/users/create');
    }

    const checkEmail = await Users.findOne({email: req.body.email.toLowerCase()});

    if (checkEmail) {
      req.flash("validationErrors", [{"msg": "this user is already exists!"}]);
      return res.redirect('/admin/users/create');
    }
    const newRecord = new Users({
      ...req.body,
      email: req.body.email.toLowerCase()
    });

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) return res.end("error in enc");
      newRecord.password = hashedPassword;
      newRecord.confirm_password = hashedPassword;

      newRecord.save()
      .then(async () => {
        req.flash('successMsg', `${res.lingua.content.general.item_created}`);
        res.redirect('/admin/users');

        // jwt.sign(
          // { id: newRecord._id.toString() },
          // process.env.JWT_SECRET,
          // {
          //   expiresIn: '1h'
          // },
          // async (err, encoded) => {
          // if (err) {
          //   console.log(err);
          //   return res.end("error")
          // }

          // let transporter = nodemailer.createTransport({
          //   service: 'gmail',
          //   // host: "smtp.ethereal.email",
          //   port: 587,
          //   secure: false,
          //   auth: {
          //     user: 'coafaq02@gmail.com',
          //     pass: 'mM011123456',
          //   },
          //   tls: {
          //     rejectUnauthorized: false
          //   }
          // })

          // await transporter.sendMail({
          //   from: 'coafaq02@gmail.com',
          //   to: newRecord.email,
          //   subject: `confirm ${newRecord.username}`,
          //   text: 'activate',
          //   html: `
          //     <div style="background-color: white; border: 1px solid #ccc; padding: 1rem;">
          //       <div style="background-color: #cddc39; padding: 1rem; margin: 1rem 0; text-transform: uppercase">
          //         <span style="font-weight: bold">Hint</span> verification will end after <span style="color: #f44336"; font-weight: bold>1h</span>
          //       </div>
          //       <h4 style="text-transform: capitalize;">click on the link below to confirm your account!</h4>
          //       ${req.headers.host}/confirm/${encoded}
          //     </div>
          //   `,
          // });
          // req.flash('successMsg', `${res.lingua.content.general.item_created}`);
          // res.redirect('/admin/users');
        // });
      })
      .catch(err => {
        res.end("err");
      })

    })
    
  }
  catch(e) {
    console.log(e);
    res.end("there is an error")
  }
};

const getUpdateUser = async (req, res) => {
  try {
    const roles = await Roles.find();
    const userData = await Users.findOne({_id: req.params.userId});
    res.render("pages/users/update", {
      page_name: "users",
      roles,
      userData,
      validationErrors: req.flash('validationErrors')
    });
  }
  catch(e) {
    res.end("there is an error!");
  }
};

const postUpdateUser = (req, res) => {
  // handle validation errors if exists
  if (!validationResult(req).isEmpty()) {
    req.flash("validationErrors", validationResult(req).array());
    return res.redirect(`/admin/users/${req.params.userId}/update`);
  }

  try {
    Users.findByIdAndUpdate(
      req.params.userId,
      {
        updated_at: Date.now(),
        ...req.body
      }
    )
    .then(_ => {
      req.flash("successMsg", `${res.lingua.content.general.item_updated}`);
      res.redirect("/admin/users");
    })
    .catch(err => {
      res.end("something went wrong");
    })
  }
  catch(e) {
    res.end("there is an error!");
  }
};

const getDeleteUser = (req, res) => {
  res.render("pages/users/delete", {
    page_name: "users",
  });
};

const postDeleteUser = async (req, res) => {
  try {

    const userData = await Users.findOne({_id: req.params.userId});
    userData.delete()
    .then(_ => {
      req.flash("successMsg", `${res.lingua.content.general.item_deleted}`);
      res.redirect("/admin/users");
    })
    .catch(err => {
      res.end("something went wrong");
    })
  }
  catch(e) {
    res.end("something went wrong");
  }
};

const getChangePassword = (req, res) => {
  res.render("pages/users/change_password", {
    page_name: "users",
    validationErrors: req.flash("validationErrors")
  })
};

const postChangePassword = (req, res) => {
  // handle validation errors if exists
  if (!validationResult(req).isEmpty()) {
    req.flash("validationErrors", validationResult(req).array());
    return res.redirect(`/admin/users/${req.params.userId}/change_password`);
  }

  if (req.body.new_password !== req.body.confirm_new_password) {
    req.flash("validationErrors", [{'msg': 'passwords don"t match'}]);
    return res.redirect(`/admin/users/${req.params.userId}/change_password`);
  }

  try {
    bcrypt.hash(req.body.new_password, 10, (err, hashedPassword) => {
      if (err) return res.end("error");
      Users.findByIdAndUpdate(
        req.params.userId,
        {
          updated_at: Date.now(),
          password: hashedPassword,
          confirm_password: hashedPassword
        }
      )
      .then(_ => {
        req.flash("successMsg", `${res.lingua.content.general.item_updated}`);
        res.redirect("/admin/users");
      })
      .catch(err => {
        res.end("something went wrong");
      })
    })
  }
  catch(e) {
    res.end("there is an error!");
  }
};

module.exports = {
  getUsers,
  getCreateUser,
  postCreateUser,
  getUpdateUser,
  postUpdateUser,
  getDeleteUser,
  postDeleteUser,
  getChangePassword,
  postChangePassword
}