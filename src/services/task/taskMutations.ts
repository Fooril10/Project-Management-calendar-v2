import { addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { tasksCollection } from '../../lib/firebase/collections';
import { db } from '../../lib/firebase/config';
import { Task } from '../../types/project';
import { taskConverter } from '../../lib/firebase/converters';

export const addTask = async (projectId: string, task: Omit<Task, 'id'>): Promise<string> => {
  const docRef = await addDoc(
    tasksCollection.withConverter(taskConverter),
    {
      ...task,
      projectId,
      createdAt: new Date()
    } as Task
  );
  return docRef.id;
};

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<void> => {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, updates);
};

export const deleteTask = async (taskId: string): Promise<void> => {
  const taskRef = doc(db, 'tasks', taskId);
  await deleteDoc(taskRef);
};