import { useState } from "react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import type {
    Category,
    CategoryType,
} from "../types/categoryTypes";

interface CategoryFormProps {
    onSubmit: (category: Category) => void;
}

const CategoryForm = ({ onSubmit }: CategoryFormProps) => {
    const [name, setName] = useState("");
    const [type, setType] = useState<CategoryType>("expense");
    const [color, setColor] = useState("#3B82F6");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newCategory: Category = {
            id: crypto.randomUUID(),
            name: name.trim(),
            type,
            color,
            icon: "circle",
        };

        onSubmit(newCategory);

        setName("");
        setType("expense");
        setColor("#3B82F6");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >

            <Input
                label="Name"
                placeholder="e.g. Gym"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <Select
                label="Type"
                options={[
                    { value: "expense", label: "Expense" },
                    { value: "income", label: "Income" },
                ]}
                value={type}
                onChange={(e) =>
                    setType(e.target.value as CategoryType)
                }
            />

            {/* Color */}
            <div className="space-y-2">

                <label className="text-sm font-medium text-[var(--text-secondary)]">
                    Color
                </label>

                <div className="flex items-center gap-3">

                    <div
                        className="
              relative
              flex
              h-11
              w-14
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--surface)]
            "
                    >
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="
                absolute
                inset-0
                h-full
                w-full
                cursor-pointer
                opacity-0
              "
                        />

                        <span
                            className="h-5 w-5 rounded-full"
                            style={{
                                backgroundColor: color,
                            }}
                        />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                            Category color
                        </p>

                        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                            Choose a color to identify this category.
                        </p>
                    </div>

                </div>

            </div>

            <Button
                type="submit"
                className="
          w-full
          rounded-xl
          bg-[var(--accent)]
          py-2.5
          text-sm
          font-semibold
          text-white
          transition-all
          duration-200
          hover:bg-[var(--accent-hover)]
          hover:-translate-y-0.5
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--accent)]
          focus:ring-offset-2
          focus:ring-offset-[var(--surface)]
        "
            >
                Add Category
            </Button>

        </form>
    );
};

export default CategoryForm;