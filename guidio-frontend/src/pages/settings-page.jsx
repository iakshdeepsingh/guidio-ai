import { PageHeader } from "@/components/common/page-header";
import { AiUsageNotice } from "@/components/common/ai-usage-notice";
import { AccountCard } from "@/features/settings/account-card";
import { AppearanceCard } from "@/features/settings/appearance-card";
import { SecurityCard } from "@/features/settings/security-card";

function SettingsPage() {
  return (
    <div className="space-y-8 pb-8 sm:space-y-10">
      <PageHeader
        title="Settings"
        description="Manage your account, appearance and see how the AI features work."
      />

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2 lg:items-start">
        <div className="min-w-0 space-y-3 sm:space-y-4">
          <AccountCard />
          <SecurityCard />
        </div>

        <div className="min-w-0 space-y-3 sm:space-y-4">
          <AppearanceCard />
          <AiUsageNotice variant="card" />
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;