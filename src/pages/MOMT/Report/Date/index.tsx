import Sumary from '@/components/Sumary';
import ViewTable from '@/components/ViewTable';
import { exportMTReport, fetchAllMTReport } from '@/services/MT/report';
import { Card } from 'antd';
import { Fragment, useState } from 'react';
import FilterForm from '../FilterForm';

const Date = ({ listBussinessNumber, actionRef, columns }: any) => {
  const [data, setData] = useState<any>();

  const [params, setParams] = useState<API_MTREPORT.Params | undefined>(
    undefined,
  );

  const handleParamChange = (newValue: any) => {
    setParams(newValue);
  };

  return (
    <Fragment>
      <Sumary items={data} />

      <Card className="mb-24">
        <FilterForm
          type="date"
          actionRef={actionRef}
          listBussinessNumber={listBussinessNumber}
          onParamChange={handleParamChange}
        />
      </Card>
      <ViewTable
        keyTable="momt.report.date"
        actionRef={actionRef}
        columns={columns}
        params={params}
        headerTitle="Kết quả báo cáo"
        rowKey="key"
        isExpanded={true}
        scroll={{}}
        sendData={(values: any) => {
          setData(values);
        }}
        requestData={async () => {
          return await fetchAllMTReport({ group_by: 'date', ...params });
        }}
        handleExport={async (fileName: string) => {
          return await exportMTReport({
            title: fileName,
            group_by: 'date',
            ...params,
          });
        }}
      />
    </Fragment>
  );
};

export default Date;
