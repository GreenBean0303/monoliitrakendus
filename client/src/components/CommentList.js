import React from "react";

const CommentList = ({ comments }) => {
  console.log("Kommentaarid komponendis:", comments); // ⭐ DEBUG

  if (!comments || comments.length === 0) {
    return <p className="text-muted">Kommentaare pole veel lisatud</p>;
  }

  const renderedComments = comments.map((comment) => {
    let content;
    let style = {};

    if (comment.status === "approved") {
      content = comment.content;
      style = { color: "green" };
    } else if (comment.status === "pending") {
      content = "Oota...";
      style = { color: "orange" };
    } else if (comment.status === "rejected") {
      content = " Tagasi lükatud kommentaar ";
      style = { color: "red" };
    }

    return (
      <li key={comment.id} style={style}>
        <strong>{content}</strong>
        <small className="text-muted"> - {comment.author}</small>
      </li>
    );
  });

  return (
    <div className="comments-section">
      <ul>{renderedComments}</ul>
    </div>
  );
};

export default CommentList;
