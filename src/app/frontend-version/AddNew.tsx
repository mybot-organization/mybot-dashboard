'use client';
import { FormEvent, useEffect, useState } from "react";


export default function AddNew() {
    const [todoText, setTodoText] = useState("");
    const [todoElements, setTodoElements] = useState<string[]>([]);

    useEffect(() => {
        const existingTodos = localStorage.getItem('todoElements');
        setTodoElements(existingTodos ? JSON.parse(existingTodos) : []);
    }, []);

    function addTodo(event: FormEvent) {
        event.preventDefault();
        const todos = [...todoElements, todoText];
        setTodoText("");
        setTodoElements(todos);
        localStorage.setItem("todoElements", JSON.stringify(todos))
    }

    return (
        <>
            <ul>
                {todoElements.map((e, i) => {
                    return <li key={i}>{e}</li>
                })}
            </ul>
            <form onSubmit={addTodo}>
                <input type="text" placeholder="Add a new todo !" value={todoText} onChange={(e) => setTodoText(e.target.value)}></input>
                <button>add</button>
            </form>
        </>
    )
}
