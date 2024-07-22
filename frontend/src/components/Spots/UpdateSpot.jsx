import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUpdatedSpot, getSingleSpot } from "../../store/spotReducer";
import { useNavigate, useParams } from "react-router-dom";
import './UpdateSpot.css';

const UpdateSpot = () => {
  const spot = useSelector((state) => state.spots.currentSpot);
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    country: "",
    address: "",
    city: "",
    state: "",
    lat: "",
    lng: "",
    description: "",
    name: "",
    price: ""
  });

  const [validations, setValidations] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [showValidations, setShowValidations] = useState(false);

  useEffect(() => {
    dispatch(getSingleSpot(spotId)).then((spot) => {
      setFormData({
        country: spot.country || "",
        address: spot.address || "",
        city: spot.city || "",
        state: spot.state || "",
        lat: spot.lat || "",
        lng: spot.lng || "",
        description: spot.description || "",
        name: spot.name || "",
        price: spot.price || ""
      });
      setIsLoaded(true);
    });
  }, [dispatch, spotId]);

  const validateFields = useCallback(() => {
    const errors = {};
    const { country, address, city, state, lat, lng, description, name, price } = formData;

    if (!country) errors.country = "Country is required";
    if (!address) errors.address = "Address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!lat || isNaN(lat)) errors.lat = "Latitude is required and must be a number";
    if (!lng || isNaN(lng)) errors.lng = "Longitude is required and must be a number";
    if (!description || description.length < 30) errors.description = "Description must be 30 or more characters";
    if (!name) errors.name = "Name is required";
    if (!price || isNaN(price)) errors.price = "Price is required and must be a number";

    return errors;
  }, [formData]);

  useEffect(() => {
    if (showValidations) {
      setValidations(validateFields());
    }
  }, [formData, showValidations, validateFields]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLatitudeChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setFormData({ ...formData, lat: value });
    }
  };

  const handleLongitudeChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setFormData({ ...formData, lng: value });
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setFormData({ ...formData, price: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateFields();
    setValidations(errors);
    setShowValidations(true);

    if (Object.keys(errors).length === 0) {
      const spotObj = {
        ...formData,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        price: parseFloat(formData.price)
      };

      try {
        await dispatch(createUpdatedSpot(spot.id, spotObj));
        navigate(`/spots/${spot.id}`);
      } catch (err) {
        console.error("Error updating spot:", err);
      }
    }
  };

  return (
    <div className="create-spot-container">
      {isLoaded ? (
        <form className="create-spot-form" onSubmit={handleSubmit}>
          <h1 className="form-header" id="form-title">Update Your Spot</h1>
          <h2 className="title" id="form-subtitle">Where&apos;s your place located?</h2>
          <h3 className="subtitle" id="form-info">
            Guests will only get your exact address once they book a reservation.
          </h3>

          <label className="signup-label">
            Country:
            <input
              className="input-area-spots"
              type="text"
              id="country"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleInputChange}
            />
            {showValidations && validations.country && <p className="error-message">{validations.country}</p>}
          </label>

          <label className="signup-label">
            Street Address:
            <input
              className="input-area-spots"
              type="text"
              id="street-address"
              name="address"
              placeholder="Street Address"
              value={formData.address}
              onChange={handleInputChange}
            />
            {showValidations && validations.address && <p className="error-message">{validations.address}</p>}
          </label>

          <div className="city-state">
            <div className="city">
              <label className="signup-label">
                City:
                <input
                  className="input-area-spots"
                  type="text"
                  id="city"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                {showValidations && validations.city && <p className="error-message">{validations.city}</p>}
              </label>
            </div>
            <div className="city">
              <label className="signup-label">
                State:
                <input
                  className="input-area-spots"
                  type="text"
                  id="state"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                />
                {showValidations && validations.state && <p className="error-message">{validations.state}</p>}
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
                  id="lat"
                  name="lat"
                  placeholder="Latitude (optional)"
                  value={formData.lat}
                  onChange={handleLatitudeChange}
                />
                {showValidations && validations.lat && <p className="error-message">{validations.lat}</p>}
              </label>
            </div>
            <div className="city">
              <label className="signup-label">
                Longitude:
                <input
                  className="input-area-spots"
                  type="number"
                  inputMode="numeric"
                  id="lng"
                  name="lng"
                  placeholder="Longitude (optional)"
                  value={formData.lng}
                  onChange={handleLongitudeChange}
                />
                {showValidations && validations.lng && <p className="error-message">{validations.lng}</p>}
              </label>
            </div>
          </div>

          <div className="added-text">
            <h2 className="title" id="description-title">Describe your place to your guests</h2>
            <p className="subtitle" id="description-info">
              Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood
            </p>
            <label className="signup-label">
              Description:
              <textarea
                className="input-text-area"
                id="description"
                name="description"
                placeholder="Please write at least 30 characters"
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
              {showValidations && validations.description && <p className="error-message">{validations.description}</p>}
            </label>
          </div>

          <div className="added-text">
            <h2 className="title" id="spot-title">Create a title for your spot</h2>
            <p className="subtitle" id="title-info">
              Catch guests&apos; attention with a spot title that highlights what makes your place special.
            </p>
            <label className="signup-label">
              Name of Spot:
              <input
                className="input-area-spots"
                type="text"
                id="name-of-spot"
                name="name"
                placeholder="Name your spot"
                value={formData.name}
                onChange={handleInputChange}
              />
              {showValidations && validations.name && <p className="error-message">{validations.name}</p>}
            </label>
          </div>

          <div className="added-text">
            <h2 className="title" id="price-title">Set a price for your spot</h2>
            <p className="subtitle" id="price-info">
              Competitive pricing can help your listing stand out and rank higher in search results
            </p>
            <label className="signup-label">
              <div className="money-box">
                <span className="currency-sign">$  </span>
                <input
                  className="input-area-spots"
                  type="number"
                  inputMode="numeric"
                  id="price-box"
                  placeholder="Price per night (USD)"
                  value={formData.price}
                  onChange={handlePriceChange}
                />
              </div>
              {showValidations && validations.price && <p className="error-message">{validations.price}</p>}
            </label>
          </div>

          <button className="spot-button" type="submit">
            Update Your Spot
          </button>
        </form>
      ) : (
        <>Loading</>
      )}
    </div>
  );
};

export default UpdateSpot;
