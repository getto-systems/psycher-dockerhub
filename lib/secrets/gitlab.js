exports.prepare = (secret) => prepare(secret);

/**
 * secret : {
 *   trigger_tokens: {
 *     "repo/name": { project_id: "PROJECT_ID", token: "TOKEN" }
 *   }
 * }
 * struct : {
 *   repository: build repository name
 * }
 *
 * returns {
 *   project_id,
 *   trigger_token,
 * }
 */
const prepare = (secret) => {
  const init = ({repository}) => {
    const info = secret.trigger_tokens[repository];
    if (!info) {
      return null;
    }

    const {project_id, token} = info;
    if (!project_id || !token) {
      return null;
    }

    const trigger_token = token;

    return {
      project_id,
      trigger_token,
    };
  };

  return {
    init,
  };
};
