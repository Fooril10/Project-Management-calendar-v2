import { FirestoreDataConverter } from 'firebase/firestore';
import { Project, Task } from '../../types/project';

export const projectConverter: FirestoreDataConverter<Project> = {
  toFirestore: (project: Project) => ({
    ...project,
    createdAt: new Date()
  }),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id
    } as Project;
  }
};

export const taskConverter: FirestoreDataConverter<Task> = {
  toFirestore: (task: Task) => ({
    ...task,
    createdAt: new Date()
  }),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
      dueDate: data.dueDate.toDate(),
      dateRange: data.dateRange ? {
        start: data.dateRange.start.toDate(),
        end: data.dateRange.end.toDate()
      } : undefined,
      recurring: data.recurring ? {
        ...data.recurring,
        endDate: data.recurring.endDate?.toDate()
      } : undefined
    } as Task;
  }
};