import type { Item, Recipe } from '../types';

export interface RecipeNode {
  itemId: number;
  itemName: string;
  count: number;
  recipe: Recipe | null;
  factories: number[];
  children: RecipeNode[];
}

/**
 * 计算目标物品所需的材料和设备
 * 使用深度优先搜索遍历配方树，区分材料和设备（Type 4或12）
 * 考虑配方的产出数量（ResultCounts），当产出大于1时需要按比例计算原材料
 * @param targetId - 目标物品ID
 * @param targetCount - 目标数量
 * @param itemMap - 物品ID到名称的映射
 * @param itemDataMap - 物品ID到物品数据的映射
 * @param recipeMap - 物品ID到配方的映射
 * @returns 包含材料、设备和配方树的对象
 */
export function calcMaterials(
	targetId: number,
	targetCount: number,
	itemMap: Record<number, string>,
	itemDataMap: Record<number, Item>,
	recipeMap: Record<number, Recipe>
): { materials: Record<string, number>; devices: Record<string, number>; recipeTree: RecipeNode[] } {
	const materials: Record<string, number> = {};
	const devices: Record<string, number> = {};
	const recipeTree: RecipeNode[] = [];
	// stack: [物品ID, 所需数量, 已访问路径, 当前配方的产出数量, 父节点]
	const stack: [number, number, number[], number, RecipeNode | null][] = [[targetId, targetCount, [], 1, null]];

	console.log('Starting calculation for target:', targetId, 'count:', targetCount);

	while (stack.length > 0) {
		const [currentId, cnt, path, parentResultCount, parentNode] = stack.pop()!;
		const currentItem = itemDataMap[currentId];
		const currentName = itemMap[currentId] || `ID:${currentId}`;

		console.log('Processing:', currentName, 'count:', cnt, 'parentResultCount:', parentResultCount);

		const node: RecipeNode = {
			itemId: currentId,
			itemName: currentName,
			count: cnt,
			recipe: null,
			factories: [],
			children: []
		};

		// 检查循环依赖
		if (path.includes(currentId)) {
			console.log('Cycle detected for:', currentName);
			if (currentItem && (currentItem.Type === 4 || currentItem.Type === 12)) {
				devices[currentName] = (devices[currentName] || 0) + cnt;
			} else {
				materials[currentName] = (materials[currentName] || 0) + cnt;
			}
			if (parentNode) {
				parentNode.children.push(node);
			} else {
				recipeTree.push(node);
			}
			continue;
		}

		// 没有配方的物品（原材料）
		if (!recipeMap[currentId]) {
			console.log('No recipe for:', currentName, 'adding as material/device');
			if (currentItem && (currentItem.Type === 4 || currentItem.Type === 12)) {
				devices[currentName] = (devices[currentName] || 0) + cnt;
			} else {
				materials[currentName] = (materials[currentName] || 0) + cnt;
			}
			if (parentNode) {
				parentNode.children.push(node);
			} else {
				recipeTree.push(node);
			}
			continue;
		}

		const recipe = recipeMap[currentId];
		node.recipe = recipe;
		node.factories = recipe.Factories || [];
		console.log('Recipe found:', recipe.Name, 'Results:', recipe.Results, 'ResultCounts:', recipe.ResultCounts);

		// 配方没有原材料（可能是采集类配方）
		if (recipe.Items.length === 0) {
			console.log('Recipe has no items for:', currentName);
			if (currentItem && (currentItem.Type === 4 || currentItem.Type === 12)) {
				devices[currentName] = (devices[currentName] || 0) + cnt;
			} else {
				materials[currentName] = (materials[currentName] || 0) + cnt;
			}
			if (parentNode) {
				parentNode.children.push(node);
			} else {
				recipeTree.push(node);
			}
			continue;
		}

		// 获取当前配方的产出数量
		const resultCount = recipe.ResultCounts[0] || 1;
		// 计算比例：所需数量 / 产出数量
		const ratio = cnt / resultCount;
		console.log('Result count:', resultCount, 'Ratio:', ratio);

		const newPath = [...path, currentId];

		// 将原材料加入栈中，传递当前配方的产出数量
		for (let i = 0; i < recipe.Items.length; i++) {
			const matId = recipe.Items[i];
			const matCountPerResult = recipe.ItemCounts[i];
			// 计算实际需要的原材料数量（保留小数）
			const matCount = matCountPerResult * ratio;
			console.log('  Material:', itemMap[matId], 'per result:', matCountPerResult, 'total needed:', matCount);
			stack.push([matId, matCount, newPath, resultCount, node]);
		}

		if (parentNode) {
			parentNode.children.push(node);
		} else {
			recipeTree.push(node);
		}
	}

	// 将结果保留两位小数
	const roundedMaterials: Record<string, number> = {};
	const roundedDevices: Record<string, number> = {};

	for (const [name, count] of Object.entries(materials)) {
		roundedMaterials[name] = Math.round(count * 100) / 100;
	}

	for (const [name, count] of Object.entries(devices)) {
		roundedDevices[name] = Math.round(count * 100) / 100;
	}

	console.log('Final materials:', roundedMaterials);
	console.log('Final devices:', roundedDevices);

	return { materials: roundedMaterials, devices: roundedDevices, recipeTree };
}
