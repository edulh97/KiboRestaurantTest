// src/components/identification/login-order-form/LoginOrderForm.tsx
import React from 'react';
import { Button, Form, Input } from 'antd';
import './LoginOrderForm.css';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../logout/LogoutButton';

type LayoutType = Parameters<typeof Form>[0]['layout'];

interface Props {
  onSubmit: (email: string, password: string) => void;
  error?: string | null;
}

const LoginOrderForm: React.FC<Props> = ({ onSubmit, error = null }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [formLayout, setFormLayout] = React.useState<LayoutType>('vertical');

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };

  const handleFinish = (values: any) => {
    // values: { email: string; password: string; }
    onSubmit(values.email, values.password);
  };

  return (
    <div className="form-container">
      <Form
        layout={formLayout}
        form={form}
        initialValues={{ layout: formLayout }}
        onValuesChange={onFormLayoutChange}
        onFinish={handleFinish}
        style={{ maxWidth: formLayout === 'inline' ? 'none' : 600 }}
      >
        {error && (
          <Form.Item>
            <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>
          </Form.Item>
        )}

        <Form.Item
          name="email"
          className="form-item"
          rules={[
            { required: true, message: 'Por favor, introduce tu correo electrónico.' },
            { type: 'email', message: 'Por favor, introduce un correo electrónico válido.' },
          ]}
        >
          <Input className="input-field" placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          className="form-item"
          rules={[{ required: true, message: 'Por favor, introduce tu contraseña.' }]}
        >
          <Input.Password className="input-field" placeholder="Password" />
        </Form.Item>

        <Form.Item className="form-item">
          <Button className="button-guest" type="primary" htmlType="submit" block>
            Continue
          </Button>
        </Form.Item>

        <h2>
          Don’t have an account? &nbsp;
          <a className="signin-link" onClick={() => navigate("/Guest-Screen")}>
            Sign Up
          </a>
        </h2>
      </Form>
    </div>
  );
};

export default LoginOrderForm;
