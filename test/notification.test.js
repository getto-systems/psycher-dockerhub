const notification_factory = require("../lib/notification");

const deployment_factory = require("../lib/deployment");
const pipeline_factory = require("../lib/pipeline");

const secret_store_factory = require("./infra/secret_store");
const job_store_factory = require("./infra/job_store");

test("trigger push_latest job", async () => {
  const {repository, job_store} = init_repository();

  const notification = notification_factory.init({
    event_info: {
      type: "pushed",
      name: "repo/name",
      tag: "0.0.0",
    },
    repository,
  });

  await notification.trigger_push_latest_job();

  expect(job_store.data).toEqual({
    push_latest: [
      {
        job_token: {
          project_id: "PROJECT-ID",
          token: "TOKEN",
        },
        job_signature: {
          name: "repo/name",
          tag: "0.0.0",
        },
        reply_to: {
          channel: "CHANNEL",
        },
      },
    ],
  });
});

const init_repository = () => {
  const secret_store = secret_store_factory.init({
    job_target_exists: true,
    job_token: {project_id: "PROJECT-ID", token: "TOKEN"},
    destination_channel: "CHANNEL",
  });
  const job_store = job_store_factory.init({
    push_latest_error: null,
  });

  const deployment = deployment_factory.init({
    secret_store,
  });
  const pipeline = pipeline_factory.init({
    secret_store,
    job_store,
  });

  const repository = {
    deployment,
    pipeline,
  };

  return {
    repository,
    job_store,
  };
};
