exports.init = (data) => init(data);

/**
 * data : {
 *   job_target_exists: check job target exists
 *   job_token: job token
 *   destination_channel: destination channel
 * }
 *
 * returns infra/secret_store
 */
const init = ({job_target_exists, job_token, destination_channel}) => {
  return {
    job_target_exists: async () => job_target_exists,
    job_token: async () => job_token,
    destination_channel: async () => destination_channel,
  };
};
