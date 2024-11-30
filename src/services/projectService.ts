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
import { Project, Task } from '../types/project';

const projectsCollection = collection(db, 'projects');
const tasksCollection = collection(db, 'tasks');

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const snapshot = await getDocs(projectsCollection);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as Project[];
  },

  async addProject(project: Omit<Project, 'id' | 'tasks'>): Promise<string> {
    const docRef = await addDoc(projectsCollection, {
      ...project,
      createdAt: new Date()
    });
    return docRef.id;
  },

  async updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
    const projectRef = doc(projectsCollection, projectId);
    await updateDoc(projectRef, updates);
  },

  async deleteProject(projectId: string): Promise<void> {
    // Delete all tasks associated with the project first
    const tasksQuery = query(tasksCollection, where("projectId", "==", projectId));
    const taskSnapshot = await getDocs(tasksQuery);
    const deleteTasks = taskSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deleteTasks);

    // Then delete the project
    const projectRef = doc(projectsCollection, projectId);
    await deleteDoc(projectRef);
  }
};