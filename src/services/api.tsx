export const getUsers = async () => {
    const response = await fetch('http://localhost:8080/kibo/usuarios');
    const data = await response.json(); 
    return data;
};