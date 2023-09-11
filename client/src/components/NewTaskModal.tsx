import { useState, useEffect, ChangeEvent } from "react";
import {
    Flex,
    Button,
    Modal,
    ModalContent,
    Text,
    ModalOverlay,
    ModalHeader,
    FormControl,
    FormLabel,
    Textarea,
    Input,
    ModalBody,
    Select,
    FormErrorMessage,
    useToast,
} from "@chakra-ui/react";
import type { User } from "../lib/types";
import { useUserStore } from "../lib/store";
import { Plus, ClipboardSignature } from "lucide-react";

interface FormData {
    title: string;
    description: string;
    due: Date | string;
    priority: "low" | "high" | "medium";
    isCompleted: boolean;
}

interface FormError {
    title: boolean;
    description: boolean;
    due: boolean;
}

const onTitleChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFormData: Function
) => {
    setFormData((formData: FormData) => ({
        ...formData,
        title: e.target.value,
    }));
};

const onDescChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
    setFormData: Function
) => {
    setFormData((formData: FormData) => ({
        ...formData,
        description: e.target.value,
    }));
};

const onDateChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFormData: Function,
    setFormError: Function
) => {
    const date = new Date(e.target.value);
    if (date >= new Date()) {
        setFormError((formError: FormError) => ({
            ...formError,
            due: false,
        }));
    } else
        setFormError((formError: FormError) => ({
            ...formError,
            due: true,
        }));
    setFormData((formData: FormData) => ({
        ...formData,
        due: e.target.value,
    }));
};

const onPriorityChange = (
    e: ChangeEvent<HTMLSelectElement>,
    setFormData: Function
) => {
    setFormData((formData: FormData) => ({
        ...formData,
        priority: e.target.value,
    }));
};

const onSubmit = async (
    formData: FormData,
    user: User,
    setNewTaskModal: Function,
    toast: Function,
    setFetchTasks: Function
) => {
    const taskObj = {
        ...formData,
        userId: user.userId,
    };
    const res = await fetch("/api/task/addTask", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(taskObj),
    });
    if (res.status === 200) {
        toast({
            title: "New task added!",
            status: "success",
            duration: 3000,
        });
        setFetchTasks(true);
    } else
        toast({
            title: "Failed to add task!",
            status: "error",
            duration: 3000,
        });
    setNewTaskModal(false);
};

export default function NewTaskModal() {
    const user = useUserStore((state) => state.user);
    const setFetchTasks = useUserStore((state) => state.setFetchTasks);
    const [newTaskModal, setNewTaskModal] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        due: new Date().toISOString().split("T")[0],
        priority: "low",
        isCompleted: false,
    });
    const [formError, setFormError] = useState<FormError>({
        title: false,
        description: false,
        due: false,
    });

    const toast = useToast();

    useEffect(() => {
        setFormData({
            title: "",
            description: "",
            due: new Date().toISOString().split("T")[0],
            priority: "low",
            isCompleted: false,
        });
        setFormError({
            title: false,
            description: false,
            due: false,
        });
    }, [newTaskModal]);

    return (
        <>
            <Button
                colorScheme="facebook"
                ml="auto"
                onClick={() => setNewTaskModal(true)}
            >
                <Flex alignItems="center" gap="0.5rem">
                    <Text mb="2px">Add Task</Text>
                    <Plus width={20} />
                </Flex>
            </Button>
            <Modal
                isOpen={newTaskModal}
                onClose={() => setNewTaskModal(false)}
                isCentered
                preserveScrollBarGap
            >
                <ModalOverlay />
                <ModalContent fontFamily="space">
                    <ModalHeader>
                        <Flex
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Text>New Task</Text>
                            <ClipboardSignature />
                        </Flex>
                    </ModalHeader>
                    <ModalBody pb="1.5rem">
                        <Flex flexDir="column" gap="1rem">
                            <FormControl isRequired>
                                <FormLabel fontWeight="semibold">
                                    Title
                                </FormLabel>
                                <Input
                                    placeholder="Enter task title"
                                    type="text"
                                    isRequired
                                    value={formData.title}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) => onTitleChange(e, setFormData)}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel fontWeight="semibold">
                                    Description
                                </FormLabel>
                                <Textarea
                                    resize="none"
                                    placeholder="Enter task description"
                                    value={formData.description}
                                    onChange={(
                                        e: ChangeEvent<HTMLTextAreaElement>
                                    ) => onDescChange(e, setFormData)}
                                />
                            </FormControl>
                            <Flex gap="1rem">
                                <FormControl
                                    isRequired
                                    isInvalid={formError.due}
                                >
                                    <FormLabel fontWeight="semibold">
                                        Due Date
                                    </FormLabel>
                                    <Input
                                        type="date"
                                        value={formData.due as string}
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) =>
                                            onDateChange(
                                                e,
                                                setFormData,
                                                setFormError
                                            )
                                        }
                                    />
                                    <FormErrorMessage>
                                        This date is in the past.
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel fontWeight="semibold">
                                        Priority
                                    </FormLabel>
                                    <Select
                                        value={formData.priority}
                                        onChange={(
                                            e: ChangeEvent<HTMLSelectElement>
                                        ) => onPriorityChange(e, setFormData)}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </Select>
                                </FormControl>
                            </Flex>
                            <Button
                                mt="1rem"
                                colorScheme="facebook"
                                isDisabled={
                                    formError.due ||
                                    formData.description === "" ||
                                    formData.title === ""
                                }
                                onClick={() =>
                                    onSubmit(
                                        formData,
                                        user as User,
                                        setNewTaskModal,
                                        toast,
                                        setFetchTasks
                                    )
                                }
                            >
                                Submit
                            </Button>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
