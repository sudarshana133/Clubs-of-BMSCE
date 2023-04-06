const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
// const { sortedIndexOf } = require("lodash");
// hashing
const md5=require("md5");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));//this is for uploading the public css files
app.set("view engine", "ejs");
const uri="mongodb://127.0.0.1:27017/personDB";
mongoose.connect(uri, {
  useNewUrlParser: true,
});

const personSchema = {
  name: String,
  usn: String,
  email: String,
  ph: Number,
  password: String,
  confirmPassword: String,
};

const Person = mongoose.model("Person", personSchema);

const person1 = new Person({
  name: "SVS",
  usn: "1BM21EE016",
  email: "svs.ee21@bmsce.ac.in",
  ph: 1234567890,
  password: "svs016",
  confirmPassword: "svs016",
});
const person2 = new Person({
  name: "MSD",
  usn: "1BM21IS165",
  email: "msd.is21@bmsce.ac.in",
  ph: 0987654321,
  password: "msd165",
  confirmPassword: "msd165",
});

// the links of various parts
app.get("/:links", function (req, res) {
  const requestedUrl = _.lowerCase(req.params.links);
  if (requestedUrl === "index") {
    res.sendFile(__dirname + "/index.html");
  } else if (requestedUrl === "signup") {
    res.sendFile(__dirname + "/Sign_Up.html");
  } else if (requestedUrl === "login") {
    res.sendFile(__dirname + "/login.html");
  } else if (requestedUrl === "clubslist") {
    res.sendFile(__dirname + "/Clubs_list.html");
  } else if (requestedUrl == "login") {
    res.sendFile(__dirname + "/login.html");
  } else if (requestedUrl == "pentagram") {
    res.sendFile(__dirname + "/pentagram.html");
  } else if (requestedUrl == "upgraha") {
    res.sendFile(__dirname + "/upgraha.html");
  } else if (requestedUrl == "pravrutthi") {
    res.sendFile(__dirname + "/pravrutthi.html");
  } else if (requestedUrl == "ninaad") {
    res.sendFile(__dirname + "/ninaad.html");
  } else if (requestedUrl == "augment") {
    res.sendFile(__dirname + "/augment.html");
  } else if (requestedUrl == "fac") {
    res.sendFile(__dirname + "/fac.html");
  } else if (requestedUrl == "chirantana") {
    res.sendFile(__dirname + "/chirantana.html");
  } else if (requestedUrl == "cloneofclubslist") {
    res.sendFile(__dirname + "/clone_of_clubs_list.html");
  }
});

app.post("/profile", async (req, res) => {
  const fname = req.body.fname;
  const usn = req.body.usn;
  const email = req.body.email;
  const ph = req.body.ph;
  const password = md5(req.body.password);
  const confirmPassword = md5(req.body.repassword);

  try {
    const foundPerson = await Person.findOne({ usn });
    if (foundPerson) {
      console.log("USN already exists");
      res.render("user_found",{usnFound:foundPerson.usn})
      return;
    }

    const person = new Person({
      name: fname,
      usn: usn,
      email: email,
      ph: ph,
      password: password,
      confirmPassword: confirmPassword,
    });

    await person.save();
    res.render("pr", {
      firstName: fname,
      USN: usn,
      Email: email,
      phoneNumber: ph,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

app.post("/login", async (req, res) => {
    try {
      const usn = req.body.usn;
      const password = md5(req.body.password);
      const foundPerson = await Person.findOne({ usn });
      if (!foundPerson) {
        console.log("person not found");
        res.render("login",{});
        return;
      }
      if (foundPerson.password === password) {
        res.sendFile(__dirname+"/Clubs_list.html");
      } else {
        console.log("incorrect password");
      }
    } 
    catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  });
  

app.listen(3000, function () {
  console.log("listening on port 3000");
});
