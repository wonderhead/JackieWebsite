export interface ContactDraft {
  firstName: string
  lastName: string
  email: string
  message: string
}

export function buildMailtoUrl(
  recipient: string,
  subject: string,
  draft: ContactDraft,
) {
  const fullName = `${draft.firstName.trim()} ${draft.lastName.trim()}`.trim()
  const body = [
    `Name: ${fullName}`,
    `Email: ${draft.email.trim()}`,
    '',
    'Message:',
    draft.message.trim(),
  ].join('\n')

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
