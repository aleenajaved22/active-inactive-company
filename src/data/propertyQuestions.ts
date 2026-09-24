export type QuestionOption = { id: string; label: string }

export type PropertyQuestion =
  | {
      id: string
      label: string
      points: string
      type: 'radio'
      options: QuestionOption[]
      defaultSelected: string
    }
  | {
      id: string
      label: string
      points: string
      type: 'checkbox'
      options: QuestionOption[]
      defaultSelected: string[]
    }
  | {
      id: string
      label: string
      points: string
      type: 'select'
      value: string
    }

export const propertyQuestions: PropertyQuestion[] = [
  {
    id: 'use-security',
    label: 'Do you currently use security?',
    points: '05',
    type: 'radio',
    options: [
      { id: 'yes', label: 'Yes' },
      { id: 'no', label: 'No' },
    ],
    defaultSelected: 'yes',
  },
  {
    id: 'services',
    label: 'What services are you talking?',
    points: '20',
    type: 'checkbox',
    options: [
      { id: 'roving', label: 'Roving Patrol' },
      { id: 'dedicated', label: 'Dedicated' },
      { id: 'none', label: 'None' },
    ],
    defaultSelected: ['roving'],
  },
  {
    id: 'budget',
    label: 'Your monthly security budget?',
    points: '320',
    type: 'select',
    value: '$100K-$250K',
  },
  {
    id: 'concerns',
    label: 'Your biggest areas of concerns?',
    points: '05',
    type: 'checkbox',
    options: [
      { id: 'noise', label: 'Noise/Loitering' },
      { id: 'parking', label: 'Parking/Traffic' },
      { id: 'gate', label: 'Gate/Door/Access Control' },
      { id: 'pool', label: 'Pool/Amenity/Property' },
    ],
    defaultSelected: [],
  },
  {
    id: 'needs-addressed',
    label: 'How your needs are addressed?',
    points: '05',
    type: 'select',
    value: 'Notify me when there is an issue',
  },
  {
    id: 'better-service',
    label: 'Looking for better service in less budget?',
    points: '100',
    type: 'radio',
    options: [
      { id: 'yes', label: 'Yes' },
      { id: 'no', label: 'No' },
    ],
    defaultSelected: 'yes',
  },
  {
    id: 'facilities',
    label: 'How many facilities are covered?',
    points: '400',
    type: 'select',
    value: '5-10',
  },
  {
    id: 'armed',
    label: 'Are your officers armed?',
    points: '20',
    type: 'radio',
    options: [
      { id: 'yes', label: 'Yes' },
      { id: 'no', label: 'No' },
    ],
    defaultSelected: 'yes',
  },
  {
    id: 'three-concerns',
    label: 'What are 3 biggest areas of concern?',
    points: '50',
    type: 'select',
    value: 'Visitor Management / Employee Access Control',
  },
  {
    id: 'hours',
    label: 'Hours of security each week?',
    points: '80',
    type: 'select',
    value: '350-1000',
  },
  {
    id: 'govt-link',
    label: 'Link to USDA/FDA or any other govt. security?',
    points: '100',
    type: 'radio',
    options: [
      { id: 'yes', label: 'Yes' },
      { id: 'no', label: 'No' },
    ],
    defaultSelected: 'yes',
  },
  {
    id: 'vendor-process',
    label: 'Process for new vendor for security service?',
    points: '30',
    type: 'select',
    value: 'I manage the security budget and contract',
  },
  {
    id: 'process-duration',
    label: 'How long does this process take?',
    points: '100',
    type: 'select',
    value: 'Less than a Month',
  },
]
