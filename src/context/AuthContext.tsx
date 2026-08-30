import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    type User,
} from "firebase/auth";

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
} from "firebase/firestore";
import type { UserProfile } from "../features/Auth/types/userTypes";


import { db } from "../firebase/firestore";

import { auth } from "../firebase/auth";
type UpdateProfileData = {
    firstName?: string;
    lastName?: string;
    currency?: string;
};

type AuthContextType = {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;

    register: (
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ) => Promise<void>;

    login: (
        email: string,
        password: string
    ) => Promise<void>;

    logout: () => Promise<void>;

    resetPassword: (email: string) => Promise<void>;

    updateProfileData: (
        data: UpdateProfileData
    ) => Promise<void>;
};



const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider = ({
    children,
}: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const ensureUserProfile = async (
        currentUser: User
    ): Promise<UserProfile> => {
        const userRef = doc(db, "users", currentUser.uid);

        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
            return {
                uid: currentUser.uid,
                ...(userSnapshot.data() as Omit<UserProfile, "uid">),
            };
        }

        const newProfile: UserProfile = {
            uid: currentUser.uid,
            firstName:
                currentUser.displayName?.split(" ")[0] ?? "",
            lastName:
                currentUser.displayName
                    ?.split(" ")
                    .slice(1)
                    .join(" ") ?? "",
            email: currentUser.email ?? "",
            role: "user",
            status: "active",
            currency: "EGP",
        };

        await setDoc(userRef, {
            ...newProfile,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return newProfile;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async (currentUser) => {
                try {
                    setUser(currentUser);

                    if (!currentUser) {
                        setProfile(null);
                        return;
                    }

                    const userProfile =
                        await ensureUserProfile(currentUser);

                    setProfile(userProfile);
                } catch (error) {
                    console.error(
                        "Failed to load user profile:",
                        error
                    );

                    setProfile(null);
                } finally {
                    setLoading(false);
                }
            }
        );

        return unsubscribe;
    }, []);



    const register = async (
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ) => {
        const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        await updateProfile(result.user, {
            displayName: `${firstName} ${lastName}`
        });

        await setDoc(doc(db, "users", result.user.uid), {
            firstName,
            lastName,
            email,
            role: "user",
            status: "active",
            currency: "EGP",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        setUser({
            ...result.user,
            displayName: `${firstName} ${lastName}`
        });
    };

    const login = async (
        email: string,
        password: string
    ) => {
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
    };

    const logout = async () => {
        await signOut(auth);
    };

    const resetPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    };

    const updateProfileData = async (
        data: UpdateProfileData
    ) => {
        if (!user || !profile) {
            throw new Error("User is not authenticated");
        }

        const userRef = doc(
            db,
            "users",
            user.uid
        );

        const updates: Partial<UserProfile> = {};

        if (data.firstName !== undefined) {
            updates.firstName = data.firstName;
        }

        if (data.lastName !== undefined) {
            updates.lastName = data.lastName;
        }

        if (data.currency !== undefined) {
            updates.currency = data.currency;
        }

        await updateDoc(userRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });

        setProfile((current) =>
            current
                ? {
                    ...current,
                    ...updates,
                }
                : current
        );
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                loading,
                register,
                login,
                logout,
                resetPassword,
                updateProfileData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};