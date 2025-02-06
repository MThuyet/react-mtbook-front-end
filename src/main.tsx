import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from '@/layout'
import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";
import HomePage from 'pages/client/home';
import BookPage from 'pages/client/book';
import AboutPage from 'pages/client/about';
import LoginPage from 'pages/client/auth/login';
import Register from 'pages/client/auth/register';
import 'styles/global.scss';
import { App } from 'antd';
import { AppProvider } from 'components/context/app.context';

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: "/book",
				element: <BookPage />,
			},
			{
				path: "/about",
				element: <AboutPage />,
			},

		],
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/register",
		element: <Register />,
	},

]);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		{/* <Layout /> */}
		<App message={{ maxCount: 2 }} notification={{ placement: "topRight" }}>
			<AppProvider>
				<RouterProvider router={router} />
			</AppProvider>
		</App>
	</StrictMode>,
)
