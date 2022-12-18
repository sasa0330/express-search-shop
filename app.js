const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const fetch = require("node-fetch");

app.get("/", (req, res) => res.send('Hello'));

// http://localhost:3001/api/shopList
app.get('/api/shopList', (req, res) => {
  const HOTPEPPER_API_KEY = "a6972642ce7d9bcd";
  const HOTPEPPER_BASE_URL = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/";
  const hotpepper_lat = 35.6917517;
  const hotpepper_lng = 139.7720934;
  const hotpepper_genre = "G001";
  const requestUrl = `${HOTPEPPER_BASE_URL}?key=${HOTPEPPER_API_KEY}&lat=${hotpepper_lat}&lng=${hotpepper_lng}&genre=${hotpepper_genre}&format=json`;


  fetch(requestUrl)
    .then((response) => response.json())
    .then((data) => {
      const responseShopList = data.results.shop.map((item) => (
        {
          itemId: item.id,
          photoPcM: item.photo.pc.m,
          shopName: item.name,
          lunch: item.lunch,
          budgetName: item.budget.name,
          address: item.address
        }
      ));
      res.json(responseShopList);
    });
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
