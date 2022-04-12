/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import React, {
  useState,
  useEffect,
  // useContext
} from 'react';
// import Select from 'react-select';
import _ from 'underscore';
import PropTypes from 'prop-types';

function AddToCart(props) {
  const {
    styles, count, resultCount, setResultCount, styleSelector
  } = props;

  const [quantityOptions, setQuantityOptions] = useState([]);
  const [sizeSelection, setSizeSelection] = useState(null);
  const [quantity, setQuantity] = useState(16);
  const handleSizeChange = (e) => {
    const sku = e.target.value;

    setSizeSelection(sku);
  };

  useEffect(() => {
    if (!styles || !styles[styleSelector]) {
      return;
    }

    const quantity = styles[styleSelector].skus[sizeSelection] && Math.min(styles[styleSelector].skus[sizeSelection].quantity, 15);
    setQuantityOptions(
      _.range(quantity + 1).map((amount) => (
        <option key={amount} value={amount}>{amount}</option>
      ))
    );
  }, [sizeSelection]);
let buttonNoButton;
let alertMe;
 if(sizeSelection !== null && quantity > 0){
 buttonNoButton = <button className="ov-checkout-button" type="button">
  ADD TO CART  &emsp; &emsp; &emsp; &emsp; &ensp; ➕
</button>
 } else if(quantity === 0){
   buttonNoButton = <h4>Out of Stock</h4>
 } else if (sizeSelection === null && quantity === 16){
   buttonNoButton =  <button className="ov-checkout-button" type="button" onClick={() => alertMe = "Please select a size and quantity"}>
   ADD TO CART  &emsp; &emsp; &emsp; &emsp; &ensp; ➕
 </button>
 } else {
   buttonNoButton = <button className="ov-checkout-button" type="button" onClick={() => alertMe = "added to cart"}>
   ADD TO CART  &emsp; &emsp; &emsp; &emsp; &ensp; ➕
 </button>
 }
  return (
    <>
      <span>
        <select className="ov-style-sizes" onChange={(e) => handleSizeChange(e)}><option>Pick a size</option>
          {styles && styles[count] && Object.entries(styles[styleSelector].skus).map(([sku, { quantity, size }]) => (<option default="Pick a size" key={sku} value={sku}>{size}</option>))}
        </select>
        {' '}
        <select className="ov-style-qty" onChange={(e) => setQuantity(e.target.value)}>
          {quantityOptions}
        </select>
      </span>
      <br />
      <br />
{alertMe}
  {buttonNoButton}
    </>
  );
}

AddToCart.propTypes = {
  styles: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.array,
  ]),
};

AddToCart.defaultProps = {
  styles: [],
};

export default AddToCart;
