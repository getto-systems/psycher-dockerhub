const slack_messenger = require("../../lib/outgoing_messengers/slack");
const slack_request = require("../outgoing_messengers/requests/slack");

const unknown_push = require("../../lib/actions/unknown_push");

test("unknown push", async () => {
  const slack_request_mock = slack_request.init();
  const slack = slack_messenger.prepare(slack_request_mock).init({
    channel: "CHANNEL",
    image: "repo/name:latest",
    bot_token: "SLACK_BOT_TOKEN",
  });

  unknown_push.perform(slack);

  expect(slack_request_mock.data.reply.length).toBe(1);
  expect(slack_request_mock.data.reply[0]).toBe("unknown-push");

  expect(slack_request_mock.data.notify.length).toBe(0);
});
