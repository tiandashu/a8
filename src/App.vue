<template>
  <div class="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
    <header class="sticky top-0 z-20 border-b border-[var(--line)] bg-[rgba(247,244,237,0.86)] backdrop-blur-xl">
      <div class="mx-auto h-16 max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <RouterLink
          :to="{ name: 'home' }"
          class="flex items-center gap-3 text-inherit no-underline"
          aria-label="返回首页"
        >
          <span class="grid h-9 w-9 place-items-center rounded bg-[var(--ink)] text-[var(--paper)] font-700">
            A8
          </span>
          <span class="hidden text-sm font-700 tracking-[0.08em] uppercase sm:inline">Capital Seats</span>
        </RouterLink>

        <nav class="flex items-center gap-1 rounded border border-[var(--line)] bg-white/58 p-1 shadow-[0_10px_30px_rgba(48,38,24,0.06)]">
          <RouterLink
            :to="{ name: 'home' }"
            class="nav-link"
            active-class="nav-link-active"
          >
            首页
          </RouterLink>
          <RouterLink
            :to="{ name: 'hotMoneySeats' }"
            class="nav-link"
            active-class="nav-link-active"
          >
            游资席位
          </RouterLink>
          <RouterLink
            :to="{ name: 'dailyBillboard' }"
            class="nav-link"
            active-class="nav-link-active"
          >
            单日龙虎榜
          </RouterLink>
        </nav>
      </div>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>
