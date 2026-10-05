import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 24, viewBox = '0 0 24 24', children, ...rest }: IconProps & { viewBox?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      className="block shrink-0"
      {...rest}
    >
      {children}
    </svg>
  )
}

const stroke = {
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export function IconAdd(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 6v12M6 12h12" {...stroke} strokeWidth={1.8} />
    </Svg>
  )
}

export function IconSearch(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="10.6" cy="10.6" r="6.1" {...stroke} strokeWidth={1.9} />
      <path d="M15.2 15.2 20 20" {...stroke} strokeWidth={1.9} />
    </Svg>
  )
}

/** keyboard_arrow_down — 10 x 5 glyph inside a 20px frame. */
export function IconChevronDown(props: IconProps) {
  return (
    <Svg {...props} viewBox="0 0 20 20">
      <path d="M5 7.5 10 12.5 15 7.5" {...stroke} strokeWidth={1.5} />
    </Svg>
  )
}

export function IconChevronRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9.6 6.5 15.1 12l-5.5 5.5" {...stroke} strokeWidth={1.6} />
    </Svg>
  )
}

/** location_on — teardrop pin with centre dot. */
export function IconLocation(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M12 20.8c2.6-2.2 4.4-4.2 5.5-5.9 1.1-1.7 1.7-3.3 1.7-4.6 0-2.3-.7-4.1-2.1-5.4C15.7 3.6 14 3 12 3s-3.7.6-5.1 1.9C5.5 6.2 4.8 8 4.8 10.3c0 1.3.6 2.9 1.7 4.6 1.1 1.7 2.9 3.7 5.5 5.9Z"
        {...stroke}
        strokeWidth={1.6}
      />
      <circle cx="12" cy="10.2" r="2.2" {...stroke} strokeWidth={1.6} />
    </Svg>
  )
}

/** map-pin — bottom nav variant, reuses the web app's nav-map-pin geometry. */
export function IconMapPin(props: IconProps) {
  return (
    <Svg {...props} viewBox="0 0 20 20">
      <path
        d="M17.5 8.33333C17.5 14.1667 10 19.1667 10 19.1667C10 19.1667 2.5 14.1667 2.5 8.33333C2.5 6.34421 3.29018 4.43656 4.6967 3.03003C6.10322 1.62351 8.01088 0.833333 10 0.833333C11.9891 0.833333 13.8968 1.62351 15.3033 3.03003C16.7098 4.43656 17.5 6.34421 17.5 8.33333Z"
        {...stroke}
        strokeWidth={1.5}
      />
      <path
        d="M10 10.8333C11.3807 10.8333 12.5 9.71405 12.5 8.33333C12.5 6.95262 11.3807 5.83333 10 5.83333C8.61929 5.83333 7.5 6.95262 7.5 8.33333C7.5 9.71405 8.61929 10.8333 10 10.8333Z"
        {...stroke}
        strokeWidth={1.5}
      />
    </Svg>
  )
}

/** store — the design system's storefront glyph, drawn on a 16px grid. */
export function IconStore(props: IconProps) {
  return (
    <Svg {...props} viewBox="0 0 16 16">
      <path
        d="M12.7 4.73242C12.8646 4.73243 13.0134 4.78436 13.1423 4.8877C13.2392 4.96525 13.3099 5.06031 13.3542 5.1709L13.3904 5.28613V5.28711L14.0564 8.41309L14.071 8.49414C14.0949 8.68238 14.0438 8.85563 13.9187 9.00684C13.7774 9.17768 13.5928 9.26562 13.3728 9.26562H13.2664V12.665C13.2664 12.8318 13.2089 12.9764 13.0935 13.0918C12.978 13.2073 12.8335 13.2656 12.6667 13.2656C12.4998 13.2656 12.3544 13.2074 12.239 13.0918V13.0908C12.1242 12.9755 12.0662 12.8314 12.0662 12.665V9.26562H9.26636V12.5625C9.26636 12.7582 9.19916 12.9273 9.06421 13.0625C8.92901 13.1976 8.76001 13.2656 8.56421 13.2656H3.4353C3.23965 13.2655 3.07042 13.1975 2.9353 13.0625C2.80046 12.9273 2.73315 12.7582 2.73315 12.5625V9.26562H2.62671C2.40673 9.26557 2.22211 9.17771 2.08081 9.00684C1.93798 8.8342 1.8917 8.63276 1.94312 8.41309L2.61011 5.28711V5.28613C2.6455 5.12499 2.72907 4.99101 2.85815 4.8877C2.98694 4.7846 3.13518 4.7325 3.29956 4.73242H12.7ZM3.93335 12.0654H8.06616V9.26562H3.93335V12.0654ZM3.23413 8.06543H12.7654L12.2996 5.93164H3.69995L3.23413 8.06543ZM12.6921 2.73242C12.859 2.73242 13.0035 2.78975 13.1189 2.90527C13.2344 3.02079 13.2927 3.16523 13.2927 3.33203C13.2927 3.49894 13.2345 3.64343 13.1189 3.75879C13.0034 3.87426 12.859 3.93164 12.6921 3.93164H3.30737C3.1406 3.93159 2.99603 3.87433 2.88062 3.75879C2.76517 3.64329 2.7078 3.49878 2.70776 3.33203C2.70776 3.16521 2.76515 3.02061 2.88062 2.90527C2.99603 2.78985 3.14063 2.73247 3.30737 2.73242H12.6921Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={0.2}
      />
    </Svg>
  )
}

