import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, DollarSign, RefreshCw, Plus, ChefHat } from 'lucide-react';
import { SpoonacularAPI } from '../services/spoonacularApi';
import { Recipe } from '../types';
import { formatCurrency } from '../utils/cn';
import { useHouseholdSize, useDietaryRestrictions, useUserPreferences } from '../hooks/useLocalStorage';

interface MealPlanProps {
  onViewChange: (view: string) => void;
}

export function MealPlan({ onViewChange }: MealPlanProps) {
  const [mealPlan, setMealPlan] = useState<{ [key: string]: { [meal: string]: Recipe | null } }>({});
  const [loading, setLoading] = useState(false);
  const [householdSize] = useHouseholdSize();
  const [dietaryRestrictions] = useDietaryRestrictions();
  const [preferences] = useUserPreferences();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner'];

  const generateMealPlan = async () => {
    setLoading(true);
    try {
      const api = SpoonacularAPI.getInstance();
      const newMealPlan: { [key: string]: { [meal: string]: Recipe | null } } = {};

      for (const day of daysOfWeek) {
        newMealPlan[day] = {};
        for (const mealType of mealTypes) {
          try {
            let recipes: Recipe[];
            
            if (api.hasApiKey()) {
              recipes = await api.searchRecipes({
                type: mealType,
                diet: dietaryRestrictions.join(','),
                number: 1,
                maxReadyTime: preferences.mealPrepTime === 'quick' ? 30 : preferences.mealPrepTime === 'medium' ? 60 : undefined,
              });
            } else {
              // Use mock data
              const mockRecipes = api.getMockRecipes();
              recipes = mockRecipes.filter(recipe => 
                recipe.dishTypes.some(type => type.includes(mealType))
              ).slice(0, 1);
              
              if (recipes.length === 0) {
                recipes = [mockRecipes[Math.floor(Math.random() * mockRecipes.length)]];
              }
            }

            newMealPlan[day][mealType] = recipes[0] || null;
          } catch (error) {
            console.error(`Error fetching ${mealType} for ${day}:`, error);
            newMealPlan[day][mealType] = null;
          }
        }
      }

      setMealPlan(newMealPlan);
    } catch (error) {
      console.error('Error generating meal plan:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load initial meal plan or generate one
    generateMealPlan();
  }, []);

  const calculateTotalCost = () => {
    let total = 0;
    Object.values(mealPlan).forEach(day => {
      Object.values(day).forEach(recipe => {
        if (recipe) {
          total += recipe.pricePerServing * householdSize;
        }
      });
    });
    return total;
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      default: return '🍽️';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Weekly Meal Plan</h2>
          <p className="text-gray-600">Optimized for your household of {householdSize} people</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="text-right">
            <p className="text-sm text-gray-600">Estimated Weekly Cost</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(calculateTotalCost())}</p>
          </div>
          <button
            onClick={generateMealPlan}
            disabled={loading}
            className="btn-primary btn-md flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Generating...' : 'Regenerate'}</span>
          </button>
        </div>
      </div>

      {/* Meal Plan Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-8">
        {daysOfWeek.map((day, dayIndex) => (
          <div key={day} className="card">
            <div className="text-center mb-4">
              <h3 className="font-semibold text-gray-900">{day}</h3>
              <p className="text-sm text-gray-500">
                {new Date(Date.now() + dayIndex * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div className="space-y-4">
              {mealTypes.map((mealType) => {
                const recipe = mealPlan[day]?.[mealType];
                return (
                  <div key={mealType} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                        {getMealIcon(mealType)} {mealType}
                      </span>
                      {recipe && (
                        <span className="text-xs text-gray-500">
                          {recipe.readyInMinutes}min
                        </span>
                      )}
                    </div>

                    {loading ? (
                      <div className="animate-pulse">
                        <div className="bg-gray-200 h-16 rounded mb-2"></div>
                        <div className="bg-gray-200 h-3 rounded"></div>
                      </div>
                    ) : recipe ? (
                      <div className="group cursor-pointer">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-full h-16 object-cover rounded mb-2 group-hover:opacity-80 transition-opacity duration-200"
                        />
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
                          {recipe.title}
                        </h4>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                          <span>{recipe.nutrition?.calories || 'N/A'} cal</span>
                          <span>{formatCurrency(recipe.pricePerServing * householdSize)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-20 border-2 border-dashed border-gray-300 rounded">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Daily Summary */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Daily Total</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(
                    Object.values(mealPlan[day] || {}).reduce((sum, recipe) => 
                      sum + (recipe ? recipe.pricePerServing * householdSize : 0), 0
                    )
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => onViewChange('grocery-list')}
          className="btn-primary btn-lg flex items-center justify-center space-x-2 flex-1"
        >
          <ChefHat className="w-5 h-5" />
          <span>Generate Grocery List</span>
        </button>
        <button className="btn-secondary btn-lg flex items-center justify-center space-x-2 flex-1">
          <Calendar className="w-5 h-5" />
          <span>Save Meal Plan</span>
        </button>
      </div>

      {/* Meal Plan Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Household Size</h3>
          <p className="text-2xl font-bold text-primary-600">{householdSize}</p>
          <p className="text-sm text-gray-600">People</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-success-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Avg Prep Time</h3>
          <p className="text-2xl font-bold text-success-600">
            {Math.round(
              Object.values(mealPlan).reduce((total, day) => 
                total + Object.values(day).reduce((dayTotal, recipe) => 
                  dayTotal + (recipe?.readyInMinutes || 0), 0
                ), 0
              ) / (daysOfWeek.length * mealTypes.length)
            )}
          </p>
          <p className="text-sm text-gray-600">Minutes</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-6 h-6 text-warning-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Weekly Budget</h3>
          <p className="text-2xl font-bold text-warning-600">{formatCurrency(calculateTotalCost())}</p>
          <p className="text-sm text-gray-600">Estimated</p>
        </div>
      </div>
    </div>
  );
}