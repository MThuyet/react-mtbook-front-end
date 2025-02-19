import React, { useState } from 'react';
import {
	AppstoreOutlined,
	ExceptionOutlined,
	HeartTwoTone,
	UserOutlined,
	DollarCircleOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, Avatar } from 'antd';
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useCurrentApp } from '../context/app.context';
import type { MenuProps } from 'antd';
import { logoutAPI } from '@/services/api';
import { useEffect } from "react";
import { BrowserView, MobileView } from 'react-device-detect';
import { Button, Result } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const { Content, Footer, Sider } = Layout;

const LayoutAdmin = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [activeMenu, setActiveMenu] = useState('dashboard');
	const { user, isAuthenticated, setUser, setIsAuthenticated, setCarts } = useCurrentApp();
	const location = useLocation();

	const handleLogout = async () => {
		//todo
		const res = await logoutAPI();
		if (res.data) {
			setUser(null);
			setCarts([]);
			setIsAuthenticated(false);
			localStorage.removeItem("access_token");
			localStorage.removeItem("carts")
		}
	}

	const items: MenuItem[] = [
		{
			label: <Link to='/admin'>Dashboard</Link>,
			key: '/admin',
			icon: <AppstoreOutlined />
		},
		{
			label: <Link to='/admin/user'>Manage User</Link>,
			key: '/admin/user',
			icon: <UserOutlined />,
		},
		{
			label: <Link to='/admin/book'>Manage Books</Link>,
			key: '/admin/book',
			icon: <ExceptionOutlined />
		},
		{
			label: <Link to='/admin/order'>Manage Orders</Link>,
			key: '/admin/order',
			icon: <DollarCircleOutlined />
		},
	];

	useEffect(() => {
		const active: any = items.find(item => location.pathname === (item!.key as any)) ?? "/admin";
		setActiveMenu(active.key);
	}, [location]);

	const itemsDropdown = [
		{
			label: <Link to={'/'}>Trang chủ</Link>,
			key: 'home',
		},
		{
			label: <label
				style={{ cursor: 'pointer' }}
				onClick={() => handleLogout()}
			>Đăng xuất</label>,
			key: 'logout',
		},

	];

	const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

	if (isAuthenticated === false) {
		return (
			<Outlet />
		)
	}

	const isAdminRole = location.pathname.includes('admin');
	if (isAuthenticated === true && isAdminRole === true) {
		const role = user?.role;
		if (role === 'USER') {
			return (
				<Outlet />
			)
		}
	}

	return (
		<>
			<BrowserView>
				<Layout
					style={{ minHeight: '100vh' }}
					className="layout-admin"
				>
					<Sider
						theme='light'
						collapsible
						collapsed={collapsed}
						onCollapse={(value) => setCollapsed(value)}>
						<div style={{ height: 32, margin: 16, textAlign: 'center' }}>
							Admin
						</div>
						<Menu
							// defaultSelectedKeys={[activeMenu]}
							selectedKeys={[activeMenu]}
							mode="inline"
							items={items}
							onClick={(e) => setActiveMenu(e.key)}
						/>
					</Sider>
					<Layout>
						<div className='admin-header' style={{
							height: "50px",
							borderBottom: "1px solid #ebebeb",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							padding: "0 15px",

						}}>
							<span>
								{React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
									className: 'trigger',
									onClick: () => setCollapsed(!collapsed),
								})}
							</span>
							<Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
								<Space style={{ cursor: "pointer" }}>
									<Avatar src={urlAvatar} />
									{user?.fullName}
								</Space>
							</Dropdown>
						</div>
						<Content style={{ padding: '15px' }}>
							<Outlet />
						</Content>
						<Footer style={{ padding: 0, textAlign: "center" }}>
							React Test Fresher &copy; Mờ Thuyết - Made with <HeartTwoTone />
						</Footer>
					</Layout>
				</Layout>
			</BrowserView>
			<MobileView>
				<Result
					status="warning"
					title="Vui lòng sử dụng máy tính bảng hoặc laptop để sử dụng chức năng này"
					extra={
						<Button type="primary" key="console">
							<Link to="/" > Trang chủ</Link >
						</Button>
					}
				/>
			</MobileView>
		</>
	);
};

export default LayoutAdmin;
