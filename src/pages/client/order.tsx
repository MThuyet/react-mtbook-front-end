import { Steps, Result, Button, Breadcrumb } from 'antd';
import { useState } from "react";
import OrderDetail from "@/components/client/order";
import Payment from "@/components/client/order/payment";
import 'styles/order.scss';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

const OrderPage = () => {
	const [currentStep, setCurrentStep] = useState<number>(0);

	return (
		<div style={{ background: '#efefef', padding: "20px 0" }}>
			<div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
				<div className="order-steps">
					<Breadcrumb
						separator=">"
						items={[
							{
								title: <Link to={"/"}>Trang Chủ</Link>,
							},
							{
								title: 'Chi Tiết Giỏ Hàng',
							},
						]}
					/>
					<div className="order-steps" style={{ marginTop: 10 }}>
						<Steps
							size="small"
							current={currentStep}
							items={[
								{
									title: 'Đơn hàng',
								},
								{
									title: 'Đặt hàng',
								},
								{
									title: 'Thanh toán',
								},
							]}
						/>
					</div>

					{currentStep === 0 &&
						<OrderDetail setCurrentStep={setCurrentStep} />
					}
					{currentStep === 1 &&
						<Payment setCurrentStep={setCurrentStep} />
					}
					{currentStep === 2 &&
						<Result
							status="success"
							title="Đặt hàng thành công"
							subTitle="Hệ thống đã ghi nhận đơn hàng của quý khách. Xin cảm ơn quý khách đã ủng hộ, chúc quý khách một ngày tốt lành! 🎉"
							extra={[
								<Button key="home">
									<Link to="/">Trang chủ</Link>
								</Button>,
								<Button key="history">
									<Link to="/history">Xem lịch sử đặt hàng</Link>
								</Button>,
							]}
						/>
					}
				</div>
			</div>
		</div>
	)
}

export default OrderPage
