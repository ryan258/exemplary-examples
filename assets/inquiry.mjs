const REQUIRED_FIELDS = ["name", "email", "need", "timing"];

function clean(value) {
  return String(value ?? "").trim();
}

export function buildInquiryMailto(inquiry, recipient) {
  const normalized = Object.fromEntries(
    Object.entries(inquiry).map(([key, value]) => [key, clean(value)]),
  );

  for (const field of REQUIRED_FIELDS) {
    if (!normalized[field]) throw new Error(`${field} is required`);
  }
  if (!clean(recipient)) throw new Error("recipient is required");

  const subject = `Pilot inquiry from ${normalized.name}`;
  const body = [
    "Executive Retainer pilot inquiry",
    "",
    `Name: ${normalized.name}`,
    `Reply-to email: ${normalized.email}`,
    `Role / organization: ${normalized.role || "Not provided"}`,
    `Timing: ${normalized.timing}`,
    "",
    "Decision or project need:",
    normalized.need,
    "",
    "I understand this starts a conversation and is not an application or acceptance into the pilot.",
  ].join("\n");

  return `mailto:${clean(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function attachInquiryForm() {
  const form = document.querySelector("#pilot-inquiry");
  if (!form) return;

  const status = document.querySelector("#inquiry-status");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(form));
    const url = buildInquiryMailto(fields, form.dataset.recipient);

    status.textContent = "Your email app should open with a prepared message. Review it, then send.";
    window.location.assign(url);
  });
}

if (typeof document !== "undefined") attachInquiryForm();
