import React from 'react';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';

const Message = ({ message }) => {
  const { i18n } = useTranslation();
  filter.loadDictionary(i18n.resolvedLanguage);
  const { body, username, id } = message;

  return (
    <div key={id} className="text-break mb-2">
      <b>{username}</b>
      :&nbsp;
      {filter.clean(`${body}`)}
    </div>
  );
};

export default Message;
