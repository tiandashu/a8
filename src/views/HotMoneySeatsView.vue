<script setup>
import { computed, ref } from 'vue'
import { hotMoneyNotice, hotMoneySeats } from '../data/hotMoneySeats'

const keyword = ref('')
const selectedStyle = ref('全部')

const styles = computed(() => ['全部', ...new Set(hotMoneySeats.map((item) => item.style))])

const filteredSeats = computed(() => {
  const value = keyword.value.trim().toLowerCase()

  return hotMoneySeats.filter((item) => {
    const matchesStyle = selectedStyle.value === '全部' || item.style === selectedStyle.value
    const haystack = [item.name, item.style, ...item.seats].join(' ').toLowerCase()
    return matchesStyle && (!value || haystack.includes(value))
  })
})

const totalSeatCount = computed(() => hotMoneySeats.reduce((sum, item) => sum + item.seats.length, 0))
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
    <div class="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
      <aside class="lg:sticky lg:top-24 lg:self-start">
        <div class="border border-[var(--line)] bg-[var(--paper-strong)] p-6 shadow-[10px_10px_0_rgba(23,19,12,0.08)]">
          <p class="inline-flex rounded border border-[var(--line)] px-3 py-1 text-sm text-[var(--muted)]">
            龙虎榜公开资料整理
          </p>
          <h1 class="mt-5 text-4xl font-900 leading-tight sm:text-5xl">
            A 股知名游资与常见席位
          </h1>
          <p class="mt-5 text-base leading-7 text-[var(--muted)]">
            {{ hotMoneyNotice }}
          </p>

          <div class="mt-8 grid grid-cols-2 gap-3">
            <div class="border border-[var(--line)] p-4">
              <span class="text-3xl font-900">{{ hotMoneySeats.length }}</span>
              <p class="mt-1 text-sm text-[var(--muted)]">资金名号</p>
            </div>
            <div class="border border-[var(--line)] p-4">
              <span class="text-3xl font-900">{{ totalSeatCount }}</span>
              <p class="mt-1 text-sm text-[var(--muted)]">关联席位</p>
            </div>
          </div>

          <div class="mt-8 space-y-3">
            <label class="block text-sm font-700" for="seat-search">搜索名号或营业部</label>
          <div class="relative">
              <span class="i-lucide:search absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" aria-hidden="true" />
              <input
                id="seat-search"
                v-model="keyword"
                class="field pl-10"
                type="search"
                placeholder="例如：赵老哥、呼家楼、拉萨"
              >
            </div>
          </div>

          <div class="mt-5 space-y-3">
            <label class="block text-sm font-700" for="style-filter">风格标签</label>
            <select id="style-filter" v-model="selectedStyle" class="field">
              <option v-for="style in styles" :key="style" :value="style">
                {{ style }}
              </option>
            </select>
          </div>
        </div>
      </aside>

      <div>
        <div class="mb-4 flex items-end justify-between gap-3">
          <div>
            <p class="text-sm text-[var(--muted)]">当前结果</p>
            <h2 class="text-2xl font-900">{{ filteredSeats.length }} 组</h2>
          </div>
          <button
            v-if="keyword || selectedStyle !== '全部'"
            class="inline-flex items-center gap-2 rounded border border-[var(--line)] bg-white/72 px-3 py-2 text-sm"
            type="button"
            @click="keyword = ''; selectedStyle = '全部'"
          >
            <span class="i-lucide:rotate-ccw h-4 w-4" aria-hidden="true" />
            重置
          </button>
        </div>

        <div class="grid gap-4">
          <article
            v-for="(item, index) in filteredSeats"
            :key="item.name"
            class="group border border-[var(--line)] bg-[rgba(255,253,247,0.86)] p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_rgba(182,37,47,0.11)]"
          >
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div class="min-w-0">
                <div class="flex items-center gap-3">
                  <span class="grid h-8 w-8 shrink-0 place-items-center rounded bg-[var(--ink)] text-sm text-[var(--paper)]">
                    {{ String(index + 1).padStart(2, '0') }}
                  </span>
                  <h3 class="text-2xl font-900 leading-tight">{{ item.name }}</h3>
                </div>
                <p class="mt-3 text-sm text-[var(--muted)]">{{ item.style }}</p>
              </div>
              <span class="rounded border border-[rgba(17,117,91,0.22)] bg-[rgba(17,117,91,0.08)] px-3 py-1 text-sm text-[var(--green)]">
                {{ item.seats.length }} 个席位
              </span>
            </div>

            <div class="mt-5 flex flex-wrap gap-2">
              <span
                v-for="seat in item.seats"
                :key="seat"
                class="rounded border border-[var(--line)] bg-white/70 px-3 py-2 text-sm text-[var(--ink)]"
              >
                {{ seat }}
              </span>
            </div>
          </article>

          <div
            v-if="filteredSeats.length === 0"
            class="border border-dashed border-[var(--line)] bg-white/50 p-10 text-center text-[var(--muted)]"
          >
            没有匹配结果，换个关键词试试。
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
