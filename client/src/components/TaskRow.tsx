import type { Task } from "../lib/types";
import { Tr, Td, Button, Badge } from "@chakra-ui/react";
import { Pencil, Trash } from "lucide-react";
import TaskModal from "./TaskModal";
import { useState } from "react";
import EditTaskModal from "./EditTaskModal";
import DeleteTaskModal from "./DeleteTaskModal";

export default function TaskRow({ task }: { task: Task }) {
    const [openTaskModal, setOpenTaskModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    return (
        <Tr
            _hover={{ bg: "blackAlpha.200" }}
            cursor="pointer"
            onClick={() => setOpenTaskModal(true)}
        >
            <Td display="none">
                <TaskModal
                    task={task}
                    isOpen={openTaskModal}
                    setOpen={setOpenTaskModal}
                />
                <EditTaskModal
                    isOpen={openEditModal}
                    setOpen={setOpenEditModal}
                    task={task}
                />
                <DeleteTaskModal
                    isOpen={openDeleteModal}
                    setOpen={setOpenDeleteModal}
                    task={task}
                />
            </Td>
            <Td>{task.title}</Td>
            <Td>
                {
                    new Date(task.due)
                        .toDateString()
                        .split(" ")
                        .slice(1)
                        .join(" ")
                    // .toISOString()
                    // .split("T")[0]
                }
            </Td>
            <Td>
                {
                    <Badge
                        borderRadius="4px"
                        colorScheme={
                            task.priority === "high"
                                ? "red"
                                : task.priority === "medium"
                                ? "yellow"
                                : "blue"
                        }
                    >
                        {task.priority}
                    </Badge>
                }
            </Td>
            <Td>
                <Badge
                    variant="outline"
                    borderRadius="4px"
                    colorScheme={task.isCompleted ? "green" : "orange"}
                >
                    {task.isCompleted ? "Completed" : "Pending"}
                </Badge>
            </Td>
            <Td>
                <Button
                    colorScheme="facebook"
                    p="0.5rem"
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenEditModal(true);
                    }}
                >
                    <Pencil width={18} />
                </Button>
            </Td>
            <Td>
                <Button
                    colorScheme="red"
                    variant="ghost"
                    p="0.5rem"
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenDeleteModal(true);
                    }}
                >
                    <Trash width={18} />
                </Button>
            </Td>
        </Tr>
    );
}
