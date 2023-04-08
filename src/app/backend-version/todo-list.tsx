import { cookies } from 'next/headers';
import { TodoType } from '../types';
import Todo from './todo';

export default function TodoList() {
    const cookieStore = cookies();
    const rawTodos = cookieStore.get("todos")?.value;
    const todos: TodoType[] = rawTodos ? JSON.parse(rawTodos) : [];

    return (
        <ul>
            {todos.map((e) => {
                return <Todo key={e.id} {...e} />
            })}
        </ul>
    )
}
