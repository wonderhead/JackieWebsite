import { ArrowUpRight, Camera, Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import contactBanner from '../assets/site-images/contact/contact-banner.jpg'
import { siteContent } from '../content/siteContent'
import { buildMailtoUrl, type ContactDraft } from '../lib/mailto'

type ContactErrors = Partial<Record<keyof ContactDraft, string>>

const emptyDraft: ContactDraft = {
  firstName: '',
  lastName: '',
  email: '',
  message: '',
}

function validateContact(draft: ContactDraft): ContactErrors {
  const errors: ContactErrors = {}
  if (!draft.firstName.trim()) errors.firstName = 'Enter your first name.'
  if (!draft.lastName.trim()) errors.lastName = 'Enter your last name.'
  if (!/^\S+@\S+\.\S+$/.test(draft.email.trim())) errors.email = 'Enter a valid email address.'
  if (!draft.message.trim()) errors.message = 'Tell Jacqueline a little about your project.'
  return errors
}

export function ContactPage() {
  const [draft, setDraft] = useState(emptyDraft)
  const [errors, setErrors] = useState<ContactErrors>({})
  const { contact, social } = siteContent
  const [emailName, emailDomain] = contact.displayedEmail.split('@')

  const updateField = (field: keyof ContactDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateContact(draft)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    window.location.href = buildMailtoUrl(contact.recipientEmail, contact.mailSubject, draft)
  }

  return (
    <div className="contact-page">
      <section className="contact-layout shell">
        <div className="contact-introduction" data-reveal="left">
          <p className="eyebrow">{contact.eyebrow}</p>
          <h1>{contact.heading}</h1>
          <p>{contact.introduction}</p>

          <div className="contact-profile">
            <figure className="contact-portrait">
              <img
                src={contactBanner}
                alt="Portrait of Jacqueline"
                width="1289"
                height="1701"
                decoding="async"
              />
            </figure>
            <address className="contact-details">
              <a href={`mailto:${contact.recipientEmail}`}>
                <Mail aria-hidden="true" /> <span>{emailName}<wbr />@{emailDomain}</span>
              </a>
              {contact.displayedPhone && (
                <a href={`tel:${contact.displayedPhone.replace(/[^\d+]/g, '')}`}>
                  <Phone aria-hidden="true" /> {contact.displayedPhone}
                </a>
              )}
              <span><MapPin aria-hidden="true" /> {contact.location}</span>
              <a href={social.instagramUrl} target="_blank" rel="noopener noreferrer">
                <Camera aria-hidden="true" /> {social.instagramLabel}
              </a>
            </address>
          </div>
        </div>

        <form
          className="contact-form"
          onSubmit={submit}
          noValidate
          data-reveal="right"
          data-reveal-delay="1"
        >
          <div className="contact-form__row">
            <label>
              <span>First name</span>
              <input
                name="firstName"
                autoComplete="given-name"
                value={draft.firstName}
                onChange={(event) => updateField('firstName', event.target.value)}
                aria-invalid={Boolean(errors.firstName)}
                aria-describedby={errors.firstName ? 'first-name-error' : undefined}
              />
              {errors.firstName && <small id="first-name-error">{errors.firstName}</small>}
            </label>
            <label>
              <span>Last name</span>
              <input
                name="lastName"
                autoComplete="family-name"
                value={draft.lastName}
                onChange={(event) => updateField('lastName', event.target.value)}
                aria-invalid={Boolean(errors.lastName)}
                aria-describedby={errors.lastName ? 'last-name-error' : undefined}
              />
              {errors.lastName && <small id="last-name-error">{errors.lastName}</small>}
            </label>
          </div>
          <label>
            <span>Email address</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={draft.email}
              onChange={(event) => updateField('email', event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <small id="email-error">{errors.email}</small>}
          </label>
          <label>
            <span>Message</span>
            <textarea
              name="message"
              rows={7}
              value={draft.message}
              onChange={(event) => updateField('message', event.target.value)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && <small id="message-error">{errors.message}</small>}
          </label>
          <button className="contact-form__submit" type="submit">
            Open email draft <ArrowUpRight aria-hidden="true" />
          </button>
        </form>
      </section>
    </div>
  )
}
