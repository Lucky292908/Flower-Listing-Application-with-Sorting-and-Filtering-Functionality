import React, { useState, useEffect } from 'react';
import './FlowerList.css';
import FlowerModal from './FlowerModal';
import axios from 'axios'; // Import Axios
import { Icon } from '@iconify/react';
import favoriteIcon from '@iconify/icons-ic/baseline-favorite';
import heartIcon from '@iconify/icons-ic/baseline-favorite';
// import image from '../image/imag.png'
// import image1 from '../image/imag.png'
// import image2 from '../image/imag.png'
// import image3 from '../image/imag.png'
export interface Flower {
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


const FlowerList: React.FC = () => {
    const [flowers, setFlowers] = useState<Flower[]>([]);
    const [filteredFlowers, setFilteredFlowers] = useState<Flower[]>([]);
    const [selectedFlower, setSelectedFlower] = useState<Flower | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [flowersPerPage] = useState<number>(9); // Number of flowers per page
    const [availabilityFilters, setAvailabilityFilters] = useState<string[]>([]); // State for Availability filters
    const [priceFilters, setPriceFilters] = useState<string[]>([]); // State for Price filters
    const [productTypeFilters, setProductTypeFilters] = useState<string[]>([]); // State for Product Type filters
    const [brandFilters, setBrandFilters] = useState<string[]>([]); // State for Brand filters
    const [colorFilters, setColorFilters] = useState<string[]>([]); // State for Color filters
    const [materialFilters, setMaterialFilters] = useState<string[]>([]); // State for Material filters
    const [sizeFilters, setSizeFilters] = useState<string[]>([]); // State for Size filters
    const [showMaterialDropdown, setShowMaterialDropdown] = useState<boolean>(false);
    const [showSizeDropdown, setShowSizeDropdown] = useState<boolean>(false);
    const [showBrandDropdown, setShowBrandDropdown] = useState<boolean>(false);
    const [showAvailabilityDropdown, setShowAvailabilityDropdown] = useState<boolean>(false);
    const [showPriceDropdown, setShowPriceDropdown] = useState<boolean>(false);

    useEffect(() => {
        fetchFlowers();
    }, []);

    const fetchFlowers = async () => {
        try {
            const response = await axios.get('http://localhost:8089/flowers');
            const data: Flower[] = response.data;
            setFlowers(data);
            setFilteredFlowers(data);
        } catch (error) {
            console.error('Error fetching flower data:', error);
        }
    };

    const openModal = (flower: Flower) => {
        setSelectedFlower(flower);
    };

    const closeModal = () => {
        setSelectedFlower(null);
    };
    // Filtering logic based on selected filters
    useEffect(() => {
        let filteredData = flowers;

        if (availabilityFilters.length > 0) {
            filteredData = filteredData.filter(flower => availabilityFilters.includes(flower.availability));
        }

        if (productTypeFilters.length > 0) {
            filteredData = filteredData.filter(flower => productTypeFilters.includes(flower.product_type));
        }

        if (brandFilters.length > 0) {
            filteredData = filteredData.filter(flower => brandFilters.includes(flower.brand));
        }

        if (colorFilters.length > 0) {
            filteredData = filteredData.filter(flower => flower.colors.some(color => colorFilters.includes(color)));
        }

        if (materialFilters.length > 0) {
            filteredData = filteredData.filter(flower => materialFilters.includes(flower.material));
        }

        if (sizeFilters.length > 0) {
            filteredData = filteredData.filter(flower => Object.keys(flower.sizes).some(size => sizeFilters.includes(size)));
        }

        setFilteredFlowers(filteredData);
    }, [availabilityFilters, priceFilters, productTypeFilters, brandFilters, colorFilters, materialFilters, sizeFilters, flowers]);

    // Handle filter changes
    const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setAvailabilityFilters([...availabilityFilters, value]);
        } else {
            setAvailabilityFilters(availabilityFilters.filter(item => item !== value));
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setPriceFilters([...priceFilters, value]);
        } else {
            setPriceFilters(priceFilters.filter(item => item !== value));
        }
    };



    const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setBrandFilters([...brandFilters, value]);
        } else {
            setBrandFilters(brandFilters.filter(item => item !== value));
        }
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setColorFilters([...colorFilters, value]);
        } else {
            setColorFilters(colorFilters.filter(color => color !== value));
        }
    };

    useEffect(() => {
        let filteredData = flowers;

        if (brandFilters.length > 0) {
            filteredData = filteredData.filter(flower => brandFilters.includes(flower.brand));
        }

        if (colorFilters.length > 0) {
            filteredData = filteredData.filter(flower => flower.colors.some(color => colorFilters.includes(color)));
        }

        setFilteredFlowers(filteredData);
    }, [brandFilters, colorFilters, flowers]);


    const handleMaterialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setMaterialFilters([...materialFilters, value]);
        } else {
            setMaterialFilters(materialFilters.filter(item => item !== value));
        }
    };


    const indexOfLastFlower = currentPage * flowersPerPage;
    const indexOfFirstFlower = indexOfLastFlower - flowersPerPage;
    const currentFlowers = filteredFlowers.slice(indexOfFirstFlower, indexOfLastFlower);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Function to handle dropdown option selection
    const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = e.target.value;

        let sortedFlowers: Flower[] = [];

        // Sort flowers based on selected option
        switch (selectedOption) {
            case 'option1': // A-Z
                sortedFlowers = [...flowers].sort((a, b) => a.flower_name.localeCompare(b.flower_name));
                break;
            case 'option2': // Z-A
                sortedFlowers = [...flowers].sort((a, b) => b.flower_name.localeCompare(a.flower_name));
                break;

            case 'option5': // Sort by rating
                sortedFlowers = [...flowers].sort((a, b) => b.ratings - a.ratings);
                break;


            case 'option3': // Low to high price of size 'm'
                sortedFlowers = [...flowers].sort((a, b) => {
                    const priceA = a.prices['m'] || 0;
                    const priceB = b.prices['m'] || 0;
                    return priceA - priceB;
                });
                break;
            case 'option4': // High to low price of size 'm'
                sortedFlowers = [...flowers].sort((a, b) => {
                    const priceA = a.prices['m'] || 0;
                    const priceB = b.prices['m'] || 0;
                    return priceB - priceA;
                });
                break;
            case 'option6': // Sort by name
                sortedFlowers = [...flowers].sort((a, b) => a.flower_name.localeCompare(b.flower_name));
                break;
            case 'option7': // Sort by quantity
                sortedFlowers = [...flowers].sort((a, b) => b.quantity - a.quantity);
                break;
            default:
                sortedFlowers = flowers;
        }

        // Update filteredFlowers with sorted array
        setFilteredFlowers(sortedFlowers);
    };


    useEffect(() => {
        let filteredData = flowers;

        if (brandFilters.length > 0) {
            filteredData = filteredData.filter(flower => brandFilters.includes(flower.brand));
        }

        if (colorFilters.length > 0) {
            filteredData = filteredData.filter(flower => flower.colors.some(color => colorFilters.includes(color)));
        }

        if (sizeFilters.length > 0) {
            filteredData = filteredData.filter(flower => Object.keys(flower.sizes).some(size => sizeFilters.includes(size)));
        }

        if (priceFilters.length > 0) {
            filteredData = filteredData.filter(flower => Object.values(flower.prices).some(price => priceFilters.includes(price.toString())));
        }

        setFilteredFlowers(filteredData);
    }, [brandFilters, colorFilters, sizeFilters, priceFilters, flowers]);
    const [showColorDropdown, setShowColorDropdown] = useState<boolean>(false); // State to control the visibility of color dropdown

    // Define array of price ranges
    const priceRanges = [
        { value: '0', label: '$0 - $10' },
        { value: '10', label: '$10 - $20' },
        { value: '20', label: '$20 - $30' },
        { value: '30', label: '$30 - $40' },
        { value: '40', label: '$40 - $50' },
        { value: '50', label: '$50 - $60' },
        // Add more price ranges as needed
    ];


    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setSizeFilters([...sizeFilters, value]);
        } else {
            setSizeFilters(sizeFilters.filter(item => item !== value));
        }
        // After updating the size filter, re-filter the flowers based on the selected size
        // You can update the prices of the filtered flowers based on the selected size
        filterFlowersBySize(value);
    };

    // Function to filter flowers based on the selected size
    const filterFlowersBySize = (selectedSize: string) => {
        const filteredData = flowers.map(flower => {
            const updatedPrices = { ...flower.prices }; // Create a copy of prices object
            // Update the prices based on the selected size
            for (const [size, price] of Object.entries(flower.prices)) {
                if (size === selectedSize) {
                    updatedPrices[size] = price; // Keep the same price for the selected size
                } else {
                    updatedPrices[size] = 0; // Set price to 0 for other sizes
                }
            }
            return { ...flower, prices: updatedPrices }; // Return updated flower object
        });
        setFilteredFlowers(filteredData);
    };

    return (

        <div className="grid-container">

            <div className="grid-item column1">

                <div className="availability-filters">
                    <div className="b">
                        <h4 onClick={() => setShowAvailabilityDropdown(!showAvailabilityDropdown)}>Availability {showAvailabilityDropdown ? '▲' : '▼'}</h4>
                        {showAvailabilityDropdown && (
                            <div className="availability-options">
                                <label>
                                    <input type="checkbox" value="Stock" /> In Stock
                                </label>
                                <label>
                                    <input type="checkbox" value="Out of Stock" onChange={handleAvailabilityChange} /> Out of Stock
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                <div className="price-filters">
                    <div className="b">
                        <h4 onClick={() => setShowPriceDropdown(!showPriceDropdown)}>Price {showPriceDropdown ? '▲' : '▼'}</h4>
                        {showPriceDropdown && (
                            <div className="price-options">
                                {priceRanges.map(range => (
                                    <label key={range.value}>
                                        <input type="checkbox" value={range.value} onChange={handlePriceChange} /> {range.label}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>


                <div className="brand-filters">
                    <div className="b">
                        <h4 onClick={() => setShowBrandDropdown(!showBrandDropdown)}>Brand {showBrandDropdown ? '▲' : '▼'}</h4>
                        {showBrandDropdown && (
                            <div className="brand-options">
                                <label>
                                    <input type="checkbox" value="Brothers" onChange={handleBrandChange} /> Brothers
                                </label>
                                <label>
                                    <input type="checkbox" value="Nike" onChange={handleBrandChange} /> Nike
                                </label>
                                <label>
                                    <input type="checkbox" value="Navana" onChange={handleBrandChange} /> Navana
                                </label>
                                <label>
                                    <input type="checkbox" value="Raggery" onChange={handleBrandChange} /> Raggery
                                </label>
                                <label>
                                    <input type="checkbox" value="Hatil" onChange={handleBrandChange} /> Hatil
                                </label>
                                <label>
                                    <input type="checkbox" value="Rokomari" onChange={handleBrandChange} /> Rokomari
                                </label>
                                <label>
                                    <input type="checkbox" value="OTOBI" onChange={handleBrandChange} /> OTOBI
                                </label>
                                <label>
                                    <input type="checkbox" value="Orobi" onChange={handleBrandChange} /> Orobi
                                </label>
                                {/* Add more brands as needed */}
                            </div>
                        )}
                    </div>
                </div>


                <div className="color-filters">
                    <div className="b">
                        <h4 onClick={() => setShowColorDropdown(!showColorDropdown)}>Color {showColorDropdown ? '▲' : '▼'}</h4>
                        {showColorDropdown && (
                            <div className="color-options">
                                <label>
                                    <input type="checkbox" value="Red" onChange={handleColorChange} /> Red
                                </label>
                                <label>
                                    <input type="checkbox" value="Blue" onChange={handleColorChange} /> Blue
                                </label>
                                <label>
                                    <input type="checkbox" value="Yellow" onChange={handleColorChange} /> Yellow
                                </label>
                                {/* Add more colors as needed */}
                            </div>
                        )}
                    </div>
                </div>
                <div className="material-filters">
                    <div className="b">
                        <h4 onClick={() => setShowMaterialDropdown(!showMaterialDropdown)}>Material {showMaterialDropdown ? '▲' : '▼'}</h4>
                        {showMaterialDropdown && (
                            <div className="material-options">
                                <label>
                                    <input type="checkbox" value="Silk" onChange={handleMaterialChange} /> Silk
                                </label>
                                <label>
                                    <input type="checkbox" value="Plastic" onChange={handleMaterialChange} /> Plastic
                                </label>
                                <label>
                                    <input type="checkbox" value="Fabric" onChange={handleMaterialChange} /> Fabric
                                </label>
                                {/* Add more materials as needed */}
                            </div>
                        )}
                    </div>
                </div>


                <div className="size-filters">
                    <div className="b">
                        <h4 onClick={() => setShowSizeDropdown(!showSizeDropdown)}>Size {showSizeDropdown ? '▲' : '▼'}</h4>
                        {showSizeDropdown && (
                            <div className="size-options">
                                <label>

                                    <input type="checkbox" value="xs" onChange={handleSizeChange} /> XS
                                </label>
                                <label>
                                    <input type="checkbox" value="s" onChange={handleSizeChange} /> S
                                </label>
                                <label>
                                    <input type="checkbox" value="m" onChange={handleSizeChange} /> M
                                </label>
                                <label>
                                    <input type="checkbox" value="l" onChange={handleSizeChange} /> L
                                </label>
                                <label>
                                    <input type="checkbox" value="xl" onChange={handleSizeChange} /> XL
                                </label>
                                <label>
                                    <input type="checkbox" value="xxl" onChange={handleSizeChange} /> XXL
                                </label>
                                {/* Add more sizes as needed */}
                            </div>
                        )}
                    </div>
                </div>

            </div>

            <div className="grid-item column2">

                <div className="flower-list">

                    {/* <h1>Flower Listing</h1> */}
                    <div className='i'><img src='https://phuler.myshopify.com/cdn/shop/files/banner-49.jpg?v=1613740094' alt=''></img></div>

                    <div className="h">

                        <h3 className='Sort'>Sort by</h3>
                        <select onChange={handleDropdownChange}>
                            <option value="option8">All</option>
                            <option value="option1">A-Z</option>
                            <option value="option2">Z-A</option>
                            <option value="option3">low to high prise</option>
                            <option value="option4">high to low prize</option>
                            <option value="option5">sort by rating</option>
                            {/* <option value="option6">sort by name</option> */}
                            <option value="option7">sort by Quantity</option>


                        </select>


                    </div>


                    <div className="flowers">
                        {currentFlowers.map(flower => (
                            <div key={flower.id} className="flower" onClick={() => openModal(flower)}>
                                <img src={flower.image} alt={flower.flower_name} />
                                <div className="card">
       
            <div>
                <Icon className="heart-icon" icon={heartIcon} />
                <Icon className="heart-icon" icon={favoriteIcon} />
                <Icon className="heart-icon" icon={favoriteIcon} />
                <Icon className="heart-icon" icon={heartIcon} />
            </div>
        </div>




          

                                    


                                <div className="details">
                                    <h2>{flower.flower_name}</h2>
                                    {/* <p>Product Type: {flower.product_type}</p> */}
                                    {/* <h5 >Brand:{flower.brand}</h5> */}
                                    {/* <p>Colors: {flower.colors.join(', ')}</p>
  <p>Material: {flower.material}</p> */}
                                    {/* <p>Sizes:</p>
  <ul>
    {Object.entries(flower.sizes).map(([size, quantity]) => (
      <li key={size}>{size}: {quantity}</li>
    ))}
  </ul> */}
                                    {/* <p>Description: {flower.description}</p> */}
                                    {/* <p>Prices:</p> */}
                                    <ul>
                                        {/* {Object.entries(flower.prices).map(([size, price]) => (
      <li key={size}>{size}: ${price}</li>
    ))} */}
                                        <p className='v'> ${flower.prices.m}</p>

                                        {sizeFilters.length > 0 && (
                                            <div className="after-filter">
                                                After Filter: ${flower.prices[sizeFilters[0]]} {/* Assuming only one size filter is selected */}
                                            </div>
                                        )}

                                    </ul>
                                    {/* <p>Availability: {flower.availability}</p> */}

                                    {/* <p>Quantity: {flower.quantity}</p> */}
                                    {/* <p>Occasion: {flower.occasion.join(', ')}</p> */}

                                    <div className="rating tooltip">
                                        <span className={flower.ratings >= 4.5 ? "filled high-rating" : "filled"} />
                                        <span className={flower.ratings >= 4.5 ? "filled high-rating" : "filled"} />
                                        <span className={flower.ratings >= 4.5 ? "filled high-rating" : "filled"} />
                                        <span className={flower.ratings >= 4.5 ? "filled high-rating" : "filled"} />
                                        <span className={flower.ratings >= 4.5 ? "filled high-rating" : "filled"} />
                                        <span className="tooltiptext"><p>Ratings: {flower.ratings}</p></span>
                                    </div>


                                    {/* <p>Care Instructions: {flower.care_instructions}</p> */}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <ul className="pagination">
                        {Array.from({ length: Math.ceil(filteredFlowers.length / flowersPerPage) }).map((_, index) => (
                            <li key={index} className={currentPage === index + 1 ? 'active' : ''}>
                                <button onClick={() => paginate(index + 1)}>{index + 1}</button>
                            </li>
                        ))}
                    </ul>

                    {selectedFlower && <FlowerModal flower={selectedFlower} closeModal={closeModal} />}
                </div>
            </div>
        </div>


    );
};

export default FlowerList;



