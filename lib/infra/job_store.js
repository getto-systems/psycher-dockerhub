exports.init = (struct) => init(struct);

/**
 * struct : {
 *   gitlab_api: vendor/gitlab_api
 * }
 *
 * returns {
 *   push_latest : async (struct) => trigger gitlab push_latest pipeline
 * }
 */
const init = ({gitlab_api}) => {
  /**
   * struct : {
   *   job_token: secret_store.job_token()
   *   job_signature: notification.job_signature()
   *   reply_to: notification.reply_to()
   * }
   */
  const push_latest = async ({job_token: {project_id, token}, job_signature: {tag}, reply_to: {channel}}) => {
    const ref = "master";
    const variables = {
      PUSH_LATEST: "true",
      tag,
      channel,
    };

    const response = await gitlab_api.trigger({
      project_id,
      token,
      ref,
      variables,
    });
    console.log(response.status);
  };

  return {
    push_latest,
  };
};
