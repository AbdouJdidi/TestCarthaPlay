export interface Game {
  id: string;
  title: string;
  subject: string;
  level: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lesson: string;
  game_code : string,
  teacherId: string;
}


export interface User {
  id: string;
  name: string;
  role: 'teacher' | 'student';
}