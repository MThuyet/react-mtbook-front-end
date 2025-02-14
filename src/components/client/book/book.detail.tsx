import { Row, Col } from "antd";
import 'styles/book.scss';
import ImageGallery from "react-image-gallery";
import { Rate, InputNumber, Image, Carousel } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useParams, } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const images = [
	{
		original: 'https://picsum.photos/id/1018/1000/600/',
		thumbnail: 'https://picsum.photos/id/1018/250/150/',
		originalClass: "original-image",
		thumbnailClass: "thumbnail-image"
	},
	{
		original: 'https://picsum.photos/id/1015/1000/600/',
		thumbnail: 'https://picsum.photos/id/1015/250/150/',
		originalClass: "original-image",
		thumbnailClass: "thumbnail-image"
	},
	{
		original: 'https://picsum.photos/id/1019/1000/600/',
		thumbnail: 'https://picsum.photos/id/1019/250/150/',
		originalClass: "original-image",
		thumbnailClass: "thumbnail-image"
	},
	{
		original: 'https://picsum.photos/id/1018/1000/600/',
		thumbnail: 'https://picsum.photos/id/1018/250/150/',
		originalClass: "original-image",
		thumbnailClass: "thumbnail-image"
	},
	{
		original: 'https://picsum.photos/id/1015/1000/600/',
		thumbnail: 'https://picsum.photos/id/1015/250/150/',
		originalClass: "original-image",
		thumbnailClass: "thumbnail-image"
	},
	{
		original: 'https://picsum.photos/id/1019/1000/600/',
		thumbnail: 'https://picsum.photos/id/1019/250/150/',
		originalClass: "original-image",
		thumbnailClass: "thumbnail-image"
	},
	{
		original: 'https://picsum.photos/id/1018/1000/600/',
		thumbnail: 'https://picsum.photos/id/1018/250/150/',
		originalClass: "original-image",
		thumbnailClass: "thumbnail-image"
	},
];

const BookDetail = () => {
	const { id } = useParams();

	return (
		<>
			<div style={{ background: '#efefef', padding: '20px 0' }}>
				<div className="view-detail-book" style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
					<div style={{ padding: '20px', background: '#fff', borderRadius: 5 }}>
						<Row gutter={[20, 20]}>
							{/* show list image */}
							<Col md={10} xs={0}>
								<ImageGallery
									items={images}
									showFullscreenButton={false}
									showPlayButton={false}
									showNav={false}
									infinite={true}
									showIndex={true}
									renderItem={item => (
										<Image src={item.original} />
									)}
								/>
							</Col>

							<Col md={0} xs={24}>
								<ImageGallery
									items={images}
									showFullscreenButton={false}
									showPlayButton={false}
									showNav={true}
									showThumbnails={false}
									renderItem={item => (
										<Image src={item.original} />
									)}
									infinite={true}
								/>
							</Col>

							{/*content  */}
							<Col md={14} xs={24}>
								<Col md={0}>
								</Col>
								<Col span={24}>
									<div className="content">
										<div className="author">
											<span>Tác giả:</span>
											<a href="#">Mờ Thuyết</a>
										</div>

										<div className="name">How Psychology Works - Hiểu Hết Về Tâm Lý Học</div>

										<div className="description">
											Mỗi quyển sách là một kho tàng tri thức vô giá, không chỉ lưu giữ những câu chuyện, ý tưởng và bài học quý báu mà còn mở ra cánh cửa dẫn đến những thế giới mới lạ, giúp con người hiểu sâu hơn về chính mình và cuộc sống xung quanh. Dù là những trang sách về lịch sử, khoa học, văn học hay triết học, mỗi cuốn sách đều mang trong mình sức mạnh thay đổi tư duy, nuôi dưỡng tâm hồn và truyền cảm hứng cho những hành trình khám phá vô tận của con người.
										</div>

										<div className="rate">
											<Rate disabled defaultValue={5} style={{ fontSize: 16 }} />
											<span style={{ color: '#80868b' }}>Đã bán 29</span>
										</div>

										<div className="price">
											{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(79000)}
										</div>

										<div className="delivery" style={{ marginBottom: '10px' }}>
											<span className="title">Vận chuyển</span>
											<span className="content">Miễn phí vận chuyển</span>
										</div>

										<div className="quantity">
											<span className="title">Số lượng</span>
											<span className="content">
												<InputNumber min={1} defaultValue={1} />
											</span>
										</div>

										<div className="buy">
											<button>
												<ShoppingCartOutlined />
												<span>Thêm vào giỏ hàng</span>
											</button>

											<button>Mua ngay</button>
										</div>
									</div>
								</Col>
							</Col>
						</Row>
					</div>
				</div>
			</div>
		</>
	)
}

export default BookDetail
