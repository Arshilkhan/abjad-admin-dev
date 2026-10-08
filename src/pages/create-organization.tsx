import {
  ArrowLeft,
  Building2,
  CreditCard,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const states = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function CreateOrganization() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    alert("Organization created successfully.");
    navigate("/organizations");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="btn mt-1 shrink-0"
          onClick={() => navigate("/organizations")}
          aria-label="Back to organizations"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">
            Create Organization
          </h1>

          <p className="text-sm text-slate-500">
            Onboard a new organization to the ABJAD platform.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Profile */}
        <section className="card p-4 sm:p-6">
          <SectionHeader
            icon={<Building2 size={18} />}
            title="Company Profile"
            description="Basic information about the organization."
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Company Name"
              name="companyName"
              placeholder="Enter company name"
              required
            />

            <Field
              label="Website"
              name="website"
              type="url"
              placeholder="https://example.com"
            />

            <div className="md:col-span-2">
              <label className="label" htmlFor="address">
                Address
              </label>

              <textarea
                id="address"
                name="address"
                className="input min-h-24 w-full resize-y"
                placeholder="Enter complete company address"
              />
            </div>

            <Field
              label="City"
              name="city"
              placeholder="Enter city"
              required
            />

            <Field
              label="PIN Code"
              name="pinCode"
              placeholder="e.g. 423203"
              inputMode="numeric"
              required
            />

            <div>
              <label className="label" htmlFor="state">
                State
              </label>

              <select
                id="state"
                name="state"
                className="input w-full"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select state
                </option>

                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <Field
              label="State Code"
              name="stateCode"
              placeholder="e.g. 27"
              inputMode="numeric"
              required
            />
          </div>
        </section>

        {/* Contact Information */}
        <section className="card p-4 sm:p-6">
          <SectionHeader
            icon={<UserRound size={18} />}
            title="Contact Information"
            description="Primary contact details for the organization."
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Mobile"
              name="mobile"
              type="tel"
              placeholder="Enter mobile number"
              inputMode="tel"
              required
            />

            <Field
              label="Alternative Mobile"
              name="altMobile"
              type="tel"
              placeholder="Enter alternate mobile number"
              inputMode="tel"
            />

            <div className="md:col-span-2">
              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="company@example.com"
                required
              />

              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                This email address will be used to log in to the organization.
              </p>
            </div>
          </div>
        </section>

        {/* Bank Information */}
        <section className="card p-4 sm:p-6">
          <SectionHeader
            icon={<CreditCard size={18} />}
            title="Bank Information"
            description="Tax and banking details for the organization."
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="GST Number"
              name="gstNumber"
              placeholder="Enter GST number"
              required
            />

            <Field
              label="PAN Number"
              name="panNumber"
              placeholder="Enter PAN number"
              required
            />

            <Field
              label="Bank Name"
              name="bankName"
              placeholder="Enter bank name"
            />

            <Field
              label="Branch"
              name="branch"
              placeholder="Enter branch"
            />

            <Field
              label="Account Number"
              name="accountNumber"
              placeholder="Enter account number"
              inputMode="numeric"
            />

            <Field
              label="IFSC Code"
              name="ifscCode"
              placeholder="e.g. SBIN0001234"
            />
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="btn w-full sm:w-auto"
            onClick={() => navigate("/organizations")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary w-full sm:w-auto"
          >
            Create Organization
          </button>
        </div>
      </form>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
        {icon}
      </div>

      <div className="min-w-0">
        <h2 className="font-semibold">{title}</h2>

        <p className="text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  inputMode,
}: FieldProps) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        className="input w-full"
        placeholder={placeholder}
        required={required}
        inputMode={inputMode}
      />
    </div>
  );
}