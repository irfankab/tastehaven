import { Image, Film } from "lucide-react";

interface Post {
  id: string;
  media_url: string;
  media_type: string;
  caption?: string;
}

interface PostsGridProps {
  posts: Post[];
  onPostClick?: (post: Post) => void;
}

export const PostsGrid = ({ posts, onPostClick }: PostsGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-1 md:gap-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="aspect-square relative group cursor-pointer"
          onClick={() => onPostClick?.(post)}
        >
          {post.media_type === 'image' ? (
            <img
              src={post.media_url}
              alt={post.caption || "Post"}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={post.media_url}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
            {post.media_type === 'image' ? (
              <Image className="w-6 h-6 text-white opacity-0 group-hover:opacity-100" />
            ) : (
              <Film className="w-6 h-6 text-white opacity-0 group-hover:opacity-100" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};