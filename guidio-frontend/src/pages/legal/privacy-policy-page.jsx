import { BrainCircuit, EyeOff, ShieldCheck, Trash2 } from "lucide-react";

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
    icon: ShieldCheck,
    title: "We never sell your data",
    description: "Your information is used to run Guidio AI and nothing else.",
  },
  {
    icon: EyeOff,
    title: "No ads, no trackers",
    description: "We don't show advertising or use marketing analytics.",
  },
  {
    icon: BrainCircuit,
    title: "AI by Gemini and Groq",
    description: "Only what each AI request needs is sent to these providers.",
  },
  {
    icon: Trash2,
    title: "You can ask us to delete it",
    description: "Write to us to get a copy of your data or have it deleted.",
  },
];

const sections = [
  {
    id: "intro",
    title: "1. Who we are",
    content: (
      <>
        <p>
          Guidio AI (“we”, “us”) is a free AI career companion for students. It
          offers an AI assistant, skill gap analysis, career guidance and mock
          interviews. The service is operated by{" "}
          <Placeholder>{LEGAL.operator}</Placeholder>.
        </p>
        <p>
          This policy explains what information we collect, how it is used and
          what choices you have. You can contact us at <EmailLink />.
        </p>
      </>
    ),
  },
  {
    id: "collect",
    title: "2. Information we collect",
    content: (
      <>
        <p>
          <strong>Account information.</strong> When you sign up or sign in, our
          authentication provider, Clerk, handles your credentials. We receive
          and store your email address, your first and last name (if provided)
          and a link to your profile picture. We do not store your password.
        </p>
        <p>
          <strong>Student profile.</strong> Information you enter in onboarding
          or on your profile page:
        </p>
        <LegalList>
          <li>Education level, college and degree</li>
          <li>Graduation year and experience level</li>
          <li>Target role</li>
          <li>Skills and interests</li>
        </LegalList>
        <p>
          <strong>Content you create while using the service.</strong>
        </p>
        <LegalList>
          <li>AI assistant conversations: your messages and the AI replies</li>
          <li>Career guidance plans and skill gap reports</li>
          <li>
            Mock interview sessions: the questions, the answers you type,
            scores, feedback and improvement summaries
          </li>
          <li>Weekly readiness reminders shown inside the app</li>
        </LegalList>
        <p>
          <strong>Technical information.</strong> Our server keeps operational
          logs with the request method, page path, response status and timing.
          Sensitive fields are redacted, and we do not log request bodies or
          query strings. Our hosting providers may keep their own logs, which
          can include network information such as IP addresses.
        </p>
      </>
    ),
  },
  {
    id: "use",
    title: "3. How we use your information",
    content: (
      <>
        <LegalList>
          <li>To create your account and keep you signed in</li>
          <li>To provide the features you use and save your results</li>
          <li>To generate personalised AI guidance based on your profile</li>
          <li>To protect the service from abuse and keep it reliable</li>
          <li>To find and fix errors</li>
        </LegalList>
        <p>
          We do not sell your personal information. We do not show advertising,
          and we do not currently use analytics or marketing trackers.
        </p>
      </>
    ),
  },
  {
    id: "ai",
    title: "4. How AI providers are used",
    content: (
      <>
        <p>
          Guidio AI generates responses with third-party AI services: the
          Google Gemini API and Groq. When you use an AI feature, our server
          sends the information needed for that request to the provider:
        </p>
        <LegalList>
          <li>
            For career guidance and skill gap analysis: profile details such
            as education, degree, experience level, target role, skills and
            interests (career guidance also includes your college)
          </li>
          <li>
            For the AI assistant: your message and the most recent messages
            of the same conversation, so the answer has context
          </li>
          <li>
            For mock interviews: the target role, the interview question and
            the answer you typed
          </li>
        </LegalList>
        <p>
          In the current version of the service, your email address, name,
          password and account identifier are not included in these requests.
          Anything you type yourself is sent as written, so please do not enter
          passwords, government ID numbers, financial details, health
          information or other sensitive personal data into the assistant or
          interview answers.
        </p>
        <p>
          AI providers process this information under their own terms and
          privacy policies, which apply to the plan we use.{" "}
          <Placeholder>
            [CONFIRM: review the current Google Gemini API and Groq data-use
            terms for the plans in use and summarise them here]
          </Placeholder>
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "5. Who we share information with",
    content: (
      <>
        <p>
          We use the following service providers to run Guidio AI. They process
          information only as needed to provide their service:
        </p>
        <LegalList>
          <li>Clerk: sign-up, sign-in and account security</li>
          <li>
            Database hosting: <Placeholder>{LEGAL.databaseProvider}</Placeholder>
          </li>
          <li>Vercel: hosting of the website</li>
          <li>Render: hosting of the application server (API)</li>
          <li>Google (Gemini) and Groq: AI responses, as described above</li>
          <li>
            Inngest: scheduled and background tasks, such as weekly readiness
            reminders and interview improvement summaries. It receives internal
            record identifiers and may process the task data needed to run
            these tasks.{" "}
            <Placeholder>
              [CONFIRM: what task data Inngest stores and for how long]
            </Placeholder>
          </li>
        </LegalList>
        <p>
          We may also disclose information if the law requires it or to protect
          the rights, safety and security of our users and the service.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "6. Cookies and browser storage",
    content: (
      <>
        <LegalList>
          <li>
            <strong>Sign-in cookies (essential).</strong> Clerk sets cookies
            and similar storage that keep you signed in and secure the sign-in
            process. The service cannot work without them.
          </li>
          <li>
            <strong>Theme preference (functional).</strong> Your choice of
            light, dark or system theme is saved in your browser’s local
            storage so the site looks the way you chose. It is not sent to us.
          </li>
        </LegalList>
        <p>
          We do not currently use analytics, advertising or marketing cookies,
          so we do not show a cookie consent banner. If we add anything that
          is not essential, we will ask for your consent first and update this
          policy.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "7. Data security",
    content: (
      <p>
        We take reasonable steps to protect your information, including
        encrypted HTTPS connections, authentication for all private features,
        validation of submitted data, request rate limiting, and keeping
        secret keys on the server only. No online service can guarantee
        perfect security, so we cannot promise absolute protection.
      </p>
    ),
  },
  {
    id: "retention",
    title: "8. Data retention",
    content: (
      <p>
        We keep your information while your account is active. We do not
        currently delete data automatically. You can delete individual AI
        assistant conversations inside the app. After your account is closed
        or you ask us to delete your data, our retention period is{" "}
        <Placeholder>{LEGAL.retention}</Placeholder>.
      </p>
    ),
  },
  {
    id: "rights",
    title: "9. Your rights and deletion requests",
    content: (
      <>
        <LegalList>
          <li>
            View and update your name and student details on the Profile page,
            and your sign-in details through “Manage account” in Settings.
          </li>
          <li>Delete your assistant conversations inside the app.</li>
          <li>
            Ask us to provide a copy of your data, correct it or delete your
            account and stored records by writing to <EmailLink />. We aim to
            respond within <Placeholder>{LEGAL.responseTime}</Placeholder>.
          </li>
        </LegalList>
        <p>
          Depending on where you live, you may have additional rights under
          data protection law.{" "}
          <Placeholder>
            [LEGAL REVIEW: confirm which data protection laws apply and add
            the required details]
          </Placeholder>
        </p>
      </>
    ),
  },
  {
    id: "age",
    title: "10. Age requirements",
    content: (
      <p>
        <Placeholder>{LEGAL.minimumAge}</Placeholder>
      </p>
    ),
  },
  {
    id: "transfers",
    title: "11. Where information is processed",
    content: (
      <p>
        Our service providers may process information on servers in countries
        other than your own. By using Guidio AI you understand that your
        information may be transferred and processed in those locations.
      </p>
    ),
  },
  {
    id: "changes",
    title: "12. Changes to this policy",
    content: (
      <p>
        We may update this policy from time to time. The “Last updated” date
        at the top shows when it last changed. If a change is significant,
        we will make a reasonable effort to tell you.
      </p>
    ),
  },
  {
    id: "contact",
    title: "13. Contact",
    content: (
      <p>
        Questions about this policy or your data: <EmailLink />. Please also
        read our <TextLink to="/terms">Terms and Conditions</TextLink>.
      </p>
    ),
  },
];

function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated={SITE.legalUpdated}>
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

export default PrivacyPolicyPage;