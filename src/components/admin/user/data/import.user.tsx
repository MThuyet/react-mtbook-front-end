import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { Table, message } from "antd";

interface IProps {
	openModalImport: boolean;
	setOpenModalImport: (v: boolean) => void;
}

const { Dragger } = Upload;



const ImportUser = (props: IProps) => {

	const { setOpenModalImport, openModalImport } = props;

	const propsUpload: UploadProps = {
		name: 'file',
		multiple: false,
		maxCount: 1,

		// https://stackoverflow.com/questions/11832930/html-input-file-accept-attribute-file-type-csv
		accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

		// https://stackoverflow.com/questions/51514757/action-function-is-required-with-antd-upload-control-but-i-dont-need-it
		customRequest({ file, onSuccess }) {
			setTimeout(() => {
				if (onSuccess) onSuccess("ok");
			}, 1000);
		},

		onChange(info) {
			const { status } = info.file;
			if (status !== 'uploading') {
				console.log(info.file, info.fileList);
			}
			if (status === 'done') {
				message.success(`${info.file.name} file uploaded successfully.`);
			} else if (status === 'error') {
				message.error(`${info.file.name} file upload failed.`);
			}
		},

		onDrop(e) {
			console.log('Dropped files', e.dataTransfer.files);
		},
	};

	return (
		<Modal
			title="Import User"
			open={openModalImport}
			onOk={() => { setOpenModalImport(false) }}
			onCancel={() => {
				setOpenModalImport(false);
			}}
			okText={"Import"}
			cancelText={"Cancel"}
			maskClosable={false}
			centered
			okButtonProps={{
				disabled: true
			}}
		>
			<Dragger {...propsUpload}>
				<p className="ant-upload-drag-icon">
					<InboxOutlined />
				</p>
				<p className="ant-upload-text">Click or drag file to this area to upload</p>
				<p className="ant-upload-hint">
					Support for a single or bulk upload. Strictly prohibited from uploading company data or other
					banned files.
				</p>
			</Dragger>

			<Table
				title={() => <span>Data import:</span>}
				columns={[
					{ dataIndex: 'fullName', title: 'Full name' },
					{ dataIndex: 'email', title: 'Email' },
					{ dataIndex: 'phone', title: 'Phone' },
				]}
			/>

		</Modal>
	)

}

export default ImportUser
