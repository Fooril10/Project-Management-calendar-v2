export interface Note {
  id: string;
  projectId: string;
  text: string;
  timestamp: Date;
}

export interface ProjectNotes {
  [projectId: string]: Note[];
}