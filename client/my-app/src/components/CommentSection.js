import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../StoreContext";
import { toast } from "react-toastify";
import "./CommentSection.css";

const CommentSection = ({ reviewId }) => {
	const { token, user } = useContext(StoreContext);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [formVisible, setFormVisible] = useState(false);
	const [editingCommentId, setEditingCommentId] = useState(null);
	const [editContent, setEditContent] = useState("");

	useEffect(() => {
		const fetchComments = async () => {
			try {
				const res = await axios.get(`http://localhost:2000/review/${reviewId}/comments`);
				setComments(res.data.comments);
			} catch (err) {
				console.error("Failed to fetch comments", err);
			}
		};
		fetchComments();
	}, [reviewId]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!newComment.trim()) return;
		try {
			const res = await axios.post(
				`http://localhost:2000/review/${reviewId}/comments`,
				{ content: newComment },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setComments((prev) => [...prev, res.data.comment]);
			toast.success("Comment posted successfully.");
			setNewComment("");
			setFormVisible(false);
		} catch (err) {
			console.error("Failed to post comment", err);
			toast.error("Failed to post comment.");
		}
	};

	const handleAddCommentClick = () => {
		if (token) {
			setFormVisible(true);
		} else {
			toast.error("Please log in to add a comment.");
		}
	};

	const handleDelete = async (commentId) => {
		try {
			await axios.delete(`http://localhost:2000/review/${reviewId}/comments/${commentId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setComments(comments.filter((c) => c._id !== commentId));
			toast.success("Comment deleted successfully.");
		} catch (err) {
			console.error("Failed to delete comment", err);
			toast.error("Failed to delete comment.");
		}
	};

	const handleEdit = (commentId, content) => {
		setEditingCommentId(commentId);
		setEditContent(content);
	};

	const handleSaveEdit = async (commentId) => {
		try {
			const res = await axios.put(
				`http://localhost:2000/review/${reviewId}/comments/${commentId}`,
				{ content: editContent },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setComments(
				comments.map((c) =>
					c._id === commentId ? { ...c, content: res.data.comment.content } : c
				)
			);
			toast.success("Comment updated successfully.");
			setEditingCommentId(null);
		} catch (err) {
			console.error("Failed to update comment", err);
			toast.error("Failed to update comment.");
		}
	};

	return (
		<div className="comment-section">
			<h3>Comments</h3>
			{comments.length === 0 && <p>No comments yet.</p>}

			<ol className="comment-list">
				{comments.map((c) => (
					<li key={c._id}>
						<div className="comment-content">
							<div className="author">
								@{c.username || "User"}
							</div>
							{editingCommentId === c._id ? (
								<>
									<textarea
										value={editContent}
										onChange={(e) => setEditContent(e.target.value)}
									></textarea>
									<button onClick={() => handleSaveEdit(c._id)}>Save</button>
								</>
							) : (
								<div className="text">{c.content}</div>
							)}
							{user?.id === c.userId && (
								<div className="comment-actions">
									<button onClick={() => handleEdit(c._id, c.content)}>Edit</button>
									<button onClick={() => handleDelete(c._id)}>Delete</button>
								</div>
							)}
						</div>
					</li>
				))}
			</ol>

			<button className="comment-toggle-btn" onClick={handleAddCommentClick}>
				💬 Add Comment
			</button>

			{formVisible && (
				<form onSubmit={handleSubmit} className="comment-form">
					<textarea
						placeholder="Write a comment..."
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
					></textarea>
					<button type="submit">Post Comment</button>
				</form>
			)}
		</div>
	);
};

export default CommentSection;
