export interface DoughnutChartProps {
  data: {
    value: number
    color: string
  }[]
  innerRadius?: number
  outerRadius?: number
  className?: string
}

export function DoughnutChart({ data, innerRadius = 160, outerRadius = 200, className }: DoughnutChartProps) {
  const normalizedData = data.filter((item) => item.value > 0)
  const arcs = getArcs(outerRadius, innerRadius, normalizedData)

  return (
    <svg
      preserveAspectRatio="xMidYMid meet"
      viewBox={`0 0 ${2 * outerRadius} ${2 * outerRadius}`}
      className={className}
    >
      {arcs.map((point) => (
        <path
          d={`M${point.x1} ${point.y1}
              A${outerRadius} ${outerRadius} 0 ${point.angle > Math.PI ? '1' : '0'} 1 ${point.x2} ${point.y2}
              L${point.x3} ${point.y3}
              A${innerRadius} ${innerRadius} 0 ${point.angle > Math.PI ? '1' : '0'} 0 ${point.x4} ${point.y4}
              Z`}
          fill={point.color}
          key={`${point.x1}${point.y1}${point.x2}${point.y2}`}
        />
      ))}
    </svg>
  )
}

function getArcs(outerRadius: number, innerRadius: number, data: DoughnutChartProps['data']) {
  const zeroAngle = 0.5 * Math.PI
  // 0.00001 is added to avoid the full circle (when full circle, start and end angles are the same, and the arc is not drawn)
  const fullAngle = -3.5 * Math.PI + 0.00001
  const total = data.reduce((acc, curr) => acc + curr.value, 0)

  if (total === 0) {
    return [getArc(outerRadius, innerRadius, zeroAngle, fullAngle, '#E5E5E5')]
  }

  if (data.length === 1) {
    return [getArc(outerRadius, innerRadius, zeroAngle, fullAngle, data[0]!.color)]
  }

  const sums = data.map(
    (
      (sum) => (value) =>
        // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        (sum += value.value)
    )(0),
  )
  return sums.map((sum, i) => {
    const startAngle = Math.PI / 2 - ((sum - data[i]!.value) / total) * 2 * Math.PI
    const endAngle = Math.PI / 2 - (sum / total) * 2 * Math.PI
    return getArc(outerRadius, innerRadius, startAngle, endAngle, data[i]!.color)
  })
}

function getArc(outerRadius: number, innerRadius: number, startAngle: number, endAngle: number, color: string) {
  const [cx, cy] = [outerRadius, outerRadius]
  return {
    x1: cx + outerRadius * Math.cos(startAngle),
    y1: cy - outerRadius * Math.sin(startAngle),
    x2: cx + outerRadius * Math.cos(endAngle),
    y2: cy - outerRadius * Math.sin(endAngle),
    x3: cx + innerRadius * Math.cos(endAngle),
    y3: cy - innerRadius * Math.sin(endAngle),
    x4: cx + innerRadius * Math.cos(startAngle),
    y4: cy - innerRadius * Math.sin(startAngle),
    color,
    angle: Math.abs(endAngle - startAngle),
  }
}
