<script lang="ts">
	import ItemGrid from '$lib/components/ItemGrid.svelte';
	import { calcMaterials, type RecipeNode } from '$lib/utils/calc';
	import { getPinyin } from '$lib/utils/pinyin';
	import type { Item, Recipe } from '$lib/types';
	import { onMount } from 'svelte';


	// 数据存储
	let recipes: Recipe[] = $state([]);
	let items: Item[] = $state([]);
	let itemMap: Record<number, string> = $state({});
	let recipeMap: Record<number, Recipe> = $state({});
	let itemDataMap: Record<number, Item> = $state({});
	let itemTypes: Record<number, string> = $state({});
	let isLoading: boolean = $state(true);

	// 状态管理
	let selectedItem: Item | null = $state(null);
	let count: number = $state(1);
	let materials: [string, number][] = $state([]);
	let devices: [string, number][] = $state([]);
	let recipeTree: RecipeNode[] = $state([]);
	let showSelectItemModal: boolean = $state(false);
	let searchFilter: string = $state('');

	/**
	 * 加载配方和物品数据
	 * 从 /data/ 目录获取数据并构建映射表
	 */
	async function loadData() {
		try {
			const [recipesRes, itemsRes, itemTypesRes] = await Promise.all([
				fetch('/data/recipes.json'),
				fetch('/data/items.json'),
				fetch('/data/itemTypes.json')
			]);
			recipes = await recipesRes.json();
			items = await itemsRes.json();
			itemTypes = await itemTypesRes.json();
			console.log('Items loaded:', items.length);

			itemMap = {};
			itemDataMap = {};
			items.forEach((item) => {
				itemMap[item.ID] = item.Name;
				itemDataMap[item.ID] = item;
			});

			recipeMap = {};
			recipes.forEach((recipe) => {
				recipe.Results.forEach((resultId) => {
					if (!recipeMap[resultId]) {
						recipeMap[resultId] = recipe;
					}
				});
			});
		} catch (e) {
			console.error('数据加载失败:', e);
		} finally {
			isLoading = false;
			console.log('Data loading completed');
			console.log('First 5 items:', items.slice(0, 5));
		}
	}

	/**
	 * 获取物品图标URL
	 * @param item - 物品对象
	 * @returns 图标URL或null
	 */
	function getIconUrl(item: Item): string | null {
		if (item.IconName) {
			return `/icon/Vanilla/${item.IconName}.png`;
		}
		return null;
	}

	/**
	 * 获取物品类型名称
	 * @param type - 物品类型编号
	 * @returns 类型名称
	 */
	function getTypeName(type: number): string {
		return itemTypes[type] || '其他';
	}

	/**
	 * 获取按类型分组的过滤后物品列表
	 * @returns 按类型名称分组的物品对象
	 */
	function getFilteredItems(): Record<string, Item[]> {
		const filterLower = searchFilter.toLowerCase();
		const groupedItems: Record<string, Item[]> = {};

		items.forEach((item) => {
			const pinyin = getPinyin(item.Name).toLowerCase();
			if (
				searchFilter &&
				!item.Name.toLowerCase().includes(filterLower) &&
				!String(item.ID).includes(searchFilter) &&
				!pinyin.includes(filterLower)
			) {
				return;
			}
			const typeName = getTypeName(item.Type);
			if (!groupedItems[typeName]) {
				groupedItems[typeName] = [];
			}
			groupedItems[typeName].push(item);
		});

		console.log('Filtered items:', Object.keys(groupedItems).length);
		console.log('First category items:', Object.entries(groupedItems)[0]?.[1].slice(0, 3));
		return groupedItems;
	}

	/**
	 * 选择物品
	 * 设置选中物品，关闭模态框，清空搜索，并自动计算
	 * @param itemId - 物品ID
	 */
	function selectItem(itemId: number) {
		selectedItem = itemDataMap[itemId];
		showSelectItemModal = false;
		searchFilter = '';
		calculate();
	}



	/**
	 * 执行计算
	 * 调用 calcMaterials 计算材料和设备，并更新状态
	 */
	function calculate() {
		if (!selectedItem) return;

		const targetId = selectedItem.ID;
		const { materials: matResult, devices: devResult, recipeTree: tree } = calcMaterials(targetId, count, itemMap, itemDataMap, recipeMap);
		materials = Object.entries(matResult).sort((a, b) => b[1] - a[1]);
		devices = Object.entries(devResult).sort((a, b) => b[1] - a[1]);
		recipeTree = tree;
		console.log('Calculation result - Materials:', materials);
		console.log('Calculation result - Devices:', devices);
	}

	/**
	 * 处理键盘事件
	 * 按 Escape 键关闭模态框
	 * @param e - 键盘事件
	 */
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			showSelectItemModal = false;
		}
	}

	onMount(() => {
		loadData();
	});
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="container mx-auto p-5">
	<h1 class="text-center text-3xl font-bold mb-8 text-primary">🚀 戴森球计划 - 材料计算器</h1>

	<div class="flex gap-3 mb-5 items-center flex-wrap">
		<button
			class="btn btn-outline btn-primary flex-1 min-w-48 justify-start"
			onclick={() => (showSelectItemModal = true)}
		>
			{#if selectedItem}
				{#if getIconUrl(selectedItem)}
					<img
						src={getIconUrl(selectedItem)!}
						alt={selectedItem.Name}
						class="w-8 h-8 object-contain"
						onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
					/>
				{/if}
				<span>{selectedItem.Name} (ID: {selectedItem.ID})</span>
			{:else}
				<span class="text-base-content/50">点击选择物品...</span>
			{/if}
		</button>
		<input
		type="number"
		class="input input-bordered input-primary w-24"
		bind:value={count}
		min="1"
		placeholder="数量"
		onchange={calculate}
	/>
		</div>

	<div class="card bg-base-200 shadow-xl">
		<div class="card-body">
			{#if (materials.length > 0 || devices.length > 0) && selectedItem}
				<div class="text-lg mb-4 pb-4 border-b border-base-300 flex items-center gap-3">
				{#if getIconUrl(selectedItem)}
					<img
						src={getIconUrl(selectedItem)!}
						alt={selectedItem.Name}
						class="w-10 h-10 object-contain"
						onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
					/>
				{/if}
				<span>目标物品: <span class="text-secondary font-bold">{selectedItem.Name}</span> (ID: {selectedItem.ID}) × {count}</span>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div class="lg:col-span-2">
					<h3 class="text-lg font-semibold mb-3 text-secondary">配方详情</h3>
					<div class="overflow-x-auto">
						<table class="table table-xs table-zebra">
							<thead>
								<tr>
									<th>物品</th>
									<th>产能</th>
									<th>配方</th>
									<th>工厂</th>
								</tr>
							</thead>
							<tbody>
								{#each recipeTree as node (node.itemId)}
									<tr class="border-l-4 border-secondary/20 pl-4">
										<td class="flex items-center gap-2">
											{#if itemDataMap[node.itemId] && getIconUrl(itemDataMap[node.itemId])}
												<img
													src={getIconUrl(itemDataMap[node.itemId])!}
													alt={node.itemName}
													class="w-8 h-8 object-contain"
													onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
												/>
											{/if}
										</td>
										<td>{node.count}</td>
										<td>
											{#if node.recipe}
												<div class="flex items-center gap-2">
													{#each node.recipe.Items as itemId, index (itemId)}
														{@const item = itemDataMap[itemId]}
														{#if item && getIconUrl(item)}
															<img
																src={getIconUrl(item)!}
																alt={item.Name}
																class="w-6 h-6 object-contain"
																onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
															/>
															<span class="text-xs">{node.recipe.ItemCounts[index]}</span>
														{/if}
														{#if index < node.recipe.Items.length - 1}
															<span class="text-xs">+</span>
														{/if}
													{/each}
													<span class="text-sm font-bold">=</span>
													{#each node.recipe.Results as itemId, index (itemId)}
														{@const item = itemDataMap[itemId]}
														{#if item && getIconUrl(item)}
															<img
																src={getIconUrl(item)!}
																alt={item.Name}
																class="w-6 h-6 object-contain"
																onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
															/>
															<span class="text-xs">{node.recipe.ResultCounts[index] || 1}</span>
														{/if}
														{#if index < node.recipe.Results.length - 1}
															<span class="text-xs">+</span>
														{/if}
													{/each}
												</div>
											{:else}
												-
											{/if}
										</td>
										<td>
											{#if node.factories.length > 0}
												{@const factoryItem = itemDataMap[node.factories[0]]}
												{#if factoryItem && getIconUrl(factoryItem)}
													<div class="flex items-center gap-1" title={factoryItem.Name}>
														<img
															src={getIconUrl(factoryItem)!}
															alt={factoryItem.Name}
															class="w-6 h-6 object-contain"
															onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
														/>
														{#if node.factories.length > 1}
															<span class="text-xs text-base-content/50">+{node.factories.length - 1}</span>
														{/if}
													</div>
												{:else}
													-
												{/if}
											{:else}
												-
											{/if}
										</td>
									</tr>
									{#each node.children as child (child.itemId)}
										<tr class="border-l-4 border-secondary/20 pl-8">
											<td class="flex items-center gap-2">
												{#if itemDataMap[child.itemId] && getIconUrl(itemDataMap[child.itemId])}
													<img
														src={getIconUrl(itemDataMap[child.itemId])!}
														alt={child.itemName}
														class="w-8 h-8 object-contain"
														onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
													/>
												{/if}
											</td>
											<td>{child.count}</td>
											<td>
												{#if child.recipe}
													<div class="flex items-center gap-2">
														{#each child.recipe.Items as itemId, index (itemId)}
															{@const item = itemDataMap[itemId]}
															{#if item && getIconUrl(item)}
																<img
																	src={getIconUrl(item)!}
																	alt={item.Name}
																	class="w-6 h-6 object-contain"
																	onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
																/>
																<span class="text-xs">{child.recipe.ItemCounts[index]}</span>
															{/if}
															{#if index < child.recipe.Items.length - 1}
																<span class="text-xs">+</span>
															{/if}
														{/each}
														<span class="text-sm font-bold">=</span>
														{#each child.recipe.Results as itemId, index (itemId)}
															{@const item = itemDataMap[itemId]}
															{#if item && getIconUrl(item)}
																<img
																	src={getIconUrl(item)!}
																	alt={item.Name}
																	class="w-6 h-6 object-contain"
																	onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
																/>
																<span class="text-xs">{child.recipe.ResultCounts[index] || 1}</span>
															{/if}
															{#if index < child.recipe.Results.length - 1}
																<span class="text-xs">+</span>
															{/if}
														{/each}
													</div>
												{:else}
													-
												{/if}
											</td>
											<td>
												{#if child.factories.length > 0}
													{@const factoryItem = itemDataMap[child.factories[0]]}
													{#if factoryItem && getIconUrl(factoryItem)}
														<div class="flex items-center gap-1" title={factoryItem.Name}>
															<img
																src={getIconUrl(factoryItem)!}
																alt={factoryItem.Name}
																class="w-6 h-6 object-contain"
																onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
															/>
															{#if child.factories.length > 1}
																<span class="text-xs text-base-content/50">+{child.factories.length - 1}</span>
															{/if}
														</div>
													{:else}
														-
													{/if}
												{:else}
													-
												{/if}
											</td>
										</tr>
										{#each child.children as grandchild (grandchild.itemId)}
											<tr class="border-l-4 border-secondary/20 pl-12">
												<td class="flex items-center gap-2">
													{#if itemDataMap[grandchild.itemId] && getIconUrl(itemDataMap[grandchild.itemId])}
														<img
															src={getIconUrl(itemDataMap[grandchild.itemId])!}
															alt={grandchild.itemName}
															class="w-8 h-8 object-contain"
															onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
														/>
													{/if}
												</td>
												<td>{grandchild.count}</td>
												<td>
													{#if grandchild.recipe}
														<div class="flex items-center gap-2">
															{#each grandchild.recipe.Items as itemId, index (itemId)}
																{@const item = itemDataMap[itemId]}
																{#if item && getIconUrl(item)}
																	<img
																		src={getIconUrl(item)!}
																		alt={item.Name}
																		class="w-6 h-6 object-contain"
																		onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
																	/>
																	<span class="text-xs">{grandchild.recipe.ItemCounts[index]}</span>
																{/if}
																{#if index < grandchild.recipe.Items.length - 1}
																	<span class="text-xs">+</span>
																{/if}
															{/each}
															<span class="text-sm font-bold">=</span>
															{#each grandchild.recipe.Results as itemId, index (itemId)}
																{@const item = itemDataMap[itemId]}
																{#if item && getIconUrl(item)}
																	<img
																		src={getIconUrl(item)!}
																		alt={item.Name}
																		class="w-6 h-6 object-contain"
																		onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
																	/>
																	<span class="text-xs">{grandchild.recipe.ResultCounts[index] || 1}</span>
																{/if}
																{#if index < grandchild.recipe.Results.length - 1}
																	<span class="text-xs">+</span>
																{/if}
															{/each}
														</div>
													{:else}
														-
													{/if}
												</td>
												<td>
													{#if grandchild.factories.length > 0}
														{@const factoryItem = itemDataMap[grandchild.factories[0]]}
														{#if factoryItem && getIconUrl(factoryItem)}
															<div class="flex items-center gap-1" title={factoryItem.Name}>
																<img
																	src={getIconUrl(factoryItem)!}
																	alt={factoryItem.Name}
																	class="w-6 h-6 object-contain"
																	onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
																/>
																{#if grandchild.factories.length > 1}
																	<span class="text-xs text-base-content/50">+{grandchild.factories.length - 1}</span>
																{/if}
															</div>
														{:else}
															-
														{/if}
													{:else}
														-
													{/if}
												</td>
											</tr>
										{/each}
									{/each}
								{/each}
							</tbody>
						</table>
					</div>
				</div>

				<div class="space-y-4">
					<div>
						<h3 class="text-lg font-semibold mb-3 text-warning">所需材料</h3>
						<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
							{#each materials as [name, qty] (name)}
								{@const matItem = Object.values(itemDataMap).find((i) => i.Name === name)}
								<div class="flex flex-col items-center p-2 bg-base-100 rounded-lg">
									{#if matItem && getIconUrl(matItem)}
										<img
											src={getIconUrl(matItem)!}
											alt={name}
											class="w-8 h-8 object-contain mb-1"
											onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
										/>
									{/if}
									<span class="text-xs font-bold">{qty}</span>
								</div>
							{/each}
						</div>
					</div>

					{#if devices.length > 0}
						<div>
							<h3 class="text-lg font-semibold mb-3 text-error">所需设备</h3>
							<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
								{#each devices as [name, qty] (name)}
									{@const devItem = Object.values(itemDataMap).find((i) => i.Name === name)}
									<div class="flex flex-col items-center p-2 bg-base-100 rounded-lg">
										{#if devItem && getIconUrl(devItem)}
											<img
												src={getIconUrl(devItem)!}
												alt={name}
												class="w-8 h-8 object-contain mb-1"
												onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
											/>
										{/if}
										<span class="text-xs font-bold">{qty}</span>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
			{:else}
				<p class="text-center text-base-content/50">请选择物品后点击计算</p>
			{/if}
		</div>
	</div>
</div>

{#if showSelectItemModal}
	<div class="modal modal-open">
		<div class="modal-box max-w-4xl h-5/6 flex flex-col">
			<div class="flex justify-between items-center mb-4">
				<h3 class="text-xl font-bold text-primary">选择物品</h3>
				<input
					type="text"
					class="input input-bordered input-sm w-52"
					placeholder="搜索物品..."
					bind:value={searchFilter}
				/>
				<button class="btn btn-sm btn-circle btn-ghost" onclick={() => (showSelectItemModal = false)}>✕</button>
			</div>
			<div class="flex-1 overflow-y-auto">
				{#if isLoading}
					<p class="text-center text-base-content/50 py-10">加载中...</p>
				{:else}
					{#each Object.entries(getFilteredItems()).sort(([a], [b]) => a.localeCompare(b)) as [typeName, categoryItems] (typeName)}
						<div>
							<h4 class="text-secondary text-sm mt-4 mb-2 pb-1 border-b border-secondary/30">{typeName} ({categoryItems.length}个物品)</h4>
							<ItemGrid items={categoryItems} onSelect={(item) => selectItem(item.ID)} />
						</div>
					{/each}
					{#if Object.keys(getFilteredItems()).length === 0}
						<p class="text-center text-base-content/50 py-10">未找到匹配的物品</p>
					{/if}
				{/if}
			</div>
		</div>
		<button class="modal-backdrop" aria-label="关闭" onclick={() => (showSelectItemModal = false)}> </button>
	</div>
{/if}
