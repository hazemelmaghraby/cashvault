import { LockKeyhole } from "lucide-react";

interface LoadingProps {
    fullScreen?: boolean;
    text?: string;
}

const Loading = ({
    fullScreen = true,
    text = "Loading CashVault...",
}: LoadingProps) => {
    return (
        <div
            className={`
                flex items-center justify-center
                bg-[var(--background)]
                ${fullScreen ? "min-h-screen w-full" : "py-16"}
            `}
        >
            <div className="flex flex-col items-center">

                {/* Loader */}
                <div className="relative flex h-16 w-16 items-center justify-center">

                    {/* Outer rotating ring */}
                    <div
                        className="
                            absolute inset-0
                            rounded-full
                            border-2
                            border-[var(--border)]
                            border-t-[var(--accent)]
                            animate-spin
                        "
                        style={{
                            animationDuration: "1.4s",
                        }}
                    />

                    {/* Inner subtle ring */}
                    <div
                        className="
                            absolute inset-2
                            rounded-full
                            border
                            border-[var(--accent)]
                            opacity-20
                            animate-pulse
                        "
                    />

                    {/* Center icon */}
                    <div
                        className="
                            relative
                            flex h-9 w-9
                            items-center justify-center
                            rounded-xl
                            bg-[var(--surface)]
                            shadow-sm
                        "
                    >
                        <LockKeyhole
                            className="
                                h-4 w-4
                                text-[var(--accent)]
                            "
                            strokeWidth={2}
                        />
                    </div>

                </div>

                {/* Brand */}
                <div className="mt-5 text-center">

                    <p
                        className="
                            text-sm
                            font-bold
                            tracking-[0.18em]
                            text-[var(--text-primary)]
                        "
                    >
                        CASHVAULT
                    </p>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-[var(--text-muted)]
                        "
                    >
                        {text}
                    </p>

                </div>

                {/* Loading dots */}
                <div className="mt-4 flex items-center gap-1.5">

                    {[0, 1, 2].map((dot) => (
                        <span
                            key={dot}
                            className="
                                h-1.5 w-1.5
                                rounded-full
                                bg-[var(--accent)]
                                opacity-40
                                animate-pulse
                            "
                            style={{
                                animationDelay: `${dot * 180}ms`,
                            }}
                        />
                    ))}

                </div>

            </div>
        </div>
    );
};

export default Loading;