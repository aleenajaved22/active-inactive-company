import { contractProposalNotice } from '../data/companyAtPropertyCopy'
import { formatShortDate } from '../data/dateFormat'

/**
 * The leaving-date message for the contract proposal page: shown for a company
 * that has a Company at Property - Till Date, so the user sees the limit while
 * they are still choosing the contract's dates.
 *
 * Informational only: nothing is blocked here and there is nothing to
 * acknowledge, so it is an inline note rather than a modal. It belongs at the
 * top of the proposal form, above the date fields, and shows for End Date and
 * Renewal Date contracts alike. The blocking check on create is a separate
 * error against the date field itself.
 *
 * The date is shown as MM/DD/YY, the app's short date format.
 *
 * Renders nothing when the company has no till date, which is most contracts.
 */
export function ContractProposalNotice({ tillDate }: { tillDate?: string }) {
  if (!tillDate?.trim()) return null

  return (
    <div
      role="note"
      className="flex items-start gap-2 rounded-lg border border-[#fec84b] bg-[#fff4d8] px-4 py-3"
    >
      <span className="relative mt-0.5 size-4 shrink-0 text-[#b54708]" aria-hidden>
        <svg className="block size-full" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 10.6667V8M8 5.33333H8.00667M14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z"
            stroke="currentColor"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <p className="min-w-0 flex-1 text-sm leading-5 text-[#7a2e0e]">
        {contractProposalNotice(formatShortDate(tillDate))}
      </p>
    </div>
  )
}
