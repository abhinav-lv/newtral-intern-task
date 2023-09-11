export interface User {
    userId: String;
    name: String;
    picture: String;
    email: String;
}

export interface Task {
    taskId: string;
    title: string;
    description: string;
    due: string;
    isCompleted: boolean;
    priority: "low" | "medium" | "high";
}

export interface StoreState {
    user: User | null;
    tasks: Task[];
    fetchTasks: boolean;
    setUser: (user: User) => void;
    setTasks: (tasks: Task[]) => void;
    setFetchTasks: (fetchTasks: boolean) => void;
}
