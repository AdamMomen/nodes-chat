const users = require("../controllers/users");
const Friend = require("../controllers/Friends");
const Pending = require("../controllers/Pending");
const Chatroom = require("../controllers/chatrooms");
const messages = require("../controllers/messages");

function findUser(req, res) {
  var username = req.body.username;
  users
    .finduser(username)
    .then(data => {
      if (data.rowCount > 0) {
        res.send(username);
      } else {
        res.status(400).send();
      }
    })
    .catch(err => {
      res.send("error");
    });
}

function getAllFriends(req, res) {
  var username = req.body.username;
  Friend.Check(username)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send(err);
    });
}

function getAllRequests(req, res) {
  var username = req.body.username;
  Pending.Fetch(username)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send("opps! something went wrong");
    });
}

function sendRequest(req, res) {
  var requester = req.body.requester;
  var target = req.body.target;
  Pending.Send(requester, target)
    .then(data => {
      res.send("success");
    })
    .catch(err => {
      res.send("friend request was sent");
    });
}

function approveRequest(req, res) {
  var requester = req.body.requester;
  var target = req.body.target;
  Pending.DeleteFromPending(requester, target)
    .then(data => {
      if (data.rowCount > 0) {
        Friend.Make(requester, target)
          .then(data => {
            Chatroom.Create(requester, target)
              .then(data => {
                console.log("new room created");
                res.send("accepted");
              })
              .catch(err => {
                console.log(err);
                res.send(err);
              });
          })
          .catch(err => {
            console.log(err);
            res.send("you are friends already");
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.send("nigga something happend like very bad thing");
    });
}

function rejectRequest(req, res) {
  var requester = req.body.requester;
  var target = req.body.target;
  Pending.DeleteFromPending(requester, target).then(data => {
    res.send("Deleted");
  });
}

function getChat(req, res) {
  var user1 = req.body.user1;
  var user2 = req.body.user2;
  Chatroom.getroomId(user1, user2).then(data => {
    if (data.rowCount > 0) {
      var id = data.rows[0].idno;
      messages
        .Fetch(id)
        .then(data => {
          res.send({ id, messages: data.rows });
        })
        .catch(err => {
          res.send(err);
        });
    } else {
      res.send({ error: "no messages", messages: [] })
    }
  });
}

module.exports = {
  findUser,
  getAllFriends,
  getAllRequests,
  sendRequest,
  approveRequest,
  rejectRequest,
  getChat
};