import { getUsersAPI } from '@/services/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import { useRef } from 'react';

const columns: ProColumns<IUserTable>[] = [
	{
		dataIndex: 'index',
		valueType: 'indexBorder',
		width: 48,
	},
	{
		title: '_id',
		dataIndex: '_id',
	},
	{
		title: 'Full name',
		dataIndex: 'fullName',
	},
	{
		title: 'Email',
		dataIndex: 'email',
	},
	{
		title: 'Created at',
		dataIndex: 'createdAt',
	},
];

const TableUser = () => {
	const actionRef = useRef<ActionType>();
	return (
		<>
			<ProTable<IUserTable>
				columns={columns}
				actionRef={actionRef}
				cardBordered
				request={async (params, sort, filter) => {
					console.log(sort, filter);
					const res = await getUsersAPI();

					return {
						data: res.data?.result,
						"page": 1,
						"success": true,
						"total": res.data?.meta.total
					}
				}}
				rowKey="id"
				pagination={{
					pageSize: 5,
					onChange: (page) => console.log(page),
				}}
				headerTitle="Table user"
				toolBarRender={() => [
					<Button
						key="button"
						icon={<PlusOutlined />}
						onClick={() => {
							actionRef.current?.reload();
						}}
						type="primary"
					>
						Add new
					</Button>

				]}
			/>
		</>
	);
};

export default TableUser;
