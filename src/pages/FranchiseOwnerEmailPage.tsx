import type { ReactNode } from 'react'
import filtergoLogo from '../assets/email/filtergo-logo.png'
import socialFacebook from '../assets/email/social-facebook.png'
import socialInstagram from '../assets/email/social-instagram.png'
import socialLinkedin from '../assets/email/social-linkedin.png'
import socialX from '../assets/email/social-x.png'
import socialYoutube from '../assets/email/social-youtube.png'
import {
  foEmailBody,
  foEmailHeadline,
  sampleFoEmail,
  tenantBranding,
  type EmailTenant,
} from '../data/foEmailTemplate'

const socialLinks = [
  { name: 'LinkedIn', icon: socialLinkedin },
  { name: 'Facebook', icon: socialFacebook },
  { name: 'X', icon: socialX },
  { name: 'Instagram', icon: socialInstagram },
  { name: 'YouTube', icon: socialYoutube },
]

/**
 * Signal's mark, drawn from the same path as the app logo but cropped to the
 * mark itself. The logo file keeps the mark in the middle of a larger canvas, so
 * placing it beside the wordmark left a wide gap and sat it off the text's centre.
 */
function SignalMark({ className }: { className?: string }) {
  return (
    <svg viewBox="15.27 15.06 41.46 23.88" fill="none" aria-hidden className={className}>
      <path d="M38.6728 19.1414L35.6889 24.5342C35.5681 24.7494 35.0245 25.6287 34.8373 25.7702C34.342 26.3666 33.6594 26.7602 32.8984 26.8955C32.7172 26.957 32.0044 26.9938 31.8051 26.9938H21.875L15.273 38.9354H25.1971C25.7709 38.9293 27.8608 38.8125 28.3803 38.6034C30.44 38.1791 32.2642 36.7833 33.3272 34.8586L36.3111 29.4658C36.4319 29.2506 36.9755 28.3713 37.1627 28.2298C37.6581 27.6334 38.3466 27.2398 39.1077 27.0984C39.2889 27.0369 39.9956 27 40.1949 27H50.125L56.727 15.0646H46.8089C46.2351 15.0707 44.1452 15.1875 43.6258 15.3966C41.56 15.8148 39.7359 17.2168 38.6728 19.1414Z" fill="#FF9332" />
    </svg>
  )
}

/** Detail values are set in a wider face than the body copy, as in the design. */
const VALUE_FONT = "'Host Grotesk', Inter, system-ui, sans-serif"

function DetailLabel({ children }: { children: ReactNode }) {
  return <p className="text-[13px] font-semibold leading-[18px] text-[#1f1f1f]">{children}</p>
}

function DetailValue({ children }: { children: ReactNode }) {
  return (
    <p className="mt-1 text-[15px] leading-4 text-[#3f3f3f]" style={{ fontFamily: VALUE_FONT }}>
      {children}
    </p>
  )
}

function Divider() {
  return <div className="h-px w-full bg-[#e5e5e5]" />
}

/**
 * The Franchise Owner email, laid out to the existing Filtergo template: a
 * tinted canvas, the logo, a rounded white card (centred headline, button, left
 * aligned copy, ruled detail blocks) and a coloured footer band with the social
 * links. Signal swaps the logo and the colours; the structure is shared.
 */
export function FranchiseOwnerEmailPage({ tenant }: { tenant: EmailTenant }) {
  const brand = tenantBranding[tenant]
  const data = sampleFoEmail
  const [greeting, ...paragraphs] = foEmailBody(data)

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: brand.pageBg }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;500&display=swap');"}</style>

      <div className="px-4 pb-16 pt-10">
        <div className="mx-auto flex w-full max-w-[600px] flex-col items-center">
          <div className="mb-8 flex h-[52px] items-center gap-2">
            {tenant === 'Filtergo' ? (
              <img alt="Filtergo" className="h-[52px] w-auto" src={filtergoLogo} />
            ) : (
              <>
                <SignalMark className="h-[26px] w-auto" />
                <span className="text-[34px] font-extrabold leading-none tracking-tight text-[#262527]">Signal</span>
              </>
            )}
          </div>

          <div className="w-full overflow-hidden rounded-2xl bg-white">
            <div className="px-[60px] pb-6 pt-9">
              <h2 className="mx-auto max-w-[440px] text-center text-[18px] font-normal leading-[26px] text-black">
                {foEmailHeadline(data)}
              </h2>

              <div className="mt-5 flex justify-center">
                <a
                  href="#/property/0"
                  className="inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-medium leading-5 text-white"
                  style={{ backgroundColor: brand.accent }}
                >
                  View Property
                </a>
              </div>

              <div className="mt-8 text-sm leading-5 text-[#3b3b3b]">
                <p>
                  <span className="font-semibold text-[#3e3e3e]">{greeting}</span>
                  <br />
                  {paragraphs[0]}
                </p>
                {paragraphs.slice(1).map((paragraph) => (
                  <p key={paragraph} className="mt-5">
                    {paragraph}
                  </p>
                ))}
                <p className="mt-5">
                  Regards,
                  <br />
                  {brand.name}
                </p>
              </div>

              <div className="mt-9">
                <Divider />

                <div className="grid grid-cols-[247px_1fr] gap-y-4 py-4">
                  <div>
                    <DetailLabel>Company</DetailLabel>
                    <DetailValue>{data.companyName}</DetailValue>
                  </div>
                  <div>
                    <DetailLabel>Address</DetailLabel>
                    <DetailValue>{data.propertyAddress}</DetailValue>
                  </div>
                  <div>
                    <DetailLabel>Company at Property - Till Date</DetailLabel>
                    <DetailValue>{data.tillDate}</DetailValue>
                  </div>
                </div>

                <Divider />

                <div className="pt-4">
                  <div className="grid grid-cols-[1fr_96px_88px] gap-x-4 pb-2">
                    <DetailLabel>Deal Name</DetailLabel>
                    <DetailLabel>Type</DetailLabel>
                    <DetailLabel>Date</DetailLabel>
                  </div>
                  {data.contracts.map((contract) => (
                    <div
                      key={contract.dealName}
                      className="grid grid-cols-[1fr_96px_88px] gap-x-4 border-t border-[#efefef] py-2.5 text-[15px] leading-5 text-[#3f3f3f]"
                      style={{ fontFamily: VALUE_FONT }}
                    >
                      <span className="min-w-0">{contract.dealName}</span>
                      <span>{contract.type}</span>
                      <span>{contract.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center px-6 pb-9 pt-[34px]" style={{ backgroundColor: brand.accent }}>
              <div className="flex">
                {socialLinks.map((link) => (
                  <img key={link.name} alt={link.name} className="size-7" src={link.icon} />
                ))}
              </div>
              <p className="mt-[9px] text-xs leading-[18px] text-white/90">
                Reach out to{' '}
                <a href={`mailto:${brand.contact}`} className="underline">
                  {brand.contact}
                </a>{' '}
                for any queries
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
