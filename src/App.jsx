import { useState } from 'react'
import { useSelector } from 'react-redux'
import { LoginForm } from './components/login-form'
import { Button } from './components/ui/button'
import { useAuth } from './hooks/useAuth.jsx'
import { useTodos } from './hooks/useTodos'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from './components/ui/input'
import { DialogClose } from '@radix-ui/react-dialog'

const toastConfig = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  style: {
    fontSize: '14px',
  },
  bodyStyle: {
    padding: '10px',
  },
  progressStyle: {
    background: '#4f46e5',
  },
};

function App() {
  const [input, setInput] = useState('')
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const { todos, loading: todosLoading } = useSelector((state) => state.todos);
  const { login, signup, logout } = useAuth();
  const { addTodo, updateTodo, deleteTodo } = useTodos();

  const handleAddTodo = (e) => {
    e.preventDefault()
    if (!input.trim()) return;
    addTodo(input);
    setInput('');
  }

  const handleUpdateTodo = (id) => {
    if (!input.trim()) return;
    updateTodo(id, { text: input });
    setInput('');
  }

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <>
        <ToastContainer {...toastConfig} />
        <LoginForm onLogin={login} onSignup={signup} />
      </>
    );
  }

  return (
    <>
      <ToastContainer {...toastConfig} />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Todo App</h1>
          <Button onClick={logout} variant="destructive">Logout</Button>
        </div>

        <form onSubmit={handleAddTodo} className="mb-8">
          <div className="flex gap-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a new todo"
              className="flex-1"
            />
            <Button type="submit">Add Todo</Button>
          </div>
        </form>

        {todosLoading ? (
          <div>Loading todos...</div>
        ) : (
          <div className="space-y-4">
            {todos.map((todo) => (
              <div key={todo.id} className="flex justify-between items-center p-4 bg-slate-600 rounded-xl text-white">
                <p className={todo.completed ? 'line-through' : ''}>{todo.text}</p>
                <div className="flex gap-4">
                  <Button
                    onClick={() => updateTodo(todo.id, { completed: !todo.completed })}
                    variant="outline"
                    style={
                      !todo.completed
                        ? { color: '#22c55e', borderColor: '#22c55e' }
                        : { color: '#f59e42', borderColor: '#f59e42' }
                    }
                  >
                    {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                  </Button>

                  <Dialog>
                    <DialogTrigger>Update Todo</DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Todo</DialogTitle>
                        <DialogDescription>
                          Update your todo item
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-3">
                        <Input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Update todo"
                        />
                        <DialogClose>
                          <Button onClick={() => handleUpdateTodo(todo.id)}>
                            Update Todo
                          </Button>
                        </DialogClose>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    onClick={() => deleteTodo(todo.id)}
                    variant="destructive"
                  >
                    Delete Todo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default App
