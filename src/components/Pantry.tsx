import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Calendar, Trash2 } from 'lucide-react';
import { PantryItem } from '../types';
import { formatDate, generateId } from '../utils/cn';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface PantryProps {
  onViewChange: (view: string) => void;
}

export function Pantry({ onViewChange }: PantryProps) {
  const [pantryItems, setPantryItems] = useLocalStorage<PantryItem[]>('pantry_items', [
    {
      id: generateId(),
      name: 'Canned Tomatoes',
      amount: 3,
      unit: 'cans',
      expirationDate: '2024-12-15',
      category: 'Canned Goods',
      addedDate: '2024-01-10'
    },
    {
      id: generateId(),
      name: 'Olive Oil',
      amount: 1,
      unit: 'bottle',
      expirationDate: '2025-06-20',
      category: 'Oils & Vinegars',
      addedDate: '2024-01-08'
    },
    {
      id: generateId(),
      name: 'Fresh Spinach',
      amount: 1,
      unit: 'bag',
      expirationDate: '2024-01-18',
      category: 'Produce',
      addedDate: '2024-01-15'
    },
    {
      id: generateId(),
      name: 'Greek Yogurt',
      amount: 2,
      unit: 'containers',
      expirationDate: '2024-01-25',
      category: 'Dairy',
      addedDate: '2024-01-12'
    }
  ]);

  const [newItem, setNewItem] = useState({
    name: '',
    amount: 1,
    unit: 'piece',
    expirationDate: '',
    category: 'Other'
  });

  const [filter, setFilter] = useState<'all' | 'expiring' | 'expired'>('all');

  const addItem = () => {
    if (newItem.name.trim()) {
      const item: PantryItem = {
        id: generateId(),
        name: newItem.name,
        amount: newItem.amount,
        unit: newItem.unit,
        expirationDate: newItem.expirationDate || undefined,
        category: newItem.category,
        addedDate: new Date().toISOString().split('T')[0]
      };
      setPantryItems(items => [...items, item]);
      setNewItem({
        name: '',
        amount: 1,
        unit: 'piece',
        expirationDate: '',
        category: 'Other'
      });
    }
  };

  const removeItem = (id: string) => {
    setPantryItems(items => items.filter(item => item.id !== id));
  };

  const updateAmount = (id: string, newAmount: number) => {
    if (newAmount <= 0) {
      removeItem(id);
    } else {
      setPantryItems(items =>
        items.map(item =>
          item.id === id ? { ...item, amount: newAmount } : item
        )
      );
    }
  };

  const isExpiringSoon = (expirationDate?: string) => {
    if (!expirationDate) return false;
    const expDate = new Date(expirationDate);
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    return expDate <= threeDaysFromNow && expDate >= today;
  };

  const isExpired = (expirationDate?: string) => {
    if (!expirationDate) return false;
    const expDate = new Date(expirationDate);
    const today = new Date();
    return expDate < today;
  };

  const filteredItems = pantryItems.filter(item => {
    if (filter === 'expiring') return isExpiringSoon(item.expirationDate);
    if (filter === 'expired') return isExpired(item.expirationDate);
    return true;
  });

  const groupedItems = filteredItems.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {} as { [category: string]: PantryItem[] });

  const expiringCount = pantryItems.filter(item => isExpiringSoon(item.expirationDate)).length;
  const expiredCount = pantryItems.filter(item => isExpired(item.expirationDate)).length;

  const categories = [
    'Produce', 'Dairy', 'Meat & Seafood', 'Grains & Rice', 'Canned Goods',
    'Oils & Vinegars', 'Spices & Seasonings', 'Frozen', 'Snacks', 'Other'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Pantry Tracker</h2>
          <p className="text-gray-600">
            Track what you have to avoid overbuying and reduce waste
          </p>
        </div>
        {(expiringCount > 0 || expiredCount > 0) && (
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <AlertTriangle className="w-5 h-5 text-warning-500" />
            <span className="text-sm text-gray-600">
              {expiredCount > 0 && `${expiredCount} expired`}
              {expiredCount > 0 && expiringCount > 0 && ', '}
              {expiringCount > 0 && `${expiringCount} expiring soon`}
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Total Items</h3>
          <p className="text-2xl font-bold text-primary-600">{pantryItems.length}</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 text-success-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Fresh Items</h3>
          <p className="text-2xl font-bold text-success-600">
            {pantryItems.filter(item => !isExpiringSoon(item.expirationDate) && !isExpired(item.expirationDate)).length}
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-warning-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Expiring Soon</h3>
          <p className="text-2xl font-bold text-warning-600">{expiringCount}</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-error-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Expired</h3>
          <p className="text-2xl font-bold text-error-600">{expiredCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Item Form */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Pantry Item</h3>
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
                <option value="can">can</option>
                <option value="bottle">bottle</option>
                <option value="box">box</option>
              </select>
            </div>
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="select"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <input
              type="date"
              placeholder="Expiration date (optional)"
              value={newItem.expirationDate}
              onChange={(e) => setNewItem({ ...newItem, expirationDate: e.target.value })}
              className="input"
            />
            <button
              onClick={addItem}
              className="btn-primary btn-md w-full flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Pantry Items */}
        <div className="lg:col-span-2">
          {/* Filter Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'all', label: 'All Items' },
              { key: 'expiring', label: 'Expiring Soon' },
              { key: 'expired', label: 'Expired' }
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

          {/* Items by Category */}
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="card">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-primary-500 rounded-full mr-3"></span>
                  {category}
                  <span className="ml-auto text-sm text-gray-500">
                    {items.length} item{items.length !== 1 ? 's' : ''}
                  </span>
                </h3>
                <div className="space-y-3">
                  {items.map((item) => {
                    const expiring = isExpiringSoon(item.expirationDate);
                    const expired = isExpired(item.expirationDate);
                    
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center space-x-4 p-3 rounded-lg border transition-all duration-200 ${
                          expired
                            ? 'bg-error-50 border-error-200'
                            : expiring
                            ? 'bg-warning-50 border-warning-200'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            {(expiring || expired) && (
                              <AlertTriangle className={`w-4 h-4 ${expired ? 'text-error-500' : 'text-warning-500'}`} />
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateAmount(item.id, item.amount - 1)}
                                  className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm font-medium transition-colors duration-200"
                                >
                                  -
                                </button>
                                <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                                  {item.amount} {item.unit}
                                </span>
                                <button
                                  onClick={() => updateAmount(item.id, item.amount + 1)}
                                  className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm font-medium transition-colors duration-200"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            {item.expirationDate && (
                              <p className={`text-xs ${
                                expired ? 'text-error-600' : expiring ? 'text-warning-600' : 'text-gray-500'
                              }`}>
                                Expires: {formatDate(item.expirationDate)}
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
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="card text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'Add some items to your pantry to get started.'
                  : `No ${filter} items in your pantry.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}