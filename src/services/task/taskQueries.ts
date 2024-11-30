import { getDocs, query, where } from 'firebase/firestore';
import { tasksCollection } from '../../lib/firebase/collections';
import { Task } from '../../types/project';
import { taskConverter } from '../../lib/firebase/converters';

export const getProjectTasks = async (projectId: string): Promise<Task[]> => {
  const q = query(
    tasksCollection, 
    where("projectId", "==", projectId)
  ).withConverter(taskConverter);
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
};