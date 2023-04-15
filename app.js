const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const cors = require("cors");
const fetch = require("node-fetch");
const origins = [
  "http://localhost:3000",
  "https://sasa30.com",
  "https://classy-pika-716c48.netlify.app",
];
app.use(
  cors({
    origin: origins, //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200, //レスポンスstatusを200に設定
  })
);

app.get("/", (req, res) => res.send("Hello"));

// http://localhost:3001/api/shopList
app.get("/api/shopList", (req, res) => {
  const HOTPEPPER_API_KEY = "a6972642ce7d9bcd";
  const HOTPEPPER_BASE_URL =
    "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/";
  /**
   * 第一引数の値が空かどうかを判別します。
   * 結果によってreturnの値が変わります。
   * @param {*} checkValue - 空をチェックしたい値
   * @param {*} returnValue - 空ではなかった時に返したい値
   * @returns - 空だった場合は""、空ではなかった場合はreturnValue
   */
  const checkBrank = (checkValue, returnValue) => {
    if (checkValue) {
      return returnValue;
    } else {
      return "";
    }
  };
  const reqLat = req.query.lat;
  const reqLng = req.query.lng;
  const reqGenre = req.query.genre;
  const setParamLat = checkBrank(reqLat, `&lat=${reqLat}`);
  const setParamLng = checkBrank(reqLng, `&lng=${reqLng}`);
  const setParamGenre = checkBrank(reqGenre, `&genre=${reqGenre}`);

  const requestUrl = `${HOTPEPPER_BASE_URL}?key=${HOTPEPPER_API_KEY}&${setParamLat}&${setParamLng}&${setParamGenre}&format=json`;

  if (!setParamLat || !setParamLng) {
    res.json("パラメーターの指定が不足しています。");
  }
  console.log(requestUrl);
  fetch(requestUrl)
    .then((response) => response.json())
    .then((data) => {
      const responseShopList = data.results.shop.map((item) => ({
        itemId: item.id,
        photo: item.photo.pc.l,
        shopName: item.name,
        lunch: item.lunch,
        budgetName: item.budget.name,
        address: item.address,
        access: item.access,
        smoking: item.non_smoking,
      }));
      res.json(responseShopList);
    });
});

app.get("/api/shopListFromGoogle", (req, res) => {
  const baseUrl =
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
  const apiKey = "AIzaSyA4obQYITBIkcLQ8jZWsabjl8zQtvOxwMg";
  const lat = 35.7778212;
  const lng = 139.7215721;
  const types = "restaurant";
  //types
  //https://developers.google.com/maps/documentation/places/web-service/supported_types?hl=ja
  const requestUrl = `${baseUrl}location=${lat},${lng}&radius=250&types=${types}&language=ja&key=${apiKey}`;

  fetch(requestUrl)
    .then((response) => response.json())
    .then((data) => {
      const responseShopList = data.results.map((item) => ({
        itemName: item.name,
      }));
      console.log(data);
      //maps.googleapis.com/maps/api/place/details/output?place_id=ChIJmy5MyOKSGGARC4WwDu1e9u8
      https: res.json(responseShopList);
    });
});
app.get("/api/shopDetailFromGoogle", (req, res) => {
  const baseUrl = "https://maps.googleapis.com/maps/api/place/details/json?";
  const apiKey = "AIzaSyA4obQYITBIkcLQ8jZWsabjl8zQtvOxwMg";
  const fields = `name%2Crating%2Cformatted_phone_number`;
  const place_id = `ChIJmy5MyOKSGGARC4WwDu1e9u8`;
  //types
  //https://developers.google.com/maps/documentation/places/web-service/supported_types?hl=ja
  const requestUrl = `${baseUrl}fields=${fields}&place_id=${place_id}&key=${apiKey}`;

  fetch(requestUrl)
    .then((response) => response.json())
    .then((data) => {
      // const responseShopList = data.results.map((item) => ({
      //   itemName: item.name,
      // }));
      console.log(data);
      //maps.googleapis.com/maps/api/place/details/output?place_id=ChIJmy5MyOKSGGARC4WwDu1e9u8
      https: res.json(data);
    });
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
