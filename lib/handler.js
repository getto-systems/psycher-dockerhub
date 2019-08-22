const action_names = [
  "pushed",
];

exports.action_names = () => action_names;

exports.detect_actions = (struct) => detect_actions(struct);
exports.perform = (actions) => perform(actions);

/**
 * struct : {
 *   type : event type
 *   i18n
 *   notification
 * }
 *
 * returns actions
 */
const detect_actions = ({type, i18n, notification}) => {
  if (!action_names.includes(type)) {
    throw "unknown event type: " + type;
  }

  return require("./actions/" + type).init({
    i18n: i18n[type],
    notification,
  });
};

/**
 * actions
 */
const perform = async (actions) => {
  for(let i in actions) {
    const action = actions[i];
    if (await action.condition.matches()) {
      return action.perform();
    }
  }

  return null;
};
