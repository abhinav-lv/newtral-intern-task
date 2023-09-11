import { useGoogleLogin } from "@react-oauth/google";
import {
    Flex,
    Button,
    Text,
    useColorMode,
    useToast,
    Avatar,
} from "@chakra-ui/react";
import { Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { User } from "../lib/types";
import { useUserStore } from "../lib/store";

// To authorize user and redirect to dashboard if logged in
const authorize = async (navigate: Function, setLoading: Function) => {
    const res = await fetch("/api/auth/authorize");
    if (res.status === 200) navigate("/dashboard");
    else {
        setLoading(false);
    }
};

// If logged in, get user
const getUser = async (setUser: Function) => {
    try {
        const user: User = await (await fetch("/api/user/getUser")).json();
        setUser(user);
    } catch (err: any) {
        console.error(err.message);
    }
};

// Handler for google login
const onCode = async (
    tokenRes: any,
    navigate: Function,
    toast: Function,
    setLoading: Function
) => {
    // console.log(tokenRes);
    setLoading(true);
    const res = await fetch("/api/auth/authenticate", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tokenRes),
    });
    setLoading(false);
    if (res.status === 200) {
        navigate("/dashboard");
    } else {
        toast({
            title: "Auth Error",
            description: "An error occurred during authentication",
            status: "error",
            duration: 3000,
        });
    }
};

const logout = async (navigate: Function, setTasks: Function) => {
    const res = await fetch("/api/auth/logout");
    if (res.status === 200) {
        setTasks([]);
        navigate("/");
    }
};

/* NAVBAR COMPONENT ------------------------------------------------------------ */
export default function NavBar({ loggedIn }: { loggedIn: boolean }) {
    const navigate = useNavigate();
    const toast = useToast();
    const login = useGoogleLogin({
        onSuccess: (tokenRes) => onCode(tokenRes, navigate, toast, setLoading),
        onError: (error) => console.error(error),
    });

    // For dark and light themes
    const { colorMode, toggleColorMode } = useColorMode();

    // To set loading state for login button
    const [loading, setLoading] = useState(false);

    // User State
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);

    const setTasks = useUserStore((state) => state.setTasks);
    const setFetchTasks = useUserStore((state) => state.setFetchTasks);

    useEffect(() => {
        if (!loggedIn) authorize(navigate, setLoading);
        else getUser(setUser);
    }, []);

    useEffect(() => {
        if (user) {
            setFetchTasks(true);
        }
    }, [user]);

    return (
        <Flex
            fontFamily="space"
            p="1rem 2rem"
            bg="blackAlpha.900"
            alignItems="center"
        >
            <Text color="whiteAlpha.900" fontWeight="600" fontSize="20px">
                Newtral.io Intern Task
            </Text>
            <Flex gap="1rem" ml="auto" alignItems="center">
                {loggedIn ? (
                    <Flex alignItems="center" gap="1rem" mr="1rem">
                        <Avatar
                            src={user ? (user.picture as string) : "" || ""}
                            size="sm"
                        />
                        <Text fontWeight="semibold" color="whiteAlpha.800">
                            {user ? user.name.split(" ")[0] : ""}
                        </Text>
                    </Flex>
                ) : (
                    <></>
                )}
                <Button
                    onClick={() =>
                        loggedIn ? logout(navigate, setTasks) : login()
                    }
                    colorScheme={loggedIn ? "red" : "facebook"}
                    isLoading={loading}
                >
                    <Text fontWeight="semibold">
                        {loggedIn ? "Logout" : "Login"}
                    </Text>
                </Button>
                <Button onClick={toggleColorMode} colorScheme="gray">
                    {colorMode === "light" ? <Sun /> : <Moon />}
                </Button>
            </Flex>
        </Flex>
    );
}
