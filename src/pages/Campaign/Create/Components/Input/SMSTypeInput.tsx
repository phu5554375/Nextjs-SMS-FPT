import { FormattedMessage } from "@umijs/max";
import { Form, Radio } from "antd";
import { useState } from "react";


const SMSTypeInput = ({ sms_types, onChangeSmsType }: any) => {

    const [type, setType] = useState(1);

    const changeSMSType = (value: any) => {
        setType(value);
        onChangeSmsType(value);
    };

    return (
        <>
            <Form.Item
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                name="sms_type"
                label={<FormattedMessage id={"message.type"} defaultMessage="Kiểu tin nhắn" />}
                rules={[{ required: true }]}
            >
                <Radio.Group value={type} onChange={e => changeSMSType(e.target.value)} >
                    {sms_types.map((values: any, index: any) => (
                        <Radio key={index} value={values.value}>
                            {<FormattedMessage id={`sms.type.${values.label}`} defaultMessage={values.label} />}
                        </Radio>
                    ))}
                </Radio.Group>
            </Form.Item>
        </>
    );
}

export default SMSTypeInput;