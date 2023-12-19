import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react"; // Import useEffect and useState
import { PostStats } from "@/components/shared";
import { useUserContext } from "@/context/AuthContext";
import { appwriteConfig, databases } from "../../lib/appwrite/config";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();
  const [postInfo, setPostInfo] = useState<Models.Document | undefined>(undefined);

  useEffect(() => {
    const fetchPostInfo = async (postId: Models.Document) => {
      if (!postId.$id) return;

      try {
        const post = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.postCollectionId,
          postId.$id
        );

        if (post) {
          setPostInfo(post); // Set the actual property you want to display
        }
      } catch (error) {
        console.log(error);
      }
    };

    // Fetch post information for each post
    posts.forEach((post) => fetchPostInfo(post));
  }, [posts]); // Trigger the effect whenever the posts array changes

  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img
              src={post.imageUrl}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={
                    post.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1">{console.log(post.owner)!}</p>
              </div>
            )}
            {showStats && <PostStats post={post} userId={user.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;
