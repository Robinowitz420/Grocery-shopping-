export interface User {
  id: string;
  name: string;
  email: string;
  householdSize: number;
  dietaryRestrictions: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  budget: number;
  cuisineTypes: string[];
  allergies: string[];
  dislikedIngredients: string[];
  preferredProteins: string[];
  mealPrepTime: 'quick' | 'medium' | 'long';
  cookingSkill: 'beginner' | 'intermediate' | 'advanced';
}

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  instructions: string[];
  extendedIngredients: Ingredient[];
  nutrition?: NutritionInfo;
  diets: string[];
  dishTypes: string[];
  cuisines: string[];
  spoonacularScore: number;
  pricePerServing: number;
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  original: string;
  image: string;
  aisle: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface MealPlan {
  id: string;
  week: string;
  meals: {
    [day: string]: {
      breakfast?: Recipe;
      lunch?: Recipe;
      dinner?: Recipe;
      snacks?: Recipe[];
    };
  };
  totalCost: number;
  estimatedSavings: number;
}

export interface GroceryList {
  id: string;
  mealPlanId: string;
  items: GroceryItem[];
  totalCost: number;
  estimatedSavings: number;
  createdAt: string;
  completed: boolean;
}

export interface GroceryItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  aisle: string;
  estimatedCost: number;
  purchased: boolean;
  recipes: string[];
}

export interface PantryItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  expirationDate?: string;
  category: string;
  addedDate: string;
}

export interface ShoppingHistory {
  id: string;
  date: string;
  items: GroceryItem[];
  totalCost: number;
  store: string;
}

export interface WasteTracker {
  id: string;
  itemName: string;
  amount: number;
  unit: string;
  reason: 'expired' | 'spoiled' | 'overcooked' | 'disliked' | 'other';
  date: string;
  estimatedCost: number;
}

export interface ApiResponse<T> {
  results: T[];
  offset: number;
  number: number;
  totalResults: number;
}

export interface SpoonacularSearchParams {
  query?: string;
  diet?: string;
  intolerances?: string;
  includeIngredients?: string;
  excludeIngredients?: string;
  type?: string;
  cuisine?: string;
  maxReadyTime?: number;
  minCalories?: number;
  maxCalories?: number;
  minProtein?: number;
  maxPrice?: number;
  number?: number;
  offset?: number;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
}