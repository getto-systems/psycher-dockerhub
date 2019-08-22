exports.init = (struct) => init(struct);

/**
 * struct : {
 *   job_signature : notification.job_signature
 *   repository: {
 *     destination
 *     deployment
 *     pipeline
 *   }
 * }
 *
 * returns {
 *   has_push_latest_target : () => check push_latest target detected
 *   trigger_push_latest_job : () => trigger push_latest job
 * }
 */
const init = ({job_signature, repository: {destination, deployment, pipeline}}) => {
  const has_push_latest_target = () => {
    return deployment.target_exists({job_signature});
  };

  const trigger_push_latest_job = async () => {
    const channel = await destination.channel({job_signature});
    const reply_to = {
      channel,
    };

    return pipeline.push_latest({
      job_signature,
      reply_to,
    });
  };

  return {
    has_push_latest_target,
    trigger_push_latest_job,
  };
};
