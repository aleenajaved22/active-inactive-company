export type DetailSectionId = 'propertyDetails' | 'franchiseAssociated' | 'attachments'

export const propertyDetailSectionOrder: DetailSectionId[] = [
  'propertyDetails',
  'franchiseAssociated',
  'attachments',
]

export const propertyDetailSectionTitles: Record<DetailSectionId, string> = {
  propertyDetails: 'Property Details',
  franchiseAssociated: 'Franchise Associated',
  attachments: 'Attachments • 00',
}

export type CompanyAffiliationBadge = {
  label: string
  bg: string
  text: string
}

/**
 * The Property Details accordion: the record's own fields, in the order the
 * design lists them. Anything that belongs to a company on the property (its
 * industry vertical, say) is shown with that company instead, since a property
 * can have several. The name and address match the listing; fields with no value
 * show N/A, as they do in the product.
 */
export const propertyDetailsPanelData = {
  rows: [
    { label: 'Name', value: 'Elm Avenue Plaza' },
    { label: 'Referred By', value: 'N/A' },
    { label: 'Parent Company', value: 'N/A' },
    { label: 'Created By', value: 'Moiz Qureshi' },
    { label: 'Creation Date', value: '10/06/2026' },
    { label: 'Last Updated', value: '10/06/2026' },
    { label: 'No. of units', value: 'N/A' },
    { label: 'Occupancy Rate', value: 'N/A' },
    { label: 'Avg. rent', value: 'N/A' },
    { label: 'Address', value: '456 Elm Ave, Omaha, Nebraska, 68010' },
    { label: 'Annual Revenue', value: 'N/A' },
    { label: 'Created Source', value: 'N/A' },
    { label: 'Last Modified By', value: 'N/A' },
    { label: 'Last Modified Source', value: 'N/A' },
    { label: 'Last Cleaned', value: 'N/A' },
    { label: 'Last Enriched', value: 'N/A' },
    { label: 'Square Footage', value: 'N/A' },
    { label: 'Parking Spaces', value: 'N/A' },
    { label: 'Building Class', value: 'N/A' },
    { label: 'Tenancy', value: 'N/A' },
    { label: 'Amenities', value: 'N/A' },
    { label: 'Number of Buildings', value: 'N/A' },
    { label: 'Lot Number', value: 'N/A' },
  ],
}

export const billingAddressPanelData = {
  contact: 'Aleena Javed',
  address: '456 Elm Ave, Westport Idencia, Kansas City, Kansas, 64030',
  country: 'USA',
  state: 'Nebraska',
  city: 'Bloomfield',
  zipcode: '5400',
}

export const franchiseAssociatedPanelData = {
  nameLines: ['420 - Automation', 'Automation Franchise'],
  email: 'abd@yopmail.com',
  phone: '+15039276234',
  address: '1324 Leavenworth St, Omaha, Nebraska, 68102',
}

export const attachmentsPanelData: { id: string; name: string; size: string; uploaded: string }[] = []
