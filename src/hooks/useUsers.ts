import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { User } from '../types/user';
import { generateId } from '../utils/helpers';

const USERS_STORAGE_KEY = 'my-library:users';

const defaultUsers: User[] = [
  {
    id: generateId(),
    name: import.meta.env.VITE_USER_NAME || 'Ayush Manjil',
    username: import.meta.env.VITE_USER_USERNAME || 'ayushmanjil',
    password: import.meta.env.VITE_USER_PASSWORD || 'manjil1234'
  }
];

export function useUsers() {
  const [users, setUsers] = useLocalStorage<User[]>(USERS_STORAGE_KEY, defaultUsers);

  useEffect(() => {
    const targetUsername = import.meta.env.VITE_USER_USERNAME || 'ayushmanjil';
    const exists = users.some((u) => u.username === targetUsername);
    if (!exists) {
      const newUser: User = {
        id: generateId(),
        name: import.meta.env.VITE_USER_NAME || 'Ayush Manjil',
        username: targetUsername,
        password: import.meta.env.VITE_USER_PASSWORD || 'manjil1234'
      };
      setUsers((prev) => [...prev, newUser]);
    }
  }, [users, setUsers]);

  const addUser = (name: string, username: string, password?: string) => {
    const newUser: User = {
      id: generateId(),
      name: name.trim(),
      username: username.trim(),
      password: password ? password.trim() : undefined
    };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return {
    users,
    addUser,
    deleteUser
  };
}
