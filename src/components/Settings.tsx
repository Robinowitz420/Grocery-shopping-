import React, { useState } from 'react';
import { X, Save, Key, User, Home, Utensils, AlertCircle } from 'lucide-react';
import { useApiKey, useHouseholdSize, useDietaryRestrictions, useUserPreferences } from '../hooks/useLocalStorage';
import { SpoonacularAPI } from '../services/spoonacularApi';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const [apiKey, setApiKey] = useApiKey();
  const [householdSize, setHouseholdSize] = useHouseholdSize();
  const [dietaryRestrictions, setDietaryRestrictions] = useDietaryRestrictions();
  const [preferences, setPreferences] = useUserPreferences();
  
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [activeTab, setActiveTab] = useState('api');

  const handleSave = () => {
    setApiKey(tempApiKey);
    SpoonacularAPI.getInstance().setApiKey(tempApiKey);
    onClose();
  };

  const dietOptions = [
    'vegetarian', 'vegan', 'gluten free', 'ketogenic', 'paleo',
    'pescetarian', 'lacto vegetarian', 'ovo vegetarian', 'whole30'
  ];

  const cuisineOptions = [
    'American', 'Italian', 'Mexican', 'Chinese', 'Indian', 'Mediterranean',
    'Thai', 'Japanese', 'French', 'Greek', 'Korean', 'Spanish'
  ];

  const allergyOptions = [
    'dairy', 'egg', 'gluten', 'grain', 'peanut', 'seafood',
    'sesame', 'shellfish', 'soy', 'sulfite', 'tree nut', 'wheat'
  ];

  const proteinOptions = [
    'chicken', 'beef', 'pork', 'fish', 'turkey', 'lamb',
    'tofu', 'beans', 'lentils', 'quinoa', 'eggs'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 p-6">
            <nav className="space-y-2">
              {[
                { id: 'api', label: 'API Configuration', icon: Key },
                { id: 'household', label: 'Household', icon: Home },
                { id: 'dietary', label: 'Dietary Preferences', icon: Utensils },
                { id: 'preferences', label: 'Food Preferences', icon: User },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-3 ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {activeTab === 'api' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Spoonacular API Configuration</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">API Key Required</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          To access real recipe data, you need a Spoonacular API key. 
                          <a 
                            href="https://spoonacular.com/food-api" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="underline hover:no-underline ml-1"
                          >
                            Get your free API key here
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      placeholder="Enter your Spoonacular API key"
                      className="input"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Your API key is stored locally and never shared. Without an API key, the app will use sample data.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'household' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Household Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Household Size
                    </label>
                    <select
                      value={householdSize}
                      onChange={(e) => setHouseholdSize(parseInt(e.target.value))}
                      className="select max-w-xs"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                        <option key={size} value={size}>
                          {size} {size === 1 ? 'person' : 'people'}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                      This helps us calculate proper serving sizes and grocery quantities.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weekly Budget
                  </label>
                  <div className="relative max-w-xs">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={preferences.budget}
                      onChange={(e) => setPreferences({ ...preferences, budget: parseInt(e.target.value) || 0 })}
                      className="input pl-8"
                      min="0"
                      step="10"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Set your weekly grocery budget to get cost-optimized meal suggestions.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'dietary' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dietary Restrictions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {dietOptions.map(diet => (
                      <label key={diet} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={dietaryRestrictions.includes(diet)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setDietaryRestrictions([...dietaryRestrictions, diet]);
                            } else {
                              setDietaryRestrictions(dietaryRestrictions.filter(d => d !== diet));
                            }
                          }}
                          className="checkbox"
                        />
                        <span className="text-sm text-gray-700 capitalize">{diet}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Allergies & Intolerances</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {allergyOptions.map(allergy => (
                      <label key={allergy} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={preferences.allergies.includes(allergy)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPreferences({
                                ...preferences,
                                allergies: [...preferences.allergies, allergy]
                              });
                            } else {
                              setPreferences({
                                ...preferences,
                                allergies: preferences.allergies.filter(a => a !== allergy)
                              });
                            }
                          }}
                          className="checkbox"
                        />
                        <span className="text-sm text-gray-700 capitalize">{allergy}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Food Preferences</h3>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Preferred Cuisines</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {cuisineOptions.map(cuisine => (
                        <label key={cuisine} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={preferences.cuisineTypes.includes(cuisine)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPreferences({
                                  ...preferences,
                                  cuisineTypes: [...preferences.cuisineTypes, cuisine]
                                });
                              } else {
                                setPreferences({
                                  ...preferences,
                                  cuisineTypes: preferences.cuisineTypes.filter(c => c !== cuisine)
                                });
                              }
                            }}
                            className="checkbox"
                          />
                          <span className="text-sm text-gray-700">{cuisine}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Preferred Proteins</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {proteinOptions.map(protein => (
                        <label key={protein} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={preferences.preferredProteins.includes(protein)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPreferences({
                                  ...preferences,
                                  preferredProteins: [...preferences.preferredProteins, protein]
                                });
                              } else {
                                setPreferences({
                                  ...preferences,
                                  preferredProteins: preferences.preferredProteins.filter(p => p !== protein)
                                });
                              }
                            }}
                            className="checkbox"
                          />
                          <span className="text-sm text-gray-700 capitalize">{protein}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meal Prep Time
                      </label>
                      <select
                        value={preferences.mealPrepTime}
                        onChange={(e) => setPreferences({ 
                          ...preferences, 
                          mealPrepTime: e.target.value as 'quick' | 'medium' | 'long'
                        })}
                        className="select"
                      >
                        <option value="quick">Quick (≤30 min)</option>
                        <option value="medium">Medium (30-60 min)</option>
                        <option value="long">Long (60+ min)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cooking Skill Level
                      </label>
                      <select
                        value={preferences.cookingSkill}
                        onChange={(e) => setPreferences({ 
                          ...preferences, 
                          cookingSkill: e.target.value as 'beginner' | 'intermediate' | 'advanced'
                        })}
                        className="select"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="btn-secondary btn-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary btn-md flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}