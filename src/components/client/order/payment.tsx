import { App, Col, Divider, Form, Radio, Row, Space, Button } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { Input } from 'antd';
import { useCurrentApp } from '@/components/context/app.context';
import type { FormProps } from 'antd';
import { createOrderAPI, getVNPayUrlAPI } from '@/services/api';
import { v4 as uuidv4 } from 'uuid';

const { TextArea } = Input;

type UserMethod = "COD" | "BANKING";

type FieldType = {
	fullName: string;
	phone: string;
	address: string;
	method: UserMethod;
};

interface IProps {
	setCurrentStep: (v: number) => void;
}

const Payment = (props: IProps) => {
	const { carts, setCarts, user } = useCurrentApp();
	const [totalPrice, setTotalPrice] = useState(0);
	const [form] = Form.useForm();
	const [isSubmit, setIsSubmit] = useState(false);
	const { setCurrentStep } = props;
	const { message, notification } = App.useApp();

	useEffect(() => {
		if (user) {
			form.setFieldsValue({
				fullName: user.fullName,
				phone: user.phone,
				method: "COD"
			})
		}
	}, [user]);

	useEffect(() => {
		if (carts && carts.length > 0) {
			let sum = 0;
			carts.map(item => {
				sum += item.quantity * item.detail.price;
			})
			setTotalPrice(sum);
		} else {
			setTotalPrice(0);
		}
	}, [carts]);

	const handleRemoveBook = (_id: string) => {
		const cartStorage = localStorage.getItem("carts");
		if (cartStorage) {
			//update
			const carts = JSON.parse(cartStorage) as ICart[];
			const newCarts = carts.filter(item => item._id !== _id)
			localStorage.setItem("carts", JSON.stringify(newCarts));
			//sync React Context
			setCarts(newCarts);
		}
	}

	const handlePlaceOrder: FormProps<FieldType>['onFinish'] = async (values) => {
		const { fullName, phone, address, method } = values;

		const detail = carts.map(item => ({
			_id: item._id,
			quantity: item.quantity,
			bookName: item.detail.mainText
		}))

		setIsSubmit(true);
		let res = null;
		const paymentRef = uuidv4();

		if (method === 'COD') {
			res = await createOrderAPI(fullName, address, phone, totalPrice, method, detail);
		} else {
			// banking
			res = await createOrderAPI(fullName, address, phone, totalPrice, method, detail, paymentRef);
		}

		if (res && res.data) {
			localStorage.removeItem("carts");
			setCarts([]);

			if (method === 'COD') {
				message.success('Đặt hàng thành công');
				setCurrentStep(2);
			} else {
				// redirec to vn pay
				const resVnpay = getVNPayUrlAPI(totalPrice, 'vn', paymentRef);
				if (resVnpay) {
					window.location.href = (await resVnpay).data?.url as string
				} else {
					notification.error({
						message: 'Lỗi khi đặt hàng!',
						description: resVnpay
					});
				}
			}

		} else {
			notification.error({
				message: 'Lỗi khi đặt hàng!',
				description: res.message
			});
		}

		setIsSubmit(false);
	}

	return (
		<Row gutter={[20, 20]}>
			<Col md={16} xs={24}>
				{carts?.map((book, index) => {
					const currentBookPrice = book?.detail?.price ?? 0;
					return (
						<div className='order-book' key={`index-${index}`}>
							<div className='book-content'>
								<img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />
								<div className='info'>
									<div className='title'>{book.detail.mainText}</div>
									<div className='price'>
										Đơn giá:
										<span style={{ marginLeft: 10, color: "#007bff" }}>
											{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
												.format(book.detail.price)}
										</span>
									</div>
								</div>
							</div>
							<div className='action'>
								<div className='quantity'>
									Số lượng: {book?.quantity}
								</div>
								<div className='sum' style={{ fontWeight: '500' }}>
									Tổng:  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice * (book?.quantity ?? 0))}
								</div>
								<div className='remove'>
									<DeleteTwoTone
										style={{ cursor: "pointer" }}
										twoToneColor="#eb2f96"
										onClick={() => handleRemoveBook(book._id)}
									/>
								</div>
							</div>
						</div>
					)
				})}
				<div><span
					style={{ cursor: "pointer" }}
					onClick={() => props.setCurrentStep(0)}>
					Quay trở lại
				</span>
				</div>
			</Col>
			<Col md={8} xs={24} >
				<Form
					form={form}
					name="payment-form"
					onFinish={handlePlaceOrder}
					autoComplete="off"
					layout='vertical'
				>
					<div className='order-sum'>
						<Form.Item<FieldType>
							label="Hình thức thanh toán"
							name="method"
						>
							<Radio.Group>
								<Space direction="vertical">
									<Radio value={"COD"}>Thanh toán khi nhận hàng</Radio>
									<Radio value={"BANKING"}>Thanh toán bằng ví VNPAY</Radio>
								</Space>
							</Radio.Group>
						</Form.Item>
						<Form.Item<FieldType>
							label="Họ tên"
							name="fullName"
							rules={[
								{ required: true, message: 'Họ tên không được để trống!' },
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item<FieldType>
							label="Số điện thoại"
							name="phone"
							rules={[
								{ required: true, message: 'Số điện thoại không được để trống!' },
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item<FieldType>
							label="Địa chỉ nhận hàng"
							name="address"
							rules={[
								{ required: true, message: 'Địa chỉ không được để trống!' },
							]}
						>
							<TextArea rows={4} />
						</Form.Item>
						<div className='calculate'>
							<span>  Tạm tính</span>
							<span>
								{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}
							</span>
						</div>
						<Divider style={{ margin: "10px 0" }} />
						<div className='calculate'>
							<span> Tổng tiền</span>
							<span className='sum-final'>
								{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}
							</span>
						</div>
						<Divider style={{ margin: "10px 0" }} />
						<Button type="primary" htmlType="submit" loading={isSubmit} variant="solid">Xác nhận ({carts?.length ?? 0})</Button>
					</div>
				</Form>
			</Col>
		</Row>
	)
}

export default Payment;
