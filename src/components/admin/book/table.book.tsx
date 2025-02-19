import { ProTable } from '@ant-design/pro-components';
import { Button, message, notification } from 'antd';
import { useRef, useState } from 'react';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { deleteBookAPI, getBooksAPI } from '@/services/api';
import dayjs from 'dayjs';
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { FORMATE_DATE_VN, FORMATE_DATE_DEFAULT, dateRangeValidate } from '@/services/helper';
import * as ReactCSV from "react-csv";
import { ExportOutlined } from "@ant-design/icons";
import { DetailBook } from './detail.book';
import { CreateBook } from './create.book';
import { UpdateBook } from './update.book';
import { Popconfirm } from "antd";
import type { PopconfirmProps } from "antd";

const CSVLink = ReactCSV.CSVLink;

type TSearch = {
	category: string;
	mainText: string;
	author: string;
	price: string;
	createdAtRange: string;
}

const TableBook = () => {

	const refreshTable = () => {
		actionRef.current?.reload();
	}

	// view detail book
	const [openViewDetail, setOpenViewDetail] = useState(false);
	const [dataViewDetail, setDataViewDetail] = useState<IBookTable | null>(null);

	// create book
	const [openModalCreate, setOpenModalCreate] = useState(false);

	// update book
	const [openModalUpdate, setOpenModalUpdate] = useState(false);
	const [dataUpdateBook, setDataUpdateBook] = useState<IBookTable | null>(null);

	// delete book
	const [isSubmit, setIsSubmit] = useState(false);
	const [dataDeleteBook, setDataDeleteBook] = useState<IBookTable | null>(null);

	const confirmDelete: PopconfirmProps['onConfirm'] = async () => {
		setIsSubmit(true);
		if (dataDeleteBook && dataDeleteBook._id) {
			const res = await deleteBookAPI(dataDeleteBook._id);

			if (res.data) {
				message.success('Delete user successfully');
				refreshTable();
				setDataDeleteBook(null);
			} else {
				notification.error({
					message: 'Delete user fail',
					description: res.message
				})
			}
		}

		setIsSubmit(false);
	};

	const cancelDelete: PopconfirmProps['onCancel'] = (e) => {
		setDataDeleteBook(null);
	};

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
							onClick={() => {
								setOpenModalUpdate(true);
								setDataUpdateBook(entity);
							}}
							style={{ marginRight: '10px', borderColor: 'rgb(231, 112, 13' }}
						>
							<EditOutlined style={{ color: 'rgb(231, 112, 13' }} />
						</Button>

						{/* Delete book */}
						<Popconfirm
							placement="leftTop"
							title="Delete book"
							description="Are you sure to delete this book?"
							onConfirm={confirmDelete}
							onCancel={cancelDelete}
							okText="Yes"
							cancelText="No"
							icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
							okButtonProps={{ loading: isSubmit }}
						>
							<Button style={{ borderColor: '#f5222d' }} onClick={() => setDataDeleteBook(entity)}>
								<DeleteOutlined style={{ color: '#f5222d' }} />
							</Button>
						</Popconfirm>
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
						if (sort.price) {
							query += `&sort=${sort.price === 'ascend' ? 'price' : '-price'}`;
						}

						if (sort.category) {
							query += `&sort=${sort.category === 'ascend' ? 'category' : '-category'}`;
						}

						if (sort.author) {
							query += `&sort=${sort.author === 'ascend' ? 'author' : '-author'}`
						}

						if (sort.mainText) {
							query += `&sort=${sort.mainText === 'ascend' ? 'mainText' : '-mainText'}`
						}

						if (sort.createdAt) {
							query += `&sort=${sort.createdAt === 'ascend' ? 'createdAt' : '-createdAt'}`
						} else {
							query += `&sort=-createdAt`
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

					<CSVLink data={currentDataTable} headers={headerCsvData} filename='books.csv'>
						<Button
							key="export"
							icon={<ExportOutlined />}
							type='primary'
						>Export
						</Button>
					</CSVLink>,

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
				refreshTable={refreshTable}
			/>


			<UpdateBook
				openModalUpdate={openModalUpdate}
				setOpenModalUpdate={setOpenModalUpdate}
				refreshTable={refreshTable}
				dataUpdateBook={dataUpdateBook}
				setDataUpdateBook={setDataUpdateBook}
			/>
		</>
	);
};

export default TableBook;
