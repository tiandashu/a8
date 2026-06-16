<template>
  <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-18">
    <div class="grid min-h-[calc(100vh-10rem)] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <p class="mb-4 inline-flex rounded border border-[var(--line)] bg-white/64 px-3 py-1 text-sm text-[var(--muted)]">
          首页预留
        </p>
        <h1 class="max-w-3xl text-4xl font-900 leading-tight sm:text-5xl lg:text-7xl">
          A 股短线资金研究台
        </h1>
        <p class="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          这里先作为首页入口保留，后续可以接入行情、龙虎榜同步、席位画像和复盘笔记。当前已整理好游资席位库页面。
        </p>
        <RouterLink
          :to="{ name: 'hotMoneySeats' }"
          class="mt-8 inline-flex items-center gap-2 rounded bg-[var(--red)] px-5 py-3 text-white no-underline shadow-[0_14px_34px_rgba(182,37,47,0.22)]"
        >
          查看游资席位
          <span class="i-lucide:arrow-right h-4 w-4" aria-hidden="true" />
        </RouterLink>
      </div>

      <div class="border border-[var(--line)] bg-[var(--paper-strong)] p-5 shadow-[12px_12px_0_rgba(23,19,12,0.08)]">
        <div class="grid grid-cols-2 gap-3">
          <div class="border border-[var(--line)] p-5">
            <span class="text-4xl font-900">29</span>
            <p class="mt-2 text-sm text-[var(--muted)]">组资金名号</p>
          </div>
          <div class="border border-[var(--line)] p-5">
            <span class="text-4xl font-900">90+</span>
            <p class="mt-2 text-sm text-[var(--muted)]">个公开席位</p>
          </div>
          <div class="col-span-2 border border-[var(--line)] bg-[rgba(182,37,47,0.06)] p-5">
            <p class="text-sm leading-7 text-[var(--muted)]">
              数据页已按“资金名号、风格标签、常见关联席位”拆分，适合后续继续做筛选、详情页和数据更新。
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
