import { ChipInput } from "@/components/common/chip-input";
import { Input } from "@/components/ui/input";
import { getFieldProfile } from "@/features/onboarding/field-data";
import {
  EDUCATION_OPTIONS,
  EXPERIENCE_OPTIONS,
  LIMITS,
  PROGRAMMING_LANGUAGES,
} from "@/features/onboarding/onboarding-data";
import { ChoiceGroup } from "@/features/onboarding/choice-group";
import { FieldSelect } from "@/features/onboarding/field-select";
import { FormField } from "@/features/onboarding/form-field";
import { SuggestionButtons } from "@/features/onboarding/suggestion-buttons";

/**
 * Every step receives the same props:
 *   form      the current answers
 *   errors    validation messages keyed by field name
 *   onChange  (field, value) => void
 *   disabled  true while a save is running
 */

/** "Example: Law" built from the first suggestion of the chosen field. */
function exampleOf(list) {
  return `Example: ${list[0]}`;
}

export function BasicsStep({ form, errors, onChange, disabled }) {
  return (
    <div className="space-y-7">
      <FormField
        name="fullName"
        label="Full name"
        error={errors.fullName}
        hint="This is saved to your Guidio AI account."
      >
        {(control) => (
          <Input
            {...control}
            value={form.fullName}
            onChange={(event) => onChange("fullName", event.target.value)}
            placeholder="Example: Aarav Sharma"
            autoComplete="name"
            disabled={disabled}
            className="h-11"
          />
        )}
      </FormField>

      <FormField name="education" label="Education level" group error={errors.education}>
        {(control) => (
          <ChoiceGroup
            {...control}
            name="education"
            value={form.education}
            onChange={(value) => onChange("education", value)}
            options={EDUCATION_OPTIONS}
            disabled={disabled}
            className="sm:grid-cols-3"
          />
        )}
      </FormField>

      <FormField name="college" label="College, university or institute" error={errors.college}>
        {(control) => (
          <Input
            {...control}
            value={form.college}
            onChange={(event) => onChange("college", event.target.value)}
            placeholder="Example: Arka Jain University"
            autoComplete="organization"
            disabled={disabled}
            className="h-11"
          />
        )}
      </FormField>
    </div>
  );
}

export function AcademicsStep({ form, errors, onChange, disabled }) {
  const field = getFieldProfile(form.field);

  return (
    <div className="space-y-7">
      <FormField
        name="field"
        label="Field of study"
        optional
        hint="Only used to suggest relevant options. You can type anything in the fields below."
      >
        {(control) => (
          <FieldSelect
            {...control}
            value={form.field}
            onChange={(value) => onChange("field", value)}
            disabled={disabled}
          />
        )}
      </FormField>

      <FormField name="degree" label="Degree or course" error={errors.degree}>
        {(control) => (
          <div className="space-y-2">
            <Input
              {...control}
              value={form.degree}
              onChange={(event) => onChange("degree", event.target.value)}
              placeholder={exampleOf(field.degrees)}
              autoComplete="off"
              disabled={disabled}
              className="h-11"
            />
            <SuggestionButtons
              options={field.degrees}
              current={form.degree}
              onPick={(value) => onChange("degree", value)}
              disabled={disabled}
            />
          </div>
        )}
      </FormField>

      <FormField
        name="branch"
        label="Branch, specialisation or subject"
        optional
        error={errors.branch}
      >
        {(control) => (
          <div className="space-y-2">
            <Input
              {...control}
              value={form.branch}
              onChange={(event) => onChange("branch", event.target.value)}
              placeholder={exampleOf(field.branches)}
              autoComplete="off"
              disabled={disabled}
              className="h-11"
            />
            <SuggestionButtons
              options={field.branches}
              current={form.branch}
              onPick={(value) => onChange("branch", value)}
              disabled={disabled}
            />
          </div>
        )}
      </FormField>

      <FormField
        name="graduationYear"
        label="Graduation year"
        error={errors.graduationYear}
        hint="The year you finish or finished your course."
      >
        {(control) => (
          <Input
            {...control}
            value={form.graduationYear}
            onChange={(event) =>
              onChange("graduationYear", event.target.value.replace(/\D/g, "").slice(0, 4))
            }
            placeholder="Example: 2027"
            inputMode="numeric"
            autoComplete="off"
            disabled={disabled}
            className="h-11 sm:max-w-40"
          />
        )}
      </FormField>

      <FormField
        name="experienceLevel"
        label="Experience level"
        group
        error={errors.experienceLevel}
      >
        {(control) => (
          <ChoiceGroup
            {...control}
            name="experienceLevel"
            value={form.experienceLevel}
            onChange={(value) => onChange("experienceLevel", value)}
            options={EXPERIENCE_OPTIONS}
            disabled={disabled}
          />
        )}
      </FormField>
    </div>
  );
}

