import { FormattedMessage } from '@umijs/max';
import { Form, Select } from 'antd';
import React from 'react';

function TabSwitcher({ campaign_types, activeTab, setActiveTab, children }: any) {

    const handleTabChange = (selectedTab: any) => {
        setActiveTab(selectedTab);
    };

    return (
        <div>
            <Form.Item
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                name="type"
                label={<FormattedMessage id="campaign.type" defaultMessage='Loại chiến dịch' />}
                rules={[{ required: true }]}
            >
                <Select
                    placeholder={<FormattedMessage id='campaign.type' defaultMessage='Loại chiến dịch' />}
                    allowClear
                    options={campaign_types.map((item: any) => ({
                        label: <FormattedMessage id={`campaign.type.${item.label}`} defaultMessage='Loại chiến dịch' />,
                        code: item.label,
                        value: item.value,
                    }))}
                    onChange={(value: any, item: any) => handleTabChange(item.code)}
                />
            </Form.Item>
            <div className="tab-content">
                {React.Children.map(children, (child) => {
                    if (child.props.tabKey === activeTab) {
                        return child;
                    }
                    return null;
                })}
            </div>
        </div>
    );
}

export default TabSwitcher;
