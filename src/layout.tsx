import { Outlet } from 'react-router-dom'
import AppHeader from './components/layout/app.header'

function Layout() {

	return (

		<div>
			<AppHeader />

			{/* muốn chia sẻ component nào thì sử dụng Outlet */}
			<Outlet />

		</div>

	)
}

export default Layout
