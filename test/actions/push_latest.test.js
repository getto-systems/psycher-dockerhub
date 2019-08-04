const gitlab_messenger = require("../../lib/outgoing_messengers/gitlab");
const gitlab_request = require("../outgoing_messengers/requests/gitlab");

const push_latest = require("../../lib/actions/push_latest");

test("push latest", async () => {
  const gitlab_request_mock = gitlab_request.init();

  const gitlab = gitlab_messenger.prepare(gitlab_request_mock).init({
    project_id: "PROJECT_ID",
    trigger_token: "TRIGGER_TOKEN",
  });

  push_latest.perform(gitlab);

  expect(gitlab_request_mock.data.trigger.length).toBe(1);
  expect(gitlab_request_mock.data.trigger[0]).toBe("push-latest");
});
