import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App.jsx";
import { get, post } from "../../utilities";
import "./Forest.css";
import Navbar from "../modules/Navbar";
import forestBackground from "../../assets/forestBackground.png";
import { useNavigate } from "react-router-dom";
import MusicButton from "../modules/MusicButton";

const Forest = () => {
  const [trees, setTrees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { userId } = useContext(UserContext);
  const [friendRequestStatus, setFriendRequestStatus] = useState({});
  const [friendData, setFriendData] = useState({
    friends: [],
    pendingRequests: [],
    incomingRequests: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchTrees = async (query = "") => {
    try {
      const response = await get("/api/trees", { search: query });

      if (response) {
        setTrees(response);
      }
    } catch (err) {
      console.error("Failed to fetch trees:", err);
      setTrees([]);
    }
  };

  const fetchFriendData = async () => {
    try {
      const response = await get("/api/friend-status");
      setFriendData(response);
    } catch (err) {
      console.error("Failed to fetch friend data:", err);
    }
  };

  const getFriendshipStatus = (treeOwnerId) => {
    // Check if they are already friends
    if (friendData.friends.some((friend) => friend._id === treeOwnerId)) {
      return { text: "Friend", disabled: true };
    }
    // Check if there's a pending request sent by the current user
    if (friendData.pendingRequests.some((request) => request._id === treeOwnerId)) {
      return { text: "Request Sent", disabled: true };
    }
    // Check if there's an incoming request from this user
    if (friendData.incomingRequests.some((request) => request._id === treeOwnerId)) {
      return { text: "Accept Request", disabled: false, isIncoming: true };
    }
    // Default state - not friends
    return { text: "Add Friend", disabled: false };
  };

  useEffect(() => {
    const initializeTrees = async () => {
      await fetchTrees();
      await fetchFriendData();
    };
    initializeTrees();
  }, []);

  const handleSearch = async () => {
    await fetchTrees(searchQuery);
  };

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleSearch();
    }
  };

  const handleFriendRequest = async (friendId) => {
    try {
      // If it's an incoming request, accept it instead of sending a new request
      const status = getFriendshipStatus(friendId);
      if (status.isIncoming) {
        await handleAcceptFriend(friendId);
      } else {
        await post("/api/friend-request", { friendId });
      }
      await fetchFriendData();
      setFriendRequestStatus((prev) => ({
        ...prev,
        [friendId]: "sent",
      }));
    } catch (err) {
      console.error("Failed to send friend request:", err);
      if (err.response?.data?.error) {
        setFriendRequestStatus((prev) => ({
          ...prev,
          [friendId]: err.response.data.error,
        }));
      }
    }
  };

  const handleAcceptFriend = async (friendId) => {
    try {
      await post("/api/accept-friend", { friendId });
      await fetchFriendData();
    } catch (err) {
      console.error("Failed to accept friend request:", err);
    }
  };

  const FriendStatusModal = () => {
    if (!isModalOpen) return null;

    const handleVisitTree = (friend) => {
      setIsModalOpen(false);
      navigate(`/friend/${friend._id}/tree`, {
        state: {
          friendName: friend.name,
          userId: friend._id,
        },
      });
    };

    return (
      <>
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)} />
        <div className="friend-status-modal">
          <button className="modal-close" onClick={() => setIsModalOpen(false)}>
            ×
          </button>

          <div className="modal-section">
            <h3>Incoming Friend Requests</h3>
            {friendData.incomingRequests.length === 0 ? (
              <p>No incoming friend requests</p>
            ) : (
              <div>
                {friendData.incomingRequests.map((request) => (
                  <div key={request._id} className="friend-item">
                    <span>{request.name}</span>
                    <button
                      onClick={() => handleAcceptFriend(request._id)}
                      className="accept-button"
                    >
                      Accept
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-section">
            <h3>Pending Requests</h3>
            {friendData.pendingRequests.length === 0 ? (
              <p>No pending requests</p>
            ) : (
              <div>
                {friendData.pendingRequests.map((request) => (
                  <div key={request._id} className="friend-item">
                    <span>{request.name}</span>
                    <span className="pending-status">Pending</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-section">
            <h3>Friends</h3>
            {friendData.friends.length === 0 ? (
              <p>No friends yet</p>
            ) : (
              <div>
                {friendData.friends.map((friend) => (
                  <div key={friend._id} className="friend-item">
                    <span>{friend.name}</span>
                    <button onClick={() => handleVisitTree(friend)} className="visit-tree-button">
                      Visit Tree
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="forest-container">
        <img src={forestBackground} alt="Forest Background" className="background-image" />
        <button className="friend-status-button" onClick={() => setIsModalOpen(true)}>
          Friend Status
        </button>
        <div className="search-container">
          <div className="search-bar">
            <div className="search-input-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search for trees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button className="search-button" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="forest-content">
          <div className="tree-grid">
            {trees.length === 0 ? (
              <div className="no-trees-message">No trees found :(</div>
            ) : (
              trees.map((tree) => (
                <div key={tree.ownerId} className="tree-card">
                  <h3>{tree.ownerName}'s Tree</h3>
                  {userId !== tree.ownerId && (
                    <div className="tree-card-actions">
                      <button
                        className={`friend-button ${
                          getFriendshipStatus(tree.ownerId).isIncoming ? "accept-friend-button" : ""
                        }`}
                        onClick={() => handleFriendRequest(tree.ownerId)}
                        disabled={getFriendshipStatus(tree.ownerId).disabled}
                      >
                        {getFriendshipStatus(tree.ownerId).text}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <FriendStatusModal />
      </div>
    </>
  );
};

export default Forest;
