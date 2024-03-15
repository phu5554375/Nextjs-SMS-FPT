/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Upload } from 'antd';
import { allowedFileTypes } from '../../utils/image';
import { DraggerCustom } from './DraggerCustom';
const { Dragger } = Upload;

const customRequest = ({ file, onSuccess, onProgress }: any) => {
  setTimeout(() => onProgress({ percent: 100 }, file), 100);
  setTimeout(() => onSuccess({}, file), 100);

  return {};
};

export const DraggerCustomImplement = ({ children, value, ...rest }: any) => {
  return (
    <Dragger accept={allowedFileTypes.join(',')} customRequest={customRequest} {...rest}>
      {children}
    </Dragger>
  );
};

export default DraggerCustom;