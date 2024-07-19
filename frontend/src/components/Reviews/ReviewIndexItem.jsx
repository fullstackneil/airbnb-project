import DeleteReview from "./DeleteReview";
import OpenModalButton from "../OpenModalButton";
import './ReviewIndexItem.css'

const ReviewIndexItem = ({ review, spot, user }) => {
  return (
    <>
      {review.spotId == spot.id ? (
        <>
          <h2>{review.User.firstName}</h2>
          <p>{review.createdAt.split("T")[0]}</p>
          <p>{review.review}</p>
          {user === null ? (
            <></>
          ) : user.id === review.userId ? (
            <OpenModalButton
              id='delete-button'
              buttonText="Delete"
              modalComponent={<DeleteReview review={review} />}
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ReviewIndexItem;
