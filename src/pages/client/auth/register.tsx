import { Button, Divider, Form, Input, App } from 'antd';
import type { FormProps } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.scss';
import { registerAPI } from 'services/api';

// define type
type FieldType = {
	fullName: string;
	email: string;
	password: string;
	phone: string;
};

const RegisterPage = () => {
	// hook
	const { message, notification } = App.useApp();
	const navigate = useNavigate();

	// state
	const [isSubmit, setIsSubmit] = useState(false);

	// function
	const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
		setIsSubmit(true);

		const { fullName, email, password, phone } = values;

		let res = await registerAPI(fullName, email, password, phone);

		if (res && res.data) {
			message.success('Đăng ký tài khoản thành công');
			navigate('/login');
		} else {
			notification.error({
				message: 'Đăng kí không thành công!',
				description: res.message
			})
		}

		setIsSubmit(false);
	};

	return (
		<div className="register-page">
			<main className="main">
				<div className="container">
					<section className="wrapper">
						<div className="heading">
							<h2 className="text text-large">Đăng Ký Tài Khoản</h2>
							<Divider />
						</div>
						<Form
							name="form-register"
							onFinish={onFinish}
							autoComplete="off"
						>
							<Form.Item<FieldType>
								labelCol={{ span: 24 }} //whole column
								label="Họ tên"
								name="fullName"
								rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
							>
								<Input />
							</Form.Item>
							<Form.Item<FieldType>
								labelCol={{ span: 24 }} //whole column
								label="Email"
								name="email"
								rules={[
									{ required: true, message: 'Email không được để trống!' },
									{ type: "email", message: "Email không đúng định dạng!" }
								]}
							>
								<Input />
							</Form.Item>
							<Form.Item<FieldType>
								labelCol={{ span: 24 }} //whole column
								label="Mật khẩu"
								name="password"
								rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
							>
								<Input.Password />
							</Form.Item>
							<Form.Item<FieldType>
								labelCol={{ span: 24 }} //whole column
								label="Số điện thoại"
								name="phone"
								rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
							>
								<Input />
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit" loading={isSubmit}>
									Đăng ký
								</Button>
							</Form.Item>
							<Divider>Hoặc</Divider>
							<p className="text text-normal" style={{ textAlign: "center" }}>
								Đã có tài khoản ?
								<span>
									<Link to='/login' > Đăng Nhập </Link>
								</span>
							</p>
						</Form>
					</section>
				</div>
			</main>
		</div>
	)
}

export default RegisterPage
