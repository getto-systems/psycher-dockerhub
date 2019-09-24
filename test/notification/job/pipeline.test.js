const pipeline_factory = require("../../../lib/notification/job/pipeline");

const secret_store_factory = require("../../infra/secret_store");
const job_store_factory = require("../../infra/job_store");

test("push_latest", async () => {
  const {pipeline, job_store} = init_pipeline({
    job_token: {project_id: "PROJECT-ID", token: "TOKEN"},
  });

  await pipeline.push_latest({
    job_signature: {
      name: "repo/name",
      tag: "0.0.0",
    },
    reply_to: {
      channel: "CHANNEL",
    },
  });

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

test("job token not found", async () => {
  const {pipeline, job_store} = init_pipeline({
    job_token: null,
  });

  await expect(pipeline.push_latest({
    job_signature: {
      name: "repo/name",
      tag: "0.0.0",
    },
    reply_to: {
      channel: "CHANNEL",
    },
  })).rejects.toBe("job token not found");
});

const init_pipeline = ({job_token}) => {
  const job_store = job_store_factory.init({
    push_latest_error: null,
  });

  const pipeline = pipeline_factory.init({
    secret_store: secret_store_factory.init({
      job_token,
    }),
    job_store,
  });

  return {
    pipeline,
    job_store,
  };
};
