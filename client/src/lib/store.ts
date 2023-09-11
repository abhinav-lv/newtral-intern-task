import { create } from "zustand";
import type { User, Task } from "./types";
import type { StoreState } from "./types";

export const useUserStore = create<StoreState>((set) => ({
    user: null,
    tasks: [],
    fetchTasks: true,
    setUser: (user: User) => set({ user }),
    setTasks: (tasks: Task[]) => set({ tasks }),
    setFetchTasks: (fetchTasks: boolean) => set({ fetchTasks }),
}));
