import { Modal, Tabs } from "antd";
import UserInfo from "./user.info";
import ChangePassword from "./change.password";
import { BrowserView, MobileView } from "react-device-detect";
interface IProps {
	isModalOpen: boolean;
	setIsModalOpen: (v: boolean) => void;
}

const ManageAccount = (props: IProps) => {
	const { isModalOpen, setIsModalOpen } = props;
	const items = [
		{
			key: 'info',
			label: `Cập nhật thông tin`,
			children: <UserInfo />,
		},
		{
			key: 'password',
			label: `Đổi mật khẩu`,
			children: <ChangePassword />,
		},
	];
	return (
		<>
			<BrowserView>
				<Modal
					title="Quản lý tài khoản"
					open={isModalOpen}
					footer={null}
					onCancel={() => setIsModalOpen(false)}
					maskClosable={false}
					width={"60vw"}
				>
					<Tabs
						defaultActiveKey="info"
						items={items}
					/>
				</Modal>
			</BrowserView>
			<MobileView>
				<Modal
					title="Quản lý tài khoản"
					open={isModalOpen}
					footer={null}
					onCancel={() => setIsModalOpen(false)}
					maskClosable={false}
					width={"100vw"}
				>
					<Tabs
						defaultActiveKey="info"
						items={items}
					/>
				</Modal>
			</MobileView>
		</>
	)
}
export default ManageAccount
