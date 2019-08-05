exports.perform = (slack, struct) => perform(slack, struct);

/**
 * slack : outgoing_messengers/slack
 * struct : {
 *   image: build image name
 * }
 */
const perform = (slack, {image}) => {
  return slack.reply("tag", [
    image + " が push されました",
    "おわったよ！" + image,
    "ふう、" + image + "をビルドしたよ",
  ]);
};
