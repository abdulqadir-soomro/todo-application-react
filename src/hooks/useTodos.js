import { useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useDispatch, useSelector } from 'react-redux';
import { setTodos, addTodo, updateTodo, removeTodo, setLoading, setError } from '../features/todoSlice';

export const useTodos = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (!user) return;

    dispatch(setLoading(true));
    const q = query(
      collection(db, 'todos'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const todos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        dispatch(setTodos(todos));
      },
      (error) => {
        dispatch(setError(error.message));
      }
    );

    return () => unsubscribe();
  }, [user, dispatch]);

  const addNewTodo = async (text) => {
    if (!user) return;

    try {
      const todoRef = await addDoc(collection(db, 'todos'), {
        text,
        completed: false,
        userId: user.uid,
        createdAt: serverTimestamp()
      });

      dispatch(addTodo({
        id: todoRef.id,
        text,
        completed: false,
        userId: user.uid
      }));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const updateExistingTodo = async (id, updates) => {
    try {
      const todoRef = doc(db, 'todos', id);
      await updateDoc(todoRef, updates);
      dispatch(updateTodo({ id, ...updates }));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const deleteExistingTodo = async (id) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
      dispatch(removeTodo(id));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  return {
    addTodo: addNewTodo,
    updateTodo: updateExistingTodo,
    deleteTodo: deleteExistingTodo
  };
}; 