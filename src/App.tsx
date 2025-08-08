import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { MealPlan } from './components/MealPlan';
import { GroceryList } from './components/GroceryList';
import { Pantry } from './components/Pantry';
import { Settings } from './components/Settings';
import { SpoonacularAPI } from './services/spoonacularApi';
import { useApiKey } from './hooks/useLocalStorage';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey] = useApiKey();

  useEffect(() => {
    // Initialize API with stored key
    if (apiKey) {
      SpoonacularAPI.getInstance().setApiKey(apiKey);
    }
  }, [apiKey]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'meal-plan':
        return <MealPlan onViewChange={setCurrentView} />;
      case 'grocery-list':
        return <GroceryList onViewChange={setCurrentView} />;
      case 'pantry':
        return <Pantry onViewChange={setCurrentView} />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onSettingsClick={() => setShowSettings(true)}
      />
      
      <main className="pb-8">
        {renderCurrentView()}
      </main>

      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}

export default App;