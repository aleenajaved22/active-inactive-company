import type { CSSProperties, ReactNode } from 'react'
import filtergoLogo from '../assets/email/filtergo-logo.png'
import signalLogo from '../assets/email/signal-logo.png'
import socialFacebook from '../assets/email/social-facebook.png'
import socialInstagram from '../assets/email/social-instagram.png'
import socialLinkedin from '../assets/email/social-linkedin.png'
import socialX from '../assets/email/social-x.png'
import socialYoutube from '../assets/email/social-youtube.png'
import {
  foEmailBodyRich,
  foEmailHeadline,
  sampleFoEmail,
  tenantBranding,
  type BodySegment,
  type EmailTenant,
  type FoEmailData,
} from '../data/foEmailTemplate'

const socialLinks = [
  { name: 'LinkedIn', icon: socialLinkedin },
  { name: 'Facebook', icon: socialFacebook },
  { name: 'X', icon: socialX },
  { name: 'Instagram', icon: socialInstagram },
  { name: 'YouTube', icon: socialYoutube },
]

/** Filtergo sets detail values in a wider face than its body copy; Signal uses Inter throughout. */
const FILTERGO_VALUE_FONT = "'Host Grotesk', Inter, system-ui, sans-serif"

function Label({ children }: { children: ReactNode }) {
  return <p className="text-[13px] font-semibold leading-[18px] text-[#1f1f1f]">{children}</p>
}

function Value({ children, font }: { children: ReactNode; font?: string }) {
  return (
    <p className="mt-1 text-[15px] leading-4 text-[#3f3f3f]" style={font ? { fontFamily: font } : undefined}>
      {children}
    </p>
  )
}

function Rule() {
  return <div className="h-px w-full bg-[#e5e5e5]" />
}

/** Company, address and till date, then the active contracts, in the card's ruled blocks. */
function Details({ data, valueFont }: { data: FoEmailData; valueFont?: string }) {
  return (
    <>
      <Rule />
      <div className="grid grid-cols-[1fr_1fr] gap-y-4 py-4">
        <div>
          <Label>Company</Label>
          <Value font={valueFont}>{data.companyName}</Value>
        </div>
        <div>
          <Label>Address</Label>
          <Value font={valueFont}>{data.propertyAddress}</Value>
        </div>
        <div className="col-span-2">
          <Label>Company at Property - Till Date</Label>
          <Value font={valueFont}>{data.tillDate}</Value>
        </div>
      </div>

      <Rule />

      <div className="pt-4">
        <div className="grid grid-cols-[1fr_112px_80px] gap-x-3 pb-2">
          <Label>Deal Name</Label>
          <Label>Type</Label>
          <Label>Date</Label>
        </div>
        {data.contracts.map((contract) => (
          <div
            key={contract.dealName}
            className="grid grid-cols-[1fr_112px_80px] gap-x-3 border-t border-[#efefef] py-2.5 text-[15px] leading-5 text-[#3f3f3f]"
            style={valueFont ? { fontFamily: valueFont } : undefined}
          >
            <span className="min-w-0">{contract.dealName}</span>
            <span>{contract.type}</span>
            <span>{contract.date}</span>
          </div>
        ))}
      </div>
    </>
  )
}

function Footer({ background, contact }: { background: string; contact: string }) {
  return (
    <div className="flex flex-col items-center px-6 pb-9 pt-[34px]" style={{ backgroundColor: background }}>
      <div className="flex">
        {socialLinks.map((link) => (
          <img key={link.name} alt={link.name} className="size-7" src={link.icon} />
        ))}
      </div>
      <p className="mt-[9px] text-xs leading-[18px] text-white/90">
        Reach out to{' '}
        <a href={`mailto:${contact}`} className="underline">
          {contact}
        </a>{' '}
        for any queries
      </p>
    </div>
  )
}

