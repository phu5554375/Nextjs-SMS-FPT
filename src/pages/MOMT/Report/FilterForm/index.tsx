import DateRangePicker from '@/components/DateRangePicker';
import TagSelectGroup from '@/components/TagSelectGroup';
import { useModel } from '@umijs/max';
import { Button, Col, Form, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const FilterForm = ({
  type,
  actionRef,
  listBussinessNumber,
  onParamChange,
}: any) => {
  const { initialState } = useModel('@@initialState');

  const [param, setParam] = useState<any>({});

  const [telcoSelected, setTelcoSelected] = useState<string[]>([]);

  const [isReset, setIsReset] = useState(false);

  const [form] = Form.useForm();

  const handleTagSelectionChange = (selectedItems: string[]) => {
    setTelcoSelected(selectedItems);
  };

  const handleFormSubmit = async (values: any) => {
    actionRef.current?.reload();
    const newParam = {
      from:
        values.dateRange && values.dateRange[0]
          ? dayjs(values.dateRange[0]).format('YYYY-MM-DD')
          : '',
      to:
        values.dateRange && values.dateRange[1]
          ? dayjs(values.dateRange[1]).format('YYYY-MM-DD')
          : '',
      telcos: telcoSelected.toString(),
      mo_subscription_ids: values.bussinessNumber,
    };

    if (JSON.stringify(newParam) !== JSON.stringify(param)) {
      setParam(newParam);
      onParamChange(newParam);
    }
  };

  const handleFormReset = () => {
    setIsReset(!isReset);
    form.resetFields();
    form.submit();
  };

  useEffect(() => {
    form.submit();
  }, []);

  return (
    <Form
      form={form}
      labelAlign="left"
      onFinish={handleFormSubmit}
      initialValues={{
        bussinessNumber: '',
        dateRange: [dayjs().subtract(45, 'day'), dayjs()],
      }}
      autoComplete="off"
    >
      {type === 'date' ? (
        <Row gutter={[10, 10]} className="mb-16">
          <Col span={24} lg={24} md={24}>
            <Row>
              <Form.Item label="Nhà mạng" labelAlign="left" className="">
                <TagSelectGroup
                  isReset={isReset}
                  defaultSelectedAll
                  items={initialState?.configs['mo-mt-telcos']}
                  onSelectionChange={handleTagSelectionChange}
                />
              </Form.Item>
            </Row>
          </Col>
        </Row>
      ) : (
        ''
      )}
      <Row gutter={[10, 10]}>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Form.Item
            className="label-bold"
            labelAlign="left"
            label="Nhóm đầu số"
            name="bussinessNumber"
          >
            <Select options={listBussinessNumber} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Form.Item className="label-bold" labelAlign="left" label="Thời gian">
            <DateRangePicker />
          </Form.Item>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={12}
          className="col-form-custom btn-custom t-al-right"
        >
          <Button type="primary" htmlType="submit">
            Tìm kiếm
          </Button>
          <Button
            type="default"
            onClick={handleFormReset}
            style={{ marginLeft: '8px' }}
            htmlType="reset"
          >
            Làm lại
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default FilterForm;
