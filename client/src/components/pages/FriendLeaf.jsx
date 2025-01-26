import { React, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../modules/Navbar";
import "./Leaf.css";
import WoodenSign from "../modules/WoodenSign";
import chevronGrey from "../../assets/chevronGrey.png";
import leafBackground from "../../assets/leafBackground.png";

const FriendLeaf = () => {
  const { leafId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const twigId = location.state?.twigId;
  const branchId = location.state?.branchId;
  const twigType = location.state?.twigType;
  const friendName = location.state?.friendName;
  const userId = location.state?.userId;

  const [leaf, setLeaf] = useState(null);
  const [leafName, setLeafName] = useState("");
  const [leafDescription, setLeafDescription] = useState("");
  const [leafLink, setLeafLink] = useState("");

  // get leaf data when component mounts
  useEffect(() => {
    const fetchLeaf = async () => {
      try {
        const response = await fetch(`/api/leaf/${leafId}`);
        if (response.ok) {
          const leafData = await response.json();
          setLeaf(leafData);
          setLeafName(leafData.name);
          setLeafDescription(leafData.description);
          setLeafLink(leafData.link || "");
        } else {
          console.error("Failed to fetch leaf data");
        }
      } catch (error) {
        console.error("Failed to fetch leaf data:", error);
      }
    };

    if (leafId) {
      fetchLeaf();
    }
  }, [leafId]);

  return (
    <div className="leaf-page">
      <Navbar />
      <img src={leafBackground} alt="Leaf Background" className="leaf-background" />
      <div
        className="back-to-twig"
        onClick={() =>
          navigate(`/friend/${userId}/tree/branch/${branchId}/twig/${twigId}`, {
            state: {
              twigType: twigType,
              branchId: branchId,
              userId: userId,
              friendName: friendName
            },
          })
        }
      >
        <img src={chevronGrey} alt="Back" className="back-chevron" />
        <span className="back-text">Back to Twig</span>
      </div>
      <div className="wooden-sign-container center-sign">
        <WoodenSign
          title={leafName}
          description={leafDescription}
          readOnly={true}
          mode="leaf"
        />
      </div>
    </div>
  );
};

export default FriendLeaf;
