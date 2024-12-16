import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { UserType } from '../types/auth';

type User = {
  username: string;
  email: string;
  password: string;
  type: UserType;
};

export function Register() {
    const [users, setUsers] = useState<User[]>([]);
    const [errors, setErrors] = useState<string | null>(null);
    useEffect(() => {
        fetching()
            .catch((err) => setErrors(err.message));
    }, []);

    if (errors) {
        return <p>{errors}</p>;
    }

    async function fetching() {
        const res = await fetch("http://localhost:3000/users")
        setUsers(await res.json());
    }

}