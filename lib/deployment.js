exports.init = (struct) => init(struct);

/**
 * struct : {
 *   secret_store: infra/secret_store
 * }
 *
 * returns {
 *   target_exists: (job_signature) => check push_latest target exists
 * }
 */
const init = ({secret_store}) => {
  /**
   * job_signature : notification.job_signature()
   */
  const target_exists = (job_signature) => {
    return secret_store.job_target_exists(job_signature);
  };

  return {
    target_exists,
  };
};
