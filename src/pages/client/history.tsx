import { getOrderAPI } from '@/services/api';
import { Table, Spin, Divider, Tag, message, Row, Col, Drawer } from 'antd';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { Grid } from "antd";
import { Descriptions, Badge } from 'antd/lib';
import 'styles/global.scss';

const contentStyle: React.CSSProperties = {
	padding: 50,
	background: 'rgba(0, 0, 0, 0.05)',
	borderRadius: 4,
};

const HistoryPage = () => {
	const { useBreakpoint } = Grid;
	const screens = useBreakpoint();

	const [openDrawer, setOpenDrawer] = useState(false);
	const [dataDrawer, setDataDrawer] = useState<IOrderTable | null>(null);

	const handleViewDetail = (data: IOrderTable) => {
		setDataDrawer(data);
		setOpenDrawer(true);
	}

	const onCloseDrawer = () => {
		setOpenDrawer(false);
		setDataDrawer(null);
	}

	const columns: TableProps<IOrderTable>['columns'] = [
		{
			title: 'STT',
			key: 'index',
			render(value, record, index) {
				return index + 1
			},
		},
		{
			title: 'Thời gian',
			key: 'createdAt',
			dataIndex: 'createdAt',
			render(value, record, index) {
				return dayjs(record.createdAt).format('DD-MM-YYYY');
			},
		},
		{
			title: 'Tổng số tiền',
			key: 'totalPrice',
			dataIndex: 'totalPrice',
			render(value, record, index) {
				return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
			}
		},
		{
			title: 'Phương thức thanh toán',
			key: 'type',
			render(value, record, index) {
				if (record.type === 'COD') {
					return 'Thanh toán khi nhận hàng'
				}
				if (record.type === 'BANKING') {
					return 'Thanh toán online'
				}
			},
		},
		{
			title: 'Trạng thái',
			key: 'status',
			render(value, record, index) {
				return <Tag color={record.paymentStatus === 'UNPAID' ? 'volcano' : 'green'} style={{ padding: '5px 10px' }}>{record.paymentStatus}</Tag>
			}
		},
		{
			title: 'Payment Ref',
			dataIndex: 'paymentRef',
			key: 'paymentRef',
		},
		{
			title: 'Chi tiết',
			key: 'action',
			render(value, record, index) {
				return <a href="#" onClick={() => handleViewDetail(record)}>Xem chi tiết</a>
			}
		}
	];

	const columnsMobile: TableProps<IOrderTable>['columns'] = [
		{
			title: 'Thời gian',
			key: 'createdAt',
			dataIndex: 'createdAt',
			render(value, record, index) {
				return dayjs(record.createdAt).format('DD-MM-YYYY');
			},
		},
		{
			title: 'Tổng số tiền',
			key: 'totalPrice',
			dataIndex: 'totalPrice',
			render(value, record, index) {
				return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
			}
		},
		{
			title: 'Chi tiết',
			key: 'action',
			render(value, record, index) {
				return <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => handleViewDetail(record)}>Xem chi tiết</span>
			}
		}
	];

	const [dataTable, setDataTable] = useState<IOrderTable[]>([]);

	useEffect(() => {
		const fetchOrder = async () => {
			const res = await getOrderAPI();

			if (res.data) {
				setDataTable(res.data);
			} else {
				setDataTable([]);
				message.error(res.message);
			}
		}

		fetchOrder();
	}, []);

	return (
		<div style={{ padding: 10 }}>
			<Row justify={'center'}>
				<div style={{ fontSize: 20 }}>Lịch sử mua hàng</div>
				<Divider />
				<Col md={20} sm={0} xs={0}>
					{dataTable && dataTable.length > 0
						? <div style={{ marginTop: '20px auto' }}>
							<Table<IOrderTable>
								bordered
								columns={columns}
								dataSource={dataTable}
								rowKey="_id"
								rowHoverable={true}
								pagination={{
									pageSize: 5, // Số lượng item trên mỗi trang
									pageSizeOptions: ['5', '10', '20'], // Các tùy chọn số item mỗi trang
								}}
							/>

						</div>
						: <Spin tip="Loading" size="large">
							<div style={contentStyle}></div>
						</Spin>
					}
				</Col>

				<Col md={0} sm={24} xs={24}>
					{dataTable && dataTable.length > 0
						? <div style={{ marginTop: '20px auto' }}>
							<Table<IOrderTable>
								bordered
								columns={columnsMobile}
								dataSource={dataTable}
								rowKey="_id"
								rowHoverable={true}
								pagination={{
									pageSize: 5, // Số lượng item trên mỗi trang
									pageSizeOptions: ['5', '10', '20'], // Các tùy chọn số item mỗi trang
								}}
							/>

						</div>
						: <Spin tip="Loading" size="large">
							<div style={contentStyle}></div>
						</Spin>
					}
				</Col>
			</Row>

			<Drawer
				width={screens.xs ? "100%" : "40%"}
				title="Chi tiết đơn hàng"
				open={openDrawer}
				onClose={onCloseDrawer}
			>
				{dataDrawer
					?
					<div className='order-detail-container'>
						<div className="item">
							<span className='label'>Ngày đặt:</span>
							{dayjs(dataDrawer.createdAt).format('DD-MM-YYYY')}
						</div>

						<div className='item'>
							<span className='label'>Tên người đặt:</span>
							{dataDrawer.name}
						</div>

						<div className="item">
							<span className='label'>Số điện thoại:</span>
							{dataDrawer.phone}
						</div>

						<div className="item">
							<span className='label'>Email:</span>
							{dataDrawer.email}
						</div>

						<div className="item">
							<span className='label'>Phương thức thanh toán:</span>
							<div>
								{dataDrawer.type === 'COD' ? 'Thanh toán khi nhận hàng' : 'Thanh toán online'}
								<Badge status='processing' style={{ marginLeft: 10 }} />
							</div>
						</div>

						<div className="item" style={{ marginTop: 15, }}>
							<span className='label' style={{ fontSize: 20 }}>Tổng cộng:</span>
							<div className='total-price' style={{ color: '#007BFF' }}>
								{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataDrawer.totalPrice)}
							</div>
						</div>

						<Divider orientation='left' >
						</Divider>

						{dataDrawer.detail.length > 0 && dataDrawer.detail.map(item => {
							return (
								<Descriptions bordered column={1} className='info-book' style={{ marginTop: 15 }} key={`history-${item._id}`}>
									<Descriptions.Item
										labelStyle={{ width: '40%' }}
										contentStyle={{ width: '60%' }}
										label="Tên sản phẩm"
									>
										<span className='content'>{item.bookName}</span>
									</Descriptions.Item>

									<Descriptions.Item
										label="Số lượng"
										labelStyle={{ width: '40%' }}
										contentStyle={{ width: '60%' }}
									>
										<span className='content'>{item.quantity}</span>
									</Descriptions.Item>
								</Descriptions>
							)
						})}

					</div>
					: <Spin tip="Loading" size="large">
						<div style={contentStyle}></div>
					</Spin>
				}
			</Drawer>
		</div>
	)
}

export default HistoryPage
