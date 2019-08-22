exports.init = (struct) => init(struct);

/**
 * struct : {
 *   secret_store: infra/secret_store
 * }
 *
 * returns {
 *   channel: (job_signature) => find destination channel
 * }
 */
const init = ({secret_store}) => {
  /**
   * struct : {
   *   job_signature : notification.job_signature()
   * }
   */
  const channel = ({job_signature}) => {
    return secret_store.destination_channel(job_signature);
  };

  return {
    channel,
  };
};
