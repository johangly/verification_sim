import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { usersService } from '../services/usersService';
import toast from 'react-hot-toast';
import { RoleGetResponse, UserGetResponse } from '../types/users';
import { useNavigate } from 'react-router-dom';
const dataUserEmptyState = {
    name: '',
    email: '',
    roleId: 0,
    password: '',
    confirmPassword: ''
}
export default function useUser() {
    const [form, setForm] = useState(dataUserEmptyState);
    const [roleOptions, setRoleOptions] = useState<RoleGetResponse[]>([]);
    const [allUsers, setAllUsers] = useState<UserGetResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.name === 'roleId' ? parseInt(e.target.value) : e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (!form.name || !form.email || !form.password || !form.confirmPassword) {
            setError('Todos los campos son obligatorios');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        setLoading(true);
        try {
            await usersService.createUser({
                name: form.name,
                email: form.email,
                roleId: form.roleId,
                password: form.password
            });
            toast.success('Usuario registrado exitosamente');
            navigate('/users');
            setForm(dataUserEmptyState);
        } catch (err) {
            if(err instanceof Error){
                toast.error(`Error al registrar el usuario: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }

    };
    async function fetchAllUsers() {
        try {
            const users = await usersService.getAllUsers();
            setAllUsers(users);
        } catch (err) {
            console.error('Error al obtener los usuarios:', err);
        }
    }
    async function fetchRoles() {
        try {
            const roles = await usersService.getAllRoles();
            const roleId = parseInt(roles.filter((role) => role.name === 'User')[0]?.id || '0');
            setRoleOptions(roles);
            setForm((prevForm) => ({
                ...prevForm,
                roleId: roleId
            }));
        } catch (err) {
            console.error('Error al obtener los roles:', err);
        }
    }
    useEffect(() => {
        fetchRoles();
        fetchAllUsers();
    }, []);
    return {
        handleChange,
        handleSubmit,
        loading,
        error,
        roleOptions,
        form,
        allUsers

    };
}
