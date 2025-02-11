import { Drawer, Descriptions, Divider, Badge } from 'antd'
import dayjs from 'dayjs';
import { FORMATE_DATE_DEFAULT, FORMATE_DATE_VN } from '@/services/helper';
import { Image, Upload } from 'antd';
import { useState, useEffect } from "react";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { v4 as uuidv4 } from 'uuid';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
interface IProps {
	openViewDetail: boolean;
	dataViewDetail: IBookTable | null;
	setOpenViewDetail: (v: boolean) => void;
	setDataViewDetail: (v: IBookTable | null) => void;
}

export const DetailBook = (props: IProps) => {
	const { openViewDetail, dataViewDetail, setOpenViewDetail, setDataViewDetail } = props;

	// render image
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState("");

	const [fileList, setFileList] = useState<UploadFile[]>([]);

	const getBase64 = (file: FileType): Promise<string> =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});

	const handlePreview = async (file: UploadFile) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj as FileType);
		}
		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
	};

	const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
		setFileList(newFileList);
	};

	// close modal
	const onClose = () => {
		setOpenViewDetail(false);
		setDataViewDetail(null);
		setFileList([]);
	}

	useEffect(() => {
		if (dataViewDetail) {
			let arrImage = [dataViewDetail?.thumbnail, ...dataViewDetail?.slider || []];

			let listImage: UploadFile[] = arrImage.map((item) => {
				return {
					uid: uuidv4() || '',
					name: item || '',
					status: 'done',
					url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}` || '',
				}
			})

			setFileList(listImage);
		}
	}, [dataViewDetail])

	return (
		<Drawer
			size={'large'}
			onClose={onClose}
			open={openViewDetail}
		// extra={
		// 	<Space>
		// 		<Button onClick={onClose}>Cancel</Button>
		// 		<Button type="primary" onClick={onClose}>
		// 			OK
		// 		</Button>
		// 	</Space>
		// }
		>

			<Descriptions title="Book info detail" bordered column={2}>
				<Descriptions.Item label="ID">{dataViewDetail?._id}</Descriptions.Item>
				<Descriptions.Item label="Category">
					<Badge status="processing" text={dataViewDetail?.category} />
				</Descriptions.Item>
				<Descriptions.Item label="Book name" span={2}>{dataViewDetail?.mainText}</Descriptions.Item>
				<Descriptions.Item label="Author">{dataViewDetail?.author}</Descriptions.Item>
				<Descriptions.Item label="Price">
					{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataViewDetail?.price ?? 0)}
				</Descriptions.Item>
				<Descriptions.Item label="Sold">{dataViewDetail?.sold}</Descriptions.Item>
				<Descriptions.Item label="Quantity">{dataViewDetail?.quantity}</Descriptions.Item>
				<Descriptions.Item label="Created At">
					{dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_DEFAULT)}
				</Descriptions.Item>
				<Descriptions.Item label="Updated At">
					{dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE_DEFAULT)}
				</Descriptions.Item>
			</Descriptions>

			<Divider orientation='left' >Book Images</Divider>

			<Upload
				action={`${import.meta.env.VITE_BACKEND_URL}/upload/book`}
				listType="picture-card"
				fileList={fileList}
				onPreview={handlePreview}
				onChange={handleChange}
				showUploadList={{
					showRemoveIcon: false
				}}
			></Upload>
			{previewImage && (
				<Image
					wrapperStyle={{ display: "none" }}
					preview={{
						visible: previewOpen,
						onVisibleChange: (visible) => setPreviewOpen(visible),
						afterOpenChange: (visible) => !visible && setPreviewImage(""),
					}}
					src={previewImage}
				/>
			)}

		</Drawer>
	)
}
