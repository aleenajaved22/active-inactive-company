import graphsCollapseOpen from '../assets/graphs-collapse-open.svg'
import graphsDonutProperties from '../assets/graphs-donut-properties.svg'
import graphsDonutStage from '../assets/graphs-donut-stage.svg'
import graphsGridLine from '../assets/graphs-grid-line.svg'
import graphsLineChart from '../assets/graphs-line-chart.svg'
import graphsLineH from '../assets/graphs-line-h.svg'
import graphsLineV from '../assets/graphs-line-v.svg'

function LegendItem({ color, label, opacity }: { color: string; label: string; opacity?: number }) {
  return (
    <div className="flex items-center gap-1">
      <span
        className="size-2.5 shrink-0 rounded-[2px]"
        style={{ backgroundColor: color, opacity: opacity ?? 1 }}
      />
      <span className="text-[10px] font-medium leading-[14px] text-[#86868b]">{label}</span>
    </div>
  )
}

function VerticalDivider() {
  return (
    <div className="flex h-[253px] w-0 shrink-0 items-center justify-center">
      <div className="h-0 w-[253px] rotate-90">
        <img alt="" className="block size-full max-w-none" src={graphsLineV} />
      </div>
    </div>
  )
}

const propertiesLegend = [
  { color: '#146dff', label: 'Existing' },
  { color: '#f4780b', label: 'New', opacity: 0.8 },
  { color: '#a142f5', label: 'Old', opacity: 0.8 },
  { color: '#e43f32', label: 'Lost' },
]

const stageLegend = [
  { color: '#146dff', label: 'Approved' },
  { color: '#e43f32', label: 'Lost Customer' },
  { color: '#5ab473', label: 'Qualified' },
  { color: '#bae5ff', label: 'Negotiation', opacity: 0.8 },
  { color: '#f6933c', label: 'Discovery', opacity: 0.8 },
  { color: '#f768cc', label: 'Connected', opacity: 0.8 },
  { color: '#b468f7', label: 'Current Customer', opacity: 0.8 },
  { color: '#f7d568', label: 'Needs Assessment', opacity: 0.8 },
]

const months = ["Jan' 23", "Feb' 23", "Mar' 23", "Apr' 23", "May' 23", "Jun' 23", "Jul' 23", "Aug' 23", "Sep' 23", "Oct' 23", "Nov' 23", "Dec' 23"]

export function LocationGraphs() {
  return (
    <section className="relative w-full pb-7 pt-0">
      <div className="flex items-center gap-6 px-8">
        <div className="flex h-[221px] w-[285px] shrink-0 flex-col justify-between">
          <div>
            <p className="text-xs font-medium leading-[18px] text-[#262527]">Properties</p>
            <p className="text-2xl font-bold leading-8 text-[#262527]">1.21M</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              {propertiesLegend.map((item) => (
                <LegendItem key={item.label} {...item} />
              ))}
            </div>
            <div className="relative size-[120px] shrink-0">
              <img alt="" className="absolute inset-0 block size-full max-w-none" src={graphsDonutProperties} />
            </div>
          </div>
        </div>

        <VerticalDivider />

        <div className="flex h-[221px] w-[309px] shrink-0 flex-col justify-between">
          <p className="text-xs font-medium leading-[18px] text-[#262527]">Properties by Stage</p>
          <div className="flex items-end justify-center gap-10">
            <div className="flex flex-1 flex-col gap-1.5">
              {stageLegend.slice(0, 4).map((item) => (
                <LegendItem key={item.label} {...item} />
              ))}
              {stageLegend.slice(4).map((item) => (
                <LegendItem key={item.label} {...item} />
              ))}
            </div>
            <div className="relative size-[120px] shrink-0">
              <img alt="" className="absolute inset-0 block size-full max-w-none" src={graphsDonutStage} />
            </div>
          </div>
        </div>

        <VerticalDivider />

        <div className="relative min-w-0 flex-1">
          <p className="mb-2 text-xs font-medium leading-[18px] text-[#262527]">Qualified Properties</p>
          <div className="relative h-[170px] pl-9">
            <div className="absolute left-0 top-0 flex h-full flex-col justify-between text-right text-[10px] font-medium leading-[14px] text-[#86868b]">
              <span>1,800</span>
              <span>1,200</span>
              <span>600</span>
              <span>0</span>
            </div>
            <div className="relative ml-2 h-[145px]">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="absolute left-0 right-0 h-0" style={{ top: `${i * 33.33}%` }}>
                  <img alt="" className="block w-full max-w-none" src={graphsGridLine} />
                </div>
              ))}
              <div className="absolute bottom-0 left-0 right-0 top-6">
                <img alt="Qualified properties trend" className="block h-full w-full max-w-none object-fill" src={graphsLineChart} />
              </div>
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-medium leading-[14px] text-[#86868b]">
              {months.map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px">
        <img alt="" className="block w-full max-w-none" src={graphsLineH} />
      </div>
      <button type="button" aria-label="Collapse graphs" className="absolute inset-x-0 bottom-0 mx-auto block h-7 w-full max-w-[1300px] cursor-pointer">
        <img alt="" className="mx-auto block h-7 w-full max-w-none" src={graphsCollapseOpen} />
      </button>
    </section>
  )
}
