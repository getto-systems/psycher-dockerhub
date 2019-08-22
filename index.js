"use strict";

const dockerhub_webhook_event = require("./lib/ui/dockerhub_webhook_event");
const notification_factory = require("./lib/notification");
const handler = require("./lib/handler");

const repository = {
  destination: require("./lib/destination"),
  deployment: require("./lib/deployment"),
  pipeline: require("./lib/pipeline"),
};

const infra = {
  secret_store: require("./lib/infra/secret_store"),
  job_store: require("./lib/infra/job_store"),
};

const vendor = {
  aws_secrets: require("getto-aws_secrets"),
  gitlab_api: require("getto-gitlab_api"),
};

const i18n_factory = require("./lib/i18n");

exports.handler = async (aws_lambda_event) => {
  // logging event object for debug real-world event
  console.log(aws_lambda_event);

  const body = parse_json(aws_lambda_event.body);
  const event_info = dockerhub_webhook_event.parse(body);
  if (event_info) {
    await handle(event_info);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "OK",
    }),
  };
};

const handle = (event_info) => {
  const repository = init_repository();
  const notification = notification_factory.init({
    event_info,
    repository,
  });
  const i18n = i18n_factory.init("ja");

  const actions = handler.detect_actions({
    type: event_info.type,
    i18n,
    notification,
  });

  return handler.perform(actions);
};

const init_repository = () => {
  const secret_store = infra.secret_store.init({
    aws_secrets: vendor.aws_secrets.init({
      region: process.env.REGION,
      secret_id: process.env.SECRET_ID,
    }),
  });
  const job_store = infra.job_store.init({
    gitlab_api: vendor.gitlab_api.init(),
  });

  const destination = repository.destination.init({
    secret_store,
  });
  const deployment = repository.deployment.init({
    secret_store,
  });
  const pipeline = repository.pipeline.init({
    secret_store,
    job_store,
  });

  return {
    destination,
    deployment,
    pipeline,
  };
};

const parse_json = (raw) => {
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      // ignore parse error
    }
  }
  return null;
};
