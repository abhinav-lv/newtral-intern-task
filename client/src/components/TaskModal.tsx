import { CalendarDays } from "lucide-react";
import type { Task } from "../lib/types";
import {
    Flex,
    Modal,
    ModalContent,
    Text,
    ModalOverlay,
    ModalHeader,
    ModalBody,
    Badge,
} from "@chakra-ui/react";

export default function TaskModal({
    task,
    isOpen,
    setOpen,
}: {
    task: Task | null;
    isOpen: boolean;
    setOpen: Function;
}) {
    return task ? (
        <Modal
            isOpen={isOpen}
            onClose={() => setOpen(false)}
            isCentered
            preserveScrollBarGap
        >
            <ModalOverlay />
            <ModalContent fontFamily="space">
                <ModalHeader>
                    <Text>{task.title}</Text>
                    <Flex mt="0.5rem" gap="1rem" alignItems="center">
                        <Flex gap="0.5rem" alignItems="center">
                            <CalendarDays width={16} />
                            <Text fontWeight="600" fontSize="14px">
                                {new Date(task.due)
                                    .toDateString()
                                    .split(" ")
                                    .slice(1)
                                    .join(" ")}
                            </Text>
                        </Flex>
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
                        <Badge
                            variant="outline"
                            borderRadius="4px"
                            colorScheme={task.isCompleted ? "green" : "orange"}
                        >
                            {task.isCompleted ? "Completed" : "Pending"}
                        </Badge>
                    </Flex>
                </ModalHeader>
                <ModalBody px="1.3rem" mb="0.5rem">
                    <Flex
                        p="1rem"
                        borderRadius="8px"
                        bg="blackAlpha.200"
                        _dark={{ color: "gray.300" }}
                        maxH="12rem"
                    >
                        {task.description}
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    ) : (
        <></>
    );
}
