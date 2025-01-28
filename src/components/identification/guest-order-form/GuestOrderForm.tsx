import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import './GuestOrderForm.css';
import { useNavigate } from 'react-router-dom';

type LayoutType = Parameters<typeof Form>[0]['layout'];

const GuestOrderForm: React.FC = () => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>('vertical');
  const navigate = useNavigate();

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    navigate("/Main-Menu");
  };

  return (
    <div className="form-container">
      <Form
        layout={formLayout}
        form={form}
        initialValues={{ layout: formLayout }}
        onValuesChange={onFormLayoutChange}
        onFinish={onFinish}
        style={{ maxWidth: formLayout === 'inline' ? 'none' : 600 }}
        data-testid="guest-form"
      >
        <Form.Item
          name="fullName"
          className="form-item"
          rules={[
            { required: true, message: 'Por favor, introduce tu nombre completo.' },
            { min: 3, message: 'El nombre debe tener al menos 3 caracteres.' },
          ]}
        >
          <Input className="input-field" placeholder="Full Name" type="text" data-testid="full-name" />
        </Form.Item>

        <Form.Item
          name="email"
          className="form-item"
          rules={[
            { required: true, message: 'Por favor, introduce tu correo electrónico.' },
            { type: 'email', message: 'Introduce un correo electrónico válido.' },
          ]}
        >
          <Input className="input-field" placeholder="Email" type="email" data-testid="email" />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          className="form-item"
          rules={[
            { required: true, message: 'Por favor, introduce tu número de teléfono.' },
            {
              pattern: /^\d{9}$/,
              message: 'El número de teléfono debe tener exactamente 9 dígitos.',
            },
          ]}
        >
          <Input className="input-field" placeholder="Phone Number" type="text" maxLength={9} data-testid="phone-number" />
        </Form.Item>

        <Form.Item
          name="shippingAddress"
          className="form-item"
          rules={[
            { required: true, message: 'Por favor, introduce tu dirección de envío.' },
            { min: 10, message: 'La dirección debe tener al menos 10 caracteres.' },
          ]}
        >
          <Input className="input-field" placeholder="Shipping Address" type="text" data-testid="shipping-address" />
        </Form.Item>

        <Form.Item
          name="creditCard"
          className="form-item"
          rules={[
            { required: true, message: 'Por favor, introduce tu número de tarjeta de crédito.' },
            {
              pattern: /^\d{16}$/,
              message: 'La tarjeta de crédito debe tener exactamente 16 dígitos.',
            },
          ]}
        >
          <Input
            className="input-field"
            placeholder="Credit Card"
            type="text"
            maxLength={16} // Limitar a 16 caracteres en el campo
            data-testid="credit-card"
          />
        </Form.Item>

        <Form.Item className="form-item">
          <Button
            className="button-guest"
            type="primary"
            htmlType="submit" // Asegura que el botón ejecute la validación antes de continuar
            data-testid="continue-button"
          >
            Continue
          </Button>
        </Form.Item>
        <h2>
          Already have an account?{' '}
          <span className="signin-link" onClick={() => navigate('/Login-Screen')}>
            &nbsp; Sign In
          </span>
        </h2>
      </Form>
    </div>
  );
};

export default GuestOrderForm;
