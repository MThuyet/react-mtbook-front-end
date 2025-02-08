import { getUsersAPI } from '@/services/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import { EditOutlined, DeleteOutlined, CloudUploadOutlined, PlusOutlined, ExportOutlined } from '@ant-design/icons';
import { dateRangeValidate } from "@/services/helper";
import { DetailUser } from 'components/admin/user/detail.user';
import dayjs from 'dayjs';
import { FORMATE_DATE_VN } from '@/services/helper';
import CreateUser from 'components/admin/user/create.user';
import ImportUser from '@/components/admin/user/data/import.user';

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

	// View detail
	const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
	const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);

	// Create user
	const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

	// import user
	const [openModalImport, setOpenModalImport] = useState<boolean>(false);

	const columns: ProColumns<IUserTable>[] = [
		{
			dataIndex: 'index',
			valueType: 'indexBorder',
			width: 48,
		},
		{
			title: 'ID (Click to see detail)',
			dataIndex: '_id',
			hideInSearch: true,
			render(dom, entity, index, action, schema) {
				return (
					<a onClick={() => {
						setDataViewDetail(entity)
						setOpenViewDetail(true)
					}}
						href="#">{entity._id}</a>
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
			sorter: true,
			hideInSearch: true,
			render(dom, entity, index, action, schema) {
				return (
					<>{dayjs(entity.createdAt).format(FORMATE_DATE_VN)}</>
				)
			},
		},
		{
			title: 'Created at',
			dataIndex: 'createdAtRange',
			hideInTable: true,
			valueType: 'dateRange',
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

					query += `&sort=-createdAt`;

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
						key="export"
						icon={<ExportOutlined />}
						type='primary'
					>
						Export
					</Button>
					,
					<Button
						key="import"
						icon={<CloudUploadOutlined />}
						type='primary'
						onClick={() => {
							setOpenModalImport(true)
						}}
					>
						Import
					</Button>
					,
					<Button
						key="button"
						icon={<PlusOutlined />}
						onClick={() => {
							setOpenModalCreate(true)
						}}
						type="primary"
					>
						Add new
					</Button>
				]}
			/>

			<DetailUser
				openViewDetail={openViewDetail}
				dataViewDetail={dataViewDetail}
				setOpenViewDetail={setOpenViewDetail}
				setDataViewDetail={setDataViewDetail}
			/>

			<CreateUser
				openModalCreate={openModalCreate}
				setOpenModalCreate={setOpenModalCreate}
				refreshTable={() => { actionRef.current?.reload() }}
			/>

			<ImportUser
				openModalImport={openModalImport}
				setOpenModalImport={setOpenModalImport}
			/>
		</>
	);
};

export default TableUser;
