import { useState } from 'react';
import { App, Divider, Form, Input, Modal } from 'antd';
import type { FormProps } from 'antd';
import { createUserAPI } from '@/services/api';

interface IProps {
	openModalCreate: boolean;
	setOpenModalCreate: (v: boolean) => void;
	refreshTable: () => void;
}

type FieldType = {
	fullName: string;
	password: string;
	email: string;
	phone: string;
};

const CreateUser = (props: IProps) => {
	const { openModalCreate, setOpenModalCreate, refreshTable } = props;
	const [isSubmit, setIsSubmit] = useState<boolean>(false);
	const { message, notification } = App.useApp();

	const [form] = Form.useForm();

	const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
		const { fullName, password, email, phone } = values;
		setIsSubmit(true)
		const res = await createUserAPI(fullName, password, email, phone);
		if (res && res.data) {
			message.success('Create user successfully');
			form.resetFields();
			setOpenModalCreate(false);
			refreshTable();
		} else {
			notification.error({
				message: 'Create user fail',
				description: res.message
			})
		}
		setIsSubmit(false)
	};
	return (
		<>
			<Modal
				title="Add a new user"
				open={openModalCreate}
				onOk={() => { form.submit() }}
				onCancel={() => {
					setOpenModalCreate(false);
					form.resetFields();
				}}
				okText={"Add new"}
				cancelText={"Cancel"}
				confirmLoading={isSubmit}
			>
				<Divider />
				<Form
					form={form}
					name="basic"
					style={{ maxWidth: 600 }}
					onFinish={onFinish}
					autoComplete="off"
				>
					<Form.Item<FieldType>
						labelCol={{ span: 24 }}
						label="Full name"
						name="fullName"
						rules={[{ required: true, message: 'Please input your full name!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item<FieldType>
						labelCol={{ span: 24 }}
						label="Password"
						name="password"
						rules={[{ required: true, message: 'Please input your password!' }]}
					>
						<Input.Password />
					</Form.Item>
					<Form.Item<FieldType>
						labelCol={{ span: 24 }}
						label="Email"
						name="email"
						rules={[
							{ required: true, message: 'Please input your email!' },
							{ type: "email", message: 'Please input a valid email!' },
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item<FieldType>
						labelCol={{ span: 24 }}
						label="Phone"
						name="phone"
						rules={[{ required: true, message: 'Please input your phone!' }]}
					>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};
export default CreateUser;
