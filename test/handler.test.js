const slack_messenger = require("../lib/outgoing_messengers/slack");
const gitlab_messenger = require("../lib/outgoing_messengers/gitlab");

const slack_request = require("./outgoing_messengers/requests/slack");
const gitlab_request = require("./outgoing_messengers/requests/gitlab");

const slack_secret = require("../lib/secrets/slack");
const gitlab_secret = require("../lib/secrets/gitlab");

const dockerhub_webhook_event = require("../lib/dockerhub_webhook_event");
const handler = require("../lib/handler");

test("push latest", async () => {
  const mock = init_mock();

  await init_handler(mock, {
    repository: "repo/name",
    tag: "latest",
    is_trusted: false,
  }).handle_event();

  expect(mock.slack.data.reply.length).toBe(1);
  expect(mock.slack.data.reply[0]).toBe("tag");

  expect(mock.gitlab.data.trigger.length).toBe(1);
  expect(mock.gitlab.data.trigger[0]).toBe("push-latest");
});

test("only notify tag", async () => {
  const mock = init_mock();

  await init_handler(mock, {
    repository: "repo/name",
    tag: "latest",
    is_trusted: true,
  }).handle_event();

  expect(mock.slack.data.reply.length).toBe(1);
  expect(mock.slack.data.reply[0]).toBe("tag");

  expect(mock.gitlab.data.trigger.length).toBe(0);
});

test("unknown push", async () => {
  const mock = init_mock();

  await init_unknown_handler(mock, {
    repository: "repo/unknown",
    tag: "latest",
    is_trusted: false,
  }).handle_event();

  expect(mock.slack.data.reply.length).toBe(2);
  expect(mock.slack.data.reply[0]).toBe("tag");
  expect(mock.slack.data.reply[1]).toBe("unknown-push");

  expect(mock.gitlab.data.trigger.length).toBe(0);
});

test("unknown notify", async () => {
  const mock = init_mock();

  await init_handler(mock, {
    repository: "repo/unknown",
    tag: "latest",
    is_trusted: false,
  }).handle_event();

  expect(mock.slack.data.reply.length).toBe(0);
  expect(mock.gitlab.data.trigger.length).toBe(0);
});

const init_handler = (mock, event_info) => {
  const raw_slack_secret = {
    bot_token: "SLACK_BOT_TOKEN",
    repository_channels: {
      "repo/name": "CHANNEL",
    },
  };
  const raw_gitlab_secret = {
    trigger_tokens: {
      "repo/name": { project_id: "ELM_PROJECT_ID", token: "ELM_TOKEN" },
    },
  };
  const secret = {
    slack: slack_secret.prepare(raw_slack_secret),
    gitlab: gitlab_secret.prepare(raw_gitlab_secret),
  };

  const webhook_event = dockerhub_webhook_event.init({
    event_info,
    secret,
  });

  const messenger = {
    slack: slack_messenger.prepare(mock.slack),
    gitlab: gitlab_messenger.prepare(mock.gitlab),
  };

  return handler.init({webhook_event, messenger});
};

const init_unknown_handler = (mock, event_info) => {
  const raw_slack_secret = {
    bot_token: "SLACK_BOT_TOKEN",
    repository_channels: {
      "repo/unknown": "CHANNEL",
    },
  };
  const raw_gitlab_secret = {
    trigger_tokens: {
      "repo/name": { project_id: "ELM_PROJECT_ID", token: "ELM_TOKEN" },
    },
  };
  const secret = {
    slack: slack_secret.prepare(raw_slack_secret),
    gitlab: gitlab_secret.prepare(raw_gitlab_secret),
  };

  const webhook_event = dockerhub_webhook_event.init({
    event_info,
    secret,
  });

  const messenger = {
    slack: slack_messenger.prepare(mock.slack),
    gitlab: gitlab_messenger.prepare(mock.gitlab),
  };

  return handler.init({webhook_event, messenger});
};

const init_mock = () => {
  const slack = slack_request.init();
  const gitlab = gitlab_request.init();

  return {
    slack,
    gitlab,
  };
};
