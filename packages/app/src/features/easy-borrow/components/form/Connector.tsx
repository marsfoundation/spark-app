export interface ConnectorProps {
  className?: string
}

export function Connector({ className }: ConnectorProps) {
  return (
    <svg className={className} preserveAspectRatio="xMidYMid meet" viewBox="0 0 84 93" fill="none">
      <path d="M32 40.0217V24.0217C32 14.1018 38.8897 9.36685 39 0.0217136H42V40.0217H32Z" fill="#E9E9F3" />
      <path d="M32 40.0217V56.0217C32 65.9417 38.8897 70.6766 39 80.0217H42V40.0217H32Z" fill="#E9E9F3" />
      <path d="M52 40.0217V24.0217C52 14.1018 45.1103 9.36685 45 0.0217136H42V40.0217H52Z" fill="#E9E9F3" />
      <path d="M52 40.0217V56.0217C52 65.9417 45.1103 70.6766 45 80.0217H42V40.0217H52Z" fill="#E9E9F3" />
      <g filter="url(#filter0_d_820_5877)">
        <circle cx="42" cy="40.0217" r="17" fill="white" />
      </g>
      <path
        d="M45.3102 41.4579H53.7034C54.03 41.4579 54.1268 40.9892 53.8298 40.846L45.3087 36.7384L45.3087 27.7382C45.3087 27.4028 44.8818 27.2927 44.7349 27.5902L41.1979 34.7573L37.2484 32.8608C36.9861 32.7349 36.7203 33.0284 36.8518 33.2987L39.3195 38.3705L30.926 38.3705C30.5995 38.3705 30.5026 38.8392 30.7996 38.9824L39.3211 43.0912L39.3211 52.0902C39.3211 52.4256 39.748 52.5357 39.8948 52.2382L43.4316 45.0717L47.3748 46.9716C47.6369 47.0979 47.903 46.8048 47.7719 46.5343L45.3102 41.4579Z"
        fill="url(#paint0_linear_820_5877)"
      />
      <defs>
        <filter
          id="filter0_d_820_5877"
          x="0"
          y="8.02173"
          width="84"
          height="84"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="10" />
          <feGaussianBlur stdDeviation="12.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.345098 0 0 0 0 0.137255 0 0 0 0 0.952941 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_820_5877" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_820_5877" result="shape" />
        </filter>
        <linearGradient
          id="paint0_linear_820_5877"
          x1="48.5047"
          y1="34.7058"
          x2="33.6434"
          y2="45.3673"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FA43BD" />
          <stop offset="1" stop-color="#FFA930" />
        </linearGradient>
      </defs>
    </svg>
  )
}
