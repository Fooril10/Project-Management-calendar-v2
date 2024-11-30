import { 
  collection, 
  doc,
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Task } from '../types/project';

const tasksCollection = collection(db, 'tasks');

export const taskService = {
  async getProjectTasks(projectId: string): Promise<Task[]> {
    const q = query(tasksCollection, where("projectId", "==", projectId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      dueDate: doc.data().dueDate.toDate(),
      dateRange: doc.data().dateRange ? {
        start: doc.data().dateRange.start.toDate(),
        end: doc.data().dateRange.end.toDate()
      } : undefined,
      recurring: doc.data().recurring ? {
        ...doc.data().recurring,
        endDate: doc.data().recurring.endDate?.toDate()
      } : undefined
    })) as Task[];
  },

  async addTask(projectId: string, task: Omit<Task, 'id'>): Promise<string> {
    const docRef = await addDoc(tasksCollection, {
      ...task,
      projectId,
      createdAt: new Date()
    });
    return docRef.id;
  },

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    const taskRef = doc(tasksCollection, taskId);
    await updateDoc(taskRef, updates);
  },

  async deleteTask(taskId: string): Promise<void> {
    const taskRef = doc(tasksCollection, taskId);
    await deleteDoc(taskRef);
  }
};