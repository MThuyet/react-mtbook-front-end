import 'styles/book.scss';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { Rate, InputNumber, Image, Breadcrumb, Row, Col, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useCurrentApp } from "components/context/app.context";
import { Link, useNavigate } from 'react-router-dom';

interface IProps {
	currentBook: IBookTable | null,
}

const BookDetail = (props: IProps) => {
	// use context
	const { setCarts, user } = useCurrentApp();
	const navigate = useNavigate();

	const { currentBook } = props;
	const [valueQuantity, setValueQuantity] = useState<number>(1);

	const [images, setImages] = useState<
		{
			original: string,
			thumbnail: string,
			originalClass: string,
			thumbnailClass: string
		}[]
	>([]);

	// show list image
	useEffect(() => {
		if (currentBook) {
			let arrImage = [currentBook.thumbnail, ...currentBook.slider];
			setImages(arrImage.map((item: string) => {
				return {
					original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
					thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
					originalClass: 'original-image',
					thumbnailClass: 'thumbnail-image'
				}
			}));
		}
	}, [currentBook]);

	// handle add to cart
	const handleAddToCart = (isBuyNow = false) => {
		if (!user) {
			message.error("Bạn cần đăng nhập để thực hiện tính năng này.")
			return;
		}
		const cartStorage = localStorage.getItem("carts");
		if (cartStorage && currentBook) {
			//update
			const carts = JSON.parse(cartStorage) as ICart[];
			//check exist
			let isExistIndex = carts.findIndex(c => c._id === currentBook?._id);
			if (isExistIndex > -1) {
				carts[isExistIndex].quantity =
					carts[isExistIndex].quantity + valueQuantity;
			} else {
				carts.push({
					quantity: valueQuantity,
					_id: currentBook._id,
					detail: currentBook
				})
			}

			localStorage.setItem("carts", JSON.stringify(carts));

			//sync React Context
			setCarts(carts);
		} else {
			//create
			const data = [{
				_id: currentBook?._id!,
				quantity: valueQuantity,
				detail: currentBook!
			}]
			localStorage.setItem("carts", JSON.stringify(data));

			//sync React Context
			setCarts(data);
		}

		if (isBuyNow) {
			navigate("/order")
		} else {
			message.success("Thêm sản phẩm vào giỏ hàng thành công.")
		}

	};

	return (
		<>
			<div style={{ background: '#efefef', padding: '20px 0' }}>
				<div className="view-detail-book" style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
					<Breadcrumb
						separator=">"
						items={[
							{
								title: <Link to={"/"}>Trang Chủ</Link>,
							},
							{
								title: 'Xem chi tiết sách',
							},
						]}
					/>
					<div style={{ padding: '20px', background: '#fff', borderRadius: 5 }}>
						<Row gutter={[20, 20]}>
							{/* show list image */}
							<Col md={10} xs={0}>
								<ImageGallery
									thumbnailPosition="left"
									disableThumbnailScroll={true}
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
											<a href="#">{currentBook?.author}</a>
										</div>

										<div className="name">{currentBook?.mainText}</div>

										<div className="description">
											Mỗi quyển sách là một kho tàng tri thức vô giá, không chỉ lưu giữ những câu chuyện, ý tưởng và bài học quý báu mà còn mở ra cánh cửa dẫn đến những thế giới mới lạ, giúp con người hiểu sâu hơn về chính mình và cuộc sống xung quanh. Dù là những trang sách về lịch sử, khoa học, văn học hay triết học, mỗi cuốn sách đều mang trong mình sức mạnh thay đổi tư duy, nuôi dưỡng tâm hồn và truyền cảm hứng cho những hành trình khám phá vô tận của con người.
										</div>

										<div className="rate">
											<Rate disabled defaultValue={5} style={{ fontSize: 16 }} />
											<span style={{ color: '#80868b' }}>Đã bán {currentBook?.sold}</span>
										</div>

										<div className="price">
											{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBook?.price ?? 0)}
										</div>

										<div className="delivery" style={{ marginBottom: '10px' }}>
											<span className="title">Vận chuyển</span>
											<span className="content">Miễn phí vận chuyển</span>
										</div>

										<div className="quantity">
											<span className="title">Số lượng</span>
											<span className="content">
												<InputNumber
													value={valueQuantity}
													defaultValue={1}
													min={1}
													max={currentBook?.quantity}
													onChange={(valueChanged) => {
														if (valueChanged) {
															setValueQuantity(valueChanged);
														} else {
															message.error("Vui lòng nhập số lượng ít nhất là 1");
															setValueQuantity(1);
														}

													}}
												/>
											</span>
										</div>

										<div className="buy">
											<button onClick={() => handleAddToCart()}>
												<ShoppingCartOutlined />
												<span>Thêm vào giỏ hàng</span>
											</button>

											<button onClick={() => handleAddToCart(true)} className='now'>Mua ngay</button>
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
