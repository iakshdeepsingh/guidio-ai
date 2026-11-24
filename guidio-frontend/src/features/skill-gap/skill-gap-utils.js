export const PRIORITY_ORDER = ["High", "Medium", "Low"];

// Colour is used only to show priority. Everything else stays black and white.
export const PRIORITY_STYLES = {
  High: {
    badge: "bg-destructive/10 text-destructive",
    bar: "bg-destructive",
  },
  Medium: {
    badge: "bg-warning/10 text-warning",
    bar: "bg-warning",
  },
  Low: {
    // bg-background so the pill shows on the gray skill tiles
    badge: "bg-background text-muted-foreground",
    bar: "bg-muted-foreground/50",
  },
};

export function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function countByPriority(skills) {
  const counts = { High: 0, Medium: 0, Low: 0 };

  for (const skill of skills) {
    if (counts[skill?.priority] !== undefined) {
      counts[skill.priority] += 1;
    }
  }

  return counts;
}

// High first, then Medium, then Low. Skills of the same priority keep the
// order the AI gave them.
export function sortByPriority(skills) {
  const rank = (skill) => {
    const index = PRIORITY_ORDER.indexOf(skill?.priority);
    return index === -1 ? PRIORITY_ORDER.length : index;
  };

  return skills
    .map((skill, index) => ({ skill, index }))
    .sort((a, b) => rank(a.skill) - rank(b.skill) || a.index - b.index)
    .map((entry) => entry.skill);
}