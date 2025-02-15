import { Row, Col, Skeleton, Spin } from "antd";

const BookLoader = () => {

	return (
		<>
			<Col md={24} sm={0} xs={0}>
				<div style={{ background: '#efefef', padding: '20px 0' }}>
					<div className="book-loader-container" style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
						<div style={{ padding: '20px', background: '#fff', borderRadius: 5 }}>
							<Row>
								<Col md={10} sm={24} xs={24}>
									<div style={{ display: 'flex', gap: '20px' }}>
										<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
											<Skeleton.Image active={true} />
										</div>

										<Skeleton.Node active={true} style={{ width: '400px', height: '400px' }} />
									</div>
								</Col>
								<Col md={14} sm={24} xs={24}>
									<div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
										<Skeleton.Input active={true} />
										<Skeleton.Input active={true} style={{ width: '600px' }} />
										<Skeleton.Input active={true} style={{ width: '800px', height: '100px' }} />
										<Skeleton.Input active={true} style={{ width: '200px' }} />
										<Skeleton.Input active={true} />
										<Skeleton.Input active={true} />
									</div>
								</Col>
							</Row>
						</div>
					</div>
				</div>
			</Col>
			<Col md={0} sm={24} xs={24}>
				<Spin spinning={true} tip="Loading..." style={{ marginTop: '20px' }}>
					<div style={{ background: '#efefef', padding: '20px 0' }}></div>
				</Spin>
			</Col>
		</>
	);
};

export default BookLoader;
