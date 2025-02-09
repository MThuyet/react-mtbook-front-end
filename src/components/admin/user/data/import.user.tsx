import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { Table, App } from "antd";
import { useState } from 'react';
import ExcelJS from "exceljs";
import { Buffer } from 'buffer';
import { bulkCreateUserAPI } from '@/services/api';

interface IProps {
	openModalImport: boolean;
	setOpenModalImport: (v: boolean) => void;
	refreshTable: () => void
}

interface IDataImport {
	fullName: string;
	email: string;
	phone: string;
}

const { Dragger } = Upload;

const ImportUser = (props: IProps) => {

	const { setOpenModalImport, openModalImport, refreshTable } = props;
	const { message, notification } = App.useApp();
	const [isSubmit, setIsSubmit] = useState<boolean>(false);
	const [dataImport, setDataImport] = useState<IDataImport[]>([]);

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

		async onChange(info) {
			const { status } = info.file;
			if (status !== 'uploading') {
				console.log('info not uploading', info)
			}
			if (status === 'done') {
				console.log('info file list', info.fileList);
				message.success(`${info.file.name} file uploaded successfully.`);
				if (info.fileList && info.fileList.length > 0) {
					const file = info.fileList[0].originFileObj;

					// load file to buffer
					const workbook = new ExcelJS.Workbook();
					const arrayBuffer = await file?.arrayBuffer();
					const buffer = Buffer.from(arrayBuffer!);
					await workbook.xlsx.load(buffer);

					// convert to json
					let jsonData: IDataImport[] = [];
					workbook.worksheets.forEach(function (sheet) {
						// read first row as data keys
						let firstRow = sheet.getRow(1);
						if (!firstRow.cellCount) return;
						let keys = firstRow.values as any[];
						sheet.eachRow((row, rowNumber) => {
							if (rowNumber == 1) return;
							let values = row.values as any[];
							let obj: any = {};
							for (let i = 1; i < keys.length; i++) {
								obj[keys[i]] = values[i];
							}
							jsonData.push(obj);
						})

					});

					let lastJsonData = jsonData.map((item, index) => {
						return {
							id: index + 1, ...item
						}
					})
					setDataImport(lastJsonData);
					console.log('lastJsonData', lastJsonData);
				}
			} else if (status === 'error') {
				message.error(`${info.file.name} file upload failed.`);
			}
		},

		onDrop(e) {
			console.log('Dropped files', e.dataTransfer.files);
		},
	};

	const handleImport = async () => {
		setIsSubmit(true);

		const dataSubmit = dataImport.map((item) => {
			return {
				fullName: item.fullName,
				password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD,
				email: item.email,
				phone: item.phone
			}
		})

		const res = await bulkCreateUserAPI(dataSubmit);
		if (res.data) {
			notification.success({
				message: 'Import users',
				description: `Success: ${res.data.countSuccess}, Fail: ${res.data.countError}`
			})
		}

		setIsSubmit(false);
		setDataImport([]);
		setOpenModalImport(false);
		refreshTable();

	}

	return (
		<Modal
			width={'50vw'}
			title="Import User"
			open={openModalImport}
			onOk={() => handleImport()}
			onCancel={() => {
				setOpenModalImport(false);
				setDataImport([]);
			}}
			okText={"Import"}
			cancelText={"Cancel"}
			maskClosable={false}
			centered
			destroyOnClose={true}
			okButtonProps={{
				disabled: dataImport.length > 0 ? false : true,
				loading: isSubmit
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

			<div style={{ paddingTop: 20 }}>
				<Table
					title={() => <span>Data import:</span>}
					dataSource={dataImport}
					rowKey={"id"}
					columns={[
						{ dataIndex: 'fullName', title: 'Full name' },
						{ dataIndex: 'email', title: 'Email' },
						{ dataIndex: 'phone', title: 'Phone' },
					]}
				/>
			</div>

		</Modal >
	)

}

export default ImportUser
