import AddNew from "./add-new"
import TodoList from "./todo-list"

export default function Home() {
  return (
    <div>
      <h1>
        Todo list
      </h1>
      <TodoList />
      <AddNew />
    </div>
  )
}
