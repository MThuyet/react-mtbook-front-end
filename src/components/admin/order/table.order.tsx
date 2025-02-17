import { ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { FORMATE_DATE_DEFAULT, dateRangeValidate } from '@/services/helper';
import { CSVLink } from "react-csv";
import { ExportOutlined } from "@ant-design/icons";
import { getOrderWithPaginateAPI } from '@/services/api';

type TSearch = {
	name: string;
	address: string;
	phone: string;
	type: string;
	createdAtRange: string
};

const TableOrder = () => {

	const columns: ProColumns<IOrderTable>[] = [
		{
			title: '#',
			dataIndex: 'index',
			width: 48,
			hideInSearch: true,
			render(dom, entity, index, action, schema) {
				return (
					<div style={{ fontWeight: 'bold' }}>{index + 1 + ((meta.pageSize) * meta.current) - meta.pageSize}</div>
				)
			},
		},
		{
			title: 'ID (Click to view)',
			dataIndex: '_id',
			width: 150,
			ellipsis: true,
			hideInSearch: true,
			render(dom, entity, index, action, schema) {
				return (
					<a >
						{entity._id}
					</a>
				)
			},
		},
		{
			title: 'Name',
			dataIndex: 'name',
			sorter: true,
			copyable: true,
			width: 180
		},
		{
			title: 'Address',
			dataIndex: 'address',
			copyable: true,
			width: 180,
			ellipsis: true
		},
		{
			title: 'Phone',
			dataIndex: 'phone',
			width: 120,
		},
		{
			title: 'Type',
			dataIndex: 'type',
			sorter: true,
			width: 100,
			hideInSearch: true,
		},
		{
			title: 'Total price',
			dataIndex: 'totalPrice',
			sorter: true,
			width: 100,
			hideInSearch: true,
			render(dom, entity, index, action, schema) {
				return (
					<>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entity?.totalPrice)}</>
				)
			}
		},
		{
			title: 'Created at',
			dataIndex: 'createdAt',
			hideInSearch: true,
			sorter: true,
			width: 110,
			render(dom, entity, index, action, schema) {
				return (
					<>{dayjs(entity.createdAt).format(FORMATE_DATE_DEFAULT)}</>
				)
			}
		},
		{
			title: 'Created at',
			dataIndex: 'createdAtRange',
			hideInTable: true,
			valueType: 'dateRange',
		},

	];

	const actionRef = useRef<ActionType>();

	const [meta, setMeta] = useState({
		current: 1,
		pageSize: 5,
		pages: 0,
		total: 0
	});

	const [currentDataTable, setCurrentDataTable] = useState<IOrderTable[]>([]);

	const headerCsvData = [
		{ label: 'ID', key: '_id' },
		{ label: 'Category', key: 'category' },
		{ label: 'Book name', key: 'mainText' },
		{ label: 'Author', key: 'author' },
		{ label: 'Price', key: 'price' },
		{ label: 'Created at', key: 'createdAt' },
		{ label: 'Updated at', key: 'updatedAt' },
		{ label: '__v', key: '__v' },
	]

	return (
		<>
			<ProTable<IOrderTable, TSearch>
				columns={columns}
				actionRef={actionRef}
				cardBordered
				bordered
				request={async (params, sort, filter) => {

					let query = '';

					if (params) {
						query += `current=${params.current}&pageSize=${params.pageSize}`;

						if (params.name) {
							query += `&name=/${params.name}/i`;
						}

						if (params.address) {
							query += `&address=/${params.address}/i`;
						}

						if (params.phone) {
							query += `&phone=/${params.phone}/i`;
						}

						const createdAtRange = dateRangeValidate(params.createdAtRange);
						if (createdAtRange) {
							query += `&createdAt>=${createdAtRange[0]}&createdAt<=${createdAtRange[1]}`;
						}

					}

					if (sort) {
						if (sort.name) {
							query += `&sort=${sort.name === 'ascend' ? 'name' : '-name'}`;
						}

						if (sort.type) {
							query += `&sort=${sort.type === 'ascend' ? 'type' : '-type'}`;
						}

						if (sort.totalPrice) {
							query += `&sort=${sort.totalPrice === 'ascend' ? 'totalPrice' : '-totalPrice'}`
						}

						if (sort.createdAt) {
							query += `&sort=${sort.createdAt === 'ascend' ? 'createdAt' : '-createdAt'}`
						}
					}

					const res = await getOrderWithPaginateAPI(query);

					if (res.data) {
						setMeta(res.data.meta);
						setCurrentDataTable(res.data.result);
					}

					return {
						data: res.data?.result,
						page: 1,
						success: true,
						total: res.data?.meta.total
					}

				}
				}
				rowKey="_id"
				pagination={
					{
						current: +(meta.current),
						pageSize: meta.pageSize,
						showSizeChanger: true,
						total: meta.total,
						showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} / {total} Orders</div>) }
					}
				}
				headerTitle="Table Order"
				toolBarRender={() => [

					<CSVLink data={currentDataTable} headers={headerCsvData} filename='books.csv'>
						<Button
							key="export"
							icon={<ExportOutlined />}
							type='primary'
						>Export
						</Button>
					</CSVLink>,

				]}
			/>
		</>
	);
};

export default TableOrder;
