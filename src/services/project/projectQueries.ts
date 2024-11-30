import { getDocs, query, where } from 'firebase/firestore';
import { projectsCollection } from '../../lib/firebase/collections';
import { Project } from '../../types/project';

export const getProjects = async (): Promise<Project[]> => {
  const snapshot = await getDocs(projectsCollection);
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id
  })) as Project[];
};