exports.perform = (slack, struct) => perform(slack, struct);

/**
 * slack : outgoing_messengers/slack
 * struct : {
 *   image: build image name
 *   is_trusted: build image trusted
 * }
 */
const perform = (slack, {image, is_trusted}) => {
  const message = image + trusted_message(is_trusted);

  return slack.reply("tag", message);
};

const trusted_message = (is_trusted) => {
  if (is_trusted) {
    return "(trusted)";
  } else {
    return "(raw build)";
  }
};
