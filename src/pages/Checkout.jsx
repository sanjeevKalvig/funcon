import React, { useEffect, useState, useContext } from "react";
import { appContext } from "../components/Configurator/contexts/appContext"; 
import {
  ensureGuestCartId,
  getGuestCartItems,
  updateGuestCartItem,
  removeGuestCartItem,
} from "../lib/magento";

export default function Checkout() {
  const { /* optionally use displayPrice, etc */ } = useContext(appContext);
  const [cartId, setCartId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const id = await ensureGuestCartId();
        setCartId(id);
        const its = await getGuestCartItems(id);
        setItems(Array.isArray(its) ? its : []);
      } catch (e) {
        console.error(e);
        setError(e.message || "Failed to load cart");
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshKey]);

  const refresh = () => setRefreshKey(k => k + 1);

  async function handleQtyChange(itemId, newQty) {
    if (newQty < 1) return;
    setLoading(true);
    try {
      await updateGuestCartItem(cartId, itemId, Number(newQty));
      refresh();
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to update qty");
      setLoading(false);
    }
  }

  async function handleRemove(itemId) {
    if (!confirm("Remove this item from cart?")) return;
    setLoading(true);
    try {
      await removeGuestCartItem(cartId, itemId);
      refresh();
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to remove item");
      setLoading(false);
    }
  }

  function calculateTotals() {
    let subtotal = 0;
    for (const it of items) {
      const price = Number(it.price || it.product?.price || 0);
      const qty = Number(it.qty || 0);
      subtotal += price * qty;
    }
    return { subtotal };
  }

  function proceedToMagentoCheckout() {
    if (!cartId) {
      alert("Cart not ready");
      return;
    }
    const attachUrl = `https://rocking.magento.com/attach-cart?cartId=${encodeURIComponent(cartId)}`;
    window.location.href = attachUrl;
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-black">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-blue-200">Loading your cart...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-black">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8 max-w-md text-center">
        <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-red-400 text-xl font-bold">!</span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Something went wrong</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button 
          onClick={refresh}
          className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-500 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const { subtotal } = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-300 to-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Your Shopping Cart</h1>
          <p className="text-blue-200 max-w-2xl mx-auto">
            Review your items and proceed to checkout when you're ready
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-12 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Your cart is empty</h3>
            <p className="text-gray-400 mb-8">Start adding some amazing products to your cart!</p>
            <button 
              onClick={refresh}
              className="bg-cyan-600 text-white px-8 py-3 rounded-lg hover:bg-cyan-500 transition-colors font-medium"
            >
              Refresh Cart
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-xl font-semibold text-white">
                    Cart Items ({items.length})
                  </h2>
                </div>
                <ul className="divide-y divide-gray-700">
                  {items.map((it) => (
                    <li key={it.item_id} className="p-6 hover:bg-gray-800/50 transition-colors">
                      <div className="flex gap-6">
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {it.name || it.sku}
                          </h3>
                          <p className="text-gray-400 text-sm mb-3">SKU: {it.sku}</p>
                          
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-300">Quantity:</span>
                              <input
                                type="number"
                                min="1"
                                value={it.qty}
                                onChange={(e) => handleQtyChange(it.item_id, e.target.value)}
                                className="w-20 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-center text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              />
                            </div>
                            <button 
                              onClick={() => handleRemove(it.item_id)}
                              className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex-shrink-0 text-right">
                          <div className="text-lg font-bold text-cyan-400 mb-1">
                            ₹ {Number(it.price || 0).toLocaleString("en-IN")}
                          </div>
                          <div className="text-sm text-gray-400">
                            Total: ₹ {(Number(it.price || 0) * Number(it.qty || 0)).toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-6 sticky top-8">
                <h3 className="text-xl font-semibold text-white mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-lg font-semibold text-white">
                      ₹ {Number(subtotal).toLocaleString("en-IN")}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-gray-400">Calculated at checkout</span>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white">Estimated Total</span>
                      <span className="text-xl font-bold text-cyan-400">
                        ₹ {Number(subtotal).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={proceedToMagentoCheckout}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg hover:shadow-cyan-500/25 mb-4"
                >
                  Proceed to Checkout
                </button>

                <button 
                  onClick={refresh}
                  className="w-full border border-gray-600 text-gray-300 py-3 rounded-xl font-medium hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Cart
                </button>

                <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-800/50">
                  <p className="text-sm text-blue-300 text-center">
                    Secure checkout • Free returns • 24/7 support
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}