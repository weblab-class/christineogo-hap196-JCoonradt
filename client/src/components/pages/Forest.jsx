import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App.jsx";
import { get, post } from "../../utilities";
import "./Forest.css";
import Navbar from "../modules/Navbar";
import forestBackground from "../../assets/forestBackground.png";

const Forest = () => {
  const [trees, setTrees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { userId } = useContext(UserContext);
  const [friendRequestStatus, setFriendRequestStatus] = useState({});

  const fetchTrees = async (query = "") => {
    // debugging console statements
    console.log("Fetching trees with query:", query);
    try {
      const response = await get("/api/trees", { search: query });
      console.log("API response data:", JSON.stringify(response, null, 2));
      if (response) {
        setTrees(response);
        console.log("Updated trees state:", response);
      }
    } catch (err) {
      console.error("Failed to fetch trees:", err);
      setTrees([]);
    }
  };

  useEffect(() => {
    const initializeTrees = async () => {
      await fetchTrees();
    };
    initializeTrees();
  }, []);

  const handleSearch = async () => {
    console.log("Search triggered with query:", searchQuery);
    await fetchTrees(searchQuery);
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      console.log("Enter key pressed");
      e.preventDefault();
      await handleSearch();
    }
  };

  // ignore this for now it is not functional yet
  const handleFriendRequest = async (friendId) => {
    try {
      await post("/api/friend-request", { friendId });
      setFriendRequestStatus(prev => ({
        ...prev,
        [friendId]: 'sent'
      }));
    } catch (err) {
      console.error("Failed to send friend request:", err);
      if (err.response?.data?.error) {
        setFriendRequestStatus(prev => ({
          ...prev,
          [friendId]: err.response.data.error
        }));
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="forest-container">
        <img src={forestBackground} alt="Forest Background" className="background-image" />
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
              <button
                className="search-button"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="forest-content">
          <div className="tree-grid">
            {trees.length === 0 ? (
              <div className="no-trees-message">
                No trees found :(
              </div>
            ) : (
              trees.map((tree) => (
                <div key={tree.ownerId} className="tree-card">
                  <h3>{tree.ownerName}'s Tree</h3>
                  {userId !== tree.ownerId && (
                    <div className="tree-card-actions">
                      <button
                        className="friend-button"
                        onClick={() => handleFriendRequest(tree.ownerId)}
                        disabled={friendRequestStatus[tree.ownerId] === 'sent'}
                      >
                        {friendRequestStatus[tree.ownerId] === 'sent'
                          ? 'Request Sent'
                          : friendRequestStatus[tree.ownerId] || 'Add Friend'}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Forest;
