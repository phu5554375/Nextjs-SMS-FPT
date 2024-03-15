/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Checkbox } from 'antd';
import React, { ChangeEvent } from 'react';
import styles from './index.less';

interface CheckboxCustomProps {
  children: React.ReactNode;
  onChange?: (value: boolean) => void;
  value: boolean;
  disabled: boolean;
}

const CheckboxCustomImpl: React.FC<CheckboxCustomProps> = ({ children, onChange, value, disabled, ...rest }) => {
  const onCheckBoxChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange( e.target.checked);
  };

  return (
    <Checkbox
      className={styles.checkboxCustom}
      onChange={() => onCheckBoxChange}
      checked={value}
      disabled= {disabled}
      {...rest}
    >
      {children}
    </Checkbox>
  );
};

class CheckboxCustom extends React.Component<CheckboxCustomProps> {
  render() {
    return <CheckboxCustomImpl {...this.props} />;
  }
}

export default CheckboxCustom;