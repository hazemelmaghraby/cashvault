import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    collection,
    doc,
    onSnapshot,
    setDoc,
    updateDoc,
    deleteDoc,
    writeBatch,
} from "firebase/firestore";

import { db } from "../firebase/firestore";
import { useAuth } from "./AuthContext";

import type { Category } from "../features/Categories/types/categoryTypes";
import { DEFAULT_CATEGORIES } from "../features/Categories/data/defaultCategory";

interface CategoryContextType {
    categories: Category[];
    loading: boolean;

    addCategory: (category: Category) => Promise<void>;
    editCategory: (category: Category) => Promise<void>;
    removeCategory: (id: string) => Promise<void>;
}

export const CategoryContext =
    createContext<CategoryContextType | undefined>(undefined);

interface CategoryProviderProps {
    children: ReactNode;
}

export const CategoryProvider = ({
    children,
}: CategoryProviderProps) => {
    const { user } = useAuth();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setCategories([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const categoriesRef = collection(
            db,
            "users",
            user.uid,
            "categories"
        );

        const unsubscribe = onSnapshot(
            categoriesRef,
            async (snapshot) => {
                if (snapshot.empty) {
                    try {
                        const batch = writeBatch(db);

                        DEFAULT_CATEGORIES.forEach((category) => {
                            const categoryRef = doc(
                                db,
                                "users",
                                user.uid,
                                "categories",
                                category.id
                            );

                            batch.set(categoryRef, {
                                name: category.name,
                                type: category.type,
                                color: category.color,
                                icon: category.icon,
                            });
                        });

                        await batch.commit();

                        return;
                    } catch (error) {
                        console.error(
                            "Failed to create default categories:",
                            error
                        );

                        setLoading(false);
                        return;
                    }
                }

                const categoryData: Category[] =
                    snapshot.docs.map((document) => ({
                        id: document.id,
                        ...(document.data() as Omit<Category, "id">),
                    }));

                setCategories(categoryData);
                setLoading(false);
            },
            (error) => {
                console.error(
                    "Failed to load categories:",
                    error
                );

                setLoading(false);
            }
        );

        return unsubscribe;
    }, [user]);

    const addCategory = async (category: Category) => {
        if (!user) {
            throw new Error("User is not authenticated");
        }

        const categoryRef = doc(
            db,
            "users",
            user.uid,
            "categories",
            category.id
        );

        await setDoc(categoryRef, {
            name: category.name,
            type: category.type,
            color: category.color,
            icon: category.icon,
        });
    };

    const editCategory = async (category: Category) => {
        if (!user) {
            throw new Error("User is not authenticated");
        }

        const categoryRef = doc(
            db,
            "users",
            user.uid,
            "categories",
            category.id
        );

        await updateDoc(categoryRef, {
            name: category.name,
            type: category.type,
            color: category.color,
            icon: category.icon,
        });
    };

    const removeCategory = async (id: string) => {
        if (!user || !id) return;

        const categoryRef = doc(
            db,
            "users",
            user.uid,
            "categories",
            id
        );

        await deleteDoc(categoryRef);
    };

    return (
        <CategoryContext.Provider
            value={{
                categories,
                loading,
                addCategory,
                editCategory,
                removeCategory,
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => {
    const context = useContext(CategoryContext);

    if (!context) {
        throw new Error(
            "useCategory must be used inside CategoryProvider"
        );
    }

    return context;
};