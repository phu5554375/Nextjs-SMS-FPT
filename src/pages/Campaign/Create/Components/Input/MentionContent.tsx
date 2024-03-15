import { FormattedMessage, useIntl } from '@umijs/max';
import { Form, Mentions, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';

const OverlayMention = ({ string, fileHeaders }: any) => {
  const elements = [];
  let currentPos = 0;

  const fileHeaderRegex = new RegExp(
    fileHeaders.map((header: any) => header.value).join('|'),
    'g',
  );
  const matches = string.matchAll(fileHeaderRegex);

  for (const match of matches) {
    const matchStart = match.index || 0;
    const matchValue = match[0];

    elements.push(string.substring(currentPos, matchStart));
    elements.push(
      <strong className="mentions-item-value" key={matchStart}>
        {matchValue}
      </strong>,
    );

    currentPos = matchStart + matchValue.length;
  }

  elements.push(string.substring(currentPos));

  return <>{elements}</>;
};

const MenstionContent = ({ fileHeaders, form }: any) => {
  const intl = useIntl();

  const [content, setContent] = useState('');

  useEffect(() => {
    form.setFieldValue('content', content);
  }, [content]);

  return (
    <>
      <Form.Item
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        name="content"
        label={
          <FormattedMessage
            id="message.content"
            defaultMessage="Nội dung tin nhắn"
          />
        }
        rules={[{ required: true, min: 3, max: 1000 }]}
      >
        <div className="mb-8">
          <div className="overlay-mention">
            <OverlayMention string={content} fileHeaders={fileHeaders} />
          </div>
          <Mentions
            className="mb-12 border-radius-2px"
            rows={4}
            minLength={3}
            maxLength={1000}
            placeholder={intl.formatMessage({
              id: 'message.content',
              defaultMessage: 'Nội dung tin nhắn',
            })}
            prefix={['']}
            value={content}
            onChange={(value: any) => {
              setContent(value);
            }}
            options={fileHeaders}
          />
          <Space size={1} className="mt-8">
            {fileHeaders.map((values: any, index: any) => (
              <Tag
                color="blue"
                className="pointer mb-8"
                key={index}
                onClick={() => {
                  setContent(preContent => preContent + ' ' + values.value);
                }}
              >
                {values.label}
              </Tag>
            ))}
          </Space>
        </div>
      </Form.Item>
    </>
  );
};

export default MenstionContent;
