import { PageContainer } from "@ant-design/pro-components";
import { FormattedMessage } from "@umijs/max";
import { Card } from "antd";
import CreateForm from "./Components/CreateForm";

export default function Page() {
    return (
        <PageContainer title={<FormattedMessage id="campaign.create" defaultMessage="" />}>
            <Card title={<FormattedMessage id="campaign" defaultMessage="Campaign" />}>
                <div className="flex-center-full">
                    <CreateForm />
                </div>
            </Card>
        </PageContainer >
    );
}