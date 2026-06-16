const endpoint = '/eastmoney-api/api/data/v1/get'

const columns = [
  'TRADE_DATE',
  'SECURITY_CODE',
  'SECUCODE',
  'SECURITY_NAME_ABBR',
  'CLOSE_PRICE',
  'CHANGE_RATE',
  'TURNOVERRATE',
  'EXPLANATION',
  'EXPLAIN',
  'BILLBOARD_BUY_AMT',
  'BILLBOARD_SELL_AMT',
  'BILLBOARD_NET_AMT',
  'BILLBOARD_DEAL_AMT',
  'ACCUM_AMOUNT',
  'DEAL_AMOUNT_RATIO',
  'TRADE_MARKET',
].join(',')

function formatTradeDate(value) {
  if (!value) return ''
  return value.slice(0, 10)
}

function normalizeRow(row) {
  return {
    tradeDate: formatTradeDate(row.TRADE_DATE),
    code: row.SECURITY_CODE,
    secuCode: row.SECUCODE,
    name: row.SECURITY_NAME_ABBR,
    closePrice: Number(row.CLOSE_PRICE ?? 0),
    changeRate: Number(row.CHANGE_RATE ?? 0),
    turnoverRate: Number(row.TURNOVERRATE ?? 0),
    reason: row.EXPLANATION || '-',
    seatSummary: row.EXPLAIN || '-',
    buyAmount: Number(row.BILLBOARD_BUY_AMT ?? 0),
    sellAmount: Number(row.BILLBOARD_SELL_AMT ?? 0),
    netAmount: Number(row.BILLBOARD_NET_AMT ?? 0),
    dealAmount: Number(row.BILLBOARD_DEAL_AMT ?? 0),
    totalAmount: Number(row.ACCUM_AMOUNT ?? 0),
    dealRatio: Number(row.DEAL_AMOUNT_RATIO ?? 0),
    market: row.TRADE_MARKET || '-',
  }
}

async function requestBillboard(params) {
  const search = new URLSearchParams({
    reportName: 'RPT_DAILYBILLBOARD_DETAILS',
    columns,
    sortColumns: 'TRADE_DATE,BILLBOARD_NET_AMT',
    sortTypes: '-1,-1',
    source: 'WEB',
    client: 'WEB',
    ...params,
  })

  const response = await fetch(`${endpoint}?${search.toString()}`)
  if (!response.ok) {
    throw new Error(`请求失败：${response.status}`)
  }

  const payload = await response.json()
  if (!payload.success) {
    throw new Error(payload.message || '东方财富接口返回异常')
  }

  return payload.result || { data: [], count: 0, pages: 0 }
}

export async function fetchLatestTradeDate() {
  const result = await requestBillboard({
    pageSize: '1',
    pageNumber: '1',
  })

  const first = result.data?.[0]
  return formatTradeDate(first?.TRADE_DATE)
}

export async function fetchDailyBillboard({ date, pageSize = 80 } = {}) {
  const targetDate = date || await fetchLatestTradeDate()
  if (!targetDate) {
    return {
      date: '',
      rows: [],
      count: 0,
      fetchedAt: new Date().toISOString(),
    }
  }

  const filterDate = `${targetDate} 00:00:00`
  const result = await requestBillboard({
    pageSize: String(pageSize),
    pageNumber: '1',
    filter: `(TRADE_DATE='${filterDate}')`,
  })

  return {
    date: targetDate,
    rows: (result.data || []).map(normalizeRow),
    count: Number(result.count || 0),
    fetchedAt: new Date().toISOString(),
  }
}
