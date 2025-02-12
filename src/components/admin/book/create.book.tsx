import { useEffect, useState } from 'react';
import {
	App,
	Col, Divider, Form, Image, Input,
	InputNumber, Modal, Row, Select, Upload
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { uploadFileAPI, getCategoryAPI } from '@/services/api';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { MAX_UPLOAD_IMAGE_SIZE } from '@/services/helper';
import { UploadChangeParam } from 'antd/es/upload';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type UserUploadType = 'thumbnail' | 'slider';

interface IProps {
	openModalCreate: boolean;
	setOpenModalCreate: (v: boolean) => void;
}

type FieldType = {
	mainText: string;
	author: string;
	price: number;
	category: string;
	quantity: number;
	thumbnail: any;
	slider: any;
};

export const CreateBook = (props: IProps) => {

	const { openModalCreate, setOpenModalCreate } = props;
	const { message, notification } = App.useApp();
	const [form] = Form.useForm();
	const [isSubmit, setIsSubmit] = useState(false);

	const [listCategory, setListCategory] = useState<{
		label: string;
		value: string;
	}[]>([]);

	const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
	const [loadingSlider, setLoadingSlider] = useState<boolean>(false);
	const [previewOpen, setPreviewOpen] = useState<boolean>(false);
	const [previewImage, setPreviewImage] = useState<string>('');

	const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
	const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);

	useEffect(() => {
		const fetchCategory = async () => {
			const res = await getCategoryAPI();
			if (res && res.data) {
				const d = res.data.map(item => {
					return { label: item, value: item }
				})
				setListCategory(d);
			}
		}
		fetchCategory();
	}, [])

	const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
		setIsSubmit(true)

		console.log('value form: ', values, fileListThumbnail, fileListSlider);
		console.log('value fileListThumbnail: ', fileListThumbnail);
		console.log('value fileListSlider: ', fileListSlider);

		setIsSubmit(false)
	};

	const getBase64 = (file: FileType): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});
	}

	const beforeUpload = (file: FileType) => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isJpgOrPng) {
			message.error('You can only upload JPG/PNG file!');
			return false;
		}
		const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
		if (!isLt2M) {
			message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
			return false;
		}
		return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
	};

	const handlePreview = async (file: UploadFile) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj as FileType);
		}
		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
	};

	const handleRemove = async (file: UploadFile, type: UserUploadType) => {
		if (type === 'thumbnail') {
			setFileListThumbnail([]);
		}
		if (type === 'slider') {
			const newSlider = fileListSlider.filter(item => item.uid !== file.uid);
			setFileListSlider(newSlider);
		}
	}

	const handleChange = (info: UploadChangeParam, type: "thumbnail" | "slider") => {
		if (info.file.status === 'uploading') {
			type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
			return;
		}
		if (info.file.status === 'done') {
			// Get this url from response in real world.
			type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);

		}
	};

	const handleUploadFile = async (options: RcCustomRequestOptions, type: UserUploadType) => {
		const { onSuccess } = options;
		const file = options.file as UploadFile;
		const res = await uploadFileAPI(file, 'book');

		if (res.data) {
			const uploadedFile: any = {
				uid: file.uid,
				name: res.data.fileUploaded,
				status: 'done',
				url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`
			}

			if (type === "thumbnail") {
				setFileListThumbnail([{ ...uploadedFile }])
			} else {
				setFileListSlider((prevState) => [...prevState, { ...uploadedFile }])
			}

			if (onSuccess) {
				onSuccess("ok")
			}
		} else {
			message.error(res.message);
		}


	}

	const normFile = (e: any) => {
		console.log('Upload event:', e);
		if (Array.isArray(e)) {
			return e;
		}
		return e?.fileList;
	};

	return (
		<>
			<Modal
				title="Add new book"
				open={openModalCreate}
				onOk={() => { form.submit() }}
				onCancel={() => {
					form.resetFields();
					setFileListSlider([]);
					setFileListThumbnail([]);
					setOpenModalCreate(false);
				}}
				destroyOnClose={true}
				okButtonProps={{ loading: isSubmit }}
				okText={"Tạo mới"}
				cancelText={"Hủy"}
				confirmLoading={isSubmit}
				width={"50vw"}
				maskClosable={false}
			>
				<Divider />
				<Form
					form={form}
					name="form-create-book"
					onFinish={onFinish}
					autoComplete="off"
				>
					<Row gutter={15}>
						<Col span={12}>
							<Form.Item<FieldType>
								labelCol={{ span: 24 }}
								label="Book name"
								name="mainText"
								rules={[{ required: true, message: 'Please input book name!' }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item<FieldType>
								labelCol={{ span: 24 }}
								label="Author"
								name="author"
								rules={[{ required: true, message: 'Please input author!' }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item<FieldType>
								labelCol={{ span: 24 }}
								label="Price"
								name="price"
								rules={[{ required: true, message: 'Please input price!' }]}
							>
								<InputNumber
									min={1}
									style={{ width: '100%' }}
									formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									addonAfter=" đ"
								/>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item<FieldType>
								labelCol={{ span: 24 }}
								label="Category"
								name="category"
								rules={[{ required: true, message: 'Please select category!' }]}
							>
								<Select
									showSearch
									allowClear
									options={listCategory}
								/>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item<FieldType>
								labelCol={{ span: 24 }}
								label="Quantity"
								name="quantity"
								rules={[{ required: true, message: 'Please input quantity!' }]}
							>
								<InputNumber min={1} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item<FieldType>
								labelCol={{ span: 24 }}
								label="Image Thumbnail"
								name="thumbnail"
								rules={[{ required: true, message: 'Please upload thumbnail!' }]}
								//convert value from Upload => form
								valuePropName="fileList"
								getValueFromEvent={normFile}
							>
								<Upload
									listType="picture-card"
									className="avatar-uploader"
									maxCount={1}
									multiple={false}
									customRequest={(options) => {
										handleUploadFile(options, 'thumbnail')
									}}
									beforeUpload={beforeUpload}
									onChange={(info) => handleChange(info, 'thumbnail')}
									onPreview={handlePreview}
									onRemove={(file) => handleRemove(file, 'thumbnail')}
									fileList={fileListThumbnail}
								>
									<div>
										{loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
										<div style={{ marginTop: 8 }}>Upload</div>
									</div>
								</Upload>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item<FieldType>
								labelCol={{ span: 24 }}
								label="Images Slider"
								name="slider"
								rules={[{ required: true, message: 'Please upload slider!' }]}
								//convert value from Upload => form
								valuePropName="fileList"
								getValueFromEvent={normFile}
							>
								<Upload
									multiple
									listType="picture-card"
									className="avatar-uploader"
									customRequest={(options) => {
										handleUploadFile(options, 'slider')
									}}
									beforeUpload={beforeUpload}
									onChange={(info) => handleChange(info, 'slider')}
									onPreview={handlePreview}
									onRemove={(file) => handleRemove(file, 'slider')}
									fileList={fileListSlider}
								>
									<div>
										{loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
										<div style={{ marginTop: 8 }}>Upload</div>
									</div>
								</Upload>
							</Form.Item>
						</Col>
					</Row>
				</Form>
				{previewImage && (
					<Image
						wrapperStyle={{ display: 'none' }}
						preview={{
							visible: previewOpen,
							onVisibleChange: (visible) => setPreviewOpen(visible),
							afterOpenChange: (visible) => !visible && setPreviewImage(''),
						}}
						src={previewImage}
					/>
				)}
			</Modal>
		</>
	);
}
