import React, { useRef, useState, useEffect } from 'react';
import {
  mergeStyles,
  Text,
  Stack,
  Spinner,
  Icon,
  DetailsList,
  IColumn,
  getTheme,
  TooltipHost,
} from '@fluentui/react';

const theme = getTheme();

const container = mergeStyles({
  maxWidth: 800,
  margin: '80px auto',
  padding: 40,
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
});

const avatarSection = mergeStyles({
  flex: '0 0 200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingRight: 32,
  borderRight: `1px solid ${theme.palette.neutralLight}`,
});

const avatarImage = mergeStyles({
  width: 180,
  height: 180,
  borderRadius: '50%',
  objectFit: 'cover',
  boxShadow: '0 8px 20px rgba(72, 172, 171, 0.3)',
  marginBottom: 20,
});

const buttonBase = {
  backgroundColor: '#48ACAB',
  color: 'white',
  borderRadius: 24,
  padding: '8px 24px',
  fontWeight: '600' as const,
  fontSize: 14,
  cursor: 'pointer',
  border: 'none',
  userSelect: 'none',
  display: 'block',
  margin: '0 auto 12px',
  selectors: {
    ':hover': {
      backgroundColor: '#48ACAB',
      boxShadow: '0 4px 8px rgba(72, 172, 171, 0.2)',
      transform: 'scale(1.02)',
    },
    ':focus-visible': {
      outline: `3px solid ${theme.palette.themeDarkAlt}`,
      outlineOffset: '2px',
    },
  },
};

const editButton = mergeStyles(buttonBase);

const resetButton = mergeStyles({
  ...buttonBase,
  backgroundColor: '#e03e3e',
  selectors: {
    ':hover': {
      backgroundColor: '#d73737',
      boxShadow: '0 4px 8px rgba(224, 62, 62, 0.3)',
      transform: 'scale(1.02)',
    },
    ':focus-visible': {
      outline: `3px solid ${theme.palette.themeDarkAlt}`,
      outlineOffset: '2px',
    },
  },
});

const detailsSection = mergeStyles({
  flex: 1,
  paddingLeft: 32,
  minWidth: 300,
});

const columns: IColumn[] = [
  {
    key: 'icon',
    name: '',
    fieldName: 'icon',
    minWidth: 30,
    maxWidth: 30,
    isResizable: false,
  },
  {
    key: 'field',
    name: 'Campo',
    fieldName: 'label',
    minWidth: 130,
    maxWidth: 200,
    isResizable: true,
    styles: {
      root: {
        fontWeight: 600,
        fontSize: 14,
      },
    },
  },
  {
    key: 'value',
    name: 'Valor',
    fieldName: 'value',
    minWidth: 200,
    isResizable: true,
  },
];

interface UsuarioData {
  nombreCompleto: string;
  correoElectronico: string;
  direccion: string;
  tipoUsuario: string;
  imagenUrl?: string;
}

const USER_ID = '1'; // ID usuario para la clave localStorage

