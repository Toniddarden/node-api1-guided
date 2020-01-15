const express = require("express");
const db = require("./data/hubs-model");

const server = express();

server.listen(4000, () => {
  console.log("*** listening on port 4000");
});

// global middleware section
server.use(express.json());

/* 
GET  https://my.host.example.com/my/path/to/some/resource?parameters-list?this&
DELETE  https://my.host.example.com/my/path/to/some/resource?parameters-list?this& 
PUT  https://my.host.example.com/my/path/to/some/resource?parameters-list?this& 
POSTT  https://my.host.example.com/my/path/to/some/resource?parameters-list?this& 
 */

// normally req, res = request, response OR the homies (LS slang)

server.get("/", (req, res) => {
  res.send("hello world!");
});

server.get("/date", (req, res) => {
  res.send(new Date().toISOString());
});

// CRUD
// C- create-POST
// R - read-GET
// U - updating-PUT
// D - deleting-DELETE

// -------------------------------------------------------------------------------------
// Retrieve info from the db
// -------------------------------------------------------------------------------------
server.get("/hubs", (req, res) => {
  db.find()
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(err => {
      res.status(500).json({ success: false, err });
    });
});
// -------------------------------------------------------------------------------------
// add a record to the db
// -------------------------------------------------------------------------------------
server.post("/hubs", (req, res) => {
  const hubInfo = req.body;

  db.add(hubInfo)
    .then(hub => {
      res.status(201).json({ success: true, hub });
    })
    .catch(err => {
      res.status(500).json({ success: false, err });
    });
});
// -------------------------------------------------------------------------------------
// deleting records
// -------------------------------------------------------------------------------------
server.delete("/hubs/:id", (req, res) => {
  const { id } = req.params;

  db.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(404).json({ success: false, message: "id not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ success: false, err });
    });
});
// -------------------------------------------------------------------------------------
// modify a record
// -------------------------------------------------------------------------------------
server.put("/hubs/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db.update(id, changes)
    .then(updated => {
      if (updated) {
        res.status(200).json({ success: true, updated });
      } else {
        res.status(404).json({ success: false, message: "id not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ success: false, err });
    });
});
