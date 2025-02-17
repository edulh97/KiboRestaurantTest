import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import './LoginOrderForm.css';
import { useNavigate } from 'react-router-dom';

type LayoutType = Parameters<typeof Form>[0]['layout'];

const LoginOrderForm: React.FC = () => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>('vertical');
  const navigate = useNavigate();

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
          Don’t have an account? &nbsp; <a className="signin-link" onClick={() => navigate("/Guest-Screen")}>  Sign Up </a>
        </h2>
      </Form>
      <div>
        <span>Get our data!</span>
      </div>
    </div>
  );
};

export default LoginOrderForm;