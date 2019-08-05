exports.perform = (slack, struct) => perform(slack, struct);

/**
 * slack : outgoing_messengers/slack
 * struct : {
 *   image: build image name
 *   is_trusted: build image trusted
 * }
 */
const perform = (slack, {image, is_trusted}) => {
  const image_description = image + trusted_message(is_trusted);

  return slack.reply("tag", [
    image_description + " が push されました",
    "おわったよ！" + image_description,
    "ふう、" + image_description + "をビルドしたよ",
  ]);
};

const trusted_message = (is_trusted) => {
  if (is_trusted) {
    return "(trusted)";
  } else {
    return "(raw build)";
  }
};
