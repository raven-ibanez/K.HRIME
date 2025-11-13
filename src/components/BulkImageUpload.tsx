import React, { useState, useRef } from 'react';
import { Upload, X, Check, AlertCircle, Link2 } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';
import { useMenu } from '../hooks/useMenu';

interface BulkImageUploadProps {
  onClose: () => void;
  category?: string;
}

interface UploadItem {
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
  productName?: string;
}

const BulkImageUpload: React.FC<BulkImageUploadProps> = ({ onClose, category = 'clothes' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage } = useImageUpload();
  const { menuItems, updateMenuItem } = useMenu();
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<Array<{ name: string; url: string; productId?: string }>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(category);
  const [matchingMode, setMatchingMode] = useState<'manual' | 'auto'>('auto');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    const newItems: UploadItem[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending'
    }));

    setUploadItems(prev => [...prev, ...newItems]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeItem = (index: number) => {
    setUploadItems(prev => {
      const item = prev[index];
      if (item.preview) {
        URL.revokeObjectURL(item.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleBulkUpload = async () => {
    if (uploadItems.length === 0) {
      alert('Please select images to upload');
      return;
    }

    setIsUploading(true);
    const results: Array<{ name: string; url: string }> = [];

    for (let i = 0; i < uploadItems.length; i++) {
      const item = uploadItems[i];
      if (item.status === 'success') continue;

      setUploadItems(prev => {
        const updated = [...prev];
        updated[i] = { ...updated[i], status: 'uploading' };
        return updated;
      });

      try {
        const url = await uploadImage(item.file);
        
        // Try to auto-match by filename
        let matchedProductId: string | undefined;
        if (matchingMode === 'auto') {
          const cleanName = item.file.name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[-_]/g, ' ');
          const matched = menuItems.find(mi => {
            const itemName = mi.name.toLowerCase();
            // Check if filename contains significant words from product name
            const nameWords = itemName.split(/\s+/).filter(w => w.length > 3);
            return nameWords.some(word => cleanName.includes(word)) || 
                   cleanName.split(/\s+/).some(word => word.length > 3 && itemName.includes(word));
          });
          matchedProductId = matched?.id;
        }
        
        results.push({ name: item.file.name, url, productId: matchedProductId });
        
        setUploadItems(prev => {
          const updated = [...prev];
          updated[i] = { ...updated[i], status: 'success', url, productName: matchedProductId ? menuItems.find(m => m.id === matchedProductId)?.name : undefined };
          return updated;
        });
      } catch (error) {
        setUploadItems(prev => {
          const updated = [...prev];
          updated[i] = { 
            ...updated[i], 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Upload failed' 
          };
          return updated;
        });
      }
    }

    setUploadResults(results);
    setIsUploading(false);
  };

  const copyResultsToClipboard = () => {
    const text = uploadResults.map(r => `'${r.url}'`).join(',\n  ');
    navigator.clipboard.writeText(text);
    alert('Image URLs copied to clipboard!');
  };

  const assignImageToProduct = async (resultIndex: number, productId: string) => {
    const result = uploadResults[resultIndex];
    if (!result || !result.url) return;

    try {
      const product = menuItems.find(m => m.id === productId);
      if (!product) return;

      await updateMenuItem({
        ...product,
        image: result.url
      });

      // Update the result
      setUploadResults(prev => {
        const updated = [...prev];
        updated[resultIndex] = { ...updated[resultIndex], productId };
        return updated;
      });

      alert(`Image assigned to ${product.name} successfully!`);
    } catch (error) {
      alert('Failed to assign image. Please try again.');
      console.error(error);
    }
  };

  const assignAllMatched = async () => {
    const toAssign = uploadResults.filter(r => r.url && r.productId);
    if (toAssign.length === 0) {
      alert('No matched products to assign');
      return;
    }

    try {
      for (const result of toAssign) {
        if (!result.productId) continue;
        const product = menuItems.find(m => m.id === result.productId);
        if (!product || !result.url) continue;

        await updateMenuItem({
          ...product,
          image: result.url
        });
      }

      alert(`Successfully assigned ${toAssign.length} image(s) to products!`);
    } catch (error) {
      alert('Some assignments failed. Please check and try again.');
      console.error(error);
    }
  };

  const copySQLUpdate = () => {
    if (uploadResults.length === 0) {
      alert('No successful uploads to generate SQL');
      return;
    }

    // Generate SQL UPDATE statements
    const sql = `-- Update menu items with uploaded images
-- Generated from bulk upload

${uploadResults.map((result) => {
  if (result.productId) {
    const product = menuItems.find(m => m.id === result.productId);
    return `-- ${product?.name || 'Unknown Product'}
UPDATE menu_items SET image_url = '${result.url}' WHERE id = '${result.productId}';`;
  } else {
    const cleanName = result.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    return `-- ${result.name} (Manual match required)
-- UPDATE menu_items SET image_url = '${result.url}' WHERE name LIKE '%${cleanName.substring(0, 15)}%' AND category = '${selectedCategory}';`;
  }
}).join('\n\n')}`;

    navigator.clipboard.writeText(sql);
    alert('SQL UPDATE statements copied to clipboard!');
  };

  // Filter menu items by selected category
  const filteredMenuItems = selectedCategory 
    ? menuItems.filter(m => m.category === selectedCategory)
    : menuItems;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-2xl font-semibold text-black">Bulk Image Upload</h2>
            <p className="text-sm text-gray-600 mt-1">Upload multiple images at once</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Category Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Filter by Category (optional)
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              <option value="clothes">Clothes</option>
              <option value="black-elite-8000">BLACK ELITE 8000</option>
              <option value="black-elite-12000">BLACK ELITE 12000</option>
            </select>
          </div>

          {/* Matching Mode */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Matching Mode
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="auto"
                  checked={matchingMode === 'auto'}
                  onChange={(e) => setMatchingMode(e.target.value as 'auto' | 'manual')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Auto-match by filename</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="manual"
                  checked={matchingMode === 'manual'}
                  onChange={(e) => setMatchingMode(e.target.value as 'auto' | 'manual')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Manual assignment</span>
              </label>
            </div>
          </div>

          {/* File Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-2">
              Select Images (Multiple files allowed)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Click to select images</p>
              <p className="text-xs text-gray-500">JPEG, PNG, WebP, GIF (max 5MB each)</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
          </div>

          {/* Upload Items Grid */}
          {uploadItems.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-black">
                  Selected Images ({uploadItems.length})
                </h3>
                <button
                  onClick={handleBulkUpload}
                  disabled={isUploading || uploadItems.every(item => item.status === 'success')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>{isUploading ? 'Uploading...' : 'Upload All'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadItems.map((item, index) => (
                  <div key={index} className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={item.preview}
                      alt={item.file.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2 bg-gray-50">
                      <p className="text-xs text-gray-600 truncate mb-1" title={item.file.name}>
                        {item.file.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {item.status === 'pending' && (
                            <span className="text-xs text-gray-500">Pending</span>
                          )}
                          {item.status === 'uploading' && (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                              <span className="text-xs text-blue-600">Uploading...</span>
                            </>
                          )}
                          {item.status === 'success' && (
                            <>
                              <Check className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-green-600">Success</span>
                            </>
                          )}
                          {item.status === 'error' && (
                            <>
                              <AlertCircle className="h-3 w-3 text-red-600" />
                              <span className="text-xs text-red-600">Error</span>
                            </>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(index)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                          disabled={item.status === 'uploading'}
                        >
                          <X className="h-3 w-3 text-red-600" />
                        </button>
                      </div>
                      {item.error && (
                        <p className="text-xs text-red-600 mt-1 truncate" title={item.error}>
                          {item.error}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Section */}
          {uploadResults.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-black">
                  Upload Results ({uploadResults.length} successful)
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={copyResultsToClipboard}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Copy URLs
                  </button>
                  <button
                    onClick={copySQLUpdate}
                    className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Copy SQL
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {uploadResults.map((result, index) => {
                    const matchedProduct = result.productId ? menuItems.find(m => m.id === result.productId) : null;
                    return (
                      <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-start space-x-2 mb-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-700 font-medium truncate" title={result.name}>
                              {result.name}
                            </p>
                            <p className="text-gray-500 text-xs truncate" title={result.url}>
                              {result.url}
                            </p>
                            {matchedProduct && (
                              <p className="text-green-600 text-xs mt-1">
                                ✓ Matched: {matchedProduct.name}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <select
                            value={result.productId || ''}
                            onChange={(e) => assignImageToProduct(index, e.target.value)}
                            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select product to assign...</option>
                            {filteredMenuItems.map(item => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {uploadResults.some(r => r.productId) && (
                <div className="mt-4">
                  <button
                    onClick={assignAllMatched}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Link2 className="h-4 w-4" />
                    <span>Assign All Matched Images to Products</span>
                  </button>
                </div>
              )}

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Next Steps:</strong> Use the "Copy SQL" button to get UPDATE statements, 
                  then match the URLs to your product names and run the SQL in Supabase.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkImageUpload;

