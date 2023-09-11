import { useState, useEffect } from "react";
import {
    Flex,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,
    Text,
} from "@chakra-ui/react";
import { ArrowDownUp } from "lucide-react";
import { useUserStore } from "../lib/store";
import { Task } from "../lib/types";
import TaskRow from "./TaskRow";

const priorityValues = {
    low: 2,
    medium: 1,
    high: 0,
};

const tasksSortComp = (a: Task, b: Task) => {
    if (a.isCompleted) return 1;
    if (b.isCompleted) return -1;
    const dayA = new Date(a.due).getDate();
    const dayB = new Date(b.due).getDate();
    if (dayA !== dayB) return dayA < dayB ? -1 : 1;
    return priorityValues[a.priority] - priorityValues[b.priority];
};

const getTasks = async (setTasks: Function, setFetchTasks: Function) => {
    setFetchTasks(false);
    const tasks = await (await fetch("/api/task/getTasks")).json();
    tasks.sort(tasksSortComp);
    setTasks(tasks);
};

export default function TasksTable() {
    const tasks = useUserStore((state) => state.tasks);
    const setTasks = useUserStore((state) => state.setTasks);
    const fetchTasks = useUserStore((state) => state.fetchTasks);
    const setFetchTasks = useUserStore((state) => state.setFetchTasks);
    const [prioritySort, setPrioritySort] = useState<
        "default" | "high" | "low"
    >("default");

    useEffect(() => {
        if (fetchTasks) getTasks(setTasks, setFetchTasks);
    }, [fetchTasks]);

    useEffect(() => {
        const tempTasks = [...tasks];
        if (prioritySort === "high")
            tempTasks.sort((a: Task, b: Task) => {
                return a.isCompleted
                    ? 1
                    : b.isCompleted
                    ? -1
                    : priorityValues[a.priority] - priorityValues[b.priority];
            });
        else if (prioritySort === "low")
            tempTasks.sort((a: Task, b: Task) => {
                return a.isCompleted
                    ? 1
                    : b.isCompleted
                    ? -1
                    : priorityValues[b.priority] - priorityValues[a.priority];
            });
        else tempTasks.sort(tasksSortComp);
        setTasks(tempTasks);
    }, [prioritySort]);

    return (
        <Flex p="3rem 2rem" justifyContent="center" fontFamily="space">
            <TableContainer w="90%" maxW="90%">
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Title</Th>
                            <Th>Due</Th>
                            <Th
                                _hover={{ bg: "blackAlpha.200" }}
                                transitionDuration="200ms"
                                cursor="pointer"
                            >
                                <Flex
                                    alignItems="center"
                                    gap="0.5rem"
                                    onClick={() =>
                                        setPrioritySort(
                                            prioritySort === "default"
                                                ? "high"
                                                : prioritySort === "high"
                                                ? "low"
                                                : "default"
                                        )
                                    }
                                >
                                    <Text>Priority</Text>
                                    <ArrowDownUp width={16} />
                                </Flex>
                            </Th>
                            <Th>Status</Th>
                            <Th>Edit</Th>
                            <Th>Delete</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {tasks.map((task, index) => (
                            <TaskRow key={index} task={task} />
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Flex>
    );
}
