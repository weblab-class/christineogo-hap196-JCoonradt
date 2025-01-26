import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App.jsx";
import TreeVisualization from "../modules/TreeVisualization";
import Navbar from "../modules/Navbar";
import { get } from "../../utilities";
import "./Stats.css";

const Stats = () => {
  const { userId } = useContext(UserContext);
  const [treeData, setTreeData] = useState(null);
  const [stats, setStats] = useState({
    branches: 0,
    twigs: 0,
    leaves: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        setLoading(true);
        const response = await get(`/api/tree/${userId}`);
        if (response) {
          setTreeData(response);
          // calculate stats from the tree data
          const statsData = {
            branches: response.branches?.length || 0,
            twigs: 0,
            leaves: 0,
            total: 0,
          };

          response.branches?.forEach((branch) => {
            if (branch.twigs) {
              statsData.twigs += branch.twigs.length;
              branch.twigs.forEach((twig) => {
                if (twig.leaves) {
                  statsData.leaves += twig.leaves.length;
                }
              });
            }
          });

          statsData.total = statsData.branches + statsData.twigs + statsData.leaves;
          setStats(statsData);
        }
        setError(null);
      } catch (error) {
        console.error("Failed to fetch tree data:", error);
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTreeData();
    }
  }, [userId]);

  // allow scrolling when stats component mounts
  // this will override the default behavior of the app, which is to hide the scrollbar
  useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    // reset to hidden when component unmounts
    return () => {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    };
  }, []);

  if (!userId) {
    return <div>Please log in to view your statistics.</div>;
  }

  if (loading) {
    return <div>Loading statistics...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="stats-container">
      <Navbar />
      <div className="stats-content">
        <h1>Your Skill Statistics</h1>
        <div className="stats-cards">
          <div className="stat-card">
            <h3>Branches</h3>
            <p>{stats.branches}</p>
            <span className="stat-label">Main Skills</span>
          </div>
          <div className="stat-card">
            <h3>Twigs</h3>
            <p>{stats.twigs}</p>
            <span className="stat-label">Sub-Skills</span>
          </div>
          <div className="stat-card">
            <h3>Leaves</h3>
            <p>{stats.leaves}</p>
            <span className="stat-label">Achievements</span>
          </div>
          <div className="stat-card total">
            <h3>Total Skills</h3>
            <p>{stats.total}</p>
            <span className="stat-label">Overall Progress</span>
          </div>
        </div>
        <div className="tree-visualization">
          <TreeVisualization treeData={treeData} />
        </div>
      </div>
    </div>
  );
};

export default Stats;
