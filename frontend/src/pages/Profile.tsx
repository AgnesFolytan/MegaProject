import React, { useContext, useEffect, useState } from 'react';
import { Form, Button, Card, Col, Modal } from 'react-bootstrap';
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
    const [users, setUsers] = useState<User[]>([]);
    const [errors, setErrors] = useState<string | null>(null);

    function patch(event: any) {
        console.log("működik a patch");
        const parentElement = event.target.parentElement;
        const id = parentElement.dataset.id;
        let moded: any = {}
        moded[event.target.dataset.name] = event.target.innerHTML;
        fetch(`http://localhost:3000/users/${id}`, { method: "PATCH", headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(moded) });
    }


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


    if (errors) {
        return <p>{errors}</p>;
    }

    const currentUser = users.find((e) => e.username === user?.username);

    return (
        <>
            <Card className="mt-4">
                <Card.Body>
                    <Card.Title>User Information</Card.Title>
                    <ul className="list-group list-group-flush">
                        {currentUser && (
                            <>
                                <li
                                    className="list-group-item"
                                    data-id={currentUser.id}
                                    contentEditable="true"
                                    data-name="username"
                                    onBlur={patch}
                                >
                                    <strong>Name:</strong> {user?.username}
                                </li>
                                <li className="list-group-item">
                                    <strong>Email:</strong> {user?.email}
                                </li>
                                <li className="list-group-item" onBlur={patch}>
                                    <strong>Password:</strong> ••••••••
                                </li>
                            </>
                        )}
                    </ul>
                </Card.Body>
            </Card>

            
        </>
    );
};
