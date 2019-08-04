exports.perform = (slack) => perform(slack);

/**
 * gitlab : outgoing_messengers/gitlab
 */
const perform = (gitlab) => {
  return gitlab.trigger("push-latest");
};
