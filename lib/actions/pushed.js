exports.init = (struct) => init(struct);

/**
 * struct : {
 *   i18n
 *   notification
 * }
 */
const init = ({i18n, notification}) => {
  const condition = notification.condition;

  const trigger_push_latest = {
    condition: condition.has_push_latest_target_and([
      condition.tag_not_matches_any(i18n.push_latest.ignore_tags),
    ]),
    perform: () => notification.trigger_push_latest_job(),
  };

  return [
    trigger_push_latest,
  ];
};
