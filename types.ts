export interface Topic {
  title: string;
  duration: number; // in minutes
  summary: string;
}

export interface Agenda {
  title: string;
  stakeholders: string[];
  topics: Topic[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
