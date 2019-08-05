exports.prepare = (secret) => prepare(secret);

/**
 * secret : {
 *   bot_token: slack bot token
 *   repository_channels: {
 *     "repo/name": "CHANNEL",
 *   }
 * }
 * struct : {
 *   repository: build repository
 *   tag: build tag
 * }
 *
 * returns {
 *   channel,
 *   image,
 *   bot_token,
 * }
 */
const prepare = (secret) => {
  const init = ({repository, tag}) => {
    if (!repository || !tag) {
      throw "invalid struct";
    }

    const channel = secret.repository_channels[repository];
    if (!channel) {
      return null;
    }

    const image = repository + ":" + tag;
    const bot_token = secret.bot_token;

    return {
      channel,
      image,
      bot_token,
    };
  };

  return {
    init,
  };
};
