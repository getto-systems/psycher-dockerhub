exports.init = (struct) => init(struct);

/**
 * struct : {
 *   event_info: {
 *     repository: repository name ('user/repo')
 *     tag: build image tag
 *     is_trusted: trusted image
 *   },
 *   secret : {
 *     slack: secrets/slack
 *     gitlab: secrets/gitlab
 *   },
 * }
 *
 * returns {
 *   is_not_trusted() => check not trusted image
 *
 *   slack_secret() => init slack secret
 *   gitlab_secret() => init gitlab secret
 * }
 */
const init = ({event_info, secret}) => {
  const repository = event_info.repository;
  const tag = event_info.tag;
  const is_trusted = event_info.is_trusted;

  const is_not_trusted = () => {
    return !is_trusted;
  };

  const slack_secret = () => {
    return secret.slack.init({
      repository,
      tag,
    });
  };

  const gitlab_secret = () => {
    return secret.gitlab.init({
      repository,
      tag,
    });
  };

  return {
    is_not_trusted,

    slack_secret,
    gitlab_secret,
  };
};
