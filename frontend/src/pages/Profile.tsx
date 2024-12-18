import React, { useContext, useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { UserType } from '../types/auth';
import { Context } from '../context/Context';

type User = {
    id: number;
    username: string;
    email: string;
    password: string;
    type: UserType;
};

export function Profile() {
    const { user } = useContext(Context);
    const [userByToken, setUser] = useState<User | null>(null);
    const [errors, setErrors] = useState<string | null>(null);
    const token: string | undefined = user?.token;

    useEffect(() => {
        if (token) {
            fetchUserByToken().catch((err) => setErrors(`Error fetching user: ${err.message}`));
        }
    }, [token]);

    const fetchUserByToken = async () => {
        if (!token) return;
        try {
            const res = await fetch(`http://localhost:3000/users/${token}`);
            if (!res.ok) {
                const errorData = await res.json();
                console.error('Error details:', errorData);
                throw new Error("Failed to fetch user");
            }
            const userData = await res.json();
            setUser(userData);
        } catch (err: any) {
            setErrors(`Error fetching user: ${err.message}`);
            console.error('Fetch error:', err);
        }
    };

    function onChangege(event: any) {
        if (event.key === 'Enter') {
            event.target.blur();
        }
    }

    async function patch(event: React.FocusEvent<HTMLLIElement>) {
        const id = userByToken?.id;
        if (!id) return;

        const fieldName = event.currentTarget.dataset.name;
        const newValue = event.currentTarget.textContent?.trim();

        if (fieldName && newValue !== null && newValue !== '') {
            const updatedUser = { [fieldName]: newValue };
            console.log(updatedUser);
            try {
                const res = await fetch(`http://localhost:3000/users/${id}`, {
                    method: "PATCH",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedUser),
                });
                if (!res.ok) {
                    const errorData = await res.json();
                    console.error('Error details:', errorData);
                    throw new Error('Failed to update user');
                }
                setUser(prevUser => prevUser ? { ...prevUser, ...updatedUser } : null);
            } catch (err: any) {
                setErrors(`Error updating user: ${err.message}`);
                console.error('Update error:', err);
            }
        }
    }

    const deleteUser = async () => {
        if (!userByToken) return;
        try {
            const res = await fetch(`http://localhost:3000/users/${userByToken.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) {
                const errorData = await res.json();
                console.error('Error details:', errorData);
                throw new Error('Failed to delete user');
            }
            console.log('User deleted');
            setUser(null);  // Clear the user after deletion
        } catch (err: any) {
            setErrors(`Error deleting user: ${err.message}`);
            console.error('Delete error:', err);
        }
    };

    if (errors) {
        return <p>{errors}</p>;
    }

    return (
        <Card className="mt-4">
            <Card.Body>
                <Card.Title>User Information</Card.Title>
                {userByToken ? (
                    <ul className="list-group list-group-flush">
                        <li
                            className="list-group-item"
                            data-id={userByToken.id}
                            contentEditable="true"
                            data-name="username"
                            onKeyDown={onChangege}
                            onBlur={patch}
                        >
                            <strong>Username:</strong> {userByToken.username}
                        </li>
                        <li
                            className="list-group-item"
                            data-id={userByToken.id}
                            contentEditable="true"
                            data-name="email"
                            onKeyDown={onChangege}
                            onBlur={patch}
                        >
                            <strong>Email:</strong> {userByToken.email}
                        </li>
                        <li
                            className="list-group-item"
                            data-id={userByToken.id}
                            contentEditable="true"
                            data-name="password"
                            onKeyDown={onChangege}
                            onBlur={patch}
                        >
                            <strong>Password:</strong> ••••••••
                        </li>
                    </ul>
                ) : (
                    <p>Loading user information...</p>
                )}
                <Button variant="dark" onClick={deleteUser}>Delete</Button>
            </Card.Body>
        </Card>
    );
}
