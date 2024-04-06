import React from 'react';
import './FlowerModal.css';

interface Flower {
    id: string;
    flower_name: string;
    product_type: string;
    brand: string;
    image: string;
    colors: string[];
    material: string;
    sizes: { [size: string]: number };
    prices: { [size: string]: number };
    availability: string;
    description: string;
    quantity: number;
    occasion: string[];
    ratings: number;
    care_instructions: string;
}

interface FlowerModalProps {
    flower: Flower;
    closeModal: () => void;
}

const FlowerModal: React.FC<FlowerModalProps> = ({ flower, closeModal }) => {

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal">
                <button className="close-btn" onClick={closeModal}>X</button>
                <div className="content">
                    <div className="image-container">
                        <img src={flower.image} alt={flower.flower_name} />
                    </div>
                    <div className="details">
                        <h2>{flower.flower_name}</h2>
                        <div className='c'><p><strong>Product Type:</strong> {flower.product_type}</p>
                            <p><strong>Brand:</strong> {flower.brand}</p></div>
                        <div className='c'><p><strong>Colors:</strong> {flower.colors.join(', ')}</p>
                            <p><strong>Material:</strong> {flower.material}</p></div>
                        <div className='d'>
                            <ul>
                            <p><strong>Sizes:</strong></p>
                                {Object.entries(flower.sizes).map(([size, quantity]) => (
                                    <li key={size}><strong>{size}:</strong> {quantity}</li>
                                ))}
                            </ul>
                           
                            <ul>
                            <p><strong>Prices:</strong></p>
                                {Object.entries(flower.prices).map(([size, price]) => (
                                    <li key={size}><strong>{size}:</strong> ${price}</li>
                                ))}
                            </ul></div>
                        <div className='c'>
                            <p><strong>Availability:</strong> {flower.availability}</p>
                            <p><strong>Quantity:</strong> {flower.quantity}</p>
                            <p><strong>Ratings:</strong> {flower.ratings}</p>
                        </div>
                        <p><strong>Description:</strong> {flower.description}</p>

                        <p><strong>Occasion:</strong> {flower.occasion.join(', ')}</p>
                        
                        <p><strong>Care Instructions:</strong> {flower.care_instructions}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlowerModal;
