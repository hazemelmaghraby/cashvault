import { useEffect, useState } from "react";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

const SettingsPage = () => {
    const {
        profile,
        updateProfileData,
    } = useAuth();

    const [currency, setCurrency] = useState(
        profile?.currency ?? "EGP"
    );

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (profile?.currency) {
            setCurrency(profile.currency);
        }
    }, [profile?.currency]);

    const handleSaveCurrency = async () => {
        if (!profile) return;

        try {
            setSaving(true);
            setSaved(false);

            await updateProfileData({
                currency,
            });

            setSaved(true);

            setTimeout(() => {
                setSaved(false);
            }, 2000);

        } catch (error) {
            console.error(
                "Failed to update currency:",
                error
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 pb-20 md:pb-0">

            {/* Header */}
            <div>
                <p className="mb-2 text-sm font-medium text-[var(--accent)]">
                    Preferences
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                    Settings
                </h1>

                <p className="mt-2 text-sm text-[var(--text-muted)] sm:text-base">
                    Manage your CashVault preferences.
                </p>
            </div>

            {/* General */}
            <section
                className="
                    overflow-hidden
                    rounded-2xl
                    border border-[var(--border)]
                    bg-[var(--surface)]
                "
            >
                <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6">
                    <h2 className="text-base font-semibold text-[var(--text-primary)] sm:text-lg">
                        General
                    </h2>

                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                        Basic preferences for your account.
                    </p>
                </div>

                <div className="divide-y divide-[var(--border)]">

                    {/* Currency */}
                    <div className="flex flex-col gap-4 px-5 py-5 sm:px-6">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <p className="text-sm font-medium text-[var(--text-primary)]">
                                    Currency
                                </p>

                                <p className="mt-1 text-xs text-[var(--text-muted)]">
                                    Choose the currency used throughout the app.
                                </p>
                            </div>

                            <div className="w-full sm:w-56">
                                <Select
                                    options={[
                                        {
                                            value: "EGP",
                                            label: "EGP — Egyptian Pound",
                                        },
                                        {
                                            value: "USD",
                                            label: "USD — US Dollar",
                                        },
                                        {
                                            value: "EUR",
                                            label: "EUR — Euro",
                                        },
                                        {
                                            value: "GBP",
                                            label: "GBP — British Pound",
                                        },
                                    ]}
                                    value={currency}
                                    onChange={(e) => {
                                        setCurrency(e.target.value);
                                        setSaved(false);
                                    }}
                                />
                            </div>

                        </div>

                        <div className="flex items-center justify-end gap-3">

                            {saved && (
                                <span className="text-xs font-medium text-[var(--income)]">
                                    Saved successfully
                                </span>
                            )}

                            <Button
                                type="button"
                                size="small"
                                onClick={handleSaveCurrency}
                                disabled={
                                    saving ||
                                    currency === profile?.currency
                                }
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </Button>

                        </div>

                    </div>

                </div>
            </section>

            {/* Notifications */}
            {/* <section
                className="
                    overflow-hidden
                    rounded-2xl
                    border border-[var(--border)]
                    bg-[var(--surface)]
                "
            >
                <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6">

                    <h2 className="text-base font-semibold text-[var(--text-primary)] sm:text-lg">
                        Notifications
                    </h2>

                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                        Control how CashVault notifies you.
                    </p>

                </div>

                <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-6">

                    <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                            Notifications
                        </p>

                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                            Receive notifications about your finances.
                        </p>
                    </div>

                    <button
                        type="button"
                        role="switch"
                        aria-checked={notifications}
                        onClick={() =>
                            setNotifications(
                                (current) => !current
                            )
                        }
                        className={`
                            relative
                            h-6
                            w-11
                            shrink-0
                            rounded-full
                            transition-colors
                            duration-200
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[var(--accent)]
                            focus:ring-offset-2
                            focus:ring-offset-[var(--background)]
                            ${notifications
                                ? "bg-[var(--accent)]"
                                : "bg-[var(--border)]"
                            }
                        `}
                    >
                        <span
                            className={`
                                absolute
                                top-1
                                h-4
                                w-4
                                rounded-full
                                bg-white
                                shadow-sm
                                transition-transform
                                duration-200
                                ${notifications
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }
                            `}
                        />
                    </button>

                </div>
            </section> */}

            {/* Appearance */}
            <section
                className="
                    overflow-hidden
                    rounded-2xl
                    border border-[var(--border)]
                    bg-[var(--surface)]
                "
            >
                <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6">

                    <h2 className="text-base font-semibold text-[var(--text-primary)] sm:text-lg">
                        Appearance
                    </h2>

                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                        Customize how CashVault looks.
                    </p>

                </div>

                <div className="px-5 py-5 sm:px-6">

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            rounded-xl
                            border border-[var(--border)]
                            bg-[var(--background)]
                            p-4
                        "
                    >

                        <div>
                            <p className="text-sm font-medium text-[var(--text-primary)]">
                                Dark Mode
                            </p>

                            <p className="mt-1 text-xs text-[var(--text-muted)]">
                                CashVault currently uses its dark appearance.
                            </p>
                        </div>

                        <span
                            className="
                                rounded-full
                                border border-[var(--accent)]/30
                                bg-[var(--accent)]/10
                                px-3
                                py-1
                                text-xs
                                font-medium
                                text-[var(--accent)]
                            "
                        >
                            Active
                        </span>

                    </div>

                </div>
            </section>

            {/* Data */}
            <section
                className="
                    overflow-hidden
                    rounded-2xl
                    border border-[var(--border)]
                    bg-[var(--surface)]
                "
            >

                <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6">

                    <h2 className="text-base font-semibold text-[var(--text-primary)] sm:text-lg">
                        Data
                    </h2>

                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                        Manage your account data.
                    </p>

                </div>

                <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                    <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                            Cloud data
                        </p>

                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                            Your financial data is synchronized ✅.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="small"
                        disabled
                        className="
                            w-full
                            cursor-not-allowed
                            border-[var(--border)]
                            text-[var(--text-muted)]
                            opacity-60
                            sm:w-auto
                        "
                    >
                        Manage Data
                    </Button>

                </div>

            </section>

        </div>
    );
};

export default SettingsPage;