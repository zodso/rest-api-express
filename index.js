var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
const port = process.env.PORT || 8080;

var dbfile = __dirname + "/" + "cart.json";
var data = {
  items: []
};

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function checkDBExist(dbName, baseContent) {
  fs.open(dbName, "r", function (err) {
    if (err) {
      fs.writeFile(dbName, "", function (err) {
        if (err) {
          console.log(err);
        }
        fs.writeFileSync(dbfile, JSON.stringify(baseContent));
        console.log("Database created!");
      });
    } else {
      console.log("Database exists!");
    }
  });
}

app.get("/getItems", function (req, res) {
  fs.readFile(dbfile, "utf8", function (err, json) {
    var response = {
      status: null,
      body: []
    };

    data = JSON.parse(json, true);

    if (data.items.length > 0) {
      response.status = 200;
      response.body = data.items;
    } else {
      response.status = 204;
      response.body = "no item added";
    }

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(response));
  });
});

app.post("/addItem", function (req, res) {
  fs.readFile(dbfile, "utf8", function (err, json) {
    var response = {
      status: 200,
      body: []
    };
    if (json) {
      data = JSON.parse(json, true);
    }

    var item = {
      id: req.body.id,
      name: req.body.name,
      price: req.body.price
    };

    if (item.id && item.name && item.price) {
      data.items.push(item);
      fs.writeFileSync(dbfile, JSON.stringify(data));
      response.status = 200;
      response.body = "items in cart " + data.items.length;
    } else {
      response.status = 422;
      response.body = "unable to insert item in cart: required fields missing!";
    }
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(response));
  });
});

app.listen(port, function () {
  checkDBExist(dbfile, data);
  console.log("Example app listening at http://localhost:" + port);
});
