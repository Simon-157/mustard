

// // Function to create a new blog post
// async function createBlogPost(blogData) {
//   try {
//     const docRef = await db.collection('blogs').add(blogData);
//     console.log('Blog post added with ID: ', docRef.id);
//     return docRef.id;
//   } catch (error) {
//     console.error('Error adding blog post: ', error);
//     throw error;
  
// // Function to update an existing blog post
// async function updateBlogPost(blogId, updatedData) {
//   try {
//     await db.collection('blogs').doc(blogId).update(updatedData);
//     console.log('Blog post updated successfully');
//   } catch (error) {
//     console.error('Error updating blog post: ', error);
//     throw error;
//   }
// }

// // Function to delete a blog post
// async function deleteBlogPost(blogId) {
//   try {
//     await db.collection('blogs').doc(blogId).delete();
//     console.log('Blog post deleted successfully');
//   } catch (error) {
//     console.error('Error deleting blog post: ', error);
//     throw error;
//   }
// }

// // Function to query all blog posts
// async function getAllBlogPosts() {
//   try {
//     const snapshot = await db.collection('blogs').get();
//     const blogPosts = [];
//     snapshot.forEach(doc => {
//       blogPosts.push({ id: doc.id, ...doc.data() });
//     });
//     return blogPosts;
//   } catch (error) {
//     console.error('Error getting blog posts: ', error);
//     throw error;
//   }
// }

// // function to get blog details by blogId
// async function getBlogById(blogId) {
//     try {
//         const docRef = await db.collection('blogs').doc(blogId).get();
//         if (docRef.exists) {
//             return { id: docRef.id, ...docRef.data() };
//         } else {
//             return null;
//         }
//     } catch (error) {
//         console.error('Error getting blog post: ', error);
//         throw error;
//     }
// }

// // export { createBlogPost, updateBlogPost, deleteBlogPost, getAllBlogPosts, getBlogById };