function Button({ background }: { background: string }) {
  const style: CSSProperties = { backgroundColor: background }
  return (
    <a
      href="#/property/0"
      className="inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-medium leading-5 text-white"
      style={style}
    >
      View Property
    </a>
  )
}

function renderSegments(segments: BodySegment[], boldClass: string) {
  return segments.map((segment, index) =>
    typeof segment === 'string' ? (
      segment
    ) : (
      <span key={index} className={boldClass}>
        {segment.bold}
      </span>
    ),
  )
}

/**
 * The Franchise Owner email. Each tenant is laid out to its own design:
 *
 * - Filtergo: a centred headline and button, left-aligned copy with a bold
 *   greeting, then the ruled detail blocks.
 * - Signal: a two-line headline (a regular line over a bold one), a rule under
 *   the button, a plain greeting and the key values in bold, on a narrower text
 *   column.
 *
 * The details, contracts table and footer follow the same rules in both.
 */
export function FranchiseOwnerEmailPage({ tenant }: { tenant: EmailTenant }) {
  const brand = tenantBranding[tenant]
  const data = sampleFoEmail
  const body = foEmailBodyRich(data)
  const [greeting, ...paragraphs] = body

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: brand.pageBg }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;500&display=swap');"}</style>

      <div className="px-4 pb-16 pt-10">
        <div className="mx-auto flex w-full max-w-[600px] flex-col items-center">
          {tenant === 'Filtergo' ? (
            <img alt="Filtergo" className="mb-8 h-[52px] w-auto" src={filtergoLogo} />
          ) : (
            <img alt="Signal" className="mb-12 h-[34px] w-auto" src={signalLogo} />
          )}

          <div className="w-full overflow-hidden rounded-2xl bg-white">
            {tenant === 'Filtergo' ? (
              <div className="px-[60px] pb-6 pt-9">
                <h2 className="mx-auto max-w-[440px] text-center text-[18px] font-normal leading-[26px] text-black">
                  {foEmailHeadline(data)}
                </h2>
                <div className="mt-5 flex justify-center">
                  <Button background={brand.accent} />
                </div>

                <div className="mt-8 text-sm leading-5 text-[#3b3b3b]">
                  <p>
                    <span className="font-semibold text-[#3e3e3e]">{renderSegments(greeting, '')}</span>
                    <br />
                    {renderSegments(paragraphs[0], '')}
                  </p>
                  {paragraphs.slice(1).map((paragraph, index) => (
                    <p key={index} className="mt-5">
                      {renderSegments(paragraph, '')}
                    </p>
                  ))}
                  <p className="mt-5">
                    Regards,
                    <br />
                    {brand.name}
                  </p>
                </div>

                <div className="mt-9">
                  <Details data={data} valueFont={FILTERGO_VALUE_FONT} />
                </div>
              </div>
            ) : (
              <div className="px-[86px] pb-9 pt-9">
                <h2 className="text-center text-[18px] leading-[26px] text-black">
                  <span className="font-normal">{data.companyName} leaves this property on</span>
                  <br />
                  <span className="font-bold">{data.tillDate}</span>
                </h2>
                <div className="mt-5 flex justify-center">
                  <Button background={brand.accent} />
                </div>

                <div className="mt-7">
                  <Rule />
                </div>

                <div className="mt-7 text-sm leading-5 text-[#444446]">
                  <p>{renderSegments(greeting, '')}</p>
                  {paragraphs.map((paragraph, index) => (
                    <p key={index} className="mt-5">
                      {renderSegments(paragraph, 'font-semibold text-[#262527]')}
                    </p>
                  ))}
                  <p className="mt-5">
                    Regards,
                    <br />
                    {brand.name}
                  </p>
                </div>

                <div className="mt-9">
                  <Details data={data} />
                </div>
              </div>
            )}

            <Footer background={brand.footer} contact={brand.contact} />
          </div>
        </div>
      </div>
    </div>
  )
}
