// npm install cors
// node api

const port = 3333;

const express = require("express");
let app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());

const data = [
  {
    id: 0,
    name: "lead1",
    price: 100,
    page: 1,
    closest_task_at: null,
  },
  {
    id: 1,
    name: "lead2",
    price: 200,
    page: 1,
    closest_task_at: 1727365246974,
  },
  {
    id: 2,
    name: "lead3",
    price: 300,
    page: 1,
    closest_task_at: 1727251246974,
  },
  {
    id: 3,
    name: "lead4",
    price: 400,
    page: 2,
    closest_task_at: 1727308800000,
  },
  {
    id: 4,
    name: "lead5",
    price: 500,
    page: 2,
    closest_task_at: 1727254246974,
  },
  {
    id: 5,
    name: "lead6",
    price: 600,
    page: 2,
    closest_task_at: 1727395200000,
  },
  {
    id: 6,
    name: "lead7",
    price: 700,
    page: 3,
    closest_task_at: 1727395200000,
  },
  {
    id: 7,
    name: "lead8",
    price: 700,
    page: 3,
    closest_task_at: 1727554246974,
  },
];

app.get("/search", function (req, res, next) {
  setTimeout(() => {
    const page = req.query.page;
    const id = req.query.id;
    if (page) {
      console.log("GET API CALLED ?page=", page);
      const filtred = data.filter((lead) =>
        page ? lead.page === +page : true
      );
      res.json(filtred);
      next();
    }
    if (id) {
      console.log("GET API CALLED ?id=", id);
      const filtred = data.filter((lead) => (id ? lead.id === +id : true));
      res.json(filtred);
      next();
    }
  }, 500);
});

app.post("/form_handler/post", function (req, res, next) {
  console.log("POST API CALLED ", req.body);
  if (req.body) res.send("ok");
  next();
});

app.put("/form_handler/put", function (req, res, next) {
  console.log("PUT API CALLED ", req.body);
  if (req.body) res.send("ok");
  next();
});

app.delete("/form_handler/delete", function (req, res, next) {
  console.log("DELETE API CALLED ", req.body);
  if (req.body) res.send("ok");
  next();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
