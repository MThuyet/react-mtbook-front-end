import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.scss';
import type { FormProps } from 'antd';
import { Button, Divider, Form, Input, App } from 'antd';
import { loginAPI } from 'services/api';
import { useCurrentApp } from '@/components/context/app.context';
import { GooglePlusOutlined } from '@ant-design/icons';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

// define type
type FieldType = {
	username: string;
	password: string;
};


const Login: React.FC = () => {

	// hook
	const { message, notification } = App.useApp();
	const navigate = useNavigate();
	const { setIsAuthenticated, setUser } = useCurrentApp();

	// state
	const [isSubmit, setIsSubmit] = useState(false);

	const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
		const { username, password } = values;

		setIsSubmit(true);

		let res = await loginAPI(username, password);

		setIsSubmit(false);

		if (res && res.data) {
			// set context
			setIsAuthenticated(true);
			setUser(res.data.user);

			// save access_token to localStorage
			localStorage.setItem('access_token', res.data.access_token);
			message.success('Đăng nhập thành công');

			// redirect
			navigate('/');
		} else {
			notification.error({
				message: 'Đăng nhập thất bại',
				// trường hợp nếu res là 1 arr, chỉ lấy phần tử đầu tiên
				description: res.message && Array.isArray(res.message) ? res.message[0] : res.message
			})
		}

	};

	const loginGoogle = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			const { data } = await axios(
				"https://www.googleapis.com/oauth2/v3/userinfo",
				{
					headers: {
						Authorization: `Bearer ${tokenResponse?.access_token}`,
					},
				}
			);

			if (data && data.email) {
				console.log(data.email);
			}
		}
	});

	return (
		<div className="login-page">
			<div className="main">
				<div className="container">
					<section className='wrapper'>
						<div className="heading">
							<h2 className='text text-large'>Đăng nhập</h2>
							<Divider />
						</div>

						<Form
							name="login-form"
							onFinish={onFinish}
							autoComplete="off"
						>
							<Form.Item<FieldType>
								labelCol={{ span: 24 }}
								label="Email"
								name="username"
								rules={[
									{ required: true, message: 'Vui lòng nhập email!!' },
									{ type: 'email', message: 'Email không đúng định dạng!' },
								]}
							>
								<Input />
							</Form.Item>

							<Form.Item<FieldType>
								labelCol={{ span: 24 }}
								label="Mật khẩu"
								name="password"
								rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
							>
								<Input.Password />
							</Form.Item>

							<Form.Item label={null}>
								<Button type="primary" htmlType="submit" loading={isSubmit}>
									Đăng nhập
								</Button>
							</Form.Item>

							<Divider>Hoặc</Divider>
							<div
								onClick={() => loginGoogle()}
								title='Đăng nhập với tài khoản Google'
								style={{
									display: "flex", alignItems: "center",
									justifyContent: "center", gap: 10,
									textAlign: "center", marginBottom: 25,
									cursor: "pointer"
								}}>
								Đăng nhập với
								<GooglePlusOutlined
									style={{ fontSize: 30, color: "orange" }} />
							</div>


							<p className="text text-normal" style={{ textAlign: "center" }}>
								Chưa có tài khoản ?
								<span>
									<Link to='/register' > Đăng Ký </Link>
								</span>
							</p>
							<br />

						</Form>
					</section>
				</div>
			</div>
		</div>
	)
};

export default Login;
