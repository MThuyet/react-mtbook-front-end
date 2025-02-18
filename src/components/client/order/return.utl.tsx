import { updatePaymentStatusAPI } from "@/services/api";
import { App, Button, Result, Spin } from "antd";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const contentStyle: React.CSSProperties = {
	padding: 50,
	background: 'rgba(0, 0, 0, 0.05)',
	borderRadius: 4,
};

const ReturnURLPage = () => {
	let [searchParams] = useSearchParams();
	const paymentRef = searchParams.get('vnp_TxnRef') ?? '';
	const responseCode = searchParams.get('vnp_ResponseCode') ?? '';

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { message, notification } = App.useApp();

	useEffect(() => {
		if (paymentRef) {
			const changePaymentStatus = async () => {
				setIsLoading(true);

				const res = await updatePaymentStatusAPI(
					responseCode === '00' ? 'PAYMENT_SUCCEDD' : 'PAYMENT_FAILED', paymentRef
				);

				if (res.data) {
				} else {
					notification.error({
						message: 'Có lỗi xảy ra',
						description: res.message && Array.isArray(res.message)
							? res.message[0] : res.message,
						duration: 5
					})
				}

				setIsLoading(false);
			}
			changePaymentStatus();
		}
	}, [paymentRef]);

	return (
		<>
			{isLoading ?
				<Spin tip="Loading" size="large">
					<div style={contentStyle}></div>
				</Spin>
				:
				<>
					{responseCode === '00'
						?
						<Result
							status="success"
							title="Đặt hàng thành công"
							subTitle="Hệ thống đã ghi nhận thông tin đơn hàng của bạn"
							extra={[
								<Button type="primary" key="console">
									<Link to={'/'}>Trang chủ</Link>
								</Button>,
								<Button key="hisory">
									<Link to={'/history'}>
										Xem lịch sử mua hàng
									</Link>
								</Button>,
							]}
						/>
						:
						<Result
							status="error"
							title="Giao dịch thanh toán không thành công"
							subTitle="Vui lòng liên hệ admin để được hỗ trợ!"
							extra={[
								<Button type="primary" key="console">
									<Link to={'/'}>Trang chủ</Link>
								</Button>
							]}
						></Result>
					}
				</>
			}


		</>
	)

}

export default ReturnURLPage