/** repeat — follow-up marker, reuses the web app's repeat geometry. */
export function IconRepeat(props: IconProps) {
  return (
    <Svg {...props} viewBox="0 0 10 10">
      <path d="M7.08333 0.416667L8.75 2.08333L7.08333 3.75" {...stroke} strokeWidth={0.9} />
      <path
        d="M1.25 4.58333V3.75C1.25 3.30797 1.42559 2.88405 1.73816 2.57149C2.05072 2.25893 2.47464 2.08333 2.91667 2.08333H8.75"
        {...stroke}
        strokeWidth={0.9}
      />
      <path d="M2.91667 9.58333L1.25 7.91667L2.91667 6.25" {...stroke} strokeWidth={0.9} />
      <path
        d="M8.75 5.41667V6.25C8.75 6.69203 8.5744 7.11595 8.26184 7.42851C7.94928 7.74107 7.52536 7.91667 7.08333 7.91667H1.25"
        {...stroke}
        strokeWidth={0.9}
      />
    </Svg>
  )
}

/** error — alert used by "Requires Signature". */
export function IconAlert(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.6" {...stroke} strokeWidth={1.6} />
      <path d="M12 7.4v5.4" {...stroke} strokeWidth={1.7} />
      <circle cx="12" cy="16.3" r="1" fill="currentColor" />
    </Svg>
  )
}

export function IconHome(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M4.6 10.9 12 5.2l7.4 5.7v7.5a1 1 0 0 1-1 1h-3.7v-5.5H9.3v5.5H5.6a1 1 0 0 1-1-1v-7.5Z"
        {...stroke}
        strokeWidth={1.4}
      />
    </Svg>
  )
}

/** deal — handshake, reuses the web app's nav-deal geometry. */
export function IconDeal({ size = 24, ...rest }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className="block shrink-0"
      {...rest}
    >
      <path
        fill="currentColor"
        d="M14.0091 1.42904C14.4201 1.38095 14.8749 1.47352 15.3158 1.82845L15.5033 1.99642L18.0033 4.49642C18.2705 4.77633 18.5151 5.20358 18.5706 5.67904C18.6255 6.14935 18.4966 6.67524 18.0042 7.16829L17.7542 7.40951L17.5326 7.62435H18.2083V9.99935C18.2083 10.824 17.7434 11.9813 16.5267 12.2952L16.4583 12.3128L16.4378 12.3812C16.2385 13.0505 15.7486 13.7261 14.8597 13.9622L14.7913 13.9798L14.7718 14.0472C14.6481 14.4622 14.4156 14.8774 14.0492 15.1878C13.6844 15.4968 13.1797 15.7083 12.4993 15.7083H9.45638L9.41927 15.7445L7.16927 18.0033C6.86329 18.3091 6.35248 18.5832 5.80013 18.5833C5.37553 18.5833 4.92334 18.4301 4.49642 18.0033L1.99642 15.5033C1.7289 15.2232 1.48456 14.7979 1.42904 14.3236C1.37417 13.8544 1.50251 13.3279 1.99544 12.8304L2.58724 12.2474L2.62435 12.2103V8.87728L6.30306 5.19857L6.31185 5.17904C6.76076 4.25734 7.63779 3.45836 9.16634 3.45833H11.3763L11.4134 3.42122L12.8294 1.99544C13.1095 1.72808 13.535 1.48453 14.0091 1.42904ZM4.04134 9.45638V12.7894L3.00228 13.8363C2.95879 13.8797 2.87309 13.9648 2.84798 14.0872C2.82043 14.2218 2.87099 14.3634 3.00814 14.5101L3.01107 14.513L5.50326 16.9964C5.54667 17.0398 5.63162 17.1265 5.75423 17.1517C5.88873 17.1791 6.02954 17.1276 6.17611 16.9906L6.17708 16.9915L8.87728 14.2913H12.4993C12.8681 14.2913 13.117 14.164 13.2689 13.9661C13.4159 13.7744 13.4583 13.535 13.4583 13.3333V12.6243H14.1663C14.5348 12.6243 14.783 12.4977 14.9349 12.3001C15.0822 12.1083 15.1243 11.8682 15.1243 11.6663V10.9583H15.8333C16.2019 10.9583 16.45 10.8309 16.6019 10.6331C16.7492 10.4413 16.7913 10.2012 16.7913 9.99935V9.04134H10.7083V9.16634C10.7083 9.64637 10.5481 10.2433 10.1722 10.7171C9.79985 11.1863 9.21107 11.5413 8.33333 11.5413C7.45532 11.5413 6.86586 11.1864 6.49349 10.7171C6.11756 10.2433 5.95833 9.64637 5.95833 9.16634V7.53939L4.04134 9.45638ZM14.2454 2.84798C14.1109 2.82048 13.9692 2.87098 13.8226 3.00814L11.9564 4.87435H9.16634C8.36118 4.87437 7.90379 5.21788 7.65462 5.62435C7.41149 6.02115 7.37436 6.46419 7.37435 6.66634V9.16634C7.37435 9.3682 7.41652 9.6083 7.5638 9.80013C7.71571 9.99796 7.96463 10.1243 8.33333 10.1243C8.70175 10.1243 8.95 9.99779 9.10189 9.80013C9.24917 9.6083 9.29134 9.3682 9.29134 9.16634V7.62435H15.5433L15.5804 7.58822L16.9954 6.16243L16.9964 6.16341C17.0398 6.12003 17.1265 6.03514 17.1517 5.91243C17.1793 5.77786 17.1286 5.63624 16.9915 5.48958L16.9876 5.48665L14.4964 3.00326C14.453 2.95987 14.3681 2.87315 14.2454 2.84798Z"
      />
    </svg>
  )
}

