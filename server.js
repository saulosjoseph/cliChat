const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Chatkit = require("@pusher/chatkit-server");

const app = express();

const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:f1fb3504-71b3-4e0c-9ef4-b554fcae2f62",
  key: "84ee55f9-4c70-4d02-957b-3294cbbe3068:f+3L3ZGt8j6RK3FlrQ98y1RTQfbJkDE2+B3a5egxAzI="
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post("/users", (req, res) => {
  const { username } = req.body;
  chatkit
    .createUser({
      id: username,
      name: username
    })
    .then(() => {
      console.log(`User created: ${username}`);
      res.sendStatus(201);
    })
    .catch(err => {
      if (err.error === "services/chatkit/user_already_exists") {
        console.log(`User already exists: ${username}`);
        res.sendStatus(200);
      } else {
        res.status(err.status).json(err);
      }
    });
});

app.post("/authenticate", (req, res) => {
  const authData = chatkit.authenticate({ userId: req.query.user_id });
  res.status(authData.status).send(authData.body);
});

const port = 3001;
app.listen(port, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Running on port ${port}`);
  }
});