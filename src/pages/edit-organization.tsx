
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { organizationService } from "../services/organizationService";
import type { Organization } from "../types";

export default function EditOrganization() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrganization() {
      if (!id) {
        setError("Organization ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const result = await organizationService.getById(id);

        if (!result) {
          throw new Error("Organization not found.");
        }

        if (!cancelled) {
          setOrganization(result);
          setName(result.name);
          setSlug(result.id);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load organization.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadOrganization();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id || !name.trim()) {
      setError("Organization name is required.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await organizationService.update(id, { name: name.trim() });
      navigate("/organizations", {
        state: { successMessage: "Organization updated successfully." },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update organization.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading organization…</div>;
  }

  if (!organization) {
    return (
      <div className="space-y-4">
        <p role="alert" className="text-sm text-red-600">
          {error || "Organization not found."}
        </p>
        <button className="btn" onClick={() => navigate("/organizations")}>
          Back to organizations
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="btn mt-1"
          onClick={() => navigate("/organizations")}
          aria-label="Back to organizations"
        >
          <ArrowLeft size={16} />
        </button>

        <div>
          <h1 className="text-2xl font-semibold">Edit Organization</h1>
          <p className="text-sm text-slate-500">
            Update the organization details.
          </p>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-5 p-5">
        <div>
          <label htmlFor="organizationName" className="label">
            Organization name
          </label>
          <input
            id="organizationName"
            className="input w-full"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={150}
          />
        </div>

        <div>
          <label htmlFor="organizationSlug" className="label">
            Organization ID
          </label>
          <input
            id="organizationSlug"
            className="input w-full"
            value={slug}
            readOnly
          />
          <p className="mt-1 text-xs text-slate-500">
            The ID is read-only and will not be changed.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          Current status: <strong>{organization.status}</strong>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="btn"
            onClick={() => navigate("/organizations")}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSaving}
          >
            {isSaving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
