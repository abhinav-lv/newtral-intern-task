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
    Switch,
} from "@chakra-ui/react";
import type { User } from "../lib/types";
import { useUserStore } from "../lib/store";
import { ClipboardSignature } from "lucide-react";
import type { Task as FormData } from "../lib/types";

interface FormError {
    title: boolean;
    description: boolean;
    due: boolean;
    isCompleted: boolean;
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

const onStatusChange = (
    e: ChangeEvent<HTMLInputElement>,
    formData: FormData,
    setFormData: Function,
    setFormError: Function
) => {
    const checked = e.target.checked;
    if (!checked) {
        if (new Date(formData.due) < new Date()) {
            setFormError((formError: FormError) => ({
                ...formError,
                isCompleted: true,
            }));
        } else {
            setFormError((formError: FormError) => ({
                ...formError,
                isCompleted: false,
            }));
        }
    }
    setFormError((formError: FormError) => ({
        ...formError,
        isCompleted: false,
    }));
    setFormData({
        ...formData,
        isCompleted: e.target.checked,
    });
};

const onSubmit = async (
    formData: FormData,
    user: User,
    setOpen: Function,
    toast: Function,
    setFetchTasks: Function
) => {
    try {
        const taskObj = {
            ...formData,
            userId: user.userId,
        };
        const res = await fetch("/api/task/updateTask", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskObj),
        });
        if (res.status === 200) {
            toast({
                title: "Task has been edited!",
                status: "success",
                duration: 3000,
            });
            setFetchTasks(true);
        }
    } catch (err: any) {
        console.error(err.message);
        toast({
            title: "Failed to edit task!",
            status: "error",
            duration: 3000,
        });
    }
    setOpen(false);
};

export default function EditTaskModal({
    task,
    isOpen,
    setOpen,
}: {
    task: FormData;
    isOpen: boolean;
    setOpen: Function;
}) {
    const user = useUserStore((state) => state.user);
    const setFetchTasks = useUserStore((state) => state.setFetchTasks);
    const [formData, setFormData] = useState<FormData>(task);
    const [formError, setFormError] = useState<FormError>({
        title: false,
        description: false,
        due: false,
        isCompleted: false,
    });

    const toast = useToast();

    useEffect(() => {
        setFormData(task);
        setFormError({
            title: false,
            description: false,
            due: false,
            isCompleted: false,
        });
    }, [isOpen]);

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={() => setOpen(false)}
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
                            <Text>Edit Task</Text>
                            <ClipboardSignature />
                        </Flex>
                    </ModalHeader>
                    <ModalBody pb="1.5rem">
                        <Flex flexDir="column" gap="1rem">
                            <FormControl isInvalid={formError.isCompleted}>
                                <Flex justifyContent="space-between">
                                    <FormLabel fontWeight="semibold">
                                        Completed?
                                    </FormLabel>
                                    <Switch
                                        isChecked={formData.isCompleted}
                                        onChange={(e) =>
                                            onStatusChange(
                                                e,
                                                formData,
                                                setFormData,
                                                setFormError
                                            )
                                        }
                                        colorScheme="green"
                                    />
                                </Flex>
                                <FormErrorMessage>
                                    The due date is in the past.
                                </FormErrorMessage>
                            </FormControl>
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
                                    formData.title === "" ||
                                    formError.isCompleted
                                }
                                onClick={() =>
                                    onSubmit(
                                        formData,
                                        user as User,
                                        setOpen,
                                        toast,
                                        setFetchTasks
                                    )
                                }
                            >
                                Save
                            </Button>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
