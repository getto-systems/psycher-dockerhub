const dockerhub_webhook_event = require("../lib/dockerhub_webhook_event");

const slack_secret = require("../lib/secrets/slack");
const gitlab_secret = require("../lib/secrets/gitlab");

test("is_trigger_required", () => {
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
  const event_info = {
    repository: "repo/name",
    tag: "latest",
    is_trusted: true,
  };
  const secret = {
    slack: slack_secret.prepare(raw_slack_secret),
    gitlab: gitlab_secret.prepare(raw_gitlab_secret),
  };

  const webhook_event = dockerhub_webhook_event.init({
    event_info,
    secret,
  });

  expect(webhook_event.is_trigger_required()).toBe(false);
});

test("secrets", () => {
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
  const event_info = {
    repository: "repo/name",
    tag: "latest",
    is_trusted: true,
  };
  const secret = {
    slack: slack_secret.prepare(raw_slack_secret),
    gitlab: gitlab_secret.prepare(raw_gitlab_secret),
  };

  const webhook_event = dockerhub_webhook_event.init({
    event_info,
    secret,
  });

  const slack_secret_value = webhook_event.slack_secret();
  const gitlab_secret_value = webhook_event.gitlab_secret();

  expect(slack_secret_value.channel).toBe("CHANNEL");
  expect(slack_secret_value.image).toBe("repo/name:latest");
  expect(slack_secret_value.bot_token).toBe("SLACK_BOT_TOKEN");

  expect(gitlab_secret_value.project_id).toBe("ELM_PROJECT_ID");
  expect(gitlab_secret_value.trigger_token).toBe("ELM_TOKEN");
});
