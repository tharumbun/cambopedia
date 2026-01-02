export const SocialCard = ({ posts }: { posts: Post[] }) => {
  const searchParams = new URLSearchParams(window.location.search);
  const slug = searchParams.get('slug');
  const post = posts.find((post) => post.id === slug);
 
  if (!post) {
    return null;
  }
 
  return (
    <div>
      <h1>{post.data.title}</h1>
    </div>
  );
};