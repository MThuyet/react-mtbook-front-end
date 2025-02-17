import { Row, Col, Card, Statistic } from 'antd';
import CountUp from 'react-countup';
import type { StatisticProps } from 'antd';
import { useEffect, useState } from 'react';
import { getDashboardAPI } from '@/services/api';

const formatter: StatisticProps['formatter'] = (value) => (
	<CountUp end={value as number} separator="," />
);

const AdminDashboard = () => {
	const [dataDashboard, setDataDashboard] = useState<IDashboard | null>({
		countOrder: 0,
		countUser: 0,
		countBook: 0
	});

	useEffect(() => {
		const fetchDashboard = async () => {
			const res = await getDashboardAPI();
			if (res && res.data) {
				setDataDashboard(res.data);
			}
		}
		fetchDashboard();
	}, [])

	return (
		<Row gutter={[40, 40]}>
			<Col span={8}>
				<Card title="" bordered={false} >
					<Statistic
						title="Total User"
						value={dataDashboard?.countUser}
						formatter={formatter}
					/>
				</Card>
			</Col>
			<Col span={8}>
				<Card title="" bordered={false} >
					<Statistic title="Total Order" value={dataDashboard?.countOrder} precision={2} formatter={formatter} />
				</Card>
			</Col>
			<Col span={8}>
				<Card title="" bordered={false} >
					<Statistic title="Total Book" value={dataDashboard?.countBook} precision={2} formatter={formatter} />
				</Card>
			</Col>
		</Row>
	)
}

export default AdminDashboard
