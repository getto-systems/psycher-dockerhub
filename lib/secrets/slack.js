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
 *   is_trusted: is trusted image
 * }
 *
 * returns {
 *   channel,
 *   image,
 *   bot_token,
 * }
 */
const prepare = (secret) => {
  const init = ({repository, tag, is_trusted}) => {
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
      is_trusted,
      bot_token,
    };
  };

  return {
    init,
  };
};
