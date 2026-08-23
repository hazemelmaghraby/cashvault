import { useCategory } from "../../hooks/useCategories";
import { useLayoutEffect, useRef, useState } from "react"; import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import CategoryForm from "./components/CategoryForms";
import type { Category } from "./types/categoryTypes";
import { useTransaction } from "../../hooks/useTransaction";
import {
  animatePageIn,
  animateListIn,
} from "../../utils/animations";

const CategoriesPage = () => {
  const {
    categories,
    addCategory,
    removeCategory,
  } = useCategory();
  const pageRef = useRef<HTMLDivElement>(null);
  const categoryListRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!pageRef.current) return;

    animatePageIn(pageRef.current);
  }, []);

  useLayoutEffect(() => {
    if (!categoryListRef.current) return;

    animateListIn(categoryListRef.current);
  }, [categories.length]);
  const [isOpened, setIsOpened] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<Category | null>(null);
  const { transactions } = useTransaction();
  const [deleteBlocked, setDeleteBlocked] = useState(false);


  const handleSaveCategory = (category: Category) => {
    addCategory(category);
    setIsOpened(false);
  };

  const handleDeleteCategory = (category: Category) => {
    const isUsed = transactions.some(
      (transaction) => transaction.categoryId === category.id
    );

    setCategoryToDelete(category);
    setDeleteBlocked(isUsed);
  };

  const confirmDeleteCategory = () => {
    if (!categoryToDelete || deleteBlocked) {
      return;
    }

    removeCategory(categoryToDelete.id);

    setCategoryToDelete(null);
    setDeleteBlocked(false);
  };


  return (
    <div
      ref={pageRef}
      className="space-y-6 pb-20 md:pb-0"
    >
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="mb-2 text-sm font-medium text-[var(--accent)]">
            Organization
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Categories
          </h1>

          <p className="mt-2 text-sm text-[var(--text-muted)] sm:text-base">
            Manage the categories you use to organize your finances.
          </p>
        </div>

        <Button
          onClick={() => setIsOpened(true)}
          className="
          w-full
          rounded-xl
          bg-[var(--accent)]
          px-5
          py-2.5
          text-sm
          font-semibold
          text-white
          shadow-lg
          shadow-[var(--accent)]/10
          transition-all
          duration-200
          hover:bg-[var(--accent-hover)]
          hover:shadow-[var(--accent)]/20
          sm:w-auto
        "
        >
          + Add Category
        </Button>

      </div>

      {/* Categories */}
      {categories.length === 0 ? (

        <div
          className="
          rounded-2xl
          border
          border-[var(--border)]
          bg-[var(--surface)]
          px-6
          py-16
          text-center
        "
        >
          <div
            className="
            mx-auto
            mb-5
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            border
            border-[var(--border)]
            bg-[var(--surface-elevated)]
            text-[var(--accent)]
          "
          >
            #
          </div>

          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            No categories yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--text-muted)]">
            Create a category to start organizing your transactions.
          </p>

          <Button
            onClick={() => setIsOpened(true)}
            className="
            mt-6
            rounded-xl
            bg-[var(--accent)]
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            transition-all
            duration-200
            hover:bg-[var(--accent-hover)]
          "
          >
            Create Category
          </Button>

        </div>

      ) : (

        <div ref={categoryListRef}
          data-animate-list
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

          {categories.map((category) => (

            <div
              key={category.id}
              className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-[var(--border)]
              bg-[var(--surface)]
              p-4
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-[var(--border-hover)]
              hover:bg-[var(--surface-elevated)]
            "
            >

              <div className="flex items-center justify-between gap-4">

                {/* Category information */}
                <div className="flex min-w-0 items-center gap-3">

                  <div
                    className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    text-sm
                    font-bold
                    text-white
                    shadow-sm
                  "
                    style={{
                      backgroundColor: category.color,
                    }}
                  >
                    {category.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                      {category.name}
                    </p>

                    <p className="mt-1 text-xs capitalize text-[var(--text-muted)]">
                      {category.type}
                    </p>

                  </div>

                </div>

                {/* Delete */}
                <Button
                  onClick={() => handleDeleteCategory(category)}
                  className="
                  shrink-0
                  rounded-lg
                  border
                  border-[var(--expense)]/40
                  bg-transparent
                  px-2.5
                  py-1.5
                  text-xs
                  font-semibold
                  text-[var(--text-muted)]
                  transition-all
                  duration-200
                  hover:border-[var(--expense)]/30
                  hover:bg-[var(--expense)]/10
                  hover:text-[var(--expense)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--expense)]/30
                "
                >
                  Delete
                </Button>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* Create Category Modal */}
      <Modal
        isOpen={isOpened}
        onClose={() => setIsOpened(false)}
        title="Create Category"
      >
        <CategoryForm
          onSubmit={handleSaveCategory}
        />
      </Modal>

      {/* Delete Category Modal */}
      <Modal
        isOpen={categoryToDelete !== null}
        onClose={() => {
          setCategoryToDelete(null);
          setDeleteBlocked(false);
        }}
        title={
          deleteBlocked
            ? "Cannot Delete Category"
            : "Delete Category?"
        }
      >

        <div className="space-y-5">

          {deleteBlocked ? (

            <>
              <div
                className="
                rounded-xl
                border
                border-[var(--warning)]/20
                bg-[var(--warning)]/10
                p-4
              "
              >
                <p className="text-sm leading-6 text-[var(--text-secondary)]">
                  You can't delete{" "}
                  <span className="font-semibold text-[var(--text-primary)]">
                    "{categoryToDelete?.name}"
                  </span>{" "}
                  because it is currently being used by one or more
                  transactions.
                </p>
              </div>

              <div className="flex justify-end">

                <Button
                  onClick={() => {
                    setCategoryToDelete(null);
                    setDeleteBlocked(false);
                  }}
                  className="
                  rounded-xl
                  bg-[var(--accent)]
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  duration-200
                  hover:bg-[var(--accent-hover)]
                "
                >
                  OK
                </Button>

              </div>
            </>

          ) : (

            <>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[var(--text-primary)]">
                  "{categoryToDelete?.name}"
                </span>
                ?
              </p>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                <Button
                  onClick={() => {
                    setCategoryToDelete(null);
                    setDeleteBlocked(false);
                  }}
                  className="
                  w-full
                  rounded-xl
                  border
                  border-[var(--border)]
                  bg-[var(--surface-elevated)]
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-[var(--text-secondary)]
                  transition-all
                  duration-200
                  hover:bg-[var(--border)]
                  hover:text-[var(--text-primary)]
                  sm:w-auto
                "
                >
                  Cancel
                </Button>

                <Button
                  onClick={confirmDeleteCategory}
                  className="
                  w-full
                  rounded-xl
                  border
                  border-[var(--expense)]/20
                  bg-[var(--expense)]/10
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-[var(--expense)]
                  transition-all
                  duration-200
                  hover:border-[var(--expense)]/40
                  hover:bg-[var(--expense)]/15
                  sm:w-auto
                "
                >
                  Delete
                </Button>
              </div>
            </>

          )}

        </div>

      </Modal>

    </div>
  );
};

export default CategoriesPage;