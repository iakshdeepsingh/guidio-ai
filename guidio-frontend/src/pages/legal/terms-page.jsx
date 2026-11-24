import { BrainCircuit, Compass, Gift, UserRoundCheck } from "lucide-react";

import { LEGAL, SITE } from "@/lib/site-config";
import {
  EmailLink,
  LegalLayout,
  LegalList,
  LegalSection,
  Placeholder,
  TextLink,
} from "@/pages/legal/legal-layout";

const highlights = [
  {
    icon: Gift,
    title: "Free for students",
    description: "Guidio AI runs on free AI services, so usage limits apply.",
  },
  {
    icon: BrainCircuit,
    title: "AI can make mistakes",
    description: "Always check important information before relying on it.",
  },
  {
    icon: Compass,
    title: "Guidance, not guarantees",
    description: "Plans and scores help you prepare. They don't promise results.",
  },
  {
    icon: UserRoundCheck,
    title: "Your content stays yours",
    description: "You keep ownership of what you submit to the service.",
  },
];

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of these terms",
    content: (
      <p>
        These terms apply to your use of Guidio AI, operated by{" "}
        <Placeholder>{LEGAL.operator}</Placeholder>. By creating an account
        or using the service, you agree to them and to our{" "}
        <TextLink to="/privacy">Privacy Policy</TextLink>. If you do not
        agree, please do not use the service.
      </p>
    ),
  },
  {
    id: "service",
    title: "2. The service",
    content: (
      <p>
        Guidio AI is a free AI career companion for students. It includes an
        AI assistant, skill gap analysis, career guidance, mock interviews,
        a student profile and a dashboard.
      </p>
    ),
  },
  {
    id: "accounts",
    title: "3. Accounts and your responsibilities",
    content: (
      <LegalList>
        <li>Give accurate information and keep it up to date.</li>
        <li>
          Keep your sign-in details secure. You are responsible for activity
          under your account.
        </li>
        <li>Tell us promptly if you believe your account has been misused.</li>
        <li>
          Age requirement: <Placeholder>{LEGAL.minimumAge}</Placeholder>
        </li>
      </LegalList>
    ),
  },
  {
    id: "use",
    title: "4. Acceptable use",
    content: (
      <>
        <p>You agree not to:</p>
        <LegalList>
          <li>Use the service for anything unlawful, harmful or deceptive</li>
          <li>
            Try to break, probe or bypass the security, authentication or rate
            limits of the service
          </li>
          <li>
            Use bots, scripts or other automated means to send requests in bulk
            or to copy the service
          </li>
          <li>
            Ask the AI to produce hateful, illegal, abusive or misleading
            content, or content that infringes someone else’s rights
          </li>
          <li>
            Impersonate another person or submit someone’s personal data
            without the right to do so
          </li>
          <li>Interfere with the service or with other users’ use of it</li>
        </LegalList>
      </>
    ),
  },
  {
    id: "ai",
    title: "5. AI-generated content",
    content: (
      <p>
        Responses are produced by AI models. They can be inaccurate,
        incomplete, out of date or biased, and similar questions may receive
        different answers. Always check important information with reliable
        sources before relying on it. AI output is not professional advice.
      </p>
    ),
  },
  {
    id: "guidance",
    title: "6. Educational and career guidance",
    content: (
      <p>
        Career plans, readiness scores, skill gap reports and interview
        feedback are informational estimates to help you plan and practise.
        They do not guarantee a job, an interview result, an admission, a
        salary or any other outcome, and they are not professional counselling
        or legal, financial or medical advice. Decisions about your education
        and career are yours.
      </p>
    ),
  },
  {
    id: "content",
    title: "7. Your content",
    content: (
      <p>
        You keep ownership of what you submit, such as profile details,
        messages and interview answers. You give us permission to store and
        process it, including by sending the needed parts to our AI providers,
        only to run and improve the service as described in the{" "}
        <TextLink to="/privacy">Privacy Policy</TextLink>. You are
        responsible for the content you submit.
      </p>
    ),
  },
  {
    id: "availability",
    title: "8. Availability and limits",
    content: (
      <p>
        Guidio AI uses free AI services, which have usage quotas and rate
        limits. The service, or parts of it, may be slow, limited or
        unavailable at times, and we may change, pause or remove features. We
        do not promise uninterrupted or error-free operation.
      </p>
    ),
  },
  {
    id: "third-party",
    title: "9. Third-party services",
    content: (
      <p>
        The service relies on providers such as Clerk, hosting and database
        providers and AI providers. Their own terms apply to their services,
        and we are not responsible for their availability or conduct.
      </p>
    ),
  },
  {
    id: "ip",
    title: "10. Intellectual property",
    content: (
      <p>
        The Guidio AI name, design and software belong to{" "}
        <Placeholder>{LEGAL.operator}</Placeholder> or its licensors. You
        may use the service for your own personal career preparation. You
        may not copy, resell or reverse engineer it except where the law
        allows.
      </p>
    ),
  },
  {
    id: "liability",
    title: "11. Disclaimers and limitation of liability",
    content: (
      <p>
        The service is provided “as is” and “as available”. To the fullest
        extent permitted by law, we are not liable for indirect, incidental
        or consequential losses, or for decisions you make based on
        AI-generated content. Nothing in these terms excludes liability that
        cannot be excluded by law.{" "}
        <Placeholder>
          [LEGAL REVIEW: have a lawyer confirm this clause for your
          jurisdiction]
        </Placeholder>
      </p>
    ),
  },
  {
    id: "termination",
    title: "12. Suspension and termination",
    content: (
      <p>
        We may suspend or end access to the service if you break these terms,
        abuse the service or if the law requires it. You can stop using
        Guidio AI at any time and may ask us to delete your account as
        described in the <TextLink to="/privacy">Privacy Policy</TextLink>.
      </p>
    ),
  },
  {
    id: "law",
    title: "13. Governing law",
    content: (
      <p>
        <Placeholder>{LEGAL.governingLaw}</Placeholder>
      </p>
    ),
  },
  {
    id: "changes",
    title: "14. Changes to these terms",
    content: (
      <p>
        We may update these terms. The “Last updated” date shows the latest
        version. Continuing to use the service after a change means you
        accept the updated terms.
      </p>
    ),
  },
  {
    id: "contact",
    title: "15. Contact",
    content: (
      <p>
        Questions about these terms: <EmailLink />.
      </p>
    ),
  },
];

function TermsPage() {
  return (
    <LegalLayout title="Terms and Conditions" updated={SITE.legalUpdated}>
      {/* At a glance */}
      <div className="grid gap-3 sm:grid-cols-2">
        {highlights.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[1.5rem] bg-muted p-5 sm:p-6"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-foreground text-background">
                <Icon aria-hidden="true" className="size-[18px]" />
              </span>
              <p className="mt-5 text-lg font-semibold leading-tight tracking-[-0.02em] text-foreground">
                {item.title}
              </p>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Contents */}
      <nav
        aria-label="On this page"
        className="rounded-[1.5rem] border border-foreground/10 p-5 sm:p-6"
      >
        <p className="text-xs font-semibold tracking-tight text-muted-foreground">
          On this page
        </p>

        <ol className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-sm tracking-[-0.01em] text-foreground/80 transition-colors hover:text-foreground hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:underline"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {sections.map((section) => (
        <LegalSection key={section.id} id={section.id} title={section.title}>
          {section.content}
        </LegalSection>
      ))}
    </LegalLayout>
  );
}

export default TermsPage;