const Usuario: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [usuario, setUsuario] = useState<UsuarioData | null>(null);
  const [avatar, setAvatar] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [processingImage, setProcessingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Intentar cargar imagen guardada en localStorage primero
    const savedAvatar = localStorage.getItem(`avatar_user_${USER_ID}`);
    if (savedAvatar) {
      setAvatar(savedAvatar);
      // También cargamos usuario para mostrar datos (sin imagenUrl, porque la tenemos local)
      fetch(`http://localhost:8080/kibo/usuarios/${USER_ID}`)
        .then((res) => {
          if (!res.ok) throw new Error('Error al obtener usuario');
          return res.json();
        })
        .then((data: UsuarioData) => setUsuario(data))
        .catch(() => {
          setUsuario({
            nombreCompleto: 'No disponible',
            correoElectronico: 'Error',
            direccion: '-',
            tipoUsuario: '-',
          });
        })
        .finally(() => setLoading(false));
    } else {
      // No hay imagen local, cargar todo del backend normalmente
      fetch(`http://localhost:8080/kibo/usuarios/${USER_ID}`)
        .then((res) => {
          if (!res.ok) throw new Error('Error al obtener usuario');
          return res.json();
        })
        .then((data: UsuarioData) => {
          setUsuario(data);
          setAvatar(data.imagenUrl || '');
        })
        .catch(() => {
          setUsuario({
            nombreCompleto: 'No disponible',
            correoElectronico: 'Error',
            direccion: '-',
            tipoUsuario: '-',
          });
          setAvatar('');
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const handleEditClick = () => {
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Validación simple de la imagen: tipo y tamaño max 2MB
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Formato no válido. Solo JPG, PNG, GIF o WEBP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('El archivo es demasiado grande (máx 2MB).');
      return;
    }

    setProcessingImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setAvatar(base64);
      // Guardar la imagen en localStorage para que quede guardada permanentemente en navegador
      localStorage.setItem(`avatar_user_${USER_ID}`, base64);
      setProcessingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const resetAvatar = () => {
    setAvatar('');
    setErrorMsg(null);
    // Quitar imagen guardada localmente para ese usuario
    localStorage.removeItem(`avatar_user_${USER_ID}`);
  };

  if (loading) {
    return <Spinner label="Cargando perfil..." />;
  }

  if (!usuario) {
    return <Text>No se pudo cargar el usuario.</Text>;
  }

  const items = [
    { key: 'nombre', label: 'Nombre completo', value: usuario.nombreCompleto, icon: 'Contact' },
    { key: 'correo', label: 'Correo electrónico', value: usuario.correoElectronico, icon: 'Mail' },
    { key: 'direccion', label: 'Dirección', value: usuario.direccion, icon: 'Home' },
    { key: 'tipo', label: 'Tipo de usuario', value: usuario.tipoUsuario, icon: 'ContactCard' },
  ];

  return (
    <div className={container} role="main" aria-label="Perfil de usuario">
      <Stack horizontal tokens={{ childrenGap: 24 }} styles={{ root: { alignItems: 'center' } }}>
        <div className={avatarSection}>
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar del usuario"
              className={avatarImage}
              aria-label="Imagen de perfil"
            />
          ) : (
            <Icon
              iconName="Contact"
              styles={{ root: { fontSize: 160, color: theme.palette.neutralLight } }}
              aria-label="Avatar por defecto"
            />
          )}

          {processingImage && <Text style={{ marginBottom: 12 }}>Procesando imagen...</Text>}

          {errorMsg && (
            <Text
              styles={{ root: { color: theme.palette.redDark, marginBottom: 12, fontWeight: '600' } }}
              role="alert"
            >
              {errorMsg}
            </Text>
          )}

          <button
            onClick={handleEditClick}
            className={editButton}
            aria-label="Editar imagen de perfil"
            type="button"
            disabled={processingImage}
          >
            Cambiar Imagen
          </button>

          {avatar && (
            <button
              onClick={resetAvatar}
              className={resetButton}
              aria-label="Restablecer imagen de perfil"
              type="button"
              disabled={processingImage}
            >
              Restablecer Avatar
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: 'none' }}
            accept="image/*"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>

        <div className={detailsSection}>
          <DetailsList
            items={items}
            columns={columns.map((col) => ({
              ...col,
              onRender: (item: any) =>
                col.key === 'icon' ? (
                  <TooltipHost content={item.label} key={`${item.key}-tooltip`}>
                    <Icon
                      iconName={item.icon}
                      styles={{ root: { color: theme.palette.themePrimary } }}
                      aria-label={item.label}
                    />
                  </TooltipHost>
                ) : (
                  item[col.fieldName as keyof typeof item]
                ),
            }))}
            selectionMode={0}
            layoutMode={0}
          />
        </div>
      </Stack>
    </div>
  );
};

export default Usuario;
