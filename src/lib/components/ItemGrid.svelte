<script lang="ts">
	interface Item {
		ID: number;
		Type: number;
		Name: string;
		GridIndex: number;
		IconName: string;
	}

	const props = $props<{ items: Item[]; onSelect?: (item: Item) => void }>();

	function getIconUrl(item: Item): string | null {
		if (item.IconName) {
			return `/icon/Vanilla/${item.IconName}.png`;
		}
		return null;
	}

	function handleClick(item: Item) {
		if (props.onSelect) {
			props.onSelect(item);
		}
	}
</script>

<div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
	{#each props.items as item (item.ID)}
		<button
			class="flex items-center justify-center p-2 bg-base-300 hover:bg-primary/20 rounded-lg transition-colors cursor-pointer aspect-square"
			onclick={() => handleClick(item)}
			title={item.Name}
		>
			{#if getIconUrl(item)}
				<img
					src={getIconUrl(item)!}
					alt={item.Name}
					class="w-full h-full object-contain"
					onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
				/>
			{/if}
		</button>
	{/each}
</div>