export function SkillsStep({ form, errors, onChange, disabled }) {
  const field = getFieldProfile(form.field);
  const showLanguages = field.showLanguages || form.languages.length > 0;
  const total = new Set(
    [...form.skills, ...form.languages].map((item) => item.toLowerCase())
  ).size;

  return (
    <div className="space-y-7">
      <FormField
        name="skills"
        label="Skills and knowledge"
        error={errors.skills}
        hint="Subjects, tools, methods and abilities you already have. Add at least one."
      >
        {(control) => (
          <ChipInput
            {...control}
            value={form.skills}
            onChange={(value) => onChange("skills", value)}
            suggestions={field.skills}
            placeholder={exampleOf(field.skills)}
            maxItems={Math.max(form.skills.length, LIMITS.maxSkills - form.languages.length)}
            maxLength={LIMITS.skill}
            disabled={disabled}
          />
        )}
      </FormField>

      {showLanguages ? (
        <FormField
          name="languages"
          label="Programming languages"
          optional
          hint="Only if you write code, for example for data work or research."
        >
          {(control) => (
            <ChipInput
              {...control}
              value={form.languages}
              onChange={(value) => onChange("languages", value)}
              suggestions={PROGRAMMING_LANGUAGES}
              placeholder="Example: Python"
              maxItems={Math.max(form.languages.length, LIMITS.maxSkills - form.skills.length)}
              maxLength={LIMITS.skill}
              disabled={disabled}
            />
          )}
        </FormField>
      ) : null}

      <p className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground">
        {total} of {LIMITS.maxSkills} skills added.
      </p>
    </div>
  );
}

export function DirectionStep({ form, errors, onChange, disabled }) {
  const field = getFieldProfile(form.field);

  return (
    <div className="space-y-7">
      <FormField
        name="targetRole"
        label="Preferred career role"
        error={errors.targetRole}
        hint="The job you want to prepare for. You can change it later."
      >
        {(control) => (
          <div className="space-y-2">
            <Input
              {...control}
              value={form.targetRole}
              onChange={(event) => onChange("targetRole", event.target.value)}
              placeholder={exampleOf(field.roles)}
              autoComplete="off"
              disabled={disabled}
              className="h-11"
            />
            <SuggestionButtons
              options={field.roles}
              current={form.targetRole}
              onPick={(value) => onChange("targetRole", value)}
              disabled={disabled}
            />
          </div>
        )}
      </FormField>

      <FormField
        name="interests"
        label="Areas of interest"
        error={errors.interests}
        hint="Topics you would like to explore. Add at least one."
      >
        {(control) => (
          <ChipInput
            {...control}
            value={form.interests}
            onChange={(value) => onChange("interests", value)}
            suggestions={field.interests}
            placeholder={exampleOf(field.interests)}
            maxItems={LIMITS.maxInterests}
            maxLength={LIMITS.interest}
            disabled={disabled}
          />
        )}
      </FormField>
    </div>
  );
}