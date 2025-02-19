import { useState } from 'react';
import { FaReact } from 'react-icons/fa'
import { FiShoppingCart } from 'react-icons/fi';
import { VscSearchFuzzy } from 'react-icons/vsc';
import { Divider, Badge, Drawer, Avatar, Popover } from 'antd';
import { Dropdown, Space, App, Empty } from 'antd';
import { useNavigate } from 'react-router';
import './app.header.scss';
import { Link } from 'react-router-dom';
import { useCurrentApp } from 'components/context/app.context';
import { logoutAPI } from '@/services/api';
import ManageAccount from '../client/account';
import { BrowserView, MobileView } from 'react-device-detect';

interface IProps {
	searchTerm: string;
	setSearchTerm: (v: string) => void;
}

const AppHeader = (props: IProps) => {
	const [openDrawer, setOpenDrawer] = useState(false);
	const [openManageAccount, setOpenManageAccount] = useState<boolean>(false);

	const { isAuthenticated, user, setUser, setIsAuthenticated, carts, setCarts } = useCurrentApp();

	const { message } = App.useApp();

	const navigate = useNavigate();

	const handleLogout = async () => {
		//todo
		const res = await logoutAPI();
		if (res.data) {
			setUser(null);
			setCarts([]);
			setIsAuthenticated(false);
			localStorage.removeItem('access_token');
			localStorage.removeItem('carts');
			message.success('Đã đăng xuất tài khoản');
		}
	}

	let items = [
		{
			label: <label
				style={{ cursor: 'pointer' }}
				onClick={() => setOpenManageAccount(true)}
			>Quản lý tài khoản</label>,
			key: 'account',
		},
		{
			label: <Link to="/history">Lịch sử mua hàng</Link>,
			key: 'history',
		},
		{
			label: <label
				style={{ cursor: 'pointer' }}
				onClick={() => handleLogout()}
			>Đăng xuất</label>,
			key: 'logout',
		},

	];
	if (user?.role === 'ADMIN') {
		items.unshift({
			label: <Link to='/admin'>Trang quản trị</Link>,
			key: 'admin',
		})
	}

	const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

	const contentPopover = () => {
		return (
			<div className='pop-cart-body'>
				<div className='pop-cart-content'>
					{carts?.map((book, index) => {
						return (
							<div className='book' key={`book-${index}`}>
								<div className='img-name'>
									<img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />
									<div className='name'>{book?.detail?.mainText}</div>
								</div>
								<div className='price'>
									{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book?.detail?.price ?? 0)}
								</div>
							</div>
						)
					})}
				</div>
				{carts.length > 0 ?
					<div className='pop-cart-footer'>
						<button onClick={() => navigate('/order')}>Xem giỏ hàng</button>
					</div>
					:
					<Empty
						description="Không có sản phẩm trong giỏ hàng"
					/>
				}
			</div>
		)
	}

	return (
		<>
			<div className='header-container'>
				<header className="page-header">
					<div className="page-header__top">
						<div className="page-header__toggle"
							onClick={() => {
								setOpenDrawer(true)
							}}>
							☰
						</div>
						<div className='page-header__logo'>
							<span className='logo'>
								<span onClick={() => navigate('/')}>
									<img src="/src/assets/MTBook.png" alt="" className='icon-logo' />
									<span>MTBook</span>
								</span>
							</span>
							<VscSearchFuzzy className='icon-search' />
							<input
								className="input-search" type={'text'}
								placeholder="Bạn tìm gì hôm nay"
								value={props.searchTerm}
								onChange={(e) => props.setSearchTerm(e.target.value)}
							/>
						</div>

					</div>
					<nav className="page-header__bottom">
						<ul id="navigation" className="navigation">
							<li className="navigation__item">
								<BrowserView>
									<Popover
										className="popover-carts"
										placement="topRight"
										rootClassName="popover-carts"
										title={"Sản phẩm mới thêm"}
										content={contentPopover}
										arrow={true}>
										<Badge
											count={carts?.length ?? 0}
											size={"small"}
											showZero
											onClick={() => navigate('/order')}
										>
											<FiShoppingCart className='icon-cart' />
										</Badge>
									</Popover>
								</BrowserView>

								<MobileView>
									<Badge
										count={carts?.length ?? 0}
										size={"small"}
										showZero
										onClick={() => navigate('/order')}
									>
										<FiShoppingCart className='icon-cart' />
									</Badge>
								</MobileView>
							</li>
							<li className="navigation__item mobile"><Divider type='vertical' /></li>
							<li className="navigation__item mobile">
								{!isAuthenticated ?
									<span onClick={() => navigate('/login')}> Tài Khoản</span>
									:
									<Dropdown menu={{ items }} trigger={['click']}>
										<Space >
											<Avatar src={urlAvatar} />
											{user?.fullName}
										</Space>
									</Dropdown>
								}
							</li>
						</ul>
					</nav>
				</header>
			</div>

			<Drawer
				title="Menu chức năng"
				placement="left"
				onClose={() => setOpenDrawer(false)}
				open={openDrawer}
				width={'70vw'}
			>
				<div className='menu-mobile'>
					{!isAuthenticated ?
						<>
							<p className='menu-item' onClick={() => { navigate('/'); setOpenDrawer(false) }}>Trang chủ</p>
							<p className='menu-item' onClick={() => { navigate('/login'); setOpenDrawer(false) }}>Đăng nhập</p>
						</>
						:
						<>
							<p className='menu-item' onClick={() => { navigate('/'); setOpenDrawer(false) }}>Trang chủ</p>

							<p className='menu-item' onClick={() => { setOpenManageAccount(true); setOpenDrawer(false) }}>Quản lý tài khoản</p>

							<p className='menu-item' onClick={() => { navigate('/history'); setOpenDrawer(false) }}>Lịch sử mua hàng</p>

							<p className='menu-item' onClick={() => { handleLogout(); setOpenDrawer(false) }}>Đăng xuất</p>
						</>
					}
				</div>
			</Drawer>

			<ManageAccount
				isModalOpen={openManageAccount}
				setIsModalOpen={setOpenManageAccount}
			/>

		</>
	)
};

export default AppHeader;
