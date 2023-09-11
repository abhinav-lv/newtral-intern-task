import {
    Modal,
    ModalContent,
    ModalOverlay,
    ModalHeader,
    ModalBody,
    Button,
    ModalFooter,
} from "@chakra-ui/react";
import { Task } from "../lib/types";
import { useState } from "react";
import { useUserStore } from "../lib/store";

const deleteTask = async (
    task: Task,
    setOpen: Function,
    setFetchTasks: Function,
    setLoading: Function
) => {
    try {
        setLoading(true);
        const res = await fetch("/api/task/deleteTask", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        });
        if (res.status === 200) {
            setFetchTasks(true);
        }
    } catch (err: any) {
        console.error(err.message);
    }
    setLoading(false);
    setOpen(false);
};

export default function DeleteTaskModal({
    isOpen,
    setOpen,
    task,
}: {
    isOpen: boolean;
    setOpen: Function;
    task: Task;
}) {
    const setFetchTasks = useUserStore((state) => state.setFetchTasks);
    const [loading, setLoading] = useState(false);

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => setOpen(false)}
            isCentered
            preserveScrollBarGap
        >
            <ModalOverlay />
            <ModalContent fontFamily="space">
                <ModalHeader>Delete task?</ModalHeader>
                <ModalBody>This action cannot be reversed!</ModalBody>
                <ModalFooter>
                    <Button mr="1rem" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        colorScheme="red"
                        onClick={() =>
                            deleteTask(task, setOpen, setFetchTasks, setLoading)
                        }
                        isLoading={loading}
                    >
                        Delete
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
