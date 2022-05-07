const express = require("express");

const app = express();

require("dotenv").config();

const port = process.env.PORT;

const path = require("path");

const bodyParser = require("body-parser");

const session = require("express-session");

const MongoDbStore = require("connect-mongodb-session")(session);

const flash = require("connect-flash");

const lingua = require("lingua");

require("./config/connectDb");

app.set("views", "views");
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "media")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const store = new MongoDbStore({
  uri: process.env.DB_HOST,
  collection: 'session'
})

app.use(session({
  secret: "this is a secret msg",
  cookie: {
    maxAge: 1000 * 60 * 60 * 24// 1 h
  },
  store,
  resave: true,
  saveUninitialized: true
}))

app.use(lingua(app, {
  defaultLocale: 'ar',
  path: __dirname + '/locales',
  storageKey: 'lang',
  cookieOptions: {
    httpOnly: false
  }
}));

app.use(flash());

app.use((req, res, next) => {

  res.locals.currentLanguage = res.lingua.locale;

  res.locals.user = req.session.user;

  res.locals.etaPermission = req.session.accessToken;

  next();
});

/*== client routes ==*/
app.use("/", require("./routes/client/client.routes"));




/*== backend routes ==*/
app.use("/", require("./routes/auth.route"));
app.use("/admin", require("./routes/profile.route"));
app.use("/admin", require("./routes/dashboard.route"));
app.use("/admin", require("./routes/roles.route"));
app.use("/admin", require("./routes/users.route"));
app.use("/admin", require("./routes/categories.route"));

/*== 403 page ==*/
app.use('/not_allowed', (req, res) => {
  res.render('pages/not_allow');
});

/*== 404 page ==*/
app.use('*', (req, res) => {
  res.render('pages/not_found');
});

app.listen(port, _ => {
  console.log(`SERVER ESTABLISH AT PORT ${port}`);
})