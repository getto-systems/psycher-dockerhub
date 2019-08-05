exports.prepare = (request) => prepare(request);

/**
 * request : outgoing_messengers/requests/slack
 * secret : secrets/slack
 *
 * returns {
 *   reply: (info, messages) => reply random message
 * }
 */
const prepare = (request) => {
  const init = (secret) => {
    /**
     * info : request type (string)
     * messages : reply message list
     */
    const reply = (info, messages) => {
      const index = Math.floor(Math.random() * messages.length);
      const message = messages[index];

      return request.reply(info, secret, message);
    };

    return {
      reply,
    };
  }

  return {
    init,
  };
};
