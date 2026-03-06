import { describe, it, expect } from 'vitest';
import { calcMaterials } from './calc';
import type { Item, Recipe } from '$lib/types';
import itemsData from '../../data/items.json';
import recipesData from '../../data/recipes.json';

const items = itemsData as Item[];
const recipes = recipesData as Recipe[];

const itemMap: Record<number, string> = {};
const itemDataMap: Record<number, Item> = {};
items.forEach((item) => {
	itemMap[item.ID] = item.Name;
	itemDataMap[item.ID] = item;
});

const recipeMap: Record<number, Recipe> = {};
recipes.forEach((recipe) => {
	recipe.Results.forEach((resultId) => {
		if (!recipeMap[resultId]) {
			recipeMap[resultId] = recipe;
		}
	});
});

describe('calcMaterials - 真实数据测试', () => {
	it('结构矩阵 - 应该正确计算材料需求', () => {
		const { materials } = calcMaterials(6003, 1, itemMap, itemDataMap, recipeMap);

		expect(materials['煤矿']).toBe(6);
		expect(materials['水']).toBe(1);
		expect(materials['钛石']).toBe(6);
		expect(materials['原油']).toBe(10);
	});

	it('宇宙矩阵 - 应该正确计算材料需求', () => {
		const { materials } = calcMaterials(6006, 1, itemMap, itemDataMap, recipeMap);

		expect(materials['铁矿']).toBe(29);
		expect(materials['铜矿']).toBe(16);
		expect(materials['煤矿']).toBe(41);
		expect(materials['水']).toBe(7.5);
		expect(materials['钛石']).toBe(18);
		expect(materials['石矿']).toBe(291);
		expect(materials['临界光子']).toBe(1);
		expect(materials['原油']).toBe(82.5);
	});

	it('星际物流运输站 - 应该正确计算材料需求', () => {
		const { materials } = calcMaterials(2104, 1, itemMap, itemDataMap, recipeMap);

		expect(materials['铁矿']).toBe(1120);
		expect(materials['钛石']).toBe(160);
		expect(materials['铜矿']).toBe(360);
		expect(materials['石矿']).toBe(3440);
		expect(materials['煤矿']).toBe(240);
		expect(materials['水']).toBe(120);
		expect(materials['原油']).toBe(360);
	});
});
