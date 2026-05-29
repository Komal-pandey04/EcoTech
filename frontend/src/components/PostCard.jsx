// import React from "react";

// export default function PostCard() {

//   // ⚡ LATER THIS DATA WILL COME FROM BACKEND API
//   // Example API: GET /posts

//   const post = {
//     username: "maria",
//     tag: "SAVE WATER",
//     time: "2h ago",
//     image:
//       "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce",
//     caption:
//       "Installed a rainwater collection barrel in the backyard. Already saving 200 liters per week for the garden.",
//     likes: 42
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm p-5 mb-8">

//       {/* Header */}

//       <div className="flex justify-between items-center mb-4">

//         <div className="flex items-center gap-3">

//           <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center">
//             M
//           </div>

//           <div>

//             <p className="font-semibold text-gray-800">
//               {post.username}
//             </p>

//             <span className="text-green-600 text-sm font-medium">
//               {post.tag}
//             </span>

//           </div>

//         </div>

//         <span className="text-gray-400 text-sm">
//           {post.time}
//         </span>

//       </div>

//       {/* Image */}

//       <img
//         src={post.image}
//         className="rounded-md mb-4 w-full h-[350px] object-cover"
//       />

//       {/* Caption */}

//       <p className="text-gray-700 mb-4">
//         {post.caption}
//       </p>

//       {/* Likes */}

//       <div className="text-gray-500 flex items-center gap-2">
//         ❤️ {post.likes}
//       </div>

//     </div>
//   );
// }
import React, { useState } from "react";
import axios from "../api/axios";
import { Heart } from "lucide-react";

export default function PostCard({ post }) {

  const [likes, setLikes] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);

  // Format date
  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return d.toLocaleDateString();
  };

  const handleLike = async () => {
    try {
      setIsLiking(true);

      const response = await axios.post(`/api/posts/${post._id}/like`);

      setLikes(response.data.likes);

    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-8 hover:shadow-md transition">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">

        <div className="flex items-center gap-3">

          <div className="bg-gradient-to-br from-green-600 to-green-700 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
            {post.username.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="font-semibold text-gray-900">
              {post.username}
            </p>

            {post.tag && (
              <span className="text-green-600 text-xs font-medium uppercase">
                #{post.tag}
              </span>
            )}
          </div>
        </div>

        <span className="text-gray-400 text-sm">
          {formatDate(post.createdAt)}
        </span>
      </div>

      {/* Image */}
      <img
        src={post.imageURL}
        alt={post.caption}
        className="rounded-lg mb-4 w-full h-[400px] object-cover"
      />

      {/* Caption */}
      <p className="text-gray-700 mb-4 leading-relaxed">
        {post.caption}
      </p>

      {/* Likes Button */}
      <button
        onClick={handleLike}
        disabled={isLiking}
        className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition disabled:opacity-50"
      >
        {likes > 0 ? (
          <>
            <Heart size={18} fill="currentColor" />
            <span className="font-medium">{likes}</span>
          </>
        ) : (
          <>
            <Heart size={18} />
            <span className="font-medium">Like</span>
          </>
        )}
      </button>
    </div>
  );
}
