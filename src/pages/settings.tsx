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
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-soft text-brand">
          <SettingsIcon size={20} />
        </div>

        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-slate-500">
            Manage platform-wide ABJAD settings and defaults.
          </p>
        </div>
      </div>

      {/* Platform Information */}
      <section className="card p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-brand">
            <ShieldCheck size={18} />
          </div>

          <div>
            <h2 className="font-semibold">Platform Information</h2>
            <p className="text-sm text-slate-500">
              Basic information displayed across the ABJAD platform.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="platformName">
              Platform Name
            </label>

            <input
              id="platformName"
              className="input w-full"
              defaultValue="ABJAD ERP"
            />
          </div>

          <div>
            <label className="label" htmlFor="supportEmail">
              Support Email
            </label>

            <input
              id="supportEmail"
              type="email"
              className="input w-full"
              defaultValue="support@abjadengineeringworks.in"
            />
          </div>

          <div>
            <label className="label" htmlFor="supportPhone">
              Support Phone
            </label>

            <input
              id="supportPhone"
              type="tel"
              className="input w-full"
              defaultValue="+91"
            />
          </div>

          <div>
            <label className="label" htmlFor="platformWebsite">
              Platform Website
            </label>

            <input
              id="platformWebsite"
              type="url"
              className="input w-full"
              defaultValue="https://abjadengineeringworks.in"
            />
          </div>
        </div>
      </section>

      {/* Regional Defaults */}
      <section className="card p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-brand">
            <Globe2 size={18} />
          </div>

          <div>
            <h2 className="font-semibold">Regional Defaults</h2>
            <p className="text-sm text-slate-500">
              Default regional settings for the ABJAD platform.
            </p>
          </div>
        </div>

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
      <section className="card p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-brand">
            <Mail size={18} />
          </div>

          <div>
            <h2 className="font-semibold">Email</h2>
            <p className="text-sm text-slate-500">
              Default email settings for platform-generated messages.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="senderName">
              Sender Name
            </label>

            <input
              id="senderName"
              className="input w-full"
              defaultValue="ABJAD ERP"
            />
          </div>

          <div>
            <label className="label" htmlFor="senderEmail">
              Sender Email
            </label>

            <input
              id="senderEmail"
              type="email"
              className="input w-full"
              defaultValue="noreply@abjadengineeringworks.in"
            />
          </div>
        </div>
      </section>

      {/* System */}
      <section className="card p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-brand">
            <Wrench size={18} />
          </div>

          <div>
            <h2 className="font-semibold">System</h2>
            <p className="text-sm text-slate-500">
              Platform-wide system controls.
            </p>
          </div>
        </div>

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
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Maintenance mode is enabled. Organizations would be unable to
            access the ERP while this setting is active.
          </div>
        )}
      </section>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSave}
        >
          Save Settings
        </button>
      </div>
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
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="mt-1 text-xs text-slate-500">
          {description}
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
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