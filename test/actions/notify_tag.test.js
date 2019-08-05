const slack_messenger = require("../../lib/outgoing_messengers/slack");
const slack_request = require("../outgoing_messengers/requests/slack");

const notify_tag = require("../../lib/actions/notify_tag");

test("notify tag", async () => {
  const slack_request_mock = slack_request.init();
  const slack = slack_messenger.prepare(slack_request_mock).init({
    channel: "CHANNEL",
    image: "repo/name:latest",
    bot_token: "SLACK_BOT_TOKEN",
  });

  notify_tag.perform(slack, {
    image: "IMAGE",
    is_trusted: true,
  });

  expect(slack_request_mock.data.reply.length).toBe(1);
  expect(slack_request_mock.data.reply[0]).toBe("tag");
});
