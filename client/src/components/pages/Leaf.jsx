import { React, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../modules/Navbar";
import "./Leaf.css";
import WoodenSign from "../modules/WoodenSign";
import chevronGrey from "../../assets/chevronGrey.png";
import leafBackground from "../../assets/leafBackground.png";

const Leaf = () => {
  const { leafId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const twigId = location.state?.twigId;
  const branchId = location.state?.branchId;
  const twigType = location.state?.twigType;

  const [leaf, setLeaf] = useState(null);
  const [leafName, setLeafName] = useState("");
  const [leafDescription, setLeafDescription] = useState("");
  const [leafLink, setLeafLink] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

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

  // submit leaf changes
  const handleSubmit = async (title, description) => {
    try {
      const response = await fetch(`/api/leaf/${leafId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: title,
          description: description,
          link: leafLink,
        }),
      });

      if (response.ok) {
        const updatedLeaf = await response.json();
        setLeaf(updatedLeaf);
        setLeafName(updatedLeaf.name);
        setLeafDescription(updatedLeaf.description);
        setLeafLink(updatedLeaf.link || "");
        setIsEditMode(false);
      }
    } catch (error) {
      console.error("Failed to update leaf:", error);
    }
  };

  // delete a leaf
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/leaf/${leafId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        navigate(`/tree/${location.state?.userId}/branch/${branchId}/twig/${twigId}`, {
          state: {
            twigType: twigType,
            branchId: branchId,
            userId: location.state?.userId,
          },
        });
      }
    } catch (error) {
      console.error("Failed to delete leaf:", error);
    }
  };

  return (
    <div className="leaf-page">
      <Navbar />
      <img src={leafBackground} alt="Leaf Background" className="leaf-background" />
      <div
        className="back-to-twig"
        onClick={() =>
          navigate(`/tree/${location.state?.userId}/branch/${branchId}/twig/${twigId}`, {
            state: {
              twigType: twigType,
              branchId: branchId,
              userId: location.state?.userId,
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
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onCancel={() => setIsEditMode(false)}
          readOnly={false}
          initialEditMode={isEditMode}
          mode="leaf"
        />
      </div>
    </div>
  );
};

export default Leaf;
