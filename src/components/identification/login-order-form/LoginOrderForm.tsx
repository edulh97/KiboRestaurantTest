import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import './LoginOrderForm.css';

type LayoutType = Parameters<typeof Form>[0]['layout'];

const LoginOrderForm: React.FC = () => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>('vertical');

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };

  const onFinish = (values: unknown) => {
    console.log('Form submitted successfully:', values);
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Form submission failed:', errorInfo);
  };

  return (
    <div className="form-container">
      <Form
        layout={formLayout}
        form={form}
        initialValues={{ layout: formLayout }}
        onValuesChange={onFormLayoutChange}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ maxWidth: formLayout === 'inline' ? 'none' : 600 }}
      >
        <Form.Item
          name="email"
          className="form-item"
          rules={[
            {
              required: true,
              message: 'Por favor, introduce tu correo electrónico.',
            },
            {
              type: 'email',
              message: 'Por favor, introduce un correo electrónico válido.',
            },
          ]}
        >
          <Input className="input-field" placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          className="form-item"
          rules={[
            {
              required: true,
              message: 'Por favor, introduce tu contraseña.',
            },
          ]}
        >
          <Input.Password className="input-field" placeholder="Password" />
        </Form.Item>
        <Form.Item className="form-item">
          <Button className="button-guest" type="primary" htmlType="submit">
            Continue
          </Button>
        </Form.Item>
        <h2>
          Don’t have an account? <span className="signin-link"> &nbsp; Sign Up</span>
        </h2>
      </Form>
    </div>
  );
};

export default LoginOrderForm;
