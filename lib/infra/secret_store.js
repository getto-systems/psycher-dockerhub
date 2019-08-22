const memoize = require("getto-memoize");

exports.init = (struct) => init(struct);

/**
 * struct : {
 *   aws_secrets: vendor/aws_secrets
 * }
 *
 * returns {
 *   job_target_exists : async ({name}) => job target
 *   job_token : async ({name}) => job token
 *   destination_channel : async ({name}) => destination channel
 * }
 */
const init = ({aws_secrets}) => {
  const secret = init_secret(aws_secrets);

  /**
   * struct : {
   *   job_signature : notification.job_signature()
   * }
   */
  const job_target_exists = async (struct) => {
    return !!(await job_token(struct));
  };

  /**
   * struct : {
   *   job_signature : notification.job_signature()
   * }
   */
  const job_token = async ({job_signature: {name}}) => {
    const tokens = await gitlab_trigger_tokens();

    if (tokens && tokens[name]) {
      const {project_id, token} = tokens[name];
      if (project_id && token) {
        return {
          project_id,
          token,
        };
      }
    }

    return null;
  };

  /**
   * struct : {
   *   job_signature : notification.job_signature()
   * }
   */
  const destination_channel = async ({job_signature: {name}}) => {
    const channels = await destination_channels();

    if (channels && channels[name]) {
      return channels[name];
    }

    return null;
  };

  const gitlab_trigger_tokens = () => secret.json("gitlab-trigger-tokens");
  const destination_channels = () => secret.json("dockerhub-repository-channels");

  return {
    job_target_exists,
    job_token,
    destination_channel,
  };
};

/**
 * returns {
 *   string : async (key) => get secret string value
 *   json : async (key) => get secret json value
 * }
 */
const init_secret = (aws_secrets) => {
  const memo = memoize.init({
    load: () => aws_secrets.getJSON(),
  });

  const json = (key) => memo.get(key, (data) => JSON.parse(data[key]));

  return {
    json,
  };
};
