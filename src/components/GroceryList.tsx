import React, { useState, useEffect } from 'react';
import { ShoppingCart, Check, DollarSign, Package, Trash2, Plus } from 'lucide-react';
import { GroceryItem } from '../types';
import { formatCurrency, generateId } from '../utils/cn';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface GroceryListProps {
  onViewChange: (view: string) => void;
}

export function GroceryList({ onViewChange }: GroceryListProps) {
  const [groceryItems, setGroceryItems] = useLocalStorage<GroceryItem[]>('grocery_items', []);
  const [newItem, setNewItem] = useState({ name: '', amount: 1, unit: 'piece' });
  const [filter, setFilter] = useState<'all' | 'pending' | 'purchased'>('all');

  // Initialize with sample data if empty
  useEffect(() => {
    if (groceryItems.length === 0) {
      const sampleItems: GroceryItem[] = [
        {
          id: generateId(),
          name: 'Organic Chicken Breast',
          amount: 2,
          unit: 'lbs',
          aisle: 'Meat & Seafood',
          estimatedCost: 12.99,
          purchased: false,
          recipes: ['Grilled Chicken with Roasted Vegetables']
        },
        {
          id: generateId(),
          name: 'Quinoa',
          amount: 1,
          unit: 'bag',
          aisle: 'Grains & Rice',
          estimatedCost: 4.99,
          purchased: false,
          recipes: ['Mediterranean Quinoa Bowl']
        },
        {
          id: generateId(),
          name: 'Cherry Tomatoes',
          amount: 2,
          unit: 'containers',
          aisle: 'Produce',
          estimatedCost: 5.98,
          purchased: true,
          recipes: ['Mediterranean Quinoa Bowl', 'Avocado Toast']
        },
        {
          id: generateId(),
          name: 'Avocados',
          amount: 4,
          unit: 'pieces',
          aisle: 'Produce',
          estimatedCost: 3.96,
          purchased: false,
          recipes: ['Avocado Toast with Poached Egg']
        },
        {
          id: generateId(),
          name: 'Whole Grain Bread',
          amount: 1,
          unit: 'loaf',
          aisle: 'Bakery',
          estimatedCost: 3.49,
          purchased: false,
          recipes: ['Avocado Toast with Poached Egg']
        },
        {
          id: generateId(),
          name: 'Free Range Eggs',
          amount: 1,
          unit: 'dozen',
          aisle: 'Dairy & Eggs',
          estimatedCost: 4.99,
          purchased: true,
          recipes: ['Avocado Toast with Poached Egg']
        }
      ];
      setGroceryItems(sampleItems);
    }
  }, [groceryItems.length, setGroceryItems]);

  const togglePurchased = (id: string) => {
    setGroceryItems(items =>
      items.map(item =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setGroceryItems(items => items.filter(item => item.id !== id));
  };

  const addItem = () => {
    if (newItem.name.trim()) {
      const item: GroceryItem = {
        id: generateId(),
        name: newItem.name,
        amount: newItem.amount,
        unit: newItem.unit,
        aisle: 'Other',
        estimatedCost: 0,
        purchased: false,
        recipes: []
      };
      setGroceryItems(items => [...items, item]);
      setNewItem({ name: '', amount: 1, unit: 'piece' });
    }
  };

  const filteredItems = groceryItems.filter(item => {
    if (filter === 'pending') return !item.purchased;
    if (filter === 'purchased') return item.purchased;
    return true;
  });

  const groupedItems = filteredItems.reduce((groups, item) => {
    const aisle = item.aisle;
    if (!groups[aisle]) groups[aisle] = [];
    groups[aisle].push(item);
    return groups;
  }, {} as { [aisle: string]: GroceryItem[] });

  const totalCost = groceryItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  const purchasedCost = groceryItems.filter(item => item.purchased).reduce((sum, item) => sum + item.estimatedCost, 0);
  const pendingItems = groceryItems.filter(item => !item.purchased).length;
  const completedItems = groceryItems.filter(item => item.purchased).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Grocery List</h2>
          <p className="text-gray-600">
            {pendingItems} items remaining • {completedItems} completed
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Budget</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCost)}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Total Items</h3>
          <p className="text-2xl font-bold text-primary-600">{groceryItems.length}</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-6 h-6 text-warning-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Pending</h3>
          <p className="text-2xl font-bold text-warning-600">{pendingItems}</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-success-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Completed</h3>
          <p className="text-2xl font-bold text-success-600">{completedItems}</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-6 h-6 text-gray-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Spent</h3>
          <p className="text-2xl font-bold text-gray-600">{formatCurrency(purchasedCost)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Item Form */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Item</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="input"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Amount"
                value={newItem.amount}
                onChange={(e) => setNewItem({ ...newItem, amount: parseInt(e.target.value) || 1 })}
                className="input"
                min="1"
              />
              <select
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                className="select"
              >
                <option value="piece">piece</option>
                <option value="lbs">lbs</option>
                <option value="oz">oz</option>
                <option value="bag">bag</option>
                <option value="container">container</option>
                <option value="dozen">dozen</option>
                <option value="loaf">loaf</option>
              </select>
            </div>
            <button
              onClick={addItem}
              className="btn-primary btn-md w-full flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Grocery List */}
        <div className="lg:col-span-2">
          {/* Filter Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'all', label: 'All Items' },
              { key: 'pending', label: 'Pending' },
              { key: 'purchased', label: 'Purchased' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  filter === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Items by Aisle */}
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([aisle, items]) => (
              <div key={aisle} className="card">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-primary-500 rounded-full mr-3"></span>
                  {aisle}
                  <span className="ml-auto text-sm text-gray-500">
                    {items.length} item{items.length !== 1 ? 's' : ''}
                  </span>
                </h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center space-x-4 p-3 rounded-lg border transition-all duration-200 ${
                        item.purchased
                          ? 'bg-success-50 border-success-200'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <button
                        onClick={() => togglePurchased(item.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                          item.purchased
                            ? 'bg-success-500 border-success-500 text-white'
                            : 'border-gray-300 hover:border-success-500'
                        }`}
                      >
                        {item.purchased && <Check className="w-4 h-4" />}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${
                            item.purchased ? 'text-gray-500 line-through' : 'text-gray-900'
                          }`}>
                            {item.name}
                          </h4>
                          <span className={`font-medium ${
                            item.purchased ? 'text-gray-500' : 'text-gray-900'
                          }`}>
                            {formatCurrency(item.estimatedCost)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-500">
                            {item.amount} {item.unit}
                          </p>
                          {item.recipes.length > 0 && (
                            <p className="text-xs text-gray-400">
                              For: {item.recipes[0]}
                              {item.recipes.length > 1 && ` +${item.recipes.length - 1} more`}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-error-500 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="card text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'Add some items to your grocery list to get started.'
                  : `No ${filter} items in your list.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}