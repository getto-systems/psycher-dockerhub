const handler = require("../../lib/handler");

const notification_factory = require("../../lib/notification");

const destination_factory = require("../../lib/destination");
const deployment_factory = require("../../lib/deployment");
const pipeline_factory = require("../../lib/pipeline");

const secret_store_factory = require("../infra/secret_store");
const job_store_factory = require("../infra/job_store");

const i18n_factory = require("../i18n");

test("push_latest", async () => {
  const {notification, i18n, job_store} = init_notification({
    job_target_exists: true,
    job_token: {project_id: "PROJECT-ID", token: "TOKEN"},
    destination_channel: "CHANNEL",
    push_latest_error: null,
    tag: "0.0.0",
  });

  await handler.perform(handler.detect_actions({
    type: "pushed",
    i18n,
    notification,
  }));

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

test("push_latest error", async () => {
  const {notification, i18n, job_store} = init_notification({
    job_target_exists: true,
    job_token: {project_id: "PROJECT-ID", token: "TOKEN"},
    destination_channel: "CHANNEL",
    push_latest_error: "push latest error",
    tag: "0.0.0",
  });

  await expect(handler.perform(handler.detect_actions({
    type: "pushed",
    i18n,
    notification,
  }))).rejects.toBe("push latest error");
});

test("push_latest target not found", async () => {
  const {notification, i18n, job_store} = init_notification({
    job_target_exists: false,
    job_token: null,
    destination_channel: "CHANNEL",
    push_latest_error: null,
    tag: "0.0.0",
  });

  await handler.perform(handler.detect_actions({
    type: "pushed",
    i18n,
    notification,
  }));

  expect(job_store.data).toEqual({
    push_latest: [],
  });
});

test("destination channel not found", async () => {
  const {notification, i18n, job_store} = init_notification({
    job_target_exists: true,
    job_token: {project_id: "PROJECT-ID", token: "TOKEN"},
    destination_channel: null,
    push_latest_error: null,
    tag: "0.0.0",
  });

  await handler.perform(handler.detect_actions({
    type: "pushed",
    i18n,
    notification,
  }));

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
          channel: null,
        },
      },
    ],
  });
});

test("ignore tag pushed", async () => {
  const {notification, i18n, job_store} = init_notification({
    job_target_exists: true,
    job_token: {project_id: "PROJECT-ID", token: "TOKEN"},
    destination_channel: "CHANNEL",
    push_latest_error: null,
    tag: "latest",
  });

  await handler.perform(handler.detect_actions({
    type: "pushed",
    i18n,
    notification,
  }));

  expect(job_store.data).toEqual({
    push_latest: [],
  });
});

const init_notification = ({job_target_exists, job_token, destination_channel, push_latest_error, tag}) => {
  const {repository, job_store} = init_repository({
    job_target_exists,
    job_token,
    destination_channel,
    push_latest_error,
  });

  const notification = notification_factory.init({
    event_info: {
      name: "repo/name",
      tag,
    },
    repository,
  });

  const i18n = i18n_factory.init();

  return {
    notification,
    i18n,
    job_store,
  };
};

const init_repository = ({job_target_exists, job_token, destination_channel, push_latest_error}) => {
  const secret_store = secret_store_factory.init({
    job_target_exists,
    job_token,
    destination_channel,
  });
  const job_store = job_store_factory.init({
    push_latest_error,
  });

  const destination = destination_factory.init({
    secret_store,
  });
  const deployment = deployment_factory.init({
    secret_store,
  });
  const pipeline = pipeline_factory.init({
    secret_store,
    job_store,
  });

  const repository = {
    destination,
    deployment,
    pipeline,
  };

  return {
    repository,
    job_store,
  };
};
