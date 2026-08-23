import {
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import { useAuth } from "../../context/AuthContext";
import { getRoleTheme } from "../../constants/RoleThemes";

import {
    animatePageIn,
    animateListIn,
} from "../../utils/animations";

const ProfilePage = () => {
    const {
        user,
        profile,
        loading,
        updateProfileData,
    } = useAuth();

    const pageRef = useRef<HTMLDivElement>(null);
    const sectionsRef = useRef<HTMLDivElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [currency, setCurrency] = useState("EGP");

    useLayoutEffect(() => {
        if (!pageRef.current) return;

        animatePageIn(pageRef.current);
    }, []);

    useLayoutEffect(() => {
        if (!sectionsRef.current) return;

        animateListIn(sectionsRef.current);
    }, []);

    /*
    ============================================================
    SYNC FORM WITH PROFILE
    ============================================================
    */

    useLayoutEffect(() => {
        if (!profile) return;

        setFirstName(profile.firstName ?? "");
        setLastName(profile.lastName ?? "");
        setCurrency(profile.currency ?? "EGP");
    }, [profile]);

    /*
    ============================================================
    LOADING
    ============================================================
    */

    if (loading || !profile || !user) {
        return (
            <div className="space-y-8 pb-20 md:pb-0">

                {/* Header skeleton */}
                <div>
                    <div className="h-4 w-20 animate-pulse rounded bg-[var(--surface-elevated)]" />

                    <div className="mt-3 h-10 w-40 animate-pulse rounded bg-[var(--surface-elevated)]" />

                    <div className="mt-3 h-5 w-80 max-w-full animate-pulse rounded bg-[var(--surface-elevated)]" />
                </div>

                {/* Profile skeleton */}
                <div className="h-96 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]" />

                {/* Account skeleton */}
                <div className="h-52 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]" />

            </div>
        );
    }

    /*
    ============================================================
    ROLE THEME
    ============================================================
    */

    const roleTheme = getRoleTheme(profile.role);

    const roleClass = `role-theme role-${profile.role}`;

    const fullName =
        `${profile.firstName} ${profile.lastName}`.trim();

    const initials =
        `${profile.firstName?.charAt(0) ?? ""}${profile.lastName?.charAt(0) ?? ""}`
            .toUpperCase() || "U";

    const roleLabel = roleTheme.label;

    const statusLabel =
        profile.status.charAt(0).toUpperCase() +
        profile.status.slice(1);

    /*
    ============================================================
    SAVE
    ============================================================
    */

    const handleSave = async () => {
        if (!firstName.trim() || !lastName.trim()) {
            return;
        }

        try {
            setIsSaving(true);

            await updateProfileData({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                currency,
            });

            setIsEditing(false);
        } catch (error) {
            console.error(
                "Failed to update profile:",
                error
            );
        } finally {
            setIsSaving(false);
        }
    };

    /*
    ============================================================
    CANCEL
    ============================================================
    */

    const handleCancel = () => {
        setFirstName(profile.firstName ?? "");
        setLastName(profile.lastName ?? "");
        setCurrency(profile.currency ?? "EGP");

        setIsEditing(false);
    };

    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (
        <div
            ref={pageRef}
            className={`
                ${roleClass}
                role-profile-background
                relative
                space-y-8
                pb-20
                md:pb-0
            `}
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <div data-animate>

                <p
                    className="mb-2 text-sm font-medium"
                    style={{
                        color: "var(--role-accent)",
                    }}
                >
                    Account
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                            Profile
                        </h1>

                        <p className="mt-2 text-sm text-[var(--text-muted)] sm:text-base">
                            Manage your personal information and account preferences.
                        </p>

                    </div>

                    {/* Role indicator */}
                    <div
                        className="
                            role-badge
                            inline-flex
                            w-fit
                            items-center
                            gap-2
                            rounded-full
                            border
                            px-3.5
                            py-2
                            text-xs
                            font-semibold
                        "
                    >
                        <span
                            className="flex h-5 w-5 items-center justify-center rounded-full"
                            style={{
                                background:
                                    "var(--role-accent)",
                                color: "white",
                            }}
                        >
                            ✦
                        </span>

                        {roleLabel}
                    </div>

                </div>

            </div>


            {/* ==================================================
                SECTIONS
            ================================================== */}

            <div
                ref={sectionsRef}
                className="space-y-8"
            >

                {/* ==================================================
                    PERSONAL INFORMATION
                ================================================== */}

                <div
                    data-animate-item
                    className="
                        role-card
                        overflow-hidden
                        rounded-2xl
                        border
                        bg-[var(--surface)]
                    "
                >

                    {/* Section Header */}
                    <div className="flex flex-col gap-4 border-b border-[var(--border)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                        <div>

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                    "
                                    style={{
                                        background:
                                            "var(--role-accent-soft)",
                                        color:
                                            "var(--role-accent)",
                                    }}
                                >
                                    ✦
                                </div>

                                <div>

                                    <h2 className="text-base font-semibold text-[var(--text-primary)] sm:text-lg">
                                        Personal Information
                                    </h2>

                                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                                        Your basic account information.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Actions */}
                        {!isEditing ? (

                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="
                                    rounded-xl
                                    border
                                    border-[var(--border)]
                                    bg-[var(--surface-elevated)]
                                    px-4
                                    py-2
                                    text-sm
                                    font-medium
                                    text-[var(--text-primary)]
                                    transition-all
                                    duration-200
                                    hover:border-[var(--role-accent-border)]
                                    hover:bg-[var(--surface-hover)]
                                "
                            >
                                Edit Profile
                            </button>

                        ) : (

                            <div className="flex gap-2">

                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="
                                        rounded-xl
                                        border
                                        border-[var(--border)]
                                        px-4
                                        py-2
                                        text-sm
                                        font-medium
                                        text-[var(--text-secondary)]
                                        transition-colors
                                        duration-200
                                        hover:bg-[var(--surface-hover)]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={
                                        isSaving ||
                                        !firstName.trim() ||
                                        !lastName.trim()
                                    }
                                    className="
                                        rounded-xl
                                        px-4
                                        py-2
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition-all
                                        duration-200
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                    style={{
                                        background:
                                            "var(--role-accent)",
                                    }}
                                >
                                    {isSaving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                            </div>

                        )}

                    </div>


                    {/* Content */}
                    <div className="p-5 sm:p-6">

                        {/* ==================================================
                            AVATAR
                        ================================================== */}

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                            <div
                                className={`
                                    role-avatar
                                    role-shine
                                    flex
                                    h-20
                                    w-20
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    text-2xl
                                    font-bold
                                    text-white
                                    ${roleTheme.animation === "premium"
                                        ? "role-premium"
                                        : roleTheme.animation === "subtle"
                                            ? "role-subtle"
                                            : ""
                                    }
                                `}
                            >
                                {initials}
                            </div>


                            <div className="min-w-0">

                                <h3 className="truncate text-xl font-semibold text-[var(--text-primary)]">
                                    {fullName || "User"}
                                </h3>

                                <p className="mt-1 truncate text-sm text-[var(--text-muted)]">
                                    {profile.email}
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">

                                    {/* Role */}
                                    <span className="role-badge inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
                                        <span
                                            className="h-1.5 w-1.5 rounded-full"
                                            style={{
                                                background:
                                                    "var(--role-accent)",
                                            }}
                                        />

                                        {roleLabel}
                                    </span>

                                    {/* Status */}
                                    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">

                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--income)]" />

                                        {statusLabel}

                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* ==================================================
                            FORM
                        ================================================== */}

                        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">

                            {/* First Name */}
                            <div>

                                <label className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                                    First Name
                                </label>

                                {isEditing ? (

                                    <input
                                        value={firstName}
                                        onChange={(event) =>
                                            setFirstName(
                                                event.target.value
                                            )
                                        }
                                        autoComplete="given-name"
                                        className="
                                            mt-2
                                            w-full
                                            rounded-xl
                                            border
                                            border-[var(--border)]
                                            bg-[var(--background)]
                                            px-3.5
                                            py-2.5
                                            text-sm
                                            text-[var(--text-primary)]
                                            outline-none
                                            transition
                                            focus:border-[var(--role-accent)]
                                            focus:ring-2
                                            focus:ring-[var(--role-accent)]/15
                                        "
                                    />

                                ) : (

                                    <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
                                        {profile.firstName}
                                    </p>

                                )}

                            </div>


                            {/* Last Name */}
                            <div>

                                <label className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                                    Last Name
                                </label>

                                {isEditing ? (

                                    <input
                                        value={lastName}
                                        onChange={(event) =>
                                            setLastName(
                                                event.target.value
                                            )
                                        }
                                        autoComplete="family-name"
                                        className="
                                            mt-2
                                            w-full
                                            rounded-xl
                                            border
                                            border-[var(--border)]
                                            bg-[var(--background)]
                                            px-3.5
                                            py-2.5
                                            text-sm
                                            text-[var(--text-primary)]
                                            outline-none
                                            transition
                                            focus:border-[var(--role-accent)]
                                            focus:ring-2
                                            focus:ring-[var(--role-accent)]/15
                                        "
                                    />

                                ) : (

                                    <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
                                        {profile.lastName}
                                    </p>

                                )}

                            </div>


                            {/* Email */}
                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                                    Email
                                </p>

                                <p className="mt-2 truncate text-sm font-medium text-[var(--text-primary)]">
                                    {profile.email}
                                </p>

                                <p className="mt-1 text-xs text-[var(--text-muted)]">
                                    Managed by Firebase Authentication
                                </p>

                            </div>


                            {/* Currency */}
                            <div>

                                <label className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                                    Currency
                                </label>

                                {isEditing ? (

                                    <select
                                        value={currency}
                                        onChange={(event) =>
                                            setCurrency(
                                                event.target.value
                                            )
                                        }
                                        className="
                                            mt-2
                                            w-full
                                            rounded-xl
                                            border
                                            border-[var(--border)]
                                            bg-[var(--background)]
                                            px-3.5
                                            py-2.5
                                            text-sm
                                            text-[var(--text-primary)]
                                            outline-none
                                            transition
                                            focus:border-[var(--role-accent)]
                                            focus:ring-2
                                            focus:ring-[var(--role-accent)]/15
                                        "
                                    >

                                        <option value="EGP">
                                            EGP — Egyptian Pound
                                        </option>

                                        <option value="USD">
                                            USD — US Dollar
                                        </option>

                                        <option value="EUR">
                                            EUR — Euro
                                        </option>

                                        <option value="GBP">
                                            GBP — British Pound
                                        </option>

                                    </select>

                                ) : (

                                    <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
                                        {profile.currency}
                                    </p>

                                )}

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    ROLE / ACCOUNT
                ================================================== */}

                <div
                    data-animate-item
                    className="
                        role-card
                        overflow-hidden
                        rounded-2xl
                        border
                        bg-[var(--surface)]
                    "
                >

                    <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6">

                        <div className="flex items-center gap-3">

                            <div
                                className="flex h-9 w-9 items-center justify-center rounded-xl"
                                style={{
                                    background:
                                        "var(--role-accent-soft)",
                                    color:
                                        "var(--role-accent)",
                                }}
                            >
                                ✦
                            </div>

                            <div>

                                <h2 className="text-base font-semibold text-[var(--text-primary)] sm:text-lg">
                                    {roleLabel} Account
                                </h2>

                                <p className="mt-1 text-sm text-[var(--text-muted)]">
                                    {roleTheme.description}
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2 sm:p-6">

                        {/* Role */}
                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                                Role
                            </p>

                            <div className="mt-2 flex items-center gap-2">

                                <p
                                    className="text-sm font-semibold"
                                    style={{
                                        color:
                                            "var(--role-accent)",
                                    }}
                                >
                                    {roleLabel}
                                </p>

                                <span className="rounded-full border border-[var(--border)] bg-[var(--background)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                                    Protected
                                </span>

                            </div>

                        </div>


                        {/* Status */}
                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                                Account Status
                            </p>

                            <div className="mt-2 flex items-center gap-2">

                                <span
                                    className="h-2 w-2 rounded-full"
                                    style={{
                                        background:
                                            profile.status ===
                                                "active"
                                                ? "var(--income)"
                                                : "var(--expense)",
                                    }}
                                />

                                <p className="text-sm font-medium text-[var(--text-primary)]">
                                    {statusLabel}
                                </p>

                                <span className="rounded-full border border-[var(--border)] bg-[var(--background)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                                    Protected
                                </span>

                            </div>

                        </div>


                        {/* Authentication */}
                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                                Authentication
                            </p>

                            <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
                                Firebase Authentication
                            </p>

                        </div>


                        {/* User ID */}
                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                                User ID
                            </p>

                            <p className="mt-2 truncate font-mono text-xs text-[var(--text-secondary)]">
                                {user.uid}
                            </p>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    ROLE NOTICE
                ================================================== */}

                <div
                    data-animate-item
                    className="
                        role-card
                        rounded-2xl
                        border
                        bg-[var(--surface)]
                        p-5
                        sm:p-6
                    "
                >

                    <div className="flex gap-4">

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                            "
                            style={{
                                background:
                                    "var(--role-accent-soft)",
                                color:
                                    "var(--role-accent)",
                            }}
                        >
                            i
                        </div>

                        <div>

                            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                                Your account permissions are protected
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                                Your role and account status are managed by
                                CashVault's permission system and cannot be
                                changed from your profile.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ProfilePage;

