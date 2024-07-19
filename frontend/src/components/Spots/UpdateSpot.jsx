import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUpdatedSpot } from "../../store/spotReducer";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleSpot } from "../../store/spotReducer";

const UpdateSpot = () => {
    const spot = useSelector((state) => state.spots.currentSpot);
    const { spotId } = useParams();

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getSingleSpot(spotId))
      .then((spot) => {
        setCountry(spot.country);
        setAddress(spot.address);
        setCity(spot.city);
        setState(spot.state);
        setLat(spot.lat);
        setLng(spot.lng);
        setDescription(spot.description);
        setName(spot.name);
        setPrice(spot.price);
      })
      .then(() => setIsLoaded(true));
  }, [dispatch, spotId]);


  useEffect(() => {
    const errors = {};

    if (country.length < 1) {
      errors.country = "Country is required";
    }

    if (address.length < 1) {
      errors.address = "Address is required";
    }
    if (city.length < 1) {
      errors.city = "City is required";
    }
    if (state.length < 1) {
      errors.state = "State is required";
    }
    if (isNaN(lat) || lat === "") {
      errors.lat = "Latitude is required and must be a number";
    }
    if (isNaN(lng) || lng === "") {
      errors.lng = "Longitude is required and must be a number";
    }
    if (description.length < 1) {
      errors.description = "Description must be 30 or more characters";
    }
    if (name.length < 1) {
      errors.name = "Name is required";
    }
    if (isNaN(price) || price === "") {
      errors.price = "Price is required and must be a number";
    }

    setErrors(errors);
  }, [
    country,
    address,
    city,
    state,
    lat,
    lng,
    description,
    name,
    price,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).length < 1) {
      const spotObj = {
        address,
        city,
        state,
        country,
        lat: parseInt(lat),
        lng: parseInt(lng),
        name,
        description,
        price: parseInt(price),
      };

      try {
        dispatch(createUpdatedSpot(spot.id, spotObj)).then(() =>
          navigate(`/spots/${spot.id}`)
        );

        setCountry("");
        setAddress("");
        setCity("");
        setState("");
        setLat("");
        setLng("");
        setDescription("");
        setName("");
        setPrice("");
      } catch {
        // console.log("Uncaught in promise");
      }
    } else {
      alert(
        "Please fix your errors before updating a spot. Address must be unique"
      );
    }
  };
  return (
    <div className="create-spot-container">
      {isLoaded ? (
        <form className="create-spot-form" onSubmit={handleSubmit}>
          <h1 className="form-header" id="form-title">Update Your Spot</h1>
          <h2 className="title" id="form-subtitle">Where&apos;s your place located?</h2>
          <h3 className="subtitle" id="form-info">
            Guests will only get your exact address once they book a
            reservation.
          </h3>

          <label className="signup-label">
            Country:
            <input
              className="input-area-spots"
              type="text"
              id="country"
              name="country"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            {/* {Object.keys(errors).length >= 1 ? (
                <p className="error-message">{errors.country}</p>
              ) : (
                <></>
              )
            ) : (
              <></>
            )} */}
          </label>

          <label className="signup-label">
            Street Address:
            <input
              className="input-area-spots"
              type="text"
              id="street-address"
              name="street-address"
              placeholder="Street Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {Object.keys(errors).length >= 1 ? (
                <p className="error-message">{errors.address}</p>
              ) : (
                <></>
              )}
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
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                { Object.keys(errors).length >= 1 ? (
                    <p className="error-message">{errors.city}</p>
                  ) : (
                    <></>
                  )}
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
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
                {Object.keys(errors).length >= 1 ? (
                    <p className="error-message">{errors.state}</p>
                  ) : (
                    <></>
                  )}
              </label>
            </div>
          </div>
          <div className="city-state">
            <div className="city">
              <label className="signup-label">
                Latitude:
                <input
                  className="input-area-spots"
                  type="text"
                  id="lat"
                  name="lat"
                  placeholder="Lat"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                />
                {Object.keys(errors).length >= 1 ? (
                    <p className="error-message">{errors.lat}</p>
                  ) : (
                    <></>
                  )}
              </label>
            </div>
            <div className="city">
              <label className="signup-label">
                Longitude:
                <input
                  className="input-area-spots"
                  type="text"
                  id="lng"
                  name="lng"
                  placeholder="Lng"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                />
                {Object.keys(errors).length >= 1 ? (
                    <p className="error-message">{errors.lng}</p>
                  ) : (
                    <></>
                  )}
              </label>
            </div>
          </div>
          <div className="added-text">
            <h2 className="title" id="description-title">
              Describe your place to your guests
            </h2>
            <p className="subtitle" id="description-info">
              Mention the best features of your space, any special amenities
              like fast wifi or parking, and what you love about the
              neighborhood
            </p>
            <label className="signup-label">
              Description:
              <textarea
                className="input-text-area"
                id="description"
                name="description"
                placeholder="Please write at least 30 characters"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              {Object.keys(errors).length >= 1 ? (
                  <p className="error-message">{errors.description}</p>
                ) : (
                  <></>
                )}
            </label>
          </div>
          <div className="added-text">
            <h2 className="title" id="spot-title">Create a title for your spot</h2>
            <p className="subtitle" id="title-info">
              Catch guests&apos; attention with a spot title that highlights
              what makes your place special.
            </p>
            <label className="signup-label">
              Name of Spot:
              <input
                className="input-area-spots"
                type="text"
                id="name-of-spot"
                name="name-of-spot"
                placeholder="Name your spot"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {Object.keys(errors).length >= 1 ? (
                  <p className="error-message">{errors.name}</p>
                ) : (
                  <></>
                )}
            </label>
          </div>
          <div className="added-text">
            <h2 className="title" id="price-title">Set a price for your spot</h2>
            <p className="subtitle" id="price-info">
              Competitive pricing can help your listing stand out and rank
              higher in search results
            </p>
            <label className="signup-label">
              <input
                className="input-area-spots"
                type="text"
                id="price"
                name="price"
                placeholder="Price per night($USD)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {Object.keys(errors).length >= 1 ? (
                  <p className="error-message">{errors.price}</p>
                ) : (
                  <></>
                )}
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
