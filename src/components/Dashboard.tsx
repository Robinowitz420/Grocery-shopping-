import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Clock, DollarSign, Leaf, Users, ChefHat, Target } from 'lucide-react';
import { SpoonacularAPI } from '../services/spoonacularApi';
import { Recipe } from '../types';
import { formatCurrency } from '../utils/cn';

interface DashboardProps {
  onViewChange: (view: string) => void;
}

export function Dashboard({ onViewChange }: DashboardProps) {
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedRecipes = async () => {
      try {
        const api = SpoonacularAPI.getInstance();
        let recipes: Recipe[];
        
        if (api.hasApiKey()) {
          recipes = await api.getRandomRecipes({ number: 3 });
        } else {
          recipes = api.getMockRecipes().slice(0, 3);
        }
        
        setFeaturedRecipes(recipes);
      } catch (error) {
        console.error('Error loading featured recipes:', error);
        // Fallback to mock data
        const api = SpoonacularAPI.getInstance();
        setFeaturedRecipes(api.getMockRecipes().slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedRecipes();
  }, []);

  const stats = [
    {
      label: 'Weekly Savings',
      value: '$24.50',
      change: '+12%',
      icon: DollarSign,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      description: 'Compared to last week',
    },
    {
      label: 'Food Waste Reduced',
      value: '85%',
      change: '+5%',
      icon: Leaf,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      description: 'This month',
    },
    {
      label: 'Meals Planned',
      value: '21',
      change: 'This week',
      icon: ChefHat,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      description: '7 days covered',
    },
    {
      label: 'Budget Target',
      value: '92%',
      change: 'On track',
      icon: Target,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
      description: 'Monthly goal',
    },
  ];

  const quickActions = [
    {
      title: 'Plan This Week\'s Meals',
      description: 'Generate optimized meal suggestions based on your preferences',
      icon: Clock,
      action: () => onViewChange('meal-plan'),
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      hoverColor: 'hover:bg-primary-100',
    },
    {
      title: 'View Grocery List',
      description: 'Check your optimized shopping list and estimated costs',
      icon: ShoppingBag,
      action: () => onViewChange('grocery-list'),
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      hoverColor: 'hover:bg-success-100',
    },
    {
      title: 'Update Pantry',
      description: 'Track what you have to avoid overbuying',
      icon: Users,
      action: () => onViewChange('pantry'),
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
      hoverColor: 'hover:bg-warning-100',
    },
  ];

  const recentActivity = [
    {
      type: 'success',
      title: 'Grocery list completed',
      description: 'Saved $12.30 compared to last week',
      time: '2 hours ago',
    },
    {
      type: 'info',
      title: 'Meal plan generated',
      description: '7 meals planned for the week',
      time: '1 day ago',
    },
    {
      type: 'warning',
      title: 'Pantry items expiring soon',
      description: '3 items need to be used within 2 days',
      time: '2 days ago',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
        <p className="text-gray-600">Here's your weekly meal planning overview and savings summary</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${stat.color}`}>{stat.change}</span>
                    <span className="text-xs text-gray-500 ml-2">{stat.description}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor} ml-4`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className={`w-full text-left p-4 rounded-xl border border-gray-200 ${action.hoverColor} transition-all duration-200 group`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className={`w-5 h-5 ${action.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                        {action.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Recipes */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Featured Recipes</h3>
            <button
              onClick={() => onViewChange('meal-plan')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
            >
              View all →
            </button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-40 rounded-xl mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredRecipes.map((recipe, index) => (
                <div key={recipe.id} className="group cursor-pointer animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                      {recipe.readyInMinutes} min
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-medium">{formatCurrency(recipe.pricePerServing)} per serving</p>
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2 mb-2">
                    {recipe.title}
                  </h4>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Serves {recipe.servings}</span>
                    <span>{recipe.nutrition?.calories || 'N/A'} cal</span>
                  </div>
                  {recipe.diets.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {recipe.diets.slice(0, 2).map((diet) => (
                        <span key={diet} className="badge-primary text-xs">
                          {diet}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.type === 'success' ? 'bg-success-500' :
                activity.type === 'warning' ? 'bg-warning-500' : 'bg-primary-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}