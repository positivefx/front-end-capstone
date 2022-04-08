/* eslint-disable import/no-unresolved */
/* eslint-disable no-return-assign */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import _ from 'underscore';
import './style.css';
import { aveRating } from 'Utilities';
import Related from './RelatedProducts/Related';
import YourOutfit from './YourOutfit/YourOutfit';
import ProductContext from '../Context';

function RelatedItems() {
  const { productId, yourOutfit, setYourOutfit, setJoinedAPIDetails } =
    useContext(ProductContext);

  const [relatedItems, setRelatedItems] = useState([]);
  const [relatedItemsImg, setRelatedItemsImg] = useState([]);
  const [relatedItemsDetails, setRelatedItemsDetails] = useState([]);
  const [yourOutfitId, setYourOutfitId] = useState();
  const [relatedReviews, setRelatedReviews] = useState();

  useEffect(() => {
    axios
      .get(`/products/${productId}/related`)
      .then((res) => setRelatedItems(res.data))
      .catch((err) => console.error(err));
  }, [productId]);

  useEffect(() => {
    Promise.all(
      relatedItems.map((product) =>
        axios
          .get(`/products/${product}/styles`)
          .then((response) => response.data)
          .catch((err) => console.error(err))
      )
    )
      .then((response) => setRelatedItemsImg(response))
      .catch((err) => console.error(err));

    Promise.all(
      relatedItems.map((product) =>
        axios
          .get(`/products/${product}`)
          .then((response) => response.data)
          .catch((err) => console.error(err))
      )
    ).then((res) => setRelatedItemsDetails(res));

    Promise.all(
      relatedItems.map((product) =>
        axios
          .get(`/reviews/?product_id=${product}`)
          .then((response) => response.data)
          .catch((err) => console.error(err))
      )
    ).then((res) => setRelatedReviews(res));
  }, [relatedItems]);

  useEffect(() => {
    const aveRatingArray = _.map(relatedReviews, (product) => (
      { aveRating: aveRating(product.results) }));

    const accArr = _.map(relatedItems, (ea, index) =>
      _.extend(
        {},
        relatedItemsImg[index],
        relatedItemsDetails[index],
        aveRatingArray[index],
      )
    );
    setJoinedAPIDetails(accArr);
  }, [relatedReviews]);

  useEffect(() => {
    if (yourOutfitId) {
      const getYOImages = axios.get(`/products/${yourOutfitId}/styles`);
      const getYODetails = axios.get(`/products/${yourOutfitId}`);
      const getYOReviews = axios.get(`/reviews/?product_id=${yourOutfitId}`)
      axios
        .all([getYOImages, getYODetails, getYOReviews])
        .then((response) => {
          const ratingsArray = response[2].data.results;
          setYourOutfit([
            ...yourOutfit,
            { ...response[0].data, ...response[1].data, ...{ aveRating: aveRating(ratingsArray) } },
          ]);
        })
        .catch((err) => console.log(err));
    }
  }, [yourOutfitId]);

  return (
    <div className="ri-parent">
      <div className="ri-relateditems">
        <h3>Related Items</h3>
        <Related />
      </div>
      <div className="ri-youroutfit">
        <h3>Your Outfit</h3>
        <YourOutfit setYourOutfitId={setYourOutfitId} />
      </div>
    </div>
  );
}

export default RelatedItems;



// const aveRating = _.map(relatedReviews, (product) => ({
//   aveRating:
//     _.reduce(product.results, (sum, num) => (sum + num.rating), 0) /
//     product.results.length,
// }));