/** alt_route — two diverging routes. */
export function IconRoute(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M8.6 20.6v-4.1c0-2.2-.95-3.25-2.1-4.2C5.25 11.2 4.2 10.2 4.2 8V4.6"
        {...stroke}
        strokeWidth={1.5}
      />
      <path d="M2.1 6.7 4.2 4.6l2.1 2.1" {...stroke} strokeWidth={1.5} />
      <path
        d="M15.4 20.6v-4.1c0-2.2.95-3.25 2.1-4.2 1.15-1.1 2.2-2.1 2.2-4.3V4.6"
        {...stroke}
        strokeWidth={1.5}
      />
      <path d="M17.6 6.7 19.7 4.6l2.1 2.1" {...stroke} strokeWidth={1.5} />
    </Svg>
  )
}

export function IconChevronLeft(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14.4 6.5 8.9 12l5.5 5.5" {...stroke} strokeWidth={1.8} />
    </Svg>
  )
}

export function IconCalendar(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.6" y="5.4" width="16.8" height="15" rx="2" {...stroke} strokeWidth={1.5} />
      <path d="M3.6 9.8h16.8M8.2 3.6v3.4M15.8 3.6v3.4" {...stroke} strokeWidth={1.5} />
    </Svg>
  )
}

/** my_location — recentre the map on the device. */
export function IconMyLocation(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="4.2" {...stroke} strokeWidth={1.6} />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <path d="M12 2.4v3.1M12 18.5v3.1M21.6 12h-3.1M5.5 12H2.4" {...stroke} strokeWidth={1.6} />
    </Svg>
  )
}

/** open_in_full — expand the map. */
export function IconExpand(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14.4 3.6h6v6M20.4 3.6 13.8 10.2" {...stroke} strokeWidth={1.6} />
      <path d="M9.6 20.4h-6v-6M3.6 20.4l6.6-6.6" {...stroke} strokeWidth={1.6} />
    </Svg>
  )
}

export function IconCheck(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5.5 12.4 10 16.9 18.5 8.4" {...stroke} strokeWidth={2.2} />
    </Svg>
  )
}

export function IconArrowLeft(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 12H4.4M10.6 5.6 4.2 12l6.4 6.4" {...stroke} strokeWidth={1.8} />
    </Svg>
  )
}

/** swap_horiz — switching the company in context. */
export function IconSwap(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 8.6h14M14.4 5 18 8.6 14.4 12.2" {...stroke} strokeWidth={1.7} />
      <path d="M20 15.4H6M9.6 11.8 6 15.4 9.6 19" {...stroke} strokeWidth={1.7} />
    </Svg>
  )
}

export function IconClose(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6 6 18" {...stroke} strokeWidth={1.8} />
    </Svg>
  )
}

/** near_me — open the property in maps. */
export function IconNavigate(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20.6 3.4 3.9 10.3c-.8.3-.8 1.4 0 1.7l6.6 2.4c.2.1.4.3.5.5l2.4 6.6c.3.8 1.4.8 1.7 0l6.9-16.7a.9.9 0 0 0-1.4-1.4Z" {...stroke} strokeWidth={1.6} />
    </Svg>
  )
}

export function IconEdit(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z" {...stroke} strokeWidth={1.6} />
      <path d="M14.5 7.5 17 10" {...stroke} strokeWidth={1.6} />
    </Svg>
  )
}

/** unfold_more — signals the value can be swapped for another. */
export function IconUnfold(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 9.2 12 5.2l4 4M8 14.8l4 4 4-4" {...stroke} strokeWidth={1.8} />
    </Svg>
  )
}
