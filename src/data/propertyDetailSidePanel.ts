export type DetailSectionId = 'propertyDetails' | 'company' | 'franchiseAssociated' | 'attachments'

export const propertyDetailSectionOrder: DetailSectionId[] = [
  'propertyDetails',
  'company',
  'franchiseAssociated',
  'attachments',
]

export const propertyDetailSectionTitles: Record<DetailSectionId, string> = {
  propertyDetails: 'Property Details',
  company: 'Company',
  franchiseAssociated: 'Franchise Associated',
  attachments: 'Attachments • 00',
}

export type CompanyAffiliationBadge = {
  label: string
  bg: string
  text: string
}

export const propertyDetailsPanelData = {
  rows: [
    { label: 'Name', value: 'Costco Wholesale - Boys Town' },
    { label: 'Industry', value: 'Warehouse' },
    {
      label: 'Referred by',
      value: '402 - Valencia Town',
      referral: {
        name: 'Mike Smith',
        email: 'mike-smith@signal.com',
        phone: '719-345-9821',
      },
    },
    { label: 'Parent Company', value: 'Costco' },
    { label: 'Address', value: '456 Elm Ave, Westport Idencia, Kansas City, Kansas, 64030' },
    { label: 'Management Company', value: 'Costco' },
    { label: 'Property Name', value: 'Americold' },
    { label: 'Property type', value: '—' },
    { label: 'Tenancy', value: 'Multi' },
    { label: 'Amenities', value: '5' },
    { label: 'No of buildings', value: '6%' },
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
