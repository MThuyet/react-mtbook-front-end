import { Drawer, Descriptions, Badge, Avatar } from 'antd'
import dayjs from 'dayjs';
import { FORMATE_DATE_VN } from '@/services/helper';

interface IProps {
	openViewDetail: boolean;
	dataViewDetail: IUserTable | null;
	setOpenViewDetail: (v: boolean) => void;
	setDataViewDetail: (v: IUserTable | null) => void;
}

export const DetailUser = (props: IProps) => {
	const { openViewDetail, dataViewDetail, setOpenViewDetail, setDataViewDetail } = props;

	const onClose = () => {
		setOpenViewDetail(false);
		setDataViewDetail(null);
	}

	const avatarUrl = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${dataViewDetail?.avatar}`;

	return (
		<Drawer
			size={'large'}
			onClose={onClose}
			open={openViewDetail}
		// extra={
		// 	<Space>
		// 		<Button onClick={onClose}>Cancel</Button>
		// 		<Button type="primary" onClick={onClose}>
		// 			OK
		// 		</Button>
		// 	</Space>
		// }
		>

			<Descriptions title="User Info Detail" bordered column={2}>
				<Descriptions.Item label="Role">
					<Badge status={dataViewDetail?.role === 'ADMIN' ? 'success' : 'processing'} text={dataViewDetail?.role} />
				</Descriptions.Item>
				<Descriptions.Item label="Avatar">
					<Avatar src={avatarUrl} size={50} />
				</Descriptions.Item>
				<Descriptions.Item label="ID">{dataViewDetail?._id}</Descriptions.Item>
				<Descriptions.Item label="UserName">{dataViewDetail?.fullName}</Descriptions.Item>
				<Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
				<Descriptions.Item label="Phone">{dataViewDetail?.phone}</Descriptions.Item>
				<Descriptions.Item label="Created At">{dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_VN)}</Descriptions.Item>
				<Descriptions.Item label="Updated At">{dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE_VN)}</Descriptions.Item>
			</Descriptions>

		</Drawer>
	)
}
