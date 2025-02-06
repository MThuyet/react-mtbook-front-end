import { useCurrentApp } from "components/context/app.context";
import React from 'react';
import { Button, Result } from 'antd';
import { useLocation, Link } from "react-router-dom";

interface IProps {
	children: React.ReactNode
}

const ProtectedRoute = (props: IProps) => {
	const { isAuthenticated, user } = useCurrentApp();
	const location = useLocation();

	if (isAuthenticated === false) {
		return (
			<Result
				status="404"
				title="Bạn chưa đăng nhập!"
				subTitle="Vui lòng đăng nhập để sử dụng tính năng này"
				extra={<Button type="primary"><Link to="/login" > Đăng nhập</Link ></Button>}
			/>
		)
	}

	const isAdminRole = location.pathname.includes('admin');
	if (isAuthenticated === true && isAdminRole === true) {
		const role = user?.role;
		if (role === 'USER') {
			return (
				<Result
					status="403"
					title="403"
					subTitle="Bạn không có quyền truy cập trang này!"
					extra={<Button type="primary">
						<Link to="/" > Trang chủ</Link >
					</Button>}
				/>
			)
		}
	}

	return (
		<>{props.children}</>
	)
}

export default ProtectedRoute
