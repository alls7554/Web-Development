const { RSA_PKCS1_OAEP_PADDING } = require('constants');
const redis = require("redis");
const redis_client = redis.createClient({});
const { promisify } = require("util");
const getAsync = promisify(redis_client.hgetall).bind(redis_client);


redis_client.on("error", function (err) {
  console.log("redis client error", err);
});

let key = "";
let idx = 0;

exports.saveLog = (obj) => {
  key = "Rooms"+idx++;

  const tmpData = {
    rs : JSON.stringify(obj.roomStatus),
    msg : JSON.stringify(obj.msg),
    pL : JSON.stringify(obj.play_log),
    uL : JSON.stringify(obj.user),
    tL : JSON.stringify(obj.time_log)
  }
  redis_client.hmset(key, tmpData);

  console.log("Log Data Stored!");
  save(tmpData);
}

exports.saveGame = (obj) => {
  key = obj.sessionIdx;
  const tmpData = {
    arr : JSON.stringify(obj.arr),
    arr2 : JSON.stringify(obj.arr2)
  }
  redis_client.hmset(key, tmpData);
  console.log("Game Data Stored!");
};

exports.updateGame = (obj) => {
  key = obj.sessionIdx;
  tmpData = {
    arr2 : JSON.stringify(obj.arr)
  }
  redis_client.hmset(key, tmpData);
  console.log("Update Game Data");
}

exports.loadTable = async (id) => {
  const tempData = await getAsync(id);
  const gameData = JSON.parse(tempData.arr);

  return gameData;
}

exports.loadGame = async(id) => {
  const tempData = await getAsync(id);
  const gameData = JSON.parse(tempData.arr2);

  return gameData;
}