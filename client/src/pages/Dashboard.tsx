import NavBar from "../components/NavBar";
import { Flex, Text } from "@chakra-ui/react";
import NewTaskModal from "../components/NewTaskModal";
import TasksTable from "../components/TasksTable";

export default function Dashboard() {
    return (
        <>
            <NavBar loggedIn={true} />
            <Flex
                p="1rem 2rem"
                fontFamily="space"
                alignItems="center"
                bg="blackAlpha.200"
                _dark={{bg: "rgba(0,0,0,0.2)"}}
            >
                <Text fontWeight="extrabold" fontSize="20px">
                    Your Tasks
                </Text>
                <NewTaskModal />
            </Flex>
            <TasksTable />
        </>
    );
}
