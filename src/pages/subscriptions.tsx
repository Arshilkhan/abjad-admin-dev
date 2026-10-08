import { CreditCard } from "lucide-react";

const subscriptions = [
  {
    organization: "ABJAD Engineering Works",
    plan: "Business",
    status: "Active",
    started: "12 Jan 2025",
    renewal: "12 Jan 2027",
  },
  {
    organization: "XYZ Manufacturing",
    plan: "Enterprise",
    status: "Active",
    started: "03 Mar 2025",
    renewal: "03 Mar 2027",
  },
  {
    organization: "Shree Industries",
    plan: "Trial",
    status: "Trial",
    started: "21 Sep 2026",
    renewal: "05 Oct 2026",
  },
  {
    organization: "Apex Components",
    plan: "Starter",
    status: "Suspended",
    started: "18 Jun 2025",
    renewal: "18 Jun 2027",
  },
];

const statusTone: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-800",
  Trial: "bg-amber-100 text-amber-800",
  Suspended: "bg-red-100 text-red-800",
};

export default function Subscriptions() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
          <CreditCard size={20} />
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">Subscriptions</h1>
          <p className="text-sm text-slate-500">
            Assign and manage subscriptions for organizations.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card p-4">
          <div className="text-xs text-slate-500">
            Total Organizations
          </div>
          <div className="mt-1 text-2xl font-semibold">27</div>
        </div>

        <div className="card p-4">
          <div className="text-xs text-slate-500">Active Plans</div>
          <div className="mt-1 text-2xl font-semibold">24</div>
        </div>

        <div className="card p-4">
          <div className="text-xs text-slate-500">Trial</div>
          <div className="mt-1 text-2xl font-semibold">3</div>
        </div>

        <div className="card p-4">
          <div className="text-xs text-slate-500">Suspended</div>
          <div className="mt-1 text-2xl font-semibold">2</div>
        </div>
      </div>

      {/* Desktop table */}
      <div className="card hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-800">
            <tr>
              <th className="p-3">Organization</th>
              <th className="p-3">Plan</th>
              <th className="p-3">Status</th>
              <th className="p-3">Started</th>
              <th className="p-3">Renewal</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {subscriptions.map((subscription) => (
              <tr
                key={subscription.organization}
                className="border-b border-slate-100 last:border-0 dark:border-slate-800"
              >
                <td className="p-3 font-medium">
                  {subscription.organization}
                </td>

                <td className="p-3">
                  {subscription.plan}
                </td>

                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${statusTone[subscription.status]
                      }`}
                  >
                    {subscription.status}
                  </span>
                </td>

                <td className="p-3">
                  {subscription.started}
                </td>

                <td className="p-3">
                  {subscription.renewal}
                </td>

                <td className="p-3 text-right">
                  <button className="btn">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {subscriptions.map((subscription) => (
          <div
            key={subscription.organization}
            className="card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-semibold">
                  {subscription.organization}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {subscription.plan}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-2 py-1 text-xs ${statusTone[subscription.status]
                  }`}
              >
                {subscription.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              <div>
                <p className="text-xs text-slate-500">
                  Started
                </p>
                <p className="mt-1 text-sm font-medium">
                  {subscription.started}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Renewal
                </p>
                <p className="mt-1 text-sm font-medium">
                  {subscription.renewal}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button className="btn w-full">
                Manage Subscription
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}