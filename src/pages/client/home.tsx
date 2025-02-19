import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination, message } from 'antd';
import type { FormProps } from 'antd';
import 'styles/home.scss';
import { useState, useEffect } from 'react';
import { getBooksAPI, getCategoryAPI } from '@/services/api';
import { notification, Spin } from 'antd';
import { useNavigate, useOutletContext } from 'react-router-dom';
import MobileFilter from '@/components/client/book/mobile.filter';

type FieldType = {
	range: {
		from: number;
		to: number
	}
	category: string[]
};

const HomePage = () => {
	const [searchTerm] = useOutletContext() as any;

	// show on mobile
	const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);

	// redirec to detail book
	const navigate = useNavigate();
	const handleViewDetailBook = (id: string) => {
		navigate(`/book/${id}`);
	}

	// custom loading
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// get category
	const [listCategory, setListCategory] = useState<{
		label: string;
		value: string
	}[]>([]);

	useEffect(() => {
		const fetchCategory = async () => {
			const res = await getCategoryAPI();

			if (res && res.data) {
				const c = res.data.map(item => {
					return { label: item, value: item }
				})
				setListCategory(c);
			} else {
				notification.error({
					message: 'Lỗi khi lấy danh mục!',
					description: res.message
				})
			}
		}

		fetchCategory();
	}, [])

	// get list book
	const [listBook, setListBook] = useState<IBookTable[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [current, setCurrent] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);

	// pagination
	const handleOnChangePage = (pagination: { current: number, pageSize: number }) => {
		// nếu trang click khác trang hiện tại thì mới set
		if (pagination && pagination.current !== current) {
			setCurrent(pagination.current);
		}
		if (pagination && pagination.pageSize !== pageSize) {
			setPageSize(pagination.pageSize)
			setCurrent(1);
		}
	}

	// fetch book
	const fetchBook = async () => {
		setIsLoading(true);

		let query = `current=${current}&pageSize=${pageSize}`;

		if (filter && filter !== '') {
			query += `&${filter}`;
		};

		if (sortQuery) {
			query += `${sortQuery}`;
		};

		if (searchTerm) {
			query += `&mainText=/${searchTerm}/i`;
		}

		const res = await getBooksAPI(query);

		if (res && res.data) {
			setListBook(res.data.result);
			setTotal(res.data.meta.total);
		}

		setIsLoading(false);
	}

	// filter, sort
	const [filter, setFilter] = useState<string>('');
	const [sortQuery, setSortQuery] = useState<string>('&sort=-sold');

	const items = [
		{
			key: '&sort=-sold',
			label: `Phổ biến`,
			children: <></>,
		},
		{
			key: '&sort=-createdAt',
			label: `Hàng Mới`,
			children: <></>,
		},
		{
			key: '&sort=price',
			label: `Giá Thấp Đến Cao`,
			children: <></>,
		},
		{
			key: '&sort=-price',
			label: `Giá Cao Đến Thấp`,
			children: <></>,
		},
	];

	const handleChangeFilter = (changedValues: any, values: any) => {
		if (changedValues.category) {
			const cate = values.category;
			if (cate && cate.length > 0) {
				const f = cate.join(',');
				setFilter(`category=${f}`);
				setCurrent(1);
			} else {
				setFilter('');
			}
		}
	};

	// submit form
	const [form] = Form.useForm();
	const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {

		if (values.range.from >= 0 && values.range.to >= values.range.from) {
			let f = `price>=${values.range.from}&price<=${values.range.to}`;
			if (values.category && values.category.length > 0) {
				const cate = values?.category?.join(',');
				f += `&category=${cate}`;
			}
			setFilter(f);
			setCurrent(1);
		} else {
			message.error('Vui lòng nhập khoảng giá hợp lý!');
		}
	}

	useEffect(() => {
		fetchBook();
	}, [current, pageSize, filter, sortQuery, searchTerm]);

	return (
		<>
			<div style={{ background: '#efefef', padding: '20px 0' }}>
				<div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto', overflow: "hidden" }}>
					<Row gutter={[20, 20]}>
						{/* sidebar */}
						<Col lg={4} md={6} sm={0} xs={0}>
							<div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
								<div style={{ display: 'flex', justifyContent: "space-between" }}>
									<span>
										<FilterTwoTone />
										<span style={{ fontWeight: 500 }}>Bộ lọc tìm kiếm</span>
									</span>
									<ReloadOutlined
										style={{ color: '#1890ff' }}
										title="Reset"
										onClick={() => { setFilter(''); form.resetFields() }}
									/>
								</div>

								<Divider />

								<Form
									onFinish={onFinish}
									form={form}
									onValuesChange={(changedValues, values) => { handleChangeFilter(changedValues, values) }}
								>
									<Form.Item
										name="category"
										label="Danh mục sản phẩm"
										labelCol={{ span: 24 }}
									>
										<Checkbox.Group >
											<Row>
												{listCategory && listCategory.length > 0
													?
													(listCategory.map((item, index) => {
														return (
															<Col span={24} key={`category-${index}`} style={{ padding: '7px 0' }}>
																<Checkbox value={item.value}>
																	{item.label}
																</Checkbox>
															</Col>
														)
													}))
													:
													<>Không có danh mục nào</>
												}
											</Row>
										</Checkbox.Group>
									</Form.Item>

									<Divider />

									<Form.Item
										label="Khoảng giá"
										labelCol={{ span: 24 }}
									>
										<Row gutter={[10, 10]} style={{ width: "100%" }}>
											<Col xl={11} md={24}>
												<Form.Item name={["range", 'from']}>
													<InputNumber
														name='from'
														min={0}
														placeholder="Từ"
														formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
														style={{ width: '100%' }}
													/>
												</Form.Item>
											</Col>

											<Col xl={2} md={0}>
												<div > - </div>
											</Col>

											<Col xl={11} md={24}>
												<Form.Item name={["range", 'to']}>
													<InputNumber
														name='to'
														min={0}
														placeholder="Đến"
														formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
														style={{ width: '100%' }}
													/>
												</Form.Item>
											</Col>
										</Row>

										<div>
											<Button onClick={() => { form.submit() }}
												style={{ width: "100%" }} type='primary'>Áp dụng</Button>
										</div>
									</Form.Item>

									<Divider />
								</Form>
							</div>
						</Col>

						{/* content */}
						<Col lg={20} md={18} sm={24} xs={24}>
							<Spin spinning={isLoading} tip="Loading...">
								<div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
									<Row>
										<Tabs
											defaultActiveKey='&sort=-sold'
											items={items}
											onChange={(value) => { setSortQuery(value) }}
											style={{ overflowX: 'auto' }}
										/>
										<Col xs={24} md={0}>
											<div style={{ marginBottom: 20 }}>
												<span onClick={() => setShowMobileFilter(true)}>
													<FilterTwoTone />
													<span style={{ fontWeight: 500 }}>Bộ lọc tìm kiếm</span>
												</span>
											</div>
										</Col>
									</Row>

									<Row className='customize-row'>
										{listBook?.map((item, index) => {
											return (
												<div className="column" key={`book-${index}`}>
													<div className='wrapper' onClick={() => handleViewDetailBook(item._id)}>
														<div className='thumbnail'>
															<img
																src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.thumbnail}`}
																alt="thumbnail book"
															/>
														</div>
														<div className='text' title={item?.mainText}>{item?.mainText}</div>
														<div className='price'>
															{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.price ?? 0)}
														</div>
														<div className='rating'>
															<Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
															<span>Đã bán {item?.sold ?? 0}</span>
														</div>
													</div>
												</div>
											)
										})
										}
									</Row>

									<div style={{ marginTop: 30 }}></div>

									<Row style={{ display: "flex", justifyContent: "center" }}>
										<Pagination
											onChange={(p, s) => { handleOnChangePage({ current: p, pageSize: s }) }}
											defaultCurrent={current}
											total={total}
											current={current}
											pageSize={pageSize}
											responsive
										/>
									</Row>
								</div>
							</Spin>
						</Col>
					</Row>
				</div>
			</div >

			<MobileFilter
				setFilter={setFilter}
				isOpen={showMobileFilter}
				setIsOpen={setShowMobileFilter}
				handleChangeFilter={handleChangeFilter}
				listCategory={listCategory}
				onFinish={onFinish}
			/></>
	)
}

export default HomePage
