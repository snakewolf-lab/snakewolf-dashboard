<script setup lang="ts">
// SSR時のハイドレーションエラーを防ぐため、useStateで年を管理
const currentYear = useState('year', () => new Date().getFullYear())
</script>

<template>
  <div>
    <UHeader>
      <template #left>
        <NuxtLink to="/">
          <AppLogo class="w-auto h-6 shrink-0" />
        </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />
        <UButton to="https://snakewolf.com" target="_blank" icon="i-lucide-globe" aria-label="HomePage" color="neutral"
          variant="ghost" />
      </template>
    </UHeader>

    <main>
      <!-- ここに各ページのコンテンツがレンダリングされます -->
      <slot />
    </main>

    <USeparator />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built with Nuxt UI • © {{ currentYear }} SnakeWolf. All rights reserved.
        </p>
      </template>

      <template #right>
        <UButton to="https://x.com/@snakewolf_info" target="_blank" icon="i-simple-icons-x" aria-label="Twitter"
          color="neutral" variant="ghost" />
        <UButton to="https://www.instagram.com/snakewolf_info/" target="_blank" icon="i-simple-icons-instagram"
          aria-label="Instagram" color="neutral" variant="ghost" />
        <UButton to="https://discord.gg/3YHPwy6yM6" target="_blank" icon="i-simple-icons-discord" aria-label="Discord"
          color="neutral" variant="ghost" />
        <UButton to="https://lin.ee/oa81xV2" target="_blank" icon="i-simple-icons-line" aria-label="LINE"
          color="neutral" variant="ghost" />
        <UButton to="https://github.com/snakewolflab" target="_blank" icon="i-simple-icons-github" aria-label="GitHub"
          color="neutral" variant="ghost" />
      </template>
    </UFooter>

  </div>
</template>
