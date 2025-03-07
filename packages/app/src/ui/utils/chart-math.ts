interface ChartItem {
  value: number
  color: string
}

export interface Arc {
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  angle: number
}

export interface GetArcsParams {
  data: ChartItem[]
  cx: number
  cy: number
  radius: number
  marginAngle?: number
}

export function getArcs({ data, cx, cy, radius, marginAngle = 0 }: GetArcsParams): Arc[] {
  const zeroAngle = 0.5 * Math.PI
  // 0.00001 is added to avoid the full circle (when full circle, start and end angles are the same, and the arc is not drawn)
  const fullAngle = -3.5 * Math.PI + 0.00001

  const marginAnglRadians = (marginAngle * Math.PI) / 180
  const total = data.reduce((acc, curr) => acc + curr.value, 0)

  if (total === 0) {
    return [
      getArc({
        startAngle: zeroAngle,
        endAngle: fullAngle,
        color: '#E5E5E5',
        cx,
        cy,
        radius,
      }),
    ]
  }

  if (data.length === 1) {
    return [
      getArc({
        startAngle: zeroAngle,
        endAngle: fullAngle,
        color: data[0]!.color,
        cx,
        cy,
        radius,
      }),
    ]
  }

  const sums = data.map(
    (
      (sum) => (value) =>
        // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        (sum += value.value)
    )(0),
  )
  return sums.map((sum, i) => {
    const startAngle = Math.PI / 2 - ((sum - data[i]!.value) / total) * 2 * Math.PI - marginAnglRadians
    const endAngle = Math.PI / 2 - (sum / total) * 2 * Math.PI + marginAnglRadians

    return getArc({
      startAngle,
      endAngle,
      color: data[i]!.color,
      cx,
      cy,
      radius,
    })
  })
}

interface GetArcParams {
  startAngle: number
  endAngle: number
  color: string
  cx: number
  cy: number
  radius: number
}
function getArc({ startAngle, endAngle, color, cx, cy, radius }: GetArcParams): Arc {
  return {
    x1: cx + radius * Math.cos(startAngle),
    y1: cy - radius * Math.sin(startAngle),
    x2: cx + radius * Math.cos(endAngle),
    y2: cy - radius * Math.sin(endAngle),
    color,
    angle: Math.abs(endAngle - startAngle),
  }
}

export interface GetSeparatorsParams {
  data: ChartItem[]
  unfilteredData: ChartItem[]
  cx: number
  cy: number
  radius: number
  mainStrokeWidth: number
}

export interface Separator {
  x1: number
  y1: number
  x2: number
  y2: number
}

export function getSeparators({
  data,
  unfilteredData,
  cx,
  cy,
  radius,
  mainStrokeWidth,
}: GetSeparatorsParams): Separator[] {
  if (data.length === 1) {
    const nonZeroData = unfilteredData.filter(({ value }) => value > 0)

    if (nonZeroData.length > data.length) {
      // some elements are filtered out, so we need to pretend there are some small elements
      return [
        {
          x1: cx,
          y1: cy - radius - mainStrokeWidth / 2,
          x2: cx,
          y2: cy - radius + mainStrokeWidth / 2,
        },
      ]
    }
    return []
  }

  const starts = getArcs({ data, cx, cy, radius: radius - mainStrokeWidth / 2 })
  const ends = getArcs({ data, cx, cy, radius: radius + mainStrokeWidth / 2 })

  return starts
    .map((start, index) => {
      if (start.angle <= 0) {
        return null
      }

      const end = ends[index]!
      return {
        x1: start.x1,
        y1: start.y1,
        x2: end.x1,
        y2: end.y1,
      }
    })
    .filter(Boolean)
}
