type MessagesOptions = {
  redirectReplyMessageOptions: {
    id_user: string;
    id_channel: string;
  };
};

export const messages = {
  redirectReplyMessage: (
    options: MessagesOptions['redirectReplyMessageOptions']
  ) =>
    `Hello <@${options.id_user}>! Please use the <#${options.id_channel}> channel for questions. You will find it easier to get answers there!`,
};
