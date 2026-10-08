import { useState } from "react";
import {
  Globe2,
  Mail,
  Settings as SettingsIcon,
  ShieldCheck,
  Wrench,
} from "lucide-react";

export default function Settings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [systemNotifications, setSystemNotifications] = useState(true);

  const handleSave = () => {
    alert("Platform settings saved.");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
          <SettingsIcon size={20} />
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-slate-500">
            Manage platform-wide ABJAD settings and defaults.
          </p>
        </div>
      </div>

      {/* Platform Information */}
      <section className="card p-4 sm:p-6">
        <SectionHeader
          icon={<ShieldCheck size={18} />}
          title="Platform Information"
          description="Basic information displayed across the ABJAD platform."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            id="platformName"
            label="Platform Name"
            defaultValue="ABJAD ERP"
          />

          <Field
            id="supportEmail"
            label="Support Email"
            type="email"
            defaultValue="support@abjadengineeringworks.in"
          />

          <Field
            id="supportPhone"
            label="Support Phone"
            type="tel"
            defaultValue="+91"
          />

          <Field
            id="platformWebsite"
            label="Platform Website"
            type="url"
            defaultValue="https://abjadengineeringworks.in"
          />
        </div>
      </section>

      {/* Regional Defaults */}
      <section className="card p-4 sm:p-6">
        <SectionHeader
          icon={<Globe2 size={18} />}
          title="Regional Defaults"
          description="Default regional settings for the ABJAD platform."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="timezone">
              Default Timezone
            </label>

            <select
              id="timezone"
              className="input w-full"
              defaultValue="Asia/Kolkata"
            >
              <option value="Asia/Kolkata">
                India Standard Time (IST)
              </option>
              <option value="UTC">UTC</option>
            </select>
          </div>

          <div>
            <label className="label" htmlFor="currency">
              Default Currency
            </label>

            <select
              id="currency"
              className="input w-full"
              defaultValue="INR"
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>

          <div>
            <label className="label" htmlFor="dateFormat">
              Date Format
            </label>

            <select
              id="dateFormat"
              className="input w-full"
              defaultValue="DD/MM/YYYY"
            >
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="label" htmlFor="numberFormat">
              Number Format
            </label>

            <select
              id="numberFormat"
              className="input w-full"
              defaultValue="IN"
            >
              <option value="IN">Indian (1,00,000)</option>
              <option value="INTL">International (100,000)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Email */}
      <section className="card p-4 sm:p-6">
        <SectionHeader
          icon={<Mail size={18} />}
          title="Email"
          description="Default email settings for platform-generated messages."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            id="senderName"
            label="Sender Name"
            defaultValue="ABJAD ERP"
          />

          <Field
            id="senderEmail"
            label="Sender Email"
            type="email"
            defaultValue="noreply@abjadengineeringworks.in"
          />
        </div>
      </section>

      {/* System */}
      <section className="card p-4 sm:p-6">
        <SectionHeader
          icon={<Wrench size={18} />}
          title="System"
          description="Platform-wide system controls."
        />

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <SettingToggle
            title="System Notifications"
            description="Allow important system notifications to be sent to administrators."
            enabled={systemNotifications}
            onChange={setSystemNotifications}
          />

          <SettingToggle
            title="Maintenance Mode"
            description="Temporarily prevent organizations from accessing the ERP."
            enabled={maintenanceMode}
            onChange={setMaintenanceMode}
          />
        </div>

        {maintenanceMode && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-5 text-amber-800">
            Maintenance mode is enabled. Organizations would be unable to
            access the ERP while this setting is active.
          </div>
        )}
      </section>

      {/* Actions */}
      <div className="flex">
        <button
          type="button"
          className="btn btn-primary w-full sm:w-auto sm:ml-auto"
          onClick={handleSave}
        >
          Save Settings
        </button>
      </div>
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
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  defaultValue,
}: {
  id: string;
  label: string;
  type?: string;
  defaultValue: string;
}) {
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>

      <input
        id={id}
        type={type}
        className="input w-full"
        defaultValue={defaultValue}
      />
    </div>
  );
}

type SettingToggleProps = {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
};

function SettingToggle({
  title,
  description,
  enabled,
  onChange,
}: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0 pr-2">
        <div className="text-sm font-medium">{title}</div>

        <div className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={`${enabled ? "Disable" : "Enable"} ${title}`}
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-brand"
            : "bg-slate-300 dark:bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}