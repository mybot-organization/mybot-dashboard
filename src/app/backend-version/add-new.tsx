'use client';
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";



export default function AddNew() {
    const [name, setName] = useState("");
    const router = useRouter()
    
    
    async function addTodo(event: FormEvent){
        event.preventDefault();
        setName("");
        await fetch("/api/todo", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({value: name})
        })
    }
    return (
        <form onSubmit={(e) => {
            addTodo(e).then(() => router.refresh());
        }}>
            <input 
                type="text"
                placeholder="Add a new todo !"
                value={name}
                onChange={(e) => {
                    setName(e.target.value)
                }}
            />
            <button>add</button>
        </form>
    )
}
