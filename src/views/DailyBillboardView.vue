<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchDailyBillboard, fetchLatestTradeDate } from '../services/dailyBillboard'

const rows = ref([])
const total = ref(0)
const tradeDate = ref('')
const selectedDate = ref('')
const fetchedAt = ref('')
const loading = ref(false)
const error = ref('')
const keyword = ref('')

const filteredRows = computed(() => {
  const value = keyword.value.trim().toLowerCase()
  if (!value) return rows.value

  return rows.value.filter((row) => {
    return [row.code, row.name, row.reason, row.seatSummary, row.market].join(' ').toLowerCase().includes(value)
  })
})

const summary = computed(() => {
  return rows.value.reduce(
    (acc, row) => {
      acc.buy += row.buyAmount
      acc.sell += row.sellAmount
      acc.net += row.netAmount
      return acc
    },
    { buy: 0, sell: 0, net: 0 },
  )
})

function formatMoney(value) {
  const amount = Number(value || 0)
  const abs = Math.abs(amount)
  const sign = amount < 0 ? '-' : ''

  if (abs >= 100000000) return `${sign}${(abs / 100000000).toFixed(2)}亿`
  if (abs >= 10000) return `${sign}${(abs / 10000).toFixed(2)}万`
  return `${amount.toFixed(0)}`
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(2)}%`
}

function formatTime(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(value))
}

async function loadLatestDate() {
  const latest = await fetchLatestTradeDate()
  selectedDate.value = latest
  return latest
}

async function loadData(date) {
  loading.value = true
  error.value = ''

  try {
    const result = await fetchDailyBillboard({ date })
    rows.value = result.rows
    total.value = result.count
    tradeDate.value = result.date
    selectedDate.value = result.date
    fetchedAt.value = result.fetchedAt
  } catch (err) {
    error.value = err instanceof Error ? err.message : '数据加载失败'
  } finally {
    loading.value = false
  }
}

async function refresh() {
  await loadData(selectedDate.value || tradeDate.value)
}

onMounted(async () => {
  const latest = await loadLatestDate()
  await loadData(latest)
})
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
    <div class="mb-6 border border-[var(--line)] bg-[var(--paper-strong)] p-6 shadow-[10px_10px_0_rgba(23,19,12,0.08)]">
      <div class="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p class="inline-flex rounded border border-[var(--line)] px-3 py-1 text-sm text-[var(--muted)]">
            东方财富实时接口
          </p>
          <h1 class="mt-5 text-4xl font-900 leading-tight sm:text-5xl">
            单日龙虎榜
          </h1>
          <p class="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">
            默认读取最新可用交易日；非交易时段或交易所尚未披露时，以东方财富接口返回的最新单日榜单为准。
          </p>
        </div>

        <div class="grid gap-3 sm:grid-cols-[160px_1fr_auto]">
          <input v-model="selectedDate" class="field" type="date">
          <input v-model="keyword" class="field" type="search" placeholder="搜索股票、代码、上榜原因">
          <button
            class="inline-flex items-center justify-center gap-2 rounded bg-[var(--ink)] px-4 py-3 text-[var(--paper)] disabled:opacity-55"
            type="button"
            :disabled="loading"
            @click="refresh"
          >
            <span class="i-lucide:refresh-cw h-4 w-4" aria-hidden="true" />
            刷新
          </button>
        </div>
      </div>

      <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div class="border border-[var(--line)] p-4">
          <p class="text-sm text-[var(--muted)]">交易日</p>
          <p class="mt-1 text-2xl font-900">{{ tradeDate || '-' }}</p>
        </div>
        <div class="border border-[var(--line)] p-4">
          <p class="text-sm text-[var(--muted)]">榜单记录</p>
          <p class="mt-1 text-2xl font-900">{{ total }}</p>
        </div>
        <div class="border border-[var(--line)] p-4">
          <p class="text-sm text-[var(--muted)]">买入合计</p>
          <p class="mt-1 text-2xl font-900 text-[var(--red)]">{{ formatMoney(summary.buy) }}</p>
        </div>
        <div class="border border-[var(--line)] p-4">
          <p class="text-sm text-[var(--muted)]">卖出合计</p>
          <p class="mt-1 text-2xl font-900 text-[var(--green)]">{{ formatMoney(summary.sell) }}</p>
        </div>
        <div class="border border-[var(--line)] p-4">
          <p class="text-sm text-[var(--muted)]">更新时间</p>
          <p class="mt-1 text-2xl font-900">{{ formatTime(fetchedAt) }}</p>
        </div>
      </div>
    </div>

    <div v-if="error" class="mb-4 border border-[rgba(182,37,47,0.28)] bg-[rgba(182,37,47,0.08)] p-4 text-[var(--red)]">
      {{ error }}
    </div>

    <div class="overflow-hidden border border-[var(--line)] bg-[rgba(255,253,247,0.9)]">
      <div class="overflow-x-auto">
        <table class="min-w-[1120px] w-full border-collapse text-left">
          <thead class="bg-[rgba(23,19,12,0.06)] text-sm text-[var(--muted)]">
            <tr>
              <th class="px-4 py-3 font-700">股票</th>
              <th class="px-4 py-3 font-700">收盘</th>
              <th class="px-4 py-3 font-700">涨跌幅</th>
              <th class="px-4 py-3 font-700">换手率</th>
              <th class="px-4 py-3 font-700">买入</th>
              <th class="px-4 py-3 font-700">卖出</th>
              <th class="px-4 py-3 font-700">净买额</th>
              <th class="px-4 py-3 font-700">上榜原因</th>
              <th class="px-4 py-3 font-700">席位摘要</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td class="px-4 py-10 text-center text-[var(--muted)]" colspan="9">正在读取实时龙虎榜...</td>
            </tr>
            <tr
              v-for="row in filteredRows"
              v-else
              :key="`${row.tradeDate}-${row.code}-${row.reason}`"
              class="border-t border-[var(--line)] align-top hover:bg-[rgba(182,37,47,0.04)]"
            >
              <td class="px-4 py-4">
                <p class="font-900">{{ row.name }}</p>
                <p class="mt-1 text-sm text-[var(--muted)]">{{ row.code }} · {{ row.market }}</p>
              </td>
              <td class="px-4 py-4">{{ row.closePrice.toFixed(2) }}</td>
              <td class="px-4 py-4" :class="row.changeRate >= 0 ? 'text-[var(--red)]' : 'text-[var(--green)]'">
                {{ formatPercent(row.changeRate) }}
              </td>
              <td class="px-4 py-4">{{ formatPercent(row.turnoverRate) }}</td>
              <td class="px-4 py-4 text-[var(--red)]">{{ formatMoney(row.buyAmount) }}</td>
              <td class="px-4 py-4 text-[var(--green)]">{{ formatMoney(row.sellAmount) }}</td>
              <td class="px-4 py-4 font-900" :class="row.netAmount >= 0 ? 'text-[var(--red)]' : 'text-[var(--green)]'">
                {{ formatMoney(row.netAmount) }}
              </td>
              <td class="max-w-[280px] px-4 py-4 text-sm leading-6">{{ row.reason }}</td>
              <td class="max-w-[220px] px-4 py-4 text-sm leading-6 text-[var(--muted)]">{{ row.seatSummary }}</td>
            </tr>
            <tr v-if="!loading && filteredRows.length === 0">
              <td class="px-4 py-10 text-center text-[var(--muted)]" colspan="9">当前日期没有匹配的龙虎榜记录。</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p class="mt-4 text-sm leading-6 text-[var(--muted)]">
      数据来源：东方财富数据中心 RPT_DAILYBILLBOARD_DETAILS。单日龙虎榜通常在收盘后逐步披露，页面刷新时会重新请求接口。
    </p>
  </section>
</template>
