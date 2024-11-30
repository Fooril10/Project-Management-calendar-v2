import { collection } from 'firebase/firestore';
import { db } from './config';

export const projectsCollection = collection(db, 'projects');
export const tasksCollection = collection(db, 'tasks');