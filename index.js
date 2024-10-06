const express = require("express");
const path = require("path");
const axios = require("axios");
const session = require("express-session");
const pool = require("./dbPool");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));

//------------------------- MIDDLEWARE -----------------------------//

// Generate a random session secret key
const secretKey = crypto.randomBytes(64).toString("hex");

// Configure session middleware
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
  }),
);

// Middleware to set active tab based on route
app.use((req, res, next) => {
  res.locals.activeTab = req.path.substring(1);
  next();
});

//------------------------- ROUTES -----------------------------//

// Home Route
app.get("/", (req, res) => {
  // Check if user is logged in
  const user = req.session.user;

  // Render the index page and pass the user variable
  res.render("index", { user, jobs: "", activeTab: "" });
});

// International Route (Get)
app.get("/international", (req, res) => {
  // Check if user is logged in
  const user = req.session.user;

  // Render the international page and pass both the user and jobs variables
  res.render("international", { user, activeTab: "international" });
});

// National Route
app.get("/national", (req, res) => {
  // Check if user is logged in
  const user = req.session.user;
  res.render("national", { user, activeTab: "national" });
});

// User Login Route (Get)
app.get("/user/login", (req, res) => {
  // Check if a success message should be displayed
  const successMessage =
    req.query.created === "success"
      ? "User created successfully. Please log in."
      : null;

  // User is not logged in, render the login form
  res.render("user/user_login", {
    error: undefined,
    user: null,
    successMessage: successMessage,
  });
});

//User Login Route (Post)
app.post("/user/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.pwd;

  // Check if username and password match a user in the database
  let sql = `SELECT *
             FROM user
             WHERE username = ? AND pwd = ?`;

  let params = [username, password];
  let rows = await executeSQL(sql, params);

  if (rows.length > 0) {
    // User found, store user information in session
    req.session.user = rows[0];
    // Redirect to user info page
    res.redirect("/user/info");
  } else {
    // User not found or incorrect password, handle authentication failure
    res.render("user/user_login", {
      error: "Invalid username or password",
      user: null,
      successMessage: null,
    });
  }
});

// User Info Route
app.get("/user/info", isAuthenticated, (req, res) => {
  // Check if user is logged in
  if (req.session.user) {
    // User is logged in, display user information
    const successMessage =
      req.query.update === "success" ? "User info updated successfully." : null;
    res.render("user/user_info", {
      user: req.session.user,
      successMessage: successMessage,
    });
  } else {
    // User is not logged in, redirect to login page
    res.redirect("/user/login");
  }
});

// User Create Route (Get)
app.get("/user/create", async function (req, res) {
  res.render("user/user_create", {
    user: req.session.user || null,
    error: undefined,
    formData: {},
  });
});

//User Create Route (Post)
app.post("/user/create", async function (req, res) {
  let username = req.body.username;

  // Check if the username exists in the database
  let sqlCheckUsername = "SELECT * FROM user WHERE username = ?";
  let rows = await executeSQL(sqlCheckUsername, [username]);

  if (rows.length > 0) {
    // Username exists, return an error message
    return res.render("user/user_create", {
      error: "Username already exists.",
      user: req.session.user || null,
      formData: req.body,
    });
  }

  let sql = `INSERT INTO user (username, pwd, profession, email, summary, position) VALUES (?, ?, ?, ?, ?, ?)`;

  let params = [
    req.body.username,
    req.body.pwd,
    req.body.profession,
    req.body.email,
    req.body.summary,
    req.body.position,
  ];
  await executeSQL(sql, params);
  res.redirect("/user/login?created=success");
});

// User Edit Route (Get)
app.get("/user/update/:username", isAuthenticated, async function (req, res) {
  let sql = `SELECT *
  FROM user
  WHERE username = ? LIMIT 1`;
  let params = [req.params.username];
  let rows = await executeSQL(sql, params);
  res.render("user/user_edit", { user: rows[0] });
});

// User Edit Route (Post)
app.post("/user/update/:username", isAuthenticated, async function (req, res) {
  const { email, pwd, profession, summary, position } = req.body;
  const username = req.params.username;
  let sql = `UPDATE user SET 
             email = ?, 
             profession = ?, 
             summary = ?, 
             position = ?`;

  let params = [email, profession, summary, position];
  // Update the password only if a new one is provided
  if (pwd && pwd.trim() !== "") {
    sql += `, pwd = ?`;
    params.push(pwd);
  }

  sql += ` WHERE username = ?`;
  params.push(username);

  let rows = await executeSQL(sql, params);

  // Fetch the updated user data from the database
  const updatedUserSql = `SELECT * FROM user WHERE username = ?`;
  const updatedUserData = await executeSQL(updatedUserSql, [username]);
  // Update the user information in the session
  if (updatedUserData.length > 0) {
    req.session.user = updatedUserData[0];
  }
  res.redirect("/user/info?update=success");
});

// User fav route
app.get("/user/fav", isAuthenticated, async function (req, res) {
  const user = req.session.user;

  let sql = `SELECT job_status, username, url, posted_date, location, 
  company, job_title FROM accnt_info 
  NATURAL JOIN user 
  WHERE username LIKE ?`;
  let params = [req.session.user.username];
  let rows = await executeSQL(sql, params);
  console.log(rows.length);

  res.render("user/user_fav", { user, favorites: rows });
});

app.post("/user/fav/add", async function (req, res) {
  let jobTitle = req.body.jobTitle;
  let company = req.body.company;
  let location = req.body.location;
  let postedDate = req.body.postedDate;
  let url = req.body.url;
  let username = req.session.user.username;

  let sql = `INSERT INTO accnt_info (username, url, posted_date, location, company, job_title) VALUES (?, ?, ?, ?, ?, ?)`;
  let params = [username, url, postedDate, location, company, jobTitle];

  //debug
  for (i = 0; i < params.length; i++) {
    console.log(params[i]);
  }

  let x = req.body.x;
  console.log(x);

  let rows = await executeSQL(sql, params);

  res.redirect("/user/fav");
});

// checks if a user is logged in. If not, redirect them to the login page.
function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    // If user is not logged in, redirect to the login page
    return res.redirect("/user/login");
  }
  next();
}

// User Logout Route
app.get("/user/logout", (req, res) => {
  // Clear the user session
  req.session.destroy();

  // Redirect to the login page or any other appropriate page
  res.redirect("/user/login");
});

//------------------------- FUNCTIONS -----------------------------//

async function executeSQL(sql, params) {
  return new Promise(function (resolve, reject) {
    pool.query(sql, params, function (err, rows, fields) {
      if (err) throw err;
      resolve(rows);
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
