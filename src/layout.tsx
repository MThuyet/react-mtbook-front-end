import { Outlet } from 'react-router-dom'
import AppHeader from './components/layout/app.header'
import { useEffect } from 'react'
import { fetchAccountAPI } from 'services/api'
import { useCurrentApp } from './components/context/app.context'
import PacmanLoader from 'react-spinners/PacmanLoader'

function Layout() {

	const { setUser, isAppLoading, setisAppLoading, setIsAuthenticated } = useCurrentApp();

	useEffect(() => {
		const fetchAccount = async () => {
			const res = await fetchAccountAPI();
			if (res.data) {
				setUser(res.data.user);
				setIsAuthenticated(true);
			}
			setisAppLoading(false)
		}

		fetchAccount()
	}, [])

	return (
		<>
			{isAppLoading === false ? <div>
				<AppHeader />
				{/* muốn chia sẻ component nào thì sử dụng Outlet */}
				<Outlet />
			</div> : <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
				<PacmanLoader color='#36d6b4' size={50} />
				<h2 style={{ marginTop: "1rem" }}>Loading...</h2>
			</div>}



		</>
	)
}

export default Layout
