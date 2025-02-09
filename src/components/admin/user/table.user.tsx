import { deleteUserAPI, getUsersAPI } from '@/services/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, App } from 'antd';
import { useRef, useState } from 'react';
import { EditOutlined, DeleteOutlined, CloudUploadOutlined, PlusOutlined, ExportOutlined } from '@ant-design/icons';
import { dateRangeValidate } from "@/services/helper";
import { DetailUser } from 'components/admin/user/detail.user';
import dayjs from 'dayjs';
import { FORMATE_DATE_VN } from '@/services/helper';
import CreateUser from 'components/admin/user/create.user';
import ImportUser from '@/components/admin/user/data/import.user';
import { CSVLink } from "react-csv";
import UpdateUser from './update.user';
import type { PopconfirmProps } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

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

	const { message, notification } = App.useApp();

	const refreshTable = () => {
		actionRef.current?.reload()
	}

	// View detail
	const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
	const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);

	// Create user
	const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

	// Update user
	const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
	const [dataUpdateUser, setDataUpdateUser] = useState<IUserTable | null>(null);

	// delete user
	const [isSubmit, setIsSubmit] = useState<boolean>(false);
	const [dataDeleteUser, setDataDeleteUser] = useState<IUserTable | null>(null);

	const confirm: PopconfirmProps['onConfirm'] = async () => {
		setIsSubmit(true);
		if (dataDeleteUser && dataDeleteUser._id) {
			const res = await deleteUserAPI(dataDeleteUser._id);

			if (res.data) {
				message.success('Delete user successfully');
				refreshTable();
				setDataDeleteUser(null);
			} else {
				notification.error({
					message: 'Delete user fail',
					description: res.message
				})
			}
		}

		setIsSubmit(false);
	};

	const cancel: PopconfirmProps['onCancel'] = (e) => {
		setDataDeleteUser(null);
	};


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
			title: 'Phone',
			dataIndex: 'phone',
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
			render: (dom, entity, index, action, schema) => {
				return (
					<>
						{/* update user */}
						<Button
							style={{ marginRight: '10px', borderColor: 'rgb(231, 112, 13' }}
							onClick={() => {
								setOpenModalUpdate(true);
								setDataUpdateUser(entity);
							}}
						>
							<EditOutlined style={{ color: 'rgb(231, 112, 13' }} />
						</Button>

						{/* delete user */}
						<Popconfirm
							placement="leftTop"
							title="Delete user"
							description="Are you sure to delete this user?"
							onConfirm={confirm}
							onCancel={cancel}
							okText="Yes"
							cancelText="No"
							icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
							okButtonProps={{ loading: isSubmit }}
						>
							<Button style={{ borderColor: '#f5222d' }} onClick={() => setDataDeleteUser(entity)}>
								<DeleteOutlined style={{ color: '#f5222d' }} />
							</Button>
						</Popconfirm>

					</>
				);
			}
		},
	];

	// export
	const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);

	const headerCsvData = [
		{ label: '_id', key: '_id' },
		{ label: 'fullName', key: 'fullName' },
		{ label: 'email', key: 'email' },
		{ label: 'phone', key: 'phone' },
		{ label: 'role', key: 'role' },
		{ label: 'createdAt', key: 'createdAt' },
		{ label: 'updatedAt', key: 'updatedAt' },
		{ label: '__v', key: '__v' },
	]

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
					} else {
						query += `&sort=-createdAt`;
					}

					const res = await getUsersAPI(query);

					if (res.data) {
						setMete(res.data.meta);

						setCurrentDataTable(res.data.result || []);
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
						<CSVLink data={currentDataTable} headers={headerCsvData} filename='user.csv'>Export</CSVLink>
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
				refreshTable={() => { refreshTable() }}
			/>

			<UpdateUser
				openModalUpdate={openModalUpdate}
				setOpenModalUpdate={setOpenModalUpdate}
				dataUpdateUser={dataUpdateUser}
				setDataUpdateUser={setDataUpdateUser}
				refreshTable={() => { refreshTable() }}
			/>

			<ImportUser
				openModalImport={openModalImport}
				setOpenModalImport={setOpenModalImport}
				refreshTable={() => { refreshTable() }}
			/>
		</>
	);
};

export default TableUser;
