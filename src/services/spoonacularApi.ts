import { Recipe, ApiResponse, SpoonacularSearchParams, Ingredient } from '../types';

const API_BASE_URL = 'https://api.spoonacular.com';

export class SpoonacularAPI {
  private static instance: SpoonacularAPI;
  private apiKey: string = '';

  private constructor() {}

  public static getInstance(): SpoonacularAPI {
    if (!SpoonacularAPI.instance) {
      SpoonacularAPI.instance = new SpoonacularAPI();
    }
    return SpoonacularAPI.instance;
  }

  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  public hasApiKey(): boolean {
    return this.apiKey.length > 0;
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error('API key not set. Please configure your Spoonacular API key.');
    }

    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.searchParams.append('apiKey', this.apiKey);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your Spoonacular API key.');
        }
        if (response.status === 402) {
          throw new Error('API quota exceeded. Please check your Spoonacular plan.');
        }
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred while fetching data');
    }
  }

  public async searchRecipes(params: SpoonacularSearchParams): Promise<Recipe[]> {
    const response = await this.makeRequest<ApiResponse<Recipe>>('/recipes/complexSearch', {
      ...params,
      addRecipeInformation: true,
      fillIngredients: true,
      addRecipeNutrition: true,
    });
    return response.results;
  }

  public async getRandomRecipes(params: { number?: number; tags?: string } = {}): Promise<Recipe[]> {
    const response = await this.makeRequest<{ recipes: Recipe[] }>('/recipes/random', {
      number: params.number || 6,
      tags: params.tags,
    });
    return response.recipes;
  }

  public async getRecipeInformation(id: number): Promise<Recipe> {
    return await this.makeRequest<Recipe>(`/recipes/${id}/information`, {
      includeNutrition: true,
    });
  }

  public async getRecipesByIngredients(ingredients: string[], number: number = 10): Promise<Recipe[]> {
    const response = await this.makeRequest<Recipe[]>('/recipes/findByIngredients', {
      ingredients: ingredients.join(','),
      number,
      ranking: 2,
      ignorePantry: true,
    });
    return response;
  }

  public async getMealPlan(params: {
    timeFrame: 'day' | 'week';
    targetCalories?: number;
    diet?: string;
    exclude?: string;
  }): Promise<any> {
    return await this.makeRequest('/mealplanner/generate', params);
  }

  public async getIngredientSubstitutes(ingredientName: string): Promise<any> {
    return await this.makeRequest(`/food/ingredients/substitutes`, {
      ingredientName,
    });
  }

  public async analyzeRecipeInstructions(instructions: string): Promise<any> {
    return await this.makeRequest('/recipes/analyzeInstructions', {
      instructions,
    });
  }

  // Mock data for development when API key is not available
  public getMockRecipes(): Recipe[] {
    return [
      {
        id: 1,
        title: "Mediterranean Quinoa Bowl",
        image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
        readyInMinutes: 25,
        servings: 4,
        summary: "A healthy and delicious Mediterranean-inspired quinoa bowl packed with fresh vegetables and protein.",
        instructions: [
          "Cook quinoa according to package instructions",
          "Prepare vegetables and protein",
          "Assemble bowl with quinoa as base",
          "Top with vegetables and dressing"
        ],
        extendedIngredients: [
          {
            id: 1,
            name: "quinoa",
            amount: 1,
            unit: "cup",
            original: "1 cup quinoa",
            image: "quinoa.jpg",
            aisle: "Grains"
          },
          {
            id: 2,
            name: "cherry tomatoes",
            amount: 2,
            unit: "cups",
            original: "2 cups cherry tomatoes",
            image: "cherry-tomatoes.jpg",
            aisle: "Produce"
          }
        ],
        nutrition: {
          calories: 420,
          protein: 18,
          fat: 12,
          carbohydrates: 58,
          fiber: 8,
          sugar: 6,
          sodium: 380
        },
        diets: ["vegetarian", "gluten free"],
        dishTypes: ["lunch", "main course"],
        cuisines: ["Mediterranean"],
        spoonacularScore: 95,
        pricePerServing: 3.25
      },
      {
        id: 2,
        title: "Grilled Chicken with Roasted Vegetables",
        image: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400",
        readyInMinutes: 35,
        servings: 4,
        summary: "Perfectly grilled chicken breast served with a colorful array of roasted seasonal vegetables.",
        instructions: [
          "Preheat grill and oven",
          "Season chicken breast",
          "Prepare vegetables for roasting",
          "Grill chicken and roast vegetables",
          "Serve hot"
        ],
        extendedIngredients: [
          {
            id: 3,
            name: "chicken breast",
            amount: 4,
            unit: "pieces",
            original: "4 chicken breast pieces",
            image: "chicken-breast.jpg",
            aisle: "Meat"
          }
        ],
        nutrition: {
          calories: 380,
          protein: 42,
          fat: 8,
          carbohydrates: 28,
          fiber: 6,
          sugar: 12,
          sodium: 420
        },
        diets: ["gluten free"],
        dishTypes: ["dinner", "main course"],
        cuisines: ["American"],
        spoonacularScore: 88,
        pricePerServing: 4.50
      },
      {
        id: 3,
        title: "Avocado Toast with Poached Egg",
        image: "https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=400",
        readyInMinutes: 15,
        servings: 2,
        summary: "A simple yet satisfying breakfast featuring creamy avocado on toasted bread topped with a perfectly poached egg.",
        instructions: [
          "Toast bread slices",
          "Prepare avocado mash",
          "Poach eggs",
          "Assemble toast with avocado and egg",
          "Season and serve"
        ],
        extendedIngredients: [
          {
            id: 4,
            name: "avocado",
            amount: 2,
            unit: "pieces",
            original: "2 ripe avocados",
            image: "avocado.jpg",
            aisle: "Produce"
          }
        ],
        nutrition: {
          calories: 320,
          protein: 14,
          fat: 22,
          carbohydrates: 24,
          fiber: 12,
          sugar: 2,
          sodium: 280
        },
        diets: ["vegetarian"],
        dishTypes: ["breakfast", "brunch"],
        cuisines: ["American"],
        spoonacularScore: 82,
        pricePerServing: 2.75
      }
    ];
  }
}