const fetch = require("node-fetch");

exports.reply = (info, secret, message) => notify(info, secret, message);
exports.notify = (info, secret) => notify(info, secret);

/**
 * info : request type (string)
 * secret : {
 *   channel: slack channel
 *   bot_token: slack bot token
 * }
 */
const reply = (info, {channel, bot_token}, text) => {
  console.log("slack reply : " + info);
  return request("/api/chat.postMessage", bot_token, {
    channel,
    text,
  });
};

/**
 * info : request type (string)
 * secret : {
 *   channel: slack channel
 *   image: build image name
 *   bot_token: slack bot token
 * }
 */
const notify = (info, {channel, image, bot_token}) => {
  console.log("slack reply : " + info);
  return request("/api/chat.postMessage", bot_token, {
    channel,
    text: image,
  });
};

const request = async (path, bot_token, data) => {
  const url = "https://slack.com" + path;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + bot_token,
    },
    body: JSON.stringify(data),
  });

  console.log("response code: " + response.status);
};
