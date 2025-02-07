import { getUsersAPI } from '@/services/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import { useRef, useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { dateRangeValidate } from "@/services/helper";

const columns: ProColumns<IUserTable>[] = [
	{
		dataIndex: 'index',
		valueType: 'indexBorder',
		width: 48,
	},
	{
		title: 'ID',
		dataIndex: '_id',
		hideInSearch: true,
		render(dom, entity, index, action, schema) {
			return (
				<a href="#">{entity._id}</a>
			)
		},
	},
	{
		title: 'Full name',
		dataIndex: 'fullName',
		sorter: true,
	},
	{
		title: 'Email',
		dataIndex: 'email',
		copyable: true,
	},
	{
		title: 'Created at',
		dataIndex: 'createdAt',
		valueType: 'date',
		sorter: true,
		hideInSearch: true,
	},
	{
		title: 'Created at',
		dataIndex: 'createdAtRange',
		valueType: 'dateRange',
		hideInTable: true,
	},
	{
		title: 'Actions',
		hideInSearch: true,
		render: () => {
			return (
				<>
					<Button style={{ marginRight: '10px', borderColor: 'rgb(231, 112, 13' }} ><EditOutlined style={{ color: 'rgb(231, 112, 13' }} /></Button>
					<Button style={{ borderColor: '#f5222d' }}><DeleteOutlined style={{ color: '#f5222d' }} /></Button>
				</>
			);
		}
	},
];

type TSearch = {
	fullName: string;
	email: string;
	createdAt: string;
	createdAtRange: string;
}

const TableUser = () => {
	const actionRef = useRef<ActionType>();
	const [meta, setMete] = useState({
		current: 1,
		pageSize: 5,
		pages: 0,
		total: 0
	});

	return (
		<>
			<ProTable<IUserTable, TSearch>
				columns={columns}
				actionRef={actionRef}
				cardBordered
				request={async (params, sort, filter) => {

					let query = ``;
					if (params) {
						query += `current=${params.current}&pageSize=${params.pageSize}`;
						if (params.fullName) {
							query += `&fullName=/${params.fullName}/i`;
						}
						if (params.email) {
							query += `&email=/${params.email}/i`;
						}

						const createdAtRange = dateRangeValidate(params.createdAtRange);
						if (createdAtRange) {
							query += `&createdAt>=${createdAtRange[0]}&createdAt<=${createdAtRange[1]}`;
						}
					}

					if (sort.fullName) {
						query += `&sort=${sort.fullName === 'ascend' ? 'fullName' : '-fullName'}`
					}

					if (sort.createdAt) {
						query += `&sort=${sort.createdAt === 'ascend' ? 'createdAt' : '-createdAt'}`
					}

					const res = await getUsersAPI(query);

					if (res.data) {
						setMete(res.data.meta);
					}

					return {
						data: res.data?.result,
						page: 1,
						success: true,
						total: res.data?.meta.total
					}
				}}
				rowKey="_id"
				pagination={
					{
						current: meta.current,
						pageSize: meta.pageSize,
						showSizeChanger: true,
						total: meta.total,
						showTotal(total, range) {
							return (
								<div> {range[0]} - {range[1]} / {total} Users</div>
							)
						},
					}
				}
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
