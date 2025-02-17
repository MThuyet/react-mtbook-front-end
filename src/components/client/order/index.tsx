import 'styles/order.scss';
import { Col, Divider, InputNumber, Row, App, Empty, Button } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import { useCurrentApp } from 'components/context/app.context';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface IProps {
	setCurrentStep: (v: number) => void;
}

const OrderDetail = (props: IProps) => {
	const { setCurrentStep } = props;
	const { carts, setCarts } = useCurrentApp();
	const [totalOrder, settotalOrder] = useState(0);

	const { message } = App.useApp();

	useEffect(() => {
		if (carts && carts.length > 0) {
			let total = 0;
			carts.forEach(item => {
				total += item.detail.price * item.quantity
			});
			settotalOrder(total);
		} else {
			settotalOrder(0);
		}
	}, [carts]);

	const removeOrder = (index: number) => {
		const newCarts = [...carts];
		newCarts.splice(index, 1);
		setCarts(newCarts);
		localStorage.setItem("carts", JSON.stringify(newCarts));
	}

	const handleChangeQuantity = (value: number, index: number) => {
		if (!value) {
			message.error("Vui lòng nhập số lượng ít nhất là 1");
			value = 1;
		}
		const newCarts = [...carts];
		newCarts[index].quantity = value;
		setCarts(newCarts);
		localStorage.setItem("carts", JSON.stringify(newCarts));
	}

	const handleNextStep = () => {
		if (!carts.length) {
			message.error("Không tồn tại sản phẩm trong giỏ hàng.")
			return;
		}
		setCurrentStep(1)
	}

	return (
		<>
			<div style={{ background: '#efefef', padding: "20px 0" }}>
				<div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
					<Row gutter={[20, 20]}>
						<Col md={17} xs={24}>
							<div style={{ position: "absolute", top: "100%", left: "50%", transform: "translate(-50%, -50%)" }}>
								<Link to="/">Xem thêm sản phẩm</Link>
							</div>
							{carts && carts.length > 0
								? carts.map((item, index) => {
									return (
										<div className='order-book' key={`book-${index}`}>
											<div className='book-content'>
												<img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.detail?.thumbnail}`} />
												<div className='info'>
													<div className='title'>{item.detail.mainText}</div>
													<div className='price'>
														Đơn giá:
														<span style={{ marginLeft: 10, color: "#007bff" }}>
															{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
																.format(item.detail.price)}
														</span>
													</div>
												</div>
											</div>
											<div className='action'>
												<div className='quantity'>
													<span>Số lượng:</span>
													<InputNumber
														min={1}
														value={item.quantity}
														onChange={(value) => { handleChangeQuantity(value as number, index) }}
													/>
												</div>
												<div className='sum' style={{ fontWeight: "500" }}>
													Tổng:  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
														.format(item.detail.price * carts[index].quantity)}
												</div>
												<div className='remove'>
													<DeleteTwoTone
														style={{ cursor: "pointer" }}
														twoToneColor="#eb2f96"
														onClick={() => { removeOrder(index) }}
													/>
												</div>
											</div>
										</div>
									);
								})
								:
								<Empty
									description="Không có sản phẩm trong giỏ hàng"
								/>
							}
						</Col>
						<Col md={7} xs={24} >
							<div className='order-sum'>
								<div className='calculate'>
									<span> Tạm tính</span>
									<span>
										{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalOrder)}
									</span>
								</div>
								<Divider style={{ margin: "10px 0" }} />
								<div className='calculate'>
									<span>Tổng tiền</span>
									<span className='sum-final'>
										{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalOrder)}
									</span>
								</div>
								<Divider style={{ margin: "10px 0" }} />
								<Button type="primary" onClick={handleNextStep}>Đặt hàng {`(${carts.length ?? 0})`}</Button>
							</div>
						</Col>
					</Row>
				</div>
			</div >
		</>
	)
}

export default OrderDetail
