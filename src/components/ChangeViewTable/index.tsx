import { Radio } from 'antd';
import { useEffect, useState } from 'react';

const ChangeViewTable = ({ onSelectionChange }: any) => {
  const [checkbox, setCheckbox] = useState('list');
  const [newCheckbox, setNewCheckbox] = useState('list');

  const handleClick = () => {
    if (newCheckbox === 'group') {
      setNewCheckbox('list');
    } else {
      setNewCheckbox('group');
    }
  };

  useEffect(() => {
    setCheckbox(newCheckbox);
    onSelectionChange(newCheckbox);
  }, [newCheckbox]);

  useEffect(() => {
    handleClick();
  }, []);

  return (
    <div key="select">
      <Radio.Group defaultValue="group" className="w-100-p">
        {checkbox === 'list' ? (
          <Radio.Button value="list" checked onClick={handleClick}>
            Group
          </Radio.Button>
        ) : (
          <Radio.Button onClick={handleClick} checked value="group">
            List
          </Radio.Button>
        )}
      </Radio.Group>
    </div>
  );
};

export default ChangeViewTable;
