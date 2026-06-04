import { useEffect, useMemo, useState } from "react";
import type { Profile } from "@/lib/types";
import { updateProfile } from "@/app/actions/profile";
import { Modal } from "../common";

type DashboardProfileFormProps = {
    open: boolean;
    initial: {
        username: string;
        avatarUrl: string;
        bio?: string;
    };
    onClose: () => void;
    onSaved: (updated: Profile) => void;
};

export default function DashboardProfileForm({
    open,
    initial,
    onClose,
    onSaved,
}: DashboardProfileFormProps) {
    const [username, setUsername] = useState(initial.username);
    const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl);
    const [bio, setBio] = useState(initial.bio ?? "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset form values when opening (so reopen reflects latest profile)
    useEffect(() => {
        if (!open) return;
        setUsername(initial.username);
        setAvatarUrl(initial.avatarUrl);
        setBio(initial.bio ?? "");
        setError(null);
    }, [open, initial.username, initial.avatarUrl, initial.bio]);

    const hasChanges = useMemo(() => {
        return (
            username !== initial.username ||
            avatarUrl !== initial.avatarUrl ||
            bio !== (initial.bio ?? "")
        );
    }, [username, avatarUrl, bio, initial.username, initial.avatarUrl, initial.bio]);

    const canSave = hasChanges && !saving;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSave) return;

        setSaving(true);
        setError(null);

        try {
            const result = await updateProfile({ username, avatarUrl, bio });
            if (!result.success) throw new Error(result.error);
            onSaved(result.profile);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to update profile";
            setError(message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal open={open} onClose={onClose} title="Edit profile">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Edit profile</h3>
                <button
                    type="button"
                    onClick={onClose}
                    className="px-2 py-1 rounded hover:bg-gray-100"
                    aria-label="Close"
                    disabled={saving}
                >
                    ✕
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {error && (
                    <div className="rounded border border-red-300 bg-red-50 text-red-700 p-3 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-sm font-medium">Username</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm"
                        placeholder="Your display name"
                        maxLength={40}
                        disabled={saving}
                    />
                    <p className="text-xs text-gray-500">Max 40 characters.</p>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Avatar URL</label>
                    <input
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm"
                        placeholder="https://..."
                        disabled={saving}
                    />
                    <p className="text-xs text-gray-500">
                        Tip: Use a direct image URL.
                    </p>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm"
                        placeholder="A short bio..."
                        rows={3}
                        maxLength={160}
                        disabled={saving}
                    />
                    <p className="text-xs text-gray-500">Max 160 characters.</p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded border border-gray-300"
                        disabled={saving}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                        disabled={!canSave}
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}