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
import ProtectedRoute from '@/components/auth';

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
			{
				path: "/checkout",
				element: (<ProtectedRoute><div>Checkout Page</div></ProtectedRoute>),
			},
			{
				path: "/admin",
				element: (<ProtectedRoute><div>Admin Page</div></ProtectedRoute>),
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
		<App message={{ maxCount: 2 }} notification={{ placement: "topRight" }}>
			<AppProvider>
				<RouterProvider router={router} />
			</AppProvider>
		</App>
	</StrictMode>,
)
