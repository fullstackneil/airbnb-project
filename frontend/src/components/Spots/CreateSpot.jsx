import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createSpot, getAllSpots, createSpotImage } from "../../store/spotReducer";
import "./CreateSpot.css";
import { useNavigate } from "react-router-dom";

const CreateSpot = () => {
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [imageUrl1, setImageUrl1] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [imageUrl3, setImageUrl3] = useState("");
  const [imageUrl4, setImageUrl4] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const newSpot = useSelector((state) => state.spots.createdSpot);
  // const allSpots = useSelector((state) => state.spots.allSpots);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // let createdSpotId = Object.values(allSpots).length;

  // Validation logic
  useEffect(() => {
    const errors = {};

    if (country.trim() === "") errors.country = "Country is required";
    if (address.trim() === "") errors.address = "Address is required";
    if (city.trim() === "") errors.city = "City is required";
    if (state.trim() === "") errors.state = "State is required";
    if (lat && isNaN(lat)) errors.lat = "Latitude must be a number";
    if (lng && isNaN(lng)) errors.lng = "Longitude must be a number";
    if (description.length < 30) errors.description = "Description must be 30 or more characters";
    if (name.trim() === "") errors.name = "Name is required";
    if (isNaN(price) || price.trim() === "") errors.price = "Price is required and must be a number";
    if (previewImage.trim() === "") errors.previewImage = "Preview image is required";

    setErrors(errors);
  }, [country, address, city, state, lat, lng, description, name, price, previewImage]);


  // Handle image uploads
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitted(true);

    if (Object.keys(errors).length === 0) {
      const spotObj = {
        address,
        city,
        state,
        country,
        name,
        description,
        price: parseFloat(price),
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
      };

      const createdSpot = await dispatch(createSpot(spotObj));

      if (createdSpot) {
        const createdSpotId = createdSpot.id;
        await handleImages(createdSpotId);
        await dispatch(getAllSpots());
        navigate(`/spots/${createdSpotId}`);

        setCountry("");
        setAddress("");
        setCity("");
        setState("");
        setLat("");
        setLng("");
        setDescription("");
        setName("");
        setPrice("");
        setPreviewImage("");
        setImageUrl1("");
        setImageUrl2("");
        setImageUrl3("");
        setImageUrl4("");
      }
    } else {
      alert(`You have errors in the form. Please scroll up to see them.`);
    }
  };

  // Handle image uploads
  const handleImages = async (newSpotId) => {
    const spotImages = [previewImage, imageUrl1, imageUrl2, imageUrl3, imageUrl4].filter(Boolean);

    for (let index = 0; index < spotImages.length; index++) {
      const spotImageObj = {
        url: spotImages[index],
        preview: index === 0,
      };
      dispatch(createSpotImage(newSpotId, spotImageObj));
    }
  };

  const handleLatitudeChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setLat(value);
    }
  };

  const handleLongitudeChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setLng(value);
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPrice(value);
    }
  };

  return (
    <div className="create-spot-container">
      <form className="create-spot-form" onSubmit={handleSubmit}>
        <h1 className="form-header" id="form-title">Create a new Spot</h1>
        <h2 className="title" id="form-subtitle">Where&apos;s your place located?</h2>
        <h3 className="subtitle" id="form-info">
          Guests will only get your exact address once they book a reservation.
        </h3>

        <label className="signup-label">
          Country:
          <input
            className="input-area-spots"
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          {isSubmitted && errors.country && <p className="error-message">{errors.country}</p>}
        </label>

        <label className="signup-label">
          Street Address:
          <input
            className="input-area-spots"
            type="text"
            placeholder="Street Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {isSubmitted && errors.address && <p className="error-message">{errors.address}</p>}
        </label>
        <div className="city-state">
          <div className="city">
            <label className="signup-label">
              City:
              <input
                className="input-area-spots"
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              {isSubmitted && errors.city && <p className="error-message">{errors.city}</p>}
            </label>
          </div>
          <div className="city">
            <label className="signup-label">
              State:
              <input
                className="input-area-spots"
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
              {isSubmitted && errors.state && <p className="error-message">{errors.state}</p>}
            </label>
          </div>
        </div>
        <div className="city-state">
          <div className="city">
            <label className="signup-label">
              Latitude:
              <input
                className="input-area-spots"
                type="number"
                inputMode="numeric"
                placeholder="Latitude (optional)"
                value={lat}
                onChange={handleLatitudeChange}
              />
              {isSubmitted && errors.lat && <p className="error-message">{errors.lat}</p>}
            </label>
          </div>
          <div className="city">
            <label className="signup-label">
              Longitude:
              <input
                className="input-area-spots"
                type="number"
                inputMode="numeric"
                placeholder="Longitude (optional)"
                value={lng}
                onChange={handleLongitudeChange}
              />
              {isSubmitted && errors.lng && <p className="error-message">{errors.lng}</p>}
            </label>
          </div>
        </div>
        <div className="added-text">
          <h2 className="title" id="description-title">Describe your place to your guests</h2>
          <p className="subtitle" id="description-info">
            Mention the best features of your space, any special amenities like fast WiFi or parking, and what you love about the neighborhood.
          </p>
          <textarea
            className="description-input"
            placeholder="Please write at least 30 characters"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {isSubmitted && errors.description && <p className="error-message">{errors.description}</p>}
        </div>
        <div className="added-text">
          <h2 className="title">Create a title for your spot</h2>
          <p className="subtitle">
            Catch guests&apos; attention with a spot title that highlights what makes your place special.
          </p>
          <input
            className="input-area-spots"
            type="text"
            placeholder="Name of your spot"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {isSubmitted && errors.name && <p className="error-message">{errors.name}</p>}
        </div>
        <div className="added-text">
          <h2 className="title">Set a base price for your spot</h2>
          <p className="subtitle">
            Competitive pricing can help your listing stand out and rank higher in search results.
          </p>
          <div className="money-box">
            <span>$  </span>
            <input
              className="input-area-spots"
              type="number"
              inputMode="numberic"
              placeholder="Price per night (USD)"
              value={price}
              onChange={handlePriceChange}
            />
          </div>
          {isSubmitted && errors.price && <p className="error-message">{errors.price}</p>}
        </div>
        <div className="added-text">
          <h2 className="title">Liven up your spot with photos</h2>
          <p className="subtitle">
            Submit a link to at least one photo to publish your spot.
          </p>
          <input
            className="input-area-spots"
            type="text"
            placeholder="Preview Image URL"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
          />
          {isSubmitted && errors.previewImage && <p className="error-message">{errors.previewImage}</p>}
          <input
            className="input-area-spots"
            type="text"
            placeholder="Image URL"
            value={imageUrl1}
            onChange={(e) => setImageUrl1(e.target.value)}
          />
          <input
            className="input-area-spots"
            type="text"
            placeholder="Image URL"
            value={imageUrl2}
            onChange={(e) => setImageUrl2(e.target.value)}
          />
          <input
            className="input-area-spots"
            type="text"
            placeholder="Image URL"
            value={imageUrl3}
            onChange={(e) => setImageUrl3(e.target.value)}
          />
          <input
            className="input-area-spots"
            type="text"
            placeholder="Image URL"
            value={imageUrl4}
            onChange={(e) => setImageUrl4(e.target.value)}
          />
        </div>
        <button className="submit-button">Create Spot</button>
      </form>
    </div>
  );
};

export default CreateSpot;
