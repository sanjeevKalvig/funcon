import React from 'react'

function ProductDetails() {
    return (
        <div className="mb-5">
            <h3 className="mb-2 text-sm font-medium text-slate-200">Product Details</h3>
            <ul className="text-xs text-slate-400 space-y-1.5">
                <li className="flex justify-between">
                    <span>Material:</span>
                    <span className="text-slate-300">Premium Fabric</span>
                </li>
                <li className="flex justify-between">
                    <span>Configuration:</span>
                    <span className="text-slate-300">3-Seater</span>
                </li>
                <li className="flex justify-between">
                    <span>Leg Style:</span>
                    <span className="text-slate-300">Tapered</span>
                </li>
                <li className="flex justify-between">
                    <span>Warranty:</span>
                    <span className="text-slate-300">2 Years</span>
                </li>
            </ul>
        </div>
    )
}

export default ProductDetails