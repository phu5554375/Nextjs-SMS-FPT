import { DoubleLeftOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Form, Space, Select } from 'antd';
import { memo, useEffect, useState } from 'react';

export const CursorPagination = ({ cursor, onCursorChange, onSelectPage, onFirstDefault }: any) => {
  const [form] = Form.useForm();
  const [params, setParams] = useState<any>({});
  const [prevToken, setPrevToken] = useState<any>({});
  const [nextToken, setNextToken] = useState<any>({});
  const [preview, setPreview] = useState(1);

  useEffect(() => {
    form.submit();
  }, [params]);

  const onPrevPage = async () => {
    try {
      const newParams = {
        cursor: cursor?.prev,
      };
      let param_cursor = '';
      if (newParams?.cursor.length > 0) {
        setPreview(preview - 1)
        param_cursor = prevToken;
        setParams(param_cursor);
        onCursorChange(newParams);
        setPrevToken(newParams);
      }
    } catch (error) { }
  };

  const onNextPage = () => {
    try {
      const newParams = {
        cursor: cursor?.next,
      };
      let param_cursor = '';
      if (newParams?.cursor.length > 0) {
        setPreview(preview + 1)
        param_cursor = nextToken;
        setParams(param_cursor);
        onCursorChange(newParams);
        setNextToken(newParams);
      }
    } catch (error) {
    }
  };
  const onChangeSelect = async (e: any) => {
    onSelectPage(e)
    onFirstDefault()
    setPreview(1)
  };

  const onFirst = async (e: any) => {
    onFirstDefault(e);
    setPreview(1)
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Space direction="horizontal" size="small">
        <Button
          type="text"
          disabled={cursor?.prev === null ? true : false}
          style={{ padding: '4px 6px' }}
          onClick={(e) => onFirst(e)}>
          <DoubleLeftOutlined style={{ fontSize: '12px' }} />
        </Button>
        <Button
          type="text"
          name="prevToken"
          style={{ padding: '4px 6px' }}
          disabled={cursor?.prev === null ? true : false}
          onClick={() => onPrevPage()}>
          <LeftOutlined style={{ fontSize: '12px' }} />
        </Button>
        <Button
          name="preview"
          size='small'>
          {preview}
        </Button>
        <Button
          name="nextToken"
          type="text"
          style={{ padding: '4px 6px' }}
          disabled={cursor?.next === null ? true : false}
          onClick={() => onNextPage()}>
          <RightOutlined style={{ fontSize: '12px' }} />
        </Button>

        <Select
          defaultValue="10/ page"
          onSelect={(e) => onChangeSelect(e)}
          size='small'
          options={[
            { label: '10/ page', value: '10' },
            { label: '20/ page', value: '20' },
            { label: '50/ page', value: '50' },
            { label: '100/ page', value: '100' },

          ]}
        />
      </Space>




    </div>
  );
};
export default memo(CursorPagination);