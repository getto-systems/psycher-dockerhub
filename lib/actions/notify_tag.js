exports.perform = (slack) => perform(slack);

/**
 * slack : outgoing_messengers/slack
 */
const perform = (slack) => {
  return slack.notify("tag");
};
