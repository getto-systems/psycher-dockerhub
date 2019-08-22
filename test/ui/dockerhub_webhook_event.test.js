const dockerhub_webhook_event = require("../../lib/ui/dockerhub_webhook_event");

test("init event_info", async () => {
  const event_info = dockerhub_webhook_event.parse({
    push_data: {
      tag: "0.0.0",
    },
    repository: {
      repo_name: "repo/name",
    },
  });

  expect(event_info).toEqual({
    type: "pushed",
    name: "repo/name",
    tag: "0.0.0",
  });
});

test("empty event", async () => {
  const event_info = dockerhub_webhook_event.parse({
  });

  expect(event_info).toBe(null);
});

test("empty body", async () => {
  const event_info = dockerhub_webhook_event.parse(null);

  expect(event_info).toBe(null);
});
