import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import ShowImage from './ShowImage';
import moment from 'moment';
import { addItem, updateItem, removeItem } from './cartHelpers';


const Card = ({product,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false
})=>{


  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

    const showViewButton = showViewProductButton => {
        return (
          showViewProductButton && (
            <Link to={`/product/${product._id}`} className="mr-2">
              <button className="btn btn-outline-primary mt-2 mb-2 card-btn-1">View Product</button>
             </Link>
          )
        );
      };


      const addToCart = () => {
        // console.log('added');
        addItem(product, setRedirect(true));
      };
    
      const shouldRedirect = redirect => {
        if (redirect) {
          return <Redirect to="/cart" />;
        }
      };
      const showAddToCart = showAddToCartButton => {
        return (
          showAddToCartButton && (
            <button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2 card-btn-1  ">
              Add to cart
            </button>
          )
        );
      };

      const showStock = quantity => {
        return quantity > 0 ? (
          <span className="badge badge-primary badge-pill">In Stock </span>
        ) : (
          <span className="badge badge-primary badge-pill">Out of Stock </span>
        );
      };
      
      const handleChange = productId => event => {
        setCount(event.target.value < 1 ? 1 : event.target.value);
        if (event.target.value >= 1) {
          updateItem(productId, event.target.value);
        }
      };
    

      const showCartUpdateOptions = cartUpdate => {
        return (
          cartUpdate && (
            <div>
               <div className="input-group mb-3">
                 <div className="input-group-prepend">
                   <span className="input-group-text">Adjust Quantity</span>
                 </div>
                 <input type="number" className="form-control" value={count} onChange={handleChange(product._id)} />
               </div>
             </div>
          )
        );
      };

      const showRemoveButton = showRemoveProductButton => {
        return (
          showRemoveProductButton && (
            <button
              onClick={() => {
                removeItem(product._id);
              }}
              className="btn btn-outline-danger mt-2 mb-2"
            >
              Remove Product
            </button>
          )
        );
      };

    return (
        // <div className="col-4 mb-3 ">
            <div className="card">
            <div className="card-body">
            {shouldRedirect(redirect)}
                <ShowImage item={product} url="product"/>
              <strong>{product.name}  </strong>
              {showStock(product.quantity)}
              <p>by {product.description.substring(0, 100)}</p>
              <strong>$ {product.price}</strong>
              
              <p className="black-9">
                  Category: {product.category && product.category.name}
              </p>
              <p className="black-8">
                 Added on {moment(product.createdAt).fromNow()}
              </p>

              
              <br/>
             {showViewButton(showViewProductButton)}


            
               {showAddToCart(showAddToCartButton)}


                   {showRemoveButton(showRemoveProductButton)}
               {showCartUpdateOptions(cartUpdate)}
            
            
          </div>
        </div>
        // </div>
      );
}

export default Card;
