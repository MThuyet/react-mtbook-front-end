import { useEffect, useState } from 'react';
import { App, Divider, Form, Input, Modal } from 'antd';
import type { FormProps } from 'antd';
import { updateUserAPI } from '@/services/api';

interface IProps {
	openModalUpdate: boolean;
	setOpenModalUpdate: (v: boolean) => void;
	dataUpdateUser: IUserTable | null;
	setDataUpdateUser: (v: any) => void;
	refreshTable: () => void;
}

type FieldType = {
	_id: string;
	email: string;
	fullName: string;
	phone: string;
};

const UpdateUser = (props: IProps) => {

	const { openModalUpdate, setOpenModalUpdate, refreshTable, dataUpdateUser, setDataUpdateUser } = props;
	const [isSubmit, setIsSubmit] = useState<boolean>(false);
	const { message, notification } = App.useApp();

	// https://ant.design/components/form/
	const [form] = Form.useForm();

	const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
		const { _id, fullName, phone } = values;
		console.log('values update', values);
		setIsSubmit(true)
		const res = await updateUserAPI(_id, fullName, phone);
		if (res && res.data) {
			message.success('Update user successfully');
			form.resetFields();
			setOpenModalUpdate(false);
			setDataUpdateUser(null);
			refreshTable();
		} else {
			notification.error({
				message: 'Update user fail',
				description: res.message
			})
		}
		setIsSubmit(false)
	};

	useEffect(() => {
		if (dataUpdateUser) {
			form.setFieldsValue(dataUpdateUser)
		}
	}, [form, dataUpdateUser]);

	const handleChangeInput = (name: string, value: string) => {
		setDataUpdateUser({ ...dataUpdateUser, [name]: value });
	}
	return (
		<>
			<Modal
				title="Update user"
				open={openModalUpdate}
				onOk={() => { form.submit() }}
				onCancel={() => {
					setOpenModalUpdate(false);
					setDataUpdateUser(null);
					form.resetFields();
				}}
				okText={"Update"}
				cancelText={"Cancel"}
				confirmLoading={isSubmit}
				okButtonProps={{
					disabled: !form.isFieldsTouched(true),
					loading: isSubmit
				}}
			>
				<Divider />
				<Form
					form={form}
					name="update-user"
					style={{ maxWidth: 600 }}
					onFinish={onFinish}
					autoComplete="off"
				>

					<Form.Item<FieldType>
						labelCol={{ span: 24 }}
						name="_id"
						label="_id"
						hidden
					>
						<Input disabled={true} value={dataUpdateUser?._id} />
					</Form.Item>

					<Form.Item<FieldType>
						labelCol={{ span: 24 }}
						label="Email"
						name="email"
					>
						<Input disabled={true} />
					</Form.Item>

					<Form.Item<FieldType>
						labelCol={{ span: 24 }}
						label="Full name"
						name="fullName"
						rules={[{ required: true, message: 'Please input your full name!' }]}
					>
						<Input onChange={(e) => { handleChangeInput('fullName', e.target.value) }} />
					</Form.Item>

					<Form.Item<FieldType>
						labelCol={{ span: 24 }}
						label="Phone"
						name="phone"
						rules={[{ required: true, message: 'Please input your phone!' }]}
					>
						<Input onChange={(e) => { handleChangeInput('phone', e.target.value) }} />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};
export default UpdateUser;
