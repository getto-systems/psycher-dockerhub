exports.perform = (slack) => perform(slack);

/**
 * slack : outgoing_messengers/slack
 */
const perform = (slack) => {
  return slack.reply("unknown-push", [
    "どこに push すればいいかわかりません！",
    "push する対象が不明です",
    "（・・・・・・どこに push するんだろう？）",
  ]);
};
