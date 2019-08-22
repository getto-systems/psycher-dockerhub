const specification = require("getto-specification");

exports.init = (struct) => init(struct);

/**
 * struct : {
 *   has_push_latest_target_and : (conditions) => check notification has push_latest target
 *   tag_not_matches_any : (tags) => check notification tag not matches any tags
 * }
 */
const init = (notification) => {
  const spec = specification.init();

  const has_push_latest_target_and = (conditions) => {
    return spec.all([has_push_latest_target].concat(conditions));
  };

  const tag_matches_some = (tags) => {
    return spec.init(() => {
      return notification.tag_matches_some(tags);
    });
  };

  const has_push_latest_target = spec.init(() => {
    return notification.has_push_latest_target();
  });

  return {
    has_push_latest_target_and,
    tag_not_matches_any: (words) => spec.not(tag_matches_some(words)),
  };
};
