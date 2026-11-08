import { describe, expect, it } from 'vitest'
import { buildMailtoUrl } from './mailto'

describe('buildMailtoUrl', () => {
  it('encodes the visitor details in a mail draft', () => {
    const url = buildMailtoUrl('Jackie.trinh.juarez@gmail.com', 'Portfolio inquiry', {
      firstName: ' Avery ',
      lastName: 'Stone',
      email: 'avery@example.com',
      message: 'Hello & welcome!\nDance + theatre — let’s talk.',
    })

    expect(url).toContain('mailto:Jackie.trinh.juarez@gmail.com?')
    expect(url).toContain('subject=Portfolio%20inquiry')
    const params = new URLSearchParams(url.split('?')[1])
    expect(params.get('subject')).toBe('Portfolio inquiry')
    expect(params.get('body')).toBe(
      'Name: Avery Stone\nEmail: avery@example.com\n\nMessage:\nHello & welcome!\nDance + theatre — let’s talk.',
    )
    expect(url).not.toContain('+')
  })
})
