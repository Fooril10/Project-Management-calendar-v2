import { addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { projectsCollection } from '../../lib/firebase/collections';
import { db } from '../../lib/firebase/config';
import { Project } from '../../types/project';

export const addProject = async (project: Omit<Project, 'id' | 'tasks'>): Promise<string> => {
  const docRef = await addDoc(projectsCollection, {
    ...project,
    createdAt: new Date()
  });
  return docRef.id;
};

export const updateProject = async (projectId: string, updates: Partial<Project>): Promise<void> => {
  const projectRef = doc(db, 'projects', projectId);
  await updateDoc(projectRef, updates);
};

export const deleteProject = async (projectId: string): Promise<void> => {
  const projectRef = doc(db, 'projects', projectId);
  await deleteDoc(projectRef);
};