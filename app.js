const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');
const fetch = require("node-fetch");

app.use(cors({
  origin: 'http://localhost:3000', //アクセス許可するオリジン
  credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
  optionsSuccessStatus: 200 //レスポンスstatusを200に設定
}))

app.get("/", (req, res) => res.send('Hello'));

// http://localhost:3001/api/shopList
app.get('/api/shopList', (req, res) => {
  const HOTPEPPER_API_KEY = "a6972642ce7d9bcd";
  const HOTPEPPER_BASE_URL = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/";
  const hotpepper_lat = req.query.lat;
  const hotpepper_lng = req.query.lng;
  const hotpepper_genre = req.query.shopGenre;
  const requestUrl = `${HOTPEPPER_BASE_URL}?key=${HOTPEPPER_API_KEY}&lat=${hotpepper_lat}&lng=${hotpepper_lng}&genre=${hotpepper_genre}&format=json`;

  if (!hotpepper_lat || !hotpepper_lng || !hotpepper_genre) {
    res.json("パラメーターの指定が不足しています。");
  }

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
