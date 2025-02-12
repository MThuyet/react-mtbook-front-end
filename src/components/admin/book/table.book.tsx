import { ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { getBooksAPI } from '@/services/api';
import dayjs from 'dayjs';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { FORMATE_DATE_VN, FORMATE_DATE_DEFAULT, dateRangeValidate } from '@/services/helper';
import { CSVLink } from "react-csv";
import { ExportOutlined } from "@ant-design/icons";
import { DetailBook } from 'components/admin/book/detail.book';
import { CreateBook } from './create.book';

type TSearch = {
	category: string;
	mainText: string;
	author: string;
	price: string;
	createdAtRange: string;
}

const TableBook = () => {

	// view detail book
	const [openViewDetail, setOpenViewDetail] = useState(false);
	const [dataViewDetail, setDataViewDetail] = useState<IBookTable | null>(null);

	// create book
	const [openModalCreate, setOpenModalCreate] = useState(false);

	const columns: ProColumns<IBookTable>[] = [
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
			title: 'ID (Click to see detail)',
			dataIndex: '_id',
			width: 200,
			ellipsis: true,
			hideInSearch: true,
			render(dom, entity, index, action, schema) {
				return (
					<a href='#' onClick={() => { setOpenViewDetail(true); setDataViewDetail(entity) }}>
						{entity._id}
					</a>
				)
			},
		},
		{
			title: 'Category',
			dataIndex: 'category',
			sorter: true,
			width: 150
		},
		{
			title: 'Book name',
			dataIndex: 'mainText',
			sorter: true,
			copyable: true,
			width: 250,
			ellipsis: true
		},
		{
			title: 'Author',
			dataIndex: 'author',
			sorter: true,
			minWidth: 150,
			render(dom, entity, index, action, schema) {
				return (
					<div style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
						{entity.author}
					</div>
				)
			},
		},
		{
			title: 'Price',
			dataIndex: 'price',
			sorter: true,
			width: 100,
			hideInSearch: true,
			render(dom, entity, index, action, schema) {
				return (
					`${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entity?.price)}`
				)
			}
		},
		{
			title: 'Price >=',
			dataIndex: 'price',
			hideInTable: true,
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
			title: 'Action',
			hideInSearch: true,
			minWidth: 110,
			render(dom, entity, index, action, schema) {
				return (
					<div style={{ maxWidth: '110px' }}>
						<Button
							style={{ marginRight: '10px', borderColor: 'rgb(231, 112, 13' }}
						>
							<EditOutlined style={{ color: 'rgb(231, 112, 13' }} />
						</Button>

						<Button style={{ borderColor: '#f5222d' }}>
							<DeleteOutlined style={{ color: '#f5222d' }} />
						</Button>
					</div>

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

	const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([]);

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
			<ProTable<IBookTable, TSearch>
				columns={columns}
				actionRef={actionRef}
				cardBordered
				request={async (params, sort, filter) => {

					let query = '';

					if (params) {
						query += `current=${params.current}&pageSize=${params.pageSize}`;

						if (params.category) {
							query += `&category=/${params.category}/i`;
						}

						if (params.mainText) {
							query += `&mainText=/${params.mainText}/i`;
						}

						if (params.author) {
							query += `&author=/${params.author}/i`;
						}

						const createdAtRange = dateRangeValidate(params.createdAtRange);
						if (createdAtRange) {
							query += `&createdAt>=${createdAtRange[0]}&createdAt<=${createdAtRange[1]}`;
						}

						function isStringNumber(str: string) {
							return /^[0-9]+$/.test(str);
						}

						if (params.price) {
							let check = isStringNumber(params.price);
							if (check) {
								query += `&price>=${params.price}`
							} else {
								message.error('Price must be a number');
							}
						}
					}

					if (sort) {
						query += `&sort=`;
						if (sort.price) {
							query += `${sort.price === 'ascend' ? 'price' : '-price'}`;
						}

						if (sort.category) {
							query += `${sort.category === 'ascend' ? 'category' : '-category'}`;
						}

						if (sort.author) {
							query += `${sort.author === 'ascend' ? 'author' : '-author'}`
						}

						if (sort.mainText) {
							query += `${sort.mainText === 'ascend' ? 'mainText' : '-mainText'}`
						}

						if (sort.createdAt) {
							query += `${sort.createdAt === 'ascend' ? 'createdAt' : '-createdAt'}`
						}
					}

					const res = await getBooksAPI(query);

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

				}}
				rowKey="_id"
				pagination={
					{
						current: +(meta.current),
						pageSize: meta.pageSize,
						showSizeChanger: true,
						total: meta.total,
						showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} / {total} Books</div>) }
					}
				}
				headerTitle="Table Book"
				toolBarRender={() => [
					<Button
						key="export"
						icon={<ExportOutlined />}
						type='primary'
					>
						<CSVLink data={currentDataTable} headers={headerCsvData} filename='books.csv'>Export</CSVLink>
					</Button>,
					<Button
						key="button"
						icon={<PlusOutlined />}
						onClick={() => {
							setOpenModalCreate(true);
						}}
						type="primary"
					>
						Add new
					</Button>

				]}
			/>

			<DetailBook
				openViewDetail={openViewDetail}
				dataViewDetail={dataViewDetail}
				setOpenViewDetail={setOpenViewDetail}
				setDataViewDetail={setDataViewDetail}
			/>

			<CreateBook
				openModalCreate={openModalCreate}
				setOpenModalCreate={setOpenModalCreate}
			/>
		</>
	);
};

export default TableBook;
