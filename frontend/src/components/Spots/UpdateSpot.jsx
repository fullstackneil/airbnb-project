import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUpdatedSpot, getSingleSpot } from "../../store/spotReducer";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  COORDINATE_INPUT,
  PRICE_INPUT,
  validateCoordinates,
  validatePrice,
  validateName,
  toCoordinate,
  describeSpotSaveError,
} from "../../utils/spotValidation";
import styles from "./SpotForm.module.css";

const UpdateSpot = () => {
  const spot = useSelector((state) => state.spots.currentSpot);
  const sessionUser = useSelector((state) => state.session.user);
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
  const [notFound, setNotFound] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    dispatch(getSingleSpot(spotId))
      .then((spot) => {
        setFormData({
          country: spot.country || "",
          address: spot.address || "",
          city: spot.city || "",
          state: spot.state || "",
          // ?? keeps a real coordinate of 0 instead of blanking it
          lat: spot.lat ?? "",
          lng: spot.lng ?? "",
          description: spot.description || "",
          name: spot.name || "",
          price: spot.price ?? ""
        });
        setIsLoaded(true);
      })
      .catch(() => setNotFound(true));
  }, [dispatch, spotId]);

  const validateFields = useCallback(() => {
    const errors = {};
    const { country, address, city, state, lat, lng, description, name, price } = formData;

    if (!country) errors.country = "Country is required";
    if (!address) errors.address = "Address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    Object.assign(errors, validateCoordinates(lat, lng));
    if (!description || description.length < 30) errors.description = "Description must be 30 or more characters";
    Object.assign(errors, validateName(name));
    Object.assign(errors, validatePrice(price));

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
    if (COORDINATE_INPUT.test(value)) {
      setFormData({ ...formData, lat: value });
    }
  };

  const handleLongitudeChange = (e) => {
    const value = e.target.value;
    if (COORDINATE_INPUT.test(value)) {
      setFormData({ ...formData, lng: value });
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (PRICE_INPUT.test(value)) {
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
        lat: toCoordinate(formData.lat),
        lng: toCoordinate(formData.lng),
        price: parseFloat(formData.price)
      };

      setSubmitError("");
      try {
        await dispatch(createUpdatedSpot(spot.id, spotObj));
        navigate(`/spots/${spot.id}`);
      } catch (res) {
        setSubmitError(await describeSpotSaveError(res, "update"));
      }
    }
  };

  if (!sessionUser) return <Navigate to="/" replace />;

  if (notFound) {
    return (
      <p className="status-message">
        We couldn&apos;t find that spot. <Link to="/spots/myspots">Back to Manage Spots</Link>
      </p>
    );
  }

  // Only the owner may edit; the server enforces this too.
  if (isLoaded && spot.ownerId !== sessionUser.id) {
    return <Navigate to={`/spots/${spotId}`} replace />;
  }

  return (
    <div className={styles.container}>
      {isLoaded ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1 className={styles.formTitle}>Update Your Spot</h1>
          <h2 className={styles.title} id="form-subtitle">Where&apos;s your place located?</h2>
          <h3 className={styles.subtitle} id="form-info">
            Guests will only get your exact address once they book a reservation.
          </h3>

          <label className={styles.label}>
            Country:
            <input
              className={styles.input}
              type="text"
              id="country"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleInputChange}
            />
            {showValidations && validations.country && <p className={styles.errorMessage}>{validations.country}</p>}
          </label>

          <label className={styles.label}>
            Street Address:
            <input
              className={styles.input}
              type="text"
              id="street-address"
              name="address"
              placeholder="Street Address"
              value={formData.address}
              onChange={handleInputChange}
            />
            {showValidations && validations.address && <p className={styles.errorMessage}>{validations.address}</p>}
          </label>

          <div>
            <div>
              <label className={styles.label}>
                City:
                <input
                  className={styles.input}
                  type="text"
                  id="city"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                {showValidations && validations.city && <p className={styles.errorMessage}>{validations.city}</p>}
              </label>
            </div>
            <div>
              <label className={styles.label}>
                State:
                <input
                  className={styles.input}
                  type="text"
                  id="state"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                />
                {showValidations && validations.state && <p className={styles.errorMessage}>{validations.state}</p>}
              </label>
            </div>
          </div>

          <div>
            <div>
              <label className={styles.label}>
                Latitude:
                <input
                  className={styles.input}
                  type="text"
                  inputMode="decimal"
                  id="lat"
                  name="lat"
                  placeholder="Latitude (optional)"
                  value={formData.lat}
                  onChange={handleLatitudeChange}
                />
                {showValidations && validations.lat && <p className={styles.errorMessage}>{validations.lat}</p>}
              </label>
            </div>
            <div>
              <label className={styles.label}>
                Longitude:
                <input
                  className={styles.input}
                  type="text"
                  inputMode="decimal"
                  id="lng"
                  name="lng"
                  placeholder="Longitude (optional)"
                  value={formData.lng}
                  onChange={handleLongitudeChange}
                />
                {showValidations && validations.lng && <p className={styles.errorMessage}>{validations.lng}</p>}
              </label>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.title} id="description-title">Describe your place to your guests</h2>
            <p className={styles.subtitle} id="description-info">
              Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood
            </p>
            <label className={styles.label}>
              Description:
              <textarea
                className={styles.textArea}
                id="description"
                name="description"
                placeholder="Please write at least 30 characters"
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
              {showValidations && validations.description && <p className={styles.errorMessage}>{validations.description}</p>}
            </label>
          </div>

          <div className={styles.section}>
            <h2 className={styles.title} id="spot-title">Create a title for your spot</h2>
            <p className={styles.subtitle} id="title-info">
              Catch guests&apos; attention with a spot title that highlights what makes your place special.
            </p>
            <label className={styles.label}>
              Name of Spot:
              <input
                className={styles.input}
                type="text"
                id="name-of-spot"
                name="name"
                placeholder="Name your spot"
                value={formData.name}
                onChange={handleInputChange}
              />
              {showValidations && validations.name && <p className={styles.errorMessage}>{validations.name}</p>}
            </label>
          </div>

          <div className={styles.section}>
            <h2 className={styles.title} id="price-title">Set a price for your spot</h2>
            <p className={styles.subtitle} id="price-info">
              Competitive pricing can help your listing stand out and rank higher in search results
            </p>
            <label className={styles.label}>
              <div className={styles.moneyBox}>
                <span>$  </span>
                <input
                  className={`${styles.input} ${styles.priceInput}`}
                  type="text"
                  inputMode="decimal"
                  id="price-box"
                  aria-label="Price per night in US dollars"
                  placeholder="Price per night (USD)"
                  value={formData.price}
                  onChange={handlePriceChange}
                />
              </div>
              {showValidations && validations.price && <p className={styles.errorMessage}>{validations.price}</p>}
            </label>
          </div>

          {submitError && <p className={styles.errorMessage} role="alert">{submitError}</p>}
          <button className={styles.updateButton} type="submit">
            Update Your Spot
          </button>
        </form>
      ) : (
        <p className="status-message" role="status">Loading spot…</p>
      )}
    </div>
  );
};

export default UpdateSpot;
