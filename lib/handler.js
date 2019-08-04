const actions = {
  notify_tag: require("./actions/notify_tag"),
  push_latest: require("./actions/push_latest"),
  unknown_push: require("./actions/unknown_push"),
};

exports.init = (struct) => init(struct);

/**
 * struct : {
 *   webhook_event : dockerhub_webhook_event
 *   messenger : {
 *     slack: prepared outgoing_messengers/slack
 *     gitlab: prepared outgoing_messengers/gitlab
 *   }
 * }
 */
const init = ({webhook_event, messenger}) => {
  const handle_event = () => {
    let results = [
      notify_tag(),
    ];

    if (webhook_event.is_not_trusted()) {
      results.push(push_latest());
    }

    return Promise.all(results);
  };

  const notify_tag = () => {
    const slack_secret = webhook_event.slack_secret();
    if (slack_secret) {
      return actions.notify_tag.perform(slack_messenger(slack_secret));
    }
  };

  const push_latest = () => {
    const gitlab_secret = webhook_event.gitlab_secret();
    if (gitlab_secret) {
      return actions.push_latest.perform(gitlab_messenger(gitlab_secret));
    } else {
      const slack_secret = webhook_event.slack_secret();
      if (slack_secret) {
        return actions.unknown_push.perform(slack_messenger(slack_secret));
      }
    }
  };


  const slack_messenger = (secret) => {
    return messenger.slack.init(secret);
  };
  const gitlab_messenger = (secret) => {
    return messenger.gitlab.init(secret);
  };


  return {
    handle_event,
  };
};
