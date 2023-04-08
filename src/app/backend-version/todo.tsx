"use client";

import { useRouter } from "next/navigation";
import { TodoType } from "../types";

export default function Todo(todo: TodoType) {
    const router = useRouter();

    async function handleChange() {
        await fetch(`/api/todo/`, {
            method: 'DELETE',
            body: JSON.stringify({ id: todo.id }),
        });
        router.refresh();
    }

    return (
        <li>
            <input
                title={todo.value}
                type="checkbox"
                checked={false}
                onChange={handleChange}
            />
            {todo.value}
        </li>
    );
}
