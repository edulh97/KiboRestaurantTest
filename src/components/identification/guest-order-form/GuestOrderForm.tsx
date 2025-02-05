import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../../services/api";

type LayoutType = Parameters<typeof Form>[0]["layout"];

const GuestOrderForm: React.FC = () => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("vertical");
  const [tipoUsuario, setTipoUsuario] = useState<"invitado" | "registrado">("invitado"); // Estado para el tipo de usuario
  const navigate = useNavigate();

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };

  const onFinish = async (values: any) => {
    console.log("Form values:", values);

    // Convertir los nombres de los campos del formulario a los que espera el backend
    const usuario = {
      nombreCompleto: values.fullName,
      correoElectronico: values.email,
      direccion: values.shippingAddress,
      contrasena: values.password,
      tarjeta: Number(values.creditCard), // Convertir a número
      tipoUsuario: tipoUsuario, // Usar el valor del estado
      token: "", // Valor inicial vacío
      telefonos: [
        {
          telefono: values.phoneNumber,
        },
      ],
    };

    //Llamada al metodo de crear en api.tsx
    try {
      const data = await createUser(usuario);
      console.log("Usuario creado:", data);

      navigate("/Main-Menu");
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al crear el usuario. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="form-container">
      <Form
        layout={formLayout}
        form={form}
        initialValues={{ layout: formLayout }}
        onValuesChange={onFormLayoutChange}
        onFinish={onFinish}
        style={{ maxWidth: formLayout === "inline" ? "none" : 600 }}
        data-testid="guest-form"
      >
        <Form.Item
          name="fullName"
          className="form-item"
          rules={[
            { required: true, message: "Por favor, introduce tu nombre completo." },
            { min: 3, message: "El nombre debe tener al menos 3 caracteres." },
          ]}
        >
          <Input className="input-field" placeholder="Full Name" type="text" data-testid="full-name" />
        </Form.Item>

        <Form.Item
          name="email"
          className="form-item"
          rules={[
            { required: true, message: "Por favor, introduce tu correo electrónico." },
            { type: "email", message: "Introduce un correo electrónico válido." },
          ]}
        >
          <Input className="input-field" placeholder="Email" type="email" data-testid="email" />
        </Form.Item>

        <Form.Item
          name="password"
          className="form-item"
          rules={[{ required: true, message: "Por favor, introduce tu contraseña." }]}
        >
          <Input.Password className="input-field" placeholder="Password" data-testid="password" />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          className="form-item"
          rules={[
            { required: true, message: "Por favor, introduce tu número de teléfono." },
            { pattern: /^\d{9}$/, message: "El número de teléfono debe tener exactamente 9 dígitos." },
          ]}
        >
          <Input className="input-field" placeholder="Phone Number" type="text" maxLength={9} data-testid="phone-number" />
        </Form.Item>

        <Form.Item
          name="shippingAddress"
          className="form-item"
          rules={[
            { required: true, message: "Por favor, introduce tu dirección de envío." },
            { min: 10, message: "La dirección debe tener al menos 10 caracteres." },
          ]}
        >
          <Input className="input-field" placeholder="Shipping Address" type="text" data-testid="shipping-address" />
        </Form.Item>

        <Form.Item
          name="creditCard"
          className="form-item"
          rules={[
            { required: true, message: "Por favor, introduce tu número de tarjeta de crédito." },
            { pattern: /^\d{16}$/, message: "La tarjeta de crédito debe tener exactamente 16 dígitos." },
          ]}
        >
          <Input className="input-field" placeholder="Credit Card" type="text" maxLength={16} data-testid="credit-card" />
        </Form.Item>

        <Form.Item className="form-item">
          <div className="buttons-decision">
            <Button
              className="button-guest"
              type="primary"
              htmlType="submit"
              onClick={() => setTipoUsuario("invitado")} // Establecer tipoUsuario como "invitado"
              data-testid="continue-button"
            >
              Continue as guest
            </Button>
          </div>
        </Form.Item>
        <Button
          className="button-guest"
          type="primary"
          htmlType="submit"
          onClick={() => setTipoUsuario("registrado")} // Establecer tipoUsuario como "registrado"
          data-testid="continue-button2"
        >
          Create User
        </Button>

        <h2>
          Already have an account?&nbsp;&nbsp;
          <span className="signin-link" onClick={() => navigate("/Login-Screen")}>
            Sign In
          </span>
        </h2>
      </Form>
    </div>
  );
};

export default GuestOrderForm;