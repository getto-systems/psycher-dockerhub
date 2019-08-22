exports.init = (struct) => init(struct);

/**
 * struct : {
 *   secret_store: infra/secret_store
 *   job_store: infra/job_store
 * }
 *
 * returns {
 *   push_latest: (job, target) => trigger push_latest job
 * }
 */
const init = ({secret_store, job_store}) => {
  /**
   * job_signature : notification.job_signature()
   * reply_to : notification.reply_to()
   * target : push_target target
   */
  const push_latest = async ({job_signature, reply_to, target}) => {
    const job_token = await secret_store.job_token({job_signature, target});
    if (!job_token) {
      throw "job token not found";
    }

    return job_store.push_latest({
      job_token,
      job_signature,
      reply_to,
    });
  };

  return {
    push_latest,
  };
};
